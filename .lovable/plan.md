## תיעוד מלא של האפליקציה - FullBody

### מטרה
ליצור מסמך מקיף בעברית שמתאר את כל הפיצ'רים, העמודים, האינטגרציות וההגדרות הטכניות שכבר קיימים באפליקציה, כדי שיהיה אפשר להעביר אותם לפלטפורמה אחרת או לשמור כתיעוד פנימי.

### תוצר
קובץ Markdown בנתיב `/mnt/documents/fullbody-app-spec.md` עם תוכן מלא, ממוין וניתן לחיפוש.

### תוכן המסמך

#### 1. סקירה כללית
- טכנולוגיות: React 18, Vite 5, TypeScript 5, Tailwind CSS v3, shadcn/ui, Zustand, react-helmet-async, react-router-dom, Supabase.
- ארכיטקטורת אתרים כפולה: Pro (Herbalife) ב-root, Nava ב-`/nava`, Sweets ב-`/sweets`.
- דומיין ראשי: `fullbody.co.il`, מקור Shopify: `fullbody-new.myshopify.com`.

#### 2. מבנה הנתיבים
- רשימת כל ה-routes ב-`src/App.tsx` עם חלוקה ל-Pro, Nava, Sweets, Admin ודפי שגיאה.
- ניווט מבודד בין המותגים (אין דליפת קישורים).

#### 3. מערכת מוצרים וחנות
- `herbalifeProducts.ts` - קטלוג מקומי, יחסי זהות ל-Shopify handle, מחירים, טעמים, יעדים, כשרות מהדרין, תמונות.
- עמוד מוצר Pro (`/product/:handle`) - תבנית גלובלית עם:
  - טעינת נתונים מ-Shopify (תמונות, וריאנטים, מלאי, `descriptionHtml`).
  - אקורדיון "תיאור מפורט" + בלוק תועלות דינמי.
  - Value Equation (Hormozi): Problem/Pain, Solution, FullBody Protocol Bonus.
  - Mobile sticky CTA bar.
  - TrustFactors, סיפורי הצלחה, קרוסלה "Pairs Well With".
  - JSON-LD דינמי עם `Product`, `offers`, `aggregateRating` מבוסס Supabase reviews.
- עמוד קטלוג Pro (`/products`) עם פילטרים מתקדמים.
- עמוד חבילות (`/bundles`) ו-Starter Stack (`/starter-stack`) עם הנחות 10%-15% וקופון אוטומטי בקישור לקופה.

#### 4. עגלת קניות וצ'קאאוט
- Zustand cart store עם persistence.
- סנכרון ל-Shopify Cart API (יצירת עגלה, הוספת שורות, עדכון כמויות, מחיקה).
- קישור ישיר לעמוד עגלה (`/cart`).
- Checkout Assistant Modal עם טקסט הסכמה מדויק בעברית.
- מעבר ל-Shopify Checkout עם `return_to=/thank-you` וקופון אוטומטי (`STARTERSTACK15`).
- אינטגרציית Flashy events (`AddedToCart`) בכל זרימות ה-add-to-cart.

#### 5. משפכי שיווק ולידים
- `/plan` - אשף 5 שלבים:
  - מטרה, מין, גיל, גובה, משקל, רמת פעילות.
  - רגישויות תזונתיות (לקטוז, גלוטן, סויה, אגוזים, ביצים, טבעוני, סוכר, דגים + חופשי).
  - פרטי קשר (שם, טלפון, אימייל).
  - תוצאות: BMR/TDEE, קלוריות יעד, מאקרו, תוכנית אימונים שבועית (Full Body / Upper-Lower / PPL), תפריט יומי מותאם רגישויות, המלצת מוצרים.
  - שמירת lead ו-plan ב-Supabase, שחזור דרך `localStorage`.
- `/starter-stack` - לנדינג פרימיום dark-mode עם בונוסים, FAQ, המלצות, קונפיגורטור אינטראקטיבי.
- `/protocol` ו-`/recipes` - הרשמה לספר מתכונים עם קוד גישה `Fullbody2026` דרך URL parameter או טופס.

#### 6. דשבורד ניהול (`/admin/dashboard`)
- אימות Supabase auth.
- לשוניות: סקירה כללית, מוצרים, תנועה, משפך ונטישה, הוצאות פרסום, ניתוח AI, יועץ AI, API Keys, ביקורות, מתכונים, בלוג/webhook, נרשמים לתוכנית.
- `AdminLeads` - הצגת כל הלידים מה-plan, חיפוש, ייצוא CSV, פרטים מלאים כולל רגישויות, מאקרו ומוצרים מומלצים.

#### 7. תת-אתר Sweets (`/sweets`)
- מיתוג ירוק FullBody + לוגו מותאם.
- עמוד בית, קטלוג, עמוד מוצר, סיפור המותג, משלוחים, צור קשר.
- מבודד מ-Pro: אין WhatsApp button, אין FirstVisitModal של Herbalife.

#### 8. בלוג ותוכן
- Pro Blog (`/blog`, `/blog/:slug`) עם E-E-A-T, אנטי-AI tone, infographics, FAQ mode.
- Social captions generator ו-webhook אוטומציה לרשתות חברתיות.
- Edge Functions: `generate-blog-posts`, `enrich-blog-posts`, `generate-social-captions`, `blog-social-webhook`.

#### 9. אינטגרציות
- Shopify: Storefront API דרך Edge Function proxy (`shopify-proxy`) עם אבטחת token.
- Supabase: Auth, DB, Edge Functions, storage.
- Analytics: GA4 (`G-FJ5SDNJCE1`), GTM, FB Pixel, Flashy PageView, אירועים מותאמים ב-`analytics_events`.
- Product feeds: Google Merchant, Facebook Catalog, Flashy Catalog דרך Edge Functions.
- Sitemap דינמי דרך Edge Function.

#### 10. SEO ותאימות
- react-helmet-async בכל עמוד עם title, meta description, canonical, robots.
- JSON-LD: Product, LocalBusiness/Organization, BreadcrumbList.
- robots.txt, sitemap.xml.
- מגבלות תוכן משפטי: "כשרות מהודרת" אסור (למעט SKU 0242), חובת פרטי מפיץ עצמאי (נדב אונגר, 054-2008578).

#### 11. אבטחה ופרטיות
- RLS על כל טבלאות `public` עם GRANTs מתאימים.
- Admin auth דרך Supabase (לא localStorage).
- מדיניות אבטחה: מתעלמים רק מ-severity error.

#### 12. ביצועים ו-UX
- Lazy loading לרוב העמודים.
- תמונות WebP עם `loading="lazy"` / `eager` לפי הקשר.
- Global scroll management, `overflow-y: auto !important`.
- RTL בעברית, פונט Heebo (300-800).

### קריטריונים לאישור
- המסמך יכסה את כל הסעיפים לעיל.
- יכלול קישורים ישירים לעמודים, שמות קבצים רלוונטיים וטבלאות Supabase.
- יהיה כתוב בעברית ברורה, עם כותרות H2/H3 ורשימות ממוינות.
- לא יכלול סודות, API keys או credentials.
