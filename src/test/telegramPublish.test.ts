import { describe, expect, it, vi } from 'vitest';
import { pickDuePost, withDisclosure, buildTelegramRequest, publishOnce, iherbDeeplink, articleLink, DISCLOSURE, type TelegramPost } from '../../supabase/functions/telegram-publish/policy';

const now = new Date('2026-11-12T20:00:00Z');
const post = (o: Partial<TelegramPost>): TelegramPost => ({ id: 'p', status: 'queued', scheduled_for: '2026-11-12T19:00:00Z', body_html: '<b>מבצע</b>', ...o });

describe('Telegram claim-one and 3h gap', () => {
  it('picks only the earliest due queued post', () => {
    const posts = [post({ id: 'b', scheduled_for: '2026-11-12T19:30:00Z' }), post({ id: 'a', scheduled_for: '2026-11-12T18:00:00Z' }), post({ id: 'future', scheduled_for: '2026-11-12T21:00:00Z' })];
    expect(pickDuePost(posts, now)?.id).toBe('a');
    expect(pickDuePost([post({ id: 'future', scheduled_for: '2026-11-12T21:00:00Z' })], now)).toBeNull();
  });
  it('blocks within 3 hours of the last publication and allows after', () => {
    const due = post({ id: 'due' });
    expect(pickDuePost([due, post({ id: 'x', status: 'published', published_at: '2026-11-12T17:01:00Z' })], now)).toBeNull();
    expect(pickDuePost([due, post({ id: 'x', status: 'published', published_at: '2026-11-12T17:00:00Z' })], now)?.id).toBe('due');
  });
  it('sends at most one post per invocation', async () => {
    const send = vi.fn().mockResolvedValue({ ok: true, result: { message_id: 7 } });
    const claim = vi.fn().mockResolvedValueOnce(post({ id: 'one' })).mockResolvedValue(post({ id: 'two' }));
    const r = await publishOnce({ chatId: '@c', hasConnector: true, claim, send, markPublished: vi.fn(), markFailed: vi.fn() });
    expect(r).toEqual({ published: 'one', messageId: 7 });
    expect(claim).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledTimes(1);
  });
  it('no-ops without touching the queue when channel or connector is missing', async () => {
    const claim = vi.fn();
    expect(await publishOnce({ chatId: undefined, hasConnector: true, claim, send: vi.fn(), markPublished: vi.fn(), markFailed: vi.fn() })).toEqual({ skipped: 'not_configured' });
    expect(await publishOnce({ chatId: '@c', hasConnector: false, claim, send: vi.fn(), markPublished: vi.fn(), markFailed: vi.fn() })).toEqual({ skipped: 'not_configured' });
    expect(claim).not.toHaveBeenCalled();
  });
  it('marks a Telegram error as failed once, without retry', async () => {
    const send = vi.fn().mockResolvedValue({ ok: false, description: '[400] chat not found' });
    const markFailed = vi.fn();
    await publishOnce({ chatId: '@c', hasConnector: true, claim: async () => post({}), send, markPublished: vi.fn(), markFailed });
    expect(send).toHaveBeenCalledTimes(1);
    expect(markFailed).toHaveBeenCalledWith('p', '[400] chat not found');
  });
});

describe('Telegram disclosure and caption limit', () => {
  it('appends the disclosure exactly once', () => {
    const once = withDisclosure('<b>מבצע</b>');
    expect(once).toBe(`<b>מבצע</b>\n\n${DISCLOSURE}`);
    expect(withDisclosure(once)).toBe(once);
  });
  it('uses sendPhoto with caption and button when short enough', () => {
    const r = buildTelegramRequest(post({ image_url: 'https://x/i.jpg', button_text: 'לקנייה', button_url: 'https://iherb.pxf.io/x' }), '@c');
    expect(r.method).toBe('sendPhoto');
    expect(r.payload).toMatchObject({ caption: withDisclosure('<b>מבצע</b>'), parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: 'לקנייה', url: 'https://iherb.pxf.io/x' }]] } });
  });
  it('falls back to sendMessage without preview when caption exceeds 1024', () => {
    const r = buildTelegramRequest(post({ image_url: 'https://x/i.jpg', body_html: 'א'.repeat(1000) }), '@c');
    expect(r.method).toBe('sendMessage');
    expect(r.payload).toMatchObject({ link_preview_options: { is_disabled: true } });
  });
  it('builds iHerb and article tracking links', () => {
    expect(iherbDeeplink('tg-mg', 'https://www.iherb.com/pr/x/1?a=b')).toBe('https://iherb.pxf.io/c/3215306/1665867/19332?subId1=tg-mg&u=https%3A%2F%2Fwww.iherb.com%2Fpr%2Fx%2F1%3Fa%3Db');
    expect(articleLink('/blog/magnesium-for-sleep', 'tg-mg')).toBe('https://fullbody.co.il/blog/magnesium-for-sleep?utm_source=telegram&utm_medium=channel&utm_campaign=tg-mg');
  });
});
