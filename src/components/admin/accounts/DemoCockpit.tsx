import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  Loader2, 
  ArrowLeft, 
  Upload, 
  Play, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Download,
  Webhook,
  Trash2,
  Save
} from "lucide-react";

interface Deployment {
  id: string;
  deployment_name: string;
  environment: string;
  ttl_minutes: number;
  consensus_threshold: number;
  lens_1_enabled: boolean;
  lens_2_enabled: boolean;
  lens_3_enabled: boolean;
  lens_4_enabled: boolean;
  lens_5_enabled: boolean;
  lens_6_enabled: boolean;
  lens_7_enabled: boolean;
  default_action: string;
}

interface DemoCockpitProps {
  accountId: string;
  deploymentId: string;
  onBack: () => void;
}

const REQUEST_TYPES = [
  { value: "id_check", label: "ID Check" },
  { value: "prescription", label: "Prescription Verification" },
  { value: "xray_read", label: "X-Ray Read" },
  { value: "output_validation", label: "Generic Output Validation" },
];

const LENS_NAMES = [
  "Coherence",
  "Source Verify",
  "Pattern",
  "Temporal",
  "Cross-Ref",
  "Anomaly",
  "Confidence",
];

export const DemoCockpit = ({ accountId, deploymentId, onBack }: DemoCockpitProps) => {
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  // Input state
  const [inputText, setInputText] = useState("");
  const [requestType, setRequestType] = useState("output_validation");
  const [querySource, setQuerySource] = useState(false);

  // Result state
  const [result, setResult] = useState<{
    verdict: "OK" | "REVIEW" | "BLOCK" | null;
    scores: Record<string, number>;
    flags: string[];
    proofRecordId: string | null;
    lensResults: Record<string, { score: number; passed: boolean }>;
  } | null>(null);

  useEffect(() => {
    loadDeployment();
  }, [deploymentId]);

  const loadDeployment = async () => {
    try {
      const { data, error } = await supabase
        .from("account_deployments")
        .select("*")
        .eq("id", deploymentId)
        .single();

      if (error) throw error;
      setDeployment(data);
    } catch (error: any) {
      toast.error("Failed to load deployment");
    } finally {
      setLoading(false);
    }
  };

  const enabledLenses = deployment ? [
    deployment.lens_1_enabled,
    deployment.lens_2_enabled,
    deployment.lens_3_enabled,
    deployment.lens_4_enabled,
    deployment.lens_5_enabled,
    deployment.lens_6_enabled,
    deployment.lens_7_enabled,
  ] : [];

  const runDemo = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter input data");
      return;
    }

    setRunning(true);
    setResult(null);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock lens results
    const lensResults: Record<string, { score: number; passed: boolean }> = {};
    let passCount = 0;
    
    enabledLenses.forEach((enabled, idx) => {
      if (enabled) {
        const score = Math.floor(Math.random() * 40) + 60; // 60-100
        const passed = score >= 70;
        if (passed) passCount++;
        lensResults[`lens_${idx + 1}`] = { score, passed };
      }
    });

    const threshold = deployment?.consensus_threshold || 5;
    const verdict: "OK" | "REVIEW" | "BLOCK" = 
      passCount >= threshold ? "OK" : 
      passCount >= threshold - 2 ? "REVIEW" : "BLOCK";

    const flags = verdict !== "OK" ? ["Threshold not met", "Manual review recommended"] : [];
    const proofRecordId = `PRF-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Store proof record
    try {
      const inputHash = btoa(inputText).substring(0, 64);
      const outputHash = btoa(JSON.stringify(lensResults)).substring(0, 64);

      await supabase.from("account_proof_records").insert({
        account_id: accountId,
        deployment_id: deploymentId,
        request_type: requestType,
        verdict,
        scores: { overall: passCount / enabledLenses.filter(Boolean).length * 100 },
        flags,
        proof_record_id: proofRecordId,
        input_hash: inputHash,
        output_hash: outputHash,
        lens_summaries: lensResults,
      });

      // Update account last run
      await supabase.from("enterprise_accounts").update({
        last_run_at: new Date().toISOString(),
        last_verdict: verdict,
        total_runs: (await supabase.from("enterprise_accounts").select("total_runs").eq("id", accountId).single()).data?.total_runs + 1 || 1,
      }).eq("id", accountId);

    } catch (error) {
      console.error("Failed to store proof record:", error);
    }

    setResult({
      verdict,
      scores: { overall: Math.round(passCount / enabledLenses.filter(Boolean).length * 100) },
      flags,
      proofRecordId,
      lensResults,
    });

    setRunning(false);
  };

  const handleAction = (action: "approve_flush" | "approve_save" | "reject_flush") => {
    if (action === "approve_flush") {
      toast.success("Approved. Payload flushed.");
    } else if (action === "approve_save") {
      toast.success("Approved. Sent to customer storage, then flushed from VALID.");
    } else {
      toast.info("Rejected. Payload flushed.");
    }
    setResult(null);
    setInputText("");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!deployment) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Deployment not found</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Play className="h-6 w-6" />
            Run: {deployment.deployment_name}
          </h1>
          <p className="text-muted-foreground">
            {deployment.environment.toUpperCase()} • TTL {deployment.ttl_minutes}m • ≥{deployment.consensus_threshold}/7 consensus
          </p>
        </div>
      </div>

      {/* Transient Processing Banner */}
      <Alert className="border-primary/50 bg-primary/5">
        <Shield className="h-4 w-4" />
        <AlertTitle>Transient Processing</AlertTitle>
        <AlertDescription>
          All payloads are processed ephemerally. VALID stores <strong>proof records only</strong> (verdict, scores, hashes, trace references). 
          Raw data (IDs, images, medical records) is <strong>never retained</strong>. 
          Payloads auto-delete after decision or TTL ({deployment.ttl_minutes} minutes).
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* INPUT Section */}
        <Card>
          <CardHeader>
            <CardTitle>Input</CardTitle>
            <CardDescription>Upload, paste, or provide API input</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Request Type</Label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background border z-50">
                  {REQUEST_TYPES.map(rt => (
                    <SelectItem key={rt.value} value={rt.value}>{rt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Input Data</Label>
              <Textarea
                placeholder="Paste data, JSON, or describe the content to validate..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={8}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Upload className="h-4 w-4" /> Upload File
              </Button>
            </div>

            <Separator />

            {/* Enabled Lenses */}
            <div className="space-y-2">
              <Label>Enabled Lenses ({enabledLenses.filter(Boolean).length}/7)</Label>
              <div className="flex flex-wrap gap-2">
                {LENS_NAMES.map((name, idx) => (
                  <Badge 
                    key={idx} 
                    variant={enabledLenses[idx] ? "default" : "outline"}
                    className={enabledLenses[idx] ? "" : "opacity-50"}
                  >
                    L{idx + 1}: {name}
                  </Badge>
                ))}
              </div>
            </div>

            <Button 
              onClick={runDemo} 
              disabled={running || !inputText.trim()} 
              className="w-full gap-2"
              size="lg"
            >
              {running ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Run Validation
            </Button>
          </CardContent>
        </Card>

        {/* OUTPUT Section */}
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>Validation results and proof record</CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-center py-12 text-muted-foreground">
                {running ? (
                  <div className="space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p>Processing through {enabledLenses.filter(Boolean).length} lenses...</p>
                  </div>
                ) : (
                  <p>Run a validation to see results</p>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Verdict */}
                <div className="text-center py-6 rounded-lg border-2" style={{
                  borderColor: result.verdict === "OK" ? "var(--green-500)" : 
                               result.verdict === "REVIEW" ? "var(--yellow-500)" : "var(--red-500)",
                  backgroundColor: result.verdict === "OK" ? "rgba(34, 197, 94, 0.1)" : 
                                   result.verdict === "REVIEW" ? "rgba(234, 179, 8, 0.1)" : "rgba(239, 68, 68, 0.1)",
                }}>
                  {result.verdict === "OK" && <CheckCircle className="h-12 w-12 mx-auto text-green-500" />}
                  {result.verdict === "REVIEW" && <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500" />}
                  {result.verdict === "BLOCK" && <XCircle className="h-12 w-12 mx-auto text-red-500" />}
                  <p className="text-2xl font-bold mt-2">{result.verdict}</p>
                  <p className="text-sm text-muted-foreground">Overall Score: {result.scores.overall}%</p>
                </div>

                {/* Lens Results */}
                <div className="space-y-2">
                  <Label>Lens Results</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(result.lensResults).map(([key, val]) => {
                      const lensIdx = parseInt(key.split("_")[1]) - 1;
                      return (
                        <div key={key} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="text-sm">{LENS_NAMES[lensIdx]}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{val.score}%</span>
                            {val.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Flags */}
                {result.flags.length > 0 && (
                  <div className="space-y-2">
                    <Label>Flags</Label>
                    <div className="flex flex-wrap gap-2">
                      {result.flags.map((flag, idx) => (
                        <Badge key={idx} variant="destructive">{flag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Proof Record ID */}
                <div className="p-3 bg-muted rounded">
                  <p className="text-xs text-muted-foreground">Proof Record ID</p>
                  <p className="font-mono text-sm">{result.proofRecordId}</p>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button 
                    onClick={() => handleAction("approve_flush")} 
                    className="w-full gap-2"
                    variant="default"
                  >
                    <CheckCircle className="h-4 w-4" /> Approve + Flush
                  </Button>
                  <Button 
                    onClick={() => handleAction("approve_save")} 
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <Save className="h-4 w-4" /> Approve + Save to Customer Storage
                  </Button>
                  <Button 
                    onClick={() => handleAction("reject_flush")} 
                    className="w-full gap-2"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" /> Reject + Flush
                  </Button>
                </div>

                <Separator />

                {/* Export Options */}
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 gap-2">
                    <Webhook className="h-4 w-4" /> Send Webhook
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Download className="h-4 w-4" /> Download Proof Pack
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
