import { UseFormSetValue, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Home, MapPin, Cake, Users, Mail, Camera, Heart, Lock, Unlock, CheckCircle, Upload, Move, Activity, Zap, Ghost, Fingerprint, CreditCard, HeartPulse, FlaskConical } from "lucide-react";
import { useRef, useState } from "react";
import { ImageCropDialog } from "./ImageCropDialog";
import MemberBetaSurvey from "@/components/MemberBetaSurvey";
import { SportsTeamSelector } from "./SportsTeamSelector";

interface SelectedTeams {
  nfl: string[];
  nba: string[];
  nhl: string[];
  mlb: string[];
}

interface PersonalInfoSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  genderIdentity: string;
  sexualOrientation: string;
  profileImageUrl: string;
  uploadingImage: boolean;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCroppedImageUpload?: (blob: Blob) => void;
  fullName?: string;
  email?: string;
  whereFrom?: string;
  currentHomeCity?: string;
  relationshipStatus?: string;
  birthdayDay?: string;
  birthdayMonth?: string;
  birthdayYear?: string;
  userInterests?: Record<string, string[]>;
  emailShareable?: boolean;
  onEmailShareableChange?: (shareable: boolean) => void;
  memberId?: string;
  labCertified?: boolean;
  labLogoUrl?: string;
  onLabCertifiedChange?: (certified: boolean) => void;
  onLabLogoUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadingLabLogo?: boolean;
  isAdmin?: boolean;
  vibeMetadata?: Record<string, any>;
  // Share toggle states
  shareIdEnabled?: boolean;
  shareFundsEnabled?: boolean;
  shareBioEnabled?: boolean;
  shareToxEnabled?: boolean;
  onShareToggle?: (field: string, value: boolean) => void;
  userId?: string;
  // Sports teams
  selectedTeams?: SelectedTeams;
  onTeamsChange?: (teams: SelectedTeams) => void;
}

