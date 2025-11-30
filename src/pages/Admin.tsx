import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, ExternalLink, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import logo from "@/assets/clean-check-logo.png";

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  active: boolean;
  display_order: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [newSponsor, setNewSponsor] = useState({
    name: "",
    website_url: "",
    logo_url: "",
    display_order: 0,
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "administrator")
        .single();

      if (roleError || !roleData) {
        toast.error("Access denied. Administrator privileges required.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      loadSponsors();
    } catch (error) {
      toast.error("Failed to verify admin access");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setSponsors(data || []);
    } catch (error: any) {
      toast.error("Failed to load sponsors");
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `sponsor-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('sponsor-logos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('sponsor-logos')
        .getPublicUrl(filePath);

      setNewSponsor({ ...newSponsor, logo_url: publicUrl });
      toast.success("Logo uploaded successfully");
    } catch (error: any) {
      toast.error("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleAddSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("sponsors")
        .insert([
          {
            name: newSponsor.name,
            website_url: newSponsor.website_url || null,
            logo_url: newSponsor.logo_url || null,
            display_order: newSponsor.display_order,
            active: true,
          },
        ]);

      if (error) throw error;

      toast.success("Sponsor added successfully");
      setDialogOpen(false);
      setNewSponsor({ name: "", website_url: "", logo_url: "", display_order: 0 });
      loadSponsors();
    } catch (error: any) {
      toast.error(error.message || "Failed to add sponsor");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sponsor?")) return;

    try {
      const { error } = await supabase
        .from("sponsors")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Sponsor deleted successfully");
      loadSponsors();
    } catch (error: any) {
      toast.error("Failed to delete sponsor");
    }
  };

  const handleToggleActive = async (sponsor: Sponsor) => {
    try {
      const { error } = await supabase
        .from("sponsors")
        .update({ active: !sponsor.active })
        .eq("id", sponsor.id);

      if (error) throw error;

      toast.success(`Sponsor ${!sponsor.active ? 'activated' : 'deactivated'}`);
      loadSponsors();
    } catch (error: any) {
      toast.error("Failed to update sponsor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Clean Check" className="h-12 w-auto" />
            <div className="flex items-center gap-2 ml-4">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Admin Panel</span>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl">Sponsor Management</CardTitle>
                <CardDescription>
                  Manage sponsor logos displayed across the website
                </CardDescription>
              </div>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Sponsor
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Sponsor</DialogTitle>
                    <DialogDescription>
                      Upload a sponsor logo and provide details
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddSponsor} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Sponsor Name *</Label>
                      <Input
                        id="name"
                        value={newSponsor.name}
                        onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                        placeholder="e.g., Company Name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo Image</Label>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={uploadingLogo}
                      />
                      {uploadingLogo && <p className="text-sm text-muted-foreground">Uploading...</p>}
                      {newSponsor.logo_url && (
                        <img src={newSponsor.logo_url} alt="Preview" className="h-16 w-auto mt-2" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website URL</Label>
                      <Input
                        id="website"
                        type="url"
                        value={newSponsor.website_url}
                        onChange={(e) => setNewSponsor({ ...newSponsor, website_url: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="order">Display Order</Label>
                      <Input
                        id="order"
                        type="number"
                        value={newSponsor.display_order}
                        onChange={(e) => setNewSponsor({ ...newSponsor, display_order: parseInt(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                    <Button type="submit" disabled={saving || uploadingLogo} className="w-full">
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Sponsor"
                      )}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sponsors.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No sponsors added yet. Click "Add Sponsor" to get started.
                </div>
              ) : (
                <div className="grid gap-4">
                  {sponsors.map((sponsor) => (
                    <Card key={sponsor.id} className={!sponsor.active ? "opacity-50" : ""}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            {sponsor.logo_url ? (
                              <img src={sponsor.logo_url} alt={sponsor.name} className="h-12 w-auto" />
                            ) : (
                              <div className="w-24 h-12 bg-muted rounded flex items-center justify-center">
                                <span className="text-xs text-muted-foreground">No logo</span>
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-semibold">{sponsor.name}</h4>
                              <p className="text-sm text-muted-foreground">Order: {sponsor.display_order}</p>
                              {sponsor.website_url && (
                                <a 
                                  href={sponsor.website_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                  Visit website <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant={sponsor.active ? "outline" : "default"}
                              size="sm"
                              onClick={() => handleToggleActive(sponsor)}
                            >
                              {sponsor.active ? "Deactivate" : "Activate"}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteSponsor(sponsor.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;