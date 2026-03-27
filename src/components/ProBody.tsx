import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Menu, X, ShoppingBag, Search, 
  Truck, ShieldCheck, CheckCircle, HeartPulse, 
  ChevronDown, Leaf, Dumbbell, Zap, ArrowRight
} from 'lucide-react';
import { fetchShopifyProducts, ShopifyProduct, getFirstAvailableVariant, isProductAvailableForSale } from '@/lib/shopify';
import { herbalifeProducts, PRO_PRODUCT_CATEGORIES, HerbalifeProduct } from '@/data/herbalifeProducts';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';

import CartDrawer from './CartDrawer';
import Footer from './Footer';

type SortOption = 'default' | 'price-asc' | 'price-desc';

// Herbalife-specific categories
const PRO_CATEGORIES = [
  { id: 'all', name: 'הכל' },
  { id: 'shakes', name: 'שייקים', keywords: ['שייק', 'shake', 'formula 1', 'פורמולה'] },
  { id: 'protein', name: 'חלבון', keywords: ['חלבון', 'protein', 'pdm'] },
  { id: 'tea', name: 'תה ומשקאות', keywords: ['תה', 'tea', 'אלוורה', 'aloe', 'משקה'] },
  { id: 'vitamins', name: 'ויטמינים ומינרלים', keywords: ['ויטמין', 'vitamin', 'מולטי', 'multi', 'מינרל'] },
  { id: 'sport', name: 'ספורט וביצועים', keywords: ['ספורט', 'sport', 'cr7', 'H24', 'אנרגיה', 'energy'] },
  { id: 'skin', name: 'טיפוח ועור', keywords: ['עור', 'skin', 'קולגן', 'collagen', 'herbalife skin'] },
];

const getProCategory = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  for (const category of PRO_CATEGORIES) {
    if (category.id === 'all') continue;
    if (category.keywords?.some(keyword => lowerTitle.includes(keyword.toLowerCase()))) {
      return category.id;
    }
  }
  return 'shakes';
};

