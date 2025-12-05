import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Share2, Heart, Wine, Instagram, Sparkles } from "lucide-react";

interface MemberSharingSettingsProps {
  sharingInterestsEnabled: boolean;
  sharingVicesEnabled: boolean;
  sharingOrientationEnabled: boolean;
  sharingSocialEnabled: boolean;
  onToggle: (field: string, value: boolean) => void;
}

export const MemberSharingSettings = ({
  sharingInterestsEnabled,
  sharingVicesEnabled,
  sharingOrientationEnabled,
  sharingSocialEnabled,
  onToggle,
}: MemberSharingSettingsProps) => {
  return (
    <Card className="border-primary/20 bg-muted/30">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Share2 className="h-5 w-5 text-primary" />
          Peer Sharing Control
        </CardTitle>
        <CardDescription className="text-xs">
          Select what data is shown on your dynamic profile when your QR code is scanned by a peer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Interests Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <div>
              <Label htmlFor="sharing_interests" className="text-sm font-medium">
                Show Interests & Preferences
              </Label>
              <p className="text-xs text-muted-foreground">
                Share your hobbies and lifestyle preferences
              </p>
            </div>
          </div>
          <Switch
            id="sharing_interests"
            checked={sharingInterestsEnabled}
            onCheckedChange={(checked) => onToggle('sharing_interests_enabled', checked)}
          />
        </div>

        {/* Vices Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
          <div className="flex items-center gap-3">
            <Wine className="h-4 w-4 text-purple-500" />
            <div>
              <Label htmlFor="sharing_vices" className="text-sm font-medium">
                Show Vices / Lifestyle
              </Label>
              <p className="text-xs text-muted-foreground">
                Share drinking, smoking, and party preferences
              </p>
            </div>
          </div>
          <Switch
            id="sharing_vices"
            checked={sharingVicesEnabled}
            onCheckedChange={(checked) => onToggle('sharing_vices_enabled', checked)}
          />
        </div>

        {/* Sexual Orientation Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3">
          <div className="flex items-center gap-3">
            <Heart className="h-4 w-4 text-pink-500" />
            <div>
              <Label htmlFor="sharing_orientation" className="text-sm font-medium">
                Show Sexual Orientation
              </Label>
              <p className="text-xs text-muted-foreground">
                Allow peers to see your identity
              </p>
            </div>
          </div>
          <Switch
            id="sharing_orientation"
            checked={sharingOrientationEnabled}
            onCheckedChange={(checked) => onToggle('sharing_orientation_enabled', checked)}
          />
        </div>

        {/* Social Media Toggle - Locked by Default */}
        <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Instagram className="h-4 w-4 text-pink-400" />
              {!sharingSocialEnabled && (
                <Lock className="h-2.5 w-2.5 text-amber-500 absolute -bottom-1 -right-1" />
              )}
            </div>
            <div>
              <Label htmlFor="sharing_social" className="text-sm font-medium flex items-center gap-2">
                Show Social Media Handles
                {!sharingSocialEnabled && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-600 font-normal">
                    Locked
                  </span>
                )}
              </Label>
              <p className="text-xs text-muted-foreground">
                Digital handshake - share Instagram, TikTok, etc.
              </p>
            </div>
          </div>
          <Switch
            id="sharing_social"
            checked={sharingSocialEnabled}
            onCheckedChange={(checked) => onToggle('sharing_social_enabled', checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
