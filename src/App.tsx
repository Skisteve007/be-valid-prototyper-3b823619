import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CurrencyProvider } from "./providers/CurrencyProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { AgeGate } from "./components/AgeGate";
import { AccessGate } from "./components/AccessGate";
import Footer from "./components/Footer";
// SiteGate removed as global wrapper - use AccessGate for protected routes instead
import { Skeleton } from "@/components/ui/skeleton";

// Critical path - eager load
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Lazy loaded pages for code splitting
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminSetup = lazy(() => import("./pages/AdminSetup"));
const Sponsors = lazy(() => import("./pages/Sponsors"));
const Partners = lazy(() => import("./pages/Partners"));
const LabDashboard = lazy(() => import("./pages/LabDashboard"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Refund = lazy(() => import("./pages/Refund"));
const Compliance2257 = lazy(() => import("./pages/Compliance2257"));
const ViewProfile = lazy(() => import("./pages/ViewProfile"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const SafetyCertificate = lazy(() => import("./pages/SafetyCertificate"));
const LabKitOrder = lazy(() => import("./pages/LabKitOrder"));
const ToxicologyKitOrder = lazy(() => import("./pages/ToxicologyKitOrder"));
const HealthPanelOrder = lazy(() => import("./pages/HealthPanelOrder"));
const VenueCompliance = lazy(() => import("./pages/VenueCompliance"));
const SalesPortal = lazy(() => import("./pages/SalesPortal"));
const PartnerApplication = lazy(() => import("./pages/PartnerApplication"));
const CompetitiveScorecard = lazy(() => import("./pages/CompetitiveScorecard"));
const VenueOperatorPortal = lazy(() => import("./pages/VenueOperatorPortal"));
const PitchDeck = lazy(() => import("./pages/PitchDeck"));
const VenueLanding = lazy(() => import("./pages/VenueLanding"));
const IDVVerification = lazy(() => import("./pages/IDVVerification"));
const AdminDealRoom = lazy(() => import("./pages/AdminDealRoom"));
const SynthVault = lazy(() => import("./pages/SynthVault"));
const InvestorDashboard = lazy(() => import("./pages/InvestorDashboard"));
const SharedProfile = lazy(() => import("./pages/SharedProfile"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const AccessPending = lazy(() => import("./pages/AccessPending"));
const SharedLocation = lazy(() => import("./pages/SharedLocation"));
const VendorPortal = lazy(() => import("./pages/VendorPortal"));
const VendorDashboard = lazy(() => import("./pages/VendorDashboard"));
const StaffPOS = lazy(() => import("./pages/StaffPOS"));
const InvestorPortal = lazy(() => import("./pages/InvestorPortal"));
const ApiDocs = lazy(() => import("./pages/ApiDocs"));
const SecurityCompliance = lazy(() => import("./pages/SecurityCompliance"));
const IntegratedHealthCompliance = lazy(() => import("./pages/IntegratedHealthCompliance"));
const MyAccess = lazy(() => import("./pages/MyAccess"));
const LabPortal = lazy(() => import("./pages/LabPortal"));
const PlatformFeatures = lazy(() => import("./pages/PlatformFeatures"));
const TrustCenter = lazy(() => import("./pages/TrustCenter"));
const CinematicPitchDeck = lazy(() => import("./pages/CinematicPitchDeck"));
const Synth = lazy(() => import("./pages/Synth"));
const SystemAudit = lazy(() => import("./pages/SystemAudit"));
const Scanner = lazy(() => import("./pages/Scanner"));
const ManagerQuickstart = lazy(() => import("./pages/ManagerQuickstart"));
const StaffQuickstart = lazy(() => import("./pages/StaffQuickstart"));
const ManagerAdmin = lazy(() => import("./pages/ManagerAdmin"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="space-y-4 w-full max-w-md p-8">
      <Skeleton className="h-12 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-32 w-full" />
    </div>
  </div>
);

const App = () => (
  <ThemeProvider>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <div className="min-h-screen flex flex-col overflow-x-hidden bg-background text-foreground">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* PUBLIC ROUTES - No SiteGate protection */}
                  <Route path="/" element={<AgeGate><Index /></AgeGate>} />
                  <Route path="/auth" element={<AgeGate><Auth /></AgeGate>} />
                  <Route path="/access-portal" element={<AgeGate><Auth /></AgeGate>} />
                  <Route path="/login" element={<AgeGate><Auth /></AgeGate>} />
                  <Route path="/signup" element={<AgeGate><Auth /></AgeGate>} />
                  <Route path="/dashboard" element={<AgeGate><Dashboard /></AgeGate>} />
                  <Route path="/profile" element={<AgeGate><Dashboard /></AgeGate>} />
                  <Route path="/wallet" element={<AgeGate><Dashboard /></AgeGate>} />
                  
                  {/* ADMIN ROUTES */}
                  <Route path="/admin" element={<AgeGate><Admin /></AgeGate>} />
                  <Route path="/admin/login" element={<AgeGate><AdminLogin /></AgeGate>} />
                  <Route path="/admin/setup" element={<AgeGate><AdminSetup /></AgeGate>} />
                  <Route path="/admin/deal-room" element={<AgeGate><AdminDealRoom /></AgeGate>} />
                  <Route path="/synth-vault" element={<SynthVault />} />
                  <Route path="/synth" element={<AgeGate><Synth /></AgeGate>} />
                  
                  {/* INVESTOR ROUTES - Protected */}
                  <Route path="/investor-dashboard" element={<AgeGate><InvestorDashboard /></AgeGate>} />
                  <Route path="/investor-portal" element={<AgeGate><AccessGate accessType="investor"><InvestorPortal /></AccessGate></AgeGate>} />
                  <Route path="/investors" element={<AgeGate><AccessGate accessType="investor"><InvestorPortal /></AccessGate></AgeGate>} />
                  <Route path="/pitch-deck" element={<AccessGate accessType="investor"><PitchDeck /></AccessGate>} />
                  
                  {/* PARTNER ROUTES - Protected */}
                  <Route path="/partners" element={<AgeGate><AccessGate accessType="partner"><Partners /></AccessGate></AgeGate>} />
                  <Route path="/partners/verification" element={<AgeGate><AccessGate accessType="partner"><Partners /></AccessGate></AgeGate>} />
                  <Route path="/partners/integrated-health-compliance" element={<IntegratedHealthCompliance />} />
                  
                  {/* SPONSOR & LAB ROUTES */}
                  <Route path="/sponsors" element={<AgeGate><Sponsors /></AgeGate>} />
                  <Route path="/lab/dashboard" element={<AgeGate><LabDashboard /></AgeGate>} />
                  <Route path="/lab-portal" element={<AgeGate><LabPortal /></AgeGate>} />
                  
                  {/* LEGAL PAGES - Public */}
                  <Route path="/terms" element={<AgeGate><Terms /></AgeGate>} />
                  <Route path="/privacy" element={<AgeGate><Privacy /></AgeGate>} />
                  <Route path="/refund" element={<AgeGate><Refund /></AgeGate>} />
                  <Route path="/2257-compliance" element={<AgeGate><Compliance2257 /></AgeGate>} />
                  
                  {/* PROFILE & CERTIFICATE ROUTES */}
                  <Route path="/view-profile" element={<AgeGate><ViewProfile /></AgeGate>} />
                  <Route path="/safety-certificate" element={<AgeGate><SafetyCertificate /></AgeGate>} />
                  <Route path="/p/:shortId" element={<SharedProfile />} />
                  <Route path="/location/:locationId" element={<SharedLocation />} />
                  
                  {/* ORDER & PAYMENT ROUTES */}
                  <Route path="/lab-kit-order" element={<AgeGate><LabKitOrder /></AgeGate>} />
                  <Route path="/toxicology-kit-order" element={<AgeGate><ToxicologyKitOrder /></AgeGate>} />
                  <Route path="/health-panel-order" element={<AgeGate><HealthPanelOrder /></AgeGate>} />
                  <Route path="/payment-success" element={<AgeGate><PaymentSuccess /></AgeGate>} />
                  
                  {/* VENDOR & PORTAL ROUTES */}
                  <Route path="/compliance" element={<VenueCompliance />} />
                  <Route path="/sales-portal" element={<AgeGate><SalesPortal /></AgeGate>} />
                  <Route path="/partner-application" element={<AgeGate><PartnerApplication /></AgeGate>} />
                  <Route path="/competitive-scorecard" element={<AgeGate><CompetitiveScorecard /></AgeGate>} />
                  <Route path="/venue-portal" element={<AgeGate><VenueOperatorPortal /></AgeGate>} />
                  <Route path="/vendor-pricing" element={<AgeGate><PlatformFeatures /></AgeGate>} />
                  <Route path="/vendor-portal" element={<VendorPortal />} />
                  <Route path="/vendor-portal/dashboard" element={<VendorDashboard />} />
                  <Route path="/staff/pos" element={<StaffPOS />} />
                  
                  {/* VENUE ROUTES */}
                  <Route path="/venues/:slug" element={<VenueLanding />} />
                  <Route path="/access-pending" element={<AccessPending />} />
                  
                  {/* VERIFICATION & UTILITY ROUTES */}
                  <Route path="/idv-verification" element={<AgeGate><IDVVerification /></AgeGate>} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/api-docs" element={<ApiDocs />} />
                  <Route path="/security-compliance" element={<SecurityCompliance />} />
                  <Route path="/my-access" element={<AgeGate><MyAccess /></AgeGate>} />
                  <Route path="/trust-center" element={<AgeGate><TrustCenter /></AgeGate>} />
                  <Route path="/pitch" element={<AccessGate accessType="investor"><CinematicPitchDeck /></AccessGate>} />
                  <Route path="/deck" element={<AccessGate accessType="investor"><CinematicPitchDeck /></AccessGate>} />
                  <Route path="/system-audit" element={<SystemAudit />} />
                  <Route path="/scanner" element={<Scanner />} />
                  <Route path="/manager-quickstart" element={<ManagerQuickstart />} />
                  <Route path="/staff-quickstart" element={<StaffQuickstart />} />
                  <Route path="/manager-admin" element={<ManagerAdmin />} />
                  
                  {/* CATCH-ALL - Must be last */}
                  <Route path="*" element={<AgeGate><NotFound /></AgeGate>} />
                </Routes>
              </Suspense>
              <Footer />
            </div>
            </BrowserRouter>
          </TooltipProvider>
        </CurrencyProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ThemeProvider>
);

export default App;