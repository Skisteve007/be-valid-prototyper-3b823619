import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Calculator, DollarSign, AlertTriangle, Shield,
  Zap, ArrowRight, Check, QrCode, Users,
  Info, ScanLine, Activity, TrendingUp
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
  includedQueries: number; // Monthly Senate queries included
  queryOverageRate: number; // cents per query over limit
  includedScans: number;
  scanOverageRate: number;
  deepCheckRate: number;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "solo",
    name: "SOLO",
    subtitle: "$4.99/mo",
    priceRange: "$4.99 – $29/mo",
    minPrice: 5, // $4.99/mo
    maxPrice: 29,
    duration: "Monthly Subscription",
    deliverables: [
      "Full 7-Seat Senate Architecture",
      "Up to 500 Queries/Month",
      "Basic Widget Integration",
      "50 QR Scans Included/Month",
      "Basic Audit Logs"
    ],
    color: "green",
    includedQueries: 500,
    queryOverageRate: 10, // $0.10 per query
    includedScans: 50,
    scanOverageRate: 100, // $1.00 per scan
    deepCheckRate: 250 // $2.50 per deep check
  },
  {
    id: "starter",
    name: "STARTER",
    subtitle: "$29 – $99/mo",
    priceRange: "$29 – $99/mo",
    minPrice: 29,
    maxPrice: 99,
    duration: "Monthly Subscription",
    deliverables: [
      "Full 7-Seat Senate Architecture",
      "Up to 2,500 Queries/Month",
      "Compliance Widget Integration",
      "250 QR Scans Included/Month",
      "Standard Audit Logs"
    ],
    color: "cyan",
    includedQueries: 2500,
    queryOverageRate: 6, // $0.06 per query
    includedScans: 250,
    scanOverageRate: 75, // $0.75 per scan
    deepCheckRate: 200 // $2.00 per deep check
  },
  {
    id: "professional",
    name: "PROFESSIONAL",
    subtitle: "$99 – $499/mo",
    priceRange: "$99 – $499/mo",
    minPrice: 99,
    maxPrice: 499,
    duration: "Monthly Subscription",
    deliverables: [
      "Full 7-Seat Senate Architecture",
      "Up to 15,000 Queries/Month",
      "API Integration Support",
      "1,500 QR Scans Included/Month",
      "Advanced Audit Logs"
    ],
    color: "blue",
    includedQueries: 15000,
    queryOverageRate: 4, // $0.04 per query
    includedScans: 1500,
    scanOverageRate: 50, // $0.50 per scan
    deepCheckRate: 150 // $1.50 per deep check
  },
  {
    id: "business",
    name: "BUSINESS",
    subtitle: "$499 – $1,999/mo",
    priceRange: "$499 – $1,999/mo",
    minPrice: 499,
    maxPrice: 1999,
    duration: "Monthly Subscription",
    deliverables: [
      "Full 7-Seat Senate Architecture",
      "Up to 75,000 Queries/Month",
      "Liability Shield API",
      "10,000 QR Scans Included/Month",
      "Priority Support"
    ],
    color: "purple",
    includedQueries: 75000,
    queryOverageRate: 2, // $0.02 per query
    includedScans: 10000,
    scanOverageRate: 30, // $0.30 per scan
    deepCheckRate: 100 // $1.00 per deep check
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    subtitle: "$2K – $10K/mo",
    priceRange: "$2,000 – $10,000/mo",
    minPrice: 2000,
    maxPrice: 10000,
    duration: "Annual Contract",
    deliverables: [
      "Full 7-Seat Senate Architecture",
      "Up to 500,000 Queries/Month",
      "On-Premise Deployment Option",
      "100,000 QR Scans Included/Month",
      "Custom Constitution Calibration"
    ],
    color: "amber",
    includedQueries: 500000,
    queryOverageRate: 1, // $0.01 per query
    includedScans: 100000,
    scanOverageRate: 15, // $0.15 per scan
    deepCheckRate: 50 // $0.50 per deep check
  },
  {
    id: "sovereign",
    name: "SECTOR SOVEREIGN",
    subtitle: "$10K+/mo",
    priceRange: "$10,000+/mo",
    minPrice: 10000,
    maxPrice: 100000,
    duration: "Multi-Year Exclusive",
    deliverables: [
      "Full 7-Seat Senate Architecture",
      "Unlimited Queries",
      "Exclusive Sector License",
      "Unlimited QR Scans",
      "White Label + Source Code Escrow"
    ],
    color: "red",
    includedQueries: -1, // Unlimited
    queryOverageRate: 0,
    includedScans: -1,
    scanOverageRate: 7, // $0.07 per scan
    deepCheckRate: 25 // $0.25 per deep check
  }
];

