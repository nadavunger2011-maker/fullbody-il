export type SweetsCategory = {
  id: string;
  name: string;
  description: string;
  emoji: string;
  href: string;
};

export const SWEETS_CATEGORIES_FULL: SweetsCategory[] = [
  { id: 'protein-bars', name: 'חטיפי חלבון', description: 'עד 20 גרם חלבון לחטיף', emoji: '💪', href: '/sweets/category/protein-bars' },
  { id: 'chocolate', name: 'שוקולד ללא סוכר', description: 'הפינוק שמתאים לכל דיאטה', emoji: '🍫', href: '/sweets/category/chocolate' },
  { id: 'cookies', name: 'עוגיות', description: 'קראנצ׳י, מתוק, ובלי אשמה', emoji: '🍪', href: '/sweets/category/cookies' },
  { id: 'tasting', name: 'מארזי טעימה', description: 'הכירו את הקו במחיר נחסך', emoji: '🎁', href: '/sweets/category/tasting' },
  { id: 'gifts', name: 'מארזי מתנה', description: 'מתנה בריאה שאוהבים לקבל', emoji: '🎀', href: '/sweets/category/gifts' },
];

export type SweetsProduct = {
  id: string;
  handle: string;
  name: string;
  category: string;
  price: number;
  comparePrice?: number;
  image: string;
  proteinG: number;
  caloriesPerUnit: number;
  badge?: string;
};

export const BESTSELLERS: SweetsProduct[] = [
  {
    id: 'bar-choco',
    handle: 'protein-bar-chocolate',
    name: 'חטיף חלבון שוקולד',
    category: 'חטיפי חלבון',
    price: 12,
    comparePrice: 15,
    image: 'https://images.unsplash.com/photo-1571506165871-ee72a35bc9d4?w=600&auto=format&fit=crop',
    proteinG: 20,
    caloriesPerUnit: 190,
    badge: 'הכי נמכר',
  },
  {
    id: 'choc-dark',
    handle: 'no-sugar-dark-chocolate',
    name: 'שוקולד מריר ללא סוכר',
    category: 'שוקולד',
    price: 18,
    image: 'https://images.unsplash.com/photo-1548907040-4d42bea7f7d0?w=600&auto=format&fit=crop',
    proteinG: 6,
    caloriesPerUnit: 140,
  },
  {
    id: 'cookie-oat',
    handle: 'protein-oat-cookies',
    name: 'עוגיות שיבולת שועל וחלבון',
    category: 'עוגיות',
    price: 24,
    comparePrice: 29,
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&auto=format&fit=crop',
    proteinG: 10,
    caloriesPerUnit: 120,
    badge: 'חדש',
  },
  {
    id: 'taste-box',
    handle: 'tasting-box',
    name: 'מארז טעימות (6 יחידות)',
    category: 'מארז',
    price: 79,
    comparePrice: 99,
    image: 'https://images.unsplash.com/photo-1587482415458-42f9d1dcbf34?w=600&auto=format&fit=crop',
    proteinG: 15,
    caloriesPerUnit: 170,
    badge: 'חסכון 20%',
  },
];
