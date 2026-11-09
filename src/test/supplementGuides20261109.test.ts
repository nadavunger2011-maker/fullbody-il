import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { GUIDE_POSTS } from '../data/guidePosts';

const tracked = (slug: string, url: string) =>
  `https://iherb.pxf.io/c/3215306/1665867/19332?subId1=${slug}&u=${encodeURIComponent(url)}`;
const expected: Record<string, string> = {
  'bcaa-guide': 'https://www.iherb.com/pr/xtend-7g-bcaa-mango-madness-14-3-oz-405-g/57800',
  'fat-burner-guide': 'https://www.iherb.com/pr/muscletech-hydroxycut-hardcore-super-elite-120-rapid-release-thermo-capsules/106000',
  'omega-3-for-athletes': 'https://www.iherb.com/pr/california-gold-nutrition-omega-3-premium-fish-oil-100-fish-gelatin-softgels-1-100-mg-per-softgel/62118',
};

describe('2026-11-09 supplement guides', () => {
  for (const [slug, product] of Object.entries(expected)) {
    it(`${slug} links its one product with its own subId1 and sponsored rel`, () => {
      const post = GUIDE_POSTS.find(p => p.slug === slug)!;
      expect(post.date).toBe('2026-11-09');
      expect(post.categoryId).toBe('fitness');
      const links = [...post.content.matchAll(/<a href="(https:\/\/iherb[^"]+)"([^>]*)>/g)];
      expect(links.map(m => m[1].replace(/&amp;/g, '&'))).toEqual([tracked(slug, product)]);
      expect(links[0][2]).toContain('rel="sponsored nofollow noopener"');
    });
  }
  it('indexes the three guides', () => {
    const index = JSON.parse(readFileSync('supabase/functions/_shared/blog-index.json', 'utf8'));
    for (const slug of Object.keys(expected)) expect(JSON.stringify(index)).toContain(`"${slug}"`);
  });
});
