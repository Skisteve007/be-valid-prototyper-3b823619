import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { MessageSquare, Play, Loader2, AlertTriangle, CheckCircle, XCircle, Sparkles, Users, FileJson, Clock, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import SynthAdminGate from "@/components/synth/SynthAdminGate";

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
  timing?: {
    latency_ms: number;
    started_at?: string;
    completed_at?: string;
  };
  usage?: {
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

interface JudgeOutput {
  provider: string;
  model: string;
  final_answer: string;
  rationale: string[];
  risk_verdict: {
    level: "low" | "medium" | "high";
    notes: string[];
  };
  seat_influence?: Array<{
    seat_id: number;
    influence: "high" | "medium" | "low" | "none";
  }>;
}

interface DebateResult {
  response_version: string;
  trace_id: string;
  created_at: string;
  request: {
    prompt: string;
    mode?: string;
  };
  weights: {
    normalization: string;
    by_seat_id: Record<string, number>;
  };
  seats: SenatorBallot[];
  judge: JudgeOutput;
  participation_summary: {
    online_seats: number[];
    offline_seats: number[];
    timeout_seats: number[];
    error_seats: number[];
  };
  contested: boolean;
  contested_reasons: string[];
}

const DOMAINS = [
  { id: "general", label: "General" },
  { id: "finance", label: "Finance" },
  { id: "security", label: "Security" },
  { id: "product", label: "Product" },
  { id: "legal", label: "Legal" }
];

const SynthSenateLab = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [domain, setDomain] = useState("general");
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<DebateResult | null>(null);
  const [activeTab, setActiveTab] = useState("senators");

  const handleRunSenate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsRunning(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('synth-senate-run', {
        body: { 
          prompt: prompt.trim(), 
          mode: "standard",
          domain
        }
      });

      if (error) throw error;

      setResult(data);
      toast.success("Senate run complete!");
    } catch (error) {
      console.error("Senate error:", error);
      toast.error("Failed to run Senate. Please try again.");
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
    <SynthAdminGate pageTitle="Senate Lab">
      <Helmet>
        <title>Senate Lab | SYNTH™ Admin</title>
        <meta name="robots" content="noindex, nofollow" />
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
                  <h1 className="text-xl font-bold text-foreground">Senate Lab</h1>
                  <p className="text-sm text-muted-foreground">Admin-Only Multi-Model Orchestration</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-red-500/50 text-red-400">
                  ADMIN ONLY
                </Badge>
                <Button variant="outline" size="sm" onClick={() => navigate("/synth")}>
                  ← Back to SYNTH
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Input Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Challenge / Problem
              </CardTitle>
              <CardDescription>Enter any prompt to run through the Senate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your challenge or problem for the Senate to deliberate..."
                className="min-h-[120px] resize-y"
              />

              <div className="flex items-center gap-4">
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOMAINS.map(d => (
                      <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button 
                  onClick={handleRunSenate} 
                  disabled={!prompt.trim() || isRunning}
                  size="lg"
                  className="flex-1"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Running Senate...
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Run Senate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Session Info */}
              <Card className="border-border/50">
                <CardContent className="pt-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Trace:</span>
                      <code className="text-xs bg-muted px-2 py-0.5 rounded">{result.trace_id}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Created:</span>
                      <span>{new Date(result.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Version:</span>
                      <Badge variant="outline">{result.response_version}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Online:</span>
                      <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400">
                        {result.participation_summary.online_seats.length} seats
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="senators">Senators</TabsTrigger>
                  <TabsTrigger value="conflicts">Conflicts</TabsTrigger>
                  <TabsTrigger value="judge">Judge</TabsTrigger>
                  <TabsTrigger value="transcript">Transcript</TabsTrigger>
                  <TabsTrigger value="json">Raw JSON</TabsTrigger>
                </TabsList>

                {/* Senators Tab */}
                <TabsContent value="senators" className="mt-4">
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
                          <p className="text-xs text-muted-foreground">{seat.seat_name}</p>
                        </CardHeader>
                        <CardContent className="pt-0 space-y-2">
                          {seat.status === "online" ? (
                            <>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-muted-foreground">Score:</span>
                                  <span className="ml-1 font-medium">{seat.score}/100</span>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Conf:</span>
                                  <span className="ml-1 font-medium">{(seat.confidence * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                              {seat.timing && (
                                <div className="text-xs text-muted-foreground">
                                  Latency: {seat.timing.latency_ms}ms
                                </div>
                              )}
                              {seat.usage && (
                                <div className="text-xs text-muted-foreground">
                                  Tokens: {seat.usage.total_tokens}
                                </div>
                              )}
                              {seat.key_points.length > 0 && (
                                <div className="pt-2 border-t border-border/50">
                                  <p className="text-xs text-muted-foreground mb-1">Key Points:</p>
                                  <ul className="text-xs space-y-1">
                                    {seat.key_points.slice(0, 3).map((point, i) => (
                                      <li key={i} className="text-foreground/80">• {point}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {seat.risk_flags.length > 0 && (
                                <div className="pt-2">
                                  <p className="text-xs text-muted-foreground mb-1">Risk Flags:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {seat.risk_flags.map((flag, i) => (
                                      <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0 bg-red-500/10 text-red-400 border-red-500/30">
                                        {flag}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-xs">
                              {seat.error && (
                                <p className="text-red-400">{seat.error.code}: {seat.error.message}</p>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Conflicts Tab */}
                <TabsContent value="conflicts" className="mt-4">
                  {result.contested ? (
                    <Card className="border-amber-500/50 bg-amber-500/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-400">
                          <AlertTriangle className="h-5 w-5" />
                          Contested Decision Detected
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.contested_reasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <span className="text-amber-400">•</span>
                              <span className="text-foreground/80">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="border-emerald-500/50 bg-emerald-500/10">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-6 w-6 text-emerald-400" />
                          <p className="text-foreground">No major conflicts detected. Senate reached consensus.</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Judge Tab */}
                <TabsContent value="judge" className="mt-4">
                  <Card className="border-primary/30 bg-primary/5">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-primary/20 border border-primary/40">
                          <Sparkles className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle>Judge Final Decision</CardTitle>
                          <CardDescription>{result.judge.provider} / {result.judge.model}</CardDescription>
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

                      {result.judge.risk_verdict.notes.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Risk Notes:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {result.judge.risk_verdict.notes.map((note, i) => (
                              <li key={i}>• {note}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {result.judge.seat_influence && (
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Seat Influence:</p>
                          <div className="flex flex-wrap gap-2">
                            {result.judge.seat_influence.map((si) => (
                              <Badge 
                                key={si.seat_id} 
                                variant="outline"
                                className={
                                  si.influence === "high" ? "bg-emerald-500/20 text-emerald-400" :
                                  si.influence === "medium" ? "bg-amber-500/20 text-amber-400" :
                                  si.influence === "low" ? "bg-blue-500/20 text-blue-400" :
                                  "bg-muted text-muted-foreground"
                                }
                              >
                                Seat {si.seat_id}: {si.influence}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Transcript Tab */}
                <TabsContent value="transcript" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileJson className="h-5 w-5" />
                        Full Transcript
                      </CardTitle>
                      <CardDescription>Append-only log of all messages</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[500px]">
                        <div className="space-y-4 pr-4">
                          {/* Input */}
                          <div className="p-3 bg-muted/50 rounded-lg border border-border">
                            <p className="text-xs text-muted-foreground mb-1">INPUT ({result.created_at})</p>
                            <p className="text-sm">{result.request.prompt}</p>
                          </div>

                          {/* Each seat */}
                          {result.seats.map((seat) => (
                            <div key={seat.seat_id} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                              <p className="text-xs text-muted-foreground mb-1">
                                {seat.seat_name} ({seat.status}) {seat.timing?.completed_at}
                              </p>
                              <p className="text-sm">
                                <span className={getStanceColor(seat.stance)}>
                                  [{seat.stance.toUpperCase()}]
                                </span>
                                {' '}Score: {seat.score}, Confidence: {(seat.confidence * 100).toFixed(0)}%
                              </p>
                              {seat.key_points.length > 0 && (
                                <ul className="mt-2 text-xs text-muted-foreground">
                                  {seat.key_points.map((kp, i) => (
                                    <li key={i}>• {kp}</li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}

                          {/* Judge */}
                          <div className="p-3 bg-primary/10 rounded-lg border border-primary/30">
                            <p className="text-xs text-primary/70 mb-1">JUDGE ({result.judge.provider})</p>
                            <p className="text-sm text-foreground">{result.judge.final_answer}</p>
                          </div>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Raw JSON Tab */}
                <TabsContent value="json" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileJson className="h-5 w-5" />
                        Raw JSON Output
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[500px]">
                        <pre className="text-xs bg-muted/50 p-4 rounded-lg overflow-x-auto">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </main>
      </div>
    </SynthAdminGate>
  );
};

export default SynthSenateLab;
