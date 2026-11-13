import { describe, expect, it } from 'vitest';
import { GUIDE_POSTS } from '../data/guidePosts';
import { classifyOutbound } from '../lib/outboundClicks';
import { relatedHerbalifeSlugs, supplementGuideBlockHtml, HERBALIFE_GUIDES } from '../lib/supplementGuideLinks';
import blogIndex from '../../supabase/functions/_shared/blog-index.json';

const SLUGS = { 'herbalife24-guide': 2, 'herbalife-protein-powder': 2, 'herbalife-breakfast-routine': 5 } as const;

describe.each(Object.entries(SLUGS))('%s', (slug, shopCount) => {
  const post = GUIDE_POSTS.find(p => p.slug === slug)!;
  it('has shop links with plain noopener rel and per-article UTM', () => {
    const links = [...post.content.matchAll(/<a href="(https:\/\/shop\.fullbody\.co\.il[^"]+)"([^>]*)>/g)];
    expect(links).toHaveLength(shopCount);
    for (const [, href, attrs] of links) {
      expect(href).toContain(`?utm_source=fullbody_blog&amp;utm_medium=guide&amp;utm_campaign=${slug}`);
      expect(attrs).toBe(' rel="noopener"');
      expect(classifyOutbound(href.replace(/&amp;/g, '&'))).toBe('shop_click');
    }
  });
  it('has no iHerb links and has FAQ, dates and indexing', () => {
    expect(JSON.stringify(post)).not.toMatch(/iherb\.(pxf\.io|com)/);
    expect(post.content).not.toContain('sponsored');
    expect(post.faq.length).toBe(5);
    expect(post.updatedAt).toBe('2026-11-14');
    expect(blogIndex.indexed).toContain(slug);
  });
});

it.each(['meal-replacement-shakes-guide', 'formula1-meal-replacement-guide', 'aloe-vera-benefits-digestion'])('%s gets the Herbalife guides block', slug => {
  expect(relatedHerbalifeSlugs(slug)).toEqual(HERBALIFE_GUIDES);
  const html = supplementGuideBlockHtml('מדריכי הרבלייף', relatedHerbalifeSlugs(slug));
  for (const s of HERBALIFE_GUIDES) expect(html).toContain(`href="/blog/${s}"`);
});
