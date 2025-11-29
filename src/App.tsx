import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AgeVerification from "./pages/AgeVerification";
import NotFound from "./pages/NotFound";
import { AgeGate } from "./components/AgeGate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/age-verification" element={<AgeVerification />} />
          <Route path="/" element={<AgeGate><Index /></AgeGate>} />
          <Route path="/auth" element={<AgeGate><Auth /></AgeGate>} />
          <Route path="/dashboard" element={<AgeGate><Dashboard /></AgeGate>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<AgeGate><NotFound /></AgeGate>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
