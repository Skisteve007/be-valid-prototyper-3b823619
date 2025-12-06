import { Check, X, Zap, Shield, Users, Building2, Globe, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const scorecardData = [
  {
    feature: "INSTANT QR-SCAN ENTRY (Speed)",
    stdcheck: { value: false, note: "Static PDF Result" },
    sterling: { value: false, note: "Report-Based Cycle" },
    generic: { value: true, note: "But for Age Only" },
    valid: { value: "double", note: "Core Speed & Access" },
  },
  {
    feature: "PEER-TO-PEER NETWORK TRUST",
    stdcheck: { value: false },
    sterling: { value: false },
    generic: { value: false },
    valid: { value: true, note: "Unique Differentiator" },
  },
  {
    feature: "CERTIFIED LAB INTEGRATION",
    stdcheck: { value: true, note: "Only within their network" },
    sterling: { value: true, note: "General lab partnership" },
    generic: { value: false },
    valid: { value: true, note: "Seamless & Comprehensive" },
  },
  {
    feature: "REAL-TIME STATUS BADGE",
    stdcheck: { value: false, note: "Static File Risk" },
    sterling: { value: false, note: "Delayed Report" },
    generic: { value: false },
    valid: { value: "double", note: "Live & Actionable" },
  },
  {
    feature: "NIGHTLIFE/SERVICE WORKER PORTAL",
    stdcheck: { value: false },
    sterling: { value: false },
    generic: { value: false },
    valid: { value: true, note: "Built for Venue Management" },
  },
  {
    feature: "WORKFORCE TOXICOLOGY MGMT",
    stdcheck: { value: false },
    sterling: { value: true },
    generic: { value: false },
    valid: { value: true, note: "Flexible B2B Compliance" },
  },
  {
    feature: "HIPAA/GDPR COMPLIANCE",
    stdcheck: { value: true },
    sterling: { value: true },
    generic: { value: false },
    valid: { value: "double", note: "Zero-Trust Architecture" },
  },
  {
    feature: "MULTI-LANGUAGE SUPPORT",
    stdcheck: { value: false },
    sterling: { value: false },
    generic: { value: false },
    valid: { value: true, note: "Global Accessibility" },
  },
];

const corePoints = [
  "VALID is the only platform that is FAST, INTEGRATED, AND COMPREHENSIVE, bridging the gap between direct-to-consumer testing and slow workforce compliance.",
  "The Peer-to-Peer Network Trust is a unique, proprietary feature unmatched by any competitor, building a stronger social ecosystem.",
  "Our Nightlife/Service Worker Portal and INSTANT QR-SCAN ENTRY directly solve the speed and management issues that plague venue operators.",
];

const renderCheckmark = (value: boolean | string) => {
  if (value === "double") {
    return (
      <div className="flex items-center justify-center gap-0.5">
        <Check className="h-5 w-5 text-green-500" />
        <Check className="h-5 w-5 text-green-500 -ml-2" />
      </div>
    );
  }
  if (value === true) {
    return <Check className="h-5 w-5 text-green-500 mx-auto" />;
  }
  return <X className="h-5 w-5 text-red-500 mx-auto" />;
};

export default function CompetitiveScorecard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              VALID: The Future-Proof Standard
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Competitive Advantage & Sales Assets
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
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
                  Disconnected data nodes, siloed systems, manual processes, delayed results
                </p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-destructive border-destructive/50">Static PDFs</Badge>
                  <Badge variant="outline" className="text-destructive border-destructive/50">Report Delays</Badge>
                  <Badge variant="outline" className="text-destructive border-destructive/50">No Integration</Badge>
                </div>
              </div>
              <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/30">
                <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3">VALID</h3>
                <p className="text-sm text-muted-foreground">
                  Seamless, integrated network flow with QR, Peer, and Lab integration
                </p>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50">Instant QR</Badge>
                  <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50">Peer Network</Badge>
                  <Badge className="bg-green-500/20 text-green-600 dark:text-green-400 border-green-500/50">Lab Certified</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitive Scorecard Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Direct Competitive Scorecard: Why VALID Wins
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Actionable data showing VALID's superiority in Speed, Integration, and Comprehensive Services.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold text-foreground">Feature</th>
                    <th className="text-center p-3 font-semibold text-muted-foreground">STDCheck.com</th>
                    <th className="text-center p-3 font-semibold text-muted-foreground">Sterling</th>
                    <th className="text-center p-3 font-semibold text-muted-foreground">Generic Venue Tech</th>
                    <th className="text-center p-3 font-semibold text-green-600 dark:text-green-400 bg-green-500/5">VALID</th>
                  </tr>
                </thead>
                <tbody>
                  {scorecardData.map((row, idx) => (
                    <tr key={idx} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="p-3 font-medium text-foreground">{row.feature}</td>
                      <td className="p-3 text-center">
                        {renderCheckmark(row.stdcheck.value)}
                        {row.stdcheck.note && (
                          <p className="text-xs text-muted-foreground mt-1">{row.stdcheck.note}</p>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {renderCheckmark(row.sterling.value)}
                        {row.sterling.note && (
                          <p className="text-xs text-muted-foreground mt-1">{row.sterling.note}</p>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {renderCheckmark(row.generic.value)}
                        {row.generic.note && (
                          <p className="text-xs text-muted-foreground mt-1">{row.generic.note}</p>
                        )}
                      </td>
                      <td className="p-3 text-center bg-green-500/5">
                        {renderCheckmark(row.valid.value)}
                        {row.valid.note && (
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">{row.valid.note}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                STDCheck.com (Online Testing)
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                Sterling (Workforce Screening)
              </Badge>
              <Badge variant="secondary" className="text-sm py-1 px-3">
                Generic Venue Tech (ID/Age)
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
