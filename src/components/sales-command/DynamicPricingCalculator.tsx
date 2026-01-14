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
  Sparkles
} from "lucide-react";
import { PricingProposalDialog } from "./pricing/PricingProposalDialog";
import { OrderFormDialog } from "./pricing/OrderFormDialog";

// Types
type TierKey = "solo_lite" | "solo" | "starter" | "professional" | "business" | "enterprise" | "sector_sovereign";
type RiskLevel = "low" | "medium" | "high";

interface TierConfig {
  anchor_min_usd: number;
  anchor_mid_usd: number;
  anchor_max_usd: number;
  included_queries: number;
  included_ports: number;
  query_overage_usd: number;
  port_overage_usd: number;
}

// Configuration from JSON spec v1.2 + Solo Lite
const PRICING_CONFIG = {
  version: "1.2",
  defaults: {
    working_days_per_month: 22,
    risk_multiplier: { low: 1.0, medium: 1.3, high: 1.7 } as Record<RiskLevel, number>,
    negotiation_range_percent: 0.20,
    verification_addon_enabled_by_default: false
  },
  tiers: {
    solo_lite: {
      anchor_min_usd: 39, anchor_mid_usd: 49, anchor_max_usd: 59,
      included_queries: 250, included_ports: 1,
      query_overage_usd: 0.08, port_overage_usd: 49
    },
    solo: {
      anchor_min_usd: 79, anchor_mid_usd: 99, anchor_max_usd: 149,
      included_queries: 1000, included_ports: 2,
      query_overage_usd: 0.08, port_overage_usd: 99
    },
    starter: {
      anchor_min_usd: 149, anchor_mid_usd: 199, anchor_max_usd: 399,
      included_queries: 5000, included_ports: 3,
      query_overage_usd: 0.08, port_overage_usd: 99
    },
    professional: {
      anchor_min_usd: 399, anchor_mid_usd: 699, anchor_max_usd: 999,
      included_queries: 25000, included_ports: 5,
      query_overage_usd: 0.08, port_overage_usd: 199
    },
    business: {
      anchor_min_usd: 999, anchor_mid_usd: 1799, anchor_max_usd: 2499,
      included_queries: 100000, included_ports: 8,
      query_overage_usd: 0.08, port_overage_usd: 299
    },
    enterprise: {
      anchor_min_usd: 2500, anchor_mid_usd: 7500, anchor_max_usd: 10000,
      included_queries: 500000, included_ports: 12,
      query_overage_usd: 0.08, port_overage_usd: 499
    },
    sector_sovereign: {
      anchor_min_usd: 10000, anchor_mid_usd: 25000, anchor_max_usd: 9999999,
      included_queries: -1, included_ports: -1,
      query_overage_usd: 0.08, port_overage_usd: 999
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
    port_floor_usd: { solo_lite: 49, solo: 99, starter: 99, professional: 199, business: 299, enterprise: 499, sector_sovereign: 999 },
    allow_discount_below_floor: false
  },
  competitor_parity: {
    agentforce_action_usd: 0.10,
    show_parity_tile: true
  }
};

const TIER_ORDER: TierKey[] = ["solo_lite", "solo", "starter", "professional", "business", "enterprise", "sector_sovereign"];

const TIER_LABELS: Record<TierKey, { name: string; icon: React.ReactNode }> = {
  solo_lite: { name: "Solo Lite", icon: <Sparkles className="h-4 w-4" /> },
  solo: { name: "Solo", icon: <Users className="h-4 w-4" /> },
  starter: { name: "Starter", icon: <Zap className="h-4 w-4" /> },
  professional: { name: "Professional", icon: <TrendingUp className="h-4 w-4" /> },
  business: { name: "Business", icon: <Building2 className="h-4 w-4" /> },
  enterprise: { name: "Enterprise", icon: <Shield className="h-4 w-4" /> },
  sector_sovereign: { name: "Sector Sovereign", icon: <Crown className="h-4 w-4" /> }
};

export function DynamicPricingCalculator() {
  // Client inputs
  const [usersGoverned, setUsersGoverned] = useState(10);
  const [queriesPerDay, setQueriesPerDay] = useState(10);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("low");
  const [portsConnected, setPortsConnected] = useState(2);
  const [manualTier, setManualTier] = useState<TierKey | null>(null);
  
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
    let recommendedTier: TierKey = "solo_lite";
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
    const subtotal = tierConfig.anchor_mid_usd + queryOverage + portOverage + totalVerificationCost;
    const totalMonthly = subtotal * riskMultiplier;
    
    // Negotiation range
    const rangeLow = Math.round(totalMonthly * (1 - defaults.negotiation_range_percent));
    const rangeHigh = Math.round(totalMonthly * (1 + defaults.negotiation_range_percent));
    
    // Utilization percentage
    const queryUtilization = tierConfig.included_queries === -1 
      ? 0 
      : Math.round((msq / tierConfig.included_queries) * 100);
    
    // Suggest upgrade if overage > 40% of anchor
    const totalOverage = queryOverage + portOverage;
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
  }, [usersGoverned, queriesPerDay, riskLevel, portsConnected, manualTier, verificationEnabled, checksBasic, checksStandard, checksDeep]);

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
    includedPorts: calculations.tierConfig.included_ports,
    portOverageRate: calculations.tierConfig.port_overage_usd,
    verificationEnabled,
    anchor: calculations.tierConfig.anchor_mid_usd,
    queryOverage: calculations.queryOverage,
    verificationCost: calculations.totalVerificationCost,
    portOverage: calculations.portOverage,
    riskMultiplier: calculations.riskMultiplier,
    totalMonthly: calculations.totalMonthly
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          7-Seat Senate Pricing
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Plain-English pricing, monthly. No "credits." Every plan includes the full 7-Seat Senate (model-agnostic, interchangeable).
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Inputs */}
        <div className="space-y-4">
          {/* Users & Queries */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Client Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Users Governed - Exponential slider with manual input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Users Governed</Label>
                  <Input
                    type="number"
                    value={usersGoverned}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setUsersGoverned(Math.max(1, Math.min(100000, val)));
                    }}
                    className="w-24 h-7 text-right font-mono text-sm"
                    min={1}
                    max={100000}
                  />
                </div>
                <Slider
                  value={[Math.log10(Math.max(1, usersGoverned))]}
                  onValueChange={([v]) => {
                    // Exponential scale: slider 0-5 maps to 1-100,000
                    const expValue = Math.round(Math.pow(10, v));
                    setUsersGoverned(Math.max(1, Math.min(100000, expValue)));
                  }}
                  min={0}
                  max={5}
                  step={0.01}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>10</span>
                  <span>100</span>
                  <span>1K</span>
                  <span>10K</span>
                  <span>100K</span>
                </div>
              </div>

              {/* Queries per Day */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Senate Queries per User per Day</Label>
                  <Badge variant="outline" className="font-mono">{queriesPerDay}</Badge>
                </div>
                <Slider
                  value={[queriesPerDay]}
                  onValueChange={([v]) => setQueriesPerDay(v)}
                  min={1}
                  max={200}
                  step={1}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>200+</span>
                </div>
              </div>

              {/* Monthly Senate Queries (Auto) */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    Monthly Senate Queries (auto)
                  </span>
                  <Badge className="bg-primary/20 text-primary font-mono">
                    {calculations.msq.toLocaleString()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {usersGoverned.toLocaleString()} × {queriesPerDay} × 22 work days
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Verification Checks - Optional Add-on */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-cyan-400" />
                  Verification Checks
                  <Badge variant="outline" className="text-xs">Optional Add-on</Badge>
                </CardTitle>
                <Switch
                  checked={verificationEnabled}
                  onCheckedChange={setVerificationEnabled}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enable to price verification checks per check
              </p>
            </CardHeader>
            <CardContent className={`space-y-5 transition-opacity ${!verificationEnabled ? 'opacity-50 pointer-events-none' : ''}`}>
              {/* Basic Checks */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">
                    <span className="font-medium">Basic</span>
                    <span className="text-muted-foreground ml-2 text-xs">(Age/Identity)</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono bg-green-500/10 text-green-400 border-green-500/30">
                      {checksBasic.toLocaleString()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">@ $1.80 each</span>
                  </div>
                </div>
                <Slider
                  value={[checksBasic]}
                  onValueChange={([v]) => setChecksBasic(v)}
                  min={0}
                  max={10000}
                  step={10}
                  className="cursor-pointer"
                />
              </div>

              {/* Standard Checks */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">
                    <span className="font-medium">Standard</span>
                    <span className="text-muted-foreground ml-2 text-xs">(ID + Background)</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono bg-amber-500/10 text-amber-400 border-amber-500/30">
                      {checksStandard.toLocaleString()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">@ $2.60 each</span>
                  </div>
                </div>
                <Slider
                  value={[checksStandard]}
                  onValueChange={([v]) => setChecksStandard(v)}
                  min={0}
                  max={10000}
                  step={10}
                  className="cursor-pointer"
                />
              </div>

              {/* Deep Checks */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">
                    <span className="font-medium">Deep</span>
                    <span className="text-muted-foreground ml-2 text-xs">(Most Wanted / Predator / Terrorist)</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono bg-red-500/10 text-red-400 border-red-500/30">
                      {checksDeep.toLocaleString()}
                    </Badge>
                    <span className="text-xs text-muted-foreground">@ $3.60 each</span>
                  </div>
                </div>
                <Slider
                  value={[checksDeep]}
                  onValueChange={([v]) => setChecksDeep(v)}
                  min={0}
                  max={10000}
                  step={10}
                  className="cursor-pointer"
                />
              </div>

              {/* Total Verification Cost */}
              {verificationEnabled && (
                <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Verification Add-on</span>
                    <Badge className="bg-cyan-500/20 text-cyan-400 font-mono">
                      {formatCurrency(calculations.totalVerificationCost)}
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Ports & Liability */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Plug className="h-5 w-5 text-violet-400" />
                Integrations & Risk
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Ports Connected */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Ports Connected</Label>
                  <Badge variant="outline" className="font-mono">{portsConnected}</Badge>
                </div>
                <Slider
                  value={[portsConnected]}
                  onValueChange={([v]) => setPortsConnected(v)}
                  min={0}
                  max={15}
                  step={1}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Salesforce, CRM, Ticketing, Legal, Access Control, etc.
                </p>
              </div>

              {/* Risk Level Radio */}
              <div className="p-3 rounded-lg border border-border/30 bg-black/20">
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    Industry Risk Level
                  </Label>
                  <RadioGroup
                    value={riskLevel}
                    onValueChange={(v) => setRiskLevel(v as RiskLevel)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="risk-low" />
                      <Label htmlFor="risk-low" className="text-sm cursor-pointer">Low (×1.00)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="risk-medium" />
                      <Label htmlFor="risk-medium" className="text-sm cursor-pointer">Medium (×1.30)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="risk-high" />
                      <Label htmlFor="risk-high" className="text-sm cursor-pointer">High (×1.70)</Label>
                    </div>
                  </RadioGroup>
                  <p className="text-xs text-muted-foreground">
                    High: Medical, Legal, Financial, Government
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Output */}
        <div className="space-y-4">
          {/* Tier Selection */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Tier Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {TIER_ORDER.map((tier) => {
                  const config = PRICING_CONFIG.tiers[tier];
                  const isSelected = calculations.selectedTier === tier;
                  const isRecommended = calculations.recommendedTier === tier && !manualTier;
                  
                  return (
                    <div
                      key={tier}
                      onClick={() => setManualTier(tier === manualTier ? null : tier)}
                      className={`p-2 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border/30 bg-black/20 hover:border-border/50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        {TIER_LABELS[tier].icon}
                        <span className="font-medium text-xs">{TIER_LABELS[tier].name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ${config.anchor_min_usd}–${config.anchor_max_usd === 9999999 ? '∞' : config.anchor_max_usd.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {config.included_queries === -1 ? '∞' : config.included_queries.toLocaleString()} Q, {config.included_ports === -1 ? '∞' : config.included_ports} P
                      </p>
                      {isRecommended && (
                        <Badge className="mt-1 bg-primary/20 text-primary text-[10px] px-1.5 py-0">
                          Recommended
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {calculations.suggestUpgrade && (
                <div className="mt-3 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-xs text-amber-400 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Overage exceeds 40% of anchor — consider upgrading tier
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Allocation & Overages */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Senate Queries Allocation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Queries */}
              <div className="p-3 rounded-lg border border-border/20 bg-black/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Senate Queries</span>
                  <Badge variant="outline" className="font-mono text-xs">$0.080/query overage</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
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

              {/* Verification Add-on */}
              {verificationEnabled && (
                <div className="p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-cyan-400">Verification Add-on</span>
                    <Badge variant="outline" className="font-mono text-xs border-cyan-500/30">per check</Badge>
                  </div>
                  <div className="space-y-1 text-sm">
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
                    <div className="flex justify-between border-t border-cyan-500/20 pt-1 mt-1">
                      <span className="text-muted-foreground font-medium">Total Verification:</span>
                      <span className="text-cyan-400 font-medium">{formatCurrency(calculations.totalVerificationCost)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Ports */}
              <div className="p-3 rounded-lg border border-border/20 bg-black/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Ports</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    ${calculations.tierConfig.port_overage_usd}/extra port
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
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

          {/* Monthly Price */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Monthly Price (Anchor)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(calculations.totalMonthly)}
                  <span className="text-lg font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Range: {formatCurrency(calculations.rangeLow)} – {formatCurrency(calculations.rangeHigh)} (±20%)
                </p>
              </div>

              {/* Breakdown */}
              <div className="p-3 rounded-lg bg-black/20 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tier anchor ({TIER_LABELS[calculations.selectedTier].name}):</span>
                  <span>{formatCurrency(calculations.tierConfig.anchor_mid_usd)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Query overage:</span>
                  <span>+{formatCurrency(calculations.queryOverage)}</span>
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
                <div className="flex justify-between border-t border-border/20 pt-2">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(calculations.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk multiplier:</span>
                  <span className={riskLevel !== 'low' ? 'text-amber-400' : ''}>
                    ×{calculations.riskMultiplier.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/20 pt-2 font-medium">
                  <span>Total Monthly:</span>
                  <span className="text-primary">{formatCurrency(calculations.totalMonthly)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Competitor Parity */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Competitor Parity Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-black/20 space-y-2 text-sm">
                <p className="text-xs text-muted-foreground font-medium mb-2">Salesforce Agentforce baseline</p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actions @ $0.10 each (Flex):</span>
                  <span className="text-red-400">~{formatCurrency(calculations.agentforceBaseline)}/mo</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Grillo AI @ $0.080 overage + anchor:</span>
                  <span className="text-green-400 font-bold">{formatCurrency(calculations.totalMonthly)}/mo</span>
                </div>
                {calculations.savingsPercent > 0 && (
                  <p className="text-xs text-green-400 mt-1">
                    <Check className="h-3 w-3 inline mr-1" />
                    ~{calculations.savingsPercent}% savings (governance + audit included)
                  </p>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground italic">
                You buy governance architecture, not vendor lock-in. Best model earns a seat.
              </p>
            </CardContent>
          </Card>

          {/* Architecture Notes */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Architecture Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  <span>Full 7-Seat Senate (model-agnostic seats; best model earns a seat)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  <span>Governance + audit — immutable trails, human approvals, drift/hallucination checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  <span>SYNTH reduces conversational noise by ~75% and captures key decision points</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Client-Facing Explainer */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-cyan-500/5 border border-primary/20">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Why this makes sense:</strong> You tell us how many people use AI, how often it needs governance, optional verification checks, and connected systems. You see a clear monthly anchor with simple, transparent overages. No "credits." Every plan includes the 7-Seat Senate plus audit trails and Reasonable Care controls.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => setProposalOpen(true)}
            >
              <Check className="h-4 w-4 mr-2" />
              Generate Proposal
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setOrderFormOpen(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Create Order Form
            </Button>
          </div>
        </div>
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
