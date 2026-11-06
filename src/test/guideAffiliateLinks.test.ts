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
  'best-creatine-iherb': [creatine, 'https://iherb.pxf.io/bkB1YP', 'https://iherb.pxf.io/NGxy91', 'https://iherb.pxf.io/5kd049', 'https://iherb.pxf.io/bkB1E9'],
  'creatine-monohydrate-vs-hcl': [creatine, 'https://iherb.pxf.io/bkB1E9'],
  'does-creatine-cause-weight-gain': [],
  'creatine-for-women': [creatine, 'https://iherb.pxf.io/bkB1YP'],
};

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
      }
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });

  it('new guides regenerate exactly from retained markdown with no implicit iHerb links', () => {
    const result = execFileSync('python3', ['-c', `
import importlib.util, json, re
from pathlib import Path
spec = importlib.util.spec_from_file_location('guides', 'scripts/build_guide_posts.py')
m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
posts = json.loads(re.search(r'= (\\[.*\\]);', Path('src/data/guidePosts.ts').read_text(), re.S).group(1))
for p in posts:
    if p['slug'] in m.EXPLICIT_AFFILIATE_ONLY:
        body, faq = m.convert(Path('scripts/content/creatine-guides', p['slug'] + '.md').read_text(), auto_link_iherb=False, linked_faq=True)
        assert body == p['content'] and faq == p['faq']
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
      expect(post.updatedAt).toBe('2026-11-05');
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
});