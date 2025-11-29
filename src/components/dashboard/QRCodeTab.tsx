import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Share2, Download } from "lucide-react";
import { toast } from "sonner";

interface QRCodeTabProps {
  userId: string;
}

const QRCodeTab = ({ userId }: QRCodeTabProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    generateQRCode();
  }, [userId]);

  const generateQRCode = () => {
    const profileUrl = `${window.location.origin}/profile/${userId}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;
    setQrCodeUrl(qrUrl);
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
          <div className="p-4 bg-card border rounded-lg">
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