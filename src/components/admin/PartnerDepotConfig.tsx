import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Loader2, 
  Plus, 
  Shield, 
  UserCheck, 
  FileCheck, 
  Activity,
  Settings,
  Trash2,
  Save,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap
} from "lucide-react";

// Signal type definitions matching the database enum
const SIGNAL_TYPES = [
  { id: 'age_verified', label: 'Age Verified', icon: UserCheck, description: 'Confirms user is of legal age' },
  { id: 'idv_status', label: 'ID Verification', icon: Shield, description: 'Government ID validated' },
  { id: 'background_check', label: 'Background Check', icon: FileCheck, description: 'Criminal background cleared' },
  { id: 'terrorist_list_clear', label: 'Watchlist Clear', icon: AlertTriangle, description: 'Not on terrorist/sanction lists' },
  { id: 'covid_vaccinated', label: 'COVID Vaccinated', icon: Activity, description: 'COVID vaccination status' },
  { id: 'health_card', label: 'Health Card', icon: Activity, description: 'Valid health card on file' },
  { id: 'drug_test_clear', label: 'Drug Test Clear', icon: CheckCircle2, description: 'Passed drug screening' },
  { id: 'license_verified', label: 'License Verified', icon: FileCheck, description: 'Professional license valid' },
  { id: 'education_verified', label: 'Education Verified', icon: FileCheck, description: 'Education credentials confirmed' },
  { id: 'employment_verified', label: 'Employment Verified', icon: FileCheck, description: 'Employment status confirmed' },
  { id: 'credit_check', label: 'Credit Check', icon: Shield, description: 'Credit check passed' },
  { id: 'insurance_verified', label: 'Insurance Verified', icon: Shield, description: 'Insurance coverage valid' },
  { id: 'certification_valid', label: 'Certification Valid', icon: FileCheck, description: 'Professional cert active' },
] as const;

type DepotSignalType = 
  | 'age_verified' 
  | 'idv_status' 
  | 'background_check' 
  | 'terrorist_list_clear' 
  | 'covid_vaccinated' 
  | 'health_card' 
  | 'drug_test_clear' 
  | 'license_verified' 
  | 'education_verified' 
  | 'employment_verified' 
  | 'credit_check' 
  | 'insurance_verified' 
  | 'certification_valid' 
  | 'custom';

interface DepotConfig {
  id: string;
  venue_id: string;
  depot_name: string;
  description: string | null;
  required_signals: DepotSignalType[];
  custom_signals: any;
  fail_action: string;
  partial_pass_threshold: number;
  webhook_url: string | null;
  is_active: boolean;
  created_at: string;
}

interface PartnerDepotConfigProps {
  venueId: string;
  venueName: string;
  onClose?: () => void;
}

