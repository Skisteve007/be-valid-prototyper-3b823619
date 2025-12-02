import { UseFormSetValue, UseFormRegister } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Home, MapPin, Cake, Users, Mail, Camera, Heart, Lock, Unlock, Target, CheckCircle, Upload } from "lucide-react";
import { useRef, useState } from "react";

interface PersonalInfoSectionProps {
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  genderIdentity: string;
  sexualOrientation: string;
  profileImageUrl: string;
  uploadingImage: boolean;
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
}

export const PersonalInfoSection = ({
  register,
  setValue,
  genderIdentity,
  sexualOrientation,
  profileImageUrl,
  uploadingImage,
  handleImageUpload,
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
}: PersonalInfoSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const labLogoInputRef = useRef<HTMLInputElement>(null);
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - 18 - i).toString());
  
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
  
  // Get a seeking preference from user interests
  const getSeekingPreference = () => {
    if (!userInterests) return null;
    
    // Try to get from "Specific Activities" first
    const specificActivities = userInterests["Specific Activities"];
    if (specificActivities && specificActivities.length > 0) {
      return specificActivities[0];
    }
    
    // Fall back to any other category
    for (const category in userInterests) {
      if (userInterests[category] && userInterests[category].length > 0) {
        return userInterests[category][0];
      }
    }
    
    return null;
  };
  
  const age = calculateAge();
  const seekingPreference = getSeekingPreference();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold border-b pb-2">
        <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Personal Quick Share Info</span>
      </h3>
      
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
          <div className="relative flex flex-col md:flex-row items-start gap-4 md:gap-6 p-4 md:p-6 rounded-lg border-2 border-blue-500/30 bg-background/50 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2 w-full md:w-auto">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-blue-500/50 shadow-lg shadow-blue-500/30">
                <AvatarImage src={profileImageUrl} />
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
                  className="h-7 px-2 text-xs"
                >
                  <Camera className="w-3 h-3 mr-1" />
                  {uploadingImage ? "..." : "Change"}
                </Button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </div>
            
            {profileImageUrl ? (
              <div className="flex-1 space-y-2 md:space-y-3 pt-0 md:pt-2 w-full">
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
                </div>
                
                {emailShareable === true && email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-muted-foreground">{email}</span>
                  </div>
                )}
                
                {emailShareable === false && (
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-muted-foreground italic">Email Private</span>
                  </div>
                )}
                
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
                  {relationshipStatus && (
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-pink-500" />
                      <span className="text-muted-foreground">{relationshipStatus}</span>
                    </div>
                  )}
                </div>
                
                {seekingPreference && (
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium">
                      Seeking: <span className="text-muted-foreground">{seekingPreference}</span>
                    </span>
                  </div>
                )}
                
                {/* Lab Certified Section - Always visible with status badge */}
                <div className="mt-3 p-3 rounded-lg border-2 border-cyan-500/30 bg-cyan-500/5">
                  <div className="flex items-stretch gap-4">
                    {/* Left side - Lab certification status */}
                    <div className="flex-1 flex flex-col justify-center space-y-2">
                      <div className="flex items-center gap-2">
                        {isAdmin ? (
                          <Checkbox
                            id="lab_certified"
                            checked={labCertified}
                            onCheckedChange={(checked) => onLabCertifiedChange?.(checked as boolean)}
                          />
                        ) : (
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            labCertified 
                              ? 'border-green-500 bg-green-500' 
                              : 'border-gray-400 bg-gray-200'
                          }`}>
                            {labCertified && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                        )}
                        <Label htmlFor="lab_certified" className={`text-sm font-semibold text-cyan-600 flex items-center gap-1.5 ${isAdmin ? 'cursor-pointer' : 'cursor-default'}`}>
                          <CheckCircle className="w-4 h-4" />
                          Lab Certified
                        </Label>
                      </div>
                      
                      {labCertified ? (
                        <Badge className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/50 w-fit">
                          ✓ Certified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-gray-200 text-gray-600 border border-gray-300 w-fit">
                          Not Certified
                        </Badge>
                      )}
                      
                      <p className="text-xs text-muted-foreground italic">
                        Lab certification approved through lab testing only, not by member.
                      </p>
                    </div>
                    
                    {/* Right side - Lab Logo centered */}
                    <div className="flex flex-col items-center justify-center gap-1 min-w-[80px]">
                      <div className="w-16 h-16 rounded border-2 border-cyan-500/50 bg-white flex items-center justify-center overflow-hidden shadow-md">
                        {labLogoUrl ? (
                          <img 
                            src={labLogoUrl} 
                            alt="Testing Lab" 
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-xs text-gray-400 text-center px-1">Lab Logo</span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-cyan-600">Testing Lab</span>
                      {isAdmin && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => labLogoInputRef.current?.click()}
                          disabled={uploadingLabLogo}
                          className="h-6 px-2 text-xs"
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          {uploadingLabLogo ? "..." : "Upload"}
                        </Button>
                      )}
                    </div>
                    
                    {isAdmin && (
                      <input
                        ref={labLogoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onLabLogoUpload}
                        disabled={uploadingLabLogo}
                        className="hidden"
                      />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="max-w-xs"
                />
                {uploadingImage && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
              </div>
            )}
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

      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-500" />
          I Identify As *
        </Label>
        <div className="flex gap-2">
          {["Male", "Female", "Transgender"].map((gender) => (
            <Button
              key={gender}
              type="button"
              variant={genderIdentity === gender ? "default" : "outline"}
              onClick={() => setValue("gender_identity", gender)}
            >
              {gender}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Sexual Orientation *</Label>
        <div className="flex flex-wrap gap-2">
          {["Gay", "Bi", "Straight", "Pansexual", "Asexual"].map((orientation) => (
            <Button
              key={orientation}
              type="button"
              variant={sexualOrientation === orientation ? "default" : "outline"}
              onClick={() => setValue("sexual_orientation", orientation)}
            >
              {orientation}
            </Button>
          ))}
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
            <SelectItem value="In a Relationship">In a Relationship</SelectItem>
            <SelectItem value="Married">Married</SelectItem>
            <SelectItem value="Open Relationship">Open Relationship</SelectItem>
            <SelectItem value="It's Complicated">It's Complicated</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
