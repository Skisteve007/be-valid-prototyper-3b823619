import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DriverProfile {
  id: string;
  user_id: string;
  phone_number: string;
  full_name: string | null;
  license_number: string | null;
  verification_status: "unverified" | "pending" | "verified" | "failed";
  footprint_session_id: string | null;
  footprint_user_id: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useDriverProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from("driver_profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();

        if (error) throw error;
        setProfile(data as DriverProfile | null);
      } catch (error) {
        console.error("Error fetching driver profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Subscribe to realtime updates
    const channel = supabase
      .channel(`driver_profile_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "driver_profiles",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Driver profile update received:", payload);
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            setProfile(payload.new as DriverProfile);
            
            // Show toast on verification status change
            const newStatus = (payload.new as DriverProfile).verification_status;
            if (newStatus === "verified") {
              toast({
                title: "Verification Complete!",
                description: "Your driver identity has been verified successfully.",
              });
            } else if (newStatus === "failed") {
              toast({
                title: "Verification Failed",
                description: "Please try again or contact support.",
                variant: "destructive",
              });
            }
          } else if (payload.eventType === "DELETE") {
            setProfile(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, toast]);

  const triggerLivenessVerification = async (phoneNumber: string) => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke("trigger-footprint-liveness", {
        body: { phone_number: phoneNumber },
      });

      if (response.error) throw new Error(response.error.message);

      return response.data;
    } catch (error) {
      console.error("Error triggering liveness verification:", error);
      throw error;
    }
  };

  return {
    profile,
    loading,
    triggerLivenessVerification,
  };
};
