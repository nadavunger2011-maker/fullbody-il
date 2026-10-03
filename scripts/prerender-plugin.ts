// Build-time prerender: after `vite build`, writes static HTML for key pages and every blog
// article so crawlers get title/description/canonical/H1/content without running JavaScript.
// React replaces the #root content when the app boots, so visitors see the normal SPA.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { Plugin } from "vite";
import policy from "../supabase/functions/_shared/blog-index.json";
import { proBlogPosts, proBlogCategories } from "../src/data/proBlogPosts";
import { FEATURED_BLOG_OVERRIDES, TRANSPARENCY_DISCLOSURE } from "../src/data/featuredBlogContent";

const BASE = "https://fullbody.co.il";
const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
const ANON = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? "";
const AUTHOR = "נדב אונגר";

interface Page {
  path: string;
  title: string;
  description: string;
  h1: string;
  body: string; // trusted HTML
  noindex?: boolean;
  canonical?: string;
  redirectTo?: string;
  jsonLd?: object[];
  ogType?: string;
  image?: string;
}

const esc = (s: string) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const encPath = (p: string) => p.split("/").map(encodeURIComponent).join("/");


const PROTEIN_FAQ = [
  ["כמה חלבון צריך ביום?", "הכמות תלויה במשקל, ברמת הפעילות ובמטרה. המחשבון נותן הערכה כללית בלבד."],
  ["האם חייבים אבקת חלבון?", "לא. אפשר להגיע לכמות היומית מביצים, מוצרי חלב, דגים, עוף, קטניות וטופו."],
  ["מתי כדאי לאכול חלבון?", "כדאי לפזר מקורות חלבון לאורך היום. אין חובה לצרוך שייק מיד בסיום האימון."],
  ["האם יותר חלבון תמיד עדיף?", "לא. חשוב לשמור על תפריט מגוון ומאוזן שמתאים לצרכים האישיים."],
];
const PROTEIN_FAQ_SCHEMA = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: PROTEIN_FAQ.map(([q,a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) };
const PROTEIN_GUIDE_HTML = `<p>הזינו משקל, רמת פעילות ומטרה וקבלו הערכה כללית של כמות החלבון היומית.</p><h2>כמה חלבון צריך ביום?</h2><p>הכמות המתאימה מושפעת ממשקל הגוף, מכמות הפעילות, מסוג האימונים ומהתפריט הכולל. המחשבון מספק נקודת פתיחה לתכנון הארוחות ואינו מחליף התאמה אישית.</p><h2>חלבון לפי מטרה</h2><h3>שמירה</h3><p>פזרו מקורות חלבון בין הארוחות ושמרו על תפריט מגוון.</p><h3>עלייה במסת שריר</h3><p>שלבו חלבון עם אימוני כוח, מספיק אנרגיה ושינה.</p><h3>ירידה במשקל</h3><p>חלבון יכול להשתלב בתפריט מספק, אך אין מזון שמבטיח תוצאה.</p><h2>איך להגיע לכמות מהמזון?</h2><p>ביצים, יוגורט, קוטג׳, עוף, דגים, טופו וקטניות יכולים לספק את הכמות היומית. אבקה היא אפשרות נוחה, לא חובה.</p><table><thead><tr><th>מזון</th><th>חלבון משוער ל-100 גרם</th></tr></thead><tbody><tr><td>חזה עוף מבושל</td><td>31 גרם</td></tr><tr><td>טונה במים</td><td>25 גרם</td></tr><tr><td>עדשים מבושלות</td><td>9 גרם</td></tr><tr><td>טופו</td><td>12–17 גרם</td></tr><tr><td>קוטג׳</td><td>11 גרם</td></tr></tbody></table><h2>שאלות נפוצות</h2>${PROTEIN_FAQ.map(([q,a]) => `<h3>${q}</h3><p>${a}</p>`).join("")}<p><strong>המידע אינו מהווה ייעוץ רפואי. בהריון, הנקה, מצב רפואי או נטילת תרופות – יש להתייעץ עם רופא.</strong></p>`;

const STATIC_PAGES: Page[] = [
  { path: "/", title: "FullBody – מדריכי תזונה, חלבון וכושר בגובה העיניים", description: "טיפים כנים לתזונה מאוזנת, חלבון ואימונים: מדריכים, מתכונים ומחשבון חלבון יומי. בלי הבטחות ובלי דיאטות קיצוניות.", h1: "מדריכים שעוזרים לאכול, להתאמן ולהבין מה באמת מתאים לכם", body: "<p>מידע מעשי בגובה העיניים, מתכונים וכלים חינמיים. בלי הבטחות לתוצאות ובלי דיאטות קיצוניות.</p><p><a href=\"/blog\">המדריכים הפופולריים</a> · <a href=\"/protein-calculator\">מחשבון חלבון יומי</a> · <a href=\"/recipes\">ספר המתכונים</a></p><p><a href=\"https://shop.fullbody.co.il/?utm_source=blog&amp;utm_medium=home_banner\">ספר קינוחי חלבון במתנה</a></p>" },
  { path: "/recipes", title: "ספר המתכונים | FullBody", description: "מתכונים עתירי חלבון לארוחות בוקר, עיקריות, קינוחים ושייקים, כחלק מתזונה מאוזנת.", h1: "ספר המתכונים של FullBody", body: "<p>אוסף מתכונים עתירי חלבון לארוחות בוקר, ארוחות עיקריות, קינוחים ושייקים – פשוטים להכנה ומתאימים לשגרה פעילה.</p>" },
  { path: "/protein-calculator", title: "מחשבון חלבון יומי – כמה חלבון אני צריך ביום?", description: "חשבו בחינם כמה חלבון אתם צריכים ביום לפי משקל, פעילות ומטרה, עם טיפים מעשיים להשגת הכמות מהמזון.", h1: "מחשבון חלבון יומי", body: PROTEIN_GUIDE_HTML, jsonLd: [PROTEIN_FAQ_SCHEMA] },
  { path: "/about", title: "אודות FullBody | נדב אונגר ופרטי העסק", description: "FullBody בהפעלת נדב אונגר, מפיץ עצמאי מורשה של Herbalife. מי אני, איך אני עובד עם לקוחות ופרטי העסק המלאים.", h1: "אודות FullBody", body: `<p>אני נדב אונגר. הקמתי את FullBody כדי לעזור לאנשים להבין תזונה, חלבון ואימונים בלי בלבול, הבטחות או דיאטות קיצוניות.</p><p>${TRANSPARENCY_DISCLOSURE}</p><p>FullBody – נדב אונגר, עוסק מורשה 200353720. כתובת: רחוב זרחין 1, קומה 3, רעננה (משרד בלבד). טלפון ו-WhatsApp: 054-2008578. מייל: info@fullbody.co.il.</p>` },
  { path: "/contact", title: "צור קשר | FullBody – נדב אונגר", description: "צרו קשר עם FullBody בטלפון 054-2008578, בוואטסאפ או במייל info@fullbody.co.il.", h1: "צור קשר", body: "<p>טלפון ו-WhatsApp: 054-2008578. מייל: info@fullbody.co.il. שעות פעילות: א'-ה' 09:00-18:00, ו' 09:00-13:00.</p>" },
  { path: "/faq", title: "שאלות נפוצות | FullBody", description: "תשובות לשאלות נפוצות על משלוחים, החזרות והזמנות בחנות FullBody.", h1: "שאלות נפוצות", body: "<p>תשובות לשאלות נפוצות על משלוחים, החזרות, הזמנות ושימוש במוצרים.</p>" },
  { path: "/shipping-policy", title: "משלוחים ואספקה | FullBody", description: "עלויות וזמני המשלוח של FullBody.", h1: "משלוחים ואספקה", body: "<p>משלוח 29 ₪, חינם מעל 299 ₪. אספקה תוך 3-5 ימי עסקים, ובתקופות עומס עד 14 ימי עסקים. אין איסוף עצמי.</p>" },
  { path: "/return-policy", title: "מדיניות החזרות וביטולים | FullBody", description: "תנאי ביטול עסקה והחזרת מוצרים בהתאם לחוק הגנת הצרכן.", h1: "מדיניות החזרות וביטולים", body: "<p>ביטול עסקה תוך 14 יום מקבלת המוצר, למוצרים סגורים באריזתם המקורית, בהתאם לחוק הגנת הצרכן.</p>" },
  { path: "/refund-policy", canonical: "/return-policy", title: "מדיניות החזרות וביטולים | FullBody", description: "תנאי ביטול עסקה והחזרת מוצרים בהתאם לחוק הגנת הצרכן.", h1: "מדיניות החזרות וביטולים", body: "<p>ביטול עסקה תוך 14 יום מקבלת המוצר, בהתאם לחוק הגנת הצרכן.</p>" },
  { path: "/terms-of-use", title: "תנאי שימוש | FullBody", description: "תנאי השימוש באתר התוכן FullBody והמעבר לחנות המקוונת.", h1: "תנאי שימוש", body: "<p>תנאי השימוש באתר התוכן FullBody.</p>" },
  { path: "/privacy-policy", title: "מדיניות פרטיות | FullBody", description: "כיצד FullBody אוספת ומשתמשת במידע שנמסר באתר.", h1: "מדיניות פרטיות", body: "<p>כיצד FullBody אוספת, שומרת ומשתמשת במידע שנמסר באתר.</p>" },
  { path: "/accessibility", title: "הצהרת נגישות | FullBody", description: "הצהרת הנגישות של אתר FullBody.", h1: "הצהרת נגישות", body: "<p>לפניות בנושא נגישות: 054-2008578.</p>" },
];

interface Post {
  slug: string; title: string; excerpt: string; content: string; image?: string | null;
  category_id: string; date: string; updated_at?: string; meta_description?: string;
  faq?: { question: string; answer: string }[];
}

async function fetchDbPosts(): Promise<Post[]> {
  const all: Post[] = [];
  for (let from = 0; ; from += 200) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,title,excerpt,content,image,category_id,date,updated_at,meta_description,faq&published=eq.true&order=date.desc&offset=${from}&limit=200`,
      { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } },
    );
    if (!SUPABASE_URL || !ANON) throw new Error("blog build credentials unavailable");
    if (!res.ok) throw new Error(`blog fetch ${res.status}`);
    const rows = (await res.json()) as Post[];
    all.push(...rows);
    if (rows.length < 200) return all;
  }
}

function renderHtml(template: string, page: Page): string {
  const canonical = BASE + encPath(page.canonical ?? page.redirectTo ?? page.path);
  const head = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    page.noindex || page.redirectTo ? `<meta name="robots" content="noindex, follow" />` : "",
    `<meta property="og:title" content="${esc(page.title)}" />`,
    `<meta property="og:description" content="${esc(page.description)}" />`,
    `<meta property="og:type" content="${page.ogType ?? "website"}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta property="og:image" content="${esc(page.image ?? BASE + "/og-image.jpg")}" />`,
    `<meta property="og:locale" content="he_IL" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(page.title)}" />`,
    `<meta name="twitter:description" content="${esc(page.description)}" />`,
    ...(page.jsonLd ?? []).map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`),
    page.redirectTo
      ? `<meta http-equiv="refresh" content="0; url=${encPath(page.redirectTo)}" /><script>window.location.replace(${JSON.stringify(page.redirectTo)})</script>`
      : "",
  ].filter(Boolean).map((t) => t.replace(/^<(\w+)/, "<$1 data-prerender")).join("\n    ");

  const stripped = template
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name="description"[^>]*>\s*/i, "")
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, "")
    .replace(/<meta\s+(?:property="og:(?:title|description|type|url|image|locale)"|name="twitter:(?:card|title|description|image)")[^>]*>\s*/gi, "")
    .replace('<html lang="en">', '<html lang="he" dir="rtl">');
  const body = `<main dir="rtl"><h1>${esc(page.h1)}</h1>${page.body}</main>`;
  return stripped
    .replace("</head>", `    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

function write(outDir: string, path: string, html: string) {
  if (path === "/") return writeFileSync(join(outDir, "index.html"), html);
  const rel = path.replace(/^\//, "");
  const dirFile = join(outDir, rel, "index.html");
  mkdirSync(dirname(dirFile), { recursive: true });
  writeFileSync(dirFile, html);
  writeFileSync(join(outDir, `${rel}.html`), html);
}

const cleanContent = (html: string) =>
  html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, "").replace(/<script[\s\S]*?<\/script>/gi, "");

function articlePage(p: Post, indexed: boolean, related: Post[]): Page {
  const url = `${BASE}${encPath(`/blog/${p.slug}`)}`;
  const description = (p.meta_description || p.excerpt || "").slice(0, 300);
  const image = p.image || `${BASE}/og-image.jpg`;
  const faq = Array.isArray(p.faq) ? p.faq.filter((f) => f?.question && f?.answer) : [];
  const jsonLd: object[] = [
    {
      "@context": "https://schema.org", "@type": "Article", headline: p.title, description, image,
      datePublished: p.date, dateModified: String(p.updated_at || p.date).slice(0, 10),
      author: { "@type": "Person", name: AUTHOR, url: `${BASE}/about` },
      publisher: { "@type": "Organization", name: "FullBody", url: BASE, logo: { "@type": "ImageObject", url: `${BASE}/favicon.png` } },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "בית", item: `${BASE}/` },
        { "@type": "ListItem", position: 2, name: "בלוג", item: `${BASE}/blog` },
        { "@type": "ListItem", position: 3, name: p.title, item: url },
      ],
    },
  ];
  if (faq.length) {
    jsonLd.push({
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    });
  }
  const faqHtml = faq.length
    ? `<section><h2>שאלות ותשובות</h2>${faq.map((f) => `<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`).join("")}</section>`
    : "";
  const relatedHtml = related.length
    ? `<section><h2>מאמרים קשורים</h2><ul>${related.map((r) => `<li><a href="${encPath(`/blog/${r.slug}`)}">${esc(r.title)}</a></li>`).join("")}</ul></section>`
    : "";
  return {
    path: `/blog/${p.slug}`, title: `${p.title} | FullBody`, description, h1: p.title, image,
    noindex: !indexed, ogType: "article", jsonLd,
    body: `<nav aria-label="breadcrumb"><a href="/">בית</a> › <a href="/blog">בלוג</a> › ${esc(p.title)}</nav>`
      + `<article>${cleanContent(p.content || "")}</article>${faqHtml}`
      + `<aside><strong>על הכותב:</strong> ${AUTHOR}, מפיץ עצמאי מורשה של Herbalife. <a href="/about">עוד עליי</a><p>${esc(TRANSPARENCY_DISCLOSURE)}</p></aside>`
      + `<aside><a href="https://shop.fullbody.co.il/?utm_source=blog&amp;utm_medium=article&amp;utm_campaign=${encodeURIComponent(p.slug)}">ספר קינוחי חלבון במתנה</a></aside>`
      + `<p><strong>המידע אינו מהווה ייעוץ רפואי. בהריון, הנקה, מצב רפואי או נטילת תרופות – יש להתייעץ עם רופא.</strong></p>`
      + relatedHtml,
  };
}

