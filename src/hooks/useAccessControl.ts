import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type AccessType = "investor" | "partner";

export const useAccessControl = (accessType: AccessType) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false); // DEFAULT DENY
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  useEffect(() => {
    checkAccess();
  }, [accessType]);

  const checkAccess = async () => {
    setIsLoading(true);
    // DEFAULT DENY - only set true if explicitly approved
    setHasAccess(false);
    
    try {
      // SECURITY: Use getUser() instead of getSession() for fresh server-side validation
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        // Not logged in → redirect to auth
        navigate("/auth?redirect=" + (accessType === "investor" ? "/investor-portal" : "/partners"));
        setIsLoading(false);
        return;
      }

      // Check if user is admin - admins have full access
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (!rolesError && roles?.some(r => r.role === "administrator")) {
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      // SECURITY: Always fetch FRESH data from database
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("investor_access_approved, partner_access_approved, investor_access_requested_at, partner_access_requested_at")
        .eq("user_id", user.id)
        .maybeSingle();

      // If profile fetch fails or no profile → DENY
      if (profileError || !profile) {
        console.error("Profile fetch failed:", profileError);
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      // SECURITY: Check the correct field based on accessType - MUST be explicitly true
      if (accessType === "investor") {
        setHasAccess(profile.investor_access_approved === true);
        setHasPendingRequest(!!profile.investor_access_requested_at && profile.investor_access_approved !== true);
      } else {
        setHasAccess(profile.partner_access_approved === true);
        setHasPendingRequest(!!profile.partner_access_requested_at && profile.partner_access_approved !== true);
      }
    } catch (error) {
      console.error("Access check error:", error);
      setHasAccess(false); // DENY on any error
    } finally {
      setIsLoading(false);
    }
  };

  const requestAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("user_id", session.user.id)
        .maybeSingle();

      const requestedAtField = accessType === "investor" 
        ? "investor_access_requested_at" 
        : "partner_access_requested_at";

      // Update profile with request timestamp
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ [requestedAtField]: new Date().toISOString() })
        .eq("user_id", session.user.id);

      if (updateError) throw updateError;

      // Send notification email to admin
      const { error: notifyError } = await supabase.functions.invoke("notify-access-request", {
        body: {
          userId: session.user.id,
          userEmail: session.user.email,
          userName: profile?.full_name || session.user.email,
          accessType,
          requestedAt: new Date().toISOString(),
        },
      });

      if (notifyError) {
        console.error("Failed to send notification:", notifyError);
        toast.error("Request saved, but approval email failed to send. Please try again.");
      } else {
        toast.success("Access request submitted! You'll be notified when approved.");
      }

      navigate(`/access-pending?type=${accessType}`);
    } catch (error) {
      console.error("Error requesting access:", error);
      toast.error("Failed to submit access request. Please try again.");
    }
  };

  return { isLoading, hasAccess, hasPendingRequest, requestAccess, checkAccess };
};