import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all posts missing social captions
    const { data: posts, error: fetchError } = await supabase
      .from("blog_posts")
      .select("id, title, excerpt, content, category")
      .eq("published", true)
      .is("ig_caption", null)
      .order("created_at", { ascending: true });

    if (fetchError) throw fetchError;
    if (!posts || posts.length === 0) {
      return new Response(JSON.stringify({ success: true, updated: 0, message: "All posts already have captions" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results: { id: string; title: string; status: string }[] = [];

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      // Strip HTML for a cleaner summary
      const plainContent = post.content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 2000);

      const prompt = `אתה מומחה שיווק ברשתות חברתיות עבור "Full Body" (fullbody.co.il), מותג תזונה ואורח חיים פרימיום.

קיבלת מאמר בלוג. צור 3 כיתובים שונים לשיתוף ברשתות חברתיות:

## המאמר:
כותרת: ${post.title}
קטגוריה: ${post.category}
תקציר: ${post.excerpt}
תוכן (קיצור): ${plainContent}

## הנחיות לכל פלטפורמה:

1. **ig_caption** (אינסטגרם):
   - עד 300 תווים
   - טון אישי, קליל, מזמין
   - 5-8 האשטגים רלוונטיים בעברית (#תזונהבריאה #חלבון #אורחחייםבריא וכו')
   - אימוג'ים מתאימים
   - CTA קצר (למשל: "לינק בביו 👆")

2. **fb_caption** (פייסבוק):
   - עד 500 תווים
   - שואל שאלה מעוררת עניין
   - טון חם וקהילתי, מזמין לדיון
   - מסתיים עם הזמנה לקרוא את המאמר המלא
   - אימוג'ים במידה

3. **li_caption** (לינקדאין):
   - עד 400 תווים
   - טון מקצועי ומבוסס נתונים
   - תובנה עסקית או בריאותית
   - ללא אימוג'ים מוגזמים (1-2 מקסימום)
   - מסתיים עם שאלה מקצועית

החזר JSON בלבד (בלי markdown, בלי backticks):
{"ig_caption": "...", "fb_caption": "...", "li_caption": "..."}`;

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "אתה מומחה שיווק ברשתות חברתיות. תמיד תחזיר JSON תקין בלבד." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error(`AI error for post ${post.id}:`, aiResponse.status, errText);
        if (aiResponse.status === 429) {
          await new Promise(r => setTimeout(r, 15000));
          i--;
          continue;
        }
        results.push({ id: post.id, title: post.title, status: "ai_error" });
        continue;
      }

      const aiData = await aiResponse.json();
      let rawContent = aiData.choices?.[0]?.message?.content || "";
      rawContent = rawContent.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

      let captions;
      try {
        captions = JSON.parse(rawContent);
      } catch (e) {
        console.error(`Failed to parse captions for ${post.id}:`, e);
        results.push({ id: post.id, title: post.title, status: "parse_error" });
        continue;
      }

      const { error: updateError } = await supabase
        .from("blog_posts")
        .update({
          ig_caption: captions.ig_caption || null,
          fb_caption: captions.fb_caption || null,
          li_caption: captions.li_caption || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      if (updateError) {
        console.error(`DB update error for ${post.id}:`, updateError);
        results.push({ id: post.id, title: post.title, status: "db_error" });
        continue;
      }

      results.push({ id: post.id, title: post.title, status: "success" });

      // Delay between calls
      if (i < posts.length - 1) await new Promise(r => setTimeout(r, 3000));
    }

    const successCount = results.filter(r => r.status === "success").length;
    return new Response(JSON.stringify({ success: true, total: posts.length, updated: successCount, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-social-captions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
