import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { 
  Copy, ChevronDown, MessageSquare, Clock, Target, Shield, 
  Lock, Eye, Activity, FileSearch, Database, Server, 
  AlertTriangle, Check, Zap
} from "lucide-react";

const fieldScript = {
  opener: `"We're not asking you to replace your stack or hand over databases. We run side-by-side and decide whether AI outputs are safe to release. We output CERTIFIED or MISTRIAL, with a defensible audit record."`,
  
  explainer: `"Your tools—Okta, Purview, Arize, Splunk—do great work controlling access, protecting data, and monitoring drift. But none of them answer the question: 'Is this AI output safe to release?' 

We add a last-mile release gate. Every output goes through multi-model consensus, contradiction checks, and policy enforcement. If it passes, we stamp it CERTIFIED. If it fails, we issue a MISTRIAL and block release. 

The audit record is tamper-evident and court-ready. Deploy in 45 days, side-by-side, no data handoff."`,
  
  killerQuestions: [
    "Where is your last-mile release gate for AI outputs?",
    "Do you produce an audit record per output that legal can use?",
    "Do your guardrails validate truth or only policy content?",
    "What's your stop condition (MISTRIAL) today?",
    "How do you enforce compliance rules deterministically?",
    "Can you run on-prem / in your cloud?",
    "How do you handle stale verification and revocation?",
    "Who owns liability when the model is wrong?",
    "How long does a new safety layer take to deploy—45 days or 3 months?",
    "What are your top 20 'never events'?",
  ],
  
  close: "Ready for a 45-day side-by-side proof? No rip-and-replace. No data custody shift. Just shadow mode, then active veto, then go-live with audit trail.",
};

const competitiveCategories = [
  {
    id: "identity",
    name: "Identity & Access",
    icon: Lock,
    vendors: ["Okta", "Azure AD", "Ping", "CyberArk"],
    theyClaim: "We control who accesses AI and what they can do.",
    theTrap: "Access control ≠ output control. A valid user can still receive a hallucinated or non-compliant response.",
    pivotLine: "Great—you control who asks. We control what ships. Different layers, same stack.",
    proofMetric: "Reduce unverified AI outputs to zero within 45 days.",
  },
  {
    id: "dlp",
    name: "DLP / PII Protection",
    icon: Shield,
    vendors: ["Microsoft Purview", "Netskope", "Prisma", "Symantec DLP"],
    theyClaim: "We prevent sensitive data from leaking out of the org.",
    theTrap: "DLP protects data, not outcomes. A model can still give dangerous advice that contains no PII.",
    pivotLine: "You protect what goes out. We decide if it should go out. Release gate vs. content filter.",
    proofMetric: "Block 100% of policy-violating AI advice before user delivery.",
  },
  {
    id: "monitoring",
    name: "Model Monitoring / AI Governance",
    icon: Activity,
    vendors: ["Arize", "WhyLabs", "Fiddler", "TruEra", "Arthur"],
    theyClaim: "We observe model drift, quality trends, and fairness metrics.",
    theTrap: "Observation ≠ enforcement. Monitoring tells you something went wrong after it shipped.",
    pivotLine: "You watch the trend. We stop the bad output in real time. Monitoring + enforcement = complete.",
    proofMetric: "Real-time veto on outputs that fail verification, with audit trail per decision.",
  },
  {
    id: "guardrails",
    name: "Guardrails / Moderation",
    icon: Eye,
    vendors: ["Bedrock Guardrails", "Azure Content Safety", "Vertex Safety"],
    theyClaim: "We filter harmful, toxic, or policy-violating content.",
    theTrap: "Content moderation ≠ truth verification. A polite, policy-compliant hallucination still passes.",
    pivotLine: "You filter what's bad. We verify what's true. Adversarial verification > content moderation.",
    proofMetric: "Detect factual contradictions and halt delivery before user sees it.",
  },
  {
    id: "siem",
    name: "SIEM / Logging",
    icon: FileSearch,
    vendors: ["Splunk", "Sentinel", "CrowdStrike"],
    theyClaim: "We detect incidents and provide forensic logs for investigation.",
    theTrap: "SIEM is post-hoc. By the time you detect the incident, the bad output already shipped.",
    pivotLine: "You investigate after. We prevent before. And we still give you the audit log.",
    proofMetric: "Zero bad outputs shipped; SIEM receives structured decision logs for compliance.",
  },
  {
    id: "etl",
    name: "ETL / Integration",
    icon: Database,
    vendors: ["MuleSoft", "Informatica", "Boomi", "dbt"],
    theyClaim: "We move and transform data reliably across systems.",
    theTrap: "ETL governs structured data pipelines. AI outputs are unstructured and unpredictable.",
    pivotLine: "You govern data flows. We govern AI decisions. Same philosophy, different domain.",
    proofMetric: "Liability shield for every AI-generated record entering your systems.",
  },
];

