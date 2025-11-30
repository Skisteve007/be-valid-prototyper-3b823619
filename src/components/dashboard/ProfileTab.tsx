import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Upload, User } from "lucide-react";

interface ProfileTabProps {
  userId: string;
}

interface ProfileFormData {
  profile_image_url?: string;
  full_name: string;
  email: string;
  where_from: string;
  current_home_city: string;
  birthday_day: string;
  birthday_month: string;
  birthday_year: string;
  gender_identity: string;
  sexual_orientation: string;
  relationship_status: string;
  partner_preferences: string[];
  covid_vaccinated: boolean;
  circumcised?: boolean;
  smoker: boolean;
  instagram_handle: string;
  tiktok_handle: string;
  facebook_handle: string;
  onlyfans_handle: string;
  twitter_handle: string;
  std_acknowledgment: string;
  user_references: string;
  sexual_preferences: string;
  health_document_url?: string;
  disclaimer_accepted: boolean;
}

const ProfileTab = ({ userId }: ProfileTabProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [healthDocumentUrl, setHealthDocumentUrl] = useState<string>("");

  const { register, handleSubmit, setValue, watch } = useForm<ProfileFormData>({
    defaultValues: {
      partner_preferences: [],
      covid_vaccinated: false,
      smoker: false,
      disclaimer_accepted: false,
    }
  });

  const genderIdentity = watch("gender_identity");
  const sexualOrientation = watch("sexual_orientation");
  const partnerPreferences = watch("partner_preferences");
  const covidVaccinated = watch("covid_vaccinated");
  const circumcised = watch("circumcised");
  const smoker = watch("smoker");
  const disclaimerAccepted = watch("disclaimer_accepted");

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setValue("full_name", data.full_name || "");
        setValue("email", user?.email || "");
        setValue("where_from", data.where_from || "");
        setValue("current_home_city", data.current_home_city || "");
        
        if (data.birthday) {
          const date = new Date(data.birthday);
          setValue("birthday_day", date.getDate().toString());
          setValue("birthday_month", (date.getMonth() + 1).toString());
          setValue("birthday_year", date.getFullYear().toString());
        }
        
        setValue("gender_identity", data.gender_identity || "");
        setValue("sexual_orientation", data.sexual_orientation || "");
        setValue("relationship_status", data.relationship_status || "");
        setValue("partner_preferences", (data.partner_preferences as string[]) || []);
        setValue("covid_vaccinated", data.covid_vaccinated || false);
        setValue("circumcised", data.circumcised);
        setValue("smoker", data.smoker || false);
        setValue("instagram_handle", data.instagram_handle || "");
        setValue("tiktok_handle", data.tiktok_handle || "");
        setValue("facebook_handle", data.facebook_handle || "");
        setValue("onlyfans_handle", data.onlyfans_handle || "");
        setValue("twitter_handle", data.twitter_handle || "");
        setValue("std_acknowledgment", data.std_acknowledgment || "");
        setValue("user_references", data.user_references || "");
        setValue("sexual_preferences", data.sexual_preferences || "");
        setValue("disclaimer_accepted", data.disclaimer_accepted || false);
        
        setProfileImageUrl(data.profile_image_url || "");
        setHealthDocumentUrl(data.health_document_url || "");
      }
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/profile.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('sponsor-logos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('sponsor-logos')
        .getPublicUrl(filePath);

      setProfileImageUrl(publicUrl);
      toast.success("Profile photo uploaded");
    } catch (error: any) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingDocument(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/health-document.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('sponsor-logos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('sponsor-logos')
        .getPublicUrl(filePath);

      setHealthDocumentUrl(publicUrl);
      toast.success("Health document uploaded");
    } catch (error: any) {
      toast.error("Failed to upload document");
    } finally {
      setUploadingDocument(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!profileImageUrl) {
      toast.error("Profile photo is required");
      return;
    }

    if (!data.disclaimer_accepted) {
      toast.error("You must accept the disclaimer to continue");
      return;
    }

    setSaving(true);

    try {
      const birthday = data.birthday_year && data.birthday_month && data.birthday_day
        ? `${data.birthday_year}-${data.birthday_month.padStart(2, '0')}-${data.birthday_day.padStart(2, '0')}`
        : null;

      const { error } = await supabase
        .from("profiles")
        .update({
          profile_image_url: profileImageUrl,
          full_name: data.full_name,
          where_from: data.where_from,
          current_home_city: data.current_home_city,
          birthday,
          gender_identity: data.gender_identity,
          sexual_orientation: data.sexual_orientation,
          relationship_status: data.relationship_status,
          partner_preferences: data.partner_preferences,
          covid_vaccinated: data.covid_vaccinated,
          circumcised: data.circumcised,
          smoker: data.smoker,
          instagram_handle: data.instagram_handle,
          tiktok_handle: data.tiktok_handle,
          facebook_handle: data.facebook_handle,
          onlyfans_handle: data.onlyfans_handle,
          twitter_handle: data.twitter_handle,
          std_acknowledgment: data.std_acknowledgment,
          user_references: data.user_references,
          sexual_preferences: data.sexual_preferences,
          health_document_url: healthDocumentUrl || null,
          health_document_uploaded_at: healthDocumentUrl ? new Date().toISOString() : null,
          disclaimer_accepted: data.disclaimer_accepted,
        })
        .eq("user_id", userId);

      if (error) throw error;

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const togglePartnerPreference = (preference: string) => {
    const current = partnerPreferences || [];
    const updated = current.includes(preference)
      ? current.filter(p => p !== preference)
      : [...current, preference];
    setValue("partner_preferences", updated);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 100 }, (_, i) => (new Date().getFullYear() - 18 - i).toString());

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
      {/* Section 1: Personal Information & Locations */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Personal Information & Locations</h3>
        
        {/* Profile Photo */}
        <div className="space-y-2">
          <Label className="text-base">Profile Photo *</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileImageUrl} />
              <AvatarFallback><User className="h-12 w-12" /></AvatarFallback>
            </Avatar>
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="max-w-xs"
              />
              {uploadingImage && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input id="full_name" {...register("full_name")} required placeholder="Sample Donor" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" {...register("email")} required placeholder="donor@cleancheck.com" disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="where_from">🏠 Where You From</Label>
            <Input id="where_from" {...register("where_from")} placeholder="Los Angeles, CA" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_home_city">🌍 Current Home City</Label>
            <Input id="current_home_city" {...register("current_home_city")} placeholder="Miami, FL" />
          </div>
        </div>

        {/* Birthday */}
        <div className="space-y-2">
          <Label>🎂 Birthday *</Label>
          <div className="grid grid-cols-3 gap-2">
            <Select onValueChange={(value) => setValue("birthday_day", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                {days.map(day => <SelectItem key={day} value={day}>{day}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setValue("birthday_month", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, idx) => <SelectItem key={month} value={month}>{monthNames[idx]}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => setValue("birthday_year", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Gender Identity */}
        <div className="space-y-2">
          <Label>I Identify As *</Label>
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

        {/* Sexual Orientation */}
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

        {/* Relationship Status */}
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
              <SelectItem value="It's Complicated">It's Complicated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Section 2: Partner Preferences & Health */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Partner Preferences & Health</h3>
        
        <div className="space-y-3">
          <Label>Partner Preferences</Label>
          {["Men", "Women", "Couples", "Groups"].map((pref) => (
            <div key={pref} className="flex items-center space-x-2">
              <Checkbox
                checked={partnerPreferences?.includes(pref)}
                onCheckedChange={() => togglePartnerPreference(pref)}
              />
              <Label className="cursor-pointer">{pref}</Label>
            </div>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={covidVaccinated}
            onCheckedChange={(checked) => setValue("covid_vaccinated", checked as boolean)}
          />
          <Label className="cursor-pointer">COVID Vaccination Status</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={circumcised || false}
            onCheckedChange={(checked) => setValue("circumcised", checked as boolean)}
          />
          <Label className="cursor-pointer">Circumcised ✨</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            checked={smoker}
            onCheckedChange={(checked) => setValue("smoker", checked as boolean)}
          />
          <Label className="cursor-pointer">Smoker ✨</Label>
        </div>
      </div>

      {/* Section 3: Social Media */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Social Media Links</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="instagram_handle">Instagram</Label>
            <Input id="instagram_handle" {...register("instagram_handle")} placeholder="@username" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiktok_handle">TikTok</Label>
            <Input id="tiktok_handle" {...register("tiktok_handle")} placeholder="@username" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook_handle">Facebook</Label>
            <Input id="facebook_handle" {...register("facebook_handle")} placeholder="Profile URL" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="onlyfans_handle">OnlyFans</Label>
            <Input id="onlyfans_handle" {...register("onlyfans_handle")} placeholder="@username" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter_handle">X/Twitter</Label>
            <Input id="twitter_handle" {...register("twitter_handle")} placeholder="@username" />
          </div>
        </div>
      </div>

      {/* Section 4: STD Acknowledgment */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">STD Acknowledgment</h3>
        
        <div className="space-y-2">
          <Label htmlFor="std_acknowledgment">STD Status & Information</Label>
          <Textarea
            id="std_acknowledgment"
            {...register("std_acknowledgment")}
            rows={4}
            placeholder="Please provide any relevant health information..."
          />
        </div>
      </div>

      {/* Section 5: References */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">References</h3>
        
        <div className="space-y-2">
          <Label htmlFor="user_references">Reference Information</Label>
          <Textarea
            id="user_references"
            {...register("user_references")}
            rows={4}
            placeholder="Add reference contacts or information..."
          />
        </div>
      </div>

      {/* Section 6: Sexual Preferences */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Sexual Preferences</h3>
        
        <div className="space-y-2">
          <Label htmlFor="sexual_preferences">Your Preferences</Label>
          <Textarea
            id="sexual_preferences"
            {...register("sexual_preferences")}
            rows={4}
            placeholder="Describe your preferences..."
          />
        </div>
      </div>

      {/* Section 7: Health Document & Disclaimer */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2">Health Document & Disclaimer</h3>
        
        <div className="space-y-2">
          <Label>Health Document Upload</Label>
          <Input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleDocumentUpload}
            disabled={uploadingDocument}
          />
          {uploadingDocument && <p className="text-sm text-muted-foreground">Uploading...</p>}
          {healthDocumentUrl && (
            <p className="text-sm text-muted-foreground">Document uploaded successfully</p>
          )}
        </div>

        <div className="space-y-4 p-4 bg-muted rounded-lg">
          <p className="text-sm">
            By checking this box, I certify that all information provided is accurate and I understand that 
            Clean Check is a platform for sharing health information. I take full responsibility for the 
            accuracy of my information and understand the importance of maintaining up-to-date health records.
          </p>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={disclaimerAccepted}
              onCheckedChange={(checked) => setValue("disclaimer_accepted", checked as boolean)}
              required
            />
            <Label className="cursor-pointer">I accept the disclaimer and certify all information is accurate *</Label>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button type="submit" disabled={saving || !profileImageUrl} className="flex-1">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save & Close"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileTab;
