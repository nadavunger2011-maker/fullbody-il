import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Menu, X, ShoppingBag, Search, 
  Truck, ShieldCheck, CheckCircle, HeartPulse, 
  ChevronDown
} from 'lucide-react';
import logoImage from '@/assets/logo.png';
import { fetchShopifyProducts, ShopifyProduct, CartItem as ShopifyCartItem } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';
import { useFlashyPageView } from '@/hooks/useFlashyPageView';

import AccessibilityWidget from './AccessibilityWidget';
import CartDrawer from './CartDrawer';
import Footer from './Footer';

type SortOption = 'default' | 'price-asc' | 'price-desc';

// Count Up Animation Component
const CountUpNumber = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div ref={ref} className="text-4xl font-black text-primary-foreground">
      {count}{suffix}
    </div>
  );
};

// Category definitions with Hebrew names and product title keywords
const CATEGORIES = [
  { id: 'all', name: 'הכל' },
  { id: 'vitamins', name: 'ויטמינים ומינרלים', keywords: ['ויטמין', 'B12', 'D3', 'K2', 'ברזל', 'אבץ', 'סי', 'ביקומפלקס', 'B קומפלקס', 'פולאט', 'מגנזיום'] },
  { id: 'mood', name: 'מצב רוח ושינה', keywords: ['5HTP', 'גאבא', 'GABA', 'זעפרן', 'SAFFRON', 'ולריאן', 'Valerian', 'אינוסיטול', 'ג\'ינקו', 'בילובה'] },
  { id: 'digestion', name: 'עיכול ודיאטה', keywords: ['גרסיניה', 'Garcinia', 'חומץ תפוחים', 'גימנמה', 'Gymnema', 'נאוהפייבר', 'Navafiber', 'גסטרידין', 'ברומליין', 'Bromelain', 'מאנוז', 'בוכו', 'פייבר'] },
  { id: 'energy', name: 'אנרגיה וספורט', keywords: ['ג\'ינסינג', 'Ginseng', 'קורדיספס', 'cordyceps', 'גלוקוזמין', 'Glucosamine', 'ג\'ל עיסוי', 'ICE GEL', 'MSM', 'כונדריאטין'] },
  { id: 'beauty', name: 'יופי ואנטי אייג\'ינג', keywords: ['קולגן', 'אסטקסנטין', 'Astaxanthin', 'ענבים', 'grape', 'סופרפוד', 'SUPER FOOD', 'היאלורונית'] },
  { id: 'kids', name: 'ילדים', keywords: ['דובונים', 'דגונים', '300 דובונים'] },
  { id: 'diagnostics', name: 'בדיקות', keywords: ['בדיקה', 'בדיקת', 'GI MAP', 'שיער'] },
];

// Function to determine product category based on title
const getProductCategory = (title: string): string => {
  const lowerTitle = title.toLowerCase();
  for (const category of CATEGORIES) {
    if (category.id === 'all') continue;
    if (category.keywords?.some(keyword => lowerTitle.includes(keyword.toLowerCase()))) {
      return category.id;
    }
  }
  return 'vitamins'; // Default category
};

// Mobile Menu Component
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  categories: typeof CATEGORIES;
  onCategorySelect: (categoryId: string) => void;
}

