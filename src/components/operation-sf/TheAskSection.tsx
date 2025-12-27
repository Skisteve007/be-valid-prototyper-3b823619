import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  FileText,
  Clock,
  Shield
} from "lucide-react";
import { AGREEMENT_TIERS, TierConfig } from "@/config/agreementTiers";

const TierCard = ({ tier, isExpanded, onToggle }: { 
  tier: TierConfig; 
  isExpanded: boolean; 
  onToggle: () => void;
}) => {
  const navigate = useNavigate();

  const getTierColor = (id: string) => {
    switch (id) {
      case "sector-sovereign": return "from-yellow-500/20 to-amber-500/10 border-yellow-500/50";
      case "enterprise": return "from-primary/20 to-cyan-500/10 border-primary/50";
      case "growth": return "from-green-500/20 to-emerald-500/10 border-green-500/50";
      case "main-street": return "from-blue-500/20 to-indigo-500/10 border-blue-500/50";
      default: return "from-muted to-transparent border-border";
    }
  };

  const getTierBadgeColor = (id: string) => {
    switch (id) {
      case "sector-sovereign": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "enterprise": return "bg-primary/20 text-primary border-primary/50";
      case "growth": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "main-street": return "bg-blue-500/20 text-blue-400 border-blue-500/50";
      default: return "";
    }
  };

  return (
    <Card className={`bg-gradient-to-br ${getTierColor(tier.id)} transition-all duration-300 ${isExpanded ? 'ring-2 ring-primary/50' : ''}`}>
      {/* Collapsed Header - Always Visible */}
      <CardHeader 
        className="cursor-pointer hover:bg-muted/10 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className={getTierBadgeColor(tier.id)}>
                TIER {AGREEMENT_TIERS.indexOf(tier)}
              </Badge>
              <h3 className="text-xl md:text-2xl font-bold">{tier.name}</h3>
            </div>
            <p className="text-lg text-muted-foreground">{tier.subtitle}</p>
          </div>
          <div className="text-right ml-4">
            <p className="text-2xl md:text-3xl font-bold text-foreground">{tier.price}</p>
            <p className="text-base text-muted-foreground">{tier.timeline}</p>
          </div>
          <div className="ml-4">
            {isExpanded ? (
              <ChevronUp className="h-6 w-6 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
          <span className="font-medium text-foreground">{tier.term}</span> — {tier.outcome}
        </p>
      </CardHeader>

      {/* Expanded Content */}
      {isExpanded && (
        <CardContent className="pt-0 space-y-8 animate-in slide-in-from-top-2 duration-300">
          <div className="border-t border-border/50 pt-6" />

          {/* Includes */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              Includes
            </h4>
            <ul className="space-y-3">
              {tier.includes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-base text-muted-foreground">
                  <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Schedule */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              Payment Schedule (33/33/34)
            </h4>
            <div className="grid md:grid-cols-3 gap-4">
              {tier.paymentSchedule.map((payment, idx) => (
                <div key={idx} className="bg-muted/30 rounded-lg p-4 border border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Day {payment.day}</p>
                  <p className="text-xl font-bold text-foreground">
                    ${payment.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">{payment.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Roadmap */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-400" />
              Deployment Roadmap
            </h4>
            <div className="space-y-3">
              {tier.roadmap.map((phase, idx) => (
                <div key={idx} className="flex items-start gap-4 text-base">
                  <Badge variant="outline" className="shrink-0 min-w-[80px] justify-center">
                    Days {phase.days}
                  </Badge>
                  <span className="text-muted-foreground">{phase.description}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Client Requirements */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-orange-400" />
              Client Must Provide (Clock Starts After Receipt)
            </h4>
            <ul className="space-y-2">
              {tier.clientRequirements.map((req, idx) => (
                <li key={idx} className="flex items-center gap-3 text-base text-muted-foreground">
                  <Clock className="h-4 w-4 text-orange-400 shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="border-t border-border/50 pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <p className="text-sm text-muted-foreground italic">
                Work begins after Payment 1 clears. Missed payment triggers Stop Work.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => window.open('mailto:legal@bevalid.app?subject=Redline Request - ' + tier.name, '_blank')}
                >
                  Request Redline
                </Button>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-lg px-8"
                  onClick={() => navigate(`/agreement/${tier.id}`)}
                >
                  Review & Sign Agreement
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const TheAskSection = () => {
  const [expandedTier, setExpandedTier] = useState<string | null>(null);

  return (
    <section className="py-20 border-t border-border/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-green-500/20 text-green-400 border-green-500/50 text-lg px-6 py-2">
            DEPLOYMENT AGREEMENTS
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">The Ask</h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Choose the agreement tier that matches your deployment scope. 
            Contracts are executed digitally; payment starts the deployment clock.
          </p>
        </div>

        {/* Tier Cards */}
        <div className="max-w-5xl mx-auto space-y-4">
          {AGREEMENT_TIERS.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              isExpanded={expandedTier === tier.id}
              onToggle={() => setExpandedTier(expandedTier === tier.id ? null : tier.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TheAskSection;
