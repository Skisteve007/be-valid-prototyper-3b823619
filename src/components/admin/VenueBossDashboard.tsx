import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, DollarSign, TrendingUp, Percent, Building2, Save } from "lucide-react";

interface VenueData {
  id: string;
  venue_name: string;
  total_earnings: number | null;
  pending_earnings: number | null;
  promoter_spend_commission_rate: number | null;
}

interface VenueBossDashboardProps {
  venueId: string;
}

export const VenueBossDashboard = ({ venueId }: VenueBossDashboardProps) => {
  const [venue, setVenue] = useState<VenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [commissionRate, setCommissionRate] = useState<number>(0);

  useEffect(() => {
    loadVenueData();
  }, [venueId]);

  const loadVenueData = async () => {
    try {
      const { data, error } = await supabase
        .from("partner_venues")
        .select("id, venue_name, total_earnings, pending_earnings, promoter_spend_commission_rate")
        .eq("id", venueId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setVenue(data);
        setCommissionRate(data.promoter_spend_commission_rate || 0);
      }
    } catch (error: any) {
      toast.error("Failed to load venue data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCommission = async () => {
    if (!venue) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("partner_venues")
        .update({ promoter_spend_commission_rate: commissionRate })
        .eq("id", venue.id);

      if (error) throw error;
      
      toast.success("Commission rate updated");
      loadVenueData();
    } catch (error: any) {
      toast.error("Failed to update commission rate");
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "$0.00";
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Venue not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">{venue.venue_name}</h2>
          <p className="text-muted-foreground">Venue Boss Dashboard</p>
        </div>
      </div>

      {/* Earnings Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Total Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-500">
              {formatCurrency(venue.total_earnings)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              All-time revenue from Ghost Token scans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-500" />
              Pending Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-500">
              {formatCurrency(venue.pending_earnings)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting transfer to your account
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-purple-500" />
            Commission Settings
          </CardTitle>
          <CardDescription>
            Configure the commission rate paid to promoters on bar spend at your venue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="boss-commission">Promoter Bar Commission %</Label>
            <div className="flex gap-2">
              <Input
                id="boss-commission"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={commissionRate}
                onChange={(e) => setCommissionRate(parseFloat(e.target.value) || 0)}
                className="max-w-[200px]"
              />
              <Button onClick={handleSaveCommission} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                Save
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              This percentage of bar spend will be credited to the promoter who brought the customer.
              Set to 0% to disable promoter commissions on bar spend.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
