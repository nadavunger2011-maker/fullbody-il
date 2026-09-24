// Product catalog and checkout live on the Shopify store at shop.fullbody.co.il.
// The main site (fullbody.co.il) keeps content, blog, leads and dashboards only.
import { getProductByHandle } from '@/data/herbalifeProducts';

export const SHOP_URL = 'https://shop.fullbody.co.il';

/** Canonical store URL for a Shopify product handle. */
export function shopProductUrl(shopifyHandle: string): string {
  return `${SHOP_URL}/products/${encodeURIComponent(shopifyHandle)}`;
}

/** Store URL from a local (site) product handle, falling back to the handle itself. */
export function shopUrlForHandle(handle?: string | null): string {
  if (!handle) return SHOP_URL;
  const product = getProductByHandle(handle);
  return shopProductUrl(product?.shopifyHandle ?? handle);
}
