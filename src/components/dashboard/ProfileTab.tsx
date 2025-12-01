import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, FileText, UserCheck, QrCode, ExternalLink, CheckCircle, Lock, Unlock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PersonalInfoSection } from "./profile/PersonalInfoSection";
import { PreferencesHealthSection } from "./profile/PreferencesHealthSection";
import { SocialMediaSection } from "./profile/SocialMediaSection";
import { PreferencesSelector } from "./profile/PreferencesSelector";
import { InterestsSelector } from "./profile/InterestsSelector";

interface ProfileTabProps {
  userId: string;
  onUpdate?: () => void;
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

const ProfileTab = ({ userId, onUpdate }: ProfileTabProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [userInterests, setUserInterests] = useState<Record<string, string[]>>({});
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [statusColor, setStatusColor] = useState<"green" | "yellow" | "red" | "gray">("green");
  const [referenceIds, setReferenceIds] = useState<string[]>(["", "", ""]);
  const [referenceProfiles, setReferenceProfiles] = useState<Array<{id: string, user_id: string, full_name: string, member_id: string, verified?: boolean} | null>>([null, null, null]);
  const [existingReferences, setExistingReferences] = useState<string[]>([]);
  const [emailShareable, setEmailShareable] = useState(false);
  const [referencesLocked, setReferencesLocked] = useState(true);
  const [stdAcknowledgmentLocked, setStdAcknowledgmentLocked] = useState(true);
  const [memberId, setMemberId] = useState<string>("");
  
  // Track initial values for change detection
  const [initialProfileImageUrl, setInitialProfileImageUrl] = useState<string>("");
  const [initialStatusColor, setInitialStatusColor] = useState<"green" | "yellow" | "red" | "gray">("green");
  const [initialSelectedInterests, setInitialSelectedInterests] = useState<string[]>([]);
  const [initialReferenceIds, setInitialReferenceIds] = useState<string[]>(["", "", ""]);
  const [initialEmailShareable, setInitialEmailShareable] = useState(false);
  const [initialReferencesLocked, setInitialReferencesLocked] = useState(true);
  const [initialStdAcknowledgmentLocked, setInitialStdAcknowledgmentLocked] = useState(true);

  const { register, handleSubmit, setValue, watch, getValues, formState, reset } = useForm<ProfileFormData>({
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
  const fullName = watch("full_name");
  const email = watch("email");
  const whereFrom = watch("where_from");
  const currentHomeCity = watch("current_home_city");
  const relationshipStatus = watch("relationship_status");
  const birthdayDay = watch("birthday_day");
  const birthdayMonth = watch("birthday_month");
  const birthdayYear = watch("birthday_year");
  const instagramHandle = watch("instagram_handle");
  const tiktokHandle = watch("tiktok_handle");
  const facebookHandle = watch("facebook_handle");
  const onlyfansHandle = watch("onlyfans_handle");
  const twitterHandle = watch("twitter_handle");
  
  // Detect if any changes have been made
  const hasChanges = 
    formState.isDirty ||
    profileImageUrl !== initialProfileImageUrl ||
    statusColor !== initialStatusColor ||
    emailShareable !== initialEmailShareable ||
    referencesLocked !== initialReferencesLocked ||
    stdAcknowledgmentLocked !== initialStdAcknowledgmentLocked ||
    JSON.stringify(selectedInterests.sort()) !== JSON.stringify(initialSelectedInterests.sort()) ||
    JSON.stringify(referenceIds) !== JSON.stringify(initialReferenceIds);

  // Debug logging
  useEffect(() => {
    console.log("Change detection - isDirty:", formState.isDirty, "statusColor:", statusColor, "initial:", initialStatusColor, "hasChanges:", hasChanges);
  }, [formState.isDirty, statusColor, initialStatusColor, hasChanges]);

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
          // Parse date string manually to avoid timezone issues
          const [year, month, day] = data.birthday.split('-');
          setValue("birthday_day", parseInt(day).toString());
          setValue("birthday_month", parseInt(month).toString());
          setValue("birthday_year", parseInt(year).toString());
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
        setValue("sexual_preferences", data.sexual_preferences || "");
        
        // Parse user_references as JSON array or split by commas
        let refs = ["", "", ""];
        if (data.user_references) {
          try {
            const parsed = JSON.parse(data.user_references);
            if (Array.isArray(parsed)) {
              refs = [...parsed, "", "", ""].slice(0, 3);
            }
          } catch {
            // If not JSON, treat as comma-separated
            const split = data.user_references.split(',').map((s: string) => s.trim());
            refs = [...split, "", "", ""].slice(0, 3);
          }
        }
        setReferenceIds(refs);
        await loadReferenceProfiles(refs);
        await loadExistingReferences();
        setValue("user_interests", (data.user_interests as Record<string, string[]>) || {});
        setValue("disclaimer_accepted", data.disclaimer_accepted || false);
        
        setProfileImageUrl(data.profile_image_url || "");
        setUserInterests((data.user_interests as Record<string, string[]>) || {});
        setSelectedInterests((data.selected_interests as string[]) || []);
        setStatusColor((data.status_color as "green" | "yellow" | "red" | "gray") || "green");
        setEmailShareable(data.email_shareable || false);
        setReferencesLocked(data.references_locked !== false); // Default to true
        setStdAcknowledgmentLocked(data.std_acknowledgment_locked !== false); // Default to true
        setMemberId(data.member_id || "");
        
        // Set initial values for change detection
        setInitialProfileImageUrl(data.profile_image_url || "");
        setInitialStatusColor((data.status_color as "green" | "yellow" | "red" | "gray") || "green");
        setInitialSelectedInterests((data.selected_interests as string[]) || []);
        setInitialReferenceIds(refs);
        setInitialEmailShareable(data.email_shareable || false);
        setInitialReferencesLocked(data.references_locked !== false);
        setInitialStdAcknowledgmentLocked(data.std_acknowledgment_locked !== false);
        
        // Reset form state to mark as not dirty after loading
        setTimeout(() => {
          reset(undefined, { keepValues: true });
        }, 0);
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
        .from('profile-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      setProfileImageUrl(publicUrl);
      toast.success("Profile photo uploaded");
    } catch (error: any) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const loadExistingReferences = async () => {
    try {
      const { data, error } = await supabase
        .from("member_references")
        .select("referee_user_id")
        .eq("referrer_user_id", userId);

      if (error) throw error;
      
      setExistingReferences((data || []).map((ref: any) => ref.referee_user_id));
    } catch (error) {
      console.error("Failed to load existing references:", error);
    }
  };

  const loadReferenceProfiles = async (memberIds: string[]) => {
    const profiles = await Promise.all(
      memberIds.map(async (memberId) => {
        if (!memberId || memberId.trim() === "") return null;
        
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("id, user_id, full_name, member_id")
            .eq("member_id", memberId.trim())
            .maybeSingle();
          
          if (error || !data) return null;
          
          // Check if this reference is verified
          const { data: refData } = await supabase
            .from("member_references")
            .select("verified")
            .eq("referrer_user_id", userId)
            .eq("referee_user_id", data.user_id)
            .maybeSingle();
          
          return {
            ...data,
            verified: refData?.verified || false
          };
        } catch {
          return null;
        }
      })
    );
    setReferenceProfiles(profiles);
  };

  const handleReferenceIdChange = async (index: number, value: string) => {
    const newReferenceIds = [...referenceIds];
    newReferenceIds[index] = value;
    setReferenceIds(newReferenceIds);
    
    // Fetch profile for this member ID
    if (value.trim() !== "") {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, user_id, full_name, member_id")
          .eq("member_id", value.trim())
          .maybeSingle();
        
        if (error || !data) {
          const newProfiles = [...referenceProfiles];
          newProfiles[index] = null;
          setReferenceProfiles(newProfiles);
          return;
        }

        // Check if this reference is verified
        const { data: refData } = await supabase
          .from("member_references")
          .select("verified")
          .eq("referrer_user_id", userId)
          .eq("referee_user_id", data.user_id)
          .maybeSingle();
        
        const newProfiles = [...referenceProfiles];
        newProfiles[index] = {
          ...data,
          verified: refData?.verified || false
        };
        setReferenceProfiles(newProfiles);
      } catch {
        const newProfiles = [...referenceProfiles];
        newProfiles[index] = null;
        setReferenceProfiles(newProfiles);
      }
    } else {
      const newProfiles = [...referenceProfiles];
      newProfiles[index] = null;
      setReferenceProfiles(newProfiles);
    }
  };

  const performSave = async (data: ProfileFormData) => {
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
          user_references: JSON.stringify(referenceIds.filter(id => id.trim() !== "")),
          sexual_preferences: data.sexual_preferences,
          user_interests: userInterests,
          selected_interests: selectedInterests,
          status_color: statusColor,
          email_shareable: emailShareable,
          references_locked: referencesLocked,
          std_acknowledgment_locked: stdAcknowledgmentLocked,
        })
        .eq("user_id", userId);

