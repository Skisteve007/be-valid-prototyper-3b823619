import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { 
  ArrowLeft, 
  Globe, 
  TrendingUp, 
  Clock, 
  QrCode,
  Building2,
  DollarSign,
  Target,
  Zap,
  ArrowRight,
  Check,
  X,
  ShieldCheck,
  Lock,
  Share2,
  Network,
  Crown,
  XCircle,
  CheckCircle2,
  Users,
  Plane,
  Car,
  Briefcase,
  Heart,
  Rocket,
  Ghost,
  Fingerprint,
  Radio,
  Phone,
  AlertTriangle,
  ChevronDown,
  FileText
} from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";

const PitchDeck = () => {
  const navigate = useNavigate();
  const [futureReadyText, setFutureReadyText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const futureText = '2027 FUTURE READY';
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= futureText.length) {
        setFutureReadyText(futureText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150);
    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const metrics = [
    { label: "Partner Venues", value: "28+", icon: Building2, color: "text-cyan-400" },
    { label: "Countries", value: "11", icon: Globe, color: "text-green-400" },
    { label: "Verification Speed", value: "3 sec", icon: Clock, color: "text-purple-400" },
    { label: "Member Growth", value: "15%", subtext: "MoM", icon: TrendingUp, color: "text-orange-400" },
  ];

  const scorecardData = [
    { feature: "Integrated Health/Tox Status (HIPAA)", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: true, eventbrite: false, dice: false, highlight: true },
    { feature: "Zero-Trust Backend Security", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, highlight: true },
    { feature: "Automated Revenue Share", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, highlight: true },
    { feature: "Peer-to-Peer Network Trust", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, highlight: true },
    { feature: "Frictionless Staff Workflow", valid: true, clear: true, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, dice: true },
    { feature: "Rolling Compliance & Screening", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: true, eventbrite: false, dice: false },
    { feature: "In-App Wallet Payments", valid: true, clear: false, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, dice: true },
    { feature: "Digital Identity Verification", valid: true, clear: true, idme: true, ticketmaster: true, sterling: true, stdcheck: false, eventbrite: true, dice: true },
    { feature: "FBO Instant Payout", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, highlight: true },
    { feature: "Viral Identity & Beacon", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, highlight: true },
  ];

  const validScore = scorecardData.filter(r => r.valid).length;

  const renderCheck = (value: boolean, isValid?: boolean) => {
    if (value) {
      return <Check className={`h-4 w-4 mx-auto ${isValid ? 'text-cyan-400' : 'text-green-500'}`} />;
    }
    return <X className="h-4 w-4 mx-auto text-red-500/50" />;
  };

  // Section divider component for consistent styling
  const SectionDivider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-4 py-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <span className="text-xs tracking-[4px] uppercase text-gray-500">{label}</span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-cyan-500 selection:text-black relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
      
      {/* Background Atmosphere */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/partners')}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Partner Solutions
          </Button>
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold font-orbitron tracking-[0.2em] text-white drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
              VALID<sup className="text-xs text-cyan-400">™</sup>
            </span>
            <Button 
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
              onClick={() => window.open("mailto:invest@bevalid.app", "_blank")}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12 relative z-10 max-w-6xl">
        
        {/* ===== HERO SECTION ===== */}
        <section className="text-center py-6">
          <img src={logo} alt="VALID" className="h-32 md:h-40 mx-auto mb-6 rounded-xl shadow-[0_0_40px_rgba(0,240,255,0.2)]" />
          
          <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 px-4 py-1 text-xs tracking-[2px]">
            CONFIDENTIAL — INVESTOR ONLY
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-orbitron">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500">
              INVESTOR DECK
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-6">
            Zero-Trust Identity & Payment Infrastructure
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-sm mb-6">
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-gray-400">TAM:</span>
              <span className="text-white font-bold ml-2">$5.7B+</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-gray-400">Tranche 1:</span>
              <span className="text-cyan-400 font-bold ml-2">$200K Note</span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="text-gray-400">Stage:</span>
              <span className="text-green-400 font-bold ml-2">Revenue Generating</span>
            </div>
          </div>

          {/* Trust & Compliance Pills */}
          <div className="bg-gradient-to-r from-cyan-500/5 via-green-500/5 to-amber-500/5 border border-white/10 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                <span className="text-cyan-400 text-xs font-bold">SOC 2</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                <span className="text-green-400 text-xs font-bold">GDPR</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
                <span className="text-amber-400 text-xs font-bold">Enterprise Trust</span>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Built for SOC 2 + GDPR readiness to win government and healthcare contracts.
            </p>
          </div>
        </section>

        {/* ===== CORE INSIGHT ===== */}
        <section>
          <div className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border border-cyan-500/20 rounded-xl p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="h-6 w-6 text-cyan-400" />
              <h2 className="text-xl font-bold font-orbitron text-white">Core Insight</h2>
            </div>
            
            <blockquote className="text-lg md:text-xl text-gray-300 italic border-l-4 border-cyan-500 pl-4 mb-4">
              "We're not another data company. We're the privacy-first pipeline that venues trust and consumers love."
            </blockquote>
            
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
              <h4 className="text-cyan-400 font-bold mb-1 text-sm tracking-[2px] uppercase">Pipeline, Not Vault</h4>
              <p className="text-gray-300 text-sm">
                We verify in real-time, grant access, then purge. Your data is never stored—privacy by architecture.
              </p>
            </div>
          </div>
        </section>

        <SectionDivider label="Proof" />

        {/* ===== PILLAR A: PROOF ===== */}
        <section className="space-y-8">
          <div className="text-center">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 mb-2">PILLAR A</Badge>
            <h2 className="text-2xl font-bold font-orbitron">Proof: Traction & Why Now</h2>
          </div>

          {/* Current Traction */}
          <div>
            <h3 className="text-sm tracking-[2px] uppercase text-gray-500 mb-4 text-center">Current Traction</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {metrics.map((metric, idx) => (
                <Card key={idx} className="bg-black/40 border-white/10 hover:border-cyan-500/30 transition-all">
                  <CardContent className="p-4 text-center">
                    <metric.icon className={`h-6 w-6 mx-auto mb-2 ${metric.color}`} />
                    <div className="text-2xl font-bold text-white">{metric.value}</div>
                    {metric.subtext && <div className="text-xs text-gray-500">{metric.subtext}</div>}
                    <div className="text-xs text-gray-400 mt-1">{metric.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Value Drivers - Condensed */}
          <div>
            <h3 className="text-sm tracking-[2px] uppercase text-gray-500 mb-4 text-center">Value Drivers</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-black/40 border border-amber-500/30 rounded-lg p-4">
                <Ghost className="h-6 w-6 text-amber-400 mb-2" />
                <h4 className="font-bold text-white mb-1">Ghost™ Token</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• 3-in-1: Payment + ID + Health</li>
                  <li>• Self-destructing encryption</li>
                </ul>
              </div>
              <div className="bg-black/40 border border-purple-500/30 rounded-lg p-4">
                <Lock className="h-6 w-6 text-purple-400 mb-2" />
                <h4 className="font-bold text-white mb-1">Regulatory Moat</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• 18+ months to replicate</li>
                  <li>• HIPAA + Payment rails</li>
                </ul>
              </div>
              <div className="bg-black/40 border border-green-500/30 rounded-lg p-4">
                <Network className="h-6 w-6 text-green-400 mb-2" />
                <h4 className="font-bold text-white mb-1">Network Effects</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• 3.2x organic referral rate</li>
                  <li>• Every QR is marketing</li>
                </ul>
              </div>
            </div>
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="more-drivers" className="border-white/10">
                <AccordionTrigger className="text-sm text-gray-400 hover:text-white">
                  <span className="flex items-center gap-2">
                    <ChevronDown className="h-4 w-4" />
                    View all 6 value drivers
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-3 gap-4 pt-4">
                    <div className="bg-black/40 border border-blue-500/30 rounded-lg p-4">
                      <ShieldCheck className="h-6 w-6 text-blue-400 mb-2" />
                      <h4 className="font-bold text-white mb-1">Liability Transfer</h4>
                      <p className="text-xs text-gray-400">$0 venue liability exposure</p>
                    </div>
                    <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-4">
                      <Zap className="h-6 w-6 text-cyan-400 mb-2" />
                      <h4 className="font-bold text-white mb-1">FBO Settlement</h4>
                      <p className="text-xs text-gray-400">0 sec settlement time</p>
                    </div>
                    <div className="bg-black/40 border border-red-500/30 rounded-lg p-4">
                      <Lock className="h-6 w-6 text-red-400 mb-2" />
                      <h4 className="font-bold text-white mb-1">Zero-Trust</h4>
                      <p className="text-xs text-gray-400">0 raw PII stored</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <SectionDivider label="Moat" />

        {/* ===== PILLAR B: MOAT ===== */}
        <section className="space-y-6">
          <div className="text-center">
            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50 mb-2">PILLAR B</Badge>
            <h2 className="text-2xl font-bold font-orbitron">The Thesis: Four Truths</h2>
            <p className="text-gray-500 text-sm mt-1">Why VALID is inevitable</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { num: "01", title: "We Own the Trust Layer", text: "Every high-stakes interaction requires portable, instant trust verification." },
              { num: "02", title: "Platform, Not Product", text: "Kits and checks are on-ramps. The verified network is the moat." },
              { num: "03", title: "Revenue Compounds", text: "Venues → members → wallets → venues. Flywheel, not funnel." },
              { num: "04", title: "Regulation is Our Friend", text: "As liability laws tighten, we become mandatory infrastructure." },
            ].map((item, idx) => (
              <div key={idx} className="bg-black/40 border border-white/10 rounded-lg p-4 hover:border-purple-500/30 transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-xl font-bold text-purple-500/50 font-orbitron">{item.num}</span>
                  <div>
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-400">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <SectionDivider label="Distribution" />

        {/* ===== PILLAR C: DISTRIBUTION ===== */}
        <section className="space-y-6">
          <div className="text-center">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 mb-2">PILLAR C</Badge>
            <h2 className="text-2xl font-bold font-orbitron">Distribution: Zero-CAC Growth Engine</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-black/40 border border-amber-500/30 rounded-lg p-5">
              <h4 className="font-bold text-amber-400 mb-3 text-sm tracking-[1px] uppercase">Why We Don't Pay for Marketing</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Decentralized promoter army sells for us</li>
                <li>• Every QR share is organic distribution</li>
              </ul>
            </div>
            <div className="bg-black/40 border border-cyan-500/30 rounded-lg p-5">
              <h4 className="font-bold text-cyan-400 mb-3 text-sm tracking-[1px] uppercase">Account Promoters</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• 10% of Access Pass (off top)</li>
                <li>• Optional spend commissions (venue-paid)</li>
              </ul>
            </div>
            <div className="bg-black/40 border border-green-500/30 rounded-lg p-5">
              <h4 className="font-bold text-green-400 mb-3 text-sm tracking-[1px] uppercase">Revenue Pool Distribution</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Smart-Split at point of sale</li>
                <li>• Weekly pro-rata venue payouts</li>
              </ul>
            </div>
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="waterfall" className="border-white/10">
              <AccordionTrigger className="text-sm text-gray-400 hover:text-white">
                View Revenue Waterfall & Pool Charts
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid lg:grid-cols-2 gap-6 pt-4">
                  <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-4">
                    <h5 className="text-sm font-bold text-white mb-2">Stage 1: Revenue Waterfall ($100 sale)</h5>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Promoter', value: 10 },
                          { name: 'VALID™', value: 60 },
                          { name: 'Venue Pool', value: 30 },
                        ]}>
                          <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 10 }} axisLine={{ stroke: '#374151' }} />
                          <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
                          <Bar dataKey="value">
                            <Cell fill="#f59e0b" />
                            <Cell fill="#22d3ee" />
                            <Cell fill="#22c55e" />
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-black/40 border border-green-500/20 rounded-xl p-4">
                    <h5 className="text-sm font-bold text-white mb-2">Stage 2: Venue Pool Split ($30)</h5>
                    <div className="h-[200px] w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Venue A', value: 7.5 },
                              { name: 'Venue B', value: 7.5 },
                              { name: 'Venue C', value: 7.5 },
                              { name: 'Venue D', value: 7.5 },
                            ]}
                            cx="50%" cy="50%" innerRadius={40} outerRadius={70}
                            dataKey="value" paddingAngle={3}
                          >
                            <Cell fill="#06b6d4" />
                            <Cell fill="#8b5cf6" />
                            <Cell fill="#f59e0b" />
                            <Cell fill="#ec4899" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">$30</div>
                          <div className="text-xs text-gray-400">POOL</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        <SectionDivider label="Economics & Defensibility" />

        {/* ===== PILLAR D: ECONOMICS & DEFENSIBILITY ===== */}
        <section className="space-y-8">
          <div className="text-center">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 mb-2">PILLAR D</Badge>
            <h2 className="text-2xl font-bold font-orbitron">Economics & Defensibility</h2>
          </div>

          {/* Margin Density */}
          <div className="bg-gradient-to-r from-cyan-950/30 to-purple-950/30 border border-cyan-500/20 rounded-xl p-5">
            <h3 className="font-bold text-white mb-3">Margin Density (IDaaS)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-cyan-400">60%</div>
                <div className="text-xs text-gray-500">Gross Margin</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">$0</div>
                <div className="text-xs text-gray-500">CAC</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">3.2x</div>
                <div className="text-xs text-gray-500">Viral K-Factor</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">0 sec</div>
                <div className="text-xs text-gray-500">Settlement</div>
              </div>
            </div>
          </div>

          {/* Competitive Moat */}
          <div>
            <h3 className="font-bold text-white mb-3">Why Competitors Can't Win</h3>
            <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                <span className="font-bold text-white">VALID: 10/10 Integration Score</span>
              </div>
              <p className="text-sm text-gray-400">Identity + Health + Payments + Access + Network + Compliance. No competitor scores above 4/10.</p>
            </div>
            
            {/* Scrollable scorecard on mobile */}
            <Accordion type="single" collapsible>
              <AccordionItem value="scorecard" className="border-white/10">
                <AccordionTrigger className="text-sm text-gray-400 hover:text-white">
                  View Full Competitive Scorecard
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto bg-black/40 rounded-lg border border-white/10 mt-2">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-white/5 text-white">
                          <th className="p-2 text-left">Feature</th>
                          <th className="p-2 text-center text-cyan-400">VALID</th>
                          <th className="p-2 text-center text-gray-500">CLEAR</th>
                          <th className="p-2 text-center text-gray-500">ID.me</th>
                          <th className="p-2 text-center text-gray-500">TICKETMASTER</th>
                          <th className="p-2 text-center text-gray-500">STERLING</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scorecardData.slice(0, 6).map((row, idx) => (
                          <tr key={idx} className="border-b border-white/5">
                            <td className="p-2 text-gray-300">{row.feature}</td>
                            <td className="p-2 text-center">{renderCheck(row.valid, true)}</td>
                            <td className="p-2 text-center">{renderCheck(row.clear)}</td>
                            <td className="p-2 text-center">{renderCheck(row.idme)}</td>
                            <td className="p-2 text-center">{renderCheck(row.ticketmaster)}</td>
                            <td className="p-2 text-center">{renderCheck(row.sterling)}</td>
                          </tr>
                        ))}
                        <tr className="bg-white/5 font-bold">
                          <td className="p-2 text-white">TOTAL</td>
                          <td className="p-2 text-center text-cyan-400">{validScore}/10</td>
                          <td className="p-2 text-center text-gray-500">2/10</td>
                          <td className="p-2 text-center text-gray-500">1/10</td>
                          <td className="p-2 text-center text-gray-500">3/10</td>
                          <td className="p-2 text-center text-gray-500">1/10</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Roadmap to 2027 */}
          <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-6 text-center">
            <h3 className="text-sm tracking-[2px] uppercase text-cyan-400 mb-2">Roadmap to 2027</h3>
            <p className="text-2xl md:text-3xl font-bold text-white font-orbitron mb-2">
              {futureReadyText}
              <span className={`inline-block w-[3px] h-[1em] bg-cyan-400 ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
            </p>
            <p className="text-gray-400 text-sm">Your Spatial Verification Partner</p>
            
            <Accordion type="single" collapsible className="mt-4 text-left">
              <AccordionItem value="roadmap" className="border-white/10">
                <AccordionTrigger className="text-sm text-gray-400 hover:text-white justify-center">
                  Beyond the QR: Sensing Roadmap
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-3 gap-4 pt-4">
                    <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-lg p-4">
                      <Zap className="h-5 w-5 text-cyan-400 mb-2" />
                      <h4 className="font-bold text-white text-sm">UWB</h4>
                      <p className="text-xs text-gray-400">Zero-click access. Phone stays in pocket.</p>
                    </div>
                    <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-4">
                      <Radio className="h-5 w-5 text-purple-400 mb-2" />
                      <h4 className="font-bold text-white text-sm">NFC Type-F</h4>
                      <p className="text-xs text-gray-400">0.1 sec tap. Stadium-ready.</p>
                    </div>
                    <div className="bg-green-950/30 border border-green-500/30 rounded-lg p-4">
                      <Fingerprint className="h-5 w-5 text-green-400 mb-2" />
                      <h4 className="font-bold text-white text-sm">Bio-Hash</h4>
                      <p className="text-xs text-gray-400">You are the wallet. No phone needed.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <SectionDivider label="Investment" />

        {/* ===== USE OF FUNDS ===== */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold font-orbitron text-white">Use of Funds</h2>
            <p className="text-sm text-gray-500">Tranche 1: $200,000</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { category: "Sales & Marketing", percent: 40, outcome: "First 50 venues", color: "bg-cyan-500" },
              { category: "Product Dev", percent: 30, outcome: "UWB + NFC integration", color: "bg-purple-500" },
              { category: "Operations", percent: 20, outcome: "Team scale to 5", color: "bg-green-500" },
              { category: "Reserve", percent: 10, outcome: "12-month runway buffer", color: "bg-orange-500" },
            ].map((item, idx) => (
              <div key={idx} className="bg-black/40 border border-white/10 rounded-lg p-4 text-center">
                <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center text-black font-bold mx-auto mb-2`}>
                  {item.percent}%
                </div>
                <h4 className="font-bold text-white text-sm">{item.category}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.outcome}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== CURRENT ROUND STRUCTURE ===== */}
        <section className="bg-black py-12">
          <div className="text-center mb-10">
            <h2 className="text-sm tracking-[4px] uppercase mb-2" style={{ color: '#00E5E5' }}>
              CURRENT ROUND STRUCTURE
            </h2>
            <p className="text-base text-white font-light">
              Two tranches. &nbsp; Strategic positioning. &nbsp; Limited allocation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* TRANCHE 1 */}
            <div 
              className="relative p-6 rounded-xl transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(0, 229, 229, 0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 30px rgba(0, 229, 229, 0.1)',
              }}
            >
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs tracking-[2px] uppercase mb-4"
                style={{ background: 'rgba(0, 229, 229, 0.15)', border: '1px solid #00E5E5', color: '#00E5E5' }}
              >
                <span className="w-2 h-2 rounded-full bg-[#00E5E5] animate-pulse" />
                ACTIVE
              </div>
              
              <div className="mb-6">
                <p className="text-xs tracking-[3px] uppercase mb-1" style={{ color: '#00E5E5' }}>TRANCHE 1</p>
                <h3 className="text-xl font-semibold text-white">Launch Round (Friends & Family)</h3>
              </div>
              
              <div className="space-y-0 mb-6 text-sm">
                {[
                  { label: "Raise", value: "$200,000" },
                  { label: "Instrument", value: "Convertible Note" },
                  { label: "Valuation Cap", value: "$6,000,000", highlight: true },
                  { label: "Discount", value: "50%" },
                  { label: "Maturity", value: "18 months" },
                  { label: "Close", value: "Rolling (target Q3 2026)" },
                ].map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-white/10">
                    <span style={{ color: '#A0A0A0' }}>{row.label}</span>
                    <span className={row.highlight ? "font-semibold" : "font-semibold text-white"} style={row.highlight ? { color: '#00E5E5' } : {}}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-r-lg mb-4" style={{ background: 'rgba(0, 229, 229, 0.08)', borderLeft: '3px solid #00E5E5' }}>
                <p className="text-xs tracking-[1px] uppercase mb-1" style={{ color: '#00E5E5' }}>EARLY ADVANTAGE</p>
                <p className="text-sm text-white">50% discount with $6M cap before institutional round.</p>
              </div>

              <Button 
                className="w-full py-5 rounded-lg font-semibold text-black"
                style={{ background: '#00E5E5', boxShadow: '0 0 20px rgba(0, 229, 229, 0.4)' }}
                onClick={() => navigate('/partner-application')}
              >
                RESERVE ALLOCATION →
              </Button>
            </div>

            {/* TRANCHE 2 */}
            <div 
              className="relative p-6 rounded-xl opacity-70 hover:opacity-100 transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div 
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs tracking-[2px] uppercase mb-4"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#A0A0A0' }}
              >
                <Clock className="w-3 h-3" />
                OPENS UPON T1 CLOSE
              </div>
              
              <div className="mb-6">
                <p className="text-xs tracking-[3px] uppercase mb-1" style={{ color: '#00E5E5' }}>TRANCHE 2</p>
                <h3 className="text-xl font-semibold text-white">Series Seed</h3>
              </div>
              
              <div className="space-y-0 mb-6 text-sm">
                {[
                  { label: "Target Raise", value: "$1,500,000" },
                  { label: "Instrument", value: "Priced Equity Round" },
                  { label: "Valuation Cap", value: "$12,000,000", highlight: true },
                  { label: "Minimum Check", value: "$50,000" },
                  { label: "Status", value: "Pending T1 Close", dim: true },
                ].map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-white/10">
                    <span style={{ color: '#A0A0A0' }}>{row.label}</span>
                    <span className={row.highlight ? "font-semibold" : row.dim ? "" : "font-semibold text-white"} style={row.highlight ? { color: '#00E5E5' } : row.dim ? { color: '#A0A0A0' } : {}}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-r-lg" style={{ background: 'rgba(255, 255, 255, 0.03)', borderLeft: '3px solid rgba(255, 255, 255, 0.2)' }}>
                <p className="text-xs tracking-[1px] uppercase mb-1" style={{ color: '#00E5E5' }}>COMPARISON</p>
                <p className="text-sm text-white">T1 investors get $6M lower cap with 50% discount.</p>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-600">Source of truth: Deal Room terms</p>
        </section>

        {/* ===== LIQUIDITY & ROI (Accordion) ===== */}
        <section>
          <Accordion type="single" collapsible>
            <AccordionItem value="liquidity" className="border border-white/10 rounded-xl bg-black/40">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <span className="text-lg font-bold text-white">Liquidity & Returns (Expanded)</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-black/60 border border-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🚀</div>
                    <h4 className="text-xs tracking-[1px] uppercase text-cyan-400 mb-2">The Exit Strategy</h4>
                    <p className="text-sm text-gray-300">Acquisition target: Fintech (Block, Stripe), Insurance, or Hospitality. Target outcome: strategic acquisition or major growth event. Timeline: 3–5 years <span className="text-gray-500">(not guaranteed)</span>.</p>
                  </div>
                  <div className="bg-black/60 border border-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <h4 className="text-xs tracking-[1px] uppercase text-cyan-400 mb-2">Dividend Distributions</h4>
                    <p className="text-sm text-gray-300">VALID™ is a pipeline, not a burn machine. We intend to distribute a portion of Net Transaction Fees to equity holders once operations are stable <span className="text-gray-500">(subject to board approval)</span>.</p>
                  </div>
                  <div className="bg-black/60 border border-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🔄</div>
                    <h4 className="text-xs tracking-[1px] uppercase text-cyan-400 mb-2">Secondary Market</h4>
                    <p className="text-sm text-gray-300">Tranche 1 investors may have the option to sell shares in future secondary transactions <span className="text-gray-500">(subject to company approval and buyer availability)</span>.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* ===== RISK DISCLOSURES (Accordion with Summary) ===== */}
        <section>
          <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="risk" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span className="font-bold text-amber-500">Important Risk Disclosures</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {/* 3-bullet summary */}
                  <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-4 mb-4">
                    <ul className="text-sm text-amber-200 space-y-1">
                      <li>• High-risk speculative investment—you may lose your entire investment</li>
                      <li>• Convertible Note converts on qualifying event or at 18-month maturity</li>
                      <li>• Illiquid investment with indefinite holding period</li>
                    </ul>
                  </div>
                  
                  {/* Full text */}
                  <div className="space-y-4 text-sm text-gray-300">
                    <div>
                      <h5 className="font-bold text-amber-400 mb-1">1. Speculative Investment</h5>
                      <p>Investment in Valid™ (via Giant Ventures, LLC) is highly speculative and involves a high degree of risk. This opportunity is suitable only for persons who can afford to lose their entire investment.</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-amber-400 mb-1">2. Convertible Note Terms</h5>
                      <p>Tranche 1 funds are contributed via Convertible Note with 18-month maturity, $6,000,000 valuation cap, and 50% discount. The Note converts to equity upon a qualifying financing event or at maturity.</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-amber-400 mb-1">3. No Personal Guarantee</h5>
                      <p>The investment is made solely into the corporate entity. Recourse is limited strictly to the assets of the Company.</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-amber-400 mb-1">4. Indefinite Holding Period</h5>
                      <p>This is an illiquid investment. Investors may not be able to sell or transfer their equity for an indefinite period.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <SectionDivider label="Founder" />

        {/* ===== FOUNDER ===== */}
        <section>
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-cyan-950/30 border border-cyan-500/20 rounded-xl p-6 md:p-8">
            <div className="flex justify-center mb-4">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 px-4 py-1 text-xs tracking-[2px] uppercase">
                THE FOUNDER
              </Badge>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white font-orbitron mb-1">
                STEVEN GRILLO
              </h2>
              <p className="text-sm text-cyan-400 tracking-[2px] uppercase">
                Founder & Chief Architect
              </p>
            </div>
            
            {/* 3 Credibility Bullets */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-black/40 rounded-lg">
                <div className="text-xl font-bold text-white">35+</div>
                <div className="text-xs text-gray-400">Years Execution</div>
              </div>
              <div className="text-center p-3 bg-black/40 rounded-lg">
                <div className="text-xl font-bold text-white">Multi-Exit</div>
                <div className="text-xs text-gray-400">Operator</div>
              </div>
              <div className="text-center p-3 bg-black/40 rounded-lg">
                <div className="text-xl font-bold text-white">AI-Native</div>
                <div className="text-xs text-gray-400">Builder</div>
              </div>
            </div>

            <p className="text-gray-300 text-center text-sm mb-4">
              Self-made operator who scaled multiple businesses from zero to exit. Deep expertise in operations, risk management, and high-liability sectors.
            </p>

            <Accordion type="single" collapsible>
              <AccordionItem value="bio" className="border-white/10">
                <AccordionTrigger className="text-sm text-gray-400 hover:text-white justify-center">
                  Full Bio
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="border-l-4 border-cyan-500/50 pl-4">
                      <h4 className="text-cyan-400 font-bold mb-1">The Background</h4>
                      <p className="text-sm text-gray-300">53 years of life. 35 years of execution. Bridged hard infrastructure with high-stakes regulation. Career built on tangible results, not theory.</p>
                    </div>
                    <div className="border-l-4 border-cyan-500/50 pl-4">
                      <h4 className="text-cyan-400 font-bold mb-1">The Operator</h4>
                      <p className="text-sm text-gray-300">Veteran of the real economy. Deep mastery of Operations and Risk Management. Translates complex market necessities into revenue-generating systems.</p>
                    </div>
                    <div className="border-l-4 border-cyan-500/50 pl-4">
                      <h4 className="text-cyan-400 font-bold mb-1">The Architect</h4>
                      <p className="text-sm text-gray-300">Pioneer of Synthesized AI Methodology. Commands a symphony of AI agents—delivering in 300 hours what teams fail to deliver in a year.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 text-center mt-4">
              <p className="text-lg text-white font-bold italic">
                "Experience cannot be coded. It must be lived."
              </p>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="text-center py-8">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-2 font-orbitron">Ready to Discuss?</h3>
            <p className="text-gray-400 mb-6 text-sm">Schedule a direct call with our founding team.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                onClick={() => window.open('https://calendly.com/steve-bevalid/30min', '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                Book a 30-Minute Call
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-full"
                onClick={() => window.open('mailto:invest@bevalid.app?subject=Data Room Request', '_blank')}
              >
                <FileText className="mr-2 h-5 w-5" />
                Request Data Room
              </Button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default PitchDeck;
