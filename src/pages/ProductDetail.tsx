import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, ShoppingBag, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { fetchShopifyProducts, ShopifyProduct, CartItem as ShopifyCartItem } from '@/lib/shopify';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'sonner';
import logoImage from '@/assets/logo.png';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import AccessibilityWidget from '@/components/AccessibilityWidget';

export default function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      }
      setIsLoading(false);
    };
    loadProduct();
  }, [handle]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    const variant = product.node.variants.edges[selectedVariantIndex]?.node;
    if (!variant) return;

    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity,
      selectedOptions: variant.selectedOptions || []
    });
    
    setIsCartOpen(true);
    toast.success(`${product.node.title} נוסף לעגלה`);
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
              <div className="aspect-square bg-secondary rounded-2xl overflow-hidden">
                {currentImage && (
                  <img 
                    src={currentImage.url} 
                    alt={currentImage.altText || product.node.title}
                    className="w-full h-full object-cover"
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
                        selectedImageIndex === index ? 'border-accent' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image.node.url} 
                        alt={image.node.altText || `תמונה ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">
                  {product.node.title}
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  {product.node.description}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-foreground">
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
                        className={`px-4 py-2 rounded-lg border-2 font-bold transition-all ${
                          selectedVariantIndex === index
                            ? 'border-accent bg-accent text-accent-foreground'
                            : variant.node.availableForSale
                              ? 'border-border hover:border-accent'
                              : 'border-border opacity-50 cursor-not-allowed'
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
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-accent transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:border-accent transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant?.availableForSale}
                className="w-full bg-accent text-accent-foreground font-bold py-4 text-lg rounded-xl shadow-cta transition-all duration-300 flex justify-center items-center gap-3 hover:bg-accent/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-5 h-5" />
                הוסף לעגלה - ₪{(parseFloat(selectedVariant?.price.amount || '0') * quantity).toFixed(0)}
              </button>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-accent" />
                  <span className="text-sm text-muted-foreground">משלוח חינם מעל ₪299</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-accent" />
                  <span className="text-sm text-muted-foreground">כשרות למהדרין</span>
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
                    <div className="aspect-square bg-secondary overflow-hidden">
                      {relatedProduct.node.images.edges[0]?.node && (
                        <img 
                          src={relatedProduct.node.images.edges[0].node.url}
                          alt={relatedProduct.node.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
