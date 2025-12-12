import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Users, Activity, Zap, Ghost, Radio, MapPin, Clock, MapPinOff, Navigation, Share2, Copy, Check } from "lucide-react";
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

type SignalMode = "social" | "pulse" | "thrill" | "afterdark" | "location" | null;
type LocationType = "live" | "static" | null;

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

// Live location durations
const LOCATION_DURATIONS = [
  { value: "0.033", label: "Ghosted", sublabel: "2 sec" },
  { value: "15", label: "15 Minutes" },
  { value: "60", label: "1 Hour" },
  { value: "360", label: "6 Hours" },
  { value: "720", label: "12 Hours" },
];

// Static location durations (1-hour intervals only)
const STATIC_DURATIONS = [
  { value: "60", label: "1 Hour" },
  { value: "120", label: "2 Hours" },
  { value: "180", label: "3 Hours" },
  { value: "240", label: "4 Hours" },
];

const MySignalSection = ({ vibeMetadata, onVibeMetadataChange, onStatusColorChange }: MySignalSectionProps) => {
  const [selectedMode, setSelectedMode] = useState<SignalMode>(vibeMetadata?.mode || null);
  const [showAgeWarning, setShowAgeWarning] = useState(false);
  const [pendingMode, setPendingMode] = useState<SignalMode>(null);
  const [localMetadata, setLocalMetadata] = useState<Record<string, any>>(vibeMetadata || {});
  const [locationDuration, setLocationDuration] = useState<string | null>(null);
  const [locationActive, setLocationActive] = useState(false);
  const [locationExpiry, setLocationExpiry] = useState<Date | null>(null);
  const [locationType, setLocationType] = useState<LocationType>(null);
  const [fuzzyLocation, setFuzzyLocation] = useState(false);
  const [staticAddress, setStaticAddress] = useState("");
  const [staticDuration, setStaticDuration] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

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
      case "location":
        onStatusColorChange("red");
        break;
      default:
        onStatusColorChange("gray");
    }
  };

  const activateLocationShare = () => {
    if (locationType === "live" && !locationDuration) return;
    if (locationType === "static" && (!staticAddress || !staticDuration)) return;
    
    const durationMinutes = locationType === "live" 
      ? parseFloat(locationDuration!) 
      : parseInt(staticDuration!);
    const expiry = new Date(Date.now() + durationMinutes * 60 * 1000);
    setLocationExpiry(expiry);
    setLocationActive(true);
    
    const newMetadata = { 
      ...localMetadata, 
      mode: "location",
      location_type: locationType,
      location_duration: durationMinutes,
      location_expiry: expiry.toISOString(),
      fuzzy_location: fuzzyLocation,
      static_address: locationType === "static" ? staticAddress : null
    };
    setLocalMetadata(newMetadata);
    onVibeMetadataChange(newMetadata);
    onStatusColorChange("red");
    
    toast.success(
      locationType === "live" 
        ? `Live location sharing activated for ${durationMinutes < 1 ? '2 seconds' : durationMinutes + ' minutes'}`
        : `Static location set for ${durationMinutes / 60} hour(s)`
    );
  };

  const deactivateLocationShare = () => {
    setLocationActive(false);
    setLocationExpiry(null);
    setLocationDuration(null);
    setLocationType(null);
    setStaticAddress("");
    setStaticDuration(null);
    setFuzzyLocation(false);
    
    const newMetadata = { 
      ...localMetadata, 
      mode: null,
      location_type: null,
      location_duration: null,
      location_expiry: null,
      fuzzy_location: null,
      static_address: null
    };
    setLocalMetadata(newMetadata);
    onVibeMetadataChange(newMetadata);
    onStatusColorChange("gray");
    setSelectedMode(null);
  };

  // Generate shareable map links
  const generateMapLinks = (address: string) => {
    const encoded = encodeURIComponent(address);
    return {
      google: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
      apple: `https://maps.apple.com/?q=${encoded}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`📍 My location: ${address}\n\nGoogle Maps: https://www.google.com/maps/search/?api=1&query=${encoded}`)}`
    };
  };

  const copyMapLink = async (type: string, link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(type);
      toast.success(`${type} link copied!`);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
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
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-cyan-400">MY SIGNAL</h3>
              <span className="text-xs text-cyan-400/80">• Select a signal mode to customize your vibe</span>
            </div>
          </div>

          {/* 5-Button Grid with Descriptions */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* SOCIAL Button */}
            <button
              type="button"
              onClick={() => handleModeSelect("social")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedMode === "social"
                  ? "border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                  : "border-cyan-400/50 bg-card hover:border-cyan-400 hover:bg-cyan-500/10"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-1000 ${
                  selectedMode === "social" ? "bg-cyan-500 animate-[breathe-cyan_2s_ease-in-out_infinite]" : "bg-cyan-500/20"
                }`}
                style={selectedMode === "social" ? {
                  animation: "breathe-cyan 2s ease-in-out infinite",
                } : undefined}
              >
                <Users className={`w-6 h-6 ${selectedMode === "social" ? "text-white" : "text-cyan-400"}`} />
              </div>
              <span className="font-semibold text-foreground">SOCIAL</span>
              <p className="text-xs text-muted-foreground text-center leading-snug mt-1">
                Open to connect. Share contacts and socials with one scan.
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
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedMode === "pulse"
                  ? "border-green-400 bg-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                  : "border-green-400/50 bg-card hover:border-green-400 hover:bg-green-500/10"
              }`}
            >
              <div className="relative flex items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-1000 ${
                    selectedMode === "pulse" ? "bg-green-500" : "bg-green-500/20"
                  }`}
                  style={selectedMode === "pulse" ? {
                    animation: "breathe-green 2s ease-in-out infinite",
                  } : undefined}
                >
                  <Activity className={`w-6 h-6 ${selectedMode === "pulse" ? "text-white" : "text-green-400"}`} />
                </div>
                <span className="text-[9px] font-bold text-green-400 bg-green-500/20 px-1.5 py-0.5 rounded-full border border-green-400/50">18+</span>
              </div>
              <span className="font-semibold text-foreground">PULSE</span>
              <p className="text-xs text-muted-foreground text-center leading-snug">
                High energy. Broadcast your preferences and health verified badge.
              </p>
            </button>

            {/* THRILL Button */}
            <button
              type="button"
              onClick={() => handleModeSelect("thrill")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedMode === "thrill"
                  ? "border-orange-400 bg-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                  : "border-orange-400/50 bg-card hover:border-orange-400 hover:bg-orange-500/10"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-1000 ${
                  selectedMode === "thrill" ? "bg-orange-500" : "bg-orange-500/20"
                }`}
                style={selectedMode === "thrill" ? {
                  animation: "breathe-orange 2s ease-in-out infinite",
                } : undefined}
              >
                <Zap className={`w-6 h-6 ${selectedMode === "thrill" ? "text-white" : "text-orange-400"}`} />
              </div>
              <span className="font-semibold text-foreground">THRILL</span>
              <p className="text-xs text-muted-foreground text-center leading-snug mt-1">
                Adventure ready. Payments pre-loaded and identity verification.
              </p>
            </button>

            {/* AFTER DARK Button */}
            <button
              type="button"
              onClick={() => handleModeSelect("afterdark")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedMode === "afterdark"
                  ? "border-purple-400 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  : "border-purple-400/50 bg-card hover:border-purple-400 hover:bg-purple-500/10"
              }`}
            >
              <div className="relative flex items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-1000 ${
                    selectedMode === "afterdark" ? "bg-purple-500" : "bg-purple-500/20"
                  }`}
                  style={selectedMode === "afterdark" ? {
                    animation: "breathe-purple 2s ease-in-out infinite",
                  } : undefined}
                >
                  <Ghost className={`w-6 h-6 ${selectedMode === "afterdark" ? "text-white" : "text-purple-400"}`} />
                </div>
                <span className="text-[9px] font-bold text-purple-400 bg-purple-500/20 px-1.5 py-0.5 rounded-full border border-purple-400/50">18+</span>
              </div>
              <span className="font-semibold text-foreground">AFTER DARK</span>
              <p className="text-xs text-muted-foreground text-center leading-snug">
                Entertainment access. Zero data exposed. Flow through entry.
              </p>
            </button>

            {/* LIVE LOCATION PULSE Button */}
            <button
              type="button"
              onClick={() => handleModeSelect("location")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                selectedMode === "location"
                  ? "border-red-400 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                  : "border-red-400/50 bg-card hover:border-red-400 hover:bg-red-500/10"
              }`}
            >
              <div className="relative flex items-center gap-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-1000 ${
                    selectedMode === "location" ? "bg-red-500" : "bg-red-500/20"
                  }`}
                  style={selectedMode === "location" ? {
                    animation: "breathe-red 2s ease-in-out infinite",
                  } : undefined}
                >
                  <MapPin className={`w-6 h-6 ${selectedMode === "location" ? "text-white" : "text-red-400"}`} />
                </div>
                {locationActive && (
                  <span className="text-[9px] font-bold text-red-400 bg-red-500/20 px-1.5 py-0.5 rounded-full border border-red-400/50 animate-pulse">LIVE</span>
                )}
              </div>
              <span className="font-semibold text-foreground text-xs">LOCATION PULSE</span>
              <p className="text-xs text-muted-foreground text-center leading-snug">
                Share live location. Time-limited encrypted token.
              </p>
            </button>
          </div>

          {/* Location Pulse Controls - Compact & Sleek */}
          {selectedMode === "location" && (
            <div className="mt-3 p-3 rounded-lg border border-red-400/30 bg-red-500/5 animate-fade-in">
              {!locationActive ? (
                <div className="space-y-3">
                  {/* Compact Type Toggle */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setLocationType("live"); setStaticAddress(""); setStaticDuration(null); }}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        locationType === "live"
                          ? "bg-red-500/20 text-red-400 border border-red-400"
                          : "bg-card border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Live
                    </button>
                    <button
                      type="button"
                      onClick={() => { setLocationType("static"); setLocationDuration(null); }}
                      className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                        locationType === "static"
                          ? "bg-red-500/20 text-red-400 border border-red-400"
                          : "bg-card border border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <MapPinOff className="w-3.5 h-3.5" />
                      Static
                    </button>
                  </div>

                  {/* Live Location - Compact */}
                  {locationType === "live" && (
                    <div className="space-y-2 animate-fade-in">
                      {/* Fuzzy Toggle - Inline */}
                      <div className="flex items-center justify-between py-1.5 px-2 rounded bg-card/50 border border-border">
                        <span className="text-xs text-foreground flex items-center gap-1.5">
                          <MapPinOff className="w-3 h-3 text-amber-400" />
                          Fuzzy (~1mi)
                        </span>
                        <Switch
                          checked={fuzzyLocation}
                          onCheckedChange={setFuzzyLocation}
                          className="scale-75 data-[state=checked]:bg-amber-500"
                        />
                      </div>

                      {/* Duration Pills - Compact */}
                      <div className="flex flex-wrap gap-1.5">
                        {LOCATION_DURATIONS.map((d) => (
                          <button
                            key={d.value}
                            type="button"
                            onClick={() => setLocationDuration(d.value)}
                            className={`py-1.5 px-2.5 rounded text-xs transition-all ${
                              locationDuration === d.value
                                ? "bg-red-500 text-white"
                                : "bg-card border border-border text-foreground hover:border-red-400/50"
                            } ${d.value === "0.033" ? "text-purple-400 font-semibold" : ""}`}
                          >
                            {d.sublabel || d.label}
                          </button>
                        ))}
                      </div>

                      <Button
                        onClick={activateLocationShare}
                        disabled={!locationDuration}
                        size="sm"
                        className="w-full h-8 bg-red-500 hover:bg-red-600 text-white text-xs disabled:opacity-50"
                      >
                        {locationDuration === "0.033" ? "👻 Go Ghosted" : "Activate"}
                      </Button>
                    </div>
                  )}

                  {/* Static Location - Compact */}
                  {locationType === "static" && (
                    <div className="space-y-2 animate-fade-in">
                      <Input
                        value={staticAddress}
                        onChange={(e) => setStaticAddress(e.target.value)}
                        placeholder="Enter address..."
                        className="h-8 text-xs bg-background border-border"
                      />

                      {/* Fuzzy Toggle - Inline */}
                      <div className="flex items-center justify-between py-1.5 px-2 rounded bg-card/50 border border-border">
                        <span className="text-xs text-foreground flex items-center gap-1.5">
                          <MapPinOff className="w-3 h-3 text-amber-400" />
                          Fuzzy Area
                        </span>
                        <Switch
                          checked={fuzzyLocation}
                          onCheckedChange={setFuzzyLocation}
                          className="scale-75 data-[state=checked]:bg-amber-500"
                        />
                      </div>

                      {/* Duration Pills */}
                      <div className="flex gap-1.5">
                        {STATIC_DURATIONS.map((d) => (
                          <button
                            key={d.value}
                            type="button"
                            onClick={() => setStaticDuration(d.value)}
                            className={`flex-1 py-1.5 rounded text-xs transition-all ${
                              staticDuration === d.value
                                ? "bg-red-500 text-white"
                                : "bg-card border border-border text-foreground hover:border-red-400/50"
                            }`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>

                      <Button
                        onClick={activateLocationShare}
                        disabled={!staticAddress || !staticDuration}
                        size="sm"
                        className="w-full h-8 bg-red-500 hover:bg-red-600 text-white text-xs disabled:opacity-50"
                      >
                        Set Location
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                /* Active State - Minimal */
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-red-400">
                        {locationType === "live" ? "Live" : "Static"}
                        {fuzzyLocation && <span className="ml-1 text-amber-400">(Fuzzy)</span>}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      Until {locationExpiry?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Share Links - Compact Row */}
                  {locationType === "static" && staticAddress && (
                    <div className="flex gap-1">
                      {Object.entries(generateMapLinks(staticAddress)).map(([type, link]) => (
                        <button
                          key={type}
                          onClick={() => copyMapLink(type, link)}
                          className="flex-1 py-1.5 rounded text-[10px] bg-card border border-border hover:bg-accent transition-all flex items-center justify-center gap-1"
                        >
                          {copiedLink === type ? <Check className="w-3 h-3 text-green-400" /> : <Share2 className="w-3 h-3" />}
                          <span className="capitalize">{type}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={deactivateLocationShare}
                    variant="ghost"
                    size="sm"
                    className="w-full h-7 text-xs text-red-400 hover:bg-red-500/10"
                  >
                    Stop Sharing
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Dynamic Dropdowns */}
          {selectedMode === "social" && renderSocialDropdowns()}
          {selectedMode === "pulse" && renderPulseDropdowns()}
          {selectedMode === "thrill" && renderThrillDropdowns()}
          {selectedMode === "afterdark" && renderAfterDarkDropdowns()}

        </CardContent>
      </Card>

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
