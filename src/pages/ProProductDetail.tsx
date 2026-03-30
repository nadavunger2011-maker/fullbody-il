import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Menu, X, ShoppingBag, ArrowRight,
  ChevronDown, Leaf, CheckCircle, Truck, ShieldCheck,
  HeartPulse, Beaker, Utensils, Clock, Loader2, Minus, Plus
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getProductByHandle, getRelatedProducts } from '@/data/herbalifeProducts';
import { fetchProductByHandle, ShopifyProduct, getFirstAvailableVariant } from '@/lib/shopify';
import ProFooter from '@/components/ProFooter';
import CartDrawer from '@/components/CartDrawer';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';

export default function ProProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopifyProduct, setShopifyProduct] = useState<ShopifyProduct | null>(null);
  const [isLoadingShopify, setIsLoadingShopify] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
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

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
  }, [handle]);

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
  };

  if (!product) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
          <h1 className="text-2xl font-bold mb-2">המוצר לא נמצא</h1>
          <Link to="/" className="text-[hsl(142,70%,35%)] hover:underline font-bold">חזרה לחנות</Link>
        </div>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/972547308826?text=${encodeURIComponent(`היי, אשמח לשמוע פרטים על ${product.title}`)}`;

  const productJsonLd = {
    "@context": "https://schema.org",
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
        <title>{product.title} | FullBody Pro</title>
        <meta name="description" content={product.metaDescription} />
        <link rel="canonical" href={`https://fullbody.co.il/product/${product.handle}`} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.metaDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={product.image} />
        <meta property="og:locale" content="he_IL" />
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
            <img src="https://fullbody.co.il/assets/logo-C2aje_0c.png" alt="FullBody Pro" className="h-14 md:h-16 w-auto" />
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

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={isLoadingShopify || isAddingToCart}
                className="w-full bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,30%)] text-white font-bold py-4 px-8 rounded-xl text-center transition-all shadow-cta flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isAddingToCart ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    הוסף לסל — ₪{product.price * quantity}
                  </>
                )}
              </button>

              {/* WhatsApp alternative */}
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-3 border border-[hsl(142,70%,35%)] text-[hsl(142,70%,35%)] font-bold py-3 px-8 rounded-xl text-center transition-all flex items-center justify-center gap-3 hover:bg-[hsl(142,70%,35%)]/5"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
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
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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
    </div>
  );
}
