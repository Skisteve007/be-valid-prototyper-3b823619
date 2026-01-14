import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Calculator, 
  Users, 
  MessageSquare, 
  QrCode, 
  Shield, 
  Download,
  TrendingUp,
  Check,
  AlertTriangle,
  Zap,
  Building2,
  Crown,
  Plug
} from "lucide-react";

// Types
type TierKey = "solo" | "starter" | "professional" | "business" | "enterprise" | "sector_sovereign";
type RiskLevel = "low" | "medium" | "high";
type VerificationType = "basic" | "standard" | "deep";

interface TierConfig {
  anchor_min_usd: number;
  anchor_mid_usd: number;
  anchor_max_usd: number;
  included_queries: number;
  included_scans: number;
  included_ports: number;
  query_overage_usd: number;
  scan_base_usd: number;
  port_overage_usd: number;
}

// Configuration from JSON spec
const PRICING_CONFIG = {
  version: "1.1",
  defaults: {
    working_days_per_month: 22,
    risk_multiplier: { low: 1.0, medium: 1.1, high: 1.25 },
    negotiation_range_percent: 0.20
  },
  tiers: {
    solo: {
      anchor_min_usd: 79, anchor_mid_usd: 99, anchor_max_usd: 149,
      included_queries: 1000, included_scans: 100, included_ports: 2,
      query_overage_usd: 0.08, scan_base_usd: 0.75, port_overage_usd: 99
    },
    starter: {
      anchor_min_usd: 149, anchor_mid_usd: 199, anchor_max_usd: 399,
      included_queries: 5000, included_scans: 500, included_ports: 3,
      query_overage_usd: 0.08, scan_base_usd: 0.65, port_overage_usd: 99
    },
    professional: {
      anchor_min_usd: 399, anchor_mid_usd: 699, anchor_max_usd: 999,
      included_queries: 25000, included_scans: 3000, included_ports: 5,
      query_overage_usd: 0.08, scan_base_usd: 0.55, port_overage_usd: 199
    },
    business: {
      anchor_min_usd: 999, anchor_mid_usd: 1799, anchor_max_usd: 2499,
      included_queries: 100000, included_scans: 15000, included_ports: 8,
      query_overage_usd: 0.08, scan_base_usd: 0.45, port_overage_usd: 299
    },
    enterprise: {
      anchor_min_usd: 2500, anchor_mid_usd: 7500, anchor_max_usd: 10000,
      included_queries: 500000, included_scans: 100000, included_ports: 12,
      query_overage_usd: 0.08, scan_base_usd: 0.35, port_overage_usd: 499
    },
    sector_sovereign: {
      anchor_min_usd: 10000, anchor_mid_usd: 25000, anchor_max_usd: 9999999,
      included_queries: -1, included_scans: -1, included_ports: -1,
      query_overage_usd: 0.08, scan_base_usd: 0.25, port_overage_usd: 999
    }
  } as Record<TierKey, TierConfig>,
  verification_multiplier: { basic: 1.0, standard: 2.0, deep: 3.0 },
  competitor_parity: {
    agentforce_action_usd: 0.10,
    conversation_heuristic_divisor: 10,
    conversation_rate_usd: 2.0
  }
};

const TIER_ORDER: TierKey[] = ["solo", "starter", "professional", "business", "enterprise", "sector_sovereign"];

