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
import { QrCode, Share2, Clock, Mail, MessageSquare, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import SponsorUpload from "./SponsorUpload";

interface QRCodeTabProps {
  userId: string;
}

const QRCodeTab = ({ userId }: QRCodeTabProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [statusColor, setStatusColor] = useState<"green" | "yellow" | "red" | "gray">("green");
  const [lastDocumentDate, setLastDocumentDate] = useState<Date | null>(null);
  const [documentAge, setDocumentAge] = useState<number>(0);
  const [wakeLock, setWakeLock] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const [profileId, setProfileId] = useState<string>("");

  useEffect(() => {
    loadProfileAndDocuments();
    
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
      // Load profile to get status color and ID
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, status_color")
        .eq("user_id", userId)
        .single();
      
      if (profileData) {
        console.log("QRCodeTab: Loaded status color:", profileData.status_color);
        setStatusColor((profileData.status_color as "green" | "yellow" | "red" | "gray") || "green");
        setProfileId(profileData.id);
        
        // Generate access token for this profile
        await generateAccessToken(profileData.id);
      }

      // Load most recent document
      const { data: documents } = await supabase
        .from("certifications")
        .select("created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (documents && documents.length > 0) {
        const docDate = new Date(documents[0].created_at);
        setLastDocumentDate(docDate);
        
        // Calculate age in days
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - docDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setDocumentAge(diffDays);
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
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Your QR Code</span>
          </CardTitle>
          <CardDescription>
            Share this secure QR code to give temporary access to your verified profile. Access expires after 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
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

          {/* STATIC INFO CARDS - REBUILT FROM SCRATCH */}
          <div className="w-full max-w-md space-y-3">
            {/* BORDER COLOR KEY - PURELY STATIC DISPLAY */}
            <div 
              className="p-3 rounded-lg border bg-muted/50"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none',
                cursor: 'default'
              }}
            >
              <div className="text-xs font-semibold text-center mb-2">
                Border Color Key
              </div>
              <div className="flex items-center justify-center gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-1 ring-green-500/30"></div>
                  <span>Clean</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 ring-1 ring-yellow-500/30"></div>
                  <span>Caution</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-1 ring-red-500/30"></div>
                  <span>Be Aware</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-500 ring-1 ring-gray-500/30"></div>
                  <span>Incognito</span>
                </div>
              </div>
              {statusColor === "gray" && (
                <div className="mt-2 p-2 rounded bg-gray-100 dark:bg-gray-900 border border-gray-500/30">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center flex items-center justify-center gap-1.5">
                    <span className="text-green-500">✓</span> Screen Brightness Active
                  </p>
                </div>
              )}
            </div>

            {/* DOCUMENT UPLOAD DATE - PURELY STATIC DISPLAY */}
            {lastDocumentDate && (
              <div 
                className="p-3 rounded-lg border bg-muted/50"
                style={{ 
                  WebkitTapHighlightColor: 'transparent',
                  userSelect: 'none',
                  cursor: 'default'
                }}
              >
                <div className="text-xs text-center font-medium mb-2">
                  Document uploaded: {lastDocumentDate.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
                <div className="flex items-center justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span>1-60 days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                    <span>61-120 days</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span>121+ days</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2 w-full max-w-xs">
            {/* Primary share button for mobile - uses native share */}
            <Button 
              onClick={handleShare}
              className="w-full min-h-[48px] bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white touch-manipulation shadow-lg" 
              type="button"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share My Profile
            </Button>
            
            {/* Additional sharing options in dropdown - hidden on mobile */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button 
                  className="hidden md:flex w-full min-h-[44px] touch-manipulation" 
                  variant="outline"
                  type="button"
                >
                  More Share Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56 z-50">
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
          </div>

          <div className="text-sm text-muted-foreground text-center px-4">
            <p className="mb-2">Secure Profile Link (expires in 24 hours):</p>
            <code className="text-xs bg-muted px-2 py-1 rounded break-all block">
              {accessToken ? `${window.location.origin}/view-profile?token=${accessToken}` : "Generating..."}
            </code>
          </div>
        </CardContent>
      </Card>

      <SponsorUpload userId={userId} />
    </div>
  );
};

export default QRCodeTab;