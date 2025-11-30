import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Share2, Download, Clock } from "lucide-react";
import { toast } from "sonner";
import SponsorUpload from "./SponsorUpload";

interface QRCodeTabProps {
  userId: string;
}

const QRCodeTab = ({ userId }: QRCodeTabProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [statusColor, setStatusColor] = useState<"green" | "yellow" | "red">("green");
  const [lastDocumentDate, setLastDocumentDate] = useState<Date | null>(null);
  const [documentAge, setDocumentAge] = useState<number>(0);
  const [wakeLock, setWakeLock] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string>("");
  const [profileId, setProfileId] = useState<string>("");

  useEffect(() => {
    loadProfileAndDocuments();
    increaseBrightness();
    
    return () => {
      resetBrightness();
    };
  }, [userId]);

  const loadProfileAndDocuments = async () => {
    try {
      // Load profile to get status color and ID
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, status_color")
        .eq("user_id", userId)
        .single();
      
      if (profileData) {
        setStatusColor((profileData.status_color as "green" | "yellow" | "red") || "green");
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
    if (documentAge <= 60) return "green";
    if (documentAge <= 120) return "yellow";
    return "red";
  };

  const getGlowColor = () => {
    const color = getTimestampColor();
    switch (color) {
      case "green":
        return "shadow-[0_0_40px_12px_rgba(34,197,94,0.8)] shadow-green-500/60 animate-pulse";
      case "yellow":
        return "shadow-[0_0_40px_12px_rgba(234,179,8,0.8)] shadow-yellow-500/60 animate-pulse";
      case "red":
        return "shadow-[0_0_40px_12px_rgba(239,68,68,0.8)] shadow-red-500/60 animate-pulse";
      default:
        return "shadow-[0_0_20px_8px_rgba(156,163,175,0.5)]";
    }
  };

  const getBorderColor = () => {
    const color = getTimestampColor();
    switch (color) {
      case "green":
        return "border-green-500 ring-4 ring-green-500/30";
      case "yellow":
        return "border-yellow-500 ring-4 ring-yellow-500/30";
      case "red":
        return "border-red-500 ring-4 ring-red-500/30";
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
      case "green":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "yellow":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "red":
        return "bg-red-500 hover:bg-red-600 text-white";
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
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Clean Check Profile",
          text: "View my verified health profile",
          url: profileUrl,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast.success("Secure profile link copied to clipboard");
    }
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
          <CardTitle className="bg-gradient-to-r from-blue-600 via-primary to-pink-600 bg-clip-text text-transparent">Your QR Code</CardTitle>
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
            
            {lastDocumentDate && (
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-full flex justify-center">
                <Badge className={`${getTimestampBadgeClass()} flex items-center gap-2 px-4 py-2 text-sm font-semibold shadow-lg`}>
                  <Clock className="h-4 w-4" />
                  <span>{documentAge} {documentAge === 1 ? 'day' : 'days'} ago</span>
                </Badge>
              </div>
            )}
          </div>

          {lastDocumentDate && (
            <div className="text-center space-y-1 mt-4">
              <p className="text-xs text-muted-foreground">
                Document uploaded: {lastDocumentDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>1-60 days</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <span>61-120 days</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span>121+ days</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2 w-full max-w-xs">
            <Button onClick={handleShare} className="flex-1" variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>

          <div className="text-sm text-muted-foreground text-center">
            <p>Secure Profile Link (expires in 24 hours):</p>
            <code className="text-xs bg-muted px-2 py-1 rounded break-all">
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