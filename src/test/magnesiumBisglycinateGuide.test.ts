import { describe, expect, it } from 'vitest';
import { GUIDE_POSTS } from '../data/guidePosts';

const post = GUIDE_POSTS.find(p => p.slug === 'magnesium-bisglycinate')!;

describe('magnesium-bisglycinate guide', () => {
  it('has three tracked iHerb product links with sponsored rel and its own subId1', () => {
    const links = [...post.content.matchAll(/<a href="(https:\/\/iherb\.pxf\.io[^"]+)"([^>]*)>/g)];
    expect(links).toHaveLength(3);
    for (const [, href, attrs] of links) {
      expect(href).toContain('subId1=magnesium-bisglycinate');
      expect(attrs).toContain('rel="sponsored nofollow noopener"');
    }
    expect(post.content).toContain(encodeURIComponent('https://www.iherb.com/pr/thorne-magnesium-bisglycinate-6-5-oz-187-g/72886'));
  });
  it('has six FAQ entries and the approved dates', () => {
    expect(post.faq).toHaveLength(6);
    expect(post.date).toBe('2026-11-12');
    expect(post.updatedAt).toBe('2026-11-12');
  });
  it.each(['magnesium-types-guide', 'best-magnesium-iherb', 'magnesium-for-sleep'])('%s links to the new guide', slug => {
    expect(GUIDE_POSTS.find(p => p.slug === slug)!.content).toContain('<a href="/blog/magnesium-bisglycinate">מגנזיום ביסגליצינאט</a>');
  });
});
