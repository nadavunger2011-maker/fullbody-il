import { expect, it } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prerenderPlugin } from '../../scripts/prerender-plugin';
import { BLOG_DUPLICATE_REDIRECTS, isIndexedSlug } from '../lib/blogIndex';
import { HOME_SUPPLEMENT_GUIDES, BLOG_SUPPLEMENT_GUIDES, POST_SUPPLEMENT_GUIDES, relatedSupplementSlugs, supplementGuideLinks } from '../lib/supplementGuideLinks';

it('includes exactly the twelve requested homepage guides with existing indexed destinations', () => {
  expect(HOME_SUPPLEMENT_GUIDES).toEqual([
    'creatine-guide', 'best-creatine-iherb', 'protein-powder-types-guide', 'best-protein-powder-iherb',
    'whey-vs-plant-protein', 'casein-protein-before-sleep', 'mass-gainer-guide', 'pre-workout-guide',
    'magnesium-types-guide', 'best-magnesium-iherb', 'magnesium-for-sleep', 'gym-supplements-what-works',
  ]);
  expect(supplementGuideLinks(BLOG_SUPPLEMENT_GUIDES)).toHaveLength(15);
  for (const slug of BLOG_SUPPLEMENT_GUIDES) expect(isIndexedSlug(slug)).toBe(true);
});

it.each([
  ['meal-replacement-shakes-guide', ['protein-powder-types-guide', 'best-protein-powder-iherb', 'protein-bars-guide', 'best-protein-after-workout']],
  ['formula1-meal-replacement-guide', ['protein-powder-types-guide', 'whey-vs-plant-protein', 'best-protein-after-workout']],
  ['sleep-quality-daily-function', ['magnesium-for-sleep', 'casein-protein-before-sleep', 'magnesium-types-guide']],
  ['aloe-vera-benefits-digestion', ['magnesium-types-guide', 'multivitamin-for-athletes', 'gym-supplements-what-works']],
  ['deep-interval-training-endurance', ['creatine-guide', 'pre-workout-guide', 'best-protein-after-workout']],
  ['home-bodyweight-training', ['creatine-guide', 'pre-workout-guide', 'best-protein-after-workout']],
  ['functional-strength-training-daily', ['creatine-guide', 'pre-workout-guide', 'best-protein-after-workout']],
])('maps %s to only its requested guides, including the real redirect destination', (source, targets) => {
  const slug = String(source);
  expect(relatedSupplementSlugs(slug)).toEqual(targets);
  expect(relatedSupplementSlugs(BLOG_DUPLICATE_REDIRECTS[slug] ?? slug)).toEqual(targets);
});

it('writes crawlable discovery blocks on homepage, blog page 1 and all seven real article pages', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'supplement-discovery-'));
  try {
    writeFileSync(join(dir, 'index.html'), '<html><head></head><body><div id="root"></div></body></html>');
    const plugin = prerenderPlugin();
    (plugin.configResolved as (config: unknown) => void)({ build: { outDir: dir } });
    await (plugin.closeBundle as () => Promise<void>)();
    const cases: [string, string[]][] = [
      ['index.html', HOME_SUPPLEMENT_GUIDES], ['blog/index.html', BLOG_SUPPLEMENT_GUIDES],
      ...Object.entries(POST_SUPPLEMENT_GUIDES).map(([source, targets]): [string, string[]] =>
        [`blog/${BLOG_DUPLICATE_REDIRECTS[source] ?? source}/index.html`, targets]),
    ];
    for (const [path, slugs] of cases) {
      const doc = new DOMParser().parseFromString(readFileSync(join(dir, path), 'utf8'), 'text/html');
      const blocks = doc.querySelectorAll('[data-supplement-guides]');
      expect(blocks.length, path).toBe(1);
      const links = Array.from(blocks[0].querySelectorAll('a'));
      expect(links.map(a => a.getAttribute('href')), path).toEqual(supplementGuideLinks(slugs).map(link => link.href));
    }
    expect(relatedSupplementSlugs('omega-3-for-athletes')).toEqual([]);
  } finally { rmSync(dir, { recursive: true, force: true }); }
}, 30000);