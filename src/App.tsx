import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackToTop from "@/components/shared/BackToTop";
import SmoothScroll from "@/components/shared/SmoothScroll";
import Index from "./pages/Index";
import StandortDetail from "./pages/StandortDetail";
import FAQ from "./pages/FAQ";

import Anfrage from "./pages/Anfrage";
import Sommerreifen from "./pages/Sommerreifen";
import Winterreifen from "./pages/Winterreifen";
import Ganzjahresreifen from "./pages/Ganzjahresreifen";
import Reifenhotel from "./pages/Reifenhotel";
import Radwechsel from "./pages/Radwechsel";
import Reifenwechsel from "./pages/Reifenwechsel";
import Reifenreparatur from "./pages/Reifenreparatur";
import Felgenreparatur from "./pages/Felgenreparatur";
import Autoreinigung from "./pages/Autoreinigung";

import Offroadreifen from "./pages/Offroadreifen";
import Hersteller from "./pages/Hersteller";
import UeberUns from "./pages/UeberUns";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminWartezeit from "./pages/AdminWartezeit";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/layout/PageTransition";

const queryClient = new QueryClient();

// ScrollToTop is now handled by SmoothScroll

function AppRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/standorte/:slug" element={<StandortDetail />} />
          <Route path="/faq" element={<FAQ />} />
          
          <Route path="/anfrage" element={<Anfrage />} />
          <Route path="/sommerreifen" element={<Sommerreifen />} />
          <Route path="/winterreifen" element={<Winterreifen />} />
          <Route path="/ganzjahresreifen" element={<Ganzjahresreifen />} />
          <Route path="/reifenhotel" element={<Reifenhotel />} />
          <Route path="/radwechsel" element={<Radwechsel />} />
          <Route path="/reifenwechsel" element={<Reifenwechsel />} />
          <Route path="/reifenreparatur" element={<Reifenreparatur />} />
          <Route path="/felgenreparatur" element={<Felgenreparatur />} />
          <Route path="/autoreinigung" element={<Autoreinigung />} />
          
          <Route path="/offroadreifen" element={<Offroadreifen />} />
          <Route path="/hersteller" element={<Hersteller />} />
          <Route path="/ueber-uns" element={<UeberUns />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/wartezeit" element={<AdminWartezeit />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageTransition>
    </AnimatePresence>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SmoothScroll>
              {/* Yellow status bar strip for iOS */}
              <div className="fixed top-0 left-0 right-0 z-[100] bg-background" style={{ height: 'env(safe-area-inset-top, 0px)' }} />
              <div className="relative z-10 min-h-screen bg-background">
                <Navbar />
                <AppRoutes />
              </div>
              <Footer />
              <BackToTop />
            </SmoothScroll>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
