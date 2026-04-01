import herbalifeF1Vanilla from '@/assets/herbalife-f1-vanilla.jpg';
import herbalifeF1Chocolate from '@/assets/herbalife-f1-chocolate.jpg';
import herbalifeF1Kosher from '@/assets/herbalife-f1-kosher.jpg';
import herbalifeNiteworks from '@/assets/herbalife-niteworks.jpg';
import herbalifeAloeNatural from '@/assets/herbalife-aloe-natural.jpg';
import herbalifeAloeMango from '@/assets/herbalife-aloe-mango.jpg';
import herbalifePdm from '@/assets/herbalife-pdm.jpg';
import herbalifeH24Rebuild from '@/assets/h24-rebuild-strength.jpg';
import herbalifeCookbook from '@/assets/herbalife-cookbook.jpg';

export interface HerbalifeNutrition {
  label: string;
  value: string;
  unit?: string;
}

export interface HerbalifeFAQ {
  question: string;
  answer: string;
}

export interface HerbalifeProduct {
  sku: string;
  handle: string;
  shopifyHandle: string; // The actual Shopify handle for cart operations
  title: string;
  metaDescription: string;
  category: string;
  categoryId: string;
  shortHook: string;
  image: string;
  price: number;
  benefits: string[];
  nutrition: HerbalifeNutrition[];
  faq: HerbalifeFAQ[];
  description: string;
  usage: string;
}

