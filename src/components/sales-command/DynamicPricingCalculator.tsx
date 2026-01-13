import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Calculator, DollarSign, AlertTriangle, Shield,
  Zap, FileText, ArrowRight, Check, QrCode, Users,
  Info, Workflow, ScanLine
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  includedScans: number;
  scanOverageRate: number; // cents per scan
  deepCheckRate: number; // cents per deep ID check
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "main-street",
    name: "MAIN STREET",
    subtitle: "$5K Setup + $499/mo",
    priceRange: "$5,000 + $499/month",
    minPrice: 5000,
    maxPrice: 10990,
    duration: "Monthly Subscription",
    deliverables: [
      "Full 7-Seat Senate Architecture",
      "Compliance Widget Integration",
      "Sector Pack (Preloaded Rules)",
      "Ghost Token Scanner Software",
      "2,500 Scans Included/Month"
    ],
    color: "cyan",
    includedScans: 2500,
    scanOverageRate: 50, // $0.50 per scan
    deepCheckRate: 150 // $1.50 per deep check
  },
  {
    id: "growth",
    name: "GROWTH",
    subtitle: "$75K Pilot → $300K/year",
    priceRange: "$75,000 – $300,000",
    minPrice: 75000,
    maxPrice: 300000,
    duration: "90-Day Pilot",
    deliverables: [
      "Full 7-Seat Senate Architecture",
      "Liability Shield API",
      "\"Verified by Valid\" Badge",
      "Adversarial Red Teaming",
      "25,000 Scans Included/Month"
    ],
    color: "purple",
    includedScans: 25000,
    scanOverageRate: 25, // $0.25 per scan
    deepCheckRate: 100 // $1.00 per deep check
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    subtitle: "$250K/year",
    priceRange: "$250,000/year",
    minPrice: 250000,
    maxPrice: 500000,
    duration: "Annual License",
    deliverables: [
      "Full 7-Seat Senate Architecture",
      "On-Premise Deployment",
      "45-Day Custom Calibration",
      "Ghost Token Integration",
      "100,000 Scans Included/Month"
    ],
    color: "amber",
    includedScans: 100000,
    scanOverageRate: 10, // $0.10 per scan
    deepCheckRate: 50 // $0.50 per deep check
  },
  {
    id: "sovereign",
    name: "SECTOR SOVEREIGN",
    subtitle: "$1M–$5M Upfront",
    priceRange: "$1,000,000 – $5,000,000",
    minPrice: 1000000,
    maxPrice: 5000000,
    duration: "3-Year Exclusive",
    deliverables: [
      "Full 7-Seat Senate Architecture",
      "Exclusive Sector License",
      "White Label Rights",
      "Source Code Escrow",
      "Unlimited Scans"
    ],
    color: "red",
    includedScans: -1, // Unlimited
    scanOverageRate: 7, // $0.07 per scan (if custom cap)
    deepCheckRate: 25 // $0.25 per deep check
  }
];

const CHECK_TYPES = [
  { id: "basic", name: "Basic Verification", description: "Age/Identity confirmation", multiplier: 1 },
  { id: "standard", name: "Standard Screening", description: "ID + Background check", multiplier: 2 },
  { id: "deep", name: "Deep Screening", description: "Terrorist, Most Wanted, Sexual Predator", multiplier: 3 }
];

