import { PrintButton, LastUpdated, PrintableSection, PrintableHeading, QualityGateChecklist } from "../PrintStyles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Objection {
  whatTheySay: string;
  bestResponse: string;
  followUp: string;
}

const objections: Objection[] = [
  {
    whatTheySay: "We already have a chatbot/AI tool.",
    bestResponse: "Great — we don't replace your AI, we govern it. SYNTH adds policy enforcement and audit trails on top of whatever AI you're using. Think of us as the safety layer, not a competing tool.",
    followUp: "What happens today when your AI gives a wrong or risky answer? How do you catch it?"
  },
  {
    whatTheySay: "Why should we trust AI at all?",
    bestResponse: "That's exactly the problem we solve. SYNTH makes AI decisions auditable and controllable — you can set rules, verify outputs, and prove what happened. It's about making AI trustworthy, not blind trust.",
    followUp: "What would it take for you to trust an AI-assisted decision in your workflow?"
  },
  {
    whatTheySay: "Why not just use one model/vendor?",
    bestResponse: "Single models have single points of failure. If your one model hallucinates or goes down, you have no backup. We use multiple independent checks to reduce that risk — governance, not dependence.",
    followUp: "Have you had issues with AI reliability or consistency?"
  },
  {
    whatTheySay: "We already have QR codes.",
    bestResponse: "Most QR codes are just links. GhostPass is encrypted, time-limited, and privacy-first — it verifies without storing personal data. It's the difference between a sticker and a secure credential.",
    followUp: "How do your current QR codes handle expiration, fraud, or privacy?"
  },
  {
    whatTheySay: "We're worried about privacy.",
    bestResponse: "So are we. That's why we built a privacy-first architecture. We prefer verification signals over stored data. When we do store, we minimize and protect it. We can walk you through our approach.",
    followUp: "What are your specific privacy requirements? Regulation, internal policy, or both?"
  },
  {
    whatTheySay: "We're worried about compliance.",
    bestResponse: "Compliance is one of our strengths. SYNTH creates audit-ready records — you can prove what happened, when, and why. That's what auditors want to see.",
    followUp: "What compliance frameworks do you need to meet? SOC2, HIPAA, industry-specific?"
  },
  {
    whatTheySay: "This sounds expensive.",
    bestResponse: "Compare it to the cost of one fraud incident, one compliance failure, or one lawsuit. Our customers see ROI in reduced fraud, faster ops, and audit readiness. It usually pays for itself.",
    followUp: "What does a single fraud incident cost you today?"
  },
  {
    whatTheySay: "Integration will take too long.",
    bestResponse: "We're API-first and designed to complement existing systems, not replace them. Typical onboarding is 30–45 days, and that includes testing. We've done it faster when customers are ready.",
    followUp: "What systems would we need to connect to? Let's scope it."
  },
  {
    whatTheySay: "What if your system goes down?",
    bestResponse: "We build for resilience. We have fail-safe modes that degrade gracefully or fail closed depending on risk level. We don't leave you exposed.",
    followUp: "What's your current fallback when critical systems go down?"
  },
  {
    whatTheySay: "Who is liable if something goes wrong?",
    bestResponse: "Liability depends on what went wrong and where. Our job is to reduce your liability by creating audit trails, enforcing policies, and catching problems early. We can discuss specifics with your legal team.",
    followUp: "What's your biggest liability concern right now?"
  },
  {
    whatTheySay: "Can this work at our scale?",
    bestResponse: "We're built for high-volume operations — venues, enterprises, and regulated workflows. What scale are you looking at? Let's make sure we're a fit.",
    followUp: "How many transactions or verifications do you process per day?"
  },
  {
    whatTheySay: "How is this different from Salesforce / IAM / access control vendors?",
    bestResponse: "We complement those systems, not replace them. Salesforce is your CRM. IAM controls who logs in. We add a verification and governance layer for decisions and actions — the 'prove it' layer.",
    followUp: "What gaps do you have today between access control and proving what happened?"
  }
];

export const ObjectionHandling = () => {
  return (
    <PrintableSection>
      <div className="flex items-center justify-between mb-6">
        <PrintableHeading level={2}>Objection Handling (Scripts)</PrintableHeading>
        <PrintButton />
      </div>
      <LastUpdated />

      <p className="text-muted-foreground mb-6 print:text-black">
        12 common objections with responses. Keep answers short. Always end with a follow-up question to keep the conversation going.
      </p>

      <div className="space-y-4">
        {objections.map((obj, index) => (
          <Card key={index} className="print:border-black print:bg-white print:break-inside-avoid">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold print:text-black">
                {index + 1}. "{obj.whatTheySay}"
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-primary print:text-black">Best Response:</p>
                <p className="text-sm print:text-black">{obj.bestResponse}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-600 print:text-black">Follow-Up Question:</p>
                <p className="text-sm italic print:text-black">"{obj.followUp}"</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <QualityGateChecklist />
    </PrintableSection>
  );
};