      if (error) throw error;

      // Save reference relationships
      const validReferences = referenceProfiles.filter(p => p !== null) as Array<{id: string, user_id: string, full_name: string, member_id: string, verified?: boolean}>;
      
      // Delete references that are no longer in the list
      const currentRefereeIds = validReferences.map(p => p.user_id);
      const toDelete = existingReferences.filter(id => !currentRefereeIds.includes(id));
      
      if (toDelete.length > 0) {
        await supabase
          .from("member_references")
          .delete()
          .eq("referrer_user_id", userId)
          .in("referee_user_id", toDelete);
      }

      // Add new references
      for (const profile of validReferences) {
        if (!existingReferences.includes(profile.user_id)) {
          await supabase
            .from("member_references")
            .insert({
              referrer_user_id: userId,
              referee_user_id: profile.user_id,
              verified: false
            });
        }
      }

      toast.success("Profile updated successfully");
      
      // Reset initial values for change detection
      setInitialProfileImageUrl(profileImageUrl);
      setInitialStatusColor(statusColor);
      setInitialSelectedInterests([...selectedInterests]);
      setInitialReferenceIds([...referenceIds]);
      setInitialEmailShareable(emailShareable);
      setInitialReferencesLocked(referencesLocked);
      setInitialStdAcknowledgmentLocked(stdAcknowledgmentLocked);
      
