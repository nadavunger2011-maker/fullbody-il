import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ArrowLeft, ShoppingBag, Search, Menu, X } from "lucide-react";
import { herbalifeProducts, PRO_PRODUCT_CATEGORIES, PRICE_RANGES } from "@/data/herbalifeProducts";
import ProProductFilters, { type ActiveFilters } from "@/components/ProProductFilters";
import ProFooter from "@/components/ProFooter";
import CartDrawer from "@/components/CartDrawer";
import { useCartStore } from "@/stores/cartStore";
import greenLogo from "@/assets/logo-green.webp";

export default function ProProducts() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<ActiveFilters>({
    proteinTypes: [],
    absorption: [],
    goals: [],
    flavors: [],
    priceRange: null,
  });

  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const filtered = useMemo(() => {
    return herbalifeProducts
      .filter((p) => selectedCategory === "all" || p.categoryId === selectedCategory)
      .filter((p) => !searchQuery.trim() || p.title.includes(searchQuery) || p.description.includes(searchQuery))
      .filter((p) => {
        const f = advancedFilters;
        if (f.proteinTypes.length && (!p.proteinType || !f.proteinTypes.some((t) => p.proteinType!.includes(t)))) return false;
        if (f.absorption.length && (!p.absorption || !f.absorption.includes(p.absorption))) return false;
        if (f.goals.length && (!p.goals || !f.goals.some((g) => p.goals!.includes(g)))) return false;
        if (f.flavors.length && (!p.flavors || !f.flavors.some((fl) => p.flavors!.includes(fl)))) return false;
        if (f.priceRange) {
          const range = PRICE_RANGES.find((r) => r.id === f.priceRange);
          if (range && (p.price < range.min || p.price >= range.max)) return false;
        }
        return true;
      });
  }, [selectedCategory, searchQuery, advancedFilters]);

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Helmet>
        <title>חנות מוצרי הרבלייף | FullBody</title>
        <meta name="description" content="קטלוג מלא של מוצרי הרבלייף - שייקים, חלבונים, ויטמינים ומוצרי ספורט. משלוח מהיר לכל הארץ." />
        <link rel="canonical" href="https://fullbody.co.il/products" />
      </Helmet>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={greenLogo} alt="FullBody" className="h-10" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="hover:text-[hsl(142,70%,35%)] transition-colors">דף הבית</Link>
            <Link to="/products" className="text-[hsl(142,70%,35%)] font-bold">מוצרים</Link>
            <Link to="/bundles" className="hover:text-[hsl(142,70%,35%)] transition-colors">חבילות</Link>
            <Link to="/blog" className="hover:text-[hsl(142,70%,35%)] transition-colors">מאמרים</Link>
            <Link to="/contact" className="hover:text-[hsl(142,70%,35%)] transition-colors">צור קשר</Link>
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
              <Link to="/products" className="text-[hsl(142,70%,35%)] font-bold" onClick={() => setIsMobileMenuOpen(false)}>מוצרים</Link>
              <Link to="/bundles" onClick={() => setIsMobileMenuOpen(false)}>חבילות</Link>
              <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)}>מאמרים</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>צור קשר</Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[hsl(142,70%,35%)]/10 to-background py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-3">חנות מוצרי הרבלייף</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            כל הקטלוג במקום אחד - שייקים, חלבונים, ויטמינים ומוצרי ספורט. {filtered.length} מוצרים זמינים.
          </p>
        </div>
      </section>

      {/* Search */}
      <div className="container mx-auto px-4 mt-6">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="חיפוש מוצר..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-3 rounded-lg border border-border bg-card focus:outline-none focus:border-[hsl(142,70%,35%)]"
          />
        </div>
      </div>

      {/* Categories */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
          {PRO_PRODUCT_CATEGORIES.filter(
            (c) => c.id === "all" || herbalifeProducts.some((p) => p.categoryId === c.id)
          ).map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedCategory === category.id
                  ? "bg-[hsl(142,70%,35%)] text-white"
                  : "bg-card border border-border text-muted-foreground hover:border-[hsl(142,70%,35%)]"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-64 lg:flex-shrink-0">
            <ProProductFilters filters={advancedFilters} onChange={setAdvancedFilters} />
          </div>
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">לא נמצאו מוצרים התואמים את החיפוש.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map((product, index) => (
                  <Link
                    key={product.handle}
                    to={`/product/${product.handle}`}
                    className="group bg-card rounded-xl overflow-hidden hover:shadow-hover transition-all border border-border flex flex-col animate-fade-in"
                    style={{ animationDelay: `${index * 0.03}s` }}
                  >
                    <div className="relative overflow-hidden aspect-square bg-secondary/20 flex items-center justify-center p-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        loading="lazy"
                        className="max-w-[80%] max-h-[80%] object-contain transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 right-2 bg-[hsl(142,70%,35%)] text-white text-[10px] font-bold px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="font-bold text-sm sm:text-base text-foreground mb-1 line-clamp-2 group-hover:text-[hsl(142,70%,35%)] transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{product.shortHook}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="font-black text-[hsl(142,70%,35%)]">₪{product.price}</span>
                        <ArrowLeft className="w-4 h-4 text-[hsl(142,70%,35%)]" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <ProFooter />
    </div>
  );
}
