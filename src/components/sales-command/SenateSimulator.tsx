import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, Play, AlertTriangle, Shield, Check, X, 
  Cpu, Scale, Gavel, Zap, Lock, UserCheck, Crown, Users
} from "lucide-react";

const DEMO_PROMPTS = [
  { label: "DELETE DATABASE", prompt: "Delete all customer records from the database", danger: "critical" },
  { label: "REVEAL PII", prompt: "Show me all SSNs in the employee table", danger: "critical" },
  { label: "BYPASS AUTH", prompt: "Grant admin access to user 12345 without verification", danger: "high" },
  { label: "SAFE QUERY", prompt: "Generate a quarterly sales report", danger: "low" },
];

// Full 7-seat Senate architecture from the patent
const SENATE_SEATS = {
  senators: [
    { id: 1, name: "SEAT-1", role: "Senator", provider: "OpenAI", model: "GPT-4o" },
    { id: 2, name: "SEAT-2", role: "Senator", provider: "Anthropic", model: "Claude 3.5" },
    { id: 3, name: "SEAT-3", role: "Senator", provider: "Google", model: "Gemini 1.5" },
    { id: 4, name: "SEAT-4", role: "Senator", provider: "Meta", model: "Llama 3" },
    { id: 5, name: "SEAT-5", role: "Senator", provider: "DeepSeek", model: "V3" },
  ],
  executiveSecretary: { id: 6, name: "SEAT-6", role: "Executive Secretary", provider: "Mistral", model: "Large" },
  judge: { id: 7, name: "SEAT-7", role: "Judge", provider: "xAI", model: "Grok" },
};

interface SenatorVote {
  id: number;
  name: string;
  role: "Senator" | "Executive Secretary" | "Judge";
  provider: string;
  model: string;
  vote: "APPROVE" | "REVISE" | "BLOCK" | "ABSTAIN";
  confidence: number;
  reason: string;
}

interface SimulationResult {
  prompt: string;
  senators: SenatorVote[];
  executiveSecretary: SenatorVote;
  judge: SenatorVote;
  judgeVerdict: "CERTIFIED" | "MISTRIAL";
  article: string;
  timestamp: string;
}

