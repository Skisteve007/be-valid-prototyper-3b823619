import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Upload, Camera, Building2, CheckCircle2, Image, Trash2 } from "lucide-react";

interface Venue {
  id: string;
  venue_name: string;
  city: string;
  country: string;
  category: string;
  custom_logo_url?: string | null;
}

export const QuickBrandingTool = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVenueId, setSelectedVenueId] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      const { data, error } = await supabase
        .from("partner_venues")
        .select("*")
        .order("venue_name");

      if (error) throw error;
      setVenues(data || []);
    } catch (error) {
      toast.error("Failed to load venues");
    } finally {
      setLoading(false);
    }
  };

  const selectedVenue = venues.find(v => v.id === selectedVenueId);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedVenueId) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `venue-${selectedVenueId}-${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('sponsor-logos')
        .upload(`venue-logos/${fileName}`, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('sponsor-logos')
        .getPublicUrl(`venue-logos/${fileName}`);

      // Update venue with custom logo - using type assertion for new column
      const { error: updateError } = await (supabase
        .from("partner_venues") as any)
        .update({ custom_logo_url: publicUrl })
        .eq("id", selectedVenueId);

      if (updateError) throw updateError;

      toast.success("Logo uploaded! It will appear on the venue's scanner.");
      loadVenues();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload logo");
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = async () => {
    if (!selectedVenueId) return;
    
    try {
      const { error } = await (supabase
        .from("partner_venues") as any)
        .update({ custom_logo_url: null })
        .eq("id", selectedVenueId);

      if (error) throw error;

      toast.success("Logo removed");
      setPreviewUrl(null);
      loadVenues();
    } catch (error) {
      toast.error("Failed to remove logo");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <Camera className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Fast Event Setup</h2>
          <p className="text-muted-foreground">Upload venue branding from your phone</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Select Venue
          </CardTitle>
          <CardDescription>
            Choose a venue to customize its door scanner branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select value={selectedVenueId} onValueChange={setSelectedVenueId}>
            <SelectTrigger className="h-14 text-base">
              <SelectValue placeholder="Select a venue..." />
            </SelectTrigger>
            <SelectContent>
              {venues.map((venue) => (
                <SelectItem key={venue.id} value={venue.id} className="py-3">
                  <div className="flex flex-col">
                    <span className="font-medium">{venue.venue_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {venue.city}, {venue.country}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedVenue && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              {/* Current/Preview Logo */}
              <div className="border-2 border-dashed rounded-xl p-6 text-center bg-muted/30">
                {previewUrl || (selectedVenue as any).custom_logo_url ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={previewUrl || (selectedVenue as any).custom_logo_url}
                        alt="Venue logo"
                        className="max-h-32 max-w-full mx-auto rounded-lg shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <p className="text-sm text-green-600 font-medium">
                      Logo active on scanner
                    </p>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={removeLogo}
                      className="h-10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Logo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Image className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <p className="text-muted-foreground">No custom logo set</p>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <div className="space-y-2">
                <Label htmlFor="logo-upload" className="text-base font-semibold">
                  Upload New Logo
                </Label>
                <div className="relative">
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="h-16 text-base cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tap to select from camera roll or take a photo
                </p>
              </div>

              {/* Quick Tips */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-2">📱 Pro Tips</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Use PNG for transparent backgrounds</li>
                    <li>• Logo will overlay on the scanner interface</li>
                    <li>• Changes apply immediately to all devices</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