const objections = [
  {
    id: "dlp",
    objection: "We already have DLP.",
    response: "DLP prevents data exfiltration. We prevent bad advice exfiltration. Different risk, same principle. We run side-by-side—no conflict.",
  },
  {
    id: "guardrails",
    objection: "We already use guardrails.",
    response: "Guardrails filter policy violations. We verify truth. A polite hallucination passes guardrails but fails us. Complementary layers.",
  },
  {
    id: "monitoring",
    objection: "We already monitor models.",
    response: "Monitoring observes; we enforce. You'll still use Arize for drift—add us for real-time veto. Observability + enforcement = governance.",
  },
  {
    id: "build",
    objection: "We can build this ourselves.",
    response: "You could. But multi-model consensus, adversarial verification, tamper-evident audit, and revocation logic is 18 months of R&D. We deploy in 45 days.",
  },
  {
    id: "data",
    objection: "We can't share data.",
    response: "We don't need your data. We're a conduit—requests flow through, we verify, we return. No data custody shift. On-prem option if needed.",
  },
  {
    id: "legal",
    objection: "Legal won't approve.",
    response: "Legal will love us. We produce court-ready audit records, deterministic policy enforcement, and a paper trail for every AI decision. Bring us to legal together.",
  },
  {
    id: "procurement",
    objection: "Procurement takes 6 months.",
    response: "Start with a 45-day pilot. Shadow mode first—no production risk. If it works, procurement has proof. If not, you've lost nothing.",
  },
];

