import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, ShoppingBag, Truck, ShieldCheck, ArrowRight, Clock, Award, RefreshCw, HeartHandshake, Loader2, Minus, Plus, Check } from 'lucide-react';
import { fetchShopifyProducts, ShopifyProduct, CartItem as ShopifyCartItem } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';
import logoImage from '@/assets/logo.png';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AccessibilityWidget from '@/components/AccessibilityWidget';
import { trackViewContent, trackAddToCart } from '@/lib/fbPixel';
import { trackViewItem, trackAddToCart as gtmTrackAddToCart } from '@/lib/gtm';
import { trackGA4AddToCart, trackGA4ViewItem } from '@/lib/ga4';
import { trackProductView, trackAddToCartEvent, trackProductDuration } from '@/lib/analytics';
import { trackFlashyAddedToCart } from '@/lib/flashyEvents';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { addItem, items: cartItems } = useCartStore();
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      const products = await fetchShopifyProducts(50);
      const foundProduct = products.find(p => p.node.handle === handle);
      
      if (foundProduct) {
        setProduct(foundProduct);
        const related = products.filter(p => p.node.handle !== handle).slice(0, 4);
        setRelatedProducts(related);
        
        if (typeof window !== 'undefined' && window.flashy) {
          const productId = foundProduct.node.id.replace('gid://shopify/Product/', '');
          window.flashy('ViewContent', { content_ids: [productId] });
        }
        
        const productId = foundProduct.node.id.replace('gid://shopify/Product/', '');
        const price = parseFloat(foundProduct.node.priceRange.minVariantPrice.amount);
        trackViewContent(productId, foundProduct.node.title, price);
        
        const currency = foundProduct.node.priceRange.minVariantPrice.currencyCode || 'ILS';
        trackViewItem({ item_id: productId, item_name: foundProduct.node.title, price, quantity: 1, currency });
        trackGA4ViewItem({ item_id: productId, item_name: foundProduct.node.title, price, quantity: 1 }, currency);
        trackProductView({ handle: foundProduct.node.handle, title: foundProduct.node.title, id: productId, price });
      }
      setIsLoading(false);
    };
    loadProduct();
  }, [handle]);

  // Track time spent on product page + exit destination
  useEffect(() => {
    if (!product) return;
    const startTime = Date.now();
    const productId = product.node.id.replace('gid://shopify/Product/', '');
    
    const handleBeforeUnload = () => {
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      trackProductDuration(
        { handle: product.node.handle, title: product.node.title, id: productId },
        durationSeconds,
        'site_exit'
      );
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      const durationSeconds = Math.round((Date.now() - startTime) / 1000);
      // Determine exit destination from current path
      const currentPath = window.location.pathname;
      let exitDest = 'other_page';
      if (currentPath.includes('/product/')) exitDest = 'another_product';
      
      trackProductDuration(
        { handle: product.node.handle, title: product.node.title, id: productId },
        durationSeconds,
        exitDest
      );
    };
  }, [product]);

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return;
    
    const variant = product.node.variants.edges[selectedVariantIndex]?.node;
    if (!variant) return;

    if (!variant.availableForSale) {
      toast.error('המוצר אזל מהמלאי');
      return;
    }

    setIsAddingToCart(true);
    try {
      const ok = await addItem({
        product,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity,
        selectedOptions: variant.selectedOptions || []
      });

      if (!ok) {
        toast.error('לא ניתן להוסיף לעגלה כרגע');
        return;
      }
      
      const productId = product.node.id.replace('gid://shopify/Product/', '');
      const itemValue = parseFloat(variant.price.amount) * quantity;
      trackAddToCart(productId, product.node.title, itemValue);
      
      gtmTrackAddToCart({
        item_id: productId,
        item_name: product.node.title,
        item_variant: variant.title !== 'Default Title' ? variant.title : undefined,
        price: parseFloat(variant.price.amount),
        quantity: quantity,
        currency: variant.price.currencyCode || 'ILS'
      });

      trackGA4AddToCart(
        {
          item_id: productId,
          item_name: product.node.title,
          item_variant: variant.title !== 'Default Title' ? variant.title : undefined,
          price: parseFloat(variant.price.amount),
          quantity,
        },
        variant.price.currencyCode || 'ILS'
      );
      // Track in our analytics DB
      trackAddToCartEvent({
        handle: product.node.handle, title: product.node.title,
        id: productId, variantId: variant.id, variantTitle: variant.title,
        price: parseFloat(variant.price.amount), quantity,
      });

      trackFlashyAddedToCart({
        product_id: productId,
        product_name: product.node.title,
        price: parseFloat(variant.price.amount),
        currency: variant.price.currencyCode || 'ILS',
        image_url: product.node.images?.edges?.[0]?.node?.url || '',
      });
      
      setIsCartOpen(true);
      toast.success(`${product.node.title} נוסף לעגלה`);
    } catch (error) {
      toast.error('שגיאה בהוספה לעגלה. נסה שוב.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div dir="rtl" className="min-h-screen bg-background flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">מוצר לא נמצא</h1>
        <Link to="/nava" className="text-accent hover:underline">חזרה לדף הבית</Link>
      </div>
    );
  }

  const selectedVariant = product.node.variants.edges[selectedVariantIndex]?.node;
  const images = product.node.images.edges;
  const currentImage = images[selectedImageIndex]?.node;
  const isSelectedVariantAvailable = !!selectedVariant?.availableForSale;

  const trustFactors = [
    { icon: Truck, text: 'משלוח חינם מעל ₪299' },
    { icon: Clock, text: '3-5 ימי עסקים' },
    { icon: RefreshCw, text: 'החזרה עד 14 יום' },
  ];

  return (
    <>
      <Helmet>
        <title>{product.node.title} | FullBody</title>
        <meta name="description" content={product.node.description.slice(0, 155)} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.node.title,
            "description": product.node.description,
            "image": currentImage?.url,
            "offers": {
              "@type": "Offer",
              "price": selectedVariant?.price.amount,
              "priceCurrency": "ILS",
              "availability": selectedVariant?.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
            }
          })}
        </script>
      </Helmet>

      <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
        <AccessibilityWidget />
        
        {/* Minimal Header */}
        <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-border/30 shadow-[0_1px_10px_-3px_hsl(var(--foreground)/0.05)]">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline">חזרה</span>
            </button>
            
            <Link to="/nava" className="flex items-center">
              <img src={logoImage} alt="FullBody" className="h-8 w-auto" />
            </Link>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors relative"
              aria-label="עגלת קניות"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 bg-accent text-accent-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        <main className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
            <Link to="/nava" className="hover:text-foreground transition-colors">ראשי</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/#products" className="hover:text-foreground transition-colors">חנות</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground/70 truncate max-w-[200px]">{product.node.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            {/* Image Gallery - sticky on desktop */}
            <div className="space-y-3 animate-fade-in lg:sticky lg:top-20" style={{ animationDuration: '0.6s' }}>
              <div className="aspect-square bg-gradient-to-br from-muted/20 to-muted/5 rounded-2xl overflow-hidden flex items-center justify-center p-8 lg:p-14 border border-border/20 shadow-[0_4px_30px_-8px_hsl(var(--foreground)/0.06)]">
                {currentImage && (
                  <img 
                    src={currentImage.url} 
                    alt={currentImage.altText || product.node.title}
                    className="max-w-full max-h-full object-contain transition-transform duration-700 hover:scale-105"
                  />
                )}
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all border ${
                        selectedImageIndex === index 
                          ? 'ring-2 ring-accent ring-offset-2 ring-offset-background border-accent/30' 
                          : 'opacity-60 hover:opacity-100 border-border/20'
                      }`}
                    >
                      <img 
                        src={image.node.url} 
                        alt={image.node.altText || `תמונה ${index + 1}`}
                        className="w-full h-full object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col animate-fade-in" style={{ animationDuration: '0.6s', animationDelay: '0.2s', animationFillMode: 'backwards' }}>
              
              {/* Title + Price */}
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight tracking-tight">
                  {product.node.title}
                </h1>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-accent tracking-tight">
                    ₪{parseFloat(selectedVariant?.price.amount || '0').toFixed(0)}
                  </span>
                  <span className="text-xs text-muted-foreground">כולל מע״מ</span>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-l from-transparent via-border/60 to-transparent mb-5" />

              {/* Trust badges - premium pills */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {trustFactors.map((item, index) => (
                  <div key={index} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 backdrop-blur-sm rounded-full px-3.5 py-2 border border-border/20">
                    <item.icon className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Variant Selection */}
              {product.node.variants.edges.length > 1 && (
                <div className="mb-5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 block">בחר אפשרות</label>
                  <div className="flex flex-wrap gap-2">
                    {product.node.variants.edges.map((variant, index) => (
                      <button
                        key={variant.node.id}
                        onClick={() => setSelectedVariantIndex(index)}
                        disabled={!variant.node.availableForSale}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selectedVariantIndex === index
                            ? 'bg-accent text-accent-foreground shadow-sm'
                            : variant.node.availableForSale
                              ? 'bg-muted/50 text-foreground hover:bg-muted'
                              : 'bg-muted/30 text-muted-foreground/50 cursor-not-allowed line-through'
                        }`}
                      >
                        {variant.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center border border-border rounded-full overflow-hidden bg-muted/20">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted/50 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center font-semibold text-sm select-none">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-muted/50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !isSelectedVariantAvailable}
                  className="flex-1 bg-accent text-accent-foreground font-bold py-3.5 rounded-full text-sm transition-all duration-300 flex justify-center items-center gap-2 hover:shadow-[0_6px_20px_-4px_hsl(var(--accent)/0.5)] hover:brightness-105 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      מוסיף...
                    </>
                  ) : !isSelectedVariantAvailable ? (
                    'אזל מהמלאי'
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      הוסף לעגלה · ₪{(parseFloat(selectedVariant?.price.amount || '0') * quantity).toFixed(0)}
                    </>
                  )}
                </button>
              </div>

              {/* Product Description - rendered as HTML from Shopify */}
              {(product.node.descriptionHtml || product.node.description) && (
                <div className="mb-6 animate-fade-in" style={{ animationDuration: '0.5s', animationDelay: '0.35s', animationFillMode: 'backwards' }}>
                  <Accordion type="single" collapsible defaultValue="description" className="w-full">
                    <AccordionItem value="description" className="border border-border/30 rounded-xl overflow-hidden bg-muted/10">
                      <AccordionTrigger className="px-4 py-3.5 text-sm hover:no-underline text-right font-semibold hover:bg-muted/20 transition-colors">
                        תיאור המוצר
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        {product.node.descriptionHtml ? (
                          <div
                            className="product-description text-sm text-muted-foreground leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: product.node.descriptionHtml }}
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                            {product.node.description}
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}

              {/* Info Accordion */}
              <div className="bg-muted/10 rounded-xl border border-border/30 overflow-hidden animate-fade-in" style={{ animationDuration: '0.5s', animationDelay: '0.45s', animationFillMode: 'backwards' }}>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="shipping" className="border-border/30">
                    <AccordionTrigger className="px-4 py-3.5 text-sm hover:no-underline text-right font-medium hover:bg-muted/20 transition-colors">
                      משלוחים והחזרות
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-sm text-muted-foreground leading-relaxed pb-4">
                      משלוח חינם בהזמנות מעל ₪299. זמן אספקה: 3-5 ימי עסקים. ניתן להחזיר מוצרים תוך 14 יום מיום הקבלה.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="warnings" className="border-0">
                    <AccordionTrigger className="px-4 py-3.5 text-sm hover:no-underline text-right font-medium hover:bg-muted/20 transition-colors">
                      אזהרות
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-sm text-muted-foreground leading-relaxed pb-4">
                      אין לחרוג מהמנה היומית המומלצת. תוסף תזונה אינו תחליף לתזונה מאוזנת ולאורח חיים בריא. יש לשמור הרחק מהישג ידם של ילדים.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 pt-8 border-t border-border/30 animate-fade-in" style={{ animationDuration: '0.6s', animationDelay: '0.4s', animationFillMode: 'backwards' }}>
              <h2 className="text-xl font-bold text-foreground mb-6">מוצרים נוספים</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {relatedProducts.map((relatedProduct, i) => (
                  <Link
                    key={relatedProduct.node.id}
                    to={`/nava/product/${relatedProduct.node.handle}`}
                    className="group bg-card rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 border border-border/50 animate-fade-in"
                    style={{ animationDuration: '0.4s', animationDelay: `${0.5 + i * 0.1}s`, animationFillMode: 'backwards' }}
                  >
                    <div className="aspect-square bg-muted/20 overflow-hidden flex items-center justify-center p-6">
                      {relatedProduct.node.images.edges[0]?.node && (
                        <img 
                          src={relatedProduct.node.images.edges[0].node.url}
                          alt={relatedProduct.node.title}
                          className="max-w-[75%] max-h-[75%] object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-3 sm:p-4">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                        {relatedProduct.node.title}
                      </h3>
                      <p className="text-base font-bold text-foreground mt-1.5">
                        ₪{parseFloat(relatedProduct.node.priceRange.minVariantPrice.amount).toFixed(0)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </main>

        <Footer />

        {/* Floating Add to Cart Bar */}
        {product && showStickyBar && !isCartOpen && (
          <div className="fixed bottom-0 inset-x-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border/40 shadow-[0_-4px_20px_-4px_hsl(var(--foreground)/0.1)] transition-transform duration-300 animate-slide-up" style={{ animationDuration: '0.3s' }}>
            <div className="container mx-auto px-4 py-3 flex items-center gap-3 max-w-6xl">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">{product.node.title}</p>
                <p className="text-lg font-black text-accent">₪{parseFloat(selectedVariant?.price.amount || '0').toFixed(0)}</p>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !isSelectedVariantAvailable}
                className="bg-accent text-accent-foreground font-bold py-3 px-6 rounded-full text-sm transition-all duration-300 flex items-center gap-2 hover:shadow-[0_6px_20px_-4px_hsl(var(--accent)/0.5)] hover:brightness-105 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed shadow-md whitespace-nowrap"
              >
                {isAddingToCart ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ShoppingBag className="w-4 h-4" />
                )}
                {isAddingToCart ? 'מוסיף...' : !isSelectedVariantAvailable ? 'אזל' : 'הוסף לעגלה'}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
