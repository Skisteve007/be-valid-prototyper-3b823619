import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { 
  MessageSquare, Upload, Play, Loader2, CheckCircle2, XCircle, 
  AlertTriangle, Shield, Clock, Copy, Share2, ArrowRight, 
  FileText, Sparkles, Calendar, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import DemoEnvironmentNotice from "@/components/demos/DemoEnvironmentNotice";
import { 
  runGovernanceWithProgress,
  verifyProofRecord,
  generateShareToken,
  type TraceStep,
  type ProofRecord,
  type GovernanceResult
} from "@/lib/demoGovernanceEngine";

const SAMPLE_PROMPTS = [
  { name: "investment", label: "Investment Decision", prompt: "Should we accept a $200K investment at a $6M valuation cap for our identity verification startup?" },
  { name: "compliance", label: "Compliance Check", prompt: "Is storing health verification data for 90 days compliant with GDPR and HIPAA regulations?" },
  { name: "product", label: "Product Strategy", prompt: "Should we prioritize mobile app or PWA for our venue verification product?" },
];

const DemoDecision = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const initialMode = searchParams.get("mode") === "upload" ? "upload" : "prompt";
  const initialSample = searchParams.get("sample");
  const proofParam = searchParams.get("proof");
  
  const [mode, setMode] = useState<"prompt" | "upload">(initialMode);
  const [prompt, setPrompt] = useState(() => {
    if (initialSample) {
      const found = SAMPLE_PROMPTS.find(p => p.name === initialSample);
      return found?.prompt || "";
    }
    return "";
  });
  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");
  
  const [status, setStatus] = useState<"idle" | "processing" | "complete">("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>([]);
  const [result, setResult] = useState<GovernanceResult | null>(null);
  const [shareToken, setShareToken] = useState<string | null>(null);
  
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    status: string;
    message: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Auto-verify if proof param is present
  useEffect(() => {
    if (proofParam && result?.proof_record) {
      handleVerifyProof();
    }
  }, [proofParam, result]);

  const handleModeChange = (newMode: string) => {
    setMode(newMode as "prompt" | "upload");
    navigate(`/decision?mode=${newMode}`, { replace: true });
  };

  const handleSelectSample = (sample: typeof SAMPLE_PROMPTS[0]) => {
    setPrompt(sample.prompt);
    navigate(`/decision?mode=prompt&sample=${sample.name}`, { replace: true });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Demo limit: 10MB max");
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFileContent(event.target?.result as string || file.name);
      };
      reader.readAsText(file);
    }
  };

  const runPipeline = async () => {
    const input = mode === "prompt" ? prompt : fileContent || fileName;
    
    if (!input.trim()) {
      toast.error(mode === "prompt" ? "Please enter a prompt" : "Please upload a file");
      return;
    }

    setStatus("processing");
    setCurrentStep(0);
    setTraceSteps([]);
    setResult(null);
    setShareToken(null);
    setVerificationResult(null);

    try {
      const govResult = await runGovernanceWithProgress(
        2,
        mode === "prompt" ? "qna" : "upload",
        "generic",
        input,
        (stepIndex, step) => {
          setCurrentStep(stepIndex);
          setTraceSteps(prev => {
            const newSteps = [...prev];
            newSteps[stepIndex] = step;
            return newSteps;
          });
        }
      );

      setResult(govResult);
      setStatus("complete");
      toast.success("Governance complete!");
    } catch (error) {
      toast.error("Pipeline failed");
      setStatus("idle");
    }
  };

  const handleGenerateShareToken = () => {
    const token = generateShareToken();
    setShareToken(token);
    toast.success("Share token generated (valid 7 days)");
  };

  const handleVerifyProof = () => {
    if (!result?.proof_record) return;
    
    setIsVerifying(true);
    setTimeout(() => {
      const verification = verifyProofRecord(
        result.proof_record.proof_id,
        result.proof_record.input_hash
      );
      setVerificationResult(verification);
      setIsVerifying(false);
    }, 800);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(label);
      toast.success(`${label} copied!`);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const copyShareLink = async () => {
    const url = `${window.location.origin}/decision?mode=${mode}${result?.proof_record ? `&proof=${result.proof_record.proof_id}` : ""}`;
    await copyToClipboard(url, "link");
  };

  const reset = () => {
    setStatus("idle");
    setPrompt("");
    setFileName("");
    setFileContent("");
    setTraceSteps([]);
    setResult(null);
    setShareToken(null);
    setVerificationResult(null);
  };

  return (
    <>
      <Helmet>
        <title>Governed Decision | Valid™ SYNTH Demo</title>
        <meta name="description" content="Run a governed AI decision with verification trace and proof record." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Governed Decision</h1>
                  <p className="text-xs text-muted-foreground">Demo Mode</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={copyShareLink}>
                  {copiedItem === "link" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  <span className="ml-2 hidden sm:inline">Copy Link</span>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">← Hub</Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Step 1: Input */}
          {status === "idle" && (
            <>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Step 1: Input</CardTitle>
                  <CardDescription>Choose prompt or upload mode</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="prompt" className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Prompt
                      </TabsTrigger>
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload PDF
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>

                  {mode === "prompt" && (
                    <div className="space-y-4">
                      <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your question or decision prompt..."
                        rows={4}
                        className="resize-none"
                      />
                      <div className="flex flex-wrap gap-2">
                        {SAMPLE_PROMPTS.map((sample) => (
                          <Button
                            key={sample.name}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectSample(sample)}
                            className="text-xs"
                          >
                            {sample.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {mode === "upload" && (
                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center bg-primary/5">
                      {fileName ? (
                        <div className="flex items-center justify-center gap-2">
                          <FileText className="h-6 w-6 text-primary" />
                          <span className="font-medium">{fileName}</span>
                          <Button variant="ghost" size="sm" onClick={() => { setFileName(""); setFileContent(""); }}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 text-primary mx-auto mb-3" />
                          <p className="text-muted-foreground mb-3">PDF, DOCX, or TXT • Max 10MB</p>
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept=".pdf,.docx,.txt"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <Button asChild>
                              <span>Choose File</span>
                            </Button>
                          </label>
                        </>
                      )}
                    </div>
                  )}

                  <Button 
                    onClick={runPipeline} 
                    className="w-full" 
                    size="lg"
                    disabled={mode === "prompt" ? !prompt.trim() : !fileName}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Run Governance
                  </Button>
                </CardContent>
              </Card>

              <DemoEnvironmentNotice variant="banner" />
            </>
          )}

          {/* Step 2: Governance Trace */}
          {status === "processing" && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  Step 2: Governance Trace
                </CardTitle>
                <CardDescription>Pipeline processing...</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {traceSteps.map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        step.status === "complete" ? "bg-emerald-500/20" :
                        step.status === "running" ? "bg-primary/20 animate-pulse" :
                        "bg-muted"
                      }`}>
                        {step.status === "complete" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : step.status === "running" ? (
                          <Loader2 className="h-4 w-4 text-primary animate-spin" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={step.status !== "pending" ? "text-foreground" : "text-muted-foreground"}>
                          {step.label}
                        </p>
                        {step.status === "running" && <Progress value={60} className="h-1 mt-1" />}
                        {step.status === "complete" && (
                          <p className="text-xs text-muted-foreground">{step.ms}ms</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3 & 4: Result + Verification */}
          {status === "complete" && result && (
            <>
              {/* Verdict */}
              <Card className={`mb-6 ${
                result.verdict === "CERTIFIED" 
                  ? "border-emerald-500/50 bg-emerald-500/5" 
                  : "border-red-500/50 bg-red-500/5"
              }`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-full ${
                      result.verdict === "CERTIFIED" ? "bg-emerald-500/20" : "bg-red-500/20"
                    }`}>
                      {result.verdict === "CERTIFIED" ? (
                        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${
                        result.verdict === "CERTIFIED" ? "text-emerald-400" : "text-red-400"
                      }`}>
                        {result.verdict}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Grade: <Badge variant="outline" className={
                          result.grade === "green" ? "border-emerald-500/50 text-emerald-400" :
                          result.grade === "yellow" ? "border-amber-500/50 text-amber-400" :
                          "border-red-500/50 text-red-400"
                        }>{result.grade.toUpperCase()}</Badge>
                      </p>
                    </div>
                  </div>

                  {/* Reasons */}
                  <div className="space-y-2 mb-4">
                    {result.reasons.map((reason, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{reason}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Proof Record */}
              <Card className="mb-6 border-cyan-500/30 bg-cyan-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-cyan-400" />
                    Proof Record
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Proof ID</p>
                      <p className="font-mono text-xs text-foreground">{result.proof_record.proof_id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Input Hash</p>
                      <p className="font-mono text-xs text-foreground truncate">{result.proof_record.input_hash}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Issued At</p>
                      <p className="text-foreground">{new Date(result.proof_record.issued_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Expires At</p>
                      <p className="text-foreground">{new Date(result.proof_record.expires_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Policy Version</p>
                      <p className="font-mono text-foreground">{result.proof_record.policy_pack_version}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Signature</p>
                      <p className="font-mono text-xs text-foreground truncate">{result.proof_record.signature}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(result.proof_record, null, 2), "proof")}
                    >
                      {copiedItem === "proof" ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      Copy Record
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleVerifyProof}
                      disabled={isVerifying}
                    >
                      {isVerifying ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Shield className="h-4 w-4 mr-2" />
                      )}
                      Verify Proof
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Inline Verification Result */}
              {verificationResult && (
                <Card className={`mb-6 ${
                  verificationResult.valid 
                    ? "border-emerald-500/30 bg-emerald-500/5" 
                    : "border-red-500/30 bg-red-500/5"
                }`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      {verificationResult.valid ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="h-6 w-6 text-red-400" />
                      )}
                      <div>
                        <p className={`font-semibold ${verificationResult.valid ? "text-emerald-400" : "text-red-400"}`}>
                          {verificationResult.status.toUpperCase()}
                        </p>
                        <p className="text-sm text-muted-foreground">{verificationResult.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Share Token */}
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">Share Token</h3>
                      <p className="text-sm text-muted-foreground">
                        Generate a time-limited token for sharing (masked)
                      </p>
                    </div>
                    {!shareToken ? (
                      <Button onClick={handleGenerateShareToken}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Generate Token
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <code className="px-3 py-2 bg-muted rounded text-sm font-mono">
                          {shareToken.slice(0, 8)}...{shareToken.slice(-4)}
                        </code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(shareToken, "token")}>
                          {copiedItem === "token" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps Panel */}
              <Card className="mb-6 border-primary/30 bg-primary/5">
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

              <Button variant="outline" onClick={reset}>
                Run Another Decision
              </Button>
            </>
          )}
        </main>

        {/* Bottom padding */}
        <div className="h-8" />
      </div>
    </>
  );
};

export default DemoDecision;
