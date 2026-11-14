import { describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { GUIDE_POSTS } from '../data/guidePosts';
import { prerenderPlugin } from '../../scripts/prerender-plugin';

const base = 'https://iherb.pxf.io/c/3215306/1665867/19332?u=https%3A%2F%2Fwww.iherb.com%2F';
const creatine = 'https://iherb.pxf.io/TYJwGXB';
const gainerCategory = base + 'c%2FWeight-Gainers';
const expected: Record<string, string[]> = {
  'creatine-guide': [base + 'c%2Fcreatine-monohydrate', creatine],
  'mass-gainer-guide': [gainerCategory, base + 'pr%2Foptimum-nutrition-serious-mass-vanilla-6-lb-2-72-kg%2F66478', gainerCategory],
  'protein-powder-types-guide': ['https://iherb.pxf.io/AgOK61', base + 'pr%2Foptimum-nutrition-gold-standard-100-whey-protein-double-rich-chocolate-5-05-lb-2-29-kg%2F27509', base + 'pr%2Fcalifornia-gold-nutrition-sport-whey-protein-isolate-unflavored-5-lb-2-27-kg%2F76479', base + 'pr%2Fnow-foods-sports-pea-protein-pure-unflavored-2-lbs-907-g%2F9858'],
  'gym-supplements-what-works': ['https://iherb.pxf.io/AgOK61', creatine, base + 'pr%2Fnow-foods-sports-beta-alanine-pure-powder-17-6-oz-500-g%2F10940'],
  'best-creatine-iherb': [creatine, 'https://iherb.pxf.io/bkB1YP', 'https://iherb.pxf.io/NGxy91', 'https://iherb.pxf.io/5kd049', 'https://iherb.pxf.io/PzQMJY', 'https://iherb.pxf.io/bkB1E9'],
  'creatine-monohydrate-vs-hcl': [creatine, 'https://iherb.pxf.io/bkB1E9'],
  'does-creatine-cause-weight-gain': [],
  'creatine-for-women': [creatine, 'https://iherb.pxf.io/bkB1YP'],
  'creatine-side-effects': [creatine],
};

const products = {
  on_whey: 'https://www.iherb.com/pr/optimum-nutrition-gold-standard-100-whey-protein-double-rich-chocolate-5-05-lb-2-29-kg/27509',
  cgn_iso_van: 'https://www.iherb.com/pr/california-gold-nutrition-whey-protein-isolate-very-vanilla-5-lb-2-27-kg/82707',
  cgn_iso_unf: 'https://www.iherb.com/pr/california-gold-nutrition-sport-whey-protein-isolate-unflavored-5-lb-2-27-kg/76479',
  now_pea: 'https://www.iherb.com/pr/now-foods-sports-pea-protein-pure-unflavored-2-lbs-907-g/9858',
  on_casein: 'https://www.iherb.com/pr/optimum-nutrition-gold-standard-100-casein-chocolate-supreme-1-87-lb-850-g/27527',
  mg_db: 'https://www.iherb.com/pr/doctor-s-best-high-absorption-magnesium-120-tablets-100-mg-per-tablet/15',
  mg_cgn: 'https://www.iherb.com/pr/california-gold-nutrition-magnesium-bisglycinate-chelate-albion-traacs-240-veggie-capsules-100-mg-per-capsule/103274',
  mg_citrate: 'https://www.iherb.com/pr/now-foods-magnesium-citrate-200-mg-250-tablets/691',
  mg_now_caps: 'https://www.iherb.com/pr/now-foods-magnesium-caps-400-mg-180-veg-capsules/662',
  mg_threonate: 'https://www.iherb.com/pr/life-extension-neuro-mag-magnesium-l-threonate-90-vegetarian-capsules-48-mg-per-capsule/40244',
};
const aff = (slug: string, key: keyof typeof products) =>
  `https://iherb.pxf.io/c/3215306/1665867/19332?subId1=${slug}&u=${encodeURIComponent(products[key])}`;
const proteinGuides: Record<string, (keyof typeof products)[]> = {
  'best-protein-powder-iherb': ['cgn_iso_unf', 'cgn_iso_van', 'now_pea', 'on_whey', 'on_casein'],
  'casein-protein-before-sleep': ['on_casein'],
  'protein-powder-for-women': ['cgn_iso_van', 'now_pea', 'cgn_iso_unf'],
  'whey-vs-plant-protein': ['now_pea', 'cgn_iso_unf', 'on_whey'],
};
for (const [slug, keys] of Object.entries(proteinGuides)) expected[slug] = keys.map(k => aff(slug, k));
const magnesiumGuides: Record<string, (keyof typeof products)[]> = {
  'magnesium-types-guide': [],
  'best-magnesium-iherb': ['mg_db', 'mg_cgn', 'mg_citrate', 'mg_now_caps', 'mg_threonate'],
  'magnesium-oxide': ['mg_now_caps'],
  'magnesium-for-sleep': ['mg_db', 'mg_cgn'],
};
for (const [slug, keys] of Object.entries(magnesiumGuides)) expected[slug] = keys.map(k => aff(slug, k));
expected['best-protein-powder-iherb'].splice(3, 0, 'https://iherb.pxf.io/zzKoZM');
expected['whey-vs-plant-protein'].splice(1, 0, 'https://iherb.pxf.io/zzKoZM');
expected['best-magnesium-iherb'].splice(4, 0, 'https://iherb.pxf.io/B53vmL');
const practicalGuides: Record<string, string> = {
  'protein-bars-guide': 'https://iherb.pxf.io/VOkMz3',
  'pre-workout-guide': 'https://iherb.pxf.io/aNoMvZ',
  'multivitamin-for-athletes': 'https://iherb.pxf.io/gRnxMB',
};
for (const [slug, url] of Object.entries(practicalGuides)) expected[slug] = [url];

function verify(content: string, urls: string[]) {
  const doc = new DOMParser().parseFromString(content, 'text/html');
  const links = [...doc.querySelectorAll<HTMLAnchorElement>('a[href^="https://iherb.pxf.io/"]')];
  expect(links.map(a => a.getAttribute('href'))).toEqual(urls);
  for (const a of links) {
    expect(a.target).toBe('_blank');
    expect(a.rel).toBe('sponsored nofollow noopener');
  }
}

describe('approved guide affiliate destinations', () => {
  for (const [slug, urls] of Object.entries(expected)) {
    it(`${slug} preserves exact encoded destinations and affiliate attributes`, () => {
      const post = GUIDE_POSTS.find(p => p.slug === slug);
      expect(post).toBeDefined();
      if (!post) return;
      verify(post.content, urls);
    });
  }

  it('regeneration restores the approved sections and links without duplication', () => {
    const result = execFileSync('python3', ['-c', `
import importlib.util, json, re
from pathlib import Path
spec = importlib.util.spec_from_file_location('guides', 'scripts/build_guide_posts.py')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
posts = json.loads(re.search(r'= (\\[.*\\]);', Path('src/data/guidePosts.ts').read_text(), re.S).group(1))
for p in posts:
    if p['slug'] not in m.AFFILIATE_SECTIONS:
        continue
    section, _ = m.convert(m.AFFILIATE_SECTIONS[p['slug']])
    original = p['content'].replace(section + '\\n', '').removesuffix('\\n' + section)
    original = original.replace(m.affiliate_link('iHerb', m.CREATINE_CATEGORY), m.affiliate_link('iHerb', 'https://iherb.pxf.io/AgOK61')).replace(m.affiliate_link('iHerb', m.GAINER_CATEGORY), m.affiliate_link('iHerb', 'https://iherb.pxf.io/AgOK61'))
    assert m.apply_affiliate_sections(original, p['slug']) == p['content']
    assert m.apply_affiliate_sections(p['content'], p['slug']) == p['content']
print('ok')
`], { cwd: process.cwd(), encoding: 'utf8' });
    expect(result.trim()).toBe('ok');
  });

  it('the actual build-time prerender hook retains all affiliate destinations', async () => {
    const out = mkdtempSync(join(tmpdir(), 'fullbody-prerender-'));
    try {
      writeFileSync(join(out, 'index.html'), '<html lang="he"><head></head><body><div id="root"></div></body></html>');
      const plugin = prerenderPlugin();
      const configure = plugin.configResolved;
      const close = plugin.closeBundle;
      if (typeof configure !== 'function' || typeof close !== 'function') throw new Error('Prerender hooks unavailable');
      await configure.call(null as never, { build: { outDir: out } } as never);
      await close.call(null as never);
      for (const [slug, urls] of Object.entries(expected)) {
        const rendered = readFileSync(join(out, 'blog', slug, 'index.html'), 'utf8');
        verify(rendered, urls);
        const post = GUIDE_POSTS.find(p => p.slug === slug);
        if (!post) throw new Error(`Missing guide ${slug}`);
        const doc = new DOMParser().parseFromString(rendered, 'text/html');
        expect(doc.title).toBe(`${post.seoTitle} | FullBody`);
        expect(doc.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(post.metaDescription);
        expect(rendered).toContain(post.content);
        const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(s => JSON.parse(s.textContent || '{}'));
        const article = schemas.find(s => s['@type'] === 'Article');
        expect(article.datePublished).toBe(post.date);
        expect(article.dateModified).toBe(post.updatedAt);
        expect(schemas.find(s => s['@type'] === 'FAQPage').mainEntity).toHaveLength(post.faq.length);
        if (slug in practicalGuides) {
          expect([...doc.querySelectorAll('a')].some(a => a.getAttribute('href')?.includes('utm_medium=article'))).toBe(false);
          expect(doc.querySelector('meta[name="robots"]')).toBeNull();
          const listing = new DOMParser().parseFromString(readFileSync(join(out, 'blog', 'index.html'), 'utf8'), 'text/html');
          expect(listing.querySelector(`a[href="/blog/${slug}"]`)).not.toBeNull();
        }
      }
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  }, 30000);

  it('new guides regenerate exactly from retained markdown with no implicit iHerb links', () => {
    const result = execFileSync('python3', ['-c', `
import importlib.util, json, re
from pathlib import Path
spec = importlib.util.spec_from_file_location('guides', 'scripts/build_guide_posts.py')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
posts = json.loads(re.search(r'= (\\[.*\\]);', Path('src/data/guidePosts.ts').read_text(), re.S).group(1))
for p in posts:
    if p['slug'] in m.EXPLICIT_AFFILIATE_ONLY:
        src = next(d for d in ['scripts/content/creatine-guides', 'scripts/content/protein-guides', 'scripts/content/magnesium-guides', 'scripts/content/practical-supplement-guides', 'scripts/content/supplement-guides-2026-11-09', 'scripts/content/herbalife-guides'] if Path(d, p['slug'] + '.md').exists())
        body, faq = m.convert(Path(src, p['slug'] + '.md').read_text(), auto_link_iherb=False, linked_faq=True, slug=p['slug'])
        if p['slug'] in m.FURTHER_READING:
            body = body + chr(10) + '<p>' + m.inline(m.FURTHER_READING[p['slug']], auto_link_iherb=False) + '</p>'
        assert body == p['content'] and faq == p['faq']
assert m.aff_url('now_pea', 'x') == 'https://iherb.pxf.io/c/3215306/1665867/19332?subId1=x&u=https%3A%2F%2Fwww.iherb.com%2Fpr%2Fnow-foods-sports-pea-protein-pure-unflavored-2-lbs-907-g%2F9858'
assert m.inline('iHerb [מוצר](https://iherb.pxf.io/bkB1YP)', auto_link_iherb=False) == 'iHerb ' + m.affiliate_link('מוצר', 'https://iherb.pxf.io/bkB1YP')
print('ok')
`], { encoding: 'utf8' });
    expect(result.trim()).toBe('ok');
  });

  it('new guides retain approved dates and internal destinations including FAQ answers', () => {
    const slugs = ['best-creatine-iherb', 'creatine-monohydrate-vs-hcl', 'does-creatine-cause-weight-gain', 'creatine-for-women'];
    const policy = JSON.parse(readFileSync('supabase/functions/_shared/blog-index.json', 'utf8'));
    for (const slug of slugs) {
      const post = GUIDE_POSTS.find(p => p.slug === slug);
      if (!post) throw new Error(`Missing ${slug}`);
      expect(post.date).toBe('2026-11-05');
      expect(post.updatedAt).toBe(slug === 'best-creatine-iherb' ? '2026-11-13' : '2026-11-05');
      expect(policy.indexed).toContain(slug);
      const doc = new DOMParser().parseFromString(post.content + post.faq.map(f => f.answer).join(''), 'text/html');
      for (const a of doc.querySelectorAll('a[href^="/"]')) {
        const href = a.getAttribute('href');
        expect(href === '/protein-calculator' || GUIDE_POSTS.some(p => `/blog/${p.slug}` === href)).toBe(true);
      }
      expect([...doc.querySelectorAll('a')].some(a => a.textContent === 'iHerb')).toBe(false);
    }
    const guide = GUIDE_POSTS.find(p => p.slug === 'creatine-guide');
    if (!guide) throw new Error('Missing creatine guide');
    const links = new DOMParser().parseFromString(guide.content.split('<h2>השורה התחתונה</h2>')[1], 'text/html');
    for (const slug of slugs) expect(links.querySelector(`a[href="/blog/${slug}"]`)).not.toBeNull();
  });

  it('protein guides are dated, indexed, link internally to existing pages and the types guide links to all four', () => {
    const policy = JSON.parse(readFileSync('supabase/functions/_shared/blog-index.json', 'utf8'));
    const known = new Set(['/protein-calculator', '/blog/best-protein-after-workout', '/blog/protein-shake-recipes', ...GUIDE_POSTS.map(p => `/blog/${p.slug}`)]);
    for (const slug of Object.keys(proteinGuides)) {
      const post = GUIDE_POSTS.find(p => p.slug === slug);
      if (!post) throw new Error(`Missing ${slug}`);
      expect(post.date).toBe('2026-11-06');
      expect(post.updatedAt).toBe(slug === 'best-protein-powder-iherb' ? '2026-11-13' : slug === 'whey-vs-plant-protein' ? '2026-11-07' : '2026-11-06');
      expect(policy.indexed).toContain(slug);
      const doc = new DOMParser().parseFromString(post.content + post.faq.map(f => f.answer).join(''), 'text/html');
      for (const a of doc.querySelectorAll('a[href^="/"]')) expect(known.has(a.getAttribute('href') || '')).toBe(true);
      expect([...doc.querySelectorAll('a')].some(a => a.textContent === 'iHerb')).toBe(false);
    }
    const types = GUIDE_POSTS.find(p => p.slug === 'protein-powder-types-guide');
    if (!types) throw new Error('Missing types guide');
    const bottom = new DOMParser().parseFromString(types.content.split('<h2>השורה התחתונה</h2>')[1], 'text/html');
    for (const slug of Object.keys(proteinGuides)) expect(bottom.querySelector(`a[href="/blog/${slug}"]`)).not.toBeNull();
  });

  for (const slug of Object.keys(magnesiumGuides)) {
    it(`${slug} has today's dates, nutrition category, no products and only approved internal destinations`, () => {
      const post = GUIDE_POSTS.find(p => p.slug === slug);
      if (!post) throw new Error(`Missing ${slug}`);
      expect(post.date).toBe('2026-11-07');
      expect(post.updatedAt).toBe('2026-11-07');
      expect(post.categoryId).toBe('nutrition');
      expect(post.relatedProductHandles).toEqual([]);
      const policy = JSON.parse(readFileSync('supabase/functions/_shared/blog-index.json', 'utf8'));
      expect(policy.indexed).toContain(slug);
      const known = new Set([...Object.keys(magnesiumGuides), 'magnesium-bisglycinate', 'gym-supplements-what-works'].map(s => `/blog/${s}`));
      const doc = new DOMParser().parseFromString(post.content + post.faq.map(f => f.answer).join(''), 'text/html');
      for (const a of doc.querySelectorAll('a[href^="/"]')) expect(known.has(a.getAttribute('href') || '')).toBe(true);
      expect([...doc.querySelectorAll('a')].some(a => a.textContent === 'iHerb')).toBe(false);
    });
  }

  for (const slug of Object.keys(practicalGuides)) {
    it(`${slug} preserves publication date, category, empty product list and indexed sitemap membership`, () => {
      const post = GUIDE_POSTS.find(p => p.slug === slug);
      if (!post) throw new Error(`Missing ${slug}`);
      expect(post.date).toBe('2026-11-07');
      expect(post.updatedAt).toBe('2026-11-07');
      expect(post.categoryId).toBe(slug === 'pre-workout-guide' ? 'fitness' : 'nutrition');
      expect(post.relatedProductHandles).toEqual([]);
      expect(post.faq).toHaveLength(5);
      const policy = JSON.parse(readFileSync('supabase/functions/_shared/blog-index.json', 'utf8'));
      expect(policy.indexed).toContain(slug);
      const sitemap = new DOMParser().parseFromString(readFileSync('public/sitemap.xml', 'utf8'), 'application/xml');
      const entry = [...sitemap.querySelectorAll('url')].find(u => u.querySelector('loc')?.textContent === `https://fullbody.co.il/blog/${slug}`);
      expect(entry?.querySelector('lastmod')?.textContent).toBe('2026-11-07');
      const doc = new DOMParser().parseFromString(post.content, 'text/html');
      const known = new Set(['/protein-calculator', ...GUIDE_POSTS.map(p => `/blog/${p.slug}`)]);
      for (const a of doc.querySelectorAll('a[href^="/"]')) expect(known.has(a.getAttribute('href') || '')).toBe(true);
      expect([...doc.querySelectorAll('a')].some(a => a.textContent === 'iHerb')).toBe(false);
    });
  }

  const comparisonRows: Record<string, {after: string; cells: string[]}> = {
    'best-creatine-iherb': {after: 'Optimum Nutrition', cells: ['MuscleTech Platinum', "400 ג'", 'כ-106 ₪', '80', 'כ-1.33 ₪', 'מונוהידרט, מותג מוכר']},
    'best-protein-powder-iherb': {after: 'NOW Foods חלבון אפונה', cells: ['Vega Sport, שוקולד', 'צמחי (אפונה, דלעת, חמנייה)', 'כ-194 ₪', "30 ג'", 'כ-34 ₪', 'NSF Certified for Sport']},
    'best-magnesium-iherb': {after: 'NOW Magnesium Caps', cells: ['Life Extension Magnesium Caps', 'אוקסיד, ציטרט וסוקסינט', '500 מ"ג (כמוסה)', 'כ-32 ₪', 'כ-0.06 ₪']},
  };
  for (const [slug, rule] of Object.entries(comparisonRows)) {
    it(`${slug} retains all six comparison products and exact approved price/dose cells in order`, () => {
      const post = GUIDE_POSTS.find(p => p.slug === slug);
      if (!post) throw new Error(`Missing ${slug}`);
      const doc = new DOMParser().parseFromString(post.content, 'text/html');
      const rows = [...doc.querySelectorAll('tbody tr')];
      expect(rows).toHaveLength(6);
      const previous = rows.findIndex(r => r.querySelector('td')?.textContent === rule.after);
      expect(previous).toBeGreaterThanOrEqual(0);
      expect([...rows[previous + 1].querySelectorAll('td')].map(c => c.textContent)).toEqual(rule.cells);
    });
  }
});
