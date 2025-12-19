import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, FileText, DollarSign, Users, Zap, ArrowDownRight, ArrowUpRight, RefreshCw, Building2, Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, startOfWeek, endOfWeek, subWeeks } from 'date-fns';

interface StatementData {
  grossSpend: number;
  totalScanCount: number;
  doorScanCount: number;
  purchaseScanCount: number;
  scanFeesTotal: number;
  idvFeesTotal: number;
  instantLoadFeesTotal: number;
  promoterPayouts: number;
  accountManagerPayouts: number;
  refundsVoids: number;
  netPayout: number;
}

interface Venue {
  id: string;
  venue_name: string;
  city: string;
}

export const StatementPreviewTab = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('current');
  const [loading, setLoading] = useState(true);
  const [statementData, setStatementData] = useState<StatementData>({
    grossSpend: 0,
    totalScanCount: 0,
    doorScanCount: 0,
    purchaseScanCount: 0,
    scanFeesTotal: 0,
    idvFeesTotal: 0,
    instantLoadFeesTotal: 0,
    promoterPayouts: 0,
    accountManagerPayouts: 0,
    refundsVoids: 0,
    netPayout: 0,
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  useEffect(() => {
    if (venues.length > 0 || selectedVenue === 'all') {
      fetchStatementData();
    }
  }, [selectedVenue, selectedPeriod, venues]);

  const fetchVenues = async () => {
    try {
      const { data, error } = await supabase
        .from('partner_venues')
        .select('id, venue_name, city')
        .order('venue_name');
      
      if (error) throw error;
      setVenues(data || []);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    switch (selectedPeriod) {
      case 'current':
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
        };
      case 'last':
        const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
        return {
          start: lastWeekStart,
          end: endOfWeek(lastWeekStart, { weekStartsOn: 1 }),
        };
      case 'twoweeks':
        return {
          start: startOfWeek(subWeeks(now, 2), { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
        };
      default:
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }),
          end: endOfWeek(now, { weekStartsOn: 1 }),
        };
    }
  };

  const fetchStatementData = async () => {
    setLoading(true);
    try {
      const { start, end } = getDateRange();
      const startStr = format(start, 'yyyy-MM-dd');
      const endStr = format(end, 'yyyy-MM-dd');

      // Fetch billable scan events
      let scanQuery = supabase
        .from('billable_scan_events')
        .select('event_type, fee_amount')
        .gte('created_at', startStr)
        .lte('created_at', endStr);
      
      if (selectedVenue !== 'all') {
        scanQuery = scanQuery.eq('venue_id', selectedVenue);
      }

      const { data: scanData, error: scanError } = await scanQuery;
      if (scanError) throw scanError;

      // Calculate scan metrics
      const doorScans = scanData?.filter(s => s.event_type === 'door_entry') || [];
      const purchaseScans = scanData?.filter(s => s.event_type === 'purchase') || [];
      const totalScanFees = scanData?.reduce((sum, s) => sum + (s.fee_amount || 0), 0) || 0;

      // Fetch transactions for gross spend
      let txQuery = supabase
        .from('valid_transactions')
        .select('gross_amount, promoter_share')
        .gte('created_at', startStr)
        .lte('created_at', endStr);
      
      if (selectedVenue !== 'all') {
        txQuery = txQuery.eq('venue_id', selectedVenue);
      }

      const { data: txData, error: txError } = await txQuery;
      if (txError) throw txError;

      const grossSpend = txData?.reduce((sum, t) => sum + (Number(t.gross_amount) || 0), 0) || 0;
      const promoterPayouts = txData?.reduce((sum, t) => sum + (Number(t.promoter_share) || 0), 0) || 0;

      // Fetch IDV verifications
      let idvQuery = supabase
        .from('idv_verifications')
        .select('tier')
        .eq('status', 'verified')
        .gte('created_at', startStr)
        .lte('created_at', endStr);

      const { data: idvData, error: idvError } = await idvQuery;
      if (idvError) throw idvError;

      // Estimate IDV fees (would need pricing model lookup in production)
      const standardIdv = idvData?.filter(v => v.tier === 'standard').length || 0;
      const premiumIdv = idvData?.filter(v => v.tier === 'premium').length || 0;
      const idvFeesTotal = (standardIdv * 2.0) + (premiumIdv * 4.0);

      // Calculate net payout
      const netPayout = grossSpend - totalScanFees - idvFeesTotal - promoterPayouts;

      setStatementData({
        grossSpend,
        totalScanCount: scanData?.length || 0,
        doorScanCount: doorScans.length,
        purchaseScanCount: purchaseScans.length,
        scanFeesTotal: totalScanFees,
        idvFeesTotal,
        instantLoadFeesTotal: 0, // Would calculate from wallet_funding_transactions
        promoterPayouts,
        accountManagerPayouts: 0, // Would need AM table
        refundsVoids: 0, // Would need refunds table
        netPayout: Math.max(0, netPayout),
      });
    } catch (error) {
      console.error('Error fetching statement data:', error);
      toast.error('Failed to load statement data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const { start, end } = getDateRange();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-emerald-400" />
            Statement Preview
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Preview venue statements before payout
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedVenue} onValueChange={setSelectedVenue}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select venue" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Venues</SelectItem>
              {venues.map((venue) => (
                <SelectItem key={venue.id} value={venue.id}>
                  {venue.venue_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">This Week</SelectItem>
              <SelectItem value="last">Last Week</SelectItem>
              <SelectItem value="twoweeks">Last 2 Weeks</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchStatementData}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Period Badge */}
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <Badge variant="outline">
          {format(start, 'MMM d')} – {format(end, 'MMM d, yyyy')}
        </Badge>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Gross Spend</p>
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold mt-2">{formatCurrency(statementData.grossSpend)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Total Scans</p>
                  <Zap className="h-4 w-4 text-cyan-400" />
                </div>
                <p className="text-2xl font-bold mt-2">{statementData.totalScanCount.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Scan Fees</p>
                  <ArrowDownRight className="h-4 w-4 text-amber-400" />
                </div>
                <p className="text-2xl font-bold mt-2">{formatCurrency(statementData.scanFeesTotal)}</p>
              </CardContent>
            </Card>
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-emerald-400">Net Payout</p>
                  <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-2xl font-bold mt-2 text-emerald-400">{formatCurrency(statementData.netPayout)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Statement Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Revenue Section */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Revenue</p>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span>Gross Spend (Ghost Pass + Direct)</span>
                      <span className="font-semibold">{formatCurrency(statementData.grossSpend)}</span>
                    </div>
                  </div>
                </div>

                {/* Scan Counts Section */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Scan Events</p>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-cyan-400" />
                        Door Entry Scans
                      </span>
                      <span>{statementData.doorScanCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-purple-400" />
                        Purchase Scans
                      </span>
                      <span>{statementData.purchaseScanCount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50 font-semibold">
                      <span>Total Scan Fees</span>
                      <span className="text-amber-400">-{formatCurrency(statementData.scanFeesTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* IDV Section */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">ID Verification</p>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span>IDV Usage Fees</span>
                      <span className="text-amber-400">-{formatCurrency(statementData.idvFeesTotal)}</span>
                    </div>
                  </div>
                </div>

                {/* Payouts Section */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Payouts</p>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        Promoter Commissions
                      </span>
                      <span className="text-amber-400">-{formatCurrency(statementData.promoterPayouts)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span>Account Manager Payouts</span>
                      <span className="text-amber-400">-{formatCurrency(statementData.accountManagerPayouts)}</span>
                    </div>
                  </div>
                </div>

                {/* Adjustments Section */}
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Adjustments</p>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span>Refunds / Voids</span>
                      <span className="text-amber-400">-{formatCurrency(statementData.refundsVoids)}</span>
                    </div>
                  </div>
                </div>

                {/* Net Payout */}
                <div className="pt-4 border-t-2 border-emerald-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Net Payout</span>
                    <span className="text-2xl font-bold text-emerald-400">{formatCurrency(statementData.netPayout)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
