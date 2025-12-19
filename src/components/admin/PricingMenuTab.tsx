import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Save, DollarSign, Zap, Users, Clock, Building2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PricingModel {
  id: string;
  model_key: string;
  display_name: string;
  description: string | null;
  saas_monthly_fee: number;
  saas_annual_discount_percent: number;
  scan_fee_door_min: number;
  scan_fee_door_max: number;
  scan_fee_door_default: number;
  scan_fee_purchase_min: number;
  scan_fee_purchase_max: number;
  scan_fee_purchase_default: number;
  instant_load_fee_percent: number;
  instant_load_fee_flat: number;
  idv_standard_passthrough: number;
  idv_standard_markup: number;
  idv_premium_passthrough: number;
  idv_premium_markup: number;
  payout_cadence_default: string;
  payout_cadence_options: string[] | null;
  volume_tiers: any;
  is_active: boolean;
}

export const PricingMenuTab = () => {
  const [pricingModels, setPricingModels] = useState<PricingModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchPricingModels();
  }, []);

  const fetchPricingModels = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing_models')
        .select('*')
        .order('model_key');
      
      if (error) throw error;
      setPricingModels(data || []);
    } catch (error) {
      console.error('Error fetching pricing models:', error);
      toast.error('Failed to load pricing models');
    } finally {
      setLoading(false);
    }
  };

  const updateModel = (id: string, field: string, value: any) => {
    setPricingModels(prev => prev.map(model => 
      model.id === id ? { ...model, [field]: value } : model
    ));
  };

  const saveModel = async (model: PricingModel) => {
    setSaving(model.id);
    try {
      const { error } = await supabase
        .from('pricing_models')
        .update({
          display_name: model.display_name,
          description: model.description,
          saas_monthly_fee: model.saas_monthly_fee,
          saas_annual_discount_percent: model.saas_annual_discount_percent,
          scan_fee_door_min: model.scan_fee_door_min,
          scan_fee_door_max: model.scan_fee_door_max,
          scan_fee_door_default: model.scan_fee_door_default,
          scan_fee_purchase_min: model.scan_fee_purchase_min,
          scan_fee_purchase_max: model.scan_fee_purchase_max,
          scan_fee_purchase_default: model.scan_fee_purchase_default,
          instant_load_fee_percent: model.instant_load_fee_percent,
          instant_load_fee_flat: model.instant_load_fee_flat,
          idv_standard_passthrough: model.idv_standard_passthrough,
          idv_standard_markup: model.idv_standard_markup,
          idv_premium_passthrough: model.idv_premium_passthrough,
          idv_premium_markup: model.idv_premium_markup,
          payout_cadence_default: model.payout_cadence_default,
        })
        .eq('id', model.id);

      if (error) throw error;
      toast.success(`${model.display_name} pricing saved`);
    } catch (error) {
      console.error('Error saving pricing model:', error);
      toast.error('Failed to save pricing model');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-emerald-400" />
            Pricing Menu
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Configure pricing models for different venue types. Changes apply immediately.
          </p>
        </div>
      </div>

      {/* Scan Event Definition */}
      <Card className="border-cyan-500/30 bg-cyan-500/5">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-cyan-400 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Scan Event Definition</p>
              <p className="text-xs text-muted-foreground">
                1 Scan Event = 1 successful authorization (door entry OR purchase). 
                Re-scans don't create extra events due to idempotency + 60s grace window.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Models */}
      {pricingModels.map((model) => (
        <Card key={model.id} className={model.model_key === 'stadium' ? 'border-emerald-500/30' : ''}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {model.model_key === 'nightlife' ? (
                  <Building2 className="h-5 w-5 text-cyan-400" />
                ) : (
                  <Users className="h-5 w-5 text-emerald-400" />
                )}
                <div>
                  <CardTitle className="text-lg">{model.display_name}</CardTitle>
                  <CardDescription>{model.description}</CardDescription>
                </div>
              </div>
              <Badge variant={model.model_key === 'stadium' ? 'default' : 'secondary'}>
                {model.model_key.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* SaaS Fees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs">Monthly SaaS Fee ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={model.saas_monthly_fee}
                  onChange={(e) => updateModel(model.id, 'saas_monthly_fee', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Annual Discount (%)</Label>
                <Input
                  type="number"
                  step="1"
                  value={model.saas_annual_discount_percent}
                  onChange={(e) => updateModel(model.id, 'saas_annual_discount_percent', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Per-Scan Fees */}
            <div>
              <p className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                Per-Scan Event Fees
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs">Door Entry Default ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={model.scan_fee_door_default}
                    onChange={(e) => updateModel(model.id, 'scan_fee_door_default', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Door Entry Min ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={model.scan_fee_door_min}
                    onChange={(e) => updateModel(model.id, 'scan_fee_door_min', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Door Entry Max ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={model.scan_fee_door_max}
                    onChange={(e) => updateModel(model.id, 'scan_fee_door_max', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Purchase Default ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={model.scan_fee_purchase_default}
                    onChange={(e) => updateModel(model.id, 'scan_fee_purchase_default', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Purchase Min ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={model.scan_fee_purchase_min}
                    onChange={(e) => updateModel(model.id, 'scan_fee_purchase_min', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Purchase Max ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={model.scan_fee_purchase_max}
                    onChange={(e) => updateModel(model.id, 'scan_fee_purchase_max', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Instant Load Fees */}
            <div>
              <p className="font-semibold text-sm mb-3">Instant Load Fee (Guest Pays)</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Percentage (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={model.instant_load_fee_percent}
                    onChange={(e) => updateModel(model.id, 'instant_load_fee_percent', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Flat Fee ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={model.instant_load_fee_flat}
                    onChange={(e) => updateModel(model.id, 'instant_load_fee_flat', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* IDV Fees */}
            <div>
              <p className="font-semibold text-sm mb-3">ID Verification Fees</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-xs">Standard Pass-through ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={model.idv_standard_passthrough}
                    onChange={(e) => updateModel(model.id, 'idv_standard_passthrough', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Standard Markup ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={model.idv_standard_markup}
                    onChange={(e) => updateModel(model.id, 'idv_standard_markup', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Premium Pass-through ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={model.idv_premium_passthrough}
                    onChange={(e) => updateModel(model.id, 'idv_premium_passthrough', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Premium Markup ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={model.idv_premium_markup}
                    onChange={(e) => updateModel(model.id, 'idv_premium_markup', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Total IDV fee = Pass-through + Markup. Standard: ${(model.idv_standard_passthrough + model.idv_standard_markup).toFixed(2)}, 
                Premium: ${(model.idv_premium_passthrough + model.idv_premium_markup).toFixed(2)}
              </p>
            </div>

            {/* Payout Settings */}
            <div>
              <p className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-400" />
                Payout Settings
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">Default Payout Cadence</Label>
                  <Select
                    value={model.payout_cadence_default}
                    onValueChange={(value) => updateModel(model.id, 'payout_cadence_default', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nightly">Nightly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-border">
              <Button 
                onClick={() => saveModel(model)}
                disabled={saving === model.id}
              >
                {saving === model.id ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save {model.display_name}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