const CHECK_TYPES = [
  { id: "basic", name: "Basic Verification", description: "Age/Identity confirmation", multiplier: 1 },
  { id: "standard", name: "Standard Screening", description: "ID + Background check", multiplier: 2 },
  { id: "deep", name: "Deep Screening", description: "Terrorist, Most Wanted, Sexual Predator", multiplier: 3 }
];

// User tier breakpoints for pricing stability
const USER_TIERS = [
  { min: 1, max: 10, label: "1-10", display: 10 },
  { min: 11, max: 20, label: "11-20", display: 20 },
  { min: 21, max: 40, label: "21-40", display: 40 },
  { min: 41, max: 100, label: "41-100", display: 100 },
  { min: 101, max: 200, label: "101-200", display: 200 },
  { min: 201, max: 300, label: "201-300", display: 300 },
  { min: 301, max: 400, label: "301-400", display: 400 },
  { min: 401, max: 500, label: "401-500", display: 500 },
  { min: 501, max: 600, label: "501-600", display: 600 },
  { min: 601, max: 700, label: "601-700", display: 700 },
  { min: 701, max: 800, label: "701-800", display: 800 },
  { min: 801, max: 900, label: "801-900", display: 900 },
  { min: 901, max: 1000, label: "901-1K", display: 1000 },
  { min: 1001, max: 1100, label: "1K-1.1K", display: 1100 },
  { min: 1101, max: 1200, label: "1.1K-1.2K", display: 1200 },
  { min: 1201, max: 1300, label: "1.2K-1.3K", display: 1300 },
  { min: 1301, max: 1400, label: "1.3K-1.4K", display: 1400 },
  { min: 1401, max: 1500, label: "1.4K-1.5K", display: 1500 },
  { min: 1501, max: 1600, label: "1.5K-1.6K", display: 1600 },
  { min: 1601, max: 1700, label: "1.6K-1.7K", display: 1700 },
  { min: 1701, max: 1800, label: "1.7K-1.8K", display: 1800 },
  { min: 1801, max: 1900, label: "1.8K-1.9K", display: 1900 },
  { min: 1901, max: 2000, label: "1.9K-2K", display: 2000 },
  { min: 2001, max: 3000, label: "2K-3K", display: 3000 },
  { min: 3001, max: 4000, label: "3K-4K", display: 4000 },
  { min: 4001, max: 5000, label: "4K-5K", display: 5000 },
  { min: 5001, max: 6000, label: "5K-6K", display: 6000 },
  { min: 6001, max: 7000, label: "6K-7K", display: 7000 },
  { min: 7001, max: 8000, label: "7K-8K", display: 8000 },
  { min: 8001, max: 9000, label: "8K-9K", display: 9000 },
  { min: 9001, max: 10000, label: "9K-10K", display: 10000 },
];

// QR Scan tier breakpoints for small-to-enterprise scaling
const SCAN_TIERS = [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: 200, label: "200" },
  { value: 500, label: "500" },
  { value: 1000, label: "1K" },
  { value: 2500, label: "2.5K" },
  { value: 5000, label: "5K" },
  { value: 10000, label: "10K" },
  { value: 25000, label: "25K" },
  { value: 50000, label: "50K" },
  { value: 100000, label: "100K" },
  { value: 250000, label: "250K" },
  { value: 500000, label: "500K" },
];

