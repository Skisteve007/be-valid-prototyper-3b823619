import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, FileText, UserCheck } from "lucide-react";
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

      <PreferencesHealthSection
        setValue={setValue}
        partnerPreferences={partnerPreferences}
        covidVaccinated={covidVaccinated}
        circumcised={circumcised}
        smoker={smoker}
      />

      <PreferencesSelector
        selectedPreferences={userInterests}
        onPreferencesChange={setUserInterests}
      />

      <InterestsSelector
        selectedInterests={selectedInterests}
        onInterestsChange={setSelectedInterests}
      />

      <SocialMediaSection register={register} />

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
          <FileText className="w-5 h-5" />
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

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
          <UserCheck className="w-5 h-5" />
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
