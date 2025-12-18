import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DriverVerificationBadge } from "@/components/dashboard/DriverVerificationBadge";
import { useDriverProfile } from "@/hooks/useDriverProfile";
import { useToast } from "@/hooks/use-toast";
import { Car, Phone, ExternalLink, RefreshCw, Shield } from "lucide-react";
import { Helmet } from "react-helmet-async";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | undefined>();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { profile, loading, triggerLivenessVerification } = useDriverProfile(userId);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    };
    checkAuth();
  }, [navigate]);

  const handleStartVerification = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your phone number to start verification.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await triggerLivenessVerification(phoneNumber);
      
      if (result.verification_link) {
        toast({
          title: "Verification Started",
          description: "Opening verification in a new tab...",
        });
        window.open(result.verification_link, "_blank");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start verification",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Driver Dashboard | Valid™</title>
      </Helmet>
      
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Driver Dashboard</h1>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to Main
            </Button>
          </div>

          {/* Verification Status Card */}
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Verification Status</CardTitle>
                  <CardDescription>Your facial liveness verification status</CardDescription>
                </div>
                <DriverVerificationBadge 
                  status={profile?.verification_status || "unverified"} 
                  size="lg"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile?.verified_at && (
                <p className="text-sm text-muted-foreground">
                  Verified on: {new Date(profile.verified_at).toLocaleDateString()}
                </p>
              )}
              
              {profile?.verification_status === "verified" && (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Identity Verified</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your facial liveness check was successful. You're all set!
                  </p>
                </div>
              )}

              {profile?.verification_status === "pending" && (
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-amber-400 font-medium">Verification in progress...</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete the verification in the opened window. This page will update automatically.
                  </p>
                </div>
              )}

              {profile?.verification_status === "failed" && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-red-400 font-medium">Verification failed</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Please try again or contact support if the issue persists.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Start Verification Card */}
          {(!profile || profile.verification_status === "unverified" || profile.verification_status === "failed") && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Start Verification</CardTitle>
                <CardDescription>
                  Complete facial liveness verification to confirm your identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter your phone number to receive the verification link
                  </p>
                </div>

                <Button 
                  onClick={handleStartVerification}
                  disabled={isSubmitting || !phoneNumber}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Starting Verification...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Start Facial Verification
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Profile Info Card */}
          {profile && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">Driver Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="text-foreground">{profile.phone_number}</span>
                </div>
                {profile.full_name && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Name</span>
                    <span className="text-foreground">{profile.full_name}</span>
                  </div>
                )}
                {profile.license_number && (
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">License</span>
                    <span className="text-foreground">{profile.license_number}</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="text-foreground">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default DriverDashboard;
