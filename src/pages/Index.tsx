import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Lock, Zap, Star, Globe, ArrowRight, HelpCircle, Package, Plane, ShieldCheck } from "lucide-react";
import logo from "@/assets/clean-check-logo.png";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ScrollReveal from "@/components/ScrollReveal";
import { Session } from "@supabase/supabase-js";

const Index = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<"single" | "couple">("single");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [sponsors, setSponsors] = useState<Array<{ id: string; name: string; logo_url: string | null; website_url: string | null; tier: string; section: number }>>([]);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchSponsors = async () => {
      const { data, error } = await supabase
        .from("sponsors")
        .select("id, name, logo_url, website_url, tier, section")
        .eq("active", true)
        .order("display_order", { ascending: true });

      if (!error && data) {
        setSponsors(data);
        // Track sponsor views
        data.forEach((sponsor) => {
          supabase.from("sponsor_analytics").insert({
            sponsor_id: sponsor.id,
            event_type: "view",
            page_url: window.location.href,
          });
        });
      }
    };

    fetchSponsors();
  }, []);

  const handleSponsorClick = (sponsorId: string) => {
    // Track sponsor click
    supabase.from("sponsor_analytics").insert({
      sponsor_id: sponsorId,
      event_type: "click",
      page_url: window.location.href,
    });
  };

  const getSponsorSize = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'h-20';
      case 'gold': return 'h-16';
      case 'silver': return 'h-12';
      default: return 'h-12';
    }
  };

  const handleContinue = () => {
    if (fullName && email) {
      navigate("/auth", { state: { fullName, email, selectedPlan } });
    }
  };

  const scrollToGetStarted = () => {
    const element = document.getElementById('get-started-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden w-full max-w-full">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo on top for mobile, left for desktop */}
            <div className="relative flex-shrink-0 flex justify-center md:justify-start">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 via-pink-500/60 to-blue-500/60 blur-3xl rounded-full scale-150"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-pink-400/40 to-blue-400/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
              <img src={logo} alt="Clean Check" className="relative w-auto h-20 md:h-24" />
            </div>

            {/* Tagline in the middle - desktop only */}
            <div className="hidden lg:flex flex-1 flex-col justify-center items-center px-8">
              <div className="relative px-12 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-pink-500/10 to-blue-500/10 border border-blue-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-pink-500/20 to-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-pink-400/10 to-blue-400/10 blur-2xl rounded-full"></div>
                <p className="relative text-lg xl:text-xl font-bold text-center text-foreground italic tracking-wide">
                  Insta Proof Health Status
                </p>
              </div>
              <p className="text-sm xl:text-base font-semibold text-center text-foreground mt-2 italic">
                QR-Coded Share. The Fastest Way to Verify Health & Toxicology Results.
              </p>
            </div>

            {/* Buttons - stacked on mobile, row on desktop */}
            <div className="flex flex-col md:flex-row gap-1.5 w-full md:w-auto items-stretch md:items-end flex-shrink-0">
              <Button 
                onClick={() => navigate("/auth?mode=login")}
                className="relative shadow-[0_0_20px_rgba(22,163,74,0.6)] hover:shadow-[0_0_30px_rgba(22,163,74,0.8)] border border-green-600/60 bg-green-600/15 text-white font-semibold text-xs md:text-sm min-h-[36px] py-1.5 px-3 touch-manipulation w-full md:w-auto"
              >
                <div className="absolute inset-0 bg-green-600/20 blur-md rounded-md -z-10"></div>
                Member Log In
              </Button>
              <div className="flex flex-col md:flex-row gap-1.5 w-full md:w-auto">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    if (session) {
                      navigate("/dashboard?tab=qrcode");
                    } else {
                      navigate("/auth");
                    }
                  }}
                  className="relative shadow-[0_0_20px_rgba(249,115,22,0.6)] hover:shadow-[0_0_30px_rgba(249,115,22,0.8)] border border-orange-600/60 bg-orange-600/15 text-orange-500 hover:text-orange-400 animate-pulse font-semibold text-xs md:text-sm min-h-[36px] py-1.5 px-3 touch-manipulation w-full md:w-auto"
                >
                  <div className="absolute inset-0 bg-orange-600/20 blur-md rounded-md -z-10 animate-pulse"></div>
                  QR Code
                </Button>
                <Button 
                  onClick={() => {
                    console.log("Profile button clicked, session:", session);
                    if (session) {
                      navigate("/dashboard");
                    } else {
                      navigate("/auth");
                    }
                  }}
                  className="relative shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] border border-blue-500/60 bg-blue-500/15 font-semibold text-xs md:text-sm min-h-[36px] py-1.5 px-3 touch-manipulation w-full md:w-auto"
                >
                  <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-md -z-10"></div>
                  Profile
                </Button>
              </div>
            </div>
          </div>
          
          {/* Mobile tagline below */}
          <div className="lg:hidden text-center mt-2">
            <div className="relative inline-block px-8 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-pink-500/10 to-blue-500/10 border border-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-pink-500/20 to-blue-500/20 blur-lg rounded-full animate-pulse"></div>
              <p className="relative text-sm font-bold text-foreground italic tracking-wide">
                Insta Proof Health Status
              </p>
            </div>
            <p className="text-xs font-semibold text-foreground mt-1 italic">
              QR-Coded Share. The Fastest Way to Verify Health & Toxicology Results.
            </p>
          </div>
        </div>
      </header>

      <main className="w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="py-6 md:py-8 px-4 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto text-center max-w-4xl px-4">
            <ScrollReveal direction="fade" delay={100}>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
                <span className="bg-gradient-to-br from-slate-300 via-primary to-slate-500 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] [text-shadow:_0_1px_20px_rgb(148_163_184_/_50%)]">Clean </span>
                <span className="bg-gradient-to-br from-slate-400 via-pink-400 to-slate-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">Check</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={200}>
              <p className="text-lg md:text-2xl lg:text-3xl mb-6 md:mb-8 font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                <span className="bg-gradient-to-br from-slate-400 via-blue-400 to-slate-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">Elevating</span>{" "}
                <span className="bg-gradient-to-br from-slate-400 via-pink-400 to-slate-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">Intimacy</span>{" "}
                <span className="bg-gradient-to-br from-slate-400 via-primary to-slate-600 bg-clip-text text-transparent">Through Verified Transparency and Mutual Trust.</span>
              </p>
            </ScrollReveal>
            
            {/* Featured Sponsors - Always show 3 slots */}
            <ScrollReveal direction="up" delay={400}>
              <div className="mt-6 md:mt-8">
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-8 font-semibold">Trusted Community Sponsors</p>
                
                {/* Oval container with gradient background */}
                <div className="relative inline-block px-6 md:px-12 py-6 md:py-8 rounded-full bg-gradient-to-br from-muted/60 via-primary/10 to-muted/60 border-2 border-border/40 shadow-[0_0_40px_rgba(59,130,246,0.3)] w-full max-w-full">
                  {/* Gradient glow backdrop */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-pink-500/20 to-blue-500/20 blur-2xl rounded-full -z-10"></div>
                  
                  <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-16">
                  {[0, 1, 2].map((index) => {
                    const sponsor = sponsors[index];
                    return (
                      <div key={index} className="flex items-center justify-center">
                        {sponsor?.logo_url ? (
                          sponsor.website_url ? (
                            <a 
                              href={sponsor.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={() => handleSponsorClick(sponsor.id)}
                              className="transform transition-transform hover:scale-110"
                            >
                              <img 
                                src={sponsor.logo_url} 
                                alt={sponsor.name} 
                                className="h-16 md:h-20 lg:h-28 w-auto filter drop-shadow-2xl"
                              />
                            </a>
                          ) : (
                            <img 
                              src={sponsor.logo_url} 
                              alt={sponsor.name} 
                              className="h-16 md:h-20 lg:h-28 w-auto filter drop-shadow-2xl"
                            />
                          )
                        ) : (
                          <div className="w-40 h-16 md:w-48 md:h-20 lg:w-64 lg:h-28 bg-muted/40 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-1 md:gap-2 hover:border-primary/60 transition-colors">
                            <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xl md:text-2xl lg:text-3xl">🏢</span>
                            </div>
                            <span className="text-xs md:text-sm font-medium text-muted-foreground">Sponsor Slot {index + 1}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                </div>
                
                {sponsors.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-4 text-center">
                    Sponsor logos managed by administrators
                  </p>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Member Login Quick Access */}
        <section className="py-4 md:py-6 px-4">
          <div className="container mx-auto max-w-md px-4">
            <ScrollReveal direction="up" delay={50}>
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 bg-gradient-to-r from-slate-400 via-primary to-slate-600 bg-clip-text text-transparent">
                  Already a Member?
                </h3>
                <Button 
                  onClick={() => navigate("/auth?mode=login")}
                  size="lg"
                  className="w-full max-w-xs relative shadow-[0_0_30px_rgba(22,163,74,0.7)] hover:shadow-[0_0_40px_rgba(22,163,74,0.9)] border-2 border-green-600/60 bg-green-600/15 text-white font-bold text-base md:text-lg py-4 md:py-6 min-h-[48px] touch-manipulation"
                >
                  <div className="absolute inset-0 bg-green-600/25 blur-lg rounded-md -z-10"></div>
                  Member Log In
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Access your profile, QR code, and documents
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Membership Section */}
        <section className="pt-2 pb-4 px-4">
          <div className="container mx-auto max-w-4xl px-4">
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center mb-12">
                {/* Get Started Form */}
                <div className="mb-8 relative">
                  <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-lg -z-10"></div>
                  <Card id="get-started-form" className="max-w-2xl mx-auto scroll-mt-8 relative shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] border-2 border-blue-500/30">
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl bg-gradient-to-br from-slate-400 via-primary to-slate-600 bg-clip-text text-transparent">Get Started</CardTitle>
                      <CardDescription className="text-sm">Both fields are required to proceed</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 px-4 md:px-6">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-sm md:text-base">Full Name *</Label>
                        <Input 
                          id="fullName"
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="min-h-[48px] touch-manipulation"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm md:text-base">Email Address *</Label>
                        <Input 
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="min-h-[48px] touch-manipulation"
                        />
                      </div>
                      <Button 
                        size="lg" 
                        className="w-full bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 text-white shadow-[0_0_30px_rgba(37,99,235,0.5),0_0_30px_rgba(219,39,119,0.5)] hover:shadow-[0_0_40px_rgba(37,99,235,0.7),0_0_40px_rgba(219,39,119,0.7)] transition-all min-h-[48px] py-4 touch-manipulation" 
                        onClick={handleContinue}
                        disabled={!fullName || !email}
                      >
                        Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <p className="text-lg mb-2">Automatic Approval! Your account will be activated instantly after payment.</p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  YOUR unique QR Code will be generated after membership payment, after documents uploaded onto your member profile page
                </p>
              </div>
            </ScrollReveal>

            {/* Pricing Cards */}
            <ScrollReveal direction="up" delay={200}>
              <div className="mb-8 md:mb-12">
                <h3 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 bg-gradient-to-br from-slate-400 via-primary to-slate-600 bg-clip-text text-transparent px-4">💳 Membership Pricing - Click to Select</h3>
              <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto px-4">
                <Card 
                  className={`cursor-pointer transition-all relative ${selectedPlan === "single" ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"} shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] border-2 border-blue-500/30`}
                  onClick={() => setSelectedPlan("single")}
                >
                  <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-3xl">$39</CardTitle>
                        <CardDescription className="text-base font-semibold">Single Member</CardDescription>
                        <p className="text-sm text-muted-foreground whitespace-nowrap">Per 3 Months</p>
                      </div>
                      {selectedPlan === "single" && (
                        <div className="flex items-center gap-1 text-primary text-sm font-medium">
                          <CheckCircle className="h-4 w-4" />
                          Selected
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                <Card 
                  className={`cursor-pointer transition-all relative ${selectedPlan === "couple" ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"} shadow-[0_0_40px_rgba(236,72,153,0.5)] hover:shadow-[0_0_50px_rgba(236,72,153,0.7)] border-2 border-pink-500/30`}
                  onClick={() => setSelectedPlan("couple")}
                >
                  <div className="absolute inset-0 bg-pink-500/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-3xl">$69</CardTitle>
                        <CardDescription className="text-base font-semibold">Joint/Couple</CardDescription>
                        <p className="text-sm text-muted-foreground whitespace-nowrap">Per 3 Months</p>
                      </div>
                      {selectedPlan === "couple" && (
                        <div className="flex items-center gap-1 text-primary text-sm font-medium">
                          <CheckCircle className="h-4 w-4" />
                          Selected
                        </div>
                      )}
                    </div>
                  </CardHeader>
                </Card>

                <Card className="cursor-pointer transition-all relative hover:shadow-md shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] border-2 border-blue-500/30">
                  <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div>
                      <CardTitle className="text-3xl mb-1">$129</CardTitle>
                      <CardDescription className="text-base font-bold">Single One Year</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm mb-1">One-time payment</p>
                    <p className="text-base font-bold">
                      <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">Save</span>{" "}
                      <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">20%</span>
                    </p>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-all relative hover:shadow-md shadow-[0_0_40px_rgba(236,72,153,0.5)] hover:shadow-[0_0_50px_rgba(236,72,153,0.7)] border-2 border-pink-500/30">
                  <div className="absolute inset-0 bg-pink-500/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div>
                      <CardTitle className="text-3xl mb-1">$219</CardTitle>
                      <CardDescription className="text-base font-bold">Couple One Year</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm mb-1">One-time payment</p>
                    <p className="text-base font-bold">
                      <span className="text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">Save</span>{" "}
                      <span className="text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">20%</span>
                    </p>
                  </CardContent>
                </Card>
              </div>
                <p className="text-center mt-6 text-muted-foreground flex items-center justify-center gap-2">
                  <Star className="h-4 w-4 text-secondary" />
                  Universal membership - works on all sites employing Clean Check services
                </p>
              </div>
            </ScrollReveal>

          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-6 px-4 bg-muted/30">
          <div className="container mx-auto max-w-6xl px-4">
            <ScrollReveal direction="up" delay={100}>
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-br from-slate-400 via-primary to-slate-600 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] tracking-wide">Why Join Clean Check?</h3>
            </ScrollReveal>
            <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <ScrollReveal direction="up" delay={200}>
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-lg"></div>
                  <Card className="relative h-full hover:shadow-lg transition-shadow border-2 border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-blue-500" />
                        </div>
                        <CardTitle>Verified Health Status</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Share your clean status with confidence</p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={250}>
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-pink-500/30 blur-2xl rounded-lg"></div>
                  <div className="absolute inset-0 bg-pink-400/20 blur-xl rounded-lg animate-pulse"></div>
                  <Card className="relative h-full hover:shadow-lg transition-shadow border-2 border-pink-500/40 shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_40px_rgba(236,72,153,0.6)]">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-pink-500/10 rounded-lg">
                          <Zap className="h-6 w-6 text-pink-500" />
                        </div>
                        <CardTitle>Instant - No Awkward Conversations</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Quick reveal through your unique QR code</p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={300}>
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-lg"></div>
                  <Card className="relative h-full hover:shadow-lg transition-shadow border-2 border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Zap className="h-6 w-6 text-blue-500" />
                        </div>
                        <CardTitle>Instant Activation</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Account active immediately after payment</p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={350}>
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-pink-500/30 blur-2xl rounded-lg"></div>
                  <div className="absolute inset-0 bg-pink-400/20 blur-xl rounded-lg animate-pulse"></div>
                  <Card className="relative h-full hover:shadow-lg transition-shadow border-2 border-pink-500/40 shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_40px_rgba(236,72,153,0.6)]">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-pink-500/10 rounded-lg">
                          <Star className="h-6 w-6 text-pink-500" />
                        </div>
                        <CardTitle>Premium Features</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">QR codes, galleries, Member Profile secrets 😈</p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={400}>
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-lg"></div>
                  <Card className="relative h-full hover:shadow-lg transition-shadow border-2 border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:shadow-[0_0_40px_rgba(59,130,246,0.6)]">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                          <Globe className="h-6 w-6 text-blue-500" />
                        </div>
                        <CardTitle>Universal Membership</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Works on all other sites that employ Clean Check services</p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={450}>
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-pink-500/30 blur-2xl rounded-lg"></div>
                  <div className="absolute inset-0 bg-pink-400/20 blur-xl rounded-lg animate-pulse"></div>
                  <Card className="relative h-full hover:shadow-lg transition-shadow border-2 border-pink-500/40 shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:shadow-[0_0_40px_rgba(236,72,153,0.6)]">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-pink-500/10 rounded-lg">
                          <Lock className="h-6 w-6 text-pink-500" />
                        </div>
                        <CardTitle>Private & Secure</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">Your data encrypted and protected</p>
                    </CardContent>
                  </Card>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 md:py-16 px-4 bg-background">
          <div className="container mx-auto max-w-4xl px-4">
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 md:px-4 py-2 rounded-full mb-2">
                  <HelpCircle className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-sm font-semibold bg-gradient-to-r from-slate-400 via-primary to-slate-600 bg-clip-text text-transparent">Frequently Asked Questions</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold"><span className="bg-gradient-to-br from-slate-400 via-blue-400 to-slate-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">Got</span> <span className="bg-gradient-to-br from-slate-400 via-pink-400 to-slate-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">Questions</span><span className="bg-gradient-to-br from-slate-400 via-blue-400 to-slate-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">?</span> <span className="bg-gradient-to-br from-slate-400 via-blue-400 to-slate-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">We&apos;ve</span> <span className="bg-gradient-to-br from-slate-400 via-blue-400 to-slate-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">Got</span> <span className="bg-gradient-to-br from-slate-400 via-pink-400 to-slate-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">Answers</span></h3>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <Accordion type="single" collapsible className="w-full space-y-1">
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-muted/50 px-6 py-3 rounded-full border-2 border-border w-full">
                      <p className="text-base font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                        How does Clean Check membership work?
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    After signing up and completing payment, you'll receive instant account activation. Upload your health documents to your profile, and your unique QR code will be generated automatically. This QR code can be shared with partners to show your verified health status.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-muted/50 px-6 py-3 rounded-full border-2 border-border w-full">
                      <p className="text-base font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        What's included in the membership?
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    Your membership includes: instant account activation, personalized QR code, secure health document storage, member profile with privacy controls, universal access across all partner sites using Clean Check services, and premium features including photo galleries and member secrets.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-muted/50 px-6 py-3 rounded-full border-2 border-border w-full">
                      <p className="text-base font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-purple-500 bg-clip-text text-transparent">
                        Is my health information secure and private?
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    Absolutely. All your data is encrypted and protected with industry-standard security. You control who sees your information through your QR code. We never share your personal health information without your explicit consent.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-muted/50 px-6 py-3 rounded-full border-2 border-border w-full">
                      <p className="text-base font-bold bg-gradient-to-r from-purple-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        How do I cancel my membership?
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    You can cancel anytime through your PayPal account by going to Settings → Payments → Manage automatic payments → Cancel Clean Check subscription. Your membership will remain active until the end of your current billing period.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-muted/50 px-6 py-3 rounded-full border-2 border-border w-full">
                      <p className="text-base font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-pink-500 bg-clip-text text-transparent">
                        What's the difference between Single and Joint/Couple memberships?
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    Single membership ($29/month) is for one person with their own profile and QR code. Joint/Couple membership ($49/month) provides two linked profiles with separate QR codes, perfect for couples who want to maintain their health transparency together.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-muted/50 px-6 py-3 rounded-full border-2 border-border w-full">
                      <p className="text-base font-bold bg-gradient-to-r from-pink-500 via-pink-500 to-pink-600 bg-clip-text text-transparent">
                        Can I use Clean Check on multiple sites?
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    Yes! Your Clean Check membership is universal and works across all partner sites that employ Clean Check services. One membership gives you verified access everywhere.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-muted/50 px-6 py-3 rounded-full border-2 border-border w-full">
                      <p className="text-base font-bold bg-gradient-to-r from-pink-600 via-pink-600 to-pink-600 bg-clip-text text-transparent">
                        What if I need to update my health documents?
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    You can update your health documents anytime through your dashboard. Your QR code automatically reflects the age of your documents with color-coded indicators: green (1-60 days), yellow (61-120 days), and red (121+ days).
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-muted/50 px-6 py-3 rounded-full border-2 border-border w-full">
                      <p className="text-base font-bold bg-gradient-to-r from-pink-600 via-pink-700 to-pink-600 bg-clip-text text-transparent">
                        Are there any refunds?
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    All membership contributions are non-refundable and final once processed. This is a digital subscription service, and no refunds are provided after your QR code is generated.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollReveal>
          </div>
        </section>

        {/* Payment Information */}
        <section className="py-16 px-4 bg-gradient-to-br from-muted/80 via-pink-500/10 to-muted/80 border-y border-border/20">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold mb-6 text-destructive">⚠️ Important Payment Information:</h3>
            <ul className="space-y-4 text-foreground">
              <li className="flex gap-3">
                <span className="font-bold shrink-0">•</span>
                <p><strong>RECURRING CHARGES:</strong> This is a subscription that automatically charges every 30 days from your initial payment date. Your membership will renew monthly unless you cancel.</p>
              </li>
              <li className="flex gap-3">
                <span className="font-bold shrink-0">•</span>
                <p><strong>How to Cancel:</strong> You must cancel through PayPal by going to your PayPal account → Settings → Payments → Manage automatic payments → Cancel Clean Check subscription.</p>
              </li>
              <li className="flex gap-3">
                <span className="font-bold shrink-0">•</span>
                <p><strong>Non-Refundable:</strong> All membership contributions are non-refundable and final once processed.</p>
              </li>
              <li className="flex gap-3">
                <span className="font-bold shrink-0">•</span>
                <p><strong>Instant Activation:</strong> Your account activates immediately upon first payment.</p>
              </li>
              <li className="flex gap-3">
                <span className="font-bold shrink-0">•</span>
                <p><strong>Venmo option available on mobile devices</strong></p>
              </li>
            </ul>
          </div>
        </section>

        {/* Legal Disclaimer */}
        <section className="py-16 px-4 bg-gradient-to-br from-muted/80 via-pink-500/10 to-muted/80">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold mb-6">⚖️ LEGAL DISCLAIMER</h3>
            <p className="mb-6 text-foreground">By using Clean Check, you acknowledge and agree that:</p>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <div>
                <h4 className="font-bold text-foreground mb-1">Service Nature:</h4>
                <p>Clean Check is a peer-to-peer data sharing tool and not a medical or financial service provider. The donor releases Clean Check from all liability for any health, financial, or informational consequences resulting from the use or alteration of this service. All membership contributions are non-refundable and final.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-1">Platform Sponsors and Partners:</h4>
                <p>All sponsors, advertisers, and supporting partners of Clean Check (collectively "Sponsors") are held with NO LIABILITY for any health, financial, informational, or other consequences resulting from your use of this service.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-1">Health Decisions:</h4>
                <p>Neither Clean Check nor Sponsors are responsible for any health-related outcomes, medical conditions, infections, or diseases that may result from interactions facilitated through this platform.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-1">Financial Matters:</h4>
                <p>Neither Clean Check nor Sponsors bear responsibility for membership fees, payment processing issues, refund disputes, or any financial losses incurred.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-1">Information Accuracy:</h4>
                <p>Neither Clean Check nor Sponsors are liable for the accuracy, completeness, or reliability of information shared by users, including health status, test results, or personal data.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-1">Independent Service:</h4>
                <p>Sponsors provide advertising or financial support only and are completely separate from the operation, management, and content of Clean Check. Their participation does not constitute endorsement of user behavior or platform practices.</p>
              </div>

              <p className="pt-2 font-semibold text-foreground">
                You agree to hold harmless and indemnify Clean Check, its operators, and all Sponsors from any claims, damages, or liabilities arising from your use of this service. Use at your own risk.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
