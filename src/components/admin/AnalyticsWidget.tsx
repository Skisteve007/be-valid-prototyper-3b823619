import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Clock, TrendingUp, TrendingDown, Activity, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TurnaroundData {
  date: string;
  hours: number;
  count: number;
}

export const AnalyticsWidget = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<TurnaroundData[]>([]);
  const [stats, setStats] = useState({
    avgTurnaround: 0,
    fastestTurnaround: 0,
    slowestTurnaround: 0,
    totalProcessed: 0,
    trend: 0
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data: orders, error } = await supabase
        .from("lab_orders")
        .select("created_at, updated_at, order_status")
        .eq("order_status", "result_received")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      if (orders && orders.length > 0) {
        // Calculate turnaround times
        const turnarounds = orders.map(order => {
          const created = new Date(order.created_at).getTime();
          const updated = new Date(order.updated_at).getTime();
          const hours = (updated - created) / (1000 * 60 * 60);
          return {
            date: order.created_at.split('T')[0],
            hours: Math.round(hours * 10) / 10
          };
        });

        // Group by date for chart
        const groupedData: Record<string, { total: number; count: number }> = {};
        turnarounds.forEach(t => {
          if (!groupedData[t.date]) {
            groupedData[t.date] = { total: 0, count: 0 };
          }
          groupedData[t.date].total += t.hours;
          groupedData[t.date].count += 1;
        });

        const chartData = Object.entries(groupedData)
          .map(([date, data]) => ({
            date,
            hours: Math.round((data.total / data.count) * 10) / 10,
            count: data.count
          }))
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-14); // Last 14 days

        setChartData(chartData);

        // Calculate stats
        const allHours = turnarounds.map(t => t.hours);
        const avg = allHours.reduce((a, b) => a + b, 0) / allHours.length;
        const fastest = Math.min(...allHours);
        const slowest = Math.max(...allHours);

        // Calculate trend (comparing first half vs second half)
        const midPoint = Math.floor(allHours.length / 2);
        const firstHalf = allHours.slice(0, midPoint).reduce((a, b) => a + b, 0) / midPoint;
        const secondHalf = allHours.slice(midPoint).reduce((a, b) => a + b, 0) / (allHours.length - midPoint);
        const trend = ((secondHalf - firstHalf) / firstHalf) * 100;

        setStats({
          avgTurnaround: Math.round(avg * 10) / 10,
          fastestTurnaround: Math.round(fastest * 10) / 10,
          slowestTurnaround: Math.round(slowest * 10) / 10,
          totalProcessed: orders.length,
          trend: Math.round(trend * 10) / 10
        });
      }
    } catch (error: any) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              Avg Turnaround
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgTurnaround}h</div>
            <div className="flex items-center gap-1 mt-1">
              {stats.trend < 0 ? (
                <>
                  <TrendingDown className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-500">{Math.abs(stats.trend)}% faster</span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-3 w-3 text-red-500" />
                  <span className="text-xs text-red-500">{stats.trend}% slower</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-green-500" />
              Fastest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.fastestTurnaround}h</div>
            <p className="text-xs text-muted-foreground">Best performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-yellow-500" />
              Slowest
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.slowestTurnaround}h</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              Total Processed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProcessed}</div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>
      </div>

      {/* Turnaround Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Turnaround Time Trend (Last 14 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                formatter={(value: any) => [`${value} hours`, 'Avg Turnaround']}
              />
              <Line 
                type="monotone" 
                dataKey="hours" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Volume Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Processing Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                formatter={(value: any) => [`${value} orders`, 'Processed']}
              />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Badge */}
      <Card className="border-2 border-blue-500/20 bg-blue-500/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-lg">Lab Performance Rating</h4>
              <p className="text-sm text-muted-foreground">Based on turnaround efficiency</p>
            </div>
            <div>
              {stats.avgTurnaround < 24 ? (
                <Badge className="bg-green-600 text-lg px-4 py-2">Excellent</Badge>
              ) : stats.avgTurnaround < 48 ? (
                <Badge className="bg-blue-600 text-lg px-4 py-2">Good</Badge>
              ) : (
                <Badge className="bg-yellow-600 text-lg px-4 py-2">Needs Improvement</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};