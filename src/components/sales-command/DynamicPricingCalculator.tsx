import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Calculator, DollarSign, Cpu, AlertTriangle, Shield,
  Zap, FileText, Award, ArrowRight, Check
} from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  duration: string;
  deliverables: string[];
  color: string;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "pilot",
    name: "PILOT",
    subtitle: "The Foot in the Door",
    priceRange: "$5,000 – $25,000",
    minPrice: 5000,
    maxPrice: 25000,
    duration: "60 Days",
    deliverables: [
      "6–8 Constitutional Controls",
      "Audit Pack (tamper-evident logs)",
      "Incident Reduction Report",
      "Shadow Mode Testing"
    ],
    color: "cyan"
  },
  {
    id: "certification",
    name: "ALLIANCE BADGE",
    subtitle: "Certification Program",
    priceRange: "$25,000 – $100,000",
    minPrice: 25000,
    maxPrice: 100000,
    duration: "90 Days",
    deliverables: [
      "Full Standard Adoption",
      "SYNTH Audit & Certification",
      "\"Grillo Alliance\" Marketing Badge",
      "Annual Recertification Rights"
    ],
    color: "purple"
  },
  {
    id: "enterprise",
    name: "ENTERPRISE SHIELD",
    subtitle: "Full License",
    priceRange: "$500,000 – $5,000,000+",
    minPrice: 500000,
    maxPrice: 5000000,
    duration: "Annual + Perpetual Options",
    deliverables: [
      "Full Senate Orchestration",
      "Custom Constitution Development",
      "Liability Indemnification",
      "24/7 Priority Support",
      "On-Premise Deployment Option"
    ],
    color: "amber"
  }
];

export function DynamicPricingCalculator() {
  const [agents, setAgents] = useState(10);
  const [apiCalls, setApiCalls] = useState(100000);
  const [isHighLiability, setIsHighLiability] = useState(false);
  const [budget, setBudget] = useState(75000);
  
  const [recommendedTier, setRecommendedTier] = useState<PricingTier>(PRICING_TIERS[0]);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  useEffect(() => {
    // Calculate recommended tier based on inputs
    let tier: PricingTier;
    let price: number;

    if (isHighLiability) {
      // Force Enterprise for high liability
      tier = PRICING_TIERS[2];
      price = Math.max(500000, agents * 10000 + apiCalls * 0.005);
    } else if (budget < 30000) {
      // Low budget -> Pilot
      tier = PRICING_TIERS[0];
      price = Math.min(25000, Math.max(5000, agents * 500 + apiCalls * 0.0001));
    } else if (budget < 150000) {
      // Mid budget -> Certification
      tier = PRICING_TIERS[1];
      price = Math.min(100000, Math.max(25000, agents * 2000 + apiCalls * 0.0005));
    } else {
      // High budget -> Enterprise
      tier = PRICING_TIERS[2];
      price = Math.max(500000, agents * 8000 + apiCalls * 0.003);
    }

    // Adjust price based on API calls
    if (apiCalls > 500000) {
      price *= 1.25;
    }
    if (apiCalls > 1000000) {
      price *= 1.5;
    }

    setRecommendedTier(tier);
    setEstimatedPrice(Math.round(price));
  }, [agents, apiCalls, isHighLiability, budget]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-cyan-500/30 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-cyan-400 font-mono">
            <Calculator className="h-6 w-6" />
            MODULE B: DYNAMIC PRICING ENGINE
          </CardTitle>
          <p className="text-muted-foreground">
            Slider-based calculator that recommends the optimal package based on client requirements. 
            Use this during discovery calls to anchor pricing discussions.
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="border-cyan-500/30 bg-black/40">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-foreground">CLIENT PARAMETERS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Number of AI Agents */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  Number of AI Agents
                </Label>
                <span className="font-mono text-cyan-400 text-lg">{agents}</span>
              </div>
              <Slider
                value={[agents]}
                onValueChange={(v) => setAgents(v[0])}
                min={1}
                max={100}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>1</span>
                <span>50</span>
                <span>100+</span>
              </div>
            </div>

            {/* Monthly API Calls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  Monthly API Calls
                </Label>
                <span className="font-mono text-cyan-400 text-lg">{formatNumber(apiCalls)}</span>
              </div>
              <Slider
                value={[apiCalls]}
                onValueChange={(v) => setApiCalls(v[0])}
                min={10000}
                max={2000000}
                step={10000}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>10K</span>
                <span>1M</span>
                <span>2M+</span>
              </div>
            </div>

            {/* Client Budget */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-cyan-400" />
                  Client Budget
                </Label>
                <span className="font-mono text-cyan-400 text-lg">{formatCurrency(budget)}</span>
              </div>
              <Slider
                value={[budget]}
                onValueChange={(v) => setBudget(v[0])}
                min={5000}
                max={5000000}
                step={5000}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>$5K</span>
                <span>$500K</span>
                <span>$5M+</span>
              </div>
            </div>

            {/* High Liability Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <div>
                  <Label className="text-foreground">High Liability Industry</Label>
                  <p className="text-xs text-muted-foreground">Medical, Legal, Financial, Government</p>
                </div>
              </div>
              <Switch
                checked={isHighLiability}
                onCheckedChange={setIsHighLiability}
              />
            </div>

            {isHighLiability && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-sm text-red-400 font-mono flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  ENTERPRISE TIER REQUIRED for liability protection
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output Panel */}
        <div className="space-y-4">
          {/* Recommended Tier */}
          <Card className={`border-2 border-${recommendedTier.color}-500/50 bg-${recommendedTier.color}-500/5`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className={`border-${recommendedTier.color}-500 text-${recommendedTier.color}-400 font-mono`}>
                  RECOMMENDED
                </Badge>
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-1">{recommendedTier.name}</h3>
              <p className="text-muted-foreground mb-4">{recommendedTier.subtitle}</p>
              
              <div className="p-4 rounded-lg bg-black/40 mb-4">
                <p className="text-xs font-mono text-muted-foreground mb-1">ESTIMATED PRICE</p>
                <p className="text-3xl font-bold text-cyan-400 font-mono">
                  {formatCurrency(estimatedPrice)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: {recommendedTier.priceRange}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-mono text-muted-foreground">DURATION: {recommendedTier.duration}</p>
                <div className="space-y-1.5">
                  {recommendedTier.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-400" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* All Tiers Reference */}
          <Card className="border-cyan-500/30 bg-black/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-muted-foreground">ALL TIERS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {PRICING_TIERS.map((tier) => (
                <div 
                  key={tier.id}
                  className={`p-3 rounded-lg border ${
                    tier.id === recommendedTier.id 
                      ? 'border-cyan-500/50 bg-cyan-500/10' 
                      : 'border-border/30 bg-black/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm">{tier.name}</p>
                      <p className="text-xs text-muted-foreground">{tier.priceRange}</p>
                    </div>
                    {tier.id === recommendedTier.id && (
                      <Badge className="bg-cyan-500 text-black font-mono text-xs">SELECTED</Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CTA */}
          <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-mono py-6">
            GENERATE PROPOSAL <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
