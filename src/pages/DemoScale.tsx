import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { 
  Scale, Play, Pause, RotateCcw, Activity, Gauge, Clock, 
  CheckCircle2, XCircle, AlertTriangle, ArrowRight, Server,
  Shield, Zap, BarChart3, FileText, Copy, Check, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import DemoEnvironmentNotice from "@/components/demos/DemoEnvironmentNotice";
import { 
  runGovernance,
  type Verdict,
  type Grade
} from "@/lib/demoGovernanceEngine";

interface Decision {
  id: string;
  requestId: string;
  grade: Grade;
  verdict: Verdict;
  reason: string;
  proofId: string;
  timestamp: Date;
  latencyMs: number;
}

const DemoScale = () => {
  const navigate = useNavigate();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);
  
  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [rate, setRate] = useState<"low" | "med" | "high">("med");
  const [mode, setMode] = useState<"stream" | "batch">("stream");
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  
  // Metrics
  const [metrics, setMetrics] = useState({
    throughput: 0,
    queueDepth: 0,
    p50Latency: 0,
    p95Latency: 0,
    errorRate: 0,
    certifiedRate: 0,
    totalProcessed: 0,
    uptime: 99.97,
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const counterRef = useRef(0);

  const rateValues = { low: 25, med: 75, high: 150 };

  const generateDecision = async (): Promise<Decision> => {
    counterRef.current++;
    const requestId = `req_${counterRef.current.toString(36).padStart(6, '0')}`;
    const latencyMs = 50 + Math.floor(Math.random() * 150);
    
    const result = await runGovernance(1, "conduit", "generic", requestId + Date.now());

    return {
      id: `dec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      requestId,
      grade: result.grade,
      verdict: result.verdict,
      reason: result.reasons[0] || "Processing complete",
      proofId: result.proof_record.proof_id,
      timestamp: new Date(),
      latencyMs,
    };
  };

  const startSimulation = () => {
    setIsRunning(true);
    const eventsPerSec = rateValues[rate];
    const interval = mode === "batch" ? 1000 : Math.max(50, 1000 / eventsPerSec);

    intervalRef.current = setInterval(async () => {
      const batchSize = mode === "batch" ? Math.ceil(eventsPerSec / 10) : 1;
      const newDecisions: Decision[] = [];
      
      for (let i = 0; i < batchSize; i++) {
        const decision = await generateDecision();
        newDecisions.push(decision);
      }

      setDecisions(prev => [...newDecisions, ...prev].slice(0, 100));
      
      setMetrics(prev => {
        const totalProcessed = prev.totalProcessed + batchSize;
        const certified = newDecisions.filter(d => d.verdict === "CERTIFIED").length;
        const latencies = newDecisions.map(d => d.latencyMs).sort((a, b) => a - b);
        
        return {
          throughput: eventsPerSec,
          queueDepth: Math.floor(Math.random() * 50) + (rate === "high" ? 30 : 0),
          p50Latency: latencies[Math.floor(latencies.length * 0.5)] || prev.p50Latency,
          p95Latency: latencies[Math.floor(latencies.length * 0.95)] || prev.p95Latency,
          errorRate: Math.random() * 0.5,
          certifiedRate: ((prev.certifiedRate * prev.totalProcessed) + (certified / batchSize * 100)) / (prev.totalProcessed + 1),
          totalProcessed,
          uptime: 99.97 - (Math.random() * 0.02),
        };
      });
    }, interval);
  };

  const stopSimulation = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    setDecisions([]);
    counterRef.current = 0;
    setSelectedDecision(null);
    setMetrics({
      throughput: 0,
      queueDepth: 0,
      p50Latency: 0,
      p95Latency: 0,
      errorRate: 0,
      certifiedRate: 0,
      totalProcessed: 0,
      uptime: 99.97,
    });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      stopSimulation();
      startSimulation();
    }
  }, [rate, mode]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/scale`);
      setCopiedItem("link");
      toast.success("Link copied!");
      setTimeout(() => setCopiedItem(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const getGradeIcon = (grade: Grade) => {
    switch (grade) {
      case "green": return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "yellow": return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "red": return <XCircle className="h-4 w-4 text-red-400" />;
    }
  };

  const getGradeColor = (grade: Grade) => {
    switch (grade) {
      case "green": return "text-emerald-400";
      case "yellow": return "text-amber-400";
      case "red": return "text-red-400";
    }
  };

  return (
    <>
      <Helmet>
        <title>Scale & Monitoring | Valid™ SYNTH Demo</title>
        <meta name="description" content="High-volume event processing with governed decisions and real-time monitoring." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <Scale className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Scale & Monitoring</h1>
                  <p className="text-xs text-muted-foreground">Demo Mode</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyLink}>
                  {copiedItem === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">← Hub</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 max-w-6xl">
          {/* Architecture Diagram */}
          <Card className="mb-6 border-cyan-500/30 bg-cyan-500/5">
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border">
                  <Server className="h-4 w-4 text-blue-400" />
                  <span>Customer System</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary">Valid/SYNTH</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Verdict + Proof</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Simulation Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Rate */}
                <div className="space-y-2">
                  <Label>Rate</Label>
                  <Tabs value={rate} onValueChange={(v) => setRate(v as typeof rate)}>
                    <TabsList className="w-full">
                      <TabsTrigger value="low" className="flex-1">Low</TabsTrigger>
                      <TabsTrigger value="med" className="flex-1">Med</TabsTrigger>
                      <TabsTrigger value="high" className="flex-1">High</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Mode */}
                <div className="space-y-2">
                  <Label>Mode</Label>
                  <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
                    <TabsList className="w-full">
                      <TabsTrigger value="stream" className="flex-1">Stream</TabsTrigger>
                      <TabsTrigger value="batch" className="flex-1">Batch</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Placeholder */}
                <div />

                {/* Controls */}
                <div className="flex gap-2 items-end">
                  <Button
                    onClick={isRunning ? stopSimulation : startSimulation}
                    className={`flex-1 ${isRunning ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
                  >
                    {isRunning ? (
                      <><Pause className="h-4 w-4 mr-2" /> Pause</>
                    ) : (
                      <><Play className="h-4 w-4 mr-2" /> Start</>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetSimulation}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Card className="border-primary/30">
              <CardContent className="pt-4 pb-4 text-center">
                <Gauge className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold text-primary">{metrics.throughput}</p>
                <p className="text-xs text-muted-foreground">events/sec</p>
              </CardContent>
            </Card>
            <Card className="border-amber-500/30">
              <CardContent className="pt-4 pb-4 text-center">
                <Activity className="h-5 w-5 mx-auto mb-1 text-amber-400" />
                <p className="text-2xl font-bold text-amber-400">{metrics.queueDepth}</p>
                <p className="text-xs text-muted-foreground">queue depth</p>
              </CardContent>
            </Card>
            <Card className="border-cyan-500/30">
              <CardContent className="pt-4 pb-4 text-center">
                <Clock className="h-5 w-5 mx-auto mb-1 text-cyan-400" />
                <p className="text-2xl font-bold text-cyan-400">
                  {metrics.p50Latency}<span className="text-sm text-muted-foreground">/{metrics.p95Latency}</span>
                </p>
                <p className="text-xs text-muted-foreground">p50/p95 ms</p>
              </CardContent>
            </Card>
            <Card className="border-emerald-500/30">
              <CardContent className="pt-4 pb-4 text-center">
                <BarChart3 className="h-5 w-5 mx-auto mb-1 text-emerald-400" />
                <p className="text-2xl font-bold text-emerald-400">{metrics.uptime.toFixed(2)}%</p>
                <p className="text-xs text-muted-foreground">uptime</p>
              </CardContent>
            </Card>
          </div>

          {/* Rolling Decisions + Detail View */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Decisions List */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" />
                  Rolling Decisions
                  <Badge variant="outline" className="ml-2">{metrics.totalProcessed.toLocaleString()}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px]">
                  {decisions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Start simulation to see decisions</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {decisions.map((decision) => (
                        <div
                          key={decision.id}
                          onClick={() => setSelectedDecision(decision)}
                          className={`flex items-center gap-3 p-3 rounded-lg text-sm cursor-pointer transition-colors ${
                            selectedDecision?.id === decision.id 
                              ? "bg-primary/10 border border-primary/30" 
                              : "bg-muted/50 hover:bg-muted"
                          }`}
                        >
                          {getGradeIcon(decision.grade)}
                          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Request</p>
                              <p className="font-mono text-xs">{decision.requestId}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Verdict</p>
                              <p className={`font-medium ${getGradeColor(decision.grade)}`}>
                                {decision.verdict}
                              </p>
                            </div>
                            <div className="hidden md:block">
                              <p className="text-xs text-muted-foreground">Latency</p>
                              <p className="text-xs">{decision.latencyMs}ms</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Trace Detail */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Trace Detail</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDecision ? (
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Request ID</p>
                      <p className="font-mono">{selectedDecision.requestId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Verdict</p>
                      <Badge variant="outline" className={
                        selectedDecision.grade === "green" ? "border-emerald-500/50 text-emerald-400" :
                        selectedDecision.grade === "yellow" ? "border-amber-500/50 text-amber-400" :
                        "border-red-500/50 text-red-400"
                      }>
                        {selectedDecision.verdict}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Reason</p>
                      <p className="text-foreground">{selectedDecision.reason}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Proof ID</p>
                      <p className="font-mono text-xs">{selectedDecision.proofId}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Latency</p>
                      <p>{selectedDecision.latencyMs}ms</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Timestamp</p>
                      <p>{selectedDecision.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Click a decision to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Notice */}
          <DemoEnvironmentNotice variant="banner" />

          {/* Next Steps */}
          <Card className="mt-6 border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-4">Next Steps</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button 
                  onClick={() => navigate("/start-pilot")}
                  className="bg-gradient-to-r from-primary to-cyan-500"
                >
                  Start Pilot (Paid)
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.open("https://calendly.com/steve-bevalid/30min", "_blank")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book a Call
                </Button>
                <Button variant="outline">
                  Request Security Packet
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default DemoScale;
