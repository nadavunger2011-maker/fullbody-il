import { useEffect } from 'react';
import { useCartStore } from '@/stores/cartStore';

export function useCartSync() {
  const syncCart = useCartStore(state => state.syncCart);

  useEffect(() => {
    syncCart(); // Sync on initial page load
    
    // Sync when user returns to the tab (handles return from checkout)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncCart();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [syncCart]);
}
