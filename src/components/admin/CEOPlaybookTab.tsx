import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, BookOpen, MessageSquare, HelpCircle, AlertTriangle, Wrench, Mic } from "lucide-react";
import { toast } from "sonner";
import { CanonicalExecutiveSummaryInvestor } from "./canonical/CanonicalExecutiveSummaryInvestor";
import { CanonicalPitchDeckInvestor } from "./canonical/CanonicalPitchDeckInvestor";
import { CanonicalExecutiveSummaryStrategic } from "./canonical/CanonicalExecutiveSummaryStrategic";
import { CanonicalPitchDeckStrategic } from "./canonical/CanonicalPitchDeckStrategic";
import { ApprovedVsForbiddenLanguage } from "./canonical/ApprovedVsForbiddenLanguage";
import { CEOSecurityQADrill } from "./canonical/CEOSecurityQADrill";
import { CEOPortfolio } from "./canonical/CEOPortfolio";
import { DemoAccessDocumentation } from "./canonical/DemoAccessDocumentation";
import { PrintableHeading, LastUpdated, ConfidentialityBanner } from "./PrintStyles";

// Existing playbook entries (reorganized)
const outreachEntries = [
  {
    id: "andrew-ng",
    title: "Andrew Ng Outreach — 1‑Pager + Q&A Prep",
    content: `Subject: Request for critique — conduit-first AI governance with verifiable proof records

Hi Andrew — I'm Steve (Giant Ventures LLC). I'm building Valid/SYNTH, a conduit-first governance layer for AI-impacted decisions.

**Problem**
Organizations are being exposed (legally and operationally) by unverified AI outputs and untrusted records. Most tools monitor; they don't enforce.

**What we built**
Valid/SYNTH is an enforcement + auditability layer that:
1) takes in a claim/event
2) runs a governed verification flow
3) outputs a structured verdict
4) emits a verifiable proof record
5) supports enterprise deployment inside customer boundary

**What I'd value your critique on:**
- How to define "CERTIFIED" in a defensible way
- What evaluation framework you'd recommend
- What failure modes matter most in enterprise audits

Thanks,
Steve`
  },
  {
    id: "andrew-ng-readiness",
    title: "Andrew Ng Challenges — Readiness Package",
    content: `LIKELY ATTACK POINTS:
• CERTIFIED definition is fuzzy
• Ground truth + evaluation dataset missing
• LLM nondeterminism vs reproducibility
• "We don't store data" vs what is logged
• Customer-hosted runtime is a promise
• Threat model unclear
• Defensibility/moat

FIXES:
• Define CERTIFIED as "meets policy-defined checks with evidence requirements"
• Publish evaluation plan: baseline comparison + metrics
• Clarify proof record: proves what happened + policy version
• Add "What we store / don't store" table
• Package customer-hosted runtime: container + deploy guide
• Threat model statement: signing, key rotation, access controls
• Moat: enforcement + verifiable receipts + enterprise deployment`
  }
];

const plainEnglishEntry = {
  title: "Synth — Plain-English Explanation",
  content: `ONE-SENTENCE VERSION:
Synth is a safety control room for AI agents: before an AI takes actions, Synth checks rules, records everything, and can stop it instantly.

LAYMAN'S TRANSLATION:
• Pre-execution policy gating: Before the AI takes an action, Synth asks "Is this allowed?"
• Tamper-evident audit trail: A black-box recorder that nobody can quietly edit
• Runtime containment: Even if AI misbehaves, it's kept in a sandbox
• Emergency stop: A big red button to shut the agent down

ANALOGY:
Synth is a bouncer (enforces rules), security cameras (records everything), fire suppression (contains damage), and emergency shutoff (stops action fast).`
};

const fundraisingEntry = {
  title: "Fundraising Team Compensation — Legal Structure",
  content: `⚠️ PAYING COMMISSION ON CAPITAL RAISED = ILLEGAL

WHY?
• SEC regulates securities transactions
• Paying % of $ raised = "effecting transactions"
• Requires Broker-Dealer license
• Violations = fines, rescission, criminal charges

✅ WHAT YOU CAN DO:
• Pay for services (lead gen, intros, scheduling)
• Pay salary + bonus + equity (not tied to $ raised)
• Hire licensed broker-dealer for big raises

SAMPLE COMP STRUCTURE:
BASE: $2,500 - $5,000/month
EQUITY: 0.5% - 1.0% (4-year vest)
BONUSES: Milestone-based, discretionary

CEO CLOSES DEALS. TEAM FILLS PIPELINE.`
};