export function DynamicPricingCalculator() {
  const [workflows, setWorkflows] = useState(5);
  const [monthlyScans, setMonthlyScans] = useState(10000);
  const [isHighLiability, setIsHighLiability] = useState(false);
  const [budget, setBudget] = useState(75000);
  const [checkType, setCheckType] = useState("basic");
  
  const [recommendedTier, setRecommendedTier] = useState<PricingTier>(PRICING_TIERS[0]);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [overageScans, setOverageScans] = useState(0);
  const [overageCost, setOverageCost] = useState(0);

  useEffect(() => {
    let tier: PricingTier;
    let price: number;

    // Determine tier based on budget and liability
    if (isHighLiability || budget >= 1000000) {
      tier = PRICING_TIERS[3]; // Sovereign
      price = Math.max(1000000, budget);
    } else if (budget >= 200000) {
      tier = PRICING_TIERS[2]; // Enterprise
      price = 250000;
    } else if (budget >= 50000) {
      tier = PRICING_TIERS[1]; // Growth
      price = 75000;
    } else {
      tier = PRICING_TIERS[0]; // Main Street
      price = 5000 + (499 * 12); // First year cost
    }

    // Calculate overage
    let overage = 0;
    let overageFee = 0;
    if (tier.includedScans !== -1 && monthlyScans > tier.includedScans) {
      overage = monthlyScans - tier.includedScans;
      const checkMultiplier = CHECK_TYPES.find(c => c.id === checkType)?.multiplier || 1;
      overageFee = (overage * tier.scanOverageRate * checkMultiplier) / 100;
    }

    // Add workflow complexity factor
    if (workflows > 10) {
      price *= 1.15;
    }
    if (workflows > 20) {
      price *= 1.25;
    }

    setRecommendedTier(tier);
    setEstimatedPrice(Math.round(price));
    setOverageScans(overage);
    setOverageCost(Math.round(overageFee));
  }, [workflows, monthlyScans, isHighLiability, budget, checkType]);

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

      {/* 7-Seat Senate Explanation */}
      <Card className="border-purple-500/30 bg-purple-500/5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                Every Client Gets the Full 7-Seat Senate
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <p>OpenAI (Judge), Anthropic (Exec Secretary), Google, Meta, DeepSeek, Mistral, xAI</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-purple-400 font-medium">Seats are model-agnostic and interchangeable.</span> If a new LLM outperforms an incumbent on drift and hallucination benchmarks (simplistic to complex questioning), it earns a seat. You're buying governance architecture, not vendor lock-in.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="border-cyan-500/30 bg-black/40">
          <CardHeader>
            <CardTitle className="text-lg font-mono text-foreground">CLIENT PARAMETERS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Workflows Monitored */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-cyan-400" />
                  Workflows Monitored
                </Label>
                <span className="font-mono text-cyan-400 text-lg">{workflows}</span>
              </div>
              <Slider
                value={[workflows]}
                onValueChange={(v) => setWorkflows(v[0])}
                min={1}
                max={50}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>1</span>
                <span>25</span>
                <span>50+</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Number of AI workflows, deployments, or use cases governed by the Senate
              </p>
            </div>

            {/* Monthly Scans */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-cyan-400" />
                  Expected Monthly Scans
                </Label>
                <span className="font-mono text-cyan-400 text-lg">{formatNumber(monthlyScans)}</span>
              </div>
              <Slider
                value={[monthlyScans]}
                onValueChange={(v) => setMonthlyScans(v[0])}
                min={1000}
                max={500000}
                step={1000}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>1K</span>
                <span>250K</span>
                <span>500K+</span>
              </div>
            </div>

            {/* Check Type Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <ScanLine className="h-4 w-4 text-cyan-400" />
                Verification Check Type
              </Label>
              <div className="grid gap-2">
                {CHECK_TYPES.map((check) => (
                  <div
                    key={check.id}
                    onClick={() => setCheckType(check.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      checkType === check.id
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-border/30 bg-black/20 hover:border-border/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{check.name}</p>
                        <p className="text-xs text-muted-foreground">{check.description}</p>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {check.multiplier}x rate
                      </Badge>
                    </div>
                  </div>
                ))}
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
                  SOVEREIGN TIER REQUIRED for sector exclusivity
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Output Panel */}
        <div className="space-y-4">
          {/* Recommended Tier */}
          <Card className="border-2 border-cyan-500/50 bg-black/40">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="border-cyan-500 text-cyan-400 font-mono">
                  RECOMMENDED
                </Badge>
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-1">{recommendedTier.name}</h3>
              <p className="text-muted-foreground mb-4">{recommendedTier.subtitle}</p>
              
              <div className="p-4 rounded-lg bg-black/40 mb-4">
                <p className="text-xs font-mono text-muted-foreground mb-1">BASE PRICE</p>
                <p className="text-3xl font-bold text-cyan-400 font-mono">
                  {formatCurrency(estimatedPrice)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: {recommendedTier.priceRange}
                </p>
              </div>

              {/* Scan Allocation */}
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="h-4 w-4 text-purple-400" />
                  <p className="text-sm font-mono text-purple-400">SCAN ALLOCATION</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Included/Month</p>
                    <p className="font-bold text-foreground">
                      {recommendedTier.includedScans === -1 ? 'Unlimited' : formatNumber(recommendedTier.includedScans)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Overage Rate</p>
                    <p className="font-bold text-foreground">
                      ${(recommendedTier.scanOverageRate / 100).toFixed(2)}/scan
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Deep Check Rate</p>
                    <p className="font-bold text-foreground">
                      ${(recommendedTier.deepCheckRate / 100).toFixed(2)}/check
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Your Expected</p>
                    <p className="font-bold text-foreground">{formatNumber(monthlyScans)}/mo</p>
                  </div>
                </div>

                {overageScans > 0 && (
                  <div className="mt-3 pt-3 border-t border-purple-500/30">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-amber-400">
                        ⚠️ {formatNumber(overageScans)} scans over limit
                      </p>
                      <p className="text-sm font-mono text-amber-400">
                        +{formatCurrency(overageCost)}/mo
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-mono text-muted-foreground">DURATION: {recommendedTier.duration}</p>
                <div className="space-y-1.5">
                  {recommendedTier.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-400 shrink-0" />
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
              <CardTitle className="text-sm font-mono text-muted-foreground">ALL TIERS — SAME 7-SEAT SENATE</CardTitle>
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
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="font-semibold text-sm">{tier.name}</p>
                      <p className="text-xs text-muted-foreground">{tier.priceRange}</p>
                    </div>
                    {tier.id === recommendedTier.id && (
                      <Badge className="bg-cyan-500 text-black font-mono text-xs">SELECTED</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <QrCode className="h-3 w-3" />
                      {tier.includedScans === -1 ? '∞' : formatNumber(tier.includedScans)} scans
                    </span>
                    <span>|</span>
                    <span>${(tier.scanOverageRate / 100).toFixed(2)} overage</span>
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
