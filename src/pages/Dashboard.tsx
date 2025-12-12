import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Upload, Home, FlaskConical, ShieldCheck, Share2, Fingerprint, Loader2, CheckCircle, Save } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLongPressHome } from "@/hooks/useLongPressHome";
import ProfileTab, { ProfileTabRef } from "@/components/dashboard/ProfileTab";
import CertificationsTab from "@/components/dashboard/CertificationsTab";

import { LabVerificationTab } from "@/components/dashboard/LabVerificationTab";
import { SafetyScreenTab } from "@/components/dashboard/SafetyScreenTab";
import { PrivateInbox } from "@/components/dashboard/PrivateInbox";
import { VenueCheckin } from "@/components/dashboard/VenueCheckin";
import GhostPassModal from "@/components/dashboard/GhostPassModal";
import ShareProfileModal from "@/components/dashboard/ShareProfileModal";
import MySignalSection from "@/components/dashboard/profile/MySignalSection";
import LocationPulseSection from "@/components/dashboard/profile/LocationPulseSection";
import { VerifyIDTab } from "@/components/dashboard/VerifyIDTab";
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
  const [profileSaveState, setProfileSaveState] = useState({ hasChanges: false, saving: false, saveSuccess: false });
  const longPressHandlers = useLongPressHome();
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const profileTabRef = useRef<ProfileTabRef>(null);

  const tabs = ["profile", "certifications", "lab-verification", "safety-screen", "verify-id"];

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
        <div className="backdrop-blur-xl bg-white/5 border border-[#00FFFF]/30 rounded-full px-3 md:px-6 py-3 md:py-4 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Left side - Save button (desktop only) */}
            <div className="flex-shrink-0 hidden md:block">
              {activeTab === "profile" && (
                <Button
                  type="button"
                  onClick={() => profileTabRef.current?.triggerSave()}
                  disabled={profileSaveState.saving}
                  size="sm"
                  className={`shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-500/60 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 font-bold min-h-[44px] px-5 rounded-full transition-all duration-300 ${
                    profileSaveState.saveSuccess
                      ? 'shadow-[0_0_20px_rgba(34,197,94,0.5)] border-green-500/60 bg-green-500/10 text-green-400 hover:bg-green-500/20'
                      : profileSaveState.hasChanges && !profileSaveState.saving
                        ? 'shadow-[0_0_25px_rgba(236,72,153,0.7)] animate-pulse'
                        : ''
                  }`}
                  style={{ animationDuration: '2s' }}
                >
                  {profileSaveState.saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : profileSaveState.saveSuccess ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span className="ml-2">
                    {profileSaveState.saving ? "Saving..." : profileSaveState.saveSuccess ? "Saved!" : `Save${profileSaveState.hasChanges ? " •" : ""}`}
                  </span>
                </Button>
              )}
            </div>
            
            {/* Center - Video logo */}
            <div className="flex justify-center flex-shrink-0">
              <div className="relative cursor-pointer" {...longPressHandlers}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/40 via-teal-500/40 to-cyan-500/40 blur-3xl rounded-full scale-150"></div>
                <div className="relative h-20 md:h-32 aspect-[4/5] rounded-xl overflow-hidden border border-cyan-400/40 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                  <video 
                    src="/valid_portal.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </div>
            
            {/* Right side - Share, Theme, Logout (desktop) */}
            <div className="flex-shrink-0 flex gap-1 md:gap-2 items-center">
              <Button 
                onClick={() => setShowShareModal(true)}
                size="sm"
                className="shadow-[0_0_20px_rgba(0,255,255,0.5)] border border-[#00FFFF]/60 bg-[#00FFFF]/10 text-[#00FFFF] hover:bg-[#00FFFF]/20 font-bold min-h-[36px] md:min-h-[44px] px-2 md:px-5 rounded-full"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Share</span>
              </Button>
              <ThemeToggle />
              {/* Logout - desktop only in header */}
              <Button 
                onClick={handleLogout}
                size="sm" 
                className="hidden md:flex shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-500/60 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 font-bold min-h-[44px] px-5 rounded-full"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile: Save & Logout buttons below header */}
        <div className="flex md:hidden gap-2 mt-3 justify-center">
          {activeTab === "profile" && (
            <Button
              type="button"
              onClick={() => profileTabRef.current?.triggerSave()}
              disabled={profileSaveState.saving}
              size="sm"
              className={`flex-1 max-w-[140px] shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-500/60 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 font-bold min-h-[40px] px-3 rounded-full transition-all duration-300 ${
                profileSaveState.saveSuccess
                  ? 'shadow-[0_0_20px_rgba(34,197,94,0.5)] border-green-500/60 bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  : profileSaveState.hasChanges && !profileSaveState.saving
                    ? 'shadow-[0_0_25px_rgba(236,72,153,0.7)] animate-pulse'
                    : ''
              }`}
              style={{ animationDuration: '2s' }}
            >
              {profileSaveState.saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : profileSaveState.saveSuccess ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span className="ml-1.5 text-xs">
                {profileSaveState.saving ? "Saving" : profileSaveState.saveSuccess ? "Saved" : "Save"}
              </span>
            </Button>
          )}
          <Button 
            onClick={handleLogout}
            size="sm" 
            className="flex-1 max-w-[140px] shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-500/60 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 font-bold min-h-[40px] px-3 rounded-full"
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-1.5 text-xs">Logout</span>
          </Button>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-4 md:py-8">
        <div className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Dashboard Title */}
          <div className="p-6 md:p-8 border-b border-white/10">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                <span className="bg-gradient-to-r from-[#00FFFF] to-cyan-400 bg-clip-text text-transparent">Dashboard</span>
              </h1>
              <p className="text-[#E0E0E0]/70 text-sm md:text-base mt-1">
                Manage your profile
              </p>
            </div>
            
            {/* Location Pulse - Separate Pill */}
            <div className="mt-4">
              <LocationPulseSection />
            </div>
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
                  <div className="flex items-center gap-2 min-w-full">
                    <TabsList className="inline-flex bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-1.5 gap-1.5 flex-1">
                      <TabsTrigger 
                        value="profile" 
                        className="py-2.5 px-4 rounded-lg text-[#E0E0E0]/70 data-[state=active]:bg-[#00FFFF]/20 data-[state=active]:text-[#00FFFF] data-[state=active]:shadow-[0_0_15px_rgba(0,255,255,0.3)] whitespace-nowrap"
                      >
                        <UserIcon className="h-4 w-4 mr-1.5" />
                        <span className="text-sm">Profile</span>
                      </TabsTrigger>
                      <button 
                        type="button"
                        onClick={() => {
                          const trustCenterEl = document.getElementById('trust-center-section');
                          if (trustCenterEl) {
                            trustCenterEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className="py-2.5 px-4 rounded-lg text-[#E0E0E0]/70 hover:bg-[#00FFFF]/10 hover:text-[#00FFFF] transition-colors whitespace-nowrap flex items-center"
                      >
                        <Upload className="h-4 w-4 mr-1.5" />
                        <span className="text-sm">Trust Center</span>
                      </button>
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
                        className="py-2.5 px-4 rounded-lg text-[#E0E0E0]/70 data-[state=active]:bg-[#00FFFF]/20 data-[state=active]:text-[#00FFFF] data-[state=active]:shadow-[0_0_15px_rgba(0,255,255,0.3)] whitespace-nowrap"
                      >
                        <Fingerprint className="h-4 w-4 mr-1.5" />
                        <span className="text-sm">Verify ID</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="[&_.card]:backdrop-blur-xl [&_.card]:bg-black/40 [&_.card]:border-white/10 [&_h3]:text-[#E0E0E0] [&_label]:text-[#E0E0E0]/80 [&_p]:text-[#E0E0E0]/70">
                <TabsContent value="profile">
                  {/* Venue Check-in - ONLY visible on Profile tab */}
                  <VenueCheckin userId={user.id} />
                  <ProfileTab 
                    ref={profileTabRef}
                    userId={user.id} 
                    onUpdate={handleProfileUpdate}
                    onSaveStateChange={setProfileSaveState}
                  />
                </TabsContent>
                
                
                
                <TabsContent value="lab-verification">
                  <LabVerificationTab userId={user.id} />
                </TabsContent>
                
                <TabsContent value="safety-screen">
                  <SafetyScreenTab userId={user.id} />
                </TabsContent>
                
                <TabsContent value="verify-id">
                  <VerifyIDTab userId={user.id} />
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