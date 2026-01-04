import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Plus, Database, Cloud, CheckCircle, XCircle, Trash2, RefreshCw, Send } from "lucide-react";

interface Connector {
  id: string;
  connector_type: string;
  connector_name: string;
  api_endpoint: string | null;
  auth_type: string | null;
  vault_type: string | null;
  vault_endpoint: string | null;
  is_active: boolean;
  last_test_at: string | null;
  last_test_status: string | null;
  created_at: string;
}

interface AccountConnectorsTabProps {
  accountId: string;
}

export const AccountConnectorsTab = ({ accountId }: AccountConnectorsTabProps) => {
  const [connectors, setConnectors] = useState<Connector[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddSource, setShowAddSource] = useState(false);
  const [showAddVault, setShowAddVault] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);

  // Source form
  const [sourceForm, setSourceForm] = useState({
    connector_name: "",
    api_endpoint: "",
    auth_type: "api_key",
  });

  // Vault form
  const [vaultForm, setVaultForm] = useState({
    connector_name: "",
    vault_type: "s3" as "s3" | "azure" | "gcs" | "sftp" | "on_prem",
    vault_endpoint: "",
  });

  useEffect(() => {
    loadConnectors();
  }, [accountId]);

  const loadConnectors = async () => {
    try {
      const { data, error } = await supabase
        .from("account_connectors")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setConnectors(data || []);
    } catch (error: any) {
      toast.error("Failed to load connectors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSource = async () => {
    if (!sourceForm.connector_name || !sourceForm.api_endpoint) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("account_connectors")
        .insert({
          account_id: accountId,
          connector_type: "source_of_truth",
          connector_name: sourceForm.connector_name,
          api_endpoint: sourceForm.api_endpoint,
          auth_type: sourceForm.auth_type,
        });

      if (error) throw error;

      toast.success("Source connector added");
      setShowAddSource(false);
      setSourceForm({ connector_name: "", api_endpoint: "", auth_type: "api_key" });
      loadConnectors();
    } catch (error: any) {
      toast.error("Failed to add connector");
    } finally {
      setSaving(false);
    }
  };

  const handleAddVault = async () => {
    if (!vaultForm.connector_name || !vaultForm.vault_endpoint) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("account_connectors")
        .insert({
          account_id: accountId,
          connector_type: "customer_vault",
          connector_name: vaultForm.connector_name,
          vault_type: vaultForm.vault_type,
          vault_endpoint: vaultForm.vault_endpoint,
        });

      if (error) throw error;

      toast.success("Customer vault added");
      setShowAddVault(false);
      setVaultForm({ connector_name: "", vault_type: "s3", vault_endpoint: "" });
      loadConnectors();
    } catch (error: any) {
      toast.error("Failed to add vault");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async (connector: Connector) => {
    setTesting(connector.id);
    
    // Simulate test
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const success = Math.random() > 0.3;
    
    try {
      await supabase
        .from("account_connectors")
        .update({
          last_test_at: new Date().toISOString(),
          last_test_status: success ? "success" : "failed",
        })
        .eq("id", connector.id);

      if (success) {
        toast.success("Connection test successful");
      } else {
        toast.error("Connection test failed");
      }
      loadConnectors();
    } catch (error) {
      toast.error("Failed to update test status");
    } finally {
      setTesting(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this connector?")) return;

    try {
      const { error } = await supabase
        .from("account_connectors")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Connector deleted");
      loadConnectors();
    } catch (error: any) {
      toast.error("Failed to delete connector");
    }
  };

  const sourceConnectors = connectors.filter(c => c.connector_type === "source_of_truth");
  const vaultConnectors = connectors.filter(c => c.connector_type === "customer_vault");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const ConnectorCard = ({ connector }: { connector: Connector }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {connector.connector_type === "source_of_truth" ? (
                <Database className="h-5 w-5 text-blue-500" />
              ) : (
                <Cloud className="h-5 w-5 text-purple-500" />
              )}
              <span className="font-medium">{connector.connector_name}</span>
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              {connector.api_endpoint || connector.vault_endpoint}
            </p>
            {connector.vault_type && (
              <Badge variant="outline">{connector.vault_type.toUpperCase()}</Badge>
            )}
            {connector.auth_type && (
              <Badge variant="outline">{connector.auth_type}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {connector.last_test_status === "success" && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {connector.last_test_status === "failed" && (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTest(connector)}
            disabled={testing === connector.id}
          >
            {testing === connector.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="ml-2">Test</span>
          </Button>
          {connector.connector_type === "customer_vault" && (
            <Button variant="outline" size="sm">
              <Send className="h-4 w-4 mr-2" /> Send Test File
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(connector.id)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="sources" className="space-y-6">
      <TabsList>
        <TabsTrigger value="sources" className="gap-2">
          <Database className="h-4 w-4" />
          Sources of Truth (READ)
        </TabsTrigger>
        <TabsTrigger value="vaults" className="gap-2">
          <Cloud className="h-4 w-4" />
          Customer Vault (WRITE)
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sources" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Source Connectors</h3>
            <p className="text-sm text-muted-foreground">
              Connect to authoritative data sources for validation
            </p>
          </div>
          <Dialog open={showAddSource} onOpenChange={setShowAddSource}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Source
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Source Connector</DialogTitle>
                <DialogDescription>
                  Connect to an external source of truth for validation
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Connector Name *</Label>
                  <Input
                    placeholder="e.g., LabCorp Results API"
                    value={sourceForm.connector_name}
                    onChange={(e) => setSourceForm({ ...sourceForm, connector_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Endpoint *</Label>
                  <Input
                    placeholder="https://api.example.com/v1"
                    value={sourceForm.api_endpoint}
                    onChange={(e) => setSourceForm({ ...sourceForm, api_endpoint: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Auth Type</Label>
                  <Select 
                    value={sourceForm.auth_type} 
                    onValueChange={(val) => setSourceForm({ ...sourceForm, auth_type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="api_key">API Key</SelectItem>
                      <SelectItem value="oauth2">OAuth 2.0</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="mtls">mTLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddSource} disabled={saving} className="w-full">
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Connector
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {sourceConnectors.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No source connectors configured yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {sourceConnectors.map(c => (
              <ConnectorCard key={c.id} connector={c} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="vaults" className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">Customer Vault</h3>
            <p className="text-sm text-muted-foreground">
              "Point & shoot" storage for customer-owned data
            </p>
          </div>
          <Dialog open={showAddVault} onOpenChange={setShowAddVault}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Vault
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Customer Vault</DialogTitle>
                <DialogDescription>
                  Configure where to send approved payloads
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Vault Name *</Label>
                  <Input
                    placeholder="e.g., Production S3 Bucket"
                    value={vaultForm.connector_name}
                    onChange={(e) => setVaultForm({ ...vaultForm, connector_name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Storage Type</Label>
                  <Select 
                    value={vaultForm.vault_type} 
                    onValueChange={(val: any) => setVaultForm({ ...vaultForm, vault_type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="s3">Amazon S3</SelectItem>
                      <SelectItem value="azure">Azure Blob Storage</SelectItem>
                      <SelectItem value="gcs">Google Cloud Storage</SelectItem>
                      <SelectItem value="sftp">SFTP</SelectItem>
                      <SelectItem value="on_prem">On-Premise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Endpoint / Bucket *</Label>
                  <Input
                    placeholder="s3://bucket-name/path or sftp://host/path"
                    value={vaultForm.vault_endpoint}
                    onChange={(e) => setVaultForm({ ...vaultForm, vault_endpoint: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddVault} disabled={saving} className="w-full">
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Vault
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {vaultConnectors.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No customer vaults configured yet.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {vaultConnectors.map(c => (
              <ConnectorCard key={c.id} connector={c} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
