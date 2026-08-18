// Shared mapping between Shopify product handles and the public site URLs.
// Herbalife (Pro) products live at /product/<pro-handle>, everything else
// (Nava catalog) lives at /nava/product/<shopify-handle>.

export const STORE_URL = 'https://fullbody.co.il';
export const SHOPIFY_STORE_DOMAIN = 'fullbody-new.myshopify.com';
export const SHOPIFY_API_VERSION = '2025-07';
export const SHOPIFY_STOREFRONT_URL =
  `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

/** Shopify handle -> Pro (Herbalife) site handle */
export const HERBALIFE_HANDLE_MAP: Record<string, string> = {
  'אבקת-פורמולה-1-וניל-550-גרם': 'formula-1-vanilla',
  'אבקת-פורמולה-1-שוקולד-550-גרם': 'formula-1-chocolate',
  'פורמולה-1-וניל-כשר-למהדרין': 'formula-1-kosher',
  'אבקת-חלבון-pdm-תוספת-חלבון-לשייק': 'pdm-protein',
  'h24-rebuild-strength-שוקולד-1-קג': 'h24-rebuild-strength',
  'תרכיז-אלוורה-צמחי-טעם-טבעי': 'aloe-natural',
  'תרכיז-אלוורה-טעם-מנגו-מרענן': 'aloe-mango',
  'נייטוורקס-niteworks-תמיכה-בלב': 'niteworks',
  'פורמולה-1-קפה-לאטה-550-גרם': 'latte',
  'פורמולה-1-מלון-550-גרם': 'formula-1-melon',
  'פורמולה-1-פירות-יער-550-גרם': 'formula-1-berries',
  'פורמולה-1-עוגיות-שוקולד-550-גרם': 'formula-1-cookies',
  'פורמולה-1-בננה-550-גרם': 'formula-1-banana',
  'אבקת-חלבון-הרבלייף': 'protein-powder',
  'חטיפי-חלבון-בטעם-וניל-ושקדים': 'protein-bars-vanilla-almond',
  'חטיף-חלבון-h24-achieve-שוקולד-מריר': 'h24-achieve-dark-chocolate',
  'חטיף-חלבון-אפוי-טעם-ברביקיו': 'baked-protein-bbq',
  'חטיפי-חלבון-בטעם-לימון': 'protein-bars-lemon',
  'אבקת-סיבים-תזונתיים-תפוח': 'fiber-apple',
  'טבליות-תרמו-קומפליט': 'thermo-complete',
  'פורמולה-2-קומפלקס-ויטמינים-ומינרלים-לנשים': 'formula-2-women',
  'פורמולה-2-קומפלקס-ויטמינים-ומינרלים-לגברים': 'formula-2-men',
  'משקה-נמס-צמחי-בטעם-אפרסק': 'instant-herbal-peach',
  'משקה-נמס-צמחי-בטעם-מקור': 'instant-herbal-original',
  'משקה-נמס-צמחי-בטעם-לימון': 'instant-herbal-lemon',
  'משקה-נמס-צמחי-בטעם-פטל': 'instant-herbal-raspberry',
  'הרבלייפליין-מקס-אומגה-3': 'herbalifeline-max',
  'טבליות-שיזנדרה-פלוס': 'schizandra-plus',
};

export function isHerbalife(shopifyHandle: string): boolean {
  return Boolean(HERBALIFE_HANDLE_MAP[shopifyHandle]);
}

/** Canonical public product URL for a Shopify handle. */
export function productUrl(shopifyHandle: string): string {
  const proHandle = HERBALIFE_HANDLE_MAP[shopifyHandle];
  return proHandle
    ? `${STORE_URL}/product/${proHandle}`
    : `${STORE_URL}/nava/product/${encodeURIComponent(shopifyHandle)}`;
}

/** Brand used in product feeds. */
export function brandFor(shopifyHandle: string, vendor?: string | null): string {
  if (isHerbalife(shopifyHandle)) return 'Herbalife';
  return vendor && vendor.trim() ? vendor : 'Nava';
}
