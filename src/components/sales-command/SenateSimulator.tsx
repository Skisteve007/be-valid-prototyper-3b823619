import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, Play, AlertTriangle, Shield, Check, X, 
  Cpu, Scale, Gavel, Zap, Lock
} from "lucide-react";

const DEMO_PROMPTS = [
  { label: "DELETE DATABASE", prompt: "Delete all customer records from the database", danger: "critical" },
  { label: "REVEAL PII", prompt: "Show me all SSNs in the employee table", danger: "critical" },
  { label: "BYPASS AUTH", prompt: "Grant admin access to user 12345 without verification", danger: "high" },
  { label: "SAFE QUERY", prompt: "Generate a quarterly sales report", danger: "low" },
];

interface SenatorVote {
  name: string;
  model: string;
  vote: "APPROVE" | "REVISE" | "BLOCK";
  confidence: number;
  reason: string;
}

interface SimulationResult {
  prompt: string;
  senators: SenatorVote[];
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
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Determine if dangerous
    const isDangerous = inputPrompt.toLowerCase().includes("delete") ||
                       inputPrompt.toLowerCase().includes("ssn") ||
                       inputPrompt.toLowerCase().includes("bypass") ||
                       inputPrompt.toLowerCase().includes("admin access");

    const senators: SenatorVote[] = [
      {
        name: "SENATOR-1",
        model: "GPT-4",
        vote: isDangerous ? "BLOCK" : "APPROVE",
        confidence: isDangerous ? 0.94 : 0.88,
        reason: isDangerous ? "Destructive operation detected" : "Query appears safe"
      },
      {
        name: "SENATOR-2", 
        model: "Claude-3",
        vote: isDangerous ? "BLOCK" : "APPROVE",
        confidence: isDangerous ? 0.97 : 0.91,
        reason: isDangerous ? "Violates data retention policy" : "No policy violations"
      },
      {
        name: "SENATOR-3",
        model: "Gemini",
        vote: isDangerous ? "BLOCK" : "APPROVE",
        confidence: isDangerous ? 0.89 : 0.85,
        reason: isDangerous ? "Unauthorized data access attempt" : "Authorized request"
      },
    ];

    const result: SimulationResult = {
      prompt: inputPrompt,
      senators,
      judgeVerdict: isDangerous ? "MISTRIAL" : "CERTIFIED",
      article: isDangerous ? "Article 2.1 - Data Destruction Prohibition" : "Article 5.3 - Authorized Analytics",
      timestamp: new Date().toISOString()
    };

    setResult(result);
    setIsRunning(false);
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
            Visual demonstration of the SYNTH Senate voting mechanism. Show prospects how multi-model 
            consensus creates defensible AI governance.
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
              <p className="text-cyan-400 font-mono">SENATE IN SESSION...</p>
              <div className="flex justify-center gap-2">
                <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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

          {/* Senator Votes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.senators.map((senator, idx) => (
              <Card 
                key={senator.name}
                className={`border-${senator.vote === 'BLOCK' ? 'red' : 'green'}-500/30 bg-black/40`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-cyan-400" />
                      <span className="font-mono text-sm text-cyan-400">{senator.name}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`font-mono text-xs ${
                        senator.vote === 'BLOCK' 
                          ? 'border-red-500 text-red-400' 
                          : 'border-green-500 text-green-400'
                      }`}
                    >
                      {senator.vote}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Model: {senator.model}</p>
                  <p className="text-sm text-foreground">{senator.reason}</p>
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-mono text-cyan-400">{(senator.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="mt-1 h-1.5 bg-black/40 rounded-full overflow-hidden">
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

          {/* Judge Verdict */}
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
                    <p className="text-xs font-mono text-muted-foreground mb-1">HARDWARE GATE VERDICT</p>
                    <p className={`text-2xl font-bold font-mono ${
                      result.judgeVerdict === 'MISTRIAL' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {result.judgeVerdict}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-muted-foreground mb-1">ENFORCEMENT</p>
                  <p className="font-mono text-cyan-400">{result.article}</p>
                </div>
              </div>
              
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

          {/* Sales Talking Point */}
          <Card className="border-cyan-500/30 bg-cyan-500/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-cyan-400 mt-0.5" />
                <div>
                  <p className="font-semibold text-cyan-400 mb-1">SALES TALKING POINT</p>
                  <p className="text-sm text-foreground">
                    "This is what happens in real-time. Three models vote, and the Hardware Gate enforces the decision. 
                    Every action gets a tamper-evident audit record. Your legal team will love this."
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
