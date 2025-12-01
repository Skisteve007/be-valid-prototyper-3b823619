import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminSetup from "./pages/AdminSetup";
import Sponsors from "./pages/Sponsors";
import Partners from "./pages/Partners";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Refund from "./pages/Refund";
import Compliance2257 from "./pages/Compliance2257";
import ViewProfile from "./pages/ViewProfile";
import PaymentSuccess from "./pages/PaymentSuccess";
import SafetyCertificate from "./pages/SafetyCertificate";
import LabKitOrder from "./pages/LabKitOrder";
import ToxicologyKitOrder from "./pages/ToxicologyKitOrder";
import HealthPanelOrder from "./pages/HealthPanelOrder";
import NotFound from "./pages/NotFound";
import { AgeGate } from "./components/AgeGate";
import { AdminFooter } from "./components/AdminFooter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<AgeGate><Index /></AgeGate>} />
            <Route path="/auth" element={<AgeGate><Auth /></AgeGate>} />
            <Route path="/dashboard" element={<AgeGate><Dashboard /></AgeGate>} />
            <Route path="/admin" element={<AgeGate><Admin /></AgeGate>} />
            <Route path="/admin/login" element={<AgeGate><AdminLogin /></AgeGate>} />
            <Route path="/admin/setup" element={<AgeGate><AdminSetup /></AgeGate>} />
            <Route path="/sponsors" element={<AgeGate><Sponsors /></AgeGate>} />
            <Route path="/partners" element={<AgeGate><Partners /></AgeGate>} />
            <Route path="/terms" element={<AgeGate><Terms /></AgeGate>} />
            <Route path="/privacy" element={<AgeGate><Privacy /></AgeGate>} />
            <Route path="/refund" element={<AgeGate><Refund /></AgeGate>} />
            <Route path="/2257-compliance" element={<AgeGate><Compliance2257 /></AgeGate>} />
          <Route path="/view-profile" element={<AgeGate><ViewProfile /></AgeGate>} />
          <Route path="/safety-certificate" element={<AgeGate><SafetyCertificate /></AgeGate>} />
          <Route path="/lab-kit-order" element={<AgeGate><LabKitOrder /></AgeGate>} />
          <Route path="/toxicology-kit-order" element={<AgeGate><ToxicologyKitOrder /></AgeGate>} />
          <Route path="/health-panel-order" element={<AgeGate><HealthPanelOrder /></AgeGate>} />
          <Route path="/payment-success" element={<AgeGate><PaymentSuccess /></AgeGate>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<AgeGate><NotFound /></AgeGate>} />
          </Routes>
          <AdminFooter />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
