import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { 
  UserCheck, Play, Clock, Shield, AlertTriangle, CheckCircle, 
  XCircle, TrendingUp, FileCheck, ArrowRight, RotateCcw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoShareButton from "@/components/demos/DemoShareButton";
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
  proofRecordId: string;
  notableEvents: string[];
}

const scenarios = [
  {
    id: "policy",
    name: "Policy Compliance Scenario",
    description: "Test operator response to policy edge cases and ambiguous instructions.",
  },
  {
    id: "high-risk",
    name: "High-Risk Decision Scenario",
    description: "Evaluate decision-making under time pressure with incomplete information.",
  },
  {
    id: "conflicting",
    name: "Conflicting Inputs Scenario",
    description: "Assess handling of contradictory data sources and verification requirements.",
  },
];

const generateProofId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "PROOF-";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const simulateScenario = (scenarioId: string): ScenarioResult => {
  const scenarioNames: Record<string, string> = {
    policy: "Policy Compliance Scenario",
    "high-risk": "High-Risk Decision Scenario",
    conflicting: "Conflicting Inputs Scenario",
  };

  const verificationBehavior = 70 + Math.floor(Math.random() * 25);
  const pushbackDiscipline = 65 + Math.floor(Math.random() * 30);
  const riskHandling = 60 + Math.floor(Math.random() * 35);
  const consistencyOverTime = Array.from({ length: 7 }, () => 60 + Math.floor(Math.random() * 35));

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
    "Verified source authenticity before accepting input",
    "Requested clarification on ambiguous policy",
  ];

  const notableEvents = allEvents
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return {
    scenarioName: scenarioNames[scenarioId],
    scores: {
      verificationBehavior,
      pushbackDiscipline,
      riskHandling,
      consistencyOverTime,
    },
    certification,
    proofRecordId: generateProofId(),
    notableEvents,
  };
};

