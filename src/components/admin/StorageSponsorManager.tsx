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
  category: string;
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
    category: "general" as 'general' | 'lab_certified' | 'toxicology',
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

      // Get the public URL for the newly uploaded file
      const { data: urlData } = supabase.storage
        .from("sponsor-logos")
        .getPublicUrl(fileName);

      toast.success("Logo uploaded! Now assign it to a section.");
      await loadStorageFiles();

      // Immediately open the dialog to assign the new logo
      setNewSponsorData({
        name: "",
        website_url: "",
        tier: "platinum",
        section: 1,
        logo_url: urlData.publicUrl,
        category: "general",
      });
      setEditingFile(fileName);
      setDialogOpen(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload logo");
    } finally {
      setUploading(false);
      event.target.value = ""; // Reset input
    }
  };

  const handleLogoReplace = async (event: React.ChangeEvent<HTMLInputElement>, oldFileName: string) => {
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
      const newFileName = `sponsor-${Date.now()}.${fileExt}`;

      // Upload new logo
      const { error: uploadError } = await supabase.storage
        .from("sponsor-logos")
        .upload(newFileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Get new public URL
      const { data: urlData } = supabase.storage
        .from("sponsor-logos")
        .getPublicUrl(newFileName);

      // Update sponsor with new logo URL if exists
      const sponsor = sponsors.find(s => s.logo_url.includes(oldFileName));
      if (sponsor) {
        const { error: updateError } = await supabase
          .from("sponsors")
          .update({ logo_url: urlData.publicUrl })
          .eq("id", sponsor.id);

        if (updateError) throw updateError;
      }

      // Delete old logo
      const { error: deleteError } = await supabase.storage
        .from("sponsor-logos")
        .remove([oldFileName]);

      if (deleteError) console.warn("Failed to delete old logo:", deleteError);

      toast.success("Logo replaced successfully");
      await loadData();
    } catch (error: any) {
      toast.error(error.message || "Failed to replace logo");
    } finally {
      setUploading(false);
      event.target.value = ""; // Reset input
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
    console.log("Assigning file to section:", file.name);
    const newData = {
      name: "",
      website_url: "",
      tier: "platinum" as 'platinum' | 'gold' | 'silver',
      section: 1,
      logo_url: file.publicUrl,
      category: "general" as 'general' | 'lab_certified' | 'toxicology',
    };
    console.log("Setting new sponsor data:", newData);
    setNewSponsorData(newData);
    setEditingFile(file.name);
    console.log("Opening dialog");
    setDialogOpen(true);
  };

  const handleEditSponsor = (sponsor: Sponsor) => {
    setNewSponsorData({
      name: sponsor.name,
      website_url: sponsor.website_url || "",
      tier: sponsor.tier as 'platinum' | 'gold' | 'silver',
      section: sponsor.section,
      logo_url: sponsor.logo_url,
      category: sponsor.category as 'general' | 'lab_certified' | 'toxicology',
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

    // Validate URL if provided
    if (newSponsorData.website_url.trim()) {
      try {
        const url = new URL(newSponsorData.website_url.trim());
        if (!url.protocol.startsWith('http')) {
          toast.error("Website URL must start with http:// or https://");
          return;
        }
      } catch {
        toast.error("Please enter a valid website URL (e.g., https://example.com)");
        return;
      }
    }

    console.log("Saving sponsor:", newSponsorData);

    try {
      const existingSponsor = getSponsorForFile(newSponsorData.logo_url);

      if (existingSponsor) {
        // Update existing sponsor
        const { error } = await supabase
          .from("sponsors")
          .update({
            name: newSponsorData.name,
            website_url: newSponsorData.website_url.trim() || null,
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
              website_url: newSponsorData.website_url.trim() || null,
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
      setNewSponsorData({ 
        name: "", 
        website_url: "", 
        tier: "platinum", 
        section: 1, 
        logo_url: "",
        category: "general",
      });
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
                  <div 
                    className="aspect-video relative bg-muted rounded-lg mb-3 overflow-hidden"
                  >
                    <img
                      src={file.publicUrl}
                      alt={file.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`replace-${file.name}`}
                    onChange={(e) => handleLogoReplace(e, file.name)}
                    disabled={uploading}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full mb-3 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById(`replace-${file.name}`)?.click();
                    }}
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Replace Logo
                  </Button>
                  
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
                          <Badge variant="outline" className="capitalize">
                            {sponsor.category.replace('_', ' ')}
                          </Badge>
                          {sponsor.active && <Badge className="bg-green-500">Active</Badge>}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSponsor(sponsor);
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFile(file.name);
                            }}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssignToSection(file);
                            }}
                          >
                            Assign to Section
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFile(file.name);
                            }}
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
          <DialogContent className="sm:max-w-[500px] max-h-[70vh] flex flex-col p-0 top-[15%] translate-y-0">
            <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
              <DialogTitle className="text-xl">
                {getSponsorForFile(newSponsorData.logo_url) ? "Edit Sponsor" : "Create Sponsor"}
              </DialogTitle>
              <DialogDescription>
                Enter sponsor details and choose display section
              </DialogDescription>
            </DialogHeader>

            <div className="overflow-y-auto flex-1 px-6 py-4 min-h-0">
              <form id="sponsor-form" onSubmit={handleSaveSponsor} className="space-y-5">
                {newSponsorData.logo_url && (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden border-2 border-border">
                    <img
                      src={newSponsorData.logo_url}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="sponsor-name" className="text-base font-semibold">
                    Sponsor Name *
                  </Label>
                  <Input
                    id="sponsor-name"
                    value={newSponsorData.name}
                    onChange={(e) => setNewSponsorData({ ...newSponsorData, name: e.target.value })}
                    placeholder="Enter sponsor name"
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sponsor-website" className="text-base font-semibold">
                    Website URL
                  </Label>
                  <Input
                    id="sponsor-website"
                    type="url"
                    value={newSponsorData.website_url}
                    onChange={(e) => setNewSponsorData({ ...newSponsorData, website_url: e.target.value })}
                    placeholder="https://example.com"
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional - When clicked, logo will open this URL
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sponsor-category" className="text-base font-semibold">
                    Sponsor Category *
                  </Label>
                  <Select
                    value={newSponsorData.category}
                    onValueChange={(value: 'general' | 'lab_certified' | 'toxicology') => {
                      setNewSponsorData({ ...newSponsorData, category: value });
                    }}
                  >
                    <SelectTrigger id="sponsor-category" className="w-full h-11">
                      <SelectValue placeholder="Choose sponsor category" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      <SelectItem value="general">
                        <div className="flex items-center gap-2">
                          <span>General Sponsor</span>
                          <span className="text-xs text-muted-foreground">(Homepage)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="lab_certified">
                        <div className="flex items-center gap-2">
                          <span>Lab Partner - Sexual Health</span>
                          <span className="text-xs text-muted-foreground">(Get Lab Certified tab)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="toxicology">
                        <div className="flex items-center gap-2">
                          <span>Lab Partner - Toxicology</span>
                          <span className="text-xs text-muted-foreground">(Toxicology Lab Certified tab)</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose where this sponsor logo will appear
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sponsor-section" className="text-base font-semibold">
                    Display Section *
                  </Label>
                  <Select
                    value={newSponsorData.section.toString()}
                    onValueChange={(value) => {
                      const section = parseInt(value);
                      const tier = (section === 1 || section === 2) ? 'platinum' : 'gold';
                      console.log("Section selected:", section, "Tier:", tier);
                      setNewSponsorData({ 
                        ...newSponsorData, 
                        section, 
                        tier 
                      });
                    }}
                  >
                    <SelectTrigger id="sponsor-section" className="w-full h-11">
                      <SelectValue placeholder="Choose section placement" />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-popover">
                      {[1, 2, 3].map((sectionNum) => {
                        const sponsorsInSection = sponsors.filter(s => s.section === sectionNum);
                        const isCurrentSection = getSponsorForFile(newSponsorData.logo_url)?.section === sectionNum;
                        const count = isCurrentSection ? sponsorsInSection.length - 1 : sponsorsInSection.length;
                        const tierLabel = sectionNum === 1 || sectionNum === 2 ? 'Platinum' : 'Gold';
                        
                        return (
                          <SelectItem key={sectionNum} value={sectionNum.toString()}>
                            <div className="flex items-center justify-between w-full gap-3">
                              <span>Section {sectionNum} ({tierLabel})</span>
                              {count > 0 ? (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  {count} sponsor{count !== 1 ? 's' : ''}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="ml-auto text-xs bg-green-500/10 text-green-600 border-green-500/30">
                                  Empty
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-medium">Current Section Status:</p>
                    {[1, 2, 3].map((sectionNum) => {
                      const sponsorsInSection = sponsors.filter(s => s.section === sectionNum);
                      const isCurrentSection = getSponsorForFile(newSponsorData.logo_url)?.section === sectionNum;
                      const count = isCurrentSection ? sponsorsInSection.length - 1 : sponsorsInSection.length;
                      const tierLabel = sectionNum === 1 || sectionNum === 2 ? 'Platinum' : 'Gold';
                      
                      return (
                        <div key={sectionNum} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Section {sectionNum} ({tierLabel}):</span>
                          {count > 0 ? (
                            <span className="font-medium">{count} sponsor{count !== 1 ? 's' : ''} assigned</span>
                          ) : (
                            <span className="text-green-600 font-medium">✓ Available</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t bg-muted/20 flex gap-3 flex-shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setEditingFile(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                form="sponsor-form"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                ✓ Accept & Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default StorageSponsorManager;
