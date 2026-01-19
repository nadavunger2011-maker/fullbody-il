// Google Tag Manager tracking functions

interface GTMItem {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price: number;
  quantity: number;
  currency: string;
}

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

function pushToDataLayer(event: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(event);
  }
}

export function trackViewItem(item: GTMItem) {
  pushToDataLayer({
    event: 'view_item',
    ecommerce: {
      currency: item.currency,
      value: item.price * item.quantity,
      items: [item]
    }
  });
}

export function trackAddToCart(item: GTMItem) {
  pushToDataLayer({
    event: 'add_to_cart',
    ecommerce: {
      currency: item.currency,
      value: item.price * item.quantity,
      items: [item]
    }
  });
}

export function trackViewCart(items: GTMItem[], total: number, currency: string) {
  pushToDataLayer({
    event: 'view_cart',
    ecommerce: {
      currency,
      value: total,
      items
    }
  });
}

export function trackRemoveFromCart(item: GTMItem) {
  pushToDataLayer({
    event: 'remove_from_cart',
    ecommerce: {
      currency: item.currency,
      value: item.price * item.quantity,
      items: [item]
    }
  });
}

export function trackBeginCheckout(items: GTMItem[], total: number, currency: string) {
  pushToDataLayer({
    event: 'begin_checkout',
    ecommerce: {
      currency,
      value: total,
      items
    }
  });
}

export function trackPurchase(
  transactionId: string,
  items: GTMItem[],
  total: number,
  currency: string
) {
  pushToDataLayer({
    event: 'purchase',
    ecommerce: {
      transaction_id: transactionId,
      currency,
      value: total,
      items
    }
  });
}
