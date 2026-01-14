import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Calculator, 
  Users, 
  MessageSquare, 
  Shield, 
  TrendingUp,
  Check,
  AlertTriangle,
  Zap,
  Building2,
  Crown,
  Plug,
  Fingerprint,
  FileText,
  QrCode
} from "lucide-react";
import { PricingProposalDialog } from "./pricing/PricingProposalDialog";
import { OrderFormDialog } from "./pricing/OrderFormDialog";
import { AIGovernanceBadge } from "./pricing/AIGovernanceBadge";

// Types
type TierKey = "solo" | "starter" | "professional" | "business" | "enterprise" | "sector_sovereign";
type RiskLevel = "low" | "medium" | "high";

interface TierConfig {
  user_range: { min: number; max: number };
  per_user_rate_usd: number;
  included_queries_per_user: number;
  included_ghost_pass_per_user: number;
  ports_cap: number;
  query_overage_usd: number;
  ghost_pass_rate_usd: number;
  port_overage_usd: number;
}

// Per-user pricing configuration from spec
const PRICING_CONFIG = {
  version: "per-user-1.0",
  defaults: {
    working_days_per_month: 22,
    risk_multiplier: { low: 1.0, medium: 1.30, high: 1.70 } as Record<RiskLevel, number>,
    negotiation_range_percent: 0.20,
    verification_addon_enabled_by_default: false
  },
  tiers: {
    solo: {
      user_range: { min: 1, max: 5 },
      per_user_rate_usd: 15,
      included_queries_per_user: 200,
      included_ghost_pass_per_user: 50,
      ports_cap: 2,
      query_overage_usd: 0.08,
      ghost_pass_rate_usd: 0.75,
      port_overage_usd: 99
    },
    starter: {
      user_range: { min: 6, max: 10 },
      per_user_rate_usd: 14,
      included_queries_per_user: 500,
      included_ghost_pass_per_user: 100,
      ports_cap: 3,
      query_overage_usd: 0.08,
      ghost_pass_rate_usd: 0.65,
      port_overage_usd: 99
    },
    professional: {
      user_range: { min: 11, max: 25 },
      per_user_rate_usd: 12,
      included_queries_per_user: 1000,
      included_ghost_pass_per_user: 200,
      ports_cap: 5,
      query_overage_usd: 0.08,
      ghost_pass_rate_usd: 0.55,
      port_overage_usd: 199
    },
    business: {
      user_range: { min: 26, max: 100 },
      per_user_rate_usd: 10,
      included_queries_per_user: 1000,
      included_ghost_pass_per_user: 300,
      ports_cap: 8,
      query_overage_usd: 0.08,
      ghost_pass_rate_usd: 0.45,
      port_overage_usd: 299
    },
    enterprise: {
      user_range: { min: 101, max: 500 },
      per_user_rate_usd: 8,
      included_queries_per_user: 1000,
      included_ghost_pass_per_user: 500,
      ports_cap: 12,
      query_overage_usd: 0.08,
      ghost_pass_rate_usd: 0.10,
      port_overage_usd: 499
    },
    sector_sovereign: {
      user_range: { min: 501, max: -1 },
      per_user_rate_usd: 6.5,
      included_queries_per_user: -1,
      included_ghost_pass_per_user: -1,
      ports_cap: -1,
      query_overage_usd: 0.08,
      ghost_pass_rate_usd: 0.06,
      port_overage_usd: 999
    }
  } as Record<TierKey, TierConfig>,
  verification_rates_usd: {
    basic: 1.80,
    standard: 2.60,
    deep: 3.60
  },
  owner_guards: {
    min_margin_percent: 0.35,
    query_floor_usd: 0.08,
    min_ghost_pass_rate_usd: { solo: 0.75, starter: 0.65, professional: 0.55, business: 0.45, enterprise: 0.10, sector_sovereign: 0.06 },
    port_floor_usd: { solo: 99, starter: 99, professional: 199, business: 299, enterprise: 499, sector_sovereign: 999 },
    allow_discount_below_floor: false
  },
  competitor_parity: {
    agentforce_action_usd: 0.10,
    show_parity_tile: true
  }
};

const TIER_ORDER: TierKey[] = ["solo", "starter", "professional", "business", "enterprise", "sector_sovereign"];

