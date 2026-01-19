import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Pages that have their own Flashy events (don't send PageView)
const EXCLUDED_PATHS = ['/product/', '/thank-you'];

/**
 * Hook to send Flashy PageView event on general pages.
 * Product pages send ViewContent, ThankYou sends Purchase - so we exclude them.
 */
export function useFlashyPageView() {
  const location = useLocation();

  useEffect(() => {
    // Skip if on excluded paths
    const shouldSkip = EXCLUDED_PATHS.some(path => 
      location.pathname.startsWith(path)
    );

    if (shouldSkip) {
      return;
    }

    // Send PageView event
    if (typeof window !== 'undefined' && window.flashy) {
      window.flashy('PageView');
    }
  }, [location.pathname]);
}