export const PartnerDepotConfig = ({ venueId, venueName, onClose }: PartnerDepotConfigProps) => {
  const [depots, setDepots] = useState<DepotConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingDepot, setEditingDepot] = useState<DepotConfig | null>(null);
  
  // Form state
  const [depotName, setDepotName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSignals, setSelectedSignals] = useState<DepotSignalType[]>([]);
  const [failAction, setFailAction] = useState("deny");
  const [passThreshold, setPassThreshold] = useState(100);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    loadDepots();
  }, [venueId]);

  const loadDepots = async () => {
    try {
      const { data, error } = await supabase
        .from("partner_depot_config")
        .select("*")
        .eq("venue_id", venueId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDepots(data || []);
    } catch (error: any) {
      toast.error("Failed to load depot configurations");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDepotName("");
    setDescription("");
    setSelectedSignals([]);
    setFailAction("deny");
    setPassThreshold(100);
    setWebhookUrl("");
    setIsActive(true);
    setEditingDepot(null);
  };

  const handleEdit = (depot: DepotConfig) => {
    setEditingDepot(depot);
    setDepotName(depot.depot_name);
    setDescription(depot.description || "");
    setSelectedSignals(depot.required_signals || []);
    setFailAction(depot.fail_action);
    setPassThreshold(depot.partial_pass_threshold);
    setWebhookUrl(depot.webhook_url || "");
    setIsActive(depot.is_active);
    setShowAddDialog(true);
  };

  const handleSave = async () => {
    if (!depotName.trim()) {
      toast.error("Depot name is required");
      return;
    }

    setSaving(true);
    try {
      const depotData = {
        venue_id: venueId,
        depot_name: depotName.trim(),
        description: description.trim() || null,
        required_signals: selectedSignals,
        fail_action: failAction,
        partial_pass_threshold: passThreshold,
        webhook_url: webhookUrl.trim() || null,
        is_active: isActive,
      };

      if (editingDepot) {
        const { error } = await supabase
          .from("partner_depot_config")
          .update(depotData)
          .eq("id", editingDepot.id);
        if (error) throw error;
        toast.success("Depot updated successfully");
      } else {
        const { error } = await supabase
          .from("partner_depot_config")
          .insert(depotData);
        if (error) throw error;
        toast.success("Depot created successfully");
      }

      setShowAddDialog(false);
      resetForm();
      loadDepots();
    } catch (error: any) {
      toast.error(editingDepot ? "Failed to update depot" : "Failed to create depot");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (depotId: string) => {
    if (!confirm("Are you sure you want to delete this depot configuration?")) return;

    try {
      const { error } = await supabase
        .from("partner_depot_config")
        .delete()
        .eq("id", depotId);
      if (error) throw error;
      toast.success("Depot deleted");
      loadDepots();
    } catch (error: any) {
      toast.error("Failed to delete depot");
    }
  };

  const toggleSignal = (signalId: DepotSignalType) => {
    setSelectedSignals(prev => 
      prev.includes(signalId) 
        ? prev.filter(s => s !== signalId)
        : [...prev, signalId]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="border-cyan-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              Signal Depot Configuration
            </CardTitle>
            <CardDescription>
              Configure verification requirements for {venueName}
            </CardDescription>
          </div>
          <Dialog open={showAddDialog} onOpenChange={(open) => {
            setShowAddDialog(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Depot
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>
                  {editingDepot ? "Edit Signal Depot" : "Create Signal Depot"}
                </DialogTitle>
                <DialogDescription>
                  Define verification signals required for this partner. Signals are verified against sources of truth - VALID remains a conduit.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] pr-4">
                <div className="space-y-6 py-4">
                  {/* Basic Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Depot Name *</Label>
                      <Input
                        placeholder="e.g., Campus Entry, VIP Access"
                        value={depotName}
                        onChange={(e) => setDepotName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input
                        placeholder="Optional description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Signal Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Required Verification Signals</Label>
                    <p className="text-sm text-muted-foreground">
                      Select signals that must pass before granting access. Each signal is verified against its source of truth.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {SIGNAL_TYPES.map((signal) => {
                        const Icon = signal.icon;
                        const isSelected = selectedSignals.includes(signal.id as DepotSignalType);
                        return (
                          <button
                            key={signal.id}
                            type="button"
                            onClick={() => toggleSignal(signal.id as DepotSignalType)}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                              isSelected 
                                ? 'border-cyan-500 bg-cyan-500/10' 
                                : 'border-border hover:border-cyan-500/50'
                            }`}
                          >
                            <div className={`p-1.5 rounded ${isSelected ? 'bg-cyan-500/20' : 'bg-muted'}`}>
                              <Icon className={`h-4 w-4 ${isSelected ? 'text-cyan-400' : 'text-muted-foreground'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${isSelected ? 'text-cyan-400' : ''}`}>
                                {signal.label}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {signal.description}
                              </p>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Policy Settings */}
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-base font-semibold">Policy Settings</Label>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>On Failure</Label>
                        <Select value={failAction} onValueChange={setFailAction}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="deny">Deny Access</SelectItem>
                            <SelectItem value="flag">Flag for Review</SelectItem>
                            <SelectItem value="log_only">Log Only (Allow)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Pass Threshold (%)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={passThreshold}
                          onChange={(e) => setPassThreshold(parseInt(e.target.value) || 100)}
                        />
                        <p className="text-xs text-muted-foreground">
                          % of signals needed to pass (100 = all required)
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Webhook URL (Optional)</Label>
                      <Input
                        type="url"
                        placeholder="https://your-system.com/webhook"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Receive real-time verification results
                      </p>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <Label>Active</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable this depot for verification
                        </p>
                      </div>
                      <Switch checked={isActive} onCheckedChange={setIsActive} />
                    </div>
                  </div>
                </div>
              </ScrollArea>
              
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving} className="gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  <Save className="h-4 w-4" />
                  {editingDepot ? "Update Depot" : "Create Depot"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {depots.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No signal depots configured yet</p>
            <p className="text-sm">Create a depot to define verification requirements</p>
          </div>
        ) : (
          <div className="space-y-3">
            {depots.map((depot) => (
              <div 
                key={depot.id}
                className={`p-4 rounded-lg border ${depot.is_active ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-border opacity-60'}`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{depot.depot_name}</h4>
                      <Badge variant={depot.is_active ? "default" : "outline"} className="text-xs">
                        {depot.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {depot.fail_action === 'deny' && <XCircle className="h-3 w-3 mr-1" />}
                        {depot.fail_action === 'flag' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {depot.fail_action === 'log_only' && <Activity className="h-3 w-3 mr-1" />}
                        {depot.fail_action}
                      </Badge>
                    </div>
                    {depot.description && (
                      <p className="text-sm text-muted-foreground">{depot.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {(depot.required_signals || []).map((signalId) => {
                        const signal = SIGNAL_TYPES.find(s => s.id === signalId);
                        return signal ? (
                          <Badge key={signalId} variant="secondary" className="text-xs">
                            {signal.label}
                          </Badge>
                        ) : null;
                      })}
                      {(!depot.required_signals || depot.required_signals.length === 0) && (
                        <span className="text-xs text-muted-foreground italic">No signals configured</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(depot)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(depot.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
