// Single source of truth for which blog articles are indexed by search engines.
// Edit supabase/functions/_shared/blog-index.json to add/remove an article from the index
// (it is shared with the sitemap edge function, the sitemap script and the build-time prerender).
import policy from '../../supabase/functions/_shared/blog-index.json';

export const INDEXED_BLOG_SLUGS: string[] = policy.indexed;
export const BLOG_DUPLICATE_REDIRECTS: Record<string, string> = policy.redirects;

const indexedSet = new Set(INDEXED_BLOG_SLUGS);
const rank = new Map(INDEXED_BLOG_SLUGS.map((s, i) => [s, i]));

export const isIndexedSlug = (slug: string) => indexedSet.has(slug);
export const indexRank = (slug: string) => rank.get(slug) ?? Number.MAX_SAFE_INTEGER;
export const POPULAR_GUIDE_COUNT = 6;

// Guides always featured first in the homepage "המדריכים הפופולריים" section (rest fills by index rank).
export const HOME_FEATURED_SLUGS = ['best-creatine-iherb', 'best-protein-powder-iherb', 'creatine-guide', 'protein-powder-types-guide'];
// Related guides shown on the protein calculator page.
export const CALCULATOR_RELATED_SLUGS = ['best-protein-powder-iherb', 'protein-powder-types-guide', 'casein-protein-before-sleep'];
// Homepage list: featured guides, then the top-ranked indexed guides that were least replaced.
export function pickHomeGuides<T extends { slug: string }>(posts: T[]): T[] {
  const indexed = posts.filter(p => isIndexedSlug(p.slug));
  const featured = HOME_FEATURED_SLUGS.map(s => indexed.find(p => p.slug === s)).filter(Boolean) as T[];
  const rest = indexed.filter(p => !HOME_FEATURED_SLUGS.includes(p.slug)).sort((a, b) => indexRank(a.slug) - indexRank(b.slug));
  return [...featured, ...rest].slice(0, POPULAR_GUIDE_COUNT);
}
