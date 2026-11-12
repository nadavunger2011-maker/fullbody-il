// Pure publishing rules for the Telegram deals channel (unit-tested from src/test).
export const DISCLOSURE = "<i>קישורי שותפים: אם תרכשו דרכם ייתכן שנקבל עמלה, בלי עלות נוספת עבורכם.</i>";
export const CAPTION_LIMIT = 1024;
export const MESSAGE_LIMIT = 4096;
export const MIN_GAP_MS = 3 * 60 * 60 * 1000;

export type TelegramPost = {
  id: string; status: string; scheduled_for: string; body_html: string;
  image_url?: string | null; button_text?: string | null; button_url?: string | null;
  published_at?: string | null; created_at?: string;
};

export function withDisclosure(body: string): string {
  const trimmed = body.replace(/\s+$/, "");
  if (trimmed.includes("קישורי שותפים: אם תרכשו דרכם ייתכן שנקבל עמלה")) return trimmed;
  return `${trimmed}\n\n${DISCLOSURE}`;
}

/** Length Telegram counts after HTML parsing (tags removed, entities decoded). */
export function visibleLength(html: string): number {
  const text = html.replace(/<[^>]*>/g, "")
    .replace(/&(lt|gt|amp|quot|#\d+|#x[0-9a-f]+);/gi, "x");
  return [...text].length;
}

/** Mirrors the claim_telegram_post SQL: one due queued post, none while sending or within 3h of the last publication. */
export function pickDuePost(posts: TelegramPost[], now: Date): TelegramPost | null {
  if (posts.some((p) => p.status === "sending")) return null;
  const blocked = posts.some((p) => p.status === "published" && p.published_at &&
    now.getTime() - new Date(p.published_at).getTime() < MIN_GAP_MS);
  if (blocked) return null;
  const due = posts.filter((p) => p.status === "queued" && new Date(p.scheduled_for).getTime() <= now.getTime())
    .sort((a, b) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime());
  return due[0] ?? null;
}

export function buildTelegramRequest(post: TelegramPost, chatId: string) {
  const text = withDisclosure(post.body_html);
  const reply_markup = post.button_text && post.button_url
    ? { inline_keyboard: [[{ text: post.button_text, url: post.button_url }]] } : undefined;
  const base = { chat_id: chatId, parse_mode: "HTML", ...(reply_markup ? { reply_markup } : {}) };
  if (post.image_url && visibleLength(text) <= CAPTION_LIMIT) {
    return { method: "sendPhoto" as const, payload: { ...base, photo: post.image_url, caption: text } };
  }
  if (visibleLength(text) > MESSAGE_LIMIT) throw new Error(`Post text exceeds ${MESSAGE_LIMIT} characters`);
  return { method: "sendMessage" as const, payload: { ...base, text, link_preview_options: { is_disabled: true } } };
}

export function iherbDeeplink(subId: string, productUrl: string): string {
  return `https://iherb.pxf.io/c/3215306/1665867/19332?subId1=${encodeURIComponent(subId)}&u=${encodeURIComponent(productUrl)}`;
}

export function articleLink(path: string, subId: string): string {
  const p = path.replace(/^\/+/, "");
  return `https://fullbody.co.il/${p}${p.includes("?") ? "&" : "?"}utm_source=telegram&utm_medium=channel&utm_campaign=${encodeURIComponent(subId)}`;
}

export type PublishDeps = {
  chatId: string | undefined;
  hasConnector: boolean;
  claim: () => Promise<TelegramPost | null>;
  send: (method: string, payload: unknown) => Promise<{ ok: boolean; result?: { message_id: number }; description?: string }>;
  markPublished: (id: string, messageId: number) => Promise<void>;
  markFailed: (id: string, error: string) => Promise<void>;
  log?: (msg: string) => void;
};

/** One invocation = at most one post. Missing config is a no-op that leaves the queue untouched. */
export async function publishOnce(d: PublishDeps) {
  if (!d.chatId || !d.hasConnector) {
    d.log?.("telegram-publish: channel id or Telegram connection missing; skipping");
    return { skipped: "not_configured" as const };
  }
  const post = await d.claim();
  if (!post) return { skipped: "nothing_due" as const };
  try {
    const { method, payload } = buildTelegramRequest(post, d.chatId);
    const res = await d.send(method, payload);
    if (!res.ok || !res.result) throw new Error(res.description || "Telegram request failed");
    await d.markPublished(post.id, res.result.message_id);
    return { published: post.id, messageId: res.result.message_id };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await d.markFailed(post.id, msg.slice(0, 1000));
    return { failed: post.id, error: msg };
  }
}