export function prerenderPlugin(): Plugin {
  let outDir = "dist";
  return {
    name: "fullbody-prerender",
    apply: "build",
    configResolved(c) { outDir = c.build.outDir; },
    async closeBundle() {
      const template = readFileSync(join(outDir, "index.html"), "utf8");
      let dbPosts: Post[] = [];
      try { dbPosts = await fetchDbPosts(); } catch (e) { console.warn("[prerender] blog fetch failed:", e); }
      const staticPosts: Post[] = proBlogPosts.map((s) => {
        const override = FEATURED_BLOG_OVERRIDES[s.slug];
        return { slug: s.slug, title: override?.title ?? s.title, excerpt: override?.excerpt ?? s.excerpt, content: override?.content ?? s.content, image: s.image, category_id: s.categoryId, date: s.date, updated_at: override?.updatedAt, meta_description: override?.metaDescription ?? s.metaDescription, faq: override?.faq ?? s.faq };
      });
      const bySlug = new Map<string, Post>();
      [...staticPosts, ...dbPosts].forEach((p) => bySlug.set(p.slug, p));
      const indexedSet = new Set<string>(policy.indexed);
      const redirects = policy.redirects as Record<string, string>;
      const indexedPosts = policy.indexed.map((s: string) => bySlug.get(s)).filter(Boolean) as Post[];

      // /blog listing: indexed first, top 6 as popular guides
      const listing = [...indexedPosts, ...[...bySlug.values()].filter((p) => !indexedSet.has(p.slug) && !redirects[p.slug])];
      const blogPage: Page = {
        path: "/blog", title: "בלוג תזונה וכושר | FullBody", h1: "בלוג FullBody",
        description: "מידע כללי בנושאי תזונה, חלבון, כושר וניהול משקל כחלק מאורח חיים פעיל.",
        body: `<section><h2>המדריכים הפופולריים</h2><ul>${indexedPosts.slice(0, 6).map((p) => `<li><a href="${encPath(`/blog/${p.slug}`)}">${esc(p.title)}</a></li>`).join("")}</ul></section>`
          + `<section><h2>כל המאמרים</h2><ul>${listing.map((p) => `<li><a href="${encPath(`/blog/${p.slug}`)}">${esc(p.title)}</a></li>`).join("")}</ul></section>`,
      };

      let count = 0;
      for (const page of [...STATIC_PAGES, blogPage]) { write(outDir, page.path, renderHtml(template, page)); count++; }
      for (const p of bySlug.values()) {
        if (redirects[p.slug]) continue;
        const indexed = indexedSet.has(p.slug);
        const related = indexed
          ? indexedPosts.filter((r) => r.slug !== p.slug && r.category_id === p.category_id).slice(0, 3)
          : [];
        write(outDir, `/blog/${p.slug}`, renderHtml(template, articlePage(p, indexed, related)));
        count++;
      }
      for (const [from, to] of Object.entries(redirects)) {
        const target = bySlug.get(to);
        write(outDir, `/blog/${from}`, renderHtml(template, {
          path: `/blog/${from}`, redirectTo: `/blog/${to}`, title: `${target?.title ?? "FullBody"} | FullBody`,
          description: target?.meta_description ?? "", h1: target?.title ?? "", body: `<p><a href="${encPath(`/blog/${to}`)}">${esc(target?.title ?? to)}</a></p>`,
        }));
        count++;
      }
      void proBlogCategories;
      console.log(`[prerender] wrote ${count} pages (${dbPosts.length} db posts)`);
    },
  };
}
