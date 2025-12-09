import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, Lock, Zap, ArrowRight, HelpCircle, Package, Plane, ShieldCheck, Eye, EyeOff, ScanLine, FlaskConical, Users, Menu, X, Smartphone, MapPin, Key } from "lucide-react";
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
  useReferralTracking();
  const [selectedPlan, setSelectedPlan] = useState<"single" | "couple">("single");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [sponsors, setSponsors] = useState<Array<{ id: string; name: string; logo_url: string | null; website_url: string | null; tier: string; section: number }>>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<"travel" | "access" | "incognito">("access");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

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
    supabase.from("sponsor_analytics").insert({
      sponsor_id: sponsorId,
      event_type: "click",
      page_url: window.location.href,
    });
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

  const modeDescriptions = {
    travel: "Your secure travel companion. Store documents, health records, and verification badges for seamless border crossings and venue access worldwide.",
    access: "One QR code opens every door. Instant verification at venues, events, and exclusive locations. Share only what you choose.",
    incognito: "Full control mode. Set spending limits, hide personal details, and enjoy complete privacy at any participating venue."
  };

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden w-full max-w-full bg-background">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Header */}
      <header className="relative border-b border-primary/20 bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-2 md:py-3 relative">
          {/* Mobile Header */}
          <div className="flex flex-col md:hidden">
            <div className="flex items-center justify-between">
              <div className="relative flex cursor-pointer" {...longPressHandlers}>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-accent/60 to-primary/60 blur-2xl rounded-full scale-125"></div>
                <img src={logo} alt="VALID" className="relative w-auto h-16 select-none" draggable={false} />
              </div>
              
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
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute left-0 right-0 top-full bg-background/95 backdrop-blur-xl border-b border-primary/20 shadow-lg z-50 animate-fade-in">
              <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                <Button 
                  onClick={() => { navigate("/auth"); setMobileMenuOpen(false); }}
                  variant="ghost"
                  className="w-full justify-start gap-2 text-foreground"
                >
                  <ScanLine className="h-4 w-4" />
                  QR Code
                </Button>
                <Button 
                  onClick={() => {
                    if (session) { navigate("/dashboard"); } else { navigate("/auth"); }
                    setMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  className="w-full justify-start gap-2 text-foreground"
                >
                  <Users className="h-4 w-4" />
                  Profile
                </Button>
                <Button 
                  onClick={() => { navigate("/partners"); setMobileMenuOpen(false); }}
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
              </div>
            </div>
          )}

          {/* Desktop Header */}
          <div className="hidden md:flex md:flex-row md:items-center gap-4">
            <div className="flex flex-col items-start gap-3 flex-shrink-0 md:w-80 ml-0">
              <div className="relative flex justify-start cursor-pointer" {...longPressHandlers}>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-accent/60 to-primary/60 blur-3xl rounded-full scale-150"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
                <img src={logo} alt="VALID" className="relative w-auto h-28 md:h-40 select-none" draggable={false} />
              </div>
              <Button
                onClick={() => navigate("/partners")}
                variant="outline"
                size="default"
                className="relative group overflow-hidden border border-accent/50 bg-gradient-to-r from-secondary/80 via-accent/20 to-secondary/80 hover:from-accent hover:via-accent hover:to-accent text-foreground hover:text-accent-foreground font-semibold text-xs tracking-wide px-4 py-2 h-8 rounded-full transition-all duration-300 shadow-[0_0_10px_hsl(var(--accent)/0.3)] hover:shadow-[0_0_20px_hsl(var(--accent)/0.6)] mt-1 ml-0"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  🛸 Partner Solutions * Investor Relations
                </span>
              </Button>
            </div>

            <div className="hidden md:flex flex-1 flex-col justify-center items-center">
              <div className="relative px-20 py-2 rounded-full bg-gradient-to-r from-primary/30 via-accent/25 to-primary/30 border border-primary/50 shadow-[0_0_25px_hsl(var(--secondary)/0.5),0_0_50px_hsl(var(--secondary)/0.3)]">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-accent/40 to-primary/50 blur-xl rounded-full animate-pulse"></div>
                <p className="relative text-2xl xl:text-3xl font-black text-center italic tracking-[0.15em] whitespace-nowrap text-primary-foreground drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  VALID
                </p>
              </div>
              <p className="text-base xl:text-lg font-semibold text-center text-foreground mt-2 italic">
                Your Secure Ecosystem for Total Access
              </p>
              <div className="relative mt-3">
                <div className="absolute inset-0 bg-accent/30 blur-xl rounded-full animate-[pulse_4s_ease-in-out_infinite]"></div>
                <Button
                  onClick={scrollToGetStarted}
                  variant="outline"
                  className="relative px-6 py-2 h-auto bg-gradient-to-r from-secondary/80 via-accent/20 to-secondary/80 hover:from-accent hover:via-accent hover:to-accent text-foreground hover:text-accent-foreground font-bold text-sm tracking-wide rounded-full border border-accent/50 shadow-[0_0_10px_hsl(var(--accent)/0.3)] hover:shadow-[0_0_20px_hsl(var(--accent)/0.6)] transition-all duration-300 animate-[pulse_8s_ease-in-out_infinite]"
                >
                  <span className="flex items-center gap-2">⚡ Beta Version ⚡</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4 font-medium tracking-[0.15em]">
                Powered By Synthesized AI
              </p>
            </div>

            <div className="flex flex-col gap-2 items-center md:items-end flex-shrink-0 md:w-auto">
              <div className="flex flex-row gap-1.5 items-center">
                <Button 
                  variant="ghost" 
                  onClick={() => { if (session) { navigate("/dashboard?tab=qrcode"); } else { navigate("/auth"); } }}
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
                  onClick={() => { if (session) { navigate("/dashboard"); } else { navigate("/auth"); } }}
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
        {/* NEW: Be Valid Hero with Phone Mockup & Mode Switcher */}
        <section className="py-8 md:py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-6xl">
            <ScrollReveal direction="fade" delay={100}>
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left: Text Content */}
                <div className="text-center md:text-left order-2 md:order-1">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight text-foreground">
                    Be Valid.
                  </h1>
                  <p className="text-xl md:text-2xl font-medium text-muted-foreground mb-6">
                    One QR code. Total control. Everywhere you go.
                  </p>
                  
                  {/* Mode Switcher */}
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                    <Button
                      variant={activeMode === "travel" ? "default" : "outline"}
                      onClick={() => setActiveMode("travel")}
                      className={`flex items-center gap-2 ${activeMode === "travel" ? "bg-primary text-primary-foreground" : "border-primary/50"}`}
                    >
                      <Plane className="h-4 w-4" />
                      Travel
                    </Button>
                    <Button
                      variant={activeMode === "access" ? "default" : "outline"}
                      onClick={() => setActiveMode("access")}
                      className={`flex items-center gap-2 ${activeMode === "access" ? "bg-accent text-accent-foreground" : "border-accent/50"}`}
                    >
                      <MapPin className="h-4 w-4" />
                      Access
                    </Button>
                    <Button
                      variant={activeMode === "incognito" ? "default" : "outline"}
                      onClick={() => setActiveMode("incognito")}
                      className={`flex items-center gap-2 ${activeMode === "incognito" ? "bg-secondary text-secondary-foreground" : "border-secondary/50"}`}
                    >
                      <EyeOff className="h-4 w-4" />
                      Incognito
                    </Button>
                  </div>
                  
                  <p className="text-muted-foreground mb-8 max-w-lg">
                    {modeDescriptions[activeMode]}
                  </p>
                  
                  <Button
                    size="lg"
                    onClick={scrollToGetStarted}
                    className="bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/90 hover:to-accent/90 text-slate-900 font-bold shadow-[0_0_30px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_40px_hsl(var(--primary)/0.7)] min-h-[48px] py-4 px-8 touch-manipulation"
                  >
                    Be Valid <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                
                {/* Right: Phone Mockup */}
                <div className="order-1 md:order-2 flex justify-center">
                  <div className="relative">
                    {/* Phone Frame */}
                    <div className="relative w-64 md:w-80 h-[500px] md:h-[600px] bg-card rounded-[3rem] border-4 border-muted shadow-2xl overflow-hidden">
                      {/* Phone Notch */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-muted rounded-full z-10"></div>
                      
                      {/* Phone Screen Content */}
                      <div className="absolute inset-4 top-12 bg-gradient-to-b from-primary/10 via-background to-accent/10 rounded-2xl flex flex-col items-center justify-center p-6">
                        {/* QR Code Placeholder */}
                        <div className={`w-40 h-40 md:w-48 md:h-48 rounded-2xl flex items-center justify-center mb-6 border-4 ${
                          activeMode === "travel" ? "bg-primary/20 border-primary/50" :
                          activeMode === "access" ? "bg-accent/20 border-accent/50" :
                          "bg-secondary/20 border-secondary/50"
                        }`}>
                          <ScanLine className={`h-20 w-20 ${
                            activeMode === "travel" ? "text-primary" :
                            activeMode === "access" ? "text-accent" :
                            "text-secondary"
                          }`} />
                        </div>
                        
                        {/* Status Badge */}
                        <div className={`px-4 py-2 rounded-full font-bold text-sm mb-4 ${
                          activeMode === "travel" ? "bg-primary/20 text-primary border border-primary/50" :
                          activeMode === "access" ? "bg-accent/20 text-accent border border-accent/50" :
                          "bg-secondary/20 text-secondary border border-secondary/50"
                        }`}>
                          {activeMode === "travel" && "✈️ TRAVEL MODE"}
                          {activeMode === "access" && "✅ VALID ACCESS"}
                          {activeMode === "incognito" && "👁️ INCOGNITO"}
                        </div>
                        
                        {/* Mode Icon */}
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Smartphone className="h-4 w-4" />
                          <span>Scan to verify</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Glow Effect */}
                    <div className={`absolute -inset-4 rounded-[4rem] blur-3xl -z-10 opacity-40 ${
                      activeMode === "travel" ? "bg-primary" :
                      activeMode === "access" ? "bg-accent" :
                      "bg-secondary"
                    }`}></div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Step 1: Activate Your Membership */}
        <section className="py-8 md:py-12 px-4">
          <div className="container mx-auto max-w-4xl px-4">
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Step 1: Activate Your Membership</h2>
                <p className="text-muted-foreground">Choose your plan and get instant access to the VALID ecosystem</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <div className="mb-8 md:mb-12">
                <h3 className="text-2xl md:text-3xl font-bold text-center mb-3 md:mb-4 text-foreground px-4">💳 Membership Pricing - Click to Select</h3>
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-accent/40 blur-xl rounded-lg animate-pulse"></div>
                    <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-lg animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                    <div className="relative bg-gradient-to-r from-accent/30 via-accent/50 to-accent/30 border border-accent/40 rounded-lg px-4 py-2 md:px-6 md:py-3">
                      <p className="text-xs md:text-sm font-bold text-destructive tracking-wide">
                        🔥 BETA PRICING - 50% OFF ALL PLANS! 🔥
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-4xl mx-auto px-2 md:px-0">
                  {/* Single Member */}
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
                        <p className="text-sm text-muted-foreground whitespace-nowrap">Every 60 days</p>
                        <p className="text-xs font-bold text-destructive">🔥 Limited Time!</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 mt-auto">
                      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                        <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                        <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                        <input type="hidden" name="item_name" value="Clean Check - Single Member - 50% OFF" />
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

                  {/* Joint Couple */}
                  <Card className="h-full flex flex-col transition-all relative hover:shadow-md shadow-[0_0_40px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_50px_hsl(var(--accent)/0.7)] border-2 border-accent/30 overflow-hidden">
                    <div className="absolute top-2 right-[-35px] bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-10 py-1 transform rotate-45 z-10">50% OFF</div>
                    <div className="absolute inset-0 bg-accent/10 blur-xl rounded-lg -z-10"></div>
                    <CardHeader className="pb-3">
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg text-muted-foreground line-through">$69</span>
                          <CardTitle className="text-3xl text-accent">$34.50</CardTitle>
                        </div>
                        <CardDescription className="text-base font-semibold">Joint Couple</CardDescription>
                        <p className="text-sm text-muted-foreground whitespace-nowrap">Every 60 days</p>
                        <p className="text-xs font-bold text-destructive">🔥 Limited Time!</p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 mt-auto">
                      <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                        <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                        <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                        <input type="hidden" name="item_name" value="Clean Check - Joint Couple - 50% OFF" />
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
                        <input type="hidden" name="item_name" value="Clean Check - Single 1-Year Pass - 50% OFF" />
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
                        <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                        <input type="hidden" name="cancel_return" value="https://bevalid.app" />
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

        {/* Step 2: Get Verified (Optional) - Lab Kits */}
        <section className="py-8 md:py-12 px-4 bg-gradient-to-b from-background via-secondary/5 to-background">
          <div className="container mx-auto max-w-4xl px-4">
            <ScrollReveal direction="up" delay={100}>
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Step 2: Get Verified (Optional)</h2>
                <p className="text-muted-foreground">Upgrade to lab-certified status for verified proof</p>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={150}>
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
                      <p className="text-base font-bold text-foreground">How does VALID membership work?</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    After signing up and completing payment, you'll receive instant account activation. Upload your health documents to your profile, and your unique QR code will be generated automatically. This QR code can be shared with partners to show your verified health status.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-secondary/30 w-full shadow-sm">
                      <p className="text-base font-bold text-foreground">What's included in the membership?</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    Your membership includes: instant account activation, personalized QR code, secure health document storage, member profile with privacy controls, universal access across all partner sites using VALID services, and premium features including photo galleries and member secrets.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-accent/30 w-full shadow-sm">
                      <p className="text-base font-bold text-foreground">Is my health information secure and private?</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    Absolutely. All your data is encrypted and protected with industry-standard security. You control who sees your information through your QR code. We never share your personal health information without your explicit consent.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-none">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="bg-card/80 backdrop-blur-sm px-6 py-3 rounded-full border border-primary/30 w-full shadow-sm">
                      <p className="text-base font-bold text-foreground">How do I cancel my membership?</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pt-4 px-2">
                    You can cancel anytime through your PayPal account by going to Settings → Payments → Manage automatic payments → Cancel VALID subscription. Your membership will remain active until the end of your current billing period.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ScrollReveal>
          </div>
        </section>

        {/* Payment Information */}
        <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-muted/30 via-secondary/5 to-muted/30 border-y border-border/20">
          <div className="container mx-auto max-w-4xl">
            <h3 className="text-2xl font-bold mb-6 text-destructive">⚠️ Important Payment Information:</h3>
            <ul className="space-y-4 text-foreground">
              <li className="flex gap-3">
                <span className="font-bold shrink-0">•</span>
                <p><strong>RECURRING CHARGES:</strong> This is a subscription that automatically charges every 60 days from your initial payment date. Your membership will renew bi-monthly unless you cancel.</p>
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
        <section className="py-12 md:py-16 px-4 bg-gradient-to-br from-muted/30 via-accent/3 to-muted/30">
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
