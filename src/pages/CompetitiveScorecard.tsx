import { Check, X, Zap, Shield, Users, Building2, ArrowLeft, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const scorecardData = [
  { feature: "Integrated Health/Tox Status (HIPAA)", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: true, eventbrite: false, salesforce: false, dice: false, checkr: false, highlight: true },
  { feature: "Zero-Trust Backend Security & Architecture", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, salesforce: false, dice: false, checkr: false, highlight: true },
  { feature: "Automated Revenue Share ($10 Transaction)", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, salesforce: false, dice: false, checkr: false, highlight: true },
  { feature: "PEER-TO-PEER NETWORK TRUST", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, salesforce: false, dice: false, checkr: false, highlight: true },
  { feature: "Frictionless Staff Workflow & B2B Portal", valid: true, clear: true, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, salesforce: true, dice: true, checkr: false, highlight: true },
  { feature: "Rolling (Continuous) Compliance & Screening", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: true, eventbrite: false, salesforce: false, dice: false, checkr: true, highlight: false },
  { feature: "Managed Transactional Payments (In-App Wallet)", valid: true, clear: false, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, salesforce: false, dice: true, checkr: false, highlight: false },
  { feature: "Digital Identity Verification (Standard)", valid: true, clear: true, idme: true, ticketmaster: true, sterling: true, stdcheck: false, eventbrite: true, salesforce: false, dice: true, checkr: true, highlight: false },
  { feature: "V-CRM: Identity-Linked Revenue & FBO Settlement", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, salesforce: false, dice: false, checkr: false, highlight: true },
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
  const salesforceScore = scorecardData.filter(r => r.salesforce).length;
  const diceScore = scorecardData.filter(r => r.dice).length;
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
            <Badge variant="outline" className="mb-4 text-sm font-mono px-4 py-2">
              MARKET_INTELLIGENCE: VALID_COMPETITIVE_SCORECARD_V2
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4" style={{ fontFamily: 'Orbitron, sans-serif', color: '#2ecc71', textShadow: '0 0 5px rgba(46, 204, 113, 0.7)' }}>
              VALID: Integrated Identity & Payment Ecosystem
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg md:text-xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Pitch Deck Summary - Zero-Trust Compliance & Revenue Generation
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Investment Thesis Section */}
        <Card className="border-l-4 border-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-500 text-xl md:text-2xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <Zap className="h-6 w-6" />
              Investment Thesis: Unmatched Risk Transfer & Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-foreground space-y-4 text-base md:text-lg list-disc list-inside">
              <li><strong>INDUSTRY-LEADING RISK TRANSFER:</strong> Our Zero-Trust architecture legally shifts liability away from partners (venues/employers) and onto the VALID platform.</li>
              <li><strong>HIGH-MARGIN DUAL REVENUE:</strong> Monetization via user subscriptions + instant <strong>$10 transactional fees</strong> (Incognito Token).</li>
              <li><strong>DATA MOAT:</strong> We build the core Identity/Health/Payment layer for high-liability social and asset management economies.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Competitive Scorecard Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-500 text-xl md:text-2xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <Shield className="h-6 w-6" />
              Direct Competitive Scorecard: Why VALID Wins
            </CardTitle>
            <p className="text-base md:text-lg text-muted-foreground">
              VALID is the only platform integrating the <strong>nine key functions</strong> needed to de-risk and monetize high-liability businesses.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-mono border border-border">
                <thead>
                  <tr className="bg-muted text-foreground">
                    <th className="text-left p-3 font-bold uppercase text-base" style={{ width: '20%' }}>VALID FEATURE</th>
                    <th colSpan={10} className="text-center p-3 font-bold uppercase border-l border-border text-base">COMPETITORS</th>
                  </tr>
                  <tr className="bg-muted text-foreground">
                    <th className="p-2" style={{ width: '20%' }}></th>
                    <th className="text-center p-2 font-extrabold text-sm" style={{ color: '#2ecc71' }}>VALID</th>
                    <th className="text-center p-2 font-semibold text-muted-foreground text-xs">CLEAR</th>
                    <th className="text-center p-2 font-semibold text-muted-foreground text-xs">ID.me</th>
                    <th className="text-center p-2 font-semibold text-muted-foreground text-xs">TICKETMASTER</th>
                    <th className="text-center p-2 font-semibold text-muted-foreground text-xs">STERLING</th>
                    <th className="text-center p-2 font-semibold text-muted-foreground text-xs">STDCHECK</th>
                    <th className="text-center p-2 font-semibold text-muted-foreground text-xs">EVENTBRITE</th>
                    <th className="text-center p-2 font-semibold text-purple-400 text-xs">SALESFORCE</th>
                    <th className="text-center p-2 font-semibold text-orange-400 text-xs">DICE</th>
                    <th className="text-center p-2 font-semibold text-blue-400 text-xs">CHECKR</th>
                  </tr>
                </thead>
                <tbody className="bg-card">
                  {scorecardData.map((row, idx) => (
                    <tr key={idx} className="border-b border-border">
                      <td className={`p-3 text-left text-foreground text-sm ${row.highlight ? 'font-semibold' : ''}`}>
                        {row.feature}
                      </td>
                      <td className="p-2 text-center">{renderCheckmark(row.valid, true)}</td>
                      <td className="p-2 text-center">{renderCheckmark(row.clear)}</td>
                      <td className="p-2 text-center">{renderCheckmark(row.idme)}</td>
                      <td className="p-2 text-center">{renderCheckmark(row.ticketmaster)}</td>
                      <td className="p-2 text-center">{renderCheckmark(row.sterling)}</td>
                      <td className="p-2 text-center">{renderCheckmark(row.stdcheck)}</td>
                      <td className="p-2 text-center">{renderCheckmark(row.eventbrite)}</td>
                      <td className="p-2 text-center">{renderCheckmark(row.salesforce)}</td>
                      <td className="p-2 text-center">{renderCheckmark(row.dice)}</td>
                      <td className="p-2 text-center">{renderCheckmark(row.checkr)}</td>
                    </tr>
                  ))}
                  {/* Total Score Row */}
                  <tr className="bg-amber-900/50 border-t-2 border-amber-600">
                    <td className="p-3 text-left text-amber-300 font-extrabold text-base" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      TOTAL INTEGRATION SCORE (9 Max)
                    </td>
                    <td className="p-2 text-center text-xl font-extrabold" style={{ color: '#f39c12' }}>{validScore}/9</td>
                    <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">{clearScore}/9</td>
                    <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">{idmeScore}/9</td>
                    <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">{ticketmasterScore}/9</td>
                    <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">{sterlingScore}/9</td>
                    <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">{stdcheckScore}/9</td>
                    <td className="p-2 text-center text-lg text-muted-foreground font-extrabold">{eventbriteScore}/9</td>
                    <td className="p-2 text-center text-lg text-purple-400 font-extrabold">{salesforceScore}/9</td>
                    <td className="p-2 text-center text-lg text-orange-400 font-extrabold">{diceScore}/9</td>
                    <td className="p-2 text-center text-lg text-blue-400 font-extrabold">{checkrScore}/9</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Zero-Trust Key Differentiation */}
        <Card className="border-l-4" style={{ borderColor: '#2ecc71' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-500 text-xl md:text-2xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <Key className="h-6 w-6" />
              🔑 Key Differentiation: Zero-Trust Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-base md:text-lg">
              Competitor security models (FCRA compliance, SSO identity) are <strong className="text-foreground">static and siloed</strong>. VALID's <strong className="text-foreground">Zero-Trust Architecture</strong> requires continuous verification and integrates dynamic, real-time health/tox data, making it the only truly risk-based access system. This level of comprehensive, dynamic security is unmatched and crucial for high-liability venues.
            </p>
          </CardContent>
        </Card>

        {/* Core Differentiator Summary */}
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <Users className="h-6 w-6 text-primary" />
              Core Differentiator Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-5">
              {corePoints.map((point, idx) => (
                <li key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {idx + 1}
                  </div>
                  <p className="text-foreground text-base md:text-lg">{point}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* The Ask Section */}
        <Card className="bg-card/70 border-l-4" style={{ borderColor: '#2ecc71' }}>
          <CardContent className="p-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Our Ask: $750,000 Seed Round
            </h3>
            <p className="text-muted-foreground text-base md:text-lg">
              Funding is dedicated to <strong>accelerating DevSecOps implementation</strong> and securing the <strong>Lab Network Acquisition</strong> to capture a dominant market share.
            </p>
            <a 
              href="mailto:invest@bevalid.app" 
              className="mt-6 inline-block font-bold hover:text-foreground transition-colors text-lg md:text-xl"
              style={{ fontFamily: 'Orbitron, sans-serif', color: '#f39c12' }}
            >
              Contact Investor Relations: invest@bevalid.app
            </a>
          </CardContent>
        </Card>

        {/* Competitors Targeted */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
              <Building2 className="h-6 w-6 text-primary" />
              Competitors Targeted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3 mb-6">
              <Badge variant="secondary" className="text-base py-2 px-4">
                CLEAR (Fast Access)
              </Badge>
              <Badge variant="secondary" className="text-base py-2 px-4">
                ID.me (Identity Verification)
              </Badge>
              <Badge variant="secondary" className="text-base py-2 px-4">
                Ticketmaster (Event Access)
              </Badge>
              <Badge variant="secondary" className="text-base py-2 px-4">
                Sterling (Background Screening)
              </Badge>
              <Badge variant="secondary" className="text-base py-2 px-4">
                STDCheck (Health Testing)
              </Badge>
              <Badge variant="secondary" className="text-base py-2 px-4">
                Eventbrite (Event Ticketing)
              </Badge>
              <Badge variant="secondary" className="text-base py-2 px-4 bg-orange-500/20 text-orange-400 border-orange-500/30">
                DICE (Event Discovery)
              </Badge>
              <Badge variant="secondary" className="text-base py-2 px-4 bg-blue-500/20 text-blue-400 border-blue-500/30">
                Checkr (Background Checks)
              </Badge>
            </div>
            
            {/* Enterprise Solution / CRM Category */}
            <div className="mt-6 p-6 rounded-lg border border-purple-500/30 bg-purple-500/5">
              <h4 className="text-purple-400 font-bold mb-4 flex items-center gap-2 text-lg md:text-xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                <Building2 className="h-5 w-5" />
                Enterprise Solution / CRM
              </h4>
              <Badge className="text-base py-2 px-4 bg-purple-600 hover:bg-purple-700 mb-4">
                Salesforce (Enterprise CRM)
              </Badge>
              <p className="text-muted-foreground text-base md:text-lg mt-4">
                <strong className="text-purple-300">Key Differentiator:</strong> Valid™ transcends general CRM by providing <strong className="text-foreground">V-CRM (Verified CRM)</strong>, tying secure identity and physical access directly to auditable revenue tracking and FBO settlement, which is not possible within a generalized CRM platform.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
