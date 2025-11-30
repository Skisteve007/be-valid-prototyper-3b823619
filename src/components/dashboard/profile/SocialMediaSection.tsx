import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Music, Facebook, User, Twitter, Share2 } from "lucide-react";

interface SocialMediaSectionProps {
  register: UseFormRegister<any>;
}

export const SocialMediaSection = ({ register }: SocialMediaSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
        <Share2 className="w-5 h-5 text-indigo-500" />
        <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Social Media Links</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="instagram_handle" className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-pink-500" />
            Instagram
          </Label>
          <Input id="instagram_handle" {...register("instagram_handle")} placeholder="@username" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tiktok_handle" className="flex items-center gap-2">
            <Music className="w-4 h-4 text-cyan-500" />
            TikTok
          </Label>
          <Input id="tiktok_handle" {...register("tiktok_handle")} placeholder="@username" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebook_handle" className="flex items-center gap-2">
            <Facebook className="w-4 h-4 text-blue-600" />
            Facebook
          </Label>
          <Input id="facebook_handle" {...register("facebook_handle")} placeholder="Profile URL" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="onlyfans_handle" className="flex items-center gap-2">
            <User className="w-4 h-4 text-sky-500" />
            OnlyFans
          </Label>
          <Input id="onlyfans_handle" {...register("onlyfans_handle")} placeholder="@username" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter_handle" className="flex items-center gap-2">
            <Twitter className="w-4 h-4 text-blue-400" />
            X/Twitter
          </Label>
          <Input id="twitter_handle" {...register("twitter_handle")} placeholder="@username" />
        </div>
      </div>
    </div>
  );
};
