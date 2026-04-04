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

// Extended image pool – each category has 6+ unique images to avoid repeats
const CATEGORY_IMAGES: Record<string, string[]> = {
  fitness: [
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&h=450&fit=crop",
  ],
  nutrition: [
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=450&fit=crop",
  ],
  weight: [
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&h=450&fit=crop",
  ],
  recipes: [
    "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&h=450&fit=crop",
  ],
  wellness: [
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=800&h=450&fit=crop",
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop",
  ],
};

// Track used images within a generation batch to avoid repeats
const usedImages = new Set<string>();

function getCategoryImage(categoryId: string, existingImages: string[]): string {
  const images = CATEGORY_IMAGES[categoryId] || CATEGORY_IMAGES.fitness;
  const allUsed = new Set([...usedImages, ...existingImages]);
  const available = images.filter(img => !allUsed.has(img));
  const pick = available.length > 0
    ? available[Math.floor(Math.random() * available.length)]
    : images[Math.floor(Math.random() * images.length)];
  usedImages.add(pick);
  return pick;
}

function generateSlug(title: string): string {
  return title
    .replace(/[^\u0590-\u05FFa-zA-Z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLowerCase()
    .slice(0, 80) + "-" + Date.now().toString(36);
}

// Short FAQ-style questions people commonly search for
const FAQ_TOPICS: Record<string, string[]> = {
  fitness: [
    "כמה פעמים בשבוע צריך להתאמן?",
    "מה עדיף - אימון כוח או אירובי?",
    "איך להתחיל להתאמן אחרי הפסקה ארוכה?",
    "מה לאכול לפני ואחרי אימון?",
    "האם אפשר לבנות שריר בלי חדר כושר?",
    "כמה זמן לוקח לראות תוצאות מאימונים?",
  ],
  nutrition: [
    "כמה חלבון צריך לאכול ביום?",
    "מה ההבדל בין חלבון מי גבינה לחלבון צמחי?",
    "האם תוספי תזונה באמת עובדים?",
    "מה הם המאכלים הכי בריאים לארוחת בוקר?",
    "איך לקרוא תוויות מזון נכון?",
    "האם גלוטן באמת מזיק?",
  ],
  weight: [
    "איך לרדת במשקל בלי דיאטה קיצונית?",
    "למה אני לא יורד במשקל למרות שאני מתאמן?",
    "מה זה גירעון קלורי ואיך מחשבים אותו?",
    "האם צום לסירוגין עוזר לירידה במשקל?",
    "איך לשמור על המשקל אחרי דיאטה?",
    "מה ההבדל בין ירידה בשומן לירידה במשקל?",
  ],
  recipes: [
    "איך להכין שייק חלבון טעים בבית?",
    "מה לשים בשייק בוקר בריא?",
    "מתכונים בריאים שילדים אוהבים?",
    "איך להכין חטיפי חלבון ביתיים?",
    "ארוחות מהירות ובריאות ל-10 דקות?",
    "תחליפים בריאים לממתקים?",
  ],
  wellness: [
    "איך שינה משפיעה על הבריאות?",
    "מה היתרונות של אלוורה?",
    "איך להוריד רמות סטרס בצורה טבעית?",
    "כמה מים צריך לשתות ביום?",
    "מה הקשר בין מעיים לבריאות כללית?",
    "איך לשפר אנרגיה לאורך היום?",
  ],
};

function buildFullArticlePrompt(categoryName: string, existingTitles: string[]): string {
  return `אתה אסטרטג תוכן מומחה ומומחה SEO עבור "Full Body" (fullbody.co.il), מותג תזונה ואורח חיים פרימיום.
כתוב מאמר מקיף ומקורי בנושא "${categoryName}" שיהיה אופטימלי ל-SEO בעברית.

## חשוב! מניעת כפילויות:
הכותרות הבאות כבר קיימות באתר – חובה לכתוב על נושא שונה לחלוטין!
${existingTitles.map(t => `- "${t}"`).join("\n")}

## הקשר וסמכות (E-E-A-T):
- כל התוכן מבוסס על ייעוצים מקצועיים עם שי, מומחה תזונה וחלבון ובעלים של בית קפה בריאותי ברעננה.
- המטרה: למצב את Full Body כסמכות מקצועית, לא רק חנות.

## כללי כתיבה (כלל "אנטי-AI"):
- טון: מקצועי, נגיש (בגובה העיניים), מבוסס ראיות.
- ביטויים אסורים: לעולם אל תשתמש ב"בעולם המודרני של היום", "חשוב לציין", "לסיכום". השתמש בעברית טבעית וזורמת.

## מבנה המאמר:
1. **פתיחה**: הוק שמושך את הקורא ומבסס למה הנושא חשוב עכשיו.
2. **"התובנה של שי"**: סקשן או טיפ ספציפי המיוחס לניסיון המעשי של המומחה.
3. **צלילה עמוקה**: התוכן המרכזי (ה-"איך עושים").
4. **כלי מעשי**: טבלה או צ'קליסט מעשי - חובה לפחות אחד בכל מאמר!
5. **CTA רך**: חיבור הנושא למוצרי Full Body.
6. **קרדיט מחבר**: "המדריך נכתב בליווי מקצועי של שי, מומחה תזונה ויזמות בריאות."

## אינפוגרפיקות (חובה!):
- כלול לפחות 1-2 אינפוגרפיקות HTML מעוצבות **באמצע המאמר** (לא בסוף!)
- השתמש ב-<figure class="infographic" role="img" aria-label="תיאור"> עם <figcaption>
- כל תמונה/figure חייבים alt טקסט תיאורי

## כיתובים לרשתות חברתיות (חובה!):
- **ig_caption**: אינסטגרם - עד 300 תווים, טון אישי וקליל, 5-8 האשטגים בעברית, אימוג'ים, CTA קצר
- **fb_caption**: פייסבוק - עד 500 תווים, שואל שאלה, טון חם וקהילתי, מזמין לדיון
- **li_caption**: לינקדאין - עד 400 תווים, טון מקצועי, תובנה מבוססת נתונים

## דרישות טכניות:
- כותרת H1 מושכת, ייחודית ואופטימלית ל-SEO (עד 60 תווים)
- כותרות H2/H3 ברורות כל 200-300 מילים
- פסקאות קצרות ותכליתיות
- חובה לכלול לפחות טבלת HTML אחת
- תוכן HTML מלא - לפחות 1500 מילים
- תקציר של 2-3 משפטים (עד 160 תווים)
- meta description אופטימלי ל-SEO (עד 160 תווים)

חשוב: אל תזכיר שאתה AI. השתמש בנתונים ומידע אמיתי ומבוסס.

החזר JSON בלבד בפורמט הבא (בלי markdown, בלי backticks):
{
  "title": "...",
  "excerpt": "...",
  "content": "<h2>...</h2><p>...</p>...",
  "readTime": 5,
  "faq": [{"question": "...", "answer": "..."}],
  "metaDescription": "...",
  "ig_caption": "...",
  "fb_caption": "...",
  "li_caption": "..."
}`;
}

function buildFaqPostPrompt(question: string, categoryName: string): string {
  return `אתה אסטרטג תוכן מומחה עבור "Full Body" (fullbody.co.il).
כתוב מאמר קצר וממוקד שעונה על השאלה: "${question}"
הקטגוריה: ${categoryName}

## כללים:
- מאמר קצר, ממוקד, 400-700 מילים
- תשובה ישירה ומעשית
- טון: מקצועי, נגיש, עברית טבעית
- ביטויים אסורים: "בעולם המודרני של היום", "חשוב לציין", "לסיכום"
- כלול "התובנה של שי" - טיפ מעשי מנסיון המומחה
- כלול אינפוגרפיקה HTML אחת באמצע המאמר עם <figure class="infographic" role="img" aria-label="תיאור">
- CTA רך למוצרי Full Body
- קרדיט: "המדריך נכתב בליווי מקצועי של שי, מומחה תזונה ויזמות בריאות."

## כיתובים לרשתות חברתיות:
- ig_caption: אינסטגרם - עד 300 תווים, 5-8 האשטגים, אימוג'ים
- fb_caption: פייסבוק - עד 500 תווים, שואל שאלה, טון חם
- li_caption: לינקדאין - עד 400 תווים, טון מקצועי

החזר JSON בלבד (בלי markdown, בלי backticks):
{
  "title": "...",
  "excerpt": "...",
  "content": "<h2>...</h2><p>...</p>...",
  "readTime": 3,
  "faq": [{"question": "...", "answer": "..."}],
  "metaDescription": "...",
  "ig_caption": "...",
  "fb_caption": "...",
  "li_caption": "..."
}`;
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

    let count = 10;
    let mode: "full" | "faq" = "full";
    try {
      const body = await req.json();
      if (body?.count) count = Math.min(body.count, 10);
      if (body?.mode === "faq") mode = "faq";
    } catch { /* default */ }

    // Fetch existing posts to avoid duplicates
    const { data: existingPosts } = await supabase
      .from("blog_posts")
      .select("title, image")
      .eq("published", true);

    const existingTitles = (existingPosts || []).map(p => p.title);
    const existingImages = (existingPosts || []).map(p => p.image).filter(Boolean) as string[];

    const results = [];

    for (let i = 0; i < count; i++) {
      const category = CATEGORIES[i % CATEGORIES.length];
      const relatedProducts = pickRandom(PRODUCT_HANDLES, 2 + Math.floor(Math.random() * 3));

      let prompt: string;
      if (mode === "faq") {
        const questions = FAQ_TOPICS[category.id] || FAQ_TOPICS.fitness;
        // Pick a question not already used as a title
        const availableQs = questions.filter(q => !existingTitles.some(t => t.includes(q.slice(0, 20))));
        const question = availableQs.length > 0
          ? availableQs[Math.floor(Math.random() * availableQs.length)]
          : questions[Math.floor(Math.random() * questions.length)];
        prompt = buildFaqPostPrompt(question, category.name);
      } else {
        prompt = buildFullArticlePrompt(category.name, existingTitles);
      }

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
          await new Promise(r => setTimeout(r, 10000));
          i--;
          continue;
        }
        continue;
      }

      const aiData = await aiResponse.json();
      let rawContent = aiData.choices?.[0]?.message?.content || "";
      rawContent = rawContent.replace(/^```json?\s*/i, "").replace(/\s*```$/i, "").trim();

      let article;
      try {
        article = JSON.parse(rawContent);
      } catch (e) {
        console.error(`Failed to parse article ${i + 1}:`, e, rawContent.slice(0, 200));
        continue;
      }

      const slug = generateSlug(article.title);
      const image = getCategoryImage(category.id, existingImages);

      const { error } = await supabase.from("blog_posts").insert({
        slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        image,
        category: category.name,
        category_id: category.id,
        read_time: article.readTime || (mode === "faq" ? 3 : 5),
        related_product_handles: relatedProducts,
        faq: article.faq || [],
        meta_description: article.metaDescription || article.excerpt,
        published: true,
        ig_caption: article.ig_caption || null,
        fb_caption: article.fb_caption || null,
        li_caption: article.li_caption || null,
      });

      if (error) {
        console.error(`DB error for article ${i + 1}:`, error);
        continue;
      }

      existingTitles.push(article.title);
      existingImages.push(image);
      results.push({ slug, title: article.title, category: category.name, mode });

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
