import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import greenLogo from '@/assets/logo-green.webp';
import { Button } from '@/components/ui/button';

const links = [
  { to: '/', label: 'בית' },
  { to: '/blog', label: 'מדריכים' },
  { to: '/recipes', label: 'מתכונים' },
  { to: '/protein-calculator', label: 'מחשבון חלבון' },
  { to: '/about', label: 'אודות' },
];

export default function ContentHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.setProperty('overflow', 'hidden', 'important');
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link to="/" className="flex items-center" aria-label="FullBody - דף הבית">
            <img src={greenLogo} alt="FullBody" className="h-12 w-auto" />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-bold text-muted-foreground lg:flex" aria-label="ניווט ראשי">
            {links.map(link => <Link key={link.to} to={link.to} className="transition-colors hover:text-accent">{link.label}</Link>)}
            <a href="https://shop.fullbody.co.il" className="border-r border-border pr-7 font-medium transition-colors hover:text-accent">חנות</a>
          </nav>
          <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(true)} className="lg:hidden" aria-label="פתיחת תפריט" aria-expanded={open} aria-controls="mobile-content-menu">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label="תפריט ניווט">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <nav id="mobile-content-menu" className="absolute inset-y-0 right-0 flex w-[min(20rem,calc(100%-3rem))] flex-col overflow-y-auto border-l border-border bg-card px-6 pb-8 pt-20 shadow-hover" aria-label="ניווט לנייד">
            <Button type="button" variant="ghost" size="icon" onClick={() => setOpen(false)} className="absolute left-4 top-5" aria-label="סגירת תפריט">
              <X className="h-6 w-6" />
            </Button>
            {links.map(link => <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="border-b border-border py-4 text-lg font-bold text-foreground">{link.label}</Link>)}
            <a href="https://shop.fullbody.co.il" className="py-4 text-lg text-muted-foreground">חנות</a>
          </nav>
        </div>
      )}
    </>
  );
}
