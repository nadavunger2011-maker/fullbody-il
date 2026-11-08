import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { israelSlot, isGuidePost } from './policy.ts';

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

  const slot = israelSlot(new Date());
  if (!slot.allowed) return json({ status: 'outside_window', message: 'Publishing is only allowed at 20:00 Asia/Jerusalem' });

  const token = Deno.env.get("INSTAGRAM_ACCESS_TOKEN");
  const igUserId = Deno.env.get("INSTAGRAM_USER_ID");
  if (!token || !igUserId) return json({ error: "Instagram credentials missing" }, 500);

  const backendUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!backendUrl || !serviceKey) return json({ error: 'Publishing configuration missing' }, 500);
  const supabase = createClient(backendUrl, serviceKey);

  // Pick the next queued post, preferring the precise timestamp when present.
  const now = new Date().toISOString();
  const today = slot.date;
  const { data: rows, error } = await supabase
    .from("social_posts")
    .select("*")
    .eq("platform", "instagram")
    .eq("status", "queued")
    .or(`scheduled_at.lte.${now},and(scheduled_at.is.null,or(scheduled_for.is.null,scheduled_for.lte.${today}))`)
    .order("scheduled_at", { ascending: true, nullsFirst: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) return json({ error: error.message }, 500);
  // Retain generic rows as paused, never delete them. Scheduled guides remain untouched.
  const genericIds = (rows ?? []).filter(row => !isGuidePost(row)).map(row => row.id);
  if (genericIds.length) {
    await supabase.from('social_posts').update({ status: 'paused', updated_at: now }).in('id', genericIds).eq('status', 'queued');
  }
  const item = rows?.find(isGuidePost);
  if (!item) return json({ status: "empty", message: "No queued posts" });

  // Images not reachable yet (site not published)? Leave queued and retry next run.
  for (const u of (item.image_urls ?? []) as string[]) {
    const head = await fetch(u, { method: "HEAD" }).catch(() => null);
    if (!head?.ok) return json({ status: "waiting", message: `Image not reachable yet: ${u}` });
  }

  // Atomically reserve the Israel calendar day and row across concurrent invocations.
  // Keep the daily claim even on an uncertain API failure: never risk a second post.
  const { data: locked, error: claimError } = await supabase.rpc('claim_instagram_daily_post', { _post_id: item.id });
  if (claimError) return json({ error: claimError.message }, 500);
  if (!locked) return json({ status: 'skipped', message: 'Daily slot already reserved, published, or outside 20:00' });

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
