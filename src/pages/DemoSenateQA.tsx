import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { MessageSquare, Play, Loader2, AlertTriangle, CheckCircle, XCircle, Sparkles, Users, Clock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DemoBanner from "@/components/demos/DemoBanner";
import DemoShareButton from "@/components/demos/DemoShareButton";
import DemoEnvironmentNotice from "@/components/demos/DemoEnvironmentNotice";
import SynthScorecard from "@/components/reports/SynthScorecard";
import { transformToScorecard, generateAuditProof, downloadJSON } from "@/lib/reportUtils";

interface SenatorBallot {
  seat_id: number;
  seat_name: string;
  provider: string;
  model: string;
  status: "online" | "offline" | "timeout" | "error" | "running" | "voted" | "abstain";
  stance: "approve" | "revise" | "block" | "abstain";
  score: number;
  confidence: number;
  risk_flags: string[];
  key_points: string[];
  counterpoints: string[];
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

const EXAMPLE_PROMPTS = [
  "Should we accept a $200K investment at a $6M valuation cap for our identity verification startup?",
  "Is storing health verification data for 90 days compliant with privacy regulations?",
  "Should we prioritize mobile app or PWA for our venue verification product?",
];

const DemoSenateQA = () => {
  const [prompt, setPrompt] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<DebateResult | null>(null);
  const [showScorecard, setShowScorecard] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session?.user);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const scorecardData = result ? transformToScorecard(result as any) : null;

  const handleDownloadJSON = () => {
    if (!result) return;
    const auditProof = generateAuditProof(result as any, "qa");
    downloadJSON(auditProof, `synth-audit-${result.trace_id}.json`);
  };

  const handleRunDebate = async () => {
    // Require login to run
    if (!isLoggedIn) {
      navigate(`/auth?mode=login&redirect=${encodeURIComponent('/demos/senate-qa')}`);
      return;
    }

    if (!prompt.trim()) {
      toast.error("Please enter a question");
      return;
    }

    setIsRunning(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('synth-senate-run', {
        body: { prompt: prompt.trim(), mode: "standard" }
      });

      if (error) throw error;

      setResult(data);
      toast.success("Review complete!");
    } catch (error) {
      console.error("Review error:", error);
      toast.error("Failed to run review. Please try again.");
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
      case "online":
      case "voted": return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case "running": return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
      case "offline": return <XCircle className="h-4 w-4 text-muted-foreground" />;
      case "timeout": return <Clock className="h-4 w-4 text-amber-400" />;
      case "error": return <XCircle className="h-4 w-4 text-red-400" />;
      case "abstain": return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
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
        <title>Demo A — AI Review Panel | Valid™</title>
        <meta name="description" content="Ask a question and watch multiple AI models deliberate to reach consensus. Live multi-model governance demo." />
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
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Demo A — AI Review Panel</h1>
                  <p className="text-sm text-muted-foreground">Ask a question → Multi-model answer</p>
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
          {/* Prompt Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Enter Your Question
              </CardTitle>
              <CardDescription>Type a question or click an example below</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask any question you'd like the AI panel to review..."
                rows={3}
                className="resize-none"
              />
              
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_PROMPTS.map((ex, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => setPrompt(ex)}
                    className="text-xs"
                  >
                    Example {i + 1}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleRunDebate} 
                  disabled={isRunning}
                  className="w-full"
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Running Review...
                    </>
                  ) : !isLoggedIn ? (
                    <>
                      <LogIn className="h-5 w-5 mr-2" />
                      Sign in to Run
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Run Review
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Viewing is public. Running requires sign-in (for trace/audit and rate limiting).
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Seat Status Row (shows during running or after results) */}
          {(isRunning || result) && (
            <Card className="mb-8">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Model Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(result?.seats || [
                    { seat_id: 1, provider: "OpenAI", status: isRunning ? "running" : "offline" },
                    { seat_id: 2, provider: "Anthropic", status: isRunning ? "running" : "offline" },
                    { seat_id: 3, provider: "Google", status: isRunning ? "running" : "offline" },
                    { seat_id: 4, provider: "DeepSeek", status: isRunning ? "running" : "offline" },
                    { seat_id: 5, provider: "xAI", status: isRunning ? "running" : "offline" },
                    { seat_id: 6, provider: "Mistral", status: isRunning ? "running" : "offline" },
                    { seat_id: 7, provider: "Meta", status: isRunning ? "running" : "offline" },
                  ]).map((seat: any) => (
                    <div key={seat.seat_id} className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted/50 border border-border">
                      {getStatusIcon(seat.status)}
                      <span className={`text-xs font-medium ${getProviderColor(seat.provider)}`}>
                        {seat.provider}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-8">
              {/* Model Cards */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Model Assessments
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
                        {seat.status === "online" || seat.status === "voted" ? (
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
                            {seat.status === "offline" ? "Model offline" : 
                             seat.status === "timeout" ? "Request timed out" : 
                             seat.status === "abstain" ? "Abstained" :
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
                      <CardTitle>Final Decision</CardTitle>
                      <CardDescription>Synthesized from all model assessments</CardDescription>
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

              {/* Trace ID & Scorecard Toggle */}
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Trace ID: {result.trace_id}
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowScorecard(!showScorecard)}
                >
                  {showScorecard ? "Hide Scorecard" : "View Scorecard"}
                </Button>
              </div>

              {/* Scorecard */}
              {showScorecard && scorecardData && (
                <div className="max-w-md mx-auto mt-6">
                  <SynthScorecard 
                    data={scorecardData}
                    onDownloadJSON={handleDownloadJSON}
                  />
                </div>
              )}
            </div>
          )}

          {/* Footer Notice */}
          <div className="text-center mt-8">
            <DemoEnvironmentNotice variant="footer" />
          </div>
        </main>
      </div>
    </>
  );
};

export default DemoSenateQA;
