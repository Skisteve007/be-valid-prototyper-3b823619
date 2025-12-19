import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Building2, Users, Clock, CheckCircle2, Zap, Shield, AlertTriangle, Eye, Lock, Unlock, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
          <h1 className="text-lg font-bold">Stadiums & Arenas — Pricing</h1>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">SOURCE OF TRUTH</Badge>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Pricing + Event Security Options</h2>
          <p className="text-muted-foreground leading-relaxed">
            This page defines the <strong>stadium model</strong>: what gets billed, when deep screening applies, and how re-entry works.
          </p>
        </section>

        {/* Core Definitions */}
        <Card className="border-cyan-500/30 bg-cyan-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              Core Definitions (Billing)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Scan Event */}
            <div className="bg-background/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-cyan-400">Scan Event (Authorization)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                A <strong>Scan Event</strong> is <strong>one successful authorization</strong>. This includes:
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4 list-disc">
                <li>Entry authorization (gate scan)</li>
                <li>Purchase authorization (concessions / in-venue purchases)</li>
              </ul>
              <div className="mt-4 bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <p className="text-sm">
                  <strong className="text-amber-400">Rule:</strong> Re-scans/retries for the same authorization must <strong>not</strong> be billed twice (idempotency + re-scan grace window).
                </p>
              </div>
            </div>

            {/* Deep Screening Check */}
            <div className="bg-background/50 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-purple-400">Deep Screening Check (Per Attendee / Per Event)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                A <strong>Deep Screening Check</strong> is a deeper identity + screening workflow (e.g., vendor-powered verification / watchlist/deny-list screening when enabled by the venue).
              </p>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                <p className="text-sm">
                  <strong className="text-emerald-400">Billing rule:</strong> Billed <strong>once per attendee per event</strong> (not billed again on re-entry during the same event).
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Event Security Modes */}
        <Card className="border-purple-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-400" />
              Event Security Modes (Chosen Per Event)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Venues can select a security mode for each event:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mode 0 */}
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Unlock className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="outline">MODE 0</Badge>
                </div>
                <h4 className="font-semibold mb-2">Scan-Only (Fast Throughput)</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Scans required for entry and purchases</li>
                  <li>• No deep screening by default</li>
                </ul>
              </div>

              {/* Mode 1 */}
              <div className="border border-emerald-500/30 bg-emerald-500/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-emerald-400" />
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">MODE 1</Badge>
                </div>
                <h4 className="font-semibold mb-2 text-emerald-400">Selective Deep Screening</h4>
                <p className="text-xs text-emerald-400 mb-2">Recommended Default</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Scans required for entry and purchases</li>
                  <li>• Deep screening applied to:</li>
                  <li className="ml-4">– Staff / VIP / restricted access</li>
                  <li className="ml-4">– Policy-based exceptions</li>
                </ul>
              </div>

              {/* Mode 2 */}
              <div className="border border-amber-500/30 bg-amber-500/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="h-4 w-4 text-amber-400" />
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">MODE 2</Badge>
                </div>
                <h4 className="font-semibold mb-2 text-amber-400">Mandatory Deep Screening</h4>
                <p className="text-xs text-amber-400 mb-2">Highest Security</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Scans required for entry and purchases</li>
                  <li>• Deep screening for <strong>all attendees</strong></li>
                  <li>• Billed once per attendee per event</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Re-Entry Policy */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-amber-400" />
              Re-Entry Policy (Important)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Attendees must <strong>scan again</strong> to re-enter if they leave the venue.
            </p>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>• Re-entry scans are still <strong>Scan Events</strong> (entry authorizations).</li>
              <li>• Deep screening is <strong>NOT re-billed</strong> on re-entry within the same event.</li>
            </ul>
            
            <div className="bg-background/50 rounded-lg p-4 mt-4">
              <h4 className="font-semibold mb-2 text-sm">Implementation Requirement (Audit + Billing Accuracy)</h4>
              <p className="text-sm text-muted-foreground mb-2">
                Create an <code className="bg-muted px-1.5 py-0.5 rounded text-xs">EventClearance</code> record keyed by:
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground ml-4 list-disc">
                <li><code className="bg-muted px-1 py-0.5 rounded text-xs">event_id</code></li>
                <li><code className="bg-muted px-1 py-0.5 rounded text-xs">attendee_id</code> (or <code className="bg-muted px-1 py-0.5 rounded text-xs">wallet_id</code>)</li>
                <li><code className="bg-muted px-1 py-0.5 rounded text-xs">deep_check_status</code></li>
                <li><code className="bg-muted px-1 py-0.5 rounded text-xs">timestamp</code></li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                <strong>On entry/re-entry:</strong> Always require an entry authorization scan. Only run/bill deep screening if <code className="bg-muted px-1 py-0.5 rounded text-xs">EventClearance</code> does not already exist for that attendee/event.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-400" />
              Pricing (Admin-Editable Defaults)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Enterprise SaaS */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2">1) Enterprise SaaS + SLA (Contracted)</h4>
              <p className="text-2xl font-bold text-emerald-400">$____ <span className="text-lg text-muted-foreground">/ month</span></p>
              <p className="text-sm text-muted-foreground mt-2">
                Includes admin, reporting, support, SLA. Exact fee configured per contract in Admin.
              </p>
            </div>

            {/* Scan Events */}
            <div>
              <h4 className="font-semibold mb-3">2) Scan Events (Usage)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Scan Events are billed per successful authorization and should be <strong>tiered by volume</strong>.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium">Tier</th>
                      <th className="text-left py-2 font-medium">Monthly Volume</th>
                      <th className="text-right py-2 font-medium">Per Scan Event</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-2">Tier 1</td>
                      <td className="py-2">First ______ Scan Events</td>
                      <td className="text-right">$0.__</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-2">Tier 2</td>
                      <td className="py-2">Next ______ Scan Events</td>
                      <td className="text-right">$0.__</td>
                    </tr>
                    <tr>
                      <td className="py-2">Tier 3</td>
                      <td className="py-2">Above ______ Scan Events</td>
                      <td className="text-right text-emerald-400 font-semibold">$0.__</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Note: Stadium per-scan rates are typically lower than nightlife due to volume, while enterprise SaaS + support is higher.
              </p>
            </div>

            {/* Deep Screening */}
            <div>
              <h4 className="font-semibold mb-3">3) Deep Screening (Optional Per Event)</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Deep screening is priced per attendee per event when enabled.
              </p>
              <div className="border border-purple-500/30 bg-purple-500/5 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-purple-400">Deep Screening Check</p>
                    <p className="text-sm text-muted-foreground">Per attendee per event</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">$2.75 – $3.50</p>
                    <p className="text-xs text-muted-foreground">Admin default: <span className="text-purple-400 font-semibold">$3.25</span></p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Volume note: High-volume events may qualify for discounted per-check pricing.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Statements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-400" />
              Statements (Event-Day / Weekly)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Statements must include clear line items:
            </p>
            <div className="bg-muted/30 rounded-lg p-4">
              <ul className="text-sm space-y-2">
                <li className="flex justify-between">
                  <span>Entry Scan Events:</span>
                  <span className="text-muted-foreground">count × rate</span>
                </li>
                <li className="flex justify-between">
                  <span>Purchase Scan Events:</span>
                  <span className="text-muted-foreground">count × rate</span>
                </li>
                <li className="flex justify-between">
                  <span>Deep Screening Checks:</span>
                  <span className="text-muted-foreground">count × $2.75–$3.50</span>
                </li>
                <li className="flex justify-between">
                  <span>Optional modules (if applicable):</span>
                  <span className="text-muted-foreground">vendor pass-through + markup</span>
                </li>
                <li className="flex justify-between">
                  <span>Refunds/voids (if applicable):</span>
                  <span className="text-muted-foreground">deducted</span>
                </li>
                <li className="flex justify-between border-t border-border pt-2 mt-2 font-semibold">
                  <span>Total:</span>
                  <span className="text-emerald-400">Net amount due</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Alert className="border-amber-500/30 bg-amber-500/5">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <AlertDescription className="text-sm">
            <strong className="text-amber-400">Required Disclaimer (Marketing + Legal Safety):</strong>{' '}
            Screening tools can reduce risk and improve auditability, but they <strong>do not guarantee</strong> identification of every threat or individual.
          </AlertDescription>
        </Alert>

      </main>
    </div>
  );
};

export default StadiumPricingModel;