export function DynamicPricingCalculator() {
  const [userTierIndex, setUserTierIndex] = useState(0); // Default to 1-10 tier (solo)
  const [queriesPerUserDay, setQueriesPerUserDay] = useState(5);
  const [scanTierIndex, setScanTierIndex] = useState(3); // Default to 50 scans
  const [isHighLiability, setIsHighLiability] = useState(false);
  const [checkType, setCheckType] = useState("basic");
  
  const [recommendedTier, setRecommendedTier] = useState<PricingTier>(PRICING_TIERS[0]);
  const [estimatedPrice, setEstimatedPrice] = useState(4.99);
  const [monthlyQueries, setMonthlyQueries] = useState(0);
  const [queryOverage, setQueryOverage] = useState(0);
  const [queryOverageCost, setQueryOverageCost] = useState(0);
  const [scanOverage, setScanOverage] = useState(0);
  const [scanOverageCost, setScanOverageCost] = useState(0);

  // Get actual values from tier indices
  const users = USER_TIERS[userTierIndex]?.display || 10;
  const monthlyScans = SCAN_TIERS[scanTierIndex]?.value || 50;
  const currentUserTier = USER_TIERS[userTierIndex];
  const currentScanTier = SCAN_TIERS[scanTierIndex];

  useEffect(() => {
    // Calculate monthly queries: users × queries/day × 22 working days
    const calculatedMonthlyQueries = users * queriesPerUserDay * 22;
    setMonthlyQueries(calculatedMonthlyQueries);

    // Determine tier based on query volume, user count, and scan volume
    let tier: PricingTier;
    let price: number;

    // Calculate base factors
    const queryFactor = calculatedMonthlyQueries;
    const userFactor = users;
    const scanFactor = monthlyScans;

    // Industry-scaled pricing from $4.99/mo to $10K+/mo
    if (isHighLiability || queryFactor > 500000 || userFactor > 2000 || scanFactor > 100000) {
      // SOVEREIGN: High liability, 500K+ queries, 2K+ users, or 100K+ scans
      tier = PRICING_TIERS[5];
      const utilizationRatio = Math.max(
        queryFactor / 1000000,
        userFactor / 10000,
        scanFactor / 500000
      );
      price = 10000 + (utilizationRatio * 90000);
    } else if (queryFactor > 75000 || userFactor > 500 || scanFactor > 10000) {
      // ENTERPRISE: 75K+ queries, 500+ users, or 10K+ scans
      tier = PRICING_TIERS[4];
      const utilizationRatio = Math.max(
        queryFactor / 500000,
        userFactor / 2000,
        scanFactor / 100000
      );
      price = 2000 + (utilizationRatio * 8000);
    } else if (queryFactor > 15000 || userFactor > 100 || scanFactor > 1500) {
      // BUSINESS: 15K+ queries, 100+ users, or 1.5K+ scans
      tier = PRICING_TIERS[3];
      const utilizationRatio = Math.max(
        queryFactor / 75000,
        userFactor / 500,
        scanFactor / 10000
      );
      price = 499 + (utilizationRatio * 1500);
    } else if (queryFactor > 2500 || userFactor > 20 || scanFactor > 250) {
      // PROFESSIONAL: 2.5K+ queries, 20+ users, or 250+ scans
      tier = PRICING_TIERS[2];
      const utilizationRatio = Math.max(
        queryFactor / 15000,
        userFactor / 100,
        scanFactor / 1500
      );
      price = 99 + (utilizationRatio * 400);
    } else if (queryFactor > 500 || userFactor > 10 || scanFactor > 50) {
      // STARTER: 500+ queries, 10+ users, or 50+ scans
      tier = PRICING_TIERS[1];
      const utilizationRatio = Math.max(
        queryFactor / 2500,
        userFactor / 20,
        scanFactor / 250
      );
      price = 29 + (utilizationRatio * 70);
    } else {
      // SOLO: Entry level - starts at $4.99/mo
      tier = PRICING_TIERS[0];
      const utilizationRatio = Math.max(
        queryFactor / 500,
        userFactor / 10,
        scanFactor / 50
      );
      price = 4.99 + (utilizationRatio * 24);
    }

    // Calculate query overage
    let qOverage = 0;
    let qOverageFee = 0;
    if (tier.includedQueries !== -1 && calculatedMonthlyQueries > tier.includedQueries) {
      qOverage = calculatedMonthlyQueries - tier.includedQueries;
      qOverageFee = (qOverage * tier.queryOverageRate) / 100;
    }

    // Calculate scan overage with tier-aware pricing
    let sOverage = 0;
    let sOverageFee = 0;
    if (tier.includedScans !== -1 && monthlyScans > tier.includedScans) {
      sOverage = monthlyScans - tier.includedScans;
      const checkMultiplier = CHECK_TYPES.find(c => c.id === checkType)?.multiplier || 1;
      sOverageFee = (sOverage * tier.scanOverageRate * checkMultiplier) / 100;
    }

    setRecommendedTier(tier);
    setEstimatedPrice(price < 100 ? Math.round(price * 100) / 100 : Math.round(price));
    setQueryOverage(qOverage);
    setQueryOverageCost(Math.round(qOverageFee));
    setScanOverage(sOverage);
    setScanOverageCost(Math.round(sOverageFee));
  }, [users, queriesPerUserDay, monthlyScans, isHighLiability, checkType]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 100 ? 2 : 0,
      maximumFractionDigits: value < 100 ? 2 : 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatCompact = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toString();
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
            Volume-based calculator that scales from solo operators to enterprise deployments. 
            Pricing based on Senate query volume — how often AI decisions are governed.
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
                <span className="text-purple-400 font-medium">Seats are model-agnostic and interchangeable.</span> If a new LLM outperforms an incumbent on drift and hallucination benchmarks, it earns a seat. You're buying governance architecture, not vendor lock-in.
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
            {/* Users Governed - Tier-based */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-400" />
                  Users Governed
                </Label>
                <span className="font-mono text-cyan-400 text-lg">{currentUserTier?.label || "1-10"} users</span>
              </div>
              <Slider
                value={[userTierIndex]}
                onValueChange={(v) => setUserTierIndex(v[0])}
                min={0}
                max={USER_TIERS.length - 1}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>1-10</span>
                <span>100-500</span>
                <span>2K-10K</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Employees, agents, or systems using AI that passes through the Senate. 
                <span className="text-cyan-400"> Same price per tier</span> — scales in brackets.
              </p>
            </div>

            {/* Queries per User per Day */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  Senate Queries per User/Day
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">A <span className="font-semibold">Senate Query</span> is triggered each time a user's AI action is submitted for governance review — the Senate evaluates, debates, and returns a verified decision.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <span className="font-mono text-cyan-400 text-lg">{queriesPerUserDay}/day</span>
              </div>
              <Slider
                value={[queriesPerUserDay]}
                onValueChange={(v) => setQueriesPerUserDay(v[0])}
                min={1}
                max={200}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>1/day</span>
                <span>50/day</span>
                <span>200+/day</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Each time a user asks the Senate to verify or govern an AI decision
              </p>
            </div>

            {/* Calculated Monthly Volume */}
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Monthly Senate Queries</p>
                    <p className="text-xs text-muted-foreground">{formatNumber(users)} users × {queriesPerUserDay}/day × 22 days</p>
                  </div>
                </div>
                <p className="text-2xl font-bold font-mono text-cyan-400">
                  {formatCompact(monthlyQueries)}
                </p>
              </div>
            </div>

            {/* Monthly QR Scans - Tier-based */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-cyan-400" />
                  Expected Monthly QR Scans
                </Label>
                <span className="font-mono text-cyan-400 text-lg">{currentScanTier?.label || "500"}</span>
              </div>
              <Slider
                value={[scanTierIndex]}
                onValueChange={(v) => setScanTierIndex(v[0])}
                min={0}
                max={SCAN_TIERS.length - 1}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>5</span>
                <span>1K</span>
                <span>500K</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Door scans, identity verifications, or check-ins per month. 
                <span className="text-cyan-400"> Scales from solo to enterprise.</span>
              </p>
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
              <h3 className="text-2xl font-bold text-foreground mb-1">{recommendedTier.name}</h3>
              <p className="text-muted-foreground mb-4">{recommendedTier.subtitle}</p>
              
              <div className="p-4 rounded-lg bg-black/40 mb-4">
                <p className="text-xs font-mono text-muted-foreground mb-1">MONTHLY PRICE</p>
                <p className="text-3xl font-bold text-cyan-400 font-mono">
                  {formatCurrency(estimatedPrice)}<span className="text-lg text-muted-foreground">/mo</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Range: {recommendedTier.priceRange}
                </p>
              </div>

              {/* Query Allocation */}
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <p className="text-sm font-mono text-cyan-400">SENATE QUERY ALLOCATION</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Included/Month</p>
                    <p className="font-bold text-foreground">
                      {recommendedTier.includedQueries === -1 ? 'Unlimited' : formatCompact(recommendedTier.includedQueries)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Overage Rate</p>
                    <p className="font-bold text-foreground">
                      ${(recommendedTier.queryOverageRate / 100).toFixed(3)}/query
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Your Expected</p>
                    <p className="font-bold text-foreground">{formatCompact(monthlyQueries)}/mo</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Utilization</p>
                    <p className={`font-bold ${
                      recommendedTier.includedQueries === -1 ? 'text-green-400' :
                      monthlyQueries > recommendedTier.includedQueries ? 'text-amber-400' : 'text-green-400'
                    }`}>
                      {recommendedTier.includedQueries === -1 ? '∞' : 
                        `${Math.round((monthlyQueries / recommendedTier.includedQueries) * 100)}%`}
                    </p>
                  </div>
                </div>

                {queryOverage > 0 && (
                  <div className="mt-3 pt-3 border-t border-cyan-500/30">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-amber-400">
                        ⚠️ {formatCompact(queryOverage)} queries over limit
                      </p>
                      <p className="text-sm font-mono text-amber-400">
                        +{formatCurrency(queryOverageCost)}/mo
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Scan Allocation */}
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="h-4 w-4 text-purple-400" />
                  <p className="text-sm font-mono text-purple-400">QR SCAN ALLOCATION</p>
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
                </div>

                {scanOverage > 0 && (
                  <div className="mt-3 pt-3 border-t border-purple-500/30">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-amber-400">
                        ⚠️ {formatNumber(scanOverage)} scans over limit
                      </p>
                      <p className="text-sm font-mono text-amber-400">
                        +{formatCurrency(scanOverageCost)}/mo
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
                      <Zap className="h-3 w-3" />
                      {tier.includedQueries === -1 ? '∞' : formatCompact(tier.includedQueries)} queries
                    </span>
                    <span>|</span>
                    <span className="flex items-center gap-1">
                      <QrCode className="h-3 w-3" />
                      {tier.includedScans === -1 ? '∞' : formatCompact(tier.includedScans)} scans
                    </span>
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
