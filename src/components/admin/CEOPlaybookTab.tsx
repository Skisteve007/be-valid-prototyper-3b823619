import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Copy, Check, BookOpen, MessageSquare, HelpCircle } from "lucide-react";
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
