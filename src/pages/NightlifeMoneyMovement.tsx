import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, ArrowRight, Building2, Users, Wallet, Clock, CheckCircle2, CreditCard, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NightlifeMoneyMovement = () => {
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
          <h1 className="text-lg font-bold">Nightlife: Money Movement & Fees</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Money Movement, Fees, and Payout Schedule</h2>
          <p className="text-muted-foreground leading-relaxed">
            This guide explains how money flows through the VALID™ system for nightlife venues (clubs, bars, festivals, corporate events). 
            Understanding these flows will help you accurately forecast revenue and explain the model to your team.
          </p>
        </section>

        {/* Visual Flow Chart */}
        <Card className="border-cyan-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              Money Flow Diagram
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-xl p-6 overflow-x-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 min-w-[600px]">
                {/* Step 1: Guest */}
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center mb-2">
                    <Users className="h-8 w-8 text-cyan-400" />
                  </div>
                  <p className="font-bold text-sm">GUEST</p>
                  <p className="text-xs text-muted-foreground">Loads Ghost Pass™</p>
                </div>

                <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0" />

                {/* Step 2: Stripe */}
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-purple-500/20 border-2 border-purple-500/50 flex items-center justify-center mb-2">
                    <CreditCard className="h-8 w-8 text-purple-400" />
                  </div>
                  <p className="font-bold text-sm">STRIPE</p>
                  <p className="text-xs text-muted-foreground">Payment processing</p>
                  <p className="text-xs text-amber-400">-2.9% + $0.30</p>
                </div>

                <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0" />

                {/* Step 3: FBO Account */}
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center mb-2">
                    <Wallet className="h-8 w-8 text-emerald-400" />
                  </div>
                  <p className="font-bold text-sm">FBO ACCOUNT</p>
                  <p className="text-xs text-muted-foreground">Funds held in trust</p>
                </div>

                <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0" />

                {/* Step 4: Settlement */}
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center mb-2">
                    <Clock className="h-8 w-8 text-amber-400" />
                  </div>
                  <p className="font-bold text-sm">SETTLEMENT</p>
                  <p className="text-xs text-muted-foreground">Nightly or Weekly</p>
                </div>

                <ArrowRight className="h-6 w-6 text-muted-foreground shrink-0" />

                {/* Step 5: Venue */}
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-green-500/20 border-2 border-green-500/50 flex items-center justify-center mb-2">
                    <Building2 className="h-8 w-8 text-green-400" />
                  </div>
                  <p className="font-bold text-sm">VENUE</p>
                  <p className="text-xs text-muted-foreground">Your bank account</p>
                  <p className="text-xs text-green-400">Net payout</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              Fee Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scan Event Fees */}
            <div>
              <h4 className="font-semibold mb-3">Per-Scan Event Fees</h4>
              <p className="text-sm text-muted-foreground mb-3">
                A <strong>Scan Event</strong> is counted once per successful authorization. Re-scans don't create extra charges.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                  <p className="text-sm text-cyan-400 font-semibold mb-1">Door Entry Authorization</p>
                  <p className="text-2xl font-bold">$0.20–$0.50</p>
                  <p className="text-xs text-muted-foreground">Based on monthly volume tier</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <p className="text-sm text-purple-400 font-semibold mb-1">Purchase Authorization</p>
                  <p className="text-2xl font-bold">$0.10–$0.25</p>
                  <p className="text-xs text-muted-foreground">Based on monthly volume tier</p>
                </div>
              </div>
            </div>

            {/* Volume Tiers */}
            <div>
              <h4 className="font-semibold mb-3">Volume Tier Discounts (Door Entry)</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium">Monthly Scans</th>
                      <th className="text-right py-2 font-medium">Fee per Scan</th>
                      <th className="text-right py-2 font-medium">Discount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2">0–999</td>
                      <td className="text-right">$0.50</td>
                      <td className="text-right text-muted-foreground">—</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">1,000–9,999</td>
                      <td className="text-right">$0.25</td>
                      <td className="text-right text-green-400">50% off</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">10,000–99,999</td>
                      <td className="text-right">$0.15</td>
                      <td className="text-right text-green-400">70% off</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold">100,000+</td>
                      <td className="text-right font-semibold text-cyan-400">$0.10</td>
                      <td className="text-right text-green-400">80% off</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ghost Pass Revenue Share */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Ghost Pass™ Revenue Share
              </h4>
              <p className="text-3xl font-bold text-emerald-400 mb-2">30%</p>
              <p className="text-sm text-muted-foreground">
                Every time a guest purchases a Ghost Pass™ at your venue, you receive 30% of the pass value. 
                This is in addition to scan fees and creates a significant revenue stream.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Worked Example */}
        <Card className="border-emerald-500/30">
          <CardHeader>
            <CardTitle>Worked Example: Busy Weekend Club</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Assumptions:</p>
                  <ul className="text-sm space-y-1">
                    <li>• 2,000 guests/night × 4 nights = <strong>8,000 door scans/month</strong></li>
                    <li>• Average 2 bar purchases per guest = <strong>16,000 POS scans/month</strong></li>
                    <li>• 500 Ghost Passes @ $25 average = <strong>$12,500 in passes</strong></li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Revenue Calculation:</p>
                  <ul className="text-sm space-y-1">
                    <li>Door scans: 8,000 × $0.25 = <span className="text-cyan-400 font-semibold">$2,000</span></li>
                    <li>POS scans: 16,000 × $0.15 = <span className="text-purple-400 font-semibold">$2,400</span></li>
                    <li>Ghost Pass share: $12,500 × 30% = <span className="text-emerald-400 font-semibold">$3,750</span></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-border pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Monthly VALID™ Revenue:</span>
                  <span className="text-2xl font-bold text-emerald-400">$8,150</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Note: Scan fees are deducted from Ghost Pass payouts. Net to venue after fees shown in statement.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payout Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              Payout Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-amber-500/30 rounded-lg p-4">
                <p className="font-semibold text-amber-400 mb-2">Nightly Settlement (Default)</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Funds settle by 6 AM following business day</li>
                  <li>• ACH transfer initiated same morning</li>
                  <li>• In your bank account within 1-2 business days</li>
                </ul>
              </div>
              <div className="border border-border rounded-lg p-4">
                <p className="font-semibold mb-2">Weekly Settlement</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Statement generated every Monday</li>
                  <li>• ACH transfer initiated Monday AM</li>
                  <li>• In your bank account by Wednesday</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Contact your account manager to change payout cadence. Weekly payout may be required for new accounts.
            </p>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default NightlifeMoneyMovement;
