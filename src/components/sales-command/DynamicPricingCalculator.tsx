import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
  Calculator, 
  Users, 
  MessageSquare, 
  Shield, 
  Download,
  TrendingUp,
  Check,
  AlertTriangle,
  Zap,
  Building2,
  Crown,
  Plug,
  Fingerprint,
  FileText,
  Sparkles,
  QrCode
} from "lucide-react";
import { PricingProposalDialog } from "./pricing/PricingProposalDialog";
import { OrderFormDialog } from "./pricing/OrderFormDialog";

// Types
type TierKey = "solo" | "starter" | "professional" | "business" | "enterprise" | "sector_sovereign";
type RiskLevel = "low" | "medium" | "high";

interface TierConfig {
  anchor_min_usd: number;
  anchor_mid_usd: number;
  anchor_max_usd: number;
  included_queries: number;
  included_ports: number;
  included_ghost_pass_scans: number;
  query_overage_usd: number;
  ghost_pass_rate_usd: number;
  port_overage_usd: number;
}

// Configuration from JSON spec demo-1.1
const PRICING_CONFIG = {
  version: "demo-1.1",
  defaults: {
    working_days_per_month: 22,
    risk_multiplier: { low: 1.0, medium: 1.30, high: 1.70 } as Record<RiskLevel, number>,
    negotiation_range_percent: 0.20,
    verification_addon_enabled_by_default: false
  },
  tiers: {
    solo: {
      anchor_min_usd: 79, anchor_mid_usd: 99, anchor_max_usd: 149,
      included_queries: 1000, included_ports: 2, included_ghost_pass_scans: 250,
      query_overage_usd: 0.08, ghost_pass_rate_usd: 0.75, port_overage_usd: 99
    },
    starter: {
      anchor_min_usd: 149, anchor_mid_usd: 199, anchor_max_usd: 399,
      included_queries: 5000, included_ports: 3, included_ghost_pass_scans: 1000,
      query_overage_usd: 0.08, ghost_pass_rate_usd: 0.65, port_overage_usd: 99
    },
    professional: {
      anchor_min_usd: 399, anchor_mid_usd: 699, anchor_max_usd: 999,
      included_queries: 25000, included_ports: 5, included_ghost_pass_scans: 5000,
      query_overage_usd: 0.08, ghost_pass_rate_usd: 0.55, port_overage_usd: 199
    },
    business: {
      anchor_min_usd: 999, anchor_mid_usd: 1799, anchor_max_usd: 2499,
      included_queries: 100000, included_ports: 8, included_ghost_pass_scans: 15000,
      query_overage_usd: 0.08, ghost_pass_rate_usd: 0.45, port_overage_usd: 299
    },
    enterprise: {
      anchor_min_usd: 2500, anchor_mid_usd: 7500, anchor_max_usd: 10000,
      included_queries: 500000, included_ports: 12, included_ghost_pass_scans: 100000,
      query_overage_usd: 0.08, ghost_pass_rate_usd: 0.10, port_overage_usd: 499
    },
    sector_sovereign: {
      anchor_min_usd: 10000, anchor_mid_usd: 25000, anchor_max_usd: 9999999,
      included_queries: -1, included_ports: -1, included_ghost_pass_scans: -1,
      query_overage_usd: 0.08, ghost_pass_rate_usd: 0.06, port_overage_usd: 999
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

const TIER_LABELS: Record<TierKey, { name: string; icon: React.ReactNode; ideal: string }> = {
  solo: { name: "Solo", icon: <Users className="h-5 w-5" />, ideal: "Solo pros & 1–10 person teams" },
  starter: { name: "Starter", icon: <Zap className="h-5 w-5" />, ideal: "5–25 person firms (law, clinics)" },
  professional: { name: "Professional", icon: <TrendingUp className="h-5 w-5" />, ideal: "25–100 staff, multi-department" },
  business: { name: "Business", icon: <Building2 className="h-5 w-5" />, ideal: "100–500 staff, multi-site ops" },
  enterprise: { name: "Enterprise", icon: <Shield className="h-5 w-5" />, ideal: "500–2,500 staff, divisional" },
  sector_sovereign: { name: "Sector Sovereign", icon: <Crown className="h-5 w-5" />, ideal: "Stadiums, leagues, universities" }
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
    
    // Auto-recommend tier (lowest that covers MSQ)
    let recommendedTier: TierKey = "solo";
    for (const tier of TIER_ORDER) {
      const config = tiers[tier];
      const queriesCovered = config.included_queries === -1 || msq <= config.included_queries;
      if (queriesCovered) {
        recommendedTier = tier;
        break;
      }
      recommendedTier = tier; // If nothing covers, use highest
    }
    
    // Use manual tier if set, otherwise recommended
    const selectedTier = manualTier || recommendedTier;
    const tierConfig = tiers[selectedTier];
    
    // Calculate query overages
    const queryOverageCount = tierConfig.included_queries === -1 
      ? 0 
      : Math.max(msq - tierConfig.included_queries, 0);
    const queryOverage = queryOverageCount * tierConfig.query_overage_usd;
    
    // Ghost Pass scan overages
    const ghostPassOverageCount = tierConfig.included_ghost_pass_scans === -1
      ? 0
      : Math.max(ghostPassScans - tierConfig.included_ghost_pass_scans, 0);
    const ghostPassOverage = ghostPassOverageCount * tierConfig.ghost_pass_rate_usd;
    const ghostPassUtilization = tierConfig.included_ghost_pass_scans === -1
      ? 0
      : Math.round((ghostPassScans / tierConfig.included_ghost_pass_scans) * 100);
    
    // Port overages
    const portOverageCount = tierConfig.included_ports === -1 
      ? 0 
      : Math.max(portsConnected - tierConfig.included_ports, 0);
    const portOverage = portOverageCount * tierConfig.port_overage_usd;
    
    // Verification add-on (flat per-check pricing, only if enabled)
    const basicChecksCost = verificationEnabled ? checksBasic * verification_rates_usd.basic : 0;
    const standardChecksCost = verificationEnabled ? checksStandard * verification_rates_usd.standard : 0;
    const deepChecksCost = verificationEnabled ? checksDeep * verification_rates_usd.deep : 0;
    const totalVerificationCost = basicChecksCost + standardChecksCost + deepChecksCost;
    
    // Subtotal and total
    const subtotal = tierConfig.anchor_mid_usd + queryOverage + ghostPassOverage + portOverage + totalVerificationCost;
    const totalMonthly = subtotal * riskMultiplier;
    
    // Negotiation range
    const rangeLow = Math.round(totalMonthly * (1 - defaults.negotiation_range_percent));
    const rangeHigh = Math.round(totalMonthly * (1 + defaults.negotiation_range_percent));
    
    // Utilization percentage
    const queryUtilization = tierConfig.included_queries === -1 
      ? 0 
      : Math.round((msq / tierConfig.included_queries) * 100);
    
    // Suggest upgrade if overage > 40% of anchor
    const totalOverage = queryOverage + ghostPassOverage + portOverage;
    const suggestUpgrade = totalOverage > tierConfig.anchor_mid_usd * 0.4 && selectedTier !== "sector_sovereign";
    
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
    includedQueries: calculations.tierConfig.included_queries,
    includedGhostPassScans: calculations.tierConfig.included_ghost_pass_scans,
    ghostPassRate: calculations.tierConfig.ghost_pass_rate_usd,
    includedPorts: calculations.tierConfig.included_ports,
    anchor: calculations.tierConfig.anchor_mid_usd,
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
    includedQueries: calculations.tierConfig.included_queries,
    includedGhostPassScans: calculations.tierConfig.included_ghost_pass_scans,
    ghostPassRate: calculations.tierConfig.ghost_pass_rate_usd,
    includedPorts: calculations.tierConfig.included_ports,
    portOverageRate: calculations.tierConfig.port_overage_usd,
    verificationEnabled,
    anchor: calculations.tierConfig.anchor_mid_usd,
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
          Plain-English pricing, monthly. No "credits." Every plan includes the full 7-Seat Senate (model-agnostic, interchangeable).
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Tier Selection + Allocations */}
        <div className="space-y-6">
          {/* Running Calculator - Sticky */}
          <Card className="bg-gradient-to-br from-primary/20 to-primary/10 border-primary/40 sticky top-20 z-40 shadow-lg shadow-primary/10">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-semibold text-lg">Running Total</span>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(calculations.totalMonthly)}
                    <span className="text-base font-normal text-muted-foreground">/mo</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Range: {formatCurrency(calculations.rangeLow)} – {formatCurrency(calculations.rangeHigh)}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-primary/20 grid grid-cols-4 gap-2 text-sm">
                <div className="text-center">
                  <span className="block text-muted-foreground">Anchor</span>
                  <span className="font-mono text-primary">{formatCurrency(calculations.tierConfig.anchor_mid_usd)}</span>
                </div>
                <div className="text-center">
                  <span className="block text-muted-foreground">Queries</span>
                  <span className="font-mono text-primary">+{formatCurrency(calculations.queryOverage)}</span>
                </div>
                <div className="text-center">
                  <span className="block text-muted-foreground">Ghost</span>
                  <span className="font-mono text-violet-400">+{formatCurrency(calculations.ghostPassOverage)}</span>
                </div>
                <div className="text-center">
                  <span className="block text-muted-foreground">Risk</span>
                  <span className={`font-mono ${riskLevel !== 'low' ? 'text-amber-400' : 'text-muted-foreground'}`}>×{calculations.riskMultiplier.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tier Selection */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Shield className="h-7 w-7 text-primary" />
                Tier Selection
              </CardTitle>
              <p className="text-base text-muted-foreground mt-2">
                Pick the first tier where MSQ, Ports, and Scans all fit. If any exceeds the cap, move up.
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
                        <div>
                          <span className="font-semibold text-lg block">{TIER_LABELS[tier].name}</span>
                          <span className="text-primary font-mono text-base">
                            ${config.anchor_min_usd}–${config.anchor_max_usd === 9999999 ? '∞' : '$' + config.anchor_max_usd.toLocaleString()}/mo
                          </span>
                        </div>
                        {isRecommended && (
                          <Badge className="ml-auto bg-primary/20 text-primary text-sm px-2 py-0.5">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2 text-base">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Queries:</span>
                          <span className="font-mono">{config.included_queries === -1 ? '∞' : config.included_queries.toLocaleString()}/mo</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ports:</span>
                          <span className="font-mono">{config.included_ports === -1 ? '∞' : config.included_ports}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Ghost Pass:</span>
                          <span className="font-mono">{config.included_ghost_pass_scans === -1 ? '∞' : config.included_ghost_pass_scans.toLocaleString()}/mo</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-cyan-400/80 mt-3 pt-3 border-t border-border/20">
                        {TIER_LABELS[tier].ideal}
                      </p>
                    </div>
                  );
                })}
              </div>
              
              {calculations.suggestUpgrade && (
                <div className="mt-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-base text-amber-400 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Overage exceeds 40% of anchor — consider upgrading tier to save money
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Senate Queries Allocation */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Senate Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-5 rounded-lg border border-border/20 bg-black/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Allocation</span>
                  <Badge variant="outline" className="font-mono text-base">$0.080/query overage</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Included:</span>
                    <span>{calculations.tierConfig.included_queries === -1 ? '∞' : calculations.tierConfig.included_queries.toLocaleString()}</span>
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
            </CardContent>
          </Card>

          {/* Ghost Pass QR Scans Allocation */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <QrCode className="h-7 w-7 text-violet-400" />
                Ghost Pass — QR Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-5 rounded-lg border border-violet-500/20 bg-violet-500/5">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Allocation</span>
                  <Badge variant="outline" className="font-mono text-base border-violet-500/30 text-violet-400">
                    ${calculations.tierConfig.ghost_pass_rate_usd.toFixed(2)}/scan overage
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Included:</span>
                    <span>{calculations.tierConfig.included_ghost_pass_scans === -1 ? '∞' : calculations.tierConfig.included_ghost_pass_scans.toLocaleString()}</span>
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
                {calculations.ghostPassOverageCount > 0 && (
                  <p className="text-base text-muted-foreground mt-3">
                    {calculations.ghostPassOverageCount.toLocaleString()} scans × ${calculations.tierConfig.ghost_pass_rate_usd.toFixed(2)} = +{formatCurrency(calculations.ghostPassOverage)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Verification Add-on */}
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

          {/* Ports */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Ports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-5 rounded-lg border border-border/20 bg-black/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Allocation</span>
                  <Badge variant="outline" className="font-mono text-base">
                    ${calculations.tierConfig.port_overage_usd}/extra port
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Included:</span>
                    <span>{calculations.tierConfig.included_ports === -1 ? '∞' : calculations.tierConfig.included_ports}</span>
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
                  <span className="text-lg font-medium">Giant Ventures @ $0.080 overage + anchor:</span>
                  <span className="text-green-400 font-bold text-xl">{formatCurrency(calculations.totalMonthly)}/mo</span>
                </div>
                {calculations.savingsPercent > 0 && (
                  <p className="text-base text-green-400 mt-3">
                    <Check className="h-5 w-5 inline mr-2" />
                    ~{calculations.savingsPercent}% savings (governance + audit included)
                  </p>
                )}
              </div>
              
              <p className="text-base text-muted-foreground italic">
                You buy governance architecture, not vendor lock-in. Best model earns a seat.
              </p>
            </CardContent>
          </Card>

          {/* Architecture Notes */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Architecture Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 text-lg text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-green-400 mt-0.5 shrink-0" />
                  <span>Full 7-Seat Senate (model-agnostic seats; best model earns a seat)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-green-400 mt-0.5 shrink-0" />
                  <span>Governance + audit — immutable trails, human approvals, drift/hallucination checks</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-green-400 mt-0.5 shrink-0" />
                  <span>Ghost Pass is fast QR validation (gate/turnstile/entry); not a KYC identity check</span>
                </li>
              </ul>
            </CardContent>
          </Card>
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
              {/* Users Governed - Exponential slider with manual input */}
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
                  <Label className="text-lg font-medium">Senate Queries per User per Day</Label>
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
                    Monthly Senate Queries (auto)
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
              <p className="text-base text-muted-foreground mt-2">
                Fast gate validation (separate from identity verification)
              </p>
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
                <div className="flex justify-between text-base text-muted-foreground">
                  <span>0</span>
                  <span>100</span>
                  <span>1K</span>
                  <span>10K</span>
                  <span>100K</span>
                  <span>1M</span>
                  <span>5M+</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-violet-500/5 border border-violet-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-base text-muted-foreground">Tier overage rate:</span>
                  <Badge variant="outline" className="font-mono text-base border-violet-500/30 text-violet-400">
                    ${calculations.tierConfig.ghost_pass_rate_usd.toFixed(2)}/scan
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Checks - Optional Add-on */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Fingerprint className="h-7 w-7 text-cyan-400" />
                  Verification Checks
                  <Badge variant="outline" className="text-base">Optional Add-on</Badge>
                </CardTitle>
                <Switch
                  checked={verificationEnabled}
                  onCheckedChange={setVerificationEnabled}
                />
              </div>
              <p className="text-base text-muted-foreground mt-2">
                Enable to price identity verification checks per check
              </p>
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
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setChecksBasic(Math.max(0, Math.min(100000, val)));
                      }}
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
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setChecksStandard(Math.max(0, Math.min(100000, val)));
                      }}
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
                    <span className="text-muted-foreground ml-2 text-base">(Most Wanted / Predator / Terrorist)</span>
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      value={checksDeep}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 0;
                        setChecksDeep(Math.max(0, Math.min(100000, val)));
                      }}
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

              {/* Total Verification Cost */}
              {verificationEnabled && (
                <div className="p-5 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Total Verification Add-on</span>
                    <Badge className="bg-cyan-500/20 text-cyan-400 font-mono text-lg px-4 py-1">
                      {formatCurrency(calculations.totalVerificationCost)}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ports & Liability */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Plug className="h-7 w-7 text-violet-400" />
                Integrations & Risk
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
                  Salesforce, CRM, Ticketing, Legal, Access Control, etc.
                </p>
              </div>

              {/* Industry Liability Level */}
              <div className="p-5 rounded-lg border border-border/30 bg-black/20">
                <div className="space-y-5">
                  <div>
                    <Label className="text-lg font-medium flex items-center gap-3">
                      <AlertTriangle className="h-6 w-6 text-amber-400" />
                      Industry Liability Level
                    </Label>
                    <p className="text-base text-muted-foreground mt-2">
                      Select what matches your data and operations. If unsure, choose Medium.
                    </p>
                  </div>
                  
                  {/* Risk Pills */}
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setRiskLevel('low')}
                      className={`px-6 py-3 rounded-full font-semibold text-base transition-all ${
                        riskLevel === 'low'
                          ? 'bg-green-500/30 text-green-400 border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                          : 'bg-green-500/10 text-green-400/70 border border-green-500/30 hover:bg-green-500/20'
                      }`}
                      title="No regulated data or alcohol/age-gate. Retail, services, basic SaaS."
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
                      title="PII/PCI/FERPA or alcohol/age-gated entry. Bars, restaurants, universities, e-commerce."
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
                      title="PHI/GLBA/CJIS/ITAR, watchlists/biometrics, or large alcohol-served events. Hospitals, banks, courts, stadiums, festivals."
                    >
                      High ×1.70
                    </button>
                  </div>

                  {/* Selected Risk Details */}
                  <div className={`p-4 rounded-lg border transition-all ${
                    riskLevel === 'low' ? 'border-green-500/30 bg-green-500/5' :
                    riskLevel === 'medium' ? 'border-amber-500/30 bg-amber-500/5' :
                    'border-red-500/30 bg-red-500/5'
                  }`}>
                    {riskLevel === 'low' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Check className="h-5 w-5 text-green-400" />
                          <span className="font-medium text-green-400">Low Risk — ×1.00</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          No regulated data (PHI/GLBA/CJIS/ITAR), no age-restricted entry, minimal public-safety exposure, no alcohol-gated operations.
                        </p>
                        <div className="pt-2 border-t border-green-500/20">
                          <p className="text-xs text-muted-foreground font-medium mb-2">EXAMPLES:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Retail (non-pharmacy), general services, marketing agencies</li>
                            <li>• Coffee shops, bakeries, fast-casual restaurants without alcohol</li>
                            <li>• Basic SaaS (no stored PII), simple e-commerce catalogs</li>
                            <li>• Museums, arcades without alcohol service</li>
                          </ul>
                        </div>
                      </div>
                    )}
                    {riskLevel === 'medium' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-amber-400" />
                          <span className="font-medium text-amber-400">Medium Risk — ×1.30</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Handles PII/PCI/FERPA and/or operates age-restricted entry or alcohol service; contractual/regulatory duties apply.
                        </p>
                        <div className="pt-2 border-t border-amber-500/20">
                          <p className="text-xs text-muted-foreground font-medium mb-2">EXAMPLES:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Bars, pubs, taprooms, breweries with ID checks</li>
                            <li>• Restaurants with alcohol service, nightclubs/lounges (≤3,000 capacity)</li>
                            <li>• Gentlemen's cabarets (no watchlists/biometrics)</li>
                            <li>• Universities/campus events (FERPA), e-commerce with payments (PCI)</li>
                            <li>• SaaS storing customer PII, insurance brokerage CRM, real estate</li>
                          </ul>
                        </div>
                      </div>
                    )}
                    {riskLevel === 'high' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-red-400" />
                          <span className="font-medium text-red-400">High Risk — ×1.70</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Regulated/highly sensitive data (PHI/GLBA/SEC/CJIS/ITAR), privileged legal/financial data, public-safety ops, or large alcohol-serving events.
                        </p>
                        <div className="pt-2 border-t border-red-500/20">
                          <p className="text-xs text-muted-foreground font-medium mb-2">EXAMPLES:</p>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Stadiums/arenas, leagues, large festivals/EDM with crowd-safety ops</li>
                            <li>• Medical/healthcare (PHI/HIPAA), payers/providers</li>
                            <li>• Legal firms/courts (privileged/attorney-client), eDiscovery</li>
                            <li>• Banks/fintech/broker-dealers (GLBA/PCI/SOX/SEC)</li>
                            <li>• Deep screening (watchlists/terrorist/sex offender), biometrics</li>
                            <li>• Nightclubs with watchlists/biometrics OR &gt;3,000 occupancy</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
        </Card>

          {/* Monthly Price Summary */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Monthly Price (Anchor)</CardTitle>
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

              {/* Breakdown */}
              <div className="p-5 rounded-lg bg-black/20 space-y-4 text-lg">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tier anchor ({TIER_LABELS[calculations.selectedTier].name}):</span>
                  <span>{formatCurrency(calculations.tierConfig.anchor_mid_usd)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Query overage:</span>
                  <span>+{formatCurrency(calculations.queryOverage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ghost Pass overage:</span>
                  <span className="text-violet-400">+{formatCurrency(calculations.ghostPassOverage)}</span>
                </div>
                {verificationEnabled && calculations.totalVerificationCost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verification add-on:</span>
                    <span className="text-cyan-400">+{formatCurrency(calculations.totalVerificationCost)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ports overage:</span>
                  <span>+{formatCurrency(calculations.portOverage)}</span>
                </div>
                <div className="flex justify-between border-t border-border/20 pt-4">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(calculations.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk multiplier:</span>
                  <span className={riskLevel !== 'low' ? 'text-amber-400' : ''}>
                    ×{calculations.riskMultiplier.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/20 pt-4 font-medium text-xl">
                  <span>Total Monthly:</span>
                  <span className="text-primary">{formatCurrency(calculations.totalMonthly)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client-Facing Explainer */}
          <div className="p-6 rounded-lg bg-gradient-to-r from-primary/5 to-cyan-500/5 border border-primary/20">
            <p className="text-lg text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Why this makes sense:</strong> You tell us how many people use AI, how often it needs governance, expected Ghost Pass scans, optional verification checks, and connected systems. You see a clear monthly anchor with simple, transparent overages. No "credits." Every plan includes the 7-Seat Senate plus audit trails and Reasonable Care controls.
            </p>
          </div>
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
