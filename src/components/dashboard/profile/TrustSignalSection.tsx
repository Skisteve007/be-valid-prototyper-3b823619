import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Lock, 
  Unlock, 
  UserCheck, 
  Link2, 
  Copy, 
  Check, 
  ShieldCheck,
  Radio,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TrustSignalSectionProps {
  userId: string;
  stdAcknowledgment: string;
  onStdAcknowledgmentChange: (value: string) => void;
  stdAcknowledgmentLocked: boolean;
  onStdAcknowledgmentLockedChange: (locked: boolean) => void;
  referenceIds: string[];
  onReferenceIdsChange: (ids: string[]) => void;
  referenceProfiles: Array<{id: string, user_id: string, full_name: string, member_id: string, verified?: boolean} | null>;
  referencesLocked: boolean;
  onReferencesLockedChange: (locked: boolean) => void;
}

const SIGNAL_PLATFORMS = [
  { value: "tiktok", label: "TikTok (Bio Link)" },
  { value: "instagram", label: "Instagram / Threads" },
  { value: "onlyfans", label: "OnlyFans / Fansly" },
  { value: "linkedin", label: "LinkedIn (Professional)" },
  { value: "linktree", label: "Linktree / Bio.site" },
  { value: "website", label: "Personal Website" },
  { value: "dating", label: "Dating App Bio" },
];

