import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Users, Activity, Zap, Ghost, Radio, Share2, Copy, Check, Podcast, X, Crown, Building2, Settings, MessageSquare } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

type SignalMode = "social" | "pulse" | "thrill" | "afterdark" | null;

interface MySignalSectionProps {
  vibeMetadata: Record<string, any>;
  onVibeMetadataChange: (metadata: Record<string, any>) => void;
  onStatusColorChange: (color: "green" | "yellow" | "red" | "gray" | "blue" | "orange" | "purple") => void;
}

// Dropdown options for each mode
const SOCIAL_OPTIONS = {
  title: ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof.", "Sir", "Dame", "The Honorable", "CEO", "Founder"],
  status: ["Available", "In a Meeting", "Do Not Disturb", "Looking to Connect", "Just Networking", "VIP Only"],
  netWorth: ["Prefer Not to Say", "Building", "Comfortable", "7 Figures", "8 Figures", "Exit Ready"],
  equity: ["Bootstrapped", "Seed", "Series A+", "Public", "Family Office", "Crypto Rich"],
  meetingStyle: ["Coffee Chat", "Dinner & Deals", "Golf Course", "Yacht Meetings", "Virtual Only", "Anywhere"],
  inboxStatus: ["Open DMs", "Referrals Only", "Assistant Screens", "Email First", "LinkedIn Only"],
  phoneOS: ["iPhone Pro Max", "Android Flagship", "Both", "Flip Phone Energy", "Burner"],
  cryptoStance: ["HODL", "Day Trader", "NFT Collector", "DeFi Degen", "No Crypto", "Whale"],
  vibeCheck: ["All Business", "Work Hard Play Hard", "Old Money Energy", "New Money Energy", "Quiet Luxury"],
  lookingFor: ["Investors", "Co-Founders", "Mentors", "Deals", "Friends in High Places", "Exit"],
  theApproach: ["Eye Contact First", "Direct & Bold", "Flirty Banter", "Meet on the Dance Floor", "Buy Me a Drink First", "Friend of a Friend Intro"],
  theChemistry: ["Instant Spark", "Slow Burn", "Friends First", "One Night Only", "Ongoing Fun", "Let's See Where It Goes"],
};

const PULSE_OPTIONS = {
  mission: ["Just Vibing", "Looking for Trouble", "Here for the Music", "People Watching", "Main Character", "Wingman Duty"],
  fuelSource: ["H2O", "Liquid Courage", "California Sober 🍃", "Snow Forecast ❄️", "Full Send 💊", "Energy Drinks"],
  bathroomBreaks: ["Never", "Powder Room", "Group Meeting", "Solo Missions", "Emergency Only"],
  shades: ["On Indoors", "Hanging on Shirt", "Lost Them", "Prescription", "Night Vision"],
  energy: ["Pregaming", "Peaking", "Cruise Control", "Second Wind", "Last Call Energy", "After Party Ready"],
  redFlag: ["None", "Ex is Here", "Tab is Open", "Phone at 5%", "Lost my Friends", "Uber Surge"],
  buying: ["First Round", "My Round Never", "Bottle Service", "Water Only", "Whatever You're Having"],
  closingTime: ["When They Kick Us Out", "2 AM Sharp", "Sunrise", "Already Planning Tomorrow", "Open Ended"],
  recovery: ["Brunch", "Hair of the Dog", "Sleep All Day", "IV Drip", "Pretend It Didn't Happen"],
  visibility: ["Anonymous Only", "Very Private", "Selective Sharing", "Face Pics (After Trust)", "Open Book", "Full Transparency"],
  paperwork: ["Trust Based (No Paper)", "Preferred", "Required (Non-Negotiable)", "Notarized Only", "Screenshot = Blocked", "What's an NDA?"],
};

