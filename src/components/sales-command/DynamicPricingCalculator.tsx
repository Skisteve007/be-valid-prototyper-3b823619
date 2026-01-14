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
  Info, ScanLine, Activity, TrendingUp, FileText, Download
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

// ============= PRICING CONFIG (from spec) =============
const PRICING_CONFIG = {
  version: "1.0",
  defaults: {
    working_days_per_month: 22,
    risk_multiplier: { low: 1.0, medium: 1.1, high: 1.25 },
    negotiation_range: 0.20
  },
  tiers: {
    solo: {
      id: "solo",
      name: "SOLO",
      anchor_min_usd: 79,
      anchor_max_usd: 149,
      included_queries: 1000,
      included_scans: 100,
      query_overage_rate_usd: 0.08,
      scan_overage_base_usd: 0.75,
      deliverables: [
        "Full 7-Seat Senate Architecture",
        "Up to 1,000 Queries/Month",
        "100 QR Scans Included/Month",
        "Basic Audit Logs"
      ]
    },
    starter: {
      id: "starter",
      name: "STARTER",
      anchor_min_usd: 149,
      anchor_max_usd: 399,
      included_queries: 5000,
      included_scans: 500,
      query_overage_rate_usd: 0.08,
      scan_overage_base_usd: 0.65,
      deliverables: [
        "Full 7-Seat Senate Architecture",
        "Up to 5,000 Queries/Month",
        "500 QR Scans Included/Month",
        "Standard Audit Logs"
      ]
    },
    professional: {
      id: "professional",
      name: "PROFESSIONAL",
      anchor_min_usd: 399,
      anchor_max_usd: 999,
      included_queries: 25000,
      included_scans: 3000,
      query_overage_rate_usd: 0.08,
      scan_overage_base_usd: 0.55,
      deliverables: [
        "Full 7-Seat Senate Architecture",
        "Up to 25,000 Queries/Month",
        "3,000 QR Scans Included/Month",
        "API Integration Support"
      ]
    },
    business: {
      id: "business",
      name: "BUSINESS",
      anchor_min_usd: 999,
      anchor_max_usd: 2499,
      included_queries: 100000,
      included_scans: 15000,
      query_overage_rate_usd: 0.08,
      scan_overage_base_usd: 0.45,
      deliverables: [
        "Full 7-Seat Senate Architecture",
        "Up to 100,000 Queries/Month",
        "15,000 QR Scans Included/Month",
        "Liability Shield API",
        "Priority Support"
      ]
    },
    enterprise: {
      id: "enterprise",
      name: "ENTERPRISE",
      anchor_min_usd: 2500,
      anchor_max_usd: 10000,
      included_queries: 500000,
      included_scans: 100000,
      query_overage_rate_usd: 0.08,
      scan_overage_base_usd: 0.35,
      deliverables: [
        "Full 7-Seat Senate Architecture",
        "Up to 500,000 Queries/Month",
        "100,000 QR Scans Included/Month",
        "On-Premise Deployment Option",
        "Custom Constitution Calibration"
      ]
    },
    sector_sovereign: {
      id: "sector_sovereign",
      name: "SECTOR SOVEREIGN",
      anchor_min_usd: 10000,
      anchor_max_usd: 100000,
      included_queries: -1, // Unlimited
      included_scans: -1, // Unlimited
      query_overage_rate_usd: 0.08,
      scan_overage_base_usd: 0.25,
      deliverables: [
        "Full 7-Seat Senate Architecture",
        "Unlimited Queries",
        "Unlimited QR Scans",
        "Exclusive Sector License",
        "White Label + Source Code Escrow"
      ]
    }
  },
  verification_multiplier: {
    basic: { value: 1.0, name: "Basic Verification", description: "Age/Identity confirmation" },
    standard: { value: 2.0, name: "Standard Screening", description: "ID + Background check" },
    deep: { value: 3.0, name: "Deep Screening", description: "Terrorist, Most Wanted, Sexual Predator" }
  }
};

