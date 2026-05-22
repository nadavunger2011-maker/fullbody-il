import greenLogo from '@/assets/logo-green.png';
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Menu, X, ShoppingBag, ArrowRight,
  ChevronDown, Leaf, CheckCircle, Truck, ShieldCheck,
  HeartPulse, Beaker, Utensils, Clock, Loader2, Minus, Plus,
  FileText, MessageCircle
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getProductByHandle, getRelatedProducts } from '@/data/herbalifeProducts';
import { fetchProductByHandle, ShopifyProduct, getFirstAvailableVariant } from '@/lib/shopify';
import ProFooter from '@/components/ProFooter';
import ProductReviews from '@/components/ProductReviews';
import { TestimonialSlider, mapCategoryToTestimonialFilter } from '@/components/SocialProofSection';

import CartDrawer from '@/components/CartDrawer';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';
import { trackViewItem, trackAddToCart as gtmTrackAddToCart } from '@/lib/gtm';
import { trackViewContent, trackAddToCart as fbTrackAddToCart } from '@/lib/fbPixel';
import { trackGA4ViewItem, trackGA4AddToCart } from '@/lib/ga4';
import { trackProductView, trackAddToCartEvent } from '@/lib/analytics';
import { trackFlashyAddedToCart } from '@/lib/flashyEvents';

