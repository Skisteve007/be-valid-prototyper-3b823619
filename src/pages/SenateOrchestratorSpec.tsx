import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Download, Lock, Cpu, Scale, AlertTriangle, Database, Settings, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";

const ADMIN_EMAILS = [
  "larry@cleancheck.com",
  "larryblankson@gmail.com",
  "jamesumner@gmail.com"
];

const SenateOrchestratorSpec = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
        setIsAdmin(true);
      } else {
        toast.error("Admin access required");
        navigate("/admin/login");
      }
      setIsLoading(false);
    };
    checkAdmin();
  }, [navigate]);

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;
    const lineHeight = 6;
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("SENATE ORCHESTRATOR SPEC (INTERNAL)", margin, yPosition);
    yPosition += lineHeight * 2;

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("Doc ID: SYNTH-SENATE-SPEC-002 | Status: Internal Engineering Spec (Prototype)", margin, yPosition);
    yPosition += lineHeight * 2;

    const sections = [
      { title: "1) Non-Negotiables", content: "• No Over-Claims: No SOC2/HIPAA/ISO/patents unless verifiable\n• Auditability: Every session produces replayable transcript\n• Fail-Closed Option: Low confidence → DEFERRED response\n• Vendor Independence: Models pluggable via config\n• Cost & Safety Controls: Hard budgets for time/tokens/calls" },
      { title: "2) Architecture Modules", content: "• Intake Gateway → ChallengePacket\n• Dispatcher → Parallel Senators\n• Contradiction Engine → Conflict detection\n• Judge → Final arbitration\n• Audit Logger → Append-only + redaction\n• Policy Engine → Claim boundaries" },
      { title: "3) Config Layer", content: "All providers defined in registry: provider, model, endpoint, API key ref, max tokens, timeout, cost estimate, role suitability (judge/senator/summarizer)" },
      { title: "4) ChallengePacket", content: "Fields: challenge_id, created_at, domain, priority, prompt, constraints, success_criteria, inputs, budget (max_rounds, max_senators, max_tokens, max_cost, timeout)" },
      { title: "5) Senator Output Schema", content: "Required: role, claims[], assumptions[], evidence_needed[], risks[], recommendation, counterarguments[], citations[], notes" },
      { title: "6) Contradiction Engine", content: "Detect: opposite claims with high confidence (>=0.65), critical risk omissions. Output: conflicts list. Round 2: only conflicting senators respond." },
      { title: "7) Judge Output", content: "final_decision, rationale, dissent, conditions, unknowns, next_actions, confidence_0_1, safety_language" },
      { title: "8) Cost Controls", content: "Respect budgets, reduce senators/tokens if over budget, hard timeouts, optional caching" },
      { title: "9) Security", content: "API keys in secret manager, PII redaction, configurable retention, admin-only UI" },
      { title: "10) MVP Definition", content: "1) Intake creates ChallengePacket\n2) 3+ senators return schema-valid JSON\n3) Contradictions detected, Round 2 runs\n4) Judge outputs decision with dissent\n5) Transcript saved and viewable" }
    ];

    sections.forEach(section => {
      if (yPosition > 260) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.text(section.title, margin, yPosition);
      yPosition += lineHeight * 1.3;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      const lines = pdf.splitTextToSize(section.content, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > 280) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += lineHeight * 0.5;
    });

    pdf.save("senate-orchestrator-spec-internal.pdf");
    toast.success("PDF downloaded");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Verifying access...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/admin" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
          <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download as PDF
          </Button>
        </div>

        {/* Document Header */}
        <Card className="bg-slate-900/50 border-slate-700 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="h-8 w-8 text-purple-400" />
              <h1 className="text-2xl font-bold text-white">SENATE ORCHESTRATOR SPEC</h1>
              <Badge variant="outline" className="text-red-400 border-red-400/50">
                <Lock className="h-3 w-3 mr-1" />
                Admin Only
              </Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <Badge variant="secondary">Doc ID: SYNTH-SENATE-SPEC-002</Badge>
              <Badge variant="secondary">Status: Internal Engineering Spec</Badge>
            </div>
            <p className="text-slate-400 mt-3 text-sm">
              Replace the CEO/human message bus with a governed, auditable, cost-controlled multi-model deliberation pipeline.
            </p>
          </CardContent>
        </Card>

        {/* Document Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          {/* Section 1: Non-Negotiables */}
          <section>
            <h2 className="text-xl font-bold text-red-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              1) Non-Negotiables (Ass-Covering Rules)
            </h2>
            <div className="grid gap-3 mt-4">
              {[
                { label: "No Over-Claims", desc: "No SOC2/HIPAA/ISO/patents unless verifiable artifacts exist" },
                { label: "Auditability", desc: "Every session produces a replayable transcript and final decision record" },
                { label: "Fail-Closed Option", desc: 'If confidence is low → "DEFERRED: Insufficient certainty. Required evidence: X."' },
                { label: "Vendor Independence", desc: "Models are pluggable via config; no hard-coded vendor logic" },
                { label: "Cost & Safety Controls", desc: "Hard budgets for time, tokens, and number of model calls per session" }
              ].map((rule, i) => (
                <div key={i} className="bg-red-950/30 border border-red-900/50 rounded-lg p-3">
                  <span className="font-semibold text-red-300">{rule.label}:</span>
                  <span className="text-slate-300 ml-2">{rule.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Architecture */}
          <section>
            <h2 className="text-xl font-bold text-purple-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              2) Architecture (Minimum Viable Orchestrator)
            </h2>
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              {[
                { name: "Intake Gateway", desc: "Creates canonical ChallengePacket" },
                { name: "Dispatcher", desc: "Fans out to Senators in parallel" },
                { name: "Contradiction Engine", desc: "Detects conflicts & triggers Round 2" },
                { name: "Judge", desc: "Produces final arbitrated output" },
                { name: "Audit Logger", desc: "Append-only log + redaction + retention" },
                { name: "Policy Engine", desc: "Enforces claim boundaries + allowed actions" }
              ].map((mod, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <span className="font-semibold text-purple-300">{mod.name}</span>
                  <span className="text-slate-400 text-sm ml-2">→ {mod.desc}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Config Layer */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              3) Configuration Layer (Swappable Models)
            </h2>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 mt-4">
              <p className="text-slate-300 mb-3">All model providers defined in a config registry:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {["provider", "model name/version", "endpoint URL", "API key ref", "max tokens", "timeout seconds", "cost per 1k tokens", "role suitability"].map((field, i) => (
                  <code key={i} className="bg-slate-700 px-2 py-1 rounded text-cyan-300">{field}</code>
                ))}
              </div>
              <p className="text-amber-400 text-sm mt-3 font-medium">
                Requirement: Orchestrator must replace any model without code changes beyond config.
              </p>
            </div>
          </section>

          {/* Section 4: ChallengePacket */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              <Database className="h-5 w-5" />
              4) ChallengePacket (Canonical Input)
            </h2>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 mt-4 font-mono text-sm">
              <pre className="text-slate-300 overflow-x-auto">{`{
  "challenge_id": "uuid",
  "created_at": "ISO",
  "domain": "finance|security|product|legal|...",
  "priority": "low|med|high",
  "prompt": "string",
  "constraints": [],
  "success_criteria": [],
  "inputs": [],
  "budget": {
    "max_rounds": 2,
    "max_senators": 5,
    "max_total_tokens": number,
    "max_total_cost_usd_estimate": number,
    "timeout_seconds_total": number
  }
}`}</pre>
            </div>
          </section>

          {/* Section 5: Senator Output */}
          <section>
            <h2 className="text-xl font-bold text-cyan-400 border-b border-slate-700 pb-2">5) Senator Output Schema (Strict)</h2>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 mt-4 font-mono text-sm">
              <pre className="text-slate-300 overflow-x-auto">{`{
  "role": "string",
  "claims": [{ "claim": "string", "confidence_0_1": 0.9 }],
  "assumptions": ["string"],
  "evidence_needed": ["string"],
  "risks": [{ "risk": "string", "severity_low_med_high": "med" }],
  "recommendation": "string",
  "counterarguments": ["string"],
  "citations": [{ "title": "string", "url": "string" }],
  "notes": "string (optional)"
}`}</pre>
            </div>
            <p className="text-amber-400 text-sm mt-2">
              Rule: Non-matching schema is rejected and retried once with a "format correction" prompt.
            </p>
          </section>

          {/* Section 6: Contradiction Engine */}
          <section>
            <h2 className="text-xl font-bold text-orange-400 border-b border-slate-700 pb-2">6) Contradiction Engine</h2>
            <div className="space-y-3 mt-4">
              <div className="bg-orange-950/30 border border-orange-900/50 rounded-lg p-4">
                <h4 className="font-semibold text-orange-300 mb-2">Detect conflicts when:</h4>
                <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                  <li>Two claims refer to same concept but opposite stance</li>
                  <li>Confidence high on both sides (≥ 0.65) AND disagreement exists</li>
                  <li>One flags "critical risk" and another omits it</li>
                </ul>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">Output:</h4>
                <code className="text-cyan-300 text-sm">conflicts: [{"{ topic, senator_a, senator_b, conflict_question }"}]</code>
              </div>
            </div>
          </section>

          {/* Section 7: Judge */}
          <section>
            <h2 className="text-xl font-bold text-amber-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              <Scale className="h-5 w-5" />
              7) Judge (Arbitration + Bias Control)
            </h2>
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 mt-4 font-mono text-sm">
              <pre className="text-slate-300 overflow-x-auto">{`{
  "final_decision": "one paragraph",
  "rationale": ["bullets"],
  "dissent": "who disagreed + why",
  "conditions": "what must be true",
  "unknowns": "what we don't know",
  "next_actions": ["task list"],
  "confidence_0_1": 0.85,
  "safety_language": "approved phrasing"
}`}</pre>
            </div>
            <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-3 mt-3">
              <span className="font-semibold text-amber-300">Bias control:</span>
              <span className="text-slate-300 ml-2">For high-stakes domains, rotate judge between 2+ models OR run a meta-check</span>
            </div>
          </section>

          {/* Section 10: MVP */}
          <section>
            <h2 className="text-xl font-bold text-green-400 border-b border-slate-700 pb-2 flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              10) MVP Definition (What "Done" Means)
            </h2>
            <div className="space-y-2 mt-4">
              {[
                "Intake creates ChallengePacket",
                "3+ senators run in parallel and return schema-valid JSON",
                "Contradictions are detected and Round 2 runs when needed",
                "Judge outputs final decision with dissent + confidence",
                "Transcript is saved and viewable in admin UI"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-green-950/30 border border-green-900/50 rounded-lg p-3">
                  <span className="text-green-400 font-bold">{i + 1}</span>
                  <span className="text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Think Tank Origin */}
          <section className="border-t border-slate-700 pt-6">
            <h2 className="text-lg font-bold text-slate-400 mb-3">Think Tank Origin</h2>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-900/50 text-blue-300">DeepSeek: Original Blueprint</Badge>
              <Badge className="bg-purple-900/50 text-purple-300">Grok: Practical Critique</Badge>
              <Badge className="bg-green-900/50 text-green-300">GPT/Copilot: Liability-Safe Refinements</Badge>
            </div>
            <p className="text-slate-500 mt-3 text-sm italic">
              Philosophy: Governance becomes infrastructure. The human is the overseer, not the router.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SenateOrchestratorSpec;
