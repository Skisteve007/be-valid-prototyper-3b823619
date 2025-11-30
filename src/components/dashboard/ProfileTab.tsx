import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProfileTabProps {
  userId: string;
}

const ProfileTab = ({ userId }: ProfileTabProps) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    company_name: "",
    status_color: "green" as "green" | "yellow" | "red",
  });

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          company_name: data.company_name || "",
          status_color: (data.status_color as "green" | "yellow" | "red") || "green",
        });
      }
    } catch (error: any) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          company_name: profile.company_name,
          status_color: profile.status_color,
        })
        .eq("user_id", userId);

      if (error) throw error;

      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 py-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={profile.full_name}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={profile.phone}
          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
          placeholder="+1 (555) 123-4567"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_name">Company Name</Label>
        <Input
          id="company_name"
          value={profile.company_name}
          onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
          placeholder="ABC Cleaning Services"
        />
      </div>

      <div className="space-y-4">
        <Label>QR Code Status Color</Label>
        <RadioGroup
          value={profile.status_color}
          onValueChange={(value) => setProfile({ ...profile, status_color: value as "green" | "yellow" | "red" })}
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="green" id="green" />
            <Label htmlFor="green" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <div>
                  <div className="font-semibold">Clean</div>
                  <div className="text-sm text-muted-foreground">Green highlight - All clear</div>
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="yellow" id="yellow" />
            <Label htmlFor="yellow" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                <div>
                  <div className="font-semibold">Proceed with Caution</div>
                  <div className="text-sm text-muted-foreground">Yellow highlight - Exercise caution</div>
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
            <RadioGroupItem value="red" id="red" />
            <Label htmlFor="red" className="flex-1 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                <div>
                  <div className="font-semibold">Be Aware</div>
                  <div className="text-sm text-muted-foreground">Red highlight - Important notice</div>
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Profile"
        )}
      </Button>
    </form>
  );
};

export default ProfileTab;