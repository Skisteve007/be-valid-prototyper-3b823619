import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { MessageSquare, Play, Loader2, AlertTriangle, CheckCircle, XCircle, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const EXAMPLE_PROMPTS = [
  {
    id: "startup-pitch",
    label: "Evaluate Startup Pitch",
    prompt: "Evaluate this startup pitch: 'We're building an AI-powered platform that helps nightclubs verify age and health status of patrons using QR codes, while protecting user privacy through zero-knowledge proofs. We're seeking $200K at a $6M valuation cap.' What are the risks, opportunities, and recommended next steps?"
  },
  {
    id: "security-policy",
    label: "Security Policy Review",
    prompt: "Review this security policy decision: 'We plan to store user health verification data in a centralized database with AES-256 encryption, allowing partners to query verification status via API with rate limiting. Data retention is 90 days.' Is this approach secure? What improvements would you recommend?"
  },
  {
    id: "product-feature",
    label: "Product Feature Decision",
    prompt: "Should we prioritize building a native mobile app or focus on progressive web app (PWA) for our identity verification platform? Consider: user adoption, development cost, security requirements, and time-to-market. Our target users are nightclub patrons aged 21-35."
  }
];

interface SenatorBallot {
  seat_id: number;
  seat_name: string;
  provider: string;
  model: string;
  status: "online" | "offline" | "timeout" | "error";
  stance: "approve" | "revise" | "block" | "abstain";
  score: number;
  confidence: number;
  risk_flags: string[];
  key_points: string[];
  counterpoints: string[];
  recommended_edits?: string[];
}

interface JudgeOutput {
  final_answer: string;
  rationale: string[];
  risk_verdict: {
    level: "low" | "medium" | "high";
    notes: string[];
  };
}

interface DebateResult {
  trace_id: string;
  seats: SenatorBallot[];
  judge: JudgeOutput;
  contested: boolean;
  contested_reasons: string[];
}

const DebateRoom = () => {
  const navigate = useNavigate();
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<DebateResult | null>(null);

  const handleRunDebate = async () => {
    const prompt = EXAMPLE_PROMPTS.find(p => p.id === selectedPrompt);
    if (!prompt) {
      toast.error("Please select a prompt");
      return;
    }

    setIsRunning(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('synth-senate-run', {
        body: { prompt: prompt.prompt, mode: "standard" }
      });

      if (error) throw error;

      setResult(data);
      toast.success("Debate complete!");
    } catch (error) {
      console.error("Debate error:", error);
      toast.error("Failed to run debate. Please try again.");
    } finally {
      setIsRunning(false);
    }
  };

  const getStanceColor = (stance: string) => {
    switch (stance) {
      case "approve": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      case "revise": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "block": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-muted text-muted-foreground border-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case "offline": return <XCircle className="h-4 w-4 text-muted-foreground" />;
      case "timeout": return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "error": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "OpenAI": return "text-emerald-400";
      case "Anthropic": return "text-amber-400";
      case "Google": return "text-blue-400";
      case "Meta": return "text-purple-400";
      case "DeepSeek": return "text-cyan-400";
      case "Mistral": return "text-orange-400";
      case "xAI": return "text-pink-400";
      default: return "text-foreground";
    }
  };

  return (
    <>
      <Helmet>
        <title>AI Senate — Debate Room (Demo) | Valid™</title>
        <meta name="description" content="Watch 7 AI models debate and reach consensus on complex decisions. A live demo of multi-model deliberation." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">AI Senate — Debate Room</h1>
                  <p className="text-sm text-muted-foreground">Multi-Model Deliberation Demo</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                ← Back
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Intro */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Sparkles className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">How It Works</h2>
                  <p className="text-muted-foreground text-sm">
                    Select a prompt and watch 7 AI models (OpenAI, Claude, Gemini, DeepSeek, Grok, Mistral, Llama) 
                    debate in parallel. A Judge model then synthesizes their perspectives into a final decision.
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    ⚠️ Demo. Outputs may be incorrect. Do not submit sensitive data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prompt Selection */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Select a Debate Topic
              </CardTitle>
              <CardDescription>Choose one of the example prompts to run</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedPrompt} onValueChange={setSelectedPrompt}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a prompt..." />
                </SelectTrigger>
                <SelectContent>
                  {EXAMPLE_PROMPTS.map(prompt => (
                    <SelectItem key={prompt.id} value={prompt.id}>
                      {prompt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPrompt && (
                <div className="p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">
                    {EXAMPLE_PROMPTS.find(p => p.id === selectedPrompt)?.prompt}
                  </p>
                </div>
              )}

              <Button 
                onClick={handleRunDebate} 
                disabled={!selectedPrompt || isRunning}
                className="w-full"
                size="lg"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Running Debate...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Run Debate
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-8">
              {/* Senator Cards - Round 1 */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Round 1: Senator Votes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {result.seats.map((seat) => (
                    <Card key={seat.seat_id} className="border-border/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(seat.status)}
                            <span className={`text-sm font-medium ${getProviderColor(seat.provider)}`}>
                              {seat.provider}
                            </span>
                          </div>
                          <Badge variant="outline" className={getStanceColor(seat.stance)}>
                            {seat.stance.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{seat.model}</p>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {seat.status === "online" ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Score</span>
                              <span className="font-medium">{seat.score}/100</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Confidence</span>
                              <span className="font-medium">{(seat.confidence * 100).toFixed(0)}%</span>
                            </div>
                            {seat.key_points.length > 0 && (
                              <div className="pt-2 border-t border-border/50">
                                <p className="text-xs text-muted-foreground mb-1">Key Points:</p>
                                <ul className="text-xs space-y-1">
                                  {seat.key_points.slice(0, 2).map((point, i) => (
                                    <li key={i} className="text-foreground/80">• {point}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground italic">
                            {seat.status === "offline" ? "Seat offline" : 
                             seat.status === "timeout" ? "Request timed out" : 
                             "Error occurred"}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Contested Warning */}
              {result.contested && (
                <Card className="border-amber-500/50 bg-amber-500/10">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
                      <div>
                        <p className="font-medium text-amber-400">Contested Decision</p>
                        <ul className="text-sm text-muted-foreground mt-1">
                          {result.contested_reasons.map((reason, i) => (
                            <li key={i}>• {reason}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Judge Decision */}
              <Card className="border-primary/30 bg-primary/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/20 border border-primary/40">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Judge Final Decision</CardTitle>
                      <CardDescription>Synthesized from all senator votes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-background/50 rounded-lg border border-border">
                    <p className="text-foreground whitespace-pre-wrap">{result.judge.final_answer}</p>
                  </div>
                  
                  {result.judge.rationale.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-foreground mb-2">Rationale:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {result.judge.rationale.map((r, i) => (
                          <li key={i}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={
                        result.judge.risk_verdict.level === "low" 
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                          : result.judge.risk_verdict.level === "medium"
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                          : "bg-red-500/20 text-red-400 border-red-500/50"
                      }
                    >
                      Risk: {result.judge.risk_verdict.level.toUpperCase()}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Trace ID */}
              <p className="text-xs text-muted-foreground text-center">
                Trace ID: {result.trace_id}
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default DebateRoom;
