import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Instagram, Music, Facebook, User, Share2, ExternalLink, Lock, Unlock, Twitter, Linkedin } from "lucide-react";

interface SocialMediaSectionProps {
  register: UseFormRegister<any>;
  instagramHandle: string;
  tiktokHandle: string;
  facebookHandle: string;
  onlyfansHandle: string;
  twitterHandle?: string;
  linkedinHandle?: string;
  sharingEnabled?: boolean;
  onToggleSharing?: (enabled: boolean) => void;
}

const getSocialMediaUrl = (platform: string, handle: string): string | null => {
  if (!handle || !handle.trim()) return null;
  
  const cleanHandle = handle.replace(/^@/, '').trim();
  
  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${cleanHandle}`;
    case 'tiktok':
      return `https://tiktok.com/@${cleanHandle}`;
    case 'facebook':
      return handle.startsWith('http') ? handle : `https://facebook.com/${cleanHandle}`;
    case 'onlyfans':
      return `https://onlyfans.com/${cleanHandle}`;
    case 'twitter':
      return `https://x.com/${cleanHandle}`;
    case 'linkedin':
      return handle.startsWith('http') ? handle : `https://linkedin.com/in/${cleanHandle}`;
    default:
      return null;
  }
};

export const SocialMediaSection = ({ 
  register, 
  instagramHandle,
  tiktokHandle,
  facebookHandle,
  onlyfansHandle,
  twitterHandle = "",
  linkedinHandle = "",
  sharingEnabled = false,
  onToggleSharing,
}: SocialMediaSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Share2 className="w-5 h-5 text-indigo-500" />
          <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Social Media Links</span>
        </h3>
        {onToggleSharing && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onToggleSharing(!sharingEnabled)}
            className="h-auto py-1 px-2"
            title={sharingEnabled ? "Click to hide from peers" : "Click to share with peers"}
          >
            {sharingEnabled ? (
              <Unlock className="w-4 h-4 text-green-500" />
            ) : (
              <Lock className="w-4 h-4 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="instagram_handle" className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-pink-500" />
            Instagram
          </Label>
          <div className="flex gap-2">
            <Input id="instagram_handle" {...register("instagram_handle")} placeholder="@username" className="flex-1" />
            {instagramHandle && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => window.open(getSocialMediaUrl('instagram', instagramHandle) || '', '_blank')}
                title="Visit Instagram profile"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tiktok_handle" className="flex items-center gap-2">
            <Music className="w-4 h-4 text-cyan-500" />
            TikTok
          </Label>
          <div className="flex gap-2">
            <Input id="tiktok_handle" {...register("tiktok_handle")} placeholder="@username" className="flex-1" />
            {tiktokHandle && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => window.open(getSocialMediaUrl('tiktok', tiktokHandle) || '', '_blank')}
                title="Visit TikTok profile"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebook_handle" className="flex items-center gap-2">
            <Facebook className="w-4 h-4 text-blue-600" />
            Facebook
          </Label>
          <div className="flex gap-2">
            <Input id="facebook_handle" {...register("facebook_handle")} placeholder="Profile URL or username" className="flex-1" />
            {facebookHandle && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => window.open(getSocialMediaUrl('facebook', facebookHandle) || '', '_blank')}
                title="Visit Facebook profile"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="onlyfans_handle" className="flex items-center gap-2">
            <User className="w-4 h-4 text-sky-500" />
            OnlyFans
          </Label>
          <div className="flex gap-2">
            <Input id="onlyfans_handle" {...register("onlyfans_handle")} placeholder="@username" className="flex-1" />
            {onlyfansHandle && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => window.open(getSocialMediaUrl('onlyfans', onlyfansHandle) || '', '_blank')}
                title="Visit OnlyFans profile"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter_handle" className="flex items-center gap-2">
            <Twitter className="w-4 h-4 text-foreground" />
            X / Twitter
          </Label>
          <div className="flex gap-2">
            <Input id="twitter_handle" {...register("twitter_handle")} placeholder="@username" className="flex-1" />
            {twitterHandle && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => window.open(getSocialMediaUrl('twitter', twitterHandle) || '', '_blank')}
                title="Visit X profile"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin_handle" className="flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-blue-700" />
            LinkedIn
          </Label>
          <div className="flex gap-2">
            <Input id="linkedin_handle" {...register("linkedin_handle")} placeholder="Profile URL or username" className="flex-1" />
            {linkedinHandle && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => window.open(getSocialMediaUrl('linkedin', linkedinHandle) || '', '_blank')}
                title="Visit LinkedIn profile"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
