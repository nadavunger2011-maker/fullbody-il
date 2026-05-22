## מה משנים בעמוד המוצר (`src/pages/ProProductDetail.tsx`)

הקובץ הזה הוא תבנית גלובלית — כל מוצר ב-`/product/:handle` משתמש בו, אז כל שינוי מחיל אוטומטית על **כל המוצרים**.

### 1. אקורדיון "תיאור מפורט" — תוכן עשיר ואמיתי

כרגע האקורדיון מציג רק את שדה `product.description` הקצר מהקובץ המקומי `herbalifeProducts.ts` (לפעמים משפט אחד בלבד).

שינוי:
- לשלוף את `descriptionHtml` מ-Shopify (כבר נטען ל-`shopifyProduct` בקומפוננטה) — זה התיאור המלא, המפורט והרשמי של המוצר ישירות מה-Backend, כולל פסקאות, כותרות ורשימות.
- לרנדר אותו בתוך האקורדיון עם `dangerouslySetInnerHTML` בתוך wrapper מעוצב (`prose`-style: line-height 1.6, מרווחים בין פסקאות, bullets מסודרים, h3 בולטים).
- אם `descriptionHtml` ריק או חסר — fallback ל-`product.description` המקומי.
- מתחת לתיאור מ-Shopify, להוסיף בלוק תמיד-מוצג של "מה תקבלו במוצר" שמורכב דינמית מ-`product.benefits` כדי להבטיח שגם מוצרים עם תיאור Shopify קצר יקבלו מסת תוכן הוגנת.

תוצאה: כל מוצר מקבל תיאור מפורט אמיתי בלי להזין ידנית טקסטים נוספים בקוד.

### 2. הסרת קטע "ביקורות לקוחות"

הקומפוננטה `ProductReviews` (סקשן בסוף העמוד, שורות 602-607) מציגה "ביקורות לקוחות" — היא כרגע כמעט תמיד ריקה ומציגה "עדיין אין ביקורות למוצר זה".

שינוי: להסיר את כל הסקשן מהעמוד (כולל הימפורט). הסכמה של `aggregateRating` ב-JSON-LD כבר מותנית ב-`reviewAgg.count > 0` אז זה ימשיך לעבוד נקי.

**נשמר:** `TestimonialSlider` (סיפורי הצלחה אמיתיים, מסונן לפי קטגוריית המוצר) — שורה 532.

### פרטים טכניים

קובץ יחיד שמשתנה: `src/pages/ProProductDetail.tsx`
- מחיקת import של `ProductReviews` ושל הסקשן בשורות 602-607.
- החלפת ה-`AccordionItem value="description"` (שורות 449-459) לרנדר `shopifyProduct?.descriptionHtml` ב-`dangerouslySetInnerHTML` + fallback + בלוק benefits.
- הוספת מחלקות Tailwind ל-styling של ה-HTML מ-Shopify (כותרות, פסקאות, רשימות) דרך selector מקומי או `prose` של @tailwindcss/typography אם זמין; אחרת קלאסים ידניים על ה-wrapper.

ללא שינויים בנתונים, ב-Shopify, או בקבצים אחרים.
