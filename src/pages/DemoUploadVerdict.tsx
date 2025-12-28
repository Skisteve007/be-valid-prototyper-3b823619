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
  ArrowRight,
  Copy,
  Share2,
  FileCheck,
  Sparkles,
  Clock,
  Shield,
  Zap
} from "lucide-react";

type VerdictStatus = "idle" | "uploading" | "processing" | "complete";
type Verdict = "CERTIFIED" | "MISTRIAL";

interface ProofRecord {
  id: string;
  hash: string;
  issuedAt: string;
  expiresAt: string;
  verdict: Verdict;
}

interface Issue {
  severity: "high" | "medium" | "low";
  description: string;
  checkpoint: string;
}

const pipelineSteps = [
  { id: "input", label: "Input Validation", icon: Upload },
  { id: "governance", label: "Governance Pipeline", icon: Shield },
  { id: "checks", label: "Multi-Model Checks", icon: FileCheck },
  { id: "arbitration", label: "Arbitration", icon: Zap },
  { id: "output", label: "Output + Proof", icon: Sparkles },
];

const sampleIssues: Issue[] = [
  { severity: "medium", description: "Unverified claim detected on page 3", checkpoint: "fact-check" },
  { severity: "low", description: "Formatting inconsistency in section 2", checkpoint: "style-check" },
  { severity: "high", description: "Potential policy violation in conclusion", checkpoint: "policy-check" },
];

const DemoUploadVerdict = () => {
  const [status, setStatus] = useState<VerdictStatus>("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [proofRecord, setProofRecord] = useState<ProofRecord | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [shareToken, setShareToken] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const simulatePipeline = async (name: string) => {
    setFileName(name);
    setStatus("uploading");
    setCurrentStep(0);
    setVerdict(null);
    setProofRecord(null);
    setIssues([]);
    setShareToken(null);

    // Simulate upload
    await new Promise(r => setTimeout(r, 800));
    setStatus("processing");

    // Simulate each pipeline step
    for (let i = 0; i < pipelineSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
    }

    // Generate result
    const isCertified = Math.random() > 0.3;
    const finalVerdict: Verdict = isCertified ? "CERTIFIED" : "MISTRIAL";
    
    setVerdict(finalVerdict);
    setIssues(isCertified ? sampleIssues.slice(0, 2) : sampleIssues);
    setProofRecord({
      id: `proof_${Date.now().toString(36)}`,
      hash: `sha256:${Array.from({ length: 16 }, () => Math.random().toString(16).slice(2, 4)).join("")}`,
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      verdict: finalVerdict,
    });
    setStatus("complete");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Demo limit: 10MB max");
        return;
      }
      simulatePipeline(file.name);
    }
  };

  const useSampleReport = () => {
    simulatePipeline("Sample_10_Page_Report.pdf");
  };

  const generateShareToken = () => {
    const token = `vld_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
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
    setVerdict(null);
    setProofRecord(null);
    setIssues([]);
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
            <Badge variant="outline" className="border-primary/50 text-primary">
              DEMO E — UPLOAD & VERDICT
            </Badge>
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
                  {pipelineSteps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        i < currentStep ? "bg-emerald-500/20" :
                        i === currentStep ? "bg-primary/20 animate-pulse" :
                        "bg-muted"
                      }`}>
                        <step.icon className={`h-5 w-5 ${
                          i < currentStep ? "text-emerald-400" :
                          i === currentStep ? "text-primary" :
                          "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          i <= currentStep ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {step.label}
                        </p>
                        {i === currentStep && (
                          <Progress value={75} className="h-1 mt-1" />
                        )}
                      </div>
                      {i < currentStep && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      )}
                    </div>
                  ))}
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
                  
                  <div className="text-sm text-muted-foreground">
                    {verdict === "CERTIFIED" 
                      ? "Document passed governance checks with minor issues noted."
                      : "Document flagged for review. Critical issues require attention."}
                  </div>
                </CardContent>
              </Card>

              {/* Issues List */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                    Issues Identified ({issues.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className={`p-1 rounded-full ${
                          issue.severity === "high" ? "bg-red-500/20" :
                          issue.severity === "medium" ? "bg-amber-500/20" :
                          "bg-blue-500/20"
                        }`}>
                          <AlertTriangle className={`h-4 w-4 ${
                            issue.severity === "high" ? "text-red-400" :
                            issue.severity === "medium" ? "text-amber-400" :
                            "text-blue-400"
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{issue.description}</p>
                          <p className="text-xs text-muted-foreground">Checkpoint: {issue.checkpoint}</p>
                        </div>
                        <Badge variant="outline" className={`text-xs ${
                          issue.severity === "high" ? "border-red-500/50 text-red-400" :
                          issue.severity === "medium" ? "border-amber-500/50 text-amber-400" :
                          "border-blue-500/50 text-blue-400"
                        }`}>
                          {issue.severity}
                        </Badge>
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
                      <p className="text-muted-foreground">Record ID</p>
                      <p className="font-mono text-foreground">{proofRecord.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Hash</p>
                      <p className="font-mono text-foreground text-xs truncate">{proofRecord.hash}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Issued At</p>
                        <p className="text-foreground">{new Date(proofRecord.issuedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-muted-foreground">Expires At</p>
                        <p className="text-foreground">{new Date(proofRecord.expiresAt).toLocaleString()}</p>
                      </div>
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

          {/* CTA Section */}
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <FileText className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Ready to Start?</h3>
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

export default DemoUploadVerdict;
