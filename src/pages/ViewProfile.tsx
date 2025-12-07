import { useEffect, useState, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Heart, User, CheckCircle2, XCircle, Clock, AlertTriangle, X, ExternalLink, IdCard, Wallet, Shield, Instagram, Lock } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  title: string;
  document_url: string | null;
  issue_date: string | null;
  expiry_date: string | null;
  issuer: string | null;
  status: string | null;
  created_at: string;
}

interface IdVerification {
  type: string;
  document_url?: string;
  expiry_date?: string;
  issuer?: string;
  verified: boolean;
}

interface PaymentAuthorization {
  type: string;
  identifier: string;
  bar_tab_enabled: boolean;
}

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
  user_interests?: Record<string, string[]>;
  documents?: Document[];
  created_at?: string;
  compliance_verified?: boolean;
  id_verification?: IdVerification;
  payment_authorized?: PaymentAuthorization;
  vices?: string[];
  sexual_preferences?: string;
  id_status?: string;
  social_media?: {
    instagram?: string;
    tiktok?: string;
    facebook?: string;
    onlyfans?: string;
    twitter?: string;
  } | string;
}

interface PrivacySettings {
  emailShared: boolean;
  referencesShared: boolean;
  stdAcknowledgmentShared: boolean;
  interestsShared: boolean;
  vicesShared: boolean;
  orientationShared: boolean;
  socialShared: boolean;
}

interface BundleFlags {
  includeId: boolean;
  includePayment: boolean;
}

