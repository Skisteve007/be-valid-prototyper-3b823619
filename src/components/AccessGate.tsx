import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Lock, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AccessGateProps {
  accessType: "investor" | "partner";
  children: ReactNode;
}

export const AccessGate = ({ accessType, children }: AccessGateProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false); // DEFAULT DENY
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [user, setUser] = useState<any>(null);

  const accessLabel = accessType === "investor" ? "Investor Deck" : "Partner Solutions";

  useEffect(() => {
    checkAccess();
  }, [accessType]);

  const checkAccess = async () => {
    setIsLoading(true);
    setHasAccess(false); // DEFAULT DENY - reset on each check
    
    try {
      // SECURITY: Force fresh session check, don't rely on cached session
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        // Not logged in → redirect to auth
        console.log("AccessGate: No authenticated user, redirecting to auth");
        navigate("/auth?redirect=" + (accessType === "investor" ? "/investor-portal" : "/partners"));
        setIsLoading(false);
        return;
      }

      setUser(currentUser);
      console.log("AccessGate: Checking access for user:", currentUser.email, "accessType:", accessType);

      // Check if user is admin - admins have full access
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", currentUser.id);

      if (!rolesError && roles?.some(r => r.role === "administrator")) {
        console.log("AccessGate: User is admin, granting access");
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      // SECURITY: Always fetch FRESH data from database - no caching
      // Use explicit timestamp to prevent any query caching
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("investor_access_approved, partner_access_approved, investor_access_requested_at, partner_access_requested_at")
        .eq("user_id", currentUser.id)
        .maybeSingle();

      // If profile fetch fails or no profile → DENY
      if (profileError || !profile) {
        console.error("AccessGate: Profile fetch failed:", profileError);
        setHasAccess(false);
        setIsLoading(false);
        return;
      }

      console.log("AccessGate: Profile data:", {
        investor_access_approved: profile.investor_access_approved,
        partner_access_approved: profile.partner_access_approved
      });

      // SECURITY: Check the correct field based on accessType - MUST be explicitly true
      // Boolean strict comparison to prevent any truthy/falsy issues
      if (accessType === "investor") {
        const approved = profile.investor_access_approved === true;
        console.log("AccessGate: Investor access approved:", approved);
        setHasAccess(approved);
        setHasPendingRequest(!!profile.investor_access_requested_at && !approved);
      } else {
        const approved = profile.partner_access_approved === true;
        console.log("AccessGate: Partner access approved:", approved);
        setHasAccess(approved);
        setHasPendingRequest(!!profile.partner_access_requested_at && !approved);
      }
    } catch (error) {
      console.error("AccessGate: Access check error:", error);
      setHasAccess(false); // DENY on any error
    } finally {
      setIsLoading(false);
    }
  };

  const requestAccess = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, email")
        .eq("user_id", user.id)
        .maybeSingle();

      const requestedAtField = accessType === "investor" 
        ? "investor_access_requested_at" 
        : "partner_access_requested_at";

      // Update profile with request timestamp
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ [requestedAtField]: new Date().toISOString() })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      // Send notification email to admin
      console.log("Invoking notify-access-request for:", user.email, accessType);
      const { data, error: notifyError } = await supabase.functions.invoke("notify-access-request", {
        body: {
          userId: user.id,
          userEmail: user.email,
          userName: profile?.full_name || user.email,
          accessType,
          requestedAt: new Date().toISOString(),
        },
      });

      console.log("notify-access-request response:", data, notifyError);

      if (notifyError) {
        console.error("Failed to send notification:", notifyError);
        toast.error("Request saved, but approval email failed. Admin will review manually.");
      } else {
        toast.success("Access request submitted! You'll be notified when approved.");
      }

      setHasPendingRequest(true);
    } catch (error) {
      console.error("Error requesting access:", error);
      toast.error("Failed to submit access request. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // APPROVED → Show content
  if (hasAccess) {
    return <>{children}</>;
  }

  // NOT APPROVED → Show request access UI (BLOCK CONTENT)
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 mb-8">
          <Lock className="w-12 h-12 text-primary" />
        </div>

        <h1 className="text-4xl font-bold font-orbitron mb-4">
          {accessLabel} <span className="text-primary">Access Required</span>
        </h1>

        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Protected Content
            </span>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            The <span className="text-foreground font-semibold">{accessLabel}</span> contains proprietary 
            information protected under NDA. Access requires explicit approval from VALID™ administrators.
          </p>

          {hasPendingRequest ? (
            <>
              <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-4">
                <p className="text-primary font-semibold mb-2">Request Pending</p>
                <p className="text-sm text-muted-foreground">
                  Your access request is being reviewed. You'll receive an email when approved.
                </p>
              </div>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </>
          ) : (
            <Button
              onClick={requestAccess}
              className="w-full bg-primary text-primary-foreground font-bold py-6 text-lg"
            >
              Request Access
            </Button>
          )}
        </div>

        <p className="text-muted-foreground text-sm">
          By requesting access, you acknowledge that you have agreed to our Terms of Service and NDA requirements.
        </p>
        
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 text-sm text-muted-foreground hover:underline"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};
