import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const CATEGORIES = [
  { id: "fitness", name: "כושר ואימונים" },
  { id: "nutrition", name: "תזונה בריאה" },
  { id: "weight", name: "ניהול משקל" },
  { id: "recipes", name: "מתכונים בריאים" },
  { id: "wellness", name: "בריאות ואורח חיים" },
];

const PRODUCT_HANDLES = [
  "formula-1-vanilla", "formula-1-chocolate", "formula-1-kosher",
  "niteworks", "aloe-natural", "aloe-mango", "pdm-protein", "h24-rebuild-strength",
];

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function generateSlug(title: string): string {
  return title
    .replace(/[^\u0590-\u05FFa-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 80) + "-" + Date.now().toString(36);
}

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

    // Parse how many articles to generate (default 10)
    let count = 10;
    try {
      const body = await req.json();
      if (body?.count) count = Math.min(body.count, 10);
    } catch { /* default */ }

    const results = [];

    for (let i = 0; i < count; i++) {
      const category = CATEGORIES[i % CATEGORIES.length];
      const relatedProducts = pickRandom(PRODUCT_HANDLES, 2 + Math.floor(Math.random() * 3));

      const prompt = `אתה כותב תוכן מקצועי בעברית עבור אתר FullBody Pro שמוכר מוצרי Herbalife.
כתוב מאמר מקיף ומקורי בנושא "${category.name}" שיהיה אופטימלי ל-SEO בעברית.

דרישות:
1. כותרת מושכת ומקורית (לא יותר מ-60 תווים)
2. תקציר של 2-3 משפטים (עד 160 תווים)
3. תוכן HTML מלא עם h2, h3, פסקאות, רשימות - לפחות 1500 מילים
4. 4-5 שאלות ותשובות (FAQ) רלוונטיות
5. meta description אופטימלי ל-SEO (עד 160 תווים)
6. זמן קריאה מוערך (מספר בלבד)

חשוב: אל תזכיר שאתה AI. כתוב כמומחה תזונה/כושר אמיתי. השתמש בנתונים ומידע אמיתי.
שלב המלצות טבעיות למוצרי Herbalife במקומות הגיוניים בתוכן.

החזר JSON בלבד בפורמט הבא (בלי markdown, בלי backticks):
{
  "title": "...",
  "excerpt": "...",
  "content": "<h2>...</h2><p>...</p>...",
  "readTime": 5,
  "faq": [{"question": "...", "answer": "..."}],
  "metaDescription": "..."
}`;

      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "אתה כותב תוכן SEO מקצועי בעברית. תמיד תחזיר JSON תקין בלבד." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error(`AI error for article ${i + 1}:`, aiResponse.status, errText);
        if (aiResponse.status === 429) {
          // Rate limited - wait and retry
          await new Promise(r => setTimeout(r, 10000));
          i--; // retry
          continue;
        }
        continue;
      }

      const aiData = await aiResponse.json();
      let rawContent = aiData.choices?.[0]?.message?.content || "";
      
      // Strip markdown code fences if present
      rawContent = rawContent.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

      let article;
      try {
        article = JSON.parse(rawContent);
      } catch (e) {
        console.error(`Failed to parse article ${i + 1}:`, e, rawContent.slice(0, 200));
        continue;
      }

      const slug = generateSlug(article.title);

      const { error } = await supabase.from("blog_posts").insert({
        slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        image: getCategoryImage(category.id),
        category: category.name,
        category_id: category.id,
        read_time: article.readTime || 5,
        related_product_handles: relatedProducts,
        faq: article.faq || [],
        meta_description: article.metaDescription || article.excerpt,
        published: true,
      });

      if (error) {
        console.error(`DB error for article ${i + 1}:`, error);
        continue;
      }

      results.push({ slug, title: article.title, category: category.name });
      
      // Small delay between AI calls to avoid rate limiting
      if (i < count - 1) await new Promise(r => setTimeout(r, 3000));
    }

    return new Response(JSON.stringify({ success: true, generated: results.length, articles: results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-blog-posts error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
