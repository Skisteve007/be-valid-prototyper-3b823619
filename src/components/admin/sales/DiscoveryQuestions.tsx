import { PrintButton, ExportPDFButton, LastUpdated, PrintableHeading, PrintableCard, BrandedHeader, LegalFooter } from "../PrintStyles";

interface QuestionGroup {
  category: string;
  questions: string[];
}

const questionGroups: QuestionGroup[] = [
  {
    category: "Risk / Compliance",
    questions: [
      "What happens when you get audited? How long does it take to pull records?",
      "How do you currently prove that a decision was made correctly?",
      "What's your biggest compliance gap right now?",
      "Who is responsible when an AI-driven decision goes wrong?",
      "Have you had incidents where you couldn't prove what happened?"
    ]
  },
  {
    category: "Security / Fraud",
    questions: [
      "What does a fraud incident cost you on average?",
      "How do you verify identity or credentials today?",
      "What's your biggest fraud vector right now?",
      "How do you detect suspicious behavior before it becomes a problem?"
    ]
  },
  {
    category: "Operations / Scale",
    questions: [
      "How many verifications or decisions do you process per day/week?",
      "What's the bottleneck in your current verification process?",
      "How much staff time goes into manual checking?",
      "What happens when your current system goes down?"
    ]
  },
  {
    category: "AI / Automation",
    questions: [
      "Are you using AI agents or automation in production today?",
      "How do you know when an AI output is wrong or risky?"
    ]
  }
];

export const DiscoveryQuestions = () => {
  return (
    <div className="space-y-6 print-content">
      <BrandedHeader title="Discovery Questions" variant="both" />
      
      <div className="flex justify-between items-start">
        <div>
          <PrintableHeading level={2}>Discovery Questions (Use This on Calls)</PrintableHeading>
          <p className="text-muted-foreground mb-2 print:!text-gray-700">15 questions to uncover pain and qualify the opportunity</p>
          <LastUpdated />
        </div>
        <div className="flex gap-2 print:hidden">
          <PrintButton />
          <ExportPDFButton />
        </div>
      </div>

      <div className="grid gap-4">
        {questionGroups.map((group, index) => (
          <PrintableCard key={index}>
            <PrintableHeading level={3}>{group.category}</PrintableHeading>
            <ol className="list-decimal list-inside space-y-2 mt-3">
              {group.questions.map((question, qIndex) => (
                <li key={qIndex} className="text-base print:!text-black">{question}</li>
              ))}
            </ol>
          </PrintableCard>
        ))}
      </div>

      <PrintableCard>
        <PrintableHeading level={3}>Pro Tips</PrintableHeading>
        <ul className="list-disc list-inside space-y-2 mt-3 print:!text-black">
          <li>Let them talk. Your job is to listen, not pitch.</li>
          <li>Take notes on their exact words — use their language back to them.</li>
          <li>If they say "we don't have that problem," ask "how do you know?"</li>
          <li>Always end with: "What would make this a priority for you this quarter?"</li>
        </ul>
      </PrintableCard>

      <LegalFooter />
    </div>
  );
};