const enterpriseDisclosureEntry = {
  title: "SYNTH Enterprise Disclosure — NVIDIA/NASA Level",
  content: `SAFE TO SHARE:
• Multi-model governance system
• 7 Seats + 1 Judge architecture (high-level)
• Parallel invocation with fault tolerance
• Structured ballot protocol
• Weighted aggregation with configurable thresholds
• Escalation triggers
• RBAC + budget controls
• Session Lock detection
• Hash-chained audit trail
• VPC/on-prem deployment options

⛔ DO NOT SHARE:
• Exact seat/provider list and weights
• Exact anomaly thresholds
• Database schemas/functions/triggers
• Detailed pipeline diagrams`
};

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
      <ConfidentialityBanner />
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">📘 CEO Playbook</CardTitle>
          <CardDescription>
            Canonical pitch materials, outreach prep, and executive guidance. Print-ready.
          </CardDescription>
          <LastUpdated />
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="canonical" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="canonical">00 — Canonical</TabsTrigger>
              <TabsTrigger value="outreach">01 — Outreach</TabsTrigger>
              <TabsTrigger value="product">02 — Product</TabsTrigger>
              <TabsTrigger value="disclosure">03 — Disclosure</TabsTrigger>
              <TabsTrigger value="fundraising">04 — Fundraising</TabsTrigger>
            </TabsList>

            <TabsContent value="canonical" className="space-y-6">
              <PrintableHeading level={2}>00 — Canonical Pitch & Positioning (Print-Ready)</PrintableHeading>
              <Accordion type="single" collapsible className="w-full space-y-2">
                <AccordionItem value="exec-investor" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    Executive Summary — Investor (Canonical)
                  </AccordionTrigger>
                  <AccordionContent>
                    <CanonicalExecutiveSummaryInvestor />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pitch-investor" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    Pitch Deck — Investor (Canonical)
                  </AccordionTrigger>
                  <AccordionContent>
                    <CanonicalPitchDeckInvestor />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="exec-strategic" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    Executive Summary — Strategic (NVIDIA/NASA/Elon)
                  </AccordionTrigger>
                  <AccordionContent>
                    <CanonicalExecutiveSummaryStrategic />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="pitch-strategic" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    Pitch Deck — Strategic (NVIDIA/NASA/Elon)
                  </AccordionTrigger>
                  <AccordionContent>
                    <CanonicalPitchDeckStrategic />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="approved-language" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    Approved vs Forbidden Language (Executive)
                  </AccordionTrigger>
                  <AccordionContent>
                    <ApprovedVsForbiddenLanguage />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="security-qa" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    Security & Infrastructure: CEO Q&A Drill
                  </AccordionTrigger>
                  <AccordionContent>
                    <CEOSecurityQADrill />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ceo-portfolio" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    CEO Professional Portfolio (PDF)
                  </AccordionTrigger>
                  <AccordionContent>
                    <CEOPortfolio />
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="demo-access" className="border rounded-lg px-4">
                  <AccordionTrigger className="text-lg font-semibold">
                    Demo Access & Permissions
                  </AccordionTrigger>
                  <AccordionContent>
                    <DemoAccessDocumentation />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="outreach" className="space-y-6">
              <PrintableHeading level={2}>01 — Outreach & Strategic Targets</PrintableHeading>
              {outreachEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl">{entry.title}</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(entry.content, entry.id)}
                    >
                      {copiedBlock === entry.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg print:bg-white print:text-black">
                      {entry.content}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="product" className="space-y-6">
              <PrintableHeading level={2}>02 — Product in Plain English</PrintableHeading>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">{plainEnglishEntry.title}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(plainEnglishEntry.content, "plain-english")}
                  >
                    {copiedBlock === "plain-english" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg print:bg-white print:text-black">
                    {plainEnglishEntry.content}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="disclosure" className="space-y-6">
              <PrintableHeading level={2}>03 — Enterprise Disclosure Rules</PrintableHeading>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">{enterpriseDisclosureEntry.title}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(enterpriseDisclosureEntry.content, "disclosure")}
                  >
                    {copiedBlock === "disclosure" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg print:bg-white print:text-black">
                    {enterpriseDisclosureEntry.content}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fundraising" className="space-y-6">
              <PrintableHeading level={2}>04 — Fundraising Operations</PrintableHeading>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl">{fundraisingEntry.title}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(fundraisingEntry.content, "fundraising")}
                  >
                    {copiedBlock === "fundraising" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm bg-muted/50 p-4 rounded-lg print:bg-white print:text-black">
                    {fundraisingEntry.content}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
