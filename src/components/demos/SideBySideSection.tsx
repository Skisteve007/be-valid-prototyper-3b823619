import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Layers, ShieldCheck, Eye, Zap, FileText, ArrowRight, Check, Clock, Play, Lock, Database, Server, Activity, FileSearch } from "lucide-react";
import ContractPreviewDialog from "./ContractPreviewDialog";

const vendorCategories = [
  {
    id: "identity",
    name: "Identity & Access",
    icon: Lock,
    vendors: ["Okta", "Azure AD", "Ping", "CyberArk"],
    does: "Controls access.",
    doesnt: "Prove AI output is true/compliant.",
    weAdd: "Output enforcement + audit record.",
  },
  {
    id: "dlp",
    name: "DLP / PII Protection",
    icon: ShieldCheck,
    vendors: ["Microsoft Purview", "Netskope", "Prisma", "Symantec DLP"],
    does: "Prevents data exfiltration.",
    doesnt: "Stop hallucinations or unsafe advice.",
    weAdd: "Release/Veto gate for outputs.",
  },
  {
    id: "monitoring",
    name: "Model Monitoring / AI Governance",
    icon: Activity,
    vendors: ["Arize", "WhyLabs", "Fiddler", "TruEra", "Arthur"],
    does: "Observes drift and quality trends.",
    doesnt: "Enforce decisions in real time.",
    weAdd: "Real-time enforcement + 'court-ready' decision record.",
  },
  {
    id: "guardrails",
    name: "Guardrails / Moderation",
    icon: Eye,
    vendors: ["Bedrock Guardrails", "Azure Content Safety", "Vertex Safety"],
    does: "Filters policy-violating content.",
    doesnt: "Validate factual correctness.",
    weAdd: "Adversarial verification (CERTIFIED vs MISTRIAL).",
  },
  {
    id: "siem",
    name: "SIEM / Logging",
    icon: FileSearch,
    vendors: ["Splunk", "Sentinel", "CrowdStrike"],
    does: "Detects incidents after the fact.",
    doesnt: "Prevent bad outputs from being released.",
    weAdd: "Prevent release + log the why.",
  },
  {
    id: "etl",
    name: "ETL / Integration",
    icon: Database,
    vendors: ["MuleSoft", "Informatica", "Boomi", "dbt"],
    does: "Moves/transforms data.",
    doesnt: "Govern unstructured AI outputs.",
    weAdd: "Liability Shield for AI decisions.",
  },
];

const proofSteps = [
  {
    step: 1,
    title: "Connect",
    description: "No data handoff; runs next to your stack",
    icon: Server,
  },
  {
    step: 2,
    title: "Shadow Mode",
    description: "Log only, no disruption",
    icon: Eye,
  },
  {
    step: 3,
    title: "Active Veto",
    description: "Go live with audit trail",
    icon: Zap,
  },
];

const sectors = [
  "Enterprise / Fortune 500",
  "Financial Services",
  "Healthcare / Life Sciences",
  "Government / Public Sector",
  "Technology / SaaS",
  "Legal / Professional Services",
  "Manufacturing / Industrial",
  "Other",
];

