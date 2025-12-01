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
import { QrCode, Share2, Download, Clock, Mail, MessageSquare, Copy, ExternalLink } from "lucide-react";
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
    
    // Only activate brightness for gray/incognito mode
    if (statusColor === "gray") {
      increaseBrightness();
    }
    
    return () => {
      resetBrightness();
    };
  }, [userId, statusColor]);

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
      if ('wakeLock' in navigator) {
        const lock = await (navigator as any).wakeLock.request('screen');
        setWakeLock(lock);
        console.log('Screen wake lock activated - screen will stay bright');
        
        // Handle wake lock release
        lock.addEventListener('release', () => {
          console.log('Screen wake lock released');
        });
      }
    } catch (error) {
      console.log("Screen wake lock not available on this device");
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
    // Use statusColor for the glow if it's set and not gray, otherwise use document age color
    const color = statusColor !== "gray" ? statusColor : getTimestampColor();
    switch (color) {
      case "green":
        return "shadow-[0_0_25px_8px_rgba(34,197,94,0.4)] shadow-green-500/30";
      case "blue":
        return "shadow-[0_0_25px_8px_rgba(59,130,246,0.4)] shadow-blue-500/30";
      case "pink":
        return "shadow-[0_0_25px_8px_rgba(236,72,153,0.4)] shadow-pink-500/30";
      case "purple":
        return "shadow-[0_0_25px_8px_rgba(168,85,247,0.4)] shadow-purple-500/30";
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
    // Use statusColor for the border if it's set and not gray, otherwise use document age color
    const color = statusColor !== "gray" ? statusColor : getTimestampColor();
    switch (color) {
      case "green":
        return "border-green-500 ring-4 ring-green-500/30";
      case "blue":
        return "border-blue-500 ring-4 ring-blue-500/30";
      case "pink":
        return "border-pink-500 ring-4 ring-pink-500/30";
      case "purple":
        return "border-purple-500 ring-4 ring-purple-500/30";
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
        return "bg-blue-500 hover:bg-blue-600 text-white";
      case "pink":
        return "bg-pink-500 hover:bg-pink-600 text-white";
      case "purple":
        return "bg-purple-500 hover:bg-purple-600 text-white";
      default:
        return "";
    }
  };

  const handleShare = async () => {
    if (!accessToken) {
      toast.error("Access token not available yet");
      return;
    }
    
    const profileUrl = `${window.location.origin}/view-profile?token=${accessToken}`;
    
    // Try native share if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Clean Check Profile",
          text: "View my verified health profile",
          url: profileUrl,
        });
        toast.success("Shared successfully!");
      } catch (error: any) {
        // User cancelled or error occurred
        if (error.name !== 'AbortError') {
          console.error('Share error:', error);
          // Fallback to copy
          handleCopyLink();
        }
      }
    } else {
      // No native share available, copy to clipboard
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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = "cleancheck-qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR code downloaded");
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
              <Badge className={`${getTimestampBadgeClass()} flex items-center gap-2 px-4 py-2 text-sm font-semibold shadow-lg`}>
                <Clock className="h-4 w-4" />
                <span>{documentAge} {documentAge === 1 ? 'day' : 'days'} ago</span>
              </Badge>
            </div>
          )}

          {/* Border Color Explainer */}
          <div className="w-full max-w-md space-y-3 p-4 rounded-lg border bg-muted/50">
            <h4 className="text-sm font-semibold text-center">QR Code Border Color</h4>
            <p className="text-xs text-muted-foreground text-center">
              The colored border around your QR code is a <strong>voluntary member-chosen identifier</strong> that signals your health status preference to others.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded bg-background">
                <div className="w-3 h-3 rounded-full bg-green-500 ring-2 ring-green-500/30"></div>
                <span>All Clean</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-background">
                <div className="w-3 h-3 rounded-full bg-yellow-500 ring-2 ring-yellow-500/30"></div>
                <span>Caution</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-background">
                <div className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-500/30"></div>
                <span>Be Aware</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded bg-background">
                <div className="w-3 h-3 rounded-full bg-gray-500 ring-2 ring-gray-500/30"></div>
                <span>Incognito</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center italic">
              You can change your status color in the Profile tab
            </p>
          </div>

          {lastDocumentDate && (
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">
                Document uploaded: {lastDocumentDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span>1-60 days</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                  <span>61-120 days</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>121+ days</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="flex-1 min-h-[44px]" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                <DropdownMenuItem onClick={handleShare}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share via Device
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleShareEmail}>
                  <Mail className="h-4 w-4 mr-2" />
                  Share via Email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareSMS}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Share via SMS
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareWhatsApp}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Share via WhatsApp
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleDownload} className="flex-1 min-h-[44px]">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
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