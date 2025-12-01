import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldCheck, Share2, Loader2, Download } from "lucide-react";
import QRCodeStyling from "qr-code-styling";

interface SafetyQRCodeProps {
  userId: string;
}

export const SafetyQRCode = ({ userId }: SafetyQRCodeProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string>("");
  const [verifiedDate, setVerifiedDate] = useState<string>("");

  useEffect(() => {
    loadSafetyData();
  }, [userId]);

  const loadSafetyData = async () => {
    try {
      // Get profile ID
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (profileError) throw profileError;
      setProfileId(profile.id);

      // Get most recent verified TOX result
      const { data: order, error: orderError } = await supabase
        .from("lab_orders")
        .select("created_at")
        .eq("user_id", userId)
        .eq("test_type", "TOX_10_PANEL")
        .eq("result_status", "negative")
        .eq("order_status", "result_received")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (orderError) throw orderError;
      setVerifiedDate(new Date(order.created_at).toLocaleDateString());

      // Generate QR code
      await generateSafetyCertificate(profile.id);
    } catch (error: any) {
      console.error("Error loading safety data:", error);
      toast.error("Failed to load safety certificate");
    } finally {
      setLoading(false);
    }
  };

  const generateSafetyCertificate = async (profileId: string) => {
    try {
      // Generate unique token
      const token = Array.from({ length: 32 }, () =>
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
          Math.floor(Math.random() * 62)
        ]
      ).join("");

      // Create certificate with 24-hour expiration
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      const { error } = await supabase.from("safety_certificates").insert({
        profile_id: profileId,
        token,
        test_type: "TOX_10_PANEL",
        expires_at: expiresAt.toISOString(),
      });

      if (error) throw error;

      const url = `${window.location.origin}/safety-certificate?token=${token}`;
      setQrCodeUrl(url);

      // Generate QR code with green shield styling
      const qrCode = new QRCodeStyling({
        width: 300,
        height: 300,
        data: url,
        margin: 10,
        qrOptions: { errorCorrectionLevel: "H" },
        imageOptions: { hideBackgroundDots: true, imageSize: 0.4, margin: 5 },
        dotsOptions: { color: "#16a34a", type: "rounded" },
        backgroundOptions: { color: "#ffffff" },
        cornersSquareOptions: { color: "#15803d", type: "extra-rounded" },
        cornersDotOptions: { color: "#166534", type: "dot" },
      });

      const canvas = document.createElement("canvas");
      await qrCode.append(canvas);
      const dataUrl = canvas.toDataURL();
      
      const qrContainer = document.getElementById("safety-qr-container");
      if (qrContainer) {
        qrContainer.innerHTML = "";
        const img = document.createElement("img");
        img.src = dataUrl;
        img.className = "w-full h-auto";
        qrContainer.appendChild(img);
      }
    } catch (error: any) {
      console.error("Error generating safety certificate:", error);
      toast.error("Failed to generate safety certificate");
    }
  };

  const handleShare = async () => {
    if (!qrCodeUrl) return;

    const shareText = `My 10-Panel Toxicology Lab Certified Result - Verified Negative\n\nView my certificate: ${qrCodeUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Toxicology Lab Certified Certificate",
          text: shareText,
        });
        toast.success("Shared successfully!");
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(qrCodeUrl);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link");
      }
    }
  };

  const handleDownload = () => {
    const qrContainer = document.getElementById("safety-qr-container");
    if (!qrContainer) return;

    const img = qrContainer.querySelector("img");
    if (!img) return;

    const link = document.createElement("a");
    link.download = "safety-certificate-qr.png";
    link.href = img.src;
    link.click();
    toast.success("QR code downloaded!");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <Card className="shadow-xl border-green-500/40 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 bg-clip-text text-transparent">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          Your Safety Pass
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border-4 border-green-500">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-full"></div>
              <div id="safety-qr-container" className="relative bg-white p-4 rounded-xl"></div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600" />
                <p className="font-bold text-green-700 dark:text-green-400">
                  10-Panel Toxicology Lab Certified: NEGATIVE
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Verified Date: {verifiedDate}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleShare}
            size="lg"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Result
          </Button>
          <Button
            onClick={handleDownload}
            size="lg"
            variant="outline"
            className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>

        <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-500/30 rounded-lg p-4">
          <p className="text-xs text-muted-foreground text-center">
            🔒 This certificate expires in 24 hours. Generate a new one anytime.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};