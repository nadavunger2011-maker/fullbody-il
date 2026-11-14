import { expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { GUIDE_POSTS } from '../data/guidePosts';
import { BLOG_SUPPLEMENT_GUIDES, HOME_SUPPLEMENT_GUIDES } from '../lib/supplementGuideLinks';

it('dates the approved new guide to 2026-11-14 in data and sitemap', () => {
  const post = GUIDE_POSTS.find(p => p.slug === 'creatine-side-effects');
  expect(post?.date).toBe('2026-11-14');
  expect(post?.updatedAt).toBe('2026-11-14');
  expect(post?.categoryId).toBe(GUIDE_POSTS.find(p => p.slug === 'creatine-guide')?.categoryId);
  const doc = new DOMParser().parseFromString(readFileSync('public/sitemap.xml', 'utf8'), 'application/xml');
  const entry = [...doc.querySelectorAll('url')].find(u => u.querySelector('loc')?.textContent === 'https://fullbody.co.il/blog/creatine-side-effects');
  expect(entry?.querySelector('lastmod')?.textContent).toBe('2026-11-14');
});

it('adds discovery to the blog but not the homepage', () => {
  expect(BLOG_SUPPLEMENT_GUIDES).toContain('creatine-side-effects');
  expect(HOME_SUPPLEMENT_GUIDES).not.toContain('creatine-side-effects');
});