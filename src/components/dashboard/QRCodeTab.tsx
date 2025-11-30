import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Share2, Download, Clock } from "lucide-react";
import { toast } from "sonner";

interface QRCodeTabProps {
  userId: string;
}

const QRCodeTab = ({ userId }: QRCodeTabProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [statusColor, setStatusColor] = useState<"green" | "yellow" | "red">("green");
  const [lastDocumentDate, setLastDocumentDate] = useState<Date | null>(null);
  const [documentAge, setDocumentAge] = useState<number>(0);

  useEffect(() => {
    generateQRCode();
    loadProfileAndDocuments();
    increaseBrightness();
    
    return () => {
      resetBrightness();
    };
  }, [userId]);

  const loadProfileAndDocuments = async () => {
    try {
      // Load profile to get status color
      const { data: profileData } = await supabase
        .from("profiles")
        .select("status_color")
        .eq("user_id", userId)
        .single();
      
      if (profileData) {
        setStatusColor((profileData.status_color as "green" | "yellow" | "red") || "green");
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

  const generateQRCode = () => {
    const profileUrl = `${window.location.origin}/profile/${userId}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;
    setQrCodeUrl(qrUrl);
  };

  const increaseBrightness = async () => {
    try {
      if ('wakeLock' in navigator) {
        await (navigator as any).wakeLock.request('screen');
      }
    } catch (error) {
      console.log("Screen brightness control not available");
    }
  };

  const resetBrightness = () => {
    // Wake lock is automatically released when component unmounts
  };

  const getTimestampColor = () => {
    if (documentAge === 0) return "gray";
    if (documentAge <= 60) return "green";
    if (documentAge <= 120) return "yellow";
    return "red";
  };

  const getGlowColor = () => {
    switch (statusColor) {
      case "green":
        return "shadow-[0_0_20px_8px_rgba(34,197,94,0.6)]";
      case "yellow":
        return "shadow-[0_0_20px_8px_rgba(234,179,8,0.6)]";
      case "red":
        return "shadow-[0_0_20px_8px_rgba(239,68,68,0.6)]";
      default:
        return "";
    }
  };

  const getBorderColor = () => {
    switch (statusColor) {
      case "green":
        return "border-green-500";
      case "yellow":
        return "border-yellow-500";
      case "red":
        return "border-red-500";
      default:
        return "border-border";
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
    const profileUrl = `${window.location.origin}/profile/${userId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Clean Check Profile",
          text: "View my professional cleaning certifications",
          url: profileUrl,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast.success("Profile link copied to clipboard");
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
          <CardTitle>Your QR Code</CardTitle>
          <CardDescription>
            Share this QR code with clients and partners to showcase your certifications
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className={`p-4 bg-card border-4 ${getBorderColor()} rounded-lg ${getGlowColor()} transition-all duration-300`}>
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
            <div className="flex flex-col items-center gap-2">
              <Badge className={`${getTimestampBadgeClass()} flex items-center gap-1.5 px-3 py-1.5`}>
                <Clock className="h-3.5 w-3.5" />
                <span>Document uploaded {documentAge} {documentAge === 1 ? 'day' : 'days'} ago</span>
              </Badge>
              <p className="text-xs text-muted-foreground">
                {lastDocumentDate.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
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
            <p>Profile URL:</p>
            <code className="text-xs bg-muted px-2 py-1 rounded">
              {window.location.origin}/profile/{userId}
            </code>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRCodeTab;