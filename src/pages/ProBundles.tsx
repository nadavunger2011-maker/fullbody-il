import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ShoppingBag, Check, Menu, X, Sparkles, Trophy, Crown } from "lucide-react";
import { getProductByHandle } from "@/data/herbalifeProducts";
import { useCartStore } from "@/stores/cartStore";
import { fetchProductByHandle, getFirstAvailableVariant } from "@/lib/shopify";
import { toast } from "sonner";
import CartDrawer from "@/components/CartDrawer";
import ProFooter from "@/components/ProFooter";
import greenLogo from "@/assets/logo-green.png";

interface BundleDef {
  id: string;
  badge: string;
  icon: typeof Sparkles;
  title: string;
  subtitle: string;
  productHandles: string[];
  discountPct: number;
  highlight?: boolean;
  color: string;
}

const BUNDLES: BundleDef[] = [
  {
    id: "starter",
    badge: "ערכת התחלה",
    icon: Sparkles,
    title: "ערכת זוג שייקים",
    subtitle: "2 שייקי פורמולה 1 - מושלם להתנסות ראשונה",
    productHandles: ["formula-1-vanilla", "formula-1-chocolate"],
    discountPct: 10,
    color: "hsl(142,70%,35%)",
  },
  {
    id: "shake-protein",
    badge: "שייק + חלבון",
    icon: Sparkles,
    title: "פורמולה 1 וניל + PDM חלבון",
    subtitle: "שייק הארוחה המוביל בשילוב תוספת חלבון PDM להעצמת התוצאות",
    productHandles: ["formula-1-vanilla", "pdm-protein"],
    discountPct: 10,
    color: "hsl(142,70%,35%)",
  },
  {
    id: "popular",
    badge: "הכי פופולרי",
    icon: Trophy,
    title: "ערכת חודש מלאה",
    subtitle: "3 שייקים + תה לבעירת שומנים - תוכנית 30 יום",
    productHandles: ["formula-1-vanilla", "formula-1-chocolate", "formula-1-cookies", "instant-herbal-original"],
    discountPct: 15,
    highlight: true,
    color: "hsl(142,70%,35%)",
  },
  {
    id: "premium",
    badge: "ערכה זוגית",
    icon: Crown,
    title: "ערכת זוגית 6 שייקים",
    subtitle: "6 שייקים מגוונים - מושלם לזוג או 60 יום ליחיד",
    productHandles: [
      "formula-1-vanilla",
      "formula-1-chocolate",
      "formula-1-cookies",
      "formula-1-banana",
      "formula-1-berries",
      "formula-1-melon",
    ],
    discountPct: 20,
    color: "hsl(142,70%,35%)",
  },
];


