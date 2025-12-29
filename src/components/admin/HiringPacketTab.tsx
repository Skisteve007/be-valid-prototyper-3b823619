import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Package, FileText, ExternalLink, Briefcase, Shield, Code, Users, Target, Rocket } from "lucide-react";
import { toast } from "sonner";

interface HiringPacket {
  id: string;
  roleTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  contracts: string[];
  packetMessage: string;
}

const hiringPackets: HiringPacket[] = [
  {
    id: 'biz-dev-associate',
    roleTitle: 'Business Development Associate',
    icon: Briefcase,
    contracts: ['Equity Agreement', 'NDA', 'Contractor Agreement'],
    packetMessage: `VALID™ / SYNTHESIZED AI — BUSINESS DEVELOPMENT ASSOCIATE

═══════════════════════════════════════════════════════════════════════

ROLE: Business Development Associate
(Lead generation, intros, marketing — NOT securities sales)

═══════════════════════════════════════════════════════════════════════

COMPENSATION PACKAGE:

BASE RETAINER:
├── $2,500/month (Part-time/Contract)
└── $5,000/month (Full-time/Dedicated)

EQUITY GRANT:
├── 0.5% - 1.0% ownership
├── 4-year vesting, 1-year cliff
└── Standard startup equity terms

MILESTONE BONUSES (Not tied to $ raised):
├── 25 qualified investor intros:    $2,500 bonus
├── 50 qualified investor intros:    $5,000 bonus
├── Company closes Seed round:       $10,000 bonus
├── Company closes Series A:         $25,000 bonus
└── Bonuses are DISCRETIONARY, not guaranteed

═══════════════════════════════════════════════════════════════════════

WHAT YOU DO (Legal):
├── Research and identify potential investors
├── Build target lists
├── Make warm introductions
├── Schedule meetings for CEO
├── Prepare pitch materials
├── Follow up with prospects
├── CRM management
├── Marketing and outreach
└── Event coordination

WHAT YOU DON'T DO (Requires license):
├── Negotiate investment terms
├── Handle investor funds
├── Sign on behalf of company
├── "Sell" or "close" investors
└── Receive % commission on $ raised

═══════════════════════════════════════════════════════════════════════

TOTAL POTENTIAL COMP (Year 1):

Base (12 months × $5K):              $60,000
Milestone bonuses:                   $42,500
Equity (1% of $13B vision):          Life-changing upside
──────────────────────────────────────────────
TOTAL CASH Y1:                       $102,500
TOTAL EQUITY UPSIDE:                 Generational wealth potential

═══════════════════════════════════════════════════════════════════════

This is how we build together. Welcome to the mission.

— VALID™ / Synthesized AI Leadership`
  },
  {
    id: "cto",
    roleTitle: "Founding CTO / Head of Engineering",
    icon: Shield,
    contracts: ["Mutual NDA", "Independent Contractor Agreement"],
    packetMessage: `HIRING PACKET — Founding CTO / Head of Engineering (Equity-First)

Hi [Name],

Thank you for your interest in the Founding CTO role at Valid/SYNTH. Before we proceed, please review and sign the following documents:

1) MUTUAL NDA
We'll share confidential product, technical, and business information during the evaluation process. This protects both parties.

2) INDEPENDENT CONTRACTOR AGREEMENT
Includes IP assignment, confidentiality, security obligations, and compensation terms. You'll receive the fully filled-out version with your specific terms.

Once you've reviewed, we can schedule a deeper technical conversation.

Best,
Steve
steve@bevalid.app
Giant Ventures LLC`
  },
  {
    id: "founding-engineer",
    roleTitle: "Founding Engineer — Customer-Hosted Runtime",
    icon: Code,
    contracts: ["Mutual NDA", "Independent Contractor Agreement"],
    packetMessage: `HIRING PACKET — Founding Engineer (Customer-Hosted Runtime)

Hi [Name],

Thank you for your interest in the Founding Engineer role at Valid/SYNTH. Before we proceed, please review and sign the following documents:

1) MUTUAL NDA
We'll share confidential product, technical, and business information during the evaluation process.

2) INDEPENDENT CONTRACTOR AGREEMENT
Includes IP assignment, confidentiality, security obligations, and compensation terms (monthly contractor pay + equity grant + milestone bonuses).

Once you've reviewed, we can schedule a technical deep-dive.

Best,
Steve
steve@bevalid.app
Giant Ventures LLC`
  },
  {
    id: "fullstack-engineer",
    roleTitle: "Full-Stack Engineer — Demo/App/PWA",
    icon: Rocket,
    contracts: ["Mutual NDA", "Independent Contractor Agreement"],
    packetMessage: `HIRING PACKET — Full-Stack Engineer (Demo/App/PWA)

Hi [Name],

Thank you for your interest in the Full-Stack Engineer role at Valid/SYNTH. Before we proceed, please review and sign the following documents:

1) MUTUAL NDA
We'll share confidential product, technical, and business information during the evaluation process.

2) INDEPENDENT CONTRACTOR AGREEMENT
Includes IP assignment, confidentiality, security obligations, and compensation terms (limited cash + equity + milestone bonuses).

Once you've reviewed, we can schedule a product walkthrough and discuss scope.

Best,
Steve
steve@bevalid.app
Giant Ventures LLC`
  },
  {
    id: "enterprise-ae",
    roleTitle: "Founding Enterprise AE (Technical)",
    icon: Target,
    contracts: ["Mutual NDA", "Independent Contractor Agreement", "Commission Plan Addendum"],
    packetMessage: `HIRING PACKET — Founding Enterprise AE (Technical)

Hi [Name],

Thank you for your interest in the Founding Enterprise AE role at Valid/SYNTH. Before we proceed, please review and sign the following documents:

1) MUTUAL NDA
We'll share confidential product, customer, and business information during the evaluation process.

2) INDEPENDENT CONTRACTOR AGREEMENT
Includes confidentiality, security obligations, and general contractor terms.

3) COMMISSION PLAN ADDENDUM (included with contractor agreement)
Details: 15% of first-year contract value CASH COLLECTED, paid 50% cash + 50% equity at milestone.

Once you've reviewed, we can schedule a sales deep-dive and discuss territory.

Best,
Steve
steve@bevalid.app
Giant Ventures LLC`
  },
  {
    id: "growth-ae",
    roleTitle: "Growth AE (Main Street)",
    icon: Users,
    contracts: ["Mutual NDA", "Independent Contractor Agreement", "Commission Plan Addendum"],
    packetMessage: `HIRING PACKET — Growth AE (Main Street)

Hi [Name],

Thank you for your interest in the Growth AE role at Valid/SYNTH. Before we proceed, please review and sign the following documents:

1) MUTUAL NDA
We'll share confidential product, customer, and business information during the evaluation process.

2) INDEPENDENT CONTRACTOR AGREEMENT
Includes confidentiality, security obligations, and general contractor terms.

3) COMMISSION PLAN ADDENDUM (included with contractor agreement)
Details: 15% of CASH COLLECTED on qualifying deals. 100% cash OR optional cash/equity split.

Once you've reviewed, we can schedule a quick call to discuss pipeline approach.

Best,
Steve
steve@bevalid.app
Giant Ventures LLC`
  }
];

