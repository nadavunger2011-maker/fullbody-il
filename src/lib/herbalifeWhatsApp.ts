import { BUSINESS, HERBALIFE_CONTACT_INTRO } from './business';

export const HERBALIFE_DOUBLE_CTA_SLUGS = ['herbalife24-guide', 'herbalife-protein-powder', 'herbalife-breakfast-routine'];
export const HERBALIFE_CTA_SLUGS = [...HERBALIFE_DOUBLE_CTA_SLUGS, 'formula1-meal-replacement-guide', 'meal-replacement-shakes-guide', 'aloe-vera-benefits-digestion'];
export const HERBALIFE_CTA_HEADING = 'רוצים התאמה אישית? דברו איתי';
export const hasHerbalifeCta = (slug: string) => HERBALIFE_CTA_SLUGS.includes(slug);
export function herbalifeWhatsAppUrl(title: string) {
  return `${BUSINESS.whatsapp}?text=${encodeURIComponent(`היי ${BUSINESS.owner.split(' ')[0]}, הגעתי מהמדריך ${title} באתר FullBody ואשמח להתייעץ על מוצרי הרבלייף`)}`;
}
export const herbalifeDirectShopUrl = (slug: string) => `https://shop.fullbody.co.il/?utm_source=fullbody_blog&utm_medium=guide&utm_campaign=${encodeURIComponent(slug)}`;

/** Lossless split: the first H2 section ends immediately before the second H2. */
export function splitHerbalifeFirstSection(html: string): [string, string] {
  const headings = [...html.matchAll(/<h2\b[^>]*>/gi)];
  const boundary = headings[1]?.index ?? html.length;
  return [html.slice(0, boundary), html.slice(boundary)];
}
const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
export function herbalifeWhatsAppCtaHtml(slug: string, title: string): string {
  if (!hasHerbalifeCta(slug)) return '';
  return `<aside data-herbalife-whatsapp-cta><h2>${HERBALIFE_CTA_HEADING}</h2><p>${escapeHtml(HERBALIFE_CONTACT_INTRO)}</p><a href="${escapeHtml(herbalifeWhatsAppUrl(title))}" target="_blank" rel="noopener">לשיחה בוואטסאפ</a><p><small><a href="${escapeHtml(herbalifeDirectShopUrl(slug))}" target="_blank" rel="noopener">או לרכישה ישירה בחנות</a></small></p></aside>`;
}
export function herbalifeArticleHtml(html: string, slug: string, title: string): string {
  if (!HERBALIFE_DOUBLE_CTA_SLUGS.includes(slug)) return html;
  const [first, rest] = splitHerbalifeFirstSection(html);
  return first + herbalifeWhatsAppCtaHtml(slug, title) + rest;
}