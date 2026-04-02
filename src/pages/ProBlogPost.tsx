import { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowRight, Tag, Menu, X, ShoppingBag } from 'lucide-react';
import { proBlogCategories } from '@/data/proBlogPosts';
import { useBlogPostBySlug } from '@/hooks/useBlogPosts';
import { getProductByHandle, HerbalifeProduct } from '@/data/herbalifeProducts';
import greenLogo from '@/assets/logo-green.png';
import ProFooter from '@/components/ProFooter';
import { useCartStore } from '@/stores/cartStore';
import CartDrawer from '@/components/CartDrawer';
import { useState } from 'react';
import { fetchProductByHandle, getFirstAvailableVariant } from '@/lib/shopify';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProBlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items: cartItems, addItem } = useCartStore();
  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const { post, isLoading } = useBlogPostBySlug(slug);

  useEffect(() => {
    if (!isLoading && !post) navigate('/blog');
  }, [post, isLoading, navigate]);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Skeleton className="w-32 h-8" /></div>;
  if (!post) return null;

  const category = proBlogCategories.find(c => c.id === post.categoryId);
  const relatedProducts = post.relatedProductHandles.map(h => getProductByHandle(h)).filter(Boolean) as HerbalifeProduct[];

  const handleAddToCart = async (product: HerbalifeProduct) => {
    const shopifyProduct = await fetchProductByHandle(product.shopifyHandle);
    if (!shopifyProduct) { toast.error('לא ניתן לטעון מוצר'); return; }
    const variant = getFirstAvailableVariant(shopifyProduct);
    if (!variant) { toast.error('המוצר אזל מהמלאי'); return; }
    const ok = await addItem({
      product: shopifyProduct, variantId: variant.id, variantTitle: variant.title,
      price: variant.price, quantity: 1, selectedOptions: variant.selectedOptions || []
    });
    if (!ok) { toast.error('לא ניתן להוסיף לעגלה'); return; }
    setIsCartOpen(true);
    toast.success(`${product.title} נוסף לעגלה`);
  };

  // Schema.org - Article + FAQPage
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.metaDescription,
    "image": post.image,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": { "@type": "Organization", "name": "FullBody Pro", "url": "https://fullbody.co.il" },
    "publisher": { "@type": "Organization", "name": "FullBody Pro", "logo": { "@type": "ImageObject", "url": "https://fullbody.co.il/assets/logo-green.png" } },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://fullbody.co.il/blog/${post.slug}` },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faq.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "ראשי", "item": "https://fullbody.co.il/" },
      { "@type": "ListItem", "position": 2, "name": "בלוג", "item": "https://fullbody.co.il/blog" },
      { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://fullbody.co.il/blog/${post.slug}` },
    ],
  };

  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>{post.title} | FullBody Pro</title>
        <meta name="description" content={post.metaDescription} />
        <link rel="canonical" href={`https://fullbody.co.il/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
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
          <button onClick={() => setIsCartOpen(true)} className="p-2 text-muted-foreground relative">
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && <span className="absolute top-0 right-0 bg-[hsl(142,70%,35%)] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cartCount}</span>}
          </button>
        </div>
      </header>

      {isMobileMenuOpen && <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-foreground/50 z-40" />}
      <div className={`fixed inset-y-0 right-0 w-72 bg-card shadow-hover z-50 flex flex-col pt-20 px-6 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-5 left-5"><X className="w-6 h-6" /></button>
        <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-border text-lg font-bold">ראשי</Link>
        <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-border text-lg font-bold text-[hsl(142,70%,35%)]">מאמרים</Link>
        <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-4 border-b border-border text-lg font-bold">צור קשר</Link>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-[hsl(142,70%,35%)]">ראשי</Link>
            <ArrowRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-[hsl(142,70%,35%)]">בלוג</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="aspect-[21/9] max-h-[400px] overflow-hidden">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        </div>
        <div className="container mx-auto px-4">
          <div className="relative -mt-32 bg-card rounded-t-2xl p-6 sm:p-10 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-[hsl(142,70%,35%)] text-white text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
                <Tag className="w-4 h-4" />{category?.name}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground"><Calendar className="w-4 h-4" />{new Date(post.date).toLocaleDateString('he-IL')}</span>
              <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-4 h-4" />{post.readTime} דקות קריאה</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-tight">{post.title}</h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <article className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card rounded-b-2xl p-6 sm:p-10 -mt-1">
            <div className="blog-content prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-muted-foreground prose-p:leading-relaxed prose-ul:text-muted-foreground prose-li:my-1 prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>

      {/* FAQ Section */}
      {post.faq.length > 0 && (
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-black text-foreground mb-6 text-center">שאלות ותשובות</h2>
              <div className="space-y-3">
                {post.faq.map((item, i) => (
                  <details key={i} className="bg-card border border-border rounded-xl group">
                    <summary className="px-6 py-4 cursor-pointer font-bold text-foreground flex items-center justify-between list-none">
                      {item.question}
                      <ChevronIcon />
                    </summary>
                    <div className="px-6 pb-4 text-muted-foreground">{item.answer}</div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Related Products (Silo) */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-black text-foreground mb-8 text-center">מוצרים מומלצים מהמאמר</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((product, i) => (
                  <div key={product.sku} className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-hover transition-all animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                    <Link to={`/product/${product.handle}`}>
                      <div className="aspect-square overflow-hidden bg-secondary/20 flex items-center justify-center p-4">
                        <img src={product.image} alt={product.title} className="max-w-[75%] max-h-[75%] object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    </Link>
                    <div className="p-3">
                      <Link to={`/product/${product.handle}`}>
                        <h3 className="font-bold text-sm text-foreground mb-1 group-hover:text-[hsl(142,70%,35%)] transition-colors line-clamp-2">{product.title}</h3>
                      </Link>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-black text-lg text-foreground">₪{product.price}</span>
                      </div>
                      <button onClick={() => handleAddToCart(product)} className="w-full bg-[hsl(142,70%,35%)] text-white font-bold py-2 text-sm rounded-lg transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-1">
                        הוסף לעגלה <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Back */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[hsl(142,70%,35%)] font-bold hover:gap-3 transition-all">
            <ArrowRight className="w-5 h-5" />חזרה לכל המאמרים
          </Link>
        </div>
      </section>

      <ProFooter />
    </div>
  );
}

function ChevronIcon() {
  return (
    <svg className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
