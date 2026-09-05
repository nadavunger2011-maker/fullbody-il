import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cleanup-token",
};

const RANDOM_SUFFIX = /-[a-z0-9]{8}$/;
const MAX_CONTENT = 32000;

interface Post {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  meta_description: string | null;
  category_id: string;
  date: string;
  topic_key: string | null;
  proposed_slug: string | null;
  related_product_handles: string[] | null;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function sanitizeSlug(raw: string): string {
  return (raw || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70)
    .replace(/-$/, "");
}

function plainWordCount(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

/** Split HTML into { heading, html } sections at H2 boundaries. */
function sections(html: string): { key: string; html: string }[] {
  const parts = html.split(/(?=<h2)/i).filter((p) => p.trim());
  return parts.map((p) => {
    const m = p.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const heading = (m?.[1] || "").replace(/<[^>]+>/g, "").trim();
    return { key: heading.slice(0, 60), html: p };
  });
}

/** Merge extra posts' unique H2 sections into the canonical content. */
function mergeContent(base: string, extras: string[]): string {
  const seen = new Set(sections(base).map((s) => s.key).filter(Boolean));
  let out = base;
  for (const extra of extras) {
    for (const sec of sections(extra)) {
      if (!sec.key || seen.has(sec.key)) continue;
      if (out.length + sec.html.length > MAX_CONTENT) return out;
      seen.add(sec.key);
      out += sec.html;
    }
  }
  return out;
}

async function classifyBatch(
  posts: Post[],
  knownTopics: string[],
  apiKey: string,
): Promise<Record<string, { topic_key: string; slug: string }>> {
  const list = posts.map((p, i) => `${i}. [${p.category_id}] ${p.title}`).join("\n");
  const prompt = `You are an SEO editor for a Hebrew health & nutrition store (Herbalife distributor).
Below is a numbered list of Hebrew blog post titles. For EACH item return:
- "topic_key": a broad snake_case English topic key describing the REAL subject. Posts that cover the same practical subject MUST share the same topic_key (aggressive grouping is desired: we are removing keyword cannibalization).
- "slug": a short, clean, human-readable English SEO slug (kebab-case, 2-5 words) for that topic_key. All items sharing a topic_key MUST share the identical slug.

Reuse these existing topic keys whenever the subject matches (do not invent near-duplicates):
${knownTopics.length ? knownTopics.join(", ") : "(none yet)"}

Return ONLY compact JSON: {"items":[{"i":0,"topic_key":"...","slug":"..."}]}

Titles:
${list}`;

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`AI gateway failed [${res.status}]: ${body}`);
  }
  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content || "{}";
  const parsed = JSON.parse(raw.replace(/^```json\s*|\s*```$/g, ""));
  const out: Record<string, { topic_key: string; slug: string }> = {};
  for (const item of parsed.items || []) {
    const post = posts[Number(item.i)];
    if (!post) continue;
    const topic = sanitizeSlug(String(item.topic_key || "")).replace(/-/g, "_");
    const slug = sanitizeSlug(String(item.slug || ""));
    if (!topic || !slug) continue;
    out[post.id] = { topic_key: topic, slug };
  }
  return out;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const token = req.headers.get("x-cleanup-token");
  if (!token || token !== Deno.env.get("BLOG_CLEANUP_TOKEN")) {
    return json({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const body = await req.json().catch(() => ({}));
    const phase = body.phase || "report";

    if (phase === "classify") {
      const limit = Math.min(Number(body.limit) || 60, 120);
      const apiKey = Deno.env.get("LOVABLE_API_KEY");
      if (!apiKey) return json({ error: "Missing LOVABLE_API_KEY" }, 500);

      const { data: known } = await supabase
        .from("blog_posts")
        .select("topic_key")
        .not("topic_key", "is", null);
      const knownTopics = [...new Set((known || []).map((r: any) => r.topic_key))].slice(0, 120);

      const { data: posts, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, category_id, content, date")
        .is("topic_key", null)
        .eq("published", true)
        .order("date", { ascending: false })
        .limit(limit);
      if (error) throw error;
      if (!posts?.length) return json({ phase, classified: 0, remaining: 0, done: true });

      const mapping = await classifyBatch(posts as Post[], knownTopics, apiKey);
      let classified = 0;
      for (const [id, val] of Object.entries(mapping)) {
        const { error: upErr } = await supabase
          .from("blog_posts")
          .update({ topic_key: val.topic_key, proposed_slug: val.slug })
          .eq("id", id);
        if (!upErr) classified++;
      }

      const { count } = await supabase
        .from("blog_posts")
        .select("id", { count: "exact", head: true })
        .is("topic_key", null)
        .eq("published", true);

      return json({ phase, classified, remaining: count ?? 0, done: (count ?? 0) === 0 });
    }

    if (phase === "consolidate") {
      const dryRun = body.dry_run !== false ? body.dry_run === true : false;
      const { data: posts, error } = await supabase
        .from("blog_posts")
        .select("id, slug, title, content, excerpt, meta_description, category_id, date, topic_key, proposed_slug, related_product_handles")
        .eq("published", true)
        .not("topic_key", "is", null)
        .limit(2000);
      if (error) throw error;

      const groups = new Map<string, Post[]>();
      for (const p of (posts || []) as Post[]) {
        const key = p.topic_key!;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(p);
      }

      const takenSlugs = new Set(
        ((posts || []) as Post[]).filter((p) => !RANDOM_SUFFIX.test(p.slug)).map((p) => p.slug),
      );

      const report = {
        merged: [] as { new_url: string; title: string; sources: number }[],
        renamed: [] as { from: string; to: string }[],
        redirects: [] as { from: string; to: string; reason: string }[],
        noindexed: [] as string[],
      };

      for (const [topic, list] of groups) {
        list.sort((a, b) => b.content.length - a.content.length);
        const canonical = list[0];
        const extras = list.slice(1);

        // choose the final slug
        let target = sanitizeSlug(canonical.proposed_slug || "") || sanitizeSlug(topic.replace(/_/g, "-"));
        if (takenSlugs.has(target) && target !== canonical.slug) {
          target = `${target}-guide`.slice(0, 70);
          let n = 2;
          while (takenSlugs.has(target)) target = `${sanitizeSlug(canonical.proposed_slug || topic)}-${n++}`;
        }
        takenSlugs.add(target);

        const mergedContent = extras.length
          ? mergeContent(canonical.content, extras.slice(0, 3).map((e) => e.content))
          : canonical.content;
        const words = plainWordCount(mergedContent);

        if (!dryRun) {
          await supabase
            .from("blog_posts")
            .update({
              slug: target,
              content: mergedContent,
              read_time: Math.max(3, Math.round(words / 220)),
              noindex: false,
              merged_into: null,
            })
            .eq("id", canonical.id);

          if (canonical.slug !== target) {
            await supabase.from("blog_redirects").upsert(
              { old_slug: canonical.slug, new_slug: target, reason: "slug-cleanup" },
              { onConflict: "old_slug" },
            );
          }

          for (const e of extras) {
            await supabase
              .from("blog_posts")
              .update({ published: false, noindex: true, merged_into: target })
              .eq("id", e.id);
            await supabase.from("blog_redirects").upsert(
              { old_slug: e.slug, new_slug: target, reason: "merge" },
              { onConflict: "old_slug" },
            );
          }
          // keep redirects pointing at the final slug if it moved again
          await supabase.from("blog_redirects").update({ new_slug: target }).eq("new_slug", canonical.slug);
        }

        if (canonical.slug !== target) report.renamed.push({ from: canonical.slug, to: target });
        if (extras.length) {
          report.merged.push({ new_url: `/blog/${target}`, title: canonical.title, sources: list.length });
        }
        for (const e of extras) report.redirects.push({ from: `/blog/${e.slug}`, to: `/blog/${target}`, reason: "merge" });
        if (canonical.slug !== target) {
          report.redirects.push({ from: `/blog/${canonical.slug}`, to: `/blog/${target}`, reason: "slug-cleanup" });
        }
      }

      // thin unmergeable posts -> noindex + redirect to /blog
      const { data: remaining } = await supabase
        .from("blog_posts")
        .select("id, slug, content")
        .eq("published", true)
        .limit(2000);
      for (const p of remaining || []) {
        if (plainWordCount(p.content) >= 300) continue;
        report.noindexed.push(`/blog/${p.slug}`);
        if (!dryRun) {
          await supabase.from("blog_posts").update({ published: false, noindex: true, merged_into: "blog" }).eq("id", p.id);
          await supabase.from("blog_redirects").upsert(
            { old_slug: p.slug, new_slug: "blog", reason: "thin-content" },
            { onConflict: "old_slug" },
          );
        }
      }

      return json({ phase, dry_run: dryRun, groups: groups.size, ...report });
    }

    // report
    const { count: total } = await supabase.from("blog_posts").select("id", { count: "exact", head: true });
    const { count: published } = await supabase
      .from("blog_posts").select("id", { count: "exact", head: true }).eq("published", true);
    const { count: classified } = await supabase
      .from("blog_posts").select("id", { count: "exact", head: true }).not("topic_key", "is", null);
    const { count: redirects } = await supabase
      .from("blog_redirects").select("old_slug", { count: "exact", head: true });
    return json({ phase: "report", total, published, classified, redirects });
  } catch (e) {
    console.error("blog-seo-consolidate failed", e);
    return json({ error: String((e as Error).message || e) }, 500);
  }
});
