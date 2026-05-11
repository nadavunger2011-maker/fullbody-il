import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function buildDataContext(adminClient: any, dateRange: string) {
  let since: string | null = null;
  if (dateRange && dateRange !== "all") {
    const days = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
    const d = new Date();
    d.setDate(d.getDate() - days);
    since = d.toISOString();
  }

  let eventsQuery = adminClient.from("analytics_events").select("event_type, product_handle, product_title, price, quantity, order_total, order_id, session_id, utm_source, referrer, created_at, duration_seconds, page_path, exit_destination");
  if (since) eventsQuery = eventsQuery.gte("created_at", since);
  const { data: events } = await eventsQuery.limit(15000);

  let spendQuery = adminClient.from("ad_spend").select("*");
  if (since) spendQuery = spendQuery.gte("date", since.split("T")[0]);
  const { data: adSpend } = await spendQuery;

  const ev = events || [];
  const pageViews = ev.filter((e: any) => e.event_type === "page_view").length;
  const productViews = ev.filter((e: any) => e.event_type === "view_item");
  const addToCarts = ev.filter((e: any) => e.event_type === "add_to_cart");
  const purchases = ev.filter((e: any) => e.event_type === "purchase");
  const uniqueOrders = new Set(purchases.map((p: any) => p.order_id).filter(Boolean));
  const totalRevenue = [...uniqueOrders].reduce((sum, oid) => {
    const o = purchases.find((p: any) => p.order_id === oid);
    return sum + (o?.order_total || 0);
  }, 0);
  const totalSpend = (adSpend || []).reduce((s: number, x: any) => s + Number(x.spend || 0), 0);
  const sessions = new Set(ev.map((e: any) => e.session_id).filter(Boolean)).size;

  const productMap = new Map<string, any>();
  ev.forEach((e: any) => {
    if (!e.product_handle) return;
    if (!productMap.has(e.product_handle)) {
      productMap.set(e.product_handle, { title: e.product_title || e.product_handle, views: 0, carts: 0, purchases: 0, revenue: 0, totalDuration: 0, durationCount: 0 });
    }
    const p = productMap.get(e.product_handle)!;
    if (e.event_type === "view_item") {
      p.views++;
      if (e.duration_seconds > 0) { p.totalDuration += e.duration_seconds; p.durationCount++; }
    }
    if (e.event_type === "add_to_cart") p.carts++;
    if (e.event_type === "purchase") { p.purchases++; p.revenue += (e.price || 0) * (e.quantity || 1); }
  });
  const productSummary = [...productMap.entries()].map(([h, p]) => ({
    handle: h, title: p.title, views: p.views, carts: p.carts, purchases: p.purchases,
    revenue: p.revenue,
    cartRate: p.views ? ((p.carts / p.views) * 100).toFixed(1) + "%" : "0%",
    avgTimeSec: p.durationCount ? Math.round(p.totalDuration / p.durationCount) : null,
  })).sort((a, b) => b.views - a.views);

  // Traffic sources
  const sessionSources = new Map<string, string>();
  ev.forEach((e: any) => {
    if (!e.session_id || sessionSources.has(e.session_id)) return;
    let source = "direct";
    if (e.utm_source) source = e.utm_source;
    else if (e.referrer) { try { source = new URL(e.referrer).hostname; } catch { source = e.referrer; } }
    sessionSources.set(e.session_id, source);
  });
  const sourceCount = new Map<string, number>();
  sessionSources.forEach(s => sourceCount.set(s, (sourceCount.get(s) || 0) + 1));

  // Top exit destinations
  const exitMap = new Map<string, number>();
  ev.forEach((e: any) => { if (e.exit_destination) exitMap.set(e.exit_destination, (exitMap.get(e.exit_destination) || 0) + 1); });

  return `נתוני אתר אי-קומרס לתוספי תזונה (Herbalife) — תקופה: ${dateRange || "all"}

מדדים כלליים:
- סשנים: ${sessions}
- צפיות בדפים: ${pageViews}
- צפיות במוצרים: ${productViews.length}
- הוספות לסל: ${addToCarts.length}
- רכישות: ${uniqueOrders.size}
- הכנסות: ₪${totalRevenue.toLocaleString()}
- הוצאות פרסום: ₪${totalSpend.toLocaleString()}
- ROAS: ${totalSpend > 0 ? (totalRevenue / totalSpend).toFixed(2) + "x" : "אין"}
- CAC: ${uniqueOrders.size > 0 ? "₪" + (totalSpend / uniqueOrders.size).toFixed(0) : "אין"}
- CR: ${sessions > 0 ? ((uniqueOrders.size / sessions) * 100).toFixed(2) + "%" : "0%"}
- שיעור הוספה לסל: ${productViews.length ? ((addToCarts.length / productViews.length) * 100).toFixed(1) + "%" : "0%"}

מוצרים (top 20):
${productSummary.slice(0, 20).map(p => `- ${p.title}: ${p.views} צפיות, ${p.carts} סל (${p.cartRate}), ${p.purchases} רכישות, ₪${p.revenue}${p.avgTimeSec !== null ? `, זמן ממוצע ${p.avgTimeSec}ש'` : ""}`).join("\n") || "אין נתונים"}

מקורות תנועה:
${[...sourceCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([s, c]) => `- ${s}: ${c}`).join("\n") || "אין"}

יציאות נפוצות:
${[...exitMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([s, c]) => `- ${s}: ${c}`).join("\n") || "אין"}

הוצאות פרסום (מצרפי לפי מקור):
${(() => {
  const m = new Map<string, number>();
  (adSpend || []).forEach((s: any) => m.set(s.source, (m.get(s.source) || 0) + Number(s.spend || 0)));
  return [...m.entries()].map(([s, v]) => `- ${s}: ₪${v.toLocaleString()}`).join("\n") || "אין נתונים";
})()}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabase = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: authError } = await supabase.auth.getClaims(token);
    if (authError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { messages, dateRange } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const adminClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const dataContext = await buildDataContext(adminClient, dateRange || "30d");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const systemPrompt = `אתה יועץ שיווק דיגיטלי ומומחה אי-קומרס בכיר, שעובד עם בעל אתר תוספי תזונה (Herbalife) בישראל.

הסגנון שלך:
- ישיר, חם, מעשי. דבר כמו יועץ אישי - לא כמו דוח.
- ענה בעברית, השתמש באימוג'ים בצורה מדודה.
- כשנותן המלצות - תן צעדים קונקרטיים שאפשר ליישם היום.
- תמיד תקשר את ההמלצות שלך לנתונים האמיתיים שלמטה.
- אם חסר מידע - שאל שאלה ממוקדת לפני שאתה ממליץ.
- אל תמציא נתונים. אם משהו לא בנתונים - אמור.

הנתונים העדכניים של האתר (התייחס אליהם כמקור האמת):
${dataContext}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) return new Response(JSON.stringify({ error: "AI rate limit, נסה שוב בעוד רגע" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (aiResp.status === 402) return new Response(JSON.stringify({ error: "נגמרו הקרדיטים של ה-AI" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await aiResp.text();
      console.error("AI err", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await aiResp.json();
    const reply = data.choices?.[0]?.message?.content || "לא הצלחתי להגיב";
    return new Response(JSON.stringify({ reply }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
