import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react';
import greenLogo from '@/assets/logo-green.webp';
import { useCartStore } from '@/stores/cartStore';

const SWEETS_CATEGORIES = [
  { id: 'protein-bars', name: 'חטיפי חלבון', href: '/sweets/category/protein-bars' },
  { id: 'chocolate', name: 'שוקולד ללא סוכר', href: '/sweets/category/chocolate' },
  { id: 'cookies', name: 'עוגיות', href: '/sweets/category/cookies' },
  { id: 'tasting', name: 'מארזי טעימה', href: '/sweets/category/tasting' },
  { id: 'gifts', name: 'מארזי מתנה', href: '/sweets/category/gifts' },
];

export default function SweetsHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const openCart = useCartStore((s) => s.openCart);

  return (
    <>
      {/* Top ribbon */}
      <div className="bg-primary text-primary-foreground text-center text-xs md:text-sm py-2 px-4">
        משלוח חינם בהזמנות מעל 300 ש"ח · משלוח באיזור השרון ב-30 ש"ח
      </div>

      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
          {/* Mobile menu btn */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileOpen(true)}
            aria-label="פתח תפריט"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/sweets" className="flex items-center gap-3">
            <img src={greenLogo} alt="FullBody מתוקים" className="h-10 w-auto" width={120} height={40} />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-lg font-black text-primary">מתוקים</span>
              <span className="text-[10px] text-muted-foreground">by FullBody</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold">
            <NavLink to="/sweets" end className={({ isActive }) => isActive ? 'text-accent' : 'hover:text-accent transition-colors'}>
              ראשי
            </NavLink>
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-accent transition-colors">
                מוצרים <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                <div className="bg-card border border-border rounded-lg shadow-hover py-2 min-w-[200px]">
                  <Link to="/sweets/products" className="block px-4 py-2 hover:bg-secondary text-sm">כל המוצרים</Link>
                  {SWEETS_CATEGORIES.map((c) => (
                    <Link key={c.id} to={c.href} className="block px-4 py-2 hover:bg-secondary text-sm">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <NavLink to="/sweets/story" className={({ isActive }) => isActive ? 'text-accent' : 'hover:text-accent transition-colors'}>
              הסיפור שלנו
            </NavLink>
            <NavLink to="/sweets/shipping" className={({ isActive }) => isActive ? 'text-accent' : 'hover:text-accent transition-colors'}>
              משלוחים
            </NavLink>
            <NavLink to="/sweets/contact" className={({ isActive }) => isActive ? 'text-accent' : 'hover:text-accent transition-colors'}>
              צור קשר
            </NavLink>
          </nav>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative text-foreground hover:text-accent transition-colors"
            aria-label="פתח עגלה"
          >
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -left-2 bg-accent text-accent-foreground text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-72 bg-card shadow-hover flex flex-col pt-20 px-6">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 left-5 text-muted-foreground hover:text-accent"
              aria-label="סגור תפריט"
            >
              <X className="w-6 h-6" />
            </button>
            <Link to="/sweets" onClick={() => setMobileOpen(false)} className="py-4 border-b border-border text-lg font-bold hover:text-accent">
              ראשי
            </Link>
            <div className="border-b border-border">
              <button
                onClick={() => setShopOpen(!shopOpen)}
                className="w-full py-4 text-lg font-bold hover:text-accent flex items-center justify-between"
              >
                מוצרים
                <ChevronDown className={`w-5 h-5 transition-transform ${shopOpen ? 'rotate-180' : ''}`} />
              </button>
              {shopOpen && (
                <div>
                  <Link to="/sweets/products" onClick={() => setMobileOpen(false)} className="block py-3 pr-4 text-base font-medium hover:text-accent border-t border-border/50">
                    כל המוצרים
                  </Link>
                  {SWEETS_CATEGORIES.map((c) => (
                    <Link key={c.id} to={c.href} onClick={() => setMobileOpen(false)} className="block py-3 pr-4 text-base hover:text-accent border-t border-border/50">
                      {c.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link to="/sweets/story" onClick={() => setMobileOpen(false)} className="py-4 border-b border-border text-lg font-bold hover:text-accent">
              הסיפור שלנו
            </Link>
            <Link to="/sweets/shipping" onClick={() => setMobileOpen(false)} className="py-4 border-b border-border text-lg font-bold hover:text-accent">
              משלוחים
            </Link>
            <Link to="/sweets/contact" onClick={() => setMobileOpen(false)} className="py-4 border-b border-border text-lg font-bold hover:text-accent">
              צור קשר
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export { SWEETS_CATEGORIES };
