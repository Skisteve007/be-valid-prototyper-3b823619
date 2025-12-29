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
import SynthButton from "@/components/SynthButton";
import ResponsiveHeader from "@/components/ResponsiveHeader";
import ModeSwitcherFAB from "@/components/ModeSwitcherFAB";
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
const Patents = lazy(() => import("./pages/Patents"));
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
const AccessApproved = lazy(() => import("./pages/AccessApproved"));
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
const Pricing = lazy(() => import("./pages/Pricing"));
const TrustCenter = lazy(() => import("./pages/TrustCenter"));
const CinematicPitchDeck = lazy(() => import("./pages/CinematicPitchDeck"));
const Synth = lazy(() => import("./pages/Synth"));
const SynthAdmin = lazy(() => import("./pages/SynthAdmin"));
const SynthConsole = lazy(() => import("./pages/SynthConsole"));
const SynthSenateDashboard = lazy(() => import("./pages/SynthSenateDashboard"));
const SynthLogs = lazy(() => import("./pages/SynthLogs"));
const SynthDocs = lazy(() => import("./pages/SynthDocs"));
const SynthPolicies = lazy(() => import("./pages/SynthPolicies"));
const SynthMethodology = lazy(() => import("./pages/SynthMethodology"));
const SynthChallenges = lazy(() => import("./pages/SynthChallenges"));
const SynthAccepted = lazy(() => import("./pages/SynthAccepted"));
const SynthLocked = lazy(() => import("./pages/SynthLocked"));
const SynthDossier = lazy(() => import("./pages/SynthDossier"));
const SynthIntake = lazy(() => import("./pages/SynthIntake"));
const SynthE2ETest = lazy(() => import("./pages/SynthE2ETest"));
const SystemAudit = lazy(() => import("./pages/SystemAudit"));
const Scanner = lazy(() => import("./pages/Scanner"));
const ManagerQuickstart = lazy(() => import("./pages/ManagerQuickstart"));
const StaffQuickstart = lazy(() => import("./pages/StaffQuickstart"));
const DevicePairing = lazy(() => import("./pages/DevicePairing"));
const ScanningDecisions = lazy(() => import("./pages/ScanningDecisions"));
const Troubleshooting = lazy(() => import("./pages/Troubleshooting"));
const VenueOnboarding = lazy(() => import("./pages/VenueOnboarding"));
const ManagerAdmin = lazy(() => import("./pages/ManagerAdmin"));
const DriverDashboard = lazy(() => import("./pages/DriverDashboard"));
const StaffPayment = lazy(() => import("./pages/StaffPayment"));
const AdminDocumentation = lazy(() => import("./pages/AdminDocumentation"));
const PartnerHelp = lazy(() => import("./pages/PartnerHelp"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const WalletFundingSuccess = lazy(() => import("./pages/WalletFundingSuccess"));
const PaymentGuide = lazy(() => import("./pages/PaymentGuide"));
const GhostPassOwnerGuide = lazy(() => import("./pages/GhostPassOwnerGuide"));
const GhostwareQR = lazy(() => import("./pages/GhostwareQR"));
const DoorDevice = lazy(() => import("./pages/DoorDevice"));
const StadiumPricingModel = lazy(() => import("./pages/StadiumPricingModel"));
const TransportationPricingModel = lazy(() => import("./pages/TransportationPricingModel"));
const SalesTrainingFees = lazy(() => import("./pages/SalesTrainingFees"));
const RevenueEngine = lazy(() => import("./pages/RevenueEngine"));
const PilotReadiness = lazy(() => import("./pages/PilotReadiness"));
const ThinkTank = lazy(() => import("./pages/ThinkTank"));
const DealRoom = lazy(() => import("./pages/DealRoom"));
const AdminSecurityPositioning = lazy(() => import("./pages/AdminSecurityPositioning"));
const SenateAutopilotDocs = lazy(() => import("./pages/SenateAutopilotDocs"));
const SenateOrchestratorSpec = lazy(() => import("./pages/SenateOrchestratorSpec"));
const SynthInternalComplianceRoadmap = lazy(() => import("./pages/SynthInternalComplianceRoadmap"));
const SynthInternalDataLifecycle = lazy(() => import("./pages/SynthInternalDataLifecycle"));
const SynthInternalThirdParty = lazy(() => import("./pages/SynthInternalThirdParty"));
const SynthInternalGhostToken = lazy(() => import("./pages/SynthInternalGhostToken"));
const DebateRoom = lazy(() => import("./pages/DebateRoom"));
const SynthSenateLab = lazy(() => import("./pages/SynthSenateLab"));
const DemoHub = lazy(() => import("./pages/DemoHub"));
const DemoRouter = lazy(() => import("./pages/DemoRouter"));
const DemoSenateQA = lazy(() => import("./pages/DemoSenateQA"));
const DemoMonitoring = lazy(() => import("./pages/DemoMonitoring"));
const DemoEnterpriseSandbox = lazy(() => import("./pages/DemoEnterpriseSandbox"));
const DemoAuditVerifier = lazy(() => import("./pages/DemoAuditVerifier"));
const DemoServiceNow = lazy(() => import("./pages/DemoServiceNow"));
const DemoUploadVerdict = lazy(() => import("./pages/DemoUploadVerdict"));
const DemoScaleConduit = lazy(() => import("./pages/DemoScaleConduit"));
const DemoOperatorCertification = lazy(() => import("./pages/DemoOperatorCertification"));
const OperationSF = lazy(() => import("./pages/OperationSF"));
const AgreementFlow = lazy(() => import("./pages/AgreementFlow"));
const AgreementSuccess = lazy(() => import("./pages/AgreementSuccess"));
const Careers = lazy(() => import("./pages/Careers"));
const Evolution2026PitchDeck = lazy(() => import("./pages/Evolution2026PitchDeck"));

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
              <ResponsiveHeader />
              <SynthButton variant="fab" />
              <ModeSwitcherFAB />
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
                  <Route path="/admin/documentation" element={<AgeGate><AdminDocumentation /></AgeGate>} />
                  <Route path="/admin/security-positioning" element={<AgeGate><AdminSecurityPositioning /></AgeGate>} />
                  <Route path="/synth-vault" element={<SynthVault />} />
                  <Route path="/synth" element={<AgeGate><Synth /></AgeGate>} />
                  <Route path="/synth/admin" element={<AgeGate><SynthAdmin /></AgeGate>} />
                  <Route path="/synth/console" element={<SynthConsole />} />
                  <Route path="/synth/senate" element={<SynthSenateDashboard />} />
                  <Route path="/synth/logs" element={<SynthLogs />} />
                  <Route path="/synth/docs" element={<SynthDocs />} />
                  <Route path="/synth/docs/senate-autopilot" element={<SenateAutopilotDocs />} />
                  <Route path="/synth/docs/senate-orchestrator-spec" element={<SenateOrchestratorSpec />} />
                  <Route path="/synth/policies" element={<SynthPolicies />} />
                  <Route path="/synth/methodology" element={<SynthMethodology />} />
                  <Route path="/synth/challenges" element={<SynthChallenges />} />
                  <Route path="/synth/accepted" element={<SynthAccepted />} />
                  <Route path="/synth/locked" element={<SynthLocked />} />
                  <Route path="/synth/dossier" element={<SynthDossier />} />
                  <Route path="/synth/intake" element={<SynthIntake />} />
                  <Route path="/synth/e2e-test" element={<SynthE2ETest />} />
                  <Route path="/synth/senate-lab" element={<SynthSenateLab />} />
                  <Route path="/debate-room" element={<DebateRoom />} />
                  <Route path="/demos" element={<DemoHub />} />
                  <Route path="/demos/router" element={<DemoRouter />} />
                  <Route path="/demos/senate-qa" element={<DemoSenateQA />} />
                  <Route path="/demos/monitoring" element={<DemoMonitoring />} />
                  <Route path="/demos/enterprise-sandbox" element={<DemoEnterpriseSandbox />} />
                  <Route path="/demos/audit-verifier" element={<DemoAuditVerifier />} />
                  <Route path="/demos/upload-verdict" element={<DemoUploadVerdict />} />
                  <Route path="/demos/scale-conduit" element={<DemoScaleConduit />} />
                  <Route path="/demos/operator-certification" element={<DemoOperatorCertification />} />
                  <Route path="/demos/servicenow" element={<DemoServiceNow />} />
                  
                  {/* DOCUMENTATION ROUTES */}
                  <Route path="/partner/help" element={<AgeGate><PartnerHelp /></AgeGate>} />
                  <Route path="/how-it-works" element={<AgeGate><HowItWorks /></AgeGate>} />
                  <Route path="/settings/payment-guide" element={<AgeGate><PaymentGuide /></AgeGate>} />
                  
                  {/* INVESTOR ROUTES - Protected */}
                  <Route path="/investor-dashboard" element={<AgeGate><InvestorDashboard /></AgeGate>} />
                  <Route path="/investor-portal" element={<AgeGate><AccessGate accessType="investor"><InvestorPortal /></AccessGate></AgeGate>} />
                  <Route path="/investor" element={<AgeGate><AccessGate accessType="investor"><InvestorPortal /></AccessGate></AgeGate>} />
                  <Route path="/investors" element={<AgeGate><AccessGate accessType="investor"><InvestorPortal /></AccessGate></AgeGate>} />
                  <Route path="/pitch-deck" element={<AccessGate accessType="investor"><PitchDeck /></AccessGate>} />
                  <Route path="/pitchdeck" element={<AccessGate accessType="investor"><PitchDeck /></AccessGate>} />
                  <Route path="/evolution-2026" element={<AccessGate accessType="investor"><Evolution2026PitchDeck /></AccessGate>} />
                  <Route path="/2026" element={<AccessGate accessType="investor"><Evolution2026PitchDeck /></AccessGate>} />
                  <Route path="/partners" element={<AgeGate><AccessGate accessType="partner"><Partners /></AccessGate></AgeGate>} />
                  <Route path="/partners/verification" element={<AgeGate><AccessGate accessType="partner"><Partners /></AccessGate></AgeGate>} />
                  <Route path="/partners/integrated-health-compliance" element={<AgeGate><AccessGate accessType="partner"><IntegratedHealthCompliance /></AccessGate></AgeGate>} />
                  
                  {/* SPONSOR & LAB ROUTES */}
                  <Route path="/sponsors" element={<AgeGate><Sponsors /></AgeGate>} />
                  <Route path="/lab/dashboard" element={<AgeGate><LabDashboard /></AgeGate>} />
                  <Route path="/lab-portal" element={<AgeGate><LabPortal /></AgeGate>} />
                  
                  {/* LEGAL PAGES - Public */}
                  <Route path="/terms" element={<AgeGate><Terms /></AgeGate>} />
                  <Route path="/privacy" element={<AgeGate><Privacy /></AgeGate>} />
                  <Route path="/refund" element={<AgeGate><Refund /></AgeGate>} />
                  <Route path="/legal/patents" element={<AgeGate><Patents /></AgeGate>} />
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
                  <Route path="/wallet-funding-success" element={<AgeGate><WalletFundingSuccess /></AgeGate>} />
                  
                  {/* VENDOR & PORTAL ROUTES */}
                  <Route path="/compliance" element={<VenueCompliance />} />
                  <Route path="/sales-portal" element={<AgeGate><SalesPortal /></AgeGate>} />
                  <Route path="/partner-application" element={<AgeGate><PartnerApplication /></AgeGate>} />
                  <Route path="/competitive-scorecard" element={<AgeGate><CompetitiveScorecard /></AgeGate>} />
                  <Route path="/venue-portal" element={<AgeGate><AccessGate accessType="partner"><VenueOperatorPortal /></AccessGate></AgeGate>} />
                  <Route path="/vendor-pricing" element={<AgeGate><PlatformFeatures /></AgeGate>} />
                  <Route path="/pricing" element={<AgeGate><Pricing /></AgeGate>} />
                  <Route path="/vendor-portal" element={<VendorPortal />} />
                  <Route path="/vendor-portal/dashboard" element={<VendorDashboard />} />
                  <Route path="/staff/pos" element={<StaffPOS />} />
                  
                  {/* VENUE ROUTES */}
                  <Route path="/venues/:slug" element={<VenueLanding />} />
                  <Route path="/access-pending" element={<AccessPending />} />
                  <Route path="/access-approved" element={<AgeGate><AccessApproved /></AgeGate>} />
                  
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
                  <Route path="/device-pairing" element={<DevicePairing />} />
                  <Route path="/scanning-decisions" element={<ScanningDecisions />} />
                  <Route path="/troubleshooting" element={<Troubleshooting />} />
                  <Route path="/venue-onboarding" element={<VenueOnboarding />} />
                  <Route path="/driver-dashboard" element={<AgeGate><DriverDashboard /></AgeGate>} />
                  <Route path="/manager-admin" element={<ManagerAdmin />} />
                  <Route path="/staff/payment" element={<StaffPayment />} />
                  <Route path="/ghost-pass-owner-guide" element={<GhostPassOwnerGuide />} />
                  <Route path="/ghostware" element={<AgeGate><GhostwareQR /></AgeGate>} />
                  <Route path="/door" element={<DoorDevice />} />
                  <Route path="/pricing/stadiums" element={<StadiumPricingModel />} />
                  <Route path="/pricing/transportation" element={<TransportationPricingModel />} />
                  <Route path="/sales/fee-comparison" element={<SalesTrainingFees />} />
                  <Route path="/sales/revenue-engine" element={<RevenueEngine />} />
                  <Route path="/sales/pilot-readiness" element={<PilotReadiness />} />
                  <Route path="/think-tank" element={<ThinkTank />} />
                  <Route path="/deal-room" element={<DealRoom />} />
                  <Route path="/operation-sf" element={<OperationSF />} />
                  <Route path="/agreement/:tierId" element={<AgreementFlow />} />
                  <Route path="/agreement-success" element={<AgreementSuccess />} />
                  <Route path="/careers" element={<Careers />} />
                  
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