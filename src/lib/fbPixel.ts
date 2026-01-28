// Facebook Pixel tracking functions
// Pixel ID: 898424022537875

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

interface FBPixelItem {
  id: string;
  quantity: number;
  price?: number;
}

export function trackPageView() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
}

export function trackViewContent(
  contentId: string,
  contentName: string,
  value: number,
  currency: string = 'ILS'
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [contentId],
      content_name: contentName,
      content_type: 'product',
      value,
      currency
    });
  }
}

export function trackAddToCart(
  contentId: string,
  contentName: string,
  value: number,
  currency: string = 'ILS'
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [contentId],
      content_name: contentName,
      content_type: 'product',
      value,
      currency
    });
  }
}

export function trackInitiateCheckout(
  contentIds: string[],
  value: number,
  numItems: number,
  currency: string = 'ILS'
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: contentIds,
      content_type: 'product',
      value,
      currency,
      num_items: numItems
    });
  }
}

export function trackPurchase(
  contentIds: string[],
  value: number,
  numItems: number,
  currency: string = 'ILS'
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      content_ids: contentIds,
      content_type: 'product',
      value,
      currency,
      num_items: numItems
    });
  }
}
