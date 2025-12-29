import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Copy, Check, BookOpen, MessageSquare, HelpCircle, AlertTriangle, Wrench, Mic } from "lucide-react";
import { toast } from "sonner";

interface PlaybookEntry {
  id: string;
  title: string;
  blocks: {
    title: string;
    content: string;
    icon: React.ReactNode;
  }[];
}

const playbookEntries: PlaybookEntry[] = [
  {
    id: "andrew-ng",
    title: "Andrew Ng Outreach — 1‑Pager + Q&A Prep",
    blocks: [
      {
        title: "Andrew Ng-ready One Pager (email + doc text)",
        icon: <MessageSquare className="h-4 w-4" />,
        content: `Subject: Request for critique — conduit-first AI governance with verifiable proof records

Hi Andrew — I'm Steve (Giant Ventures LLC). I'm building Valid/SYNTH, a conduit-first governance layer for AI-impacted decisions.

**Problem**

Organizations are being exposed (legally and operationally) by unverified AI outputs and untrusted records. Most tools monitor; they don't enforce. Buyers want a system that can be audited and deployed without handing over their data.

**What we built**

Valid/SYNTH is an enforcement + auditability layer that:

1) takes in a claim/event (single or batch),

2) runs a governed verification flow (multiple checks; may abstain),

3) outputs a structured verdict (CERTIFIED / MISTRIAL or ALLOW / BLOCK / FLAG),

4) emits a **verifiable proof record** (tamper-evident receipt) tied to:

   - input hash (not raw payload),
   - policy/version used,
   - timestamps,
   - decision + reason codes,
   - signature for integrity,

5) supports enterprise posture where the runtime can run **inside the customer boundary** (customer-hosted runtime) so raw payloads can remain in their environment.

**What we store (and don't)**

- We do not aim to be the customer's system of record.
- In enterprise mode, raw payloads can stay in-customer boundary.
- We retain only minimal proof artifacts needed for verification (configurable retention).

**Why I'm reaching out**

I'd value your critique on:

- how to define "CERTIFIED" in a defensible way,
- what evaluation framework you'd use (metrics + baselines),
- and what failure modes you think will matter most in real enterprise audits.

If you're open, I can share a short demo link and a redacted proof record example.

Thanks,
Steve

[Email] | [Website/Demo] | [GitHub Showcase]`
      },
      {
        title: "What to expect Andrew to challenge",
        icon: <HelpCircle className="h-4 w-4" />,
        content: `• "How do you define 'CERTIFIED'? What does it actually mean?"
  → Be ready to explain the policy pack concept and that CERTIFIED = all checks passed under stated rules

• "What's your evaluation framework? How do you measure accuracy?"
  → Prepare metrics: precision/recall on decision signals, replay consistency, latency benchmarks

• "What happens when the system is wrong?"
  → Explain MISTRIAL as abstention, audit trail for forensics, and that we don't claim infallibility

• "How is this different from existing guardrails / safety tools?"
  → Emphasize: enforcement (not just monitoring), proof records, customer-boundary deployment

• "Why would enterprises trust another AI layer?"
  → Trust comes from verification, not reputation. Proof records are independently auditable

• "What's your data retention policy?"
  → Minimal artifacts, configurable retention, raw payloads can stay in-customer boundary

• "How do you handle adversarial inputs / jailbreaks?"
  → Multi-agent debate, policy versioning, abstention when confidence is low

• "What's the latency / performance impact?"
  → Be ready with benchmarks (p50, p99 latency for typical payloads)`
      },
      {
        title: "What to ask Andrew (7 questions)",
        icon: <BookOpen className="h-4 w-4" />,
        content: `1. "What evaluation framework would you recommend for a system that produces verdicts (CERTIFIED/MISTRIAL) rather than generative outputs?"

2. "How should we think about defining 'ground truth' for AI governance decisions where the right answer is often contested?"

3. "What failure modes do you think will matter most when enterprises audit AI governance tools?"

4. "How do you see the role of human-in-the-loop for high-stakes decisions — and when is full automation appropriate?"

5. "What would make you trust (or distrust) a proof record from a third-party governance layer?"

6. "How should we balance transparency (showing our work) vs. security (not exposing policy logic to adversaries)?"

7. "If you were advising an enterprise on adopting AI governance, what would be your top 3 due diligence questions?"`
      }
    ]
  },
  {
    id: "andrew-ng-readiness",
    title: "Andrew Ng Challenges — Readiness Package (Holes, Fixes, Proof)",
    blocks: [
      {
        title: "BLOCK 1 — Likely Attack Points (Holes)",
        icon: <AlertTriangle className="h-4 w-4" />,
        content: `• CERTIFIED/MISTRIAL definition is fuzzy → sounds like "truth"

• Ground truth + evaluation dataset missing

• LLM nondeterminism vs reproducibility claims

• "We don't store data" vs what is logged/retained (hashes/traces can still be sensitive)

• Customer-hosted runtime is a promise until packaged

• Threat model (prompt injection, replay, tampering, insiders)

• Defensibility/moat beyond "orchestrating models"`
      },
      {
        title: "BLOCK 2 — Fixes (How we answer cleanly)",
        icon: <Wrench className="h-4 w-4" />,
        content: `• Define CERTIFIED as "meets policy-defined checks with evidence requirements" (not absolute truth)

• Publish/maintain an evaluation plan: baseline comparison + confusion matrix + abstention rate + latency/cost

• Clarify proof record: proves *what happened* (signed receipt) + policy version; reproducibility via trace + bounded nondeterminism

• Add a "What we store / don't store" table + default minimal retention + customer-controlled mode

• Package customer-hosted runtime: container + deploy guide + reference config (even early)

• Threat model statement: signing, key rotation, idempotency, structured IO, access controls

• Moat sentence: "enforcement + verifiable receipts + enterprise boundary deployment + integrations"`
      },
      {
        title: "BLOCK 3 — The 7 Questions to Ask Andrew",
        icon: <HelpCircle className="h-4 w-4" />,
        content: `1) Most defensible definition of CERTIFIED?

2) What evaluation would convince you this is real?

3) What would a CISO/GC demand to believe conduit-first?

4) What failure mode hits first in production?

5) What component should we open-source for credibility?

6) Minimum artifact to call customer-hosted "real"?

7) Where is the moat?`
      },
      {
        title: "BLOCK 4 — Talk Track (1 minute)",
        icon: <Mic className="h-4 w-4" />,
        content: `"We welcome audits because we ship proof records—tamper-evident receipts—rather than asking for trust. CERTIFIED means 'meets policy pack vX evidence requirements,' not absolute truth. Enterprise can run the runtime inside their boundary so raw payloads stay in their environment."`
      }
    ]
  },
  {
    id: "synth-plain-english",
    title: "Synth — Plain-English Explanation (Use in emails, sales calls, and investor meetings)",
    blocks: [
      {
        title: "One-Sentence Version",
        icon: <MessageSquare className="h-4 w-4" />,
        content: `Synth is a safety control room for AI agents: before an AI is allowed to take actions (use tools, browse, scan systems, change data), Synth checks rules, records everything, and can stop it instantly.`
      },
      {
        title: "Layman's Translation of Core Features",
        icon: <BookOpen className="h-4 w-4" />,
        content: `Pre-execution policy gating: Before the AI takes an action, Synth asks "Is this allowed?" If not, it blocks it. If risky, it can require approval.

Tamper-evident audit trail: Synth keeps a black-box recorder of what the AI tried to do and why, designed so nobody can quietly edit history later.

Runtime containment / blast radius controls: Even if the AI misbehaves, it's kept inside a sandbox with limited permissions, budgets, time, and access.

Emergency stop / kill switch: A big red stop button to shut the agent down immediately and revoke access.

Evaluation harness / red-team scenarios: A stress-test course for agents: run dangerous scenarios on purpose to prove the controls work.`
      },
      {
        title: "Proof Record (Plain English)",
        icon: <Check className="h-4 w-4" />,
        content: `A proof record is a receipt that shows what decision was made (allow/block/review), which rules were applied, when it happened, and a tamper-proof fingerprint so anyone can verify it wasn't altered.`
      },
      {
        title: "Analogy",
        icon: <HelpCircle className="h-4 w-4" />,
        content: `Synth is a bouncer (enforces rules), security cameras (records everything), fire suppression (contains damage), and an emergency shutoff (stops action fast).`
      }
    ]
  },
  {
    id: "fundraising-team-comp",
    title: "Fundraising Team Compensation — Legal Structure",
    blocks: [
      {
        title: "THE LAW — Why This Matters",
        icon: <AlertTriangle className="h-4 w-4" />,
        content: `⚠️ PAYING COMMISSION ON CAPITAL RAISED = ILLEGAL

WHY?
├── SEC regulates securities transactions
├── Paying % of $ raised = "effecting transactions"
├── Requires Broker-Dealer license
├── Violations = fines, rescission, criminal charges
└── Investors can sue to get money back`
      },
      {
        title: "THE LEGAL WAY — What You CAN Do",
        icon: <Check className="h-4 w-4" />,
        content: `✅ WHAT YOU CAN DO:

1. PAY FOR SERVICES (Not securities sales)
   ├── Lead generation
   ├── Marketing
   ├── Introductions
   ├── Scheduling
   └── Administrative support

2. PAY SALARY + BONUS + EQUITY
   ├── Monthly retainer (not commission)
   ├── Milestone bonuses (discretionary)
   ├── Equity grants (vesting)
   └── NOT tied directly to $ raised

3. HIRE LICENSED BROKER-DEALER
   ├── They can legally sell securities
   ├── Typically charge 5-10% + warrants
   └── You pay them, they pay their team`
      },
      {
        title: "SAMPLE COMP STRUCTURE",
        icon: <BookOpen className="h-4 w-4" />,
        content: `BUSINESS DEVELOPMENT ASSOCIATE

BASE:           $2,500 - $5,000/month
EQUITY:         0.5% - 1.0% (4-year vest)
BONUSES:        Milestone-based, discretionary

├── 25 qualified intros:       $2,500
├── 50 qualified intros:       $5,000
├── Seed closes:               $10,000
└── Series A closes:           $25,000

THEIR ROLE:
├── Find investors
├── Make introductions
├── Schedule meetings
└── Support CEO

CEO'S ROLE:
├── Pitch investors
├── Negotiate terms
└── Close deals`
      },
      {
        title: "RED FLAGS TO AVOID",
        icon: <AlertTriangle className="h-4 w-4" />,
        content: `❌ DON'T:
├── Pay % commission on capital raised
├── Call them "Sales Rep" for fundraising
├── Let them negotiate terms
├── Let them handle investor funds
├── Promise commission tied to $ raised
└── Skip legal agreements

✅ DO:
├── Pay salary/retainer
├── Give equity with vesting
├── Pay discretionary bonuses
├── Call them "Business Development"
├── You close all deals
└── Get legal agreements signed`
      },
      {
        title: "DOCUMENTS NEEDED",
        icon: <Wrench className="h-4 w-4" />,
        content: `1. Contractor Agreement or Employment Agreement
2. Equity Grant Agreement (with 409A valuation)
3. NDA / Confidentiality Agreement
4. IP Assignment (if applicable)`
      },
      {
        title: "WHEN TO HIRE A BROKER-DEALER",
        icon: <HelpCircle className="h-4 w-4" />,
        content: `CONSIDER A LICENSED PLACEMENT AGENT IF:
├── Raising $5M+
├── Need access to institutional investors
├── Want someone else to "sell"
├── Can afford 5-10% + warrants
└── Want full legal protection

PLACEMENT AGENT COSTS:
├── 5-10% of capital raised
├── + 1-5% warrant coverage
├── + legal fees
└── Worth it for big raises`
      },
      {
        title: "BOTTOM LINE",
        icon: <Mic className="h-4 w-4" />,
        content: `YOU CAN PAY PEOPLE WELL TO HELP RAISE MONEY.
JUST STRUCTURE IT AS SALARY + BONUS + EQUITY.
NOT AS COMMISSION ON SECURITIES.

CEO CLOSES DEALS.
TEAM FILLS THE PIPELINE.
EVERYONE WINS.
LEGALLY.`
      }
    ]
  },
  {
    id: "synth-enterprise-disclosure",
    title: "SYNTH Enterprise Disclosure — What You CAN Say to NVIDIA/NASA-Level Teams",
    blocks: [
      {
        title: "What SYNTH Is (Safe to Disclose)",
        icon: <BookOpen className="h-4 w-4" />,
        content: `A multi-model AI governance system built to make high-stakes AI decisions:
• Auditable
• Configurable
• Fault-tolerant
• Tamper-evident`
      },
      {
        title: "Core Architecture (Safe to Share)",
        icon: <Wrench className="h-4 w-4" />,
        content: `• 7 "Seat" models + 1 "Judge" (independent arbitration)

• Parallel invocation of seats with fault tolerance (timeouts/errors/rate limits → abstain + reason codes)

• Structured ballot protocol (standard fields: stance, score, confidence, risk flags, reasoning, latency)

• Weighted aggregation into a SYNTH Index with configurable thresholds (pass/review/deny)

• Escalation triggers (variance threshold, veto/escalate stance) → Judge decision logged separately`
      },
      {
        title: "Governance Controls",
        icon: <Check className="h-4 w-4" />,
        content: `• Per-organization weight calibration (weights must sum to 100), RBAC-controlled, with calibration audit

• Operational budget governance (timeouts/token/cost circuit breakers)`
      },
      {
        title: "Security / Adversarial Resistance",
        icon: <AlertTriangle className="h-4 w-4" />,
        content: `• Session Lock detection (token length shift, readability shift, language shift) with escalation ladder (verify → restrict → lock)

• Probation mode (stricter thresholds + enhanced logging, time-bounded)

• Third-party dependency degradation modes (fail-closed / last-known-good / queue-retry)`
      },
      {
        title: "Privacy Posture",
        icon: <Check className="h-4 w-4" />,
        content: `Zero-persistence "airlock" + data minimization:
• Process sensitive payloads ephemerally
• Retain only minimal cryptographic artifacts and structured records per retention mode`
      },
      {
        title: "Auditability / Compliance Posture",
        icon: <BookOpen className="h-4 w-4" />,
        content: `• Hash-chained audit trail (tamper-evident ordering) implemented via database trigger

• Supplement expands to Merkle/signature/WORM/external anchoring options and SIEM export`
      },
      {
        title: "Deployment Embodiments",
        icon: <Wrench className="h-4 w-4" />,
        content: `• GUI and workflow embodiments (Chrome extension prefill)

• Supplemental disclosure explicitly covers headless enterprise deployment (container/serverless/VPC/on-prem)`
      },
      {
        title: "VALID Governance Engine Contributions",
        icon: <Check className="h-4 w-4" />,
        content: `The governance engine is usable beyond content moderation—explicitly including:
• Identity verification
• Trust scoring
• High-stakes evaluation decisions

Extends into signed ephemeral tokens + replay protection (aligns with Ghost token/QR concept at systems level without exposing exact token design).`
      },
      {
        title: "Big Tech / NASA / NVIDIA Relevant (Still Factual)",
        icon: <MessageSquare className="h-4 w-4" />,
        content: `A governed consensus pipeline that is:
• Multi-model redundant
• Policy constrained
• Budget-controlled
• Tamper-evident
• Deployable inside a secure enterprise boundary (VPC/on-prem)

A way to turn agent outputs into auditable artifacts suitable for regulated/risk environments.

A path to pair with Omniverse/digital twins: agents can propose actions, SYNTH governs/validates and logs before actions are taken.`
      },
      {
        title: "⛔ DO NOT SHARE (If Secrecy is the Goal)",
        icon: <AlertTriangle className="h-4 w-4" />,
        content: `If emailing elite targets, DO NOT send:

❌ The exact seat/provider list and weights
❌ The exact anomaly thresholds
❌ Database schemas/functions/triggers
❌ Detailed pipeline diagrams

Instead, use a high-level "capabilities description" (executive summary format).`
      }
    ]
  }
];

export const CEOPlaybookTab = () => {
  const [copiedBlock, setCopiedBlock] = useState<string | null>(null);

  const handleCopy = async (content: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedBlock(blockId);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopiedBlock(null), 2000);
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            CEO Playbook
          </CardTitle>
          <CardDescription>
            Strategic outreach scripts, Q&A prep, and talking points for key conversations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {playbookEntries.map((entry) => (
              <AccordionItem key={entry.id} value={entry.id}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{entry.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    {entry.blocks.map((block, index) => {
                      const blockId = `${entry.id}-${index}`;
                      const isCopied = copiedBlock === blockId;
                      
                      return (
                        <Card key={blockId} className="bg-muted/30">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base flex items-center gap-2">
                                {block.icon}
                                {block.title}
                              </CardTitle>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopy(block.content, blockId)}
                                className="gap-2"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="h-4 w-4 text-green-500" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4" />
                                    Copy
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <pre className="whitespace-pre-wrap text-sm font-mono bg-background/50 p-4 rounded-lg border overflow-x-auto">
                              {block.content}
                            </pre>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};