export default function ProProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopifyProduct, setShopifyProduct] = useState<ShopifyProduct | null>(null);
  const [isLoadingShopify, setIsLoadingShopify] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const { items: cartItems, addItem } = useCartStore();

  const product = handle ? getProductByHandle(handle) : undefined;
  const related = handle ? getRelatedProducts(handle, 4) : [];
  const cartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  // Fetch Shopify product for cart
  useEffect(() => {
    if (!product) return;
    setIsLoadingShopify(true);
    fetchProductByHandle(product.shopifyHandle).then(sp => {
      setShopifyProduct(sp);
      setIsLoadingShopify(false);
    });
  }, [product?.shopifyHandle]);

  // Fetch real review aggregates for JSON-LD
  const [reviewAgg, setReviewAgg] = useState<{ avg: number; count: number }>({ avg: 0, count: 0 });
  useEffect(() => {
    if (!handle) return;
    let cancel = false;
    (async () => {
      const { data } = await supabase
        .from('product_reviews')
        .select('rating')
        .eq('product_handle', handle)
        .eq('is_approved', true);
      if (cancel || !data || data.length === 0) return;
      const avg = data.reduce((s, r: any) => s + r.rating, 0) / data.length;
      setReviewAgg({ avg, count: data.length });
    })();
    return () => { cancel = true; };
  }, [handle]);

  // Track product view
  useEffect(() => {
    if (!product) return;
    const productId = product.sku || product.handle;
    const price = product.price;
    trackViewItem({ item_id: productId, item_name: product.title, price, quantity: 1, currency: 'ILS' });
    trackGA4ViewItem({ item_id: productId, item_name: product.title, price, quantity: 1 }, 'ILS');
    trackViewContent(productId, product.title, price);
    trackProductView({ handle: product.handle, title: product.title, id: productId, price });
  }, [product?.handle]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
  }, [handle]);

  // Sticky mobile CTA: show when main button scrolls out of view
  useEffect(() => {
    if (!ctaRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { rootMargin: '0px 0px -20px 0px', threshold: 0 }
    );
    observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, [shopifyProduct]);

  const handleAddToCart = async () => {
    if (!shopifyProduct) {
      toast.error('לא ניתן להוסיף לעגלה כרגע');
      return;
    }
    const variant = getFirstAvailableVariant(shopifyProduct);
    if (!variant) {
      toast.error('המוצר אזל מהמלאי');
      return;
    }
    setIsAddingToCart(true);
    const ok = await addItem({
      product: shopifyProduct,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || [],
    });
    setIsAddingToCart(false);
    if (!ok) {
      toast.error('לא ניתן להוסיף לעגלה כרגע');
      return;
    }
    setIsCartOpen(true);
    toast.success(`${product!.title} נוסף לעגלה`);

    // Track add to cart across all platforms
    const productId = product!.sku || product!.handle;
    const itemPrice = parseFloat(variant.price.amount);
    gtmTrackAddToCart({ item_id: productId, item_name: product!.title, price: itemPrice, quantity, currency: 'ILS' });
    trackGA4AddToCart({ item_id: productId, item_name: product!.title, price: itemPrice, quantity }, 'ILS');
    fbTrackAddToCart(productId, product!.title, itemPrice * quantity);
    trackAddToCartEvent({
      handle: product!.handle, title: product!.title, id: productId,
      variantId: variant.id, variantTitle: variant.title,
      price: itemPrice, quantity,
    });
    trackFlashyAddedToCart({
      product_id: productId,
      product_name: product!.title,
      price: itemPrice,
      currency: variant.price.currencyCode || 'ILS',
      image_url: typeof product!.image === 'string' && product!.image.startsWith('http')
        ? product!.image
        : `${window.location.origin}${product!.image}`,
    });
  };

  if (!product) {
    // Redirect non-Herbalife product handles to the Nava site
    return <Navigate to={`/nava/product/${handle}`} replace />;
  }

  const whatsappLink = `https://wa.me/972547308826?text=${encodeURIComponent(`היי, אשמח לשמוע פרטים על ${product.title}`)}`;

  const productJsonLd: Record<string, any> = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "sku": product.sku,
    "image": product.image,
    "brand": { "@type": "Brand", "name": "Herbalife Nutrition" },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": `https://fullbody.co.il/product/${product.handle}`,
      "availability": "https://schema.org/InStock",
      "priceCurrency": "ILS",
      "price": product.price,
    },
  };
  if (reviewAgg.count > 0) {
    productJsonLd.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": Number(reviewAgg.avg.toFixed(1)),
      "reviewCount": reviewAgg.count,
    };
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": product.faq.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer },
    })),
  };

  return (
    <div dir="rtl" className="font-sans text-foreground bg-background min-h-screen">
      <Helmet>
        <title>{product.title} | FullBody - קנה עכשיו</title>
        <meta name="description" content={product.metaDescription} />
        <link rel="canonical" href={`https://fullbody.co.il/product/${product.handle}`} />
        <meta property="og:title" content={`${product.title} | FullBody`} />
        <meta property="og:description" content={product.metaDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={`https://fullbody.co.il/product/${product.handle}`} />
        <meta property="og:locale" content="he_IL" />
        <meta property="product:price:amount" content={String(product.price)} />
        <meta property="product:price:currency" content="ILS" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.title} | FullBody`} />
        <meta name="twitter:description" content={product.metaDescription} />
        <meta name="twitter:image" content={product.image} />
        <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      {/* Announcement Bar */}
      <div className="bg-[hsl(142,70%,35%)] text-white text-center py-2.5 text-sm font-medium">
        <span className="flex items-center justify-center gap-2">
          <Leaf className="w-4 h-4" />
          מוצרי Herbalife מקוריים | משלוח חינם מעל ₪299
          <Leaf className="w-4 h-4" />
        </span>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-card shadow-card border-b border-border">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-muted-foreground">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link to="/" className="flex items-center">
            <img src={greenLogo} alt="FullBody Pro" className="h-14 md:h-16 w-auto" />
          </Link>
          <nav className="hidden lg:flex items-center gap-8 font-bold text-muted-foreground">
            <Link to="/" className="hover:text-[hsl(142,70%,35%)] transition-colors">ראשי</Link>
            <Link to="/#products" className="hover:text-[hsl(142,70%,35%)] transition-colors">מוצרים</Link>
            <Link to="/contact" className="hover:text-[hsl(142,70%,35%)] transition-colors">צור קשר</Link>
          </nav>
          <button onClick={() => setIsCartOpen(true)} className="p-2 text-muted-foreground relative">
            <ShoppingBag className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[hsl(142,70%,35%)] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">{cartCount}</span>
            )}
          </button>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-[hsl(142,70%,35%)]">ראשי</Link>
          <span>/</span>
          <Link to="/#products" className="hover:text-[hsl(142,70%,35%)]">מוצרים</Link>
          <span>/</span>
          <span className="text-foreground font-medium truncate max-w-[200px]">{product.title}</span>
        </nav>
      </div>

      {/* Product Main Section */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="bg-secondary/20 rounded-2xl p-8 md:p-12 flex items-center justify-center aspect-square border border-border">
              <img
                src={product.image}
                alt={product.title}
                className="max-w-[80%] max-h-[80%] object-contain"
                loading="eager"
                width={512}
                height={512}
              />
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-[hsl(142,70%,35%)]" />
              מוצר Herbalife מקורי 100%
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="inline-block bg-[hsl(142,70%,35%)]/10 text-[hsl(142,70%,35%)] text-xs font-bold px-3 py-1 rounded-full mb-3">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight mb-4">
                {product.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.shortHook}
              </p>
            </div>

            {/* Price & Add to Cart */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-black text-foreground">₪{product.price}</span>
                <span className="text-sm text-muted-foreground">כולל מע"מ</span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-bold text-muted-foreground">כמות:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2 hover:bg-secondary transition-colors rounded-r-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-bold text-foreground min-w-[40px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-2 hover:bg-secondary transition-colors rounded-l-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button — high-contrast bright green CTA */}
              <button
                ref={ctaRef}
                onClick={handleAddToCart}
                disabled={isLoadingShopify || isAddingToCart}
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black py-5 px-8 rounded-2xl text-center transition-all shadow-[0_10px_25px_-5px_rgba(22,163,74,0.5)] hover:shadow-[0_15px_30px_-5px_rgba(22,163,74,0.6)] flex items-center justify-center gap-3 text-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] uppercase tracking-wide"
              >
                {isAddingToCart ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="w-6 h-6" />
                    הוסף לסל — ₪{product.price * quantity}
                  </>
                )}
              </button>

              {/* Trust Badges Row — directly under CTA */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="flex flex-col items-center text-center gap-1.5 p-2">
                  <Truck className="w-5 h-5 text-[hsl(142,70%,35%)]" />
                  <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">משלוח מהיר לכל הארץ</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5 p-2">
                  <ShieldCheck className="w-5 h-5 text-[hsl(142,70%,35%)]" />
                  <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">משווק מורשה — 100% מקורי</span>
                </div>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center gap-1.5 p-2 hover:bg-[#25D366]/5 rounded-lg transition-colors">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                  <span className="text-[11px] sm:text-xs font-bold text-foreground leading-tight">ייעוץ אישי בוואטסאפ</span>
                </a>
              </div>

              {/* WhatsApp alternative */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-3 border border-[hsl(142,70%,35%)] text-[hsl(142,70%,35%)] font-bold py-3 px-8 rounded-xl text-center transition-all flex items-center justify-center gap-3 hover:bg-[hsl(142,70%,35%)]/5"
              >
                <MessageCircle className="w-5 h-5" />
                שאלות? דברו איתנו
              </a>
            </div>

            {/* Benefits */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-[hsl(142,70%,35%)]" />
                יתרונות המוצר
              </h2>
              <ul className="space-y-3">
                {product.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-[hsl(142,70%,35%)] shrink-0" />
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nutrition Table */}
            {product.nutrition.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Beaker className="w-5 h-5 text-[hsl(142,70%,35%)]" />
                  ערכים תזונתיים למנה
                </h2>
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary/50">
                        <th className="text-right py-3 px-4 font-bold text-foreground">רכיב</th>
                        <th className="text-left py-3 px-4 font-bold text-foreground">כמות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.nutrition.map((n, i) => (
                        <tr key={i} className="border-t border-border/50 hover:bg-secondary/20 transition-colors">
                          <td className="py-3 px-4 text-muted-foreground">{n.label}</td>
                          <td className="py-3 px-4 font-bold text-foreground text-left">{n.value} {n.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Usage */}
            <div className="bg-secondary/20 rounded-xl p-6 border border-border">
              <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[hsl(142,70%,35%)]" />
                אופן השימוש
              </h2>
              <p className="text-muted-foreground">{product.usage}</p>
            </div>

            {/* Description Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description" className="border-border">
                <AccordionTrigger className="text-lg font-bold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <HeartPulse className="w-5 h-5 text-[hsl(142,70%,35%)]" />
                    תיאור מפורט
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border-border">
                <AccordionTrigger className="text-lg font-bold hover:no-underline">
                  <span className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[hsl(142,70%,35%)]" />
                    משלוחים והחזרות
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground space-y-2">
                    <p>• משלוח חינם בהזמנה מעל ₪299</p>
                    <p>• זמן משלוח: 2-5 ימי עסקים</p>
                    <p>• ניתן להחזיר מוצרים לא פתוחים תוך 14 יום</p>
                    <p>• איסוף עצמי מרעננה — ללא עלות</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="disclaimer" className="border-border">
                <AccordionTrigger className="text-lg font-bold hover:no-underline">
                  <span className="flex items-center gap-2">דיסקליימר</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-muted-foreground space-y-3 text-sm leading-relaxed">
                    <div>
                      <p className="font-bold text-foreground">דיסקליימר תוצאות (עבור תוצאות במלל ו/או בתמונות):</p>
                      <p>
                        כל ההפניות לבקרת משקל קשורות לתוכנית ניהול משקל של הרבלייף, הכוללת, בין היתר, תזונה מאוזנת, פעילות גופנית קבועה, שתיית נוזלים מספקת בכל יום, תוספי תזונה אם צריך ומנוחה נאותה. תוצאות אישיות עשויות להשתנות.
                      </p>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">דיסקליימר רווחים (באם מפרסמים באתר את ההזדמנות העסקית):</p>
                      <p>
                        ההכנסות חלות על הפרטים (או הדוגמאות) המתוארים ואינן מהוות ממוצע. הישגים משמעותיים מגיעים מעבודה קשה, השקעה והתמדה, רוב המפיצים מרוויחים הכנסה נוספת כלשהי.
                      </p>
                      <p>
                        למידע נוסף{" "}
                        <a href="https://Herbalife.com/STE" target="_blank" rel="noopener noreferrer" className="underline">
                          Herbalife.com/STE
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-4">
              {[
                { icon: ShieldCheck, label: 'מוצר מקורי' },
                { icon: Truck, label: 'משלוח מהיר' },
                { icon: Clock, label: 'שירות אישי' },
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center">
                  <div className="w-10 h-10 bg-[hsl(142,70%,35%)]/10 rounded-full flex items-center justify-center">
                    <badge.icon className="w-5 h-5 text-[hsl(142,70%,35%)]" />
                  </div>
                  <span className="text-xs font-bold text-muted-foreground">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Catalog Link */}
            {product.catalogPage && (
              <a
                href={`/herbalife-catalog-2025.pdf#page=${product.catalogPage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-secondary/30 hover:bg-secondary/50 border border-border rounded-xl p-4 transition-colors"
              >
                <div className="w-10 h-10 bg-[hsl(142,70%,35%)]/10 rounded-full flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[hsl(142,70%,35%)]" />
                </div>
                <div className="flex-1">
                  <span className="font-bold text-foreground text-sm block">צפייה בקטלוג הרשמי</span>
                  <span className="text-xs text-muted-foreground">עמוד {product.catalogPage} בקטלוג Herbalife 2025</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Contextual Social Proof — filtered by product category */}
      <TestimonialSlider filter={mapCategoryToTestimonialFilter(product.categoryId)} />


      <section className="bg-secondary/20 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-black text-foreground text-center mb-8">
            שאלות נפוצות על {product.title}
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-3">
            {product.faq.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card rounded-xl border border-border px-6">
                <AccordionTrigger className="text-base font-bold hover:no-underline text-right">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground leading-relaxed">{f.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-black text-foreground text-center mb-8">
              מוצרים נוספים שיעניינו אתכם
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {related.map((rp) => (
                <Link
                  key={rp.handle}
                  to={`/product/${rp.handle}`}
                  className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-hover transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-square bg-secondary/20 flex items-center justify-center p-6">
                    <img src={rp.image} alt={rp.title} className="max-w-[75%] max-h-[75%] object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" width={256} height={256} />
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-[10px] font-bold text-[hsl(142,70%,35%)] uppercase mb-1">{rp.category}</span>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-[hsl(142,70%,35%)] transition-colors line-clamp-2">
                      {rp.title}
                    </h3>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className="font-black text-foreground">₪{rp.price}</span>
                      <span className="text-xs font-bold text-[hsl(142,70%,35%)] flex items-center gap-1">
                        לפרטים <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <ProductReviews productHandle={product.handle} productTitle={product.title} />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-[hsl(142,70%,35%)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-4">רוצים לדעת עוד?</h2>
          <p className="text-white/80 mb-6">צרו קשר לייעוץ תזונה אישי ומחירים</p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-[hsl(142,70%,35%)] font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-white/90 transition-all"
          >
            דברו איתנו בוואטסאפ
          </a>
        </div>
      </section>

      <ProFooter />

      {/* Sticky Mobile Add-to-Cart Bar */}
      <div
        className={`lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-transform duration-300 pb-[env(safe-area-inset-bottom)] ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center gap-3 p-3">
          <img src={product.image} alt="" className="w-12 h-12 object-contain rounded-md bg-secondary/30 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground line-clamp-1">{product.title}</p>
            <p className="text-base font-black text-[hsl(142,70%,35%)]">₪{product.price * quantity}</p>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isLoadingShopify || isAddingToCart}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white font-black py-3 px-5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-50 active:scale-95 transition-all shadow-md"
          >
            {isAddingToCart ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingBag className="w-4 h-4" />הוסף לסל</>}
          </button>
        </div>
      </div>
    </div>
  );
}
