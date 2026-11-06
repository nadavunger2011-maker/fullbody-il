import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import policy from "../_shared/blog-index.json" with { type: "json" };
import config from "../_shared/indexnow.json" with { type: "json" };

const ORIGIN = `https://${config.host}`;
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // Internal only: caller must present the service role key or the INDEXNOW_SUBMIT_TOKEN secret.
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const submitToken = Deno.env.get("INDEXNOW_SUBMIT_TOKEN") ?? "";
  const auth = req.headers.get("Authorization") ?? "";
  const tokenHeader = req.headers.get("x-indexnow-token") ?? "";
  const okService = !!serviceKey && auth === `Bearer ${serviceKey}`;
  const okToken = submitToken.length >= 32 && tokenHeader === submitToken;
  if (!okService && !okToken) return json({ error: "Unauthorized" }, 401);

  let urls: string[] | undefined;
  const text = await req.text();
  if (text.trim()) {
    let body: unknown;
    try { body = JSON.parse(text); } catch { return json({ error: "Invalid JSON" }, 400); }
    const list = (body as { urls?: unknown })?.urls;
    if (list !== undefined) {
      if (!Array.isArray(list) || list.length === 0 || list.length > 10000) return json({ error: "urls must be a non-empty array" }, 400);
      for (const u of list) {
        let parsed: URL;
        try { parsed = new URL(String(u)); } catch { return json({ error: `Invalid URL: ${u}` }, 400); }
        if (parsed.protocol !== "https:" || parsed.hostname !== config.host) return json({ error: `URL not on ${config.host}: ${u}` }, 400);
      }
      urls = list.map(String);
    }
  }
  urls ??= [
    `${ORIGIN}/`,
    `${ORIGIN}/protein-calculator`,
    ...(policy as { indexed: string[] }).indexed.map((s) => `${ORIGIN}/blog/${s}`),
  ];

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: config.host, key: config.key, keyLocation: `${ORIGIN}/${config.key}.txt`, urlList: urls }),
  });
  const detail = await res.text();
  return json({ indexnowStatus: res.status, submitted: urls.length, detail: detail.slice(0, 500) }, res.ok ? 200 : 502);
});