const proofSprint = [
  { day: "Day 1", task: "Connect", desc: "API integration, no data handoff" },
  { day: "Day 1–15", task: "Map Red Lines", desc: "Define 'never events' and policy rules" },
  { day: "Day 16–30", task: "Shadow Mode", desc: "Log only, no disruption to production" },
  { day: "Day 31–45", task: "Active Veto → Go-Live", desc: "Enforce decisions, deliver audit trail" },
];

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied to clipboard`);
};

export function SalesBattlecardsTab() {
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [openObjections, setOpenObjections] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleObjection = (id: string) => {
    setOpenObjections((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            Sales Battlecards
          </h2>
          <p className="text-muted-foreground">
            Internal training: scripts, competitive positioning, and objection handling
          </p>
        </div>
        <Badge variant="outline" className="text-orange-400 border-orange-400/50">
          Internal Only
        </Badge>
      </div>

      {/* Field Script Section */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Field Script
          </CardTitle>
          <CardDescription>
            Memorize these talking points for buyer conversations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 30-Second Opener */}
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-emerald-400">30-Second Opener</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(fieldScript.opener, "Opener")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-foreground italic">{fieldScript.opener}</p>
          </div>

          {/* 2-Minute Explainer */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                <span className="font-semibold text-blue-400">2-Minute Explainer</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(fieldScript.explainer, "Explainer")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-foreground whitespace-pre-line">{fieldScript.explainer}</p>
          </div>

          {/* 10 Killer Questions */}
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-amber-400" />
                <span className="font-semibold text-amber-400">10 Killer Questions</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  copyToClipboard(fieldScript.killerQuestions.join("\n"), "Questions")
                }
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <ol className="text-sm text-foreground space-y-1.5 list-decimal list-inside">
              {fieldScript.killerQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </div>

          {/* Close */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">The Close</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(fieldScript.close, "Close")}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-foreground">{fieldScript.close}</p>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-orange-400" />
            Competitive Categories
          </CardTitle>
          <CardDescription>
            What they have, what they claim, and how to pivot
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {competitiveCategories.map((cat) => (
            <Collapsible
              key={cat.id}
              open={openCategories.includes(cat.id)}
              onOpenChange={() => toggleCategory(cat.id)}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <cat.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-foreground text-sm">{cat.name}</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {cat.vendors.slice(0, 3).map((v) => (
                          <span
                            key={v}
                            className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground"
                          >
                            {v}
                          </span>
                        ))}
                        {cat.vendors.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[10px] rounded bg-muted text-muted-foreground">
                            +{cat.vendors.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      openCategories.includes(cat.id) ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 p-4 rounded-lg bg-muted/30 border border-border/30 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-blue-400 uppercase tracking-wide">
                      What They Claim
                    </p>
                    <p className="text-sm text-muted-foreground">{cat.theyClaim}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-orange-400 uppercase tracking-wide">
                      The Trap (Gap)
                    </p>
                    <p className="text-sm text-muted-foreground">{cat.theTrap}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-emerald-400 uppercase tracking-wide">
                      Pivot Line (What We Say)
                    </p>
                    <p className="text-sm text-foreground font-medium">{cat.pivotLine}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="mt-1 h-7 text-xs"
                      onClick={() => copyToClipboard(cat.pivotLine, "Pivot line")}
                    >
                      <Copy className="h-3 w-3 mr-1" /> Copy
                    </Button>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary uppercase tracking-wide">
                      Proof Metric
                    </p>
                    <p className="text-sm text-foreground">{cat.proofMetric}</p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>

      {/* Objection Handling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            Objection Handling
          </CardTitle>
          <CardDescription>
            Common pushback and how to respond
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {objections.map((obj) => (
            <Collapsible
              key={obj.id}
              open={openObjections.includes(obj.id)}
              onOpenChange={() => toggleObjection(obj.id)}
            >
              <CollapsibleTrigger asChild>
                <div className="flex items-center justify-between p-3 rounded-lg border border-red-500/20 hover:border-red-500/40 cursor-pointer transition-colors bg-red-500/5">
                  <span className="font-medium text-foreground text-sm">{obj.objection}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      openObjections.includes(obj.id) ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-foreground">{obj.response}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="shrink-0"
                      onClick={() => copyToClipboard(obj.response, "Response")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </CardContent>
      </Card>

      {/* System of Record vs Proof Record */}
      <Card className="border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-400" />
            System of Record vs Proof Record
          </CardTitle>
          <CardDescription>
            How to explain the "Black Box" — what we store vs what we don't
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* What we store */}
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-3">
              <Check className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold text-emerald-400">We Store (Minimal Integrity Artifacts)</span>
            </div>
            <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
              <li>proof_id</li>
              <li>input_hash (hash, not raw content)</li>
              <li>issued_at, expires_at</li>
              <li>policy_pack_version</li>
              <li>verdict + reason codes (optional)</li>
              <li>vendor_reference_ids (pointers only)</li>
            </ul>
          </div>

          {/* What we do NOT store */}
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="font-semibold text-red-400">We Do NOT Store (Source Records)</span>
            </div>
            <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
              <li>Raw PII/PHI documents</li>
              <li>Lab result files</li>
              <li>ID images/scans</li>
              <li>Customer databases</li>
              <li>Full transcripts (unless explicitly configured in the customer's environment under contract)</li>
            </ul>
          </div>

          {/* Field Script */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-blue-400" />
                <span className="font-semibold text-blue-400">Field Script (Say This)</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(
                  `"We're not a database and we're not your IDV/lab provider. Your system (often Supabase/Postgres/Snowflake/Salesforce) remains the system of record. Valid/SYNTH processes only what's needed to compute a decision, then returns a signed Signal Pack plus a verifiable Proof Record—hashes, timestamps, policy version, and vendor reference IDs. If there's a dispute, the raw evidence is retrieved from the original vendor or your system of record using those references."`,
                  "Full rep script"
                )}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-foreground italic">
              "We're not a database and we're not your IDV/lab provider. Your system (often Supabase/Postgres/Snowflake/Salesforce) remains the system of record. Valid/SYNTH processes only what's needed to compute a decision, then returns a signed Signal Pack plus a verifiable Proof Record—hashes, timestamps, policy version, and vendor reference IDs. If there's a dispute, the raw evidence is retrieved from the original vendor or your system of record using those references."
            </p>
          </div>

          {/* Public 2-line version */}
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-amber-400" />
                <span className="font-semibold text-amber-400">Public 2-Line Version</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(
                  "Your systems remain the system of record. Valid/SYNTH returns signed decision signals plus a verifiable proof record (integrity artifacts). Source records (PII/PHI, lab results, ID scans) stay with you and your verification providers—never inside Valid.",
                  "Public 2-line version"
                )}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-foreground">
              Your systems remain the system of record. Valid/SYNTH returns signed decision signals plus a verifiable proof record (integrity artifacts). Source records (PII/PHI, lab results, ID scans) stay with you and your verification providers—never inside Valid.
            </p>
          </div>

          {/* Don't Say This */}
          <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold text-muted-foreground">Don't Say This</span>
            </div>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>"We store your data"</li>
              <li>"We hold the black box" — instead say: "we provide the decision black box / proof record"</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Options (Plain English) */}
      <Card className="border-indigo-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-indigo-400" />
            Deployment Options (Plain English) — Use This Script
          </CardTitle>
          <CardDescription>
            Reduce buyer anxiety with consistent messaging
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* The Simple Script */}
          <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-emerald-400" />
                <span className="font-semibold text-emerald-400">The Simple Script (Say This)</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => copyToClipboard(
                  `"We have two ways to run it. For enterprise, we deploy inside your environment—your systems stay the system of record and raw payloads don't leave your boundary. If you want to move fast, we can start with a hosted pilot using minimized inputs, then migrate in‑VPC for production. Either way, we return signed decision signals plus a verifiable proof record."`,
                  "Deployment script"
                )}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-foreground italic">
              "We have two ways to run it. For enterprise, we deploy inside your environment—your systems stay the system of record and raw payloads don't leave your boundary. If you want to move fast, we can start with a hosted pilot using minimized inputs, then migrate in‑VPC for production. Either way, we return signed decision signals plus a verifiable proof record."
            </p>
          </div>

          {/* One-Line Rule */}
          <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-400" />
              <span className="font-semibold text-blue-400">The One-Line Rule (Repeatable)</span>
            </div>
            <p className="text-sm text-foreground font-medium">
              "Conduit-first by default; hosted pilot is an accelerator—not the end state."
            </p>
          </div>

          {/* Objection Handling */}
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span className="font-semibold text-amber-400">Objection Handling</span>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-foreground">Q: "So you store our data?"</p>
                <p className="text-sm text-muted-foreground mt-1">
                  A: "No. In enterprise mode it runs in your environment. In pilot mode we minimize and purge quickly, and we still don't become your system of record. The proof record is an integrity artifact, not your source data."
                </p>
              </div>
            </div>
          </div>

          {/* Do NOT Say */}
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="font-semibold text-red-400">Do NOT Say</span>
            </div>
            <ul className="text-sm text-foreground space-y-1 list-disc list-inside">
              <li>"We store everything for you"</li>
              <li>"We're your database"</li>
              <li>"We hold the black box" (instead: "we provide the decision proof record")</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 45-Day Proof Sprint Checklist */}
      <Card className="border-cyan-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5 text-cyan-400" />
            45-Day Proof Sprint Checklist
          </CardTitle>
          <CardDescription>
            Walk buyers through the deployment timeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {proofSprint.map((step, i) => (
              <div
                key={i}
                className="flex items-start gap-4 p-3 rounded-lg bg-muted/30 border border-border/30"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-bold text-sm shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-cyan-400">{step.day}</span>
                    <span className="font-semibold text-foreground text-sm">{step.task}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                </div>
                <Check className="h-4 w-4 text-muted-foreground/50" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SalesBattlecardsTab;
