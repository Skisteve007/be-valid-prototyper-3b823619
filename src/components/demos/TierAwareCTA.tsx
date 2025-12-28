import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, ArrowRight, CreditCard, FileSignature, Building2 } from "lucide-react";
import { Tier, getTierCTA } from "@/lib/demoGovernanceEngine";

interface TierAwareCTAProps {
  tier: Tier;
  className?: string;
}

const tierIcons: Record<Tier, typeof FileText> = {
  3: CreditCard,
  2: FileSignature,
  1: Building2,
  0: Building2,
};

const tierTitles: Record<Tier, string> = {
  3: "Ready to Start?",
  2: "Ready for Pilot?",
  1: "Ready for Enterprise?",
  0: "Ready for Exclusivity?",
};

const tierDescriptions: Record<Tier, string> = {
  3: "Get started with a $5K setup and begin your 45-day proof sprint",
  2: "Sign your pilot agreement and begin deployment preparation",
  1: "Sign enterprise agreement and schedule Day 1 payment",
  0: "Sign LOI and receive wire instructions for exclusivity deposit",
};

const TierAwareCTA = ({ tier, className = "" }: TierAwareCTAProps) => {
  const cta = getTierCTA(tier);
  const Icon = tierIcons[tier];

  return (
    <Card className={`border-emerald-500/30 bg-emerald-500/5 ${className}`}>
      <CardContent className="py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <Icon className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{tierTitles[tier]}</h3>
              <p className="text-sm text-muted-foreground">{tierDescriptions[tier]}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Link to={cta.primaryAction}>
                {cta.primary}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={cta.secondaryAction}>
                {cta.secondary}
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TierAwareCTA;
