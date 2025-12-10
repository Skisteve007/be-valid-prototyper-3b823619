import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import AdminSetup from "./pages/AdminSetup";
import Sponsors from "./pages/Sponsors";
import Partners from "./pages/Partners";
import LabDashboard from "./pages/LabDashboard";
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
import VenueCompliance from "./pages/VenueCompliance";
import SalesPortal from "./pages/SalesPortal";
import PartnerApplication from "./pages/PartnerApplication";
import CompetitiveScorecard from "./pages/CompetitiveScorecard";
import VenueOperatorPortal from "./pages/VenueOperatorPortal";
import PitchDeck from "./pages/PitchDeck";
import VenueLanding from "./pages/VenueLanding";
import IDVVerification from "./pages/IDVVerification";
import AdminDealRoom from "./pages/AdminDealRoom";
import InvestorDashboard from "./pages/InvestorDashboard";

import ApiDocs from "./pages/ApiDocs";
import SecurityCompliance from "./pages/SecurityCompliance";
import IntegratedHealthCompliance from "./pages/IntegratedHealthCompliance";
import MyAccess from "./pages/MyAccess";
import LabPortal from "./pages/LabPortal";
import NotFound from "./pages/NotFound";
import { CurrencyProvider } from "./providers/CurrencyProvider";
import { AgeGate } from "./components/AgeGate";
import Footer from "./components/Footer";
import SiteGate from "./components/SiteGate";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <SiteGate>
          <div className="min-h-screen flex flex-col overflow-x-hidden bg-background text-foreground">
            <Routes>
              <Route path="/" element={<AgeGate><Index /></AgeGate>} />
              <Route path="/auth" element={<AgeGate><Auth /></AgeGate>} />
              <Route path="/dashboard" element={<AgeGate><Dashboard /></AgeGate>} />
              <Route path="/admin" element={<AgeGate><Admin /></AgeGate>} />
              <Route path="/admin/login" element={<AgeGate><AdminLogin /></AgeGate>} />
              <Route path="/admin/setup" element={<AgeGate><AdminSetup /></AgeGate>} />
              <Route path="/admin/deal-room" element={<AgeGate><AdminDealRoom /></AgeGate>} />
              <Route path="/investor-dashboard" element={<AgeGate><InvestorDashboard /></AgeGate>} />
              <Route path="/sponsors" element={<AgeGate><Sponsors /></AgeGate>} />
              <Route path="/partners" element={<AgeGate><Partners /></AgeGate>} />
              <Route path="/partners/verification" element={<AgeGate><Partners /></AgeGate>} />
              <Route path="/lab/dashboard" element={<AgeGate><LabDashboard /></AgeGate>} />
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
              <Route path="/compliance" element={<VenueCompliance />} />
              <Route path="/sales-portal" element={<AgeGate><SalesPortal /></AgeGate>} />
              <Route path="/partner-application" element={<AgeGate><PartnerApplication /></AgeGate>} />
              <Route path="/competitive-scorecard" element={<AgeGate><CompetitiveScorecard /></AgeGate>} />
              <Route path="/venue-portal" element={<AgeGate><VenueOperatorPortal /></AgeGate>} />
              <Route path="/pitch-deck" element={<PitchDeck />} />
              <Route path="/venues/:slug" element={<VenueLanding />} />
              <Route path="/idv-verification" element={<AgeGate><IDVVerification /></AgeGate>} />
              
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route path="/security-compliance" element={<SecurityCompliance />} />
              <Route path="/partners/integrated-health-compliance" element={<IntegratedHealthCompliance />} />
              <Route path="/my-access" element={<AgeGate><MyAccess /></AgeGate>} />
              <Route path="/lab-portal" element={<AgeGate><LabPortal /></AgeGate>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<AgeGate><NotFound /></AgeGate>} />
            </Routes>
            <Footer />
          </div>
          </SiteGate>
          </BrowserRouter>
        </TooltipProvider>
      </CurrencyProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