const SideBySideSection = () => {
  const [isLoiOpen, setIsLoiOpen] = useState(false);
  const [isContractPreviewOpen, setIsContractPreviewOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    signerName: "",
    signerEmail: "",
    sector: "",
    acknowledged: false,
    signature: "",
    signedDate: new Date().toLocaleDateString(),
  });
  const [submitted, setSubmitted] = useState(false);

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const resetModal = () => {
    setStep(1);
    setSubmitted(false);
    setFormData({
      companyName: "",
      signerName: "",
      signerEmail: "",
      sector: "",
      acknowledged: false,
      signature: "",
      signedDate: new Date().toLocaleDateString(),
    });
    setIsLoiOpen(false);
  };

  return (
    <div className="mt-12">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-4">
          <Layers className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">Integration</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Side-by-Side With Your Current Stack</h2>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          We don't replace your vendors. We add a Liability Shield that certifies or vetoes AI outputs and produces an audit record.
        </p>
      </div>

      {/* Vendor Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {vendorCategories.map((cat) => (
          <Card key={cat.id} className="border-border/50 hover:border-primary/30 transition-colors">
            <CardContent className="pt-5 pb-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <cat.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{cat.name}</h3>
              </div>
              
              {/* Vendor Chips */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {cat.vendors.map((v) => (
                  <span key={v} className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                    {v}
                  </span>
                ))}
              </div>

              {/* Does / Doesn't / We Add */}
              <div className="space-y-2 text-xs">
                <div className="flex gap-2">
                  <span className="text-emerald-400 font-medium shrink-0">Does:</span>
                  <span className="text-muted-foreground">{cat.does}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-orange-400 font-medium shrink-0">Doesn't:</span>
                  <span className="text-muted-foreground">{cat.doesnt}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-medium shrink-0">We add:</span>
                  <span className="text-foreground">{cat.weAdd}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Our Advantage Strip */}
      <Card className="border-primary/30 bg-primary/5 mb-8">
        <CardContent className="py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1">Monitoring ≠ Enforcement</h3>
              <p className="text-sm text-muted-foreground">The gap no one else fills</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-foreground">Your tools observe. We decide: <span className="font-semibold text-primary">CERTIFIED</span> or <span className="font-semibold text-destructive">MISTRIAL</span>.</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-foreground">Your tools protect data. We protect <span className="font-semibold">outcomes</span>.</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary shrink-0" />
                <span className="text-sm text-foreground">Deploy side-by-side in <span className="font-semibold">45 days</span>.</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 45-Day Proof Sprint Box */}
      <Card className="border-cyan-500/30 bg-cyan-500/5 mb-8">
        <CardContent className="py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <Clock className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">45-Day Side-by-Side Proof</h3>
              <p className="text-sm text-muted-foreground">Zero-disruption deployment path</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {proofSteps.map((s) => (
              <div key={s.step} className="flex items-start gap-3 p-4 rounded-lg bg-background/50 border border-border/30">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-sm shrink-0">
                  {s.step}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{s.title}</h4>
                  <p className="text-xs text-muted-foreground">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Signature CTA */}
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
              <Button
                onClick={() => setIsLoiOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Sign LOI / Start 45-Day Proof
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => setIsContractPreviewOpen(true)}
              >
                Request Redline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LOI Modal */}
      <Dialog open={isLoiOpen} onOpenChange={setIsLoiOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {submitted ? "Agreement Signed" : `Step ${step} of 3 — ${step === 1 ? "Company Details" : step === 2 ? "Review Agreement" : "Sign"}`}
            </DialogTitle>
            <DialogDescription>
              {submitted
                ? "Your Letter of Intent has been submitted."
                : step === 1
                ? "Provide your company information to proceed."
                : step === 2
                ? "Review the agreement terms below."
                : "Sign to confirm your intent."}
            </DialogDescription>
          </DialogHeader>

          {submitted ? (
            <div className="py-6 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Thank You, {formData.signerName}!</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We've received your signed LOI for {formData.companyName}. Our team will reach out within 24 hours to schedule your kickoff and provide payment instructions.
              </p>
              <Button onClick={resetModal} className="bg-emerald-600 hover:bg-emerald-700">
                Close
              </Button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Acme Corp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signerName">Signer Name</Label>
                    <Input
                      id="signerName"
                      value={formData.signerName}
                      onChange={(e) => setFormData({ ...formData, signerName: e.target.value })}
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signerEmail">Signer Email</Label>
                    <Input
                      id="signerEmail"
                      type="email"
                      value={formData.signerEmail}
                      onChange={(e) => setFormData({ ...formData, signerEmail: e.target.value })}
                      placeholder="jane@acme.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sector">Sector</Label>
                    <Select
                      value={formData.sector}
                      onValueChange={(val) => setFormData({ ...formData, sector: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your sector" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 py-4 max-h-[300px] overflow-y-auto">
                  <div className="p-4 rounded-lg bg-muted/50 text-sm space-y-3">
                    <p className="font-semibold">LETTER OF INTENT — 45-Day Proof Sprint</p>
                    <p>This Letter of Intent ("LOI") is entered into by <span className="font-medium">{formData.companyName || "[Company]"}</span> ("Client") and Valid Technologies LLC ("Valid").</p>
                    <p><strong>1. Scope:</strong> Valid will deploy its SYNTH governance conduit alongside Client's existing AI stack for a 45-day proof-of-concept period.</p>
                    <p><strong>2. Timeline:</strong> Connect (Day 1-7), Shadow Mode (Day 8-30), Active Veto (Day 31-45).</p>
                    <p><strong>3. Deliverables:</strong> Audit trail, decision logs, compliance reports, and proof records for all governed outputs.</p>
                    <p><strong>4. No Replacement:</strong> Valid operates side-by-side with existing vendors. No rip-and-replace required.</p>
                    <p><strong>5. Payment:</strong> Deposit due upon signing; balance per agreed schedule. Details to be confirmed via invoice.</p>
                    <p><strong>6. Confidentiality:</strong> Both parties agree to maintain confidentiality of proprietary information.</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="acknowledged"
                      checked={formData.acknowledged}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, acknowledged: checked as boolean })
                      }
                    />
                    <Label htmlFor="acknowledged" className="text-sm leading-tight">
                      I have read and understand the terms of this Letter of Intent.
                    </Label>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    By typing your name below, you agree to the terms of the Letter of Intent on behalf of {formData.companyName || "your company"}.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="signature">Type Your Full Name to Sign</Label>
                    <Input
                      id="signature"
                      value={formData.signature}
                      onChange={(e) => setFormData({ ...formData, signature: e.target.value })}
                      placeholder="Jane Doe"
                      className="font-serif italic text-lg"
                    />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Date: {formData.signedDate}</span>
                    <span>|</span>
                    <span>Email: {formData.signerEmail || "—"}</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={step === 1 ? () => setIsLoiOpen(false) : handleBack}
                >
                  {step === 1 ? "Cancel" : "Back"}
                </Button>
                <Button
                  onClick={step === 3 ? handleSubmit : handleNext}
                  disabled={
                    (step === 1 && (!formData.companyName || !formData.signerName || !formData.signerEmail || !formData.sector)) ||
                    (step === 2 && !formData.acknowledged) ||
                    (step === 3 && !formData.signature)
                  }
                  className="bg-primary hover:bg-primary/90"
                >
                  {step === 3 ? "Sign & Submit" : "Next"}
                  {step !== 3 && <ArrowRight className="h-4 w-4 ml-2" />}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Contract Preview / Redline Dialog */}
      <ContractPreviewDialog
        open={isContractPreviewOpen}
        onOpenChange={setIsContractPreviewOpen}
        onProceedToSign={() => setIsLoiOpen(true)}
      />
    </div>
  );
};

export default SideBySideSection;
