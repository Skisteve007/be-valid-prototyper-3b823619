import { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialMediaSectionProps {
  register: UseFormRegister<any>;
}

export const SocialMediaSection = ({ register }: SocialMediaSectionProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold border-b pb-2">Social Media Links</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="instagram_handle">Instagram</Label>
          <Input id="instagram_handle" {...register("instagram_handle")} placeholder="@username" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tiktok_handle">TikTok</Label>
          <Input id="tiktok_handle" {...register("tiktok_handle")} placeholder="@username" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebook_handle">Facebook</Label>
          <Input id="facebook_handle" {...register("facebook_handle")} placeholder="Profile URL" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="onlyfans_handle">OnlyFans</Label>
          <Input id="onlyfans_handle" {...register("onlyfans_handle")} placeholder="@username" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter_handle">X/Twitter</Label>
          <Input id="twitter_handle" {...register("twitter_handle")} placeholder="@username" />
        </div>
      </div>
    </div>
  );
};
