import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { blogPosts, blogCategories } from './Blog';
import { fetchShopifyProducts, ShopifyProduct, getFirstAvailableVariant, isProductAvailableForSale } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';
import type { CartItem as ShopifyCartItem } from '@/lib/shopify';

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { addItem } = useCartStore();

  const post = blogPosts.find(p => p.slug === slug);

  useEffect(() => {
    if (!post) {
      navigate('/blog');
      return;
    }

    const loadRelatedProducts = async () => {
      setIsLoading(true);
      const products = await fetchShopifyProducts(20);
      
      // Filter products based on post's related keywords
      let filtered = products.filter(product => 
        post.relatedProducts.some(keyword => 
          product.node.title.toLowerCase().includes(keyword.toLowerCase()) || 
          product.node.description.toLowerCase().includes(keyword.toLowerCase())
        )
      ).slice(0, 4);
      
      // If no matches found, show first 4 available products as recommendations
      if (filtered.length === 0 && products.length > 0) {
        filtered = products.filter(p => 
          p.node.images?.edges?.length > 0 && 
          p.node.variants.edges[0]?.node.availableForSale
        ).slice(0, 4);
      }
      
      setRelatedProducts(filtered);
      setIsLoading(false);
    };

    loadRelatedProducts();
  }, [post, navigate]);

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = getFirstAvailableVariant(product);
    if (!variant) {
      toast.error('המוצר אזל מהמלאי');
      return;
    }

    const ok = await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || []
    });

    if (!ok) {
      toast.error('לא ניתן להוסיף לעגלה כרגע');
      return;
    }
    
    toast.success(`${product.node.title} נוסף לעגלה`);
  };

  if (!post) return null;

  const category = blogCategories.find(c => c.id === post.category);

  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground text-center py-2.5 text-sm font-medium">
        משלוח חינם בקנייה מעל ₪299 | איכות ללא פשרות
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="lg:hidden p-2 text-muted-foreground hover:text-accent transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link to="/" className="flex items-center">
            <span className="text-2xl font-black text-primary">FullBody</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 font-bold text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">ראשי</Link>
            <Link to="/" className="hover:text-accent transition-colors">חנות</Link>
            <Link to="/blog" className="text-accent transition-colors">מאמרים</Link>
            <Link to="/faq" className="hover:text-accent transition-colors">שאלות נפוצות</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">צור קשר</Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-accent transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/" className="p-2 text-muted-foreground hover:text-accent transition-colors">
              <ShoppingBag className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-y-0 right-0 w-72 bg-card shadow-hover z-50 flex flex-col pt-20 px-6 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-5 left-5 text-muted-foreground hover:text-accent transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <Link to="/" className="py-4 border-b border-border text-lg font-bold hover:text-accent transition-colors">ראשי</Link>
        <Link to="/" className="py-4 border-b border-border text-lg font-bold hover:text-accent transition-colors">חנות</Link>
        <Link to="/blog" className="py-4 border-b border-border text-lg font-bold text-accent transition-colors">מאמרים</Link>
        <Link to="/faq" className="py-4 border-b border-border text-lg font-bold hover:text-accent transition-colors">שאלות נפוצות</Link>
        <Link to="/contact" className="py-4 border-b border-border text-lg font-bold hover:text-accent transition-colors">צור קשר</Link>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-foreground/50 z-40 transition-opacity duration-300"
        />
      )}

      {/* Breadcrumb */}
      <div className="bg-secondary border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-accent transition-colors">ראשי</Link>
            <ArrowRight className="w-4 h-4" />
            <Link to="/blog" className="hover:text-accent transition-colors">בלוג</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article Hero */}
      <section className="relative">
        <div className="aspect-[21/9] max-h-[400px] overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4">
          <div className="relative -mt-32 bg-card rounded-t-2xl p-6 sm:p-10 max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <span className="bg-accent text-accent-foreground text-sm font-bold px-4 py-1.5 rounded-full flex items-center gap-2">
                <Tag className="w-4 h-4" />
                {category?.name}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString('he-IL')}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                {post.readTime} דקות קריאה
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground leading-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card rounded-b-2xl p-6 sm:p-10 -mt-1">
            <div 
              className="prose prose-lg max-w-none text-foreground
                prose-headings:text-foreground prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-ul:text-muted-foreground prose-li:my-1
                prose-strong:text-foreground"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </div>
      </article>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-8 text-center">
                מוצרים מומלצים עבורך
              </h2>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((product, index) => (
                  <div 
                    key={product.node.id}
                    className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-hover transition-all duration-300 animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link to={`/product/${product.node.handle}`} className="block">
                      <div className="aspect-square overflow-hidden bg-secondary/30 flex items-center justify-center p-4">
                        {product.node.images?.edges?.[0]?.node && (
                          <img 
                            src={product.node.images.edges[0].node.url}
                            alt={product.node.title}
                            className="max-w-[75%] max-h-[75%] object-contain group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        )}
                      </div>
                    </Link>
                    
                    <div className="p-3 sm:p-4">
                      <Link to={`/product/${product.node.handle}`}>
                        <h3 className="font-bold text-sm text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2">
                          {product.node.title}
                        </h3>
                      </Link>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-black text-lg text-foreground">
                          ₪{parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(0)}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => handleAddToCart(product)}
                        disabled={!isProductAvailableForSale(product)}
                        className="w-full bg-accent text-accent-foreground font-bold py-2 text-sm rounded-lg shadow-cta transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProductAvailableForSale(product) ? 'הוסף לעגלה' : 'אזל מהמלאי'}
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all"
          >
            <ArrowRight className="w-5 h-5" />
            חזרה לכל המאמרים
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} FullBody. כל הזכויות שמורות.
          </p>
        </div>
      </footer>
    </div>
  );
}
