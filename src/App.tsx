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
import { trackPageView } from "@/lib/analytics";

const queryClient = new QueryClient();

const GA4_MEASUREMENT_ID = "G-FJ5SDNJCE1";

function AnalyticsListener() {
  const location = useLocation();

  useEffect(() => {
    void initGA4(GA4_MEASUREMENT_ID);
  }, []);

  useEffect(() => {
    // Let Helmet update the title before we send the page_view
    const path = `${location.pathname}${location.search}`;
    const t = window.setTimeout(() => {
      trackGA4PageView(path);
      // Track page view in our analytics DB (skip admin pages)
      if (!path.startsWith('/admin')) {
        trackPageView(path);
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, [location.pathname, location.search]);

  return null;
}

function AppContent() {
  useCartSync();
  
  return (
    <>
      <AnalyticsListener />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:handle" element={<ProductDetail />} />
        <Route path="/products/:handle" element={<LegacyProductRedirect />} />
        <Route path="/products" element={<Products />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/accessibility" element={<Accessibility />} />
        <Route path="/sleep-guide" element={<SleepGuide />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/pro" element={<ProIndex />} />
        <Route path="/pro/product/:handle" element={<ProProductDetail />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
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
          <AppContent />
          <WhatsAppButton />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
