import { expect, it } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prerenderPlugin } from '../../scripts/prerender-plugin';
import { FEATURED_BLOG_OVERRIDES } from '../data/featuredBlogContent';
import { proBlogPosts } from '../data/proBlogPosts';
import mapping from '../../scripts/content/traffic-reading-2026-11-08.json';

it('skips the already linked workout post and inserts guide destinations in both static sources', () => {
  expect(FEATURED_BLOG_OVERRIDES['best-protein-after-workout'].content).not.toContain('data-traffic-reading');
  const meal = FEATURED_BLOG_OVERRIDES['meal-replacement-shakes-guide'].content;
  const recipes = proBlogPosts.find(p => p.slug === 'protein-shake-recipes')?.content ?? '';
  expect(meal).toContain('/blog/protein-powder-types-guide');
  expect(meal).toContain('/blog/best-protein-powder-iherb');
  expect(recipes).toContain('/blog/whey-vs-plant-protein');
});

it('prerenders the approved in-body reading links from static and live DB sources', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'traffic-prerender-'));
  try {
    writeFileSync(join(dir, 'index.html'), '<html><head></head><body><div id="root"></div></body></html>');
    const plugin = prerenderPlugin();
    const resolved = plugin.configResolved as (config: unknown) => void;
    resolved({ build: { outDir: dir } });
    const close = plugin.closeBundle as () => Promise<void>;
    await close();
    for (const item of mapping.filter(item => item.targets.length > 0)) {
      const slug = item.real;
      const doc = new DOMParser().parseFromString(readFileSync(join(dir, 'blog', slug, 'index.html'), 'utf8'), 'text/html');
      const boxes = doc.querySelectorAll('article [data-traffic-reading]');
      expect(boxes.length).toBe(1);
      expect(boxes[0].querySelectorAll('a').length).toBeGreaterThanOrEqual(2);
      expect(boxes[0].querySelectorAll('a').length).toBeLessThanOrEqual(3);
      expect(Array.from(boxes[0].querySelectorAll('a')).map(a => a.getAttribute('href'))).toEqual(item.targets.map(s => `/blog/${s}`));
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
}, 30000);