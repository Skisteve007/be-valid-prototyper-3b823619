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
import { Copy, Check, Share2, ExternalLink, Users, Activity, Zap, Ghost, Lock, Unlock } from "lucide-react";
import { toast } from "sonner";

interface ShareProfileModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

type SignalMode = "social" | "pulse" | "thrill" | "afterdark" | null;

const signalConfig: Record<string, { icon: any; label: string; color: string; bg: string }> = {
  social: { icon: Users, label: "SOCIAL", color: "text-cyan-400", bg: "bg-cyan-500/20 border-cyan-400" },
  pulse: { icon: Activity, label: "PULSE", color: "text-green-400", bg: "bg-green-500/20 border-green-400" },
  thrill: { icon: Zap, label: "THRILL", color: "text-orange-400", bg: "bg-orange-500/20 border-orange-400" },
  afterdark: { icon: Ghost, label: "AFTER DARK", color: "text-purple-400", bg: "bg-purple-500/20 border-purple-400" },
};

const ShareProfileModal = ({ open, onClose, userId }: ShareProfileModalProps) => {
  const [profileId, setProfileId] = useState<string>("");
  const [shareUrl, setShareUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signalMode, setSignalMode] = useState<SignalMode>(null);
  const [sharingSettings, setSharingSettings] = useState({
    interests: false,
    vices: false,
    orientation: false,
    social: false,
  });

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
        .select("id, vibe_metadata, sharing_interests_enabled, sharing_vices_enabled, sharing_orientation_enabled, sharing_social_enabled")
        .eq("user_id", userId)
        .single();

      if (profile) {
        setProfileId(profile.id);
        // Create a short URL using profile ID hash (first 8 chars)
        const shortHash = profile.id.substring(0, 8);
        const url = `${window.location.origin}/p/${shortHash}`;
        setShareUrl(url);
        
        // Get signal mode from vibe_metadata
        const metadata = profile.vibe_metadata as Record<string, any> | null;
        setSignalMode(metadata?.mode || null);
        
        // Get sharing settings
        setSharingSettings({
          interests: profile.sharing_interests_enabled || false,
          vices: profile.sharing_vices_enabled || false,
          orientation: profile.sharing_orientation_enabled || false,
          social: profile.sharing_social_enabled || false,
        });
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

  const currentSignal = signalMode ? signalConfig[signalMode] : null;
  const SignalIcon = currentSignal?.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black/90 border-[#00FFC2]/30 backdrop-blur-xl max-h-[85vh] overflow-y-auto mt-8 md:mt-0">
        <DialogHeader>
          <DialogTitle className="text-[#00FFC2] flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share My Valid™ Profile
          </DialogTitle>
          <DialogDescription className="text-[#E0E0FF]/70">
            Share your verified profile with others. Only unlocked data is visible.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 border-2 border-[#00FFC2] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* Current Signal Mode Display */}
              {currentSignal && SignalIcon && (
                <div className={`p-3 rounded-lg border ${currentSignal.bg} flex items-center gap-3`}>
                  <div className={`p-2 rounded-full ${currentSignal.bg}`}>
                    <SignalIcon className={`h-5 w-5 ${currentSignal.color}`} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">CURRENT SIGNAL</p>
                    <p className={`text-sm font-bold ${currentSignal.color}`}>{currentSignal.label}</p>
                  </div>
                </div>
              )}

              {/* What's Being Shared */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">SHARING STATUS</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    {sharingSettings.interests ? (
                      <Unlock className="w-3 h-3 text-green-400" />
                    ) : (
                      <Lock className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs ${sharingSettings.interests ? 'text-green-400' : 'text-gray-500'}`}>Interests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {sharingSettings.vices ? (
                      <Unlock className="w-3 h-3 text-green-400" />
                    ) : (
                      <Lock className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs ${sharingSettings.vices ? 'text-green-400' : 'text-gray-500'}`}>Vices</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {sharingSettings.orientation ? (
                      <Unlock className="w-3 h-3 text-green-400" />
                    ) : (
                      <Lock className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs ${sharingSettings.orientation ? 'text-green-400' : 'text-gray-500'}`}>Orientation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {sharingSettings.social ? (
                      <Unlock className="w-3 h-3 text-green-400" />
                    ) : (
                      <Lock className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs ${sharingSettings.social ? 'text-green-400' : 'text-gray-500'}`}>Social</span>
                  </div>
                </div>
              </div>

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
                  <strong className="text-[#00FFC2]">Privacy Protected:</strong> Only unlocked data is shared. Locked sections remain private.
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
