import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GRAPH = "https://graph.instagram.com/v22.0";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function post(url: string, params: Record<string, string>) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data as Record<string, string>;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const token = Deno.env.get("INSTAGRAM_ACCESS_TOKEN");
  const igUserId = Deno.env.get("INSTAGRAM_USER_ID");
  if (!token || !igUserId) return json({ error: "Instagram credentials missing" }, 500);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Pick the next queued post (respecting scheduled_for when set)
  const today = new Date().toISOString().slice(0, 10);
  const { data: rows, error } = await supabase
    .from("social_posts")
    .select("*")
    .eq("platform", "instagram")
    .eq("status", "queued")
    .or(`scheduled_for.is.null,scheduled_for.lte.${today}`)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(1);

  if (error) return json({ error: error.message }, 500);
  const item = rows?.[0];
  if (!item) return json({ status: "empty", message: "No queued posts" });

  // Lock the row so a retry cannot double-publish
  const { data: locked } = await supabase
    .from("social_posts")
    .update({ status: "publishing", updated_at: new Date().toISOString() })
    .eq("id", item.id)
    .eq("status", "queued")
    .select("id");
  if (!locked?.length) return json({ status: "skipped", message: "Already being published" });

  try {
    const urls: string[] = item.image_urls ?? [];
    if (urls.length < 2) throw new Error("A carousel needs at least 2 images");

    const children: string[] = [];
    for (const image_url of urls) {
      const res = await post(`${GRAPH}/${igUserId}/media`, {
        image_url,
        is_carousel_item: "true",
        access_token: token,
      });
      children.push(res.id);
      await sleep(800);
    }

    const parent = await post(`${GRAPH}/${igUserId}/media`, {
      media_type: "CAROUSEL",
      children: children.join(","),
      caption: item.caption,
      access_token: token,
    });
    await sleep(4000);

    const published = await post(`${GRAPH}/${igUserId}/media_publish`, {
      creation_id: parent.id,
      access_token: token,
    });

    let permalink: string | null = null;
    try {
      const res = await fetch(
        `${GRAPH}/${published.id}?fields=permalink&access_token=${token}`,
      );
      const info = await res.json();
      permalink = info.permalink ?? null;
    } catch (_) { /* permalink is optional */ }

    await supabase
      .from("social_posts")
      .update({
        status: "published",
        provider_post_id: published.id,
        permalink,
        published_at: new Date().toISOString(),
        error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.id);

    return json({ status: "published", id: published.id, permalink });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    await supabase
      .from("social_posts")
      .update({ status: "failed", error: message, updated_at: new Date().toISOString() })
      .eq("id", item.id);
    console.error("instagram-daily-post failed", message);
    return json({ error: message }, 500);
  }
});
