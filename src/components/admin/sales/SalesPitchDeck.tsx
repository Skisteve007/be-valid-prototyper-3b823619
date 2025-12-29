import { PrintButton, LastUpdated, PrintableSection, PrintableHeading, PrintableBulletList, QualityGateChecklist, BrandedHeader, LegalFooter } from "../PrintStyles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Slide {
  number: number;
  title: string;
  bullets: string[];
  talkTrack?: string;
}

const slides: Slide[] = [
  {
    number: 1,
    title: "What We Sell and Why Customers Care",
    bullets: [
      "SYNTH™ — Governance layer for AI decisions",
      "VALID™/GhostPass — Privacy-first verification for identity/access/payment",
      "Together: a trust stack that reduces fraud, liability, and audit risk"
    ],
    talkTrack: "Start with the outcome: we help organizations trust AI and verify people without creating new risks."
  },
  {
    number: 2,
    title: "The Pain: What Keeps Buyers Up at Night",
    bullets: [
      "Fraud losses and liability exposure",
      "Slow, manual verification processes",
      "Untrusted AI outputs making decisions",
      "Can't prove what happened when audited",
      "Compliance gaps and regulatory risk"
    ],
    talkTrack: "Ask: 'Which of these keeps you up at night?' Let them tell you their pain."
  },
  {
    number: 3,
    title: "SYNTH in One Minute",
    bullets: [
      "Takes an AI output or agent action",
      "Runs policy checks and verification gates",
      "Produces a governed result with audit trail",
      "Escalates edge cases for human review",
      "Creates tamper-evident records for compliance"
    ],
    talkTrack: "Analogy: SYNTH is the safety control room for AI. It checks before the AI acts, records everything, and can stop problems."
  },
  {
    number: 4,
    title: "VALID/GhostPass in One Minute",
    bullets: [
      "Encrypted, time-limited QR tokens",
      "Verifies identity, age, access, compliance, payment",
      "Privacy-first: verification signals, not raw data",
      "Scans in under 3 seconds",
      "Works at doors, kiosks, and point-of-sale"
    ],
    talkTrack: "Analogy: GhostPass is like a TSA PreCheck for your venue — fast, verified, no paper IDs."
  },
  {
    number: 5,
    title: "Top Use Cases",
    bullets: [
      "AI agent governance in regulated workflows",
      "High-volume venue access control",
      "Age and identity verification (no ID handling)",
      "Workforce compliance and credential checks",
      "Payment and bar tab verification",
      "Audit trail for disputed transactions"
    ],
    talkTrack: "Pick the 2–3 most relevant to the prospect and go deep."
  },
  {
    number: 6,
    title: "What Makes Us Different",
    bullets: [
      "Governance, not just monitoring — we enforce, not just observe",
      "Privacy-first architecture — verification signals, not stored PII",
      "Audit-ready records — prove what happened for compliance",
      "Fail-safe modes — system degrades safely, not catastrophically",
      "Enterprise-ready — built for regulated environments"
    ],
    talkTrack: "Competitors log. We enforce and prove. That's the difference when it matters."
  },
  {
    number: 7,
    title: "How We Integrate",
    bullets: [
      "API-first: connect to existing systems",
      "Works alongside current identity/access tools",
      "Adds a verification/governance layer, doesn't replace everything",
      "Configuration-driven: tune for your business rules",
      "Support for private deployment where required"
    ],
    talkTrack: "We complement your stack. We're not asking you to rip and replace."
  },
  {
    number: 8,
    title: "Timeline: 30–45 Day Onboarding",
    bullets: [
      "Week 1: Kickoff call, gather requirements",
      "Week 2–3: Configuration and integration setup",
      "Week 3–4: Testing and validation",
      "Week 4–6: Go-live and monitoring",
      "Customer inputs required: credentials, policies, test scenarios"
    ],
    talkTrack: "We move fast but we need your inputs. The timeline depends on how quickly you can provide access and requirements."
  },
  {
    number: 9,
    title: "ROI Talk Track",
    bullets: [
      "Time saved: verification in seconds, not minutes",
      "Fraud reduced: gates catch problems before they cost money",
      "Liability reduced: audit trail proves what happened",
      "Compliance cost down: records ready when auditors ask",
      "Staff efficiency: less manual checking, more throughput"
    ],
    talkTrack: "Ask: 'What does a fraud incident cost you today?' Then show how we reduce that."
  },
  {
    number: 10,
    title: "Common Objections (Preview)",
    bullets: [
      "'We already have AI tools' — We govern them, not replace them",
      "'Why multiple models?' — Reduces single-point failures",
      "'Privacy concerns' — We minimize data, prefer signals",
      "'Too expensive' — Compare to cost of one incident"
    ],
    talkTrack: "See the full objection handling guide for detailed responses."
  },
  {
    number: 11,
    title: "Next Steps: Pilot Checklist",
    bullets: [
      "Identify first use case (highest pain)",
      "Assign internal champion",
      "Provide credentials and access for integration",
      "Define success criteria (what does 'working' look like?)",
      "Schedule kickoff call"
    ],
    talkTrack: "Close with: 'What would make this a successful pilot for you?' Then schedule the kickoff."
  },
  {
    number: 12,
    title: "Close: Choose Your Package",
    bullets: [
      "Review pricing menu together",
      "Match package to their scale and use case",
      "Confirm timeline and next steps",
      "Get verbal commitment and schedule paperwork"
    ],
    talkTrack: "Always end with a clear next step. Never leave without knowing what happens next."
  }
];

export const SalesPitchDeck = () => {
  return (
    <PrintableSection>
      <BrandedHeader title="Sales Pitch Deck" variant="both" />
      <div className="flex items-center justify-between mb-6">
        <PrintableHeading level={2}>Pitch Deck — Sales Training (Canonical)</PrintableHeading>
        <PrintButton />
      </div>
      <LastUpdated />

      <p className="text-muted-foreground mb-6 print:text-black">
        12 slides with talk tracks. Use this as your field guide. Position SYNTH first, then VALID/GhostPass.
      </p>

      <div className="space-y-6">
        {slides.map((slide) => (
          <Card key={slide.number} className="print:border-black print:bg-white print:break-inside-avoid">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg print:text-black">
                Slide {slide.number}: {slide.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <PrintableBulletList items={slide.bullets} />
              {slide.talkTrack && (
                <div className="bg-muted/50 p-3 rounded-lg print:bg-gray-100">
                  <p className="text-sm font-medium text-primary print:text-black">💬 Talk Track:</p>
                  <p className="text-sm italic print:text-black">{slide.talkTrack}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <QualityGateChecklist />
      <LegalFooter />
    </PrintableSection>
  );
};
