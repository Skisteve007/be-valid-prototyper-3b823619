import { PrintButton, LastUpdated, PrintableSection, PrintableHeading, QualityGateChecklist } from "../PrintStyles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <PrintableSection>
      <div className="flex items-center justify-between mb-6">
        <PrintableHeading level={2}>Discovery Questions (Use This on Calls)</PrintableHeading>
        <PrintButton />
      </div>
      <LastUpdated />

      <p className="text-muted-foreground mb-6 print:text-black">
        15 questions to uncover pain and qualify the opportunity. Pick 5–8 per call based on the prospect's role.
      </p>

      <div className="space-y-6">
        {questionGroups.map((group, index) => (
          <Card key={index} className="print:border-black print:bg-white print:break-inside-avoid">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg print:text-black">{group.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                {group.questions.map((question, qIndex) => (
                  <li key={qIndex} className="text-base print:text-black">{question}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 print:border-black print:bg-white">
        <CardHeader>
          <CardTitle className="text-lg print:text-black">Pro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-2 print:text-black">
            <li>Let them talk. Your job is to listen, not pitch.</li>
            <li>Take notes on their exact words — use their language back to them.</li>
            <li>If they say "we don't have that problem," ask "how do you know?"</li>
            <li>Always end with: "What would make this a priority for you this quarter?"</li>
          </ul>
        </CardContent>
      </Card>

      <QualityGateChecklist />
    </PrintableSection>
  );
};
