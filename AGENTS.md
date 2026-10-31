Business identity, policy terms, and compliance disclosures must come from `src/lib/business.ts` so public pages cannot drift.
All commerce actions must leave the content site for `shop.fullbody.co.il`; do not add local cart or checkout UI.
Root legacy product redirects share `src/lib/legacyProductRedirects.ts` between the route and prerender; keep other legacy route behavior isolated to avoid unrelated changes.
Blog indexing is controlled only by `supabase/functions/_shared/blog-index.json` (indexed allowlist + duplicate redirects), shared by the app, sitemap function/script and prerender, so the index stays consistent.
SEO HTML is prerendered at build time by `scripts/prerender-plugin.ts` (tags marked `data-prerender`, removed on app boot), because the SPA otherwise serves an empty shell to non-JS crawlers.
The controlled home-strength article has presentation metadata and a prerender-only content snapshot fallback; live database content wins, so a failed build-time fetch cannot silently omit this DB-only route.
New Instagram batches keep their slide specifications and captions together in reproducible rendering scripts; the publisher leaves a queued post waiting (not failed) until all its image URLs are publicly reachable, so posts can be queued before the site is published.
- New static guide articles are generated into `src/data/guidePosts.ts` by `scripts/build_guide_posts.py` from approved markdown, so the author's text stays verbatim and FAQ becomes structured data.
