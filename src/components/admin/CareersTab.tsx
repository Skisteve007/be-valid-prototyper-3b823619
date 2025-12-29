import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Briefcase, Calendar, ExternalLink, FileText, Link } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface JobAd {
  id: string;
  title: string;
  summaryLine: string;
  fullAdText: string;
}

const roleContracts: Record<string, string[]> = {
  cto: ["Mutual NDA", "Independent Contractor Agreement", "Equity Addendum (if applicable)"],
  "enterprise-ae": ["Mutual NDA", "Independent Contractor Agreement", "Commission Plan Addendum"],
  "growth-ae": ["Mutual NDA", "Independent Contractor Agreement", "Commission Plan Addendum"],
  "founding-engineer": ["Mutual NDA", "Independent Contractor Agreement", "Equity Addendum (if applicable)"],
  "fullstack-engineer": ["Mutual NDA", "Independent Contractor Agreement"],
  "biz-dev-associate": ["Mutual NDA", "Independent Contractor Agreement", "Equity Addendum (if applicable)"]
};

const jobAds: JobAd[] = [
  {
    id: "cto",
    title: "Founding CTO / Head of Engineering — Equity-First",
    summaryLine: "SF/Hybrid or Remote (US) | Equity-first + cash ramps with revenue",
    fullAdText: `TITLE: Founding CTO / Head of Engineering — Equity-First (Contractor Start)
LOCATION: San Francisco (Hybrid) or Remote (US)
COMP: Equity-first (meaningful stake). Cash limited initially; increases as revenue lands.

WHY THIS ROLE EXISTS
We're closing enterprise conversations around Valid/SYNTH: a conduit-first governance platform that enforces decisions (CERTIFIED vs MISTRIAL) and produces verifiable proof records—without becoming the system of record.

We need a CTO-level operator who can:
1) own the technical truth end-to-end,
2) guide build priorities,
3) confidently handle enterprise technical + security questions with the founder.

This is a "glide through the whole platform" role—architecture, security posture, scale plan, and execution.

WHAT YOU'LL OWN (DAY 1)
- Technical strategy + architecture for a conduit-first platform:
  - customer-hosted runtime option (enterprise VPC)
  - hosted pilot path (minimized inputs) for speed
  - proof record integrity + verification story
- Engineering hiring plan: founding engineer(s) + full-stack + contractors.
- Delivery: move from demo-grade to production-grade with world-class reliability.
- Enterprise readiness: security questionnaires, deployment models, auditability, and integration patterns.
- Founder support: be on calls when deep technical questions come up.

WHAT YOU'LL BUILD / DIRECT
- Customer-hosted "SYNTH Runtime" (containerized, queue-friendly, high-throughput).
- Decision + proof record pipeline (signatures, timestamps, policy versioning, verification endpoints).
- Observability and operational discipline (metrics, tracing, incident response basics).
- A pragmatic stack choice (Go/Python/TypeScript—pick what wins).

WHO YOU ARE
- You've shipped production systems that scale (distributed systems, queues, worker pools).
- You can speak security/legal/architecture with enterprise buyers without hand-waving.
- You're calm under pressure and allergic to over-claims—everything must be provable.
- You're a builder, not a slide-deck CTO.

WHAT "EQUITY-FIRST" MEANS HERE
- We are cash-lean right now.
- You receive a meaningful stake for taking real ownership.
- Cash compensation ramps with revenue and funded LOIs.
- We'll put role expectations + equity terms in writing early.

IDEAL BACKGROUND (ANY ONE OF THESE)
- Security/compliance infrastructure
- Healthcare/regulated software
- High-scale SaaS platforms
- AI/LLM platform engineering with strong governance instincts

TO APPLY
Email: steve@bevalid.app
Subject: "CTO — Equity First"
Include:
1) LinkedIn/GitHub
2) 2–3 systems you've shipped (scale/security/reliability)
3) Your view on conduit-first: "customer-hosted runtime vs hosted pilot" in 5–10 lines`
  },
  {
    id: "enterprise-ae",
    title: "Founding Enterprise AE (Technical) — Contractor",
    summaryLine: "SF/Hybrid | 15% of cash collected + equity | Uncapped",
    fullAdText: `TITLE: Founding Enterprise AE (Technical) — Contractor (SF / Hybrid)
CATEGORY: Enterprise AI Governance / Liability Shield
UPSIDE: Uncapped. Paid on cash collected. Equity-forward.

WHY THIS IS A BIG DEAL
AI is getting companies sued. Monitoring isn't enforcement. Valid/SYNTH is built to enforce decisions (CERTIFIED vs MISTRIAL) and generate verifiable proof records—without becoming the system of record. We can run customer-hosted for enterprise boundaries.

WHO YOU ARE
You're the rare seller who can run a room with Security + Legal + Product and still close. You can explain "conduit-first" simply, run a POV, and move procurement without over-claiming.

WHAT YOU'LL DO
- Close 6–7 figure enterprise contracts (regulated + high-liability orgs).
- Run discovery → POV → security review → close.
- Turn the demo into a paid 45-day proof sprint.
- Build the playbook with the founder (targets, objections, sequences, pricing).

COMP (CONTRACTOR, FAIR, SIMPLE)
- Commission: 15% of first-year contract value CASH COLLECTED
- Paid: 50% cash + 50% equity at collection milestone
- Equity: issued via a written plan (options/RSAs depending on structure)
No cash collected = nothing "owed" yet. When cash lands, you get paid.

TO APPLY
Email: steve@bevalid.app
Subject: "Founding Enterprise AE"
Include: LinkedIn + biggest 3 closes + why you're a fit for security/legal heavy deals.`
  },
  {
    id: "growth-ae",
    title: "Growth AE (Main Street) — Contractor",
    summaryLine: "SF/Field | 15% of cash collected | Uncapped",
    fullAdText: `TITLE: Growth AE (Main Street) — Contractor (SF / Field-Friendly)
FOCUS: $5K setup deals + fast closes + volume
UPSIDE: Uncapped. Paid on collected cash.

WHY THIS ROLE WINS
This isn't theory. You'll sell a working demo to operators who need trust fast: venues, clinics, salons, offices. Quick onboarding, clean value, tight story.

WHAT YOU'LL DO
- Close high-velocity deals (typically $5K setup + ongoing).
- Run short demos (Upload & Verdict + Proof Verification + optional share token).
- Source pipeline in SF (walk-ins, DMs, referrals, local partnerships).
- Follow up like a machine and keep deals moving.

COMP (CONTRACTOR, PAID ON COLLECTION)
- Commission: 15% of CASH COLLECTED on qualifying deals
- Paid: 100% cash OR (optional) split cash/equity if you want more upside
- No salary promises. This is for closers who want uncapped payout.

TO APPLY
Email: steve@bevalid.app
Subject: "Growth AE — Main Street"
Include: your last 12 months numbers + why you win high-velocity.`
  },
  {
    id: "founding-engineer",
    title: "Founding Engineer — Customer-Hosted Runtime — Contractor",
    summaryLine: "SF/Hybrid | Equity-forward + milestone bonuses",
    fullAdText: `TITLE: Founding Engineer — Customer-Hosted Runtime (Contractor, SF/Hybrid)
MISSION: Build the enterprise-grade enforcement runtime that can run inside a customer VPC.

WHY THIS IS A HELL OF A DEAL
If you've wanted to be "CTO energy" early—this is it. We're building a conduit-first governance layer that makes AI decisions provable (proof records) and enforceable (release/veto). Demos are live. Now we harden it for real enterprise use.

WHAT YOU'LL BUILD
- Customer-hosted runtime (containerized) that:
  - ingests requests/events
  - runs multiple verifiers in parallel (timeouts, retries, idempotency)
  - outputs structured decision signals + proof record IDs
- Scale posture: burst traffic, queues, backpressure, observability.
- Security posture: keys, signatures, tenant isolation, audit logs.

COMP (CONTRACTOR, CASH-LEAN, UPSIDE-HEAVY)
- Monthly contractor pay: "as available" (be explicit in the conversation)
- Equity: meaningful founding-level grant for the right person
- Performance cash: milestone-based bonuses tied to revenue events / funded LOIs

YOU'RE A FIT IF
You've shipped distributed systems, you care about correctness, and you want ownership.

APPLY
steve@bevalid.app
Subject: "Founding Engineer — Runtime"
Include: GitHub + 2 things you shipped + what you'd build in 30 days.`
  },
  {
    id: "fullstack-engineer",
    title: "Full-Stack Engineer — Demo/App/PWA — Contractor",
    summaryLine: "SF/Remote | Equity + milestone bonuses",
    fullAdText: `TITLE: Full-Stack Engineer — Demo/App/PWA (Contractor, SF/Remote)
MISSION: Turn the demo experience into a gorgeous mobile-first app (PWA) that closes deals.

WHAT YOU'LL DO
- Make the Demo Hub + demos world-class: readable, fast, mobile-perfect.
- Build PWA install flow (home screen app feel).
- Implement clean UI systems (typography, cards, modals, routing).
- Wire "Ghost preview flow" + time-limited token UX (demo-safe).

COMP (CONTRACTOR, UPSIDE-FOCUSED)
- Cash: limited initially
- Equity: available
- Bonuses tied to shipped milestones and/or revenue events

APPLY
steve@bevalid.app
Subject: "Full-Stack — PWA"
Include: portfolio + strongest UI project + availability.`
  },
  {
    id: "biz-dev-associate",
    title: "Business Development Associate — $500K+ Total Comp Potential",
    summaryLine: "Remote / SF | Base + Equity + Milestone Bonuses | Technical Sales",
    fullAdText: `TITLE: Business Development Associate (NOT "Sales Rep")
LOCATION: Remote / SF Bay Area
COMP: $500K+ total potential (base + equity + milestone bonuses)

═══════════════════════════════════════════════════════════════════════════════

WHY THIS TITLE?
├── "Sales Rep" selling securities = Broker-Dealer territory
├── "Business Development" = Lead gen, intros, marketing
└── You close deals, they support

═══════════════════════════════════════════════════════════════════════════════

COMPENSATION PACKAGE:

BASE RETAINER:
├── $2,500/month (Part-time/Contract)
└── $5,000/month (Full-time/Dedicated)

EQUITY GRANT:
├── 0.5% - 1.0% ownership
├── 4-year vesting, 1-year cliff
└── Standard startup equity terms

MILESTONE BONUSES (Not tied to $ raised):
├── 25 qualified investor intros:       $2,500 bonus
├── 50 qualified investor intros:       $5,000 bonus
├── Company closes Seed round:          $10,000 bonus
├── Company closes Series A:            $25,000 bonus
└── Bonuses are DISCRETIONARY, not guaranteed

═══════════════════════════════════════════════════════════════════════════════

WHAT YOU DO (Legal):
├── Research and identify potential investors
├── Build target lists
├── Make warm introductions
├── Schedule meetings for CEO
├── Prepare pitch materials
├── Follow up with prospects
├── CRM management
├── Marketing and outreach
└── Event coordination

WHAT YOU DON'T DO (Illegal without license):
├── Negotiate investment terms
├── Handle investor funds
├── Sign on behalf of company
├── "Sell" or "close" investors
└── Receive % commission on $ raised

═══════════════════════════════════════════════════════════════════════════════

TOTAL POTENTIAL COMP (Year 1):

Base (12 months × $5K):              $60,000
Milestone bonuses:                    $42,500
Equity (1% of $13B vision):          $130,000,000 potential
────────────────────────────────────────────
TOTAL CASH Y1:                       $102,500
TOTAL EQUITY UPSIDE:                 Life-changing

This is how you motivate without breaking the law.

═══════════════════════════════════════════════════════════════════════════════

IDEAL BACKGROUND:
- Experience in B2B sales, fundraising, or investor relations
- Strong network in VC/angel investor communities
- Excellent communication and follow-up skills
- Organized, self-motivated, CRM-proficient
- Technical aptitude (can explain AI governance at a high level)

TO APPLY
Email: steve@bevalid.app
Subject: "Biz Dev Associate — $500K+"
Include: LinkedIn + biggest intro wins + why you're a fit for investor-facing work.`
  }
];

export function CareersTab() {
  const navigate = useNavigate();
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Briefcase className="h-6 w-6" />
                Careers Vault — Hiring Ads
              </CardTitle>
              <CardDescription className="mt-2">
                Copy/paste ready. This is the source of truth. Update here; use everywhere.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Last updated: Dec 28, 2024
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/careers")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Public Page
              </Button>
            </div>
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
                    {/* Contracts this role signs */}
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-primary" />
                        Contracts this role signs:
                      </h4>
                      <ul className="space-y-1">
                        {(roleContracts[ad.id] || ["Mutual NDA", "Independent Contractor Agreement"]).map((contract, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <Link className="h-3 w-3 text-primary" />
                            {contract}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant="link"
                        size="sm"
                        className="mt-2 h-auto p-0 text-primary"
                        onClick={() => navigate("/admin?tab=legal-templates")}
                      >
                        View templates in Legal Templates →
                      </Button>
                    </div>

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