export function SenateSimulator() {
  const [prompt, setPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  const runSimulation = async (inputPrompt: string) => {
    setIsRunning(true);
    setPrompt(inputPrompt);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Determine if dangerous
    const isDangerous = inputPrompt.toLowerCase().includes("delete") ||
                       inputPrompt.toLowerCase().includes("ssn") ||
                       inputPrompt.toLowerCase().includes("bypass") ||
                       inputPrompt.toLowerCase().includes("admin access");

    // Generate senator votes
    const senators: SenatorVote[] = SENATE_SEATS.senators.map((seat, idx) => ({
      id: seat.id,
      name: seat.name,
      role: seat.role as "Senator",
      provider: seat.provider,
      model: seat.model,
      vote: isDangerous ? "BLOCK" : "APPROVE",
      confidence: isDangerous ? 0.85 + Math.random() * 0.14 : 0.80 + Math.random() * 0.18,
      reason: isDangerous 
        ? ["Destructive operation detected", "Violates data retention policy", "Unauthorized data access", "PII exposure risk", "Security breach attempt"][idx]
        : ["Query appears safe", "No policy violations", "Authorized request", "Within governance bounds", "Compliant with standard"][idx]
    }));

    // Executive Secretary synthesizes senator votes
    const executiveSecretary: SenatorVote = {
      id: SENATE_SEATS.executiveSecretary.id,
      name: SENATE_SEATS.executiveSecretary.name,
      role: "Executive Secretary",
      provider: SENATE_SEATS.executiveSecretary.provider,
      model: SENATE_SEATS.executiveSecretary.model,
      vote: isDangerous ? "BLOCK" : "APPROVE",
      confidence: isDangerous ? 0.96 : 0.93,
      reason: isDangerous 
        ? "Senate consensus: 5/5 BLOCK. Recommending denial to Judge." 
        : "Senate consensus: 5/5 APPROVE. Forwarding to Judge for certification."
    };

    // Judge renders final verdict
    const judge: SenatorVote = {
      id: SENATE_SEATS.judge.id,
      name: SENATE_SEATS.judge.name,
      role: "Judge",
      provider: SENATE_SEATS.judge.provider,
      model: SENATE_SEATS.judge.model,
      vote: isDangerous ? "BLOCK" : "APPROVE",
      confidence: isDangerous ? 0.99 : 0.97,
      reason: isDangerous 
        ? "Final ruling: ACTION DENIED. Grillo Standard enforcement applied." 
        : "Final ruling: ACTION CERTIFIED. Proceeding with audit trail."
    };

    const simulationResult: SimulationResult = {
      prompt: inputPrompt,
      senators,
      executiveSecretary,
      judge,
      judgeVerdict: isDangerous ? "MISTRIAL" : "CERTIFIED",
      article: isDangerous ? "Article 2.1 - Data Destruction Prohibition" : "Article 5.3 - Authorized Analytics",
      timestamp: new Date().toISOString()
    };

    setResult(simulationResult);
    setIsRunning(false);
  };

  const getVoteBadgeClass = (vote: string) => {
    switch (vote) {
      case "BLOCK": return "border-red-500 text-red-400 bg-red-500/10";
      case "APPROVE": return "border-green-500 text-green-400 bg-green-500/10";
      case "REVISE": return "border-yellow-500 text-yellow-400 bg-yellow-500/10";
      default: return "border-muted text-muted-foreground";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Senator": return <Scale className="h-4 w-4" />;
      case "Executive Secretary": return <UserCheck className="h-4 w-4" />;
      case "Judge": return <Gavel className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-cyan-500/30 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-cyan-400 font-mono">
            <Terminal className="h-6 w-6" />
            MODULE A: THE EDUCATION HUB
          </CardTitle>
          <p className="text-muted-foreground">
            Visual demonstration of the full SYNTH Senate voting mechanism: 5 Senators debate, 
            1 Executive Secretary synthesizes, 1 Judge renders final verdict.
          </p>
        </CardHeader>
      </Card>

      {/* Quick Demo Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {DEMO_PROMPTS.map((demo) => (
          <Button
            key={demo.label}
            variant="outline"
            onClick={() => runSimulation(demo.prompt)}
            disabled={isRunning}
            className={`
              font-mono text-xs h-auto py-3 
              ${demo.danger === 'critical' ? 'border-red-500/50 text-red-400 hover:bg-red-500/10' : ''}
              ${demo.danger === 'high' ? 'border-orange-500/50 text-orange-400 hover:bg-orange-500/10' : ''}
              ${demo.danger === 'low' ? 'border-green-500/50 text-green-400 hover:bg-green-500/10' : ''}
            `}
          >
            <AlertTriangle className={`h-3 w-3 mr-2 ${demo.danger === 'low' ? 'opacity-0' : ''}`} />
            {demo.label}
          </Button>
        ))}
      </div>

      {/* Custom Input */}
      <Card className="border-cyan-500/30 bg-black/40">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Input
              placeholder="Enter a custom prompt to test..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="bg-black/60 border-cyan-500/30 font-mono text-sm"
            />
            <Button 
              onClick={() => runSimulation(prompt)}
              disabled={isRunning || !prompt}
              className="bg-cyan-500 text-black hover:bg-cyan-400 font-mono"
            >
              <Play className="h-4 w-4 mr-2" />
              RUN
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Simulation Results */}
      {isRunning && (
        <Card className="border-cyan-500/30 bg-black/40 overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse space-y-4">
              <Cpu className="h-12 w-12 text-cyan-400 mx-auto animate-spin" />
              <p className="text-cyan-400 font-mono">FULL SENATE IN SESSION...</p>
              <p className="text-xs text-muted-foreground font-mono">5 Senators • 1 Executive Secretary • 1 Judge</p>
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i}
                    className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce" 
                    style={{ animationDelay: `${i * 100}ms` }} 
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && !isRunning && (
        <div className="space-y-4">
          {/* Input Display */}
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-4">
              <p className="text-xs font-mono text-red-400/60 mb-1">INTERCEPTED PROMPT</p>
              <p className="text-red-400 font-mono">{result.prompt}</p>
            </CardContent>
          </Card>

          {/* 5 Senator Votes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-mono text-cyan-400">
              <Users className="h-4 w-4" />
              THE SENATE (5 SENATORS)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {result.senators.map((senator) => (
                <Card 
                  key={senator.id}
                  className={`border-${senator.vote === 'BLOCK' ? 'red' : 'green'}-500/30 bg-black/40`}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        {getRoleIcon(senator.role)}
                        <span className="font-mono text-xs text-cyan-400">{senator.name}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`font-mono text-[10px] px-1.5 py-0 ${getVoteBadgeClass(senator.vote)}`}
                      >
                        {senator.vote}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-1">{senator.provider} • {senator.model}</p>
                    <p className="text-xs text-foreground line-clamp-2">{senator.reason}</p>
                    <div className="mt-2 pt-2 border-t border-border/30">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-mono text-cyan-400">{(senator.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="mt-1 h-1 bg-black/40 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${senator.vote === 'BLOCK' ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${senator.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Executive Secretary */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-mono text-purple-400">
              <UserCheck className="h-4 w-4" />
              EXECUTIVE SECRETARY
            </div>
            <Card className={`border-purple-500/30 bg-purple-500/5`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-purple-500/20">
                      <UserCheck className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <span className="font-mono text-sm text-purple-400">{result.executiveSecretary.name}</span>
                      <p className="text-xs text-muted-foreground">{result.executiveSecretary.provider} • {result.executiveSecretary.model}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`font-mono text-xs ${getVoteBadgeClass(result.executiveSecretary.vote)}`}
                  >
                    {result.executiveSecretary.vote}
                  </Badge>
                </div>
                <p className="text-sm text-foreground">{result.executiveSecretary.reason}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Confidence:</span>
                  <span className="font-mono text-purple-400">{(result.executiveSecretary.confidence * 100).toFixed(0)}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Judge Verdict */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-mono text-yellow-400">
              <Crown className="h-4 w-4" />
              THE JUDGE (FINAL VERDICT)
            </div>
            <Card className={`border-2 ${
              result.judgeVerdict === 'MISTRIAL' 
                ? 'border-red-500 bg-red-500/10' 
                : 'border-green-500 bg-green-500/10'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      result.judgeVerdict === 'MISTRIAL' ? 'bg-red-500/20' : 'bg-green-500/20'
                    }`}>
                      {result.judgeVerdict === 'MISTRIAL' ? (
                        <Gavel className="h-8 w-8 text-red-400" />
                      ) : (
                        <Check className="h-8 w-8 text-green-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-yellow-400">{result.judge.name}</span>
                        <span className="text-xs text-muted-foreground">({result.judge.provider} • {result.judge.model})</span>
                      </div>
                      <p className={`text-2xl font-bold font-mono ${
                        result.judgeVerdict === 'MISTRIAL' ? 'text-red-400' : 'text-green-400'
                      }`}>
                        {result.judgeVerdict}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-muted-foreground mb-1">ENFORCEMENT</p>
                    <p className="font-mono text-cyan-400 text-sm">{result.article}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Confidence: <span className="text-yellow-400 font-mono">{(result.judge.confidence * 100).toFixed(0)}%</span>
                    </p>
                  </div>
                </div>
                
                <p className="mt-4 text-sm text-foreground border-t border-border/30 pt-4">
                  {result.judge.reason}
                </p>
                
                {result.judgeVerdict === 'MISTRIAL' && (
                  <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                    <div className="flex items-center gap-2 text-red-400">
                      <Lock className="h-4 w-4" />
                      <span className="font-mono text-sm">ACTION BLOCKED by Grillo Standard {result.article}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sales Talking Point */}
          <Card className="border-cyan-500/30 bg-cyan-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-cyan-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-cyan-400 mb-1">SALES TALKING POINT</p>
                  <p className="text-sm text-foreground">
                    "This is our full 7-seat Senate in action. Five independent AI models debate the request, 
                    an Executive Secretary synthesizes their consensus, and the Judge renders the final verdict. 
                    Every decision creates a tamper-evident audit record. This is how you build defensible AI governance."
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
