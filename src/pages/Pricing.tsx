import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { 
  PartyPopper, 
  Truck, 
  Users,
  Building2,
  Check,
  Wrench,
  Monitor,
  Tablet,
  MonitorSmartphone,
  Heart,
  Car,
  Shield,
  Ticket,
  Hotel,
  Calendar,
  Phone,
  FileText,
  ArrowRight,
  GraduationCap,
  Fuel
} from "lucide-react";
import ResponsiveHeader from "@/components/ResponsiveHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import industrySecurityBg from "@/assets/industry-security-bg.jpg";
import industryEventsBg from "@/assets/industry-events-bg.jpg";
import industryNightlifeBg from "@/assets/industry-nightlife-bg.jpg";
import industryTransportationBg from "@/assets/industry-transportation-bg.jpg";
import industryWorkforceBg from "@/assets/industry-workforce-bg.jpg";
import industryLabsBg from "@/assets/industry-labs-bg.jpg";
import industryRentalsBg from "@/assets/industry-rentals-bg.jpg";
import industryStadiumBg from "@/assets/industry-stadium-bg.jpg";
import industryHospitalityBg from "@/assets/industry-hospitality-bg.jpg";
import industryUniversityBg from "@/assets/industry-university-bg.jpg";

const hardwareOptions = [
  {
    name: "Handheld Scanner",
    icon: Monitor,
    purchase: "$599",
    lease: "$29/mo",
    description: "Portable, door staff",
  },
  {
    name: "Desktop Hub",
    icon: MonitorSmartphone,
    purchase: "$999",
    lease: "$49/mo",
    description: "Manager station",
  },
  {
    name: "Tablet Kit",
    icon: Tablet,
    purchase: "$399",
    lease: "$19/mo",
    description: "iPad/Android + VALID™ app",
  },
  {
    name: "Kiosk",
    icon: Wrench,
    purchase: "$1,499",
    lease: "$79/mo",
    description: "Self-service entry",
  },
];

