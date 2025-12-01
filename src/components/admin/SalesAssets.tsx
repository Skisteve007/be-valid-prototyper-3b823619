import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Video, CalendarDays, Save } from "lucide-react";

interface SalesAssetsData {
  id: string;
  demo_video_url: string | null;
  calendly_link: string | null;
}

export function SalesAssets() {
  const [assets, setAssets] = useState<SalesAssetsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    demo_video_url: "",
    calendly_link: "",
  });

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_sales_assets")
        .select("*")
        .single();

      if (error) throw error;

      setAssets(data);
      setFormData({
        demo_video_url: data.demo_video_url || "",
        calendly_link: data.calendly_link || "",
      });
    } catch (error: any) {
      toast.error("Failed to load sales assets");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!assets) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("admin_sales_assets")
        .update(formData)
        .eq("id", assets.id);

      if (error) throw error;

      toast.success("Sales assets updated! These links will be auto-appended to B2B emails.");
      fetchAssets();
    } catch (error: any) {
      toast.error("Failed to update sales assets");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading sales assets...</div>;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b">
        <CardTitle className="text-2xl flex items-center gap-2">
          📦 Faceless Sales Assets
        </CardTitle>
        <CardDescription className="text-base">
          These links auto-append to B2B Email Templates (5, 6, 7, 8) so prospects can book without emailing you
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="demo_video_url" className="flex items-center gap-2 text-base font-semibold">
            <Video className="h-5 w-5 text-primary" />
            Demo Video URL
          </Label>
          <Input
            id="demo_video_url"
            type="url"
            placeholder="https://www.loom.com/share/your-video-id or YouTube link"
            value={formData.demo_video_url}
            onChange={(e) => setFormData({ ...formData, demo_video_url: e.target.value })}
            className="text-base"
          />
          <p className="text-sm text-muted-foreground">
            Loom or YouTube link showing CleanCheck QR scanner demo
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="calendly_link" className="flex items-center gap-2 text-base font-semibold">
            <CalendarDays className="h-5 w-5 text-primary" />
            Calendly Link
          </Label>
          <Input
            id="calendly_link"
            type="url"
            placeholder="https://calendly.com/your-username/30min"
            value={formData.calendly_link}
            onChange={(e) => setFormData({ ...formData, calendly_link: e.target.value })}
            className="text-base"
          />
          <p className="text-sm text-muted-foreground">
            Direct booking link for partners to schedule calls without back-and-forth emails
          </p>
        </div>

        <div className="pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Sales Assets"}
          </Button>
        </div>

        {(formData.demo_video_url || formData.calendly_link) && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-semibold mb-2">Preview: Email Footer</p>
            <div className="text-xs text-muted-foreground space-y-1 font-mono">
              <p>---</p>
              {formData.demo_video_url && (
                <p>🎥 See CleanCheck in action: {formData.demo_video_url}</p>
              )}
              {formData.calendly_link && (
                <p>📅 Book a quick demo call: {formData.calendly_link}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
