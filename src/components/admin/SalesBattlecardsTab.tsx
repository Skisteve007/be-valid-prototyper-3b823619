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
