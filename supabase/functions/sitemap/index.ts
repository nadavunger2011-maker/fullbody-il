import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, date, updated_at")
    .eq("published", true)
    .order("date", { ascending: false });

  const staticPages = [
    { loc: "/", changefreq: "daily", priority: "1.0" },
    { loc: "/products", changefreq: "daily", priority: "0.9" },
    { loc: "/blog", changefreq: "daily", priority: "0.9" },
    { loc: "/about", changefreq: "monthly", priority: "0.8" },
    { loc: "/contact", changefreq: "monthly", priority: "0.7" },
    { loc: "/shipping-policy", changefreq: "yearly", priority: "0.5" },
    { loc: "/return-policy", changefreq: "yearly", priority: "0.5" },
    { loc: "/terms-of-use", changefreq: "yearly", priority: "0.4" },
    { loc: "/privacy-policy", changefreq: "yearly", priority: "0.4" },
    { loc: "/accessibility", changefreq: "yearly", priority: "0.3" },
  ];

  // Known product handles for sitemap
  const productHandles = [
    "formula-1-healthy-meal-shake",
    "protein-drink-mix-pdm",
    "rebuild-strength-protein",
    "herbalife-aloe-concentrate",
    "herbal-tea-concentrate",
    "multivitamin-complex",
    "beta-heart",
    "personalized-protein-powder",
    "active-fiber-complex",
    "cell-activator",
    "herbalifeline-max",
    "herbalife-skin-collagen",
    "niteworks",
    "total-control",
    "cell-u-loss",
    "prolessa-duo",
    "formula-2-multivitamin",
    "herbalife-24-cr7-drive",
    "herbalife-24-hydrate",
    "herbalife-24-rebuild-endurance",
  ];

  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const page of staticPages) {
    xml += `  <url>\n    <loc>https://fullbody.co.il${page.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
  }

  // Product pages
  for (const handle of productHandles) {
    xml += `  <url>\n    <loc>https://fullbody.co.il/product/${handle}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  // Dynamic blog posts from DB
  if (posts) {
    for (const post of posts) {
      const lastmod = post.updated_at?.split("T")[0] || post.date;
      xml += `  <url>\n    <loc>https://fullbody.co.il/blog/${post.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
});
