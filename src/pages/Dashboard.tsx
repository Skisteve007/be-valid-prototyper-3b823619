import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { User, Session } from "@supabase/supabase-js";
import { LogOut, Home, Share2, Lock, FileText, Shield, FlaskConical, ShieldCheck, ChevronDown, ChevronUp, Users, Activity, Zap, Ghost } from "lucide-react";
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

type SignalMode = "social" | "pulse" | "thrill" | "afterdark" | null;

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrRefreshKey, setQrRefreshKey] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [vibeMetadata, setVibeMetadata] = useState<Record<string, any>>({});
  const [statusColor, setStatusColor] = useState<string>("green");
  const [selectedMode, setSelectedMode] = useState<SignalMode>(null);
  const [documentHubOpen, setDocumentHubOpen] = useState(false);
  const longPressHandlers = useLongPressHome();

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
    console.log("Dashboard: Refreshing QR code");
    setQrRefreshKey(prev => prev + 1);
  };

  const handleModeSelect = (mode: SignalMode) => {
    setSelectedMode(mode);
    const newMetadata = { ...vibeMetadata, mode };
    setVibeMetadata(newMetadata);
    
    // Update status color based on mode
    switch (mode) {
      case "social":
        setStatusColor("blue");
        break;
      case "pulse":
        setStatusColor("green");
        break;
      case "thrill":
        setStatusColor("orange");
        break;
      case "afterdark":
        setStatusColor("purple");
        break;
      default:
        setStatusColor("gray");
    }
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
      {/* Plasma/Nebula Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
      </div>

      {/* Floating Glass Capsule Header */}
      <header className="relative z-10 mx-4 md:mx-8 mt-4">
        <div className="backdrop-blur-xl bg-white/5 border border-[#00FFFF]/30 rounded-full px-6 py-4 shadow-[0_0_30px_rgba(0,255,255,0.15)]">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="hidden md:block md:flex-1"></div>
            
            {/* Logo - centered */}
            <div className="flex justify-center">
              <div className="relative cursor-pointer" {...longPressHandlers}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/40 via-teal-500/40 to-cyan-500/40 blur-3xl rounded-full scale-150"></div>
                <img src={logo} alt="Valid" className="relative h-16 md:h-20 w-auto select-none drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" draggable={false} />
              </div>
            </div>
            
            {/* Buttons */}
            <div className="flex justify-center md:justify-end gap-2 flex-wrap md:flex-1 items-center">
              <Button 
                onClick={() => setShowShareModal(true)}
                className="relative shadow-[0_0_20px_rgba(0,255,255,0.5)] hover:shadow-[0_0_30px_rgba(0,255,255,0.7)] border border-[#00FFFF]/60 bg-[#00FFFF]/10 text-[#00FFFF] hover:text-[#00FFFF] hover:bg-[#00FFFF]/20 font-bold min-h-[44px] px-5 touch-manipulation rounded-full backdrop-blur-sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
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
        {/* THE CONTROL ZONE */}
        <div className="backdrop-blur-xl bg-black/30 border border-white/10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-white/10 text-center">
            <h1 className="text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#00FFFF] to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">THE CONTROL ZONE</span>
            </h1>
            <p className="text-[#E0E0E0]/70 text-sm md:text-base mt-1">
              Select your signal. Verify. Transmit.
            </p>
          </div>

          {/* Private Inbox */}
          <div className="p-4 md:p-6 border-b border-white/10">
            <PrivateInbox userId={user.id} onStatusUpdate={handleProfileUpdate} />
          </div>

          {/* CENTRAL SIGNAL CORE - QR Code prominent */}
          <div className="p-6 md:p-8">
            {/* Dynamic Signal Generator (QR Code) - Central and Prominent */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                {/* Glowing ring effect */}
                <div className={`absolute inset-0 rounded-full blur-2xl animate-pulse ${
                  selectedMode === "social" ? "bg-blue-500/30" :
                  selectedMode === "pulse" ? "bg-green-500/30" :
                  selectedMode === "thrill" ? "bg-orange-500/30" :
                  selectedMode === "afterdark" ? "bg-purple-500/30" :
                  "bg-gray-500/20"
                }`} style={{ transform: 'scale(1.3)' }} />
                
                {/* QR Code Container */}
                <div className={`relative w-64 h-64 md:w-80 md:h-80 rounded-2xl flex items-center justify-center border-4 ${
                  selectedMode === "social" ? "border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.5)]" :
                  selectedMode === "pulse" ? "border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.5)]" :
                  selectedMode === "thrill" ? "border-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.5)]" :
                  selectedMode === "afterdark" ? "border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.5)]" :
                  "border-gray-500 shadow-[0_0_20px_rgba(107,114,128,0.3)]"
                } bg-white`}>
                  <QRCodeTab key={qrRefreshKey} userId={user.id} />
                </div>
              </div>
              
              {/* Mode indicator text */}
              <p className={`mt-4 text-sm font-semibold tracking-wider ${
                selectedMode === "social" ? "text-blue-400" :
                selectedMode === "pulse" ? "text-green-400" :
                selectedMode === "thrill" ? "text-orange-400" :
                selectedMode === "afterdark" ? "text-purple-400" :
                "text-gray-400"
              }`}>
                {selectedMode ? `${selectedMode.toUpperCase()} MODE ACTIVE` : "SELECT A SIGNAL MODE"}
              </p>
            </div>

            {/* Mode Selector Switches - Horizontal toggles under QR */}
            <div className="flex justify-center gap-2 md:gap-4 flex-wrap mb-8">
              {/* SOCIAL Toggle */}
              <button
                onClick={() => handleModeSelect("social")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                  selectedMode === "social"
                    ? "border-blue-500 bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                    : "border-white/20 bg-white/5 text-[#E0E0E0]/70 hover:border-blue-500/50"
                }`}
              >
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold">SOCIAL</span>
              </button>

              {/* PULSE Toggle */}
              <button
                onClick={() => handleModeSelect("pulse")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                  selectedMode === "pulse"
                    ? "border-green-500 bg-green-500/20 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                    : "border-white/20 bg-white/5 text-[#E0E0E0]/70 hover:border-green-500/50"
                }`}
              >
                <Activity className="w-4 h-4" />
                <span className="text-sm font-semibold">PULSE</span>
              </button>

              {/* THRILL Toggle */}
              <button
                onClick={() => handleModeSelect("thrill")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                  selectedMode === "thrill"
                    ? "border-orange-500 bg-orange-500/20 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                    : "border-white/20 bg-white/5 text-[#E0E0E0]/70 hover:border-orange-500/50"
                }`}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-semibold">THRILL</span>
              </button>

              {/* AFTER DARK Toggle */}
              <button
                onClick={() => handleModeSelect("afterdark")}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                  selectedMode === "afterdark"
                    ? "border-purple-500 bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                    : "border-white/20 bg-white/5 text-[#E0E0E0]/70 hover:border-purple-500/50"
                }`}
              >
                <Ghost className="w-4 h-4" />
                <span className="text-sm font-semibold">AFTER DARK</span>
              </button>
            </div>

            {/* My Signal Section - Expanded dropdowns based on mode */}
            {selectedMode && (
              <div className="mb-8">
                <MySignalSection
                  vibeMetadata={vibeMetadata}
                  onVibeMetadataChange={setVibeMetadata}
                  onStatusColorChange={setStatusColor}
                />
              </div>
            )}

            {/* Venue Check-in */}
            <VenueCheckin userId={user.id} />
          </div>

          {/* DOCUMENT HUB (Secured & Locked) - Collapsible */}
          <div className="border-t border-white/10">
            <button
              onClick={() => setDocumentHubOpen(!documentHubOpen)}
              className="w-full p-4 md:p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#00FFFF]/10 border border-[#00FFFF]/30">
                  <FileText className="w-5 h-5 text-[#00FFFF]" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-semibold text-[#E0E0E0] flex items-center gap-2">
                    Document Hub
                    <Lock className="w-4 h-4 text-[#00FFFF]" />
                  </h2>
                  <p className="text-sm text-[#E0E0E0]/50">Secured & Locked - Tap to expand</p>
                </div>
              </div>
              {documentHubOpen ? (
                <ChevronUp className="w-5 h-5 text-[#E0E0E0]/70" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#E0E0E0]/70" />
              )}
            </button>

            {documentHubOpen && (
              <div className="p-4 md:p-6 pt-0 space-y-4">
                {/* Profile Section with Lock */}
                <Card className="backdrop-blur-xl bg-black/40 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className="w-4 h-4 text-[#00FFFF]" />
                      <h3 className="font-semibold text-[#E0E0E0]">Personal Profile</h3>
                    </div>
                    <ProfileTab userId={user.id} onUpdate={handleProfileUpdate} />
                  </CardContent>
                </Card>

                {/* Documents/Certifications with Lock */}
                <Card className="backdrop-blur-xl bg-black/40 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Lock className="w-4 h-4 text-[#00FFFF]" />
                      <h3 className="font-semibold text-[#E0E0E0]">Documents & Certifications</h3>
                    </div>
                    <CertificationsTab userId={user.id} />
                  </CardContent>
                </Card>

                {/* UTILITY ZONE - Lab Certifications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Health Lab */}
                  <Card className="backdrop-blur-xl bg-black/40 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Lock className="w-4 h-4 text-green-400" />
                        <FlaskConical className="w-4 h-4 text-green-400" />
                        <h3 className="font-semibold text-[#E0E0E0]">Health Lab</h3>
                      </div>
                      <LabVerificationTab userId={user.id} />
                    </CardContent>
                  </Card>

                  {/* Toxicology */}
                  <Card className="backdrop-blur-xl bg-black/40 border-white/10">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Lock className="w-4 h-4 text-amber-400" />
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <h3 className="font-semibold text-[#E0E0E0]">Toxicology</h3>
                      </div>
                      <SafetyScreenTab userId={user.id} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Back to Home Button */}
      <Button
        onClick={() => navigate("/")}
        className="fixed bottom-4 left-4 md:bottom-8 md:left-8 h-10 w-10 md:h-11 md:w-11 rounded-full bg-[#00FFFF]/20 hover:bg-[#00FFFF]/30 border border-[#00FFFF]/40 shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] backdrop-blur-sm transition-all duration-300 hover:scale-105 z-50"
        title="Back to Home"
      >
        <Home className="h-4 w-4 md:h-5 md:w-5 text-[#00FFFF]" />
      </Button>

      {/* Ghost Pass FAB & Modal */}
      <GhostPassModal userId={user.id} />

      {/* Share Profile Modal */}
      <ShareProfileModal 
        open={showShareModal} 
        onClose={() => setShowShareModal(false)} 
        userId={user.id} 
      />
    </div>
  );
};

export default Dashboard;