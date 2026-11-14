import { describe, it, expect } from 'vitest';
import { classifyOutbound, summarizeBlog } from '@/lib/outboundClicks';

describe('outbound click tracking', () => {
  it('classifies only the official WhatsApp hosts', () => {
    expect(classifyOutbound('https://wa.me/972542008578')).toBe('whatsapp_click');
    expect(classifyOutbound('https://api.whatsapp.com/send?phone=972542008578')).toBe('whatsapp_click');
    expect(classifyOutbound('https://evil-wa.me/x')).toBeNull();
    expect(classifyOutbound('https://api.whatsapp.com.evil.test/send')).toBeNull();
  });
  it('counts WhatsApp separately with the originating page path', () => {
    const s = summarizeBlog([{ event_type: 'whatsapp_click', page_path: '/blog/herbalife24-guide?x=1', session_id: 's1', exit_destination: 'https://wa.me/972542008578', product_title: null, created_at: '2026-11-14' }]);
    expect(s.whatsapp).toBe(1);
    expect(s.clicks).toBe(0);
    expect(s.shop).toBe(0);
    expect(s.pages[0]).toMatchObject({ path: '/blog/herbalife24-guide', whatsapp: 1, clicks: 0 });
  });
  it('counts iHerb partner links as affiliate clicks', () => {
    expect(classifyOutbound('https://iherb.pxf.io/TYJwGXB')).toBe('affiliate_click');
    expect(classifyOutbound('https://il.iherb.com/pr/x/1')).toBe('affiliate_click');
  });
  it('counts shop links separately and ignores others', () => {
    expect(classifyOutbound('https://shop.fullbody.co.il/products/x')).toBe('shop_click');
    expect(classifyOutbound('https://fullbody.co.il/blog/x')).toBeNull();
    expect(classifyOutbound('https://evil-iherb.com/x')).toBeNull();
  });
  it('attributes clicks to the article they came from', () => {
    const base = { session_id: 's1', product_title: 'x', created_at: '2026-11-11' };
    const s = summarizeBlog([
      { ...base, event_type: 'page_view', page_path: '/blog/a?x=1', exit_destination: null },
      { ...base, event_type: 'affiliate_click', page_path: '/blog/a', exit_destination: 'https://iherb.pxf.io/1' },
      { ...base, session_id: 's2', event_type: 'page_view', page_path: '/blog/b', exit_destination: null },
    ]);
    expect(s.clicks).toBe(1);
    expect(s.pages[0]).toMatchObject({ path: '/blog/a', views: 1, clicks: 1 });
    expect(s.clickRate).toBe(50);
  });
});

describe('telegram channel clicks', () => {
  it('classifies t.me links as telegram_click', () => {
    expect(classifyOutbound('https://t.me/Fullbodeals')).toBe('telegram_click');
    expect(classifyOutbound('https://evil-t.me/x')).toBeNull();
  });
});
