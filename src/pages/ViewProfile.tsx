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
import { Loader2, Heart, User, CheckCircle2, XCircle, Clock, AlertTriangle, X, ExternalLink } from "lucide-react";
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
  documents?: Document[];
  created_at?: string;
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

  // If incognito mode, show limited event scanning view
  if (isIncognitoMode) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
          {/* No countdown timer for incognito mode - 24 hour access utility */}
          <Card className="bg-gray-500/10 border-gray-500/30">
            <CardContent className="py-3">
              <div className="flex items-center justify-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    24-Hour Access Pass
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Valid until {tokenExpiresAt ? new Date(tokenExpiresAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <Badge variant="secondary" className="mt-4 bg-gray-500 text-white">
                    Incognito Access Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

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
