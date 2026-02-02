// Google Analytics 4 (gtag.js) helper
// Note: This intentionally loads GA4 directly (independent of GTM container config).

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

let initPromise: Promise<void> | null = null;
let initializedId: string | null = null;

function ensureGtagStub() {
  if (typeof window === 'undefined') return;
  // NOTE: `window.dataLayer` is already declared elsewhere (GTM). We keep runtime
  // behavior compatible with gtag.js (it pushes `arguments` arrays), and cast to
  // avoid TS conflicts with the GTM typing.
  (window as any).dataLayer = (window as any).dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtagStub() {
      // eslint-disable-next-line prefer-rest-params
      (window as any).dataLayer.push(arguments);
    };
}

function loadGaScript(measurementId: string): Promise<void> {
  if (typeof document === 'undefined') return Promise.resolve();

  const existing = document.querySelector<HTMLScriptElement>(
    `script[data-ga4="true"][src*="gtag/js?id=${measurementId}"]`
  );
  if (existing) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.async = true;
    script.dataset.ga4 = 'true';
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load GA4 script'));
    document.head.appendChild(script);
  });
}

export async function initGA4(measurementId: string) {
  if (typeof window === 'undefined') return;

  if (initializedId === measurementId && window.gtag) return;
  if (initPromise) return initPromise;

  ensureGtagStub();
  initializedId = measurementId;

  initPromise = (async () => {
    await loadGaScript(measurementId);
    window.gtag?.('js', new Date());
    window.gtag?.('config', measurementId, {
      send_page_view: false,
      debug_mode: import.meta.env.DEV,
    });
  })().finally(() => {
    // allow re-init if measurement ID changes in the future
    initPromise = null;
  });

  return initPromise;
}

export function trackGA4Event(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  ensureGtagStub();
  window.gtag?.('event', eventName, params);
}

export function trackGA4PageView(path: string) {
  trackGA4Event('page_view', {
    page_path: path,
    page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    page_title: typeof document !== 'undefined' ? document.title : undefined,
  });
}

export type GA4EcomItem = {
  item_id: string;
  item_name: string;
  item_variant?: string;
  price: number;
  quantity: number;
};

export function trackGA4ViewItem(item: GA4EcomItem, currency: string) {
  trackGA4Event('view_item', {
    currency,
    value: item.price * item.quantity,
    items: [item],
  });
}

export function trackGA4AddToCart(item: GA4EcomItem, currency: string) {
  trackGA4Event('add_to_cart', {
    currency,
    value: item.price * item.quantity,
    items: [item],
  });
}

export function trackGA4BeginCheckout(items: GA4EcomItem[], total: number, currency: string) {
  trackGA4Event('begin_checkout', {
    currency,
    value: total,
    items,
  });
}

export function trackGA4Purchase(transactionId: string, items: GA4EcomItem[], total: number, currency: string) {
  trackGA4Event('purchase', {
    transaction_id: transactionId,
    currency,
    value: total,
    items,
  });
}
