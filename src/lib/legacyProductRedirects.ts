export const PRODUCT_COLLECTION_URL = 'https://shop.fullbody.co.il/collections/all';

export const LEGACY_PRODUCT_HANDLES: Readonly<Record<string, string>> = {
  'aloe-mango': 'תרכיז-אלוורה-טעם-מנגו-מרענן',
  'aloe-natural': 'תרכיז-אלוורה-צמחי-טעם-טבעי',
  'baked-protein-bbq': 'חטיף-חלבון-אפוי-טעם-ברביקיו',
  'fiber-apple': 'אבקת-סיבים-תזונתיים-תפוח',
  'formula-1-banana': 'פורמולה-1-בננה-550-גרם',
  'formula-1-berries': 'פורמולה-1-פירות-יער-550-גרם',
  'formula-1-chocolate': 'אבקת-פורמולה-1-שוקולד-550-גרם',
  'formula-1-cookies': 'פורמולה-1-עוגיות-שוקולד-550-גרם',
  'formula-1-kosher': 'פורמולה-1-וניל-כשר-למהדרין',
  'formula-1-melon': 'פורמולה-1-מלון-550-גרם',
  'formula-1-vanilla': 'אבקת-פורמולה-1-וניל-550-גרם',
  'formula-2-men': 'פורמולה-2-קומפלקס-ויטמינים-ומינרלים-לגברים',
  'formula-2-women': 'פורמולה-2-קומפלקס-ויטמינים-ומינרלים-לנשים',
  'h24-achieve-dark-chocolate': 'חטיף-חלבון-h24-achieve-שוקולד-מריר',
  'h24-rebuild-strength': 'h24-rebuild-strength-שוקולד-1-קג',
  'herbalifeline-max': 'הרבלייפליין-מקס-אומגה-3',
  'instant-herbal-lemon': 'משקה-נמס-צמחי-בטעם-לימון',
  'instant-herbal-original': 'משקה-נמס-צמחי-בטעם-מקור',
  'instant-herbal-peach': 'משקה-נמס-צמחי-בטעם-אפרסק',
  'instant-herbal-raspberry': 'משקה-נמס-צמחי-בטעם-פטל',
  latte: 'פורמולה-1-קפה-לאטה-550-גרם',
  niteworks: 'נייטוורקס-niteworks-תמיכה-בלב',
  'pdm-protein': 'אבקת-חלבון-pdm-תוספת-חלבון-לשייק',
  'protein-bars-lemon': 'חטיפי-חלבון-בטעם-לימון',
  'protein-bars-vanilla-almond': 'חטיפי-חלבון-בטעם-וניל-ושקדים',
  'protein-powder': 'אבקת-חלבון-הרבלייף',
  'schizandra-plus': 'טבליות-שיזנדרה-פלוס',
  'thermo-complete': 'טבליות-תרמו-קומפליט',
};

export function legacyProductTarget(slug?: string): string {
  const handle = slug && Object.prototype.hasOwnProperty.call(LEGACY_PRODUCT_HANDLES, slug)
    ? LEGACY_PRODUCT_HANDLES[slug]
    : undefined;
  return handle
    ? `https://shop.fullbody.co.il/products/${encodeURIComponent(handle)}`
    : PRODUCT_COLLECTION_URL;
}