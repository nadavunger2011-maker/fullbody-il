import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useCartSync } from "@/hooks/useCartSync";
import { initGA4, trackGA4PageView } from "@/lib/ga4";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import ThankYou from "./pages/ThankYou";
import Terms from "./pages/Terms";
import Shipping from "./pages/Shipping";
import Returns from "./pages/Returns";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Accessibility from "./pages/Accessibility";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import SleepGuide from "./pages/SleepGuide";
import WhatsAppButton from "./components/WhatsAppButton";
import { LegacyProductRedirect } from "./components/LegacyProductRedirect";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProIndex from "./pages/ProIndex";
import ProProductDetail from "./pages/ProProductDetail";
import ProContact from "./pages/ProContact";
import ProBlog from "./pages/ProBlog";
import ProBlogPost from "./pages/ProBlogPost";
import ProShippingPolicy from "./pages/ProShippingPolicy";
import ProReturnPolicy from "./pages/ProReturnPolicy";
import ProPrivacyPolicy from "./pages/ProPrivacyPolicy";
import ProTerms from "./pages/ProTerms";
import ProProducts from "./pages/ProProducts";
import ProBundles from "./pages/ProBundles";
import ProteinCalculator from "./pages/ProteinCalculator";
import Recipes from "./pages/Recipes";
import { Navigate } from "react-router-dom";
import { trackPageView } from "@/lib/analytics";
import { trackPageView as trackFBPageView } from "@/lib/fbPixel";
import ScrollToTop from "@/components/ScrollToTop";
import FirstVisitModal from "@/components/FirstVisitModal";
import CookieNotice from "@/components/CookieNotice";

const queryClient = new QueryClient();

const GA4_MEASUREMENT_ID = "G-FJ5SDNJCE1";

function AnalyticsListener() {
  const location = useLocation();

  useEffect(() => {
    void initGA4(GA4_MEASUREMENT_ID);
  }, []);

  useEffect(() => {
    const path = `${location.pathname}${location.search}`;
    const t = window.setTimeout(() => {
      trackGA4PageView(path);
      if (!path.startsWith('/admin')) {
        trackPageView(path);
        // Facebook Pixel: fire PageView on every SPA route change
        trackFBPageView();
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.search]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isCalculator = location.pathname === "/calculator";
  useCartSync();
  
  return (
    <>
      <AnalyticsListener />
      <Routes>
        {/* PRO (Herbalife) — root site */}
        <Route path="/" element={<ProIndex />} />
        <Route path="/products" element={<ProProducts />} />
        <Route path="/bundles" element={<ProBundles />} />
        <Route path="/calculator" element={<ProteinCalculator />} />
        <Route path="/articles" element={<Navigate to="/blog" replace />} />
        <Route path="/product/:handle" element={<ProProductDetail />} />
        <Route path="/blog" element={<ProBlog />} />
        <Route path="/blog/:slug" element={<ProBlogPost />} />
        <Route path="/contact" element={<ProContact />} />
        <Route path="/shipping-policy" element={<ProShippingPolicy />} />
        <Route path="/return-policy" element={<ProReturnPolicy />} />
        <Route path="/privacy-policy" element={<ProPrivacyPolicy />} />
        <Route path="/terms-of-use" element={<ProTerms />} />
        {/* Legacy Shopify URLs without /nava prefix */}
        <Route path="/products/:handle" element={<LegacyProductRedirect />} />

        {/* NAVA — original FullBody site */}
        <Route path="/nava" element={<Index />} />
        <Route path="/nava/product/:handle" element={<ProductDetail />} />
        <Route path="/nava/products/:handle" element={<LegacyProductRedirect />} />
        <Route path="/nava/products" element={<Products />} />
        <Route path="/nava/blog" element={<Blog />} />
        <Route path="/nava/blog/:slug" element={<BlogPost />} />
        <Route path="/nava/thank-you" element={<ThankYou />} />
        <Route path="/nava/terms" element={<Terms />} />
        <Route path="/nava/shipping" element={<Shipping />} />
        <Route path="/nava/returns" element={<Returns />} />
        <Route path="/nava/privacy" element={<Privacy />} />
        <Route path="/nava/faq" element={<FAQ />} />
        <Route path="/nava/contact" element={<Contact />} />
        <Route path="/nava/about" element={<About />} />
        <Route path="/nava/accessibility" element={<Accessibility />} />
        <Route path="/nava/sleep-guide" element={<SleepGuide />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isCalculator && <WhatsAppButton />}
      {!isCalculator && <FirstVisitModal />}
      <CookieNotice />
    </>
  );
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
