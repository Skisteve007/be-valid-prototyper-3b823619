import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Upload, 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Copy,
  Share2,
  FileCheck,
  Sparkles,
  Clock,
  Shield,
  Zap
} from "lucide-react";
import { 
  runGovernanceWithProgress, 
  generateShareToken as genToken,
  type Tier,
  type TraceStep,
  type ProofRecord,
  type GovernanceResult,
  DEMO_MODE
} from "@/lib/demoGovernanceEngine";
import DemoEnvironmentNotice from "@/components/demos/DemoEnvironmentNotice";
import TierAwareCTA from "@/components/demos/TierAwareCTA";

type VerdictStatus = "idle" | "uploading" | "processing" | "complete";
type Verdict = "CERTIFIED" | "MISTRIAL";

interface Issue {
  severity: "high" | "medium" | "low";
  description: string;
  checkpoint: string;
}

const pipelineIcons: Record<string, typeof Upload> = {
  "Input Validation": Upload,
  "Governance Pipeline": Shield,
  "Multi-Model Checks": FileCheck,
  "Red Team Check": Zap,
  "Arbitration": Zap,
  "Output + Proof": Sparkles,
};

const DemoUploadVerdict = () => {
  const [status, setStatus] = useState<VerdictStatus>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>([]);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [proofRecord, setProofRecord] = useState<ProofRecord | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selectedTier] = useState<Tier>(2); // Default to Tier 2 for Upload demo

  const runPipeline = async (name: string, content: string) => {
    setFileName(name);
    setStatus("uploading");
    setCurrentStep(0);
    setTraceSteps([]);
    setVerdict(null);
    setProofRecord(null);
    setReasons([]);
    setShareToken(null);

    // Simulate upload delay
    await new Promise(r => setTimeout(r, 800));
    setStatus("processing");

    try {
      const result = await runGovernanceWithProgress(
        selectedTier,
        "upload",
        "generic",
        content || name,
        (stepIndex, step) => {
          setCurrentStep(stepIndex);
          setTraceSteps(prev => {
            const newSteps = [...prev];
            newSteps[stepIndex] = step;
            return newSteps;
          });
        }
      );

      setVerdict(result.verdict);
      setReasons(result.reasons);
      setProofRecord(result.proof_record);
      setStatus("complete");
    } catch (error) {
      toast.error("Pipeline processing failed");
      setStatus("idle");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Demo limit: 10MB max");
        return;
      }
      // Read file content for deterministic verdict
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string || file.name;
        runPipeline(file.name, content);
      };
      reader.readAsText(file);
    }
  };

  const useSampleReport = () => {
    runPipeline("Sample_10_Page_Report.pdf", "sample-report-content-demo");
  };

  const generateShareToken = () => {
    const token = genToken();
    setShareToken(token);
    toast.success("Share token generated (valid 24 hours)");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const reset = () => {
    setStatus("idle");
    setCurrentStep(0);
    setTraceSteps([]);
    setVerdict(null);
    setProofRecord(null);
    setReasons([]);
    setShareToken(null);
    setFileName("");
  };

  return (
    <>
      <Helmet>
        <title>Demo E — Upload & Verdict | Valid™</title>
        <meta name="description" content="Upload a document and receive a governed verdict with proof record." />
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
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/50 text-primary">
                DEMO E — UPLOAD & VERDICT
              </Badge>
              {DEMO_MODE && (
                <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-xs">
                  DEMO MODE
                </Badge>
              )}
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Intro */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
              <Upload className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Document Governance</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Upload & Verdict</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Drop a PDF or report. Our governance pipeline will process it and return a verdict with a verifiable proof record.
            </p>
          </div>

          {/* Upload Area */}
          {status === "idle" && (
            <Card className="mb-8 border-dashed border-2 border-primary/30 bg-primary/5">
              <CardContent className="pt-8 pb-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Upload a Document</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    PDF, DOCX, or TXT • Max 10MB • Demo-safe (no real PII required)
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Button asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </label>
                    <Button variant="outline" onClick={useSampleReport}>
                      <FileText className="h-4 w-4 mr-2" />
                      Use Sample 10-Page Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing View */}
          {(status === "uploading" || status === "processing") && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Processing: {fileName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {traceSteps.map((step, i) => {
                    const IconComponent = pipelineIcons[step.label] || Shield;
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          step.status === "complete" ? "bg-emerald-500/20" :
                          step.status === "running" ? "bg-primary/20 animate-pulse" :
                          "bg-muted"
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            step.status === "complete" ? "text-emerald-400" :
                            step.status === "running" ? "text-primary" :
                            "text-muted-foreground"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            step.status !== "pending" ? "text-foreground" : "text-muted-foreground"
                          }`}>
                            {step.label}
                          </p>
                          {step.status === "running" && (
                            <Progress value={75} className="h-1 mt-1" />
                          )}
                          {step.status === "complete" && (
                            <p className="text-xs text-muted-foreground">{step.ms}ms</p>
                          )}
                        </div>
                        {step.status === "complete" && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results View */}
          {status === "complete" && verdict && proofRecord && (
            <>
              {/* Verdict Card */}
              <Card className={`mb-6 ${
                verdict === "CERTIFIED" 
                  ? "border-emerald-500/50 bg-emerald-500/5" 
                  : "border-red-500/50 bg-red-500/5"
              }`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-full ${
                      verdict === "CERTIFIED" ? "bg-emerald-500/20" : "bg-red-500/20"
                    }`}>
                      {verdict === "CERTIFIED" ? (
                        <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${
                        verdict === "CERTIFIED" ? "text-emerald-400" : "text-red-400"
                      }`}>
                        {verdict}
                      </h2>
                      <p className="text-sm text-muted-foreground">{fileName}</p>
                    </div>
                  </div>
                  
                  <DemoEnvironmentNotice variant="inline" />
                </CardContent>
              </Card>

              {/* Reasons List */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                    Governance Findings ({reasons.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reasons.map((reason, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className={`p-1 rounded-full ${
                          verdict === "MISTRIAL" ? "bg-red-500/20" : "bg-emerald-500/20"
                        }`}>
                          {verdict === "MISTRIAL" ? (
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          )}
                        </div>
                        <p className="text-sm text-foreground">{reason}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Proof Record */}
              <Card className="mb-6 border-cyan-500/30 bg-cyan-500/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-cyan-400" />
                    Proof Record
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Proof ID</p>
                      <p className="font-mono text-foreground text-xs">{proofRecord.proof_id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Input Hash</p>
                      <p className="font-mono text-foreground text-xs truncate">{proofRecord.input_hash}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Issued At</p>
                        <p className="text-foreground">{new Date(proofRecord.issued_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Expires At</p>
                        <p className="text-foreground">{new Date(proofRecord.expires_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Policy Pack Version</p>
                      <p className="font-mono text-foreground">{proofRecord.policy_pack_version}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Signature</p>
                      <p className="font-mono text-foreground text-xs truncate">{proofRecord.signature}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(JSON.stringify(proofRecord, null, 2), "Proof record")}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Record
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Share Token */}
              <Card className="mb-8">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-foreground">Share This Result</h3>
                      <p className="text-sm text-muted-foreground">
                        Generate a time-limited token to share without exposing underlying data
                      </p>
                    </div>
                    {!shareToken ? (
                      <Button onClick={generateShareToken}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Generate Share Token
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <code className="px-3 py-2 bg-muted rounded text-sm font-mono">{shareToken}</code>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(shareToken, "Share token")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button variant="outline" onClick={reset} className="mb-8">
                Process Another Document
              </Button>
            </>
          )}

          {/* Tier-Aware CTA Section */}
          <TierAwareCTA tier={selectedTier} />

          {/* Footer Notice */}
          <div className="text-center mt-8">
            <DemoEnvironmentNotice variant="footer" />
          </div>
        </main>
      </div>
    </>
  );
};

export default DemoUploadVerdict;
