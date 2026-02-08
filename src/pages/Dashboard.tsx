import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, Upload, Home, FlaskConical, ShieldCheck, Share2, Fingerprint, Loader2, CheckCircle, Save, Ghost, ArrowLeft, MessageCircle, Scale, Wallet, Eye } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLongPressHome } from "@/hooks/useLongPressHome";
import ProfileTab, { ProfileTabRef } from "@/components/dashboard/ProfileTab";

import { LabVerificationTab } from "@/components/dashboard/LabVerificationTab";
import { SafetyScreenTab } from "@/components/dashboard/SafetyScreenTab";
import { PrivateInbox } from "@/components/dashboard/PrivateInbox";
import { VenueCheckin } from "@/components/dashboard/VenueCheckin";
import GhostPassModal from "@/components/dashboard/GhostPassModal";
import ShareProfileModal from "@/components/dashboard/ShareProfileModal";
import MySignalSection from "@/components/dashboard/profile/MySignalSection";
import LocationPulseSection from "@/components/dashboard/profile/LocationPulseSection";
import { VerifyIDTab } from "@/components/dashboard/VerifyIDTab";
import { WalletTab } from "@/components/dashboard/WalletTab";
import logo from "@/assets/valid-logo.jpeg";
import { BetaBanner } from "@/components/BetaBanner";
import { BetaMemberBadge } from "@/components/BetaMemberBadge";
import { isBetaPeriodActive } from "@/config/betaConfig";
import { BountyMission } from "@/components/gamification";
import { PrivacyBadgeB2C } from "@/components/privacy";
import { RatifyPill, RatifyPanel } from "@/components/ratify";
import { useRatifyContext } from "@/contexts/RatifyContext";
import { HumanVettingPill, HumanVettingPanel } from "@/components/human-vetting";


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
  const [showGhostPass, setShowGhostPass] = useState(false);
  const [showHumanVetting, setShowHumanVetting] = useState(false);
  const [profileSaveState, setProfileSaveState] = useState({ hasChanges: false, saving: false, saveSuccess: false });
  const longPressHandlers = useLongPressHome();
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const profileTabRef = useRef<ProfileTabRef>(null);
  
  // Ratify context for AI-powered fact checking
  const {
    corrections,
    pendingCorrections,
    hasCorrections,
    hasPendingCorrections,
    activeCorrection,
    setActiveCorrection,
    ratifyCorrection,
    ratifyAll,
    dismissCorrection,
    isPanelOpen,
    openPanel,
    closePanel,
  } = useRatifyContext();

  const tabs = ["profile", "wallet", "senate", "lab-verification", "safety-screen", "verify-id"];

  // Check if tab parameter is in URL
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Swipe gesture handlers - only for tab content area, not for tab navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    // Don't interfere with interactive elements or scroll containers
    const isInteractive = target.closest('button, a, input, select, textarea, label, [role="button"], [role="checkbox"], [role="switch"], [data-radix-select-trigger], .overflow-x-auto, [role="tablist"]');
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
    let isMounted = true;
    
    // Safety timeout - stop loading after 3 seconds no matter what
    const safetyTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Dashboard: Safety timeout triggered');
        setLoading(false);
        navigate("/auth");
      }
    }, 3000);

    const checkEmailVerification = async (userId: string) => {
      try {
        // Check if user is an administrator - admins bypass email verification
        const { data: roleData } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "administrator")
          .maybeSingle();
        
        if (roleData) {
          // Admin users bypass email verification
          return true;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("email_verified")
          .eq("user_id", userId)
          .single();
        
        if (!profile?.email_verified) {
          toast.error("Please verify your email before accessing the dashboard.");
          navigate("/auth?mode=login");
          return false;
        }
        return true;
      } catch (error) {
        console.error('Email verification check error:', error);
        navigate("/auth?mode=login");
        return false;
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        setSession(session);
        setUser(session?.user ?? null);
        if (!session) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!isMounted) return;
      clearTimeout(safetyTimeout);
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      } else {
        await checkEmailVerification(session.user.id);
      }
      setLoading(false);
    }).catch((error) => {
      console.error('getSession error:', error);
      if (isMounted) {
        clearTimeout(safetyTimeout);
        setLoading(false);
        navigate("/auth");
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
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
      <header className="relative z-10 mx-3 md:mx-8 mt-3 md:mt-4">
        <div className="backdrop-blur-xl bg-white/5 border border-[#00FFFF]/30 rounded-2xl md:rounded-full px-3 md:px-6 py-2.5 md:py-4 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
          <div className="flex items-center justify-between gap-2">
            {/* Left side - Back button */}
            <Button
              onClick={() => navigate("/")}
              size="sm"
              className="shrink-0 shadow-[0_0_20px_rgba(0,255,255,0.3)] border border-[#00FFFF]/40 bg-[#00FFFF]/10 text-[#00FFFF] hover:bg-[#00FFFF]/20 font-bold h-9 md:h-11 w-9 md:w-auto px-0 md:px-4 rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden md:inline ml-2">Home</span>
            </Button>
            
            {/* Center - Video logo */}
            <div className="flex justify-center shrink-0" {...longPressHandlers}>
              <div className="relative cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/40 via-teal-500/40 to-cyan-500/40 blur-2xl rounded-full scale-125"></div>
                <div className="relative h-14 md:h-28 aspect-[4/5] rounded-lg md:rounded-xl overflow-hidden border border-cyan-400/40 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
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
            
            {/* Right side - Action buttons */}
            <div className="shrink-0 flex gap-1.5 md:gap-2 items-center">
              {/* WhatsApp - icon only on mobile */}
              <a
                href="https://wa.me/15127810973"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)] border border-green-500/60 bg-green-500/15 text-green-400 font-bold h-9 md:h-11 w-9 md:w-auto px-0 md:px-4 rounded-full transition-all"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Chat</span>
              </a>
              
              {/* Share */}
              <Button 
                onClick={() => setShowShareModal(true)}
                size="sm"
                className="shadow-[0_0_15px_rgba(0,255,255,0.4)] border border-[#00FFFF]/60 bg-[#00FFFF]/10 text-[#00FFFF] hover:bg-[#00FFFF]/20 font-bold h-9 md:h-11 w-9 md:w-auto px-0 md:px-4 rounded-full"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Share</span>
              </Button>
              
              {/* Theme Toggle - hidden on mobile */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              
              {/* Logout */}
              <Button 
                onClick={handleLogout}
                size="sm" 
                className="shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-pink-500/60 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 font-bold h-9 md:h-11 w-9 md:w-auto px-0 md:px-4 rounded-full"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Beta Banner for Dashboard */}
      {isBetaPeriodActive() && (
        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-4">
          <BetaBanner variant="compact" />
        </div>
      )}

      <main className="relative z-10 container mx-auto px-4 py-4 md:py-8">
        <div className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Dashboard Title */}
          <div className="p-6 md:p-8 border-b border-white/10">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-bold">
                  <span className="bg-gradient-to-r from-[#00FFFF] to-cyan-400 bg-clip-text text-transparent">Dashboard</span>
                </h1>
                {isBetaPeriodActive() && <BetaMemberBadge />}
                <button
                  onClick={() => setShowGhostPass(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 hover:bg-amber-500/20 transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                >
                  <Ghost className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400">Ghost Pass™</span>
                </button>
                
                {/* Ratify Pill - AI Fact Checking */}
                <RatifyPill 
                  pendingCount={pendingCorrections.length}
                  hasCorrections={hasCorrections}
                  onClick={openPanel}
                  latestCorrection={activeCorrection}
                />
                
                {/* Human Vetting Pill - AI Cognitive Assessment */}
                <HumanVettingPill 
                  isActive={false}
                />
              </div>
              <p className="text-[#E0E0E0]/70 text-sm md:text-base mt-1">
                Welcome to your Universal Lifestyle Wallet. One place for identity, safety, and access.
              </p>
              
              {/* Tab Navigation - Inside Dashboard Pill */}
              <div className="mt-4 overflow-x-auto overflow-y-hidden scrollbar-none -mx-2 px-2 pb-2 touch-pan-x">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-blue-500/30 rounded-2xl blur-xl animate-pulse" style={{ animationDuration: '2s' }} />
                  <div className="relative inline-flex bg-black/60 backdrop-blur-md border-2 border-blue-500/60 rounded-2xl p-2 gap-1.5 min-w-max shadow-[0_0_25px_rgba(59,130,246,0.5),inset_0_0_15px_rgba(59,130,246,0.1)]">
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`py-2.5 px-4 rounded-xl font-medium whitespace-nowrap text-xs sm:text-sm touch-manipulation transition-all duration-300 flex items-center ${activeTab === "profile" ? "bg-blue-500/30 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-blue-400/50" : "text-[#E0E0E0]/80"}`}
                    >
                      <UserIcon className="h-4 w-4 mr-1.5" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("wallet")}
                      className={`py-2.5 px-4 rounded-xl font-medium whitespace-nowrap text-xs sm:text-sm touch-manipulation transition-all duration-300 flex items-center ${activeTab === "wallet" ? "bg-amber-500/30 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)] border border-amber-400/50" : "text-[#E0E0E0]/80"}`}
                    >
                      <Wallet className="h-4 w-4 mr-1.5" />
                      <span>Wallet</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("senate")}
                      className={`py-2.5 px-4 rounded-xl font-medium whitespace-nowrap text-xs sm:text-sm touch-manipulation transition-all duration-300 flex items-center ${activeTab === "senate" ? "bg-blue-500/30 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-blue-400/50" : "text-[#E0E0E0]/80"}`}
                    >
                      <Scale className="h-4 w-4 mr-1.5" />
                      <span>The Senate</span>
                    </button>
                    <button
                      onClick={() => navigate('/trust-center')}
                      className="py-2.5 px-4 rounded-xl text-[#E0E0E0]/80 font-medium hover:bg-blue-500/20 hover:text-white whitespace-nowrap text-xs sm:text-sm touch-manipulation transition-all duration-300 flex items-center"
                    >
                      <Upload className="h-4 w-4 mr-1.5" />
                      <span>Trust</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("lab-verification")}
                      className={`py-2.5 px-4 rounded-xl font-medium whitespace-nowrap text-xs sm:text-sm touch-manipulation transition-all duration-300 flex items-center ${activeTab === "lab-verification" ? "bg-blue-500/30 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-blue-400/50" : "text-[#E0E0E0]/80"}`}
                    >
                      <FlaskConical className="h-4 w-4 mr-1.5" />
                      <span>Health</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("safety-screen")}
                      className={`py-2.5 px-4 rounded-xl font-medium whitespace-nowrap text-xs sm:text-sm touch-manipulation transition-all duration-300 flex items-center ${activeTab === "safety-screen" ? "bg-blue-500/30 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-blue-400/50" : "text-[#E0E0E0]/80"}`}
                    >
                      <ShieldCheck className="h-4 w-4 mr-1.5" />
                      <span>Tox</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("verify-id")}
                      className={`py-2.5 px-4 rounded-xl font-medium whitespace-nowrap text-xs sm:text-sm touch-manipulation transition-all duration-300 flex items-center ${activeTab === "verify-id" ? "bg-blue-500/30 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] border border-blue-400/50" : "text-[#E0E0E0]/80"}`}
                    >
                      <Fingerprint className="h-4 w-4 mr-1.5" />
                      <span>ID</span>
                    </button>
                  </div>
                </div>
              </div>
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
                saveState={profileSaveState}
                onSave={() => profileTabRef.current?.triggerSave()}
              />
            </div>
            
            {/* Privacy Badge - Compact */}
            <div className="flex justify-center my-3">
              <PrivacyBadgeB2C variant="compact" />
            </div>
            
            {/* Enterprise Trust Badge - Dashboard */}
            <div className="flex items-center justify-center gap-2 my-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                <span className="text-xs">🛡️</span>
                <span className="text-cyan-400 text-[10px] font-bold">SOC 2</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                <span className="text-xs">🔒</span>
                <span className="text-green-400 text-[10px] font-bold">GDPR</span>
              </div>
              <span className="text-gray-500 text-[10px]">Enterprise Ready</span>
            </div>
            
            {/* Location Pulse - Right above Bounty Mission */}
            <div className="my-4">
              <LocationPulseSection />
            </div>
            
            {/* Bounty Mission - Daily Quest */}
            <div className="flex justify-center">
              <BountyMission />
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
            
            {/* Tab Content - Navigation moved to Dashboard pill above */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              
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

                <TabsContent value="wallet">
                  <WalletTab userId={user.id} onOpenGhostPass={() => setShowGhostPass(true)} />
                </TabsContent>

                <TabsContent value="senate">
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold bg-gradient-to-r from-[#00FFFF] to-cyan-400 bg-clip-text text-transparent">The Senate</h2>
                      <p className="text-[#E0E0E0]/60 text-sm mt-1">AI Governance & Verification</p>
                    </div>
                    
                    {/* Judicial Pyramid Layout */}
                    <div className="space-y-6">
                      {/* Top Tier - Chief Judge (Seat 1) */}
                      <div className="flex flex-col items-center">
                        <div className="text-xs uppercase tracking-widest text-cyan-400 mb-3 font-semibold flex items-center gap-2">
                          <Scale className="w-4 h-4" />
                          Chief Judge
                        </div>
                        <div 
                          className="backdrop-blur-xl bg-black/40 border-2 border-cyan-500/50 rounded-xl p-6 flex flex-col items-center justify-center min-h-[150px] w-full max-w-xs hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all duration-300"
                        >
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border-2 border-cyan-400/50 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(0,255,255,0.4)]">
                            <Scale className="w-7 h-7 text-cyan-300" />
                          </div>
                          <span className="text-white font-semibold">Seat 1</span>
                          <span className="text-cyan-400/80 text-xs mt-1">OpenAI • GPT-4o</span>
                        </div>
                      </div>

                      {/* Second Tier - Executive Secretary (Seat 2) */}
                      <div className="flex flex-col items-center">
                        <div className="text-xs uppercase tracking-widest text-purple-400 mb-3 font-semibold">
                          Executive Secretary
                        </div>
                        <div 
                          className="backdrop-blur-xl bg-black/40 border-2 border-purple-500/50 rounded-xl p-6 flex flex-col items-center justify-center min-h-[150px] w-full max-w-xs hover:border-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300"
                        >
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-400/50 flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                            <Scale className="w-7 h-7 text-purple-300" />
                          </div>
                          <span className="text-white font-semibold">Seat 2</span>
                          <span className="text-purple-400/80 text-xs mt-1">Anthropic • Claude 3.5</span>
                        </div>
                      </div>

                      {/* Bottom Tier - 5 Senate Members (Seats 3-7) */}
                      <div className="flex flex-col items-center">
                        <div className="text-xs uppercase tracking-widest text-gray-400 mb-3 font-semibold">
                          Senate Members
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-5xl">
                          {[
                            { seat: 3, provider: 'Google', model: 'Gemini 1.5', color: 'blue' },
                            { seat: 4, provider: 'Meta', model: 'Llama 3', color: 'indigo' },
                            { seat: 5, provider: 'DeepSeek', model: 'V3', color: 'teal' },
                            { seat: 6, provider: 'Mistral', model: 'Large', color: 'amber' },
                            { seat: 7, provider: 'xAI', model: 'Grok', color: 'red' },
                          ].map(({ seat, provider, model, color }) => (
                            <div 
                              key={seat}
                              className="backdrop-blur-xl bg-black/40 border border-white/20 rounded-xl p-5 flex flex-col items-center justify-center min-h-[140px] hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(0,255,255,0.2)] transition-all duration-300"
                            >
                              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mb-3">
                                <Scale className="w-6 h-6 text-gray-400" />
                              </div>
                              <span className="text-[#E0E0E0]/90 font-medium">Seat {seat}</span>
                              <span className="text-[#E0E0E0]/50 text-xs mt-1">{provider} • {model}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
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

      <GhostPassModal userId={user.id} open={showGhostPass} onOpenChange={setShowGhostPass} />

      <ShareProfileModal 
        open={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        userId={user.id} 
      />

      {/* Ratify Panel - AI Fact Checking Modal */}
      <RatifyPanel
        isOpen={isPanelOpen}
        onClose={closePanel}
        corrections={corrections}
        pendingCorrections={pendingCorrections}
        activeCorrection={activeCorrection}
        onSelectCorrection={setActiveCorrection}
        onRatify={ratifyCorrection}
        onRatifyAll={ratifyAll}
        onDismiss={dismissCorrection}
      />

      {/* Human Vetting Panel - AI Cognitive Assessment Modal */}
      <HumanVettingPanel
        isOpen={showHumanVetting}
        onClose={() => setShowHumanVetting(false)}
      />
    </div>
  );
};

export default Dashboard;