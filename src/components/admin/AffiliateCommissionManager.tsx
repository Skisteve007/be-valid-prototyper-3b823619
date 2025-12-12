import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { DollarSign, Percent, Users, Building2, Save, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Venue {
  id: string;
  venue_name: string;
  city: string;
  door_commission_rate: number | null;
  bar_commission_rate: number | null;
}

interface Affiliate {
  id: string;
  full_name: string | null;
  email: string | null;
  referral_code: string;
  status: string | null;
  total_earnings: number | null;
  pending_earnings: number | null;
}

interface AffiliateVenueAssignment {
  affiliate_id: string;
  venue_id: string;
  door_commission_override: number | null;
  bar_commission_override: number | null;
}

const AffiliateCommissionManager = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedAffiliate, setSelectedAffiliate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Commission rate form
  const [doorRate, setDoorRate] = useState('10');
  const [barRate, setBarRate] = useState('5');

  useEffect(() => {
    fetchVenues();
    fetchAffiliates();
  }, []);

  const fetchVenues = async () => {
    const { data, error } = await supabase
      .from('partner_venues')
      .select('id, venue_name, city, door_commission_rate, bar_commission_rate')
      .order('venue_name');

    if (error) {
      console.error('Error fetching venues:', error);
    } else {
      setVenues(data || []);
    }
    setLoading(false);
  };

  const fetchAffiliates = async () => {
    const { data, error } = await supabase
      .from('affiliates')
      .select('id, full_name, email, referral_code, status, total_earnings, pending_earnings')
      .order('full_name');

    if (error) {
      console.error('Error fetching affiliates:', error);
    } else {
      setAffiliates(data || []);
    }
  };

  const handleSelectVenue = (venue: Venue) => {
    setSelectedVenue(venue);
    setDoorRate(((venue.door_commission_rate || 0.1) * 100).toString());
    setBarRate(((venue.bar_commission_rate || 0.05) * 100).toString());
  };

  const handleSaveCommissionRates = async () => {
    if (!selectedVenue) return;
    
    setSaving(true);
    
    const { error } = await supabase
      .from('partner_venues')
      .update({
        door_commission_rate: parseFloat(doorRate) / 100,
        bar_commission_rate: parseFloat(barRate) / 100,
      })
      .eq('id', selectedVenue.id);

    if (error) {
      console.error('Error updating commission rates:', error);
      toast.error('Failed to save commission rates');
    } else {
      toast.success('Commission rates updated');
      fetchVenues();
    }
    
    setSaving(false);
  };

  const formatCurrency = (amount: number | null) => {
    return `$${(amount || 0).toFixed(2)}`;
  };

  const formatPercent = (rate: number | null) => {
    return `${((rate || 0) * 100).toFixed(0)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Venue Commission Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Venue Commission Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading venues...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Venue List */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Select Venue to Configure</h3>
                <div className="max-h-80 overflow-y-auto space-y-2 pr-2">
                  {venues.map((venue) => (
                    <button
                      key={venue.id}
                      onClick={() => handleSelectVenue(venue)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedVenue?.id === venue.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="font-medium">{venue.venue_name}</div>
                      <div className="text-sm text-muted-foreground">{venue.city}</div>
                      <div className="flex gap-3 mt-1 text-xs">
                        <span className="text-amber-400">
                          Door: {formatPercent(venue.door_commission_rate)}
                        </span>
                        <span className="text-green-400">
                          Bar: {formatPercent(venue.bar_commission_rate)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Commission Editor */}
              <div className="space-y-4">
                {selectedVenue ? (
                  <>
                    <div className="p-4 rounded-lg bg-muted/30 border border-border">
                      <h3 className="font-bold mb-1">{selectedVenue.venue_name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedVenue.city}</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Door Charge Commission (%)
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={doorRate}
                            onChange={(e) => setDoorRate(e.target.value)}
                            className="w-24"
                          />
                          <span className="text-sm text-muted-foreground">
                            % of door revenue to affiliate
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block flex items-center gap-1">
                          <Percent className="h-3 w-3" />
                          Bar/POS Charge Commission (%)
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={barRate}
                            onChange={(e) => setBarRate(e.target.value)}
                            className="w-24"
                          />
                          <span className="text-sm text-muted-foreground">
                            % of bar spend to affiliate
                          </span>
                        </div>
                      </div>

                      <Button 
                        onClick={handleSaveCommissionRates}
                        disabled={saving}
                        className="w-full gap-2"
                      >
                        {saving ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save Commission Rates
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    Select a venue to configure commission rates
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Affiliate Performance Overview */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Affiliate Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {affiliates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No affiliates found</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Referral Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Earned</TableHead>
                    <TableHead className="text-right">Pending</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates.map((affiliate) => (
                    <TableRow key={affiliate.id}>
                      <TableCell>
                        <div className="font-medium">{affiliate.full_name || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{affiliate.email}</div>
                      </TableCell>
                      <TableCell>
                        <code className="px-2 py-1 rounded bg-muted text-xs font-mono">
                          {affiliate.referral_code}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={affiliate.status === 'approved' ? 'default' : 'secondary'}>
                          {affiliate.status || 'pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-400">
                        {formatCurrency(affiliate.total_earnings)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-amber-400">
                        {formatCurrency(affiliate.pending_earnings)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateCommissionManager;