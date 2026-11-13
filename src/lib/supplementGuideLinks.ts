import { GUIDE_POSTS } from '../data/guidePosts';
import { proBlogPosts } from '../data/proBlogPosts';
import { FEATURED_BLOG_OVERRIDES } from '../data/featuredBlogContent';
import { BLOG_DUPLICATE_REDIRECTS } from './blogIndex';

export const HOME_SUPPLEMENT_GUIDES = [
  'creatine-guide', 'best-creatine-iherb', 'protein-powder-types-guide',
  'best-protein-powder-iherb', 'whey-vs-plant-protein', 'casein-protein-before-sleep',
  'mass-gainer-guide', 'pre-workout-guide', 'magnesium-types-guide',
  'best-magnesium-iherb', 'magnesium-bisglycinate', 'magnesium-for-sleep', 'gym-supplements-what-works',
];

const trainingGuides = ['creatine-guide', 'pre-workout-guide', 'best-protein-after-workout'];
export const POST_SUPPLEMENT_GUIDES: Record<string, string[]> = {
  'meal-replacement-shakes-guide': ['protein-powder-types-guide', 'best-protein-powder-iherb', 'protein-bars-guide', 'best-protein-after-workout'],
  'formula1-meal-replacement-guide': ['protein-powder-types-guide', 'whey-vs-plant-protein', 'best-protein-after-workout'],
  'sleep-quality-daily-function': ['magnesium-for-sleep', 'casein-protein-before-sleep', 'magnesium-types-guide'],
  'aloe-vera-benefits-digestion': ['magnesium-types-guide', 'multivitamin-for-athletes', 'gym-supplements-what-works'],
  'deep-interval-training-endurance': trainingGuides,
  'home-bodyweight-training': trainingGuides,
  'functional-strength-training-daily': trainingGuides,
};

export const HERBALIFE_GUIDES = ['herbalife24-guide', 'herbalife-protein-powder', 'herbalife-breakfast-routine'];
export const HERBALIFE_GUIDES_TITLE = 'מדריכי הרבלייף';
const POSTS_WITH_HERBALIFE_GUIDES = ['meal-replacement-shakes-guide', 'formula1-meal-replacement-guide', 'aloe-vera-benefits-digestion'];

export function relatedHerbalifeSlugs(slug: string): string[] {
  const realSlug = BLOG_DUPLICATE_REDIRECTS[slug] ?? slug;
  return POSTS_WITH_HERBALIFE_GUIDES.some(source => (BLOG_DUPLICATE_REDIRECTS[source] ?? source) === realSlug) ? HERBALIFE_GUIDES : [];
}

export const BLOG_SUPPLEMENT_GUIDES = [...new Set([
  ...HOME_SUPPLEMENT_GUIDES, ...Object.values(POST_SUPPLEMENT_GUIDES).flat(),
])];

export function relatedSupplementSlugs(slug: string): string[] {
  const realSlug = BLOG_DUPLICATE_REDIRECTS[slug] ?? slug;
  const entry = Object.entries(POST_SUPPLEMENT_GUIDES).find(([source]) =>
    (BLOG_DUPLICATE_REDIRECTS[source] ?? source) === realSlug);
  return entry?.[1] ?? [];
}

export function supplementGuideLinks(slugs: string[]) {
  return slugs.flatMap(slug => {
    const realSlug = BLOG_DUPLICATE_REDIRECTS[slug] ?? slug;
    const post = GUIDE_POSTS.find(p => p.slug === realSlug) ?? proBlogPosts.find(p => p.slug === realSlug);
    const title = FEATURED_BLOG_OVERRIDES[realSlug]?.title ?? post?.title;
    return title ? [{ slug: realSlug, href: `/blog/${realSlug}`, title }] : [];
  });
}

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function supplementGuideBlockHtml(title: string, slugs: string[], footerHtml = ''): string {
  const links = supplementGuideLinks(slugs);
  if (!links.length) return '';
  return `<section data-supplement-guides aria-label="${escapeHtml(title)}"><h2>${escapeHtml(title)}</h2><ul>${links.map(link => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.title)}</a></li>`).join('')}</ul>${footerHtml}</section>`;
}