// Mobile Menu
const ProMobileMenu = ({ isOpen, onClose, categories, onCategorySelect }: {
  isOpen: boolean;
  onClose: () => void;
  categories: typeof PRO_CATEGORIES;
  onCategorySelect: (id: string) => void;
}) => {
  const [isShopExpanded, setIsShopExpanded] = useState(false);

  return (
    <div className={`fixed inset-y-0 right-0 w-72 bg-card shadow-hover z-50 flex flex-col pt-20 px-6 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <button onClick={onClose} className="absolute top-5 left-5 text-muted-foreground hover:text-accent transition-colors" aria-label="סגור תפריט">
        <X className="w-6 h-6" />
      </button>
      
      <Link to="/pro" onClick={onClose} className="py-4 border-b border-border text-lg font-bold hover:text-accent transition-colors">ראשי</Link>
      
      <div className="border-b border-border">
        <button onClick={() => setIsShopExpanded(!isShopExpanded)} className="w-full py-4 text-lg font-bold hover:text-accent transition-colors flex items-center justify-between">
          מוצרים
          <ChevronDown className={`w-5 h-5 transition-transform ${isShopExpanded ? 'rotate-180' : ''}`} />
        </button>
        <div className={`overflow-hidden transition-all duration-300 ${isShopExpanded ? 'max-h-96' : 'max-h-0'}`}>
          <a href="#products" onClick={() => { onCategorySelect('all'); }} className="block py-3 pr-4 text-base font-medium hover:text-accent transition-colors border-t border-border/50">כל המוצרים</a>
          {categories.filter(c => c.id !== 'all').map(category => (
            <a key={category.id} href="#products" onClick={() => { onCategorySelect(category.id); }} className="block py-3 pr-4 text-base hover:text-accent transition-colors border-t border-border/50">{category.name}</a>
          ))}
        </div>
      </div>
      
      <Link to="/pro/about" onClick={onClose} className="py-4 border-b border-border text-lg font-bold hover:text-accent transition-colors">אודות</Link>
      <Link to="/contact" onClick={onClose} className="py-4 border-b border-border text-lg font-bold hover:text-accent transition-colors">צור קשר</Link>
    </div>
  );
};

// Product Skeleton
const ProductSkeleton = ({ index }: { index: number }) => (
  <div className="bg-card rounded-xl overflow-hidden border border-border flex flex-col animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
    <div className="relative h-64 bg-secondary animate-pulse" />
    <div className="p-5 flex-1 flex flex-col gap-3">
      <div className="h-3 w-16 bg-secondary rounded animate-pulse" />
      <div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
      <div className="mt-auto flex items-center justify-between mb-4">
        <div className="h-6 w-16 bg-secondary rounded animate-pulse" />
      </div>
      <div className="h-12 w-full bg-secondary rounded-lg animate-pulse" />
    </div>
  </div>
);

export default function ProBody() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { items: cartItems, addItem } = useCartStore();

  // Fetch only Herbalife products
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const shopifyProducts = await fetchShopifyProducts(50, 'vendor:Herbalife');
      setProducts(shopifyProducts);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory !== 'all') {
      result = result.filter(p => getProCategory(p.node.title) === selectedCategory);
    }
    if (searchQuery.trim()) {
      result = result.filter(p =>
        p.node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.node.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount));
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount));
    }
    return result;
  }, [products, searchQuery, sortBy, selectedCategory]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
  }, [isMobileMenuOpen]);

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = getFirstAvailableVariant(product);
    if (!variant) { toast.error('המוצר אזל מהמלאי'); return; }
    const ok = await addItem({
      product, variantId: variant.id, variantTitle: variant.title,
      price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions || []
    });
    if (!ok) { toast.error('לא ניתן להוסיף לעגלה כרגע'); return; }
    setIsCartOpen(true);
    toast.success(`${product.node.title} נוסף לעגלה`);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>FullBody Pro - מוצרי Herbalife | תזונה וכושר</title>
        <meta name="description" content="מוצרי Herbalife לתזונה, כושר ואורח חיים בריא. שייקים, חלבונים, ויטמינים ותוספי ספורט. משלוח מהיר לכל הארץ." />
        <link rel="canonical" href="https://pro.fullbody.co.il/" />
        <meta property="og:title" content="FullBody Pro - מוצרי Herbalife" />
        <meta property="og:description" content="מוצרי Herbalife לתזונה, כושר ואורח חיים בריא." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pro.fullbody.co.il/" />
        <meta property="og:locale" content="he_IL" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Announcement Bar */}
      <div className="bg-[hsl(142,70%,35%)] text-primary-foreground text-center py-2.5 text-sm font-medium">
        <span className="flex items-center justify-center gap-2">
          <Leaf className="w-4 h-4" />
          מוצרי Herbalife מקוריים | משלוח חינם מעל ₪299
          <Leaf className="w-4 h-4" />
        </span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-muted-foreground hover:text-accent transition-colors">
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/pro" className="flex items-center">
            <img src="https://fullbody.co.il/assets/logo-C2aje_0c.png" alt="FullBody Pro" className="h-14 md:h-16 w-auto" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-bold text-muted-foreground">
            <Link to="/pro" className="hover:text-accent transition-colors">ראשי</Link>
            <div className="relative group">
              <a href="#products" className="hover:text-accent transition-colors flex items-center gap-1">
                מוצרים
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </a>
              <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-card border border-border rounded-lg shadow-hover py-2 min-w-[200px]">
                  <a href="#products" onClick={() => setSelectedCategory('all')} className="block px-4 py-2.5 hover:bg-secondary hover:text-accent transition-colors font-medium">כל המוצרים</a>
                  {PRO_CATEGORIES.filter(c => c.id !== 'all').map(category => (
                    <a key={category.id} href="#products" onClick={() => setSelectedCategory(category.id)} className="block px-4 py-2.5 hover:bg-secondary hover:text-accent transition-colors">{category.name}</a>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/contact" className="hover:text-accent transition-colors">צור קשר</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-muted-foreground hover:text-accent transition-colors" aria-label="חיפוש">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="p-2 text-muted-foreground hover:text-accent transition-colors relative" aria-label="עגלת קניות">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <ProMobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} categories={PRO_CATEGORIES} onCategorySelect={(id) => { setSelectedCategory(id); setIsMobileMenuOpen(false); }} />

      {isMobileMenuOpen && (
        <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-foreground/50 z-40 transition-opacity duration-300 animate-fade-in" />
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Hero Section - Herbalife themed */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=75&fm=webp"
            alt="Gym Background"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
        </div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-2xl text-primary-foreground">
            <span className="bg-[hsl(142,70%,35%)] px-4 py-1.5 rounded-md text-sm font-bold uppercase tracking-wide mb-4 inline-block text-white animate-fade-in">
              Herbalife Nutrition
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-slide-up">
              תזונה חכמה <br /> <span className="text-[hsl(142,70%,50%)]">לחיים בריאים</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/80 font-light animate-slide-up" style={{ animationDelay: '0.1s' }}>
              מוצרי Herbalife מקוריים לשליטה במשקל, ביצועי ספורט ובריאות יומיומית.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <a href="#products" className="bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,30%)] text-white font-bold py-4 px-8 rounded-lg text-center transition-all shadow-cta">
                לכל המוצרים
              </a>
              <Link to="/contact" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/30 text-primary-foreground font-bold py-4 px-8 rounded-lg text-center transition-all">
                ייעוץ אישי
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Leaf, title: "מוצרים מקוריים", text: "Herbalife מקורי 100%" },
              { icon: Truck, title: "משלוח מהיר", text: "עד 3 ימי עסקים" },
              { icon: ShieldCheck, title: "תשלום מאובטח", text: "SSL מוצפן" },
              { icon: Dumbbell, title: "ייעוץ מקצועי", text: "ליווי אישי ותוכנית תזונה" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 bg-[hsl(142,70%,35%)]/10 rounded-full flex items-center justify-center text-[hsl(142,70%,35%)] group-hover:bg-[hsl(142,70%,35%)] group-hover:text-white transition-all duration-300">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Local Herbalife Catalog */}
      <section id="products" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-[hsl(142,70%,35%)] font-bold text-sm tracking-widest uppercase">Herbalife Nutrition</span>
            <h2 className="text-4xl font-black text-primary mt-2">המוצרים שלנו</h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
            {PRO_PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-[hsl(142,70%,35%)] text-white shadow-cta'
                    : 'bg-card border border-border text-muted-foreground hover:border-[hsl(142,70%,35%)] hover:text-[hsl(142,70%,35%)]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Products Grid - Local Catalog */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {herbalifeProducts
              .filter(p => selectedCategory === 'all' || p.categoryId === selectedCategory)
              .filter(p => !searchQuery.trim() || p.title.includes(searchQuery) || p.description.includes(searchQuery))
              .map((product, index) => (
              <Link
                key={product.sku}
                to={`/pro/product/${product.handle}`}
                className="group bg-card rounded-xl overflow-hidden hover:shadow-hover transition-all duration-300 border border-border flex flex-col animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative overflow-hidden aspect-square bg-secondary/20 flex items-center justify-center p-6">
                  <img
                    src={product.image}
                    alt={product.title}
                    loading="lazy"
                    className="max-w-[75%] max-h-[75%] object-contain transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-[hsl(142,70%,35%)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>
                <div className="p-3 sm:p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-sm sm:text-lg text-foreground mb-1 sm:mb-2 group-hover:text-[hsl(142,70%,35%)] transition-colors">
                    <span className="sm:hidden">{product.title.length > 25 ? product.title.slice(0, 25) + '...' : product.title}</span>
                    <span className="hidden sm:inline">{product.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3">
                    {product.shortHook}
                  </p>
                  <span className="mt-auto text-[hsl(142,70%,35%)] font-bold text-sm flex items-center gap-1">
                    לפרטים נוספים <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Herbalife Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">למה Herbalife?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              מותג עולמי מוביל בתזונה מאוזנת ואורח חיים בריא, פועל ב-90 מדינות
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: "רכיבים טבעיים", text: "מוצרים מבוססי מדע עם רכיבים טבעיים ואיכותיים, ללא חומרים מיותרים." },
              { icon: Dumbbell, title: "תזונת ספורט", text: "קו מוצרי H24 לספורטאים — חלבון, אנרגיה וריהידרציה לביצועים מיטביים." },
              { icon: Zap, title: "שליטה במשקל", text: "תוכניות תזונה מוכחות לשליטה במשקל עם ליווי מקצועי ותוצאות." },
            ].map((item, index) => (
              <div key={index} className="bg-card rounded-2xl p-8 border border-border hover:shadow-hover transition-all duration-300 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[hsl(142,70%,35%)]/10 rounded-full flex items-center justify-center text-[hsl(142,70%,35%)]">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[hsl(142,70%,35%)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">מוכנים להתחיל?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">צרו קשר לייעוץ תזונה אישי ותוכנית מותאמת אישית</p>
          <Link to="/contact" className="inline-block bg-white text-[hsl(142,70%,35%)] font-bold py-4 px-8 rounded-lg shadow-lg hover:bg-white/90 transition-all">
            צרו קשר לייעוץ
          </Link>
        </div>
      </section>

      <Footer />

      {/* Search Popup */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-foreground/60 z-50 flex items-start justify-center pt-32 animate-fade-in" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-card rounded-2xl shadow-hover p-6 w-full max-w-xl mx-4 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="חיפוש מוצרי Herbalife..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-lg text-foreground placeholder:text-muted-foreground"
                autoFocus
              />
              <button onClick={() => setIsSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            {searchQuery && (
              <div className="mt-4 max-h-60 overflow-y-auto">
                {filteredProducts.length > 0 ? filteredProducts.slice(0, 5).map(p => (
                  <Link key={p.node.id} to={`/pro/product/${p.node.handle}`} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-3 py-3 hover:bg-secondary/50 rounded-lg px-2 transition-colors">
                    {p.node.images?.edges?.[0]?.node && <img src={p.node.images.edges[0].node.url} alt="" className="w-10 h-10 object-contain rounded" />}
                    <div>
                      <p className="font-bold text-foreground text-sm">{p.node.title}</p>
                      <p className="text-xs text-muted-foreground">₪{parseFloat(p.node.priceRange.minVariantPrice.amount).toFixed(0)}</p>
                    </div>
                  </Link>
                )) : (
                  <p className="text-center text-muted-foreground py-4">לא נמצאו תוצאות</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
