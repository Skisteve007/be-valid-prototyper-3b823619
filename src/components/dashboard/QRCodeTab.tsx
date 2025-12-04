import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { QrCode, Share2, Clock, Mail, MessageSquare, Copy, ExternalLink, Shield, Lock, FileText, AlertTriangle, Camera, Upload, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import SponsorUpload from "./SponsorUpload";
import LiabilityWaiverModal, { useWaiverStatus } from "./LiabilityWaiverModal";
import { IncognitoQRDialog } from "./IncognitoQRDialog";

interface QRCodeTabProps {
  userId: string;
}

const QRCodeTab = ({ userId }: QRCodeTabProps) => {
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [statusColor, setStatusColor] = useState<"green" | "yellow" | "red" | "gray">("green");
  const [lastDocumentDate, setLastDocumentDate] = useState<Date | null>(null);
  const [documentAge, setDocumentAge] = useState<number>(0);
  const [hasDocuments, setHasDocuments] = useState<boolean | null>(null);
  const [hasProfileImage, setHasProfileImage] = useState<boolean | null>(null);
  const [wakeLock, setWakeLock] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const [profileId, setProfileId] = useState<string>("");
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [showIncognitoDialog, setShowIncognitoDialog] = useState(false);
  
  // Waiver status
  const { hasSignedWaiver, isLoading: waiverLoading, waiverSignedAt, checkWaiverStatus, setHasSignedWaiver } = useWaiverStatus(userId);

  useEffect(() => {
    loadProfileAndDocuments();
    checkWaiverStatus();
    
    return () => {
      resetBrightness();
    };
  }, [userId]);

  // Separate effect to handle brightness when status color changes
  useEffect(() => {
    if (statusColor === "gray") {
      console.log("Gray QR code detected - activating screen wake lock");
      increaseBrightness();
    } else {
      resetBrightness();
    }
  }, [statusColor]);

  const loadProfileAndDocuments = async () => {
    try {
      console.log("QRCodeTab: Loading profile and documents");
      // Load profile to get status color, ID, and profile image
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, status_color, profile_image_url")
        .eq("user_id", userId)
        .single();
      
      if (profileData) {
        console.log("QRCodeTab: Loaded status color:", profileData.status_color);
        setStatusColor((profileData.status_color as "green" | "yellow" | "red" | "gray") || "green");
        setProfileId(profileData.id);
        setHasProfileImage(!!profileData.profile_image_url);
        
        // Generate access token for this profile
        await generateAccessToken(profileData.id);
      } else {
        setHasProfileImage(false);
      }

      // Load most recent document
      const { data: documents } = await supabase
        .from("certifications")
        .select("created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (documents && documents.length > 0) {
        setHasDocuments(true);
        const docDate = new Date(documents[0].created_at);
        setLastDocumentDate(docDate);
        
        // Calculate age in days
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - docDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDocumentAge(diffDays);
      } else {
        setHasDocuments(false);
      }
    } catch (error: any) {
      console.error("Failed to load data:", error);
    }
  };

  const generateAccessToken = async (profileId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-qr-token', {
        body: { profileId },
      });

      if (error) {
        console.error("Failed to generate access token:", error);
        toast.error("Failed to generate secure access token");
        return;
      }

      if (data?.token) {
        setAccessToken(data.token);
        // Generate QR code with token
        const profileUrl = `${window.location.origin}/view-profile?token=${data.token}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;
        setQrCodeUrl(qrUrl);
      }
    } catch (error) {
      console.error("Error generating access token:", error);
      toast.error("Failed to generate secure access token");
    }
  };

  const generateQRCode = () => {
    if (!accessToken) return;
    const profileUrl = `${window.location.origin}/view-profile?token=${accessToken}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;
    setQrCodeUrl(qrUrl);
  };

  const increaseBrightness = async () => {
    try {
      // Release existing lock first
      if (wakeLock) {
        await wakeLock.release();
        setWakeLock(null);
      }
      
      if ('wakeLock' in navigator) {
        console.log('Requesting screen wake lock for mobile brightness...');
        const lock = await (navigator as any).wakeLock.request('screen');
        setWakeLock(lock);
        console.log('✅ Screen wake lock activated - screen will stay bright');
        toast.success("Screen brightness activated", { duration: 2000 });
        
        // Handle wake lock release
        lock.addEventListener('release', () => {
          console.log('Screen wake lock released');
          setWakeLock(null);
        });
        
        return lock;
      } else {
        console.log("⚠️ Screen wake lock not supported on this browser");
        toast.error("Screen brightness control not available on this device");
      }
    } catch (error) {
      console.error("⚠️ Screen wake lock error:", error);
      toast.error("Could not activate screen brightness");
    }
  };

  const resetBrightness = () => {
    if (wakeLock) {
      wakeLock.release()
        .then(() => {
          setWakeLock(null);
          console.log('Screen wake lock manually released');
        })
        .catch((err: any) => console.log('Wake lock release error:', err));
    }
  };

  const getTimestampColor = () => {
    if (documentAge === 0) return "gray";
    if (documentAge <= 60) return "blue";
    if (documentAge <= 120) return "pink";
    return "purple";
  };

  const getGlowColor = () => {
    // Use statusColor directly - gray stays gray
    const color = statusColor;
    switch (color) {
      case "green":
        return "shadow-[0_0_25px_8px_rgba(34,197,94,0.4)] shadow-green-500/30";
      case "yellow":
        return "shadow-[0_0_25px_8px_rgba(234,179,8,0.4)] shadow-yellow-500/30";
      case "red":
        return "shadow-[0_0_25px_8px_rgba(239,68,68,0.4)] shadow-red-500/30";
      case "gray":
        return "shadow-[0_0_20px_6px_rgba(107,114,128,0.3)] shadow-gray-500/20";
      default:
        return "shadow-[0_0_20px_6px_rgba(156,163,175,0.3)]";
    }
  };

  const getBorderColor = () => {
    // Use statusColor directly - gray stays gray
    const color = statusColor;
    switch (color) {
      case "green":
        return "border-green-500 ring-4 ring-green-500/30";
      case "yellow":
        return "border-yellow-500 ring-4 ring-yellow-500/30";
      case "red":
        return "border-red-500 ring-4 ring-red-500/30";
      case "gray":
        return "border-gray-500 ring-4 ring-gray-500/30";
      default:
        return "border-gray-400";
    }
  };

  const getTimestampBadgeVariant = () => {
    const color = getTimestampColor();
    if (color === "gray") return "secondary";
    return "default";
  };

  const getTimestampBadgeClass = () => {
    const color = getTimestampColor();
    switch (color) {
      case "blue":
        return "bg-blue-500 text-white";
      case "pink":
        return "bg-pink-500 text-white";
      case "purple":
        return "bg-purple-500 text-white";
      default:
        return "";
    }
  };

  const handleShare = async () => {
    if (!accessToken) {
      toast.error("Access token not available yet");
      return;
    }
    
    // Ensure screen stays bright when sharing gray QR code
    if (statusColor === "gray") {
      console.log("Sharing gray QR code - ensuring screen brightness");
      await increaseBrightness();
      toast.success("Screen brightness activated for scanning", { duration: 2000 });
    }
    
    const profileUrl = `${window.location.origin}/view-profile?token=${accessToken}`;
    
    // Check if native share is available (works on mobile)
    if (navigator.share) {
      try {
        console.log("Attempting native share with URL:", profileUrl);
        await navigator.share({
          title: "My Clean Check Profile",
          text: "View my verified health profile",
          url: profileUrl,
        });
        console.log("Share successful");
        toast.success("Shared successfully!");
      } catch (error: any) {
        console.error('Share error:', error);
        // Only show error if user didn't cancel
        if (error.name === 'AbortError') {
          console.log('User cancelled share');
        } else {
          toast.error("Share failed. Link copied to clipboard instead.");
          handleCopyLink();
        }
      }
    } else {
      // Desktop fallback - copy to clipboard
      console.log("Native share not available, copying to clipboard");
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    const profileUrl = `${window.location.origin}/view-profile?token=${accessToken}`;
    navigator.clipboard.writeText(profileUrl).then(() => {
      toast.success("Secure profile link copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy link");
    });
  };

  const handleShareEmail = () => {
    const profileUrl = `${window.location.origin}/view-profile?token=${accessToken}`;
    const subject = encodeURIComponent("My Clean Check Verified Profile");
    const body = encodeURIComponent(`View my verified health profile:\n\n${profileUrl}\n\nThis secure link expires in 24 hours.`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    toast.success("Opening email client...");
  };

  const handleShareSMS = () => {
    const profileUrl = `${window.location.origin}/view-profile?token=${accessToken}`;
    const message = encodeURIComponent(`View my Clean Check verified profile: ${profileUrl}`);
    window.open(`sms:?body=${message}`, '_blank');
    toast.success("Opening SMS...");
  };

  const handleShareWhatsApp = () => {
    const profileUrl = `${window.location.origin}/view-profile?token=${accessToken}`;
    const message = encodeURIComponent(`View my Clean Check verified profile: ${profileUrl}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
    toast.success("Opening WhatsApp...");
  };

  return (
    <div className="space-y-6 py-4">
      {/* Liability Waiver Modal */}
      <LiabilityWaiverModal
        open={showWaiverModal}
        onClose={() => setShowWaiverModal(false)}
        onSigned={() => {
          setHasSignedWaiver(true);
          setShowWaiverModal(false);
        }}
        userId={userId}
      />

      {/* Profile Photo Required Prompt - Shows when no profile image */}
      {hasProfileImage === false && (
        <Card className="border-2 border-red-500/50 bg-red-50 dark:bg-red-950/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <Camera className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-red-800 dark:text-red-200 flex items-center justify-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Step 1: Upload Profile Photo
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300 mt-2 max-w-md">
                  A profile photo is required before you can use your QR code. 
                  This helps verify your identity when others scan your code.
                </p>
              </div>
              <Button 
                onClick={() => {
                  const searchParams = new URLSearchParams(window.location.search);
                  searchParams.set('tab', 'profile');
                  window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
                  window.location.reload();
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                Go to Profile Tab
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Upload Prompt - Shows when profile image exists but no documents */}
      {hasProfileImage === true && hasDocuments === false && (
        <Card className="border-2 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-amber-500/20 rounded-full">
                <Upload className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-amber-800 dark:text-amber-200 flex items-center justify-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Step 2: Upload Health Document
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-2 max-w-md">
                  Upload a health document to complete your profile. 
                  Documents you upload will be visible when others scan your QR code.
                </p>
              </div>
              <Button 
                onClick={() => {
                  const searchParams = new URLSearchParams(window.location.search);
                  searchParams.set('tab', 'certifications');
                  window.history.replaceState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
                  window.location.reload();
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Upload Documents Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SECTION A: MAIN QR CODE CARD - INTERACTIVE */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Your QR Code</span>
            </CardTitle>
            {hasSignedWaiver && waiverSignedAt && (
              <Badge variant="outline" className="text-xs bg-green-500/10 border-green-500/30 text-green-600">
                <Shield className="h-3 w-3 mr-1" />
                Waiver Signed
              </Badge>
            )}
          </div>
          <CardDescription>
            Share this secure QR code to give temporary access to your verified profile. Access expires after 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {/* Gatekeeper: Block QR if waiver not signed */}
          {!waiverLoading && hasSignedWaiver === false ? (
            <div className="relative w-full">
              {/* Blurred/locked QR placeholder */}
              <div className="p-6 bg-muted/50 border-4 border-gray-400 rounded-2xl relative overflow-hidden">
                <div className="w-64 h-64 flex items-center justify-center bg-muted blur-sm mx-auto">
                  <QrCode className="h-32 w-32 text-muted-foreground/50" />
                </div>
                {/* Lock overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                  <Lock className="h-12 w-12 text-amber-500 mb-4" />
                  <p className="text-center font-semibold mb-2">Liability Waiver Required</p>
                  <p className="text-sm text-muted-foreground text-center mb-4 px-4">
                    Sign the liability release to generate your pass
                  </p>
                  <Button
                    onClick={() => setShowWaiverModal(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Review & Sign Waiver
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="relative">
                <div className={`p-6 bg-white dark:bg-card border-4 ${getBorderColor()} rounded-2xl ${getGlowColor()} transition-all duration-500`}>
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code"
                      className="w-64 h-64"
                    />
                  ) : (
                    <div className="w-64 h-64 flex items-center justify-center bg-muted">
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>
                
              {lastDocumentDate && (
                <div className="flex justify-center -mt-2">
                  <div className={`${getTimestampBadgeClass()} flex items-center gap-2 px-4 py-2 text-sm font-semibold shadow-lg rounded-full pointer-events-none`}>
                    <Clock className="h-4 w-4" />
                    <span>{documentAge} {documentAge === 1 ? 'day' : 'days'} ago</span>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col gap-2 w-full max-w-xs">
                {/* Share button with dropdown for all share options */}
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      className="w-full min-h-[48px] bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white touch-manipulation shadow-lg" 
                      type="button"
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      Share My Profile
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56 z-50">
                    <DropdownMenuItem onClick={handleShare} className="min-h-[44px] touch-manipulation">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Share Now
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleCopyLink} className="min-h-[44px] touch-manipulation">
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleShareEmail} className="min-h-[44px] touch-manipulation">
                      <Mail className="h-4 w-4 mr-2" />
                      Share via Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareSMS} className="min-h-[44px] touch-manipulation">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Share via SMS
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleShareWhatsApp} className="min-h-[44px] touch-manipulation">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Share via WhatsApp
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Incognito Mode Button */}
                <Button 
                  onClick={() => setShowIncognitoDialog(true)}
                  variant="outline"
                  className="w-full min-h-[48px] border-gray-500/50 bg-gray-500/10 hover:bg-gray-500/20 text-gray-700 dark:text-gray-300 touch-manipulation"
                  type="button"
                >
                  <EyeOff className="h-5 w-5 mr-2" />
                  Incognito Mode ($5)
                </Button>
              </div>

              {/* Incognito QR Dialog */}
              <IncognitoQRDialog
                open={showIncognitoDialog}
                onClose={() => setShowIncognitoDialog(false)}
                userId={userId}
              />

              <div className="text-sm text-muted-foreground text-center px-4">
                <p className="mb-2">Secure Profile Link (expires in 24 hours):</p>
                <code className="text-xs bg-muted px-2 py-1 rounded break-all block">
                  {accessToken ? `${window.location.origin}/view-profile?token=${accessToken}` : "Generating..."}
                </code>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* SECTION B: STATIC INFO CARDS - NON-INTERACTIVE */}
      {/* These are physically separated from the main card to prevent any inherited click behaviors */}
      <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
        {/* BORDER COLOR KEY - HARDCODED STATIC DIV */}
        <div 
          data-static-info="true"
          className="flex-1"
          style={{ 
            padding: '0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid hsl(var(--border))',
            backgroundColor: 'hsl(var(--muted) / 0.5)',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            pointerEvents: 'none',
            cursor: 'default',
            touchAction: 'none'
          }}
          onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          <div style={{ fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', marginBottom: '0.5rem' }}>
            Border Color Key
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontSize: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '0.625rem', height: '0.625rem', borderRadius: '9999px', backgroundColor: 'rgb(34, 197, 94)', border: '1px solid rgba(34, 197, 94, 0.3)' }}></div>
              <span>Clean</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '0.625rem', height: '0.625rem', borderRadius: '9999px', backgroundColor: 'rgb(234, 179, 8)', border: '1px solid rgba(234, 179, 8, 0.3)' }}></div>
              <span>Caution</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '0.625rem', height: '0.625rem', borderRadius: '9999px', backgroundColor: 'rgb(239, 68, 68)', border: '1px solid rgba(239, 68, 68, 0.3)' }}></div>
              <span>Be Aware</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: '0.625rem', height: '0.625rem', borderRadius: '9999px', backgroundColor: 'rgb(107, 114, 128)', border: '1px solid rgba(107, 114, 128, 0.3)' }}></div>
              <span>Incognito</span>
            </div>
          </div>
          {statusColor === "gray" && (
            <div style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '0.25rem', backgroundColor: 'rgb(243, 244, 246)', border: '1px solid rgba(107, 114, 128, 0.3)' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'rgb(55, 65, 81)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
                <span style={{ color: 'rgb(34, 197, 94)' }}>✓</span> Screen Brightness Active
              </p>
            </div>
          )}
        </div>

        {/* DOCUMENT UPLOAD DATE - HARDCODED STATIC DIV */}
        {lastDocumentDate && (
          <div 
            data-static-info="true"
            className="flex-1"
            style={{ 
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--muted) / 0.5)',
              WebkitTapHighlightColor: 'transparent',
              userSelect: 'none',
              pointerEvents: 'none',
              cursor: 'default',
              touchAction: 'none'
            }}
            onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onTouchEnd={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
            <div style={{ fontSize: '0.75rem', textAlign: 'center', fontWeight: 500, marginBottom: '0.5rem' }}>
              Document uploaded: {lastDocumentDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', backgroundColor: 'rgb(59, 130, 246)' }}></div>
                <span>1-60 days</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', backgroundColor: 'rgb(236, 72, 153)' }}></div>
                <span>61-120 days</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', backgroundColor: 'rgb(168, 85, 247)' }}></div>
                <span>121+ days</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <SponsorUpload userId={userId} />
    </div>
  );
};

export default QRCodeTab;