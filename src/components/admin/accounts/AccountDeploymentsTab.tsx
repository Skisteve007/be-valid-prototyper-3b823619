import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Loader2, Plus, Play, Settings, Trash2, Eye } from "lucide-react";
import { format } from "date-fns";

interface Deployment {
  id: string;
  deployment_name: string;
  environment: string;
  ttl_minutes: number;
  consensus_threshold: number;
  lens_1_enabled: boolean;
  lens_2_enabled: boolean;
  lens_3_enabled: boolean;
  lens_4_enabled: boolean;
  lens_5_enabled: boolean;
  lens_6_enabled: boolean;
  lens_7_enabled: boolean;
  default_action: string;
  is_active: boolean;
  created_at: string;
}

interface AccountDeploymentsTabProps {
  accountId: string;
  onRunDemo: (accountId: string, deploymentId: string) => void;
}

const LENS_NAMES = [
  "Coherence Analysis",
  "Source Verification",
  "Pattern Detection",
  "Temporal Consistency",
  "Cross-Reference Check",
  "Anomaly Detection",
  "Confidence Scoring",
];

export const AccountDeploymentsTab = ({ accountId, onRunDemo }: AccountDeploymentsTabProps) => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDeployment, setEditingDeployment] = useState<Deployment | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    deployment_name: "",
    environment: "dev" as "dev" | "stage" | "prod",
    ttl_minutes: 10,
    consensus_threshold: 5,
    lenses: [true, true, true, true, true, true, true],
    default_action: "flush",
  });

  useEffect(() => {
    loadDeployments();
  }, [accountId]);

  const loadDeployments = async () => {
    try {
      const { data, error } = await supabase
        .from("account_deployments")
        .select("*")
        .eq("account_id", accountId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDeployments(data || []);
    } catch (error: any) {
      toast.error("Failed to load deployments");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.deployment_name) {
      toast.error("Please enter a deployment name");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("account_deployments")
        .insert({
          account_id: accountId,
          deployment_name: formData.deployment_name,
          environment: formData.environment,
          ttl_minutes: formData.ttl_minutes,
          consensus_threshold: formData.consensus_threshold,
          lens_1_enabled: formData.lenses[0],
          lens_2_enabled: formData.lenses[1],
          lens_3_enabled: formData.lenses[2],
          lens_4_enabled: formData.lenses[3],
          lens_5_enabled: formData.lenses[4],
          lens_6_enabled: formData.lenses[5],
          lens_7_enabled: formData.lenses[6],
          default_action: formData.default_action,
        });

      if (error) throw error;

      toast.success("Deployment created");
      setShowAddDialog(false);
      resetForm();
      loadDeployments();
    } catch (error: any) {
      toast.error("Failed to create deployment");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this deployment?")) return;

    try {
      const { error } = await supabase
        .from("account_deployments")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Deployment deleted");
      loadDeployments();
    } catch (error: any) {
      toast.error("Failed to delete deployment");
    }
  };

  const resetForm = () => {
    setFormData({
      deployment_name: "",
      environment: "dev",
      ttl_minutes: 10,
      consensus_threshold: 5,
      lenses: [true, true, true, true, true, true, true],
      default_action: "flush",
    });
  };

  const toggleLens = (index: number) => {
    const newLenses = [...formData.lenses];
    newLenses[index] = !newLenses[index];
    setFormData({ ...formData, lenses: newLenses });
  };

  const getEnvBadge = (env: string) => {
    const colors: Record<string, string> = {
      dev: "bg-blue-500 text-white",
      stage: "bg-yellow-500 text-black",
      prod: "bg-green-500 text-white",
    };
    return <Badge className={colors[env]}>{env.toUpperCase()}</Badge>;
  };

  const countEnabledLenses = (dep: Deployment) => {
    return [
      dep.lens_1_enabled,
      dep.lens_2_enabled,
      dep.lens_3_enabled,
      dep.lens_4_enabled,
      dep.lens_5_enabled,
      dep.lens_6_enabled,
      dep.lens_7_enabled,
    ].filter(Boolean).length;
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
      {/* Header + Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Deployments</h3>
          <p className="text-sm text-muted-foreground">
            Configure isolated environments with custom lens settings
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> New Deployment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Deployment</DialogTitle>
              <DialogDescription>
                Configure a new deployment with custom settings
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label>Deployment Name *</Label>
                <Input
                  placeholder="e.g., Production Validator"
                  value={formData.deployment_name}
                  onChange={(e) => setFormData({ ...formData, deployment_name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Environment</Label>
                  <Select 
                    value={formData.environment} 
                    onValueChange={(val: "dev" | "stage" | "prod") => 
                      setFormData({ ...formData, environment: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-background border z-50">
                      <SelectItem value="dev">Development</SelectItem>
                      <SelectItem value="stage">Staging</SelectItem>
                      <SelectItem value="prod">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>TTL (minutes)</Label>
                  <Input
                    type="number"
                    min={1}
                    max={60}
                    value={formData.ttl_minutes}
                    onChange={(e) => setFormData({ ...formData, ttl_minutes: parseInt(e.target.value) || 10 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Consensus Threshold: ≥{formData.consensus_threshold}/7</Label>
                <Slider
                  value={[formData.consensus_threshold]}
                  onValueChange={([val]) => setFormData({ ...formData, consensus_threshold: val })}
                  min={1}
                  max={7}
                  step={1}
                />
              </div>

              <div className="space-y-3">
                <Label>Enable Lenses</Label>
                {LENS_NAMES.map((name, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm">Lens {idx + 1}: {name}</span>
                    <Switch
                      checked={formData.lenses[idx]}
                      onCheckedChange={() => toggleLens(idx)}
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Default After-Decision Action</Label>
                <Select 
                  value={formData.default_action} 
                  onValueChange={(val) => setFormData({ ...formData, default_action: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border z-50">
                    <SelectItem value="flush">Flush (delete payload)</SelectItem>
                    <SelectItem value="save_customer">Save to Customer Storage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleCreate} disabled={saving} className="w-full">
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create Deployment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Deployments Table */}
      {deployments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No deployments yet. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Environment</TableHead>
                <TableHead>TTL</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead>Lenses</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deployments.map((dep) => (
                <TableRow key={dep.id}>
                  <TableCell className="font-medium">{dep.deployment_name}</TableCell>
                  <TableCell>{getEnvBadge(dep.environment)}</TableCell>
                  <TableCell>{dep.ttl_minutes}m</TableCell>
                  <TableCell>≥{dep.consensus_threshold}/7</TableCell>
                  <TableCell>{countEnabledLenses(dep)}/7</TableCell>
                  <TableCell>
                    <Badge variant={dep.is_active ? "default" : "outline"}>
                      {dep.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRunDemo(accountId, dep.id)}
                        className="gap-1"
                      >
                        <Play className="h-3 w-3" /> Run
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(dep.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
