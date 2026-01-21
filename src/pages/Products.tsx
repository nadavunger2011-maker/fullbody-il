import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, ChevronDown, Search, ArrowRight } from 'lucide-react';
import { fetchShopifyProducts, ShopifyProduct } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import { Skeleton } from '@/components/ui/skeleton';

const ProductSkeleton = ({ index }: { index: number }) => (
  <div 
    className="bg-card rounded-xl overflow-hidden border border-border flex flex-col animate-fade-in"
    style={{ animationDelay: `${index * 0.05}s` }}
  >
    <Skeleton className="aspect-square w-full" />
    <div className="p-3 sm:p-5 flex flex-col gap-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-1/3 mt-2" />
      <Skeleton className="h-10 w-full mt-2" />
    </div>
  </div>
);

export default function Products() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('default');
  
  const { addItem, items } = useCartStore();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchShopifyProducts(50);
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.node.title.toLowerCase().includes(query) ||
        p.node.description.toLowerCase().includes(query)
      );
    }

    if (sortOption === 'price-asc') {
      filtered = [...filtered].sort((a, b) => 
        parseFloat(a.node.priceRange.minVariantPrice.amount) - parseFloat(b.node.priceRange.minVariantPrice.amount)
      );
    } else if (sortOption === 'price-desc') {
      filtered = [...filtered].sort((a, b) => 
        parseFloat(b.node.priceRange.minVariantPrice.amount) - parseFloat(a.node.priceRange.minVariantPrice.amount)
      );
    }

    return filtered;
  }, [products, searchQuery, sortOption]);

  const handleAddToCart = (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant) return;

    addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });

    setIsCartOpen(true);
    toast.success('המוצר נוסף לעגלה!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>כל המוצרים | FullBody - תוספי תזונה וספורט</title>
        <meta name="description" content="קטלוג מלא של תוספי תזונה איכותיים - אבקות חלבון, קראטין, ויטמינים ועוד. משלוח מהיר לכל הארץ." />
        <link rel="canonical" href="https://fullbody.co.il/products" />
      </Helmet>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-accent hover:underline">
            <ArrowRight className="w-5 h-5" />
            <span className="font-bold">חזרה לדף הבית</span>
          </Link>
          <h1 className="text-xl font-black text-foreground">כל המוצרים</h1>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-foreground" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Filters */}
      <section className="py-6 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input 
                type="text"
                placeholder="חיפוש מוצרים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-border rounded-lg py-2.5 pr-10 pl-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-card border border-border rounded-lg px-4 py-2.5 pr-10 font-bold text-sm text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/50"
              >
                <option value="default">מיון: ברירת מחדל</option>
                <option value="price-asc">מחיר: מהנמוך לגבוה</option>
                <option value="price-desc">מחיר: מהגבוה לנמוך</option>
              </select>
              <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {isLoading ? (
              [...Array(8)].map((_, index) => (
                <ProductSkeleton key={index} index={index} />
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-20" />
                <p className="text-xl font-bold text-foreground mb-2">לא נמצאו מוצרים</p>
                <p className="text-muted-foreground">נסו לחפש במילים אחרות</p>
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

      <Footer />
    </div>
  );
}
