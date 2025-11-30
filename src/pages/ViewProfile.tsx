import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Calendar, Heart, User, CheckCircle2, XCircle, Instagram, Music, Facebook, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileData {
  id: string;
  member_id: string;
  full_name: string;
  email?: string | null;
  profile_image_url?: string | null;
  status_color: string;
  where_from?: string | null;
  current_home_city?: string | null;
  birthday?: string | null;
  gender_identity?: string | null;
  sexual_orientation?: string | null;
  relationship_status?: string | null;
  partner_preferences?: string[];
  covid_vaccinated?: boolean;
  circumcised?: boolean | null;
  smoker?: boolean;
  instagram_handle?: string | null;
  tiktok_handle?: string | null;
  facebook_handle?: string | null;
  onlyfans_handle?: string | null;
  twitter_handle?: string | null;
  sexual_preferences?: string | null;
  std_acknowledgment?: string | null;
  health_document_uploaded_at?: string | null;
  selected_interests?: string[];
  user_interests?: any;
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
        return "text-green-500";
      case "yellow":
        return "text-yellow-500";
      case "red":
        return "text-red-500";
      default:
        return "text-green-500";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString();
  };

  const getSocialMediaUrl = (platform: string, handle: string | null) => {
    if (!handle) return null;
    const cleanHandle = handle.replace('@', '');
    
    switch (platform) {
      case 'instagram':
        return `https://instagram.com/${cleanHandle}`;
      case 'tiktok':
        return `https://tiktok.com/@${cleanHandle}`;
      case 'facebook':
        return handle.startsWith('http') ? handle : `https://facebook.com/${cleanHandle}`;
      case 'onlyfans':
        return `https://onlyfans.com/${cleanHandle}`;
      case 'twitter':
        return `https://x.com/${cleanHandle}`;
      default:
        return null;
    }
  };

  // If incognito mode, show limited event scanning view
  if (isIncognitoMode) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="shadow-[0_0_25px_10px_rgba(107,114,128,0.4)]">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Event Check-In</CardTitle>
              <p className="text-center text-muted-foreground">Incognito Mode - Limited Information</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-6">
                <Avatar className="h-32 w-32 border-4 border-gray-500 shadow-[0_0_20px_8px_rgba(107,114,128,0.6)]">
                  <AvatarFallback className="text-2xl bg-gray-500 text-white">
                    {profile.full_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-3 w-full">
                  <div>
                    <p className="text-sm text-muted-foreground">Member Name</p>
                    <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="text-lg font-medium">{profile.email || "Not available"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member ID</p>
                    <p className="text-lg font-mono">{profile.member_id}</p>
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

  // Full profile view for non-incognito modes
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Avatar className={`h-32 w-32 border-4 ${getStatusColorClass(profile.status_color)}`}>
                <AvatarImage src={profile.profile_image_url || undefined} />
                <AvatarFallback className="text-2xl">
                  {profile.full_name?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{profile.full_name}</h1>
                <p className="text-muted-foreground mb-2">Member ID: {profile.member_id}</p>
                <Badge variant={profile.status_color === "green" ? "default" : "secondary"}>
                  Status: {profile.status_color.toUpperCase()}
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
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.where_from && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">From:</span> {profile.where_from}
              </div>
            )}
            {profile.current_home_city && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Current City:</span> {profile.current_home_city}
              </div>
            )}
            {profile.birthday && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Birthday:</span> {formatDate(profile.birthday)}
              </div>
            )}
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
          </CardContent>
        </Card>

        {/* Preferences & Health */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Preferences & Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.partner_preferences && profile.partner_preferences.length > 0 && (
              <div>
                <span className="font-medium">Partner Preferences:</span>{" "}
                {profile.partner_preferences.join(", ")}
              </div>
            )}
            <div className="flex items-center gap-2">
              {profile.covid_vaccinated ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span>COVID Vaccinated</span>
            </div>
            {profile.circumcised !== null && (
              <div className="flex items-center gap-2">
                {profile.circumcised ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>Circumcised</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {profile.smoker ? (
                <CheckCircle2 className="h-4 w-4 text-orange-500" />
              ) : (
                <XCircle className="h-4 w-4 text-green-500" />
              )}
              <span>{profile.smoker ? "Smoker" : "Non-smoker"}</span>
            </div>
            {profile.health_document_uploaded_at && (
              <div>
                <span className="font-medium">Health Document Updated:</span>{" "}
                {formatDate(profile.health_document_uploaded_at)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Social Media Links */}
        {(profile.instagram_handle || profile.tiktok_handle || profile.facebook_handle || profile.onlyfans_handle) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {profile.instagram_handle && (
                  <a
                    href={getSocialMediaUrl('instagram', profile.instagram_handle)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="h-4 w-4" />
                    <span>Instagram</span>
                  </a>
                )}
                {profile.tiktok_handle && (
                  <a
                    href={getSocialMediaUrl('tiktok', profile.tiktok_handle)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Music className="h-4 w-4" />
                    <span>TikTok</span>
                  </a>
                )}
                {profile.facebook_handle && (
                  <a
                    href={getSocialMediaUrl('facebook', profile.facebook_handle)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Facebook className="h-4 w-4" />
                    <span>Facebook</span>
                  </a>
                )}
                {profile.onlyfans_handle && (
                  <a
                    href={getSocialMediaUrl('onlyfans', profile.onlyfans_handle)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <User className="h-4 w-4" />
                    <span>OnlyFans</span>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        )}

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
