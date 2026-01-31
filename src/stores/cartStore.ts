import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, ShopifyProduct } from '@/lib/shopify';
import { 
  createShopifyCart, 
  addLineToShopifyCart, 
  updateShopifyCartLine, 
  removeLineFromShopifyCart,
  getCart,
  storefrontApiRequest
} from '@/lib/shopify';

interface CartStore {
  items: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (item: Omit<CartItem, 'lineId'>) => Promise<boolean>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartId: null,
      checkoutUrl: null,
      isLoading: false,
      isSyncing: false,

      addItem: async (item) => {
        const { items, cartId, clearCart } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);
        
        set({ isLoading: true });
        try {
          if (!cartId) {
            const result = await createShopifyCart({ ...item, lineId: null });
            if (result) {
              const newItems = [{ ...item, lineId: result.lineId }];
              set({
                cartId: result.cartId,
                checkoutUrl: result.checkoutUrl,
                items: newItems
              });
              trackCartUpdate(newItems);
              return true;
            }
            return false;
          } else if (existingItem) {
            const newQuantity = existingItem.quantity + item.quantity;
            if (!existingItem.lineId) {
              console.error('Cannot update quantity for item without lineId:', existingItem);
              return false;
            }
            const result = await updateShopifyCartLine(cartId, existingItem.lineId, newQuantity);
            if (result.success) {
              const currentItems = get().items;
              const newItems = currentItems.map(i => i.variantId === item.variantId ? { ...i, quantity: newQuantity } : i);
              set({ items: newItems });
              trackCartUpdate(newItems);
              return true;
            } else if (result.cartNotFound) {
              clearCart();
              return false;
            }
            return false;
          } else {
            const result = await addLineToShopifyCart(cartId, { ...item, lineId: null });
            if (result.success) {
              const currentItems = get().items;
              const newItems = [...currentItems, { ...item, lineId: result.lineId ?? null }];
              set({ items: newItems });
              trackCartUpdate(newItems);
              return true;
            } else if (result.cartNotFound) {
              clearCart();
              return false;
            }
            return false;
          }
        } catch (error) {
          console.error('Failed to add item:', error);
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        if (quantity <= 0) {
          await get().removeItem(variantId);
          return;
        }
        
        const { items, cartId, clearCart } = get();
        const item = items.find(i => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        set({ isLoading: true });
        try {
          const result = await updateShopifyCartLine(cartId, item.lineId, quantity);
          if (result.success) {
            const currentItems = get().items;
            const newItems = currentItems.map(i => i.variantId === variantId ? { ...i, quantity } : i);
            set({ items: newItems });
            trackCartUpdate(newItems);
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error('Failed to update quantity:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantId) => {
        const { items, cartId, clearCart } = get();
        const item = items.find(i => i.variantId === variantId);
        if (!item?.lineId || !cartId) return;

        set({ isLoading: true });
        try {
          const result = await removeLineFromShopifyCart(cartId, item.lineId);
          if (result.success) {
            const currentItems = get().items;
            const newItems = currentItems.filter(i => i.variantId !== variantId);
            if (newItems.length === 0) {
              clearCart();
            } else {
              set({ items: newItems });
              trackCartUpdate(newItems);
            }
          } else if (result.cartNotFound) {
            clearCart();
          }
        } catch (error) {
          console.error('Failed to remove item:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null }),
      
      getCheckoutUrl: () => get().checkoutUrl,

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
          0
        );
      },

      syncCart: async () => {
        const { cartId, isSyncing, clearCart } = get();
        if (!cartId || isSyncing) return;

        set({ isSyncing: true });
        try {
          const result = await getCart(cartId);
          if (!result.exists || result.totalQuantity === 0) {
            clearCart();
          }
        } catch (error) {
          console.error('Failed to sync cart with Shopify:', error);
        } finally {
          set({ isSyncing: false });
        }
      }
    }),
    {
      name: 'shopify-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        items: state.items, 
        cartId: state.cartId, 
        checkoutUrl: state.checkoutUrl 
      }),
    }
  )
);

// Track cart update with Flashy
function trackCartUpdate(items: CartItem[]) {
  if (typeof window !== 'undefined' && window.flashy) {
    const total = items.reduce(
      (sum, i) => sum + parseFloat(i.price.amount) * i.quantity,
      0
    );
    const contentIds = items.map(i => 
      i.product.node.id.replace('gid://shopify/Product/', '')
    );
    window.flashy('UpdateCart', {
      content_ids: contentIds,
      value: total,
      currency: 'ILS'
    });
  }
}
