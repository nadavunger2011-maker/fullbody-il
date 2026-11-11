export type OutboundKind = 'affiliate_click' | 'shop_click';

/** Classify an outbound link: iHerb affiliate/iHerb links vs. the separate shop. */
export function classifyOutbound(href: string): OutboundKind | null {
  let host: string;
  try { host = new URL(href).hostname.toLowerCase(); } catch { return null; }
  if (host === 'iherb.pxf.io' || host === 'iherb.com' || host.endsWith('.iherb.com')) return 'affiliate_click';
  if (host === 'shop.fullbody.co.il') return 'shop_click';
  return null;
}

/** Normalise a page path for per-article grouping (drop query/hash/trailing slash). */
export function articlePath(path: string): string {
  const p = (path || '/').split(/[?#]/)[0].replace(/\/+$/, '');
  return p || '/';
}

export interface BlogEvent { event_type: string; page_path: string | null; session_id: string | null; exit_destination: string | null; product_title: string | null; created_at: string }

export function summarizeBlog(events: BlogEvent[]) {
  const pages = new Map<string, { path: string; views: number; clicks: number; shop: number }>();
  const links = new Map<string, { href: string; text: string; clicks: number }>();
  const sessions = new Set<string>();
  const clickSessions = new Set<string>();
  let views = 0, clicks = 0, shop = 0;
  const row = (p: string) => { if (!pages.has(p)) pages.set(p, { path: p, views: 0, clicks: 0, shop: 0 }); return pages.get(p)!; };
  for (const e of events) {
    const p = articlePath(e.page_path || '/');
    if (e.session_id) sessions.add(e.session_id);
    if (e.event_type === 'page_view') { views++; row(p).views++; }
    else if (e.event_type === 'affiliate_click') {
      clicks++; row(p).clicks++;
      if (e.session_id) clickSessions.add(e.session_id);
      const href = e.exit_destination || '';
      if (!links.has(href)) links.set(href, { href, text: e.product_title || '', clicks: 0 });
      links.get(href)!.clicks++;
    } else if (e.event_type === 'shop_click') { shop++; row(p).shop++; }
  }
  return {
    sessions: sessions.size, views, clicks, shop,
    clickRate: sessions.size ? (clickSessions.size / sessions.size) * 100 : 0,
    pages: [...pages.values()].sort((a, b) => b.clicks - a.clicks || b.views - a.views),
    links: [...links.values()].sort((a, b) => b.clicks - a.clicks),
  };
}
