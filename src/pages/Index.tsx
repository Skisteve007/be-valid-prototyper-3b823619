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
import { useLongPressHome } from "@/hooks/useLongPressHome";
import { LanguageSelector, LanguageWelcomeBanner } from "@/components/LanguageSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReferralTracking } from "@/hooks/useReferralTracking";

const Index = () => {
  const navigate = useNavigate();
  const longPressHandlers = useLongPressHome();
  const isMobile = useIsMobile();
  useReferralTracking(); // Track affiliate referrals from URL
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
    <div 
      className="min-h-screen text-foreground overflow-x-hidden w-full max-w-full"
      style={{
        background: 'radial-gradient(circle at 50% 25%, rgba(255, 255, 255, 0.7) 0%, rgba(244, 114, 182, 0.5) 25%, rgba(40, 40, 40, 0.85) 75%)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      }}
    >
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-pink-500/25 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-900 to-transparent" />
      </div>

      {/* Mobile Welcome Banner */}
      {isMobile && <LanguageWelcomeBanner />}
      
      <header className="relative border-b border-pink-500/20 bg-slate-600/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 md:py-6 relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo + Partner Solutions - stacked */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <div 
                className="relative flex justify-center cursor-pointer"
                {...longPressHandlers}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 via-pink-500/60 to-blue-500/60 blur-3xl rounded-full scale-150"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-pink-400/40 to-blue-400/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
                <img src={logo} alt="Clean Check" className="relative w-auto h-20 md:h-24 select-none" draggable={false} />
              </div>
              {/* Action Pills - Centered Under Logo */}
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate("/compliance")}
                  variant="outline"
                  size="sm"
                  className="relative group overflow-hidden border border-pink-500/50 bg-gradient-to-r from-slate-900/80 via-pink-950/40 to-slate-900/80 hover:from-pink-600 hover:via-pink-500 hover:to-pink-600 text-white hover:text-white font-semibold text-[10px] tracking-wide px-2.5 py-1 h-6 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]"
                >
                  <span className="relative z-10 flex items-center gap-1">
                    🏢 Partner Solutions
                  </span>
                </Button>
                <Button
                  onClick={() => navigate("/partners")}
                  variant="outline"
                  size="sm"
                  className="relative group overflow-hidden border border-sky-500/50 bg-gradient-to-r from-slate-900/80 via-sky-950/40 to-slate-900/80 hover:from-sky-600 hover:via-sky-500 hover:to-sky-600 text-white hover:text-white font-semibold text-[10px] tracking-wide px-2.5 py-1 h-6 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(56,189,248,0.3)] hover:shadow-[0_0_20px_rgba(56,189,248,0.6)]"
                >
                  <span className="relative z-10 flex items-center gap-1">
                    🔬 Lab Access Portal
                  </span>
                </Button>
              </div>
            </div>

            {/* Tagline in the middle - desktop only */}
            <div className="hidden lg:flex flex-1 flex-col justify-center items-center px-8">
              <div className="relative px-20 py-2 rounded-full bg-gradient-to-r from-blue-400/30 via-pink-400/25 to-blue-400/30 border border-blue-300/50">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300/50 via-pink-300/40 to-blue-300/50 blur-xl rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-200/40 via-pink-200/30 to-blue-200/40 blur-2xl rounded-full"></div>
                <p className="relative text-lg xl:text-xl font-black text-center italic tracking-[0.25em] whitespace-nowrap text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  Instant Proof Health Status
                </p>
              </div>
              <p className="text-base xl:text-lg font-semibold text-center text-foreground mt-2 italic">
                QR-Coded Share. The Fastest Way to Verify Health & Toxicology Results.
              </p>
            </div>

            {/* Buttons - stacked on mobile, row on desktop */}
            <div className="flex flex-col md:flex-row gap-1.5 w-full md:w-auto items-stretch md:items-start flex-shrink-0">
              
              <Button 
                onClick={() => navigate("/auth?mode=login")}
                className="relative shadow-[0_0_20px_rgba(22,163,74,0.6)] hover:shadow-[0_0_30px_rgba(22,163,74,0.8)] border border-green-600/60 bg-green-600/15 text-white font-semibold text-xs md:text-sm min-h-[36px] py-1.5 px-3 touch-manipulation w-full md:w-auto"
              >
                <div className="absolute inset-0 bg-green-600/20 blur-md rounded-md -z-10"></div>
                Member Log In
              </Button>
              <div className="flex flex-col md:flex-row gap-1.5 w-full md:w-auto md:items-start">
                <div className="flex flex-col items-center gap-1">
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
                  <LanguageSelector />
                </div>
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
            <div className="relative inline-block px-12 py-1.5 rounded-full bg-gradient-to-r from-blue-400/30 via-pink-400/25 to-blue-400/30 border border-blue-300/50">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300/50 via-pink-300/40 to-blue-300/50 blur-lg rounded-full animate-pulse"></div>
              <p className="relative text-sm font-black italic tracking-[0.2em] whitespace-nowrap text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                Instant Proof Health Status
              </p>
            </div>
            <p className="text-sm font-semibold text-foreground mt-1 italic">
              QR-Coded Share. The Fastest Way to Verify Health & Toxicology Results.
            </p>
          </div>
          
        </div>
      </header>

      <main className="w-full overflow-x-hidden">
        {/* Hero Section */}
        <section className="py-6 md:py-8 px-4 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto text-center max-w-4xl">
            <ScrollReveal direction="fade" delay={100}>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 md:mb-6">
                <span 
                  className="bg-gradient-to-br from-white via-primary to-slate-300 bg-clip-text text-transparent"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(148, 163, 184, 0.8)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}
                >Clean </span>
                <span 
                  className="bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500 bg-clip-text text-transparent"
                  style={{ filter: 'drop-shadow(0 0 25px rgba(236, 72, 153, 0.9)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}
                >Check</span>
              </h1>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={200}>
              <p className="text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-3 font-black italic">
                <span 
                  className="bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 bg-clip-text text-transparent"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.9)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}
                >One Scan.</span>{" "}
                <span 
                  className="bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500 bg-clip-text text-transparent"
                  style={{ filter: 'drop-shadow(0 0 20px rgba(236, 72, 153, 0.9)) drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}
                >Zero Doubt.</span>
              </p>
              <p className="text-lg md:text-xl lg:text-2xl mb-4 italic" style={{ color: '#e2e8f0' }}>
                Instantly verify sexual health and toxicology results with one secure badge.
              </p>
              <p className="text-lg md:text-xl lg:text-2xl font-bold mb-2 text-white italic">
                The Trusted Peer-to-Peer Share.
              </p>
              <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8" style={{ color: '#cbd5e1' }}>
                Connect with confidence. Share your status securely, with the option to add Lab-Certified Toxicology & Health results whenever you need the ultimate green light.
              </p>
            </ScrollReveal>
            
            {/* Featured Sponsors - Always show 3 slots */}
            <ScrollReveal direction="up" delay={400}>
              <div className="mt-6 md:mt-8">
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-8 font-semibold">Trusted Community Sponsors</p>
                
                {/* Oval container with gradient background */}
                <div className="relative inline-flex justify-center px-8 md:px-16 py-6 md:py-8 rounded-full bg-gradient-to-br from-muted/60 via-primary/10 to-muted/60 border-2 border-border/40 shadow-[0_0_40px_rgba(59,130,246,0.3)] w-full">
                  {/* Gradient glow backdrop */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-pink-500/20 to-blue-500/20 blur-2xl rounded-full -z-10"></div>
                  
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

            {/* Pricing Cards */}
            <ScrollReveal direction="up" delay={200}>
              <div className="mb-8 md:mb-12">
                <h3 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 bg-gradient-to-br from-slate-400 via-primary to-slate-600 bg-clip-text text-transparent px-4">💳 Membership Pricing - Click to Select</h3>
              <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto px-4">
                {/* Single Member Subscription */}
                <Card className="transition-all relative hover:shadow-md shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] border-2 border-blue-500/30">
                  <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div className="space-y-1">
                      <CardTitle className="text-3xl">$39</CardTitle>
                      <CardDescription className="text-base font-semibold">Single Member</CardDescription>
                      <p className="text-sm text-muted-foreground whitespace-nowrap">Per 60 Days</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                      <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                      <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                      <input type="hidden" name="item_name" value="Clean Check - Single Member (60-Day)" />
                      <input type="hidden" name="a3" value="39.00" />
                      <input type="hidden" name="p3" value="2" />
                      <input type="hidden" name="t3" value="M" />
                      <input type="hidden" name="src" value="1" />
                      <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                      <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        SELECT PLAN ($39)
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Couple Subscription */}
                <Card className="transition-all relative hover:shadow-md shadow-[0_0_40px_rgba(236,72,153,0.5)] hover:shadow-[0_0_50px_rgba(236,72,153,0.7)] border-2 border-pink-500/30">
                  <div className="absolute inset-0 bg-pink-500/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div className="space-y-1">
                      <CardTitle className="text-3xl">$69</CardTitle>
                      <CardDescription className="text-base font-semibold">Joint/Couple</CardDescription>
                      <p className="text-sm text-muted-foreground whitespace-nowrap">Per 60 Days</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                      <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                      <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                      <input type="hidden" name="item_name" value="Clean Check - Joint Couple (60-Day)" />
                      <input type="hidden" name="a3" value="69.00" />
                      <input type="hidden" name="p3" value="2" />
                      <input type="hidden" name="t3" value="M" />
                      <input type="hidden" name="src" value="1" />
                      <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                      <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
                      <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
                        SELECT PLAN ($69)
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Single 1-Year Pass */}
                <Card className="transition-all relative hover:shadow-md shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] border-2 border-blue-500/30">
                  <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div>
                      <CardTitle className="text-3xl mb-1">$129</CardTitle>
                      <CardDescription className="text-base font-bold">Single One Year</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm mb-1">One-time payment</p>
                    <p className="text-base font-bold mb-3">
                      <span className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]">Save 20%</span>
                    </p>
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                      <input type="hidden" name="cmd" value="_xclick" />
                      <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                      <input type="hidden" name="item_name" value="Clean Check - Single 1-Year Pass" />
                      <input type="hidden" name="amount" value="129.00" />
                      <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                      <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
                      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                        BUY 1-YEAR ($129)
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Couple 1-Year Pass */}
                <Card className="transition-all relative hover:shadow-md shadow-[0_0_40px_rgba(236,72,153,0.5)] hover:shadow-[0_0_50px_rgba(236,72,153,0.7)] border-2 border-pink-500/30">
                  <div className="absolute inset-0 bg-pink-500/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div>
                      <CardTitle className="text-3xl mb-1">$219</CardTitle>
                      <CardDescription className="text-base font-bold">Couple One Year</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm mb-1">One-time payment</p>
                    <p className="text-base font-bold mb-3">
                      <span className="text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">Save 20%</span>
                    </p>
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                      <input type="hidden" name="cmd" value="_xclick" />
                      <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                      <input type="hidden" name="item_name" value="Clean Check - Couple 1-Year Pass" />
                      <input type="hidden" name="amount" value="219.00" />
                      <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                      <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
                      <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700">
                        BUY 1-YEAR ($219)
                      </Button>
                    </form>
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

        {/* Lab Kit Section */}
        <section className="py-6 px-4">
          <div className="container mx-auto max-w-4xl px-4">
            <ScrollReveal direction="up" delay={100}>
              <h3 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 bg-gradient-to-br from-slate-400 via-primary to-slate-600 bg-clip-text text-transparent px-4">🧪 Lab Verification Kits</h3>
              <div className="flex flex-col md:grid md:grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto">
                {/* Toxicology Kit */}
                <Card className="transition-all relative hover:shadow-md shadow-[0_0_40px_rgba(34,197,94,0.5)] hover:shadow-[0_0_50px_rgba(34,197,94,0.7)] border-2 border-green-500/30">
                  <div className="absolute inset-0 bg-green-500/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div className="space-y-1">
                      <CardTitle className="text-3xl">$129</CardTitle>
                      <CardDescription className="text-base font-semibold">Toxicology (10-Panel)</CardDescription>
                      <p className="text-sm text-muted-foreground">One-time purchase</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                      <input type="hidden" name="cmd" value="_xclick" />
                      <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                      <input type="hidden" name="item_name" value="Verification Kit - Toxicology (10-Panel)" />
                      <input type="hidden" name="amount" value="129.00" />
                      <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                      <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
                      <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                        ORDER TOX KIT ($129)
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* STD Kit */}
                <Card className="transition-all relative hover:shadow-md shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:shadow-[0_0_50px_rgba(168,85,247,0.7)] border-2 border-purple-500/30">
                  <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-lg -z-10"></div>
                  <CardHeader className="pb-3">
                    <div className="space-y-1">
                      <CardTitle className="text-3xl">$249</CardTitle>
                      <CardDescription className="text-base font-semibold">Platinum STD (13-Panel)</CardDescription>
                      <p className="text-sm text-muted-foreground">One-time purchase</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                      <input type="hidden" name="cmd" value="_xclick" />
                      <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                      <input type="hidden" name="item_name" value="Verification Kit - Platinum STD (13-Panel)" />
                      <input type="hidden" name="amount" value="249.00" />
                      <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                      <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
                      <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                        ORDER STD KIT ($249)
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
              <p className="text-center mt-6 text-muted-foreground flex items-center justify-center gap-2">
                <Package className="h-4 w-4 text-secondary" />
                Lab kits shipped directly to your door - results in 3-5 business days
              </p>
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

        {/* Get Started Section */}
        <section className="py-8 md:py-12 px-4">
          <div className="container mx-auto max-w-2xl px-4">
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-lg -z-10"></div>
                  <Card id="get-started-form" className="scroll-mt-8 relative shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)] border-2 border-blue-500/30">
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

                <p className="text-lg mt-6 mb-2">Automatic Approval! Your account will be activated instantly after payment.</p>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  YOUR unique QR Code will be generated after membership payment
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
        <section className="py-16 px-4 bg-gradient-to-br from-muted/30 via-pink-500/3 to-muted/30 border-y border-border/20">
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
        <section className="py-16 px-4 bg-gradient-to-br from-muted/30 via-pink-500/3 to-muted/30">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold mb-6">⚖️ LEGAL DISCLAIMER</h3>
            <p className="mb-6 text-white">By using Clean Check, you acknowledge and agree that:</p>
            
            <div className="space-y-3 text-sm text-white">
              <div>
                <h4 className="font-bold text-white mb-1">Service Nature:</h4>
                <p>Clean Check is a peer-to-peer data sharing tool and not a medical or financial service provider. The donor releases Clean Check from all liability for any health, financial, or informational consequences resulting from the use or alteration of this service. All membership contributions are non-refundable and final.</p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Platform Sponsors and Partners:</h4>
                <p>All sponsors, advertisers, and supporting partners of Clean Check (collectively "Sponsors") are held with NO LIABILITY for any health, financial, informational, or other consequences resulting from your use of this service.</p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Health Decisions:</h4>
                <p>Neither Clean Check nor Sponsors are responsible for any health-related outcomes, medical conditions, infections, or diseases that may result from interactions facilitated through this platform.</p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Financial Matters:</h4>
                <p>Neither Clean Check nor Sponsors bear responsibility for membership fees, payment processing issues, refund disputes, or any financial losses incurred.</p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Information Accuracy:</h4>
                <p>Neither Clean Check nor Sponsors are liable for the accuracy, completeness, or reliability of information shared by users, including health status, test results, or personal data.</p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Independent Service:</h4>
                <p>Sponsors provide advertising or financial support only and are completely separate from the operation, management, and content of Clean Check. Their participation does not constitute endorsement of user behavior or platform practices.</p>
              </div>

              <p className="pt-2 font-semibold text-white">
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
