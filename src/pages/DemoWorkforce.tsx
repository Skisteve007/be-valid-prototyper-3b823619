import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { 
  UserCheck, Play, Clock, Shield, AlertTriangle, CheckCircle2, 
  XCircle, TrendingUp, FileCheck, ArrowRight, RotateCcw, Copy, Check, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import DemoEnvironmentNotice from "@/components/demos/DemoEnvironmentNotice";

interface ScenarioResult {
  scenarioName: string;
  scores: {
    verificationBehavior: number;
    pushbackDiscipline: number;
    riskHandling: number;
    consistencyOverTime: number[];
  };
  certification: "PASS" | "REVIEW" | "FAIL";
  proofRecordIds: string[];
  notableEvents: string[];
}

const scenarios = [
  {
    id: "policy",
    name: "Policy Compliance",
    description: "Test operator response to policy edge cases",
  },
  {
    id: "high-risk",
    name: "High-Risk Decision",
    description: "Evaluate decision-making under pressure",
  },
  {
    id: "conflicting",
    name: "Conflicting Inputs",
    description: "Assess handling of contradictory data",
  },
];

const generateProofId = () => {
  return `prf_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
};

const simulateScenario = (scenarioId: string, windowDays: number): ScenarioResult => {
  const scenarioNames: Record<string, string> = {
    policy: "Policy Compliance Scenario",
    "high-risk": "High-Risk Decision Scenario",
    conflicting: "Conflicting Inputs Scenario",
  };

  const verificationBehavior = 70 + Math.floor(Math.random() * 25);
  const pushbackDiscipline = 65 + Math.floor(Math.random() * 30);
  const riskHandling = 60 + Math.floor(Math.random() * 35);
  const dataPoints = windowDays === 7 ? 7 : windowDays === 30 ? 15 : windowDays === 60 ? 20 : 25;
  const consistencyOverTime = Array.from({ length: dataPoints }, () => 60 + Math.floor(Math.random() * 35));

  const avgScore = (verificationBehavior + pushbackDiscipline + riskHandling) / 3;
  let certification: "PASS" | "REVIEW" | "FAIL";
  if (avgScore >= 80) certification = "PASS";
  else if (avgScore >= 60) certification = "REVIEW";
  else certification = "FAIL";

  const allEvents = [
    "Operator requested secondary verification before proceeding",
    "Correctly identified conflicting data sources",
    "Escalated high-risk decision to supervisor",
    "Applied policy override with documented justification",
    "Pushed back on incomplete verification request",
    "Flagged potential compliance issue for review",
  ];

  return {
    scenarioName: scenarioNames[scenarioId],
    scores: {
      verificationBehavior,
      pushbackDiscipline,
      riskHandling,
      consistencyOverTime,
    },
    certification,
    proofRecordIds: [generateProofId(), generateProofId(), generateProofId()],
    notableEvents: allEvents.sort(() => Math.random() - 0.5).slice(0, 3),
  };
};

const DemoWorkforce = () => {
  const navigate = useNavigate();
  const [evaluationWindow, setEvaluationWindow] = useState("30");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const runScenario = async (scenarioId: string) => {
    setIsRunning(true);
    setResult(null);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const scenarioResult = simulateScenario(scenarioId, parseInt(evaluationWindow));
    setResult(scenarioResult);
    setIsRunning(false);
  };

  const reset = () => {
    setResult(null);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/workforce`);
      setCopiedItem("link");
      toast.success("Link copied!");
      setTimeout(() => setCopiedItem(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const getCertificationColor = (cert: string) => {
    switch (cert) {
      case "PASS": return "text-emerald-400 border-emerald-500/50 bg-emerald-500/10";
      case "REVIEW": return "text-amber-400 border-amber-500/50 bg-amber-500/10";
      case "FAIL": return "text-red-400 border-red-500/50 bg-red-500/10";
      default: return "";
    }
  };

  const getCertificationIcon = (cert: string) => {
    switch (cert) {
      case "PASS": return <CheckCircle2 className="h-6 w-6 text-emerald-400" />;
      case "REVIEW": return <AlertTriangle className="h-6 w-6 text-amber-400" />;
      case "FAIL": return <XCircle className="h-6 w-6 text-red-400" />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-red-400";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <>
      <Helmet>
        <title>Operator Certification | Valid™ SYNTH Demo</title>
        <meta name="description" content="Measure and certify how operators use AI over time. Multi-turn scenario evaluation with proof records." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <UserCheck className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Operator Certification</h1>
                  <p className="text-xs text-muted-foreground">Workforce AI Governance</p>
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

        <main className="container mx-auto px-4 py-6 max-w-5xl">
          {/* Explainer */}
          <Card className="mb-6 border-purple-500/30 bg-purple-500/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Shield className="h-8 w-8 text-purple-400 shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    Measure How Operators Use AI—Not Just What AI Says
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    SYNTH tracks verification discipline, pushback behavior, and risk handling over time.
                    Generate certification reports with verifiable proof records for compliance and training.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Evaluation Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Evaluation Window</label>
                  <Select value={evaluationWindow} onValueChange={setEvaluationWindow}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Launcher */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-primary" />
                Launch Scenario
              </CardTitle>
              <CardDescription>Select a multi-turn scenario to evaluate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scenarios.map((scenario) => (
                  <Button
                    key={scenario.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start text-left hover:border-purple-500/50"
                    onClick={() => runScenario(scenario.id)}
                    disabled={isRunning}
                  >
                    <span className="font-semibold text-foreground mb-1">{scenario.name}</span>
                    <span className="text-xs text-muted-foreground">{scenario.description}</span>
                  </Button>
                ))}
              </div>

              {isRunning && (
                <div className="mt-6 flex items-center justify-center gap-3 p-6 rounded-lg bg-muted/30 border">
                  <div className="animate-spin h-5 w-5 border-2 border-purple-400 border-t-transparent rounded-full" />
                  <span className="text-muted-foreground">Running scenario simulation...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Scorecard: {result.scenarioName}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={reset}>
                      <RotateCcw className="h-4 w-4 mr-1" /> Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Scores */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {[
                        { label: "Verification Behavior", value: result.scores.verificationBehavior },
                        { label: "Pushback Discipline", value: result.scores.pushbackDiscipline },
                        { label: "Risk Handling", value: result.scores.riskHandling },
                      ].map((score) => (
                        <div key={score.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{score.label}</span>
                            <span className={getScoreColor(score.value)}>{score.value}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getProgressColor(score.value)} transition-all`}
                              style={{ width: `${score.value}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Trend Chart */}
                    <div className="p-4 rounded-lg bg-muted/30 border">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Consistency Over Time</span>
                      </div>
                      <div className="flex items-end gap-1 h-20">
                        {result.scores.consistencyOverTime.map((score, i) => (
                          <div
                            key={i}
                            className={`flex-1 ${getProgressColor(score)} rounded-t`}
                            style={{ height: `${score}%` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Certification Badge */}
                  <div className={`p-4 rounded-lg border flex items-center justify-between ${getCertificationColor(result.certification)}`}>
                    <div className="flex items-center gap-3">
                      {getCertificationIcon(result.certification)}
                      <div>
                        <p className="text-sm text-muted-foreground">Certification Result</p>
                        <p className="text-2xl font-bold">{result.certification}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{evaluationWindow}-day window</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Report */}
              <Card className="mb-6 border-cyan-500/20 bg-cyan-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-cyan-400" />
                    Certification Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Proof Record IDs</p>
                    <div className="space-y-1">
                      {result.proofRecordIds.map((id) => (
                        <code key={id} className="block text-xs font-mono text-foreground bg-muted/50 px-2 py-1 rounded">
                          {id}
                        </code>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Notable Events</p>
                    <ul className="space-y-1">
                      {result.notableEvents.map((event, i) => (
                        <li key={i} className="text-sm text-foreground flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                          {event}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notice */}
          <DemoEnvironmentNotice variant="banner" />

          {/* CTAs */}
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

export default DemoWorkforce;
