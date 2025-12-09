import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, Lock, Zap, Star, Globe, ArrowRight, HelpCircle, Package, Plane, ShieldCheck, Eye, EyeOff, ScanLine, FlaskConical, Users, RefreshCw, Menu, X } from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ScrollReveal from "@/components/ScrollReveal";
import { Session } from "@supabase/supabase-js";
import { useLongPressHome } from "@/hooks/useLongPressHome";
import { useReferralTracking } from "@/hooks/useReferralTracking";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  const navigate = useNavigate();
  const longPressHandlers = useLongPressHome();
  useReferralTracking(); // Track affiliate referrals from URL
  const [selectedPlan, setSelectedPlan] = useState<"single" | "couple">("single");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [sponsors, setSponsors] = useState<Array<{ id: string; name: string; logo_url: string | null; website_url: string | null; tier: string; section: number }>>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <div 
      className="min-h-screen text-foreground overflow-x-hidden w-full max-w-full bg-background"
    >
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      </div>

      <header className="relative border-b border-primary/20 bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 md:py-3 relative">
          {/* Mobile Header - Compact */}
          <div className="flex flex-col md:hidden">
            {/* Top row: Logo + Login/Hamburger */}
            <div className="flex items-center justify-between">
              {/* Logo - smaller on mobile */}
              <div 
                className="relative flex cursor-pointer"
                {...longPressHandlers}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-accent/60 to-primary/60 blur-2xl rounded-full scale-125"></div>
                <img src={logo} alt="VALID" className="relative w-auto h-16 select-none" draggable={false} />
              </div>
              
              {/* Mobile Right Side - Login + Hamburger */}
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => navigate("/auth?mode=login")}
                  size="sm"
                  className="relative shadow-[0_0_15px_hsl(var(--accent)/0.5)] border border-accent/60 bg-accent/15 text-foreground font-semibold text-xs py-1.5 px-3"
                >
                  Log In
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2"
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </div>
            </div>
            
            {/* Mobile Mission Content - inside header, matches desktop layout */}
            <div className="flex flex-col items-center py-3 lg:hidden">
              {/* Gradient pill with VALID text */}
              <div className="relative px-8 py-1.5 rounded-full bg-gradient-to-r from-primary/30 via-accent/25 to-primary/30 border border-primary/50 shadow-[0_0_25px_hsl(var(--secondary)/0.5),0_0_50px_hsl(var(--secondary)/0.3)]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-accent/40 to-primary/50 blur-xl rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40 blur-2xl rounded-full"></div>
                <div className="absolute inset-0 bg-secondary/20 blur-2xl rounded-full"></div>
                <p className="relative text-lg font-black text-center italic tracking-[0.15em] whitespace-nowrap text-primary-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  VALID
                </p>
              </div>
              {/* Tagline */}
              <p className="text-xs sm:text-sm font-semibold text-center text-foreground mt-2 italic">
                QR-Coded Access. Zero Trust ID Security. Health Verified. Integrated Payment.
              </p>
              {/* Glowing Beta Button */}
              <div className="relative mt-2">
                <div className="absolute inset-0 bg-accent/30 blur-xl rounded-full animate-[pulse_4s_ease-in-out_infinite]"></div>
                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full animate-[pulse_5s_ease-in-out_infinite]"></div>
                <Button
                  onClick={scrollToGetStarted}
                  variant="outline"
                  className="relative px-4 py-1.5 h-auto bg-gradient-to-r from-secondary/80 via-accent/20 to-secondary/80 hover:from-accent hover:via-accent hover:to-accent text-foreground hover:text-accent-foreground font-bold text-xs tracking-wide rounded-full border border-accent/50 shadow-[0_0_10px_hsl(var(--accent)/0.3)] hover:shadow-[0_0_20px_hsl(var(--accent)/0.6)] transition-all duration-300 animate-[pulse_8s_ease-in-out_infinite]"
                >
                  <span className="flex items-center gap-2">
                    ⚡ Beta Version ⚡
                  </span>
                </Button>
              </div>
              {/* Powered by text */}
              <p className="text-[10px] text-muted-foreground mt-2 font-medium tracking-[0.15em]">
                Powered By Synthetic AI*
              </p>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute left-0 right-0 top-full bg-background/95 backdrop-blur-xl border-b border-primary/20 shadow-lg z-50 animate-fade-in">
              <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                {/* Navigation Buttons */}
                <Button 
                  onClick={() => {
                    navigate("/auth");
                    setMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start gap-2 text-foreground"
                >
                  <ScanLine className="h-4 w-4" />
                  QR Code
                </Button>
                <Button 
                  onClick={() => {
                    if (session) {
                      navigate("/dashboard");
                    } else {
                      navigate("/auth");
                    }
                    setMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start gap-2 text-foreground"
                >
                  <Users className="h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  onClick={() => {
                    navigate("/compliance");
                    setMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start gap-2 text-foreground"
                >
                  🛸 Partner Solutions & Investor Relations
                </Button>
                
                <div className="border-t border-border pt-3 mt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ThemeToggle />
                  </div>
                </div>
                
                {/* Beta Badge */}
                <div className="text-center pt-2">
                  <span className="text-xs text-muted-foreground font-mono tracking-wider">⚡ Beta Version ⚡</span>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Header - Full */}
          <div className="hidden md:flex md:flex-row md:items-center gap-4">
            {/* Logo + Partner Solutions - left side */}
            <div className="flex flex-col items-start gap-3 flex-shrink-0 md:w-80 ml-0">
              <div 
                className="relative flex justify-start cursor-pointer"
                {...longPressHandlers}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-accent/60 to-primary/60 blur-3xl rounded-full scale-150"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
                <img src={logo} alt="VALID" className="relative w-auto h-28 md:h-40 select-none" draggable={false} />
              </div>
              {/* Partner Solutions Button - Under Logo */}
              <Button
                onClick={() => navigate("/compliance")}
                variant="outline"
                size="default"
                className="relative group overflow-hidden border border-accent/50 bg-gradient-to-r from-secondary/80 via-accent/20 to-secondary/80 hover:from-accent hover:via-accent hover:to-accent text-foreground hover:text-accent-foreground font-semibold text-xs tracking-wide px-4 py-2 h-8 rounded-full transition-all duration-300 shadow-[0_0_10px_hsl(var(--accent)/0.3)] hover:shadow-[0_0_20px_hsl(var(--accent)/0.6)] mt-1 ml-0"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  🛸 Partner Solutions * Investor Relations
                </span>
              </Button>
            </div>

            {/* Tagline in the middle - shows on md+ screens */}
            <div className="hidden md:flex flex-1 flex-col justify-center items-center">
              <div className="relative px-20 py-2 rounded-full bg-gradient-to-r from-primary/30 via-accent/25 to-primary/30 border border-primary/50 shadow-[0_0_25px_hsl(var(--secondary)/0.5),0_0_50px_hsl(var(--secondary)/0.3)]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-accent/40 to-primary/50 blur-xl rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40 blur-2xl rounded-full"></div>
                <div className="absolute inset-0 bg-secondary/20 blur-2xl rounded-full"></div>
                <p className="relative text-2xl xl:text-3xl font-black text-center italic tracking-[0.15em] whitespace-nowrap text-primary-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                VALID
                </p>
              </div>
              <p className="text-base xl:text-lg font-semibold text-center text-foreground mt-2 italic">
                QR-Coded Access. Zero Trust ID Security. Health Verified. Integrated Payment.
              </p>
              {/* Glowing Beta Button */}
              <div className="relative mt-3">
                <div className="absolute inset-0 bg-accent/30 blur-xl rounded-full animate-[pulse_4s_ease-in-out_infinite]"></div>
                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full animate-[pulse_5s_ease-in-out_infinite]"></div>
              <Button
                  onClick={scrollToGetStarted}
                  variant="outline"
                  className="relative px-6 py-2 h-auto bg-gradient-to-r from-secondary/80 via-accent/20 to-secondary/80 hover:from-accent hover:via-accent hover:to-accent text-foreground hover:text-accent-foreground font-bold text-sm tracking-wide rounded-full border border-accent/50 shadow-[0_0_10px_hsl(var(--accent)/0.3)] hover:shadow-[0_0_20px_hsl(var(--accent)/0.6)] transition-all duration-300 animate-[pulse_8s_ease-in-out_infinite]"
                >
                  <span className="flex items-center gap-2">
                    ⚡ Beta Version ⚡
                  </span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4 font-medium tracking-[0.15em]">
                Powered By Synthetic AI*
              </p>
            </div>

            {/* Right side - Login buttons (order: QR Code, Member Login, Profile) */}
            <div className="flex flex-col gap-2 items-center md:items-end flex-shrink-0 md:w-auto">
              <div className="flex flex-row gap-1.5 items-center">
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    if (session) {
                      navigate("/dashboard?tab=qrcode");
                    } else {
                      navigate("/auth");
                    }
                  }}
                  className="relative shadow-[0_0_20px_hsl(var(--chart-4)/0.6)] hover:shadow-[0_0_30px_hsl(var(--chart-4)/0.8)] border border-chart-4/60 bg-chart-4/15 text-chart-4 hover:text-chart-4 animate-pulse font-semibold text-xs md:text-sm min-h-[36px] py-1.5 px-3 touch-manipulation"
                >
                  <div className="absolute inset-0 bg-chart-4/20 blur-md rounded-md -z-10 animate-pulse"></div>
                  QR Code
                </Button>
                <Button 
                  onClick={() => navigate("/auth?mode=login")}
                  className="relative shadow-[0_0_20px_hsl(var(--accent)/0.6)] hover:shadow-[0_0_30px_hsl(var(--accent)/0.8)] border border-accent/60 bg-accent/15 text-foreground font-semibold text-xs md:text-sm min-h-[36px] py-1.5 px-3 touch-manipulation"
                >
                  <div className="absolute inset-0 bg-accent/20 blur-md rounded-md -z-10"></div>
                  Member Log In
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
                  className="relative shadow-[0_0_20px_hsl(var(--primary)/0.6)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.8)] border border-primary/60 bg-primary/15 font-semibold text-xs md:text-sm min-h-[36px] py-1.5 px-3 touch-manipulation"
                >
                  <div className="absolute inset-0 bg-primary/20 blur-md rounded-md -z-10"></div>
                  Profile
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="py-6 md:py-8 px-4 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto text-center max-w-4xl">
            <ScrollReveal direction="fade" delay={100}>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-3 tracking-tight leading-tight text-foreground">
                Your Secure Ecosystem for Total Access.
              </h1>
              <h2 className="text-xl md:text-2xl font-medium text-muted-foreground mb-4">
                Frictionless entry via QR code & Instant transactions. You set the limits VALID secures the rest.
              </h2>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs md:text-sm font-semibold text-emerald-500">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded-full">
                  <Lock className="h-4 w-4 text-violet-500" />
                  <span className="text-xs md:text-sm font-semibold text-violet-500">Bank-Grade Security</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/10 border border-sky-500/30 rounded-full">
                  <Globe className="h-4 w-4 text-sky-500" />
                  <span className="text-xs md:text-sm font-semibold text-sky-500">SOC 2 Type II</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full">
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span className="text-xs md:text-sm font-semibold text-amber-500">99.9% Uptime</span>
                </div>
              </div>

              {/* Peer-to-Peer Trust Core Value */}
              <div className="mt-6 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-secondary/40 via-accent/20 to-secondary/40 border border-accent/30 shadow-[0_0_30px_hsl(var(--accent)/0.2)]">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Users className="h-6 w-6 text-accent" />
                  <h3 className="text-lg md:text-xl font-bold text-foreground">Peer-to-Peer Trusted Share</h3>
                </div>
                <p className="text-sm md:text-base text-muted-foreground mb-4">
                  Share Your Status Directly With Anyone Via QR Code — No Awkward Conversations, No Fumbling Through Your Phone, No Digging Through Pockets Or Purse. No Middleman, No Database Lookups.
                  <strong className="text-foreground"> Want Verified Proof? Get Lab Certified.</strong>
                </p>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/30 border border-muted-foreground/30 rounded-full">
                    <ScanLine className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs md:text-sm font-semibold text-muted-foreground">Self-Reported Share</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/15 border border-primary/40 rounded-full">
                    <FlaskConical className="h-4 w-4 text-primary" />
                    <span className="text-xs md:text-sm font-semibold text-primary">+ Health Lab Certified</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-chart-4/15 border border-chart-4/40 rounded-full">
                    <FlaskConical className="h-4 w-4 text-chart-4" />
                    <span className="text-xs md:text-sm font-semibold text-chart-4">+ Toxicology Lab Certified</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={200}>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 md:mb-12 mt-8 md:mt-10 max-w-3xl mx-auto leading-relaxed">
                The Integrated Gateway to Verified Trust. Our <strong className="text-foreground">Zero-Trust QR-Scan System</strong> delivers secure, real-time results for <strong className="text-foreground">Comprehensive Wellness (Health & Toxicology)</strong> directly to your device. Connect with confidence, knowing your status is verified for all affiliated <strong className="text-foreground">lifestyle networks, high-value asset management, and compliant corporate environments.</strong>
              </p>
            </ScrollReveal>
            
            {/* Featured Sponsors - Always show 3 slots */}
            <ScrollReveal direction="up" delay={400}>
              <div className="mt-6 md:mt-8">
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-8 font-semibold">Trusted Community Sponsors</p>
                
                {/* Oval container with gradient background */}
                <div className="relative inline-flex justify-center px-8 md:px-16 py-6 md:py-8 rounded-full bg-gradient-to-br from-muted/60 via-primary/10 to-muted/60 border-2 border-border/40 shadow-[0_0_40px_hsl(var(--primary)/0.3)] w-full">
                  {/* Gradient glow backdrop */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-2xl rounded-full -z-10"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 lg:gap-20 w-full max-w-4xl">
                  {[0, 1, 2].map((index) => {
                    const sponsor = sponsors[index];
                    return (
                      <div key={index} className="flex items-center justify-center w-full">
                        {sponsor?.logo_url ? (
                          sponsor.website_url ? (
                            <a 
                              href={sponsor.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              onClick={() => handleSponsorClick(sponsor.id)}
                              className="transform transition-transform hover:scale-110 flex items-center justify-center"
                            >
                              <img 
                                src={sponsor.logo_url} 
                                alt={sponsor.name} 
                                className="h-16 md:h-20 lg:h-28 w-auto max-w-full object-contain filter drop-shadow-2xl"
                              />
                            </a>
                          ) : (
                            <img 
                              src={sponsor.logo_url} 
                              alt={sponsor.name} 
                              className="h-16 md:h-20 lg:h-28 w-auto max-w-full object-contain filter drop-shadow-2xl"
                            />
                          )
                        ) : (
                          <div className="w-full max-w-[160px] md:max-w-[180px] lg:max-w-[220px] h-16 md:h-20 lg:h-28 bg-muted/40 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-1 md:gap-2 hover:border-primary/60 transition-colors">
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
                <Button
                  onClick={() => navigate("/auth?mode=login")}
                  size="lg"
                  className="w-full max-w-xs relative shadow-[0_0_30px_hsl(var(--primary)/0.7)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.9)] border-2 border-primary/60 bg-primary/15 text-foreground font-bold text-base md:text-lg py-4 md:py-6 min-h-[48px] touch-manipulation"
                >
                  <div className="absolute inset-0 bg-primary/25 blur-lg rounded-md -z-10"></div>
                  Be Valid
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Access your profile, QR code, and documents
                </p>
                <Button 
                  onClick={scrollToGetStarted}
                  size="lg"
                  className="mt-4 relative shadow-[0_0_20px_hsl(var(--accent)/0.6)] hover:shadow-[0_0_30px_hsl(var(--accent)/0.8)] border border-accent/60 bg-accent/15 text-foreground font-semibold"
                >
                  <div className="absolute inset-0 bg-accent/20 blur-md rounded-md -z-10"></div>
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* The VALID Ecosystem Section */}
        <section className="py-6 px-4">
          <div className="container mx-auto max-w-5xl px-4">
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">The VALID Ecosystem</h3>
                <p className="text-muted-foreground">Three pillars of secure access and compliance</p>
              </div>
            </ScrollReveal>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {/* 1. Dynamic Peer Sharing */}
              <ScrollReveal direction="up" delay={200}>
                <Card className="h-full p-6 bg-card rounded-xl shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 transition-all">
                  <Users className="h-12 w-12 text-primary mb-4" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary)))' }} />
                  <CardTitle className="text-2xl font-bold mb-3 text-foreground">DYNAMIC PEER SHARING</CardTitle>
                  <p className="text-muted-foreground text-base">Instantly grant the green light to confidence. Share your verified status with peers and authorized network affiliates using a single tap. You are always in control of what data is shared, ensuring your profile is secure, discreet, and perfectly presented. This is how the most exclusive communities expand trust—frictionlessly. Expands social access, eliminates ambiguity, integrable with your current social networks across all major platforms.</p>
                </Card>
              </ScrollReveal>

              {/* 2. Identity, Health & Payment Solutions */}
              <ScrollReveal direction="up" delay={250}>
                <Card className="h-full p-6 bg-card rounded-xl shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 transition-all">
                  <CheckCircle className="h-12 w-12 text-primary mb-4" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary)))' }} />
                  <CardTitle className="text-2xl font-bold mb-3 text-foreground">IDENTITY, HEALTH & PAYMENT SOLUTIONS</CardTitle>
                  <p className="text-muted-foreground text-base">1 Secure QR code YOU control. Fit For Duty—Lifestyle Specs, Finances, Health Record Share, Identity Certification and ZeroTrust Security.</p>
                </Card>
              </ScrollReveal>

              {/* 3. Full Control Incognito Mode */}
              <ScrollReveal direction="up" delay={300}>
                <Card className="h-full p-6 bg-card rounded-xl shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 transition-all">
                  <EyeOff className="h-12 w-12 text-primary mb-4" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary)))' }} />
                  <CardTitle className="text-2xl font-bold mb-3 text-foreground">FULL CONTROL INCOGNITO MODE</CardTitle>
                  <p className="text-muted-foreground text-base">Directly link your funding source to your secure QR code to regulate and spend on your terms. Access any establishment in the network while remaining incognito. You control which lifestyle specs are visible. You set a strict budget for the visit and adhere to that automatically. One secure code, complete user control.</p>
                </Card>
              </ScrollReveal>

              {/* 4. Secure Transactions */}
              <ScrollReveal direction="up" delay={350}>
                <Card className="h-full p-6 bg-card rounded-xl shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 transition-all">
                  <ShieldCheck className="h-12 w-12 text-primary mb-4" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary)))' }} />
                  <CardTitle className="text-2xl font-bold mb-3 text-foreground">SECURE TRANSACTIONS</CardTitle>
                  <p className="text-muted-foreground text-base">Users link their own funding source with a safety cap. Zero skimming, zero chargebacks, instant revenue.</p>
                </Card>
              </ScrollReveal>

              {/* 5. Instant Verification */}
              <ScrollReveal direction="up" delay={400}>
                <Card className="h-full p-6 bg-card rounded-xl shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 transition-all">
                  <ScanLine className="h-12 w-12 text-primary mb-4" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary)))' }} />
                  <CardTitle className="text-2xl font-bold mb-3 text-foreground">INSTANT QR VERIFICATION</CardTitle>
                  <p className="text-muted-foreground text-base">Rapid, discreet status check ensures zero awkward conversations and frictionless entry/access at any verified venue.</p>
                </Card>
              </ScrollReveal>

              {/* 6. Proven Status */}
              <ScrollReveal direction="up" delay={450}>
                <Card className="h-full p-6 bg-card rounded-xl shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 transition-all">
                  <FlaskConical className="h-12 w-12 text-primary mb-4" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary)))' }} />
                  <CardTitle className="text-2xl font-bold mb-3 text-foreground">PROVEN STATUS</CardTitle>
                  <p className="text-muted-foreground text-base">Ensure verifiable health and toxicology status by selecting our certified option, backed by real-time integration with our clinical lab network. This add-on gives you the power to prove your validity on demand.</p>
                </Card>
              </ScrollReveal>

              {/* 7. Invisible Data */}
              <ScrollReveal direction="up" delay={500}>
                <Card className="h-full p-6 bg-card rounded-xl shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 transition-all">
                  <ShieldCheck className="h-12 w-12 text-chart-4 mb-4" style={{ filter: 'drop-shadow(0 0 5px hsl(142 71% 45%))' }} />
                  <CardTitle className="text-2xl font-bold mb-3 text-foreground">INVISIBLE DATA</CardTitle>
                  <p className="text-muted-foreground text-base">Your health details are protected by <strong className="text-foreground">Zero-Trust Encryption</strong>—only the compliance badge status is ever shared. HIPAA/GDPR compliant security.</p>
                </Card>
              </ScrollReveal>

              {/* 8. Trusted Everywhere - B2C focused */}
              <ScrollReveal direction="up" delay={550}>
                <Card className="h-full p-6 bg-card rounded-xl shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 transition-all">
                  <Globe className="h-12 w-12 text-chart-4 mb-4" style={{ filter: 'drop-shadow(0 0 5px hsl(142 71% 45%))' }} />
                  <CardTitle className="text-2xl font-bold mb-3 text-foreground">TRUSTED EVERYWHERE</CardTitle>
                  <p className="text-muted-foreground text-base">Accepted at <strong className="text-foreground">Lifestyle Venues, Nightlife Hotspots, Private Clubs, and Exclusive Events</strong>. One scan opens every door.</p>
                </Card>
              </ScrollReveal>

              {/* 9. Always In Control */}
              <ScrollReveal direction="up" delay={600}>
                <Card className="h-full p-6 bg-card rounded-xl shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 transition-all">
                  <RefreshCw className="h-12 w-12 text-chart-4 mb-4" style={{ filter: 'drop-shadow(0 0 5px hsl(142 71% 45%))' }} />
                  <CardTitle className="text-2xl font-bold mb-3 text-foreground">ALWAYS IN CONTROL</CardTitle>
                  <p className="text-muted-foreground text-base">Update your status anytime. Set reminders for re-verification. Your profile stays current and your access stays green.</p>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>


        {/* Membership Section */}
        <section className="pt-2 pb-4 px-4">
          <div className="container mx-auto max-w-4xl px-4">

            {/* Pricing Cards */}
            <ScrollReveal direction="up" delay={200}>
              <div className="mb-8 md:mb-12">
                <h3 className="text-2xl md:text-3xl font-bold text-center mb-3 md:mb-4 text-foreground px-4">💳 Membership Pricing - Click to Select</h3>
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-accent/40 blur-xl rounded-lg animate-pulse"></div>
                    <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-lg animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                    <div className="relative px-4 py-2 bg-card/80 border border-accent/60 rounded-md shadow-[0_0_20px_hsl(var(--accent)/0.5),inset_0_0_20px_hsl(var(--accent)/0.1)]">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-md"></div>
                      <span className="relative font-mono text-xs md:text-sm font-bold tracking-wider text-accent uppercase" style={{ textShadow: '0 0 10px hsl(var(--accent) / 0.8), 0 0 20px hsl(var(--accent) / 0.5)' }}>
                        ⚡ Beta Pricing • Limited Time ⚡
                      </span>
                      <p className="relative text-center text-xs text-muted-foreground mt-1 font-medium">
                        Powered By Synthetic AI
                      </p>
                    </div>
                  </div>
                </div>
              <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto px-4">
                {/* Single Member Subscription */}
                <Card className="h-full flex flex-col transition-all relative hover:shadow-md shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 overflow-hidden">
                  <div className="absolute top-2 right-[-35px] bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-10 py-1 transform rotate-45 z-10">50% OFF</div>
                  <div className="absolute inset-0 bg-accent/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg text-muted-foreground line-through">$39</span>
                        <CardTitle className="text-3xl text-accent">$19.50</CardTitle>
                      </div>
                      <CardDescription className="text-base font-semibold">Single Member</CardDescription>
                      <p className="text-sm text-muted-foreground whitespace-nowrap">Per 60 Days</p>
                      <p className="text-xs font-bold text-destructive">🔥 Limited Time!</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                      <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                      <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                      <input type="hidden" name="item_name" value="VALID - Single Member (60-Day) - 50% OFF" />
                      <input type="hidden" name="a3" value="19.50" />
                      <input type="hidden" name="p3" value="2" />
                      <input type="hidden" name="t3" value="M" />
                      <input type="hidden" name="src" value="1" />
                      <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                      <input type="hidden" name="cancel_return" value="https://bevalid.app" />
                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm">
                        SELECT
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Couple Subscription */}
                <Card className="h-full flex flex-col transition-all relative hover:shadow-md shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 overflow-hidden">
                  <div className="absolute top-2 right-[-35px] bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-10 py-1 transform rotate-45 z-10">50% OFF</div>
                  <div className="absolute inset-0 bg-accent/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg text-muted-foreground line-through">$69</span>
                        <CardTitle className="text-3xl text-accent">$34.50</CardTitle>
                      </div>
                      <CardDescription className="text-base font-semibold">Joint/Couple</CardDescription>
                      <p className="text-sm text-muted-foreground whitespace-nowrap">Per 60 Days</p>
                      <p className="text-xs font-bold text-destructive">🔥 Limited Time!</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                      <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                      <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                      <input type="hidden" name="item_name" value="VALID - Joint Couple (60-Day) - 50% OFF" />
                      <input type="hidden" name="a3" value="34.50" />
                      <input type="hidden" name="p3" value="2" />
                      <input type="hidden" name="t3" value="M" />
                      <input type="hidden" name="src" value="1" />
                      <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                      <input type="hidden" name="cancel_return" value="https://bevalid.app" />
                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm">
                        SELECT
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Single 1-Year Pass */}
                <Card className="h-full flex flex-col transition-all relative hover:shadow-md shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 overflow-hidden">
                  <div className="absolute top-2 right-[-35px] bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-10 py-1 transform rotate-45 z-10">50% OFF</div>
                  <div className="absolute inset-0 bg-accent/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg text-muted-foreground line-through">$129</span>
                        <CardTitle className="text-3xl text-accent">$64.50</CardTitle>
                      </div>
                      <CardDescription className="text-base font-semibold">Single One Year</CardDescription>
                      <p className="text-sm text-muted-foreground whitespace-nowrap">One-time payment</p>
                      <p className="text-xs font-bold text-destructive">🔥 Limited Time!</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                      <input type="hidden" name="cmd" value="_xclick" />
                      <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                      <input type="hidden" name="item_name" value="VALID - Single 1-Year Pass - 50% OFF" />
                      <input type="hidden" name="amount" value="64.50" />
                      <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                      <input type="hidden" name="cancel_return" value="https://bevalid.app" />
                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm">
                        SELECT
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Couple 1-Year Pass */}
                <Card className="h-full flex flex-col transition-all relative hover:shadow-md shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 overflow-hidden">
                  <div className="absolute top-2 right-[-35px] bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-10 py-1 transform rotate-45 z-10">50% OFF</div>
                  <div className="absolute inset-0 bg-accent/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg text-muted-foreground line-through">$219</span>
                        <CardTitle className="text-3xl text-accent">$109.50</CardTitle>
                      </div>
                      <CardDescription className="text-base font-semibold">Couple One Year</CardDescription>
                      <p className="text-sm text-muted-foreground whitespace-nowrap">One-time payment</p>
                      <p className="text-xs font-bold text-destructive">🔥 Limited Time!</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 mt-auto">
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                      <input type="hidden" name="cmd" value="_xclick" />
                      <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                      <input type="hidden" name="item_name" value="Clean Check - Couple 1-Year Pass - 50% OFF" />
                      <input type="hidden" name="amount" value="109.50" />
                      <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                      <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
                      <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-sm">
                        SELECT
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Lab Kits Section */}
        <section className="py-6 px-4 bg-gradient-to-b from-background via-secondary/5 to-background">
          <div className="container mx-auto max-w-4xl px-4">
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4 border border-primary/30">
                  <Package className="h-4 w-4" />
                  <span className="text-sm font-semibold text-primary">Lab Verification Kits</span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground">Upgrade to Lab-Certified Status</h3>
                <p className="text-muted-foreground text-sm">Get professionally verified results shipped to your door</p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
              <ScrollReveal direction="up" delay={200}>
                <Card className="relative shadow-[0_0_30px_hsl(var(--accent)/0.4)] hover:shadow-[0_0_40px_hsl(var(--accent)/0.6)] border-2 border-accent/30 transition-all h-full">
                  <div className="absolute inset-0 bg-accent/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="h-5 w-5 text-accent" />
                      <CardTitle className="text-lg">Lab-Certified 10-Panel Toxicology</CardTitle>
                    </div>
                    <CardDescription>Lab-Certified</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent mb-1">$129.00</div>
                    <div className="text-xs text-muted-foreground mb-3">One-Time Payment</div>
                    <Link to="/dashboard?tab=safety-screen">
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        Order Tox Kit
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={250}>
                <Card className="relative shadow-[0_0_30px_hsl(var(--accent)/0.4)] hover:shadow-[0_0_40px_hsl(var(--accent)/0.6)] border-2 border-accent/30 transition-all h-full">
                  <div className="absolute inset-0 bg-accent/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="h-5 w-5 text-accent" />
                      <CardTitle className="text-lg">Platinum 13-Panel Sexual Health Screen</CardTitle>
                    </div>
                    <CardDescription>Lab-Certified</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent mb-1">$249.00</div>
                    <div className="text-xs text-muted-foreground mb-3">One-Time Payment</div>
                    <Link to="/dashboard?tab=lab-verification">
                      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                        Order Health Kit
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Get Started Section */}
        <section className="py-8 md:py-12 px-4">
          <div className="container mx-auto max-w-2xl px-4">
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/10 blur-xl rounded-lg -z-10"></div>
                  <Card id="get-started-form" className="scroll-mt-8 relative shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30">
                    <CardHeader>
                      <CardTitle className="text-xl md:text-2xl text-foreground">Get Started</CardTitle>
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
                        className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-slate-900 font-bold shadow-[0_0_30px_hsl(var(--primary)/0.5),0_0_30px_hsl(var(--secondary)/0.5)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.7),0_0_40px_hsl(var(--secondary)/0.7)] transition-all min-h-[48px] py-4 touch-manipulation" 
                        onClick={handleContinue}
                        disabled={!fullName || !email}
                      >
                        Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <p className="text-lg mt-6 mb-2">Automatic Approval! Your account will be activated instantly after payment.</p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-secondary" />
                  YOUR unique QR Code will be generated after membership payment
                </p>
              </div>
            </ScrollReveal>
            
            {/* Simple Trust Section - B2C focused */}
            <ScrollReveal direction="up" delay={150}>
              <div className="p-6 mt-8 bg-muted/70 border border-accent/30 rounded-lg shadow-xl text-center">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">Your Privacy. Your Control. Always.</h3>
                <p className="text-muted-foreground text-base max-w-2xl mx-auto">
                  VALID uses <strong className="text-foreground">bank-grade encryption</strong> to protect your data. Only YOU decide what to share and when. No awkward conversations, no compromises.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-8 md:py-16 px-4 bg-background">
          <div className="container mx-auto max-w-4xl px-4">
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 md:px-4 py-2 rounded-full mb-2 border border-primary/30">
                  <HelpCircle className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-sm font-semibold text-primary">Frequently Asked Questions</span>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">Got Questions? We've Got Answers</h3>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <Accordion type="single" collapsible className="w-full space-y-1">
                <AccordionItem value="item-1" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/30 w-full shadow-sm">
                      <p className="text-base font-bold text-foreground">
                        How does VALID membership work?
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    After signing up and completing payment, you'll receive instant account activation. Upload your health documents to your profile, and your unique QR code will be generated automatically. This QR code can be shared with partners to show your verified health status.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-secondary/30 w-full shadow-sm">
                      <p className="text-base font-bold text-foreground">
                        What's included in the membership?
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    Your membership includes: instant account activation, personalized QR code, secure health document storage, member profile with privacy controls, universal access across all partner sites using VALID services, and premium features including photo galleries and member secrets.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-accent/30 w-full shadow-sm">
                      <p className="text-base font-bold text-foreground">
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
                    <div className="bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/30 w-full shadow-sm">
                      <p className="text-base font-bold text-foreground">
                        How do I cancel my membership?
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    You can cancel anytime through your PayPal account by going to Settings → Payments → Manage automatic payments → Cancel VALID subscription. Your membership will remain active until the end of your current billing period.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-secondary/30 w-full shadow-sm">
                      <p className="text-base font-bold text-foreground">
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
                    <div className="bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-accent/30 w-full shadow-sm">
                      <p className="text-base font-bold text-foreground">
                        Can I use VALID on multiple sites?
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    Yes! Your VALID membership is universal and works across all partner sites that employ VALID services. One membership gives you verified access everywhere.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/30 w-full shadow-sm">
                      <p className="text-base font-bold text-foreground">
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
                    <div className="bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-secondary/30 w-full shadow-sm">
                      <p className="text-base font-bold text-foreground">
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
        <section className="py-16 px-4 bg-gradient-to-br from-muted/30 via-secondary/5 to-muted/30 border-y border-border/20">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold mb-6 text-destructive">⚠️ Important Payment Information:</h3>
            <ul className="space-y-4 text-foreground">
              <li className="flex gap-3">
                <span className="font-bold shrink-0">•</span>
                <p><strong>RECURRING CHARGES:</strong> This is a subscription that automatically charges every 30 days from your initial payment date. Your membership will renew monthly unless you cancel.</p>
              </li>
              <li className="flex gap-3">
                <span className="font-bold shrink-0">•</span>
                <p><strong>How to Cancel:</strong> You must cancel through PayPal by going to your PayPal account → Settings → Payments → Manage automatic payments → Cancel VALID subscription.</p>
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
        <section className="py-16 px-4 bg-gradient-to-br from-muted/30 via-accent/3 to-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold mb-6 text-foreground">⚖️ LEGAL DISCLAIMER</h3>
            <p className="mb-6 text-foreground">By using VALID, you acknowledge and agree that:</p>
            
            <div className="space-y-3 text-sm text-foreground">
              <div>
                <h4 className="font-bold text-foreground mb-1">Service Nature:</h4>
                <p>VALID is a peer-to-peer data sharing tool and not a medical or financial service provider. The donor releases VALID from all liability for any health, financial, or informational consequences resulting from the use or alteration of this service. All membership contributions are non-refundable and final.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-1">Platform Sponsors and Partners:</h4>
                <p>All sponsors, advertisers, and supporting partners of VALID (collectively "Sponsors") are held with NO LIABILITY for any health, financial, informational, or other consequences resulting from your use of this service.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-1">Health Decisions:</h4>
                <p>Neither VALID nor Sponsors are responsible for any health-related outcomes, medical conditions, infections, or diseases that may result from interactions facilitated through this platform.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-1">Financial Matters:</h4>
                <p>Neither VALID nor Sponsors bear responsibility for membership fees, payment processing issues, refund disputes, or any financial losses incurred.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-1">Information Accuracy:</h4>
                <p>Neither VALID nor Sponsors are liable for the accuracy, completeness, or reliability of information shared by users, including health status, test results, or personal data.</p>
              </div>

              <div>
                <h4 className="font-bold text-foreground mb-1">Independent Service:</h4>
                <p>Sponsors provide advertising or financial support only and are completely separate from the operation, management, and content of VALID. Their participation does not constitute endorsement of user behavior or platform practices.</p>
              </div>

              <p className="pt-2 font-semibold text-foreground">
                You agree to hold harmless and indemnify VALID, its operators, and all Sponsors from any claims, damages, or liabilities arising from your use of this service. Use at your own risk.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Index;
