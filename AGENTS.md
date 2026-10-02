Business identity, policy terms, and compliance disclosures must come from `src/lib/business.ts` so public pages cannot drift.
All commerce actions must leave the content site for `shop.fullbody.co.il`; do not add local cart or checkout UI.
Blog indexing is controlled only by `supabase/functions/_shared/blog-index.json` (indexed allowlist + duplicate redirects), shared by the app, sitemap function/script and prerender, so the index stays consistent.
SEO HTML is prerendered at build time by `scripts/prerender-plugin.ts` (tags marked `data-prerender`, removed on app boot), because the SPA otherwise serves an empty shell to non-JS crawlers.
