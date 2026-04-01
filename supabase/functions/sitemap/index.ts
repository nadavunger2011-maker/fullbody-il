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
    { loc: "/blog", changefreq: "daily", priority: "0.9" },
    { loc: "/contact", changefreq: "monthly", priority: "0.7" },
    { loc: "/about", changefreq: "monthly", priority: "0.7" },
    { loc: "/faq", changefreq: "monthly", priority: "0.6" },
    { loc: "/shipping", changefreq: "monthly", priority: "0.5" },
    { loc: "/returns", changefreq: "monthly", priority: "0.5" },
    { loc: "/terms", changefreq: "yearly", priority: "0.3" },
    { loc: "/privacy", changefreq: "yearly", priority: "0.3" },
    { loc: "/accessibility", changefreq: "yearly", priority: "0.3" },
  ];

  // Static blog posts from code
  const staticBlogSlugs = [
    "protein-shakes-complete-guide",
    "herbalife-weight-management",
    "morning-nutrition-routine",
    "sports-nutrition-guide",
    "healthy-smoothie-recipes",
  ];

  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const page of staticPages) {
    xml += `  <url>\n    <loc>https://fullbody.co.il${page.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
  }

  // Static blog posts
  for (const slug of staticBlogSlugs) {
    xml += `  <url>\n    <loc>https://fullbody.co.il/blog/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
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
