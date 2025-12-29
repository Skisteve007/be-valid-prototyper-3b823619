// Slide content data for 2026 Evolution VALID SYNTH GHOST Pitch Deck
export interface EvolutionSlideData {
  id: number;
  title: string;
  subtitle?: string;
  content?: string[];
  stats?: { label: string; value: string }[];
  bullets?: string[];
  highlight?: string;
  layout: 'cover' | 'title-content' | 'stats' | 'bullets' | 'comparison' | 'cta';
}

export const evolution2026Slides: EvolutionSlideData[] = [
  {
    id: 1,
    title: "SYNTH™",
    subtitle: "Verified AI Decisions + Audit Trails for High-Stakes Environments",
    highlight: "VALID™ / GHOST™ Pass: Real-World Verification Rail",
    layout: 'cover',
  },
  {
    id: 2,
    title: "THE AGENT PROBLEM",
    subtitle: "AI Is Powerful — But In Production It Creates Risk",
    bullets: [
      "Confident wrong answers (hallucinations)",
      "No clear accountability",
      "Hard to prove what happened later",
      "Unsafe actions when agents are connected to tools/systems"
    ],
    layout: 'bullets',
  },
  {
    id: 3,
    title: "THE COST OF GETTING IT WRONG",
    subtitle: "In Regulated or Mission-Critical Settings, Failures Create:",
    bullets: [
      "Liability, fraud, compliance exposure",
      "Security incidents",
      "Bad decisions at scale",
      "Loss of trust + stalled adoption"
    ],
    layout: 'bullets',
  },
  {
    id: 4,
    title: "THE SOLUTION",
    subtitle: "SYNTH™ is an Identity & Verification Layer for AI/Agents",
    bullets: [
      "Independent reviewers → governed consensus",
      "Policy controls → safe behavior boundaries",
      "Verification gates → higher factual reliability",
      "Audit records → defensible outcomes"
    ],
    layout: 'bullets',
  },
  {
    id: 5,
    title: "HOW SYNTH™ WORKS",
    subtitle: "High-Level Pipeline",
    bullets: [
      "Takes an input or agent action proposal",
      "Runs multiple independent AI reviewers in parallel",
      "Produces a single result + reasons + risk flags",
      "Escalates edge cases for stricter review",
      "Creates tamper-evident audit logs for compliance"
    ],
    layout: 'bullets',
  },
  {
    id: 6,
    title: "SECURITY + CONTROL",
    subtitle: "Enterprise-Ready Governance",
    stats: [
      { label: "Permissions", value: "RBAC" },
      { label: "Anomaly", value: "Detection" },
      { label: "Degradation", value: "Fail-Safe" },
      { label: "Budgets", value: "Enforced" }
    ],
    bullets: [
      "Role-based permissions (who can run/approve/change policy)",
      "Anomaly detection for suspicious sessions",
      "Fail-safe modes when dependencies degrade",
      "Budget controls (latency/cost/timeouts)"
    ],
    layout: 'stats',
  },
  {
    id: 7,
    title: "WHAT'S BUILT",
    subtitle: "Production-Ready Foundation",
    bullets: [
      "Multi-reviewer governance pipeline",
      "Structured decision records",
      "Tamper-evident audit trail (hash-chain)",
      "Admin + calibration controls",
      "Production deployment foundation (web + backend)"
    ],
    highlight: "Live & Operational",
    layout: 'bullets',
  },
  {
    id: 8,
    title: "VALID™ / GHOST™ PASS",
    subtitle: "Real-World Trust — Same Architecture",
    stats: [
      { label: "QR Tokens", value: "Encrypted" },
      { label: "TTL", value: "Time-Limited" },
      { label: "Data Stored", value: "Zero PII" },
      { label: "Verification", value: "3 Seconds" }
    ],
    bullets: [
      "High-volume verification for venues/enterprise",
      "Door scan / kiosk mode",
      "Wallet funding + transaction support",
      "Privacy-first: verification signals, not raw data"
    ],
    layout: 'stats',
  },
  {
    id: 9,
    title: "WHO WE SELL TO",
    subtitle: "Target Markets",
    bullets: [
      "Enterprises deploying AI agents in regulated workflows",
      "Security / compliance-heavy industries",
      "High-volume venues and access control operators",
      "Transportation, workforce compliance, identity/access"
    ],
    layout: 'bullets',
  },
  {
    id: 10,
    title: "WHY NOW",
    subtitle: "AI Is Moving From Chat to Action — We Make It Governed",
    content: [
      "AI is moving from chat to action.",
      "We make it governed, auditable, and deployable."
    ],
    highlight: "ASK: Partnerships, Pilots, and Platform Alignment",
    layout: 'cta',
  },
];
