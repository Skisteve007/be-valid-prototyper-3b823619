import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Award, QrCode, UserCheck, Home, FlaskConical, ShieldCheck, ArrowUp } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useLongPressHome } from "@/hooks/useLongPressHome";
import ProfileTab from "@/components/dashboard/ProfileTab";
import CertificationsTab from "@/components/dashboard/CertificationsTab";
import QRCodeTab from "@/components/dashboard/QRCodeTab";
import PendingReferencesTab from "@/components/dashboard/PendingReferencesTab";
import { LabVerificationTab } from "@/components/dashboard/LabVerificationTab";
import { SafetyScreenTab } from "@/components/dashboard/SafetyScreenTab";
import { PrivateInbox } from "@/components/dashboard/PrivateInbox";
import { VenueCheckin } from "@/components/dashboard/VenueCheckin";
import GhostPassModal from "@/components/dashboard/GhostPassModal";
import logo from "@/assets/valid-logo.jpeg";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrRefreshKey, setQrRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("profile");
  const { isAdmin } = useIsAdmin();
  const longPressHandlers = useLongPressHome();
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const tabs = ["profile", "certifications", "qrcode", "references", "lab-verification", "safety-screen"];

  // Check if tab parameter is in URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Swipe gesture handlers for mobile navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    // Don't start swipe if touching interactive elements, static info cards, or dropdowns
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button, a, input, select, textarea, label, [role="button"], [role="checkbox"], [role="switch"], [role="combobox"], [role="listbox"], [role="option"], [data-radix-accordion-trigger], [data-radix-accordion-content], [data-radix-select-trigger], [data-radix-select-content], [data-radix-select-viewport], [data-radix-popper-content-wrapper], [data-static-info], [data-state="open"]');
    
    if (isInteractive) {
      touchStartX.current = 0;
      return;
    }
    
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === 0) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === 0) {
      return;
    }
    
    const swipeThreshold = 75; // minimum distance for swipe
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      const currentIndex = tabs.indexOf(activeTab);
      
      if (diff > 0 && currentIndex < tabs.length - 1) {
        // Swipe left - next tab
        setActiveTab(tabs[currentIndex + 1]);
      } else if (diff < 0 && currentIndex > 0) {
        // Swipe right - previous tab
        setActiveTab(tabs[currentIndex - 1]);
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleProfileUpdate = () => {
    // Increment the key to force QR Code tab to refresh
    console.log("Dashboard: Refreshing QR code tab");
    setQrRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <img src={logo} alt="Clean Check" className="h-24 w-auto mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen overflow-x-hidden w-full max-w-full relative" style={{ background: 'linear-gradient(135deg, #0A0E1A 0%, #120a21 50%, #0A0E1A 100%)' }}>
      {/* Plasma/Nebula Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-emerald-500/8 rounded-full blur-[90px] animate-pulse" style={{ animationDuration: '7s', animationDelay: '1s' }} />
      </div>

      {/* Floating Glass Capsule Header */}
      <header className="relative z-10 mx-4 md:mx-8 mt-4">
        <div className="backdrop-blur-xl bg-white/5 border border-[#00FFC2]/30 rounded-full px-6 py-4 shadow-[0_0_30px_rgba(0,255,194,0.15)]">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Spacer for desktop centering */}
            <div className="hidden md:block md:flex-1"></div>
            
            {/* Logo - centered on mobile and desktop */}
            <div className="flex justify-center">
              <div 
                className="relative cursor-pointer"
                {...longPressHandlers}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#00FFC2]/40 via-teal-500/40 to-cyan-500/40 blur-3xl rounded-full scale-150"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00FFC2]/30 via-teal-400/30 to-cyan-400/30 blur-2xl rounded-full scale-125 animate-pulse"></div>
                <img src={logo} alt="Clean Check" className="relative h-16 md:h-20 w-auto select-none drop-shadow-[0_0_15px_rgba(0,255,194,0.5)]" draggable={false} />
              </div>
            </div>
            
            {/* Buttons - centered row on mobile, right-aligned on desktop */}
            <div className="flex justify-center md:justify-end gap-2 flex-wrap md:flex-1 items-center">
              <Button 
                onClick={() => setActiveTab("qrcode")}
                className="relative shadow-[0_0_20px_rgba(0,255,194,0.5)] hover:shadow-[0_0_30px_rgba(0,255,194,0.7)] border border-[#00FFC2]/60 bg-[#00FFC2]/10 text-[#00FFC2] hover:text-[#00FFC2] hover:bg-[#00FFC2]/20 font-bold min-h-[44px] px-5 touch-manipulation rounded-full backdrop-blur-sm"
              >
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
              <ThemeToggle />
              <Button 
                onClick={handleLogout} 
                className="relative shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] border border-pink-500/60 bg-pink-500/10 text-pink-400 hover:text-pink-300 hover:bg-pink-500/20 font-bold min-h-[44px] px-5 touch-manipulation rounded-full backdrop-blur-sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-4 md:py-8">
        {/* Main Dashboard Card - Dark Glass Panel */}
        <div className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="p-6 md:p-8 border-b border-white/10">
            <h1 className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#00FFC2] to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,194,0.5)]">Dashboard</span>
            </h1>
            <p className="text-[#E0E0FF]/70 text-sm md:text-base italic mt-1">
              Manage your profile, documents, and QR code
            </p>
          </div>
          <div 
            className="p-4 md:p-6"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Private Inbox - Privacy Firewall for locked lab results */}
            <PrivateInbox userId={user.id} onStatusUpdate={handleProfileUpdate} />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="relative mb-6">
                <div className="overflow-x-auto overflow-y-hidden -mx-2 px-2 pb-3 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#00FFC2]/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-[#00FFC2]/60">
                  <TabsList className="relative inline-flex bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-1.5 gap-1.5 w-auto min-w-full">
                    <TabsTrigger 
                      value="profile" 
                      className="py-2.5 px-4 rounded-lg transition-all text-[#E0E0FF]/70 data-[state=active]:bg-[#00FFC2]/20 data-[state=active]:text-[#00FFC2] data-[state=active]:shadow-[0_0_15px_rgba(0,255,194,0.3)] data-[state=active]:border data-[state=active]:border-[#00FFC2]/40 touch-manipulation whitespace-nowrap"
                    >
                      <UserIcon className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="certifications"
                      className="py-2.5 px-4 rounded-lg transition-all text-[#E0E0FF]/70 data-[state=active]:bg-[#00FFC2]/20 data-[state=active]:text-[#00FFC2] data-[state=active]:shadow-[0_0_15px_rgba(0,255,194,0.3)] data-[state=active]:border data-[state=active]:border-[#00FFC2]/40 touch-manipulation whitespace-nowrap"
                    >
                      <Award className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">Documents<ArrowUp className="h-4 w-4 inline-block -mt-0.5" /></span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="qrcode"
                      className="py-2.5 px-4 rounded-lg transition-all text-[#E0E0FF]/70 data-[state=active]:bg-[#00FFC2]/20 data-[state=active]:text-[#00FFC2] data-[state=active]:shadow-[0_0_15px_rgba(0,255,194,0.3)] data-[state=active]:border data-[state=active]:border-[#00FFC2]/40 touch-manipulation whitespace-nowrap"
                    >
                      <QrCode className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">QR Code</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="references"
                      className="py-2.5 px-4 rounded-lg transition-all text-[#E0E0FF]/70 data-[state=active]:bg-[#00FFC2]/20 data-[state=active]:text-[#00FFC2] data-[state=active]:shadow-[0_0_15px_rgba(0,255,194,0.3)] data-[state=active]:border data-[state=active]:border-[#00FFC2]/40 touch-manipulation whitespace-nowrap"
                    >
                      <UserCheck className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">References</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="lab-verification"
                      className="py-2.5 px-4 rounded-lg transition-all text-[#E0E0FF]/70 data-[state=active]:bg-[#00FFC2]/20 data-[state=active]:text-[#00FFC2] data-[state=active]:shadow-[0_0_15px_rgba(0,255,194,0.3)] data-[state=active]:border data-[state=active]:border-[#00FFC2]/40 touch-manipulation whitespace-nowrap"
                    >
                      <FlaskConical className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">Get Health Lab Certified</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="safety-screen"
                      className="py-2.5 px-4 rounded-lg transition-all text-[#E0E0FF]/70 data-[state=active]:bg-[#00FFC2]/20 data-[state=active]:text-[#00FFC2] data-[state=active]:shadow-[0_0_15px_rgba(0,255,194,0.3)] data-[state=active]:border data-[state=active]:border-[#00FFC2]/40 touch-manipulation whitespace-nowrap"
                    >
                      <ShieldCheck className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">Get Toxicology Lab Certified</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              {/* Venue Check-in - Below tabs, visible on all tabs */}
              <VenueCheckin userId={user.id} />
              
              {/* Tab Content with Dark Glass Styling */}
              <div className="[&_.card]:backdrop-blur-xl [&_.card]:bg-black/40 [&_.card]:border-white/10 [&_.card]:shadow-[0_0_30px_rgba(0,0,0,0.3)] [&_h3]:text-[#E0E0FF] [&_label]:text-[#E0E0FF]/80 [&_p]:text-[#E0E0FF]/70 [&_.text-muted-foreground]:text-[#E0E0FF]/50">
                <TabsContent value="profile">
                  <ProfileTab userId={user.id} onUpdate={handleProfileUpdate} />
                </TabsContent>
                
                <TabsContent value="certifications">
                  <CertificationsTab userId={user.id} />
                </TabsContent>
                
                <TabsContent value="qrcode">
                  <QRCodeTab key={qrRefreshKey} userId={user.id} />
                </TabsContent>
                
                <TabsContent value="references">
                  <PendingReferencesTab userId={user.id} />
                </TabsContent>
                
                <TabsContent value="lab-verification">
                  <LabVerificationTab userId={user.id} />
                </TabsContent>
                
                <TabsContent value="safety-screen">
                  <SafetyScreenTab userId={user.id} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Floating Back to Home Button */}
      <Button
        onClick={() => navigate("/")}
        className="fixed bottom-4 left-4 md:bottom-8 md:left-8 h-10 w-10 md:h-11 md:w-11 rounded-full bg-[#00FFC2]/20 hover:bg-[#00FFC2]/30 border border-[#00FFC2]/40 shadow-[0_0_20px_rgba(0,255,194,0.3)] hover:shadow-[0_0_30px_rgba(0,255,194,0.5)] backdrop-blur-sm transition-all duration-300 hover:scale-105 z-50"
        title="Back to Home"
      >
        <Home className="h-4 w-4 md:h-5 md:w-5 text-[#00FFC2]" />
      </Button>

      {/* Ghost Pass Floating Action Button & Modal */}
      <GhostPassModal userId={user.id} balance={150.00} spentAtVenue={0} />
    </div>
  );
};

export default Dashboard;