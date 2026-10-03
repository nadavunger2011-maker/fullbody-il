import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import greenLogo from '@/assets/logo-green.webp';

const links = [
  { to: '/', label: 'בית' },
  { to: '/blog', label: 'מדריכים' },
  { to: '/recipes', label: 'מתכונים' },
  { to: '/protein-calculator', label: 'מחשבון חלבון' },
  { to: '/about', label: 'אודות' },
];

export default function ContentHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link to="/" className="flex items-center" aria-label="FullBody - דף הבית">
          <img src={greenLogo} alt="FullBody" className="h-12 w-auto" />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-bold text-muted-foreground lg:flex" aria-label="ניווט ראשי">
          {links.map(link => <Link key={link.to} to={link.to} className="transition-colors hover:text-accent">{link.label}</Link>)}
          <a href="https://shop.fullbody.co.il" className="border-r border-border pr-7 font-medium transition-colors hover:text-accent">חנות</a>
        </nav>
        <button type="button" onClick={() => setOpen(true)} className="p-2 text-foreground lg:hidden" aria-label="פתיחת תפריט"><Menu className="h-6 w-6" /></button>
      </div>
      {open && <button type="button" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-foreground/40 lg:hidden" aria-label="סגירת תפריט" />}
      <nav className={`fixed inset-y-0 right-0 z-50 flex w-72 flex-col bg-card px-6 pt-20 shadow-hover transition-transform lg:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`} aria-label="ניווט לנייד">
        <button type="button" onClick={() => setOpen(false)} className="absolute left-5 top-6 p-2 text-foreground" aria-label="סגירת תפריט"><X className="h-6 w-6" /></button>
        {links.map(link => <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="border-b border-border py-4 text-lg font-bold">{link.label}</Link>)}
        <a href="https://shop.fullbody.co.il" className="py-4 text-lg text-muted-foreground">חנות</a>
      </nav>
    </header>
  );
}
