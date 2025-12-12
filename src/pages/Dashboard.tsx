import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Upload, QrCode, Home, FlaskConical, ShieldCheck, Share2, Fingerprint } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLongPressHome } from "@/hooks/useLongPressHome";
import ProfileTab from "@/components/dashboard/ProfileTab";
import CertificationsTab from "@/components/dashboard/CertificationsTab";
import QRCodeTab from "@/components/dashboard/QRCodeTab";
import { LabVerificationTab } from "@/components/dashboard/LabVerificationTab";
import { SafetyScreenTab } from "@/components/dashboard/SafetyScreenTab";
import { PrivateInbox } from "@/components/dashboard/PrivateInbox";
import { VenueCheckin } from "@/components/dashboard/VenueCheckin";
import GhostPassModal from "@/components/dashboard/GhostPassModal";
import ShareProfileModal from "@/components/dashboard/ShareProfileModal";
import MySignalSection from "@/components/dashboard/profile/MySignalSection";
import logo from "@/assets/valid-logo.jpeg";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrRefreshKey, setQrRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState("profile");
  const [showShareModal, setShowShareModal] = useState(false);
  const [vibeMetadata, setVibeMetadata] = useState<Record<string, any>>({});
  const [statusColor, setStatusColor] = useState<string>("green");
  const longPressHandlers = useLongPressHome();
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const tabs = ["profile", "certifications", "qrcode", "lab-verification", "safety-screen", "verify-id"];

  // Check if tab parameter is in URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    const isInteractive = target.closest('button, a, input, select, textarea, label, [role="button"], [role="checkbox"], [role="switch"], [data-radix-select-trigger]');
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
    if (touchStartX.current === 0) return;
    
    const swipeThreshold = 75;
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      const currentIndex = tabs.indexOf(activeTab);
      if (diff > 0 && currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
      } else if (diff < 0 && currentIndex > 0) {
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
    setQrRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <img src={logo} alt="Valid" className="h-24 w-auto mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen overflow-x-hidden w-full max-w-full relative" style={{ background: 'linear-gradient(135deg, #0A0E1A 0%, #120a21 50%, #0A0E1A 100%)' }}>
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-4 md:mx-8 mt-4">
        <div className="backdrop-blur-xl bg-white/5 border border-[#00FFFF]/30 rounded-full px-6 py-4 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="hidden md:block md:flex-1"></div>
            
            <div className="flex justify-center">
              <div className="relative cursor-pointer" {...longPressHandlers}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/40 via-teal-500/40 to-cyan-500/40 blur-3xl rounded-full scale-150"></div>
                <img src={logo} alt="Valid" className="relative h-16 md:h-20 w-auto select-none drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" draggable={false} />
              </div>
            </div>
            
            <div className="flex justify-center md:justify-end gap-2 flex-wrap md:flex-1 items-center">
              <Button 
                onClick={() => setShowShareModal(true)}
                className="shadow-[0_0_20px_rgba(0,255,255,0.5)] border border-[#00FFFF]/60 bg-[#00FFFF]/10 text-[#00FFFF] hover:bg-[#00FFFF]/20 font-bold min-h-[44px] px-5 rounded-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <ThemeToggle />
              <Button 
                onClick={handleLogout} 
                className="shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-500/60 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 font-bold min-h-[44px] px-5 rounded-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-4 md:py-8">
        <div className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Dashboard Title */}
          <div className="p-6 md:p-8 border-b border-white/10">
            <h1 className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#00FFFF] to-cyan-400 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-[#E0E0E0]/70 text-sm md:text-base mt-1">
              Manage your profile, documents, and QR code
            </p>
          </div>
          
          {/* My Signal Section - Top Priority */}
          <div className="p-4 md:p-6 border-b border-white/10">
            <div className="rounded-xl border-2 border-cyan-400/60 p-4 animate-pulse shadow-[0_0_20px_rgba(0,255,255,0.3)] bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5" style={{ animation: 'signalPulse 2s ease-in-out infinite' }}>
              <style>{`
                @keyframes signalPulse {
                  0%, 100% { 
                    border-color: rgba(0, 255, 255, 0.3);
                    box-shadow: 0 0 10px rgba(0, 255, 255, 0.1);
                  }
                  50% { 
                    border-color: rgba(0, 255, 255, 0.8);
                    box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
                  }
                }
              `}</style>
              <MySignalSection
                vibeMetadata={vibeMetadata}
                onVibeMetadataChange={setVibeMetadata}
                onStatusColorChange={setStatusColor}
              />
            </div>
          </div>

          {/* Main Content */}
          <div 
            className="p-4 md:p-6"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Private Inbox */}
            <PrivateInbox userId={user.id} onStatusUpdate={handleProfileUpdate} />
            
            {/* Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="relative mb-6">
                <div className="overflow-x-auto overflow-y-hidden -mx-2 px-2 pb-3">
                  <TabsList className="inline-flex bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-1.5 gap-1.5 w-auto min-w-full">
                    <TabsTrigger 
                      value="profile" 
                      className="py-2.5 px-4 rounded-lg text-[#E0E0E0]/70 data-[state=active]:bg-[#00FFFF]/20 data-[state=active]:text-[#00FFFF] data-[state=active]:shadow-[0_0_15px_rgba(0,255,255,0.3)] whitespace-nowrap"
                    >
                      <UserIcon className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">Profile</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="certifications"
                      className="py-2.5 px-4 rounded-lg text-[#E0E0E0]/70 data-[state=active]:bg-[#00FFFF]/20 data-[state=active]:text-[#00FFFF] data-[state=active]:shadow-[0_0_15px_rgba(0,255,255,0.3)] whitespace-nowrap"
                    >
                      <Upload className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">Trust Center</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="qrcode"
                      className="py-2.5 px-4 rounded-lg text-[#E0E0E0]/70 data-[state=active]:bg-[#00FFFF]/20 data-[state=active]:text-[#00FFFF] data-[state=active]:shadow-[0_0_15px_rgba(0,255,255,0.3)] whitespace-nowrap"
                    >
                      <QrCode className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">QR Code</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="lab-verification"
                      className="py-2.5 px-4 rounded-lg text-[#E0E0E0]/70 data-[state=active]:bg-[#00FFFF]/20 data-[state=active]:text-[#00FFFF] data-[state=active]:shadow-[0_0_15px_rgba(0,255,255,0.3)] whitespace-nowrap"
                    >
                      <FlaskConical className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">Health Lab</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="safety-screen"
                      className="py-2.5 px-4 rounded-lg text-[#E0E0E0]/70 data-[state=active]:bg-[#00FFFF]/20 data-[state=active]:text-[#00FFFF] data-[state=active]:shadow-[0_0_15px_rgba(0,255,255,0.3)] whitespace-nowrap"
                    >
                      <ShieldCheck className="h-4 w-4 mr-1.5" />
                      <span className="text-sm">Toxicology</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="verify-id"
                      className="py-2.5 px-4 rounded-lg text-[#E0E0E0]/70 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400 data-[state=active]:shadow-[0_0_15px_rgba(245,158,11,0.3)] whitespace-nowrap border border-amber-500/30 bg-amber-500/5 animate-pulse"
                      style={{ animationDuration: '3s' }}
                    >
                      <Fingerprint className="h-4 w-4 mr-1.5" />
                      <span className="text-sm font-bold">VERIFY ID</span>
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              {/* Venue Check-in */}
              <VenueCheckin userId={user.id} />
              
              {/* Tab Content */}
              <div className="[&_.card]:backdrop-blur-xl [&_.card]:bg-black/40 [&_.card]:border-white/10 [&_h3]:text-[#E0E0E0] [&_label]:text-[#E0E0E0]/80 [&_p]:text-[#E0E0E0]/70">
                <TabsContent value="profile">
                  <ProfileTab userId={user.id} onUpdate={handleProfileUpdate} />
                </TabsContent>
                
                <TabsContent value="certifications">
                  <CertificationsTab userId={user.id} />
                </TabsContent>
                
                <TabsContent value="qrcode">
                  <QRCodeTab key={qrRefreshKey} userId={user.id} />
                </TabsContent>
                
                <TabsContent value="lab-verification">
                  <LabVerificationTab userId={user.id} />
                </TabsContent>
                
                <TabsContent value="safety-screen">
                  <SafetyScreenTab userId={user.id} />
                </TabsContent>
                
                <TabsContent value="verify-id">
                  <div className="text-center py-12">
                    <div className="mx-auto max-w-lg">
                      <div className="h-20 w-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                        <Fingerprint className="h-10 w-10 text-amber-400" />
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-3">Official Identity Verification</h2>
                      <p className="text-[#E0E0E0]/70 mb-6 leading-relaxed">
                        Anchor your identity with a government-issued ID (Driver's License or Passport). 
                        Your verification creates an <span className="text-amber-400 font-semibold">Encrypted Verified Hash</span>—we never store raw documents.
                      </p>
                      <div className="bg-black/40 border border-white/10 rounded-xl p-4 mb-6 text-left">
                        <h3 className="font-bold text-white mb-2 text-sm">Have Ready:</h3>
                        <ul className="text-sm text-[#E0E0E0]/70 space-y-1">
                          <li>✓ Valid Driver's License or Passport</li>
                          <li>✓ Good lighting for document capture</li>
                          <li>✓ Camera access for liveness check</li>
                        </ul>
                      </div>
                      <Button
                        onClick={() => navigate("/idv-verification")}
                        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-3 shadow-[0_0_25px_rgba(245,158,11,0.4)] rounded-xl"
                      >
                        <Fingerprint className="h-5 w-5 mr-2" />
                        START CERTIFICATION
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Floating Home Button */}
      <Button
        onClick={() => navigate("/")}
        className="fixed bottom-4 left-4 md:bottom-8 md:left-8 h-10 w-10 rounded-full bg-[#00FFFF]/20 hover:bg-[#00FFFF]/30 border border-[#00FFFF]/40 shadow-[0_0_20px_rgba(0,255,255,0.3)] z-50"
        title="Back to Home"
      >
        <Home className="h-4 w-4 text-[#00FFFF]" />
      </Button>

      <GhostPassModal userId={user.id} />

      <ShareProfileModal 
        open={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        userId={user.id} 
      />
    </div>
  );
};

export default Dashboard;