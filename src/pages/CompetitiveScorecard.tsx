import { Check, X, Zap, Shield, Users, Building2, ArrowLeft, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const scorecardData = [
  {
    feature: "Automated Revenue Share (Portion of $10 Transaction)",
    valid: true,
    clear: false,
    idme: false,
    ticketmaster: false,
    checkr: false,
    highlight: true,
  },
  {
    feature: "Zero-Trust Backend Security & Architecture",
    valid: true,
    clear: false,
    idme: false,
    ticketmaster: false,
    checkr: false,
    highlight: true,
  },
  {
    feature: "Frictionless Staff Workflow & QR Access",
    valid: true,
    clear: true,
    idme: false,
    ticketmaster: true,
    checkr: false,
    highlight: true,
  },
  {
    feature: "Integrated Health/Tox Status (HIPAA-Ready)",
    valid: true,
    clear: false,
    idme: false,
    ticketmaster: false,
    checkr: false,
    highlight: false,
  },
  {
    feature: "Rolling (Continuous) Compliance & Screening",
    valid: true,
    clear: false,
    idme: false,
    ticketmaster: false,
    checkr: true,
    highlight: false,
  },
];

const corePoints = [
  "VALID is the only platform that integrates the five key functions needed to de-risk and monetize high-liability businesses.",
  "Our Zero-Trust Architecture legally shifts liability away from partners (venues/employers) and onto the VALID platform.",
  "High-margin dual revenue via user subscriptions + instant $10 transactional fees (Incognito Token).",
];

const renderCheckmark = (value: boolean, isValid?: boolean) => {
  if (value) {
    return <Check className={`h-5 w-5 mx-auto ${isValid ? 'text-[#2ecc71]' : 'text-green-500'}`} />;
  }
  return <X className="h-5 w-5 text-red-500 mx-auto" />;
};

export default function CompetitiveScorecard() {
  const navigate = useNavigate();

  // Calculate scores
  const validScore = scorecardData.filter(r => r.valid).length;
  const clearScore = scorecardData.filter(r => r.clear).length;
  const idmeScore = scorecardData.filter(r => r.idme).length;
  const ticketmasterScore = scorecardData.filter(r => r.ticketmaster).length;
  const checkrScore = scorecardData.filter(r => r.checkr).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <ThemeToggle />
          </div>
          <div className="text-center">
            <Badge variant="outline" className="mb-4 text-xs font-mono">
              MARKET_INTELLIGENCE: VALID_COMPETITIVE_SCORECARD_V1
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              VALID: The Future-Proof Standard
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Zero-Trust Compliance & Revenue Generation
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Investment Thesis Section */}
        <Card className="border-l-4 border-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-500" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <Zap className="h-5 w-5" />
              Investment Thesis: Unmatched Risk Transfer & Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-foreground space-y-3 text-sm list-disc list-inside">
              <li><strong>INDUSTRY-LEADING RISK TRANSFER:</strong> Our Zero-Trust architecture legally shifts liability away from partners (venues/employers) and onto the VALID platform.</li>
              <li><strong>HIGH-MARGIN DUAL REVENUE:</strong> Monetization via user subscriptions + instant <strong>$10 transactional fees</strong> (Incognito Token).</li>
              <li><strong>DATA MOAT:</strong> We build the core Identity/Health/Payment layer for high-liability social and asset management economies.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Visual Concept Section */}
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Visual Pitch Concept
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg bg-destructive/10 border border-destructive/30">
                <h3 className="font-semibold text-destructive mb-3">FRAGMENTED SOLUTIONS</h3>
                <p className="text-sm text-muted-foreground">
                  Static and siloed security models, FCRA compliance only, no revenue sharing
                </p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-destructive border-destructive/50">Static Security</Badge>
                  <Badge variant="outline" className="text-destructive border-destructive/50">Siloed Systems</Badge>
                  <Badge variant="outline" className="text-destructive border-destructive/50">No Revenue Share</Badge>
                </div>
              </div>
              <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/30">
                <h3 className="font-semibold mb-3" style={{ color: '#2ecc71' }}>VALID</h3>
                <p className="text-sm text-muted-foreground">
                  Zero-Trust Architecture with continuous verification and integrated revenue sharing
                </p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50">Zero-Trust</Badge>
                  <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50">Revenue Share</Badge>
                  <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50">HIPAA-Ready</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitive Scorecard Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-500" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <Shield className="h-5 w-5" />
              Direct Competitive Scorecard: Why VALID Wins
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              We eliminate silos. VALID is the only platform that integrates the five key functions needed to de-risk and <strong>monetize</strong> high-liability businesses.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border border-border">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-1" style={{ width: '35%' }}></th>
                    <th className="p-1" style={{ width: '13%' }}></th>
                    <th colSpan={4} className="text-center p-2 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                      Competitors
                    </th>
                  </tr>
                  <tr className="bg-muted text-foreground">
                    <th className="text-left p-2 font-bold uppercase" style={{ width: '35%' }}>VALID FEATURE</th>
                    <th className="text-center p-2 font-extrabold" style={{ width: '13%', color: '#2ecc71' }}>VALID</th>
                    <th className="text-center p-2 font-semibold text-muted-foreground" style={{ width: '13%' }}>CLEAR</th>
                    <th className="text-center p-2 font-semibold text-muted-foreground" style={{ width: '13%' }}>ID.me</th>
                    <th className="text-center p-2 font-semibold text-muted-foreground" style={{ width: '13%' }}>TICKETMASTER</th>
                    <th className="text-center p-2 font-semibold text-muted-foreground" style={{ width: '13%' }}>CHECKR</th>
                  </tr>
                </thead>
                <tbody className="bg-card">
                  {scorecardData.map((row, idx) => (
                    <tr key={idx} className="border-b border-border">
                      <td className={`p-2 text-left text-foreground ${row.highlight ? 'font-semibold' : ''}`}>
                        {row.feature}
                      </td>
                      <td className="p-2 text-center">{renderCheckmark(row.valid, true)}</td>
                      <td className="p-2 text-center">{renderCheckmark(row.clear)}</td>
                      <td className="p-2 text-center">{renderCheckmark(row.idme)}</td>
                      <td className="p-2 text-center">{renderCheckmark(row.ticketmaster)}</td>
                      <td className="p-2 text-center">{renderCheckmark(row.checkr)}</td>
                    </tr>
                  ))}
                  {/* Total Score Row */}
                  <tr className="bg-amber-900/50 border-t-2 border-amber-600">
                    <td className="p-2 text-left text-amber-300 font-extrabold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      TOTAL INTEGRATION SCORE (5 Max)
                    </td>
                    <td className="p-2 text-center text-lg font-extrabold" style={{ color: '#f39c12' }}>{validScore}/5</td>
                    <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">{clearScore}/5</td>
                    <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">{idmeScore}/5</td>
                    <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">{ticketmasterScore}/5</td>
                    <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">{checkrScore}/5</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Zero-Trust Key Differentiation */}
        <Card className="border-l-4" style={{ borderColor: '#2ecc71' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-500" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <Key className="h-5 w-5" />
              Key Differentiation: Zero-Trust Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Competitor security models (FCRA compliance, SSO identity) are <strong className="text-foreground">static and siloed</strong>. VALID's <strong className="text-foreground">Zero-Trust Architecture</strong> requires continuous verification and integrates dynamic, real-time health/tox data, making it the only truly risk-based access system. This level of comprehensive, dynamic security is unmatched and crucial for high-liability venues.
            </p>
          </CardContent>
        </Card>

        {/* Core Differentiator Summary */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Core Differentiator Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {corePoints.map((point, idx) => (
                <li key={idx} className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {idx + 1}
                  </div>
                  <p className="text-foreground">{point}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Competitors Targeted */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Competitors Targeted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="text-sm py-1 px-3">
                CLEAR (Fast Access)
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                ID.me (Identity Verification)
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                Ticketmaster (Event Access)
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                Checkr (Background Screening)
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}