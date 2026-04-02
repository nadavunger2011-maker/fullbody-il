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

const CATEGORY_IMAGES: Record<string, string[]> = {
  fitness: [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop",
  ],
  nutrition: [
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=450&fit=crop",
  ],
  weight: [
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop",
  ],
  recipes: [
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=450&fit=crop",
  ],
  wellness: [
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop",
  ],
};

function getCategoryImage(categoryId: string): string {
  const images = CATEGORY_IMAGES[categoryId] || CATEGORY_IMAGES.fitness;
  return images[Math.floor(Math.random() * images.length)];
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

      const prompt = `אתה אסטרטג תוכן מומחה ומומחה SEO עבור "Full Body" (fullbody.co.il), מותג תזונה ואורח חיים פרימיום.
כתוב מאמר מקיף ומקורי בנושא "${category.name}" שיהיה אופטימלי ל-SEO בעברית.

## הקשר וסמכות (E-E-A-T):
- כל התוכן מבוסס על ייעוצים מקצועיים עם שי, מומחה תזונה וחלבון ובעלים של בית קפה בריאותי ברעננה.
- המטרה: למצב את Full Body כסמכות מקצועית, לא רק חנות.

## כללי כתיבה (כלל "אנטי-AI"):
- טון: מקצועי, נגיש (בגובה העיניים), מבוסס ראיות.
- ביטויים אסורים: לעולם אל תשתמש ב"בעולם המודרני של היום", "חשוב לציין", "לסיכום". השתמש בעברית טבעית וזורמת.

## מבנה המאמר:
1. **פתיחה**: הוק שמושך את הקורא ומבסס למה הנושא חשוב עכשיו.
2. **"התובנה של שי"**: סקשן או טיפ ספציפי המיוחס לניסיון המעשי של המומחה. לדוגמא: "מהשיחות המקצועיות שלנו עם שי (מומחה תזונה מרעננה), אנחנו רואים ש..."
3. **צלילה עמוקה**: התוכן המרכזי (ה-"איך עושים").
4. **כלי מעשי**: טבלה (למשל השוואת מקורות חלבון) או צ'קליסט מעשי - חובה לפחות אחד בכל מאמר!
5. **CTA רך**: חיבור הנושא למוצרי Full Body. לדוגמא: "כדי להגיע ליעדי החלבון שלכם כפי שדיברנו עם שי, בדקו את..."
6. **קרדיט מחבר**: בסוף המאמר הוסף: "<p class='author-credit'><strong>המדריך נכתב בליווי מקצועי של שי, מומחה תזונה ויזם בריאות.</strong></p>"

## דרישות טכניות:
- כותרת H1 מושכת ואופטימלית ל-SEO (עד 60 תווים)
- כותרות H2/H3 ברורות כל 200-300 מילים
- פסקאות קצרות ותכליתיות (מקסימום 3-4 שורות)
- חובה לכלול לפחות טבלת HTML אחת (<table>) או רשימה ממוספרת/נקודות
- תוכן HTML מלא - לפחות 1500 מילים
- תקציר של 2-3 משפטים (עד 160 תווים)
- meta description אופטימלי ל-SEO (עד 160 תווים)
- זמן קריאה מוערך (מספר בלבד)

## אינפוגרפיקות (חובה!):
- כלול לפחות 1-2 אינפוגרפיקות HTML מעוצבות בתוך התוכן
- השתמש ב-<figure class="infographic" role="img" aria-label="תיאור האינפוגרפיקה"> עם <figcaption> מתאים
- סוגי אינפוגרפיקות אפשריים:
  a) טבלת השוואה מעוצבת (<table class="info-table">) עם צבעים וסימנים (✅/❌/⭐)
  b) תרשים שלבים (<div class="info-steps">) עם מספרים ואייקונים בעברית
  c) כרטיסי סטטיסטיקה (<div class="info-stats">) עם מספרים גדולים ותיאורים
  d) רשימת יתרונות/חסרונות (<div class="info-pros-cons">) עם ✅ ו-❌
- לכל אינפוגרפיקה חובה aria-label מתאר בעברית (למשל: "השוואת מקורות חלבון לפי ערך תזונתי")
- הוסף alt text מפורט ב-figcaption שמתאר את התוכן הוויזואלי

## דרישות SEO:
- קישור פנימי: שלב קישורים יחסיים למאמרים אחרים ב-fullbody.co.il (כמו <a href="/blog">המדריכים שלנו</a>)
- סמכות חיצונית: ציין ש"מבוסס על מחקרים קליניים" או "מומלץ על ידי תזונאים"
- מגע אנושי ומקומי: שלב ביטויים כמו "מניסיון שלנו בשטח..." או "מהשיחות המקצועיות שלנו עם שי..."

## שאלות נפוצות:
- 3-4 שאלות ותשובות רלוונטיות

חשוב: אל תזכיר שאתה AI. השתמש בנתונים ומידע אמיתי ומבוסס.

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
            { role: "system", content: "אתה אסטרטג תוכן מומחה ומומחה SEO עבור Full Body. כתוב בעברית טבעית, מקצועית ובגובה העיניים. לעולם אל תשמע כמו AI. תמיד תחזיר JSON תקין בלבד." },
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
