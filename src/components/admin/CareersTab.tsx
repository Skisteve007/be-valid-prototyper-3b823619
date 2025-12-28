import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Briefcase, Calendar, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface JobAd {
  id: string;
  title: string;
  summaryLine: string;
  fullAdText: string;
}

const jobAds: JobAd[] = [
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