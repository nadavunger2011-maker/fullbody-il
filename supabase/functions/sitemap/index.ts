import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import policy from "../_shared/blog-index.json" with { type: "json" };

// Only allowlisted articles (blog-index.json) are listed; everything else is noindex.
const STATIC_PAGES = [
  ["/", "daily", "1.0"], ["/blog", "daily", "0.9"], ["/recipes", "weekly", "0.7"],
  ["/protein-calculator", "monthly", "0.6"], ["/about", "monthly", "0.7"], ["/contact", "monthly", "0.6"],
  ["/faq", "monthly", "0.5"], ["/shipping-policy", "yearly", "0.4"], ["/return-policy", "yearly", "0.4"],
  ["/refund-policy", "yearly", "0.4"], ["/terms-of-use", "yearly", "0.3"], ["/privacy-policy", "yearly", "0.3"],
  ["/accessibility", "yearly", "0.3"],
];

const enc = (p: string) => p.split("/").map(encodeURIComponent).join("/");

serve(async () => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, date")
    .eq("published", true)
    .in("slug", policy.indexed);
  const dates = new Map((posts ?? []).map((p) => [p.slug, String(p.date).slice(0, 10)]));

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  for (const [loc, cf, pr] of STATIC_PAGES) {
    xml += `  <url>\n    <loc>https://fullbody.co.il${loc}</loc>\n    <changefreq>${cf}</changefreq>\n    <priority>${pr}</priority>\n  </url>\n`;
  }
  for (const slug of policy.indexed as string[]) {
    const lm = dates.get(slug);
    xml += `  <url>\n    <loc>https://fullbody.co.il${enc(`/blog/${slug}`)}</loc>\n${lm ? `    <lastmod>${lm}</lastmod>\n` : ""}    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  }
  xml += `</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
});
