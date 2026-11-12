import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GUIDE_POSTS } from '../data/guidePosts';

describe('approved comparison guide modification dates', () => {
  for (const slug of ['best-protein-powder-iherb', 'best-creatine-iherb']) {
    it(`${slug} retains the approved date in generated data and sitemap`, () => {
      expect(GUIDE_POSTS.find(post => post.slug === slug)?.updatedAt).toBe('2026-11-13');
      const sitemap = readFileSync('public/sitemap.xml', 'utf8');
      const entry = sitemap.split('<url>').find(url => url.includes(`/blog/${slug}</loc>`));
      expect(entry).toContain('<lastmod>2026-11-13</lastmod>');
    });
  }
});