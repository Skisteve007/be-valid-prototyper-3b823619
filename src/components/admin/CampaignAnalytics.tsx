import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Mail, MousePointer, Users, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CampaignAnalytics {
  id: string;
  campaign_name: string;
  subject_line: string;
  target_segment: string;
  sent_count: number;
  delivered_count: number;
  open_count: number;
  click_count: number;
  bounce_count: number;
  unsubscribe_count: number;
  last_sent_at: string | null;
}

export const CampaignAnalytics = () => {
  const [analytics, setAnalytics] = useState<CampaignAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('marketing_templates')
        .select(`
          id,
          campaign_name,
          subject_line,
          target_segment,
          campaign_analytics (
            sent_count,
            delivered_count,
            open_count,
            click_count,
            bounce_count,
            unsubscribe_count,
            last_sent_at
          )
        `)
        .order('campaign_name');

      if (error) throw error;

      const formattedData = data.map((item: any) => ({
        id: item.id,
        campaign_name: item.campaign_name,
        subject_line: item.subject_line,
        target_segment: item.target_segment,
        sent_count: item.campaign_analytics?.[0]?.sent_count || 0,
        delivered_count: item.campaign_analytics?.[0]?.delivered_count || 0,
        open_count: item.campaign_analytics?.[0]?.open_count || 0,
        click_count: item.campaign_analytics?.[0]?.click_count || 0,
        bounce_count: item.campaign_analytics?.[0]?.bounce_count || 0,
        unsubscribe_count: item.campaign_analytics?.[0]?.unsubscribe_count || 0,
        last_sent_at: item.campaign_analytics?.[0]?.last_sent_at || null,
      }));

      setAnalytics(formattedData);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load campaign analytics');
    } finally {
      setLoading(false);
    }
  };

  const calculateRate = (numerator: number, denominator: number) => {
    if (denominator === 0) return '0.0';
    return ((numerator / denominator) * 100).toFixed(1);
  };

  const getPerformanceBadge = (rate: number) => {
    if (rate >= 25) return <Badge className="bg-green-500">Excellent</Badge>;
    if (rate >= 15) return <Badge className="bg-blue-500">Good</Badge>;
    if (rate >= 5) return <Badge className="bg-yellow-500">Average</Badge>;
    return <Badge variant="secondary">Low</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Loading campaign analytics...</div>;
  }

  const totalSent = analytics.reduce((sum, a) => sum + a.sent_count, 0);
  const totalOpens = analytics.reduce((sum, a) => sum + a.open_count, 0);
  const totalClicks = analytics.reduce((sum, a) => sum + a.click_count, 0);
  const avgOpenRate = totalSent > 0 ? ((totalOpens / totalSent) * 100).toFixed(1) : '0.0';
  const avgClickRate = totalSent > 0 ? ((totalClicks / totalSent) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Across all campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Open Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgOpenRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totalOpens.toLocaleString()} opens
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Click Rate</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgClickRate}%</div>
            <p className="text-xs text-muted-foreground">
              {totalClicks.toLocaleString()} clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.length}</div>
            <p className="text-xs text-muted-foreground">Total templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Campaign Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            Detailed metrics for each email campaign
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead className="text-right">Sent</TableHead>
                  <TableHead className="text-right">Opens</TableHead>
                  <TableHead className="text-right">Open Rate</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">Click Rate</TableHead>
                  <TableHead className="text-right">Bounces</TableHead>
                  <TableHead>Performance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                      <p>No campaign data yet</p>
                      <p className="text-sm">Send your first campaign to see analytics</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  analytics.map((campaign) => {
                    const openRate = parseFloat(calculateRate(campaign.open_count, campaign.sent_count));
                    const clickRate = parseFloat(calculateRate(campaign.click_count, campaign.sent_count));
                    
                    return (
                      <TableRow key={campaign.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{campaign.campaign_name}</div>
                            <div className="text-sm text-muted-foreground">
                              {campaign.target_segment}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {campaign.sent_count.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          {campaign.open_count.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {calculateRate(campaign.open_count, campaign.sent_count)}%
                        </TableCell>
                        <TableCell className="text-right">
                          {campaign.click_count.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {calculateRate(campaign.click_count, campaign.sent_count)}%
                        </TableCell>
                        <TableCell className="text-right">
                          {campaign.bounce_count > 0 ? (
                            <span className="text-red-500">{campaign.bounce_count}</span>
                          ) : (
                            campaign.bounce_count
                          )}
                        </TableCell>
                        <TableCell>
                          {campaign.sent_count > 0 ? getPerformanceBadge(openRate) : (
                            <Badge variant="outline">Not Sent</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
