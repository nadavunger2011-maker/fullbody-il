import { useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trackPurchase } from '@/lib/gtm';
import { trackPurchase as trackFBPurchase } from '@/lib/fbPixel';
import { trackGA4Purchase } from '@/lib/ga4';
import { useCartStore } from '@/stores/cartStore';
import { trackPurchaseEvent } from '@/lib/analytics';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const { items, clearCart } = useCartStore();
  
  const orderId = searchParams.get('order_id') || searchParams.get('checkout_token') || '';
  const totalParam = searchParams.get('total');
  
  const calculatedTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);
  }, [items]);
  
  const total = totalParam ? parseFloat(totalParam) : calculatedTotal;

  useEffect(() => {
    if ((items.length > 0 || orderId) && total > 0) {
      const transactionId = orderId || `order_${Date.now()}`;

      const gtmItems = items.map(item => ({
        item_id: item.variantId,
        item_name: item.product.node.title,
        item_variant: item.variantTitle,
        price: parseFloat(item.price.amount),
        quantity: item.quantity,
        currency: 'ILS'
      }));

      trackPurchase(transactionId, gtmItems, total, 'ILS');

      trackGA4Purchase(
        transactionId,
        items.map((item) => ({
          item_id: item.product.node.id.replace('gid://shopify/Product/', ''),
          item_name: item.product.node.title,
          item_variant: item.variantTitle !== 'Default Title' ? item.variantTitle : undefined,
          price: parseFloat(item.price.amount),
          quantity: item.quantity,
        })),
        total,
        'ILS'
      );

      if (typeof window !== 'undefined' && window.flashy) {
        const contentIds = items.map(item => 
          item.product.node.id.replace('gid://shopify/Product/', '')
        );
        window.flashy('Purchase', {
          content_ids: contentIds,
          value: total,
          currency: 'ILS',
          order_id: transactionId
        });
      }

      const fbContentIds = items.map(item => 
        item.product.node.id.replace('gid://shopify/Product/', '')
      );
      const numItems = items.reduce((sum, item) => sum + item.quantity, 0);
      trackFBPurchase(fbContentIds, total, numItems);

      trackPurchaseEvent(transactionId, total, items.map(item => ({
        handle: item.product.node.handle,
        title: item.product.node.title,
        id: item.product.node.id.replace('gid://shopify/Product/', ''),
        price: parseFloat(item.price.amount),
        quantity: item.quantity,
      })));

      clearCart();
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
      <Helmet>
        <title>תודה על הזמנתך | FullBody</title>
        <meta name="description" content="ההזמנה שלך התקבלה בהצלחה. תודה שבחרת FullBody לתוספי תזונה איכותיים." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" aria-hidden="true" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">תודה על הזמנתך!</h1>
          <p className="text-muted-foreground">
            ההזמנה שלך התקבלה בהצלחה ותישלח אליך בהקדם
          </p>
        </div>

        {orderId && (
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">מספר הזמנה</p>
            <p className="font-mono font-semibold text-foreground">{orderId}</p>
          </div>
        )}

        {total > 0 && (
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">סה״כ שולם</p>
            <p className="text-2xl font-bold text-foreground">₪{total.toFixed(2)}</p>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Package className="w-5 h-5" aria-hidden="true" />
          <span>אישור הזמנה נשלח למייל שלך</span>
        </div>

        <div className="pt-4">
          <Link to="/">
            <Button className="gap-2">
              המשך לקנות
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
