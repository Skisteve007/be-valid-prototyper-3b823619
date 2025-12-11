import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Copy, Check, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ShareProfileModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const ShareProfileModal = ({ open, onClose, userId }: ShareProfileModalProps) => {
  const [profileId, setProfileId] = useState<string>("");
  const [shareUrl, setShareUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open && userId) {
      loadProfile();
    }
  }, [open, userId]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (profile) {
        setProfileId(profile.id);
        // Create a short URL using profile ID hash (first 8 chars)
        const shortHash = profile.id.substring(0, 8);
        const url = `${window.location.origin}/p/${shortHash}`;
        setShareUrl(url);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to generate share link");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Valid™ Profile",
          text: "Check out my verified Valid™ profile",
          url: shareUrl,
        });
      } catch (error: any) {
        if (error.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black/90 border-[#00FFC2]/30 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-[#00FFC2] flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share My Valid™ Profile
          </DialogTitle>
          <DialogDescription className="text-[#E0E0FF]/70">
            Share your verified profile with others. This link shows only your public information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 border-2 border-[#00FFC2] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Share URL Display */}
              <div className="space-y-2">
                <label className="text-sm text-[#E0E0FF]/80">Your Profile Link</label>
                <div className="flex gap-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="bg-white/5 border-white/20 text-[#E0E0FF] font-mono text-sm"
                  />
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    className={`min-w-[100px] border-[#00FFC2]/40 ${
                      copied
                        ? "bg-[#00FFC2]/20 text-[#00FFC2]"
                        : "hover:bg-[#00FFC2]/10 text-[#E0E0FF]"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={handleNativeShare}
                  className="w-full bg-[#00FFC2]/20 hover:bg-[#00FFC2]/30 text-[#00FFC2] border border-[#00FFC2]/40"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
                
                <Button
                  onClick={() => window.open(shareUrl, "_blank")}
                  variant="ghost"
                  className="w-full text-[#E0E0FF]/70 hover:text-[#E0E0FF] hover:bg-white/5"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview Profile
                </Button>
              </div>

              {/* Privacy Note */}
              <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-xs text-[#E0E0FF]/60 text-center">
                  <strong className="text-[#00FFC2]">Privacy Protected:</strong> This link only shows your name, photo, and verification status. No financial or health data is shared.
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProfileModal;
