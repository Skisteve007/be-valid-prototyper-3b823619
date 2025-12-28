import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Copy, Check, BookOpen, MessageSquare, HelpCircle, AlertTriangle, Wrench, Mic, Target, Shield, Users, Clock, CheckSquare, QrCode, Lock, Database, Ban } from "lucide-react";
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
    id: "andrew-conversation",
    title: "Andrew Conversation — Mentor / Technical Teardown",
    blocks: [
      {
        title: "Objective & Positioning",
        icon: <Target className="h-4 w-4" />,
        content: `**Objective**

Position me as a serious operator-builder with real-world judgment who:
- ships fast,
- manages risk responsibly,
- welcomes targeted technical review,
- is not asking for money directly,
- is asking for mentorship, criteria, and an intro to the right reviewer/pilot path.

**What we accomplished (credibility anchors)**

- Removed \`.env\` from the \`main\` branch (confirmed by 404).
- Added \`.env\` to \`.gitignore\` to prevent accidental recommit.
- Reinforced the core product principle: **conduit, not data warehouse** (minimize retention + enforce controls).

Use this as proof of operational discipline: we find a leak → fix it → add guardrails.

**Positioning (how to frame myself)**

**Do say**
- "I built the product end-to-end and I'm accountable for it."
- "I'm treating this like production-grade: secrets stay out of source control; config is managed in deployment; backend access is controlled (e.g., RLS/policies)."
- "I want a targeted teardown with clear criteria."

**Do NOT say**
- "I'm not a coder."
- "I vibe-coded it."
- "I pinned multiple LLMs against each other."
- Anything that sounds like confusion or apology.`
      },
      {
        title: "3-Part Conversation Structure",
        icon: <MessageSquare className="h-4 w-4" />,
        content: `**The 3-part structure for any conversation**

1) **Purpose + demo** (what it does, in one sentence)

2) **Evidence of seriousness** (controls, guardrails, risk posture)

3) **Ask for next step** (review by trusted person, pilot criteria)`
      },
      {
        title: "Copy/Paste Outreach Message to Andrew",
        icon: <MessageSquare className="h-4 w-4" />,
        content: `Subject: Quick review request — built from real-world risk work

Andrew — I built something I think you'll appreciate because it comes from real-world risk work, not theory.

**What it is (30 seconds):** [ONE sentence of what it does].
**Why it matters:** it's designed as a **conduit, not a data warehouse** — minimize retention, enforce controls, and make audits/pilots easier.

I'm not claiming to be a career engineer; I *am* claiming I'm a serious builder/operator who ships and tightens fast. I already put guardrails in place (e.g., removed committed env secrets and moved config to deployment).

**Ask:** Would you do a **15–20 minute teardown** on (1) architecture/data flow and (2) security/privacy assumptions? If you think it's promising, I'd value your guidance on what "pilot-ready" should mean and who should pressure-test it.

Demo: [link]
One-pager (optional): [link]`
      },
      {
        title: "Control Phrase (When Interrogated)",
        icon: <Shield className="h-4 w-4" />,
        content: `**If he starts "interrogating": the control phrase**

Repeat calmly:

"Totally fair—tell me the criteria you'd use to judge this, and I'll walk you through evidence for each one."

Then move into:

1) **Data flow**: what enters, what is stored, what is not stored

2) **Controls**: auth, RLS/policies, retention, logging

3) **Pilot plan**: who, what success is, timeline`
      },
      {
        title: "Q&A Scenarios",
        icon: <HelpCircle className="h-4 w-4" />,
        content: `**Q: "Did you code this yourself?"**

A: "I built it end-to-end and I'm accountable for it. I used modern tooling to move fast, and I'm putting formal review and controls around it now."

---

**Q: "Are you an engineer?"**

A: "I'm an operator-builder. My strength is translating real-world risk into working systems, then hardening them with review and standards."

---

**Q: "This looks unsafe / amateur."**

A: "That's why I want a teardown. We already fixed obvious exposures (e.g., removed committed env secrets and added guardrails). If you point to specific risks, I'll fix them and document the control."

---

**Q: "Tell me about your AI/LLM setup."**

Goal: answer without opening an attack surface.

Safe A (high-level, non-technical):
"I use AI as an assistant for drafting and checking, but I don't outsource judgment to it. Final decisions, architecture choices, and security controls are mine, and everything is reviewable."

If pressed:
"Happy to share details with a technical reviewer under defined criteria. For this conversation, what matters is: the system is auditable, data-minimizing, and secured by backend controls—not by prompts."

---

**Q: "What's the biggest risk right now?"**

A: "Hardening for pilot: formal threat model, confirm RLS/policies, secrets management in deployment, and making sure data retention is minimal and intentional."

---

**Q: "What do you want from me?"**

A: "A short teardown and your criteria for 'pilot-ready.' If it passes, an intro to whoever you trust to pressure-test it—or the right person for a pilot conversation."`
      },
      {
        title: "5-Minute Prep Checklist Before Any Call",
        icon: <CheckSquare className="h-4 w-4" />,
        content: `**5-minute prep checklist before any call**

☐ One 20-second real-world story (the pain you lived).

☐ One sentence: what it does + who it's for.

☐ 3 credibility bullets: controls/guardrails you implemented.

☐ One ask: "teardown + criteria + intro to reviewer/pilot path."`
      },
      {
        title: "Demo Flow (7 Minutes)",
        icon: <Clock className="h-4 w-4" />,
        content: `**Demo flow (7 minutes)**

1) The problem + who suffers (30s)

2) Show the workflow end-to-end (3–4 min)

3) Show the "conduit not warehouse" posture (what's stored vs not) (1 min)

4) Show controls (RLS/policies, env management, audit trail) (1–2 min)

5) Close with the ask (30s)

---

**Owner:** CEO
**Use when:** Andrew (mentor/technical), pilots, skeptics, reviewers`
      }
    ]
  },
  {
    id: "conduit-qr-non-negotiables",
    title: "Conduit QR Card — Non-Negotiables (Source-of-Truth Pattern)",
    blocks: [
      {
        title: "Principle",
        icon: <QrCode className="h-4 w-4" />,
        content: `**We are a conduit, not a warehouse.** The QR card must never embed or directly expose sensitive payload data.

**One-sentence description (for investors/mentors):**

"The QR is a pointer to a consented, time‑limited session; data is pulled from the authoritative source, and we retain only attestations and audit logs—not underlying records."`
      },
      {
        title: "Hard Rule 1 — QR Contains Only a Pointer",
        icon: <Lock className="h-4 w-4" />,
        content: `• The QR code encodes only: a URL to our domain + a random session/token ID.

• **No PHI, no ID numbers, no insurance member IDs, no medical record data** in the QR payload.

• Token is a random UUID — not correlated to any real-world identifier.

• All sensitive data retrieval happens server-side after token validation.`
      },
      {
        title: "Hard Rule 2 — Time-Limited, Single-Use Sessions",
        icon: <Clock className="h-4 w-4" />,
        content: `• Scan creates/opens a session that expires quickly (e.g., 30–60 seconds) and/or is single‑use.

• The "viewer" receives only temporary access.

• Token is invalidated after use or expiration — no replay attacks.

• Each QR generation creates a fresh token (Ghostware™ evaporation pattern).`
      },
      {
        title: "Hard Rule 3 — Authoritative Source Serves the Record",
        icon: <Database className="h-4 w-4" />,
        content: `• Medical records / lab results / ID proof are retrieved from the **source system** (hospital/EHR, lab portal, ID provider).

• We broker **consent + routing**; we do not become the long‑term holder of the underlying record.

• Data flows through us, not to us.

• We are a verification conduit, not a data warehouse.`
      },
      {
        title: "Hard Rule 4 — Minimize Retention",
        icon: <Shield className="h-4 w-4" />,
        content: `**We MAY store:**

• consent/audit logs (who/when/what was authorized)
• verification/attestation results (pass/fail + provider + timestamp)
• minimal metadata required to operate and audit

**We MUST NOT store:**

• raw medical record PDFs/exports
• raw ID images
• full insurance card data
• any PHI beyond attestation results`
      },
      {
        title: "Hard Rule 5 — No Accidental Leakage",
        icon: <Ban className="h-4 w-4" />,
        content: `• Never put sensitive data in URLs/query strings.

• Do not log raw payloads.

• Disable caching for sensitive endpoints (no CDN/browser cache of PHI views).

• No sensitive data to analytics/3rd-party scripts.

• All sensitive API responses use appropriate no-cache headers.

• Profile data shown to viewers is minimal (first name only, badges, no full PII).`
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