      // Show success state
      setSaveSuccess(true);
      console.log("Save successful, showing green button");
      
      // Reset success state after 2 seconds
      setTimeout(() => {
        setSaveSuccess(false);
        console.log("Resetting save success state");
      }, 2000);
      
      // Notify parent component to refresh QR code
      if (onUpdate) {
        console.log("Calling onUpdate to refresh QR code");
        onUpdate();
      }
      
      // Reset form state to mark as not dirty after save
      setTimeout(() => {
        reset(undefined, { keepValues: true });
      }, 100);
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
      console.error("Save error:", error);
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    await performSave(data);
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
        fullName={fullName}
        email={email}
        whereFrom={whereFrom}
        currentHomeCity={currentHomeCity}
        relationshipStatus={relationshipStatus}
        birthdayDay={birthdayDay}
        birthdayMonth={birthdayMonth}
        birthdayYear={birthdayYear}
        userInterests={userInterests}
        emailShareable={emailShareable}
        onEmailShareableChange={setEmailShareable}
        memberId={memberId}
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

      <SocialMediaSection 
        register={register}
        instagramHandle={instagramHandle || ""}
        tiktokHandle={tiktokHandle || ""}
        facebookHandle={facebookHandle || ""}
        onlyfansHandle={onlyfansHandle || ""}
        twitterHandle={twitterHandle || ""}
      />

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gradient-to-r from-green-500 via-lime-400 to-green-500 rounded-full opacity-60"></div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
          <QrCode className="w-5 h-5 text-primary" />
          <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">QR Code Status Color</span>
        </h3>
        <div className="space-y-4">
          <Label>Choose your status color (appears as a glow around your QR code)</Label>
          <p className="text-sm text-foreground/70 italic font-medium bg-primary/10 rounded-full px-6 py-3 border border-primary/20">
            💡 Tip: Choose Gray Incognito Mode for event entries. Only Gray mode activates automatic screen brightening on mobile devices for easy scanning in dark environments. Incognito mode only shares name and email for event scanning purposes.
          </p>
          <div className="grid grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => {
                console.log("Status color changed to green");
                setStatusColor("green");
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                statusColor === "green"
                  ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/50"
                  : "border-border hover:border-green-500/50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-green-500 shadow-[0_0_20px_8px_rgba(34,197,94,0.6)]"></div>
                <span className="font-semibold">Clean</span>
                <span className="text-sm text-muted-foreground text-center">I'm All Clean. Let's Keep It That Way.</span>
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
                <span className="text-sm text-muted-foreground text-center">Take A Close Look Please.</span>
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
                <span className="text-sm text-muted-foreground text-center">Examine Docs Please</span>
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => setStatusColor("gray")}
              className={`p-4 rounded-lg border-2 transition-all ${
                statusColor === "gray"
                  ? "border-gray-500 bg-gray-500/10 shadow-lg shadow-gray-500/50"
                  : "border-border hover:border-gray-500/50"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-gray-500 shadow-[0_0_20px_8px_rgba(107,114,128,0.6)]"></div>
                <span className="font-semibold">Gray</span>
                <span className="text-sm text-muted-foreground text-center">Incognito Mode<br />Event Scanning</span>
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
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-500" />
            <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">STD Acknowledgment</span>
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setStdAcknowledgmentLocked(!stdAcknowledgmentLocked)}
            className="h-auto py-1 px-3"
          >
            {stdAcknowledgmentLocked ? (
              <>
                <Lock className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-xs text-red-500">Private</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">Viewable</span>
              </>
            )}
          </Button>
        </div>
        
        {stdAcknowledgmentLocked ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">STD acknowledgment is private</p>
            <p className="text-xs mt-1">Click unlock to make it viewable via QR code</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="std_acknowledgment">STD Status & Information</Label>
            <p className="text-xs text-muted-foreground italic">This is voluntary shared information for full transparency.</p>
            <Textarea
              id="std_acknowledgment"
              {...register("std_acknowledgment")}
              rows={4}
              placeholder="Please provide any relevant health information..."
            />
          </div>
        )}
      </div>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gradient-to-r from-blue-500 via-sky-400 to-blue-500 rounded-full opacity-60"></div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-500" />
            <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Member References</span>
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setReferencesLocked(!referencesLocked)}
            className="h-auto py-1 px-3"
          >
            {referencesLocked ? (
              <>
                <Lock className="w-4 h-4 text-red-500 mr-1" />
                <span className="text-xs text-red-500">Private</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-xs text-green-500">Shareable</span>
              </>
            )}
          </Button>
        </div>
        
        {referencesLocked ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">References are private</p>
            <p className="text-xs mt-1">Click unlock to make them shareable via QR code</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Enter up to 3 member IDs to link reference profiles
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <Card key={index} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <Label htmlFor={`reference-${index}`}>Reference #{index + 1}</Label>
                      <Input
                        id={`reference-${index}`}
                        value={referenceIds[index]}
                        onChange={(e) => handleReferenceIdChange(index, e.target.value)}
                        placeholder="CC-12345678"
                        className="font-mono"
                      />
                      {referenceProfiles[index] && (
                        <div className="mt-2 p-3 bg-primary/10 border border-primary/20 rounded-lg space-y-2">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${referenceProfiles[index]?.verified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                              <p className="font-semibold text-sm">{referenceProfiles[index]?.full_name}</p>
                              {referenceProfiles[index]?.verified && (
                                <Badge variant="default" className="bg-green-500 text-white text-xs">
                                  <CheckCircle className="h-2.5 w-2.5 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground font-mono">
                              {referenceProfiles[index]?.member_id}
                            </p>
                            {!referenceProfiles[index]?.verified && (
                              <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                Pending verification from member
                              </p>
                            )}
                            <Button
                              type="button"
                              size="sm"
                              variant="default"
                              className="w-full mt-2"
                              onClick={() => window.open(`/profile/${referenceProfiles[index]?.id}`, '_blank')}
                            >
                              <ExternalLink className="h-3 w-3 mr-2" />
                              View Profile
                            </Button>
                          </div>
                        </div>
                      )}
                      {referenceIds[index] && !referenceProfiles[index] && (
                        <p className="text-xs text-destructive">Member ID not found</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        {!profileImageUrl ? (
          <div className="text-right">
            <p className="text-sm text-red-500 font-semibold mb-2 bg-red-50 dark:bg-red-950/30 px-4 py-2 rounded-lg border border-red-500">
              ⚠️ Profile photo required to save
            </p>
            <Button 
              type="button"
              size="lg"
              disabled
              className="shadow-2xl opacity-50 cursor-not-allowed"
            >
              Save
            </Button>
          </div>
        ) : (
          <Button 
            type="submit" 
            disabled={saving}
            size="lg"
            className={`shadow-2xl transition-all duration-300 ${
              saveSuccess
                ? 'bg-green-600 hover:bg-green-600 text-white ring-4 ring-green-400/50 shadow-green-500/60'
                : hasChanges && !saving
                  ? 'bg-blue-600 hover:bg-blue-700 text-white ring-4 ring-blue-400/50 animate-gentle-glow'
                  : !saving
                    ? 'shadow-primary/50 hover:shadow-primary/60' 
                    : ''
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Saved!
              </>
            ) : (
              <>Save Now {hasChanges ? "•" : ""}</>
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default ProfileTab;