const ViewProfile = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<string | null>(null);
  const [viewExpiresAt, setViewExpiresAt] = useState<string | null>(null);
  const [isIncognitoMode, setIsIncognitoMode] = useState(false);
  const [bundleFlags, setBundleFlags] = useState<BundleFlags | null>(null);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentViewerOpen, setDocumentViewerOpen] = useState(false);

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
          setViewExpiresAt(data.viewExpiresAt);
          setIsIncognitoMode(data.isIncognitoMode || false);
          setBundleFlags(data.bundleFlags || null);
          setPrivacySettings(data.privacySettings || null);
        } else if (data?.error) {
          setError(data.error);
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

  // Countdown timer effect
  useEffect(() => {
    if (!viewExpiresAt) return;

    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const expiresAt = new Date(viewExpiresAt).getTime();
      const remaining = Math.max(0, expiresAt - now);
      return Math.floor(remaining / 1000);
    };

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        setIsExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [viewExpiresAt]);

  const formatTimeRemaining = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

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

  // Show expired screen when viewing time is up
  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="text-center text-destructive flex items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Viewing Time Expired
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Your 3-minute viewing window has ended. For privacy and security, this profile is no longer accessible.
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

  // Countdown Timer Component
  const CountdownTimer = () => (
    <Card className={`sticky top-4 z-50 ${timeRemaining <= 60 ? 'bg-destructive/10 border-destructive animate-pulse' : 'bg-amber-500/10 border-amber-500'}`}>
      <CardContent className="py-3">
        <div className="flex items-center justify-center gap-3">
          <Clock className={`h-5 w-5 ${timeRemaining <= 60 ? 'text-destructive' : 'text-amber-500'}`} />
          <div className="text-center">
            <p className={`text-sm font-medium ${timeRemaining <= 60 ? 'text-destructive' : 'text-amber-700 dark:text-amber-400'}`}>
              Viewing Time Remaining
            </p>
            <p className={`text-2xl font-bold font-mono ${timeRemaining <= 60 ? 'text-destructive' : 'text-amber-600 dark:text-amber-500'}`}>
              {formatTimeRemaining(timeRemaining)}
            </p>
          </div>
        </div>
        {timeRemaining <= 60 && (
          <p className="text-xs text-center text-destructive mt-2">
            Profile access will end soon!
          </p>
        )}
      </CardContent>
    </Card>
  );

  // If incognito mode, show Master Access Token view
  if (isIncognitoMode) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
          {/* 24-Hour Access Pass Header - NO ANXIETY TIMER */}
          <Card className="bg-gray-500/10 border-gray-500/30">
            <CardContent className="py-3">
              <div className="flex items-center justify-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    24-Hour Master Access Token
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Valid until {tokenExpiresAt ? new Date(tokenExpiresAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Profile Card */}
          <Card className="shadow-[0_0_25px_10px_rgba(107,114,128,0.4)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-xl md:text-2xl">Venue Check-In</CardTitle>
              <p className="text-center text-sm text-muted-foreground">Master Access Token - Unified Entry</p>
            </CardHeader>
            <CardContent className="pt-4 md:pt-6">
              <div className="flex flex-col items-center gap-4 md:gap-6">
                {/* Member Photo for Visual Verification */}
                <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-gray-500 shadow-[0_0_20px_8px_rgba(107,114,128,0.6)]">
                  <AvatarImage src={profile.profile_image_url || undefined} />
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
                    <p className="text-xs md:text-sm text-muted-foreground">Member ID</p>
                    <p className="text-base md:text-lg font-mono">{profile.member_id}</p>
                  </div>
                  
                  {/* Compliance Status Badge */}
                  <div className="flex justify-center gap-2 mt-4">
                    <Badge className="bg-green-600 text-white">
                      <Shield className="h-3 w-3 mr-1" />
                      Compliance Verified
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-500 text-white">
                      Incognito Active
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bundle Data Cards - Show based on what's included */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* ID Verification Card */}
            {profile.id_verification ? (
              <Card className="border-blue-500/30 bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-500/20 rounded-full">
                      <IdCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-blue-800 dark:text-blue-200">ID Verified</p>
                      <p className="text-xs text-blue-600 dark:text-blue-300">{profile.id_verification.type}</p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-blue-600 ml-auto" />
                  </div>
                  {profile.id_verification.expiry_date && (
                    <p className="text-xs text-muted-foreground">
                      Expires: {formatDate(profile.id_verification.expiry_date)}
                    </p>
                  )}
                  {profile.id_verification.document_url && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full mt-2 border-blue-500/30"
                      onClick={() => window.open(profile.id_verification?.document_url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View ID Document
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : bundleFlags?.includeId === false ? (
              <Card className="border-dashed border-gray-300">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <IdCard className="h-5 w-5" />
                    <span className="text-sm">ID Not Included</span>
                  </div>
                </CardContent>
              </Card>
            ) : null}

            {/* Payment Authorization Card */}
            {profile.payment_authorized ? (
              <Card className="border-purple-500/30 bg-purple-50 dark:bg-purple-950/20">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-500/20 rounded-full">
                      <Wallet className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-purple-800 dark:text-purple-200">Payment Authorized</p>
                      <p className="text-xs text-purple-600 dark:text-purple-300">
                        {profile.payment_authorized.type.toUpperCase()} •••• {profile.payment_authorized.identifier}
                      </p>
                    </div>
                    <CheckCircle2 className="h-5 w-5 text-purple-600 ml-auto" />
                  </div>
                  {profile.payment_authorized.bar_tab_enabled && (
                    <Badge variant="outline" className="bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300">
                      Bar Tab Enabled
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ) : bundleFlags?.includePayment === false ? (
              <Card className="border-dashed border-gray-300">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Wallet className="h-5 w-5" />
                    <span className="text-sm">Payment Not Included</span>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Scanner Instructions */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-4 pb-4">
              <p className="text-sm text-center text-muted-foreground">
                <strong>📋 Scanner Instructions:</strong> Verify photo match, check compliance status, 
                {profile.id_verification && " view ID if needed,"}
                {profile.payment_authorized && " process bar tab payments."}
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
        {/* Countdown Timer */}
        <CountdownTimer />

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
            {/* ID Verification Status */}
            {profile.id_status && (
              <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <IdCard className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-blue-700 dark:text-blue-300">{profile.id_status}</span>
              </div>
            )}
            
            {profile.gender_identity && (
              <div>
                <span className="font-medium">Gender Identity:</span> {profile.gender_identity}
              </div>
            )}
            
            {/* Sexual Orientation - Only if sharing enabled */}
            {privacySettings?.orientationShared && profile.sexual_orientation && (
              <div>
                <span className="font-medium">Sexual Orientation:</span> {profile.sexual_orientation}
              </div>
            )}
            
            {profile.relationship_status && (
              <div>
                <span className="font-medium">Relationship Status:</span> {profile.relationship_status}
              </div>
            )}

            {/* Interests & Preferences - Only if sharing enabled */}
            {privacySettings?.interestsShared && profile.selected_interests && profile.selected_interests.length > 0 && (
              <div>
                <span className="font-medium">Interests:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.selected_interests.map((interest, index) => (
                    <Badge key={index} variant="outline">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* User Interests by Category - Only if sharing enabled */}
            {privacySettings?.interestsShared && profile.user_interests && Object.keys(profile.user_interests).length > 0 && (
              <div className="mt-3">
                {Object.entries(profile.user_interests).map(([category, items]) => (
                  items && items.length > 0 && (
                    <div key={category} className="mb-2">
                      <span className="text-sm font-medium text-muted-foreground">{category}:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {items.map((item: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{item}</Badge>
                        ))}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}

            {/* Vices / Lifestyle - Only if sharing enabled */}
            {privacySettings?.vicesShared && profile.vices && profile.vices.length > 0 && (
              <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <span className="font-medium text-purple-700 dark:text-purple-300">Lifestyle:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.vices.map((vice, index) => (
                    <Badge key={index} variant="outline" className="border-purple-500/30 text-purple-700 dark:text-purple-300">{vice}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Social Media - Only if sharing enabled */}
            {privacySettings?.socialShared && profile.social_media && typeof profile.social_media === 'object' && (
              <div className="mt-3 p-3 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                <span className="font-medium text-pink-700 dark:text-pink-300 flex items-center gap-2 mb-2">
                  <Instagram className="h-4 w-4" />
                  Social Media
                </span>
                <div className="space-y-1 text-sm">
                  {profile.social_media.instagram && (
                    <p>Instagram: <a href={`https://instagram.com/${profile.social_media.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">{profile.social_media.instagram}</a></p>
                  )}
                  {profile.social_media.tiktok && (
                    <p>TikTok: <a href={`https://tiktok.com/@${profile.social_media.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">{profile.social_media.tiktok}</a></p>
                  )}
                  {profile.social_media.facebook && (
                    <p>Facebook: <span className="text-pink-600">{profile.social_media.facebook}</span></p>
                  )}
                  {profile.social_media.twitter && (
                    <p>Twitter/X: <a href={`https://twitter.com/${profile.social_media.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">{profile.social_media.twitter}</a></p>
                  )}
                </div>
              </div>
            )}

            {/* Social Media Locked */}
            {profile.social_media === "Locked by User" && (
              <div className="mt-3 p-3 bg-muted/50 rounded-lg flex items-center gap-2 text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span className="text-sm">Social media handles are private</span>
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

        {/* Uploaded Documents */}
        {profile.documents && profile.documents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Verification Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {profile.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{doc.title}</p>
                      {doc.issue_date && (
                        <p className="text-sm text-muted-foreground">
                          Issued: {formatDate(doc.issue_date)}
                        </p>
                      )}
                    </div>
                    {doc.document_url && (
                      <Button
                        onClick={() => {
                          setSelectedDocument(doc);
                          setDocumentViewerOpen(true);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="sm"
                      >
                        View
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Document Viewer Dialog */}
        <Dialog open={documentViewerOpen} onOpenChange={setDocumentViewerOpen}>
          <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] p-0 overflow-hidden">
            <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
              <DialogTitle className="text-lg font-semibold">
                {selectedDocument?.title || "Document"}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {selectedDocument?.document_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(selectedDocument.document_url!, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Open in New Tab
                  </Button>
                )}
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-auto p-4 bg-muted/30" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              {selectedDocument?.document_url && (
                <>
                  {selectedDocument.document_url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp|bmp)/) ? (
                    <img
                      src={selectedDocument.document_url}
                      alt={selectedDocument.title}
                      className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                    />
                  ) : selectedDocument.document_url.toLowerCase().endsWith('.pdf') ? (
                    <iframe
                      src={selectedDocument.document_url}
                      className="w-full h-[70vh] rounded-lg border"
                      title={selectedDocument.title}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle2 className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-lg font-medium mb-2">{selectedDocument.title}</p>
                      <p className="text-sm text-muted-foreground mb-4">
                        This document type cannot be previewed directly.
                      </p>
                      <Button
                        onClick={() => window.open(selectedDocument.document_url!, '_blank')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Download / Open Document
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Join VALID CTA */}
        <Card className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-2 border-green-500/60 shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-pulse-slow">
          <CardContent className="pt-6 pb-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center p-3 bg-green-500/30 rounded-full mb-2 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                <Shield className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-green-400">Create Your Own VALID Profile</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Join thousands of members who share their verified status securely. 
                Get your own QR code and start building trust today.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 shadow-[0_0_20px_rgba(34,197,94,0.6)] hover:shadow-[0_0_30px_rgba(34,197,94,0.8)] transition-all"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Join Now - It's Free
                  </Button>
                </Link>
                <Link to="/">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto border-green-500/50 text-green-400 hover:bg-green-500/20"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
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
      </div>
    </div>
  );
};

export default ViewProfile;