export default function ProBundles() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleAddBundle = async (bundle: BundleDef) => {
    setAddingId(bundle.id);
    try {
      let added = 0;
      for (const handle of bundle.productHandles) {
        const local = getProductByHandle(handle);
        if (!local) continue;
        const shopifyProduct = await fetchProductByHandle(local.shopifyHandle);
        if (!shopifyProduct) continue;
        const variant = getFirstAvailableVariant(shopifyProduct);
        if (!variant) continue;
        const ok = await addItem({
          product: shopifyProduct,
          variantId: variant.id,
          variantTitle: variant.title,
          price: variant.price,
          quantity: 1,
          selectedOptions: variant.selectedOptions || [],
          bundleId: bundle.id,
          bundleTitle: bundle.title,
          bundleDiscountPct: bundle.discountPct,
        });
        if (ok) added++;
      }
      if (added > 0) {
        toast.success(`${added} מוצרים נוספו לעגלה!`, {
          description: `הנחה אוטומטית של ${bundle.discountPct}% תופעל בקופה.`,
        });
        setIsCartOpen(true);
      } else {
        toast.error("לא הצלחנו להוסיף את הערכה. נסו שוב.");
      }
    } catch (err) {
      toast.error("שגיאה בהוספה לעגלה");
    } finally {
      setAddingId(null);
    }
  };

  const calcBundlePrice = (bundle: BundleDef) => {
    const total = bundle.productHandles.reduce((sum, h) => {
      const p = getProductByHandle(h);
      return sum + (p?.price || 0);
    }, 0);
    const discounted = total * (1 - bundle.discountPct / 100);
    return { original: Math.round(total), discounted: Math.round(discounted), savings: Math.round(total - discounted) };
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Helmet>
        <title>חבילות הרבלייף במחירים מיוחדים | FullBody</title>
        <meta name="description" content="חבילות חיסכון של מוצרי הרבלייף - שייקים, תה ותוספי תזונה. עד 20% הנחה על ערכות מוכנות מראש." />
        <link rel="canonical" href="https://fullbody.co.il/bundles" />
      </Helmet>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={greenLogo} alt="FullBody" className="h-10" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-[hsl(142,70%,35%)]">דף הבית</Link>
            <Link to="/products" className="hover:text-[hsl(142,70%,35%)]">מוצרים</Link>
            <Link to="/bundles" className="text-[hsl(142,70%,35%)] font-bold">חבילות</Link>
            <Link to="/blog" className="hover:text-[hsl(142,70%,35%)]">מאמרים</Link>
            <Link to="/contact" className="hover:text-[hsl(142,70%,35%)]">צור קשר</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2" aria-label="עגלה">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-[hsl(142,70%,35%)] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="תפריט">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <nav className="flex flex-col p-4 gap-3 text-sm">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>דף הבית</Link>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>מוצרים</Link>
              <Link to="/bundles" className="text-[hsl(142,70%,35%)] font-bold" onClick={() => setIsMobileMenuOpen(false)}>חבילות</Link>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)}>מאמרים</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>צור קשר</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[hsl(142,70%,35%)]/10 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block bg-[hsl(142,70%,35%)] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            חיסכון אמיתי
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            חבילות הרבלייף במחירים מיוחדים
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ערכות מוכנות מראש עם הנחה משמעותית. הוסיפו לעגלה בלחיצה אחת וההנחה תופעל אוטומטית בקופה.
          </p>
        </div>
      </section>

      {/* Bundles */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {BUNDLES.map((bundle) => {
            const Icon = bundle.icon;
            const { original, discounted, savings } = calcBundlePrice(bundle);
            return (
              <div
                key={bundle.id}
                className={`relative bg-card rounded-2xl border-2 p-6 flex flex-col transition-all hover:shadow-hover ${
                  bundle.highlight
                    ? "border-[hsl(142,70%,35%)] shadow-lg md:scale-105"
                    : "border-border"
                }`}
              >
                {bundle.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[hsl(142,70%,35%)] text-white text-xs font-bold px-4 py-1 rounded-full">
                    הכי משתלם
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[hsl(142,70%,35%)]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[hsl(142,70%,35%)]" />
                  </div>
                  <span className="text-xs font-bold text-[hsl(142,70%,35%)] uppercase">{bundle.badge}</span>
                </div>

                <h3 className="text-2xl font-black text-foreground mb-2">{bundle.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{bundle.subtitle}</p>

                {/* Products in bundle */}
                <ul className="space-y-2 mb-6 flex-1">
                  {bundle.productHandles.map((h) => {
                    const p = getProductByHandle(h);
                    if (!p) return null;
                    return (
                      <li key={h} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-[hsl(142,70%,35%)] flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{p.title}</span>
                      </li>
                    );
                  })}
                </ul>

                {/* Pricing */}
                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground line-through">₪{original}</span>
                    <span className="bg-[hsl(142,70%,35%)] text-white text-xs font-bold px-2 py-0.5 rounded">
                      -{bundle.discountPct}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[hsl(142,70%,35%)]">₪{discounted}</span>
                    <span className="text-sm text-muted-foreground">חיסכון של ₪{savings}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAddBundle(bundle)}
                  disabled={addingId === bundle.id}
                  className="w-full bg-[hsl(142,70%,35%)] text-white font-bold py-3 rounded-lg hover:bg-[hsl(142,70%,30%)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {addingId === bundle.id ? "מוסיף..." : "הוסף ערכה לעגלה"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Trust note */}
        <div className="text-center mt-12 max-w-2xl mx-auto">
          <p className="text-sm text-muted-foreground">
            * ההנחה מחושבת אוטומטית בקופה לאחר הוספת כל הפריטים. משלוח חינם בהזמנות מעל ₪299.
          </p>
        </div>
      </section>

      <ProFooter />
    </div>
  );
}
