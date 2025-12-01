import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";

interface SponsorUploadProps {
  userId: string;
}

const SponsorUpload = ({ userId }: SponsorUploadProps) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const [sponsors, setSponsors] = useState<string[]>(["", "", ""]);

  useEffect(() => {
    checkAdminStatus();
    loadSponsors();
  }, [userId]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "administrator")
        .maybeSingle();

      if (error) throw error;
      setIsAdmin(!!data);
    } catch (error) {
      console.error("Error checking admin status:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSponsors = async () => {
    try {
      const { data, error } = await supabase
        .storage
        .from("sponsor-logos")
        .list("", {
          limit: 10,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      if (data && data.length > 0) {
        // Filter out directories and only get actual image files
        const imageFiles = data.filter(file => file.id !== null && file.metadata);
        
        const urls = await Promise.all(
          imageFiles.slice(0, 3).map(async (file) => {
            const { data: urlData } = supabase.storage
              .from("sponsor-logos")
              .getPublicUrl(file.name);
            return urlData.publicUrl;
          })
        );
        setSponsors([...urls, "", ""].slice(0, 3));
      }
    } catch (error) {
      console.error("Error loading sponsors:", error);
    }
  };

  const handleFileUpload = async (index: number, file: File) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setUploading(index);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `sponsor-${index + 1}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("sponsor-logos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("sponsor-logos")
        .getPublicUrl(fileName);

      const newSponsors = [...sponsors];
      newSponsors[index] = urlData.publicUrl;
      setSponsors(newSponsors);

      toast.success("Sponsor logo uploaded successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload sponsor logo");
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveSponsor = async (index: number) => {
    const url = sponsors[index];
    if (!url) return;

    try {
      const fileName = url.split("/").pop();
      if (!fileName) return;

      const { error } = await supabase.storage
        .from("sponsor-logos")
        .remove([fileName]);

      if (error) throw error;

      const newSponsors = [...sponsors];
      newSponsors[index] = "";
      setSponsors(newSponsors);

      toast.success("Sponsor logo removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to remove sponsor logo");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>This Month's Sponsors</CardTitle>
        <CardDescription>
          Upload sponsor logos to display on your QR code page (Admin only)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="space-y-2">
              <Label>Sponsor {index + 1}</Label>
              <div className="relative border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors">
                {sponsor ? (
                  <>
                    <img
                      src={sponsor}
                      alt={`Sponsor ${index + 1}`}
                      className="w-full h-32 object-contain"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => handleRemoveSponsor(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center">
                    {uploading === index ? (
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <Label
                          htmlFor={`sponsor-${index}`}
                          className="cursor-pointer text-sm text-muted-foreground hover:text-primary"
                        >
                          Click to upload
                        </Label>
                        <Input
                          id={`sponsor-${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(index, file);
                          }}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorUpload;
