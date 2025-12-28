import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Briefcase, Calendar } from "lucide-react";
import { toast } from "sonner";

interface JobAd {
  id: string;
  title: string;
  summaryLine: string;
  fullAdText: string;
}

const jobAds: JobAd[] = [
  {
    id: "enterprise-ae",
    title: "Founding Enterprise AE (Technical) — SF",
    summaryLine: "San Francisco (Hybrid) | $250k–$350k base + OTE $1M+",
    fullAdText: `TITLE: Founding Enterprise AE (Technical) — AI Governance / Safety / "Conduit-First" Platform
LOCATION: San Francisco (Hybrid)
COMP: $250k–$350k base + aggressive commission/equity (OTE $1M+ for top performance)

ABOUT THE ROLE
We're building Valid/SYNTH: a conduit-first governance platform that enforces decisions (CERTIFIED vs MISTRIAL) and produces verifiable proof records—without becoming the system of record. We sell into regulated and high-liability environments where AI outputs and bad data create real legal exposure.

You are a highly technical enterprise closer who can run the full cycle: discovery → technical validation → security review → procurement → close.

WHAT YOU'LL DO
- Own 6–7 figure enterprise deals end-to-end (CISO, GC, Compliance, Product, Data, AI leadership).
- Lead technical discovery: deployment model, data boundary requirements, audit needs, integration points.
- Run POVs: shadow mode → proof record verification → active enforcement.
- Partner directly with founders to sharpen positioning, pricing, and playbooks.
- Build a repeatable enterprise motion (targets, sequences, objection handling, mutual action plans).

WHO YOU ARE
- 7–10+ years enterprise sales, including complex technical/security reviews.
- You can sell to regulated buyers and translate technical truth into executive clarity.
- You can run a room with security and legal without over-claiming.
- Strong with architecture diagrams, integration mapping, and POV design (you don't need to code, but you must be technical).

SIGNALS YOU'VE DONE THIS BEFORE
- Closed $500k–$5M+ ARR deals (or equivalent large contracts).
- Comfortable selling platform infrastructure, security, compliance, or AI governance.
- Experience with procurement, MSAs, DPAs/BAAs, security questionnaires, SOC2, and risk reviews.

WHY THIS ROLE
- You'll define the enterprise motion from day one.
- Massive urgency: buyers are being sued for AI mistakes and unverified data.
- If you want to build a category and be paid like a top closer, this is it.

TO APPLY
Email: steve@bevalid.app
Subject: "Founding Enterprise AE — SF"
Include: (1) LinkedIn, (2) 3 biggest deals closed, (3) why you're the right person for this exact category.`
  },
  {
    id: "growth-ae",
    title: "Growth AE (Main Street) — SF",
    summaryLine: "San Francisco (Hybrid) + Field | $120k–$180k base + OTE ~$400k",
    fullAdText: `TITLE: Growth AE (Main Street) — $5K Setup Deals, Fast Close Cycle
LOCATION: San Francisco (Hybrid) + Field-friendly
COMP: $120k–$180k base + commission (OTE ~$400k for top performance)

ABOUT THE ROLE
Valid/Ghost helps small and mid-sized operators (venues, clinics, salons, offices) verify and share trust signals through time-limited passes and governed decisions—fast onboarding, clear ROI, and low friction.

We need a closer who thrives on volume, urgency, and clean execution. This role is built for someone who can turn attention (Instagram + inbound + outbound) into signed deals.

WHAT YOU'LL DO
- Close high-velocity deals (typical: $5K setup + ongoing).
- Run short discovery and fast demos: "Upload & Verdict" + proof verification + share token.
- Build a local pipeline (SF Bay Area) plus remote pipeline.
- Handle objections quickly and ethically (privacy, "do you store data?", "is this real?").
- Feed product and marketing: what's converting, what's confusing, what's blocking closes.

WHO YOU ARE
- Proven high-output seller (SMB, local business, SaaS, payments, security, or ops tooling).
- You can work leads relentlessly: phone, text, DMs, in-person drops.
- You write clean follow-ups and drive next steps without drama.
- You don't need deep AI knowledge—you need speed, discipline, and integrity.

BONUS POINTS
- Experience with local operators: venues, healthcare clinics, hospitality, compliance-heavy SMBs.
- Comfortable on camera / short-form content to support inbound demand.

TO APPLY
Email: steve@bevalid.app
Subject: "Growth AE — Main Street"
Include: (1) LinkedIn, (2) last 12 months performance numbers, (3) why you win in high-velocity closes.`
  },
  {
    id: "founding-engineer",
    title: "Founding Engineer (Customer-Hosted Runtime) — SF",
    summaryLine: "San Francisco (Hybrid) | Competitive salary + founding equity",
    fullAdText: `TITLE: Founding Engineer — Customer-Hosted Runtime (Conduit-First AI Governance)
LOCATION: San Francisco (Hybrid)
COMP: Competitive salary + meaningful equity (founding-level). (Set range based on seniority.)

ABOUT VALID/SYNTH
We're building Valid/SYNTH: a conduit-first governance platform that enforces decisions (CERTIFIED vs MISTRIAL) and produces verifiable proof records—without becoming the system of record. We deploy side-by-side with enterprise systems, including customer-hosted runtime options where raw payloads stay inside the customer boundary.

We're past slides. Demos are live. Now we need a founding engineer to harden the runtime into world-class production infrastructure.

THE ROLE (WHAT YOU'LL BUILD)
You will own the "SYNTH Runtime" — the customer-hosted enforcement layer that can run inside an enterprise VPC and handle high-throughput workloads.

Core responsibilities:
- Build and ship a customer-hosted runtime (containers) that:
  - ingests events/requests (HTTP + queue-friendly patterns)
  - fans out to multiple verification workers (parallel, timed, deterministic)
  - returns structured decision signals (ALLOW/BLOCK/FLAG) + reason codes
  - emits verifiable proof records (proof_id, hashes, timestamps, policy version, signatures)
- Design for NFL-Sunday scale: burst handling, queues, backpressure, retries, idempotency.
- Multi-tenant and policy isolation: per-customer rule packs, versioning, safe rollouts.
- Observability: tracing, metrics, audit logs; clean integration with customer SIEM/log sinks.
- Security first: secrets management, key rotation, least privilege, auditability.
- Work directly with the founder on product truthfulness: no over-claims—everything provable.

WHAT "CONDUIT-FIRST" MEANS HERE
- We do NOT custody customer source records by default.
- Runtime can operate inside customer infrastructure to keep raw payloads in-bounds.
- We return signed signals + proof artifacts, not a data warehouse.

PREFERRED EXPERIENCE
- Built distributed systems that scale (queues, worker pools, event-driven systems).
- Shipped production SaaS infrastructure with strong security posture.
- Comfortable with enterprise deployment patterns (Docker/Kubernetes, VPC constraints).
- Bonus: experience with LLM/tool orchestration, policy engines, or compliance/audit systems.

STACK
We're pragmatic. You can propose the right stack.
Comfortable options include Go, Python, and TypeScript for services; Postgres/Redis; containers; cloud-native primitives.
The priority is reliability, security, and clarity—not hype.

YOU'LL WIN IF YOU ARE
- Fast, paranoid (in the good way), and obsessed with correctness.
- Able to turn ambiguous goals into a tight execution plan.
- Comfortable being the first "CTO energy" in the room.

TO APPLY
Email: steve@bevalid.app
Subject: "Founding Engineer — Runtime"
Include:
1) LinkedIn/GitHub
2) 2–3 projects you've shipped that prove scale/reliability
3) What you would build in the first 30 days here`
  }
];

export function CareersTab() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyAd = async (ad: JobAd) => {
    try {
      await navigator.clipboard.writeText(ad.fullAdText);
      setCopiedId(ad.id);
      toast.success(`"${ad.title}" copied to clipboard`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                Careers — Hiring Ads
              </CardTitle>
              <CardDescription className="mt-2">
                Copy/paste ready. Update here; use everywhere.
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Last updated: Dec 28, 2024
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {jobAds.map((ad) => (
              <AccordionItem 
                key={ad.id} 
                value={ad.id}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex flex-col items-start text-left">
                    <span className="font-semibold text-base">{ad.title}</span>
                    <span className="text-sm text-muted-foreground mt-1">
                      {ad.summaryLine}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4">
                    <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg border font-mono overflow-x-auto">
                      {ad.fullAdText}
                    </pre>
                    <Button 
                      onClick={() => handleCopyAd(ad)}
                      className="w-full sm:w-auto"
                      variant={copiedId === ad.id ? "secondary" : "default"}
                    >
                      {copiedId === ad.id ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Ad
                        </>
                      )}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}