import { X, Plus, Minus, ShoppingBag, Trash2, Loader2 } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { trackInitiateCheckout } from '@/lib/fbPixel';
import { formatCheckoutUrl } from '@/lib/shopify';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotal, getCheckoutUrl, isLoading } = useCartStore();
  const total = getTotal();
  const freeShippingThreshold = 299;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - total);

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('העגלה ריקה');
      return;
    }
    
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      // Track InitiateCheckout with Facebook Pixel
      const contentIds = items.map(item => 
        item.product.node.id.replace('gid://shopify/Product/', '')
      );
      const numItems = items.reduce((sum, item) => sum + item.quantity, 0);
      trackInitiateCheckout(contentIds, total, numItems);
      
      // Format URL with channel parameter and open in new tab
      const formattedUrl = formatCheckoutUrl(checkoutUrl);
      window.open(formattedUrl, '_blank');
      onClose();
    } else {
      toast.error('שגיאה ביצירת הזמנה');
    }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-foreground/50 z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-card z-50 shadow-2xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        dir="rtl"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              עגלת קניות ({items.length})
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          {items.length > 0 && (
            <div className="p-4 bg-muted border-b border-border">
              {remainingForFreeShipping > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-2">
                    חסרים לך עוד <span className="font-bold text-accent">₪{remainingForFreeShipping.toFixed(0)}</span> למשלוח חינם
                  </p>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all duration-300"
                      style={{ width: `${(total / freeShippingThreshold) * 100}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-sm text-green-600 font-bold">
                  🎉 זכית במשלוח חינם!
                </p>
              )}
            </div>
          )}

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>העגלה ריקה</p>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.variantId}
                  className="flex gap-3 bg-background rounded-xl p-3 border border-border"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    {item.product.node.images.edges[0]?.node && (
                      <img 
                        src={item.product.node.images.edges[0].node.url}
                        alt={item.product.node.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-foreground truncate">
                      {item.product.node.title}
                    </h3>
                    {item.variantTitle !== 'Default Title' && (
                      <p className="text-xs text-muted-foreground">{item.variantTitle}</p>
                    )}
                    <p className="font-bold text-accent mt-1">
                      ₪{parseFloat(item.price.amount).toFixed(0)}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2 bg-muted rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="p-1.5 hover:bg-border rounded-lg transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-sm w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="p-1.5 hover:bg-border rounded-lg transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.variantId)}
                        className="p-2 text-muted-foreground hover:text-destructive transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-border p-4 space-y-4">
              <div className="flex items-center justify-between font-bold text-lg">
                <span>סה"כ:</span>
                <span className="text-accent">₪{total.toFixed(0)}</span>
              </div>
              
              <Button 
                onClick={handleCheckout}
                className="w-full py-6 text-lg font-bold bg-accent hover:bg-accent/90"
              >
                לתשלום
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
