import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useCartSync } from "@/hooks/useCartSync";
import { initGA4, trackGA4PageView } from "@/lib/ga4";
import ScrollToTop from "@/components/ScrollToTop";
import CookieNotice from "@/components/CookieNotice";
import { trackPageView } from "@/lib/analytics";
import { trackPageView as trackFBPageView } from "@/lib/fbPixel";

// Eager: landing page user typically hits first
import ProIndex from "./pages/ProIndex";
import StarterStack from "./pages/StarterStack";

// Lazy: everything else
const NotFound = lazy(() => import("./pages/NotFound"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const Terms = lazy(() => import("./pages/Terms"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Returns = lazy(() => import("./pages/Returns"));
const Privacy = lazy(() => import("./pages/Privacy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Products = lazy(() => import("./pages/Products"));
const SleepGuide = lazy(() => import("./pages/SleepGuide"));
const WhatsAppButton = lazy(() => import("./components/WhatsAppButton"));
const LegacyProductRedirect = lazy(() => import("./components/LegacyProductRedirect").then(m => ({ default: m.LegacyProductRedirect })));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Index = lazy(() => import("./pages/Index"));
const ProProductDetail = lazy(() => import("./pages/ProProductDetail"));
const ProContact = lazy(() => import("./pages/ProContact"));
const ProBlog = lazy(() => import("./pages/ProBlog"));
const ProBlogPost = lazy(() => import("./pages/ProBlogPost"));
const ProShippingPolicy = lazy(() => import("./pages/ProShippingPolicy"));
const ProReturnPolicy = lazy(() => import("./pages/ProReturnPolicy"));
const ProPrivacyPolicy = lazy(() => import("./pages/ProPrivacyPolicy"));
const ProTerms = lazy(() => import("./pages/ProTerms"));
const ProProducts = lazy(() => import("./pages/ProProducts"));
const ProBundles = lazy(() => import("./pages/ProBundles"));
const ProteinCalculator = lazy(() => import("./pages/ProteinCalculator"));
const Recipes = lazy(() => import("./pages/Recipes"));
const ProtocolLanding = lazy(() => import("./pages/ProtocolLanding"));
const ProtocolThankYou = lazy(() => import("./pages/ProtocolThankYou"));
const ChocolateCakeProtocol = lazy(() => import("./pages/ChocolateCakeProtocol"));
const CartPage = lazy(() => import("./pages/CartPage"));
const PlanWizard = lazy(() => import("./pages/PlanWizard"));
const DailyDashboard = lazy(() => import("./pages/DailyDashboard"));
const FirstVisitModal = lazy(() => import("@/components/FirstVisitModal"));


// Sweets sub-site
const SweetsHome = lazy(() => import("./pages/sweets/SweetsHome"));
const SweetsProducts = lazy(() => import("./pages/sweets/SweetsProducts"));
const SweetsStory = lazy(() => import("./pages/sweets/SweetsStory"));
const SweetsShipping = lazy(() => import("./pages/sweets/SweetsShipping"));
const SweetsContact = lazy(() => import("./pages/sweets/SweetsContact"));
const SweetsProductDetail = lazy(() => import("./pages/sweets/SweetsProductDetail"));

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
  const isRecipes = location.pathname === "/recipes";
  const isProtocol = location.pathname === "/protocol";
  const isChocolateCake = location.pathname === "/blog/chocolate-cake-protocol";
  const isSweets = location.pathname.startsWith("/sweets");
  useCartSync();

  return (
    <>
      <AnalyticsListener />
      <Suspense fallback={null}>
        <Routes>
          {/* PRO (Herbalife) — root site */}
          <Route path="/" element={<ProIndex />} />
          <Route path="/products" element={<ProProducts />} />
          <Route path="/bundles" element={<ProBundles />} />
          <Route path="/starter-stack" element={<StarterStack />} />
          <Route path="/calculator" element={<ProteinCalculator />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/protocol" element={<ProtocolLanding />} />
          <Route path="/protocol-thank-you" element={<ProtocolThankYou />} />
          <Route path="/blog/chocolate-cake-protocol" element={<ChocolateCakeProtocol />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/plan" element={<PlanWizard />} />


          {/* Sweets sub-site (ready for sweets.fullbody.co.il) */}
          <Route path="/sweets" element={<SweetsHome />} />
          <Route path="/sweets/products" element={<SweetsProducts />} />
          <Route path="/sweets/category/:categoryId" element={<SweetsProducts />} />
          <Route path="/sweets/product/:handle" element={<SweetsProductDetail />} />
          <Route path="/sweets/story" element={<SweetsStory />} />
          <Route path="/sweets/shipping" element={<SweetsShipping />} />
          <Route path="/sweets/contact" element={<SweetsContact />} />

          <Route path="/articles" element={<Navigate to="/blog" replace />} />
          <Route path="/product/:handle" element={<ProProductDetail />} />
          <Route path="/blog" element={<ProBlog />} />
          <Route path="/blog/:slug" element={<ProBlogPost />} />
          <Route path="/contact" element={<ProContact />} />
          <Route path="/shipping-policy" element={<ProShippingPolicy />} />
          <Route path="/return-policy" element={<ProReturnPolicy />} />
          <Route path="/privacy-policy" element={<ProPrivacyPolicy />} />
          <Route path="/terms-of-use" element={<ProTerms />} />
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Suspense fallback={null}>
        {!isCalculator && !isRecipes && !isProtocol && !isChocolateCake && !isSweets && <WhatsAppButton />}
        {!isCalculator && !isRecipes && !isProtocol && !isChocolateCake && !isSweets && <FirstVisitModal />}
        <CookieNotice />
      </Suspense>
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
