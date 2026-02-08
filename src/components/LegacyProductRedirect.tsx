import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

/**
 * Handles redirects from old Shopify product URLs (/products/:handle)
 * to new product URLs (/product/:handle)
 * This is a 301-style client redirect for SEO continuity
 */
export function LegacyProductRedirect() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (handle) {
      // Replace the current history entry with the new URL
      // This mimics a 301 redirect behavior
      navigate(`/product/${handle}`, { replace: true });
    }
  }, [handle, navigate]);

  // Show nothing while redirecting
  return null;
}
