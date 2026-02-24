import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, ShoppingBag, Truck, ShieldCheck, ArrowLeft, Clock, Award, RefreshCw, HeartHandshake, Loader2 } from 'lucide-react';
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

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      const products = await fetchShopifyProducts(50);
      const foundProduct = products.find(p => p.node.handle === handle);
      
      if (foundProduct) {
        setProduct(foundProduct);
        // Get related products (exclude current product)
        const related = products.filter(p => p.node.handle !== handle).slice(0, 4);
        setRelatedProducts(related);
        
        // Track ViewContent with Flashy
        if (typeof window !== 'undefined' && window.flashy) {
          const productId = foundProduct.node.id.replace('gid://shopify/Product/', '');
          window.flashy('ViewContent', {
            content_ids: [productId]
          });
        }
        
        // Track ViewContent with Facebook Pixel
        const productId = foundProduct.node.id.replace('gid://shopify/Product/', '');
        const price = parseFloat(foundProduct.node.priceRange.minVariantPrice.amount);
        trackViewContent(productId, foundProduct.node.title, price);
        
        const currency = foundProduct.node.priceRange.minVariantPrice.currencyCode || 'ILS';

        // Track view_item with GTM
        trackViewItem({
          item_id: productId,
          item_name: foundProduct.node.title,
          price: price,
          quantity: 1,
          currency
        });

        // Track view_item with GA4
        trackGA4ViewItem(
          {
            item_id: productId,
            item_name: foundProduct.node.title,
            price,
            quantity: 1,
          },
          currency
        );
      }
      setIsLoading(false);
    };
    loadProduct();
  }, [handle]);

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
      
      // Track AddToCart with Facebook Pixel
      const productId = product.node.id.replace('gid://shopify/Product/', '');
      const itemValue = parseFloat(variant.price.amount) * quantity;
      trackAddToCart(productId, product.node.title, itemValue);
      
      // Track add_to_cart with GTM
      gtmTrackAddToCart({
        item_id: productId,
        item_name: product.node.title,
        item_variant: variant.title !== 'Default Title' ? variant.title : undefined,
        price: parseFloat(variant.price.amount),
        quantity: quantity,
        currency: variant.price.currencyCode || 'ILS'
      });

      // Track add_to_cart with GA4
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
        <Link to="/" className="text-accent hover:underline">חזרה לדף הבית</Link>
      </div>
    );
  }

  const selectedVariant = product.node.variants.edges[selectedVariantIndex]?.node;
  const images = product.node.images.edges;
  const currentImage = images[selectedImageIndex]?.node;
  const isSelectedVariantAvailable = !!selectedVariant?.availableForSale;

  const trustFactors = [
    { icon: Truck, text: 'משלוח חינם מעל ₪299' },
    { icon: ShieldCheck, text: 'מותגים מובילים' },
    { icon: Clock, text: 'אספקה תוך 3-5 ימי עסקים' },
    { icon: Award, text: 'מוצרים באיכות פרימיום' },
    { icon: RefreshCw, text: 'החזרה עד 14 יום' },
    { icon: HeartHandshake, text: 'שירות לקוחות אישי' },
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
        
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 text-muted-foreground hover:text-accent transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">חזרה</span>
            </button>
            
            <Link to="/" className="flex items-center">
              <img src={logoImage} alt="FullBody" className="h-10 w-auto" />
            </Link>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-muted-foreground hover:text-accent transition-colors relative"
              aria-label="עגלת קניות"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-accent transition-colors">ראשי</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/#products" className="hover:text-accent transition-colors">חנות</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">{product.node.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-secondary/30 rounded-2xl overflow-hidden shadow-lg flex items-center justify-center p-6">
                {currentImage && (
                  <img 
                    src={currentImage.url} 
                    alt={currentImage.altText || product.node.title}
                    className="max-w-[80%] max-h-[80%] object-contain"
                  />
                )}
              </div>
              
              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImageIndex === index ? 'border-accent ring-2 ring-accent/30' : 'border-transparent hover:border-muted-foreground/30'
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
            <div className="space-y-6">
              {/* Title & Description */}
              <div className="bg-card/50 rounded-2xl p-6 border border-border/50">
                <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4 leading-tight">
                  {product.node.title}
                </h1>
                <p className="text-muted-foreground leading-relaxed text-base">
                  {product.node.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-accent">
                  ₪{parseFloat(selectedVariant?.price.amount || '0').toFixed(0)}
                </span>
              </div>

              {/* Variant Selection */}
              {product.node.variants.edges.length > 1 && (
                <div className="space-y-3">
                  <label className="font-bold text-foreground">בחר אפשרות:</label>
                  <div className="flex flex-wrap gap-2">
                    {product.node.variants.edges.map((variant, index) => (
                      <button
                        key={variant.node.id}
                        onClick={() => setSelectedVariantIndex(index)}
                        disabled={!variant.node.availableForSale}
                        className={`px-5 py-2.5 rounded-xl border-2 font-bold transition-all ${
                          selectedVariantIndex === index
                            ? 'border-accent bg-accent text-accent-foreground shadow-md'
                            : variant.node.availableForSale
                              ? 'border-border hover:border-accent hover:bg-accent/5'
                              : 'border-border opacity-50 cursor-not-allowed line-through'
                        }`}
                      >
                        {variant.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <label className="font-bold text-foreground">כמות:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl border-2 border-border flex items-center justify-center hover:border-accent hover:bg-accent/5 transition-all text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="w-14 text-center font-black text-xl">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-xl border-2 border-border flex items-center justify-center hover:border-accent hover:bg-accent/5 transition-all text-lg font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !isSelectedVariantAvailable}
                className="w-full bg-accent text-accent-foreground font-bold py-4 text-lg rounded-xl shadow-cta transition-all duration-300 flex justify-center items-center gap-3 hover:bg-accent/90 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    מוסיף לעגלה...
                  </>
                ) : !isSelectedVariantAvailable ? (
                  <>אזל מהמלאי</>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    הוסף לעגלה - ₪{(parseFloat(selectedVariant?.price.amount || '0') * quantity).toFixed(0)}
                  </>
                )}
              </button>

              {/* Product Information Accordion */}
              <Accordion type="single" collapsible className="w-full border border-border rounded-xl overflow-hidden">
                <AccordionItem value="ingredients" className="border-b border-border">
                  <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 text-right font-bold">
                    מרכיבים
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed">
                    המוצר מכיל מרכיבים טבעיים באיכות הגבוהה ביותר. לפרטים מלאים על הרכב המוצר, עיין באריזה או פנה לשירות הלקוחות שלנו.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="usage" className="border-b border-border">
                  <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 text-right font-bold">
                    אופן השימוש
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed">
                    יש לפעול לפי הוראות היצרן המופיעות על האריזה. מומלץ להתייעץ עם רופא או דיאטנית לפני השימוש. שמור במקום קריר ויבש.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="warnings" className="border-b border-border">
                  <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 text-right font-bold">
                    אזהרות
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed">
                    אין לחרוג מהמנה היומית המומלצת. תוסף תזונה אינו תחליף לתזונה מאוזנת ולאורח חיים בריא. יש לשמור הרחק מהישג ידם של ילדים. נשים בהיריון או מניקות - יש להתייעץ עם רופא.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="shipping" className="border-none">
                  <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 text-right font-bold">
                    משלוחים והחזרות
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-muted-foreground leading-relaxed">
                    משלוח חינם בהזמנות מעל ₪299. זמן אספקה: 3-5 ימי עסקים. ניתן להחזיר מוצרים תוך 14 יום מיום הקבלה בכפוף למדיניות ההחזרות שלנו.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Trust Factors */}
              <div className="bg-muted/30 rounded-2xl p-5 border border-border/50">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {trustFactors.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-accent" />
                      </div>
                      <span className="text-foreground font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section className="mt-20">
              <h2 className="text-2xl font-black text-foreground mb-8">מוצרים נוספים</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.node.id}
                    to={`/product/${relatedProduct.node.handle}`}
                    className="group bg-card rounded-xl overflow-hidden hover:shadow-hover transition-all duration-300 border border-border"
                  >
                    <div className="aspect-square bg-secondary/30 overflow-hidden flex items-center justify-center p-4">
                      {relatedProduct.node.images.edges[0]?.node && (
                        <img 
                          src={relatedProduct.node.images.edges[0].node.url}
                          alt={relatedProduct.node.title}
                          className="max-w-[75%] max-h-[75%] object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {relatedProduct.node.title}
                      </h3>
                      <p className="text-lg font-black text-foreground mt-2">
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
      </div>
    </>
  );
}
