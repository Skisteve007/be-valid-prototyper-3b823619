import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, CheckCircle, TrendingDown, Users, Building2, Scale, Zap, Lock, Eye, Layers, BadgeCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BADGE_CONFIG, getBadgeDisplayName } from "@/config/badgeConfig";

// Tier configuration data
const TIERS = [
  { id: "solo", name: "Solo", userRange: "1–5", platformFee: 99, perUser: 35, queriesPerUser: 200, ghostPassPerUser: 50, portsCap: 2 },
  { id: "starter", name: "Starter", userRange: "6–10", platformFee: 499, perUser: 95, queriesPerUser: 500, ghostPassPerUser: 100, portsCap: 3 },
  { id: "professional", name: "Professional", userRange: "11–25", platformFee: 999, perUser: 85, queriesPerUser: 1000, ghostPassPerUser: 200, portsCap: 5 },
  { id: "business", name: "Business", userRange: "26–100", platformFee: 2499, perUser: 70, queriesPerUser: 1000, ghostPassPerUser: 300, portsCap: 8 },
  { id: "enterprise", name: "Enterprise", userRange: "101–500", platformFee: 6999, perUser: 55, queriesPerUser: 1000, ghostPassPerUser: 500, portsCap: 12 },
  { id: "sovereign", name: "Sector Sovereign", userRange: "501+", platformFee: 19999, perUser: 45, queriesPerUser: -1, ghostPassPerUser: -1, portsCap: -1 },
];

// Savings comparison data
const SAVINGS_SCENARIOS = [
  { scenario: "Law office", users: 3, giantCost: 204, agentforceCost: 870, savings: 76 },
  { scenario: "Small firm", users: 10, giantCost: 1449, agentforceCost: 2900, savings: 50 },
  { scenario: "Growing firm", users: 25, giantCost: 3124, agentforceCost: 7250, savings: 57 },
  { scenario: "Mid-market", users: 100, giantCost: 9499, agentforceCost: 29000, savings: 67 },
  { scenario: "Enterprise", users: 2000, giantCost: 116999, agentforceCost: 580000, savings: 80 },
];

// Competitor pricing data
const COMPETITORS = [
  { name: "Microsoft Dynamics 365", pricing: "$65–$105/user", notes: "CRM license; governance add-on required for policy-to-code and audit." },
  { name: "HubSpot Sales Hub", pricing: "$9–$15/user", notes: "Free tier exists; governance needed for AI outputs." },
  { name: "Zoho CRM", pricing: "Free–$52/user", notes: "Affordable SMB CRM; governance layer complements AI usage." },
  { name: "Pipedrive", pricing: "$14–$24/user", notes: "Pipeline-focused CRM; add governance for AI actions." },
  { name: "Freshsales", pricing: "$9–$59/user", notes: "AI features present; governance/audit still required." },
  { name: "Zendesk Sell", pricing: "$19–$219/user", notes: "Sales automation; governance layer prevents risky AI outputs." },
  { name: "SugarCRM", pricing: "$19–$135/user", notes: "Minimums apply; no free plan; governance complements stack." },
  { name: "Creatio", pricing: "$25–$85/user", notes: "No-code automation; governance ensures defensible AI use." },
];

