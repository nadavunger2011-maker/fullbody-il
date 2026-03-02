import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Verify auth
    const authHeader = req.headers.get("authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { authorization: authHeader || "" } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { dateRange } = await req.json();

    // Fetch data using service role for full access
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(supabaseUrl, serviceKey);

    let since: string | null = null;
    if (dateRange && dateRange !== "all") {
      const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
      const d = new Date();
      d.setDate(d.getDate() - days);
      since = d.toISOString();
    }

    let eventsQuery = adminClient.from("analytics_events").select("event_type, product_handle, product_title, price, quantity, order_total, order_id, session_id, utm_source, referrer, created_at, duration_seconds");
    if (since) eventsQuery = eventsQuery.gte("created_at", since);
    const { data: events } = await eventsQuery.limit(10000);

    let spendQuery = adminClient.from("ad_spend").select("*");
    if (since) spendQuery = spendQuery.gte("date", since.split("T")[0]);
    const { data: adSpend } = await spendQuery;

    // Build summary for AI
    const pageViews = (events || []).filter((e: any) => e.event_type === "page_view").length;
    const productViews = (events || []).filter((e: any) => e.event_type === "view_item");
    const addToCarts = (events || []).filter((e: any) => e.event_type === "add_to_cart");
    const purchases = (events || []).filter((e: any) => e.event_type === "purchase");
    const uniqueOrders = new Set(purchases.map((p: any) => p.order_id).filter(Boolean));
    const totalRevenue = [...uniqueOrders].reduce((sum, orderId) => {
      const orderEvent = purchases.find((p: any) => p.order_id === orderId);
      return sum + (orderEvent?.order_total || 0);
    }, 0);
    const totalSpend = (adSpend || []).reduce((sum: number, s: any) => sum + s.spend, 0);
    const sessions = new Set((events || []).map((e: any) => e.session_id).filter(Boolean)).size;

    // Product stats with avg time
    const productMap = new Map<string, { title: string; views: number; carts: number; purchases: number; revenue: number; totalDuration: number; durationCount: number }>();
    (events || []).forEach((e: any) => {
      if (!e.product_handle) return;
      if (!productMap.has(e.product_handle)) {
        productMap.set(e.product_handle, { title: e.product_title || e.product_handle, views: 0, carts: 0, purchases: 0, revenue: 0, totalDuration: 0, durationCount: 0 });
      }
      const p = productMap.get(e.product_handle)!;
      if (e.event_type === "view_item") {
        p.views++;
        if (e.duration_seconds && e.duration_seconds > 0) {
          p.totalDuration += e.duration_seconds;
          p.durationCount++;
        }
      }
      if (e.event_type === "add_to_cart") p.carts++;
      if (e.event_type === "purchase") { p.purchases++; p.revenue += (e.price || 0) * (e.quantity || 1); }
    });

    const productSummary = [...productMap.entries()].map(([handle, p]) => ({
      handle,
      title: p.title,
      views: p.views,
      carts: p.carts,
      purchases: p.purchases,
      revenue: p.revenue,
      cartRate: p.views > 0 ? ((p.carts / p.views) * 100).toFixed(1) + "%" : "0%",
      avgTimeSeconds: p.durationCount > 0 ? Math.round(p.totalDuration / p.durationCount) : null,
    }));

    // Traffic sources
    const sourceSessions = new Map<string, number>();
    const sessionSources = new Map<string, string>();
    (events || []).forEach((e: any) => {
      if (!e.session_id || sessionSources.has(e.session_id)) return;
      let source = "direct";
      if (e.utm_source) source = e.utm_source;
      else if (e.referrer) {
        try { source = new URL(e.referrer).hostname; } catch { source = e.referrer; }
      }
      sessionSources.set(e.session_id, source);
    });
    sessionSources.forEach((source) => {
      sourceSessions.set(source, (sourceSessions.get(source) || 0) + 1);
    });

    const dataSummary = `
אתר אי-קומרס לתוספי תזונה בישראל. הנה הנתונים לתקופה ${dateRange || "all"}:

סה"כ סשנים: ${sessions}
צפיות בדפים: ${pageViews}
צפיות במוצרים: ${productViews.length}
הוספות לסל: ${addToCarts.length}
רכישות (הזמנות ייחודיות): ${uniqueOrders.size}
הכנסות: ₪${totalRevenue.toLocaleString()}
הוצאות פרסום: ₪${totalSpend.toLocaleString()}
עלות פר לקוח (CAC): ${uniqueOrders.size > 0 ? `₪${(totalSpend / uniqueOrders.size).toFixed(0)}` : "אין מספיק נתונים"}
שיעור המרה: ${sessions > 0 ? ((uniqueOrders.size / sessions) * 100).toFixed(1) : 0}%
שיעור הוספה לסל: ${productViews.length > 0 ? ((addToCarts.length / productViews.length) * 100).toFixed(1) : 0}%

נתוני מוצרים:
${productSummary.map(p => `- ${p.title}: ${p.views} צפיות, ${p.carts} הוספות לסל (${p.cartRate}), ${p.purchases} רכישות, הכנסה ₪${p.revenue}${p.avgTimeSeconds !== null ? `, זמן ממוצע בדף: ${p.avgTimeSeconds} שניות` : ""}`).join("\n") || "אין נתוני מוצרים עדיין"}

מקורות תנועה:
${[...sourceSessions.entries()].sort((a, b) => b[1] - a[1]).map(([source, count]) => `- ${source}: ${count} סשנים`).join("\n") || "אין נתונים"}

הוצאות פרסום:
${(adSpend || []).map((s: any) => `- ${s.date} | ${s.source}: ₪${s.spend} (${s.impressions} חשיפות, ${s.clicks} קליקים)`).join("\n") || "אין נתונים"}
`.trim();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `אתה אנליסט שיווק דיגיטלי מומחה לאי-קומרס. תנתח את הנתונים של האתר ותתן תובנות והמלצות פעולה ברורות בעברית.

כללים:
1. תן 3-5 תובנות מפתח מבוססות על הנתונים
2. תן 3-5 המלצות פעולה קונקרטיות עם עדיפויות (גבוהה/בינונית/נמוכה)
3. זהה מוצרים חזקים וחלשים
4. נתח את יעילות הפרסום ותן המלצות לאופטימיזציה
5. אם יש נתוני זמן בדף - נתח מה זה אומר על המוצרים
6. השתמש באימוג'ים לויזואליזציה
7. היה ישיר וקצר - בעל עניין, לא אקדמי
8. אם אין מספיק נתונים, ציין זאת והמלץ מה צריך לאסוף`,
          },
          {
            role: "user",
            content: dataSummary,
          },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: "AI rate limit exceeded, try again later" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await aiResponse.text();
      console.error("AI error:", aiResponse.status, errText);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await aiResponse.json();
    const analysis = aiData.choices?.[0]?.message?.content || "לא הצלחתי לנתח את הנתונים";

    return new Response(JSON.stringify({ analysis, productSummary }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
