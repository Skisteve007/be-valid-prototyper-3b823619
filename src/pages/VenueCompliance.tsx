import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, PartyPopper, ShieldCheck, Building2, ArrowRight, Loader2, BadgeCheck, Sparkles, Syringe, FlaskConical, Car } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VenueCompliance = () => {
  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    venue_name: "",
    city: "",
    role: "",
    phone: "",
  });

  const scrollToForm = (subject: string) => {
    setSelectedSubject(subject);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.venue_name || !formData.city || !formData.role || !formData.phone) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("shadow_leads").insert({
        name: formData.name,
        venue_name: formData.venue_name,
        city: formData.city,
        role: formData.role,
        phone: formData.phone,
        inquiry_subject: selectedSubject,
      });

      if (error) throw error;

      toast({
        title: "Request Submitted",
        description: "Our team will contact you within 24 hours.",
      });

      setFormData({ name: "", venue_name: "", city: "", role: "", phone: "" });
      setSelectedSubject("");
    } catch (error) {
      console.error("Error submitting lead:", error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const [venueNames, setVenueNames] = useState<Record<string, string>>({
    events: "",
    adult: "",
    fleet: "",
  });
  const navigate = useNavigate();

  const industryCards = [
    {
      id: "events",
      Icon: PartyPopper,
      iconColor: "text-blue-300",
      headline: "Nightlife & Events",
      hook: "Don't let the line kill the vibe.",
      benefits: [
        { label: "Speed", text: "Verify guests in 3 seconds." },
        { label: "Insurance", text: "Lower premiums with verified safety." },
      ],
      price: "$299",
      period: "/ month",
      buttonText: "ACTIVATE EVENT LICENSE",
      subject: "Event Sales",
      bgImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80",
      borderColor: "border-blue-500/30",
      glowColor: "hover:shadow-[0_0_60px_rgba(59,130,246,0.5)]",
      buttonGradient: "from-blue-600 to-blue-500",
      inputPlaceholder: "Enter Event/Venue Name",
      paypal: {
        itemName: "Clean Check - Event License",
        amount: "299.00",
      },
      type: "license" as const,
    },
    {
      id: "adult",
      Icon: ShieldCheck,
      iconColor: "text-amber-400",
      headline: "Performer Compliance",
      hook: "The Iron Dome for Liability.",
      benefits: [
        { label: "Zero Liability", text: "Labs hold the medical data, not you." },
        { label: "Digital Waiver", text: "Mandatory indemnification for talent." },
      ],
      price: "$499",
      period: "/ month",
      buttonText: "ACTIVATE VENUE SHIELD",
      subject: "Club Compliance",
      bgImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      borderColor: "border-amber-500/50",
      glowColor: "hover:shadow-[0_0_60px_rgba(245,158,11,0.5)]",
      buttonGradient: "from-amber-600 to-amber-500",
      isPremium: true,
      inputPlaceholder: "Enter Club Name",
      paypal: {
        itemName: "Clean Check - Venue Liability Shield",
        amount: "499.00",
      },
      type: "license" as const,
    },
    {
      id: "workplace",
      Icon: Building2,
      iconColor: "text-slate-400",
      headline: "Workforce Management",
      hook: "Connect your team. Monitor the data.",
      benefits: [
        { label: "The Digital Handshake", text: "Scan an employee once to link them to your roster." },
        { label: "Real-Time Alerts", text: "Get notified if an employee's status turns Red." },
        { label: "Privacy First", text: "You see the \"Pass/Fail\" status, not their medical history." },
      ],
      price: "$299",
      period: "/ month",
      buttonText: "",
      subject: "Workplace System",
      bgImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      borderColor: "border-slate-500/30",
      glowColor: "hover:shadow-[0_0_60px_rgba(100,116,139,0.5)]",
      buttonGradient: "",
      inputPlaceholder: "Enter Company Name",
      type: "workforce" as const,
    },
    {
      id: "fleet",
      Icon: Car,
      iconColor: "text-emerald-400",
      headline: "Transportation & Fleets",
      hook: "Uber checks history. We check biology.",
      benefits: [
        { label: "Fleets", text: "Real-time driver toxicology monitoring." },
        { label: "Drivers", text: "Get hired fast with a Verified Green Pass." },
      ],
      price: "Tiered",
      period: "",
      buttonText: "",
      subject: "Fleet Sales",
      bgImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80",
      borderColor: "border-emerald-500/30",
      glowColor: "hover:shadow-[0_0_60px_rgba(74,222,128,0.5)]",
      buttonGradient: "from-emerald-600 to-emerald-500",
      inputPlaceholder: "Enter Fleet/Company Name",
      type: "fleet" as const,
    },
  ];

  return (
    <div 
      className="min-h-screen text-white font-sans"
      style={{
        background: 'radial-gradient(circle at 50% 30%, rgba(244, 114, 182, 0.25) 0%, rgba(15, 23, 42, 1) 90%)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      }}
    >
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-9 w-9 text-sky-400" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight">Clean Check</span>
              <span className="text-[10px] font-semibold text-sky-400 tracking-[0.2em] uppercase">Enterprise Security</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-slate-300 bg-slate-100 text-slate-900 hover:bg-white hover:text-black hover:border-slate-400 font-medium"
            asChild
          >
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-28 pb-8 md:pb-10 px-4">
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-sky-900/60 border border-sky-400/50 rounded-full px-5 py-2.5 mb-8 backdrop-blur-sm">
            <BadgeCheck className="h-5 w-5 text-sky-300" />
            <span className="text-sm text-sky-200 font-semibold tracking-wide">Enterprise-Grade Compliance</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
            Select Your{" "}
            <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Industry Solution
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Automated compliance and risk management for high-liability sectors. 
            <span className="text-white font-semibold"> Enterprise security, zero friction.</span>
          </p>
        </div>
      </section>

      {/* Immersive Industry Cards */}
      <section className="relative py-8 md:py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {industryCards.map((card) => (
              <div
                key={card.id}
                className={`group relative rounded-2xl overflow-hidden ${card.borderColor} border-2 transition-all duration-500 ${card.glowColor} hover:scale-[1.02] cursor-pointer`}
                style={{ minHeight: "520px" }}
              >
                {/* Background Image with Zoom Effect */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                  style={{ backgroundImage: `url(${card.bgImage})` }}
                />
                
                {/* Dark Gradient Overlay - Lighter for vibrant backgrounds */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/45 to-black/60" />
                
                {/* Premium Badge for Gold Card */}
                {card.isPremium && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className="relative z-10 h-full flex flex-col p-6 md:p-8">
                  {/* Header */}
                  <div className="mb-6">
                    <card.Icon className={`h-12 w-12 ${card.iconColor} mb-4`} />
                    <h3 className={`text-2xl md:text-3xl font-bold ${card.isPremium ? 'text-amber-400' : 'text-white'}`}>
                      {card.headline}
                    </h3>
                  </div>

                  {/* Marketing Hook */}
                  <p className="text-xl md:text-2xl font-light text-slate-200 italic mb-6 leading-relaxed">
                    "{card.hook}"
                  </p>

                  {/* Benefits List */}
                  <div className="space-y-3 mb-8 flex-grow">
                    {card.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="text-emerald-400 text-lg mt-0.5">✓</span>
                        <p className="text-slate-300">
                          <span className="font-bold text-white">{benefit.label}:</span> {benefit.text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Price Tag - Only for license cards (not fleet or workforce) */}
                  {card.type !== "fleet" && card.type !== "workforce" && (
                    <div className={`text-center mb-6 py-4 rounded-xl bg-white/5 border ${card.isPremium ? 'border-amber-500/30' : 'border-white/10'}`}>
                      <span className={`text-4xl font-black ${card.isPremium ? 'text-amber-400' : 'text-white'}`}>
                        {card.price}
                      </span>
                      <span className="text-slate-400 text-lg ml-1">{card.period}</span>
                    </div>
                  )}

                  {/* Fleet Card - Tiered Pricing */}
                  {card.type === "fleet" && (
                    <div className="w-full space-y-3">
                      <div className="text-xs text-slate-400 uppercase font-bold mb-2 tracking-wider">Fleet Licenses (Select Size)</div>
                      
                      {/* Small Fleet */}
                      <div className="border border-slate-600 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-bold text-sm">Small Fleet (1-50 Cars)</span>
                          <span className="text-emerald-400 font-bold">$299/mo</span>
                        </div>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                          <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                          <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                          <input type="hidden" name="item_name" value="Clean Check - Small Fleet License (1-50)" />
                          <input type="hidden" name="a3" value="299.00" />
                          <input type="hidden" name="p3" value="1" />
                          <input type="hidden" name="t3" value="M" />
                          <input type="hidden" name="src" value="1" />
                          <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                          <input type="hidden" name="cancel_return" value="https://cleancheck.fit/compliance" />
                          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-4 rounded text-xs transition-colors">
                            ACTIVATE SMALL FLEET
                          </button>
                        </form>
                      </div>

                      {/* Large Fleet */}
                      <div className="border border-slate-600 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-bold text-sm">Large Fleet (51-200 Cars)</span>
                          <span className="text-emerald-400 font-bold">$599/mo</span>
                        </div>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                          <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                          <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                          <input type="hidden" name="item_name" value="Clean Check - Large Fleet License (51-200)" />
                          <input type="hidden" name="a3" value="599.00" />
                          <input type="hidden" name="p3" value="1" />
                          <input type="hidden" name="t3" value="M" />
                          <input type="hidden" name="src" value="1" />
                          <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                          <input type="hidden" name="cancel_return" value="https://cleancheck.fit/compliance" />
                          <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-2 px-4 rounded text-xs transition-colors">
                            ACTIVATE LARGE FLEET
                          </button>
                        </form>
                      </div>

                      <hr className="border-slate-600 my-3" />

                      {/* Individual Driver - 14-Day Spot Check */}
                      <div className="p-4 rounded-lg border border-slate-500" style={{ background: 'rgba(0,0,0,0.3)' }}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-bold text-sm uppercase">For Individual Drivers</span>
                          <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-xs font-bold">14-DAY PASS</span>
                        </div>
                        
                        <div className="text-xl font-bold text-white mb-2">
                          $119.00 <span className="text-xs font-normal text-slate-400">/ One-Time</span>
                        </div>
                        
                        <ul className="text-xs text-slate-300 space-y-1.5 mb-3 pl-1">
                          <li>📦 Includes 1 Toxicology Kit (Shipped Priority).</li>
                          <li>🛡️ <strong className="text-white">Green Shield</strong> valid for exactly 14 Days.</li>
                          <li>📱 <strong className="text-white">QR Code</strong> for instant Green Shield sharing.</li>
                          <li>💼 Show to Fleets/Employers to get hired.</li>
                        </ul>
                        
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                          <input type="hidden" name="cmd" value="_xclick" />
                          <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                          <input type="hidden" name="item_name" value="Clean Check - Driver Verification Pass (14-Day)" />
                          <input type="hidden" name="amount" value="119.00" />
                          <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?amount=119&type=driver-14day" />
                          <input type="hidden" name="cancel_return" value="https://cleancheck.fit/compliance" />
                          <button 
                            type="submit" 
                            className="w-full py-3 font-bold rounded transition-colors"
                            style={{ background: '#333', color: 'white', border: '1px solid #facc15' }}
                          >
                            BUY 14-DAY PASS ($119)
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* License Cards - PayPal Form with Venue Input */}
                  {card.type === "license" && (
                    <form 
                      action="https://www.paypal.com/cgi-bin/webscr" 
                      method="post" 
                      target="_top"
                      className="w-full space-y-3"
                    >
                      <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                      <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                      <input type="hidden" name="item_name" value={card.id === 'events' ? 'Clean Check - Event License' : 'Clean Check - Venue Liability Shield'} />
                      <input type="hidden" name="a3" value={card.id === 'events' ? '299.00' : '499.00'} />
                      <input type="hidden" name="p3" value="1" />
                      <input type="hidden" name="t3" value="M" />
                      <input type="hidden" name="src" value="1" />
                      <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                      <input type="hidden" name="cancel_return" value="https://cleancheck.fit/compliance" />
                      <input type="hidden" name="on0" value="Venue Name" />
                      
                      {/* Venue Name Input */}
                      <input
                        type="text"
                        name="os0"
                        placeholder={card.inputPlaceholder}
                        required
                        value={venueNames[card.id] || ""}
                        onChange={(e) => setVenueNames(prev => ({ ...prev, [card.id]: e.target.value }))}
                        style={{ width: '100%', padding: '8px', marginBottom: '5px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'white' }}
                      />
                      
                      <button
                        type="submit"
                        style={{ 
                          width: '100%', 
                          padding: '15px', 
                          background: card.id === 'adult' ? '#D4AF37' : '#4CAF50', 
                          color: 'white', 
                          fontWeight: 'bold', 
                          cursor: 'pointer', 
                          zIndex: 10000, 
                          position: 'relative',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      >
                        {card.id === 'events' ? 'ACTIVATE EVENT ($299/mo)' : 'ACTIVATE SHIELD ($499/mo)'}
                      </button>
                    </form>
                  )}

                  {/* Workforce Management Card - Tiered Seat Licensing */}
                  {card.type === "workforce" && (
                    <div className="w-full space-y-3">
                      <div className="text-xs text-slate-400 uppercase font-bold mb-2 tracking-wider">Monthly Seat License (Select Size)</div>
                      
                      {/* Tier 1: Small Business (1-50) */}
                      <div className="border border-slate-600 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-bold text-sm">Small Biz (1-50 Employees)</span>
                          <span className="text-slate-300 font-bold">$399/mo</span>
                        </div>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="space-y-2">
                          <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                          <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                          <input type="hidden" name="item_name" value="Clean Check - Workforce Small Biz (1-50)" />
                          <input type="hidden" name="a3" value="399.00" />
                          <input type="hidden" name="p3" value="1" />
                          <input type="hidden" name="t3" value="M" />
                          <input type="hidden" name="src" value="1" />
                          <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?type=workforce-small" />
                          <input type="hidden" name="cancel_return" value="https://cleancheck.fit/compliance" />
                          <input type="hidden" name="on0" value="Company Name" />
                          <input
                            type="text"
                            name="os0"
                            placeholder="Enter Company Name"
                            required
                            className="w-full px-2 py-1.5 rounded text-white text-xs"
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                          />
                          <button type="submit" className="w-full bg-slate-500 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded text-xs transition-colors">
                            ACTIVATE SMALL BIZ
                          </button>
                        </form>
                      </div>

                      {/* Tier 2: Mid-Size (50-150) */}
                      <div className="border border-slate-600 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-bold text-sm">Mid-Size (50-150 Employees)</span>
                          <span className="text-slate-300 font-bold">$699/mo</span>
                        </div>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="space-y-2">
                          <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                          <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                          <input type="hidden" name="item_name" value="Clean Check - Workforce Mid-Size (50-150)" />
                          <input type="hidden" name="a3" value="699.00" />
                          <input type="hidden" name="p3" value="1" />
                          <input type="hidden" name="t3" value="M" />
                          <input type="hidden" name="src" value="1" />
                          <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?type=workforce-mid" />
                          <input type="hidden" name="cancel_return" value="https://cleancheck.fit/compliance" />
                          <input type="hidden" name="on0" value="Company Name" />
                          <input
                            type="text"
                            name="os0"
                            placeholder="Enter Company Name"
                            required
                            className="w-full px-2 py-1.5 rounded text-white text-xs"
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                          />
                          <button type="submit" className="w-full bg-slate-500 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded text-xs transition-colors">
                            ACTIVATE MID-SIZE
                          </button>
                        </form>
                      </div>

                      {/* Tier 3: Large (150-500) */}
                      <div className="border border-slate-600 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white font-bold text-sm">Large (150-500 Employees)</span>
                          <span className="text-slate-300 font-bold">$1,299/mo</span>
                        </div>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="space-y-2">
                          <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                          <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                          <input type="hidden" name="item_name" value="Clean Check - Workforce Large (150-500)" />
                          <input type="hidden" name="a3" value="1299.00" />
                          <input type="hidden" name="p3" value="1" />
                          <input type="hidden" name="t3" value="M" />
                          <input type="hidden" name="src" value="1" />
                          <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?type=workforce-large" />
                          <input type="hidden" name="cancel_return" value="https://cleancheck.fit/compliance" />
                          <input type="hidden" name="on0" value="Company Name" />
                          <input
                            type="text"
                            name="os0"
                            placeholder="Enter Company Name"
                            required
                            className="w-full px-2 py-1.5 rounded text-white text-xs"
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
                          />
                          <button type="submit" className="w-full bg-slate-500 hover:bg-slate-400 text-white font-bold py-2 px-4 rounded text-xs transition-colors">
                            ACTIVATE LARGE
                          </button>
                        </form>
                      </div>

                      {/* Tier 4: Enterprise (500-2000) */}
                      <div className="border border-amber-500/50 p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)' }}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-amber-400 font-bold text-sm">Enterprise (500-2000)</span>
                          <span className="text-amber-400 font-bold">$1,999/mo</span>
                        </div>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="space-y-2">
                          <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                          <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                          <input type="hidden" name="item_name" value="Clean Check - Workforce Enterprise (500-2000)" />
                          <input type="hidden" name="a3" value="1999.00" />
                          <input type="hidden" name="p3" value="1" />
                          <input type="hidden" name="t3" value="M" />
                          <input type="hidden" name="src" value="1" />
                          <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?type=workforce-enterprise" />
                          <input type="hidden" name="cancel_return" value="https://cleancheck.fit/compliance" />
                          <input type="hidden" name="on0" value="Company Name" />
                          <input
                            type="text"
                            name="os0"
                            placeholder="Enter Company Name"
                            required
                            className="w-full px-2 py-1.5 rounded text-white text-xs"
                            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(245,158,11,0.3)' }}
                          />
                          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-2 px-4 rounded text-xs transition-colors">
                            ACTIVATE ENTERPRISE
                          </button>
                        </form>
                      </div>

                      <hr className="border-slate-600 my-2" />

                      {/* Bulk Kits Add-on */}
                      <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
                        <div className="text-xs text-slate-400 uppercase font-bold mb-1 tracking-wider">Add-On: Order Test Kits</div>
                        <p className="text-xs text-slate-500 mb-2">Bulk packs for your crew.</p>
                        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                          <input type="hidden" name="cmd" value="_xclick" />
                          <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                          <input type="hidden" name="item_name" value="Clean Check - Bulk Employee Kits (10pk)" />
                          <input type="hidden" name="amount" value="890.00" />
                          <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?type=bulk-kits-10" />
                          <input type="hidden" name="cancel_return" value="https://cleancheck.fit/compliance" />
                          <button
                            type="submit"
                            className="w-full py-2 font-bold rounded transition-colors text-xs"
                            style={{ background: '#333', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
                          >
                            ORDER 10-PACK KITS ($890)
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Glow Border Effect */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  style={{
                    boxShadow: card.isPremium 
                      ? 'inset 0 0 30px rgba(245, 158, 11, 0.2)' 
                      : 'inset 0 0 30px rgba(255, 255, 255, 0.05)'
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-medium">SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <BadgeCheck className="h-5 w-5" />
              <span className="text-sm font-medium">256-bit Encryption</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section ref={formRef} className="relative py-8 md:py-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/30 to-transparent" />
        <div className="container mx-auto max-w-2xl relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Request <span className="text-sky-400">Enterprise Access</span>
            </h2>
            <p className="text-slate-400">
              Custom pricing available for multi-location deployments.
            </p>
          </div>

          <Card className="bg-slate-900/80 border-slate-700/50 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {selectedSubject && (
                  <div className="bg-sky-500/10 border border-sky-500/30 rounded-lg p-3 text-center">
                    <p className="text-sm text-sky-400 font-medium">
                      Inquiry: <span className="font-bold">{selectedSubject}</span>
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Your Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-sky-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="venue_name" className="text-slate-300">Venue Name *</Label>
                    <Input
                      id="venue_name"
                      name="venue_name"
                      placeholder="Club XYZ"
                      value={formData.venue_name}
                      onChange={handleInputChange}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-sky-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-slate-300">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="Miami, FL"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-sky-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-slate-300">Your Role *</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white focus:border-sky-400">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="Owner">Owner</SelectItem>
                        <SelectItem value="General Manager">General Manager</SelectItem>
                        <SelectItem value="Operations Manager">Operations Manager</SelectItem>
                        <SelectItem value="HR Manager">HR Manager</SelectItem>
                        <SelectItem value="Event Promoter">Event Promoter</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-sky-400"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold py-6 text-lg shadow-lg shadow-sky-500/25"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </Button>

                <p className="text-xs text-slate-500 text-center">
                  By submitting, you agree to be contacted by our enterprise sales team.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Strategic Partner Program Section */}
      <section className="relative py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div 
            className="relative rounded-2xl overflow-hidden border border-amber-500/40 text-center"
            style={{
              padding: '50px 40px',
              background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
            }}
          >
            {/* Elegant Gold Glow */}
            <div 
              className="absolute pointer-events-none"
              style={{
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle at 50% 50%, rgba(212,175,55,0.08) 0%, transparent 60%)',
              }}
            />
            
            {/* Top Gold Line Accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-6">
                <span className="text-xs text-amber-400 font-semibold tracking-wider uppercase">Exclusive Opportunity</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Strategic Partner Program
              </h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                Connect venues, refer members, and earn recurring revenue.{' '}
                <span className="text-amber-400 font-semibold">Join the Clean Check global network.</span>
              </p>

              <Button
                onClick={() => navigate('/partner-application')}
                className="text-black font-bold text-base px-10 py-6 rounded-lg border-none transition-all hover:scale-105 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #D4AF37 0%, #F5D87A 50%, #D4AF37 100%)',
                  boxShadow: '0 0 30px rgba(212,175,55,0.3)',
                }}
              >
                APPLY FOR PARTNERSHIP
              </Button>
              
              <p className="text-xs text-slate-500 mt-6">
                20% recurring commissions • Dedicated support • Global reach
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-8 px-4 bg-slate-950/50">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Shield className="h-4 w-4" />
              <span>Clean Check Enterprise™</span>
            </div>
            <div className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Clean Check. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="text-slate-400 hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Link to="/admin/login" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VenueCompliance;
