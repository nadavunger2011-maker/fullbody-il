// Shopify Types
export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText?: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: ShopifyPrice;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface ShopifyProductNode {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: ShopifyPrice;
  };
  images: {
    edges: Array<{ node: ShopifyImage }>;
  };
  variants: {
    edges: Array<{ node: ShopifyVariant }>;
  };
}

export interface ShopifyProduct {
  node: ShopifyProductNode;
}

export interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  variantTitle: string;
  price: ShopifyPrice;
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

// Mock data for demo purposes
const mockProducts: ShopifyProduct[] = [
  {
    node: {
      id: 'product-1',
      title: 'אבקת חלבון מי גבינה פרימיום',
      handle: 'whey-protein-premium',
      description: 'אבקת חלבון איכותית עם 25 גרם חלבון למנה. טעם שוקולד עשיר ומענג.',
      priceRange: {
        minVariantPrice: { amount: '149', currencyCode: 'ILS' }
      },
      images: {
        edges: [
          { node: { url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500', altText: 'Protein Powder' } }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: 'variant-1',
              title: '1 ק"ג',
              price: { amount: '149', currencyCode: 'ILS' },
              availableForSale: true,
              selectedOptions: [{ name: 'גודל', value: '1 ק"ג' }]
            }
          },
          {
            node: {
              id: 'variant-2',
              title: '2.5 ק"ג',
              price: { amount: '299', currencyCode: 'ILS' },
              availableForSale: true,
              selectedOptions: [{ name: 'גודל', value: '2.5 ק"ג' }]
            }
          }
        ]
      }
    }
  },
  {
    node: {
      id: 'product-2',
      title: 'קריאטין מונוהידראט',
      handle: 'creatine-monohydrate',
      description: 'קריאטין טהור לשיפור כוח וביצועים בחדר הכושר.',
      priceRange: {
        minVariantPrice: { amount: '89', currencyCode: 'ILS' }
      },
      images: {
        edges: [
          { node: { url: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=500', altText: 'Creatine' } }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: 'variant-3',
              title: '300 גרם',
              price: { amount: '89', currencyCode: 'ILS' },
              availableForSale: true,
              selectedOptions: [{ name: 'גודל', value: '300 גרם' }]
            }
          }
        ]
      }
    }
  },
  {
    node: {
      id: 'product-3',
      title: 'BCAA אמינו חיוניים',
      handle: 'bcaa-amino',
      description: 'חומצות אמינו חיוניות לשיקום שרירים ומניעת קטבוליזם.',
      priceRange: {
        minVariantPrice: { amount: '119', currencyCode: 'ILS' }
      },
      images: {
        edges: [
          { node: { url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500', altText: 'BCAA' } }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: 'variant-4',
              title: '30 מנות',
              price: { amount: '119', currencyCode: 'ILS' },
              availableForSale: true,
              selectedOptions: [{ name: 'גודל', value: '30 מנות' }]
            }
          }
        ]
      }
    }
  },
  {
    node: {
      id: 'product-4',
      title: 'פרה-וורקאאוט אנרגיה',
      handle: 'pre-workout-energy',
      description: 'תוסף לפני אימון עם קפאין ובטא-אלנין לאנרגיה ופוקוס.',
      priceRange: {
        minVariantPrice: { amount: '139', currencyCode: 'ILS' }
      },
      images: {
        edges: [
          { node: { url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500', altText: 'Pre-workout' } }
        ]
      },
      variants: {
        edges: [
          {
            node: {
              id: 'variant-5',
              title: '30 מנות',
              price: { amount: '139', currencyCode: 'ILS' },
              availableForSale: true,
              selectedOptions: [{ name: 'גודל', value: '30 מנות' }]
            }
          }
        ]
      }
    }
  }
];

export async function fetchShopifyProducts(limit: number = 20): Promise<ShopifyProduct[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockProducts.slice(0, limit);
}

export async function createShopifyCheckout(items: CartItem[]): Promise<string> {
  // Mock checkout URL
  console.log('Creating checkout with items:', items);
  return '/thank-you';
}