export function HiringPacketTab() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyPacket = async (packet: HiringPacket) => {
    try {
      await navigator.clipboard.writeText(packet.packetMessage);
      setCopiedId(packet.id);
      toast.success(`"${packet.roleTitle}" packet copied to clipboard`);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Package className="h-6 w-6" />
                Hiring Packet — Quick Send
              </CardTitle>
              <CardDescription className="mt-2">
                Copy pre-formatted hiring packets for each role. Each packet includes role intro + contract requirements.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Links */}
          <div className="flex flex-wrap gap-2 pb-4 border-b">
            <Badge variant="secondary" className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              Linked to: Legal Templates
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              Linked to: Careers
            </Badge>
          </div>

          {/* Packet Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {hiringPackets.map((packet) => (
              <Card key={packet.id} className="flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <packet.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base">{packet.roleTitle}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">Contracts included:</p>
                    <ul className="space-y-1 mb-4">
                      {packet.contracts.map((contract, i) => (
                        <li key={i} className="text-sm flex items-center gap-2">
                          <FileText className="h-3 w-3 text-primary" />
                          {contract}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button 
                    onClick={() => handleCopyPacket(packet)}
                    variant={copiedId === packet.id ? "secondary" : "default"}
                    className="w-full"
                  >
                    {copiedId === packet.id ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Packet
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-muted">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            <strong>Workflow:</strong> Copy the packet → Paste into email/Slack → Attach NDA + Contractor Agreement from Legal Templates → Send.
            Update [Name] and any role-specific terms before sending.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}