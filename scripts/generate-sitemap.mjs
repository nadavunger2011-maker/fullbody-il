// Regenerates public/sitemap.xml. Only allowlisted blog articles are included
// (see supabase/functions/_shared/blog-index.json). Run: node scripts/generate-sitemap.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const SUPABASE_URL = 'https://jfogxnstkykpsyeegmnm.supabase.co';
const ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impmb2d4bnN0a3lrcHN5ZWVnbW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5ODY5OTksImV4cCI6MjA4NDU2Mjk5OX0.owHWtVpkeuMdfsGrlhyjdrtpklJ8VdxD4b6DZqObWys';
const BASE = 'https://fullbody.co.il';
const policy = JSON.parse(readFileSync(new URL('../supabase/functions/_shared/blog-index.json', import.meta.url), 'utf8'));

export const STATIC_PAGES = [
  ['/', 'daily', '1.0'], ['/blog', 'daily', '0.9'], ['/recipes', 'weekly', '0.7'],
  ['/protein-calculator', 'monthly', '0.6'], ['/about', 'monthly', '0.7'], ['/contact', 'monthly', '0.6'],
  ['/faq', 'monthly', '0.5'], ['/shipping-policy', 'yearly', '0.4'], ['/return-policy', 'yearly', '0.4'],
  ['/refund-policy', 'yearly', '0.4'], ['/terms-of-use', 'yearly', '0.3'], ['/privacy-policy', 'yearly', '0.3'],
  ['/accessibility', 'yearly', '0.3'],
];

async function fetchPosts() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=slug,date,updated_at&published=eq.true&limit=2000`,
    { headers: { apikey: ANON, Authorization: `Bearer ${ANON}` } });
  if (!res.ok) throw new Error(`Failed to load posts [${res.status}]`);
  return res.json();
}

const enc = (p) => p.split('/').map(encodeURIComponent).join('/');
const url = (loc, lastmod, changefreq, priority) =>
  ['  <url>', `    <loc>${BASE}${enc(loc)}</loc>`, lastmod && `    <lastmod>${lastmod}</lastmod>`,
   `    <changefreq>${changefreq}</changefreq>`, `    <priority>${priority}</priority>`, '  </url>'].filter(Boolean).join('\n');

const bySlug = new Map((await fetchPosts()).map((p) => [p.slug, p]));
const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...STATIC_PAGES.map(([loc, cf, pr]) => url(loc, null, cf, pr)),
  ...policy.indexed.map((slug) => {
    const p = bySlug.get(slug);
    return url(`/blog/${slug}`, p ? (p.updated_at || p.date).slice(0, 10) : null, 'monthly', '0.7');
  }),
  '</urlset>',
];
writeFileSync('public/sitemap.xml', lines.join('\n') + '\n');
console.log(`sitemap.xml written: ${STATIC_PAGES.length + policy.indexed.length} urls`);
