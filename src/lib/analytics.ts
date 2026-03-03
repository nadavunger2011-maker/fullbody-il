import { supabase } from "@/integrations/supabase/client";

// Generate a session ID that persists for the browser session
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
  };
}

// Store UTM params on first visit
let storedUtm: ReturnType<typeof getUtmParams> | null = null;
function getStoredUtm() {
  if (!storedUtm) {
    const saved = sessionStorage.getItem('analytics_utm');
    if (saved) {
      storedUtm = JSON.parse(saved);
    } else {
      storedUtm = getUtmParams();
      if (Object.values(storedUtm).some(v => v)) {
        sessionStorage.setItem('analytics_utm', JSON.stringify(storedUtm));
      }
    }
  }
  return storedUtm!;
}

// Returning visitor detection
function isReturningVisitor(): boolean {
  const key = 'analytics_visited_before';
  const visited = localStorage.getItem(key);
  if (visited) return true;
  localStorage.setItem(key, '1');
  return false;
}

interface TrackEventParams {
  event_type: string;
  page_path?: string;
  product_handle?: string;
  product_title?: string;
  product_id?: string;
  variant_id?: string;
  variant_title?: string;
  price?: number;
  quantity?: number;
  currency?: string;
  order_id?: string;
  order_total?: number;
  exit_destination?: string;
  duration_seconds?: number;
}

export async function trackEvent(params: TrackEventParams) {
  try {
    const utm = getStoredUtm();
    await supabase.from('analytics_events' as any).insert({
      ...params,
      session_id: getSessionId(),
      referrer: document.referrer || undefined,
      user_agent: navigator.userAgent,
      screen_width: window.innerWidth,
      is_returning_visitor: isReturningVisitor(),
      ...utm,
    } as any);
  } catch (e) {
    console.error('Analytics tracking error:', e);
  }
}

export function trackPageView(path: string) {
  trackEvent({ event_type: 'page_view', page_path: path });
}

export function trackProductView(product: { handle: string; title: string; id: string; price: number }) {
  trackEvent({
    event_type: 'view_item',
    page_path: `/product/${product.handle}`,
    product_handle: product.handle,
    product_title: product.title,
    product_id: product.id,
    price: product.price,
  });
}

// Track time spent on a product page + optional exit destination
export function trackProductDuration(product: { handle: string; title: string; id: string }, durationSeconds: number, exitDestination?: string) {
  if (durationSeconds < 2 || durationSeconds > 3600) return;
  trackEvent({
    event_type: 'product_duration',
    product_handle: product.handle,
    product_title: product.title,
    product_id: product.id,
    duration_seconds: durationSeconds,
    exit_destination: exitDestination,
  });
}

// Track exit from product page (where did they go)
export function trackProductExit(product: { handle: string; title: string; id: string }, exitDestination: string) {
  trackEvent({
    event_type: 'product_exit',
    product_handle: product.handle,
    product_title: product.title,
    product_id: product.id,
    exit_destination: exitDestination,
  });
}

// Track checkout initiation  
export function trackCheckoutStarted() {
  trackEvent({ event_type: 'checkout_started', page_path: '/checkout' });
}

// Track cart abandonment (user left cart without checkout)
export function trackCartAbandonment() {
  trackEvent({ event_type: 'cart_abandonment' });
}

export function trackAddToCartEvent(product: {
  handle: string; title: string; id: string;
  variantId: string; variantTitle: string;
  price: number; quantity: number;
}) {
  trackEvent({
    event_type: 'add_to_cart',
    product_handle: product.handle,
    product_title: product.title,
    product_id: product.id,
    variant_id: product.variantId,
    variant_title: product.variantTitle,
    price: product.price,
    quantity: product.quantity,
  });
}

export function trackPurchaseEvent(orderId: string, total: number, items: Array<{ handle: string; title: string; id: string; price: number; quantity: number }>) {
  items.forEach(item => {
    trackEvent({
      event_type: 'purchase',
      order_id: orderId,
      order_total: total,
      product_handle: item.handle,
      product_title: item.title,
      product_id: item.id,
      price: item.price,
      quantity: item.quantity,
    });
  });
}
