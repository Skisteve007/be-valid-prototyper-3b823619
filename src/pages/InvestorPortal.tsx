import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Lock, Check, Sparkles, Clock, ExternalLink, ArrowRight, User, Briefcase, Cpu, Award, Phone, Mail, Globe, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const investorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  linkedin_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  accredited_confirmed: z.boolean().refine((val) => val === true, {
    message: "You must confirm accredited investor status",
  }),
});

type InvestorFormData = z.infer<typeof investorFormSchema>;

const InvestorPortal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InvestorFormData>({
    resolver: zodResolver(investorFormSchema),
    defaultValues: {
      name: "",
      email: "",
      linkedin_url: "",
      accredited_confirmed: false,
    },
  });

  const onSubmit = async (data: InvestorFormData) => {
    setIsSubmitting(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get("utm_source") || null;

      const { error } = await supabase.from("investor_leads").insert({
        name: data.name,
        email: data.email,
        linkedin_url: data.linkedin_url || null,
        accredited_confirmed: data.accredited_confirmed,
        tranche_interest: "launch_round",
        utm_source: utmSource,
      });

      if (error) throw error;

      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting investor lead:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Deal Room | Valid™ Investor Portal</title>
        <meta name="description" content="Invest in Valid™ - Priority access to our Launch Round. Limited allocation for accredited investors." />
      </Helmet>

      <div className="relative min-h-screen overflow-hidden">
        {/* Layer 1: Cinematic Earth/Space Image */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            backgroundImage: 'url(/investor-bg-earth.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center bottom',
            backgroundAttachment: 'fixed',
            opacity: 0.45,
          }}
        />
        
        {/* Layer 2: Gradient Tint with Teal Glow */}
        <div 
          className="fixed inset-0 z-0"
          style={{
            background: `
              radial-gradient(circle at 60% 20%, rgba(34,211,238,0.15), transparent 55%),
              linear-gradient(to bottom, rgba(0,0,0,0.95), rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.95))
            `,
          }}
        />
        
        {/* Layer 3: Readability Overlay */}
        <div className="fixed inset-0 z-0 bg-black/50" />
        
        {/* Content Layer */}
        <div className="relative z-10">
          {/* Hero Header */}
          <div className="border-b border-cyan-500/20 bg-black/40 backdrop-blur-md">
          <div className="container mx-auto px-4 py-10 md:py-16 text-center">
            {/* Primary H1 */}
            <h1 className="text-4xl md:text-6xl font-bold tracking-wider text-white font-display mb-4">
              DEAL ROOM
            </h1>
            <p className="text-cyan-400/80 text-lg tracking-wide mb-6">Valid<sup className="text-[0.5em]">™</sup> Investor Portal</p>
            
            {/* Secondary Quote */}
            <p className="text-base md:text-lg text-amber-300/80 italic tracking-wide mb-8 max-w-xl mx-auto">
              "Experience cannot be coded. It must be lived."
            </p>
            
            {/* Badges - reduced visual weight */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full">
                <span className="text-xs">🛡️</span>
                <span className="text-cyan-400/80 text-xs font-medium">SOC 2</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                <span className="text-xs">🔒</span>
                <span className="text-green-400/80 text-xs font-medium">GDPR</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
                <span className="text-xs">🔒</span>
                <span className="text-amber-400/80 text-xs font-medium">CCPA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12 space-y-12 md:space-y-16">

          {/* Timeline Visualization */}
          <section className="relative">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
              {/* Today */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-2 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <span className="text-emerald-400 font-bold text-xs">TODAY</span>
                </div>
                <p className="text-white font-semibold text-sm">Launch Round</p>
                <p className="text-cyan-400 text-xs">$200K @ $6M Cap</p>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:flex items-center px-4">
                <div className="w-24 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                <ArrowRight className="w-5 h-5 text-cyan-500 -ml-1" />
              </div>
              <div className="md:hidden flex items-center py-2">
                <div className="w-0.5 h-8 bg-gradient-to-b from-emerald-500 to-cyan-500"></div>
              </div>
              
              {/* 8 Months */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center mb-2">
                  <Clock className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-gray-400 font-semibold text-sm">8 MONTHS</p>
                <p className="text-gray-500 text-xs">Growth Phase</p>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:flex items-center px-4">
                <div className="w-24 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
                <ArrowRight className="w-5 h-5 text-blue-500 -ml-1" />
              </div>
              <div className="md:hidden flex items-center py-2">
                <div className="w-0.5 h-8 bg-gradient-to-b from-cyan-500 to-blue-500"></div>
              </div>
              
              {/* Series Seed */}
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500/50 flex items-center justify-center mb-2">
                  <Sparkles className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-gray-400 font-semibold text-sm">Series Seed</p>
                <p className="text-gray-500 text-xs">$1.5M @ $10-12M</p>
              </div>
            </div>
          </section>

          {/* Priority Access Section Header */}
          <div className="text-center mb-4">
            <div className="inline-block px-6 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-4">
              <span className="text-emerald-400 text-sm font-semibold tracking-widest uppercase">Priority Access</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-wider font-display">
              TRANCHE 1: LAUNCH ROUND
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-4"></div>
          </div>

          {/* SECTION 1: Launch Round (Active) */}
          <section className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-50"></div>
            <div className="relative border-2 border-cyan-500/40 rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-sm p-6 md:p-10 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-sm font-semibold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  NOW OPEN
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/30 border border-emerald-400 text-emerald-300 text-sm font-bold tracking-wider shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Shield className="w-4 h-4" />
                  FIRST $100K — PROTECTED
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-semibold tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  LIMITED ALLOCATION
                </span>
              </div>

              <h3 className="text-2xl md:text-4xl font-bold text-white tracking-wider mb-2 font-display">
                Friends & Family Round
              </h3>
              <p className="text-xl md:text-2xl text-cyan-400 font-semibold tracking-wide mb-8">
                Raising: $200,000
              </p>

              {/* Terms Card */}
              <div className="bg-[#0f0f0f] rounded-xl border border-cyan-500/30 overflow-hidden mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cyan-500/20">
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-cyan-400/70 uppercase tracking-widest mb-1">Instrument</p>
                    <p className="text-white font-semibold tracking-wide">Convertible Note</p>
                  </div>
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-cyan-400/70 uppercase tracking-widest mb-1">Valuation Cap</p>
                    <p className="text-white font-semibold tracking-wide text-xl">$6,000,000</p>
                  </div>
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-cyan-400/70 uppercase tracking-widest mb-1">Discount</p>
                    <p className="text-emerald-400 font-semibold tracking-wide">50% on Series Seed</p>
                  </div>
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-cyan-400/70 uppercase tracking-widest mb-1">Minimum Check</p>
                    <p className="text-white font-semibold tracking-wide">$15,000</p>
                  </div>
                  <div className="p-4 md:p-6 lg:col-span-2">
                    <p className="text-xs text-emerald-400/70 uppercase tracking-widest mb-1">🛡️ Special — First $100K Invested</p>
                    <p className="text-emerald-300 font-semibold tracking-wide">100% Return Option (2x cash back at Series Seed OR convert)</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-black font-bold tracking-wider px-8 py-6 text-base shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all rounded-full"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Request Access
                </Button>
                <Button
                  onClick={() => window.open('https://calendly.com/steve-bevalid/30min', '_blank')}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold tracking-wider px-8 py-6 text-base rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Schedule 30-Min Call
                </Button>
              </div>
              <p className="text-xs text-gray-500 tracking-wide mt-3">
                Allocation is limited. Accredited investors only.
              </p>
            </div>
          </section>

          {/* Future Round Section Header */}
          <div className="text-center mb-4">
            <div className="inline-block px-6 py-2 rounded-full border border-gray-700 bg-gray-800/30 mb-4">
              <span className="text-gray-400 text-sm font-semibold tracking-widest uppercase">Future Round</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-500 tracking-wider font-display">
              TRANCHE 2: SERIES SEED
            </h2>
            <p className="text-gray-600 mt-2 tracking-wide">Target: 8 Months</p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent mx-auto mt-4"></div>
          </div>

          {/* SECTION 2: Series Seed (Locked) */}
          <section className="relative opacity-70">
            <div className="border border-gray-700/40 rounded-2xl bg-[#0a0a0a]/60 p-6 md:p-10">
              {/* Locked Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-400 text-sm font-semibold tracking-wider">
                  <Lock className="w-3.5 h-3.5" />
                  LOCKED
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-500 text-xs font-semibold tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  ~8 MONTHS OUT
                </span>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold text-gray-400 tracking-wider mb-2 font-display">
                Priced Equity Round
              </h2>
              <p className="text-xl md:text-2xl text-gray-500 font-semibold tracking-wide mb-8">
                Target Raise: $1,500,000
              </p>

              {/* Terms Card - Muted */}
              <div className="bg-[#0f0f0f]/60 rounded-xl border border-gray-700/40 overflow-hidden mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-700/40">
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Instrument</p>
                    <p className="text-gray-400 font-semibold tracking-wide">Priced Equity Round</p>
                  </div>
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Target Valuation</p>
                    <p className="text-gray-400 font-semibold tracking-wide">$10,000,000 - $12,000,000 Pre-Money</p>
                  </div>
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Target Raise</p>
                    <p className="text-gray-400 font-semibold tracking-wide">$1,500,000</p>
                  </div>
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Minimum Check</p>
                    <p className="text-gray-400 font-semibold tracking-wide">$50,000</p>
                  </div>
                </div>
              </div>

              {/* CTA - Disabled */}
              <Button
                disabled
                variant="outline"
                size="lg"
                className="font-bold tracking-wider px-8 py-6 text-base border-gray-700 text-gray-500 cursor-not-allowed opacity-50 bg-transparent"
              >
                Join Waitlist
              </Button>
            </div>
          </section>

          {/* Divider before Founder Section */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent my-8"></div>

          {/* Founder Section */}
          <section className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-40"></div>
            <div className="relative border border-cyan-500/30 rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-sm p-6 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wider font-display mb-2">
                  STEVEN GRILLO
                </h2>
                <p className="text-cyan-400 font-semibold tracking-widest uppercase text-sm">
                  Founder & Systems Architect
                </p>
                <p className="text-emerald-400/80 font-medium tracking-wide text-sm mt-1">
                  VALID™ | Creator of SYNTH™ — Synthesized AI Methodology
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* The Background */}
                <div className="bg-[#0f0f0f] rounded-xl border border-cyan-500/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-wide">THE BACKGROUND</h3>
                  </div>
                  <div className="space-y-2 text-gray-200 text-sm leading-relaxed">
                    <p>53 years of life. 35 years of execution.</p>
                    <p><span className="text-cyan-400 font-semibold">Self-made.</span> Multiple businesses scaled from zero to exit.</p>
                    <p>Bridged the gap between hard infrastructure and high-stakes regulation.</p>
                    <p className="text-gray-400 italic">A career built on tangible results, not theory.</p>
                  </div>
                </div>

                {/* The Operator */}
                <div className="bg-[#0f0f0f] rounded-xl border border-emerald-500/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-wide">THE OPERATOR</h3>
                  </div>
                  <div className="space-y-2 text-gray-200 text-sm leading-relaxed">
                    <p>A veteran of the <span className="text-emerald-400 font-semibold">real economy</span> — not the sandbox.</p>
                    <p>Deep mastery of Operations, Risk Management, and High-Liability Sectors.</p>
                    <p className="text-gray-400 italic">Translates complex market necessities into functional, revenue-generating systems.</p>
                  </div>
                </div>

                {/* The Architect */}
                <div className="bg-[#0f0f0f] rounded-xl border border-blue-500/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-wide">THE ARCHITECT</h3>
                  </div>
                  <div className="space-y-2 text-gray-200 text-sm leading-relaxed">
                    <p>Pioneer of <span className="text-blue-400 font-semibold">SYNTH™ — Synthesized AI Methodology</span>.</p>
                    <p>Orchestrates GitHub, Vercel, Supabase, and AI Agents to build enterprise-grade infrastructure.</p>
                    <p className="text-gray-400 italic">Built in 340 hours what traditional teams fail to deliver in a year.</p>
                  </div>
                </div>

                {/* The Standard */}
                <div className="bg-[#0f0f0f] rounded-xl border border-amber-500/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-wide">THE STANDARD</h3>
                  </div>
                  <div className="flex items-center justify-center h-full">
                    <p className="text-xl md:text-2xl text-amber-300 font-bold italic text-center">
                      "Experience cannot be coded. It must be lived."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Information Section */}
          <section className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-30"></div>
            <div className="relative border border-cyan-500/20 rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-sm p-6 md:p-10">
              <div className="text-center mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wider font-orbitron mb-2">
                  GET IN TOUCH
                </h2>
                <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <a href="tel:+15127810973" className="flex items-center gap-3 p-4 bg-[#0f0f0f] rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center group-hover:bg-cyan-500/30 transition-colors">
                    <Phone className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                    <p className="text-white font-medium">(512) 781-0973</p>
                  </div>
                </a>

                <a href="mailto:steve@bevalid.app" className="flex items-center gap-3 p-4 bg-[#0f0f0f] rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                    <Mail className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                    <p className="text-white font-medium">steve@bevalid.app</p>
                  </div>
                </a>

                <a href="https://bevalid.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-[#0f0f0f] rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Globe className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Website</p>
                    <p className="text-white font-medium">bevalid.app</p>
                  </div>
                </a>

                <a href="https://calendly.com/steve-bevalid/30min" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-[#0f0f0f] rounded-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                    <Calendar className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Book a Call</p>
                    <p className="text-white font-medium">calendly.com</p>
                  </div>
                </a>
              </div>

              {/* Prominent Schedule Call Button */}
              <div className="text-center">
                <Button
                  onClick={() => window.open('https://calendly.com/steve-bevalid/30min', '_blank')}
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold tracking-wider px-10 py-6 text-lg rounded-full hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                >
                  <Calendar className="w-6 h-6 mr-2" />
                  Schedule Call
                </Button>
              </div>
            </div>
          </section>

          {/* SYNTH™ Badge */}
          <div className="text-center py-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0a0a0a] border border-cyan-500/20">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-gray-400 tracking-wider">
                Built with <span className="text-cyan-400 font-semibold">SYNTH™</span> — Synthesized AI Methodology
              </span>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div className="border-t border-gray-800 pt-8 pb-4">
            <p className="text-xs md:text-[13px] text-gray-500 leading-relaxed tracking-wide max-w-4xl">
              <strong className="text-gray-400">IMPORTANT DISCLOSURES:</strong> This page is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities. Any offering will be made only to accredited investors pursuant to a formal offering memorandum. Investment involves significant risk, including the potential loss of your entire investment. Past performance is not indicative of future results. Giant Ventures LLC and its affiliates make no representations or warranties regarding the information presented.
            </p>
          </div>
        </div>

        <Footer />
        
        </div> {/* Close content layer z-10 */}

        {/* Request Access Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md bg-[#0a0a0a] border-cyan-500/30">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-wider flex items-center gap-2 text-white">
                <Shield className="w-5 h-5 text-cyan-400" />
                Request Access
              </DialogTitle>
              <DialogDescription className="text-gray-400 tracking-wide">
                Submit your information to request allocation in our Launch Round.
              </DialogDescription>
            </DialogHeader>

            {isSubmitted ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">Thank You</h3>
                <p className="text-gray-400 tracking-wide">
                  We'll be in touch within 48 hours.
                </p>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsSubmitted(false);
                  }}
                  className="mt-6 bg-cyan-500/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/30"
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Smith"
                            {...field}
                            className="bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                            className="bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          LinkedIn URL
                          <span className="text-xs text-gray-500">(optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://linkedin.com/in/yourprofile"
                            {...field}
                            className="bg-[#0f0f0f] border-gray-700 text-white placeholder:text-gray-600"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accredited_confirmed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-gray-700 p-4 bg-[#0f0f0f]">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="border-gray-600"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-gray-300 text-sm cursor-pointer">
                            I confirm I am an accredited investor as defined by{" "}
                            <a
                              href="https://www.sec.gov/education/capitalraising/building-blocks/accredited-investor"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                            >
                              SEC Rule 501
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-black font-bold tracking-wider py-6 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Submit Request
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default InvestorPortal;
