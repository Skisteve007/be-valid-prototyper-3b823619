import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, PartyPopper, Footprints, BadgeCheck, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
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

  const industryCards = [
    {
      id: "events",
      icon: "🎉",
      headline: "Event Verification",
      category: "NIGHTLIFE & EVENTS",
      subtitle: "For Promoters/Clubs",
      hook: "Ensure a clean crowd. Lower insurance premiums.",
      pricing: "Platform Access: $299/mo + $2 per verification.",
      cta: "Start Event Trial",
      subject: "Event Sales",
      gradient: "from-purple-500/20 via-pink-500/20 to-purple-500/20",
      border: "border-purple-500/40 hover:border-purple-400",
      glow: "hover:shadow-[0_0_40px_rgba(168,85,247,0.4)]",
    },
    {
      id: "adult",
      icon: "👠",
      headline: "Performer Compliance",
      category: "ADULT ENTERTAINMENT",
      subtitle: "For Strip Clubs/Cabarets",
      hook: "The 'Liability Shield'. Automated testing mandates for 1099 talent.",
      pricing: "Venue License: $499/mo per location. (Talent pays for kits).",
      cta: "Automate My Compliance",
      subject: "Club Compliance",
      gradient: "from-red-500/20 via-orange-500/20 to-red-500/20",
      border: "border-red-500/40 hover:border-red-400",
      glow: "hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]",
    },
    {
      id: "workplace",
      icon: "🛡️",
      headline: "Employee Screening",
      category: "WORKPLACE SAFETY",
      subtitle: "For Staff/Bouncers",
      hook: "Zero-tolerance drug & health screening for W2 staff.",
      pricing: "Bulk Kits: Starting at $89/unit (Min order 10).",
      cta: "Order Bulk Packs",
      subject: "Bulk Order",
      gradient: "from-sky-500/20 via-blue-500/20 to-sky-500/20",
      border: "border-sky-500/40 hover:border-sky-400",
      glow: "hover:shadow-[0_0_40px_rgba(14,165,233,0.4)]",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-sky-400" />
            <span className="text-xl font-bold tracking-tight">Clean Check <span className="text-sky-400">Enterprise</span></span>
          </div>
          <Button 
            variant="outline" 
            className="border-sky-400 text-sky-400 hover:bg-sky-400 hover:text-slate-900"
            asChild
          >
            <Link to="/">← Back to Home</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-sky-400/10 border border-sky-400/30 rounded-full px-4 py-2 mb-8">
            <BadgeCheck className="h-4 w-4 text-sky-400" />
            <span className="text-sm text-sky-400 font-medium">B2B Compliance Solutions</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
            Select Your <span className="text-sky-400">Industry Solution</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
            Automated compliance and risk management for high-liability sectors.
          </p>
        </div>
      </section>

      {/* Industry Cards Grid */}
      <section className="py-8 md:py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {industryCards.map((card) => (
              <Card 
                key={card.id}
                onClick={() => scrollToForm(card.subject)}
                className={`bg-gradient-to-br ${card.gradient} ${card.border} border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${card.glow} group`}
              >
                <CardHeader className="pb-2">
                  <div className="text-5xl mb-4">{card.icon}</div>
                  <div className="text-xs font-bold text-slate-400 tracking-wider mb-1">{card.category}</div>
                  <CardTitle className="text-2xl font-bold text-white">{card.headline}</CardTitle>
                  <p className="text-sm text-slate-500">{card.subtitle}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 font-medium leading-relaxed">
                    "{card.hook}"
                  </p>
                  <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                    <p className="text-sm text-sky-400 font-semibold">{card.pricing}</p>
                  </div>
                  <Button 
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold group-hover:bg-sky-500 group-hover:text-slate-900 transition-all"
                  >
                    {card.cta}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section ref={formRef} className="py-16 md:py-24 px-4 bg-slate-800/50">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Request Enterprise Access
            </h2>
            <p className="text-slate-400">
              Fill out the form below and our team will contact you within 24 hours.
            </p>
          </div>

          <Card className="bg-slate-900 border-slate-700">
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
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-sky-400"
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
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-sky-400"
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
                      className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-sky-400"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-slate-300">Your Role *</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-white focus:border-sky-400">
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
                    className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-sky-400"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-sky-500 hover:bg-sky-400 text-slate-900 font-bold py-6 text-lg"
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
                  By submitting, you agree to be contacted by Clean Check sales team.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
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
      </footer>
    </div>
  );
};

export default VenueCompliance;