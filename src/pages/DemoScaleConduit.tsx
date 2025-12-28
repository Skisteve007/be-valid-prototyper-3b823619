import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Gauge, 
  ArrowLeft, 
  ArrowRight,
  Activity,
  Zap,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Server,
  Shield
} from "lucide-react";

type Decision = {
  id: string;
  requestId: string;
  grade: "GREEN" | "YELLOW" | "RED";
  verdict: "CERTIFIED" | "MISTRIAL" | "MANUAL_REVIEW";
  reason: string;
  proofId: string;
  timestamp: Date;
};

const reasons = [
  "All consensus checks passed",
  "Policy compliance verified",
  "Multi-model agreement confirmed",
  "Contradiction check cleared",
  "Source validation successful",
  "Minor inconsistency detected",
  "Confidence threshold not met",
  "Policy violation flagged",
  "Model disagreement detected",
  "Source validation failed",
];

const DemoScaleConduit = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [eventsPerSec, setEventsPerSec] = useState([50]);
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [isActiveVeto, setIsActiveVeto] = useState(true);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [metrics, setMetrics] = useState({
    throughput: 0,
    queueDepth: 0,
    avgLatency: 0,
    certifiedRate: 0,
    totalProcessed: 0,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const generateDecision = (): Decision => {
    const rand = Math.random();
    let grade: "GREEN" | "YELLOW" | "RED";
    let verdict: "CERTIFIED" | "MISTRIAL" | "MANUAL_REVIEW";
    
    if (rand > 0.15) {
      grade = "GREEN";
      verdict = "CERTIFIED";
    } else if (rand > 0.05) {
      grade = "YELLOW";
      verdict = "MANUAL_REVIEW";
    } else {
      grade = "RED";
      verdict = "MISTRIAL";
    }

    return {
      id: `dec_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      requestId: `req_${Math.random().toString(36).slice(2, 10)}`,
      grade,
      verdict,
      reason: reasons[Math.floor(Math.random() * (grade === "GREEN" ? 5 : grade === "YELLOW" ? 7 : 10))],
      proofId: `prf_${Math.random().toString(36).slice(2, 12)}`,
      timestamp: new Date(),
    };
  };

  const startSimulation = () => {
    setIsRunning(true);
    const rate = eventsPerSec[0];
    const interval = isBatchMode ? 1000 : Math.max(50, 1000 / rate);

    intervalRef.current = setInterval(() => {
      const batchSize = isBatchMode ? Math.ceil(rate / 10) : 1;
      const newDecisions: Decision[] = [];
      
      for (let i = 0; i < batchSize; i++) {
        newDecisions.push(generateDecision());
      }

      setDecisions(prev => [...newDecisions, ...prev].slice(0, 100));
      
      setMetrics(prev => {
        const totalProcessed = prev.totalProcessed + batchSize;
        const certified = newDecisions.filter(d => d.verdict === "CERTIFIED").length;
        const newCertifiedRate = ((prev.certifiedRate * prev.totalProcessed) + (certified / batchSize * 100)) / (prev.totalProcessed + 1);
        
        return {
          throughput: rate,
          queueDepth: Math.max(0, Math.floor(Math.random() * 50) + (rate > 100 ? 30 : 0)),
          avgLatency: Math.floor(50 + Math.random() * 100 + (rate > 100 ? 50 : 0)),
          certifiedRate: Math.min(100, newCertifiedRate),
          totalProcessed,
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
    setMetrics({
      throughput: 0,
      queueDepth: 0,
      avgLatency: 0,
      certifiedRate: 0,
      totalProcessed: 0,
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
  }, [eventsPerSec, isBatchMode]);

  const getGradeIcon = (grade: string) => {
    switch (grade) {
      case "GREEN": return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
      case "YELLOW": return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "RED": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "GREEN": return "text-emerald-400";
      case "YELLOW": return "text-amber-400";
      case "RED": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <>
      <Helmet>
        <title>Demo F — Enterprise Scale Conduit | Valid™</title>
        <meta name="description" content="Simulate high-volume event processing with governed decisions and proof records." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link to="/demos" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Demo Hub
              </Link>
            </Button>
            <Badge variant="outline" className="border-primary/50 text-primary">
              DEMO F — ENTERPRISE SCALE
            </Badge>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Intro */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <Gauge className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">High-Volume Processing</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Enterprise Scale Conduit</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simulate high-volume event streams with governed decisions routed back with proof records.
            </p>
          </div>

          {/* Side-by-Side Routing Diagram */}
          <Card className="mb-8 border-cyan-500/30 bg-cyan-500/5">
            <CardContent className="py-6">
              <h3 className="font-semibold text-foreground mb-4 text-center">Side-by-Side Routing</h3>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border">
                  <Server className="h-4 w-4 text-blue-400" />
                  <span>Customer System</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/30">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-medium text-primary">Valid/SYNTH</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border">
                  <Shield className="h-4 w-4 text-cyan-400" />
                  <span>Vendor Checks</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Verdict + Proof</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border">
                  <Server className="h-4 w-4 text-blue-400" />
                  <span>Back to Customer</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Simulation Controls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Events/sec slider */}
                <div className="space-y-3">
                  <Label>Events per Second: {eventsPerSec[0]}</Label>
                  <Slider
                    value={eventsPerSec}
                    onValueChange={setEventsPerSec}
                    min={10}
                    max={200}
                    step={10}
                    disabled={isRunning}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>

                {/* Batch vs Stream */}
                <div className="flex items-center justify-between space-x-4">
                  <Label htmlFor="batch-mode">Batch Mode</Label>
                  <Switch
                    id="batch-mode"
                    checked={isBatchMode}
                    onCheckedChange={setIsBatchMode}
                  />
                </div>

                {/* Shadow vs Active Veto */}
                <div className="flex items-center justify-between space-x-4">
                  <Label htmlFor="active-veto">
                    {isActiveVeto ? "Active Veto" : "Shadow Mode"}
                  </Label>
                  <Switch
                    id="active-veto"
                    checked={isActiveVeto}
                    onCheckedChange={setIsActiveVeto}
                  />
                </div>

                {/* Play/Pause/Reset */}
                <div className="flex gap-2">
                  <Button
                    onClick={isRunning ? stopSimulation : startSimulation}
                    className={isRunning ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" /> Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" /> Start
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetSimulation}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Panel */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card className="border-primary/30">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Throughput</p>
                <p className="text-2xl font-bold text-primary">{metrics.throughput}</p>
                <p className="text-xs text-muted-foreground">events/sec</p>
              </CardContent>
            </Card>
            <Card className="border-amber-500/30">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Queue Depth</p>
                <p className="text-2xl font-bold text-amber-400">{metrics.queueDepth}</p>
                <p className="text-xs text-muted-foreground">pending</p>
              </CardContent>
            </Card>
            <Card className="border-cyan-500/30">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Avg Latency</p>
                <p className="text-2xl font-bold text-cyan-400">{metrics.avgLatency}</p>
                <p className="text-xs text-muted-foreground">ms</p>
              </CardContent>
            </Card>
            <Card className="border-emerald-500/30">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Certified Rate</p>
                <p className="text-2xl font-bold text-emerald-400">{metrics.certifiedRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">passed</p>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-4 pb-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Processed</p>
                <p className="text-2xl font-bold text-foreground">{metrics.totalProcessed.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">events</p>
              </CardContent>
            </Card>
          </div>

          {/* Rolling Decisions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Rolling Decisions
                {isActiveVeto && (
                  <Badge className="ml-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    ACTIVE VETO
                  </Badge>
                )}
                {!isActiveVeto && (
                  <Badge className="ml-2 bg-muted text-muted-foreground">
                    SHADOW MODE
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {decisions.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Start the simulation to see decisions</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {decisions.map((decision) => (
                      <div
                        key={decision.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 text-sm animate-in slide-in-from-top-2 duration-200"
                      >
                        {getGradeIcon(decision.grade)}
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2">
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
                            <p className="text-xs text-muted-foreground">Reason</p>
                            <p className="text-xs truncate">{decision.reason}</p>
                          </div>
                          <div className="hidden md:block">
                            <p className="text-xs text-muted-foreground">Proof ID</p>
                            <p className="font-mono text-xs">{decision.proofId}</p>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {decision.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <FileText className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Ready to Scale?</h3>
                    <p className="text-sm text-muted-foreground">Sign the LOI and begin your 45-day proof sprint</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Link to="/demos">
                      Sign LOI / Start 45-Day Proof
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                    <Link to="/demos">Request Redline</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
};

export default DemoScaleConduit;
