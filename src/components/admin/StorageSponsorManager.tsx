import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Upload, Trash2, Edit, Check, X } from "lucide-react";

interface StorageFile {
  name: string;
  publicUrl: string;
  created_at: string;
}

interface Sponsor {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  tier: string;
  section: number;
  active: boolean;
}

const StorageSponsorManager = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [storageFiles, setStorageFiles] = useState<StorageFile[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [editingFile, setEditingFile] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newSponsorData, setNewSponsorData] = useState({
    name: "",
    website_url: "",
    tier: "platinum" as 'platinum' | 'gold' | 'silver',
    section: 1,
    logo_url: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadStorageFiles(), loadSponsors()]);
    setLoading(false);
  };

  const loadStorageFiles = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("sponsor-logos")
        .list("", {
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) throw error;

      const filesWithUrls = data.map((file) => {
        const { data: urlData } = supabase.storage
          .from("sponsor-logos")
          .getPublicUrl(file.name);
        return {
          name: file.name,
          publicUrl: urlData.publicUrl,
          created_at: file.created_at,
        };
      });

      setStorageFiles(filesWithUrls);
    } catch (error: any) {
      toast.error("Failed to load storage files");
      console.error(error);
    }
  };

  const loadSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setSponsors((data as Sponsor[]) || []);
    } catch (error: any) {
      toast.error("Failed to load sponsors");
      console.error(error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `sponsor-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("sponsor-logos")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      toast.success("Logo uploaded successfully");
      await loadStorageFiles();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload logo");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileName: string) => {
    if (!confirm("Are you sure you want to delete this file? This will also remove any sponsors using this logo.")) return;

    try {
      // First, delete any sponsors using this logo
      const sponsorsToDelete = sponsors.filter(s => s.logo_url.includes(fileName));
      if (sponsorsToDelete.length > 0) {
        const { error: deleteSponsorsError } = await supabase
          .from("sponsors")
          .delete()
          .in("id", sponsorsToDelete.map(s => s.id));

        if (deleteSponsorsError) throw deleteSponsorsError;
      }

      // Then delete the file from storage
      const { error } = await supabase.storage
        .from("sponsor-logos")
        .remove([fileName]);

      if (error) throw error;

      toast.success("File deleted successfully");
      await loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete file");
    }
  };

  const getSponsorForFile = (publicUrl: string): Sponsor | undefined => {
    return sponsors.find(s => s.logo_url === publicUrl);
  };

  const handleAssignToSection = (file: StorageFile) => {
    setNewSponsorData({
      name: "",
      website_url: "",
      tier: "platinum", // Default to platinum for section 1
      section: 1,
      logo_url: file.publicUrl,
    });
    setEditingFile(file.name);
    setDialogOpen(true);
  };

  const handleEditSponsor = (sponsor: Sponsor) => {
    setNewSponsorData({
      name: sponsor.name,
      website_url: sponsor.website_url || "",
      tier: sponsor.tier as 'platinum' | 'gold' | 'silver',
      section: sponsor.section,
      logo_url: sponsor.logo_url,
    });
    setEditingFile(sponsor.logo_url.split("/").pop() || "");
    setDialogOpen(true);
  };

  const handleSaveSponsor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newSponsorData.name.trim()) {
      toast.error("Please enter a sponsor name");
      return;
    }

    try {
      const existingSponsor = getSponsorForFile(newSponsorData.logo_url);

      if (existingSponsor) {
        // Update existing sponsor
        const { error } = await supabase
          .from("sponsors")
          .update({
            name: newSponsorData.name,
            website_url: newSponsorData.website_url || null,
            tier: newSponsorData.tier,
            section: newSponsorData.section,
          })
          .eq("id", existingSponsor.id);

        if (error) throw error;
        toast.success("Sponsor updated successfully");
      } else {
        // Create new sponsor
        const { error } = await supabase
          .from("sponsors")
          .insert([
            {
              name: newSponsorData.name,
              website_url: newSponsorData.website_url || null,
              logo_url: newSponsorData.logo_url,
              tier: newSponsorData.tier,
              section: newSponsorData.section,
              display_order: sponsors.length,
              active: true,
            },
          ]);

        if (error) throw error;
        toast.success("Sponsor created successfully");
      }

      setDialogOpen(false);
      setEditingFile(null);
      setNewSponsorData({ name: "", website_url: "", tier: "platinum", section: 1, logo_url: "" });
      await loadSponsors();
    } catch (error: any) {
      toast.error(error.message || "Failed to save sponsor");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Storage & Sponsor Manager</CardTitle>
        <CardDescription>
          Upload logos to storage and assign them to sections. All files in sponsor-logos bucket are shown below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-6 hover:border-primary transition-colors">
              {uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <>
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-sm font-medium">Upload New Logo</span>
                </>
              )}
            </div>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {storageFiles.map((file) => {
            const sponsor = getSponsorForFile(file.publicUrl);
            return (
              <Card key={file.name} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="aspect-video relative bg-muted rounded-lg mb-3 overflow-hidden">
                    <img
                      src={file.publicUrl}
                      alt={file.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground truncate" title={file.name}>
                      {file.name}
                    </p>
                    
                    {sponsor ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">{sponsor.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {sponsor.tier.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            Section {sponsor.section}
                          </Badge>
                          {sponsor.active && <Badge className="bg-green-500">Active</Badge>}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => handleEditSponsor(sponsor)}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteFile(file.name)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <X className="h-4 w-4" />
                          <span className="text-sm">Not assigned</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleAssignToSection(file)}
                          >
                            Assign to Section
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteFile(file.name)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {storageFiles.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No logos uploaded yet. Upload your first logo above.
          </div>
        )}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {getSponsorForFile(newSponsorData.logo_url) ? "Edit Sponsor" : "Create Sponsor"}
              </DialogTitle>
              <DialogDescription>
                Assign this logo to a sponsor and section
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveSponsor} className="space-y-4">
              {newSponsorData.logo_url && (
                <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={newSponsorData.logo_url}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="sponsor-name">Sponsor Name *</Label>
                <Input
                  id="sponsor-name"
                  value={newSponsorData.name}
                  onChange={(e) => setNewSponsorData({ ...newSponsorData, name: e.target.value })}
                  placeholder="Enter sponsor name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsor-website">Website URL</Label>
                <Input
                  id="sponsor-website"
                  type="url"
                  value={newSponsorData.website_url}
                  onChange={(e) => setNewSponsorData({ ...newSponsorData, website_url: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsor-section">Display Section *</Label>
                <Select
                  value={newSponsorData.section.toString()}
                  onValueChange={(value) => {
                    const section = parseInt(value);
                    const tier = (section === 1 || section === 2) ? 'platinum' : 'gold';
                    setNewSponsorData({ 
                      ...newSponsorData, 
                      section, 
                      tier 
                    });
                  }}
                >
                  <SelectTrigger id="sponsor-section" className="bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="1" className="hover:bg-accent focus:bg-accent">
                      <div className="flex items-center gap-2">
                        <span>Section 1</span>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">Platinum</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="2" className="hover:bg-accent focus:bg-accent">
                      <div className="flex items-center gap-2">
                        <span>Section 2</span>
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">Platinum</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="3" className="hover:bg-accent focus:bg-accent">
                      <div className="flex items-center gap-2">
                        <span>Section 3</span>
                        <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">Gold</Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Sections 1 & 2 are Platinum tier • Section 3 is Gold tier
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setEditingFile(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {getSponsorForFile(newSponsorData.logo_url) ? "Update" : "Create"} Sponsor
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default StorageSponsorManager;
