// Canonical Operator Certification Rubric - Single Source of Truth
// This data is used across: /demos/operator-certification, /synth/methodology, admin sales manual, pricing

export interface RubricCategory {
  id: string;
  name: string;
  question: string;
  exampleEvidence: string;
}

export const rubricCategories: RubricCategory[] = [
  {
    id: "verification",
    name: "Verification Discipline",
    question: "Did the operator validate claims, check sources, and avoid fabricated citations?",
    exampleEvidence: "Source-checking frequency, citation hygiene, cross-validation attempts",
  },
  {
    id: "risk",
    name: "Risk Handling & Escalation",
    question: "Do they recognize high-risk situations, apply brakes, and escalate appropriately?",
    exampleEvidence: "Red-flag recognition rate, escalation behavior, safe fallback usage",
  },
  {
    id: "calibration",
    name: "Calibration (Trust vs Skepticism)",
    question: "Do they know when the AI is likely wrong—and adjust their confidence accordingly?",
    exampleEvidence: "Confidence calibration, probability labeling, update correctness",
  },
  {
    id: "auditability",
    name: "Auditability & Record Quality",
    question: "Can a reviewer reconstruct what happened from the proof record IDs and logs?",
    exampleEvidence: "Log completeness, proof record linkage, reconstruction fidelity",
  },
  {
    id: "policy",
    name: "Policy Compliance (Scope + Data Handling)",
    question: "Do they stay inside allowed boundaries and avoid leaking restricted data?",
    exampleEvidence: "Scope adherence, data handling rule compliance, boundary respect",
  },
  {
    id: "judgment",
    name: "Human Judgment (Override Ability)",
    question: "Can they override AI outputs when necessary instead of rubber-stamping?",
    exampleEvidence: "Override frequency when warranted, pushback quality, decision independence",
  },
  {
    id: "bias",
    name: "Bias / Fairness Awareness",
    question: "Do they spot bias risks and respond appropriately?",
    exampleEvidence: "Bias detection rate, corrective action taken, fairness considerations",
  },
  {
    id: "incident",
    name: "Incident Response Readiness",
    question: "Do they report anomalies and handle failures correctly?",
    exampleEvidence: "Anomaly reporting rate, failure handling, incident documentation",
  },
];

export const rubricOutputs = {
  overallScore: "Overall Score (0–100) + category sub-scores (0–100)",
  trendline: "Trendline across 7 / 30 / 60 / 90+ days (improving / stable / drifting)",
  report: "Cognitive & Governance Report with proof record IDs and reviewer-ready evidence",
};

export const pricingDrivers = [
  {
    category: "Operators Evaluated",
    description: "Number of operators evaluated per billing period",
  },
  {
    category: "Evaluation Window",
    description: "7 / 30 / 60 / 90 / 90+ days",
  },
  {
    category: "Report Depth",
    options: [
      "Executive Summary (score + trend)",
      "Full Cognitive & Governance Report (sub-scores + failure modes + evidence)",
    ],
  },
  {
    category: "Integrations / Traceability",
    options: [
      "Which LLM/interfaces are tracked (integrated tools, routed traffic, etc.)",
      "Audit exports (if applicable)",
    ],
  },
];
