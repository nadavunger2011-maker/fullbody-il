import { describe, it, expect, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { HERBALIFE_CTA_SLUGS, HERBALIFE_DOUBLE_CTA_SLUGS, hasHerbalifeCta, herbalifeWhatsAppUrl, herbalifeDirectShopUrl, herbalifeArticleHtml, herbalifeWhatsAppCtaHtml, splitHerbalifeFirstSection } from '@/lib/herbalifeWhatsApp';
import { HerbalifeFloatingWhatsApp } from '@/components/HerbalifeWhatsAppCta';

afterEach(() => { cleanup(); sessionStorage.clear(); });
describe('Herbalife personal contact', () => {
  it('is restricted to the six approved posts', () => {
    expect(HERBALIFE_CTA_SLUGS).toEqual(['herbalife24-guide', 'herbalife-protein-powder', 'herbalife-breakfast-routine', 'formula1-meal-replacement-guide', 'meal-replacement-shakes-guide', 'aloe-vera-benefits-digestion']);
    expect(hasHerbalifeCta('creatine-guide')).toBe(false);
    expect(herbalifeWhatsAppCtaHtml('creatine-guide', 'קריאטין')).toBe('');
  });
  it('uses the owner number and encoded article-specific message', () => {
    const url = new URL(herbalifeWhatsAppUrl('הרבלייף 24 & כושר'));
    expect(url.origin + url.pathname).toBe('https://wa.me/972542008578');
    expect(url.searchParams.get('text')).toBe('היי נדב, הגעתי מהמדריך הרבלייף 24 & כושר באתר FullBody ואשמח להתייעץ על מוצרי הרבלייף');
  });
  it('keeps direct shop attribution on the secondary destination', () => {
    expect(herbalifeDirectShopUrl('herbalife24-guide')).toBe('https://shop.fullbody.co.il/?utm_source=fullbody_blog&utm_medium=guide&utm_campaign=herbalife24-guide');
  });
  for (const slug of HERBALIFE_CTA_SLUGS) {
    it(`places ${slug} contact without modifying any article HTML`, () => {
      const original = '<p>פתיחה</p><h2>ראשון</h2><p>טקסט מדויק <a href="https://shop.fullbody.co.il/?x=1">חנות</a></p><h2>שני</h2><p>המשך</p>';
      const [first, rest] = splitHerbalifeFirstSection(original);
      expect(first + rest).toBe(original);
      expect(first).toBe(original.slice(0, original.indexOf('<h2>שני')));
      const card = herbalifeWhatsAppCtaHtml(slug, 'כותרת');
      const result = herbalifeArticleHtml(original, slug, 'כותרת');
      const double = HERBALIFE_DOUBLE_CTA_SLUGS.includes(slug);
      expect(result).toBe(double ? first + card + rest : original);
      expect((result + card).split('data-herbalife-whatsapp-cta').length - 1).toBe(double ? 2 : 1);
      expect(result.replace(card, '')).toBe(original);
    });
  }
  it('remembers dismissal on that page and keeps cards unaffected', () => {
    const view = render(<HerbalifeFloatingWhatsApp slug="herbalife24-guide" title="מדריך" />);
    fireEvent.click(view.getByRole('button', { name: 'סגירת כפתור וואטסאפ' }));
    expect(sessionStorage.getItem('fb_herbalife_wa_dismissed:herbalife24-guide')).toBe('1');
    view.unmount();
    const again = render(<HerbalifeFloatingWhatsApp slug="herbalife24-guide" title="מדריך" />);
    expect(again.queryByRole('link')).toBeNull();
    again.rerender(<HerbalifeFloatingWhatsApp slug="herbalife-protein-powder" title="חלבון" />);
    expect(again.getByRole('link')).toHaveAttribute('href', herbalifeWhatsAppUrl('חלבון'));
  });
});