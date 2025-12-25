import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { BarChart3, Activity, Clock, CheckCircle, AlertTriangle, TrendingUp, Server, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoShareButton from "@/components/demos/DemoShareButton";

// Simulated metrics for demo
const SEAT_METRICS = [
  { provider: "OpenAI", model: "GPT-4o", uptime: 99.7, avgLatency: 1240, lastCheck: "2 min ago", status: "healthy" },
  { provider: "Anthropic", model: "Claude 3.5", uptime: 99.4, avgLatency: 1580, lastCheck: "2 min ago", status: "healthy" },
  { provider: "Google", model: "Gemini Pro", uptime: 98.9, avgLatency: 890, lastCheck: "2 min ago", status: "healthy" },
  { provider: "DeepSeek", model: "DeepSeek-V3", uptime: 97.2, avgLatency: 2100, lastCheck: "2 min ago", status: "degraded" },
  { provider: "xAI", model: "Grok-2", uptime: 96.5, avgLatency: 1450, lastCheck: "2 min ago", status: "healthy" },
  { provider: "Mistral", model: "Mistral Large", uptime: 98.1, avgLatency: 980, lastCheck: "2 min ago", status: "healthy" },
  { provider: "Meta", model: "Llama 3.1", uptime: 95.8, avgLatency: 1820, lastCheck: "5 min ago", status: "healthy" },
];

const SYSTEM_STATS = {
  totalDebates: 1247,
  avgConsensusTime: "4.2s",
  contestedRate: "12%",
  judgeAccuracy: "94.3%",
};

const DemoMonitoring = () => {
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
                    <p className="text-2xl font-bold text-foreground">{SYSTEM_STATS.totalDebates}</p>
                    <p className="text-xs text-muted-foreground">Total Debates (24h)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-cyan-400" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{SYSTEM_STATS.avgConsensusTime}</p>
                    <p className="text-xs text-muted-foreground">Avg Consensus Time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-amber-400" />
                  <div>
                    <p className="text-2xl font-bold text-foreground">{SYSTEM_STATS.contestedRate}</p>
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
                    <p className="text-2xl font-bold text-foreground">{SYSTEM_STATS.judgeAccuracy}</p>
                    <p className="text-xs text-muted-foreground">Judge Accuracy</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Seat Health Grid */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Seat Health Status
              </CardTitle>
              <CardDescription>Real-time health monitoring for all AI Senate seats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {SEAT_METRICS.map((seat) => (
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
                        
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Last Check</span>
                          <span className="text-muted-foreground">{seat.lastCheck}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

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
                  { traceId: "tr_8f2k9x", timestamp: "2 min ago", consensus: "APPROVE", seats: 7, contested: false },
                  { traceId: "tr_7a1m3n", timestamp: "8 min ago", consensus: "REVISE", seats: 6, contested: true },
                  { traceId: "tr_6b4p2q", timestamp: "15 min ago", consensus: "APPROVE", seats: 7, contested: false },
                  { traceId: "tr_5c3r8s", timestamp: "22 min ago", consensus: "BLOCK", seats: 5, contested: true },
                  { traceId: "tr_4d2t7u", timestamp: "31 min ago", consensus: "APPROVE", seats: 7, contested: false },
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
                          log.consensus === "APPROVE" 
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 text-[10px]"
                            : log.consensus === "REVISE"
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
        </main>
      </div>
    </>
  );
};

export default DemoMonitoring;
