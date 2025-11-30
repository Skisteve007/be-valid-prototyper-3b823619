import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, FileText, UserCheck, QrCode } from "lucide-react";
import { PersonalInfoSection } from "./profile/PersonalInfoSection";
import { PreferencesHealthSection } from "./profile/PreferencesHealthSection";
import { SocialMediaSection } from "./profile/SocialMediaSection";
import { PreferencesSelector } from "./profile/PreferencesSelector";
import { InterestsSelector } from "./profile/InterestsSelector";

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
  user_interests: Record<string, string[]>;
  health_document_url?: string;
  disclaimer_accepted: boolean;
}

const ProfileTab = ({ userId }: ProfileTabProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [userInterests, setUserInterests] = useState<Record<string, string[]>>({});
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [statusColor, setStatusColor] = useState<"green" | "yellow" | "red">("green");

  const { register, handleSubmit, setValue, watch } = useForm<ProfileFormData>({
    defaultValues: {
      partner_preferences: [],
      covid_vaccinated: false,
      smoker: false,
      user_interests: {},
      disclaimer_accepted: false,
    }
  });

  const genderIdentity = watch("gender_identity");
  const sexualOrientation = watch("sexual_orientation");
  const partnerPreferences = watch("partner_preferences");
  const covidVaccinated = watch("covid_vaccinated");
  const circumcised = watch("circumcised");
  const smoker = watch("smoker");

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
        setValue("user_interests", (data.user_interests as Record<string, string[]>) || {});
        setValue("disclaimer_accepted", data.disclaimer_accepted || false);
        
        setProfileImageUrl(data.profile_image_url || "");
        setUserInterests((data.user_interests as Record<string, string[]>) || {});
        setSelectedInterests((data.selected_interests as string[]) || []);
        setStatusColor((data.status_color as "green" | "yellow" | "red") || "green");
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


  const onSubmit = async (data: ProfileFormData) => {
    if (!profileImageUrl) {
      toast.error("Profile photo is required");
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
          user_interests: userInterests,
          selected_interests: selectedInterests,
          status_color: statusColor,
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 py-4">
      <PersonalInfoSection
        register={register}
        setValue={setValue}
        genderIdentity={genderIdentity}
        sexualOrientation={sexualOrientation}
        profileImageUrl={profileImageUrl}
        uploadingImage={uploadingImage}
        handleImageUpload={handleImageUpload}
      />

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 rounded-full opacity-60"></div>
        </div>
      </div>

      <PreferencesHealthSection
        setValue={setValue}
        partnerPreferences={partnerPreferences}
        covidVaccinated={covidVaccinated}
        circumcised={circumcised}
        smoker={smoker}
      />

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gradient-to-r from-pink-500 via-purple-400 to-pink-500 rounded-full opacity-60"></div>
        </div>
      </div>

      <PreferencesSelector
        selectedPreferences={userInterests}
        onPreferencesChange={setUserInterests}
      />

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 rounded-full opacity-60"></div>
        </div>
      </div>

      <InterestsSelector
        selectedInterests={selectedInterests}
        onInterestsChange={setSelectedInterests}
      />

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gradient-to-r from-indigo-500 via-blue-400 to-indigo-500 rounded-full opacity-60"></div>
        </div>
      </div>

      <SocialMediaSection register={register} />

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gradient-to-r from-green-500 via-lime-400 to-green-500 rounded-full opacity-60"></div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          QR Code Status Color
        </h3>
        <div className="space-y-4">
          <Label>Choose your status color (appears as a glow around your QR code)</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setStatusColor("green")}
              className={`p-4 rounded-lg border-2 transition-all ${
                statusColor === "green"
                  ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/50"
                  : "border-border hover:border-green-500/50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-green-500 shadow-[0_0_20px_8px_rgba(34,197,94,0.6)]"></div>
                <span className="font-semibold">Clean</span>
                <span className="text-sm text-muted-foreground text-center">Recently verified and cleared</span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setStatusColor("yellow")}
              className={`p-4 rounded-lg border-2 transition-all ${
                statusColor === "yellow"
                  ? "border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/50"
                  : "border-border hover:border-yellow-500/50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-yellow-500 shadow-[0_0_20px_8px_rgba(234,179,8,0.6)]"></div>
                <span className="font-semibold">Proceed with Caution</span>
                <span className="text-sm text-muted-foreground text-center">Verification in progress or pending</span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setStatusColor("red")}
              className={`p-4 rounded-lg border-2 transition-all ${
                statusColor === "red"
                  ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/50"
                  : "border-border hover:border-red-500/50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-red-500 shadow-[0_0_20px_8px_rgba(239,68,68,0.6)]"></div>
                <span className="font-semibold">Be Aware</span>
                <span className="text-sm text-muted-foreground text-center">Requires attention or update needed</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 rounded-full opacity-60"></div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-green-500" />
          STD Acknowledgment
        </h3>
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

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500 rounded-full opacity-60"></div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-500" />
          References
        </h3>
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

      <div className="relative">
        {!saving && profileImageUrl && (
          <>
            <div className="absolute inset-0 bg-green-500/40 blur-2xl rounded-lg animate-pulse"></div>
            <div className="absolute inset-0 bg-green-400/30 blur-xl rounded-lg"></div>
          </>
        )}
        <div className="relative flex gap-4">
          <Button 
            type="submit" 
            disabled={saving || !profileImageUrl} 
            className={`flex-1 transition-all duration-300 ${
              !saving && profileImageUrl 
                ? 'shadow-lg shadow-green-500/50 hover:shadow-xl hover:shadow-green-500/60 ring-2 ring-green-400/50' 
                : ''
            }`}
          >
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
      </div>
    </form>
  );
};

export default ProfileTab;
