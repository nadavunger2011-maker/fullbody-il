import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowRight, Tag, Menu, X, ShoppingBag, Search } from 'lucide-react';
import { proBlogCategories } from '@/data/proBlogPosts';
import { useAllBlogPosts, useAllBlogCategories } from '@/hooks/useBlogPosts';
import greenLogo from '@/assets/logo-green.webp';
import ProFooter from '@/components/ProFooter';
import { useCartStore } from '@/stores/cartStore';
import CartDrawer from '@/components/CartDrawer';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProBlog() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items: cartItems } = useCartStore();
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  const { posts: allPosts, isLoading } = useAllBlogPosts();
  const activeCategories = useAllBlogCategories(allPosts);

  const filteredPosts = selectedCategory === 'all'
    ? allPosts
    : allPosts.filter(p => p.categoryId === selectedCategory);

  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>בלוג תזונה וכושר | FullBody - מדריכים מקצועיים</title>
        <meta name="description" content="מאמרים מקצועיים בנושאי תזונה, חלבון, כושר וניהול משקל. טיפים מומחים של שי, יועץ תזונה מרעננה." />
        <link rel="canonical" href="https://fullbody.co.il/blog" />
        <meta property="og:title" content="בלוג תזונה וכושר | FullBody" />
        <meta property="og:description" content="מאמרים מקצועיים בנושאי תזונה, חלבון, כושר וניהול משקל. טיפים מומחים." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fullbody.co.il/blog" />
        <meta property="og:locale" content="he_IL" />
        <meta property="og:image" content="https://fullbody.co.il/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="בלוג תזונה וכושר | FullBody" />
        <meta name="twitter:description" content="מאמרים מקצועיים בנושאי תזונה, חלבון, כושר וניהול משקל." />
        <meta name="twitter:image" content="https://fullbody.co.il/og-image.jpg" />
      </Helmet>

      {/* Announcement */}
      <div className="bg-[hsl(142,70%,35%)] text-white text-center py-2.5 text-sm font-medium">
        מוצרי Herbalife מקוריים | משלוח חינם מעל ₪299
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 text-muted-foreground"><Menu className="w-6 h-6" /></button>
          <Link to="/"><img src={greenLogo} alt="FullBody Pro" className="h-14 md:h-16 w-auto" /></Link>
          <nav className="hidden lg:flex items-center gap-8 font-bold text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">ראשי</Link>
            <a href="/#products" className="hover:text-accent transition-colors">מוצרים</a>
            <Link to="/blog" className="text-[hsl(142,70%,35%)]">מאמרים</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">צור קשר</Link>
          </nav>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="p-2 text-muted-foreground relative">
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && <span className="absolute top-0 right-0 bg-[hsl(142,70%,35%)] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-foreground/50 z-40" />}
      <div className={`fixed inset-y-0 right-0 w-72 bg-card shadow-hover z-50 flex flex-col pt-20 px-6 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-5 left-5"><X className="w-6 h-6" /></button>
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-border text-lg font-bold">ראשי</Link>
        <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-border text-lg font-bold text-[hsl(142,70%,35%)]">מאמרים</Link>
        <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-border text-lg font-bold">צור קשר</Link>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Hero */}
      <section className="bg-[hsl(142,70%,35%)] py-16 text-center text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-4">בלוג FullBody Pro</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">מאמרים, מדריכים וטיפים בנושאי תזונה, כושר ואורח חיים בריא</p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={() => setSelectedCategory('all')} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === 'all' ? 'bg-[hsl(142,70%,35%)] text-white' : 'bg-secondary text-muted-foreground hover:text-[hsl(142,70%,35%)]'}`}>
              הכל
            </button>
            {activeCategories.map(cat => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat.id ? 'bg-[hsl(142,70%,35%)] text-white' : 'bg-secondary text-muted-foreground hover:text-[hsl(142,70%,35%)]'}`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading && Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl overflow-hidden border border-border">
                <Skeleton className="aspect-[16/9] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
            {filteredPosts.map((post, i) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                    <span className="bg-[hsl(142,70%,35%)]/10 text-[hsl(142,70%,35%)] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Tag className="w-3 h-3" />{post.category}
                    </span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.date).toLocaleDateString('he-IL')}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime} דק'</span>
                  </div>
                  <h2 className="font-bold text-lg text-foreground mb-2 group-hover:text-[hsl(142,70%,35%)] transition-colors line-clamp-2">{post.title}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                  <span className="text-[hsl(142,70%,35%)] font-bold text-sm flex items-center gap-1">
                    קרא עוד <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {filteredPosts.length === 0 && (
            <p className="text-center text-muted-foreground py-12">לא נמצאו מאמרים בקטגוריה זו</p>
          )}
        </div>
      </section>

      <ProFooter />
    </div>
  );
}
