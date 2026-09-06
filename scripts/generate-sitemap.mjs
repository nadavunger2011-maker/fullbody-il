// Regenerates public/sitemap.xml with the final (post-merge) URLs only.
// Run: node scripts/generate-sitemap.mjs
import { writeFileSync } from 'node:fs';

const SUPABASE_URL = 'https://jfogxnstkykpsyeegmnm.supabase.co';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmb2d4bnN0a3lrcHN5ZWVnbW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5ODY5OTksImV4cCI6MjA4NDU2Mjk5OX0.owHWtVpkeuMdfsGrlhyjdrtpklJ8VdxD4b6DZqObWys';
const BASE = 'https://fullbody.co.il';

const STATIC_PAGES = [
  ['/', 'daily', '1.0'], ['/products', 'daily', '0.9'], ['/blog', 'daily', '0.9'],
  ['/bundles', 'weekly', '0.8'], ['/starter-stack', 'weekly', '0.8'], ['/plan', 'weekly', '0.8'],
  ['/about', 'monthly', '0.8'], ['/contact', 'monthly', '0.7'], ['/faq', 'monthly', '0.6'],
  ['/recipes', 'weekly', '0.6'], ['/protein-calculator', 'monthly', '0.6'],
  ['/shipping-policy', 'yearly', '0.5'], ['/return-policy', 'yearly', '0.5'], ['/refund-policy', 'yearly', '0.5'],
  ['/terms-of-use', 'yearly', '0.4'], ['/privacy-policy', 'yearly', '0.4'], ['/accessibility', 'yearly', '0.3'],
];

const PRODUCT_HANDLES = [
  'formula-1-vanilla','formula-1-chocolate','formula-1-kosher','formula-1-berries','formula-1-cookies',
  'pdm-protein','h24-rebuild-strength','aloe-natural','aloe-mango','niteworks',
  'formula-2-women','formula-2-men','herbalifeline-max','thermo-complete','protein-powder',
];

const today = new Date().toISOString().slice(0, 10);

async function fetchPosts() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/blog_posts?select=slug,date,updated_at&published=eq.true&noindex=eq.false&order=date.desc&limit=2000`,
    { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } },
  );
  if (!res.ok) throw new Error(`Failed to load posts [${res.status}]: ${await res.text()}`);
  return res.json();
}

const url = (loc, lastmod, changefreq, priority) =>
  `  <url>\n    <loc>${BASE}${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

const posts = await fetchPosts();
const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...STATIC_PAGES.map(([loc, cf, pr]) => url(loc, today, cf, pr)),
  ...PRODUCT_HANDLES.map((h) => url(`/product/${h}`, today, 'weekly', '0.8')),
  ...posts.map((p) => url(`/blog/${p.slug}`, (p.updated_at || p.date).slice(0, 10), 'monthly', '0.7')),
  '</urlset>',
];
writeFileSync('public/sitemap.xml', lines.join('\n') + '\n');
console.log(`sitemap.xml written: ${lines.length - 3} urls (${posts.length} blog posts)`);
