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
import { SocialMediaSection } from "./profile/SocialMediaSection";
import MemberBetaSurvey from "@/components/MemberBetaSurvey";
import MySignalSection from "./profile/MySignalSection";
import TrustSignalSection from "./profile/TrustSignalSection";

import { useIsAdmin } from "@/hooks/useIsAdmin";

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
  vices: string[];
  covid_vaccinated: boolean;
  circumcised?: boolean;
  smoker: boolean;
  booty_enhanced?: boolean;
  breasts_enhanced?: boolean;
  loves_enhancements?: boolean;
  instagram_handle: string;
  tiktok_handle: string;
  facebook_handle: string;
  onlyfans_handle: string;
  std_acknowledgment: string;
  user_references: string;
  sexual_preferences: string;
  user_interests: Record<string, string[]>;
  health_document_url?: string;
  disclaimer_accepted: boolean;
}

const ProfileTab = ({ userId, onUpdate }: ProfileTabProps) => {
  const { isAdmin } = useIsAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string>("");
  const [userInterests, setUserInterests] = useState<Record<string, string[]>>({});
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [statusColor, setStatusColor] = useState<"green" | "yellow" | "red" | "gray" | "blue" | "orange" | "purple">("green");
  const [referenceIds, setReferenceIds] = useState<string[]>(["", "", ""]);
  const [referenceProfiles, setReferenceProfiles] = useState<Array<{id: string, user_id: string, full_name: string, member_id: string, verified?: boolean} | null>>([null, null, null]);
  const [existingReferences, setExistingReferences] = useState<string[]>([]);
  const [emailShareable, setEmailShareable] = useState(false);
  const [referencesLocked, setReferencesLocked] = useState(true);
  const [stdAcknowledgmentLocked, setStdAcknowledgmentLocked] = useState(true);
  const [memberId, setMemberId] = useState<string>("");
  const [labCertified, setLabCertified] = useState(false);
  const [labLogoUrl, setLabLogoUrl] = useState<string>("");
  const [uploadingLabLogo, setUploadingLabLogo] = useState(false);
  const [vibeMetadata, setVibeMetadata] = useState<Record<string, any>>({});
  
  // Sharing toggle states
  const [sharingInterestsEnabled, setSharingInterestsEnabled] = useState(false);
  const [sharingVicesEnabled, setSharingVicesEnabled] = useState(false);
  const [sharingOrientationEnabled, setSharingOrientationEnabled] = useState(false);
  const [sharingSocialEnabled, setSharingSocialEnabled] = useState(false);
  
  // Per-category preference sharing states
  const [sharingSocialDynamicEnabled, setSharingSocialDynamicEnabled] = useState(false);
  const [sharingRelationshipStyleEnabled, setSharingRelationshipStyleEnabled] = useState(false);
  const [sharingSensoryPrefsEnabled, setSharingSensoryPrefsEnabled] = useState(false);
  const [sharingSpecificActivitiesEnabled, setSharingSpecificActivitiesEnabled] = useState(false);
  
  // Track initial values for change detection
  const [initialProfileImageUrl, setInitialProfileImageUrl] = useState<string>("");
  const [initialStatusColor, setInitialStatusColor] = useState<"green" | "yellow" | "red" | "gray" | "blue" | "orange" | "purple">("green");
  const [initialSelectedInterests, setInitialSelectedInterests] = useState<string[]>([]);
  const [initialReferenceIds, setInitialReferenceIds] = useState<string[]>(["", "", ""]);
  const [initialEmailShareable, setInitialEmailShareable] = useState(false);
  const [initialReferencesLocked, setInitialReferencesLocked] = useState(true);
  const [initialStdAcknowledgmentLocked, setInitialStdAcknowledgmentLocked] = useState(true);
  const [initialLabCertified, setInitialLabCertified] = useState(false);
  const [initialLabLogoUrl, setInitialLabLogoUrl] = useState<string>("");
  const [initialSharingInterestsEnabled, setInitialSharingInterestsEnabled] = useState(false);
  const [initialSharingVicesEnabled, setInitialSharingVicesEnabled] = useState(false);
  const [initialSharingOrientationEnabled, setInitialSharingOrientationEnabled] = useState(false);
  const [initialSharingSocialEnabled, setInitialSharingSocialEnabled] = useState(false);
  const [initialSharingSocialDynamicEnabled, setInitialSharingSocialDynamicEnabled] = useState(false);
  const [initialSharingRelationshipStyleEnabled, setInitialSharingRelationshipStyleEnabled] = useState(false);
  const [initialSharingSensoryPrefsEnabled, setInitialSharingSensoryPrefsEnabled] = useState(false);
  const [initialSharingSpecificActivitiesEnabled, setInitialSharingSpecificActivitiesEnabled] = useState(false);
  const [initialVibeMetadata, setInitialVibeMetadata] = useState<Record<string, any>>({});

  const { register, handleSubmit, setValue, watch, getValues, formState, reset } = useForm<ProfileFormData>({
    defaultValues: {
      partner_preferences: [],
      vices: [],
      covid_vaccinated: false,
      smoker: false,
      user_interests: {},
      disclaimer_accepted: false,
    }
  });

  const genderIdentity = watch("gender_identity");
  const sexualOrientation = watch("sexual_orientation");
  const partnerPreferences = watch("partner_preferences");
  const vices = watch("vices");
  const covidVaccinated = watch("covid_vaccinated");
  const circumcised = watch("circumcised");
  const smoker = watch("smoker");
  const bootyEnhanced = watch("booty_enhanced");
  const breastsEnhanced = watch("breasts_enhanced");
  const lovesEnhancements = watch("loves_enhancements");
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
  
  // Detect if any changes have been made
  const hasChanges = 
    formState.isDirty ||
    profileImageUrl !== initialProfileImageUrl ||
    statusColor !== initialStatusColor ||
    emailShareable !== initialEmailShareable ||
    referencesLocked !== initialReferencesLocked ||
    stdAcknowledgmentLocked !== initialStdAcknowledgmentLocked ||
    labCertified !== initialLabCertified ||
    labLogoUrl !== initialLabLogoUrl ||
    sharingInterestsEnabled !== initialSharingInterestsEnabled ||
    sharingVicesEnabled !== initialSharingVicesEnabled ||
    sharingOrientationEnabled !== initialSharingOrientationEnabled ||
    sharingSocialEnabled !== initialSharingSocialEnabled ||
    sharingSocialDynamicEnabled !== initialSharingSocialDynamicEnabled ||
    sharingRelationshipStyleEnabled !== initialSharingRelationshipStyleEnabled ||
    sharingSensoryPrefsEnabled !== initialSharingSensoryPrefsEnabled ||
    sharingSpecificActivitiesEnabled !== initialSharingSpecificActivitiesEnabled ||
    JSON.stringify(selectedInterests.sort()) !== JSON.stringify(initialSelectedInterests.sort()) ||
    JSON.stringify(referenceIds) !== JSON.stringify(initialReferenceIds) ||
    JSON.stringify(vibeMetadata) !== JSON.stringify(initialVibeMetadata);

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
        setValue("vices", (data.vices as string[]) || []);
        setValue("covid_vaccinated", data.covid_vaccinated || false);
        setValue("circumcised", data.circumcised);
        setValue("smoker", data.smoker || false);
        setValue("booty_enhanced", (data as any).booty_enhanced || false);
        setValue("breasts_enhanced", (data as any).breasts_enhanced || false);
        setValue("loves_enhancements", (data as any).loves_enhancements || false);
        setValue("instagram_handle", data.instagram_handle || "");
        setValue("tiktok_handle", data.tiktok_handle || "");
        setValue("facebook_handle", data.facebook_handle || "");
        setValue("onlyfans_handle", data.onlyfans_handle || "");
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
        setStatusColor((data.status_color as "green" | "yellow" | "red" | "gray" | "blue" | "orange" | "purple") || "green");
        setEmailShareable(data.email_shareable || false);
        setReferencesLocked(data.references_locked !== false); // Default to true
        setStdAcknowledgmentLocked(data.std_acknowledgment_locked !== false); // Default to true
        setMemberId(data.member_id || "");
        setLabCertified(data.lab_certified || false);
        setLabLogoUrl(data.lab_logo_url || "");
        
        // Load vibe metadata
        setVibeMetadata((data as any).vibe_metadata || {});
        
        // Load sharing toggle states
        setSharingInterestsEnabled((data as any).sharing_interests_enabled || false);
        setSharingVicesEnabled((data as any).sharing_vices_enabled || false);
        setSharingOrientationEnabled((data as any).sharing_orientation_enabled || false);
        setSharingSocialEnabled((data as any).sharing_social_enabled || false);
        
        // Load per-category preference sharing states
        setSharingSocialDynamicEnabled((data as any).sharing_social_dynamic_enabled || false);
        setSharingRelationshipStyleEnabled((data as any).sharing_relationship_style_enabled || false);
        setSharingSensoryPrefsEnabled((data as any).sharing_sensory_prefs_enabled || false);
        setSharingSpecificActivitiesEnabled((data as any).sharing_specific_activities_enabled || false);
        
        // Set initial values for change detection
        setInitialProfileImageUrl(data.profile_image_url || "");
        setInitialStatusColor((data.status_color as "green" | "yellow" | "red" | "gray" | "blue" | "orange" | "purple") || "green");
        setInitialSelectedInterests((data.selected_interests as string[]) || []);
        setInitialReferenceIds(refs);
        setInitialEmailShareable(data.email_shareable || false);
        setInitialReferencesLocked(data.references_locked !== false);
        setInitialStdAcknowledgmentLocked(data.std_acknowledgment_locked !== false);
        setInitialLabCertified(data.lab_certified || false);
        setInitialLabLogoUrl(data.lab_logo_url || "");
        setInitialVibeMetadata((data as any).vibe_metadata || {});
        setInitialSharingInterestsEnabled((data as any).sharing_interests_enabled || false);
        setInitialSharingVicesEnabled((data as any).sharing_vices_enabled || false);
        setInitialSharingOrientationEnabled((data as any).sharing_orientation_enabled || false);
        setInitialSharingSocialEnabled((data as any).sharing_social_enabled || false);
        setInitialSharingSocialDynamicEnabled((data as any).sharing_social_dynamic_enabled || false);
        setInitialSharingRelationshipStyleEnabled((data as any).sharing_relationship_style_enabled || false);
        setInitialSharingSensoryPrefsEnabled((data as any).sharing_sensory_prefs_enabled || false);
        setInitialSharingSpecificActivitiesEnabled((data as any).sharing_specific_activities_enabled || false);
        
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/profile.${fileExt}`;

      console.log("Uploading image to:", filePath);

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      // Add cache buster to force refresh
      const newUrl = `${publicUrl}?t=${Date.now()}`;
      console.log("Image uploaded successfully:", newUrl);
      setProfileImageUrl(newUrl);
      
      // Auto-save to database immediately
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: newUrl })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error("Failed to save profile image to database:", updateError);
        toast.error("Image uploaded but failed to save. Please click Save.");
      } else {
        setInitialProfileImageUrl(newUrl);
        toast.success("Profile photo uploaded and saved!");
      }
    } catch (error: any) {
      console.error("Image upload failed:", error);
      toast.error(error.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCroppedImageUpload = async (blob: Blob) => {
    setUploadingImage(true);
    try {
      const filePath = `${userId}/profile.jpg`;

      console.log("Uploading cropped image to:", filePath);

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, blob, { upsert: true, contentType: 'image/jpeg' });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      // Add cache buster to force refresh
      const newUrl = `${publicUrl}?t=${Date.now()}`;
      console.log("Cropped image uploaded successfully:", newUrl);
      setProfileImageUrl(newUrl);
      
      // Auto-save to database immediately
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: newUrl })
        .eq('user_id', userId);
      
      if (updateError) {
        console.error("Failed to save profile image to database:", updateError);
        toast.error("Image uploaded but failed to save. Please click Save.");
      } else {
        setInitialProfileImageUrl(newUrl);
        toast.success("Profile photo updated and saved!");
      }
    } catch (error: any) {
      console.error("Image upload failed:", error);
      toast.error(error.message || "Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLabLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploadingLabLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/lab-logo.${fileExt}`;

      console.log("Uploading lab logo to:", filePath);

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Lab logo upload error:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      console.log("Lab logo uploaded successfully:", publicUrl);
      setLabLogoUrl(publicUrl);
      toast.success("Lab logo uploaded successfully!");
    } catch (error: any) {
      console.error("Lab logo upload failed:", error);
      toast.error(error.message || "Failed to upload lab logo. Please try again.");
    } finally {
      setUploadingLabLogo(false);
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
          vices: data.vices,
          covid_vaccinated: data.covid_vaccinated,
          circumcised: data.circumcised,
          smoker: data.smoker,
          instagram_handle: data.instagram_handle,
          tiktok_handle: data.tiktok_handle,
          facebook_handle: data.facebook_handle,
          onlyfans_handle: data.onlyfans_handle,
          std_acknowledgment: data.std_acknowledgment,
          user_references: JSON.stringify(referenceIds.filter(id => id.trim() !== "")),
          sexual_preferences: data.sexual_preferences,
          user_interests: userInterests,
          selected_interests: selectedInterests,
          status_color: statusColor,
          email_shareable: emailShareable,
          references_locked: referencesLocked,
          std_acknowledgment_locked: stdAcknowledgmentLocked,
          lab_certified: labCertified,
          lab_logo_url: labLogoUrl,
          sharing_interests_enabled: sharingInterestsEnabled,
          sharing_vices_enabled: sharingVicesEnabled,
          sharing_orientation_enabled: sharingOrientationEnabled,
          sharing_social_enabled: sharingSocialEnabled,
          sharing_social_dynamic_enabled: sharingSocialDynamicEnabled,
          sharing_relationship_style_enabled: sharingRelationshipStyleEnabled,
          sharing_sensory_prefs_enabled: sharingSensoryPrefsEnabled,
          sharing_specific_activities_enabled: sharingSpecificActivitiesEnabled,
          vibe_metadata: vibeMetadata,
        } as any)
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
      setInitialLabCertified(labCertified);
      setInitialLabLogoUrl(labLogoUrl);
      setInitialSharingInterestsEnabled(sharingInterestsEnabled);
      setInitialSharingVicesEnabled(sharingVicesEnabled);
      setInitialSharingOrientationEnabled(sharingOrientationEnabled);
      setInitialSharingSocialEnabled(sharingSocialEnabled);
      
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
        handleCroppedImageUpload={handleCroppedImageUpload}
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
        labCertified={labCertified}
        labLogoUrl={labLogoUrl}
        onLabCertifiedChange={setLabCertified}
        onLabLogoUpload={handleLabLogoUpload}
        uploadingLabLogo={uploadingLabLogo}
        isAdmin={isAdmin}
        vibeMetadata={vibeMetadata}
      />

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gradient-to-r from-green-500 via-lime-400 to-green-500 rounded-full opacity-60"></div>
        </div>
      </div>

      <SocialMediaSection
        register={register}
        instagramHandle={instagramHandle || ""}
        tiktokHandle={tiktokHandle || ""}
        facebookHandle={facebookHandle || ""}
        onlyfansHandle={onlyfansHandle || ""}
        sharingEnabled={sharingSocialEnabled}
        onToggleSharing={(enabled) => setSharingSocialEnabled(enabled)}
      />

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-400 to-cyan-500 rounded-full opacity-60"></div>
        </div>
      </div>

      {/* Trust & Signal Section */}
      <TrustSignalSection
        userId={userId}
        stdAcknowledgment={watch("std_acknowledgment") || ""}
        onStdAcknowledgmentChange={(value) => setValue("std_acknowledgment", value)}
        stdAcknowledgmentLocked={stdAcknowledgmentLocked}
        onStdAcknowledgmentLockedChange={setStdAcknowledgmentLocked}
        referenceIds={referenceIds}
        onReferenceIdsChange={setReferenceIds}
        referenceProfiles={referenceProfiles}
        referencesLocked={referencesLocked}
        onReferencesLockedChange={setReferencesLocked}
      />

      {/* Member Beta Feedback Button */}
      <MemberBetaSurvey userId={userId} />

      {/* Floating Save Button */}
      <div className="fixed bottom-4 right-36 z-50 flex flex-col items-end gap-2">
        {!profileImageUrl ? (
          <div className="text-right">
            <p className="text-xs text-red-500 font-semibold mb-2 bg-red-50 dark:bg-red-950/30 px-3 py-1.5 rounded-lg border border-red-500">
              ⚠️ Profile photo required
            </p>
            <Button 
              type="button"
              size="sm"
              disabled
              className="shadow-lg opacity-50 cursor-not-allowed"
            >
              Save
            </Button>
          </div>
        ) : (
          <Button 
            type="submit" 
            disabled={saving}
            size="sm"
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