const CostComparison = () => {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Giant Ventures LLC",
    "url": "https://bevalid.app",
    "description": "AI governance and Reasonable Care controls for enterprise CRM stacks"
  };

  const jsonLdBadge = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": getBadgeDisplayName(),
    "provider": {
      "@type": "Organization",
      "name": BADGE_CONFIG.issuer,
      "url": "https://bevalid.app"
    },
    "description": "Public badge indicating adherence to Reasonable Care AI governance controls, including policy-to-code guardrails, human approvals, immutable audit, and zero-trust data handling.",
    "url": `https://bevalid.app${BADGE_CONFIG.guidelines_url}`
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <>
      <Helmet>
        <title>Cost Comparison: Giant Ventures vs CRM AI Stacks | Save 40–60% vs Agentforce</title>
        <meta name="description" content="Compare Giant Ventures LLC AI governance pricing to Salesforce Agentforce, Dynamics, HubSpot, and more. Save 40–60% while adding 7-Seat Senate controls, immutable audits, and zero-trust data handling." />
        <meta name="keywords" content="AI governance pricing, Salesforce Agentforce alternative, CRM AI governance, enterprise AI controls, Reasonable Care, Giant Ventures LLC" />
        <link rel="canonical" href="https://bevalid.app/cost-comparison" />
        <meta property="og:title" content="Cost Comparison: Giant Ventures vs CRM AI Stacks" />
        <meta property="og:description" content="Save 40–60% vs Agentforce license baselines while adding executive-grade AI governance controls." />
        <meta property="og:url" content="https://bevalid.app/cost-comparison" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(jsonLdOrg)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdBadge)}</script>
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,255,255,0.08)_0%,_transparent_60%)]" />
          
          <div className="container mx-auto px-4 relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>

            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-6 border-cyan-500/50 text-cyan-400 px-4 py-1.5">
                <TrendingDown className="h-3.5 w-3.5 mr-2" />
                40–60% SAVINGS VS AGENTFORCE
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Govern AI Everywhere — Save{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  40–60%
                </span>{" "}
                vs Agentforce License Baselines
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                We run alongside your CRM to proofread, filter, and audit AI outputs with Reasonable Care controls. 
                No vendor lock-in. No surprises.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8">
                  <a href="https://calendly.com/steve-bevalid/30min" target="_blank" rel="noopener noreferrer">
                    Get a Demo
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                  <Link to="/admin/sales-command">
                    See Your Savings
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Side-by-Side Savings Table */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Head-to-Head Savings
                </h2>
                <p className="text-muted-foreground">
                  Real cost comparisons for typical teams
                </p>
              </div>

              <Card className="border-border/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-bold text-foreground">Scenario</TableHead>
                        <TableHead className="text-center font-bold text-foreground">Users</TableHead>
                        <TableHead className="text-right font-bold text-red-400">Agentforce (Baseline)</TableHead>
                        <TableHead className="text-right font-bold text-cyan-400">Giant Ventures</TableHead>
                        <TableHead className="text-center font-bold text-green-400">Savings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {SAVINGS_SCENARIOS.map((row, idx) => (
                        <TableRow key={idx} className="hover:bg-muted/30">
                          <TableCell className="font-medium text-foreground">{row.scenario}</TableCell>
                          <TableCell className="text-center text-muted-foreground">{row.users.toLocaleString()}</TableCell>
                          <TableCell className="text-right text-red-400/80">{formatCurrency(row.agentforceCost)}/mo</TableCell>
                          <TableCell className="text-right text-cyan-400 font-semibold">{formatCurrency(row.giantCost)}/mo</TableCell>
                          <TableCell className="text-center">
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              ~{row.savings}%
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="p-4 bg-muted/30 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> Agentforce baseline = Salesforce Enterprise (~$165/user) + Agentforce add-on (~$125/user) = $290/user/mo. 
                    Excludes implementation, training, and consumption fees.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Why We're Better */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Why We're Better
                </h2>
                <p className="text-muted-foreground">
                  Value beyond cost savings
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader className="pb-3">
                    <Scale className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">7-Seat Senate Governance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Full multi-model deliberation with policy-to-code guardrails, human approvals, and executive review.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent">
                  <CardHeader className="pb-3">
                    <Lock className="h-8 w-8 text-cyan-400 mb-2" />
                    <CardTitle className="text-lg">Zero-Trust Data Handling</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Immutable audits, ephemeral data flushing, and cryptographic proof records for every decision.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
                  <CardHeader className="pb-3">
                    <Layers className="h-8 w-8 text-purple-400 mb-2" />
                    <CardTitle className="text-lg">Model-Agnostic</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Best models earn a seat. Swap providers without rebuilding governance. No vendor lock-in.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
                  <CardHeader className="pb-3">
                    <CheckCircle className="h-8 w-8 text-green-400 mb-2" />
                    <CardTitle className="text-lg">Reasonable Care Controls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Legally defensible AI outputs. Drift detection, contradiction checks, and automatic escalation.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
                  <CardHeader className="pb-3">
                    <Zap className="h-8 w-8 text-orange-400 mb-2" />
                    <CardTitle className="text-lg">Ghost Ecosystem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Privacy-safe QR passes for events, universities, hospitals, and stadiums. Built for high volume.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
                  <CardHeader className="pb-3">
                    <Eye className="h-8 w-8 text-blue-400 mb-2" />
                    <CardTitle className="text-lg">Transparent Overages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Owner-profitable floors and clear overage rates. No surprise bills. Predictable scaling.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Clarity */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Transparent Per-User Pricing
                </h2>
                <p className="text-muted-foreground">
                  Platform fee + per-user rate. Simple math. Tight spreads.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {TIERS.map((tier) => (
                  <Card key={tier.id} className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{tier.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">{tier.userRange} users</Badge>
                      </div>
                      <CardDescription className="text-lg font-semibold text-foreground">
                        ${tier.platformFee.toLocaleString()} + ${tier.perUser}/user/mo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Queries/user:</span>
                        <span className="text-foreground">{tier.queriesPerUser === -1 ? "Custom" : tier.queriesPerUser.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ghost Pass/user:</span>
                        <span className="text-foreground">{tier.ghostPassPerUser === -1 ? "Custom" : tier.ghostPassPerUser}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ports cap:</span>
                        <span className="text-foreground">{tier.portsCap === -1 ? "Custom" : tier.portsCap}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Overages */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Simple Overages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-3 gap-6 text-sm">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Queries</h4>
                      <p className="text-muted-foreground">$0.08/query (flat rate)</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Ghost Pass Scans</h4>
                      <p className="text-muted-foreground">Tier-based: $0.75→$0.10/scan</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Verification (Optional)</h4>
                      <p className="text-muted-foreground">Basic $1.80 • Standard $2.60 • Deep $3.60</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-foreground">Risk Multipliers:</strong> Low ×1.00 • Medium ×1.30 • High ×1.70 — 
                      applied only to variable usage (overages + verification), not to base fees.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Competitor Context */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Keep Your CRM. Add Governance.
                </h2>
                <p className="text-muted-foreground">
                  We run alongside any CRM stack as a non-biased governance layer
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {COMPETITORS.map((comp, idx) => (
                  <Card key={idx} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-semibold text-foreground">{comp.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{comp.notes}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {comp.pricing}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-8 border-primary/30 bg-gradient-to-r from-primary/5 to-cyan-500/5">
                <CardContent className="p-6 text-center">
                  <p className="text-lg text-foreground">
                    <strong>Our value proposition:</strong> Add governance, audit trails, and human approvals to any CRM — 
                    at 40–60% less than Agentforce license baselines.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Badge Trust */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 flex items-center justify-center border border-primary/30">
                <BadgeCheck className="h-10 w-10 text-primary" />
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                AI Governance Badge — Included
              </h2>
              
              <p className="text-lg text-muted-foreground mb-6">
                Every tier includes the right to display the AI Governance Badge, 
                signifying adherence to Reasonable Care controls and executive-grade audit trails.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                  <Link to="/governance-constitution">
                    View Badge Guidelines
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                  <Link to="/admin/sales-command">
                    Calculate Your Price
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Save 40–60% While Governing AI?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Schedule a demo to see how Giant Ventures LLC fits alongside your CRM stack.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold px-8 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                  <a href="https://calendly.com/steve-bevalid/30min" target="_blank" rel="noopener noreferrer">
                    Get a Demo
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/admin/sales-command">
                    See Pricing With Your Usage
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CostComparison;
