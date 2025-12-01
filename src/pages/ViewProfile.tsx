import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Heart, User, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  id: string;
  member_id: string;
  full_name: string;
  email?: string | null;
  profile_image_url?: string | null;
  status_color: string;
  gender_identity?: string | null;
  sexual_orientation?: string | null;
  relationship_status?: string | null;
  covid_vaccinated?: boolean;
  smoker?: boolean;
  health_document_uploaded_at?: string | null;
  selected_interests?: string[];
  created_at?: string;
}

const ViewProfile = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<string | null>(null);
  const [isIncognitoMode, setIsIncognitoMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("No access token provided");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke(
          "view-profile-with-token",
          {
            body: { token },
          }
        );

        if (error) {
          console.error("Error fetching profile:", error);
          setError(error.message || "Failed to load profile");
          toast.error("Failed to load profile");
          return;
        }

        if (data?.profile) {
          setProfile(data.profile);
          setTokenExpiresAt(data.tokenExpiresAt);
          setIsIncognitoMode(data.isIncognitoMode || false);
        } else {
          setError("Profile not found");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("An unexpected error occurred");
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              {error || "Unable to load profile"}
            </p>
            <Link
              to="/"
              className="block w-full text-center py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go to Home
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColorClass = (color: string) => {
    switch (color) {
      case "green":
        return "border-green-500 shadow-[0_0_20px_8px_rgba(34,197,94,0.6)]";
      case "yellow":
        return "border-yellow-500 shadow-[0_0_20px_8px_rgba(234,179,8,0.6)]";
      case "red":
        return "border-red-500 shadow-[0_0_20px_8px_rgba(239,68,68,0.6)]";
      case "gray":
        return "border-gray-500 shadow-[0_0_20px_8px_rgba(107,114,128,0.6)]";
      default:
        return "border-green-500 shadow-[0_0_20px_8px_rgba(34,197,94,0.6)]";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  // If incognito mode, show limited event scanning view
  if (isIncognitoMode) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
          <Card className="shadow-[0_0_25px_10px_rgba(107,114,128,0.4)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-xl md:text-2xl">Event Check-In</CardTitle>
              <p className="text-center text-sm text-muted-foreground">Incognito Mode - Limited Information</p>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex flex-col items-center gap-4 md:gap-6">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-gray-500 shadow-[0_0_20px_8px_rgba(107,114,128,0.6)]">
                  <AvatarFallback className="text-xl md:text-2xl bg-gray-500 text-white">
                    {profile.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-3 w-full">
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Member Name</p>
                    <h1 className="text-xl md:text-2xl font-bold break-words">{profile.full_name}</h1>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Email Address</p>
                    <p className="text-base md:text-lg font-medium break-all">{profile.email || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">Member ID</p>
                    <p className="text-base md:text-lg font-mono">{profile.member_id}</p>
                  </div>
                  <Badge variant="secondary" className="mt-4">
                    Event Scanning Mode
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {tokenExpiresAt && (
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <p className="text-sm text-center text-muted-foreground">
                  This access expires on {new Date(tokenExpiresAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <p className="text-sm text-center text-muted-foreground">
                📋 This information can be captured for event marketing and future communications.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Full profile view for non-incognito modes - Only shows safe-to-share info
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {/* Header with status */}
        <Card className={getStatusColorClass(profile.status_color)}>
          <CardContent className="pt-4 md:pt-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <Avatar className={`h-24 w-24 md:h-32 md:w-32 border-4 ${getStatusColorClass(profile.status_color)}`}>
                <AvatarImage src={profile.profile_image_url || undefined} />
                <AvatarFallback className="text-xl md:text-2xl">
                  {profile.full_name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">{profile.full_name}</h1>
                <p className="text-sm md:text-base text-muted-foreground mb-2">Member ID: {profile.member_id}</p>
                <Badge variant={profile.status_color === "green" ? "default" : "secondary"} className="text-xs md:text-sm">
                  {profile.status_color === "green" && "✅ Clean Status"}
                  {profile.status_color === "yellow" && "⚠️ Proceed with Caution"}
                  {profile.status_color === "red" && "🔴 Be Aware"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Shared Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.gender_identity && (
              <div>
                <span className="font-medium">Gender Identity:</span> {profile.gender_identity}
              </div>
            )}
            {profile.sexual_orientation && (
              <div>
                <span className="font-medium">Sexual Orientation:</span> {profile.sexual_orientation}
              </div>
            )}
            {profile.relationship_status && (
              <div>
                <span className="font-medium">Relationship Status:</span> {profile.relationship_status}
              </div>
            )}
            {profile.selected_interests && profile.selected_interests.length > 0 && (
              <div>
                <span className="font-medium">Interests:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.selected_interests.map((interest, index) => (
                    <Badge key={index} variant="outline">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Health Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health Status Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              {profile.covid_vaccinated ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>COVID Vaccinated: <strong className="text-green-500">Yes</strong></span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span>COVID Vaccinated: <strong className="text-red-500">No</strong></span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {profile.smoker ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  <span>Smoker: <strong className="text-orange-500">Yes</strong></span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-green-500" />
                  <span>Smoker: <strong className="text-green-500">No</strong></span>
                </>
              )}
            </div>
            {profile.health_document_uploaded_at && (
              <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-sm font-medium">Health Document Verification</p>
                <p className="text-sm text-muted-foreground">
                  Last updated: {formatDate(profile.health_document_uploaded_at)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy Notice */}
        <Card className="bg-muted border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-muted-foreground">
              🔒 This profile shows limited, verified information shared for transparency and safety. 
              Personal details, documents, and contact information remain private.
            </p>
          </CardContent>
        </Card>

        {/* Token expiration notice */}
        {tokenExpiresAt && (
          <Card className="bg-muted">
            <CardContent className="pt-6">
              <p className="text-sm text-center text-muted-foreground">
                This profile access expires on {new Date(tokenExpiresAt).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;