const THRILL_OPTIONS = {
  squadRole: ["The Planner", "Hype Man", "Designated Driver", "The Wild Card", "Voice of Reason", "Social Director"],
  seatPref: ["Front Row", "Nosebleeds", "Suite Life", "Standing Room", "Wherever There's Beer", "VIP Section"],
  riskTolerance: ["Safe Bets Only", "Moderate", "High Stakes", "All In", "House Money", "What's a Budget?"],
  fandomLevel: ["Casual", "Die Hard", "Painted Face", "Season Tickets", "Fantasy League Champion", "Bandwagon Welcome"],
  betSize: ["Friendly Wager", "$20 Max", "Three Figures", "Four Figures", "Life Changing", "Just for Fun"],
  volume: ["Library Voice", "Normal", "Loud and Proud", "Lost My Voice", "Megaphone Energy"],
  merchCheck: ["Head to Toe", "Jersey Only", "Hat Guy", "Vintage Only", "Merch is for Tourists", "Full Body Paint"],
  tailgateStyle: ["BYOB", "Full Setup", "Grill Master", "Cooler Only", "Skip to Stadium", "RV Life"],
  superstition: ["Lucky Jersey", "Same Seat", "Pre-Game Ritual", "Rally Cap", "No Superstitions", "Full Voodoo"],
  travelMode: ["Road Trip", "Fly In", "Tour Bus", "Private", "Virtual Fan", "Local Only"],
  partyFavors: ["High on Life (Sober)", "420 Friendly", "Chem Curious", "PnP (Party & Play)", "Dealer's Choice", "BYO"],
};

const AFTERDARK_OPTIONS = {
  dynamic: ["Dom", "Sub", "Switch", "Observer", "Facilitator", "Explorer", "Undecided"],
  partyFavors: ["Sober", "420 Friendly", "Chem Curious", "PnP", "Dealer's Choice", "Bring Your Own"],
  vibe: ["Soft Swap", "Full Swap", "Voyeur", "Exhibitionist", "Poly Life", "Monogam-ish", "Open"],
  hardware: ["BYO Supplies", "Use Mine", "Well Stocked", "Spontaneous", "Safety First", "Ask First"],
  ndaStatus: ["Required", "Preferred", "Trust Based", "What NDA?", "Notarized Only", "Screenshot = Block"],
  connectionType: ["One Night", "Ongoing", "Friends First", "Instant Chemistry", "Slow Burn", "See Where It Goes"],
  approachStyle: ["Direct", "Flirty Banter", "Eye Contact First", "Dance Floor", "Drink First", "Friend of a Friend"],
  privacyLevel: ["Very Private", "Selective", "Open Book", "Anonymous Only", "Face Pics After Trust", "Full Transparency"],
  sleepoverRules: ["Never", "Sometimes", "Prefer It", "Required", "My Place Only", "Hotels Only"],
  rules: ["No Kissing", "No Marks", "Safe Words", "Anything Goes", "Discuss First", "Standard Protocol"],
  archetype: ["Dynamic Observer", "Dom / Top", "Sub / Bottom", "Switch / Vers", "Facilitator", "Explorer", "Just Watching"],
  theDynamic: ["Poly Life", "Monogam-ish", "Open Relationship", "Soft Swap", "Full Swap", "Voyeur", "Exhibitionist"],
  theToolkit: ["Select Hardware (None)", "BYO Supplies", "Use Mine", "Well Stocked", "Spontaneous", "Safety First", "Ask First"],
  theRulebook: ["Anything Goes", "Standard Protocol", "Discuss First", "Safe Words Mandatory", "No Marks", "No Kissing"],
  breakfastPlans: ["Prefer It", "My Place Only", "Hotels Only", "Sometimes", "Never", "Required"],
};

