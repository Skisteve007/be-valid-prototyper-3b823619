import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Award, QrCode, UserCheck, Home, FlaskConical, ShieldCheck, ArrowUp } from "lucide-react";
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
import logo from "@/assets/clean-check-logo.png";

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
    const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], [role="combobox"], [role="listbox"], [role="option"], [data-radix-accordion-trigger], [data-radix-accordion-content], [data-radix-select-trigger], [data-radix-select-content], [data-radix-select-viewport], [data-radix-popper-content-wrapper], [data-static-info], [data-state="open"]');
    
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
    <div className="min-h-screen bg-background overflow-x-hidden w-full max-w-full">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Spacer for desktop centering */}
            <div className="hidden md:block md:flex-1"></div>
            
            {/* Logo - centered on mobile and desktop */}
            <div className="flex justify-center">
              <div 
                className="relative cursor-pointer"
                {...longPressHandlers}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 via-pink-500/60 to-blue-500/60 blur-3xl rounded-full scale-150"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-pink-400/40 to-blue-400/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
                <img src={logo} alt="Clean Check" className="relative h-20 md:h-28 w-auto select-none" draggable={false} />
              </div>
            </div>
            
            {/* Buttons - centered row on mobile, right-aligned on desktop */}
            <div className="flex justify-center md:justify-end gap-2 flex-wrap md:flex-1">
              <Button 
                onClick={() => setActiveTab("qrcode")}
                className="relative shadow-[0_0_30px_rgba(249,115,22,0.7)] hover:shadow-[0_0_40px_rgba(249,115,22,0.9)] border-2 border-orange-600/60 bg-orange-600/15 text-orange-500 hover:text-orange-400 animate-pulse font-bold min-h-[48px] px-6 touch-manipulation"
              >
                <div className="absolute inset-0 bg-orange-600/25 blur-lg rounded-md -z-10 animate-pulse"></div>
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
              <Button 
                onClick={handleLogout} 
                className="relative shadow-[0_0_30px_rgba(236,72,153,0.7)] hover:shadow-[0_0_40px_rgba(236,72,153,0.9)] border-2 border-pink-500/60 bg-pink-500/15 text-pink-500 hover:text-pink-400 font-bold min-h-[48px] px-6 touch-manipulation"
              >
                <div className="absolute inset-0 bg-pink-500/25 blur-lg rounded-md -z-10"></div>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl md:text-3xl">
              <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Dashboard</span>
            </CardTitle>
            <CardDescription className="text-sm md:text-base italic">
              Manage your profile, documents, and QR code
            </CardDescription>
          </CardHeader>
          <CardContent 
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Private Inbox - Privacy Firewall for locked lab results */}
            <PrivateInbox userId={user.id} onStatusUpdate={handleProfileUpdate} />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/10 blur-xl pointer-events-none"></div>
                <div className="overflow-x-auto overflow-y-hidden -mx-2 px-2 pb-3 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-muted/30 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary/40 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-primary/60">
                  <TabsList className="relative inline-flex bg-muted/50 backdrop-blur-sm border border-border rounded-lg p-1.5 gap-1.5 w-auto min-w-full">
                    <TabsTrigger 
                      value="profile" 
                      className="py-2.5 px-4 rounded-md transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md touch-manipulation whitespace-nowrap"
                    >
                      <UserIcon className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="certifications"
                      className="py-2.5 px-4 rounded-md transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md touch-manipulation whitespace-nowrap"
                    >
                      <Award className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">Document<ArrowUp className="h-4 w-4 inline-block -mt-0.5" /></span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="qrcode"
                      className="py-2.5 px-4 rounded-md transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md touch-manipulation whitespace-nowrap"
                    >
                      <QrCode className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">QR Code</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="references"
                      className="py-2.5 px-4 rounded-md transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md touch-manipulation whitespace-nowrap"
                    >
                      <UserCheck className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">References</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="lab-verification"
                      className="py-2.5 px-4 rounded-md transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md touch-manipulation whitespace-nowrap"
                    >
                      <FlaskConical className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">Get Health Lab Certified</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="safety-screen"
                      className="py-2.5 px-4 rounded-md transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md touch-manipulation whitespace-nowrap"
                    >
                      <ShieldCheck className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">Get Toxicology Lab Certified</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              {/* Venue Check-in - Below tabs, visible on all tabs */}
              <VenueCheckin userId={user.id} />
              
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
            </Tabs>
          </CardContent>
        </Card>
      </main>

      {/* Floating Back to Home Button */}
      <Button
        onClick={() => navigate("/")}
        className="fixed bottom-4 left-4 md:bottom-8 md:left-8 h-10 w-10 md:h-11 md:w-11 rounded-full bg-gradient-to-br from-blue-400/60 to-cyan-400/60 hover:from-blue-500/70 hover:to-cyan-500/70 shadow-lg shadow-blue-400/20 hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 z-50 opacity-70 hover:opacity-90"
        title="Back to Home"
      >
        <Home className="h-4 w-4 md:h-5 md:w-5 text-white" />
      </Button>
    </div>
  );
};

export default Dashboard;