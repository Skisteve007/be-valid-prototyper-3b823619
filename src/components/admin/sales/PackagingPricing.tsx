import { useState } from "react";
import { PrintButton, LastUpdated, PrintableSection, PrintableHeading, PrintableParagraph, PrintableBulletList, QualityGateChecklist } from "../PrintStyles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ChevronDown, ChevronUp, CheckCircle2, DollarSign, Calendar, FileText, Clock, Shield } from "lucide-react";
import { AGREEMENT_TIERS, TierConfig } from "@/config/agreementTiers";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const TierSummaryCard = ({ tier }: { tier: TierConfig }) => {
  const getTierColor = (id: string) => {
    switch (id) {
      case "sector-sovereign": return "border-yellow-500/50 bg-yellow-500/5";
      case "enterprise": return "border-primary/50 bg-primary/5";
      case "growth": return "border-green-500/50 bg-green-500/5";
      case "main-street": return "border-blue-500/50 bg-blue-500/5";
      default: return "border-border bg-muted/5";
    }
  };

  const getTierBadgeColor = (id: string) => {
    switch (id) {
      case "sector-sovereign": return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/50";
      case "enterprise": return "bg-primary/20 text-primary border-primary/50";
      case "growth": return "bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50";
      case "main-street": return "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/50";
      default: return "";
    }
  };

  return (
    <Card className={`${getTierColor(tier.id)} print:border-black print:bg-white`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className={`${getTierBadgeColor(tier.id)} print:border-black print:bg-transparent print:text-black`}>
              {tier.name}
            </Badge>
            <span className="text-sm text-muted-foreground print:text-black">{tier.subtitle}</span>
          </div>
          <span className="text-xl font-bold print:text-black">{tier.price}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium print:text-black">Timeline:</p>
            <p className="text-muted-foreground print:text-black">{tier.timeline}</p>
          </div>
          <div>
            <p className="font-medium print:text-black">Term:</p>
            <p className="text-muted-foreground print:text-black">{tier.term}</p>
          </div>
        </div>
        <div>
          <p className="font-medium text-sm mb-2 print:text-black">Outcome:</p>
          <p className="text-sm text-muted-foreground print:text-black">{tier.outcome}</p>
        </div>
        <div>
          <p className="font-medium text-sm mb-2 flex items-center gap-2 print:text-black">
            <CheckCircle2 className="h-4 w-4 text-green-500 print:text-black" />
            Includes:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 print:text-black">
            {tier.includes.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <Shield className="h-3 w-3 mt-1 flex-shrink-0 text-primary print:text-black" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-medium text-sm mb-2 flex items-center gap-2 print:text-black">
            <DollarSign className="h-4 w-4 text-green-500 print:text-black" />
            Payment Schedule (33/33/34):
          </p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {tier.paymentSchedule.map((payment, idx) => (
              <div key={idx} className="bg-muted/50 rounded p-2 text-center print:bg-gray-100 print:border print:border-black">
                <p className="text-muted-foreground print:text-black">Day {payment.day}</p>
                <p className="font-bold print:text-black">${payment.amount.toLocaleString()}</p>
                <p className="text-muted-foreground print:text-black">{payment.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium text-sm mb-2 flex items-center gap-2 print:text-black">
            <Calendar className="h-4 w-4 text-cyan-500 print:text-black" />
            Deployment Roadmap:
          </p>
          <div className="space-y-1 text-xs">
            {tier.roadmap.map((phase, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <Badge variant="outline" className="text-xs shrink-0 print:border-black print:bg-transparent print:text-black">
                  Days {phase.days}
                </Badge>
                <span className="text-muted-foreground print:text-black">{phase.description}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium text-sm mb-2 flex items-center gap-2 print:text-black">
            <FileText className="h-4 w-4 text-orange-500 print:text-black" />
            Client Must Provide:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 print:text-black">
            {tier.clientRequirements.map((req, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <Clock className="h-3 w-3 text-orange-400 print:text-black" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

// Industry packages mapping for display
const INDUSTRY_PACKAGES = [
  {
    id: "healthcare",
    name: "Healthcare & Life Sciences",
    description: "HIPAA-compliant AI governance for pharma, biotech, and healthcare providers",
    tiers: ["sector-sovereign", "enterprise"],
    features: ["PHI protection", "Clinical trial compliance", "FDA audit trails"]
  },
  {
    id: "financial",
    name: "Financial Services",
    description: "SOX and regulatory compliance for banks, insurers, and fintech",
    tiers: ["sector-sovereign", "enterprise", "growth"],
    features: ["SOX compliance", "AML/KYC integration", "Real-time audit logging"]
  },
  {
    id: "hospitality",
    name: "Hospitality & Nightlife",
    description: "Age verification, access control, and liability protection for venues",
    tiers: ["enterprise", "growth", "main-street"],
    features: ["Age verification", "Ghost Pass integration", "Door scan workflows"]
  },
  {
    id: "transportation",
    name: "Transportation & Fleet",
    description: "Driver verification and compliance for rideshare, delivery, and fleet operators",
    tiers: ["enterprise", "growth"],
    features: ["Driver onboarding", "Deep face checks", "Shift authentication"]
  }
];

export const PackagingPricing = () => {
  const [pricingMenuOpen, setPricingMenuOpen] = useState(false);
  const [industryPackagesOpen, setIndustryPackagesOpen] = useState(false);

  return (
    <PrintableSection>
      <div className="flex items-center justify-between mb-6">
        <PrintableHeading level={2}>Packaging & Pricing</PrintableHeading>
        <PrintButton />
      </div>
      <LastUpdated />

      <Card className="mb-6 border-amber-500 bg-amber-500/10 print:border-black print:bg-white">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 print:text-black flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold print:text-black">Important: Do Not Quote Pricing from Memory</p>
              <p className="text-sm text-muted-foreground print:text-black">
                Always refer customers to the official pricing menu. Pricing may change and quoting outdated rates creates problems.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <PrintableHeading level={3}>How to Choose a Package</PrintableHeading>
      <PrintableBulletList items={[
        "Start with the customer's primary use case (AI governance, access control, or both)",
        "Estimate their volume (verifications per day/week/month)",
        "Identify their deployment requirements (cloud, private, hybrid)",
        "Match to the appropriate tier based on scale and features",
        "Discuss add-ons for specific needs (premium support, custom integration)",
        "Review the pricing menu together and confirm fit"
      ]} />

      <Card className="mb-6 print:border-black print:bg-white">
        <CardHeader>
          <CardTitle className="text-lg print:text-black">Package Selection Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 print:text-black">
            <div className="flex items-start gap-3">
              <span className="font-bold text-primary print:text-black">1.</span>
              <div>
                <p className="font-medium">Qualify the Opportunity</p>
                <p className="text-sm text-muted-foreground print:text-black">What's the pain? What's the scale? What's the timeline?</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-primary print:text-black">2.</span>
              <div>
                <p className="font-medium">Match to Package</p>
                <p className="text-sm text-muted-foreground print:text-black">Based on volume, features, and deployment needs</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-primary print:text-black">3.</span>
              <div>
                <p className="font-medium">Review Pricing Together</p>
                <p className="text-sm text-muted-foreground print:text-black">Walk through the pricing menu, answer questions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="font-bold text-primary print:text-black">4.</span>
              <div>
                <p className="font-medium">Confirm and Close</p>
                <p className="text-sm text-muted-foreground print:text-black">Get agreement, schedule onboarding</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <PrintableHeading level={3}>Access Pricing Details</PrintableHeading>
      <PrintableParagraph>
        The official pricing menu contains current packages, rates, and terms. Use this as the single source of truth for all pricing discussions.
      </PrintableParagraph>

      {/* View Pricing Menu - Collapsible */}
      <div className="space-y-4 mb-6">
        <Collapsible open={pricingMenuOpen} onOpenChange={setPricingMenuOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="default" className="w-full justify-between print:hidden">
              <span>View Pricing Menu</span>
              {pricingMenuOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div className="border-l-4 border-primary pl-4 mb-4">
              <p className="text-sm text-muted-foreground print:text-black">
                <strong>Deployment Agreement Tiers</strong> — Choose the tier that matches deployment scope. 
                Contracts executed digitally; payment starts the deployment clock.
              </p>
            </div>
            {AGREEMENT_TIERS.map((tier) => (
              <TierSummaryCard key={tier.id} tier={tier} />
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* View Industry Packages - Collapsible */}
        <Collapsible open={industryPackagesOpen} onOpenChange={setIndustryPackagesOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between print:hidden">
              <span>View Industry Packages</span>
              {industryPackagesOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-4">
            <div className="border-l-4 border-cyan-500 pl-4 mb-4">
              <p className="text-sm text-muted-foreground print:text-black">
                <strong>Industry-Specific Packages</strong> — Pre-configured compliance and feature sets for target verticals.
              </p>
            </div>
            {INDUSTRY_PACKAGES.map((pkg) => (
              <Card key={pkg.id} className="print:border-black print:bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center justify-between flex-wrap gap-2 print:text-black">
                    <span>{pkg.name}</span>
                    <div className="flex gap-1">
                      {pkg.tiers.map((tierId) => {
                        const tier = AGREEMENT_TIERS.find(t => t.id === tierId);
                        return tier ? (
                          <Badge key={tierId} variant="outline" className="text-xs print:border-black print:bg-transparent print:text-black">
                            {tier.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 print:text-black">{pkg.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs print:border-black print:bg-transparent print:text-black">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Print-only: Always show content */}
      <div className="hidden print:block space-y-6">
        <PrintableHeading level={3}>Pricing Menu (All Tiers)</PrintableHeading>
        {AGREEMENT_TIERS.map((tier) => (
          <TierSummaryCard key={tier.id} tier={tier} />
        ))}
        
        <PrintableHeading level={3}>Industry Packages</PrintableHeading>
        {INDUSTRY_PACKAGES.map((pkg) => (
          <Card key={pkg.id} className="print:border-black print:bg-white mb-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg print:text-black">{pkg.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm print:text-black mb-2">{pkg.description}</p>
              <p className="text-xs print:text-black">
                <strong>Available Tiers:</strong> {pkg.tiers.map(t => AGREEMENT_TIERS.find(tier => tier.id === t)?.name).join(", ")}
              </p>
              <p className="text-xs print:text-black">
                <strong>Features:</strong> {pkg.features.join(", ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 print:border-black print:bg-white">
        <CardHeader>
          <CardTitle className="text-lg print:text-black">When Pricing Questions Come Up</CardTitle>
        </CardHeader>
        <CardContent>
          <PrintableParagraph>
            <strong>Script:</strong> "Let me pull up the current pricing menu so we're looking at the latest rates together. Pricing varies by volume and deployment model, so let's find the package that fits your needs."
          </PrintableParagraph>
          <PrintableParagraph>
            Never promise discounts without approval. If they ask for a custom deal, say: "I can take that back to our team and see what's possible. Let's first confirm the package makes sense for your use case."
          </PrintableParagraph>
        </CardContent>
      </Card>

      <QualityGateChecklist />
    </PrintableSection>
  );
};
