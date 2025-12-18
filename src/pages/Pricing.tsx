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
  MonitorSmartphone
} from "lucide-react";
import ResponsiveHeader from "@/components/ResponsiveHeader";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
        <meta name="description" content="Transparent pricing that scales with your business. Base platform + hardware + per-user fees." />
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
                Per-User Fees
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

        {/* Vertical Pricing Cards */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Choose Your Industry</h2>
              <p className="text-muted-foreground">Select the package tailored for your operation</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Nightlife Card with Tabs */}
              <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-transparent overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/40">
                      <PartyPopper className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">🎤 Nightlife & Entertainment</CardTitle>
                      <p className="text-sm text-muted-foreground">Clubs, bars, lounges, venues</p>
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
                      <div className="text-center py-4 border-b border-border/50">
                        <p className="text-3xl font-bold text-emerald-400">$99<span className="text-lg text-muted-foreground">/mo</span></p>
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

                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center">
                    <p className="text-sm text-emerald-400 font-semibold">💰 Earn 30% on every GHOST™ Pass sold!</p>
                  </div>

                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link to="/partner-application">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Transportation Card */}
              <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-transparent overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40">
                      <Truck className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">🚛 Transportation & Logistics</CardTitle>
                      <p className="text-sm text-muted-foreground">Fleets, delivery, rideshare</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 border-b border-border/50">
                    <p className="text-3xl font-bold text-emerald-400">$99–$299<span className="text-lg text-muted-foreground">/mo</span></p>
                    <p className="text-sm text-muted-foreground">+ per-driver fees</p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">BASE PLATFORM</p>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Fleet dashboard</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Driver verification</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Compliance reporting</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Vehicle access control</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">PER-DRIVER FEES</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Active driver/mo: <span className="text-cyan-400">$5–$8</span></div>
                      <div>Background check: <span className="text-cyan-400">$50–$100</span></div>
                      <div>MVR: <span className="text-cyan-400">$15–$25</span></div>
                      <div>DOT drug screen: <span className="text-cyan-400">$50–$85</span></div>
                      <div className="col-span-2">Continuous monitoring: <span className="text-cyan-400">$5–$10/mo</span></div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                    <p className="text-xs text-amber-400">📝 Example: 100 drivers ≈ <span className="font-bold text-white">$800–$1,000/month</span> total</p>
                  </div>

                  <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
                    <Link to="/partner-application">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Workforce Card */}
              <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/5 to-transparent overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/40">
                      <Users className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-foreground">👔 Workforce & Staffing</CardTitle>
                      <p className="text-sm text-muted-foreground">HR, staffing agencies, enterprises</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 border-b border-border/50">
                    <p className="text-3xl font-bold text-emerald-400">$199–$499<span className="text-lg text-muted-foreground">/mo</span></p>
                    <p className="text-sm text-muted-foreground">+ per-employee fees</p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">BASE PLATFORM</p>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> HR dashboard</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Employee verification</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Time & attendance</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Zero-trust access</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Training tracking</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Compliance reporting</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">PER-EMPLOYEE FEES</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>Active employee/mo: <span className="text-cyan-400">$3–$6</span></div>
                      <div>Background check: <span className="text-cyan-400">$50–$100</span></div>
                      <div>Drug screen: <span className="text-cyan-400">$50–$85</span></div>
                      <div>I-9/E-Verify: <span className="text-cyan-400">$8–$15</span></div>
                      <div className="col-span-2">Continuous monitoring: <span className="text-cyan-400">$5–$10/mo</span></div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-center">
                    <p className="text-xs text-blue-400">📝 Example: 200 employees ≈ <span className="font-bold text-white">$1,100/month</span> total</p>
                  </div>

                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link to="/partner-application">Get Started</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Stadium Card */}
              <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/40">
                      <Building2 className="h-6 w-6 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-xl text-foreground">🏟️ Stadium & Arena</CardTitle>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">PREMIUM</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">NFL, arenas, large venues</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-4 border-b border-border/50">
                    <p className="text-3xl font-bold text-emerald-400">$2,500–$7,500<span className="text-lg text-muted-foreground">/mo</span></p>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">HARDWARE INCLUDED</p>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> 2 Desktop Hubs</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> 20 Handhelds</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> 5 Kiosks</li>
                      <li className="text-xs text-muted-foreground ml-6">Additional units available</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">SOFTWARE</p>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Enterprise dashboard</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Real-time crowd analytics</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> API access (full)</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Multi-gate management</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> Emergency protocols</li>
                      <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-400" /> White-label available</li>
                    </ul>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">PRICING OPTIONS</p>
                    <div className="text-sm space-y-1">
                      <p>Per-scan: <span className="text-cyan-400">$0.10–$0.50</span> (volume-based)</p>
                      <p className="text-muted-foreground">OR flat monthly fee</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-center">
                    <p className="text-sm text-yellow-400 font-semibold">⚡ Stadium pays for guest scans — NOT the guests</p>
                  </div>

                  <div className="text-center text-sm text-muted-foreground space-y-1">
                    <p>Support: <span className="text-foreground">Dedicated Success Team + 24/7/365</span></p>
                    <p>Onboarding: <span className="text-cyan-400">$10,000–$25,000</span></p>
                  </div>

                  <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                    <Link to="/partner-application">Contact Sales</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-16">
              <p className="text-muted-foreground mb-4">Need a custom solution?</p>
              <Button asChild variant="outline" size="lg" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10">
                <Link to="/partner-application">Talk to Our Team</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Pricing;
