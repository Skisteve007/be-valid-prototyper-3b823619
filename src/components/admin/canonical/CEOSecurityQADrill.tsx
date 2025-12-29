import { PrintButton, LastUpdated, PrintableSection, PrintableHeading, QualityGateChecklist } from "../PrintStyles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QAItem {
  question: string;
  shortAnswer: string;
  ifPressed: string;
  doNotSay: string;
}

const qaItems: QAItem[] = [
  {
    question: "Q1: Where is our data stored?",
    shortAnswer: "We use enterprise cloud infrastructure with secured database and storage, access controls, and audit logging.",
    ifPressed: "We follow least-privilege access, role-based controls, and we minimize sensitive data storage.",
    doNotSay: "Exact internal tables, keys, or security trigger thresholds."
  },
  {
    question: "Q2: Do we store personal data?",
    shortAnswer: "We minimize what we store. When verification is needed, we prefer passing verification signals rather than storing raw sensitive data.",
    ifPressed: "Retention is configurable based on business and compliance needs.",
    doNotSay: "'We store nothing' (avoid absolute claims)."
  },
  {
    question: "Q3: How do we handle payments?",
    shortAnswer: "Payments are handled by regulated payment providers; we do not store card numbers.",
    ifPressed: "We receive confirmation events needed to run the service.",
    doNotSay: "Payment credential details."
  },
  {
    question: "Q4: How do we control who can access admin tools?",
    shortAnswer: "Role-based access control and restricted admin permissions.",
    ifPressed: "We log privileged actions.",
    doNotSay: "Exact permission matrix."
  },
  {
    question: "Q5: How do we prevent fraud and abuse?",
    shortAnswer: "We use verification gates and monitoring signals to detect suspicious behavior and enforce step-up checks when needed.",
    ifPressed: "We can tune controls by customer risk level.",
    doNotSay: "Exact detection thresholds or token TTL."
  },
  {
    question: "Q6: What happens if a dependency goes down?",
    shortAnswer: "We support fail-safe modes: degrade safely, retry, or fail closed depending on the risk.",
    ifPressed: "We have monitoring and alerting for critical dependencies.",
    doNotSay: "Internal vendor incident details."
  },
  {
    question: "Q7: How is SYNTH different from a normal AI chatbot?",
    shortAnswer: "SYNTH is built for governance: it enforces rules, verifies outputs where needed, and produces audit-ready records.",
    ifPressed: "We separate policy enforcement from generation.",
    doNotSay: "Internal evaluation math."
  },
  {
    question: "Q8: Can this run in enterprise environments?",
    shortAnswer: "Yes. We are built for enterprise security expectations and can support private deployment approaches where required.",
    ifPressed: "We can discuss deployment options under NDA.",
    doNotSay: "Over-promise capabilities not yet built."
  },
  {
    question: "Q9: What is our 'zero trust' stance?",
    shortAnswer: "No request is trusted by default. Actions require verification and authorization.",
    ifPressed: "Every action is logged and attributable.",
    doNotSay: "Implementation specifics."
  },
  {
    question: "Q10: What's the simplest one-liner to remember?",
    shortAnswer: "SYNTH makes AI decisions governable and auditable. VALID™/GhostPass makes real-world verification fast and privacy-first.",
    ifPressed: "We're the trust layer for AI and physical access.",
    doNotSay: "Nothing — this is the safe elevator pitch."
  }
];

export const CEOSecurityQADrill = () => {
  return (
    <PrintableSection>
      <div className="flex items-center justify-between mb-6">
        <PrintableHeading level={2}>Security & Infrastructure: CEO Q&A Drill</PrintableHeading>
        <PrintButton />
      </div>
      <LastUpdated />

      <p className="text-muted-foreground mb-6 print:text-black">
        Use these answers when investors, partners, or technical reviewers ask security questions. 
        Keep answers short. Use "If pressed" only when needed. Never share "Do not say" items.
      </p>

      <div className="space-y-4">
        {qaItems.map((item, index) => (
          <Card key={index} className="print:border-black print:bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold print:text-black">{item.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-primary print:text-black">Short Answer:</p>
                <p className="text-sm print:text-black">{item.shortAnswer}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-amber-600 print:text-black">If Pressed:</p>
                <p className="text-sm print:text-black">{item.ifPressed}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-destructive print:text-black">⛔ Do NOT Say:</p>
                <p className="text-sm print:text-black">{item.doNotSay}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <QualityGateChecklist />
    </PrintableSection>
  );
};
