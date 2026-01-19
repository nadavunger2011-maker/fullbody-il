import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/lib/shopify';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  createCheckout: () => Promise<string | null>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      
      addItem: (item: CartItem) => {
        const { items } = get();
        const existingItem = items.find(i => i.variantId === item.variantId);
        
        let newItems: CartItem[];
        if (existingItem) {
          newItems = items.map(i =>
            i.variantId === item.variantId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          newItems = [...items, item];
        }
        
        set({ items: newItems });
        
        // Track cart update with Flashy (using correct format from docs)
        if (typeof window !== 'undefined' && window.flashy) {
          const total = newItems.reduce(
            (sum, i) => sum + parseFloat(i.price.amount) * i.quantity,
            0
          );
          const contentIds = newItems.map(i => 
            i.product.node.id.replace('gid://shopify/Product/', '')
          );
          window.flashy('UpdateCart', {
            content_ids: contentIds,
            value: total,
            currency: 'ILS'
          });
        }
      },
      
      removeItem: (variantId: string) => {
        set({ items: get().items.filter(i => i.variantId !== variantId) });
      },
      
      updateQuantity: (variantId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map(i =>
            i.variantId === variantId ? { ...i, quantity } : i
          )
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + parseFloat(item.price.amount) * item.quantity,
          0
        );
      },

      createCheckout: async () => {
        set({ isLoading: true });
        // Mock checkout - returns thank you page
        await new Promise(resolve => setTimeout(resolve, 500));
        set({ isLoading: false });
        return '/thank-you';
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);