const MobileMenu = ({ isOpen, onClose, categories, onCategorySelect }: MobileMenuProps) => {
  const [isShopExpanded, setIsShopExpanded] = useState(false);

  return (
    <div className={`fixed inset-y-0 right-0 w-72 bg-card shadow-hover z-50 flex flex-col pt-20 px-6 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <button 
        onClick={onClose}
        className="absolute top-5 left-5 text-muted-foreground hover:text-accent transition-colors"
        aria-label="סגור תפריט"
      >
        <X className="w-6 h-6" />
      </button>
      
      <Link to="/" onClick={onClose} className="py-4 border-b border-border text-lg font-bold hover:text-accent transition-colors">
        ראשי
      </Link>
      
      {/* Shop with Submenu */}
      <div className="border-b border-border">
        <button 
          onClick={() => setIsShopExpanded(!isShopExpanded)}
          className="w-full py-4 text-lg font-bold hover:text-accent transition-colors flex items-center justify-between"
        >
          חנות
          <ChevronDown className={`w-5 h-5 transition-transform ${isShopExpanded ? 'rotate-180' : ''}`} />
        </button>
        
        <div className={`overflow-hidden transition-all duration-300 ${isShopExpanded ? 'max-h-96' : 'max-h-0'}`}>
          <a 
            href="#products" 
            onClick={() => {
              onCategorySelect('all');
            }}
            className="block py-3 pr-4 text-base font-medium hover:text-accent transition-colors border-t border-border/50"
          >
            כל המוצרים
          </a>
          {categories.filter(c => c.id !== 'all').map(category => (
            <a 
              key={category.id}
              href="#products" 
              onClick={() => {
                onCategorySelect(category.id);
              }}
              className="block py-3 pr-4 text-base hover:text-accent transition-colors border-t border-border/50"
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>
      
      <Link to="/blog" onClick={onClose} className="py-4 border-b border-border text-lg font-bold hover:text-accent transition-colors">
        מאמרים
      </Link>
      <Link to="/about" onClick={onClose} className="py-4 border-b border-border text-lg font-bold hover:text-accent transition-colors">
        אודות
      </Link>
      <Link to="/contact" onClick={onClose} className="py-4 border-b border-border text-lg font-bold hover:text-accent transition-colors">
        צור קשר
      </Link>
    </div>
  );
};

// Product Skeleton Component
const ProductSkeleton = ({ index }: { index: number }) => (
  <div 
    className="bg-card rounded-xl overflow-hidden border border-border flex flex-col animate-fade-in"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <div className="relative h-64 bg-secondary animate-pulse" />
    <div className="p-5 flex-1 flex flex-col gap-3">
      <div className="h-3 w-16 bg-secondary rounded animate-pulse" />
      <div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
      <div className="mt-auto flex items-center justify-between mb-4">
        <div className="h-6 w-16 bg-secondary rounded animate-pulse" />
        <div className="h-4 w-20 bg-secondary rounded animate-pulse" />
      </div>
      <div className="h-12 w-full bg-secondary rounded-lg animate-pulse" />
    </div>
  </div>
);

export default function FullBody() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);

  // Send Flashy PageView event for general pages
  useFlashyPageView();

  // Cart store
  const { items: cartItems, addItem } = useCartStore();

  // Fetch products (mock data for now)
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const shopifyProducts = await fetchShopifyProducts(50);
      setProducts(shopifyProducts);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(p => getProductCategory(p.node.title) === selectedCategory);
    }
    
    // Filter by search
    if (searchQuery.trim()) {
      result = result.filter(p => 
        p.node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.node.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => 
        parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount)
      );
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => 
        parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount)
      );
    }
    
    return result;
  }, [products, searchQuery, sortBy, selectedCategory]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;

    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    });
    
    setIsCartOpen(true);
    toast.success(`${product.node.title} נוסף לעגלה`);
  };


  const cartTotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>FullBody - תוספי תזונה איכותיים | משלוח חינם מעל ₪299</title>
        <meta name="description" content="חנות תוספי התזונה המובילה בישראל. אבקות חלבון, ויטמינים, פרה-וורקאאוט ועוד. מוצרים כשרים למהדרין, משלוח מהיר לכל הארץ." />
        <link rel="canonical" href="https://fullbody.co.il/" />
        <meta property="og:title" content="FullBody - תוספי תזונה איכותיים" />
        <meta property="og:description" content="חנות תוספי התזונה המובילה בישראל. אבקות חלבון, ויטמינים, פרה-וורקאאוט ועוד." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fullbody.co.il/" />
      </Helmet>
      
      <AccessibilityWidget />
      
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2.5 text-sm font-medium">
        משלוח חינם בקנייה מעל ₪299 | כשר למהדרין
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-muted-foreground hover:text-accent transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logoImage} alt="FullBody - תוספי תזונה פרימיום" className="h-14 md:h-16 w-auto" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 font-bold text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">ראשי</Link>
            
            {/* Shop Dropdown */}
            <div className="relative group">
              <a 
                href="#products" 
                className="hover:text-accent transition-colors flex items-center gap-1"
              >
                חנות
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </a>
              <div className="absolute top-full right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-card border border-border rounded-lg shadow-hover py-2 min-w-[200px]">
                  <a 
                    href="#products" 
                    onClick={() => setSelectedCategory('all')}
                    className="block px-4 py-2.5 hover:bg-secondary hover:text-accent transition-colors font-medium"
                  >
                    כל המוצרים
                  </a>
                  {CATEGORIES.filter(c => c.id !== 'all').map(category => (
                    <a 
                      key={category.id}
                      href="#products" 
                      onClick={() => setSelectedCategory(category.id)}
                      className="block px-4 py-2.5 hover:bg-secondary hover:text-accent transition-colors"
                    >
                      {category.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            <Link to="/blog" className="hover:text-accent transition-colors">מאמרים</Link>
            <Link to="/about" className="hover:text-accent transition-colors">אודות</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">צור קשר</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-muted-foreground hover:text-accent transition-colors"
              aria-label="חיפוש"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-muted-foreground hover:text-accent transition-colors relative group"
              aria-label="עגלת קניות"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold animate-bounce-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        categories={CATEGORIES}
        onCategorySelect={(categoryId) => {
          setSelectedCategory(categoryId);
          setIsMobileMenuOpen(false);
        }}
      />

      {/* Overlay for Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-foreground/50 z-40 transition-opacity duration-300 animate-fade-in"
        ></div>
      )}

      {/* Cart Drawer Component */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=75&fm=webp" 
            alt="Gym Background" 
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-transparent"></div>
        </div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-2xl text-primary-foreground">
            <span className="bg-accent px-4 py-1.5 rounded-md text-sm font-bold uppercase tracking-wide mb-4 inline-block animate-fade-in">חדש ב-fullbody.co.il</span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight animate-slide-up">
              לפרוץ את הגבולות <br /> <span className="text-accent">של הגוף שלך</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-foreground/80 font-light animate-slide-up" style={{ animationDelay: '0.1s' }}>
              FullBody תוספי תזונה פרימיום לספורטאים. נבדק מדעית, טעים בטירוף, תוצאות מוכחות.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <a href="#products" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-4 px-8 rounded-lg text-center transition-all shadow-cta">
                קנה עכשיו
              </a>
              <a href="#about" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 backdrop-blur-sm border border-primary-foreground/30 text-primary-foreground font-bold py-4 px-8 rounded-lg text-center transition-all">
                למידע נוסף
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: Truck, title: "משלוח מהיר", text: "עד 3 ימי עסקים לכל הארץ" },
              { icon: ShieldCheck, title: "תשלום מאובטח", text: "תקן אבטחה מחמיר SSL" },
              { icon: CheckCircle, title: "כשרות מהודרת", text: "כל המוצרים כשרים" },
              { icon: HeartPulse, title: "איכות מובטחת", text: "רכיבים טבעיים בלבד" }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-3 group">
                <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-all duration-300">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-accent font-bold text-sm tracking-widest uppercase">הנמכרים ביותר</span>
            <h2 className="text-4xl font-black text-primary mt-2">המוצרים שלנו</h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-accent text-accent-foreground shadow-cta'
                    : 'bg-card border border-border text-muted-foreground hover:border-accent hover:text-accent'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-muted-foreground text-sm">{filteredProducts.length} מוצרים</p>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-card border border-border rounded-lg px-4 py-2.5 pr-10 font-bold text-sm text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="default">מיון: ברירת מחדל</option>
                <option value="price-asc">מחיר: מהנמוך לגבוה</option>
                <option value="price-desc">מחיר: מהגבוה לנמוך</option>
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {isLoading ? (
              // Loading Skeletons
              [...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} index={index} />
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-xl font-bold text-foreground mb-2">לא נמצאו מוצרים</p>
                <p className="text-muted-foreground">נסו לחפש במילים אחרות או לבחור קטגוריה אחרת</p>
              </div>
            ) : (
              filteredProducts.map((product, index) => (
                <div 
                  key={product.node.id} 
                  className="group bg-card rounded-xl overflow-hidden hover:shadow-hover transition-all duration-300 border border-border flex flex-col animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <Link to={`/product/${product.node.handle}`} className="relative overflow-hidden aspect-square bg-secondary/30 block cursor-pointer flex items-center justify-center p-4">
                    {product.node.images?.edges?.[0]?.node ? (
                      <img 
                        src={product.node.images.edges[0].node.url} 
                        alt={product.node.title}
                        loading="lazy"
                        decoding="async"
                        className="max-w-[85%] max-h-[85%] object-contain transform group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-30" />
                      </div>
                    )}
                  </Link>
                  <div className="p-3 sm:p-5 flex-1 flex flex-col">
                    <Link to={`/product/${product.node.handle}`} className="font-bold text-sm sm:text-lg text-foreground mb-1 sm:mb-2 group-hover:text-accent transition-colors hover:underline">
                      <span className="sm:hidden">{product.node.title.length > 25 ? product.node.title.slice(0, 25) + '...' : product.node.title}</span>
                      <span className="hidden sm:inline">{product.node.title}</span>
                    </Link>
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-4">
                      <span className="sm:hidden">{product.node.description.length > 60 ? product.node.description.slice(0, 60) + '...' : product.node.description}</span>
                      <span className="hidden sm:inline">{product.node.description}</span>
                    </p>
                    <div className="mt-auto flex items-center justify-between mb-2 sm:mb-4">
                      <span className="font-black text-lg sm:text-xl text-foreground">
                        {product.node.priceRange.minVariantPrice.currencyCode === 'ILS' ? '₪' : product.node.priceRange.minVariantPrice.currencyCode}
                        {parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(0)}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-accent text-accent-foreground font-bold py-2 sm:py-3 text-sm sm:text-base rounded-lg shadow-cta transition-all duration-300 flex justify-center items-center gap-2 hover:bg-accent/90 active:scale-95 border border-primary-foreground/20"
                    >
                      הוסף לעגלה
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-black mb-6">אודות FullBody</h2>
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              FullBody נוסדה מתוך תשוקה לעולם הכושר ורצון לספק את תוספי התזונה האיכותיים ביותר לספורטאים בישראל. 
              כל המוצרים שלנו עוברים בדיקות קפדניות ומיוצרים מחומרי גלם פרימיום.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <CountUpNumber target={5} suffix="+" />
                <div className="text-sm text-primary-foreground/60">שנות ניסיון</div>
              </div>
              <div className="text-center">
                <CountUpNumber target={50} suffix="K+" />
                <div className="text-sm text-primary-foreground/60">לקוחות מרוצים</div>
              </div>
              <div className="text-center">
                <CountUpNumber target={100} suffix="%" />
                <div className="text-sm text-primary-foreground/60">כשרות למהדרין</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Search Popup */}
      {isSearchOpen && (
        <>
          <div 
            className="fixed inset-0 bg-foreground/70 z-50 animate-fade-in"
            onClick={() => setIsSearchOpen(false)}
          />
          <div className="fixed top-0 left-0 right-0 bg-card z-50 p-6 shadow-hover animate-slide-up">
            <div className="container mx-auto max-w-2xl">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="חיפוש מוצרים..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pr-12 pl-4 py-4 rounded-lg border border-border bg-background text-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                </div>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-3 text-muted-foreground hover:text-accent transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {searchQuery && (
                <div className="mt-4 max-h-80 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    <div className="space-y-2">
                      {filteredProducts.slice(0, 5).map(product => (
                        <Link 
                          key={product.node.id}
                          to={`/product/${product.node.handle}`}
                          onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary transition-colors"
                        >
                          {product.node.images?.edges?.[0]?.node && (
                            <img src={product.node.images.edges[0].node.url} alt={product.node.title} className="w-12 h-12 rounded object-cover" />
                          )}
                          <div>
                            <p className="font-bold text-foreground">{product.node.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {product.node.priceRange.minVariantPrice.currencyCode === 'ILS' ? '₪' : product.node.priceRange.minVariantPrice.currencyCode}
                              {parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(0)}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">לא נמצאו תוצאות</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
