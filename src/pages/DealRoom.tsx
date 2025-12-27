import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { AlertTriangle, Target, Cpu, Wallet, Eye, Zap, Users, Plane, Check, Loader2, Video, CheckCircle, Circle, Calendar, MapPin, Clock, DollarSign, Crosshair, Beer, Crown } from "lucide-react";
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
    <div className="min-h-screen bg-black text-white overflow-hidden pt-32 sm:pt-24 md:pt-16">
      <Helmet>
        <title>THE DEAL ROOM | VALID™</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

       {/* THE INVITE TEXT - Strategic Strike */}
       <section className="container mx-auto px-4 pt-6 pb-6 max-w-3xl">
         <Card className="bg-gradient-to-r from-[#00FFFF]/10 via-black to-[#00FFFF]/10 border border-[#00FFFF]/50">
           <CardContent className="py-6">
             <p className="text-center font-mono text-sm sm:text-base text-gray-200 leading-relaxed">
               "This is a <span className="text-[#00FFFF] font-bold">Strategic Strike</span>. We aren't just asking for capital; we are building a coalition. If you back this mission, you are welcome to fly out and <span className="text-[#00FFFF] font-bold">join the raid</span>. We will be in the room with the targets."
             </p>
           </CardContent>
         </Card>
       </section>

       {/* HEADER - TOP SECRET BANNER */}
      <header className="border-b border-[#00FFFF]/20 bg-black/90 backdrop-blur-sm sticky top-32 sm:top-24 md:top-16 z-50">
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

        {/* WHY $250K - DETAILED ALLOCATION */}
        <section className="max-w-3xl mx-auto">
          <Card className="bg-black/50 border border-red-500/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-[#00FFFF]/5 pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-red-400 font-mono text-sm tracking-widest flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                WHY WE NEED $250,000 - TACTICAL ALLOCATION
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="font-mono text-xs text-gray-400 border-b border-gray-800 pb-3">
                Every dollar has a mission. Here's exactly where the capital deploys:
              </p>
              
              {/* PRE-DEPLOYMENT */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs text-[#00FFFF] tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00FFFF] rounded-full animate-pulse" />
                  PRE-DEPLOYMENT
                </h4>
                <div className="grid gap-2 pl-4">
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-gray-900/50 rounded border border-gray-800 opacity-50 line-through">
                    <span className="text-gray-500">Patent Provisional Filing</span>
                    <span className="text-gray-500">$2,500 ✅ PAID (Steve)</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
                    <span className="text-gray-300">UI/UX Designer</span>
                    <span className="text-yellow-400 font-bold">$3,000</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
                    <span className="text-gray-300">Full Stack Designer</span>
                    <span className="text-yellow-400 font-bold">$3,000</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
                    <span className="text-gray-300">Builder & Backend Motion Graphics</span>
                    <span className="text-yellow-400 font-bold">$2,000</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-yellow-500/10 rounded border border-yellow-500/30">
                    <span className="text-gray-300">Security Expert — Jovianna (Cybersecurity Consultant)</span>
                    <span className="text-yellow-400 font-bold">$5,000</span>
                  </div>
                </div>
                <p className="font-mono text-xs text-gray-500 pl-4 italic">
                  Security Expert Contact: Jovianna — [Details TBD]
                </p>
              </div>

              {/* COMMAND CENTER */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs text-purple-400 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  COMMAND CENTER (St. Regis San Francisco)
                </h4>
                <div className="grid gap-2 pl-4">
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-purple-500/10 rounded border border-purple-500/30">
                    <span className="text-gray-300">Command Center @ St. Regis</span>
                    <span className="text-purple-400 font-bold">$5,000</span>
                  </div>
                </div>
              </div>

              {/* OPERATIONS TEAM */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs text-green-400 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  OPERATIONS TEAM
                </h4>
                <div className="grid gap-2 pl-4">
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-gray-900/50 rounded border border-gray-800">
                    <span className="text-gray-300">Air Strike Team</span>
                    <span className="text-[#00FFFF] font-bold">$4,000</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-gray-900/50 rounded border border-gray-800">
                    <span className="text-gray-300">J.P. Morgan Conference Tickets</span>
                    <span className="text-[#00FFFF] font-bold">$3,500</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-gray-900/50 rounded border border-gray-800">
                    <span className="text-gray-300">Ground Transportation & Logistics</span>
                    <span className="text-[#00FFFF] font-bold">$2,000</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-gray-900/50 rounded border border-gray-800">
                    <span className="text-gray-300">Client Engagement & Meetings</span>
                    <span className="text-[#00FFFF] font-bold">$3,000</span>
                  </div>
                </div>
              </div>

              {/* MARKETING & COLLATERAL */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs text-blue-400 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  MARKETING & COLLATERAL
                </h4>
                <div className="grid gap-2 pl-4">
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-gray-900/50 rounded border border-gray-800">
                    <span className="text-gray-300">High-Fidelity Demo Production</span>
                    <span className="text-[#00FFFF] font-bold">$1,000</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-gray-900/50 rounded border border-gray-800">
                    <span className="text-gray-300">Pitch Deck & Strategy Books (Printed)</span>
                    <span className="text-[#00FFFF] font-bold">$500</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-gray-900/50 rounded border border-gray-800">
                    <span className="text-gray-300">Leave-Behind Kits</span>
                    <span className="text-[#00FFFF] font-bold">$1,000</span>
                  </div>
                </div>
              </div>

              {/* INFRASTRUCTURE */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs text-orange-400 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                  INFRASTRUCTURE
                </h4>
                <div className="grid gap-2 pl-4">
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-gray-900/50 rounded border border-gray-800">
                    <span className="text-gray-300">Cloud / Hosting (Supabase, Vercel)</span>
                    <span className="text-[#00FFFF] font-bold">$500</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-gray-900/50 rounded border border-gray-800">
                    <span className="text-gray-300">Domain / SSL (bevalid.app)</span>
                    <span className="text-[#00FFFF] font-bold">$100</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-gray-900/50 rounded border border-gray-800">
                    <span className="text-gray-300">Edge Functions (API calls)</span>
                    <span className="text-[#00FFFF] font-bold">$200</span>
                  </div>
                </div>
              </div>

              {/* CONTINGENCY & EMERGENCY FUND */}
              <div className="space-y-2">
                <h4 className="font-mono text-xs text-red-400 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  CONTINGENCY & EMERGENCY FUND
                </h4>
                <div className="grid gap-2 pl-4">
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-red-500/10 rounded border border-red-500/30">
                    <span className="text-gray-300">Extended Stay (Steve till Jan 16)</span>
                    <span className="text-red-400 font-bold">$3,000</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-sm p-2 bg-red-500/10 rounded border border-red-500/30">
                    <span className="text-gray-300">Remaining Balance → Contingency</span>
                    <span className="text-red-400 font-bold">$13,200</span>
                  </div>
                </div>
              </div>

              {/* BUDGET SUMMARY */}
              <div className="border-t border-[#00FFFF]/30 pt-4 mt-4 space-y-2">
                <h4 className="font-mono text-xs text-[#00FFFF] tracking-widest">📊 BUDGET SUMMARY</h4>
                <div className="grid gap-1 pl-4 font-mono text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Pre-Deployment</span>
                    <span>$13,000</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Command Center</span>
                    <span>$5,000</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Operations Team</span>
                    <span>$12,500</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Marketing & Collateral</span>
                    <span>$2,500</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Infrastructure</span>
                    <span>$800</span>
                  </div>
                  <div className="flex justify-between text-white font-bold border-t border-gray-700 pt-2 mt-2">
                    <span>Subtotal (Hard Costs)</span>
                    <span>$33,800</span>
                  </div>
                  <div className="flex justify-between text-red-400 font-bold">
                    <span>Contingency Fund (incl. Extended Stay)</span>
                    <span>$16,200</span>
                  </div>
                </div>
                <div className="flex justify-between items-center font-mono text-lg p-3 bg-[#00FFFF]/10 rounded border border-[#00FFFF]/50 mt-3">
                  <span className="text-white font-bold">GRAND TOTAL</span>
                  <span className="text-[#00FFFF] font-bold text-xl">$50,000</span>
                </div>
              </div>

              {/* TEAM ON BOARD */}
              <div className="border-t border-[#00FFFF]/30 pt-4 mt-4 space-y-3">
                <h4 className="font-mono text-xs text-[#00FFFF] tracking-widest flex items-center gap-2">
                  <Users className="h-3 w-3" />
                  TEAM ON BOARD
                </h4>
                
                {/* Digital Forensics Now + Jovianna Gonzalez */}
                <div className="p-4 bg-gradient-to-r from-purple-500/10 via-black to-[#00FFFF]/10 rounded border border-purple-500/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                      <Cpu className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="font-mono text-sm text-white font-bold">Digital Forensics Now</h5>
                      <span className="font-mono text-xs text-purple-400">Cyber Experts • Digital Forensics</span>
                    </div>
                  </div>
                  <p className="font-mono text-xs text-gray-300 leading-relaxed">
                    Digital Forensics Now is a digital forensics and cybersecurity firm delivering litigation-ready investigations for law firms, enterprises, and government across the U.S. and Latin America. The team conducts mobile, computer, and cloud forensics—recovering deleted communications and uncovering insider threats, IP theft, and regulatory exposure—while maintaining a defensible chain of custody. They support matters end-to-end, from remote collections through expert witness testimony, helping clients reduce risk, control costs, and strengthen case strategy.
                  </p>
                  
                  <div className="border-t border-[#00FFFF]/20 pt-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00FFFF]/20 border border-[#00FFFF]/50 flex items-center justify-center">
                        <span className="text-[#00FFFF] font-bold text-xs">JG</span>
                      </div>
                      <div>
                        <h6 className="font-mono text-xs text-white font-bold">Jovianna Gonzalez — CEO</h6>
                        <span className="font-mono text-[10px] text-[#00FFFF]">CCE, CEH, CHFI, IFCI, CEDS</span>
                      </div>
                    </div>
                    <p className="font-mono text-xs text-gray-400 leading-relaxed mt-2">
                      Jovianna Gonzalez is a certified digital forensics and cybersecurity professional and the leader of Digital Forensics Now, specializing in defensible evidence handling, forensic investigations, and courtroom-ready reporting.
                    </p>
                  </div>
                </div>

                {/* Footprint */}
                <div className="p-4 bg-gradient-to-r from-green-500/10 via-black to-green-500/10 rounded border border-green-500/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                      <Eye className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h5 className="font-mono text-sm text-white font-bold">Footprint</h5>
                      <span className="font-mono text-xs text-green-400">Identity Verification (IDV) Provider</span>
                    </div>
                  </div>
                  <p className="font-mono text-xs text-gray-300 leading-relaxed">
                    Footprint is an identity verification (IDV) provider that confirms a user's identity by using computer vision to compare a live selfie against the photo on a government-issued ID document. Their biometric matching mimics an in-person ID check (validate the ID, then confirm the person matches the ID photo) and is continuously improved for accuracy through Footprint and its underlying technology vendors.
                  </p>
                  <div className="border-t border-green-500/20 pt-3">
                    <p className="font-mono text-xs text-green-400 leading-relaxed">
                      <span className="text-white font-bold">For VALID:</span> Footprint powers the ID verification step during onboarding/check-in—helping ensure only real, verified users can enroll and receive QR-based access and payment privileges.
                    </p>
                  </div>
                </div>

                {/* JPMorgan Chase */}
                <div className="p-4 bg-gradient-to-r from-blue-500/10 via-black to-blue-500/10 rounded border border-blue-500/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <h5 className="font-mono text-sm text-white font-bold">JPMorgan Chase</h5>
                      <span className="font-mono text-xs text-blue-400">Banking • Wires • Escrow</span>
                    </div>
                  </div>
                  <p className="font-mono text-xs text-gray-300 leading-relaxed">
                    JPMorgan Chase will serve as our primary banking institution, handling inbound/outbound wires and supporting escrow-style fund flows as we scale. This provides enterprise-grade banking rails, stronger controls, and improved risk management for higher-value transactions.
                  </p>
                </div>

                {/* Stripe */}
                <div className="p-4 bg-gradient-to-r from-indigo-500/10 via-black to-indigo-500/10 rounded border border-indigo-500/30 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
                      <Wallet className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <h5 className="font-mono text-sm text-white font-bold">Stripe</h5>
                      <span className="font-mono text-xs text-indigo-400">Payments • Stripe Connect</span>
                    </div>
                  </div>
                  <p className="font-mono text-xs text-gray-300 leading-relaxed">
                    Stripe will power initial payment processing through Stripe Connect to enable fast launch of card payments and marketplace-style payouts. This is an interim solution until our FBO (For Benefit Of) account structure is onboarded, at which point funds flow and settlement will transition to the banking rails.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* MISSION LOGISTICS - Tactical Priorities */}
        <section className="max-w-3xl mx-auto">
          <Card className="bg-black/50 border border-[#00FFFF]/30">
            <CardHeader>
              <CardTitle className="text-[#00FFFF] font-mono text-sm tracking-widest flex items-center gap-2">
                <Target className="h-4 w-4" />
                TACTICAL PRIORITIES (NEXT 30 DAYS)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* PRIORITY ONE - Glowing urgent item */}
              <div className="flex items-start gap-3 font-mono text-sm p-3 rounded border border-yellow-500/50 bg-yellow-500/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 animate-pulse pointer-events-none" />
                <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" style={{ filter: "drop-shadow(0 0 8px #facc15)" }} />
                <div className="relative z-10">
                  <span className="text-yellow-400 font-bold">⚡ PRIORITY ONE:</span>{" "}
                  <span className="text-white font-bold">UI/UX DESIGNER ($3,000)</span>
                  <p className="text-gray-300 mt-1 text-xs">
                    Retaining top-tier UI/UX Designer for high-fidelity interface design and visual language.
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
                  <span className="text-white font-bold">FULL STACK DESIGNER ($3,000)</span>
                  <p className="text-gray-300 mt-1 text-xs">
                    Needed to take the helm of our platform. End-to-end ownership of product design and engineering.
                  </p>
                  <span className="inline-block mt-1 text-xs text-red-400 font-bold tracking-wider animate-pulse">
                    🔴 HIRING IMMEDIATELY
                  </span>
                </div>
              </div>

              {/* PRIORITY THREE - Security */}
              <div className="flex items-start gap-3 font-mono text-sm p-3 rounded border border-yellow-500/50 bg-yellow-500/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 animate-pulse pointer-events-none" />
                <Zap className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" style={{ filter: "drop-shadow(0 0 8px #facc15)" }} />
                <div className="relative z-10">
                  <span className="text-yellow-400 font-bold">⚡ PRIORITY THREE:</span>{" "}
                  <span className="text-white font-bold">SECURITY EXPERT — JOVIANNA ($5,000)</span>
                  <p className="text-gray-300 mt-1 text-xs">
                    Cybersecurity consultant for platform hardening, penetration testing, and compliance review.
                  </p>
                  <span className="inline-block mt-1 text-xs text-red-400 font-bold tracking-wider animate-pulse">
                    🔴 NEEDED
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-sm">
                <span className="text-xl">🎬</span>
                <span className="text-gray-300">
                  <span className="text-white font-bold">MOTION GRAPHICS:</span> Builder & Backend Motion Graphics ($2,000).
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-sm">
                <span className="text-xl">🏨</span>
                <span className="text-gray-300">
                  <span className="text-white font-bold">COMMAND CENTER:</span> St. Regis San Francisco ($5,000).
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-sm">
                <span className="text-xl">✈️</span>
                <span className="text-gray-300">
                  <span className="text-white font-bold">AIR STRIKE TEAM:</span> Field operatives ($4,000).
                </span>
              </div>
              <div className="flex items-center gap-3 font-mono text-sm">
                <span className="text-xl">🎟️</span>
                <span className="text-gray-300">
                  <span className="text-white font-bold">J.P. MORGAN TICKETS:</span> Conference access ($3,500).
                </span>
              </div>
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

              {/* Full Campaign Schedule Header */}
              <div className="text-center py-2">
                <h3 className="font-mono text-white font-bold tracking-widest text-lg">FULL CAMPAIGN SCHEDULE</h3>
                <p className="font-mono text-xs text-[#00FFFF]">JANUARY 9–16, 2026</p>
              </div>

              {/* Strategy Overview */}
              <div className="p-4 bg-gray-900/50 rounded border border-gray-800 space-y-3">
                <p className="font-mono text-sm text-gray-300">
                  We are arriving early to secure the terrain before the chaos starts, and we are staying late to sweep the deals when the tourists leave.
                </p>
                <h4 className="font-mono text-[#00FFFF] font-bold tracking-wide">The Strategy:</h4>
                <div className="space-y-2 font-mono text-xs text-gray-300">
                  <p><span className="text-yellow-400">Jan 9-11 (The Setup):</span> We aren't just tourists. We are setting up our "Embassy." We find where the parties are, we tip the concierges, we get the intel.</p>
                  <p><span className="text-green-400">Jan 12-14 (The Assault - With Team):</span> High-intensity hunting. We hit the "Big Dogs" (protecting billions) and the "Young Guns" (desperate to prove safety).</p>
                  <p><span className="text-purple-400">Jan 15-16 (The Closer - You Only):</span> The "Kingmaker" days. The noise is gone, only the decision-makers remain.</p>
                </div>
                <p className="font-mono text-sm text-white font-bold mt-4">Here is your dossier and timeline.</p>
              </div>

              {/* PHASE 1: INFILTRATION */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-yellow-500/30">
                  <Target className="h-5 w-5 text-yellow-400" />
                  <div>
                    <h4 className="font-mono text-yellow-400 font-bold tracking-wide">PHASE 1: INFILTRATION (Jan 9 – 11)</h4>
                    <p className="font-mono text-xs text-gray-400">Objective: Intel, Setup, and Soft Targets.</p>
                  </div>
                </div>

                <div className="pl-4 border-l-2 border-yellow-500/30 space-y-3">
                  {/* Friday Jan 9 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-yellow-400" />
                      <span className="font-mono text-yellow-400 font-bold">FRIDAY, JAN 9: LANDFALL</span>
                    </div>
                    <div className="space-y-2 font-mono text-xs">
                      <p className="text-gray-300"><span className="text-[#00FFFF]">12:00 PM:</span> Check-in. Establish the "War Room."</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">03:00 PM:</span> Recon Mission: Walk the lobbies of the St. Regis and Four Seasons. This is where the private suites are being set up.</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">07:00 PM:</span> Dinner at Kokkari Estiatorio. It's a power spot. If you see a badge, you buy them a drink.</p>
                    </div>
                  </div>

                  {/* Saturday Jan 10 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-yellow-400" />
                      <span className="font-mono text-yellow-400 font-bold">SATURDAY, JAN 10: THE PERIMETER</span>
                    </div>
                    <div className="space-y-2 font-mono text-xs">
                      <p className="text-gray-300"><span className="text-[#00FFFF]">10:00 AM:</span> Coffee at The Grove (Yerba Buena). Watch for early VC arrivals.</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">02:00 PM:</span> Target Prep: Review the "Lovable" links. Ensure the "Sovereign Seal" demo is flawless on mobile.</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">08:00 PM:</span> Drinks at The View Lounge (Marriott Marquis). The "Biotech Showcase" attendees land today. They are hungry for connections.</p>
                    </div>
                  </div>

                  {/* Sunday Jan 11 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-yellow-400" />
                      <span className="font-mono text-yellow-400 font-bold">SUNDAY, JAN 11: THE WHISPER PARTIES</span>
                    </div>
                    <div className="space-y-2 font-mono text-xs">
                      <p className="text-gray-300"><span className="text-[#00FFFF]">04:00 PM:</span> The "Clift" Reception: Usually an early mixer.</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">06:00 PM:</span> St. Regis Lobby: This is the "night before the war." The biggest VCs (A16Z, Khosla) often have private dinners here. You are there to be seen.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* PHASE 2: THE ASSAULT */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-green-500/30">
                  <Crosshair className="h-5 w-5 text-green-400" />
                  <div>
                    <h4 className="font-mono text-green-400 font-bold tracking-wide">PHASE 2: THE ASSAULT (Jan 12 – 14)</h4>
                    <p className="font-mono text-xs text-gray-400">Team: You, Chris, John. | Pace: Maximum Intensity.</p>
                  </div>
                </div>

                <div className="pl-4 border-l-2 border-green-500/30 space-y-3">
                  {/* Monday Jan 12 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-green-400" />
                      <span className="font-mono text-green-400 font-bold">MONDAY, JAN 12: SHOCK & AWE</span>
                    </div>
                    <p className="font-mono text-xs text-gray-400 mb-3">Focus: The "Young Guns" (Asses on Fire).</p>
                    
                    <div className="space-y-3">
                      {/* Target: Ambience */}
                      <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-[#00FFFF]" />
                          <span className="font-mono text-[10px] text-[#00FFFF]">09:00 AM</span>
                          <span className="font-mono text-white font-bold text-xs">AMBIENCE HEALTHCARE ($243M raised)</span>
                        </div>
                        <div className="font-mono text-[10px] space-y-1">
                          <p className="text-gray-400">Status: "Young Gun" ($1B Val)</p>
                          <p className="text-gray-300"><span className="text-yellow-400">The Pain:</span> They are growing too fast. They are the "OS" for hospitals. One error kills them.</p>
                          <p className="text-white italic">"You're moving at light speed. We are your brakes."</p>
                          <p className="text-gray-400"><MapPin className="h-3 w-3 inline mr-1" />Westin St. Francis (Main Hall)</p>
                        </div>
                      </div>

                      {/* JPM Lunch */}
                      <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-[#00FFFF]" />
                          <span className="font-mono text-[10px] text-[#00FFFF]">12:00 PM</span>
                          <span className="font-mono text-white font-bold text-xs">J.P. MORGAN MAIN LUNCH</span>
                        </div>
                        <p className="font-mono text-[10px] text-gray-300">Mission: Divide and conquer. Chris takes the left side of the room, John takes the right. You float.</p>
                      </div>

                      {/* Target: Hippocratic */}
                      <div className="p-2 bg-gray-800/50 rounded border border-red-500/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-red-500 text-white font-mono text-[8px] px-1 py-0.5">CRITICAL</div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-[#00FFFF]" />
                          <span className="font-mono text-[10px] text-[#00FFFF]">03:00 PM</span>
                          <span className="font-mono text-white font-bold text-xs">HIPPOCRATIC AI ($126M raised)</span>
                        </div>
                        <div className="font-mono text-[10px] space-y-1">
                          <p className="text-gray-400">Status: "Young Gun" ($3.5B Val). CRITICAL TARGET.</p>
                          <p className="text-gray-300"><span className="text-yellow-400">The Intel:</span> Their entire brand is safety. They just raised money specifically for this.</p>
                          <p className="text-white italic">"You claim safety. Synth proves it. Let's run a $250k audit."</p>
                          <p className="text-gray-400"><MapPin className="h-3 w-3 inline mr-1" />St. Regis Suites</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tuesday Jan 13 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-green-400" />
                      <span className="font-mono text-green-400 font-bold">TUESDAY, JAN 13: THE DATA WHALES</span>
                    </div>
                    <p className="font-mono text-xs text-gray-400 mb-3">Focus: The "Big Dogs" (Protecting the Chest).</p>
                    
                    <div className="space-y-3">
                      {/* Target: OpenEvidence */}
                      <div className="p-2 bg-gray-800/50 rounded border border-red-500/30 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-red-500 text-white font-mono text-[8px] px-1 py-0.5">THE BIG DOG</div>
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-[#00FFFF]" />
                          <span className="font-mono text-[10px] text-[#00FFFF]">09:00 AM</span>
                          <span className="font-mono text-white font-bold text-xs">OPENEVIDENCE ($12B Valuation Target)</span>
                        </div>
                        <div className="font-mono text-[10px] space-y-1">
                          <p className="text-gray-400">Status: THE BIG DOG. (Rumored raising $250M now).</p>
                          <p className="text-gray-300"><span className="text-yellow-400">The Intel:</span> They are the "Google for Doctors." If they lie, they get sued for malpractice.</p>
                          <p className="text-white italic">"Daniel (CEO), you are worth $12B. You have zero insurance against hallucination liability. We are that insurance."</p>
                          <p className="text-gray-400"><MapPin className="h-3 w-3 inline mr-1" />Four Seasons Lobby</p>
                        </div>
                      </div>

                      {/* Target: Tennr */}
                      <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-[#00FFFF]" />
                          <span className="font-mono text-[10px] text-[#00FFFF]">01:00 PM</span>
                          <span className="font-mono text-white font-bold text-xs">TENNR ($101M raised)</span>
                        </div>
                        <div className="font-mono text-[10px] space-y-1">
                          <p className="text-gray-400">Status: "Young Gun" (High Pressure).</p>
                          <p className="text-gray-300"><span className="text-yellow-400">The Pain:</span> They automate medical faxes. If they misread a fax, a patient loses care.</p>
                          <p className="text-white italic">"We clean your data before it hits the model."</p>
                          <p className="text-gray-400"><MapPin className="h-3 w-3 inline mr-1" />Westin Mezzanine</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Wednesday Jan 14 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-green-400" />
                      <span className="font-mono text-green-400 font-bold">WEDNESDAY, JAN 14: THE EXIT (Chris & John Depart)</span>
                    </div>
                    <p className="font-mono text-xs text-gray-400 mb-3">Focus: Locking the Contracts.</p>
                    
                    <div className="space-y-3">
                      {/* Target: Abridge */}
                      <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-[#00FFFF]" />
                          <span className="font-mono text-[10px] text-[#00FFFF]">09:00 AM</span>
                          <span className="font-mono text-white font-bold text-xs">ABRIDGE ($316M raised)</span>
                        </div>
                        <div className="font-mono text-[10px] space-y-1">
                          <p className="text-gray-400">Status: "Big Dog" ($5.3B Val).</p>
                          <p className="text-gray-300"><span className="text-yellow-400">The Intel:</span> They record doctor conversations. Privacy is their god.</p>
                          <p className="text-white italic">"We provide the Sovereign Seal of privacy for every transcript."</p>
                          <p className="text-gray-400"><MapPin className="h-3 w-3 inline mr-1" />Meeting Suites near Moscone/InterContinental</p>
                        </div>
                      </div>

                      {/* Target: Formation Bio */}
                      <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-[#00FFFF]" />
                          <span className="font-mono text-[10px] text-[#00FFFF]">02:00 PM</span>
                          <span className="font-mono text-white font-bold text-xs">FORMATION BIO ($372M raised)</span>
                        </div>
                        <div className="font-mono text-[10px] space-y-1">
                          <p className="text-gray-400">Status: "Big Dog" (Pharma).</p>
                          <p className="text-white italic">"FDA trials require 100% accuracy. We guarantee it."</p>
                        </div>
                      </div>

                      {/* Team Debrief */}
                      <div className="p-2 bg-[#00FFFF]/10 rounded border border-[#00FFFF]/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-[#00FFFF]" />
                          <span className="font-mono text-[10px] text-[#00FFFF]">05:00 PM</span>
                          <span className="font-mono text-white font-bold text-xs">TEAM DEBRIEF</span>
                        </div>
                        <p className="font-mono text-[10px] text-gray-300">Handover of all contacts/notes from Chris & John to you before they fly out.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PHASE 3: THE CLOSER */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-purple-500/30">
                  <Crown className="h-5 w-5 text-purple-400" />
                  <div>
                    <h4 className="font-mono text-purple-400 font-bold tracking-wide">PHASE 3: THE CLOSER (Jan 15 – 16)</h4>
                    <p className="font-mono text-xs text-gray-400">Operator: You (Solo). | Focus: The Check Writers (VCs).</p>
                  </div>
                </div>

                <div className="pl-4 border-l-2 border-purple-500/30 space-y-3">
                  {/* Thursday Jan 15 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <span className="font-mono text-purple-400 font-bold">THURSDAY, JAN 15: THE KINGMAKERS</span>
                    </div>
                    <p className="font-mono text-xs text-gray-400 mb-3">The noise is gone. Now we hunt the money.</p>
                    
                    <div className="space-y-3">
                      {/* A16Z */}
                      <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-[#00FFFF]" />
                          <span className="font-mono text-[10px] text-[#00FFFF]">10:00 AM</span>
                          <span className="font-mono text-white font-bold text-xs">ANDREESSEN HOROWITZ (A16Z BIO)</span>
                        </div>
                        <div className="font-mono text-[10px] space-y-1">
                          <p className="text-gray-300"><span className="text-yellow-400">The Intel:</span> They backed Ambience, Hippocratic, and Formation Bio. They are exposed.</p>
                          <p className="text-gray-300"><span className="text-[#00FFFF]">The Move:</span> Text the Partners you met earlier. "I'm still here. Let's talk about protecting your portfolio."</p>
                          <p className="text-gray-400"><MapPin className="h-3 w-3 inline mr-1" />St. Regis (They often keep the suite all week)</p>
                        </div>
                      </div>

                      {/* Khosla */}
                      <div className="p-2 bg-gray-800/50 rounded border border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="h-3 w-3 text-[#00FFFF]" />
                          <span className="font-mono text-[10px] text-[#00FFFF]">01:00 PM</span>
                          <span className="font-mono text-white font-bold text-xs">KHOSLA VENTURES</span>
                        </div>
                        <div className="font-mono text-[10px] space-y-1">
                          <p className="text-gray-300"><span className="text-[#00FFFF]">The Move:</span> Find Alex Morgan (Partner).</p>
                          <p className="text-white italic">"Vinod likes the impossible. We are the impossible."</p>
                        </div>
                      </div>

                      {/* Survivors Drink */}
                      <div className="p-2 bg-purple-900/30 rounded border border-purple-500/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Beer className="h-3 w-3 text-purple-400" />
                          <span className="font-mono text-[10px] text-purple-400">07:00 PM</span>
                          <span className="font-mono text-white font-bold text-xs">THE SURVIVORS DRINK</span>
                        </div>
                        <p className="font-mono text-[10px] text-gray-300">Go to the Hotel Zetta bar (The Cavalier). This is where the people who really run things hang out after the event.</p>
                      </div>
                    </div>
                  </div>

                  {/* Friday Jan 16 */}
                  <div className="p-3 bg-gray-900/50 rounded border border-gray-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <span className="font-mono text-purple-400 font-bold">FRIDAY, JAN 16: DEBRIEF & DEPARTURE</span>
                    </div>
                    <div className="space-y-2 font-mono text-xs">
                      <p className="text-gray-300"><span className="text-[#00FFFF]">09:00 AM:</span> Final coffee meetings with anyone who said "maybe."</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">11:00 AM:</span> Review the "Soft Commits."</p>
                      <p className="text-gray-300"><span className="text-[#00FFFF]">02:00 PM:</span> Wheels up.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* HIT LIST SUMMARY */}
              <div className="border-t border-[#00FFFF]/20 pt-6 space-y-4">
                <h4 className="font-mono text-[#00FFFF] font-bold tracking-widest flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  YOUR HIT LIST SUMMARY
                </h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-2 bg-red-500/10 rounded border border-red-500/30">
                    <p className="font-mono text-xs"><span className="text-red-400 font-bold">OpenEvidence ($12B Val)</span> <span className="text-gray-400">– The Whale</span></p>
                  </div>
                  <div className="p-2 bg-gray-900/50 rounded border border-gray-700">
                    <p className="font-mono text-xs"><span className="text-white font-bold">Abridge ($5.3B Val)</span> <span className="text-gray-400">– The Shield</span></p>
                  </div>
                  <div className="p-2 bg-gray-900/50 rounded border border-gray-700">
                    <p className="font-mono text-xs"><span className="text-white font-bold">Hippocratic AI ($3.5B Val)</span> <span className="text-gray-400">– The Safety Play</span></p>
                  </div>
                  <div className="p-2 bg-gray-900/50 rounded border border-gray-700">
                    <p className="font-mono text-xs"><span className="text-white font-bold">Formation Bio ($372M Cash)</span> <span className="text-gray-400">– The Pharma Play</span></p>
                  </div>
                  <div className="p-2 bg-gray-900/50 rounded border border-gray-700">
                    <p className="font-mono text-xs"><span className="text-white font-bold">Ambience ($1B Val)</span> <span className="text-gray-400">– The OS Play</span></p>
                  </div>
                  <div className="p-2 bg-gray-900/50 rounded border border-gray-700">
                    <p className="font-mono text-xs"><span className="text-white font-bold">Tennr ($101M Cash)</span> <span className="text-gray-400">– The Automation Play</span></p>
                  </div>
                </div>
                <p className="font-mono text-sm text-white font-bold text-center pt-2">You have the roadmap. Now we execute.</p>
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