const Pricing = () => {
  const [nightlifeTier, setNightlifeTier] = useState("professional");

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Pricing | VALID™</title>
        <meta name="description" content="Transparent pricing that scales with your business. Base platform + hardware + usage fees." />
      </Helmet>

      <ResponsiveHeader />

      <main className="pt-20">
        {/* Hero Header */}
        <section className="py-12 md:py-20 bg-gradient-to-b from-cyan-500/10 via-background to-background">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              VALID™ <span className="text-cyan-400">PRICING</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Transparent pricing that scales with your business
            </p>
            
            {/* Formula Explanation */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-sm md:text-base mb-8">
              <div className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                Base Platform
              </div>
              <span className="text-muted-foreground self-center">+</span>
              <div className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400">
                Hardware
              </div>
              <span className="text-muted-foreground self-center">+</span>
              <div className="px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                Usage Fees
              </div>
              <span className="text-muted-foreground self-center">=</span>
              <div className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold">
                Your Total Cost
              </div>
            </div>

            {/* Profit Callout */}
            <div className="inline-block p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40">
              <p className="text-emerald-400 font-semibold text-lg">
                💰 Nightlife venues: Most <span className="text-white">PROFIT</span> from VALID™ — GHOST™ earnings exceed costs!
              </p>
            </div>
          </div>
        </section>

        {/* Hardware Options Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Wrench className="h-6 w-6 text-cyan-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Hardware Options</h2>
              </div>
              <p className="text-muted-foreground">Purchase outright or lease monthly</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {hardwareOptions.map((hw) => (
                <Card key={hw.name} className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                      <hw.icon className="h-8 w-8 text-cyan-400" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{hw.name}</h3>
                    <p className="text-xs text-muted-foreground mb-4">{hw.description}</p>
                    <div className="space-y-2">
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                        <p className="text-xs text-muted-foreground">Purchase</p>
                        <p className="text-lg font-bold text-emerald-400">{hw.purchase}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                        <p className="text-xs text-muted-foreground">Lease</p>
                        <p className="text-lg font-bold text-cyan-400">{hw.lease}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Gas Fee Section */}
        <section className="py-12 md:py-16 bg-gradient-to-b from-amber-500/5 via-background to-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Fuel className="h-6 w-6 text-amber-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">⛽ Verification Gas Fee</h2>
              </div>
              <p className="text-muted-foreground">Every ID verification scan includes a small per-scan fee (volume-discounted)</p>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Volume Pricing Table */}
              <Card className="border-amber-500/30 bg-card/50 backdrop-blur-sm mb-6">
                <CardContent className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-amber-500/30">
                          <th className="text-left py-3 px-4 text-amber-400 font-semibold">Volume / Month</th>
                          <th className="text-right py-3 px-4 text-amber-400 font-semibold">Fee Per Scan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/30">
                          <td className="py-3 px-4 text-foreground">Under 1,000 scans/month</td>
                          <td className="py-3 px-4 text-right text-cyan-400 font-semibold">$0.25–$0.50/scan</td>
                        </tr>
                        <tr className="border-b border-border/30">
                          <td className="py-3 px-4 text-foreground">1,000–10,000 scans/month</td>
                          <td className="py-3 px-4 text-right text-cyan-400 font-semibold">$0.15–$0.25/scan</td>
                        </tr>
                        <tr className="border-b border-border/30">
                          <td className="py-3 px-4 text-foreground">10,000–100,000 scans/month</td>
                          <td className="py-3 px-4 text-right text-cyan-400 font-semibold">$0.10–$0.15/scan</td>
                        </tr>
                        <tr>
                          <td className="py-3 px-4 text-foreground">100,000+ scans/month</td>
                          <td className="py-3 px-4 text-right text-emerald-400 font-semibold">$0.05–$0.10/scan</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Key Points */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                  <p className="text-sm text-amber-400 font-semibold">📉 Volume Discounts</p>
                  <p className="text-xs text-muted-foreground mt-1">Fees scale down as you grow</p>
                </div>
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-center">
                  <p className="text-sm text-cyan-400 font-semibold">💳 Flexible Billing</p>
                  <p className="text-xs text-muted-foreground mt-1">Billed monthly or deducted from venue wallet</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                  <p className="text-sm text-emerald-400 font-semibold">📊 Real-Time Tracking</p>
                  <p className="text-xs text-muted-foreground mt-1">Monitor usage in your dashboard</p>
                </div>
              </div>

              {/* Profit Callout */}
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-center">
                <p className="text-emerald-400 font-semibold">
                  💰 Most venues: Gas fees are more than offset by GHOST™ Pass revenue you earn through VALID™.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vertical Pricing Cards */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Choose Your Industry</h2>
              <p className="text-muted-foreground">Select the package tailored for your operation</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Nightlife Card with Tabs */}
              <Card className="relative border-purple-500/30 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${industryNightlifeBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/95" />
                <div className="relative z-10">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-purple-500/30 border border-purple-400/50">
                      <PartyPopper className="h-6 w-6 text-purple-300" />
                    </div>
                    <div>
                      <CardTitle className="text-xl md:text-2xl font-bold text-white">🎤 Nightlife & Entertainment</CardTitle>
                      <p className="text-sm text-gray-300">Clubs, bars, lounges, venues</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Tabs value={nightlifeTier} onValueChange={setNightlifeTier}>
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="starter" className="text-xs">Starter</TabsTrigger>
                      <TabsTrigger value="professional" className="text-xs">Professional</TabsTrigger>
                      <TabsTrigger value="enterprise" className="text-xs">Enterprise</TabsTrigger>
                    </TabsList>

                    <TabsContent value="starter" className="mt-4 space-y-4">
                      <div className="text-center py-4 border-b border-white/20">
                        <p className="text-3xl md:text-4xl font-bold text-cyan-400">$99<span className="text-base md:text-lg text-gray-300">/mo</span></p>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">HARDWARE</p>
                          <p className="text-sm">1 Handheld <span className="text-cyan-400">(+$29/mo lease)</span></p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">SOFTWARE</p>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Unlimited ID scans</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> GHOST™ Passes</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Basic banned list</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Age verify</li>
                          </ul>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">SUPPORT</p>
                          <p className="text-sm">Email (24–48hr)</p>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                          Onboarding: <span className="text-cyan-400">$250</span>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="professional" className="mt-4 space-y-4">
                      <div className="text-center py-4 border-b border-border/50">
                        <Badge className="mb-2 bg-purple-500/20 text-purple-400 border-purple-500/50">POPULAR</Badge>
                        <p className="text-3xl font-bold text-emerald-400">$199<span className="text-lg text-muted-foreground">/mo</span></p>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">HARDWARE</p>
                          <p className="text-sm">1 Hub + 2 Handhelds <span className="text-cyan-400">(+$107/mo lease)</span></p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">SOFTWARE</p>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Everything in Starter</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Banned/VIP lists</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Fake ID detection</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Analytics</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Promoter tracking</li>
                          </ul>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">SUPPORT</p>
                          <p className="text-sm">Priority (4–8hr)</p>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                          Onboarding: <span className="text-cyan-400">$500</span>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="enterprise" className="mt-4 space-y-4">
                      <div className="text-center py-4 border-b border-border/50">
                        <p className="text-3xl font-bold text-emerald-400">$399–$799<span className="text-lg text-muted-foreground">/mo</span></p>
                      </div>
                      <div className="space-y-3">
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">HARDWARE</p>
                          <p className="text-sm">1 Hub + 5 Handhelds <span className="text-emerald-400 font-semibold">INCLUDED</span></p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">SOFTWARE</p>
                          <ul className="text-sm space-y-1">
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Everything in Pro</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> API access</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Multi-location</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Health badges</li>
                            <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Custom branding</li>
                          </ul>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/30">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">SUPPORT</p>
                          <p className="text-sm">Dedicated Account Manager + 24/7</p>
                        </div>
                        <div className="text-center text-sm text-muted-foreground">
                          Onboarding: <span className="text-cyan-400">$1,500–$3,000</span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                    <p className="text-xs font-semibold text-cyan-400 mb-2">💳 SCAN EVENT PRICING</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <p className="text-gray-300">Door scan: <span className="text-white font-semibold">$0.20</span></p>
                      <p className="text-gray-300">Purchase scan: <span className="text-white font-semibold">$0.20</span></p>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Instant Load: $3.95 (guest-paid) • ACH: free</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Settlement: Nightly or Weekly (venue choice)</p>
                    <p className="text-sm text-emerald-400 font-semibold">💰 Net payout = Gross − scan fees − IDV − promoter payouts</p>
                  </div>

                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link to="/partner-application">Get Started</Link>
                  </Button>
                </CardContent>
              </div>
              </Card>

              {/* Transportation Card */}
              <Card className="relative border-amber-500/30 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${industryTransportationBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/95" />
                <div className="relative z-10">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-amber-500/30 border border-amber-400/50">
                      <Truck className="h-6 w-6 text-amber-300" />
                    </div>
                    <div>
                      <CardTitle className="text-xl md:text-2xl font-bold text-white">🚛 Transportation & Logistics</CardTitle>
                      <p className="text-sm text-gray-300">Fleets, delivery, rideshare</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 border-b border-white/20">
                    <p className="text-3xl md:text-4xl font-bold text-cyan-400">$99–$299<span className="text-base md:text-lg text-gray-300">/mo</span></p>
                    <p className="text-sm text-gray-300">+ per-driver fees</p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm md:text-base font-semibold text-white mb-2">BASE PLATFORM</p>
                    <ul className="text-sm md:text-base space-y-1 text-gray-200">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Fleet dashboard</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Driver verification</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Compliance reporting</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Vehicle access control</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm md:text-base font-semibold text-white mb-2">PER-DRIVER FEES</p>
                    <div className="grid grid-cols-2 gap-2 text-sm md:text-base text-gray-200">
                      <div>Active driver/mo: <span className="text-cyan-400 font-semibold">$5–$8</span></div>
                      <div>Background check: <span className="text-cyan-400 font-semibold">$50–$100</span></div>
                      <div>MVR: <span className="text-cyan-400 font-semibold">$15–$25</span></div>
                      <div>DOT drug screen: <span className="text-cyan-400 font-semibold">$50–$85</span></div>
                      <div className="col-span-2">Continuous monitoring: <span className="text-cyan-400 font-semibold">$5–$10/mo</span></div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-center">
                    <p className="text-sm md:text-base text-amber-300">📝 Example: 100 drivers ≈ <span className="font-bold text-white">$800–$1,000/month</span> total</p>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs font-semibold text-amber-400 mb-1">⛽ GAS FEE: $0.25–$0.50/scan</p>
                    <p className="text-xs text-gray-300">Example: 200 drivers × $0.35 = <span className="text-white font-semibold">$70/day</span></p>
                  </div>

                  <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-base md:text-lg py-3 px-6">
                    <Link to="/partner-application">Get Started</Link>
                  </Button>
                </CardContent>
                </div>
              </Card>

              {/* Workforce Card */}
              <Card className="relative border-blue-500/30 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${industryWorkforceBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/95" />
                <div className="relative z-10">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-500/30 border border-blue-400/50">
                      <Users className="h-6 w-6 text-blue-300" />
                    </div>
                    <div>
                      <CardTitle className="text-xl md:text-2xl font-bold text-white">👔 Workforce & Staffing</CardTitle>
                      <p className="text-sm text-gray-300">HR, staffing agencies, enterprises</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 border-b border-white/20">
                    <p className="text-3xl md:text-4xl font-bold text-cyan-400">$199–$499<span className="text-base md:text-lg text-gray-300">/mo</span></p>
                    <p className="text-sm text-gray-300">+ per-employee fees</p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm md:text-base font-semibold text-white mb-2">BASE PLATFORM</p>
                    <ul className="text-sm md:text-base space-y-1 text-gray-200">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> HR dashboard</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Employee verification</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Time & attendance</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Zero-trust access</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Training tracking</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Compliance reporting</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm md:text-base font-semibold text-white mb-2">PER-EMPLOYEE FEES</p>
                    <div className="grid grid-cols-2 gap-2 text-sm md:text-base text-gray-200">
                      <div>Active employee/mo: <span className="text-cyan-400 font-semibold">$3–$6</span></div>
                      <div>Background check: <span className="text-cyan-400 font-semibold">$50–$100</span></div>
                      <div>Drug screen: <span className="text-cyan-400 font-semibold">$50–$85</span></div>
                      <div>I-9/E-Verify: <span className="text-cyan-400 font-semibold">$8–$15</span></div>
                      <div className="col-span-2">Continuous monitoring: <span className="text-cyan-400 font-semibold">$5–$10/mo</span></div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-400/40 text-center">
                    <p className="text-sm md:text-base text-blue-300">📝 Example: 200 employees ≈ <span className="font-bold text-white">$1,100/month</span> total</p>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs font-semibold text-amber-400 mb-1">⛽ GAS FEE: $0.15–$0.25/scan</p>
                    <p className="text-xs text-gray-300">Example: 500 employees × $0.20 = <span className="text-white font-semibold">$100/day</span></p>
                  </div>

                  <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-base md:text-lg py-3 px-6">
                    <Link to="/partner-application">Get Started</Link>
                  </Button>
                </CardContent>
                </div>
              </Card>

              {/* Stadium Card */}
              <Card className="relative border-yellow-500/30 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${industryStadiumBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/95" />
                <div className="relative z-10">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-yellow-500/30 border border-yellow-400/50">
                      <Building2 className="h-6 w-6 text-yellow-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl md:text-2xl font-bold text-white">🏟️ Stadium & Arena</CardTitle>
                        <Badge className="bg-yellow-500/30 text-yellow-300 border-yellow-400/50">PREMIUM</Badge>
                      </div>
                      <p className="text-sm text-gray-300">NFL, arenas, large venues</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 border-b border-white/20">
                    <p className="text-3xl md:text-4xl font-bold text-cyan-400">$2,500–$7,500<span className="text-base md:text-lg text-gray-300">/mo</span></p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm md:text-base font-semibold text-white mb-2">HARDWARE INCLUDED</p>
                    <ul className="text-sm md:text-base space-y-1 text-gray-200">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> 2 Desktop Hubs</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> 20 Handhelds</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> 5 Kiosks</li>
                      <li className="text-sm text-gray-400 ml-6">Additional units available</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm md:text-base font-semibold text-white mb-2">SOFTWARE</p>
                    <ul className="text-sm md:text-base space-y-1 text-gray-200">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Enterprise dashboard</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Real-time crowd analytics</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> API access (full)</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Multi-gate management</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> Emergency protocols</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400" /> White-label available</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm md:text-base font-semibold text-white mb-2">💳 TIERED SCAN EVENT PRICING</p>
                    <div className="text-sm md:text-base space-y-1 text-gray-200">
                      <p>0–50K scans/mo: <span className="text-cyan-400 font-semibold">$0.10/scan</span></p>
                      <p>50K–200K scans/mo: <span className="text-cyan-400 font-semibold">$0.06/scan</span></p>
                      <p>200K+ scans/mo: <span className="text-emerald-400 font-semibold">$0.03/scan</span></p>
                      <p className="text-xs text-amber-300 mt-2">Target range: $0.03–$0.10 per Scan Event</p>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm md:text-base font-semibold text-white mb-2">🔐 OPTIONAL VERIFICATION MODULES</p>
                    <div className="text-sm text-gray-200 space-y-1">
                      <p>Standard IDV: <span className="text-cyan-400">$2.00/verify</span></p>
                      <p>Premium + Watchlist: <span className="text-cyan-400">$4.00/verify</span></p>
                      <p className="text-xs text-gray-400">Billed only when used. Stadium pays, not guests.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-400/40 text-center">
                    <p className="text-sm md:text-base text-yellow-300 font-semibold">⚡ Stadium pays for guest scans — NOT the guests</p>
                  </div>

                  <div className="text-center text-sm md:text-base text-gray-300 space-y-1">
                    <p>Support: <span className="text-white">Dedicated Success Team + 24/7/365</span></p>
                    <p>Onboarding: <span className="text-cyan-400 font-semibold">$10,000–$25,000</span></p>
                  </div>

                  <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-base md:text-lg py-3 px-6">
                    <Link to="/partner-application">Contact Sales</Link>
                  </Button>
                </CardContent>
                </div>
              </Card>

              {/* Universities & Education Card */}
              <Card className="relative border-indigo-500/30 overflow-hidden lg:col-span-2">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${industryUniversityBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/95" />
                <div className="relative z-10">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-indigo-500/30 border border-indigo-400/50">
                      <GraduationCap className="h-6 w-6 text-indigo-300" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-xl md:text-2xl font-bold text-white">🎓 Universities & Education</CardTitle>
                        <Badge className="bg-indigo-500/30 text-indigo-300 border-indigo-400/50">ENTERPRISE</Badge>
                      </div>
                      <p className="text-sm md:text-base text-gray-200 font-medium">Know exactly who's on your campus — always</p>
                      <p className="text-xs text-gray-400 mt-1">Also ideal for corporate campuses, HQs, research parks, and business parks ("corporate zones").</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Annual Campus License Tiers */}
                  <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm md:text-base font-semibold text-white mb-3">ANNUAL CAMPUS LICENSE</p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <div>
                          <p className="text-sm md:text-base text-gray-200 font-medium">Small Campus</p>
                          <p className="text-xs text-gray-400">Under 10K students / small corporate campus</p>
                        </div>
                        <p className="text-lg md:text-xl font-bold text-cyan-400">$50K–$100K<span className="text-sm text-gray-300">/yr</span></p>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <div>
                          <p className="text-sm md:text-base text-gray-200 font-medium">Medium Campus</p>
                          <p className="text-xs text-gray-400">10K–30K / mid-size campus or business park</p>
                        </div>
                        <p className="text-lg md:text-xl font-bold text-cyan-400">$100K–$250K<span className="text-sm text-gray-300">/yr</span></p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm md:text-base text-gray-200 font-medium">Large Campus</p>
                          <p className="text-xs text-gray-400">30K+ / multi-campus system or major corporate zone</p>
                        </div>
                        <p className="text-lg md:text-xl font-bold text-cyan-400">$250K–$500K<span className="text-sm text-gray-300">/yr</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Alternative Pricing */}
                  <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm md:text-base font-semibold text-white mb-2">ALTERNATIVE PRICING MODELS</p>
                    <ul className="text-sm md:text-base space-y-1 text-gray-200">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400 flex-shrink-0" /> Per-student / per-person: <span className="text-cyan-400 font-semibold">$5–$15 / person / year</span></li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400 flex-shrink-0" /> Per-building: <span className="text-cyan-400 font-semibold">$500–$2,000 / building / month</span></li>
                    </ul>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Who Gets Verified */}
                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                      <p className="text-sm md:text-base font-semibold text-white mb-2">WHO GETS VERIFIED</p>
                      <ul className="text-sm space-y-1 text-gray-200">
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400 flex-shrink-0" /> Students / Employees: ID verified + watchlist</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400 flex-shrink-0" /> Faculty & Staff: background + monitoring</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400 flex-shrink-0" /> Visitors: real-time screening + temp badges</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400 flex-shrink-0" /> Contractors: credentialed, time-limited</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400 flex-shrink-0" /> Event attendees: football, concerts, graduation</li>
                      </ul>
                    </div>

                    {/* Watchlist Screening */}
                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                      <p className="text-sm md:text-base font-semibold text-white mb-2">WATCHLIST SCREENING</p>
                      <ul className="text-sm space-y-1 text-gray-200">
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-400 flex-shrink-0" /> Terrorist watchlist</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-400 flex-shrink-0" /> Sex offender registry</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-red-400 flex-shrink-0" /> Criminal database</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400 flex-shrink-0" /> Continuous monitoring (alerts if status changes)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Real-time Dashboard */}
                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                      <p className="text-sm md:text-base font-semibold text-white mb-2">REAL-TIME DASHBOARD</p>
                      <ul className="text-sm space-y-1 text-gray-200">
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400 flex-shrink-0" /> Know who's on campus right now</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400 flex-shrink-0" /> Building-by-building tracking</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400 flex-shrink-0" /> Instant alerts for flagged individuals</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-cyan-400 flex-shrink-0" /> Title IX, Clery Act compliance reporting</li>
                      </ul>
                    </div>

                    {/* Hardware Included */}
                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                      <p className="text-sm md:text-base font-semibold text-white mb-2">HARDWARE INCLUDED</p>
                      <ul className="text-sm space-y-1 text-gray-200">
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 flex-shrink-0" /> Entry kiosks</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 flex-shrink-0" /> Handheld scanners</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 flex-shrink-0" /> Building access points</li>
                        <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400 flex-shrink-0" /> Stadium / arena integration</li>
                      </ul>
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm md:text-base font-semibold text-white mb-2">ADD-ONS</p>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-200">
                      <p>Stadium package: <span className="text-cyan-400 font-semibold">+$25K–$75K/yr</span></p>
                      <p>Background checks: <span className="text-cyan-400 font-semibold">$50–$100/check</span></p>
                      <p>Continuous monitoring: <span className="text-cyan-400 font-semibold">$3–$5/person/mo</span></p>
                      <p>Additional kiosks: <span className="text-cyan-400 font-semibold">$1,500 + $200/mo</span></p>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="p-4 rounded-lg bg-indigo-500/20 border border-indigo-400/30">
                    <p className="text-base md:text-lg text-white font-medium italic text-center">
                      "If someone shouldn't be on your campus, you'll know <span className="text-cyan-400 font-bold">BEFORE</span> they walk through the door."
                    </p>
                  </div>

                  <div className="text-center text-sm md:text-base text-gray-300 space-y-1">
                    <p>Support: <span className="text-white">Dedicated Success Team + 24/7/365</span></p>
                    <p>Onboarding: <span className="text-cyan-400 font-semibold">$5,000–$25,000</span> (one-time, based on campus size)</p>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs font-semibold text-amber-400 mb-1">⛽ GAS FEE: $0.05–$0.10/scan</p>
                    <p className="text-xs text-gray-300">Example: 30,000 daily × $0.07 = <span className="text-white font-semibold">$2,100/day</span></p>
                  </div>

                  <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base md:text-lg py-3 px-6">
                    <Link to="/partner-application">Request Campus Assessment</Link>
                  </Button>
                </CardContent>
                </div>
              </Card>
            </div>

          </div>
        </section>

        {/* Additional Industry Cards */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">More Industries</h2>
              <p className="text-muted-foreground">Tailored solutions for every vertical</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Labs & Health - EXPANDED */}
              <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-transparent overflow-hidden md:col-span-2 lg:col-span-3">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-pink-500/20 border border-pink-500/40">
                      <Heart className="h-5 w-5 text-pink-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-foreground">🏥 Labs & Health</CardTitle>
                      <p className="text-sm text-muted-foreground">Two ways to partner with VALID™</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Model 1 - Clinics & Small Labs */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-pink-500/20 text-pink-400 border-pink-500/50">Model 1</Badge>
                      <h4 className="font-semibold text-foreground">For Clinics & Small Labs</h4>
                      <span className="text-xs text-muted-foreground">(They pay us)</span>
                    </div>
                    
                    {/* Tier Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Tier</th>
                            <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Monthly</th>
                            <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Onboarding</th>
                            <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Includes</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/30">
                            <td className="py-2 px-2 text-foreground font-medium">Starter</td>
                            <td className="py-2 px-2 text-emerald-400">$99</td>
                            <td className="py-2 px-2 text-cyan-400">$250</td>
                            <td className="py-2 px-2 text-muted-foreground">API access, 100 verifications, basic certificates</td>
                          </tr>
                          <tr className="border-b border-border/30">
                            <td className="py-2 px-2 text-foreground font-medium">Professional</td>
                            <td className="py-2 px-2 text-emerald-400">$199</td>
                            <td className="py-2 px-2 text-cyan-400">$500</td>
                            <td className="py-2 px-2 text-muted-foreground">Unlimited verification, analytics, white-label certificates</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-2 text-foreground font-medium">Enterprise</td>
                            <td className="py-2 px-2 text-emerald-400">$299</td>
                            <td className="py-2 px-2 text-cyan-400">$1,000</td>
                            <td className="py-2 px-2 text-muted-foreground">Everything in Pro, multi-location, dedicated support</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Per-use Revenue */}
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">PER-USE / REVENUE</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        <p>API verification: <span className="text-cyan-400">$1–$3</span></p>
                        <p>Certificate gen: <span className="text-cyan-400">$2–$5</span></p>
                        <p>Lab test margin: <span className="text-cyan-400">40–60%</span></p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/30 pt-6" />

                  {/* Model 2 - Major Labs */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">Model 2</Badge>
                      <h4 className="font-semibold text-foreground">For Major Labs</h4>
                      <span className="text-xs text-muted-foreground">(Lab Partner Program)</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      We give you access to our verified member network. You pay for placement. We earn commission on orders.
                    </p>
                    
                    {/* Partner Tier Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Partner Tier</th>
                            <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Monthly</th>
                            <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Setup</th>
                            <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Commission</th>
                            <th className="text-left py-2 px-2 text-muted-foreground font-semibold">What You Get</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/30">
                            <td className="py-2 px-2 text-foreground font-medium">Basic Partner</td>
                            <td className="py-2 px-2 text-emerald-400">FREE</td>
                            <td className="py-2 px-2 text-emerald-400">FREE</td>
                            <td className="py-2 px-2 text-amber-400">We earn 20%</td>
                            <td className="py-2 px-2 text-muted-foreground">Listed in lab directory, basic API, member network access</td>
                          </tr>
                          <tr className="border-b border-border/30">
                            <td className="py-2 px-2 text-foreground font-medium">Preferred Partner</td>
                            <td className="py-2 px-2 text-emerald-400">$500</td>
                            <td className="py-2 px-2 text-cyan-400">$500</td>
                            <td className="py-2 px-2 text-amber-400">We earn 25%</td>
                            <td className="py-2 px-2 text-muted-foreground">Featured placement, priority in search, co-branded certs, monthly reports</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-2 text-foreground font-medium">Premium Partner</td>
                            <td className="py-2 px-2 text-emerald-400">$2,000</td>
                            <td className="py-2 px-2 text-cyan-400">$2,000</td>
                            <td className="py-2 px-2 text-amber-400">We earn 30%</td>
                            <td className="py-2 px-2 text-muted-foreground">Exclusive placement, push notifications, dedicated landing page, white-label, account manager</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Why Partner Callout */}
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <p className="text-sm text-emerald-400">
                        💡 <span className="font-semibold">Why partner?</span> Access 10,000+ verified members actively seeking health testing. Premium partners see <span className="text-white font-bold">3× more orders</span> than basic listings.
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border/30 pt-6" />

                  {/* VALID Member Lab Pricing */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-foreground">VALID™ Member Lab Pricing — Exclusive Discounts</h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-border/50">
                            <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Test</th>
                            <th className="text-left py-2 px-2 text-muted-foreground font-semibold">Retail Price</th>
                            <th className="text-left py-2 px-2 text-muted-foreground font-semibold">VALID™ Member</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-border/30">
                            <td className="py-2 px-2 text-foreground">10-Panel Drug Test</td>
                            <td className="py-2 px-2 text-muted-foreground line-through">$50–$85</td>
                            <td className="py-2 px-2 text-emerald-400 font-semibold">$39</td>
                          </tr>
                          <tr className="border-b border-border/30">
                            <td className="py-2 px-2 text-foreground">Basic STD (3-test)</td>
                            <td className="py-2 px-2 text-muted-foreground line-through">$79–$129</td>
                            <td className="py-2 px-2 text-emerald-400 font-semibold">$59</td>
                          </tr>
                          <tr className="border-b border-border/30">
                            <td className="py-2 px-2 text-foreground">Full STD Panel</td>
                            <td className="py-2 px-2 text-muted-foreground line-through">$199–$349</td>
                            <td className="py-2 px-2 text-emerald-400 font-semibold">$149</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-2 text-foreground">Comprehensive Wellness</td>
                            <td className="py-2 px-2 text-muted-foreground line-through">$299–$499</td>
                            <td className="py-2 px-2 text-emerald-400 font-semibold">$199</td>
                          </tr>
                        </tbody>
                    </table>
                    </div>
                    
                    <p className="text-xs text-muted-foreground italic">Our margin: 40–60% on all lab tests.</p>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs font-semibold text-amber-400 mb-1">⛽ GAS FEE: $0.25–$0.50/scan</p>
                    <p className="text-xs text-muted-foreground">Example: 200 patients × $0.35 = <span className="text-foreground font-semibold">$70/day</span></p>
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button asChild className="bg-pink-600 hover:bg-pink-700" size="sm">
                      <Link to="/partner-application">Partner With Us</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-pink-500/50 text-pink-400 hover:bg-pink-500/10" size="sm">
                      <Link to="/lab-portal">View Lab Directory</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10" size="sm">
                      <Link to="/lab-kit-order">Order Test</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Rentals & Exotics */}
              <Card className="relative border-red-500/30 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${industryRentalsBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/95" />
                <div className="relative z-10">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-red-500/30 border border-red-400/50">
                      <Car className="h-6 w-6 text-red-300" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-bold text-white">🚗 Rentals & Exotics</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 border-b border-white/20">
                    <p className="text-3xl md:text-4xl font-bold text-cyan-400">$199–$399<span className="text-base md:text-lg text-gray-300">/mo</span></p>
                    <p className="text-sm md:text-base text-gray-300">+ per-rental fees</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm md:text-base font-semibold text-white mb-2">PER-RENTAL FEES</p>
                    <div className="text-sm md:text-base space-y-2 text-gray-200">
                      <p>Customer ID verification: <span className="text-cyan-400 font-semibold">$5–$10</span></p>
                      <p>Full background check: <span className="text-cyan-400 font-semibold">$50–$100</span></p>
                      <p>Insurance verification: <span className="text-cyan-400 font-semibold">$5–$10</span></p>
                      <p>High-value vetting: <span className="text-cyan-400 font-semibold">$25–$50</span></p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs font-semibold text-amber-400 mb-1">⛽ GAS FEE: $0.50–$1.00/scan</p>
                    <p className="text-xs text-gray-300">Example: 50 rentals × $0.75 = <span className="text-white font-semibold">$37.50/day</span></p>
                  </div>
                  <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-base md:text-lg py-3 px-6">
                    <Link to="/partner-application">Get Started</Link>
                  </Button>
                </CardContent>
                </div>
              </Card>

              {/* Security & Training */}
              <Card className="relative border-slate-500/30 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${industrySecurityBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/95" />
                <div className="relative z-10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-slate-500/30 border border-slate-400/50">
                        <Shield className="h-6 w-6 text-slate-300" />
                      </div>
                      <CardTitle className="text-xl md:text-2xl font-bold text-white">🛡️ Security & Training</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-4 border-b border-white/20">
                      <p className="text-3xl md:text-4xl font-bold text-cyan-400">$199–$399<span className="text-base md:text-lg text-gray-300">/mo</span></p>
                      <p className="text-sm md:text-base text-gray-300">+ per-guard fees</p>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                      <p className="text-sm md:text-base font-semibold text-white mb-2">PER-GUARD FEES</p>
                      <div className="text-sm md:text-base space-y-2 text-gray-200">
                        <p>Active guard/month: <span className="text-cyan-400 font-semibold">$5–$8</span></p>
                        <p>Background check: <span className="text-cyan-400 font-semibold">$50–$100</span></p>
                        <p>License verification: <span className="text-cyan-400 font-semibold">$10–$20</span></p>
                        <p>Continuous monitoring: <span className="text-cyan-400 font-semibold">$5–$10/mo</span></p>
                    </div>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <p className="text-xs font-semibold text-amber-400 mb-1">⛽ GAS FEE: $0.20–$0.35/scan</p>
                      <p className="text-xs text-gray-300">Example: 200 guards × $0.25 = <span className="text-white font-semibold">$50/day</span></p>
                    </div>
                    <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-base md:text-lg py-3 px-6">
                      <Link to="/partner-application">Get Started</Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>

              {/* Events & Festivals */}
              <Card className="relative border-orange-500/30 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${industryEventsBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/95" />
                <div className="relative z-10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-orange-500/30 border border-orange-400/50">
                        <Ticket className="h-6 w-6 text-orange-300" />
                      </div>
                      <CardTitle className="text-xl md:text-2xl font-bold text-white">🎪 Events & Festivals</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center py-4 border-b border-white/20">
                      <p className="text-3xl md:text-4xl font-bold text-cyan-400">$499–$2,500<span className="text-base md:text-lg text-gray-300">/event</span></p>
                    </div>
                    <div className="text-sm md:text-base space-y-2 text-gray-200">
                      <p>Single Day: <span className="text-cyan-400 font-semibold">$499–$999</span> (5 handhelds) — $2,500 onboarding</p>
                      <p>Multi-Day: <span className="text-cyan-400 font-semibold">$1,500–$2,500</span> (10 handhelds) — $5,000 onboarding</p>
                      <p>Festival: <span className="text-cyan-400 font-semibold">Custom</span> — $10,000+ onboarding</p>
                    </div>
                    <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                      <p className="text-sm md:text-base font-semibold text-white mb-2">PER-ATTENDEE FEES</p>
                      <div className="text-sm md:text-base space-y-2 text-gray-200">
                        <p>Per scan: <span className="text-cyan-400 font-semibold">$0.10–$0.25</span></p>
                        <p>VIP verification: <span className="text-cyan-400 font-semibold">$2–$5</span></p>
                        <p>Vendor/staff check: <span className="text-cyan-400 font-semibold">$5–$10</span></p>
                        <p>GHOST™ Pass split: <span className="text-cyan-400 font-semibold">30/30/10/30</span></p>
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <p className="text-xs font-semibold text-amber-400 mb-1">⛽ GAS FEE: $0.10–$0.20/scan</p>
                      <p className="text-xs text-gray-300">Example: 25,000 attendees × $0.15 = <span className="text-white font-semibold">$3,750/event</span></p>
                    </div>
                    <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-base md:text-lg py-3 px-6">
                      <Link to="/partner-application">Contact Sales</Link>
                    </Button>
                  </CardContent>
                </div>
              </Card>

              {/* Hospitality */}
              <Card className="relative border-teal-500/30 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${industryHospitalityBg})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/85 to-black/95" />
                <div className="relative z-10">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-teal-500/30 border border-teal-400/50">
                      <Hotel className="h-6 w-6 text-teal-300" />
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-bold text-white">🏨 Hospitality</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 border-b border-white/20">
                    <p className="text-3xl md:text-4xl font-bold text-cyan-400">$199–$599<span className="text-base md:text-lg text-gray-300">/mo</span></p>
                    <p className="text-sm md:text-base text-gray-300">+ per-guest fees</p>
                  </div>
                  <div className="p-3 rounded-lg bg-black/40 border border-white/10">
                    <p className="text-sm md:text-base font-semibold text-white mb-2">PER-GUEST FEES</p>
                    <div className="text-sm md:text-base space-y-2 text-gray-200">
                      <p>Guest verification: <span className="text-cyan-400 font-semibold">$1–$3/check-in</span></p>
                      <p>VIP recognition: <span className="text-cyan-400 font-semibold">$2–$5</span></p>
                      <p>Amenity access: <span className="text-cyan-400 font-semibold">$0.50–$1/scan</span></p>
                      <p>Health badge verify: <span className="text-cyan-400 font-semibold">$35–$75</span></p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-xs font-semibold text-amber-400 mb-1">⛽ GAS FEE: $0.25–$0.50/scan</p>
                    <p className="text-xs text-gray-300">Example: 500 guests × $0.35 = <span className="text-white font-semibold">$175/day</span></p>
                  </div>
                  <Button asChild className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-base md:text-lg py-3 px-6">
                    <Link to="/partner-application">Get Started</Link>
                  </Button>
                </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* How Pricing Works Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">💡 How VALID™ Pricing Works</h2>
              <p className="text-muted-foreground">Simple formula, transparent costs</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-10">
                <div className="flex flex-col items-center p-4 md:p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/30 min-w-[140px]">
                  <div className="p-3 rounded-full bg-cyan-500/20 mb-2">
                    <FileText className="h-6 w-6 text-cyan-400" />
                  </div>
                  <p className="text-xs text-muted-foreground">STEP 1</p>
                  <p className="font-semibold text-foreground text-sm md:text-base">Base Platform Fee</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
                <div className="flex flex-col items-center p-4 md:p-6 rounded-xl bg-purple-500/10 border border-purple-500/30 min-w-[140px]">
                  <div className="p-3 rounded-full bg-purple-500/20 mb-2">
                    <Monitor className="h-6 w-6 text-purple-400" />
                  </div>
                  <p className="text-xs text-muted-foreground">STEP 2</p>
                  <p className="font-semibold text-foreground text-sm md:text-base">Hardware</p>
                  <p className="text-xs text-muted-foreground">(lease or buy)</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
                <div className="flex flex-col items-center p-4 md:p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 min-w-[140px]">
                  <div className="p-3 rounded-full bg-emerald-500/20 mb-2">
                    <Users className="h-6 w-6 text-emerald-400" />
                  </div>
                  <p className="text-xs text-muted-foreground">STEP 3</p>
                  <p className="font-semibold text-foreground text-sm md:text-base">Usage Fees</p>
                  <p className="text-xs text-muted-foreground">(per scan/tx)</p>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
                <div className="flex flex-col items-center p-4 md:p-6 rounded-xl bg-amber-500/10 border border-amber-500/30 min-w-[140px]">
                  <div className="p-3 rounded-full bg-amber-500/20 mb-2">
                    <Calendar className="h-6 w-6 text-amber-400" />
                  </div>
                  <p className="text-xs text-muted-foreground">STEP 4</p>
                  <p className="font-semibold text-foreground text-sm md:text-base">Onboarding</p>
                  <p className="text-xs text-muted-foreground">(one-time)</p>
                </div>
              </div>

              <div className="text-center p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-emerald-500/10 border border-cyan-500/30">
                <p className="text-lg font-semibold text-foreground mb-2">= YOUR TOTAL MONTHLY COST</p>
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-center">
                <p className="text-lg md:text-xl text-emerald-400 font-semibold">
                  💰 NIGHTLIFE VENUES: Your GHOST™ Pass earnings often <span className="text-white">EXCEED</span> your costs!
                </p>
                <p className="text-muted-foreground mt-2">Most venues <span className="text-emerald-400 font-semibold">PROFIT</span> from VALID™.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-background via-cyan-500/5 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Not sure which package?</h2>
              <p className="text-muted-foreground mb-8">Our team will help you find the perfect solution for your operation.</p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Button asChild size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                  <a href="https://calendly.com/steve-bevalid/30min" target="_blank" rel="noopener noreferrer">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule a Call
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                  <Link to="/partner-application">
                    <FileText className="h-4 w-4 mr-2" />
                    Get Custom Quote
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">
                  <Link to="/auth">
                    Start Free Trial
                  </Link>
                </Button>
              </div>

              <p className="text-muted-foreground">
                Or contact us: <a href="mailto:sales@bevalid.app" className="text-cyan-400 hover:underline">sales@bevalid.app</a>
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Pricing;