const TrustSignalSection = ({
  userId,
  stdAcknowledgment,
  onStdAcknowledgmentChange,
  stdAcknowledgmentLocked,
  onStdAcknowledgmentLockedChange,
  referenceIds,
  onReferenceIdsChange,
  referenceProfiles,
  referencesLocked,
  onReferencesLockedChange,
}: TrustSignalSectionProps) => {
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [pendingVouches, setPendingVouches] = useState<Array<{id: string, referrer_user_id: string, full_name: string, member_id: string}>>([]);
  const [loadingVouches, setLoadingVouches] = useState(false);

  // Generate the trust link URL
  const trustLink = `https://www.bevalid.app/verify/status/${userId}`;

  // Load pending vouches (references where this user is the referee and hasn't verified yet)
  useEffect(() => {
    loadPendingVouches();
  }, [userId]);

  const loadPendingVouches = async () => {
    setLoadingVouches(true);
    try {
      const { data, error } = await supabase
        .from("member_references")
        .select(`
          id,
          referrer_user_id,
          verified
        `)
        .eq("referee_user_id", userId)
        .eq("verified", false);

      if (error) throw error;

      if (data && data.length > 0) {
        // Fetch profiles for each referrer
        const referrerIds = data.map(d => d.referrer_user_id);
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("user_id, full_name, member_id")
          .in("user_id", referrerIds);

        if (profileError) throw profileError;

        const vouchesWithProfiles = data.map(vouch => {
          const profile = profiles?.find(p => p.user_id === vouch.referrer_user_id);
          return {
            id: vouch.id,
            referrer_user_id: vouch.referrer_user_id,
            full_name: profile?.full_name || "Unknown",
            member_id: profile?.member_id || "N/A"
          };
        });

        setPendingVouches(vouchesWithProfiles);
      }
    } catch (error) {
      console.error("Failed to load pending vouches:", error);
    } finally {
      setLoadingVouches(false);
    }
  };

  const handleAcceptVouch = async (vouchId: string) => {
    try {
      const { error } = await supabase
        .from("member_references")
        .update({ verified: true, verified_at: new Date().toISOString() })
        .eq("id", vouchId);

      if (error) throw error;

      toast.success("Vouch accepted!");
      setPendingVouches(prev => prev.filter(v => v.id !== vouchId));
    } catch (error) {
      console.error("Failed to accept vouch:", error);
      toast.error("Failed to accept vouch");
    }
  };

  const handleDenyVouch = async (vouchId: string) => {
    try {
      const { error } = await supabase
        .from("member_references")
        .delete()
        .eq("id", vouchId);

      if (error) throw error;

      toast.success("Vouch denied");
      setPendingVouches(prev => prev.filter(v => v.id !== vouchId));
    } catch (error) {
      console.error("Failed to deny vouch:", error);
      toast.error("Failed to deny vouch");
    }
  };

  const handleGenerateTrustLink = async () => {
    if (!selectedPlatform) {
      toast.error("Please select a platform first");
      return;
    }

    try {
      // Log the event
      await supabase.functions.invoke("log-social-embed", {
        body: {
          userId,
          platform: selectedPlatform,
          timestamp: new Date().toISOString()
        }
      });

      // Copy to clipboard
      await navigator.clipboard.writeText(trustLink);
      setIsLinkCopied(true);
      toast.success("Trust Link copied to clipboard!");
      setTimeout(() => setIsLinkCopied(false), 3000);
    } catch (error) {
      console.error("Failed to generate trust link:", error);
      // Still copy even if logging fails
      await navigator.clipboard.writeText(trustLink);
      setIsLinkCopied(true);
      toast.success("Trust Link copied!");
      setTimeout(() => setIsLinkCopied(false), 3000);
    }
  };

  const handleReferenceChange = (index: number, value: string) => {
    const newIds = [...referenceIds];
    newIds[index] = value;
    onReferenceIdsChange(newIds);
  };

  return (
    <Card className="border-2 border-cyan-500/30 bg-gradient-to-br from-slate-900/50 to-slate-800/50 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <ShieldCheck className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent tracking-wider">
              TRUST & SIGNAL
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Your verification credentials and peer trust network
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 1. Bio-Clearance Field */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-slate-200">Bio-Clearance</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onStdAcknowledgmentLockedChange(!stdAcknowledgmentLocked)}
              className="h-7 px-2 rounded-full hover:bg-slate-700/50"
            >
              {stdAcknowledgmentLocked ? (
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] text-red-400">Private</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Unlock className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400">Shareable</span>
                </div>
              )}
            </Button>
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Input
              value={stdAcknowledgment}
              onChange={(e) => onStdAcknowledgmentChange(e.target.value)}
              placeholder="Enter your bio-clearance status..."
              className="h-8 text-sm bg-transparent border-0 focus-visible:ring-0 text-slate-200 placeholder:text-slate-500"
            />
          </div>
          <p className="text-[10px] text-slate-500 pl-1">
            This private field is only visible when you choose to share via QR scan.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        {/* 2. The Vouch Field */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-slate-200">The Vouch</span>
              <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-blue-500/30 text-blue-400">
                P2P
              </Badge>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onReferencesLockedChange(!referencesLocked)}
              className="h-7 px-2 rounded-full hover:bg-slate-700/50"
            >
              {referencesLocked ? (
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-red-400" />
                  <span className="text-[10px] text-red-400">Private</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Unlock className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-emerald-400">Shareable</span>
                </div>
              )}
            </Button>
          </div>

          {/* Pending Vouches (Accept/Deny) */}
          {pendingVouches.length > 0 && (
            <div className="space-y-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-medium">
                <Radio className="w-3 h-3 animate-pulse" />
                Pending Vouches
              </div>
              {pendingVouches.map((vouch) => (
                <div key={vouch.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-800/50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate">{vouch.full_name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{vouch.member_id}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAcceptVouch(vouch.id)}
                      className="h-7 w-7 p-0 hover:bg-emerald-500/20"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDenyVouch(vouch.id)}
                      className="h-7 w-7 p-0 hover:bg-red-500/20"
                    >
                      <XCircle className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reference IDs */}
          {referencesLocked ? (
            <div className="text-center py-4 text-slate-500">
              <Lock className="w-5 h-5 mx-auto mb-1 opacity-50" />
              <p className="text-xs">Private - unlock to share your vouches</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[10px] text-slate-400 pl-1">
                Members who have endorsed you:
              </p>
              <div className="flex flex-col md:flex-row gap-2">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="flex-1 flex items-center gap-1">
                    <Input
                      value={referenceIds[index] || ""}
                      onChange={(e) => handleReferenceChange(index, e.target.value)}
                      placeholder={`Member ID #${index + 1}`}
                      className="font-mono text-xs h-8 bg-slate-800/50 border-slate-700/50 text-slate-300"
                    />
                    {referenceProfiles[index] && (
                      <Badge 
                        variant={referenceProfiles[index]?.verified ? "default" : "secondary"} 
                        className="text-[9px] px-1.5 whitespace-nowrap"
                      >
                        {referenceProfiles[index]?.verified ? "✓ " : ""}
                        {referenceProfiles[index]?.full_name?.split(' ')[0]}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

        {/* 3. Signal Injection Field */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-slate-200">Signal Injection</span>
          </div>
          
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
            <p className="text-sm font-medium text-slate-200 mb-1">
              Turn your other profiles into a Trust Signal.
            </p>
            <p className="text-xs text-slate-400 mb-4">
              Generate your unique Valid Link to embed in your bio.
            </p>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-400">
                  Where are we deploying this?
                </label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="w-full h-10 bg-slate-800/50 border-slate-700/50 text-slate-200">
                    <SelectValue placeholder="Select platform..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    {SIGNAL_PLATFORMS.map((platform) => (
                      <SelectItem 
                        key={platform.value} 
                        value={platform.value}
                        className="text-slate-200 focus:bg-slate-700 focus:text-slate-100"
                      >
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                onClick={handleGenerateTrustLink}
                disabled={!selectedPlatform}
                className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLinkCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Generate Trust Link
                  </>
                )}
              </Button>

              {selectedPlatform && (
                <div className="p-2 rounded-lg bg-slate-900/50 border border-slate-700/30">
                  <p className="text-[10px] text-slate-500 mb-1">Your unique link:</p>
                  <p className="text-xs text-cyan-400 font-mono break-all">{trustLink}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrustSignalSection;
