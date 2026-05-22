// Flashy custom event helpers - structured payloads for email automations

export interface FlashyAddedToCartPayload {
  product_id: string;
  product_name: string;
  price: number;
  currency: string;
  image_url: string;
}

/**
 * Fires a Flashy "AddedToCart" event with a structured payload
 * suitable for downstream email automation triggers.
 */
export function trackFlashyAddedToCart(payload: FlashyAddedToCartPayload) {
  if (typeof window === 'undefined' || !window.flashy) return;
  try {
    window.flashy('AddedToCart', payload as unknown as Record<string, unknown>);
  } catch (err) {
    console.error('Flashy AddedToCart failed:', err);
  }
}
