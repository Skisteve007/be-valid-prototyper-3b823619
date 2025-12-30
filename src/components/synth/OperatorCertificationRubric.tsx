import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileCheck, CheckCircle } from "lucide-react";

// Canonical 10-category rubric - DO NOT MODIFY without updating all usages
export const rubricCategories = [
  {
    id: 1,
    category: "Verification Discipline",
    measure: "Does the operator validate claims and avoid \"confident nonsense\"?",
    good: "Cross-checks critical facts, asks for sources, verifies before acting",
    evidence: "Source checks, citations used, verification steps taken, corrections made",
  },
  {
    id: 2,
    category: "Risk Handling & Escalation",
    measure: "Do they apply brakes in high-stakes situations?",
    good: "Flags uncertainty, escalates to human review, uses safe defaults",
    evidence: "Red-flag events, escalation triggers, blocked actions, fallback paths",
  },
  {
    id: 3,
    category: "Calibration (Trust vs Skepticism)",
    measure: "Do they know when to trust AI vs challenge it?",
    good: "Matches confidence to evidence; doesn't over-trust fluent answers",
    evidence: "Confidence markers, challenge rate, acceptance vs rejection patterns",
  },
  {
    id: 4,
    category: "Reasoning Quality (Problem Solving)",
    measure: "Can they frame problems correctly and stay consistent?",
    good: "Clear problem definition, stepwise reasoning, handles pushback/ambiguity",
    evidence: "Prompt quality, constraint handling, self-consistency checks, revisions",
  },
  {
    id: 5,
    category: "Policy Compliance (Scope + Data)",
    measure: "Do they follow governance rules and avoid unsafe data use?",
    good: "Stays within allowed scope; avoids restricted data entry/exposure",
    evidence: "Policy hits/violations, restricted data detection, permitted-scope confirmations",
  },
  {
    id: 6,
    category: "Auditability & Record Quality",
    measure: "Can a reviewer reconstruct what happened and why?",
    good: "Creates a clean trail: inputs → checks → decision → outcome",
    evidence: "Proof record IDs, decision rationale, trace completeness, review artifacts",
  },
  {
    id: 7,
    category: "Bias / Fairness Awareness",
    measure: "Do they recognize bias risks and mitigate appropriately?",
    good: "Flags biased assumptions; uses neutral criteria; requests missing context",
    evidence: "Bias flags, fairness checks, counterfactual prompts, remediation actions",
  },
  {
    id: 8,
    category: "Incident Response Readiness",
    measure: "Do they respond correctly when AI fails?",
    good: "Reports anomalies, documents failures, participates in root-cause workflow",
    evidence: "Incident flags, reports generated, remediation steps, repeat-prevention actions",
  },
  {
    id: 9,
    category: "Tool/Model Hygiene (Interface Traceability)",
    measure: "Do they use approved tools and remain reproducible?",
    good: "Uses approved interfaces; can reproduce results; avoids shadow AI",
    evidence: "LLM/interface used, model/version where available, routing logs, tool switching",
  },
  {
    id: 10,
    category: "Operational Outcome Integrity",
    measure: "Do results hold up in the real world?",
    good: "Outputs are usable, verifiable, and consistent with requirements",
    evidence: "Post-check outcomes, reviewer overrides, error rates, downstream corrections",
  },
];

export const rubricOneLiner = "SYNTH measures how a person thinks and verifies while using AI—not just whether they got an answer. The rubric scores verification discipline, risk behavior, calibration, and auditability, producing a numeric score (0–100) with category breakdowns and an evidence trail that can be reviewed by engineers, doctors, and professors.";

interface RubricTableProps {
  variant?: "full" | "compact" | "cards";
  showHeader?: boolean;
  className?: string;
}

export const RubricTable = ({ variant = "full", showHeader = true, className = "" }: RubricTableProps) => {
  if (variant === "cards") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${className}`}>
        {rubricCategories.map((cat) => (
          <div key={cat.id} className="p-3 rounded-lg bg-muted/30 border border-border/30">
            <p className="font-medium text-foreground text-sm">{cat.id}) {cat.category}</p>
            <p className="text-xs text-muted-foreground mt-1">{cat.measure}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm border-collapse">
        {showHeader && (
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 font-semibold text-foreground bg-muted/30">Category (0–100)</th>
              <th className="text-left p-3 font-semibold text-foreground bg-muted/30">What we measure</th>
              <th className="text-left p-3 font-semibold text-foreground bg-muted/30 hidden lg:table-cell">What "good" looks like</th>
              <th className="text-left p-3 font-semibold text-foreground bg-muted/30 hidden xl:table-cell">Evidence captured</th>
            </tr>
          </thead>
        )}
        <tbody className="divide-y divide-border/50">
          {rubricCategories.map((cat) => (
            <tr key={cat.id} className="hover:bg-muted/20 transition">
              <td className="p-3 font-medium text-foreground whitespace-nowrap">
                <span className="text-primary font-bold mr-1">{cat.id})</span> {cat.category}
              </td>
              <td className="p-3 text-muted-foreground">{cat.measure}</td>
              <td className="p-3 text-muted-foreground hidden lg:table-cell">{cat.good}</td>
              <td className="p-3 text-muted-foreground text-xs hidden xl:table-cell">{cat.evidence}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const RubricOutputs = () => (
  <div className="space-y-3">
    <h4 className="font-semibold text-foreground">Outputs delivered:</h4>
    <ul className="space-y-1 text-sm text-muted-foreground">
      <li className="flex items-start gap-2">
        <CheckCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" />
        <span><strong className="text-foreground">Overall Score (0–100)</strong></span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" />
        <span><strong className="text-foreground">Category sub-scores (0–100)</strong> for each rubric line</span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" />
        <span><strong className="text-foreground">Trendline over time</strong> (7 / 30 / 60 / 90 / 90+ days): improving / stable / drifting</span>
      </li>
      <li className="flex items-start gap-2">
        <CheckCircle className="h-4 w-4 mt-0.5 text-primary shrink-0" />
        <span><strong className="text-foreground">Evidence pack:</strong> proof record IDs + reviewer-ready traces</span>
      </li>
    </ul>
    <div className="pt-2 text-sm text-muted-foreground">
      <p className="font-medium text-foreground mb-1">Optional (summary layer only):</p>
      <ul className="space-y-0.5 text-xs">
        <li>• PASS / REVIEW / FAIL derived from score thresholds (kept secondary to numeric scoring)</li>
      </ul>
    </div>
  </div>
);

interface OperatorCertificationRubricProps {
  variant?: "demo" | "methodology" | "admin";
  showOneLiner?: boolean;
}

export const OperatorCertificationRubric = ({ variant = "demo", showOneLiner = true }: OperatorCertificationRubricProps) => {
  const title = variant === "methodology" 
    ? "Operator Certification Rubric (Best‑Practice Aligned)"
    : "What we score (0–100): the Operator Certification Rubric";

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        {showOneLiner && (
          <CardDescription className="text-base">
            {rubricOneLiner}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <RubricTable variant="full" />
        <div className="pt-4 border-t border-border/50">
          <RubricOutputs />
        </div>
      </CardContent>
    </Card>
  );
};

export default OperatorCertificationRubric;
