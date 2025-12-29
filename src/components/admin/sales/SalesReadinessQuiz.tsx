import { PrintButton, LastUpdated, PrintableSection, PrintableHeading, QualityGateChecklist } from "../PrintStyles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizQuestion {
  number: number;
  question: string;
  options: { letter: string; text: string }[];
  correctAnswer: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    number: 1,
    question: "Best one-sentence description of SYNTH is:",
    options: [
      { letter: "A", text: "A chatbot that answers questions" },
      { letter: "B", text: "A governance layer that makes AI decisions controllable and auditable" },
      { letter: "C", text: "A database for storing prompts" },
      { letter: "D", text: "A social network for AI users" }
    ],
    correctAnswer: "B"
  },
  {
    number: 2,
    question: "Best one-sentence description of VALID/GhostPass is:",
    options: [
      { letter: "A", text: "A barcode generator for flyers" },
      { letter: "B", text: "A privacy-first QR verification system for identity/access/compliance/payment" },
      { letter: "C", text: "A spreadsheet for guest lists" },
      { letter: "D", text: "A photo editing tool" }
    ],
    correctAnswer: "B"
  },
  {
    number: 3,
    question: "Which buyer pain is MOST aligned with us?",
    options: [
      { letter: "A", text: "We need more followers" },
      { letter: "B", text: "We need better logos" },
      { letter: "C", text: "We need to reduce fraud/liability and prove compliance" },
      { letter: "D", text: "We want more emojis in reports" }
    ],
    correctAnswer: "C"
  },
  {
    number: 4,
    question: "Which statement is NOT allowed in sales calls?",
    options: [
      { letter: "A", text: "We reduce risk and increase auditability." },
      { letter: "B", text: "We are unhackable and guarantee perfect accuracy." },
      { letter: "C", text: "We use verification gates to improve trust." },
      { letter: "D", text: "We can integrate with existing systems." }
    ],
    correctAnswer: "B"
  },
  {
    number: 5,
    question: "Which details must we avoid sharing publicly?",
    options: [
      { letter: "A", text: "Our mission statement" },
      { letter: "B", text: "Customer outcomes" },
      { letter: "C", text: "Model rosters/weights/thresholds and internal mechanics" },
      { letter: "D", text: "Our company name" }
    ],
    correctAnswer: "C"
  },
  {
    number: 6,
    question: "How do we talk about privacy correctly?",
    options: [
      { letter: "A", text: "We store all raw personal data forever." },
      { letter: "B", text: "We prefer passing verification signals rather than raw data when possible." },
      { letter: "C", text: "Privacy doesn't matter." },
      { letter: "D", text: "We sell personal data." }
    ],
    correctAnswer: "B"
  },
  {
    number: 7,
    question: "What is an 'audit trail' in simple words?",
    options: [
      { letter: "A", text: "A marketing slogan" },
      { letter: "B", text: "A record that shows what happened, when, and why" },
      { letter: "C", text: "A password list" },
      { letter: "D", text: "A music playlist" }
    ],
    correctAnswer: "B"
  },
  {
    number: 8,
    question: "How do we describe delivery timeline?",
    options: [
      { letter: "A", text: "Instant, same day, no customer input." },
      { letter: "B", text: "Usually 30–45 days after onboarding, depending on customer inputs and scope." },
      { letter: "C", text: "It takes 5 years." },
      { letter: "D", text: "We don't deliver." }
    ],
    correctAnswer: "B"
  },
  {
    number: 9,
    question: "How do we position next to big platforms (Salesforce/IAM/etc.)?",
    options: [
      { letter: "A", text: "We replace everything you use." },
      { letter: "B", text: "We complement systems of record with a verification/governance/audit layer." },
      { letter: "C", text: "We don't integrate with anything." },
      { letter: "D", text: "We only work for startups." }
    ],
    correctAnswer: "B"
  },
  {
    number: 10,
    question: "What is the best next step after interest?",
    options: [
      { letter: "A", text: "Send them memes." },
      { letter: "B", text: "Run a short pilot/onboarding plan with clear success criteria." },
      { letter: "C", text: "Argue about model brands." },
      { letter: "D", text: "Ask them to buy without any review." }
    ],
    correctAnswer: "B"
  }
];

export const SalesReadinessQuiz = () => {
  return (
    <PrintableSection>
      <div className="flex items-center justify-between mb-6">
        <PrintableHeading level={2}>Sales Readiness Quiz (10 Questions)</PrintableHeading>
        <PrintButton />
      </div>
      <LastUpdated />

      <p className="text-muted-foreground mb-6 print:text-black">
        Must-know questions for all sales team members. Score yourself, then review the answer key.
      </p>

      <div className="space-y-6 mb-8">
        {quizQuestions.map((q) => (
          <Card key={q.number} className="print:border-black print:bg-white print:break-inside-avoid">
            <CardHeader className="pb-2">
              <CardTitle className="text-base print:text-black">
                Q{q.number}) {q.question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {q.options.map((opt) => (
                  <div key={opt.letter} className="flex items-start gap-3 print:text-black">
                    <span className="font-mono text-sm">{opt.letter} ☐</span>
                    <span className="text-sm">{opt.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted print:border-black print:bg-white">
        <CardHeader>
          <CardTitle className="text-lg print:text-black">Answer Key</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4 text-center font-mono print:text-black">
            {quizQuestions.map((q) => (
              <div key={q.number}>
                <span className="font-bold">Q{q.number}</span> = {q.correctAnswer}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4 print:text-black">
            <strong>Passing Score:</strong> 8/10 or better. Review missed questions before customer calls.
          </p>
        </CardContent>
      </Card>

      <QualityGateChecklist />
    </PrintableSection>
  );
};
