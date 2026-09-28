import { useEffect } from 'react';
import { SHOP_URL } from '@/lib/shopLinks';

export default function StoreRedirect() {
  useEffect(() => {
    window.location.replace(SHOP_URL);
  }, []);

  return <main className="min-h-screen bg-background" aria-label="מעבר לחנות" />;
}