import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HERBALIFE_CONTACT_INTRO } from '@/lib/business';
import { HERBALIFE_CTA_HEADING, herbalifeWhatsAppUrl, herbalifeDirectShopUrl, hasHerbalifeCta } from '@/lib/herbalifeWhatsApp';

export default function HerbalifeWhatsAppCta({ slug, title }: { slug: string; title: string }) {
  if (!hasHerbalifeCta(slug)) return null;
  return <aside data-herbalife-whatsapp-cta className="not-prose my-8 rounded-lg border border-border bg-secondary p-5 sm:p-6" dir="rtl">
    <h2 className="text-xl font-bold text-foreground mb-3">{HERBALIFE_CTA_HEADING}</h2>
    <p className="text-foreground leading-relaxed mb-5">{HERBALIFE_CONTACT_INTRO}</p>
    <div className="flex flex-col items-start gap-3">
      <Button asChild className="!text-primary-foreground !no-underline"><a href={herbalifeWhatsAppUrl(title)} target="_blank" rel="noopener"><MessageCircle />לשיחה בוואטסאפ</a></Button>
      <a className="text-sm text-muted-foreground underline underline-offset-4" href={herbalifeDirectShopUrl(slug)} target="_blank" rel="noopener">או לרכישה ישירה בחנות</a>
    </div>
  </aside>;
}

export function HerbalifeFloatingWhatsApp({ slug, title }: { slug: string; title: string }) {
  const [hidden, setHidden] = useState(false);
  const key = `fb_herbalife_wa_dismissed:${slug}`;
  useEffect(() => { try { setHidden(sessionStorage.getItem(key) === '1'); } catch { setHidden(false); } }, [key]);
  if (hidden || !hasHerbalifeCta(slug)) return null;
  return <div data-herbalife-floating className="fixed bottom-24 left-4 z-40 flex items-center gap-1" dir="rtl">
    <Button size="icon" variant="secondary" aria-label="סגירת כפתור וואטסאפ" onClick={() => { setHidden(true); try { sessionStorage.setItem(key, '1'); } catch { /* unavailable storage */ } }}><X /></Button>
    <Button asChild size="icon" className="rounded-full shadow-lg h-12 w-12"><a title="לשיחה בוואטסאפ" aria-label="לשיחה בוואטסאפ" href={herbalifeWhatsAppUrl(title)} target="_blank" rel="noopener"><MessageCircle /></a></Button>
  </div>;
}