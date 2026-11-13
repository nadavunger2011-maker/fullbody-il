// Public channel username (not secret); env TELEGRAM_CHANNEL_ID overrides it.
const TELEGRAM_CHANNEL_ID_DEFAULT = "@Fullbodeals";
import postgres from "npm:postgres@3.4.4";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { publishOnce, type TelegramPost } from "./policy.ts";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, { max: 1 });
  try {
    // Internal only: service role key or the vault token `telegram_publish_token`.
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const okService = !!serviceKey && (req.headers.get("Authorization") ?? "") === `Bearer ${serviceKey}`;
    let okVault = false;
    const vaultHeader = req.headers.get("x-telegram-vault-token") ?? "";
    if (!okService && vaultHeader.length >= 32) {
      const rows = await sql`select decrypted_secret from vault.decrypted_secrets where name = 'telegram_publish_token' limit 1`;
      okVault = rows.length === 1 && rows[0].decrypted_secret === vaultHeader;
    }
    if (!okService && !okVault) return json({ error: "Unauthorized" }, 401);

    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const telegramKey = Deno.env.get("TELEGRAM_API_KEY");
    const result = await publishOnce({
      chatId: Deno.env.get("TELEGRAM_CHANNEL_ID")?.trim() || TELEGRAM_CHANNEL_ID_DEFAULT,
      hasConnector: !!lovableKey && !!telegramKey,
      log: console.log,
      claim: async () => ((await sql`select * from public.claim_telegram_post()`)[0] as TelegramPost | undefined) ?? null,
      send: async (method, payload) => {
        const res = await fetch(`${GATEWAY_URL}/${method}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${lovableKey}`, "X-Connection-Api-Key": telegramKey!, "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const text = await res.text();
        let body: { ok?: boolean; result?: { message_id: number }; description?: string } = {};
        try { body = JSON.parse(text); } catch { /* non-JSON */ }
        if (!res.ok || !body.ok) {
          console.error(`Telegram ${method} failed [${res.status}]: ${text.slice(0, 500)}`);
          return { ok: false, description: `[${res.status}] ${body.description ?? text.slice(0, 300)}` };
        }
        return { ok: true, result: body.result };
      },
      markPublished: async (id, messageId) => {
        await sql`update public.telegram_posts set status='published', telegram_message_id=${messageId}, published_at=now(), error=null where id=${id}`;
      },
      markFailed: async (id, error) => {
        await sql`update public.telegram_posts set status='failed', error=${error} where id=${id}`;
      },
    });
    return json(result);
  } catch (e) {
    console.error("telegram-publish error", e);
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  } finally {
    await sql.end();
  }
});
