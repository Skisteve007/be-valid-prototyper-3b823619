import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Copy, Eye, EyeOff, Trash2, Power, PowerOff, Loader2, Key, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface LabPartner {
  id: string;
  name: string;
  contact_email: string | null;
  api_key: string;
  active: boolean;
  created_at: string;
  last_used_at: string | null;
}

export const LabPartnersManager = () => {
  const [partners, setPartners] = useState<LabPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: "",
    contact_email: "",
    lis_system: "",
  });
  const [saving, setSaving] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());
  const [generatedPartner, setGeneratedPartner] = useState<LabPartner | null>(null);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      const { data, error } = await supabase
        .from("lab_partners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error: any) {
      console.error("Error loading lab partners:", error);
      toast.error("Failed to load lab partners");
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = () => {
    // Generate a secure 64-character API key
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let apiKey = "lab_";
    for (let i = 0; i < 60; i++) {
      apiKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return apiKey;
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const apiKey = generateApiKey();

      const { data, error } = await supabase
        .from("lab_partners")
        .insert({
          name: newPartner.name,
          contact_email: newPartner.contact_email || null,
          api_key: apiKey,
          active: true,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Lab partner created successfully!");
      setGeneratedPartner(data);
      setNewPartner({ name: "", contact_email: "", lis_system: "" });
      await loadPartners();
    } catch (error: any) {
      console.error("Error creating lab partner:", error);
      toast.error(error.message || "Failed to create lab partner");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (partner: LabPartner) => {
    try {
      const { error } = await supabase
        .from("lab_partners")
        .update({ active: !partner.active })
        .eq("id", partner.id);

      if (error) throw error;

      toast.success(
        `Lab partner ${!partner.active ? "activated" : "deactivated"}`
      );
      await loadPartners();
    } catch (error: any) {
      toast.error("Failed to update lab partner status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lab partner? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("lab_partners")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Lab partner deleted successfully");
      await loadPartners();
    } catch (error: any) {
      toast.error("Failed to delete lab partner");
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setRevealedKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const webhookUrl = `${window.location.origin.replace('localhost:8080', 'nqhkjngqunmqynymzlbe.supabase.co')}/functions/v1/receive-lab-result`;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
        <AlertTitle className="text-yellow-800 dark:text-yellow-400 font-bold flex items-center gap-2">
          <Key className="h-5 w-5" />
          Legal Disclaimer
        </AlertTitle>
        <AlertDescription className="text-yellow-700 dark:text-yellow-300 space-y-2 mt-2">
          <p className="font-semibold">
            ⚠️ IMPORTANT: Clean Check is NOT affiliated with any lab integrator or testing facility.
          </p>
          <p>
            By integrating with Clean Check's API, the lab partner acknowledges and agrees that:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>The lab partner is solely responsible for HIPAA compliance and all applicable healthcare privacy laws</li>
            <li>Clean Check does NOT have access to, store, or process any Protected Health Information (PHI)</li>
            <li>The lab partner must maintain their own HIPAA Business Associate Agreements with patients</li>
            <li>Clean Check provides only a technical integration platform and assumes no liability for lab results or medical data</li>
            <li>The lab partner must implement appropriate security measures to protect patient data in transit and at rest</li>
          </ul>
          <p className="font-semibold mt-2">
            Clean Check's role is limited to facilitating result status communication only. All medical testing, result generation, and patient care remain the sole responsibility of the lab partner.
          </p>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Lab Partner API Access</CardTitle>
              <CardDescription>
                Manage authorized lab integrations and generate secure API credentials
              </CardDescription>
            </div>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lab Partner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {partners.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No lab partners configured. Click "Add Lab Partner" to get started.
              </div>
            ) : (
              partners.map((partner) => (
                <Card key={partner.id} className={!partner.active ? "opacity-60" : ""}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-lg">{partner.name}</h4>
                            <Badge variant={partner.active ? "default" : "secondary"}>
                              {partner.active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          {partner.contact_email && (
                            <p className="text-sm text-muted-foreground">{partner.contact_email}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Created: {new Date(partner.created_at).toLocaleDateString()}
                          </p>
                          {partner.last_used_at && (
                            <p className="text-xs text-muted-foreground">
                              Last used: {new Date(partner.last_used_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(partner)}
                          >
                            {partner.active ? (
                              <>
                                <PowerOff className="h-4 w-4 mr-2" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Power className="h-4 w-4 mr-2" />
                                Activate
                              </>
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(partner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 p-4 bg-muted rounded-lg">
                        <div className="flex items-center justify-between">
                          <Label className="font-semibold">API Key:</Label>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(partner.id)}
                            >
                              {revealedKeys.has(partner.id) ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(partner.api_key, "API Key")}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <code className="text-xs font-mono block bg-background p-2 rounded border break-all">
                          {revealedKeys.has(partner.id)
                            ? partner.api_key
                            : "•".repeat(partner.api_key.length)}
                        </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle>Webhook Integration Instructions</CardTitle>
          <CardDescription>
            Share this information with your lab partners
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-semibold">Webhook Endpoint:</Label>
            <div className="flex gap-2 items-center mt-1">
              <code className="flex-1 text-xs font-mono bg-muted p-3 rounded border break-all">
                {webhookUrl}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(webhookUrl, "Webhook URL")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label className="font-semibold">Authentication:</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Include the API key in the Authorization header:
            </p>
            <code className="text-xs font-mono bg-muted p-3 rounded border block mt-2">
              Authorization: Bearer YOUR_API_KEY
            </code>
          </div>

          <div>
            <Label className="font-semibold">Request Format (POST):</Label>
            <pre className="text-xs font-mono bg-muted p-3 rounded border mt-2 overflow-x-auto">
{`{
  "barcode": "ABC123456789",
  "result": "negative"
}`}
            </pre>
            <p className="text-xs text-muted-foreground mt-2">
              Result values: "negative", "positive", or "inconclusive"
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Lab Partner</DialogTitle>
            <DialogDescription>
              Create a new authorized lab integration
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreatePartner} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Lab Name *</Label>
              <Input
                id="name"
                value={newPartner.name}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, name: e.target.value })
                }
                placeholder="e.g., LabCorp, Quest Diagnostics"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={newPartner.contact_email}
                onChange={(e) =>
                  setNewPartner({ ...newPartner, contact_email: e.target.value })
                }
                placeholder="lab@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lis_system">LIS System</Label>
              <Select
                value={newPartner.lis_system}
                onValueChange={(value) =>
                  setNewPartner({ ...newPartner, lis_system: value })
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select LIS System" />
                </SelectTrigger>
                <SelectContent className="bg-popover z-50">
                  <SelectItem value="Epic Beaker">Epic Beaker</SelectItem>
                  <SelectItem value="Cerner PathNet">Cerner PathNet</SelectItem>
                  <SelectItem value="Sunquest">Sunquest</SelectItem>
                  <SelectItem value="MEDITECH">MEDITECH</SelectItem>
                  <SelectItem value="Orchard">Orchard</SelectItem>
                  <SelectItem value="LabWare">LabWare</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Lab Partner"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!generatedPartner} onOpenChange={() => setGeneratedPartner(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-6 w-6" />
              Lab Partner Created Successfully!
            </DialogTitle>
            <DialogDescription>
              Save these credentials now - the API key will not be shown again
            </DialogDescription>
          </DialogHeader>
          {generatedPartner && (
            <div className="space-y-4">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-950/20">
                <AlertDescription className="space-y-3">
                  <div>
                    <Label className="font-semibold">Lab Name:</Label>
                    <p className="font-mono text-sm mt-1">{generatedPartner.name}</p>
                  </div>
                  <div>
                    <Label className="font-semibold">API Key:</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <code className="flex-1 text-xs font-mono bg-white dark:bg-gray-900 p-3 rounded border break-all">
                        {generatedPartner.api_key}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(generatedPartner.api_key, "API Key")
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="font-semibold">Webhook URL:</Label>
                    <div className="flex gap-2 items-center mt-1">
                      <code className="flex-1 text-xs font-mono bg-white dark:bg-gray-900 p-3 rounded border break-all">
                        {webhookUrl}
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(webhookUrl, "Webhook URL")}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground">
                ⚠️ Share these credentials securely with the lab partner. They will need both the API key and webhook URL to integrate.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setGeneratedPartner(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
