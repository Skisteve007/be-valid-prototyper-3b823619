export interface PaymentSchedule {
  day: number;
  amount: number;
  label: string;
}

export interface RoadmapPhase {
  days: string;
  description: string;
}

export interface TierConfig {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  priceValue: number;
  timeline: string;
  term: string;
  outcome: string;
  stripePriceId: string;
  includes: string[];
  paymentSchedule: PaymentSchedule[];
  roadmap: RoadmapPhase[];
  clientRequirements: string[];
}

export const AGREEMENT_TIERS: TierConfig[] = [
  {
    id: "sector-sovereign",
    name: "SECTOR SOVEREIGN",
    subtitle: "Exclusive Sector License",
    price: "$1,000,000",
    priceValue: 1000000,
    timeline: "45 Days (accelerated)",
    term: "3-Year Sector Exclusivity",
    outcome: "Deploy a Sovereign Shield + Citizen App with exclusive sector rights.",
    stripePriceId: "price_1Sj6lfQVr0M2u4MsJ0PFLwIQ",
    includes: [
      "Sector Sovereignty License (Exclusive Rights to \"Senate\" Architecture)",
      "White Label Rights & Source Code Escrow (Included)",
      "Ghost Token \"Citizen App\" (White Label Consumer Layer) (Included)"
    ],
    paymentSchedule: [
      { day: 1, amount: 330000, label: "Upon Signing" },
      { day: 21, amount: 330000, label: "Milestone 2" },
      { day: 45, amount: 340000, label: "Go-Live + Source Release" }
    ],
    roadmap: [
      { days: "1–15", description: "Constitution (map sector supreme laws into veto nodes)" },
      { days: "16–30", description: "Deep Integration (legacy systems + consumer app backend)" },
      { days: "31–45", description: "Sovereign Launch (GO LIVE Day 45)" }
    ],
    clientRequirements: [
      "Regulatory compliance documentation",
      "User database API access",
      "Security clearance for engineers"
    ]
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    subtitle: "Enterprise Shield",
    price: "$250,000 / year",
    priceValue: 250000,
    timeline: "45 Days calibration → GO LIVE",
    term: "Non-exclusive annual license",
    outcome: "On-prem Senate container + sovereign audit log + QR scanner integration.",
    stripePriceId: "price_1Sj6ntQVr0M2u4MsuloQ3BfC",
    includes: [
      "Annual \"Senate\" License (On-Prem deployment)",
      "45-Day Custom Calibration (Included)",
      "Ghost Token Integration (Scanner capability) (Included)"
    ],
    paymentSchedule: [
      { day: 1, amount: 82500, label: "Upon Signing" },
      { day: 21, amount: 82500, label: "Milestone 2" },
      { day: 45, amount: 85000, label: "Go-Live" }
    ],
    roadmap: [
      { days: "1–15", description: "Mapping (Top legal/brand \"never events\")" },
      { days: "16–30", description: "Shadow Mode (log silently)" },
      { days: "31–45", description: "Active Veto (GO LIVE Day 45)" }
    ],
    clientRequirements: [
      "Top 20 \"Red Line\" risks",
      "90 days historical AI logs (if applicable)",
      "VM/container in AWS/Azure (8 vCPU, 32GB RAM)"
    ]
  },
  {
    id: "growth",
    name: "GROWTH",
    subtitle: "Strategic Pilot",
    price: "$75,000 (90 days)",
    priceValue: 75000,
    timeline: "45-Day ramp to live",
    term: "90-day engagement",
    outcome: "Liability Shield API + Verified by Valid badge + adversarial stress testing.",
    stripePriceId: "price_1Sj6p6QVr0M2u4MsgKasH3Bd",
    includes: [
      "Liability Shield API (sidecar consensus loop)",
      "\"Verified by Valid\" marketing license",
      "Adversarial red teaming"
    ],
    paymentSchedule: [
      { day: 1, amount: 24750, label: "Upon Signing" },
      { day: 21, amount: 24750, label: "Milestone 2" },
      { day: 45, amount: 25500, label: "Go-Live" }
    ],
    roadmap: [
      { days: "1–10", description: "API handshake" },
      { days: "11–30", description: "Adversarial training" },
      { days: "31–45", description: "Live calibration" }
    ],
    clientRequirements: [
      "API endpoint documentation",
      "Designated technical contact",
      "Integration sandbox environment"
    ]
  },
  {
    id: "main-street",
    name: "MAIN STREET",
    subtitle: "Compliance Widget",
    price: "$5,000 + $499/month",
    priceValue: 5000,
    timeline: "14 Days to Go Live",
    term: "Monthly subscription after setup",
    outcome: "Widget guardrails + sector pack + desk scanner.",
    stripePriceId: "price_1Sj6q4QVr0M2u4Ms0H63cTTE",
    includes: [
      "Compliance widget snippet (wrap website chatbot)",
      "Sector pack (preloaded rules)",
      "Ghost Token desk scanner software"
    ],
    paymentSchedule: [
      { day: 1, amount: 1650, label: "Upon Signing" },
      { day: 7, amount: 1650, label: "Milestone 2" },
      { day: 14, amount: 1700, label: "Go-Live" }
    ],
    roadmap: [
      { days: "1–5", description: "Widget configuration & sector pack selection" },
      { days: "6–10", description: "Integration testing" },
      { days: "11–14", description: "Go Live + training" }
    ],
    clientRequirements: [
      "Website admin access",
      "Service menu/price list",
      "Front desk device (tablet/computer)"
    ]
  }
];
