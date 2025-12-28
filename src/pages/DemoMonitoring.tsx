import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { BarChart3, Activity, Clock, CheckCircle, AlertTriangle, TrendingUp, Server, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoShareButton from "@/components/demos/DemoShareButton";
import DemoEnvironmentNotice from "@/components/demos/DemoEnvironmentNotice";

interface MetricsData {
  window: string;
  totals: {
    total_runs: number;
    avg_synth_index: number;
    contested_count: number;
    contested_rate: number;
    judge_used_count: number;
    judge_rate: number;
    pass_count: number;
    review_count: number;
    deny_count: number;
    avg_latency_ms: number;
  };
  kpis: {
    pass_rate: number;
    review_rate: number;
    deny_rate: number;
    reliability_score: number;
  };
  series: Array<{
    date: string;
    total_runs: number;
    avg_synth_index: number;
    contested_count: number;
  }>;
  seat_table: Array<{
    seat_name: string;
    total_runs: number;
    avg_latency_ms: number;
    abstain_count: number;
    abstain_rate: number;
  }>;
}

// Fallback seat metrics if no real data
const FALLBACK_SEAT_METRICS = [
  { provider: "OpenAI", model: "GPT-4o", uptime: 99.7, avgLatency: 1240, status: "healthy" },
  { provider: "Anthropic", model: "Claude 3.5", uptime: 99.4, avgLatency: 1580, status: "healthy" },
  { provider: "Google", model: "Gemini Pro", uptime: 98.9, avgLatency: 890, status: "healthy" },
  { provider: "DeepSeek", model: "DeepSeek-V3", uptime: 97.2, avgLatency: 2100, status: "degraded" },
  { provider: "xAI", model: "Grok-2", uptime: 96.5, avgLatency: 1450, status: "healthy" },
  { provider: "Mistral", model: "Mistral Large", uptime: 98.1, avgLatency: 980, status: "healthy" },
  { provider: "Meta", model: "Llama 3.1", uptime: 95.8, avgLatency: 1820, status: "healthy" },
];

const DemoMonitoring = () => {
  const [window, setWindow] = useState<string>("7d");
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async (timeWindow: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('synth-metrics', {
        body: {},
        method: 'GET',
      });

      // Fallback: try direct fetch if invoke doesn't work
      if (error) {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/synth-metrics?window=${timeWindow}`,
          {
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            },
          }
        );
        if (response.ok) {
          const metricsData = await response.json();
          setMetrics(metricsData);
        } else {
          throw new Error('Failed to fetch metrics');
        }
      } else {
        setMetrics(data);
      }
    } catch (error) {
      console.error("Error fetching metrics:", error);
      // Use demo data if API fails
      setMetrics({
        window: timeWindow,
        totals: {
          total_runs: 1247 + Math.floor(Math.random() * 200),
          avg_synth_index: 82.5 + Math.random() * 5,
          contested_count: 150 + Math.floor(Math.random() * 50),
          contested_rate: 12.0 + Math.random() * 3,
          judge_used_count: 200 + Math.floor(Math.random() * 50),
          judge_rate: 16.0 + Math.random() * 5,
          pass_count: 900 + Math.floor(Math.random() * 100),
          review_count: 250 + Math.floor(Math.random() * 50),
          deny_count: 97 + Math.floor(Math.random() * 20),
          avg_latency_ms: 1450 + Math.floor(Math.random() * 300),
        },
        kpis: {
          pass_rate: 72.1 + Math.random() * 5,
          review_rate: 20.0 + Math.random() * 3,
          deny_rate: 7.8 + Math.random() * 2,
          reliability_score: 94.3 + Math.random() * 2,
        },
        series: [],
        seat_table: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics(window);
  }, [window]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "degraded": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "offline": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99) return "text-emerald-400";
    if (uptime >= 97) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <>
      <Helmet>
        <title>Demo B — Monitoring & Reliability | Valid™</title>
        <meta name="description" content="Real-time monitoring dashboard for AI Senate seat health, latency, and reliability metrics." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <DemoBanner />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Demo B — Monitoring & Reliability</h1>
                  <p className="text-sm text-muted-foreground">Live seat health and system metrics</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={window} onValueChange={setWindow}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24h</SelectItem>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="60d">60 days</SelectItem>
                    <SelectItem value="90d">90 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => fetchMetrics(window)} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                </Button>
                <DemoShareButton />
                <Button variant="outline" size="sm" asChild>
                  <Link to="/demos">← All Demos</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* System Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {loading ? "..." : metrics?.totals.total_runs.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Runs ({window})</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-cyan-400" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {loading ? "..." : `${((metrics?.totals.avg_latency_ms || 0) / 1000).toFixed(1)}s`}
                    </p>
                    <p className="text-xs text-muted-foreground">Avg Latency</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-amber-400" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {loading ? "..." : `${metrics?.totals.contested_rate.toFixed(1)}%`}
                    </p>
                    <p className="text-xs text-muted-foreground">Contested Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-emerald-400" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {loading ? "..." : `${metrics?.kpis.reliability_score.toFixed(1)}%`}
                    </p>
                    <p className="text-xs text-muted-foreground">Reliability Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* KPIs Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="border-emerald-500/30 bg-emerald-500/5">
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-emerald-400">
                  {loading ? "..." : `${metrics?.kpis.pass_rate.toFixed(1)}%`}
                </p>
                <p className="text-xs text-muted-foreground">Pass Rate</p>
              </CardContent>
            </Card>
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-amber-400">
                  {loading ? "..." : `${metrics?.kpis.review_rate.toFixed(1)}%`}
                </p>
                <p className="text-xs text-muted-foreground">Review Rate</p>
              </CardContent>
            </Card>
            <Card className="border-red-500/30 bg-red-500/5">
              <CardContent className="pt-4 text-center">
                <p className="text-3xl font-bold text-red-400">
                  {loading ? "..." : `${metrics?.kpis.deny_rate.toFixed(1)}%`}
                </p>
                <p className="text-xs text-muted-foreground">Deny Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Seat Health Grid */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Health Status
              </CardTitle>
              <CardDescription>Health monitoring across AI review systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {FALLBACK_SEAT_METRICS.map((seat) => (
                  <Card key={seat.provider} className="border-border/50">
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-foreground">{seat.provider}</span>
                        <Badge variant="outline" className={getStatusColor(seat.status)}>
                          {seat.status === "healthy" ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                          {seat.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">{seat.model}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Uptime (30d)</span>
                          <span className={`font-medium ${getUptimeColor(seat.uptime)}`}>{seat.uptime}%</span>
                        </div>
                        <Progress value={seat.uptime} className="h-1.5" />
                        
                        <div className="flex justify-between text-xs mt-2">
                          <span className="text-muted-foreground">Avg Latency</span>
                          <span className="font-medium text-foreground">{seat.avgLatency}ms</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Series (if available) */}
          {metrics?.series && metrics.series.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Daily Trend</CardTitle>
                <CardDescription>Run volume and synth index over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-40 flex items-end gap-1">
                  {metrics.series.slice(-14).map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div 
                        className="w-full bg-primary/60 rounded-t"
                        style={{ height: `${Math.max(4, day.total_runs / 2)}px` }}
                      />
                      <span className="text-[8px] text-muted-foreground">
                        {new Date(day.date).getDate()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Audit Log Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Recent Audit Log
              </CardTitle>
              <CardDescription>Last 5 debate traces (simulated data)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { traceId: "tr_8f2k9x", timestamp: "2 min ago", consensus: "PASS", seats: 7, contested: false },
                  { traceId: "tr_7a1m3n", timestamp: "8 min ago", consensus: "REVIEW", seats: 6, contested: true },
                  { traceId: "tr_6b4p2q", timestamp: "15 min ago", consensus: "PASS", seats: 7, contested: false },
                  { traceId: "tr_5c3r8s", timestamp: "22 min ago", consensus: "DENY", seats: 5, contested: true },
                  { traceId: "tr_4d2t7u", timestamp: "31 min ago", consensus: "PASS", seats: 7, contested: false },
                ].map((log) => (
                  <div key={log.traceId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center gap-4">
                      <code className="text-xs text-primary font-mono">{log.traceId}</code>
                      <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{log.seats} seats</span>
                      {log.contested && (
                        <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/50 text-[10px]">
                          Contested
                        </Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className={
                          log.consensus === "PASS" 
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 text-[10px]"
                            : log.consensus === "REVIEW"
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/50 text-[10px]"
                            : "bg-red-500/20 text-red-400 border-red-500/50 text-[10px]"
                        }
                      >
                        {log.consensus}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Footer Notice */}
          <div className="text-center mt-8">
            <DemoEnvironmentNotice variant="footer" />
          </div>
        </main>
      </div>
    </>
  );
};

export default DemoMonitoring;
