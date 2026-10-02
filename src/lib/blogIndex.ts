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
