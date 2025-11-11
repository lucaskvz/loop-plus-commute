import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Onboarding } from "@/components/Onboarding";
import { SmartSuggestion } from "@/components/SmartSuggestion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OfferRide from "./pages/OfferRide";
import RideDiscovery from "./pages/RideDiscovery";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Onboarding />
      <SmartSuggestion />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/offer" element={<OfferRide />} />
          <Route path="/rides" element={<RideDiscovery />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