export const herbalifeProducts: HerbalifeProduct[] = [
  {
    sku: '403K',
    handle: 'herbalife-cookbook',
    shopifyHandle: 'ספר-המתכונים-של-הרבלייף-לבשל-בריא',
    title: 'ספר המתכונים של הרבלייף - לבשל בריא',
    metaDescription: 'מתכונים בריאים וקלים המשלבים את מוצרי הרבלייף לארוחות חלבון וקינוחים.',
    category: 'לייף סטייל',
    categoryId: 'lifestyle',
    shortHook: 'מתכונים מעוררי השראה לאורח חיים בריא. למדו לבשל ארוחות מזינות ומאוזנות עם מוצרי הרבלייף.',
    image: herbalifeCookbook,
    price: 89,
    benefits: [
      'מעל 50 מתכונים בריאים ומאוזנים',
      'שילוב ייחודי של מוצרי Herbalife במנות יומיומיות',
      'מתכונים לארוחות בוקר, צהריים, ערב וקינוחים',
      'ערכים תזונתיים לכל מתכון',
      'מתאים למתחילים ולמתקדמים',
    ],
    nutrition: [],
    faq: [
      { question: 'לאילו מוצרי הרבלייף מתייחס ספר המתכונים?', answer: 'הספר כולל מתכונים עם פורמולה 1, PDM, אלוורה ומוצרים נוספים מהקו של הרבלייף.' },
      { question: 'האם המתכונים מתאימים לצמחונים?', answer: 'חלק מהמתכונים צמחוניים. ניתן להתאים מתכונים רבים בקלות לתזונה צמחונית.' },
      { question: 'האם ניתן להזמין את הספר בנפרד?', answer: 'כן, הספר זמין כפריט עצמאי וגם כחלק מערכות.' },
      { question: 'באילו שפות הספר זמין?', answer: 'הספר זמין בעברית עם הנחיות מפורטות ותמונות.' },
      { question: 'האם המתכונים מתאימים לירידה במשקל?', answer: 'כן, רוב המתכונים מותאמים לתזונה מאוזנת ולשליטה במשקל.' },
    ],
    description: 'ספר המתכונים של הרבלייף מציע מגוון רחב של מתכונים בריאים וטעימים המשלבים את מוצרי Herbalife. הספר כולל ארוחות מאוזנות לכל שעה ביום — משייקים ופנקייקים בבוקר ועד קינוחי חלבון לסיום הארוחה.',
    usage: 'עיינו בספר, בחרו מתכון ועקבו אחרי ההוראות. מומלץ לשלב מתכונים שונים לגיוון התפריט היומי.',
  },
  {
    sku: '0258',
    handle: 'formula-1-vanilla',
    shopifyHandle: 'אבקת-פורמולה-1-וניל-550-גרם',
    title: 'אבקת פורמולה 1 - וניל (550 גרם)',
    metaDescription: 'תחליף ארוחה מאוזן בטעם וניל עם ויטמינים וחלבון איכותי לניהול משקל.',
    category: 'ניהול משקל',
    categoryId: 'weight',
    shortHook: 'שייק חלבון מאוזן בטעם וניל קלאסי. תחליף ארוחה מושלם עם 21 ויטמינים ומינרלים.',
    image: herbalifeF1Vanilla,
    price: 259,
    benefits: [
      'כ-220 קלוריות למנה (עם חלב דל שומן)',
      '18 גרם חלבון סויה ומי גבינה למנה',
      '21 ויטמינים ומינרלים חיוניים',
      'תחליף ארוחה מאוזן לשליטה במשקל',
      'ללא צבעים מלאכותיים',
    ],
    nutrition: [
      { label: 'קלוריות', value: '220', unit: 'kcal' },
      { label: 'חלבון', value: '18', unit: 'g' },
      { label: 'פחמימות', value: '21', unit: 'g' },
      { label: 'שומן', value: '3', unit: 'g' },
      { label: 'סיבים תזונתיים', value: '3', unit: 'g' },
      { label: 'ויטמין C', value: '60', unit: 'mg' },
      { label: 'סידן', value: '500', unit: 'mg' },
      { label: 'ברזל', value: '4.7', unit: 'mg' },
    ],
    faq: [
      { question: 'כמה פעמים ביום מומלץ לשתות פורמולה 1?', answer: 'מומלץ 1-2 שייקים ביום כתחליף ארוחה, בהתאם ליעדים האישיים.' },
      { question: 'האם פורמולה 1 מתאימה לצמחונים?', answer: 'כן, הפורמולה מכילה חלבון סויה וחלבון מי גבינה ומתאימה לצמחונים (לא טבעונים).' },
      { question: 'איך מכינים את השייק?', answer: 'מערבבים 2 כפות (26 גרם) עם 250 מ"ל חלב דל שומן. ניתן להוסיף קרח ופירות.' },
      { question: 'האם מתאים לאנשים עם רגישות לגלוטן?', answer: 'הפורמולה אינה מכילה גלוטן, אך מיוצרת במפעל שעשוי לעבד מוצרי גלוטן.' },
      { question: 'האם ניתן להשתמש בפורמולה 1 לעלייה במשקל?', answer: 'כן, על ידי שתייה בנוסף לארוחות רגילות ולא כתחליף.' },
      { question: 'מה תוקף המוצר?', answer: 'התוקף מצוין על גבי האריזה. בדרך כלל כ-24 חודשים מתאריך הייצור.' },
    ],
    description: 'פורמולה 1 של הרבלייף היא שייק חלבון מאוזן המספק תזונה מלאה בטעם וניל קלאסי ועשיר. מתאים כתחליף ארוחה לשליטה במשקל או כארוחה מהירה ומזינה. עשיר ב-21 ויטמינים ומינרלים, חלבון סויה ומי גבינה, וסיבים תזונתיים.',
    usage: 'מערבבים 2 כפות (26 גרם) עם 250 מ"ל חלב דל שומן או משקה צמחי. ניתן להוסיף פירות, קרח או PDM להגברת החלבון.',
  },
  {
    sku: '0260',
    handle: 'formula-1-chocolate',
    shopifyHandle: 'אבקת-פורמולה-1-שוקולד-550-גרם',
    title: 'אבקת פורמולה 1 - שוקולד (550 גרם)',
    metaDescription: 'שייק פורמולה 1 בטעם שוקולד עשיר. ארוחה מזינה במינימום קלוריות ומקסימום חלבון.',
    category: 'ניהול משקל',
    categoryId: 'weight',
    shortHook: 'שייק שוקולד עשיר ומפנק בלי הרגשת אשמה. תחליף ארוחה מאוזן עם מקסימום חלבון ומינימום קלוריות.',
    image: herbalifeF1Chocolate,
    price: 259,
    benefits: [
      'טעם שוקולד עשיר ומפנק',
      '18 גרם חלבון איכותי למנה',
      '21 ויטמינים ומינרלים',
      'רק כ-220 קלוריות עם חלב דל שומן',
      'עשיר בסיבים תזונתיים',
    ],
    nutrition: [
      { label: 'קלוריות', value: '220', unit: 'kcal' },
      { label: 'חלבון', value: '18', unit: 'g' },
      { label: 'פחמימות', value: '22', unit: 'g' },
      { label: 'שומן', value: '3', unit: 'g' },
      { label: 'סיבים תזונתיים', value: '3', unit: 'g' },
      { label: 'ויטמין C', value: '60', unit: 'mg' },
      { label: 'סידן', value: '500', unit: 'mg' },
      { label: 'ברזל', value: '4.7', unit: 'mg' },
    ],
    faq: [
      { question: 'מה ההבדל בין שוקולד לוניל?', answer: 'ההבדל העיקרי הוא בטעם. הערכים התזונתיים כמעט זהים. בחרו לפי העדפת הטעם האישית.' },
      { question: 'האם השוקולד מכיל סוכר?', answer: 'הפורמולה מכילה כמות קטנה של סוכר טבעי. מרבית המתיקות מגיעה מממתיקים טבעיים.' },
      { question: 'האם ניתן לערבב עם מים?', answer: 'ניתן, אך מומלץ עם חלב דל שומן לטעם עשיר יותר ולערכים תזונתיים מיטביים.' },
      { question: 'מתי הכי טוב לשתות?', answer: 'כתחליף ארוחת בוקר או ארוחת ערב. ניתן גם כארוחת ביניים מזינה.' },
      { question: 'האם המוצר כשר?', answer: 'כן, המוצר בפיקוח כשרות. לגרסת מהדרין ראו פורמולה 1 כשר למהדרין.' },
    ],
    description: 'פורמולה 1 שוקולד מציעה טעם שוקולד עשיר ומפנק בשייק מאוזן עם חלבון, ויטמינים וסיבים תזונתיים. הפתרון המושלם למי שרוצה ליהנות מטעם מתוק ועדיין לשמור על תזונה בריאה ומאוזנת.',
    usage: 'מערבבים 2 כפות (26 גרם) עם 250 מ"ל חלב דל שומן. ניתן להוסיף בננה, חמאת בוטנים או קרח.',
  },
  {
    sku: '0242',
    handle: 'formula-1-kosher',
    shopifyHandle: 'פורמולה-1-וניל-כשר-למהדרין',
    title: 'פורמולה 1 וניל כשר למהדרין',
    metaDescription: 'שייק חלבון בטעם וניל בפיקוח כשרות מהודר. כל הערכים התזונתיים בארוחה אחת.',
    category: 'ניהול משקל',
    categoryId: 'weight',
    shortHook: 'שייק הפורמולה 1 האהוב — עכשיו בכשרות מהדרין. כל הערכים התזונתיים שאתם צריכים, עם פיקוח כשרות ללא פשרות.',
    image: herbalifeF1Kosher,
    price: 279,
    benefits: [
      'כשר למהדרין בפיקוח הרבנות',
      '18 גרם חלבון איכותי למנה',
      '21 ויטמינים ומינרלים חיוניים',
      'תחליף ארוחה מאוזן ומלא',
      'מתאים לשומרי כשרות מהדרין',
    ],
    nutrition: [
      { label: 'קלוריות', value: '220', unit: 'kcal' },
      { label: 'חלבון', value: '18', unit: 'g' },
      { label: 'פחמימות', value: '21', unit: 'g' },
      { label: 'שומן', value: '3', unit: 'g' },
      { label: 'סיבים תזונתיים', value: '3', unit: 'g' },
      { label: 'ויטמין C', value: '60', unit: 'mg' },
      { label: 'סידן', value: '500', unit: 'mg' },
    ],
    faq: [
      { question: 'מה ההבדל בין הפורמולה הרגילה לכשר למהדרין?', answer: 'ההבדל העיקרי הוא בפיקוח הכשרות. גרסת המהדרין מיוצרת תחת פיקוח כשרות מחמיר יותר.' },
      { question: 'באיזה הכשר מדובר?', answer: 'המוצר בפיקוח כשרות מהדרין ישראלי.' },
      { question: 'האם הטעם זהה לגרסה הרגילה?', answer: 'כן, טעם הוניל זהה. ההבדל הוא אך ורק בתהליך הייצור והפיקוח.' },
      { question: 'האם מתאים לדיאטה?', answer: 'בהחלט, הפורמולה מאוזנת ומתאימה כתחליף ארוחה בתהליך ניהול משקל.' },
      { question: 'מהם הרכיבים העיקריים?', answer: 'חלבון סויה, חלבון מי גבינה, סיבים תזונתיים, ויטמינים ומינרלים.' },
    ],
    description: 'פורמולה 1 כשר למהדרין מאפשרת לשומרי כשרות ליהנות מאותם ערכים תזונתיים מעולים של פורמולה 1 הקלאסית. שייק חלבון מאוזן בטעם וניל עם 21 ויטמינים ומינרלים, תחת פיקוח כשרות מהדרין.',
    usage: 'מערבבים 2 כפות (26 גרם) עם 250 מ"ל חלב דל שומן. ניתן להוסיף פירות או קרח.',
  },
  {
    sku: '2600',
    handle: 'niteworks',
    shopifyHandle: 'נייטוורקס-niteworks-תמיכה-בלב',
    title: 'נייטוורקס (Niteworks) - תמיכה בלב',
    metaDescription: 'תוסף תזונה המבוסס על מחקר זוכה פרס נובל לתמיכה בזרימת הדם ובבריאות הלב.',
    category: 'ספורט ואנרגיה',
    categoryId: 'sport',
    shortHook: 'פותח על בסיס מחקר זוכה פרס נובל. נייטוורקס תומך בזרימת דם תקינה ובבריאות הלב וכלי הדם.',
    image: herbalifeNiteworks,
    price: 349,
    benefits: [
      'מבוסס על מחקר זוכה פרס נובל ברפואה',
      'L-Arginine ו-L-Citrulline לייצור תחמוצת חנקן',
      'תומך בזרימת דם תקינה ובריאות כלי הדם',
      'מכיל ויטמין C, E וחומצה פולית',
      'טעם לימון מרענן',
    ],
    nutrition: [
      { label: 'L-Arginine', value: '1250', unit: 'mg' },
      { label: 'L-Citrulline', value: '250', unit: 'mg' },
      { label: 'L-Taurine', value: '250', unit: 'mg' },
      { label: 'ויטמין C', value: '100', unit: 'mg' },
      { label: 'ויטמין E', value: '20', unit: 'mg' },
      { label: 'חומצה פולית', value: '200', unit: 'μg' },
      { label: 'קלוריות', value: '25', unit: 'kcal' },
    ],
    faq: [
      { question: 'מתי הכי טוב לקחת נייטוורקס?', answer: 'מומלץ לפני השינה, כי הגוף מייצר תחמוצת חנקן בעיקר בשעות הלילה.' },
      { question: 'מה זה תחמוצת חנקן ולמה זה חשוב?', answer: 'תחמוצת חנקן (NO) היא מולקולה שמסייעת להרחבת כלי הדם ולזרימת דם תקינה.' },
      { question: 'האם מתאים לספורטאים?', answer: 'כן, ספורטאים רבים משתמשים בנייטוורקס לתמיכה במחזור הדם ובהתאוששות.' },
      { question: 'מי פיתח את הפורמולה?', answer: 'הפורמולה פותחה בשיתוף עם ד"ר לואיס איגנרו, זוכה פרס נובל ברפואה 1998.' },
      { question: 'האם יש תופעות לוואי?', answer: 'המוצר הוא תוסף תזונה. יש להתייעץ עם רופא אם נוטלים תרופות לחץ דם.' },
      { question: 'כמה מנות באריזה?', answer: 'כ-15 מנות באריזה של 150 גרם.' },
    ],
    description: 'נייטוורקס של הרבלייף פותח בשיתוף עם ד"ר לואיס איגנרו, זוכה פרס נובל ברפואה 1998, ומכיל שילוב ייחודי של L-Arginine, L-Citrulline ו-L-Taurine לתמיכה בייצור תחמוצת חנקן (NO) בגוף, המסייעת בהרחבת כלי הדם ובזרימת דם תקינה.',
    usage: 'מערבבים כפית אחת (10 גרם) עם 250 מ"ל מים. מומלץ לשתות לפני השינה.',
  },
  {
    sku: '0145',
    handle: 'aloe-natural',
    shopifyHandle: 'תרכיז-אלוורה-צמחי-טעם-טבעי',
    title: 'תרכיז אלוורה צמחי - טעם טבעי',
    metaDescription: 'תרכיז אלוורה איכותי לסיוע בעיכול, ניקוי רעלים ורענון הגוף ללא תוספת סוכר.',
    category: 'עיכול והידרציה',
    categoryId: 'digestion',
    shortHook: 'תרכיז אלוורה טבעי שמרענן ומסייע לעיכול. הוסיפו כמה כפיות למים ותיהנו ממשקה מרענן ובריא.',
    image: herbalifeAloeNatural,
    price: 169,
    benefits: [
      'מסייע בתהליכי עיכול בריאים',
      'מעודד שתיית מים ולחות',
      'ללא תוספת סוכר',
      'מכיל 40% ג\'ל אלוורה איכותי',
      'מרענן ונעים לשתייה',
    ],
    nutrition: [
      { label: 'קלוריות', value: '5', unit: 'kcal' },
      { label: 'פחמימות', value: '1', unit: 'g' },
      { label: 'סוכר', value: '0', unit: 'g' },
      { label: 'שומן', value: '0', unit: 'g' },
      { label: 'חלבון', value: '0', unit: 'g' },
    ],
    faq: [
      { question: 'כמה אלוורה צריך לשים?', answer: '3 כפיות (15 מ"ל) ב-250 מ"ל מים. ניתן לשתות מספר פעמים ביום.' },
      { question: 'מתי מומלץ לשתות אלוורה?', answer: 'בכל שעה ביום, ובמיוחד בבוקר או לפני ארוחות לתמיכה בעיכול.' },
      { question: 'מה ההבדל בין הטעם הטבעי למנגו?', answer: 'שניהם מכילים את אותו ג\'ל אלוורה. ההבדל הוא בטעם בלבד — טבעי או מנגו.' },
      { question: 'האם מתאים לילדים?', answer: 'מומלץ להתייעץ עם רופא ילדים לפני שימוש בתוספי תזונה לילדים.' },
      { question: 'כמה זמן מחזיקה בקבוק?', answer: 'בקבוק 473 מ"ל מספיק לכ-31 מנות בשימוש רגיל.' },
      { question: 'האם צריך לשמור במקרר?', answer: 'מומלץ לשמור במקרר לאחר פתיחה.' },
    ],
    description: 'תרכיז אלוורה צמחי של הרבלייף מכיל 40% ג\'ל אלוורה איכותי. משקה מרענן שמסייע בתהליכי עיכול בריאים ומעודד שתיית מים. ללא תוספת סוכר, נוח להכנה ומתאים לשתייה יומיומית.',
    usage: 'מערבבים 3 כפיות (15 מ"ל) ב-250 מ"ל מים. ניתן להוסיף לתה צמחים או לשייק.',
  },
  {
    sku: '0146',
    handle: 'aloe-mango',
    shopifyHandle: 'תרכיז-אלוורה-טעם-מנגו-מרענן',
    title: 'תרכיז אלוורה - טעם מנגו מרענן',
    metaDescription: 'תרכיז אלוורה מרענן בטעם מנגו לסיוע למערכת העיכול ועידוד שתיית מים.',
    category: 'עיכול והידרציה',
    categoryId: 'digestion',
    shortHook: 'אלוורה בטעם מנגו טרופי ומרענן. הדרך הכי טעימה לדאוג לעיכול בריא ולשתות יותר מים.',
    image: herbalifeAloeMango,
    price: 169,
    benefits: [
      'טעם מנגו טרופי ומרענן',
      'מסייע בעיכול בריא',
      'מעודד שתיית מים יומיומית',
      '40% ג\'ל אלוורה איכותי',
      'ללא תוספת סוכר',
    ],
    nutrition: [
      { label: 'קלוריות', value: '5', unit: 'kcal' },
      { label: 'פחמימות', value: '1', unit: 'g' },
      { label: 'סוכר', value: '0', unit: 'g' },
      { label: 'שומן', value: '0', unit: 'g' },
      { label: 'חלבון', value: '0', unit: 'g' },
    ],
    faq: [
      { question: 'האם טעם המנגו טבעי?', answer: 'הטעם מבוסס על ארומה של מנגו. הג\'ל הפעיל הוא אלוורה טבעית.' },
      { question: 'ניתן לשלב עם מוצרים אחרים?', answer: 'כן, ניתן לשלב עם תה הרבלייף או להוסיף לשייק פורמולה 1.' },
      { question: 'מה היתרון על מיץ רגיל?', answer: 'תרכיז אלוורה כמעט ללא קלוריות, ללא סוכר, ומכיל ג\'ל אלוורה התומך בעיכול.' },
      { question: 'האם מתאים לנשים בהריון?', answer: 'מומלץ להתייעץ עם רופא לפני נטילת כל תוסף תזונה במהלך ההריון.' },
      { question: 'כמה פעמים ביום ניתן לשתות?', answer: 'ניתן לשתות 2-3 פעמים ביום. כ-15 מ"ל בכל פעם.' },
    ],
    description: 'תרכיז אלוורה בטעם מנגו טרופי ומרענן מהרבלייף. מכיל 40% ג\'ל אלוורה לתמיכה בעיכול בריא. הדרך הטעימה ביותר לעודד את עצמכם לשתות יותר מים במהלך היום.',
    usage: 'מערבבים 3 כפיות (15 מ"ל) ב-250 מ"ל מים קרים. מעולה גם עם קרח.',
  },
  {
    sku: '2793',
    handle: 'pdm-protein',
    shopifyHandle: 'אבקת-חלבון-pdm-תוספת-חלבון-לשייק',
    title: 'אבקת חלבון PDM - תוספת חלבון לשייק',
    metaDescription: 'Protein Drink Mix להעלאת כמות החלבון היומית בשייק או כמשקה מרענן.',
    category: 'ניהול משקל',
    categoryId: 'weight',
    shortHook: 'תוספת חלבון מושלמת לשייק הפורמולה 1 שלכם. PDM מעלה את החלבון ומגביר שובע.',
    image: herbalifePdm,
    price: 229,
    benefits: [
      '15 גרם חלבון מי גבינה למנה',
      'רק 80 קלוריות למנה',
      'מושלם כתוספת לשייק פורמולה 1',
      'ניתן גם כמשקה חלבון עצמאי',
      'טעם וניל עדין ונעים',
    ],
    nutrition: [
      { label: 'קלוריות', value: '80', unit: 'kcal' },
      { label: 'חלבון', value: '15', unit: 'g' },
      { label: 'פחמימות', value: '3', unit: 'g' },
      { label: 'שומן', value: '1', unit: 'g' },
      { label: 'סוכר', value: '1', unit: 'g' },
      { label: 'סידן', value: '200', unit: 'mg' },
    ],
    faq: [
      { question: 'מה ההבדל בין PDM לפורמולה 1?', answer: 'פורמולה 1 היא תחליף ארוחה מלא. PDM הוא תוספת חלבון שנועדה להגביר את כמות החלבון.' },
      { question: 'כמה PDM להוסיף לשייק?', answer: 'כף אחת (24 גרם) מוסיפה 15 גרם חלבון. ניתן להוסיף עד 2 כפות.' },
      { question: 'האם ניתן לשתות PDM בנפרד?', answer: 'כן, ניתן לערבב עם מים או חלב כמשקה חלבון עצמאי.' },
      { question: 'מאיזה סוג חלבון עשוי PDM?', answer: 'חלבון מי גבינה (Whey Protein) — חלבון איכותי עם ספיגה מהירה.' },
      { question: 'האם מתאים לאחר אימון?', answer: 'כן, PDM מתאים גם לצריכת חלבון לאחר אימון.' },
    ],
    description: 'Protein Drink Mix (PDM) של הרבלייף מספק 15 גרם חלבון מי גבינה איכותי בכל מנה. מושלם כתוספת לשייק פורמולה 1 להגברת כמות החלבון, או כמשקה חלבון עצמאי ומרענן.',
    usage: 'מערבבים כף אחת (24 גרם) עם מים, חלב, או הוסיפו ישירות לשייק הפורמולה 1.',
  },
  {
    sku: '4468',
    handle: 'h24-rebuild-strength',
    shopifyHandle: 'h24-rebuild-strength-שוקולד-1-קג',
    title: 'H24 Rebuild Strength - שוקולד (1 ק"ג)',
    metaDescription: '25 גרם חלבון לבניית שריר והתאוששות מהירה לאחר אימון. מאושר לספורטאים.',
    category: 'ספורט (H24)',
    categoryId: 'sport',
    shortHook: 'חלבון מקצועי לספורטאים רציניים. 25 גרם חלבון למנה להתאוששות מהירה ובניית שריר לאחר אימון.',
    image: herbalifeH24Rebuild,
    price: 299,
    benefits: [
      '25 גרם חלבון למנה (קזאין ומי גבינה)',
      'ברזל, חומצות אמינו מסועפות (BCAA)',
      'ללא חומרים אסורים — מאושר Informed-Sport',
      'טעם שוקולד עשיר',
      'אידיאלי לאחרי אימוני כוח',
    ],
    nutrition: [
      { label: 'קלוריות', value: '190', unit: 'kcal' },
      { label: 'חלבון', value: '25', unit: 'g' },
      { label: 'פחמימות', value: '17', unit: 'g' },
      { label: 'שומן', value: '2', unit: 'g' },
      { label: 'BCAA', value: '4', unit: 'g' },
      { label: 'ברזל', value: '4', unit: 'mg' },
      { label: 'L-Glutamine', value: '3', unit: 'g' },
    ],
    faq: [
      { question: 'מה ההבדל בין H24 לפורמולה 1?', answer: 'H24 Rebuild Strength מיועד להתאוששות לאחר אימון ומכיל יותר חלבון ו-BCAA. פורמולה 1 היא תחליף ארוחה יומיומי.' },
      { question: 'מתי לשתות Rebuild Strength?', answer: 'מיד לאחר אימון, תוך 30 דקות, להתאוששות מיטבית ובניית שריר.' },
      { question: 'מה זה Informed-Sport?', answer: 'תקן בינלאומי המאשר שהמוצר אינו מכיל חומרים אסורים בספורט תחרותי.' },
      { question: 'האם מתאים לנשים?', answer: 'בהחלט, המוצר מתאים לגברים ולנשים המתאמנים ורוצים לשפר התאוששות.' },
      { question: 'מאילו סוגי חלבון עשוי?', answer: 'שילוב של חלבון מי גבינה (ספיגה מהירה) וחלבון קזאין (ספיגה איטית) לשחרור מתמשך.' },
      { question: 'כמה מנות באריזה?', answer: 'אריזה של 1 ק"ג מכילה כ-20 מנות.' },
      { question: 'האם ניתן לשלב עם PDM?', answer: 'ניתן, אך Rebuild Strength כבר מכיל 25 גרם חלבון למנה.' },
    ],
    description: 'H24 Rebuild Strength הוא חלבון מקצועי מקו ה-H24 לספורטאים של הרבלייף. מכיל 25 גרם חלבון קזאין ומי גבינה, חומצות אמינו מסועפות (BCAA) ו-L-Glutamine להתאוששות מהירה ובניית שריר. מאושר Informed-Sport — ללא חומרים אסורים.',
    usage: 'מערבבים 2 כפות (50 גרם) עם 300 מ"ל מים או חלב מיד לאחר האימון.',
  },
];

export const PRO_PRODUCT_CATEGORIES = [
  { id: 'all', name: 'הכל' },
  { id: 'weight', name: 'ניהול משקל' },
  { id: 'sport', name: 'ספורט ואנרגיה' },
  { id: 'digestion', name: 'עיכול והידרציה' },
  { id: 'lifestyle', name: 'לייף סטייל' },
];

export function getProductByHandle(handle: string): HerbalifeProduct | undefined {
  return herbalifeProducts.find(p => p.handle === handle);
}

export function getRelatedProducts(handle: string, limit = 4): HerbalifeProduct[] {
  const current = getProductByHandle(handle);
  if (!current) return herbalifeProducts.slice(0, limit);
  const sameCategory = herbalifeProducts.filter(p => p.handle !== handle && p.categoryId === current.categoryId);
  const others = herbalifeProducts.filter(p => p.handle !== handle && p.categoryId !== current.categoryId);
  return [...sameCategory, ...others].slice(0, limit);
}
