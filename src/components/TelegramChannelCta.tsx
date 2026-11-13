import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { TELEGRAM_CHANNEL_URL, TELEGRAM_CTA_TEXT, TELEGRAM_CTA_BUTTON } from '@/lib/telegramChannel';

const KEY = 'fb_telegram_cta_dismissed';

export default function TelegramChannelCta({ inline = false }: { inline?: boolean }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => { try { setHidden(localStorage.getItem(KEY) === '1'); } catch { /* ignore */ } }, []);
  if (hidden) return null;
  const dismiss = () => { setHidden(true); try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ } };
  return (
    <aside data-telegram-cta className={`not-prose flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-2.5 text-sm ${inline ? 'mt-5' : 'mx-auto my-6 max-w-4xl'}`}>
      <p className="flex-1 font-medium text-foreground">{TELEGRAM_CTA_TEXT}</p>
      <a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener" className="shrink-0 rounded-md bg-primary px-3 py-1.5 font-bold text-primary-foreground hover:opacity-90">{TELEGRAM_CTA_BUTTON}</a>
      <button type="button" onClick={dismiss} aria-label="סגירה" className="shrink-0 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
    </aside>
  );
}