const TIER_LABELS: Record<TierKey, { name: string; icon: React.ReactNode }> = {
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
  const [scansBasic, setScansBasic] = useState(100);
  const [scansStandard, setScansStandard] = useState(0);
  const [scansDeep, setScansDeep] = useState(0);
  const [highLiability, setHighLiability] = useState(false);
  const [portsConnected, setPortsConnected] = useState(2);
  const [manualTier, setManualTier] = useState<TierKey | null>(null);

  // Derived calculations
  const calculations = useMemo(() => {
    const { defaults, tiers, verification_multiplier, competitor_parity } = PRICING_CONFIG;
    
    // Monthly Senate Queries
    const msq = usersGoverned * queriesPerDay * defaults.working_days_per_month;
    
    // Total scans
    const totalScans = scansBasic + scansStandard + scansDeep;
    
    // Risk multiplier
    const riskLevel: RiskLevel = highLiability ? "high" : "low";
    const riskMultiplier = defaults.risk_multiplier[riskLevel];
    
    // Auto-recommend tier (lowest that covers MSQ and scans)
    let recommendedTier: TierKey = "solo";
    for (const tier of TIER_ORDER) {
      const config = tiers[tier];
      const queriesCovered = config.included_queries === -1 || msq <= config.included_queries;
      const scansCovered = config.included_scans === -1 || totalScans <= config.included_scans;
      if (queriesCovered && scansCovered) {
        recommendedTier = tier;
        break;
      }
      recommendedTier = tier; // If nothing covers, use highest
    }
    
    // Use manual tier if set, otherwise recommended
    const selectedTier = manualTier || recommendedTier;
    const tierConfig = tiers[selectedTier];
    
    // Calculate overages
    const queryOverageCount = tierConfig.included_queries === -1 
      ? 0 
      : Math.max(msq - tierConfig.included_queries, 0);
    const queryOverage = queryOverageCount * tierConfig.query_overage_usd;
    
    // Scan overages by type
    const totalIncludedScans = tierConfig.included_scans === -1 ? Infinity : tierConfig.included_scans;
    const totalScanOverage = Math.max(totalScans - totalIncludedScans, 0);
    
    // Weighted scan overage (proportional to scan types)
    let scanOverage = 0;
    if (totalScanOverage > 0 && totalScans > 0) {
      const basicRatio = scansBasic / totalScans;
      const standardRatio = scansStandard / totalScans;
      const deepRatio = scansDeep / totalScans;
      
      const basicOverage = totalScanOverage * basicRatio * tierConfig.scan_base_usd * verification_multiplier.basic;
      const standardOverage = totalScanOverage * standardRatio * tierConfig.scan_base_usd * verification_multiplier.standard;
      const deepOverage = totalScanOverage * deepRatio * tierConfig.scan_base_usd * verification_multiplier.deep;
      
      scanOverage = basicOverage + standardOverage + deepOverage;
    }
    
    // Port overages
    const portOverageCount = tierConfig.included_ports === -1 
      ? 0 
      : Math.max(portsConnected - tierConfig.included_ports, 0);
    const portOverage = portOverageCount * tierConfig.port_overage_usd;
    
    // Subtotal and total
    const subtotal = tierConfig.anchor_mid_usd + queryOverage + scanOverage + portOverage;
    const totalMonthly = subtotal * riskMultiplier;
    
    // Negotiation range
    const rangeLow = Math.round(totalMonthly * (1 - defaults.negotiation_range_percent));
    const rangeHigh = Math.round(totalMonthly * (1 + defaults.negotiation_range_percent));
    
    // Utilization percentages
    const queryUtilization = tierConfig.included_queries === -1 
      ? 0 
      : Math.round((msq / tierConfig.included_queries) * 100);
    const scanUtilization = tierConfig.included_scans === -1 
      ? 0 
      : Math.round((totalScans / tierConfig.included_scans) * 100);
    
    // Suggest upgrade if overage > 40% of anchor
    const totalOverage = queryOverage + scanOverage + portOverage;
    const suggestUpgrade = totalOverage > tierConfig.anchor_mid_usd * 0.4 && selectedTier !== "sector_sovereign";
    
    // Competitor parity (Agentforce)
    const agentforceActions = msq * competitor_parity.agentforce_action_usd;
    const agentforceConvos = Math.ceil(msq / competitor_parity.conversation_heuristic_divisor) * competitor_parity.conversation_rate_usd;
    const agentforceTotal = agentforceActions + agentforceConvos;
    const savingsPercent = agentforceTotal > 0 
      ? Math.round((1 - (totalMonthly / agentforceTotal)) * 100) 
      : 0;
    
    return {
      msq,
      totalScans,
      riskLevel,
      riskMultiplier,
      recommendedTier,
      selectedTier,
      tierConfig,
      queryOverageCount,
      queryOverage,
      scanOverage,
      portOverageCount,
      portOverage,
      subtotal,
      totalMonthly,
      rangeLow,
      rangeHigh,
      queryUtilization,
      scanUtilization,
      suggestUpgrade,
      agentforceActions,
      agentforceConvos,
      agentforceTotal,
      savingsPercent
    };
  }, [usersGoverned, queriesPerDay, scansBasic, scansStandard, scansDeep, highLiability, portsConnected, manualTier]);

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${Math.round(amount).toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          7-Seat Senate Pricing Engine
        </h2>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Plain-English pricing. Every plan includes the full 7-Seat Senate (model-agnostic, interchangeable).
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
              {/* Users Governed */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Users Governed</Label>
                  <Badge variant="outline" className="font-mono">{usersGoverned.toLocaleString()}</Badge>
                </div>
                <Slider
                  value={[usersGoverned]}
                  onValueChange={([v]) => setUsersGoverned(v)}
                  min={1}
                  max={10000}
                  step={1}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1</span>
                  <span>10K</span>
                </div>
              </div>

              {/* Queries per Day */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="text-sm font-medium">Queries per User per Day</Label>
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
                  {usersGoverned} × {queriesPerDay} × 22 work days
                </p>
              </div>
            </CardContent>
          </Card>

          {/* QR Scans */}
          <Card className="bg-card/50 border-border/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <QrCode className="h-5 w-5 text-cyan-400" />
                Monthly QR Scans
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Basic Scans */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">
                    <span className="font-medium">Basic</span>
                    <span className="text-muted-foreground ml-2 text-xs">(Age/Identity) ×1</span>
                  </Label>
                  <Badge variant="outline" className="font-mono bg-green-500/10 text-green-400 border-green-500/30">
                    {scansBasic.toLocaleString()}
                  </Badge>
                </div>
                <Slider
                  value={[scansBasic]}
                  onValueChange={([v]) => setScansBasic(v)}
                  min={0}
                  max={50000}
                  step={100}
                  className="cursor-pointer"
                />
              </div>

              {/* Standard Scans */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">
                    <span className="font-medium">Standard</span>
                    <span className="text-muted-foreground ml-2 text-xs">(ID + Background) ×2</span>
                  </Label>
                  <Badge variant="outline" className="font-mono bg-amber-500/10 text-amber-400 border-amber-500/30">
                    {scansStandard.toLocaleString()}
                  </Badge>
                </div>
                <Slider
                  value={[scansStandard]}
                  onValueChange={([v]) => setScansStandard(v)}
                  min={0}
                  max={50000}
                  step={100}
                  className="cursor-pointer"
                />
              </div>

              {/* Deep Scans */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-sm">
                    <span className="font-medium">Deep</span>
                    <span className="text-muted-foreground ml-2 text-xs">(Terrorist/Most Wanted/Predator) ×3</span>
                  </Label>
                  <Badge variant="outline" className="font-mono bg-red-500/10 text-red-400 border-red-500/30">
                    {scansDeep.toLocaleString()}
                  </Badge>
                </div>
                <Slider
                  value={[scansDeep]}
                  onValueChange={([v]) => setScansDeep(v)}
                  min={0}
                  max={50000}
                  step={100}
                  className="cursor-pointer"
                />
              </div>

              {/* Total Scans */}
              <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Monthly Scans</span>
                  <Badge className="bg-cyan-500/20 text-cyan-400 font-mono">
                    {calculations.totalScans.toLocaleString()}
                  </Badge>
                </div>
              </div>
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

              {/* High Liability Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border/30 bg-black/20">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    High-Liability Industry
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Medical, Legal, Financial, Government (+25%)
                  </p>
                </div>
                <Switch
                  checked={highLiability}
                  onCheckedChange={setHighLiability}
                />
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {TIER_ORDER.map((tier) => {
                  const config = PRICING_CONFIG.tiers[tier];
                  const isSelected = calculations.selectedTier === tier;
                  const isRecommended = calculations.recommendedTier === tier && !manualTier;
                  
                  return (
                    <div
                      key={tier}
                      onClick={() => setManualTier(tier === manualTier ? null : tier)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-border/30 bg-black/20 hover:border-border/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {TIER_LABELS[tier].icon}
                        <span className="font-medium text-sm">{TIER_LABELS[tier].name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        ${config.anchor_min_usd}–${config.anchor_max_usd === 9999999 ? '∞' : config.anchor_max_usd.toLocaleString()}
                      </p>
                      {isRecommended && (
                        <Badge className="mt-2 bg-primary/20 text-primary text-xs">
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
              <CardTitle className="text-lg">Allocation & Overages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Queries */}
              <div className="p-3 rounded-lg border border-border/20 bg-black/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Senate Queries</span>
                  <Badge variant="outline" className="font-mono text-xs">$0.080/query</Badge>
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

              {/* Scans */}
              <div className="p-3 rounded-lg border border-border/20 bg-black/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">QR Scans</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    ${calculations.tierConfig.scan_base_usd}/scan × multiplier
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Included:</span>
                    <span>{calculations.tierConfig.included_scans === -1 ? '∞' : calculations.tierConfig.included_scans.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expected:</span>
                    <span>{calculations.totalScans.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Utilization:</span>
                    <span className={calculations.scanUtilization > 100 ? 'text-amber-400' : ''}>
                      {calculations.scanUtilization}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Overage:</span>
                    <span className="text-primary">+{formatCurrency(calculations.scanOverage)}</span>
                  </div>
                </div>
              </div>

              {/* Ports */}
              <div className="p-3 rounded-lg border border-border/20 bg-black/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Ports</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    ${calculations.tierConfig.port_overage_usd}/port
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
              <CardTitle className="text-lg">Monthly Price</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {formatCurrency(calculations.totalMonthly)}
                  <span className="text-lg font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Range: {formatCurrency(calculations.rangeLow)} – {formatCurrency(calculations.rangeHigh)}
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scan overage:</span>
                  <span>+{formatCurrency(calculations.scanOverage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Port overage:</span>
                  <span>+{formatCurrency(calculations.portOverage)}</span>
                </div>
                <div className="flex justify-between border-t border-border/20 pt-2">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{formatCurrency(calculations.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk multiplier:</span>
                  <span className={highLiability ? 'text-amber-400' : ''}>
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
                <p className="text-xs text-muted-foreground font-medium mb-2">Salesforce Agentforce (typical cost)</p>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Actions @ $0.10 each:</span>
                  <span>~{formatCurrency(calculations.agentforceActions)}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conversations @ $2 (est.):</span>
                  <span>~{formatCurrency(calculations.agentforceConvos)}/mo</span>
                </div>
                <div className="flex justify-between border-t border-border/20 pt-2">
                  <span className="text-muted-foreground">Agentforce Total:</span>
                  <span className="text-red-400">~{formatCurrency(calculations.agentforceTotal)}/mo</span>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Grillo AI Total:</span>
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
                  <span>Full 7-Seat Senate included (model-agnostic, interchangeable seats)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  <span>Governs AI decisions; reduces drift/hallucinations; creates immutable audit trails</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                  <span>SYNTH captures key conversational points, cuts noisy data by ~75%</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="flex-1 bg-primary hover:bg-primary/90">
              <Check className="h-4 w-4 mr-2" />
              Generate Proposal
            </Button>
            <Button variant="outline" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Constitution
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
