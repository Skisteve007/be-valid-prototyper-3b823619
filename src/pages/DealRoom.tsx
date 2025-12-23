import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { AlertTriangle, Target, Cpu, Wallet, Eye, Zap, Users, Plane, Check, Loader2 } from "lucide-react";
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

const DealRoom = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [currentRaised, setCurrentRaised] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
  });

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
      const { error } = await supabase.from("investor_leads").insert({
        name: formData.name,
        email: formData.email,
        tranche_interest: `deal_room_${selectedTier}_$${formData.amount}`,
        accredited_confirmed: true,
      });

      if (error) throw error;

      toast.success("Allocation Secured", {
        description: "You'll receive mission briefing details within 24 hours.",
      });

      setIsModalOpen(false);
      setFormData({ name: "", email: "", amount: "" });
      setSelectedTier(null);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Transmission Failed", {
        description: "Please try again or contact command.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = (displayedRaised / MISSION_TARGET) * 100;

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
        {/* THE WAR CHEST - Progress Bar */}
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
                  value={progressPercent} 
                  className="h-8 bg-gray-900 border border-[#00FFFF]/20 rounded-sm overflow-hidden"
                />
                <div 
                  className="absolute inset-0 h-8 rounded-sm transition-all duration-1000 ease-out"
                  style={{
                    width: `${progressPercent}%`,
                    background: "linear-gradient(90deg, #00FFFF, #00CED1)",
                    boxShadow: "0 0 20px #00FFFF, 0 0 40px #00FFFF50",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-sm text-white font-bold drop-shadow-lg">
                    {progressPercent.toFixed(1)}% SECURED
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

        {/* ACTION BUTTON */}
        <section className="text-center py-8">
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
        <DialogContent className="bg-black border border-[#00FFFF]/50 text-white max-w-md">
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