const TIER_LABELS: Record<TierKey, { name: string; icon: React.ReactNode; userRange: string; priceRange: string }> = {
  solo: { name: "Solo", icon: <Users className="h-5 w-5" />, userRange: "1–5 users", priceRange: "$79–$149/mo OR $15/user" },
  starter: { name: "Starter", icon: <Zap className="h-5 w-5" />, userRange: "6–10 users", priceRange: "$149–$399/mo OR $14/user" },
  professional: { name: "Professional", icon: <TrendingUp className="h-5 w-5" />, userRange: "11–25 users", priceRange: "$399–$999/mo OR $12/user" },
  business: { name: "Business", icon: <Building2 className="h-5 w-5" />, userRange: "26–100 users", priceRange: "$999–$2,499/mo OR $10/user" },
  enterprise: { name: "Enterprise", icon: <Shield className="h-5 w-5" />, userRange: "101–500 users", priceRange: "$2,500–$10,000/mo OR $8/user" },
  sector_sovereign: { name: "Sector Sovereign", icon: <Crown className="h-5 w-5" />, userRange: "501+ users", priceRange: "Custom ($6–$7/user)" }
};

export function DynamicPricingCalculator() {
  // Client inputs
  const [usersGoverned, setUsersGoverned] = useState(10);
  const [queriesPerDay, setQueriesPerDay] = useState(10);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("low");
  const [portsConnected, setPortsConnected] = useState(2);
  const [manualTier, setManualTier] = useState<TierKey | null>(null);
  
  // Ghost Pass QR Scans
  const [ghostPassScans, setGhostPassScans] = useState(500);
  
  // Verification Checks - Optional Add-on
  const [verificationEnabled, setVerificationEnabled] = useState(false);
  const [checksBasic, setChecksBasic] = useState(0);
  const [checksStandard, setChecksStandard] = useState(0);
  const [checksDeep, setChecksDeep] = useState(0);

  // Dialogs
  const [proposalOpen, setProposalOpen] = useState(false);
  const [orderFormOpen, setOrderFormOpen] = useState(false);

  // Derived calculations
  const calculations = useMemo(() => {
    const { defaults, tiers, verification_rates_usd, competitor_parity } = PRICING_CONFIG;
    
    // Monthly Senate Queries
    const msq = usersGoverned * queriesPerDay * defaults.working_days_per_month;
    
    // Risk multiplier
    const riskMultiplier = defaults.risk_multiplier[riskLevel];
    
    // Auto-recommend tier based on user count and ports
    let recommendedTier: TierKey = "solo";
    for (const tier of TIER_ORDER) {
      const config = tiers[tier];
      const userFits = config.user_range.max === -1 
        ? usersGoverned >= config.user_range.min 
        : usersGoverned >= config.user_range.min && usersGoverned <= config.user_range.max;
      const portsFit = config.ports_cap === -1 || portsConnected <= config.ports_cap;
      
      if (userFits && portsFit) {
        recommendedTier = tier;
        break;
      }
      if (userFits) {
        recommendedTier = tier;
        break;
      }
    }
    
    // Use manual tier if set, otherwise recommended
    const selectedTier = manualTier || recommendedTier;
    const tierConfig = tiers[selectedTier];
    
    // Per-user subtotal
    const perUserSubtotal = usersGoverned * tierConfig.per_user_rate_usd;
    
    // Included org totals (scale per user)
    const includedQueriesTotal = tierConfig.included_queries_per_user === -1 
      ? -1 
      : usersGoverned * tierConfig.included_queries_per_user;
    const includedGhostPassTotal = tierConfig.included_ghost_pass_per_user === -1 
      ? -1 
      : usersGoverned * tierConfig.included_ghost_pass_per_user;
    
    // Calculate query overages
    const queryOverageCount = includedQueriesTotal === -1 
      ? 0 
      : Math.max(msq - includedQueriesTotal, 0);
    const queryOverage = queryOverageCount * tierConfig.query_overage_usd;
    
    // Ghost Pass scan overages
    const ghostPassOverageCount = includedGhostPassTotal === -1
      ? 0
      : Math.max(ghostPassScans - includedGhostPassTotal, 0);
    const ghostPassOverage = ghostPassOverageCount * tierConfig.ghost_pass_rate_usd;
    const ghostPassUtilization = includedGhostPassTotal === -1
      ? 0
      : Math.round((ghostPassScans / includedGhostPassTotal) * 100);
    
    // Port overages
    const portOverageCount = tierConfig.ports_cap === -1 
      ? 0 
      : Math.max(portsConnected - tierConfig.ports_cap, 0);
    const portOverage = portOverageCount * tierConfig.port_overage_usd;
    
    // Verification add-on (flat per-check pricing, only if enabled)
    const basicChecksCost = verificationEnabled ? checksBasic * verification_rates_usd.basic : 0;
    const standardChecksCost = verificationEnabled ? checksStandard * verification_rates_usd.standard : 0;
    const deepChecksCost = verificationEnabled ? checksDeep * verification_rates_usd.deep : 0;
    const totalVerificationCost = basicChecksCost + standardChecksCost + deepChecksCost;
    
    // Subtotal and total
    const subtotal = perUserSubtotal + queryOverage + ghostPassOverage + portOverage + totalVerificationCost;
    const totalMonthly = subtotal * riskMultiplier;
    
    // Negotiation range
    const rangeLow = Math.round(totalMonthly * (1 - defaults.negotiation_range_percent));
    const rangeHigh = Math.round(totalMonthly * (1 + defaults.negotiation_range_percent));
    
    // Utilization percentage
    const queryUtilization = includedQueriesTotal === -1 
      ? 0 
      : Math.round((msq / includedQueriesTotal) * 100);
    
    // Suggest upgrade if overage > 40% of per-user subtotal
    const totalOverage = queryOverage + ghostPassOverage + portOverage;
    const suggestUpgrade = totalOverage > perUserSubtotal * 0.4 && selectedTier !== "sector_sovereign";
    
    // Competitor parity (Agentforce) - actions @ $0.10 × MSQ
    const agentforceBaseline = msq * competitor_parity.agentforce_action_usd;
    const savingsPercent = agentforceBaseline > 0 
      ? Math.round((1 - (totalMonthly / agentforceBaseline)) * 100) 
      : 0;
    
    return {
      msq,
      riskLevel,
      riskMultiplier,
      recommendedTier,
      selectedTier,
      tierConfig,
      perUserSubtotal,
      includedQueriesTotal,
      includedGhostPassTotal,
      queryOverageCount,
      queryOverage,
      ghostPassOverageCount,
      ghostPassOverage,
      ghostPassUtilization,
      portOverageCount,
      portOverage,
      basicChecksCost,
      standardChecksCost,
      deepChecksCost,
      totalVerificationCost,
      subtotal,
      totalMonthly,
      rangeLow,
      rangeHigh,
      queryUtilization,
      suggestUpgrade,
      agentforceBaseline,
      savingsPercent
    };
  }, [usersGoverned, queriesPerDay, riskLevel, portsConnected, manualTier, ghostPassScans, verificationEnabled, checksBasic, checksStandard, checksDeep]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${Math.round(amount).toLocaleString()}`;
  };

  // Proposal data
  const proposalData = {
    usersGoverned,
    queriesPerDay,
    msq: calculations.msq,
    ghostPassScans,
    ghostPassOverage: calculations.ghostPassOverage,
    verificationEnabled,
    checksBasic,
    checksStandard,
    checksDeep,
    basicChecksCost: calculations.basicChecksCost,
    standardChecksCost: calculations.standardChecksCost,
    deepChecksCost: calculations.deepChecksCost,
    totalVerificationCost: calculations.totalVerificationCost,
    portsConnected,
    riskLevel: calculations.riskLevel,
    riskMultiplier: calculations.riskMultiplier,
    selectedTier: calculations.selectedTier,
    tierLabel: TIER_LABELS[calculations.selectedTier].name,
    includedQueries: calculations.includedQueriesTotal,
    includedGhostPassScans: calculations.includedGhostPassTotal,
    ghostPassRate: calculations.tierConfig.ghost_pass_rate_usd,
    includedPorts: calculations.tierConfig.ports_cap,
    anchor: calculations.perUserSubtotal,
    queryOverage: calculations.queryOverage,
    portOverage: calculations.portOverage,
    totalMonthly: calculations.totalMonthly,
    rangeLow: calculations.rangeLow,
    rangeHigh: calculations.rangeHigh,
    agentforceBaseline: calculations.agentforceBaseline,
    savingsPercent: calculations.savingsPercent
  };

  // Order form data
  const orderFormData = {
    tierLabel: TIER_LABELS[calculations.selectedTier].name,
    includedQueries: calculations.includedQueriesTotal,
    includedGhostPassScans: calculations.includedGhostPassTotal,
    ghostPassRate: calculations.tierConfig.ghost_pass_rate_usd,
    includedPorts: calculations.tierConfig.ports_cap,
    portOverageRate: calculations.tierConfig.port_overage_usd,
    verificationEnabled,
    anchor: calculations.perUserSubtotal,
    queryOverage: calculations.queryOverage,
    ghostPassOverage: calculations.ghostPassOverage,
    verificationCost: calculations.totalVerificationCost,
    portOverage: calculations.portOverage,
    riskMultiplier: calculations.riskMultiplier,
    totalMonthly: calculations.totalMonthly
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-foreground flex items-center justify-center gap-3">
          <Calculator className="h-10 w-10 text-primary" />
          7-Seat Senate Pricing
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Per-user pricing. No "credits." Every plan includes the full 7-Seat Senate (model-agnostic, interchangeable).
        </p>
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg max-w-3xl mx-auto">
          <p className="text-base text-foreground">
            <strong>How to pick your tier in 10 seconds:</strong> MSQ = Users × Queries/day × 22. Pick the tier where your Users and Ports fit.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Tier Selection */}
        <div className="space-y-6">
          {/* Tier Selection */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Shield className="h-7 w-7 text-primary" />
                Tier Selection (Per-User)
              </CardTitle>
              <p className="text-base text-muted-foreground mt-2">
                Pick the first tier where your Users range and Ports cap fit. Allocations scale per user.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TIER_ORDER.map((tier) => {
                  const config = PRICING_CONFIG.tiers[tier];
                  const isSelected = calculations.selectedTier === tier;
                  const isRecommended = calculations.recommendedTier === tier && !manualTier;
                  
                  return (
                    <div
                      key={tier}
                      onClick={() => setManualTier(tier === manualTier ? null : tier)}
                      className={`p-5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                          : 'border-border/30 bg-black/20 hover:border-border/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/20' : 'bg-muted/20'}`}>
                          {TIER_LABELS[tier].icon}
                        </div>
                        <div className="flex-1">
                          <span className="font-semibold text-lg block">{TIER_LABELS[tier].name}</span>
                          <span className="text-sm text-muted-foreground">{TIER_LABELS[tier].userRange}</span>
                        </div>
                        {isRecommended && (
                          <Badge className="bg-primary/20 text-primary text-xs px-2 py-0.5">
                            Rec
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mb-3">
                        <span className="text-primary font-mono text-base font-semibold">
                          ${config.per_user_rate_usd}/user/mo
                        </span>
                      </div>
                      
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Queries/user:</span>
                          <span className="font-mono">{config.included_queries_per_user === -1 ? '∞' : config.included_queries_per_user}/mo</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ghost Pass/user:</span>
                          <span className="font-mono">{config.included_ghost_pass_per_user === -1 ? '∞' : config.included_ghost_pass_per_user}/mo</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ports cap:</span>
                          <span className="font-mono">{config.ports_cap === -1 ? '∞' : config.ports_cap}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {calculations.suggestUpgrade && (
                <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-base text-amber-400 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Overage exceeds 40% of per-user subtotal — consider upgrading tier to save money
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verification Add-on (when enabled) */}
          {verificationEnabled && (
            <Card className="bg-card/50 border-border/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Fingerprint className="h-7 w-7 text-cyan-400" />
                  Verification Add-on
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-5 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                  <div className="space-y-3 text-lg">
                    {checksBasic > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Basic: {checksBasic.toLocaleString()} × $1.80</span>
                        <span className="text-cyan-400">= {formatCurrency(calculations.basicChecksCost)}</span>
                      </div>
                    )}
                    {checksStandard > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Standard: {checksStandard.toLocaleString()} × $2.60</span>
                        <span className="text-cyan-400">= {formatCurrency(calculations.standardChecksCost)}</span>
                      </div>
                    )}
                    {checksDeep > 0 && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deep: {checksDeep.toLocaleString()} × $3.60</span>
                        <span className="text-cyan-400">= {formatCurrency(calculations.deepChecksCost)}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-cyan-500/20 pt-3 mt-3">
                      <span className="font-medium">Total Verification:</span>
                      <span className="text-cyan-400 font-medium">{formatCurrency(calculations.totalVerificationCost)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Allocations Summary */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Included Allocations (Org Total)</CardTitle>
              <p className="text-sm text-muted-foreground">
                {usersGoverned} users × per-user allowances = org totals
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Queries */}
              <div className="p-4 rounded-lg border border-border/20 bg-black/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium">Senate Queries</span>
                  <Badge variant="outline" className="font-mono text-sm">$0.08/query overage</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Included:</span>
                    <span>{calculations.includedQueriesTotal === -1 ? '∞' : calculations.includedQueriesTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected:</span>
                    <span>{calculations.msq.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilization:</span>
                    <span className={calculations.queryUtilization > 100 ? 'text-amber-400' : ''}>
                      {calculations.queryUtilization}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overage:</span>
                    <span className="text-primary">+{formatCurrency(calculations.queryOverage)}</span>
                  </div>
                </div>
              </div>

              {/* Ghost Pass */}
              <div className="p-4 rounded-lg border border-violet-500/20 bg-violet-500/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium">Ghost Pass Scans</span>
                  <Badge variant="outline" className="font-mono text-sm border-violet-500/30 text-violet-400">
                    ${calculations.tierConfig.ghost_pass_rate_usd.toFixed(2)}/scan overage
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Included:</span>
                    <span>{calculations.includedGhostPassTotal === -1 ? '∞' : calculations.includedGhostPassTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected:</span>
                    <span>{ghostPassScans.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilization:</span>
                    <span className={calculations.ghostPassUtilization > 100 ? 'text-amber-400' : ''}>
                      {calculations.ghostPassUtilization}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overage:</span>
                    <span className="text-violet-400">+{formatCurrency(calculations.ghostPassOverage)}</span>
                  </div>
                </div>
              </div>

              {/* Ports */}
              <div className="p-4 rounded-lg border border-border/20 bg-black/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium">Ports</span>
                  <Badge variant="outline" className="font-mono text-sm">
                    ${calculations.tierConfig.port_overage_usd}/extra port
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 text-base">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cap:</span>
                    <span>{calculations.tierConfig.ports_cap === -1 ? '∞' : calculations.tierConfig.ports_cap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Connected:</span>
                    <span>{portsConnected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Extra:</span>
                    <span>{calculations.portOverageCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overage:</span>
                    <span className="text-primary">+{formatCurrency(calculations.portOverage)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Parity */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <TrendingUp className="h-7 w-7 text-green-400" />
                Competitor Parity Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-5 rounded-lg bg-black/20 space-y-4 text-lg">
                <p className="text-base text-muted-foreground font-medium mb-2">Salesforce Agentforce baseline</p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actions @ $0.10 each (Flex):</span>
                  <span className="text-red-400">~{formatCurrency(calculations.agentforceBaseline)}/mo</span>
                </div>
              </div>
              
              <div className="p-5 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Giant Ventures @ $0.08 overage + per-user:</span>
                  <span className="text-green-400 font-bold text-xl">{formatCurrency(calculations.totalMonthly)}/mo</span>
                </div>
                {calculations.savingsPercent > 0 && (
                  <p className="text-base text-green-400 mt-3">
                    <Check className="h-5 w-5 inline mr-2" />
                    ~{calculations.savingsPercent}% savings (governance + audit included)
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Senate Allocation moved below */}
        </div>

        {/* Right Column - Client Inputs */}
        <div className="space-y-6">
          {/* Users & Queries */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Users className="h-7 w-7 text-primary" />
                Client Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Users Governed */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-medium">Users Governed</Label>
                  <Input
                    type="number"
                    value={usersGoverned}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setUsersGoverned(Math.max(1, Math.min(100000, val)));
                    }}
                    className="w-32 h-10 text-right font-mono text-lg"
                    min={1}
                    max={100000}
                  />
                </div>
                <Slider
                  value={[Math.log10(Math.max(1, usersGoverned))]}
                  onValueChange={([v]) => {
                    const expValue = Math.round(Math.pow(10, v));
                    setUsersGoverned(Math.max(1, Math.min(100000, expValue)));
                  }}
                  min={0}
                  max={5}
                  step={0.01}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-base text-muted-foreground">
                  <span>1</span>
                  <span>10</span>
                  <span>100</span>
                  <span>1K</span>
                  <span>10K</span>
                  <span>100K</span>
                </div>
              </div>

              {/* Queries per Day */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-medium">Queries per User per Day</Label>
                  <Badge variant="outline" className="font-mono text-lg px-4 py-1">{queriesPerDay}</Badge>
                </div>
                <Slider
                  value={[queriesPerDay]}
                  onValueChange={([v]) => setQueriesPerDay(v)}
                  min={1}
                  max={200}
                  step={1}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-base text-muted-foreground">
                  <span>1</span>
                  <span>200+</span>
                </div>
              </div>

              {/* Monthly Senate Queries (Auto) */}
              <div className="p-5 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-lg flex items-center gap-3">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Monthly Senate Queries (MSQ)
                  </span>
                  <Badge className="bg-primary/20 text-primary font-mono text-lg px-4 py-1">
                    {calculations.msq.toLocaleString()}
                  </Badge>
                </div>
                <p className="text-base text-muted-foreground mt-3">
                  {usersGoverned.toLocaleString()} × {queriesPerDay} × 22 work days
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Ghost Pass QR Scans */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <QrCode className="h-7 w-7 text-violet-400" />
                Ghost Pass — QR Scans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-medium">Expected Monthly Scans</Label>
                  <Input
                    type="number"
                    value={ghostPassScans}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setGhostPassScans(Math.max(0, Math.min(5000000, val)));
                    }}
                    className="w-36 h-10 text-right font-mono text-lg"
                    min={0}
                    max={5000000}
                  />
                </div>
                <Slider
                  value={[Math.log10(Math.max(1, ghostPassScans))]}
                  onValueChange={([v]) => {
                    const expValue = Math.round(Math.pow(10, v));
                    setGhostPassScans(Math.max(0, Math.min(5000000, expValue)));
                  }}
                  min={0}
                  max={6.7}
                  step={0.01}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>0</span>
                  <span>1K</span>
                  <span>10K</span>
                  <span>100K</span>
                  <span>1M</span>
                  <span>5M</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Checks */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Fingerprint className="h-7 w-7 text-cyan-400" />
                  Verification Checks
                  <Badge variant="outline" className="text-base">Optional</Badge>
                </CardTitle>
                <Switch
                  checked={verificationEnabled}
                  onCheckedChange={setVerificationEnabled}
                />
              </div>
            </CardHeader>
            <CardContent className={`space-y-6 transition-opacity ${!verificationEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* Basic Checks */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-lg">
                    <span className="font-medium">Basic</span>
                    <span className="text-muted-foreground ml-2 text-base">(Age/Identity)</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={checksBasic}
                      onChange={(e) => setChecksBasic(Math.max(0, Math.min(100000, parseInt(e.target.value) || 0)))}
                      className="w-28 h-9 text-right font-mono text-base bg-green-500/10 text-green-400 border-green-500/30"
                      min={0}
                      max={100000}
                    />
                    <span className="text-base text-muted-foreground">@ $1.80</span>
                  </div>
                </div>
                <Slider
                  value={[checksBasic]}
                  onValueChange={([v]) => setChecksBasic(v)}
                  min={0}
                  max={10000}
                  step={100}
                  className="cursor-pointer"
                />
              </div>

              {/* Standard Checks */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-lg">
                    <span className="font-medium">Standard</span>
                    <span className="text-muted-foreground ml-2 text-base">(ID + Background)</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={checksStandard}
                      onChange={(e) => setChecksStandard(Math.max(0, Math.min(100000, parseInt(e.target.value) || 0)))}
                      className="w-28 h-9 text-right font-mono text-base bg-amber-500/10 text-amber-400 border-amber-500/30"
                      min={0}
                      max={100000}
                    />
                    <span className="text-base text-muted-foreground">@ $2.60</span>
                  </div>
                </div>
                <Slider
                  value={[checksStandard]}
                  onValueChange={([v]) => setChecksStandard(v)}
                  min={0}
                  max={10000}
                  step={100}
                  className="cursor-pointer"
                />
              </div>

              {/* Deep Checks */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-lg">
                    <span className="font-medium">Deep</span>
                    <span className="text-muted-foreground ml-2 text-base">(Watchlist/Predator)</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={checksDeep}
                      onChange={(e) => setChecksDeep(Math.max(0, Math.min(100000, parseInt(e.target.value) || 0)))}
                      className="w-28 h-9 text-right font-mono text-base bg-red-500/10 text-red-400 border-red-500/30"
                      min={0}
                      max={100000}
                    />
                    <span className="text-base text-muted-foreground">@ $3.60</span>
                  </div>
                </div>
                <Slider
                  value={[checksDeep]}
                  onValueChange={([v]) => setChecksDeep(v)}
                  min={0}
                  max={10000}
                  step={100}
                  className="cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Ports & Risk */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Plug className="h-7 w-7 text-violet-400" />
                Ports & Risk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Ports Connected */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-lg font-medium">Ports Connected</Label>
                  <Badge variant="outline" className="font-mono text-lg px-4 py-1">{portsConnected}</Badge>
                </div>
                <Slider
                  value={[portsConnected]}
                  onValueChange={([v]) => setPortsConnected(v)}
                  min={0}
                  max={15}
                  step={1}
                  className="cursor-pointer"
                />
                <p className="text-base text-muted-foreground">
                  CRM, Ticketing, Access Control, etc.
                </p>
              </div>

              {/* Risk Level */}
              <div className="p-5 rounded-lg border border-border/30 bg-black/20">
                <div className="space-y-5">
                  <div>
                    <Label className="text-lg font-medium flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-amber-400" />
                      Industry Liability Level
                    </Label>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setRiskLevel('low')}
                      className={`px-6 py-3 rounded-full font-semibold text-base transition-all ${
                        riskLevel === 'low'
                          ? 'bg-green-500/30 text-green-400 border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                          : 'bg-green-500/10 text-green-400/70 border border-green-500/30 hover:bg-green-500/20'
                      }`}
                    >
                      Low ×1.00
                    </button>
                    <button
                      type="button"
                      onClick={() => setRiskLevel('medium')}
                      className={`px-6 py-3 rounded-full font-semibold text-base transition-all ${
                        riskLevel === 'medium'
                          ? 'bg-amber-500/30 text-amber-400 border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                          : 'bg-amber-500/10 text-amber-400/70 border border-amber-500/30 hover:bg-amber-500/20'
                      }`}
                    >
                      Medium ×1.30
                    </button>
                    <button
                      type="button"
                      onClick={() => setRiskLevel('high')}
                      className={`px-6 py-3 rounded-full font-semibold text-base transition-all ${
                        riskLevel === 'high'
                          ? 'bg-red-500/30 text-red-400 border-2 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                          : 'bg-red-500/10 text-red-400/70 border border-red-500/30 hover:bg-red-500/20'
                      }`}
                    >
                      High ×1.70
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {riskLevel === 'low' && 'No regulated data. Retail, services, basic SaaS.'}
                    {riskLevel === 'medium' && 'PII/PCI/FERPA, bars, universities, e-commerce.'}
                    {riskLevel === 'high' && 'PHI/GLBA/CJIS, hospitals, banks, stadiums.'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Governance Badge */}
          <AIGovernanceBadge />

          {/* Monthly Price Summary */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Monthly Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-6xl font-bold text-primary">
                  {formatCurrency(calculations.totalMonthly)}
                  <span className="text-2xl font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="text-lg text-muted-foreground mt-3">
                  Range: {formatCurrency(calculations.rangeLow)} – {formatCurrency(calculations.rangeHigh)} (±20%)
                </p>
              </div>

              {/* What You're Getting - Dynamic Description */}
              <div className="p-5 rounded-lg bg-black/30 border border-primary/20 space-y-4">
                <h4 className="text-lg font-semibold text-primary flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  What's Included
                </h4>
                <div className="grid grid-cols-1 gap-3 text-base">
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-foreground">{usersGoverned.toLocaleString()} governed users</strong> on {calculations.selectedTier.charAt(0).toUpperCase() + calculations.selectedTier.slice(1).replace('_', ' ')} tier @ ${calculations.tierConfig.per_user_rate_usd}/user
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-foreground">{calculations.includedQueriesTotal.toLocaleString()} Senate queries</strong> included ({calculations.tierConfig.included_queries_per_user}/user × {usersGoverned})
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-foreground">{calculations.includedGhostPassTotal.toLocaleString()} Ghost Pass scans</strong> included ({calculations.tierConfig.included_ghost_pass_per_user}/user × {usersGoverned})
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-cyan-400 mt-0.5 shrink-0" />
                    <span>
                      <strong className="text-foreground">Up to {calculations.tierConfig.ports_cap} connected ports</strong> (CRM, ticketing, access control, etc.)
                    </span>
                  </div>
                  {verificationEnabled && (
                    <div className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
                      <span>
                        <strong className="text-foreground">{(checksBasic + checksStandard + checksDeep).toLocaleString()} identity verifications</strong> ({checksBasic > 0 ? `${checksBasic} basic` : ''}{checksStandard > 0 ? `${checksBasic > 0 ? ', ' : ''}${checksStandard} standard` : ''}{checksDeep > 0 ? `${checksBasic + checksStandard > 0 ? ', ' : ''}${checksDeep} deep` : ''})
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Architecture Notes */}
              <div className="p-5 rounded-lg bg-black/20 border border-border/20 space-y-3">
                <h4 className="text-base font-semibold text-muted-foreground uppercase tracking-wide">Platform Architecture</h4>
                <ul className="space-y-2 text-base text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                    <span>Full 7-Seat Senate (model-agnostic; best model earns a seat)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                    <span>Governance + audit — immutable trails, human approvals, drift checks</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-400 mt-0.5 shrink-0" />
                    <span>Identity verification optional: Basic $1.80 • Standard $2.60 • Deep $3.60</span>
                  </li>
                </ul>
              </div>

              {/* Breakdown */}
              <div className="p-5 rounded-lg bg-black/20 space-y-3 text-base">
                <h4 className="text-base font-semibold text-muted-foreground uppercase tracking-wide mb-3">Cost Breakdown</h4>
                <div className="flex justify-between font-medium">
                  <span>{usersGoverned} × ${calculations.tierConfig.per_user_rate_usd}/user:</span>
                  <span>{formatCurrency(calculations.perUserSubtotal)}</span>
                </div>
                {calculations.queryOverage > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Query overage ({calculations.queryOverageCount.toLocaleString()} extra):</span>
                    <span>+{formatCurrency(calculations.queryOverage)}</span>
                  </div>
                )}
                {calculations.ghostPassOverage > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Ghost Pass overage ({calculations.ghostPassOverageCount.toLocaleString()} extra):</span>
                    <span className="text-violet-400">+{formatCurrency(calculations.ghostPassOverage)}</span>
                  </div>
                )}
                {verificationEnabled && calculations.totalVerificationCost > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Verification checks:</span>
                    <span className="text-cyan-400">+{formatCurrency(calculations.totalVerificationCost)}</span>
                  </div>
                )}
                {calculations.portOverage > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Ports overage ({calculations.portOverageCount} extra):</span>
                    <span>+{formatCurrency(calculations.portOverage)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border/20 pt-3">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(calculations.subtotal)}</span>
                </div>
                {riskLevel !== 'low' && (
                  <div className="flex justify-between text-amber-400">
                    <span>Risk multiplier ×{calculations.riskMultiplier.toFixed(2)}:</span>
                    <span>{formatCurrency(calculations.totalMonthly)}</span>
                  </div>
                )}
              </div>

              {/* Per-user math explainer */}
              <p className="text-sm text-muted-foreground text-center">
                <strong className="text-foreground">Per-user math:</strong> {usersGoverned} users × ${calculations.tierConfig.per_user_rate_usd}/user = ${calculations.perUserSubtotal}/mo base
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          className="flex-1 bg-primary hover:bg-primary/90 text-lg py-7"
          onClick={() => setProposalOpen(true)}
        >
          <Check className="h-6 w-6 mr-2" />
          Generate Proposal
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 text-lg py-7"
          onClick={() => setOrderFormOpen(true)}
        >
          <FileText className="h-6 w-6 mr-2" />
          Create Order Form
        </Button>
      </div>

      {/* Dialogs */}
      <PricingProposalDialog 
        open={proposalOpen} 
        onOpenChange={setProposalOpen}
        data={proposalData}
      />
      <OrderFormDialog 
        open={orderFormOpen} 
        onOpenChange={setOrderFormOpen}
        data={orderFormData}
      />
    </div>
  );
}
