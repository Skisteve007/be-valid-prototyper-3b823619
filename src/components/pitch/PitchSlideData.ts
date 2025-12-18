// Slide content data for HTML/CSS rendered pitch deck
export interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  content?: string[];
  stats?: { label: string; value: string }[];
  bullets?: string[];
  highlight?: string;
  layout: 'cover' | 'title-content' | 'stats' | 'bullets' | 'comparison' | 'cta';
}

export const pitchSlides: SlideData[] = [
  {
    id: 1,
    title: "VALID™",
    subtitle: "Zero-Trust Identity & Payment Infrastructure",
    highlight: "Confidential — Investor Only",
    layout: 'cover',
  },
  {
    id: 2,
    title: "THE PROBLEM",
    content: [
      "Venues lose $2.4B annually to fraud, chargebacks, and liability claims",
      "Identity verification is fragmented across 12+ systems",
      "No unified solution connects ID, health status, and payments"
    ],
    layout: 'title-content',
  },
  {
    id: 3,
    title: "THE SOLUTION",
    subtitle: "One Scan. Identity + Payment + Compliance.",
    content: [
      "VALID™ is a zero-trust identity wallet that verifies, authorizes, and settles in 3 seconds",
      "We are a Pipeline, Not a Vault — we transmit encrypted tokens, never store raw PII"
    ],
    layout: 'title-content',
  },
  {
    id: 4,
    title: "PRODUCT OVERVIEW",
    subtitle: "The GHOST™ Token",
    bullets: [
      "Encrypted identity verification in real-time",
      "Pre-funded wallet with instant settlement",
      "Health/toxicology status integration",
      "Works across 10 industry verticals"
    ],
    layout: 'bullets',
  },
  {
    id: 5,
    title: "HOW IT WORKS",
    bullets: [
      "Member creates VALID™ account & verifies identity",
      "Funds GHOST™ wallet (pre-paid, zero chargebacks)",
      "Scans QR at venue — verified in 3 seconds",
      "Venue receives instant settlement + liability shield"
    ],
    layout: 'bullets',
  },
  {
    id: 6,
    title: "MARKET OPPORTUNITY",
    subtitle: "Total Addressable Market: $11.4B+",
    stats: [
      { label: "TAM", value: "$11.4B+" },
      { label: "SAM", value: "$2.8B" },
      { label: "SOM (Y3)", value: "$50M" }
    ],
    bullets: [
      "Entertainment & Hospitality — $6.4B (Nightlife $2.5B, Events $1.8B, Stadiums $1.2B, Hospitality $0.9B)",
      "Enterprise & Security — $3.5B (Universities $1.2B, Workforce $1.5B, Transportation $0.8B)",
      "Specialized Verticals — $1.5B (Labs $0.6B, Rentals $0.4B, Other $0.5B)"
    ],
    content: ["Identity verification isn't just for nightclubs. From clubs to campuses to stadiums — we're building the universal trust layer for physical spaces."],
    layout: 'stats',
  },
  {
    id: 7,
    title: "BUSINESS MODEL",
    subtitle: "9 Revenue Streams",
    bullets: [
      "TRANSACTION FEES — 1.5% on all payments",
      "MEMBER SUBSCRIPTIONS — $39 per 60 days",
      "GHOST™ PASSES — $10 / $20 / $50 (30/30/10/30 split)",
      "COMMUNITY POOL — Weekly venue distributions",
      "HEALTH/LAB MARGINS — 40-60% on lab tests",
      "VENUE LICENSING — $99–$7,500/month base",
      "PER-USER FEES — $3–$8/person/month",
      "VERIFICATION FEES — $50–$100/background check",
      "GAS FEES (Per-Scan) — $0.05–$0.50/scan · Every ID scan = revenue"
    ],
    layout: 'bullets',
  },
  {
    id: 8,
    title: "TRACTION",
    stats: [
      { label: "Partner Venues", value: "28+" },
      { label: "Countries", value: "11" },
      { label: "Member Growth", value: "15% MoM" }
    ],
    highlight: "Revenue Generating",
    layout: 'stats',
  },
  {
    id: 9,
    title: "COMPETITIVE LANDSCAPE",
    subtitle: "VALID™ vs. The Market",
    content: [
      "CLEAR — ID only, no payments, no health",
      "ID.me — Government focus, no venue integration",
      "Ticketmaster — Ticketing only, no identity layer",
      "VALID™ — Full stack: ID + Payments + Health + Compliance"
    ],
    highlight: "10/10 Feature Integration Score",
    layout: 'comparison',
  },
  {
    id: 10,
    title: "GO-TO-MARKET",
    subtitle: "Viral Sales Force Model",
    bullets: [
      "Zero CAC — decentralized promoter network",
      "10% commission drives organic growth",
      "Land & expand in nightlife → sports → workforce",
      "Partner-first distribution strategy"
    ],
    layout: 'bullets',
  },
  {
    id: 11,
    title: "TEAM",
    subtitle: "The Builder",
    content: [
      "Steve Grillo — Founder & CEO",
      "20+ years in nightlife operations & technology",
      "Built and scaled multiple venue tech platforms",
      "Deep industry relationships across 10 verticals"
    ],
    layout: 'title-content',
  },
  {
    id: 12,
    title: "FINANCIALS",
    stats: [
      { label: "Gross Margin", value: "60%" },
      { label: "Y1 Revenue", value: "$1.6M" },
      { label: "Y2 Revenue", value: "$6M" },
      { label: "Y3 Revenue", value: "$17M" }
    ],
    layout: 'stats',
  },
  {
    id: 13,
    title: "THE REVENUE ENGINE",
    subtitle: "9 Streams — Every Scan = Revenue",
    stats: [
      { label: "Transaction Fees", value: "1.5%" },
      { label: "Member Subs", value: "$39/60 days" },
      { label: "GHOST™ Passes", value: "$10/$20/$50" },
      { label: "Venue Licensing", value: "$99–$7.5K/mo" },
      { label: "Per-User Fees", value: "$3–$8/mo" },
      { label: "GAS FEES", value: "$0.05–$0.50/scan" }
    ],
    content: ["GAS FEE MODEL: Every venue scan collects $0.05–$0.50. Stadium example: 70K fans × $0.12 × 10 games = $84K/year. Revenue scales automatically with customer growth."],
    layout: 'stats',
  },
  {
    id: 14,
    title: "YOUR RETURN",
    subtitle: "Your Money Comes Back. Multiplied.",
    bullets: [
      "Exit: 10x-20x in 3-5 years",
      "Tranche 1: $25K → $250K-$500K potential",
      "Dividends from transaction fees",
      "Secondary market options"
    ],
    layout: 'bullets',
  },
  {
    id: 15,
    title: "THE ASK",
    subtitle: "Tranche 1 — Launch Round",
    stats: [
      { label: "Raise", value: "$200K" },
      { label: "Valuation Cap", value: "$6M" },
      { label: "Discount", value: "50%" },
      { label: "Minimum", value: "$15K" }
    ],
    highlight: "Convertible Note — 18 Month Maturity",
    layout: 'stats',
  },
  {
    id: 16,
    title: "LET'S BUILD",
    subtitle: "Contact",
    content: [
      "Steve Grillo — Founder and Chief Architect",
      "invest@bevalid.app",
      "bevalid.app"
    ],
    highlight: "Schedule a Call →",
    layout: 'cta',
  },
];
