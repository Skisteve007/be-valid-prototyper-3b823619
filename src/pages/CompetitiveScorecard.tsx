import { Check, X, Zap, Shield, Users, Building2, ArrowLeft, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const scorecardData = [
  { feature: "Integrated Health/Tox Status (HIPAA)", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: true, eventbrite: false, highlight: true },
  { feature: "Zero-Trust Backend Security & Architecture", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, highlight: true },
  { feature: "Automated Revenue Share ($10 Transaction)", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, highlight: true },
  { feature: "PEER-TO-PEER NETWORK TRUST", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, highlight: true },
  { feature: "Frictionless Staff Workflow & B2B Portal", valid: true, clear: true, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, highlight: true },
  { feature: "Rolling (Continuous) Compliance & Screening", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: true, eventbrite: false, highlight: false },
  { feature: "Managed Transactional Payments (In-App Wallet)", valid: true, clear: false, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, highlight: false },
  { feature: "Digital Identity Verification (Standard)", valid: true, clear: true, idme: true, ticketmaster: true, sterling: true, stdcheck: false, eventbrite: true, highlight: false },
];

const corePoints = [
  "VALID is the only platform that integrates the eight key functions needed to de-risk and monetize high-liability businesses.",
  "Our Zero-Trust architecture legally shifts liability away from partners (venues/employers) and onto the VALID platform.",
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
  const sterlingScore = scorecardData.filter(r => r.sterling).length;
  const stdcheckScore = scorecardData.filter(r => r.stdcheck).length;
  const eventbriteScore = scorecardData.filter(r => r.eventbrite).length;

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
              MARKET_INTELLIGENCE: VALID_COMPETITIVE_SCORECARD_V2
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: 'Orbitron, sans-serif', color: '#2ecc71', textShadow: '0 0 5px rgba(46, 204, 113, 0.7)' }}>
              VALID: Integrated Identity & Payment Ecosystem
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Pitch Deck Summary - Zero-Trust Compliance & Revenue Generation
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

        {/* Competitive Scorecard Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-500" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <Shield className="h-5 w-5" />
              Direct Competitive Scorecard: Why VALID Wins
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              VALID is the only platform integrating the <strong>eight key functions</strong> needed to de-risk and monetize high-liability businesses.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-[10px] font-mono border border-border">
                <thead>
                  <tr className="bg-muted text-foreground">
                    <th className="text-left p-2 font-bold uppercase" style={{ width: '25%' }}>VALID FEATURE</th>
                    <th colSpan={7} className="text-center p-2 font-bold uppercase border-l border-border">COMPETITORS</th>
                  </tr>
                  <tr className="bg-muted text-foreground">
                    <th className="p-1" style={{ width: '25%' }}></th>
                    <th className="text-center p-1 font-extrabold" style={{ width: '10%', color: '#2ecc71' }}>VALID</th>
                    <th className="text-center p-1 font-semibold text-muted-foreground" style={{ width: '9%' }}>CLEAR</th>
                    <th className="text-center p-1 font-semibold text-muted-foreground" style={{ width: '9%' }}>ID.me</th>
                    <th className="text-center p-1 font-semibold text-muted-foreground" style={{ width: '9%' }}>TICKETMASTER</th>
                    <th className="text-center p-1 font-semibold text-muted-foreground" style={{ width: '9%' }}>STERLING</th>
                    <th className="text-center p-1 font-semibold text-muted-foreground" style={{ width: '9%' }}>STDCHECK</th>
                    <th className="text-center p-1 font-semibold text-muted-foreground" style={{ width: '10%' }}>EVENTBRITE</th>
                  </tr>
                </thead>
                <tbody className="bg-card">
                  {scorecardData.map((row, idx) => (
                    <tr key={idx} className="border-b border-border">
                      <td className={`p-2 text-left text-foreground ${row.highlight ? 'font-semibold' : ''}`}>
                        {row.feature}
                      </td>
                      <td className="p-1 text-center">{renderCheckmark(row.valid, true)}</td>
                      <td className="p-1 text-center">{renderCheckmark(row.clear)}</td>
                      <td className="p-1 text-center">{renderCheckmark(row.idme)}</td>
                      <td className="p-1 text-center">{renderCheckmark(row.ticketmaster)}</td>
                      <td className="p-1 text-center">{renderCheckmark(row.sterling)}</td>
                      <td className="p-1 text-center">{renderCheckmark(row.stdcheck)}</td>
                      <td className="p-1 text-center">{renderCheckmark(row.eventbrite)}</td>
                    </tr>
                  ))}
                  {/* Total Score Row */}
                  <tr className="bg-amber-900/50 border-t-2 border-amber-600">
                    <td className="p-2 text-left text-amber-300 font-extrabold" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      TOTAL INTEGRATION SCORE (8 Max)
                    </td>
                    <td className="p-1 text-center text-lg font-extrabold" style={{ color: '#f39c12' }}>{validScore}/8</td>
                    <td className="p-1 text-center text-lg text-muted-foreground font-extrabold">{clearScore}/8</td>
                    <td className="p-1 text-center text-lg text-muted-foreground font-extrabold">{idmeScore}/8</td>
                    <td className="p-1 text-center text-lg text-muted-foreground font-extrabold">{ticketmasterScore}/8</td>
                    <td className="p-1 text-center text-lg text-muted-foreground font-extrabold">{sterlingScore}/8</td>
                    <td className="p-1 text-center text-lg text-muted-foreground font-extrabold">{stdcheckScore}/8</td>
                    <td className="p-1 text-center text-lg text-muted-foreground font-extrabold">{eventbriteScore}/8</td>
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
              🔑 Key Differentiation: Zero-Trust Security
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

        {/* The Ask Section */}
        <Card className="bg-card/70 border-l-4" style={{ borderColor: '#2ecc71' }}>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Our Ask: $750,000 Seed Round
            </h3>
            <p className="text-muted-foreground text-sm">
              Funding is dedicated to <strong>accelerating DevSecOps implementation</strong> and securing the <strong>Lab Network Acquisition</strong> to capture a dominant market share.
            </p>
            <a 
              href="mailto:invest@bevalid.app" 
              className="mt-4 inline-block font-bold hover:text-foreground transition-colors"
              style={{ fontFamily: 'Orbitron, sans-serif', color: '#f39c12' }}
            >
              Contact Investor Relations: invest@bevalid.app
            </a>
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
                Sterling (Background Screening)
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                STDCheck (Health Testing)
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                Eventbrite (Event Ticketing)
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
