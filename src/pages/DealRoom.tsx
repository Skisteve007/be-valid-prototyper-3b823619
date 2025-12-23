import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { AlertTriangle, Target, Cpu, Wallet, Eye, Zap, Users, Plane, Check, Loader2, Video, CheckCircle, Circle, Calendar, MapPin, Clock, DollarSign, Crosshair, Beer, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MISSION_TARGET = 50000;

const commitmentLevels = [
  {
    id: "scout",
    title: "THE SCOUT",
    amount: 1000,
    perks: ["Access to Jan 15 Command Briefing"],
    icon: Eye,
  },
  {
    id: "operator",
    title: "THE OPERATOR",
    amount: 5000,
    perks: ["2X Warrant (Get $10k back in Q2)", "Inner Circle Access"],
    icon: Zap,
    featured: true,
  },
  {
    id: "whale",
    title: "THE WHALE",
    amount: 15000,
    perks: ["3X Warrant", "SF Trip Co-Pilot Status"],
    icon: Plane,
  },
];

// Seed contribution
const SEED_CONTRIBUTIONS = [
  {
    name: "Steve",
    amount: 2000,
    breakdown: "Micro Patent Registration, Print Work, Paid Developer Support, JP Morgan Tickets, SF Travel & Return",
  },
];

const DealRoom = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [contributions, setContributions] = useState<Array<{ name: string; amount: number; breakdown?: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
  });

  // Fetch contributions from investor_leads
  useEffect(() => {
    const fetchContributions = async () => {
      const { data, error } = await supabase
        .from("investor_leads")
        .select("name, tranche_interest")
        .ilike("tranche_interest", "deal_room_%");

      if (!error && data) {
        const dbContributions = data.map((lead) => {
          const amountMatch = lead.tranche_interest.match(/\$(\d+)/);
          const amount = amountMatch ? parseInt(amountMatch[1], 10) : 0;
          return { name: lead.name, amount };
        });
        setContributions(dbContributions);
      }
    };
    fetchContributions();
  }, []);

  // Calculate total raised (seed + db contributions)
  const seedTotal = SEED_CONTRIBUTIONS.reduce((sum, c) => sum + c.amount, 0);
  const dbTotal = contributions.reduce((sum, c) => sum + c.amount, 0);
  const currentRaised = seedTotal + dbTotal;

  // Simulate loading animation for the progress bar
  const [displayedRaised, setDisplayedRaised] = useState(0);

  useEffect(() => {
    // Animate the progress bar on load
    const timer = setTimeout(() => {
      setDisplayedRaised(currentRaised);
    }, 500);
    return () => clearTimeout(timer);
  }, [currentRaised]);

  const handleTierSelect = (tierId: string, amount: number) => {
    setSelectedTier(tierId);
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // First save to investor_leads
      const { error: dbError } = await supabase.from("investor_leads").insert({
        name: formData.name,
        email: formData.email,
        tranche_interest: `deal_room_${selectedTier}_$${formData.amount}`,
        accredited_confirmed: true,
      });

      if (dbError) {
        console.error("DB error:", dbError);
      }

      // Then redirect to Stripe payment
      const { data, error } = await supabase.functions.invoke("create-deal-room-payment", {
        body: {
          name: formData.name,
          email: formData.email,
          amount: parseInt(formData.amount, 10),
          tier: selectedTier,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        toast.success("Redirecting to Payment", {
          description: "Complete your investment in the new tab.",
        });
        setIsModalOpen(false);
        setFormData({ name: "", email: "", amount: "" });
        setSelectedTier(null);
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Transmission Failed", {
        description: "Please try again or contact command.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Helmet>
        <title>THE DEAL ROOM | VALID™</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* HEADER - TOP SECRET BANNER */}
      <header className="border-b border-[#00FFFF]/20 bg-black/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-center gap-3 py-2 bg-gradient-to-r from-black via-red-950/20 to-black border-b border-red-500/30">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
          <span className="font-mono text-xs sm:text-sm text-red-500 tracking-[0.2em] uppercase">
            RESTRICTED ACCESS // LEVEL 5 CLEARANCE
          </span>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
          </span>
        </div>
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center tracking-wider">
            <span className="text-[#00FFFF]">OPERATION</span>{" "}
            <span className="text-white">SAN FRANCISCO</span>
          </h1>
          <p className="text-center font-mono text-sm text-[#00FFFF]/70 mt-2 tracking-widest">
            // TACTICAL BRIDGE //
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* THE WAR CHEST - Progress Bar + Scorecard */}
        <section className="max-w-3xl mx-auto">
          <Card className="bg-black/50 border border-[#00FFFF]/30 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#00FFFF]/5 via-transparent to-[#00FFFF]/5 pointer-events-none" />
            <CardHeader className="pb-2">
              <CardTitle className="text-[#00FFFF] font-mono text-sm tracking-widest flex items-center gap-2">
                <Target className="h-4 w-4" />
                MISSION CAPITAL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Progress 
                  value={(displayedRaised / MISSION_TARGET) * 100} 
                  className="h-8 bg-gray-900 border border-[#00FFFF]/20 rounded-sm overflow-hidden"
                />
                <div 
                  className="absolute inset-0 h-8 rounded-sm transition-all duration-1000 ease-out"
                  style={{
                    width: `${(displayedRaised / MISSION_TARGET) * 100}%`,
                    background: "linear-gradient(90deg, #00FFFF, #00CED1)",
                    boxShadow: "0 0 20px #00FFFF, 0 0 40px #00FFFF50",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-sm text-white font-bold drop-shadow-lg">
                    {((displayedRaised / MISSION_TARGET) * 100).toFixed(1)}% SECURED
                  </span>
                </div>
              </div>
              <div className="flex justify-between font-mono text-sm">
                <span className="text-gray-400">
                  CURRENT: <span className="text-[#00FFFF]">${displayedRaised.toLocaleString()}</span>
                </span>
                <span className="text-gray-400">
                  TARGET: <span className="text-white">${MISSION_TARGET.toLocaleString()}</span>
                </span>
              </div>

              {/* SCORECARD */}
              <div className="border-t border-[#00FFFF]/20 pt-4 mt-4">
                <h3 className="font-mono text-xs text-[#00FFFF] tracking-widest mb-3 flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  MISSION BACKERS
                </h3>
                <div className="space-y-2">
                  {/* Seed Contributions */}
                  {SEED_CONTRIBUTIONS.map((contrib, idx) => (
                    <div key={`seed-${idx}`} className="flex items-start gap-3 p-3 bg-gray-900/50 rounded border border-[#00FFFF]/20">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00FFFF]/20 border border-[#00FFFF]/50 flex items-center justify-center">
                        <span className="text-[#00FFFF] font-bold text-sm">{contrib.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono text-white font-bold text-sm">{contrib.name}</span>
                          <span className="font-mono text-[#00FFFF] font-bold text-sm">${contrib.amount.toLocaleString()}</span>
                        </div>
                        {contrib.breakdown && (
                          <p className="font-mono text-xs text-gray-400 mt-1 leading-relaxed">{contrib.breakdown}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {/* DB Contributions */}
                  {contributions.map((contrib, idx) => (
                    <div key={`db-${idx}`} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded border border-gray-700">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-800 border border-gray-600 flex items-center justify-center">
                        <span className="text-gray-400 font-bold text-sm">{contrib.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="font-mono text-gray-300 text-sm">{contrib.name}</span>
                        <span className="font-mono text-[#00FFFF] font-bold text-sm">${contrib.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  {contributions.length === 0 && (
                    <p className="font-mono text-xs text-gray-500 text-center py-2">
                      Be the next to join the mission...
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* MISSION LOGISTICS - Tactical Breakdown */}
        <section className="max-w-3xl mx-auto">
          <Card className="bg-black/50 border border-[#00FFFF]/30">
            <CardHeader>
              <CardTitle className="text-[#00FFFF] font-mono text-sm tracking-widest flex items-center gap-2">
                <Target className="h-4 w-4" />
                MISSION LOGISTICS (STAGE $15K → $50K)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* PRIORITY ONE - Glowing urgent item */}
              <div className="flex items-start gap-3 font-mono text-sm p-3 rounded border border-yellow-500/50 bg-yellow-500/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 animate-pulse pointer-events-none" />
                <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" style={{ filter: "drop-shadow(0 0 8px #facc15)" }} />
                <div className="relative z-10">
                  <span className="text-yellow-400 font-bold">⚡ PRIORITY ONE:</span>{" "}
                  <span className="text-white font-bold">UI/UX "WIZARD" BUILD ($3,500)</span>
                  <p className="text-gray-300 mt-1 text-xs">
                    Retaining top-tier Creative Developer for the "Iron Man" Chrome Extension Interface + High-Fidelity Motion Video for the SF Pitch.
                  </p>
                  <span className="inline-block mt-1 text-xs text-red-400 font-bold tracking-wider animate-pulse">
                    🔴 HIRING IMMEDIATELY
                  </span>
                </div>
              </div>

              {/* PRIORITY TWO - Glowing urgent item */}
              <div className="flex items-start gap-3 font-mono text-sm p-3 rounded border border-yellow-500/50 bg-yellow-500/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 animate-pulse pointer-events-none" />
                <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" style={{ filter: "drop-shadow(0 0 8px #facc15)" }} />
                <div className="relative z-10">
                  <span className="text-yellow-400 font-bold">⚡ PRIORITY TWO:</span>{" "}
                  <span className="text-white font-bold">LEAD FULL STACK DESIGNER & DEVELOPER ($3,500)</span>
                  <p className="text-gray-300 mt-1 text-xs">
                    Needed to take the helm of our platform. End-to-end ownership of product design and engineering.
                  </p>
                  <span className="inline-block mt-1 text-xs text-red-400 font-bold tracking-wider animate-pulse">
                    🔴 HIRING IMMEDIATELY
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-sm">
                <span className="text-xl">📦</span>
                <span className="text-gray-300">
                  <span className="text-white font-bold">ASSET PREP:</span> Strategic Maps & Playbooks (Printing at FedEx).
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-sm">
                <span className="text-xl">🏨</span>
                <span className="text-gray-300">
                  <span className="text-white font-bold">DEPLOYMENT:</span> Command Center Suite (St. Regis/W Hotel).
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-sm">
                <span className="text-xl">✈️</span>
                <span className="text-gray-300">
                  <span className="text-white font-bold">STRIKE TEAM:</span> Grillo, Chris, John (Boots on ground).
                </span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* THE INVITE TEXT */}
        <section className="max-w-3xl mx-auto">
          <Card className="bg-gradient-to-r from-[#00FFFF]/10 via-black to-[#00FFFF]/10 border border-[#00FFFF]/50">
            <CardContent className="py-6">
              <p className="text-center font-mono text-sm sm:text-base text-gray-200 leading-relaxed">
                "This is a <span className="text-[#00FFFF] font-bold">Strategic Strike</span>. We aren't just asking for capital; we are building a coalition. If you back this mission, you are welcome to fly out and <span className="text-[#00FFFF] font-bold">join the raid</span>. We will be in the room with the targets."
              </p>
            </CardContent>
          </Card>
        </section>

        {/* THE INTEL - Bullet Points */}
        <section className="max-w-3xl mx-auto">
          <Card className="bg-black/50 border border-[#00FFFF]/30">
            <CardHeader>
              <CardTitle className="text-[#00FFFF] font-mono text-sm tracking-widest flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                THE INTEL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-start gap-4 p-4 bg-gray-900/50 rounded border border-gray-800">
                  <Target className="h-6 w-6 text-[#00FFFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wide">Mission</h3>
                    <p className="font-mono text-sm text-gray-300">
                      Deploy to SF (J.P. Morgan Week) to audit Series B companies.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-900/50 rounded border border-gray-800">
                  <Cpu className="h-6 w-6 text-[#00FFFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wide">The Tech</h3>
                    <p className="font-mono text-sm text-gray-300">
                      SYNTH™ (Patent Pending) - Multi-Agent Consensus Engine.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-900/50 rounded border border-gray-800">
                  <Wallet className="h-6 w-6 text-[#00FFFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-white uppercase tracking-wide">The Asset</h3>
                    <p className="font-mono text-sm text-gray-300">
                      VALID - Universal Lifestyle Wallet.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* HUNTER'S ITINERARY - 3-Day Battle Plan */}
        <section className="max-w-4xl mx-auto">
          <Card className="bg-black/50 border border-[#00FFFF]/30 overflow-hidden">
            <CardHeader className="border-b border-[#00FFFF]/20">
              <CardTitle className="text-[#00FFFF] font-mono text-sm tracking-widest flex items-center gap-2">
                <Crosshair className="h-4 w-4" />
                HUNTER'S ITINERARY
              </CardTitle>
              <p className="font-mono text-xs text-gray-400 mt-2">
                We are treating this like a military operation. We aren't wandering around; we are hitting specific targets who have recently raised massive Series B/C rounds and are terrified of AI liability. These companies have $100M+ in the bank and need "Safety" to go public.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* THE ASK */}
              <div className="p-4 bg-gradient-to-r from-[#00FFFF]/10 via-transparent to-[#00FFFF]/10 border border-[#00FFFF]/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <DollarSign className="h-6 w-6 text-[#00FFFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-mono text-[#00FFFF] font-bold tracking-wide">THE ASK: $250,000 "Sovereign Audit" Pilot</h3>
                    <p className="font-mono text-sm text-white mt-1 italic">
                      "You have $200M. One AI hallucination lawsuit kills you. We are your insurance."
                    </p>
                  </div>
                </div>
              </div>

              {/* 3-Day Battle Plan Header */}
              <div className="text-center py-2">
                <h3 className="font-mono text-white font-bold tracking-widest text-lg">3-DAY BATTLE PLAN</h3>
                <p className="font-mono text-xs text-[#00FFFF]">JANUARY 12–14, 2026</p>
              </div>

              {/* DAY 1 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-yellow-500/30">
                  <Calendar className="h-5 w-5 text-yellow-400" />
                  <div>
                    <h4 className="font-mono text-yellow-400 font-bold tracking-wide">DAY 1: MONDAY, JAN 12</h4>
                    <p className="font-mono text-xs text-gray-400">Focus: Generative AI Leaders (The ones most at risk of lying)</p>
                  </div>
                </div>

                {/* Target 1 */}
                <div className="pl-4 border-l-2 border-[#00FFFF]/30 space-y-3">
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-[#00FFFF]" />
                      <span className="font-mono text-xs text-[#00FFFF]">09:00 AM</span>
                      <span className="font-mono text-white font-bold">TARGET 1: AMBIENCE HEALTHCARE</span>
                    </div>
                    <div className="space-y-1 font-mono text-xs">
                      <p className="text-gray-300"><span className="text-yellow-400">The Intel:</span> They just raised $243M. They build an "AI Operating System" for hospitals. If their AI messes up a diagnosis code, they are finished.</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Who:</span> Mike Ng (CEO) or Nikhil Buduma (Chief Scientist)</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Location:</span> Westin St. Francis Lobby (The "Zoo")</p>
                      <p className="text-white mt-2 italic">"You guys are the OS. But who is auditing the OS? We provide the safety layer."</p>
                    </div>
                  </div>

                  {/* Target 2 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-[#00FFFF]" />
                      <span className="font-mono text-xs text-[#00FFFF]">12:00 PM</span>
                      <span className="font-mono text-white font-bold">TARGET 2: ABIRIDGE</span>
                    </div>
                    <div className="space-y-1 font-mono text-xs">
                      <p className="text-gray-300"><span className="text-yellow-400">The Intel:</span> Raised $316M. They record doctor-patient conversations. Privacy and accuracy are their entire business.</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Who:</span> Dr. Shivdev Rao (CEO)</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Location:</span> Union Square Coffee (Intercept)</p>
                      <p className="text-white mt-2 italic">"Your AI summarizes medical advice. If it hallucinates a prescription, you get sued. Synth fixes that."</p>
                    </div>
                  </div>

                  {/* Target 3 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-[#00FFFF]" />
                      <span className="font-mono text-xs text-[#00FFFF]">03:00 PM</span>
                      <span className="font-mono text-white font-bold">TARGET 3: HIPPOCRATIC AI</span>
                    </div>
                    <div className="space-y-1 font-mono text-xs">
                      <p className="text-gray-300"><span className="text-yellow-400">The Intel:</span> They are obsessed with "Safety-First LLMs." They raised $50M+. Their entire brand is safety. They need a third-party audit to prove it.</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Who:</span> Munjal Shah (CEO)</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Location:</span> St. Regis Bar</p>
                      <p className="text-white mt-2 italic">"You claim safety. We prove it. Let us run a 'Sovereign Audit' on your model for $250k."</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DAY 2 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-green-500/30">
                  <Calendar className="h-5 w-5 text-green-400" />
                  <div>
                    <h4 className="font-mono text-green-400 font-bold tracking-wide">DAY 2: TUESDAY, JAN 13</h4>
                    <p className="font-mono text-xs text-gray-400">Focus: Medical Data & Research (Where accuracy is worth billions)</p>
                  </div>
                </div>

                <div className="pl-4 border-l-2 border-[#00FFFF]/30 space-y-3">
                  {/* Target 4 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-red-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-500 text-white font-mono text-[10px] px-2 py-0.5 tracking-wider">
                      #1 TARGET
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-[#00FFFF]" />
                      <span className="font-mono text-xs text-[#00FFFF]">09:00 AM</span>
                      <span className="font-mono text-white font-bold">TARGET 4: OPENEVIDENCE</span>
                    </div>
                    <div className="space-y-1 font-mono text-xs">
                      <p className="text-gray-300"><span className="text-yellow-400">The Intel:</span> Raised $210M (Series B). They are the "Google for Doctors." If they give a doctor the wrong answer, patients die.</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Who:</span> Daniel Nadler (Founder)</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Location:</span> Four Seasons Lobby</p>
                      <p className="text-white mt-2 italic">"You are the source of truth. We are the verification of truth. Partner with us."</p>
                    </div>
                  </div>

                  {/* Target 5 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-[#00FFFF]" />
                      <span className="font-mono text-xs text-[#00FFFF]">12:00 PM</span>
                      <span className="font-mono text-white font-bold">TARGET 5: TENNR</span>
                    </div>
                    <div className="space-y-1 font-mono text-xs">
                      <p className="text-gray-300"><span className="text-yellow-400">The Intel:</span> Raised $101M. They automate messy medical faxes and documents. High error rate potential.</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Who:</span> Trey Holterman (CEO)</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Location:</span> JPM Conference Floor</p>
                      <p className="text-white mt-2 italic">"We can clean your error rates by 99% using multi-agent consensus."</p>
                    </div>
                  </div>

                  {/* Target 6 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-[#00FFFF]" />
                      <span className="font-mono text-xs text-[#00FFFF]">03:00 PM</span>
                      <span className="font-mono text-white font-bold">TARGET 6: FORMATION BIO</span>
                    </div>
                    <div className="space-y-1 font-mono text-xs">
                      <p className="text-gray-300"><span className="text-yellow-400">The Intel:</span> Raised $372M. They use AI to run drug trials.</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Who:</span> Benjamine Liu (CEO)</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Location:</span> Private Suite / Meeting Room</p>
                      <p className="text-white mt-2 italic">"FDA compliance requires 100% accuracy. Our 'Senate' architecture guarantees it."</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* DAY 3 */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-purple-500/30">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  <div>
                    <h4 className="font-mono text-purple-400 font-bold tracking-wide">DAY 3: WEDNESDAY, JAN 14</h4>
                    <p className="font-mono text-xs text-gray-400">Focus: The VC Whales (Selling the Equity, not the Contract)</p>
                  </div>
                </div>

                <div className="pl-4 border-l-2 border-[#00FFFF]/30 space-y-3">
                  {/* Target 7 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-[#00FFFF]" />
                      <span className="font-mono text-xs text-[#00FFFF]">09:00 AM</span>
                      <span className="font-mono text-white font-bold">TARGET 7: ANDREESSEN HOROWITZ (A16Z BIO)</span>
                    </div>
                    <div className="space-y-1 font-mono text-xs">
                      <p className="text-gray-300"><span className="text-yellow-400">The Intel:</span> They led almost every round listed above. They are heavily exposed to AI risk.</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Who:</span> Vijay Pande (General Partner)</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Location:</span> The St. Regis (They usually rent a whole floor)</p>
                      <p className="text-white mt-2 italic">"You have $1B invested in AI Health. You have no insurance against hallucination liability. We are that insurance."</p>
                    </div>
                  </div>

                  {/* Target 8 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-[#00FFFF]" />
                      <span className="font-mono text-xs text-[#00FFFF]">12:00 PM</span>
                      <span className="font-mono text-white font-bold">TARGET 8: KHOSLA VENTURES</span>
                    </div>
                    <div className="space-y-1 font-mono text-xs">
                      <p className="text-gray-300"><span className="text-yellow-400">The Intel:</span> Vinod Khosla loves "impossible" tech. They backed OpenAI early.</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Who:</span> Alex Morgan (Partner)</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Location:</span> InterContinental Hotel</p>
                      <p className="text-white mt-2 italic">"We aren't building another model. We are building the brakes for the models you already own."</p>
                    </div>
                  </div>

                  {/* Closing Drink */}
                  <div className="p-3 bg-gradient-to-r from-purple-900/30 via-transparent to-purple-900/30 rounded border border-purple-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <Beer className="h-4 w-4 text-purple-400" />
                      <span className="font-mono text-xs text-purple-400">03:00 PM</span>
                      <span className="font-mono text-white font-bold">THE CLOSING DRINK</span>
                    </div>
                    <div className="space-y-1 font-mono text-xs">
                      <p className="text-gray-300"><span className="text-[#00FFFF]">Location:</span> The St. Regis Lobby Bar</p>
                      <p className="text-gray-300"><span className="text-yellow-400">Mission:</span> This is where "The Boys" assemble. We invite the targets we met earlier to come have a drink with us. This is where you close the $250k deals on a handshake.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* LOGISTICS */}
              <div className="border-t border-[#00FFFF]/20 pt-6 space-y-4">
                <h4 className="font-mono text-[#00FFFF] font-bold tracking-widest flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  LOGISTICS FOR "THE BOYS"
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Shirt className="h-4 w-4 text-[#00FFFF]" />
                      <span className="font-mono text-white font-bold text-sm">Dress Code</span>
                    </div>
                    <p className="font-mono text-xs text-gray-300">
                      "Billionaire Casual." No suits. Cashmere sweaters, dark jeans, expensive boots. Look like you already made it.
                    </p>
                  </div>
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-[#00FFFF]" />
                      <span className="font-mono text-white font-bold text-sm">The "Deal Room"</span>
                    </div>
                    <p className="font-mono text-xs text-gray-300">
                      Keep the Lovable link ready on your phone. If a VC gets interested, you don't send a deck. You text them the link to the "Vault."
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* THE DEAL STRUCTURE - Commitment Levels */}
        <section className="max-w-5xl mx-auto">
          <h2 className="text-center font-mono text-[#00FFFF] text-sm tracking-widest mb-6 flex items-center justify-center gap-2">
            <Users className="h-4 w-4" />
            COMMITMENT LEVELS
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {commitmentLevels.map((tier) => {
              const IconComponent = tier.icon;
              return (
                <Card
                  key={tier.id}
                  onClick={() => handleTierSelect(tier.id, tier.amount)}
                  className={`bg-black/50 border cursor-pointer transition-all duration-300 hover:scale-105 group relative overflow-hidden ${
                    tier.featured
                      ? "border-[#00FFFF] shadow-[0_0_30px_#00FFFF30]"
                      : "border-gray-700 hover:border-[#00FFFF]/50"
                  }`}
                >
                  {tier.featured && (
                    <div className="absolute top-0 right-0 bg-[#00FFFF] text-black font-mono text-xs px-3 py-1 tracking-wider">
                      POPULAR
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#00FFFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-3 p-3 rounded-full bg-gray-900 border border-[#00FFFF]/30 group-hover:border-[#00FFFF] transition-colors">
                      <IconComponent className="h-8 w-8 text-[#00FFFF]" />
                    </div>
                    <CardTitle className="text-white font-bold tracking-wide">
                      {tier.title}
                    </CardTitle>
                    <div className="text-3xl font-mono text-[#00FFFF] font-bold">
                      ${tier.amount.toLocaleString()}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {tier.perks.map((perk, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check className="h-4 w-4 text-[#00FFFF] flex-shrink-0" />
                        <span className="font-mono">{perk}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ACTION BUTTONS */}
        <section className="text-center py-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => setIsModalOpen(true)}
              className="relative bg-[#00FFFF] hover:bg-[#00CED1] text-black font-bold text-lg px-12 py-6 h-auto tracking-wider uppercase transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: "0 0 30px #00FFFF, 0 0 60px #00FFFF50",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                SECURE ALLOCATION
              </span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.open("https://calendly.com/validnetwork", "_blank")}
              className="border-[#00FFFF] text-[#00FFFF] hover:bg-[#00FFFF]/10 font-bold text-lg px-8 py-6 h-auto tracking-wider uppercase transition-all duration-300 hover:scale-105 bg-transparent"
            >
              <Video className="h-5 w-5 mr-2" />
              REQUEST GROUP BRIEFING (VIDEO)
            </Button>
          </div>
          <p className="font-mono text-xs text-gray-500 mt-4 tracking-wide">
            // HANDSHAKE AGREEMENT • NO PROSPECTUS REQUIRED //
          </p>
        </section>

        {/* CONFIDENTIAL FOOTER */}
        <footer className="border-t border-red-500/30 pt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-red-500 font-mono text-xs tracking-widest">
            <AlertTriangle className="h-4 w-4" />
            CONFIDENTIAL • FRIENDS & FAMILY ONLY
            <AlertTriangle className="h-4 w-4" />
          </div>
        </footer>
      </main>

      {/* ALLOCATION FORM MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-black border border-[#00FFFF]/50 text-white max-w-md top-[25%] translate-y-[-25%]">
          <DialogHeader>
            <DialogTitle className="text-[#00FFFF] font-mono tracking-widest text-center">
              SECURE YOUR ALLOCATION
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center font-mono text-xs">
              Complete transmission to confirm commitment
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label className="font-mono text-xs text-[#00FFFF] tracking-wider">OPERATIVE NAME</Label>
              <Input
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-gray-900 border-gray-700 focus:border-[#00FFFF] text-white font-mono"
                placeholder="Enter your name"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs text-[#00FFFF] tracking-wider">SECURE CHANNEL (EMAIL)</Label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-gray-900 border-gray-700 focus:border-[#00FFFF] text-white font-mono"
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-mono text-xs text-[#00FFFF] tracking-wider">COMMITMENT AMOUNT ($)</Label>
              <Input
                required
                type="number"
                min="1000"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                className="bg-gray-900 border-gray-700 focus:border-[#00FFFF] text-white font-mono"
                placeholder="1000"
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00FFFF] hover:bg-[#00CED1] text-black font-bold tracking-wider uppercase"
              style={{
                boxShadow: "0 0 20px #00FFFF50",
              }}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  CONFIRM TRANSMISSION
                </>
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DealRoom;