const DemoOperatorCertification = () => {
  const [evaluationWindow, setEvaluationWindow] = useState("30");
  const [roleProfile, setRoleProfile] = useState("analyst");
  const [mode, setMode] = useState("training");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ScenarioResult | null>(null);

  const runScenario = async (scenarioId: string) => {
    setIsRunning(true);
    setResult(null);

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const scenarioResult = simulateScenario(scenarioId);
    setResult(scenarioResult);
    setIsRunning(false);
  };

  const resetDemo = () => {
    setResult(null);
  };

  const getCertificationColor = (cert: string) => {
    switch (cert) {
      case "PASS":
        return "text-emerald-400 border-emerald-500/50 bg-emerald-500/10";
      case "REVIEW":
        return "text-amber-400 border-amber-500/50 bg-amber-500/10";
      case "FAIL":
        return "text-red-400 border-red-500/50 bg-red-500/10";
      default:
        return "";
    }
  };

  const getCertificationIcon = (cert: string) => {
    switch (cert) {
      case "PASS":
        return <CheckCircle className="h-6 w-6 text-emerald-400" />;
      case "REVIEW":
        return <AlertTriangle className="h-6 w-6 text-amber-400" />;
      case "FAIL":
        return <XCircle className="h-6 w-6 text-red-400" />;
      default:
        return null;
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
        <title>Demo G — Operator Certification | Valid™</title>
        <meta name="description" content="SYNTH measures how a user uses AI—not just what the AI says. Certify operator verification discipline over time." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <DemoBanner />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <UserCheck className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Operator Certification (Demo)</h1>
                  <p className="text-sm text-muted-foreground">SYNTH measures how a user uses AI—not just what the AI says.</p>
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

        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <DemoEnvironmentNotice variant="banner" />

          {/* Controls Section */}
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Configuration</CardTitle>
              <CardDescription>Set evaluation parameters before running a scenario</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Evaluation Window */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Evaluation Window</label>
                  <Select value={evaluationWindow} onValueChange={setEvaluationWindow}>
                    <SelectTrigger>
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

                {/* Role Profile */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Role Profile</label>
                  <Select value={roleProfile} onValueChange={setRoleProfile}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analyst">Analyst</SelectItem>
                      <SelectItem value="operator">Operator</SelectItem>
                      <SelectItem value="claims">Claims Adjuster</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="generic">Generic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mode Toggle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Mode</label>
                  <Tabs value={mode} onValueChange={setMode} className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="training" className="flex-1">Training</TabsTrigger>
                      <TabsTrigger value="compliance" className="flex-1">Compliance</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {mode === "training" ? "Training Mode:" : "Compliance Mode:"}
                  </span>{" "}
                  {mode === "training"
                    ? "Provides coaching feedback and improvement suggestions after each scenario."
                    : "Enforces pass/fail thresholds with formal certification records."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Launcher */}
          <Card className="mb-6 border-purple-500/20 bg-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5 text-purple-400" />
                Launch Scenario
              </CardTitle>
              <CardDescription>Select a scenario to run a demo-safe multi-turn interaction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {scenarios.map((scenario) => (
                  <Button
                    key={scenario.id}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start text-left hover:border-purple-500/50 hover:bg-purple-500/5"
                    onClick={() => runScenario(scenario.id)}
                    disabled={isRunning}
                  >
                    <span className="font-semibold text-foreground mb-1">{scenario.name}</span>
                    <span className="text-xs text-muted-foreground">{scenario.description}</span>
                  </Button>
                ))}
              </div>

              {isRunning && (
                <div className="mt-6 flex items-center justify-center gap-3 p-6 rounded-lg bg-muted/30 border border-border/30">
                  <div className="animate-spin h-5 w-5 border-2 border-purple-400 border-t-transparent rounded-full" />
                  <span className="text-muted-foreground">Running scenario simulation...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scorecard Output */}
          {result && (
            <>
              <Card className="mb-6 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Scorecard: {result.scenarioName}
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={resetDemo}>
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Reset
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Score Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Verification Behavior</span>
                          <span className={getScoreColor(result.scores.verificationBehavior)}>
                            {result.scores.verificationBehavior}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(result.scores.verificationBehavior)} transition-all`}
                            style={{ width: `${result.scores.verificationBehavior}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Pushback Discipline</span>
                          <span className={getScoreColor(result.scores.pushbackDiscipline)}>
                            {result.scores.pushbackDiscipline}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(result.scores.pushbackDiscipline)} transition-all`}
                            style={{ width: `${result.scores.pushbackDiscipline}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Risk Handling</span>
                          <span className={getScoreColor(result.scores.riskHandling)}>
                            {result.scores.riskHandling}%
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(result.scores.riskHandling)} transition-all`}
                            style={{ width: `${result.scores.riskHandling}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Consistency Trend */}
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-foreground">Consistency Over Time</span>
                      </div>
                      <div className="flex items-end gap-1 h-16">
                        {result.scores.consistencyOverTime.map((score, i) => (
                          <div
                            key={i}
                            className={`flex-1 ${getProgressColor(score)} rounded-t transition-all`}
                            style={{ height: `${score}%` }}
                            title={`Day ${i + 1}: ${score}%`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Day 1</span>
                        <span>Day 7</span>
                      </div>
                    </div>
                  </div>

                  {/* Overall Certification */}
                  <div className={`p-4 rounded-lg border flex items-center justify-between ${getCertificationColor(result.certification)}`}>
                    <div className="flex items-center gap-3">
                      {getCertificationIcon(result.certification)}
                      <div>
                        <p className="text-sm text-muted-foreground">Overall Certification</p>
                        <p className="text-xl font-bold">{result.certification}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {evaluationWindow}-day window
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Report Preview */}
              <Card className="mb-6 border-cyan-500/20 bg-cyan-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-cyan-400" />
                    Certification Report (Preview)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground">Window</p>
                      <p className="font-semibold text-foreground">{evaluationWindow} days</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="font-semibold text-foreground capitalize">{roleProfile}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground">Mode</p>
                      <p className="font-semibold text-foreground capitalize">{mode}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                      <p className="text-xs text-muted-foreground">Avg Score</p>
                      <p className="font-semibold text-foreground">
                        {Math.round(
                          (result.scores.verificationBehavior +
                            result.scores.pushbackDiscipline +
                            result.scores.riskHandling) /
                            3
                        )}%
                      </p>
                    </div>
                  </div>

                  {/* Notable Events */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Notable Events (3)</p>
                    <ul className="space-y-2">
                      {result.notableEvents.map((event, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          {event}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Proof Record */}
                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Proof Record ID</p>
                        <p className="font-mono font-semibold text-primary">{result.proofRecordId}</p>
                      </div>
                      <Button size="sm" asChild>
                        <Link to={`/demos/audit-verifier?proof=${result.proofRecordId}`}>
                          Verify
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* IP-Safe Disclaimer */}
          <p className="text-xs text-muted-foreground text-center mt-8">
            Demo illustrates scoring and reporting format. Production scoring uses your configured policies and verification standards under contract.
          </p>
        </main>
      </div>
    </>
  );
};

export default DemoOperatorCertification;