const MySignalSection = ({ vibeMetadata, onVibeMetadataChange, onStatusColorChange }: MySignalSectionProps) => {
  const [selectedMode, setSelectedMode] = useState<SignalMode>(vibeMetadata?.mode || null);
  const [showAgeWarning, setShowAgeWarning] = useState(false);
  const [pendingMode, setPendingMode] = useState<SignalMode>(null);
  const [localMetadata, setLocalMetadata] = useState<Record<string, any>>(vibeMetadata || {});
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [broadcastActive, setBroadcastActive] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [simulateVenue, setSimulateVenue] = useState(false);
  const [showDevSettings, setShowDevSettings] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  // Simulated venue data
  const simulatedVenue = {
    name: "Club Nightfall",
    logo_url: null,
    id: "simulated-venue-123"
  };

  // Check if user is at a venue
  const isAtVenue = simulateVenue;
  const currentVenue = isAtVenue ? simulatedVenue : null;

  // Broadcast colors based on mode
  const getBroadcastColor = () => {
    switch (selectedMode) {
      case "afterdark":
        return "bg-purple-600"; // Deep Neon Purple
      case "thrill":
        return "bg-orange-500"; // Vibrant Neon Orange
      case "social":
      case "pulse":
        return "bg-cyan-500"; // Electric Teal/Cyan
      default:
        return "bg-cyan-500";
        return "bg-cyan-500";
    }
  };

  // Render dynamic watermark based on venue status and broadcast message
  const renderBroadcastWatermark = () => {
    const hasMessage = broadcastMessage.trim().length > 0;
    
    // If custom broadcast message exists, show it prominently with suppressed watermark
    if (hasMessage) {
      return (
        <div className="flex flex-col items-center justify-center gap-6 px-8 max-w-[90vw]">
          {/* Custom broadcast message - LARGE and center-screen */}
          <span className="text-white text-4xl md:text-6xl font-bold text-center leading-tight tracking-wide break-words">
            {broadcastMessage}
          </span>
          {/* Suppressed watermark - minimal opacity 5-10% */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
            {currentVenue ? (
              <div className="flex items-center gap-2 opacity-[0.08]">
                <Crown className="w-6 h-6 text-white" />
                <span className="text-white text-xs font-bold tracking-widest">{currentVenue.name.toUpperCase()}</span>
              </div>
            ) : (
              <Ghost className="w-10 h-10 text-white opacity-[0.08]" />
            )}
          </div>
        </div>
      );
    }

    // No custom message - MAXIMIZE watermark for marketing visibility
    if (currentVenue) {
      // Venue branding mode - LARGE
      return (
        <div className="flex flex-col items-center gap-6">
          {/* Venue Logo - MAXIMIZED size */}
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-white/20 flex items-center justify-center">
            <Crown className="w-40 h-40 md:w-52 md:h-52 text-white opacity-30" />
          </div>
          <span className="text-white/30 text-3xl md:text-4xl font-bold tracking-widest text-center">
            {currentVenue.name.toUpperCase()}
          </span>
          <span className="text-white/20 text-sm md:text-base tracking-wider">VALID™ VERIFIED</span>
        </div>
      );
    }

    // Default Ghost/Valid branding - MAXIMIZED
    return (
      <div className="flex flex-col items-center gap-6">
        <Ghost className="w-64 h-64 md:w-80 md:h-80 text-white opacity-25" />
        <span className="text-white/25 text-3xl md:text-4xl font-bold tracking-widest">VALID™</span>
      </div>
    );
  };

  // Share signal with venue branding
  const handleShareSignal = async () => {
    if (!navigator.share) {
      toast.error("Sharing not supported on this device");
      return;
    }

    try {
      // Build share message with venue context
      const venueContext = currentVenue 
        ? ` at ${currentVenue.name}` 
        : "";
      
      const shareData: ShareData = {
        title: currentVenue ? `VALID at ${currentVenue.name}` : "My VALID Signal",
        text: `Check out my VALID ${selectedMode?.toUpperCase() || "Signal"} mode${venueContext}! Verified and ready to connect.`,
        url: window.location.origin + "/dashboard",
      };
      
      await navigator.share(shareData);
      toast.success("Signal shared!");
    } catch (error: any) {
      if (error.name !== "AbortError") {
        toast.error("Failed to share");
      }
    }
  };

  useEffect(() => {
    if (vibeMetadata?.mode) {
      setSelectedMode(vibeMetadata.mode);
    }
    setLocalMetadata(vibeMetadata || {});
  }, [vibeMetadata]);

  const handleModeSelect = (mode: SignalMode) => {
    // Show 18+ warning for Pulse and After Dark
    if (mode === "pulse" || mode === "afterdark") {
      setPendingMode(mode);
      setShowAgeWarning(true);
      return;
    }
    activateMode(mode);
  };

  const activateMode = (mode: SignalMode) => {
    setSelectedMode(mode);
    const newMetadata = { ...localMetadata, mode };
    setLocalMetadata(newMetadata);
    onVibeMetadataChange(newMetadata);

    // Update QR code color based on mode
    switch (mode) {
      case "social":
        onStatusColorChange("blue");
        break;
      case "pulse":
        onStatusColorChange("green");
        break;
      case "thrill":
        onStatusColorChange("orange");
        break;
      case "afterdark":
        onStatusColorChange("purple");
        break;
      default:
        onStatusColorChange("gray");
    }
  };

  const handleConfirmAge = () => {
    setShowAgeWarning(false);
    if (pendingMode) {
      activateMode(pendingMode);
      setPendingMode(null);
    }
  };

  const handleCancelAge = () => {
    setShowAgeWarning(false);
    setPendingMode(null);
  };

  const updateMetadataField = (field: string, value: string) => {
    const newMetadata = { ...localMetadata, [field]: value };
    setLocalMetadata(newMetadata);
    onVibeMetadataChange(newMetadata);
  };

  const renderDropdown = (label: string, field: string, options: string[]) => (
    <div className="space-y-1">
      <Label className="text-xs font-medium text-foreground">{label}</Label>
      <Select
        value={localMetadata[field] || ""}
        onValueChange={(value) => updateMetadataField(field, value)}
      >
        <SelectTrigger className="bg-background border-border text-foreground h-9">
          <SelectValue placeholder={`Select ${label}`} />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border text-popover-foreground z-50">
          {options.map((option) => (
            <SelectItem key={option} value={option} className="hover:bg-accent">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderTextInput = (label: string, field: string, placeholder: string) => (
    <div className="space-y-1 col-span-2">
      <Label className="text-xs font-medium text-foreground">{label}</Label>
      <Input
        value={localMetadata[field] || ""}
        onChange={(e) => updateMetadataField(field, e.target.value)}
        placeholder={placeholder}
        className="bg-background border-border text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );

  const renderSocialDropdowns = () => (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {renderDropdown("Title", "social_title", SOCIAL_OPTIONS.title)}
      {renderDropdown("Status", "social_status", SOCIAL_OPTIONS.status)}
      {renderDropdown("Net Worth", "social_netWorth", SOCIAL_OPTIONS.netWorth)}
      {renderDropdown("Equity", "social_equity", SOCIAL_OPTIONS.equity)}
      {renderDropdown("Meeting Style", "social_meetingStyle", SOCIAL_OPTIONS.meetingStyle)}
      {renderDropdown("Inbox Status", "social_inboxStatus", SOCIAL_OPTIONS.inboxStatus)}
      {renderDropdown("Phone OS", "social_phoneOS", SOCIAL_OPTIONS.phoneOS)}
      {renderDropdown("Crypto Stance", "social_cryptoStance", SOCIAL_OPTIONS.cryptoStance)}
      {renderDropdown("Vibe Check", "social_vibeCheck", SOCIAL_OPTIONS.vibeCheck)}
      {renderDropdown("Looking For", "social_lookingFor", SOCIAL_OPTIONS.lookingFor)}
      {renderDropdown("The Approach", "social_theApproach", SOCIAL_OPTIONS.theApproach)}
      {renderDropdown("The Chemistry", "social_theChemistry", SOCIAL_OPTIONS.theChemistry)}
      {renderTextInput("My Elevator Pitch", "social_elevatorPitch", "30 seconds or less...")}
    </div>
  );

  const renderPulseDropdowns = () => (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {renderDropdown("Mission", "pulse_mission", PULSE_OPTIONS.mission)}
      {renderDropdown("Fuel Source", "pulse_fuelSource", PULSE_OPTIONS.fuelSource)}
      {renderDropdown("Bathroom Breaks", "pulse_bathroomBreaks", PULSE_OPTIONS.bathroomBreaks)}
      {renderDropdown("Shades", "pulse_shades", PULSE_OPTIONS.shades)}
      {renderDropdown("Energy", "pulse_energy", PULSE_OPTIONS.energy)}
      {renderDropdown("Red Flag", "pulse_redFlag", PULSE_OPTIONS.redFlag)}
      {renderDropdown("Buying?", "pulse_buying", PULSE_OPTIONS.buying)}
      {renderDropdown("Closing Time", "pulse_closingTime", PULSE_OPTIONS.closingTime)}
      {renderDropdown("Recovery", "pulse_recovery", PULSE_OPTIONS.recovery)}
      {renderDropdown("Visibility", "pulse_visibility", PULSE_OPTIONS.visibility)}
      {renderDropdown("The Paperwork (NDA)", "pulse_paperwork", PULSE_OPTIONS.paperwork)}
      {renderTextInput("My Toxic Trait", "pulse_toxicTrait", "Be honest...")}
    </div>
  );

  const renderThrillDropdowns = () => (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {renderDropdown("Squad Role", "thrill_squadRole", THRILL_OPTIONS.squadRole)}
      {renderDropdown("Seat Pref", "thrill_seatPref", THRILL_OPTIONS.seatPref)}
      {renderDropdown("Risk Tolerance", "thrill_riskTolerance", THRILL_OPTIONS.riskTolerance)}
      {renderDropdown("Fandom Level", "thrill_fandomLevel", THRILL_OPTIONS.fandomLevel)}
      {renderDropdown("Bet Size", "thrill_betSize", THRILL_OPTIONS.betSize)}
      {renderDropdown("Volume", "thrill_volume", THRILL_OPTIONS.volume)}
      {renderDropdown("Merch Check", "thrill_merchCheck", THRILL_OPTIONS.merchCheck)}
      {renderDropdown("Tailgate Style", "thrill_tailgateStyle", THRILL_OPTIONS.tailgateStyle)}
      {renderDropdown("Superstition", "thrill_superstition", THRILL_OPTIONS.superstition)}
      {renderDropdown("Travel Mode", "thrill_travelMode", THRILL_OPTIONS.travelMode)}
      {renderDropdown("Party Favors", "thrill_partyFavors", THRILL_OPTIONS.partyFavors)}
      {renderTextInput("Hill I Will Die On", "thrill_hill", "This is non-negotiable...")}
    </div>
  );

  const renderAfterDarkDropdowns = () => (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {renderDropdown("Dynamic", "afterdark_dynamic", AFTERDARK_OPTIONS.dynamic)}
      {renderDropdown("Party Favors", "afterdark_partyFavors", AFTERDARK_OPTIONS.partyFavors)}
      {renderDropdown("Vibe", "afterdark_vibe", AFTERDARK_OPTIONS.vibe)}
      {renderDropdown("Hardware", "afterdark_hardware", AFTERDARK_OPTIONS.hardware)}
      {renderDropdown("NDA Status", "afterdark_ndaStatus", AFTERDARK_OPTIONS.ndaStatus)}
      {renderDropdown("Connection Type", "afterdark_connectionType", AFTERDARK_OPTIONS.connectionType)}
      {renderDropdown("Approach Style", "afterdark_approachStyle", AFTERDARK_OPTIONS.approachStyle)}
      {renderDropdown("Privacy Level", "afterdark_privacyLevel", AFTERDARK_OPTIONS.privacyLevel)}
      {renderDropdown("Sleepover Rules", "afterdark_sleepoverRules", AFTERDARK_OPTIONS.sleepoverRules)}
      {renderDropdown("Rules", "afterdark_rules", AFTERDARK_OPTIONS.rules)}
      {renderDropdown("Archetype", "afterdark_archetype", AFTERDARK_OPTIONS.archetype)}
      {renderDropdown("The Dynamic", "afterdark_theDynamic", AFTERDARK_OPTIONS.theDynamic)}
      {renderDropdown("The Toolkit", "afterdark_theToolkit", AFTERDARK_OPTIONS.theToolkit)}
      {renderDropdown("The Rulebook", "afterdark_theRulebook", AFTERDARK_OPTIONS.theRulebook)}
      {renderDropdown("Breakfast Plans", "afterdark_breakfastPlans", AFTERDARK_OPTIONS.breakfastPlans)}
      {renderTextInput("The Signal", "afterdark_signal", "What's your signal?")}
    </div>
  );

  return (
    <>
      <Card className="bg-card border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-1 mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              <h3 className="text-lg font-semibold text-cyan-400">MY SIGNAL</h3>
            </div>
            <span className="text-xs text-cyan-400/80 pl-7">Select a signal mode to customize your vibe</span>
          </div>

          {/* 4-Button Grid with Descriptions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {/* SOCIAL Button */}
            <button
              type="button"
              onClick={() => handleModeSelect("social")}
              className={`p-2 md:p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 md:gap-1.5 min-h-[100px] md:min-h-[140px] overflow-hidden ${
                selectedMode === "social"
                  ? "border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  : "border-cyan-400/50 bg-card hover:border-cyan-400 hover:bg-cyan-500/10"
              }`}
            >
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-1000 ${
                  selectedMode === "social" ? "bg-cyan-500 animate-[breathe-cyan_2s_ease-in-out_infinite]" : "bg-cyan-500/20"
                }`}
                style={selectedMode === "social" ? {
                  animation: "breathe-cyan 2s ease-in-out infinite",
                } : undefined}
              >
                <Users className={`w-4 h-4 md:w-5 md:h-5 ${selectedMode === "social" ? "text-white" : "text-cyan-400"}`} />
              </div>
              <span className="font-semibold text-foreground text-xs md:text-sm">SOCIAL</span>
              <p className="text-[8px] md:text-xs text-muted-foreground text-center leading-tight px-0.5 md:px-1 break-words hyphens-auto max-w-full">
                Open to connect. Share contacts.
              </p>
            </button>
            <style>{`
              @keyframes breathe-cyan {
                0%, 100% { box-shadow: 0 0 10px 4px rgba(0, 240, 255, 0.3); }
                50% { box-shadow: 0 0 25px 12px rgba(0, 240, 255, 0.6); }
              }
              @keyframes breathe-green {
                0%, 100% { box-shadow: 0 0 10px 4px rgba(34, 197, 94, 0.3); }
                50% { box-shadow: 0 0 25px 12px rgba(34, 197, 94, 0.6); }
              }
              @keyframes breathe-orange {
                0%, 100% { box-shadow: 0 0 10px 4px rgba(249, 115, 22, 0.3); }
                50% { box-shadow: 0 0 25px 12px rgba(249, 115, 22, 0.6); }
              }
              @keyframes breathe-purple {
                0%, 100% { box-shadow: 0 0 10px 4px rgba(168, 85, 247, 0.3); }
                50% { box-shadow: 0 0 25px 12px rgba(168, 85, 247, 0.6); }
              }
              @keyframes breathe-red {
                0%, 100% { box-shadow: 0 0 10px 4px rgba(239, 68, 68, 0.3); }
                50% { box-shadow: 0 0 25px 12px rgba(239, 68, 68, 0.6); }
              }
            `}</style>

            {/* PULSE Button */}
            <button
              type="button"
              onClick={() => handleModeSelect("pulse")}
              className={`p-2 md:p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 md:gap-1.5 min-h-[100px] md:min-h-[140px] overflow-hidden ${
                selectedMode === "pulse"
                  ? "border-green-400 bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                  : "border-green-400/50 bg-card hover:border-green-400 hover:bg-green-500/10"
              }`}
            >
              <div className="relative flex items-center gap-1">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-1000 ${
                    selectedMode === "pulse" ? "bg-green-500" : "bg-green-500/20"
                  }`}
                  style={selectedMode === "pulse" ? {
                    animation: "breathe-green 2s ease-in-out infinite",
                  } : undefined}
                >
                  <Activity className={`w-4 h-4 md:w-5 md:h-5 ${selectedMode === "pulse" ? "text-white" : "text-green-400"}`} />
                </div>
                <span className="text-[7px] md:text-[8px] font-bold text-green-400 bg-green-500/20 px-1 py-0.5 rounded-full border border-green-400/50">18+</span>
              </div>
              <span className="font-semibold text-foreground text-xs md:text-sm">PULSE</span>
              <p className="text-[8px] md:text-xs text-muted-foreground text-center leading-tight px-0.5 md:px-1 break-words hyphens-auto max-w-full">
                High energy mode.
              </p>
            </button>

            {/* THRILL Button */}
            <button
              type="button"
              onClick={() => handleModeSelect("thrill")}
              className={`p-2 md:p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 md:gap-1.5 min-h-[100px] md:min-h-[140px] overflow-hidden ${
                selectedMode === "thrill"
                  ? "border-orange-400 bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                  : "border-orange-400/50 bg-card hover:border-orange-400 hover:bg-orange-500/10"
              }`}
            >
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-1000 ${
                  selectedMode === "thrill" ? "bg-orange-500" : "bg-orange-500/20"
                }`}
                style={selectedMode === "thrill" ? {
                  animation: "breathe-orange 2s ease-in-out infinite",
                } : undefined}
              >
                <Zap className={`w-4 h-4 md:w-5 md:h-5 ${selectedMode === "thrill" ? "text-white" : "text-orange-400"}`} />
              </div>
              <span className="font-semibold text-foreground text-xs md:text-sm">THRILL</span>
              <p className="text-[8px] md:text-xs text-muted-foreground text-center leading-tight px-0.5 md:px-1 break-words hyphens-auto max-w-full">
                Adventure ready.
              </p>
            </button>

            {/* AFTER DARK Button */}
            <button
              type="button"
              onClick={() => handleModeSelect("afterdark")}
              className={`p-2 md:p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1 md:gap-1.5 min-h-[100px] md:min-h-[140px] overflow-hidden ${
                selectedMode === "afterdark"
                  ? "border-purple-400 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  : "border-purple-400/50 bg-card hover:border-purple-400 hover:bg-purple-500/10"
              }`}
            >
              <div className="relative flex items-center gap-1">
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-1000 ${
                    selectedMode === "afterdark" ? "bg-purple-500" : "bg-purple-500/20"
                  }`}
                  style={selectedMode === "afterdark" ? {
                    animation: "breathe-purple 2s ease-in-out infinite",
                  } : undefined}
                >
                  <Ghost className={`w-4 h-4 md:w-5 md:h-5 ${selectedMode === "afterdark" ? "text-white" : "text-purple-400"}`} />
                </div>
                <span className="text-[7px] md:text-[8px] font-bold text-purple-400 bg-purple-500/20 px-1 py-0.5 rounded-full border border-purple-400/50">18+</span>
              </div>
              <span className="font-semibold text-foreground text-[10px] md:text-sm">AFTER DARK</span>
              <p className="text-[8px] md:text-xs text-muted-foreground text-center leading-tight px-0.5 md:px-1 break-words hyphens-auto max-w-full">
                Zero data exposed.
              </p>
            </button>

          </div>

          {/* Dynamic Dropdowns */}
          {selectedMode === "social" && renderSocialDropdowns()}
          {selectedMode === "pulse" && renderPulseDropdowns()}
          {selectedMode === "thrill" && renderThrillDropdowns()}
          {selectedMode === "afterdark" && renderAfterDarkDropdowns()}

          {/* Broadcast & Share Controls */}
          {selectedMode && (
            <div className="mt-6 pt-4 border-t border-border space-y-4">
              {/* Broadcast Message Input - VISIBLE AND CLEAR */}
              <div className="space-y-2">
                <Label className="text-xs font-medium text-foreground flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  Broadcast Message (Optional)
                </Label>
                <Input
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Enter a short message to display..."
                  maxLength={50}
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-[10px] text-muted-foreground">
                  This text will appear large and center-screen on the broadcast beacon.
                </p>
              </div>

              {/* Broadcast Signal Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border">
                <div className="flex items-center gap-3">
                  <Podcast className="w-5 h-5 text-cyan-400" />
                  <div>
                    <span className="text-sm font-medium text-foreground">Broadcast Signal</span>
                    <p className="text-xs text-muted-foreground">Turn screen into colored beacon</p>
                  </div>
                </div>
                <Switch
                  checked={broadcastActive}
                  onCheckedChange={setBroadcastActive}
                  className="data-[state=checked]:bg-cyan-500"
                />
              </div>

              {/* Share Button */}
              <Button
                onClick={handleShareSignal}
                variant="outline"
                className="w-full border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Signal {currentVenue && `@ ${currentVenue.name}`}
              </Button>

              {/* Dev Settings Toggle */}
              <button
                onClick={() => setShowDevSettings(!showDevSettings)}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Settings className="w-3 h-3" />
                Dev Settings
              </button>

              {/* Dev Settings Panel */}
              {showDevSettings && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-400/30 space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-xs font-medium text-foreground">Simulate Venue</span>
                        <p className="text-[10px] text-muted-foreground">Preview venue branding</p>
                      </div>
                    </div>
                    <Switch
                      checked={simulateVenue}
                      onCheckedChange={setSimulateVenue}
                      className="scale-90 data-[state=checked]:bg-amber-500"
                    />
                  </div>
                  {simulateVenue && (
                    <div className="text-[10px] text-amber-400 bg-amber-500/10 rounded px-2 py-1">
                      📍 Simulating: {simulatedVenue.name}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>

      {/* Broadcast Overlay - Full Screen Glow Mode - MOBILE OPTIMIZED */}
      {broadcastActive && (
        <div
          className={`fixed inset-0 ${getBroadcastColor()} flex items-center justify-center`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            minHeight: '100vh',
            minWidth: '100vw',
            zIndex: 99999,
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          {/* KILL SWITCH - FIXED TOP-RIGHT - ALWAYS VISIBLE */}
          <button
            onClick={() => setBroadcastActive(false)}
            className="fixed top-4 right-4 flex items-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all active:scale-95 border-2 border-white/30"
            style={{
              zIndex: 100000,
              minHeight: '48px',
              minWidth: '140px',
            }}
          >
            <X className="w-5 h-5" />
            <span>KILL</span>
          </button>
          
          {/* Main Content Area */}
          <div className="flex flex-col items-center justify-center w-full h-full px-6">
            {/* Custom Message - PRIORITY DISPLAY */}
            {broadcastMessage.trim() ? (
              <div className="flex flex-col items-center justify-center gap-4 max-w-[90vw]">
                {/* Large Custom Message - HIGH CONTRAST */}
                <span 
                  className="text-white text-3xl sm:text-4xl md:text-6xl font-bold text-center leading-tight tracking-wide break-words drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                  style={{
                    textShadow: '0 4px 20px rgba(0,0,0,0.4), 0 2px 10px rgba(0,0,0,0.3)',
                    wordBreak: 'break-word',
                    maxWidth: '100%',
                  }}
                >
                  {broadcastMessage}
                </span>
                
                {/* Suppressed Watermark - 5% opacity */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 opacity-[0.05]">
                  {currentVenue ? (
                    <div className="flex items-center gap-2">
                      <Crown className="w-6 h-6 text-white" />
                      <span className="text-white text-xs font-bold tracking-widest">{currentVenue.name.toUpperCase()}</span>
                    </div>
                  ) : (
                    <Ghost className="w-12 h-12 text-white" />
                  )}
                </div>
              </div>
            ) : (
              /* No Custom Message - MAXIMIZE Watermark */
              <div className="flex flex-col items-center justify-center gap-4">
                {currentVenue ? (
                  /* Venue Branding - Large */
                  <>
                    <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full border-4 border-white/20 flex items-center justify-center">
                      <Crown className="w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52 text-white opacity-30" />
                    </div>
                    <span className="text-white/30 text-xl sm:text-2xl md:text-4xl font-bold tracking-widest text-center">
                      {currentVenue.name.toUpperCase()}
                    </span>
                    <span className="text-white/20 text-xs sm:text-sm md:text-base tracking-wider">VALID™ VERIFIED</span>
                  </>
                ) : (
                  /* Default Ghost Logo - Large */
                  <>
                    <Ghost className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 text-white opacity-25" />
                    <span className="text-white/25 text-xl sm:text-2xl md:text-4xl font-bold tracking-widest">VALID™</span>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Venue indicator badge - Only when no custom message */}
          {currentVenue && !broadcastMessage.trim() && (
            <div className="fixed top-4 left-4 flex items-center gap-2 px-3 py-2 bg-white/10 rounded-full backdrop-blur-sm" style={{ zIndex: 100000 }}>
              <Building2 className="w-4 h-4 text-white/60" />
              <span className="text-white/60 text-xs sm:text-sm font-medium">{currentVenue.name}</span>
            </div>
          )}
          
          {/* Signal Mode Indicator */}
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/20 rounded-full backdrop-blur-sm" style={{ zIndex: 100000 }}>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
              {selectedMode} MODE
            </span>
          </div>
        </div>
      )}

      {/* 18+ Age Warning Modal */}
      <AlertDialog open={showAgeWarning} onOpenChange={setShowAgeWarning}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground flex items-center gap-2">
              <span className="text-2xl">🔞</span> Age Verification Required
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This mode contains adult content intended for users 18 years or older. By continuing, you confirm that you are at least 18 years of age and consent to viewing mature content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={handleCancelAge}
              className="bg-muted text-foreground border-border hover:bg-accent"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmAge}
              className="bg-[#581C87] text-white hover:bg-[#581C87]/90"
            >
              I am 18+ - Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MySignalSection;