export const PersonalInfoSection = ({
  register,
  setValue,
  genderIdentity,
  sexualOrientation,
  profileImageUrl,
  uploadingImage,
  handleImageUpload,
  handleCroppedImageUpload,
  fullName,
  email,
  whereFrom,
  currentHomeCity,
  relationshipStatus,
  birthdayDay,
  birthdayMonth,
  birthdayYear,
  userInterests,
  emailShareable = false,
  onEmailShareableChange,
  memberId,
  labCertified = false,
  labLogoUrl,
  onLabCertifiedChange,
  onLabLogoUpload,
  uploadingLabLogo = false,
  isAdmin = false,
  vibeMetadata,
  shareIdEnabled = false,
  shareFundsEnabled = false,
  shareBioEnabled = false,
  shareToxEnabled = false,
  onShareToggle,
  userId,
  selectedTeams = { nfl: [], nba: [], nhl: [], mlb: [] },
  onTeamsChange,
}: PersonalInfoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCropDialog, setShowCropDialog] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null);
  
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - 18 - i).toString());

  // Handle file selection for cropping
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setTempImageUrl(url);
      setShowCropDialog(true);
    }
    // Reset the input
    if (event.target) {
      event.target.value = '';
    }
  };

  // Handle cropped image save
  const handleCropSave = (blob: Blob) => {
    if (handleCroppedImageUpload) {
      handleCroppedImageUpload(blob);
    } else {
      // Fallback: create a fake event with the blob
      const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const fakeEvent = {
        target: { files: dataTransfer.files }
      } as React.ChangeEvent<HTMLInputElement>;
      handleImageUpload(fakeEvent);
    }
    // Cleanup
    if (tempImageUrl) {
      URL.revokeObjectURL(tempImageUrl);
      setTempImageUrl(null);
    }
  };
  
  // Calculate age from birthday
  const calculateAge = () => {
    if (!birthdayDay || !birthdayMonth || !birthdayYear) return null;
    const today = new Date();
    const birthDate = new Date(parseInt(birthdayYear), parseInt(birthdayMonth) - 1, parseInt(birthdayDay));
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  
  const age = calculateAge();
  
  // Get signal mode icon and color
  const getSignalIcon = () => {
    const mode = vibeMetadata?.mode;
    if (!mode) return null;
    
    const iconConfig: Record<string, { icon: React.ReactNode; color: string; glow: string }> = {
      social: { 
        icon: <Users className="w-5 h-5" />, 
        color: "#2563EB",
        glow: "rgba(37,99,235,0.6)"
      },
      pulse: { 
        icon: <Activity className="w-5 h-5" />, 
        color: "#22C55E",
        glow: "rgba(34,197,94,0.6)"
      },
      thrill: { 
        icon: <Zap className="w-5 h-5" />, 
        color: "#F97316",
        glow: "rgba(249,115,22,0.6)"
      },
      afterdark: { 
        icon: <Ghost className="w-5 h-5" />, 
        color: "#9333EA",
        glow: "rgba(147,51,234,0.6)"
      },
    };
    
    return iconConfig[mode] || null;
  };
  
  const signalIcon = getSignalIcon();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
          <div className="relative flex flex-col p-4 md:p-6 rounded-lg border-2 border-blue-500/30 bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 border-b pb-2 mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold">
                  <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Personal Fun Quick Share</span>
                </h3>
                {signalIcon && (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center animate-pulse"
                    style={{ 
                      backgroundColor: signalIcon.color,
                      boxShadow: `0 0 20px 8px ${signalIcon.glow}`,
                      color: 'white'
                    }}
                  >
                    {signalIcon.icon}
                  </div>
                )}
                <MemberBetaSurvey userId={userId} />
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <div className="flex flex-col items-center gap-2 w-full md:w-auto">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-blue-500/50 shadow-lg shadow-blue-500/30">
                <AvatarImage src={profileImageUrl} className="object-cover" />
                <AvatarFallback className="bg-blue-500/10">
                  <User className="h-16 w-16 text-blue-500" />
                </AvatarFallback>
              </Avatar>
              
              {profileImageUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="h-6 px-1.5 text-[10px]"
                >
                  <Camera className="w-2.5 h-2.5 mr-0.5" />
                  {uploadingImage ? "..." : "Change"}
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploadingImage}
                className="hidden"
              />
            </div>
            
            {profileImageUrl ? (
              <>
                <div className="space-y-2 md:space-y-3 pt-0 md:pt-2">
                  {fullName && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-xl">{fullName}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    {memberId && (
                      <span className="text-sm font-medium text-muted-foreground">
                        Member: <span className="text-blue-500">{memberId}</span>
                      </span>
                    )}
                    {age && (
                      <span className="text-sm font-medium text-muted-foreground">
                        Age: <span className="text-blue-500">{age}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {genderIdentity && (
                      <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 border-blue-500/30">
                        {genderIdentity}
                      </Badge>
                    )}
                    {sexualOrientation && (
                      <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 border-purple-500/30">
                        {sexualOrientation}
                      </Badge>
                    )}
                    {relationshipStatus && (
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-pink-500" />
                        <span className="text-sm text-muted-foreground">{relationshipStatus}</span>
                      </div>
                    )}
                  </div>
                  
                  
                  <div className="flex items-center gap-4 flex-wrap text-sm">
                    {whereFrom && (
                      <div className="flex items-center gap-1">
                        <Home className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-muted-foreground">{whereFrom}</span>
                      </div>
                    )}
                    {currentHomeCity && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-muted-foreground">{currentHomeCity}</span>
                      </div>
                    )}
                </div>

                </div>
                
                {/* Share Icons Section - Right side on desktop */}
                <div className="hidden md:flex items-start gap-3">
                  {/* My Teams Selector - Sibling pill */}
                  <SportsTeamSelector 
                    selectedTeams={selectedTeams} 
                    onTeamsChange={onTeamsChange || (() => {})} 
                  />
                  
                  {/* Choose Your Share Section */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg border border-white/10 bg-white/5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">CHOOSE YOUR SHARE</p>
                    <div className="flex gap-2">
                    {/* ID Toggle */}
                    <button
                      type="button"
                      onClick={() => onShareToggle?.('share_id_enabled', !shareIdEnabled)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all active:scale-95 ${
                        shareIdEnabled 
                          ? 'bg-cyan-500/30 border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]' 
                          : 'bg-cyan-500/10 border border-cyan-400/30'
                      }`}
                    >
                      <Fingerprint className="w-5 h-5 text-cyan-400" />
                      <span className="text-[9px] font-bold text-cyan-400 tracking-wider">ID</span>
                      <div className="bg-black rounded p-0.5">
                        {shareIdEnabled ? (
                          <Unlock className="w-4 h-4 text-cyan-400" strokeWidth={3} />
                        ) : (
                          <Lock className="w-4 h-4 text-cyan-400" strokeWidth={3} />
                        )}
                      </div>
                    </button>
                    
                    {/* FUNDS Toggle */}
                    <button
                      type="button"
                      onClick={() => onShareToggle?.('share_funds_enabled', !shareFundsEnabled)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all active:scale-95 ${
                        shareFundsEnabled 
                          ? 'bg-green-500/30 border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                          : 'bg-green-500/10 border border-green-400/30'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-green-400" />
                      <span className="text-[9px] font-bold text-green-400 tracking-wider">FUNDS</span>
                      <div className="bg-black rounded p-0.5">
                        {shareFundsEnabled ? (
                          <Unlock className="w-4 h-4 text-green-400" strokeWidth={3} />
                        ) : (
                          <Lock className="w-4 h-4 text-green-400" strokeWidth={3} />
                        )}
                      </div>
                    </button>
                    
                    {/* BIO Toggle */}
                    <button
                      type="button"
                      onClick={() => onShareToggle?.('share_bio_enabled', !shareBioEnabled)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all active:scale-95 ${
                        shareBioEnabled 
                          ? 'bg-rose-500/30 border-2 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                          : 'bg-rose-500/10 border border-rose-400/30'
                      }`}
                    >
                      <HeartPulse className="w-5 h-5 text-rose-400" />
                      <span className="text-[9px] font-bold text-rose-400 tracking-wider">BIO</span>
                      <div className="bg-black rounded p-0.5">
                        {shareBioEnabled ? (
                          <Unlock className="w-4 h-4 text-rose-400" strokeWidth={3} />
                        ) : (
                          <Lock className="w-4 h-4 text-rose-400" strokeWidth={3} />
                        )}
                      </div>
                    </button>
                    
                    {/* TOX Toggle */}
                    <button
                      type="button"
                      onClick={() => onShareToggle?.('share_tox_enabled', !shareToxEnabled)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all active:scale-95 ${
                        shareToxEnabled 
                          ? 'bg-yellow-500/30 border-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                          : 'bg-yellow-500/10 border border-yellow-400/30'
                      }`}
                    >
                      <FlaskConical className="w-5 h-5 text-yellow-400" />
                      <span className="text-[9px] font-bold text-yellow-400 tracking-wider">TOX</span>
                      <div className="bg-black rounded p-0.5">
                        {shareToxEnabled ? (
                          <Unlock className="w-4 h-4 text-yellow-400" strokeWidth={3} />
                        ) : (
                          <Lock className="w-4 h-4 text-yellow-400" strokeWidth={3} />
                        )}
                      </div>
                    </button>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Share Icons Section */}
                <div className="md:hidden w-full mt-3 space-y-3">
                  {/* My Teams Selector - Sibling row on mobile */}
                  <div className="flex justify-center">
                    <SportsTeamSelector 
                      selectedTeams={selectedTeams} 
                      onTeamsChange={onTeamsChange || (() => {})} 
                    />
                  </div>
                  
                  {/* Choose Your Share Section */}
                  <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider text-center mb-2">CHOOSE YOUR SHARE</p>
                    <div className="grid grid-cols-4 gap-2">
                    {/* ID Toggle */}
                    <button
                      type="button"
                      onClick={() => onShareToggle?.('share_id_enabled', !shareIdEnabled)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all active:scale-95 ${
                        shareIdEnabled 
                          ? 'bg-cyan-500/30 border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]' 
                          : 'bg-cyan-500/10 border border-cyan-400/30'
                      }`}
                    >
                      <Fingerprint className="w-5 h-5 text-cyan-400" />
                      <span className="text-[9px] font-bold text-cyan-400 tracking-wider">ID</span>
                      <div className="bg-black rounded p-0.5">
                        {shareIdEnabled ? (
                          <Unlock className="w-4 h-4 text-cyan-400" strokeWidth={3} />
                        ) : (
                          <Lock className="w-4 h-4 text-cyan-400" strokeWidth={3} />
                        )}
                      </div>
                    </button>
                    
                    {/* FUNDS Toggle */}
                    <button
                      type="button"
                      onClick={() => onShareToggle?.('share_funds_enabled', !shareFundsEnabled)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all active:scale-95 ${
                        shareFundsEnabled 
                          ? 'bg-green-500/30 border-2 border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                          : 'bg-green-500/10 border border-green-400/30'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-green-400" />
                      <span className="text-[9px] font-bold text-green-400 tracking-wider">FUNDS</span>
                      <div className="bg-black rounded p-0.5">
                        {shareFundsEnabled ? (
                          <Unlock className="w-4 h-4 text-green-400" strokeWidth={3} />
                        ) : (
                          <Lock className="w-4 h-4 text-green-400" strokeWidth={3} />
                        )}
                      </div>
                    </button>
                    
                    {/* BIO Toggle */}
                    <button
                      type="button"
                      onClick={() => onShareToggle?.('share_bio_enabled', !shareBioEnabled)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all active:scale-95 ${
                        shareBioEnabled 
                          ? 'bg-rose-500/30 border-2 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                          : 'bg-rose-500/10 border border-rose-400/30'
                      }`}
                    >
                      <HeartPulse className="w-5 h-5 text-rose-400" />
                      <span className="text-[9px] font-bold text-rose-400 tracking-wider">BIO</span>
                      <div className="bg-black rounded p-0.5">
                        {shareBioEnabled ? (
                          <Unlock className="w-4 h-4 text-rose-400" strokeWidth={3} />
                        ) : (
                          <Lock className="w-4 h-4 text-rose-400" strokeWidth={3} />
                        )}
                      </div>
                    </button>
                    
                    {/* TOX Toggle */}
                    <button
                      type="button"
                      onClick={() => onShareToggle?.('share_tox_enabled', !shareToxEnabled)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all active:scale-95 ${
                        shareToxEnabled 
                          ? 'bg-yellow-500/30 border-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                          : 'bg-yellow-500/10 border border-yellow-400/30'
                      }`}
                    >
                      <FlaskConical className="w-5 h-5 text-yellow-400" />
                      <span className="text-[9px] font-bold text-yellow-400 tracking-wider">TOX</span>
                      <div className="bg-black rounded p-0.5">
                        {shareToxEnabled ? (
                          <Unlock className="w-4 h-4 text-yellow-400" strokeWidth={3} />
                        ) : (
                          <Lock className="w-4 h-4 text-yellow-400" strokeWidth={3} />
                        )}
                      </div>
                    </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-4">
                <div className="p-6 border-2 border-dashed border-blue-400/50 rounded-xl bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
                  <div className="flex flex-col items-center gap-3">
                    <Camera className="h-12 w-12 text-blue-500" />
                    <p className="text-sm font-medium text-center">Upload a Profile Photo</p>
                    <p className="text-xs text-muted-foreground text-center">Required to complete your profile</p>
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {uploadingImage ? (
                        <>Uploading...</>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Photo
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input id="full_name" {...register("full_name")} required placeholder="Sample Donor" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center justify-between">
            <span>Email Address *</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onEmailShareableChange?.(!emailShareable)}
              className="h-auto py-1 px-2"
            >
              {emailShareable ? (
                <Unlock className="w-4 h-4 text-green-500" />
              ) : (
                <Lock className="w-4 h-4 text-red-500" />
              )}
              <span className="text-xs ml-1">
                {emailShareable ? "Shareable" : "Private"}
              </span>
            </Button>
          </Label>
          {emailShareable ? (
            <>
              <Input id="email" type="email" {...register("email")} required placeholder="donor@cleancheck.com" />
              <p className="text-xs text-muted-foreground">
                Email will be shared when you share your QR code
              </p>
            </>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-md border border-red-500/30 bg-red-500/5">
              <Lock className="w-4 h-4 text-red-500" />
              <p className="text-sm text-muted-foreground">
                Email is private and hidden
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="where_from" className="flex items-center gap-2">
            <Home className="w-4 h-4 text-blue-500" />
            Where You From
          </Label>
          <Input id="where_from" {...register("where_from")} placeholder="Los Angeles, CA" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="current_home_city" className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-500" />
            Current Home City
          </Label>
          <Input id="current_home_city" {...register("current_home_city")} placeholder="Miami, FL" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Cake className="w-4 h-4 text-pink-500" />
          Birthday *
        </Label>
        <div className="grid grid-cols-3 gap-2">
          <Select 
            value={birthdayDay}
            onValueChange={(value) => setValue("birthday_day", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select 
            value={birthdayMonth}
            onValueChange={(value) => setValue("birthday_month", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, idx) => <SelectItem key={month} value={month}>{monthNames[idx]}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select 
            value={birthdayYear}
            onValueChange={(value) => setValue("birthday_year", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            I Identify As *
          </Label>
          <div className="flex flex-wrap gap-2">
            {["Male", "Female", "Gay"].map((gender) => (
              <Button
                key={gender}
                type="button"
                variant={genderIdentity === gender ? "default" : "outline"}
                onClick={() => setValue("gender_identity", gender)}
                size="sm"
              >
                {gender}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Sexual Orientation *</Label>
          <div className="flex flex-wrap gap-2">
            {["Straight", "Bi", "Asexual", "Pansexual"].map((orientation) => (
              <Button
                key={orientation}
                type="button"
                variant={sexualOrientation === orientation ? "default" : "outline"}
                onClick={() => setValue("sexual_orientation", orientation)}
                size="sm"
              >
                {orientation}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="relationship_status">Relationship Status *</Label>
        <Select onValueChange={(value) => setValue("relationship_status", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Single">Single</SelectItem>
            <SelectItem value="Dating">Dating</SelectItem>
            <SelectItem value="In a Relationship">In a Relationship</SelectItem>
            <SelectItem value="Married">Married</SelectItem>
            <SelectItem value="Open Relationship">Open Relationship</SelectItem>
            <SelectItem value="It's Complicated">It's Complicated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Image Crop Dialog */}
      {tempImageUrl && (
        <ImageCropDialog
          open={showCropDialog}
          onClose={() => {
            setShowCropDialog(false);
            if (tempImageUrl && !tempImageUrl.startsWith('http')) {
              URL.revokeObjectURL(tempImageUrl);
            }
            setTempImageUrl(null);
          }}
          imageUrl={tempImageUrl}
          onSave={handleCropSave}
        />
      )}
    </div>
  );
};