// User bracket slider steps
const USER_BRACKETS = [
  { min: 1, max: 5, label: "1-5", display: 5 },
  { min: 6, max: 10, label: "6-10", display: 10 },
  { min: 11, max: 25, label: "11-25", display: 25 },
  { min: 26, max: 50, label: "26-50", display: 50 },
  { min: 51, max: 100, label: "51-100", display: 100 },
  { min: 101, max: 250, label: "101-250", display: 250 },
  { min: 251, max: 500, label: "251-500", display: 500 },
  { min: 501, max: 1000, label: "501-1K", display: 1000 },
  { min: 1001, max: 2000, label: "1K-2K", display: 2000 },
  { min: 2001, max: 5000, label: "2K-5K", display: 5000 },
  { min: 5001, max: 10000, label: "5K-10K", display: 10000 },
];

// Queries per user/day slider steps
const QUERY_STEPS = [1, 5, 10, 25, 50, 100, 200];

// Scan tiers for slider
const SCAN_TIERS = [
  { value: 50, label: "50" },
  { value: 100, label: "100" },
  { value: 250, label: "250" },
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

type RiskLevel = "low" | "medium" | "high";
type VerificationType = "basic" | "standard" | "deep";
type TierKey = keyof typeof PRICING_CONFIG.tiers;

export function DynamicPricingCalculator() {
  // Slider indices
  const [userBracketIndex, setUserBracketIndex] = useState(1); // Default 6-10
  const [queryStepIndex, setQueryStepIndex] = useState(2); // Default 10/day
  const [scanTierIndex, setScanTierIndex] = useState(3); // Default 500 scans
  
  // Toggles
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("low");
  const [verificationType, setVerificationType] = useState<VerificationType>("basic");
  
  // Computed values
  const [computedValues, setComputedValues] = useState({
    monthlyQueries: 0,
    selectedTier: PRICING_CONFIG.tiers.solo,
    tierAnchor: 79,
    queryOverage: 0,
    queryOverageCost: 0,
    scanOverage: 0,
    scanOverageCost: 0,
    subtotal: 79,
    riskMultiplier: 1.0,
    totalMonthly: 79,
    rangeLow: 63,
    rangeHigh: 95,
    queryUtilization: 0
  });

  // Get current slider values
  const currentUsers = USER_BRACKETS[userBracketIndex]?.display || 10;
  const currentQueriesPerDay = QUERY_STEPS[queryStepIndex] || 10;
  const currentMonthlyScans = SCAN_TIERS[scanTierIndex]?.value || 500;

  useEffect(() => {
    // Step 1: Calculate Monthly Senate Queries
    const MSQ = currentUsers * currentQueriesPerDay * PRICING_CONFIG.defaults.working_days_per_month;
    
    // Step 2: Determine tier based on volume (auto-select best fit)
    let selectedTierKey: TierKey = "solo";
    const tiers = PRICING_CONFIG.tiers;
    
    // Auto-tier based on query volume
    if (MSQ > 500000 || currentMonthlyScans > 100000) {
      selectedTierKey = "sector_sovereign";
    } else if (MSQ > 100000 || currentMonthlyScans > 15000) {
      selectedTierKey = "enterprise";
    } else if (MSQ > 25000 || currentMonthlyScans > 3000) {
      selectedTierKey = "business";
    } else if (MSQ > 5000 || currentMonthlyScans > 500) {
      selectedTierKey = "professional";
    } else if (MSQ > 1000 || currentMonthlyScans > 100) {
      selectedTierKey = "starter";
    }
    
    const tier = tiers[selectedTierKey];
    
    // Step 3: Calculate anchor (use midpoint of tier range)
    const tierAnchor = Math.round((tier.anchor_min_usd + tier.anchor_max_usd) / 2);
    
    // Step 4: Query Overages (flat $0.08/query)
    let queryOverage = 0;
    let queryOverageCost = 0;
    if (tier.included_queries !== -1 && MSQ > tier.included_queries) {
      queryOverage = MSQ - tier.included_queries;
      queryOverageCost = queryOverage * tier.query_overage_rate_usd;
    }
    
    // Step 5: Scan Overages (base rate × verification multiplier)
    let scanOverage = 0;
    let scanOverageCost = 0;
    const verificationMultiplier = PRICING_CONFIG.verification_multiplier[verificationType].value;
    
    if (tier.included_scans !== -1 && currentMonthlyScans > tier.included_scans) {
      scanOverage = currentMonthlyScans - tier.included_scans;
      const effectiveScanRate = tier.scan_overage_base_usd * verificationMultiplier;
      scanOverageCost = scanOverage * effectiveScanRate;
    }
    
    // Step 6: Calculate subtotal
    const subtotal = tierAnchor + queryOverageCost + scanOverageCost;
    
    // Step 7: Apply risk multiplier
    const riskMultiplier = PRICING_CONFIG.defaults.risk_multiplier[riskLevel];
    const totalMonthly = subtotal * riskMultiplier;
    
    // Step 8: Calculate negotiation range (±20%)
    const rangeVariance = PRICING_CONFIG.defaults.negotiation_range;
    const rangeLow = Math.round(totalMonthly * (1 - rangeVariance));
    const rangeHigh = Math.round(totalMonthly * (1 + rangeVariance));
    
    // Query utilization
    const queryUtilization = tier.included_queries === -1 
      ? 0 
      : Math.round((MSQ / tier.included_queries) * 100);
    
    setComputedValues({
      monthlyQueries: MSQ,
      selectedTier: tier,
      tierAnchor,
      queryOverage,
      queryOverageCost,
      scanOverage,
      scanOverageCost,
      subtotal,
      riskMultiplier,
      totalMonthly: Math.round(totalMonthly),
      rangeLow,
      rangeHigh,
      queryUtilization
    });
  }, [currentUsers, currentQueriesPerDay, currentMonthlyScans, riskLevel, verificationType]);

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

  const tierArray = Object.values(PRICING_CONFIG.tiers);

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
            Volume-based calculator scaling from solo operators to enterprise/stadium deployments. 
            Pricing based on Senate query volume and verification scans.
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
            {/* Users Governed */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-400" />
                  Users Governed
                </Label>
                <span className="font-mono text-cyan-400 text-lg">{USER_BRACKETS[userBracketIndex]?.label}</span>
              </div>
              <Slider
                value={[userBracketIndex]}
                onValueChange={(v) => setUserBracketIndex(v[0])}
                min={0}
                max={USER_BRACKETS.length - 1}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>1-5</span>
                <span>100-500</span>
                <span>2K-10K</span>
              </div>
            </div>

            {/* Queries per User/Day */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  Senate Queries per User/Day
                </Label>
                <span className="font-mono text-cyan-400 text-lg">{QUERY_STEPS[queryStepIndex]}/day</span>
              </div>
              <Slider
                value={[queryStepIndex]}
                onValueChange={(v) => setQueryStepIndex(v[0])}
                min={0}
                max={QUERY_STEPS.length - 1}
                step={1}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono">
                <span>1/day</span>
                <span>50/day</span>
                <span>200+/day</span>
              </div>
            </div>

            {/* Auto-Calculated Monthly Queries */}
            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Monthly Senate Queries</p>
                    <p className="text-xs text-muted-foreground">
                      {formatNumber(currentUsers)} users × {currentQueriesPerDay}/day × 22 days
                    </p>
                  </div>
                </div>
                <p className="text-2xl font-bold font-mono text-cyan-400">
                  {formatCompact(computedValues.monthlyQueries)}
                </p>
              </div>
            </div>

            {/* Monthly QR Scans */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <QrCode className="h-4 w-4 text-cyan-400" />
                  Expected Monthly QR Scans
                </Label>
                <span className="font-mono text-cyan-400 text-lg">{SCAN_TIERS[scanTierIndex]?.label}</span>
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
                <span>50</span>
                <span>10K</span>
                <span>500K</span>
              </div>
            </div>

            {/* Verification Check Type */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <ScanLine className="h-4 w-4 text-cyan-400" />
                Verification Check Type
              </Label>
              <div className="grid gap-2">
                {Object.entries(PRICING_CONFIG.verification_multiplier).map(([key, check]) => (
                  <div
                    key={key}
                    onClick={() => setVerificationType(key as VerificationType)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      verificationType === key
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
                        {check.value}× rate
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Level Toggle */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                Industry Risk Level
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {(["low", "medium", "high"] as RiskLevel[]).map((level) => (
                  <div
                    key={level}
                    onClick={() => setRiskLevel(level)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                      riskLevel === level
                        ? level === "high" 
                          ? 'border-red-500 bg-red-500/10' 
                          : level === "medium"
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-green-500 bg-green-500/10'
                        : 'border-border/30 bg-black/20 hover:border-border/50'
                    }`}
                  >
                    <p className="font-medium text-sm capitalize">{level}</p>
                    <p className="text-xs text-muted-foreground">
                      ×{PRICING_CONFIG.defaults.risk_multiplier[level].toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              {riskLevel === "high" && (
                <p className="text-xs text-amber-400 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Medical, Legal, Financial, Government sectors
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <div className="space-y-4">
          {/* Main Price Card */}
          <Card className="border-2 border-cyan-500/50 bg-black/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{computedValues.selectedTier.name}</h3>
                  <p className="text-muted-foreground">
                    ${formatNumber(computedValues.selectedTier.anchor_min_usd)} – ${formatNumber(computedValues.selectedTier.anchor_max_usd)}/mo
                  </p>
                </div>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 font-mono">
                  AUTO-SELECTED
                </Badge>
              </div>
              
              {/* Monthly Price (Anchor) */}
              <div className="p-4 rounded-lg bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 mb-4">
                <p className="text-xs font-mono text-muted-foreground mb-1">MONTHLY PRICE (ANCHOR)</p>
                <p className="text-4xl font-bold text-cyan-400 font-mono">
                  {formatCurrency(computedValues.totalMonthly)}
                  <span className="text-lg text-muted-foreground">/mo</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Range: <span className="text-foreground font-mono">{formatCurrency(computedValues.rangeLow)} – {formatCurrency(computedValues.rangeHigh)}</span>
                </p>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 mb-4">
                <p className="text-xs font-mono text-muted-foreground">BREAKDOWN</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tier Anchor</span>
                    <span className="font-mono">{formatCurrency(computedValues.tierAnchor)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Query Overage</span>
                    <span className="font-mono text-amber-400">
                      {computedValues.queryOverageCost > 0 ? `+${formatCurrency(computedValues.queryOverageCost)}` : "$0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Scan Overage (base ${computedValues.selectedTier.scan_overage_base_usd} × {PRICING_CONFIG.verification_multiplier[verificationType].value}×)
                    </span>
                    <span className="font-mono text-amber-400">
                      {computedValues.scanOverageCost > 0 ? `+${formatCurrency(computedValues.scanOverageCost)}` : "$0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border/30 pt-2">
                    <span className="text-muted-foreground">Risk Multiplier</span>
                    <span className="font-mono">
                      {riskLevel === "low" ? "Low" : riskLevel === "medium" ? "Medium" : "High"} ×{computedValues.riskMultiplier.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total Monthly</span>
                    <span className="font-mono text-cyan-400">{formatCurrency(computedValues.totalMonthly)}</span>
                  </div>
                </div>
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
                    <p className="font-bold">
                      {computedValues.selectedTier.included_queries === -1 ? '∞' : formatCompact(computedValues.selectedTier.included_queries)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Overage Rate</p>
                    <p className="font-bold font-mono">$0.080/query</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Your Expected</p>
                    <p className="font-bold">{formatCompact(computedValues.monthlyQueries)}/mo</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Utilization</p>
                    <p className={`font-bold ${
                      computedValues.queryUtilization > 100 ? 'text-amber-400' : 'text-green-400'
                    }`}>
                      {computedValues.selectedTier.included_queries === -1 ? '∞' : `${computedValues.queryUtilization}%`}
                    </p>
                  </div>
                </div>
                {computedValues.queryOverage > 0 && (
                  <div className="mt-3 pt-3 border-t border-cyan-500/30 flex justify-between text-sm">
                    <span className="text-amber-400">⚠️ {formatCompact(computedValues.queryOverage)} queries over limit</span>
                    <span className="font-mono text-amber-400">+{formatCurrency(computedValues.queryOverageCost)}</span>
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
                    <p className="font-bold">
                      {computedValues.selectedTier.included_scans === -1 ? '∞' : formatNumber(computedValues.selectedTier.included_scans)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Overage Rate (base)</p>
                    <p className="font-bold font-mono">${computedValues.selectedTier.scan_overage_base_usd.toFixed(2)}/scan</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Verification Multiplier</p>
                    <p className="font-bold">{PRICING_CONFIG.verification_multiplier[verificationType].value}×</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Effective Rate</p>
                    <p className="font-bold font-mono">
                      ${(computedValues.selectedTier.scan_overage_base_usd * PRICING_CONFIG.verification_multiplier[verificationType].value).toFixed(2)}/scan
                    </p>
                  </div>
                </div>
                {computedValues.scanOverage > 0 && (
                  <div className="mt-3 pt-3 border-t border-purple-500/30 flex justify-between text-sm">
                    <span className="text-amber-400">⚠️ {formatNumber(computedValues.scanOverage)} scans over limit</span>
                    <span className="font-mono text-amber-400">+{formatCurrency(computedValues.scanOverageCost)}</span>
                  </div>
                )}
              </div>

              {/* Architecture Notes */}
              <div className="space-y-2 mb-4">
                <p className="text-xs font-mono text-muted-foreground">ARCHITECTURE</p>
                <div className="space-y-1.5">
                  {computedValues.selectedTier.deliverables.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-400 shrink-0" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marketing Copy */}
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30 mb-4">
                <p className="text-sm text-muted-foreground italic">
                  Is your AI legally defensible? This Constitution outlines the mandatory "Reasonable Care" 
                  standards now required across emerging state liability laws.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* All Tiers Reference */}
          <Card className="border-cyan-500/30 bg-black/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-mono text-muted-foreground">ALL TIERS — SAME 7-SEAT SENATE</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {tierArray.map((tier) => (
                <div 
                  key={tier.id}
                  className={`p-3 rounded-lg border ${
                    tier.id === computedValues.selectedTier.id 
                      ? 'border-cyan-500/50 bg-cyan-500/10' 
                      : 'border-border/30 bg-black/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <p className="font-semibold text-sm">{tier.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${formatNumber(tier.anchor_min_usd)} – ${tier.anchor_max_usd === 100000 ? '∞' : formatNumber(tier.anchor_max_usd)}/mo
                      </p>
                    </div>
                    {tier.id === computedValues.selectedTier.id && (
                      <Badge className="bg-cyan-500 text-black font-mono text-xs">SELECTED</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {tier.included_queries === -1 ? '∞' : formatCompact(tier.included_queries)} queries
                    </span>
                    <span>|</span>
                    <span className="flex items-center gap-1">
                      <QrCode className="h-3 w-3" />
                      {tier.included_scans === -1 ? '∞' : formatCompact(tier.included_scans)} scans
                    </span>
                    <span>|</span>
                    <span className="font-mono">${tier.scan_overage_base_usd}/scan</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CTAs */}
          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-mono py-6">
              <FileText className="mr-2 h-4 w-4" />
              GENERATE PROPOSAL
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Link to="/governance-constitution">
              <Button variant="outline" className="w-full border-cyan-500/50 text-cyan-400 font-mono py-4">
                <Download className="mr-2 h-4 w-4" />
                DOWNLOAD: DEFENSIBLE AI CONSTITUTION
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
