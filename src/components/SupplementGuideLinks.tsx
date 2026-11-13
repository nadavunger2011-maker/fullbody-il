import type { ReactNode } from 'react';
import { supplementGuideLinks } from '@/lib/supplementGuideLinks';

export default function SupplementGuideLinks({ title, slugs, footer }: { title: string; slugs: string[]; footer?: ReactNode }) {
  const links = supplementGuideLinks(slugs);
  if (!links.length) return null;
  return (
    <section data-supplement-guides aria-label={title} className="border-y border-border bg-secondary/30 py-8">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="mb-5 text-2xl font-black text-foreground">{title}</h2>
        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {links.map(link => <li key={link.slug}><a href={link.href} className="font-medium text-primary underline underline-offset-4 hover:text-accent">{link.title}</a></li>)}
        </ul>
        {footer}
      </div>
    </section>
  );
}