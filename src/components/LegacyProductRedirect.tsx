import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SHOP_URL = "https://shop.fullbody.co.il";

/**
 * Product pages now live on the Shopify store (shop.fullbody.co.il).
 * Old product URLs redirect there immediately, keeping the path as-is.
 * Shopify holds redirects from the English handles to the right product.
 */
export function LegacyProductRedirect() {
  const { handle } = useParams<{ handle: string }>();
  const target = handle ? `${SHOP_URL}/product/${handle}` : SHOP_URL;

  useEffect(() => {
    window.location.replace(target);
  }, [target]);

  return (
    <Helmet>
      <link rel="canonical" href={target} />
      <meta name="robots" content="noindex, follow" />
    </Helmet>
  );
}
