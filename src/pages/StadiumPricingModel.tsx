import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, ArrowRight, Building2, Users, Wallet, Clock, CheckCircle2, CreditCard, Zap, Shield, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const StadiumPricingModel = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Admin</span>
          </Link>
          <div className="h-4 w-px bg-border" />
          <h1 className="text-lg font-bold">Stadiums & Arenas: Pricing Model</h1>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">ENTERPRISE</Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Pricing & Deployment Model (Stadiums & Arenas)</h2>
          <p className="text-muted-foreground leading-relaxed">
            For high-volume venues with 10,000+ attendees, VALID™ offers an Enterprise SaaS model combining 
            a monthly platform fee with volume-tiered per-scan pricing. This guide covers deployment, pricing, 
            and the Scan Event billing model.
          </p>
        </section>

        {/* Scan Event Definition */}
        <Card className="border-cyan-500/30 bg-cyan-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              Scan Event Definition (Critical)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                <strong className="text-cyan-400">1 Scan Event = 1 successful authorization</strong>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-background/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Door Entry</p>
                  <p className="text-sm text-muted-foreground">
                    One successful admission authorization = 1 Scan Event. 
                    Fan walks through turnstile, system validates, access granted.
                  </p>
                </div>
                <div className="bg-background/50 rounded-lg p-4">
                  <p className="font-semibold mb-2">Purchase</p>
                  <p className="text-sm text-muted-foreground">
                    One successful purchase authorization = 1 Scan Event. 
                    Fan taps to pay, system validates, transaction approved.
                  </p>
                </div>
              </div>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="font-semibold text-amber-400 mb-2">Idempotency Protection</p>
                <p className="text-sm text-muted-foreground">
                  Re-scans caused by connectivity issues, user error, or staff retrying do NOT create additional Scan Events. 
                  Each authorization uses an idempotency key + 60-second grace window to prevent double-billing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visual Flow Chart */}
        <Card className="border-emerald-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-emerald-400" />
              Enterprise Deployment Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-xl p-6 overflow-x-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 min-w-[700px]">
                {/* Step 1: Contract */}
                <div className="flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center mb-2">
                    <Shield className="h-7 w-7 text-purple-400" />
                  </div>
                  <p className="font-bold text-sm">CONTRACT</p>
                  <p className="text-xs text-muted-foreground">Enterprise agreement</p>
                  <p className="text-xs text-purple-400">Annual commitment</p>
                </div>

                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />

                {/* Step 2: Platform Fee */}
                <div className="flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mb-2">
                    <DollarSign className="h-7 w-7 text-emerald-400" />
                  </div>
                  <p className="font-bold text-sm">PLATFORM FEE</p>
                  <p className="text-xs text-muted-foreground">Monthly SaaS</p>
                  <p className="text-xs text-emerald-400">$2,500/mo</p>
                </div>

                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />

                {/* Step 3: Scan Events */}
                <div className="flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center mb-2">
                    <Zap className="h-7 w-7 text-cyan-400" />
                  </div>
                  <p className="font-bold text-sm">SCAN EVENTS</p>
                  <p className="text-xs text-muted-foreground">Per authorization</p>
                  <p className="text-xs text-cyan-400">$0.08–$0.15</p>
                </div>

                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />

                {/* Step 4: Optional IDV */}
                <div className="flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center mb-2">
                    <Users className="h-7 w-7 text-amber-400" />
                  </div>
                  <p className="font-bold text-sm">IDV MODULES</p>
                  <p className="text-xs text-muted-foreground">Optional add-on</p>
                  <p className="text-xs text-amber-400">$2–$4/verify</p>
                </div>

                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />

                {/* Step 5: Settlement */}
                <div className="flex flex-col items-center text-center">
                  <div className="h-14 w-14 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mb-2">
                    <Clock className="h-7 w-7 text-green-400" />
                  </div>
                  <p className="font-bold text-sm">SETTLEMENT</p>
                  <p className="text-xs text-muted-foreground">Weekly statements</p>
                  <p className="text-xs text-green-400">ACH transfer</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              Enterprise Pricing Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Monthly Platform Fee */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Monthly Platform Fee</h4>
              <p className="text-3xl font-bold text-emerald-400">$2,500<span className="text-lg text-muted-foreground">/month</span></p>
              <p className="text-sm text-muted-foreground mt-2">
                Includes: Dashboard access, real-time analytics, API integration, dedicated support, 
                custom branding, staff management portal.
              </p>
            </div>

            {/* Per-Scan Tiers */}
            <div>
              <h4 className="font-semibold mb-3">Volume-Tiered Per-Scan Pricing (Door Entry)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium">Monthly Scan Volume</th>
                      <th className="text-right py-2 font-medium">Fee per Scan</th>
                      <th className="text-right py-2 font-medium">Example Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2">0–49,999</td>
                      <td className="text-right">$0.15</td>
                      <td className="text-right text-muted-foreground">$7,500 max</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">50,000–99,999</td>
                      <td className="text-right">$0.12</td>
                      <td className="text-right text-muted-foreground">$12,000 max</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">100,000–499,999</td>
                      <td className="text-right">$0.10</td>
                      <td className="text-right text-muted-foreground">$50,000 max</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">500,000+</td>
                      <td className="text-right font-semibold text-emerald-400">$0.08</td>
                      <td className="text-right text-emerald-400">Best rate</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Purchase/POS scans are billed at 60% of door entry rate.
              </p>
            </div>

            {/* Optional IDV Modules */}
            <div>
              <h4 className="font-semibold mb-3">Optional Verification Modules</h4>
              <p className="text-sm text-muted-foreground mb-3">
                <strong>Stadium pays for guest verifications</strong> — guests do not pay separately.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4">
                  <p className="font-semibold mb-1">Standard IDV</p>
                  <p className="text-2xl font-bold">$2.00<span className="text-sm text-muted-foreground">/verify</span></p>
                  <p className="text-xs text-muted-foreground">Document scan + database check</p>
                </div>
                <div className="border border-purple-500/30 bg-purple-500/5 rounded-lg p-4">
                  <p className="font-semibold mb-1 text-purple-400">Premium IDV</p>
                  <p className="text-2xl font-bold">$4.00<span className="text-sm text-muted-foreground">/verify</span></p>
                  <p className="text-xs text-muted-foreground">Document + biometric + liveness check</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Worked Example */}
        <Card className="border-emerald-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-400" />
              Worked Example: NFL Stadium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Assumptions:</p>
                  <ul className="text-sm space-y-1">
                    <li>• 50,000 fans per game</li>
                    <li>• 10 home games per season</li>
                    <li>• Total: <strong>500,000 door scans/year</strong></li>
                    <li>• 12-month contract</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Annual Cost Calculation:</p>
                  <ul className="text-sm space-y-1">
                    <li>Platform fee: $2,500 × 12 = <span className="text-purple-400 font-semibold">$30,000</span></li>
                    <li>Scan fees: 500,000 × $0.10 = <span className="text-cyan-400 font-semibold">$50,000</span></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Annual Investment:</span>
                  <span className="text-2xl font-bold text-emerald-400">$80,000</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Cost per fan:</span>
                  <span className="font-semibold">$0.16</span>
                </div>
              </div>
            </div>

            {/* ROI Note */}
            <div className="mt-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <p className="text-sm">
                <strong className="text-emerald-400">ROI Consideration:</strong> A single prevented incident 
                (lawsuit, bad press, insurance claim) typically costs $100K–$500K+. VALID™'s annual cost 
                is a fraction of one incident's potential damage.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Settlement & Statements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              Settlement & Statements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-emerald-500/30 rounded-lg p-4">
                <p className="font-semibold text-emerald-400 mb-2">Weekly Statements (Default)</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Statement generated every Monday</li>
                  <li>• Shows: scan counts, fees, IDV usage, net due</li>
                  <li>• Invoice sent to billing contact</li>
                  <li>• ACH debit or wire transfer</li>
                </ul>
              </div>
              <div className="border border-border rounded-lg p-4">
                <p className="font-semibold mb-2">Statement Contents</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Gross scan count (door + POS)</li>
                  <li>• Scan fees by tier</li>
                  <li>• IDV module usage (if applicable)</li>
                  <li>• Platform fee proration</li>
                  <li>• Net amount due</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default StadiumPricingModel;
