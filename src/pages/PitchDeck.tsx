import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { 
  ArrowLeft, 
  Globe, 
  TrendingUp, 
  Clock, 
  QrCode,
  Building2,
  DollarSign,
  Target,
  Zap,
  ArrowRight,
  ArrowRightLeft,
  Check,
  X,
  ShieldCheck,
  Lock,
  Share2,
  Network,
  Crown,
  XCircle,
  CheckCircle2,
  Users,
  Plane,
  Car,
  Briefcase,
  Heart,
  Rocket,
  Ghost,
  Fingerprint,
  Radio,
  Phone,
  AlertTriangle,
  AlertCircle,
  ChevronDown,
  FileText,
  PiggyBank,
  CreditCard,
  Calendar,
  Info,
  Maximize2,
  FileDown,
  ExternalLink,
  Layers,
  Shield,
  Activity,
  MapPin,
  Sparkles,
  CircleDot
} from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";
import HtmlPitchDeckCarousel from "@/components/pitch/HtmlPitchDeckCarousel";
import SynthButton from "@/components/SynthButton";
import RevenueModelSection from "@/components/pitch/RevenueModelSection";

// NOTE: The PDF at this path is not reliably embeddable in Chrome.
// We render the 14-slide deck as images below for maximum compatibility.
const INVESTOR_DECK_PDF_URL = "/images/pitch/VALID-Investor-Deck-2025.pdf";

const PitchDeck = () => {
  const navigate = useNavigate();
  const [deckOpenRequest, setDeckOpenRequest] = useState(0);
  const [futureReadyText, setFutureReadyText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [noPromoter, setNoPromoter] = useState(false);
  const futureText = '2027 FUTURE READY';
  
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= futureText.length) {
        setFutureReadyText(futureText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 150);
    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const metrics = [
    { label: "Partner Venues", value: "28+", icon: Building2, color: "text-cyan-400" },
    { label: "Countries", value: "11", icon: Globe, color: "text-green-400" },
    { label: "Verification Speed", value: "3 sec", icon: Clock, color: "text-purple-400" },
    { label: "Member Growth", value: "15%", subtext: "MoM", icon: TrendingUp, color: "text-orange-400" },
  ];

const scorecardData = [
    { feature: "Integrated Health/Tox Status (HIPAA)", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: true, eventbrite: false, dice: false, salesforce: false, checkr: false, highlight: true },
    { feature: "Zero-Trust Backend Security", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, salesforce: false, checkr: false, highlight: true },
    { feature: "Automated Revenue Share", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, salesforce: false, checkr: false, highlight: true },
    { feature: "Peer-to-Peer Network Trust", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, salesforce: false, checkr: false, highlight: true },
    { feature: "Frictionless Staff Workflow", valid: true, clear: true, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, dice: true, salesforce: true, checkr: false },
    { feature: "Rolling Compliance & Screening", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: true, eventbrite: false, dice: false, salesforce: false, checkr: true },
    { feature: "In-App Wallet Payments", valid: true, clear: false, idme: false, ticketmaster: true, sterling: false, stdcheck: false, eventbrite: true, dice: true, salesforce: false, checkr: false },
    { feature: "Digital Identity Verification", valid: true, clear: true, idme: true, ticketmaster: true, sterling: true, stdcheck: false, eventbrite: true, dice: true, salesforce: false, checkr: true },
    { feature: "Instant Settlement", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, salesforce: false, checkr: false, highlight: true },
    { feature: "Viral Identity & Beacon", valid: true, clear: false, idme: false, ticketmaster: false, sterling: false, stdcheck: false, eventbrite: false, dice: false, salesforce: false, checkr: false, highlight: true },
  ];

  const validScore = scorecardData.filter(r => r.valid).length;

  const renderCheck = (value: boolean, isValid?: boolean) => {
    if (value) {
      return <Check className={`h-5 w-5 mx-auto ${isValid ? 'text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.8)]' : 'text-green-400 drop-shadow-[0_0_6px_rgba(74,222,128,0.8)]'}`} />;
    }
    return <X className="h-5 w-5 mx-auto text-red-400 drop-shadow-[0_0_6px_rgba(248,113,113,0.8)]" />;
  };

  // Section divider component for consistent styling with pulsating white glow
  const SectionDivider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-4" style={{ padding: 'clamp(64px, 8vw, 96px) 0' }}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <span 
        className="tracking-[0.3em] uppercase font-medium animate-[pulseGlow_2.5s_ease-in-out_infinite]" 
        style={{ 
          fontSize: 'clamp(14px, 1vw, 16px)',
          color: '#ffffff',
          textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.6), 0 0 30px rgba(255, 255, 255, 0.4)',
        }}
      >
        {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
    </div>
  );

  // Section header with icon for visual hierarchy
  const SectionHeader = ({ icon: Icon, label, title, subtitle }: { icon: any; label: string; title: string; subtitle?: string }) => (
    <div className="text-center" style={{ marginBottom: 'clamp(32px, 4vw, 48px)' }}>
      <div className="flex items-center justify-center gap-3 mb-4">
        <Icon className="text-cyan-400" style={{ width: 'clamp(22px, 1.8vw, 28px)', height: 'clamp(22px, 1.8vw, 28px)' }} />
        <span className="tracking-[0.25em] uppercase text-cyan-400 font-semibold" style={{ fontSize: 'clamp(13px, 1vw, 16px)' }}>{label}</span>
      </div>
      <h2 className="font-bold font-orbitron text-white" style={{ fontSize: 'clamp(30px, 2.4vw, 44px)', lineHeight: '1.2' }}>{title}</h2>
      {subtitle && <p className="text-white/80 mt-3 max-w-3xl mx-auto" style={{ fontSize: 'clamp(16px, 1.1vw, 20px)', lineHeight: '1.5' }}>{subtitle}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-cyan-500 selection:text-black relative overflow-hidden">
      
      {/* Pulsating glow keyframes */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { 
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.6), 0 0 20px rgba(255, 255, 255, 0.4), 0 0 30px rgba(255, 255, 255, 0.2);
          }
          50% { 
            text-shadow: 0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(255, 255, 255, 0.8), 0 0 45px rgba(255, 255, 255, 0.6);
          }
        }
        @keyframes bluePulseGlow {
          0%, 100% { 
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.6), 0 0 20px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.2);
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.2);
          }
          50% { 
            text-shadow: 0 0 15px rgba(59, 130, 246, 1), 0 0 30px rgba(59, 130, 246, 0.8), 0 0 45px rgba(59, 130, 246, 0.6);
            box-shadow: 0 0 25px rgba(59, 130, 246, 0.6), 0 0 50px rgba(59, 130, 246, 0.4);
          }
        }
      `}</style>

      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
      
      {/* Background Atmosphere */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-[100px]"></div>
      </div>

      {/* Header — Premium Redesign */}
      <header className="border-b border-white/[0.06] bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-3 md:px-4 flex justify-between items-center h-14 md:h-16 lg:h-[76px]">
          {/* Left: Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/partners')}
            className="group relative px-3 py-2 rounded-full bg-white/[0.06] border border-cyan-500/20 hover:bg-white/[0.1] hover:border-cyan-500/40 transition-all flex-shrink-0"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <ArrowLeft className="h-4 w-4 text-white/80 group-hover:text-cyan-400 transition-colors" />
            <span className="hidden sm:inline text-gray-200 font-medium tracking-wide text-sm ml-2">
              Back
            </span>
          </Button>

          {/* Right: Brand lockup + CTA */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-5 flex-shrink-0">
            {/* Brand glyph with cyan glow - hidden on mobile */}
            <div 
              className="hidden md:flex items-center justify-center w-5 h-5 lg:w-6 lg:h-6"
              style={{ 
                filter: 'drop-shadow(0 0 12px rgba(77,235,255,0.35))'
              }}
            >
              <Sparkles className="w-full h-full text-cyan-400" />
            </div>

            {/* SYNTH pill - hidden on mobile */}
            <div className="hidden lg:block">
              <SynthButton variant="hidden-trigger" />
            </div>
            <div 
              className="hidden lg:block px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04]"
              style={{ backdropFilter: 'blur(6px)' }}
            >
              <SynthButton variant="header" />
            </div>

            {/* VALID wordmark with gradient + TM */}
            <div className="flex items-baseline">
              <span 
                className="font-bold font-orbitron tracking-[0.15em] md:tracking-[0.25em] text-base md:text-lg lg:text-xl"
                style={{ 
                  background: 'linear-gradient(135deg, #E9EEF5 0%, #7FEFFF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: '0 0 30px rgba(0,240,255,0.3)'
                }}
              >
                VALID
              </span>
              <sup 
                className="text-cyan-400 font-medium ml-0.5 text-[8px] md:text-[10px]" 
                style={{ position: 'relative', top: '-0.6em' }}
              >
                ™
              </sup>
            </div>

            {/* Contact Us CTA */}
            <Button 
              className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] text-xs md:text-sm px-3 md:px-4 lg:px-6 py-2 h-8 md:h-9 lg:h-10"
              onClick={() => window.open("mailto:invest@bevalid.app", "_blank")}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              Contact
            </Button>
          </div>
        </div>
        {/* Bottom divider with fade */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </header>

      <main className="container mx-auto px-4 md:px-8 relative z-10" style={{ maxWidth: '1320px', paddingTop: 'clamp(32px, 4vw, 64px)', paddingBottom: 'clamp(32px, 4vw, 64px)' }}>
        
        {/* ===== HERO SECTION ===== */}
        <section className="text-center" style={{ paddingBottom: 'clamp(32px, 4vw, 56px)' }}>
          <img src={logo} alt="VALID" className="mx-auto mb-8 rounded-xl shadow-[0_0_50px_rgba(0,240,255,0.25)]" style={{ height: 'clamp(120px, 12vw, 180px)' }} />
          
          <Badge className="mb-5 bg-cyan-500/10 text-cyan-400 border-cyan-500/30 tracking-[0.2em]" style={{ padding: 'clamp(10px, 1.2vw, 16px) clamp(20px, 2.5vw, 32px)', fontSize: 'clamp(14px, 1vw, 16px)', height: 'clamp(48px, 3.5vw, 56px)' }}>
            CONFIDENTIAL — INVESTOR ONLY
          </Badge>
          
          <h1 className="font-bold font-orbitron" style={{ fontSize: 'clamp(52px, 4vw, 84px)', marginBottom: 'clamp(20px, 2.5vw, 32px)', lineHeight: '1.05' }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-500">
              INVESTOR DECK
            </span>
          </h1>
          
          <p style={{ fontSize: 'clamp(20px, 1.6vw, 28px)', marginBottom: 'clamp(32px, 4vw, 48px)', lineHeight: '1.55', color: 'rgba(233, 238, 245, 0.88)' }}>
            Zero-Trust Identity & Payment Infrastructure
          </p>

          <div className="flex flex-wrap justify-center" style={{ gap: 'clamp(12px, 1.5vw, 20px)', marginBottom: 'clamp(32px, 4vw, 48px)' }}>
            <div className="bg-white/5 border border-white/15 rounded-full flex items-center" style={{ padding: 'clamp(12px, 1.4vw, 20px) clamp(20px, 2.5vw, 36px)', height: 'clamp(52px, 4vw, 64px)' }}>
              <span style={{ fontSize: 'clamp(16px, 1.2vw, 20px)', color: 'rgba(255, 255, 255, 0.9)' }}>TAM:</span>
              <span className="text-white font-bold ml-2" style={{ fontSize: 'clamp(16px, 1.2vw, 20px)' }}>$11.4B+</span>
            </div>
            <div className="bg-white/5 border border-white/15 rounded-full flex items-center" style={{ padding: 'clamp(12px, 1.4vw, 20px) clamp(20px, 2.5vw, 36px)', height: 'clamp(52px, 4vw, 64px)' }}>
              <span style={{ fontSize: 'clamp(16px, 1.2vw, 20px)', color: 'rgba(255, 255, 255, 0.9)' }}>Tranche 1:</span>
              <span className="text-cyan-400 font-bold ml-2" style={{ fontSize: 'clamp(16px, 1.2vw, 20px)' }}>$200K Note</span>
            </div>
            <div className="bg-white/5 border border-white/15 rounded-full flex items-center" style={{ padding: 'clamp(12px, 1.4vw, 20px) clamp(20px, 2.5vw, 36px)', height: 'clamp(52px, 4vw, 64px)' }}>
              <span style={{ fontSize: 'clamp(16px, 1.2vw, 20px)', color: 'rgba(255, 255, 255, 0.9)' }}>Stage:</span>
              <span className="text-green-400 font-bold ml-2" style={{ fontSize: 'clamp(16px, 1.2vw, 20px)' }}>Revenue Generating</span>
            </div>
          </div>

          {/* ===== 16-SLIDE INVESTOR DECK (QUICK VIEW) ===== */}
          <div id="investor-deck-pdf" className="bg-gradient-to-b from-cyan-950/20 to-black/60 border border-cyan-500/30 rounded-xl" style={{ padding: 'clamp(24px, 3vw, 40px)', marginBottom: 'clamp(24px, 3vw, 40px)' }}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
              <div>
                <h3 className="font-bold text-white font-orbitron" style={{ fontSize: 'clamp(20px, 1.6vw, 28px)', marginBottom: 'clamp(6px, 0.6vw, 10px)' }}>
                  16‑Slide Investor Deck (Quick View)
                </h3>
                <p style={{ fontSize: 'clamp(14px, 1.1vw, 18px)', color: 'rgba(255, 255, 255, 0.9)' }}>
                  Swipe on mobile or use the arrows.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    setDeckOpenRequest((v) => v + 1);
                    document.getElementById("investor-deck-slides")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  style={{
                    fontSize: "clamp(14px, 1vw, 16px)",
                    padding:
                      "clamp(10px, 1vw, 14px) clamp(20px, 2vw, 32px)",
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Deck
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    // Open in a new tab when possible; if blocked, fall back to same-tab navigation.
                    const w = window.open(
                      INVESTOR_DECK_PDF_URL,
                      "_blank",
                      "noopener,noreferrer",
                    );
                    if (!w) window.location.assign(INVESTOR_DECK_PDF_URL);
                  }}
                  className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                  style={{
                    fontSize: "clamp(14px, 1vw, 16px)",
                    padding:
                      "clamp(10px, 1vw, 14px) clamp(20px, 2vw, 32px)",
                  }}
                >
                  <FileDown className="w-4 h-4" />
                  Open PDF
                </Button>
              </div>
            </div>

            {/* Mobile: jump to slides */}
            <div className="lg:hidden mb-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setDeckOpenRequest((v) => v + 1);
                  document.getElementById('investor-deck-slides')?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  });
                }}
                className="w-full border border-white/20 text-white hover:bg-white/10"
              >
                <Maximize2 className="w-4 h-4 mr-2" />
                Jump to Slides
              </Button>
            </div>

            {/* Slides (replaces blocked PDF embed) */}
            <div id="investor-deck-slides" className="relative bg-black/60 rounded-lg overflow-hidden border border-white/10">
              <HtmlPitchDeckCarousel
                openFullscreenRequest={deckOpenRequest}
              />
            </div>

            <p className="mt-4 text-center text-white/80" style={{ fontSize: 'clamp(13px, 1vw, 16px)' }}>
              If your browser blocks embedded PDFs, the slides above will always work.
            </p>
          </div>

          {/* Trust & Compliance Pills */}
          <div className="bg-gradient-to-r from-cyan-500/5 via-green-500/5 to-amber-500/5 border border-white/10 rounded-xl" style={{ padding: 'clamp(16px, 2vw, 28px)' }}>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
              <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full" style={{ padding: 'clamp(8px, 1vw, 12px) clamp(14px, 1.5vw, 20px)' }}>
                <span className="text-cyan-400 font-bold" style={{ fontSize: 'clamp(13px, 1vw, 15px)' }}>SOC 2</span>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full" style={{ padding: 'clamp(8px, 1vw, 12px) clamp(14px, 1.5vw, 20px)' }}>
                <span className="text-green-400 font-bold" style={{ fontSize: 'clamp(13px, 1vw, 15px)' }}>GDPR</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full" style={{ padding: 'clamp(8px, 1vw, 12px) clamp(14px, 1.5vw, 20px)' }}>
                <span className="text-amber-400 font-bold" style={{ fontSize: 'clamp(13px, 1vw, 15px)' }}>Enterprise Trust</span>
              </div>
            </div>
            <p className="text-white/80" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', lineHeight: '1.5' }}>
              Built for SOC 2 + GDPR readiness to win government and healthcare contracts.
            </p>
          </div>
        </section>

        {/* ===== CORE INSIGHT — PREMIUM THESIS PANEL ===== */}
        <section className="relative" style={{ marginTop: 'clamp(32px, 4vw, 56px)' }}>
          {/* Matte charcoal container with gradient */}
          <div 
            className="relative overflow-hidden rounded-2xl"
            style={{ 
              background: 'linear-gradient(135deg, #07090D 0%, #0B0F14 50%, #0A0D12 100%)',
              padding: 'clamp(28px, 3.5vw, 48px)',
            }}
          >
            {/* Left cyan accent edge */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 via-cyan-500 to-cyan-600" />
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-cyan-500/20 to-transparent" />
            
            {/* Faint ghost watermark */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.04] pointer-events-none">
              <Ghost className="w-48 h-48 md:w-64 md:h-64 text-cyan-400" />
            </div>

            {/* Top scanline */}
            <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
            
            {/* Content */}
            <div className="relative z-10" style={{ paddingLeft: 'clamp(16px, 2vw, 28px)' }}>
              {/* Pill label */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-5">
                <Crown className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-400 font-semibold tracking-[0.2em] uppercase" style={{ fontSize: 'clamp(10px, 0.8vw, 12px)' }}>
                  CORE INSIGHT
                </span>
              </div>

              {/* Main quote */}
              <blockquote 
                className="text-white font-medium mb-6"
                style={{ 
                  fontSize: 'clamp(20px, 1.8vw, 30px)', 
                  lineHeight: '1.35',
                  maxWidth: '800px'
                }}
              >
                "We're not another data company. We're the privacy-first trust pipeline that venues rely on and consumers actually want."
              </blockquote>

              {/* Scanline divider */}
              <div className="relative mb-6" style={{ maxWidth: '400px' }}>
                <div className="h-px bg-gradient-to-r from-cyan-500/60 via-cyan-400/40 to-transparent" />
              </div>

              {/* PIPELINE, NOT VAULT subhead */}
              <h4 className="text-cyan-400 font-bold tracking-[0.15em] uppercase mb-4" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>
                PIPELINE, NOT VAULT
              </h4>
              <p style={{ fontSize: 'clamp(16px, 1.2vw, 20px)', lineHeight: '1.6', marginBottom: '1.25rem', color: 'rgba(233, 238, 245, 0.88)' }}>
                Verify in real time → grant access → purge by default.
              </p>

              {/* 3 Supporting bullets with icons */}
              <div className="space-y-3 mb-6">
                {[
                  { icon: Target, text: "Minimum necessary: outcomes travel (GOOD / REVIEW / NO), not raw records." },
                  { icon: Clock, text: "Ephemeral proofs: QR + access links expire fast; screenshots don't replay." },
                  { icon: FileText, text: "Audit without exposure: event logs prove what happened without storing sensitive payloads." },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <item.icon className="text-cyan-400/80 flex-shrink-0 mt-1" style={{ width: 'clamp(18px, 1.4vw, 22px)', height: 'clamp(18px, 1.4vw, 22px)' }} />
                    <span style={{ fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: '1.6', color: 'rgba(233, 238, 245, 0.88)' }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Kicker line */}
              <p className="text-cyan-400 italic" style={{ fontSize: 'clamp(14px, 1vw, 16px)' }}>
                "Trust at the edge, privacy at the core."
              </p>
            </div>

            {/* Bottom scanline */}
            <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          </div>
        </section>

        <SectionDivider label="Proof" />

        {/* ===== PILLAR A: PROOF — LAUNCH READINESS ===== */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(28px, 3.5vw, 48px)' }}>
          <SectionHeader 
            icon={Activity} 
            label="PILLAR A — PROOF" 
            title="Launch Readiness & Why Now"
            subtitle="Production-grade verification, now entering pilots"
          />

          {/* This Week (Pilot Readiness) Metrics */}
          <div>
            <h3 className="tracking-[0.2em] uppercase text-cyan-400 text-center font-semibold" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)', marginBottom: 'clamp(20px, 2.5vw, 32px)' }}>This Week (Pilot Readiness)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 'clamp(16px, 2vw, 32px)' }}>
              {[
                { value: "< 2 sec", label: "Decision latency target", sublabel: "(Door Mode)", icon: Zap, color: "text-cyan-400" },
                { value: "60s", label: "Self-destructing QR TTL", sublabel: "(anti-replay)", icon: Clock, color: "text-amber-400" },
                { value: "Front + Back", label: "Visual match verification", sublabel: "(door-ready)", icon: Fingerprint, color: "text-purple-400" },
                { value: "Q1 2025", label: "Pilot Launch Target", sublabel: "Now onboarding testers", icon: Rocket, color: "text-green-400" },
              ].map((metric, idx) => (
                <Card key={idx} className="bg-black/50 border-white/10 hover:border-cyan-500/40 transition-all rounded-xl">
                  <CardContent className="text-center" style={{ padding: 'clamp(20px, 2vw, 32px)' }}>
                    <metric.icon className={`mx-auto ${metric.color}`} style={{ width: 'clamp(28px, 2.2vw, 36px)', height: 'clamp(28px, 2.2vw, 36px)', marginBottom: 'clamp(10px, 1vw, 16px)' }} />
                    <div className="font-bold text-white" style={{ fontSize: 'clamp(24px, 2.2vw, 36px)' }}>{metric.value}</div>
                    <div style={{ fontSize: 'clamp(14px, 1vw, 16px)', marginTop: '0.25rem', color: 'rgba(233, 238, 245, 0.88)' }}>{metric.label}</div>
                    <div style={{ fontSize: 'clamp(12px, 0.9vw, 14px)', color: 'rgba(255, 255, 255, 0.8)' }}>{metric.sublabel}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* What's Already Working */}
          <div className="bg-gradient-to-br from-green-950/30 to-cyan-950/20 border border-green-500/30 rounded-xl" style={{ padding: 'clamp(24px, 2.5vw, 40px)' }}>
            <h4 className="font-bold text-green-400 tracking-[0.15em] uppercase text-center" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)', marginBottom: 'clamp(16px, 1.5vw, 24px)' }}>
              What's Already Working
            </h4>
            <div className="grid md:grid-cols-2" style={{ gap: 'clamp(14px, 1.4vw, 22px)' }}>
              {[
                "Door-ready kiosk flow (stay-awake, scan loop, instant reset)",
                "Ephemeral QR (60s) + screenshot-resistant replays",
                "ID front/back viewer with CLEAR/KILL for staff control",
                "Audit events for scans + station switches (incident-ready)",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" style={{ width: 'clamp(18px, 1.4vw, 22px)', height: 'clamp(18px, 1.4vw, 22px)' }} />
                  <span style={{ fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: '1.6', color: 'rgba(233, 238, 245, 0.88)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pilot Traction (Updating Live) */}
          <div className="bg-black/40 border border-white/10 rounded-xl" style={{ padding: 'clamp(20px, 2vw, 32px)' }}>
            <h4 className="font-semibold tracking-[0.12em] uppercase text-center" style={{ fontSize: 'clamp(14px, 1vw, 16px)', marginBottom: 'clamp(14px, 1.3vw, 22px)', color: 'rgba(255, 255, 255, 0.9)' }}>
              Pilot Traction (Updating Live)
            </h4>
            <div className="grid md:grid-cols-3" style={{ gap: 'clamp(16px, 1.5vw, 24px)' }}>
              {[
                { label: "Partner Venues", status: "Pilot outreach in progress", icon: Building2 },
                { label: "Markets", status: "Launching in 1 market first", icon: Globe },
                { label: "Member Growth", status: "Collecting baseline this week", icon: TrendingUp },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-black/30 rounded-lg" style={{ padding: 'clamp(14px, 1.4vw, 22px)' }}>
                  <item.icon className="flex-shrink-0" style={{ width: 'clamp(22px, 1.8vw, 28px)', height: 'clamp(22px, 1.8vw, 28px)', color: 'rgba(255, 255, 255, 0.8)' }} />
                  <div>
                    <div className="text-white font-medium" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)' }}>{item.label}</div>
                    <div className="italic" style={{ fontSize: 'clamp(13px, 0.95vw, 15px)', color: 'rgba(255, 255, 255, 0.8)' }}>{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Value Drivers - Expanded */}
          <div>
            <h3 
              className="tracking-[0.2em] uppercase text-center font-bold"
              style={{ 
                fontSize: 'clamp(20px, 1.8vw, 32px)', 
                marginBottom: 'clamp(20px, 2.5vw, 32px)',
                color: '#00bfff',
                textShadow: '0 0 20px rgba(0, 191, 255, 0.8), 0 0 40px rgba(0, 191, 255, 0.5)',
              }}
            >
              Six Value Drivers
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'clamp(20px, 2vw, 32px)' }}>
              {/* 1. vaGhost™ Token */}
              <div className="bg-black/50 border border-amber-500/30 rounded-xl hover:border-amber-500/50 transition-all" style={{ padding: 'clamp(28px, 2.5vw, 40px)' }}>
                <Ghost className="text-amber-400" style={{ width: 'clamp(30px, 2.4vw, 40px)', height: 'clamp(30px, 2.4vw, 40px)', marginBottom: 'clamp(14px, 1.2vw, 20px)' }} />
                <h4 className="font-bold text-white" style={{ fontSize: 'clamp(18px, 1.5vw, 24px)', marginBottom: 'clamp(12px, 1.2vw, 18px)' }}>vaGhost™ Token</h4>
                <ul style={{ fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: '1.6', color: 'rgba(233, 238, 245, 0.88)' }} className="space-y-2">
                  <li>• One credential powers entry, payment & verification</li>
                  <li>• Ephemeral by design (single-use tokens)</li>
                  <li>• Every scan creates an auditable event</li>
                  <li>• 2-second door decisions (real line speed)</li>
                </ul>
              </div>

              {/* 2. 3-in-1: Payment + ID + Health */}
              <div className="bg-black/50 border border-cyan-500/30 rounded-xl hover:border-cyan-500/50 transition-all" style={{ padding: 'clamp(28px, 2.5vw, 40px)' }}>
                <CreditCard className="text-cyan-400" style={{ width: 'clamp(30px, 2.4vw, 40px)', height: 'clamp(30px, 2.4vw, 40px)', marginBottom: 'clamp(14px, 1.2vw, 20px)' }} />
                <h4 className="font-bold text-white" style={{ fontSize: 'clamp(18px, 1.5vw, 24px)', marginBottom: 'clamp(12px, 1.2vw, 18px)' }}>3-in-1: Payment + ID + Health</h4>
                <ul style={{ fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: '1.6', color: 'rgba(233, 238, 245, 0.88)' }} className="space-y-2">
                  <li>• PASS / REVIEW / FAIL without exposing details</li>
                  <li>• Flexible per-venue rules (ID-only, payment-only, combined)</li>
                  <li>• Fewer apps/cards, fewer disputes at door</li>
                  <li>• "Verified guest" lanes & VIP throughput</li>
                </ul>
              </div>

              {/* 3. Self-destructing encryption */}
              <div className="bg-black/50 border border-red-500/30 rounded-xl hover:border-red-500/50 transition-all" style={{ padding: 'clamp(28px, 2.5vw, 40px)' }}>
                <Lock className="text-red-400" style={{ width: 'clamp(30px, 2.4vw, 40px)', height: 'clamp(30px, 2.4vw, 40px)', marginBottom: 'clamp(14px, 1.2vw, 20px)' }} />
                <h4 className="font-bold text-white" style={{ fontSize: 'clamp(18px, 1.5vw, 24px)', marginBottom: 'clamp(12px, 1.2vw, 18px)' }}>Self-Destructing Encryption</h4>
                <ul style={{ fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: '1.6', color: 'rgba(233, 238, 245, 0.88)' }} className="space-y-2">
                  <li>• Tokens expire automatically (default 60s)</li>
                  <li>• Screenshot-resistant: expired codes fail</li>
                  <li>• Sensitive proofs via short-lived access only</li>
                  <li>• Minimizes breach impact: nothing persists</li>
                </ul>
              </div>

              {/* 4. Regulatory Moat */}
              <div className="bg-black/50 border border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-all" style={{ padding: 'clamp(28px, 2.5vw, 40px)' }}>
                <Shield className="text-purple-400" style={{ width: 'clamp(30px, 2.4vw, 40px)', height: 'clamp(30px, 2.4vw, 40px)', marginBottom: 'clamp(14px, 1.2vw, 20px)' }} />
                <h4 className="font-bold text-white" style={{ fontSize: 'clamp(18px, 1.5vw, 24px)', marginBottom: 'clamp(12px, 1.2vw, 18px)' }}>Regulatory Moat</h4>
                <ul style={{ fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: '1.6', color: 'rgba(233, 238, 245, 0.88)' }} className="space-y-2">
                  <li>• Compliance is the product: audit trails + access controls</li>
                  <li>• ID + verification + payments in one OS</li>
                  <li>• Process + partnerships, not just UI</li>
                  <li>• Creates switching costs: venues standardize ops</li>
                </ul>
              </div>

              {/* 5. Network Effects */}
              <div className="bg-black/50 border border-green-500/30 rounded-xl hover:border-green-500/50 transition-all" style={{ padding: 'clamp(28px, 2.5vw, 40px)' }}>
                <Network className="text-green-400" style={{ width: 'clamp(30px, 2.4vw, 40px)', height: 'clamp(30px, 2.4vw, 40px)', marginBottom: 'clamp(14px, 1.2vw, 20px)' }} />
                <h4 className="font-bold text-white" style={{ fontSize: 'clamp(18px, 1.5vw, 24px)', marginBottom: 'clamp(12px, 1.2vw, 18px)' }}>Network Effects</h4>
                <ul style={{ fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: '1.6', color: 'rgba(233, 238, 245, 0.88)' }} className="space-y-2">
                  <li>• Every QR is marketing: guests see it, ask, share</li>
                  <li>• Faster lines → more adoption → more venues</li>
                  <li>• Shared credential increases repeat usage</li>
                  <li>• Higher trust loop: better verification → more scans</li>
                </ul>
              </div>

              {/* 6. Liability Firewall */}
              <div className="bg-black/50 border border-blue-500/30 rounded-xl hover:border-blue-500/50 transition-all" style={{ padding: 'clamp(28px, 2.5vw, 40px)' }}>
                <ShieldCheck className="text-blue-400" style={{ width: 'clamp(30px, 2.4vw, 40px)', height: 'clamp(30px, 2.4vw, 40px)', marginBottom: 'clamp(14px, 1.2vw, 20px)' }} />
                <h4 className="font-bold text-white" style={{ fontSize: 'clamp(18px, 1.5vw, 24px)', marginBottom: 'clamp(12px, 1.2vw, 18px)' }}>Liability Firewall</h4>
                <ul style={{ fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: '1.6', color: 'rgba(233, 238, 245, 0.88)' }} className="space-y-2">
                  <li>• Venues never store sensitive customer data</li>
                  <li>• Minimum-necessary info for face-match & entry</li>
                  <li>• Incident-ready logs without exposing PII</li>
                  <li>• Insurance & compliance-ready for premium venues</li>
                </ul>
              </div>
            </div>

            {/* Footer sub-bullets */}
            <div className="mt-8 bg-gradient-to-r from-cyan-950/30 to-green-950/30 border border-cyan-500/20 rounded-xl" style={{ padding: 'clamp(24px, 2.2vw, 36px)' }}>
              <div className="grid md:grid-cols-2" style={{ gap: 'clamp(18px, 1.6vw, 28px)' }}>
                <div className="flex items-start gap-3">
                  <Zap className="text-cyan-400 flex-shrink-0 mt-1" style={{ width: 'clamp(22px, 1.8vw, 28px)', height: 'clamp(22px, 1.8vw, 28px)' }} />
                  <div>
                    <span className="font-bold text-cyan-400" style={{ fontSize: 'clamp(16px, 1.3vw, 20px)' }}>Fast Verified Payouts</span>
                    <p style={{ fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: '1.6', color: 'rgba(233, 238, 245, 0.88)' }}>Verification unlocks faster settlement & higher conversion</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock className="text-green-400 flex-shrink-0 mt-1" style={{ width: 'clamp(22px, 1.8vw, 28px)', height: 'clamp(22px, 1.8vw, 28px)' }} />
                  <div>
                    <span className="font-bold text-green-400" style={{ fontSize: 'clamp(16px, 1.3vw, 20px)' }}>VALID Token Only</span>
                    <p style={{ fontSize: 'clamp(16px, 1.1vw, 18px)', lineHeight: '1.6', color: 'rgba(233, 238, 245, 0.88)' }}>Tokenized identifiers + short-lived proofs (privacy by architecture)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider label="Moat" />

        {/* ===== PILLAR B: MOAT — PREMIUM UPGRADE ===== */}
        <section className="relative" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 3.5vw, 52px)' }}>
          {/* Deep charcoal gradient background with ghost watermark */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 rounded-3xl -z-10" />
          <div className="absolute inset-0 opacity-[0.03] -z-10 overflow-hidden rounded-3xl">
            <Ghost className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] text-cyan-400" />
          </div>
          
          {/* Pillar Header with premium styling */}
          <div className="text-center" style={{ padding: 'clamp(32px, 3vw, 48px) clamp(24px, 2vw, 40px) 0' }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-semibold tracking-[0.2em] uppercase" style={{ fontSize: 'clamp(11px, 0.9vw, 14px)' }}>
                PILLAR B — MOAT
              </span>
            </div>
            <h2 className="font-bold text-white" style={{ fontSize: 'clamp(28px, 2.8vw, 48px)', marginBottom: 'clamp(8px, 1vw, 16px)' }}>
              The Thesis: Six Truths
            </h2>
            <p className="text-cyan-300/80" style={{ fontSize: 'clamp(16px, 1.3vw, 22px)' }}>
              Why VALID is inevitable
            </p>
          </div>

          {/* Scanline divider */}
          <div className="relative mx-auto" style={{ width: '80%', maxWidth: '600px' }}>
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent" />
            <div className="absolute inset-0 blur-sm bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
          </div>

          {/* Six Truths - Premium Cards Grid */}
          <div className="grid md:grid-cols-2" style={{ gap: 'clamp(20px, 2vw, 28px)', padding: '0 clamp(16px, 2vw, 32px) clamp(24px, 2.5vw, 40px)' }}>
            {[
              { 
                num: "01", 
                pill: "Trust",
                title: "We Own the Trust Layer", 
                text: "Every high-stakes interaction needs portable, instant verification—at the door, at purchase, at payout. VALID becomes the default trust handshake."
              },
              { 
                num: "02", 
                pill: "Network",
                title: "Platform, Not Product", 
                text: "Kits and checks are on-ramps. The compounding value is the verified network: shared credential, shared rules, shared acceptance."
              },
              { 
                num: "03", 
                pill: "Payments",
                title: "Revenue Compounds (Flywheel, Not Funnel)", 
                text: "Venues → members → wallets → venues. Every verified member increases conversion, and every new venue increases utility."
              },
              { 
                num: "04", 
                pill: "Compliance",
                title: "Regulation Is Our Friend", 
                text: "As liability tightens, venues stop wanting to hold data. VALID turns compliance into infrastructure: minimal data exposure, auditable outcomes."
              },
              { 
                num: "05", 
                pill: "Data",
                title: "Privacy by Architecture (Token-Only)", 
                text: "Competitors store data and hope nothing happens. VALID stores tokens + short-lived proofs, reducing breach value and operational risk by design."
              },
              { 
                num: "06", 
                pill: "Defense",
                title: "Payments + Verification = Lock-In", 
                text: "Identity alone is a feature. Payments alone are a commodity. The combination—verified access tied to settlement, payouts, and dispute reduction—creates switching costs competitors can't replicate quickly."
              },
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="relative bg-black/70 rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group"
                style={{ padding: 'clamp(24px, 2.2vw, 36px)' }}
              >
                {/* Top border glow */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />
                <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Large faint index number */}
                <span 
                  className="absolute top-2 right-4 font-orbitron font-bold text-cyan-500/10 pointer-events-none select-none"
                  style={{ fontSize: 'clamp(60px, 6vw, 100px)', lineHeight: '1' }}
                >
                  {item.num}
                </span>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Micro-label pill */}
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-medium tracking-wide uppercase mb-3" style={{ fontSize: 'clamp(9px, 0.7vw, 11px)' }}>
                    {item.pill}
                  </span>
                  
                  <div className="flex items-start" style={{ gap: 'clamp(12px, 1.2vw, 20px)' }}>
                    <span className="font-bold text-cyan-400/80 font-orbitron shrink-0" style={{ fontSize: 'clamp(18px, 1.5vw, 26px)' }}>{item.num}</span>
                    <div>
                      <h4 className="font-bold text-white" style={{ fontSize: 'clamp(17px, 1.4vw, 24px)', marginBottom: 'clamp(8px, 0.8vw, 14px)', lineHeight: '1.3' }}>{item.title}</h4>
                      <p className="text-white/90" style={{ fontSize: 'clamp(14px, 1vw, 17px)', lineHeight: '1.6' }}>{item.text}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Moat Proof Footer */}
          <div className="text-center" style={{ padding: '0 clamp(16px, 2vw, 32px) clamp(32px, 3vw, 48px)' }}>
            <div className="relative inline-block">
              <div className="h-px w-full bg-gradient-to-r from-transparent via-white/40 to-transparent mb-5" />
              <p className="text-white/80 italic" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>
                "Moats aren't claimed—they're enforced by trust, compliance, and compounding network effects."
              </p>
            </div>
          </div>
        </section>

        <SectionDivider label="Revenue Model" />

        {/* ===== PILLAR C: REVENUE MODEL / SMART SPLIT ===== */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(32px, 4vw, 52px)' }}>
          <SectionHeader 
            icon={DollarSign} 
            label="PILLAR C — ECONOMICS" 
            title="Stop Losing Money. Start Making It."
            subtitle="Every Ghost™ Pass purchase is pre-funded, fee-free, and splits revenue automatically—turning verification into a profit center."
          />

          {/* HOW THE SPLIT WORKS - System Diagram Style */}
          <div className="relative bg-gradient-to-br from-green-950/40 to-cyan-950/30 border border-green-500/30 rounded-2xl overflow-hidden" style={{ padding: 'clamp(32px, 3vw, 48px)' }}>
            {/* Subtle edge glow */}
            <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_40px_rgba(34,197,94,0.1)]" />
            
            <h3 className="font-bold text-green-400 tracking-[0.15em] uppercase text-center relative z-10" style={{ fontSize: 'clamp(15px, 1.2vw, 20px)', marginBottom: 'clamp(20px, 2vw, 32px)' }}>
              How The Split Works (Per Pass Purchase)
            </h3>

            {/* VISUAL SPLIT BAR */}
            <div className="mb-6">
              {/* Toggle */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className={`text-sm transition-colors ${!noPromoter ? 'text-white font-medium' : 'text-white/60'}`}>With Promoter</span>
                <Switch 
                  checked={noPromoter} 
                  onCheckedChange={setNoPromoter}
                  className="data-[state=checked]:bg-amber-500"
                />
                <span className={`text-sm transition-colors ${noPromoter ? 'text-amber-400 font-medium' : 'text-white/60'}`}>No Promoter</span>
              </div>

              {/* Split Bar */}
              <div className="w-full h-12 md:h-14 rounded-lg overflow-hidden flex transition-all duration-300">
                {/* Promoter */}
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`flex items-center justify-center transition-all duration-300 cursor-pointer ${noPromoter ? 'w-0 opacity-0' : 'bg-amber-500/80'}`}
                        style={{ width: noPromoter ? '0%' : '10%' }}
                      >
                        {!noPromoter && <span className="text-black font-bold text-xs md:text-sm whitespace-nowrap">10%</span>}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-amber-900 border-amber-500/50">
                      <p className="font-semibold">Promoter / Account Manager</p>
                      <p className="text-xs text-white/90">Paid if a promoter exists for that buyer/venue.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>

                {/* Pass Pool */}
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className="bg-cyan-500/80 flex items-center justify-center cursor-pointer transition-all duration-300"
                        style={{ width: '30%' }}
                      >
                        <span className="text-black font-bold text-xs md:text-sm whitespace-nowrap flex items-center gap-1">
                          30%
                          <Info className="w-3 h-3 opacity-70" />
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-cyan-900 border-cyan-500/50 max-w-xs">
                      <p className="font-semibold">Pass Pool</p>
                      <p className="text-xs text-white/90">Pool is distributed weekly to participating venues based on verified check-ins.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>

                {/* Venue */}
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className="bg-green-500/80 flex items-center justify-center cursor-pointer transition-all duration-300"
                        style={{ width: noPromoter ? '35%' : '30%' }}
                      >
                        <span className="text-black font-bold text-xs md:text-sm whitespace-nowrap">{noPromoter ? '35%' : '30%'}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-green-900 border-green-500/50">
                      <p className="font-semibold">Venue (Immediate)</p>
                      <p className="text-xs text-white/90">Direct payout to venue at point of sale.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>

                {/* VALID */}
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className="bg-purple-500/80 flex items-center justify-center cursor-pointer transition-all duration-300"
                        style={{ width: noPromoter ? '35%' : '30%' }}
                      >
                        <span className="text-black font-bold text-xs md:text-sm whitespace-nowrap">{noPromoter ? '35%' : '30%'}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-purple-900 border-purple-500/50">
                      <p className="font-semibold">VALID™ (Platform)</p>
                      <p className="text-xs text-white/90">Platform revenue for infrastructure & growth.</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </div>

              {/* Labels under bar */}
              <div className="flex mt-2 text-[10px] md:text-xs text-white/70">
                <div className={`text-center transition-all duration-300 ${noPromoter ? 'w-0 opacity-0 overflow-hidden' : ''}`} style={{ width: noPromoter ? '0%' : '10%' }}>Promoter</div>
                <div className="text-center" style={{ width: '30%' }}>Pass Pool</div>
                <div className="text-center transition-all duration-300" style={{ width: noPromoter ? '35%' : '30%' }}>Venue</div>
                <div className="text-center transition-all duration-300" style={{ width: noPromoter ? '35%' : '30%' }}>VALID™</div>
              </div>

              {/* Caption */}
              <p className="text-center text-white/80 mt-3 transition-all duration-300" style={{ fontSize: 'clamp(12px, 0.9vw, 14px)' }}>
                {noPromoter 
                  ? "The 10% promoter allocation is reallocated 50/50 to Venue and VALID™."
                  : "Totals = 100% of the pass purchase."
                }
              </p>
            </div>

            <div className="grid md:grid-cols-3" style={{ gap: 'clamp(16px, 1.5vw, 24px)' }}>
              {/* 10% Promoter */}
              <div className="bg-black/50 border border-amber-500/30 rounded-lg" style={{ padding: 'clamp(20px, 2vw, 32px)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-amber-400" style={{ fontSize: 'clamp(28px, 2.5vw, 44px)' }}>10%</span>
                  <Users className="text-amber-400" style={{ width: 'clamp(24px, 2vw, 32px)', height: 'clamp(24px, 2vw, 32px)' }} />
                </div>
                <h4 className="font-bold text-white" style={{ fontSize: 'clamp(16px, 1.2vw, 20px)', marginBottom: 'clamp(8px, 0.8vw, 12px)' }}>Promoter / Account Manager</h4>
                <p className="text-white/80" style={{ fontSize: 'clamp(13px, 1vw, 16px)', lineHeight: '1.45' }}>
                  Paid only if a promoter or account manager exists for that buyer or venue.
                </p>
              </div>

              {/* 30% Pass Pool */}
              <div className="bg-black/50 border border-cyan-500/30 rounded-lg" style={{ padding: 'clamp(20px, 2vw, 32px)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-cyan-400" style={{ fontSize: 'clamp(28px, 2.5vw, 44px)' }}>30%</span>
                  <PiggyBank className="text-cyan-400" style={{ width: 'clamp(24px, 2vw, 32px)', height: 'clamp(24px, 2vw, 32px)' }} />
                </div>
                <h4 className="font-bold text-white" style={{ fontSize: 'clamp(16px, 1.2vw, 20px)', marginBottom: 'clamp(8px, 0.8vw, 12px)' }}>Pass Pool</h4>
                <p className="text-white/80" style={{ fontSize: 'clamp(13px, 1vw, 16px)', lineHeight: '1.45' }}>
                  Deposited into the Pass Pool. Paid out weekly to participating venues based on verified attendance (where patrons actually check in).
                </p>
              </div>

              {/* 60% Direct Split */}
              <div className="bg-black/50 border border-green-500/30 rounded-lg" style={{ padding: 'clamp(20px, 2vw, 32px)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-green-400" style={{ fontSize: 'clamp(28px, 2.5vw, 44px)' }}>60%</span>
                  <ArrowRightLeft className="text-green-400" style={{ width: 'clamp(24px, 2vw, 32px)', height: 'clamp(24px, 2vw, 32px)' }} />
                </div>
                <h4 className="font-bold text-white" style={{ fontSize: 'clamp(16px, 1.2vw, 20px)', marginBottom: 'clamp(8px, 0.8vw, 12px)' }}>Direct Split</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-white/90" style={{ fontSize: 'clamp(13px, 1vw, 16px)' }}>
                    <span>→ Venue (immediate)</span>
                    <span className="font-bold text-green-400">30%</span>
                  </div>
                  <div className="flex items-center justify-between text-white/90" style={{ fontSize: 'clamp(13px, 1vw, 16px)' }}>
                    <span>→ VALID™ (platform)</span>
                    <span className="font-bold text-cyan-400">30%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NO PROMOTER REALLOCATION */}
          <div className="bg-black/40 border border-amber-500/20 rounded-xl" style={{ padding: 'clamp(20px, 2vw, 32px)' }}>
            <div className="flex items-start" style={{ gap: 'clamp(12px, 1.5vw, 20px)' }}>
              <div className="bg-amber-500/20 rounded-full flex-shrink-0" style={{ padding: 'clamp(10px, 1vw, 14px)' }}>
                <AlertCircle className="text-amber-400" style={{ width: 'clamp(20px, 1.6vw, 26px)', height: 'clamp(20px, 1.6vw, 26px)' }} />
              </div>
              <div>
                <h4 className="font-bold text-amber-400" style={{ fontSize: 'clamp(16px, 1.3vw, 22px)', marginBottom: 'clamp(6px, 0.6vw, 10px)' }}>No Promoter? (10% Reallocation)</h4>
                <p className="text-white/90" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)', lineHeight: '1.5' }}>
                  If no promoter/account manager is assigned, that 10% is not lost: <span className="text-green-400 font-semibold">5% goes to the Venue</span> and <span className="text-cyan-400 font-semibold">5% goes to VALID™</span>. Totals always equal 100%.
                </p>
              </div>
            </div>
          </div>

          {/* WHY THIS MATTERS */}
          <div>
            <h3 className="font-bold text-white text-center" style={{ fontSize: 'clamp(18px, 1.4vw, 24px)', marginBottom: 'clamp(16px, 1.5vw, 24px)' }}>Why This Matters (Operator Benefits)</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5" style={{ gap: 'clamp(12px, 1.2vw, 20px)' }}>
              {[
                { icon: CreditCard, text: "0% credit card fees", sub: "Pre-funded wallet architecture" },
                { icon: ShieldCheck, text: "Chargeback immunity", sub: "No card dispute risk" },
                { icon: Zap, text: "Instant funds verification", sub: "No batch delays" },
                { icon: Calendar, text: "Weekly Pool payouts", sub: "Based on real foot traffic" },
                { icon: TrendingUp, text: "Verification = Revenue", sub: "Not a cost center" },
              ].map((item, idx) => (
                <div key={idx} className="bg-black/40 border border-white/10 rounded-lg text-center hover:border-green-500/30 transition-all" style={{ padding: 'clamp(16px, 1.5vw, 24px)' }}>
                  <item.icon className="text-green-400 mx-auto" style={{ width: 'clamp(26px, 2vw, 34px)', height: 'clamp(26px, 2vw, 34px)', marginBottom: 'clamp(8px, 0.8vw, 12px)' }} />
                  <p className="font-bold text-white" style={{ fontSize: 'clamp(13px, 1vw, 16px)', marginBottom: 'clamp(4px, 0.4vw, 6px)' }}>{item.text}</p>
                  <p className="text-white/70" style={{ fontSize: 'clamp(11px, 0.9vw, 14px)' }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center" style={{ marginTop: 'clamp(12px, 1.5vw, 24px)' }}>
            <Button 
              onClick={() => window.open('https://calendly.com/steve-bevalid/30min', '_blank')}
              className="bg-gradient-to-r from-green-500 to-cyan-500 text-black font-bold rounded-full hover:scale-105 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              style={{ fontSize: 'clamp(11px, 0.9vw, 14px)', padding: 'clamp(8px, 0.8vw, 12px) clamp(16px, 1.8vw, 28px)' }}
            >
              Request Wallet Integration Demo
            </Button>
          </div>
        </section>

        <SectionDivider label="Economics & Defensibility" />

        {/* ===== PILLAR D: ECONOMICS & DEFENSIBILITY ===== */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 3vw, 40px)' }}>
          <div className="text-center">
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 mb-3" style={{ fontSize: 'clamp(12px, 0.9vw, 14px)', padding: 'clamp(6px, 0.8vw, 10px) clamp(12px, 1.5vw, 20px)' }}>PILLAR D</Badge>
            <h2 className="font-bold font-orbitron" style={{ fontSize: 'clamp(24px, 2.2vw, 36px)' }}>Economics & Defensibility</h2>
          </div>

          {/* Margin Density */}
          <div className="bg-gradient-to-r from-cyan-950/30 to-purple-950/30 border border-cyan-500/20 rounded-xl" style={{ padding: 'clamp(24px, 2.5vw, 40px)' }}>
            <h3 className="font-bold text-white" style={{ fontSize: 'clamp(18px, 1.4vw, 24px)', marginBottom: 'clamp(16px, 1.5vw, 24px)' }}>Margin Density (IDaaS)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 text-center" style={{ gap: 'clamp(16px, 2vw, 32px)' }}>
              <div>
                <div className="font-bold text-cyan-400" style={{ fontSize: 'clamp(28px, 2.5vw, 44px)' }}>60%</div>
                <div className="text-white/70" style={{ fontSize: 'clamp(13px, 1vw, 16px)' }}>Gross Margin</div>
              </div>
              <div>
                <div className="font-bold text-green-400" style={{ fontSize: 'clamp(28px, 2.5vw, 44px)' }}>$0</div>
                <div className="text-white/70" style={{ fontSize: 'clamp(13px, 1vw, 16px)' }}>CAC</div>
              </div>
              <div>
                <div className="font-bold text-purple-400" style={{ fontSize: 'clamp(28px, 2.5vw, 44px)' }}>3.2x</div>
                <div className="text-white/70" style={{ fontSize: 'clamp(13px, 1vw, 16px)' }}>Viral K-Factor</div>
              </div>
              <div>
                <div className="font-bold text-amber-400" style={{ fontSize: 'clamp(28px, 2.5vw, 44px)' }}>0 sec</div>
                <div className="text-white/70" style={{ fontSize: 'clamp(13px, 1vw, 16px)' }}>Settlement</div>
              </div>
            </div>
          </div>

          {/* ===== REVENUE MODEL SECTION (New Component) ===== */}
          <RevenueModelSection />

          {/* Competitive Moat */}
          <div>
            <div className="flex justify-center mb-6">
              <span 
                className="inline-flex items-center gap-2 rounded-full font-bold tracking-wide text-black animate-[pulse_3s_ease-in-out_infinite]"
                style={{ 
                  fontSize: 'clamp(18px, 1.5vw, 26px)', 
                  padding: 'clamp(14px, 1.5vw, 22px) clamp(28px, 3vw, 48px)',
                  background: 'linear-gradient(135deg, #00bfff 0%, #0080ff 50%, #00bfff 100%)',
                  boxShadow: '0 0 30px rgba(0, 191, 255, 0.6), 0 0 60px rgba(0, 128, 255, 0.3)',
                }}
              >
                Why Competitors Can't Win
              </span>
            </div>
            <div className="bg-black/40 border border-cyan-500/20 rounded-xl mb-4" style={{ padding: 'clamp(20px, 2vw, 32px)' }}>
              <div className="flex items-center mb-3" style={{ gap: 'clamp(8px, 1vw, 14px)' }}>
                <CheckCircle2 className="text-green-400" style={{ width: 'clamp(22px, 1.8vw, 28px)', height: 'clamp(22px, 1.8vw, 28px)' }} />
                <span className="font-bold text-white" style={{ fontSize: 'clamp(16px, 1.3vw, 22px)' }}>VALID: 10/10 Integration Score</span>
              </div>
              <p className="text-white/80" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)', lineHeight: '1.5' }}>Identity + Health + Payments + Access + Network + Compliance. No competitor scores above 4/10.</p>
            </div>
            
            {/* Scrollable scorecard on mobile */}
            <Accordion type="single" collapsible>
              <AccordionItem value="scorecard" className="border-none rounded-xl">
                <AccordionTrigger className="py-5 hover:no-underline justify-center">
                  <span 
                    className="inline-flex items-center gap-3 rounded-full font-bold tracking-wide text-black animate-[pulse_3s_ease-in-out_infinite]"
                    style={{ 
                      fontSize: 'clamp(18px, 1.5vw, 26px)', 
                      padding: 'clamp(14px, 1.5vw, 22px) clamp(28px, 3vw, 48px)',
                      background: 'linear-gradient(135deg, #00bfff 0%, #0080ff 50%, #00bfff 100%)',
                      boxShadow: '0 0 30px rgba(0, 191, 255, 0.6), 0 0 60px rgba(0, 128, 255, 0.3)',
                    }}
                  >
                    <ChevronDown style={{ width: 'clamp(24px, 2vw, 32px)', height: 'clamp(24px, 2vw, 32px)' }} />
                    View Full Competitive Scorecard
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="overflow-x-auto bg-[#12141a] rounded-lg border border-white/20 mt-2">
                    <table className="w-full" style={{ fontSize: 'clamp(12px, 1vw, 16px)' }}>
                      <thead>
                        <tr className="bg-white/10 text-white">
                          <th className="p-3 text-left font-bold" style={{ fontSize: 'clamp(13px, 1.1vw, 17px)' }}>Feature</th>
                          <th className="p-3 text-center font-bold drop-shadow-[0_0_8px_rgba(0,229,229,0.6)]" style={{ fontSize: 'clamp(13px, 1.1vw, 17px)', color: '#00E5E5' }}>VALID</th>
                          <th className="p-3 text-center text-white/80" style={{ fontSize: 'clamp(11px, 0.9vw, 14px)' }}>CLEAR</th>
                          <th className="p-3 text-center text-white/80" style={{ fontSize: 'clamp(11px, 0.9vw, 14px)' }}>ID.me</th>
                          <th className="p-3 text-center text-white/80" style={{ fontSize: 'clamp(11px, 0.9vw, 14px)' }}>TICKETMASTER</th>
                          <th className="p-3 text-center text-white/80" style={{ fontSize: 'clamp(11px, 0.9vw, 14px)' }}>STERLING</th>
                          <th className="p-3 text-center text-orange-300" style={{ fontSize: 'clamp(11px, 0.9vw, 14px)' }}>DICE</th>
                          <th className="p-3 text-center text-white/80" style={{ fontSize: 'clamp(11px, 0.9vw, 14px)' }}>EVENTBRITE</th>
                          <th className="p-3 text-center text-purple-300" style={{ fontSize: 'clamp(11px, 0.9vw, 14px)' }}>SALESFORCE</th>
                          <th className="p-3 text-center text-blue-300" style={{ fontSize: 'clamp(11px, 0.9vw, 14px)' }}>CHECKR</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scorecardData.map((row, idx) => (
                          <tr key={idx} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                            <td className="p-3 text-white/90" style={{ fontSize: 'clamp(12px, 1vw, 16px)' }}>{row.feature}</td>
                            <td className="p-3 text-center">{renderCheck(row.valid, true)}</td>
                            <td className="p-3 text-center">{renderCheck(row.clear)}</td>
                            <td className="p-3 text-center">{renderCheck(row.idme)}</td>
                            <td className="p-3 text-center">{renderCheck(row.ticketmaster)}</td>
                            <td className="p-3 text-center">{renderCheck(row.sterling)}</td>
                            <td className="p-3 text-center">{renderCheck(row.dice)}</td>
                            <td className="p-3 text-center">{renderCheck(row.eventbrite)}</td>
                            <td className="p-3 text-center">{renderCheck(row.salesforce)}</td>
                            <td className="p-3 text-center">{renderCheck(row.checkr)}</td>
                          </tr>
                        ))}
                        <tr className="bg-emerald-900/30 font-bold border-t-2 border-emerald-500/50">
                          <td className="p-3 text-white" style={{ fontSize: 'clamp(13px, 1.1vw, 17px)' }}>TOTAL</td>
                          <td className="p-3 text-center font-extrabold drop-shadow-[0_0_10px_rgba(0,229,229,0.8)]" style={{ fontSize: 'clamp(16px, 1.3vw, 22px)', color: '#00E5E5' }}>{validScore}/10</td>
                          <td className="p-3 text-center text-white/80" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>2/10</td>
                          <td className="p-3 text-center text-white/80" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>1/10</td>
                          <td className="p-3 text-center text-white/80" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>3/10</td>
                          <td className="p-3 text-center text-white/80" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>1/10</td>
                          <td className="p-3 text-center text-orange-400" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>3/10</td>
                          <td className="p-3 text-center text-white/80" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>3/10</td>
                          <td className="p-3 text-center text-purple-400" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>1/10</td>
                          <td className="p-3 text-center text-blue-400" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>2/10</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* ===== TOAST & SQUARE COMPARISON ===== */}
          <div className="grid md:grid-cols-2" style={{ gap: 'clamp(20px, 2vw, 32px)', marginTop: 'clamp(32px, 3vw, 48px)' }}>
            {/* VALID vs Toast */}
            <div className="bg-gradient-to-br from-orange-950/40 to-black/60 border border-orange-500/40 rounded-xl overflow-hidden" style={{ padding: 'clamp(24px, 2.5vw, 40px)' }}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-white font-orbitron" style={{ fontSize: 'clamp(20px, 1.6vw, 28px)' }}>VALID vs Toast</h4>
                <span className="bg-orange-500/20 text-orange-400 font-bold rounded-full" style={{ padding: 'clamp(6px, 0.6vw, 10px) clamp(12px, 1.2vw, 20px)', fontSize: 'clamp(12px, 0.9vw, 14px)' }}>POS Competitor</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <XCircle className="text-red-400 flex-shrink-0 mt-1" style={{ width: 'clamp(20px, 1.6vw, 26px)', height: 'clamp(20px, 1.6vw, 26px)' }} />
                  <div>
                    <span className="text-white font-semibold" style={{ fontSize: 'clamp(15px, 1.2vw, 19px)' }}>Toast:</span>
                    <p className="text-white/80" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', lineHeight: '1.5' }}>No identity verification. No health compliance. Payment only. 2.6% + 30¢ fees.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" style={{ width: 'clamp(20px, 1.6vw, 26px)', height: 'clamp(20px, 1.6vw, 26px)' }} />
                  <div>
                    <span className="text-cyan-400 font-semibold" style={{ fontSize: 'clamp(15px, 1.2vw, 19px)' }}>VALID:</span>
                    <p className="text-white/90" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', lineHeight: '1.5' }}>ID + Health + Payments unified. 0% card fees via pre-funded wallet. Instant settlement.</p>
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg mt-4" style={{ padding: 'clamp(12px, 1.2vw, 18px)' }}>
                  <p className="text-cyan-400 font-bold" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)' }}>💡 Toast can't add identity verification without rebuilding from scratch.</p>
                </div>
              </div>
            </div>

            {/* VALID vs Square */}
            <div className="bg-gradient-to-br from-blue-950/40 to-black/60 border border-blue-500/40 rounded-xl overflow-hidden" style={{ padding: 'clamp(24px, 2.5vw, 40px)' }}>
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-white font-orbitron" style={{ fontSize: 'clamp(20px, 1.6vw, 28px)' }}>VALID vs Square</h4>
                <span className="bg-blue-500/20 text-blue-400 font-bold rounded-full" style={{ padding: 'clamp(6px, 0.6vw, 10px) clamp(12px, 1.2vw, 20px)', fontSize: 'clamp(12px, 0.9vw, 14px)' }}>POS Competitor</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <XCircle className="text-red-400 flex-shrink-0 mt-1" style={{ width: 'clamp(20px, 1.6vw, 26px)', height: 'clamp(20px, 1.6vw, 26px)' }} />
                  <div>
                    <span className="text-white font-semibold" style={{ fontSize: 'clamp(15px, 1.2vw, 19px)' }}>Square:</span>
                    <p className="text-white/80" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', lineHeight: '1.5' }}>Generic retail POS. No venue-specific compliance. No age or health verification. Batch settlements.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="text-emerald-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" style={{ width: 'clamp(20px, 1.6vw, 26px)', height: 'clamp(20px, 1.6vw, 26px)' }} />
                  <div>
                    <span className="text-cyan-400 font-semibold" style={{ fontSize: 'clamp(15px, 1.2vw, 19px)' }}>VALID:</span>
                    <p className="text-white/90" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', lineHeight: '1.5' }}>Purpose-built for high-liability venues. Age + ID verification at door. Zero chargebacks. Real-time compliance.</p>
                  </div>
                </div>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg mt-4" style={{ padding: 'clamp(12px, 1.2vw, 18px)' }}>
                  <p className="text-cyan-400 font-bold" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)' }}>💡 Square serves retail. VALID owns nightlife, events & hospitality compliance.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== ROADMAP TO 2027: SPATIAL VERIFICATION NETWORK ===== */}
          <div className="relative overflow-hidden rounded-2xl" style={{ padding: 'clamp(32px, 4vw, 64px)', background: 'linear-gradient(135deg, rgba(0,50,80,0.6) 0%, rgba(0,0,0,0.9) 50%, rgba(30,0,60,0.4) 100%)', border: '1px solid rgba(0,229,229,0.4)' }}>
            {/* Background spatial grid effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,229,229,0.3)_0%,transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.2)_0%,transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
            </div>

            <div className="relative z-10">
              {/* Section Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <MapPin className="text-cyan-400" style={{ width: 'clamp(24px, 2vw, 32px)', height: 'clamp(24px, 2vw, 32px)' }} />
                  <span className="tracking-[0.25em] uppercase text-cyan-400 font-semibold" style={{ fontSize: 'clamp(13px, 1vw, 16px)' }}>ROADMAP</span>
                </div>
                <h3 className="font-bold text-white font-orbitron" style={{ fontSize: 'clamp(28px, 2.4vw, 44px)', marginBottom: 'clamp(8px, 1vw, 16px)' }}>
                  Roadmap to 2027: Spatial Verification Network
                </h3>
                <p className="text-white/90" style={{ fontSize: 'clamp(16px, 1.2vw, 20px)' }}>
                  {futureReadyText}
                  <span className={`inline-block w-[3px] h-[0.9em] bg-cyan-400 ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
                </p>
              </div>

              {/* Timeline Visual */}
              <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start" style={{ marginBottom: 'clamp(32px, 4vw, 48px)' }}>
                {/* LEFT: Timeline with glowing nodes */}
                <div className="relative">
                  {/* Gradient line */}
                  <div className="absolute left-6 top-6 bottom-6 w-1 bg-gradient-to-b from-cyan-400 via-purple-500 to-green-400 rounded-full shadow-[0_0_20px_rgba(0,229,229,0.5)]" />
                  
                  {/* Timeline items */}
                  <div className="space-y-8">
                    {[
                      { year: "2025", label: "Launch", outcome: "50+ Venues Live", color: "cyan", active: true },
                      { year: "2026", label: "Scale", outcome: "500 Venues · UWB Pilots", color: "purple" },
                      { year: "2027", label: "Network", outcome: "Spatial Utility Standard", color: "green" },
                    ].map((milestone, idx) => (
                      <div key={idx} className="flex items-start gap-4">
                        {/* Glowing node */}
                        <div className={`relative flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${
                          milestone.active 
                            ? 'bg-cyan-500/30 border-cyan-400 shadow-[0_0_25px_rgba(0,229,229,0.6)]' 
                            : milestone.color === 'purple' 
                              ? 'bg-purple-500/20 border-purple-400/50' 
                              : 'bg-green-500/20 border-green-400/50'
                        }`}>
                          {milestone.active && (
                            <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
                          )}
                          <CircleDot className={`w-5 h-5 ${
                            milestone.color === 'cyan' ? 'text-cyan-400' : 
                            milestone.color === 'purple' ? 'text-purple-400' : 'text-green-400'
                          }`} />
                        </div>
                        
                        {/* Content */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`font-bold font-orbitron ${
                              milestone.color === 'cyan' ? 'text-cyan-400' : 
                              milestone.color === 'purple' ? 'text-purple-400' : 'text-green-400'
                            }`} style={{ fontSize: 'clamp(18px, 1.4vw, 24px)' }}>{milestone.year}</span>
                            <span className="text-white font-semibold" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>· {milestone.label}</span>
                          </div>
                          <p className="text-white/80" style={{ fontSize: 'clamp(14px, 1vw, 16px)' }}>{milestone.outcome}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* RIGHT: Hero card with headline */}
                <div className="bg-gradient-to-br from-cyan-950/50 to-purple-950/30 border border-cyan-500/30 rounded-xl relative overflow-hidden" style={{ padding: 'clamp(28px, 3vw, 48px)' }}>
                  {/* Subtle radar/beacon visual */}
                  <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
                    <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-pulse" />
                    <div className="absolute inset-4 rounded-full border border-cyan-400/20" />
                    <div className="absolute inset-8 rounded-full border border-cyan-400/10" />
                  </div>
                  
                  <div className="relative z-10">
                    <Sparkles className="text-cyan-400 mb-4" style={{ width: 'clamp(28px, 2.2vw, 36px)', height: 'clamp(28px, 2.2vw, 36px)' }} />
                    <h4 className="font-bold text-white font-orbitron" style={{ fontSize: 'clamp(22px, 1.8vw, 32px)', marginBottom: 'clamp(12px, 1.2vw, 20px)', lineHeight: '1.2' }}>
                      Verification Center → Network Utility
                    </h4>
                    <p className="text-white/90" style={{ fontSize: 'clamp(15px, 1.1vw, 19px)', lineHeight: '1.5' }}>
                      From scanning QR codes to seamless spatial verification—where your identity flows with you, verified in real-time without friction.
                    </p>
                  </div>
                </div>
              </div>

              {/* Beyond QR: Tech Roadmap */}
              <div className="mb-8">
                <h4 
                  className="text-center tracking-[0.15em] uppercase font-semibold mb-6 italic animate-[bluePulseGlow_2.5s_ease-in-out_infinite]" 
                  style={{ 
                    fontSize: 'clamp(13px, 1vw, 16px)',
                    color: '#60a5fa',
                    textShadow: '0 0 15px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.6), 0 0 45px rgba(59, 130, 246, 0.4)',
                  }}
                >
                  Beyond the QR: Sensing Technology
                </h4>
                <div className="grid md:grid-cols-3" style={{ gap: 'clamp(16px, 1.5vw, 28px)' }}>
                  <div className="bg-black/50 border border-cyan-500/30 rounded-xl relative overflow-hidden group hover:border-cyan-400/60 transition-all" style={{ padding: 'clamp(24px, 2vw, 36px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Zap className="text-cyan-400 relative z-10" style={{ width: 'clamp(28px, 2.2vw, 36px)', height: 'clamp(28px, 2.2vw, 36px)', marginBottom: 'clamp(14px, 1.2vw, 20px)' }} />
                    <h5 className="font-bold text-white relative z-10" style={{ fontSize: 'clamp(18px, 1.4vw, 24px)', marginBottom: 'clamp(8px, 0.8vw, 12px)' }}>UWB</h5>
                    <p className="text-white/90 relative z-10" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', lineHeight: '1.5' }}>Zero-click access. Phone stays in pocket.</p>
                  </div>
                  <div className="bg-black/50 border border-purple-500/30 rounded-xl relative overflow-hidden group hover:border-purple-400/60 transition-all" style={{ padding: 'clamp(24px, 2vw, 36px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Radio className="text-purple-400 relative z-10" style={{ width: 'clamp(28px, 2.2vw, 36px)', height: 'clamp(28px, 2.2vw, 36px)', marginBottom: 'clamp(14px, 1.2vw, 20px)' }} />
                    <h5 className="font-bold text-white relative z-10" style={{ fontSize: 'clamp(18px, 1.4vw, 24px)', marginBottom: 'clamp(8px, 0.8vw, 12px)' }}>NFC Type-F</h5>
                    <p className="text-white/90 relative z-10" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', lineHeight: '1.5' }}>0.1 sec tap. Stadium-ready throughput.</p>
                  </div>
                  <div className="bg-black/50 border border-green-500/30 rounded-xl relative overflow-hidden group hover:border-green-400/60 transition-all" style={{ padding: 'clamp(24px, 2vw, 36px)' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Fingerprint className="text-green-400 relative z-10" style={{ width: 'clamp(28px, 2.2vw, 36px)', height: 'clamp(28px, 2.2vw, 36px)', marginBottom: 'clamp(14px, 1.2vw, 20px)' }} />
                    <h5 className="font-bold text-white relative z-10" style={{ fontSize: 'clamp(18px, 1.4vw, 24px)', marginBottom: 'clamp(8px, 0.8vw, 12px)' }}>Bio-Hash</h5>
                    <p className="text-white/90 relative z-10" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)', lineHeight: '1.5' }}>You are the wallet. No phone needed.</p>
                  </div>
                </div>
              </div>

              {/* Partner-Ready Badges */}
              <div className="flex flex-wrap justify-center" style={{ gap: 'clamp(12px, 1.5vw, 20px)' }}>
                {[
                  { label: "Gov-Ready", icon: Shield, color: "cyan" },
                  { label: "Healthcare-Ready", icon: Heart, color: "green" },
                  { label: "Hospitality-Ready", icon: Building2, color: "purple" },
                ].map((badge, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-3 rounded-full border ${
                      badge.color === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/40' :
                      badge.color === 'green' ? 'bg-green-500/10 border-green-500/40' :
                      'bg-purple-500/10 border-purple-500/40'
                    }`}
                    style={{ padding: 'clamp(12px, 1.2vw, 18px) clamp(20px, 2vw, 32px)', height: 'clamp(52px, 4vw, 64px)' }}
                  >
                    <badge.icon className={`${
                      badge.color === 'cyan' ? 'text-cyan-400' :
                      badge.color === 'green' ? 'text-green-400' :
                      'text-purple-400'
                    }`} style={{ width: 'clamp(22px, 1.8vw, 28px)', height: 'clamp(22px, 1.8vw, 28px)' }} />
                    <span className={`font-bold ${
                      badge.color === 'cyan' ? 'text-cyan-400' :
                      badge.color === 'green' ? 'text-green-400' :
                      'text-purple-400'
                    }`} style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionDivider label="Investment" />

        {/* ===== USE OF FUNDS ===== */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2vw, 28px)' }}>
          <div className="text-center">
            <span 
              className="inline-flex items-center gap-2 rounded-full font-bold tracking-wide text-black animate-[pulse_3s_ease-in-out_infinite] font-orbitron"
              style={{ 
                fontSize: 'clamp(20px, 1.8vw, 32px)', 
                padding: 'clamp(16px, 1.8vw, 26px) clamp(32px, 4vw, 56px)',
                background: 'linear-gradient(135deg, #00bfff 0%, #0080ff 50%, #00bfff 100%)',
                boxShadow: '0 0 30px rgba(0, 191, 255, 0.6), 0 0 60px rgba(0, 128, 255, 0.3)',
              }}
            >
              Use of Funds
            </span>
            <div style={{ marginTop: 'clamp(16px, 1.8vw, 24px)' }}>
              <span className="text-white/80" style={{ fontSize: 'clamp(16px, 1.3vw, 22px)' }}>Tranche 1: </span>
              <span 
                className="font-bold font-orbitron animate-[pulse_3s_ease-in-out_infinite]"
                style={{ 
                  fontSize: 'clamp(32px, 3vw, 52px)', 
                  color: '#00ff88',
                  textShadow: '0 0 20px rgba(0, 255, 136, 0.8), 0 0 40px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.3)',
                }}
              >
                $200,000
              </span>
            </div>
          </div>

          {/* Horizontal Bar Chart */}
          <div className="bg-black/50 border border-white/10 rounded-xl" style={{ padding: 'clamp(20px, 2vw, 32px)' }}>
            <div className="flex flex-col" style={{ gap: 'clamp(12px, 1.2vw, 18px)' }}>
              {[
                { category: "Sales & Marketing", percent: 40, outcome: "First 50 venues", color: "#00bfff" },
                { category: "Product Dev", percent: 30, outcome: "UWB + NFC integration", color: "#a855f7" },
                { category: "Operations", percent: 20, outcome: "Team scale to 5", color: "#22c55e" },
                { category: "Reserve", percent: 10, outcome: "12-month runway buffer", color: "#f97316" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center" style={{ gap: 'clamp(12px, 1.5vw, 20px)' }}>
                  {/* Label */}
                  <div className="flex-shrink-0 text-right" style={{ width: 'clamp(100px, 12vw, 160px)' }}>
                    <span className="text-white font-semibold" style={{ fontSize: 'clamp(13px, 1vw, 17px)' }}>{item.category}</span>
                  </div>
                  {/* Bar */}
                  <div className="flex-1 h-8 bg-white/10 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full rounded-full flex items-center justify-end transition-all"
                      style={{ 
                        width: `${item.percent}%`, 
                        background: `linear-gradient(90deg, ${item.color}80 0%, ${item.color} 100%)`,
                        boxShadow: `0 0 15px ${item.color}60`,
                      }}
                    >
                      <span className="text-black font-bold px-3" style={{ fontSize: 'clamp(12px, 1vw, 16px)' }}>{item.percent}%</span>
                    </div>
                  </div>
                  {/* Outcome */}
                  <div className="flex-shrink-0 hidden md:block" style={{ width: 'clamp(120px, 14vw, 180px)' }}>
                    <span className="text-white/80" style={{ fontSize: 'clamp(12px, 0.9vw, 15px)' }}>{item.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Mobile outcomes */}
            <div className="md:hidden mt-4 pt-4 border-t border-white/10">
              <div className="grid grid-cols-2 gap-2 text-center">
                {[
                  { category: "Sales", outcome: "First 50 venues" },
                  { category: "Product", outcome: "UWB + NFC" },
                  { category: "Operations", outcome: "Team scale to 5" },
                  { category: "Reserve", outcome: "12-mo runway" },
                ].map((item, idx) => (
                  <div key={idx} className="text-white/80" style={{ fontSize: 'clamp(11px, 0.9vw, 13px)' }}>
                    <span className="text-white">{item.category}:</span> {item.outcome}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ===== CURRENT ROUND STRUCTURE ===== */}
        <section className="bg-black" style={{ paddingTop: 'clamp(48px, 5vw, 80px)', paddingBottom: 'clamp(48px, 5vw, 80px)' }}>
          {/* Banner linking to PDF deck */}
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 mx-auto mb-8" style={{ padding: 'clamp(12px, 1.2vw, 20px) clamp(16px, 2vw, 28px)', maxWidth: '900px' }}>
            <p className="text-white/90" style={{ fontSize: 'clamp(14px, 1.1vw, 17px)' }}>
              Prefer the full story? <a href="#investor-deck-pdf" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2">View the 14‑slide deck →</a>
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const link = document.createElement('a');
                link.href = INVESTOR_DECK_PDF_URL;
                link.download = 'VALID-Investor-Deck-2025.pdf';
                link.click();
              }}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <FileDown className="w-4 h-4 mr-1" />
              Download PDF
            </Button>
          </div>

          <div className="text-center" style={{ marginBottom: 'clamp(32px, 4vw, 56px)' }}>
            <span 
              className="inline-flex items-center gap-2 rounded-full font-bold tracking-[4px] uppercase text-black animate-[pulse_3s_ease-in-out_infinite]"
              style={{ 
                fontSize: 'clamp(18px, 1.5vw, 26px)', 
                padding: 'clamp(14px, 1.5vw, 22px) clamp(28px, 3vw, 48px)',
                background: 'linear-gradient(135deg, #00bfff 0%, #0080ff 50%, #00bfff 100%)',
                boxShadow: '0 0 30px rgba(0, 191, 255, 0.6), 0 0 60px rgba(0, 128, 255, 0.3)',
              }}
            >
              Current Round Structure
            </span>
            <p className="text-white font-light" style={{ fontSize: 'clamp(16px, 1.3vw, 22px)', marginTop: 'clamp(16px, 1.5vw, 24px)' }}>
              Two tranches. &nbsp; Strategic positioning. &nbsp; Limited allocation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 mb-8" style={{ gap: 'clamp(24px, 2.5vw, 40px)' }}>
            {/* TRANCHE 1 */}
            <div 
              className="relative rounded-xl transition-all duration-300"
              style={{
                padding: 'clamp(24px, 2.5vw, 40px)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(0, 229, 229, 0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 0 30px rgba(0, 229, 229, 0.1)',
              }}
            >
              <div 
                className="inline-flex items-center gap-2 rounded-full tracking-[2px] uppercase"
                style={{ padding: 'clamp(8px, 0.8vw, 12px) clamp(14px, 1.2vw, 20px)', fontSize: 'clamp(12px, 0.9vw, 14px)', background: 'rgba(0, 229, 229, 0.15)', border: '1px solid #00E5E5', color: '#00E5E5', marginBottom: 'clamp(16px, 1.5vw, 24px)' }}
              >
                <span className="w-2 h-2 rounded-full bg-[#00E5E5] animate-pulse" />
                ACTIVE
              </div>
              
              <div style={{ marginBottom: 'clamp(20px, 2vw, 32px)' }}>
                <p className="tracking-[3px] uppercase" style={{ color: '#00E5E5', fontSize: 'clamp(12px, 0.9vw, 14px)', marginBottom: 'clamp(6px, 0.6vw, 10px)' }}>TRANCHE 1</p>
                <h3 className="font-semibold text-white" style={{ fontSize: 'clamp(20px, 1.6vw, 28px)' }}>Launch Round (Friends & Family)</h3>
              </div>
              
              <div style={{ marginBottom: 'clamp(20px, 2vw, 32px)' }}>
                {[
                  { label: "Raise", value: "$200,000" },
                  { label: "Instrument", value: "Convertible Note" },
                  { label: "Valuation Cap", value: "$6,000,000", highlight: true },
                  { label: "Discount", value: "50%" },
                  { label: "Maturity", value: "18 months" },
                  { label: "Close", value: "Rolling (target Q3 2026)" },
                ].map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-white/10" style={{ padding: 'clamp(10px, 1vw, 16px) 0', fontSize: 'clamp(14px, 1.1vw, 18px)' }}>
                    <span style={{ color: '#FFFFFF' }}>{row.label}</span>
                    <span className={row.highlight ? "font-semibold" : "font-semibold text-white"} style={row.highlight ? { color: '#00E5E5' } : {}}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-r-lg" style={{ padding: 'clamp(14px, 1.2vw, 20px)', marginBottom: 'clamp(16px, 1.5vw, 24px)', background: 'rgba(0, 229, 229, 0.08)', borderLeft: '3px solid #00E5E5' }}>
                <p className="tracking-[1px] uppercase" style={{ color: '#00E5E5', fontSize: 'clamp(12px, 0.9vw, 14px)', marginBottom: 'clamp(4px, 0.4vw, 8px)' }}>EARLY ADVANTAGE</p>
                <p className="text-white" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>50% discount with $6M cap before institutional round.</p>
              </div>

              <Button 
                className="w-full rounded-lg font-semibold text-black"
                style={{ padding: 'clamp(16px, 1.5vw, 24px)', fontSize: 'clamp(14px, 1.1vw, 17px)', background: '#00E5E5', boxShadow: '0 0 20px rgba(0, 229, 229, 0.4)' }}
                onClick={() => navigate('/partner-application')}
              >
                RESERVE ALLOCATION →
              </Button>
            </div>

            {/* TRANCHE 2 */}
            <div 
              className="relative rounded-xl opacity-70 hover:opacity-100 transition-all duration-300"
              style={{
                padding: 'clamp(24px, 2.5vw, 40px)',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div 
                className="inline-flex items-center gap-2 rounded-full tracking-[2px] uppercase"
                style={{ padding: 'clamp(8px, 0.8vw, 12px) clamp(14px, 1.2vw, 20px)', fontSize: 'clamp(12px, 0.9vw, 14px)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.3)', color: '#A0A0A0', marginBottom: 'clamp(16px, 1.5vw, 24px)' }}
              >
                <Clock style={{ width: 'clamp(14px, 1vw, 18px)', height: 'clamp(14px, 1vw, 18px)' }} />
                OPENS UPON T1 CLOSE
              </div>
              
              <div style={{ marginBottom: 'clamp(20px, 2vw, 32px)' }}>
                <p className="tracking-[3px] uppercase" style={{ color: '#00E5E5', fontSize: 'clamp(12px, 0.9vw, 14px)', marginBottom: 'clamp(6px, 0.6vw, 10px)' }}>TRANCHE 2</p>
                <h3 className="font-semibold text-white" style={{ fontSize: 'clamp(20px, 1.6vw, 28px)' }}>Series Seed</h3>
              </div>
              
              <div style={{ marginBottom: 'clamp(20px, 2vw, 32px)' }}>
                {[
                  { label: "Target Raise", value: "$1,500,000" },
                  { label: "Instrument", value: "Priced Equity Round" },
                  { label: "Valuation Cap", value: "$12,000,000", highlight: true },
                  { label: "Minimum Check", value: "$50,000" },
                  { label: "Status", value: "Pending T1 Close", dim: true },
                ].map((row, idx) => (
                  <div key={idx} className="flex justify-between items-center border-b border-white/10" style={{ padding: 'clamp(10px, 1vw, 16px) 0', fontSize: 'clamp(14px, 1.1vw, 18px)' }}>
                    <span style={{ color: '#FFFFFF' }}>{row.label}</span>
                    <span className={row.highlight ? "font-semibold" : row.dim ? "" : "font-semibold text-white"} style={row.highlight ? { color: '#00E5E5' } : row.dim ? { color: '#A0A0A0' } : {}}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="rounded-r-lg" style={{ padding: 'clamp(14px, 1.2vw, 20px)', background: 'rgba(255, 255, 255, 0.03)', borderLeft: '3px solid rgba(255, 255, 255, 0.2)' }}>
                <p className="tracking-[1px] uppercase" style={{ color: '#00E5E5', fontSize: 'clamp(12px, 0.9vw, 14px)', marginBottom: 'clamp(4px, 0.4vw, 8px)' }}>COMPARISON</p>
                <p className="text-white" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>T1 investors get $6M lower cap with 50% discount.</p>
              </div>
            </div>
          </div>

          <p className="text-center text-white/60" style={{ fontSize: 'clamp(12px, 0.9vw, 14px)' }}>Source of truth: Deal Room terms</p>
        </section>

        {/* ===== LIQUIDITY & ROI (Accordion) ===== */}
        <section>
          <Accordion type="single" collapsible>
            <AccordionItem value="liquidity" className="border-none rounded-xl">
              <AccordionTrigger className="py-5 hover:no-underline justify-center">
                <span 
                  className="inline-flex items-center gap-3 rounded-full font-bold tracking-wide text-black animate-[pulse_3s_ease-in-out_infinite]"
                  style={{ 
                    fontSize: 'clamp(18px, 1.5vw, 26px)', 
                    padding: 'clamp(14px, 1.5vw, 22px) clamp(28px, 3vw, 48px)',
                    background: 'linear-gradient(135deg, #00bfff 0%, #0080ff 50%, #00bfff 100%)',
                    boxShadow: '0 0 30px rgba(0, 191, 255, 0.6), 0 0 60px rgba(0, 128, 255, 0.3)',
                  }}
                >
                  <ChevronDown style={{ width: 'clamp(24px, 2vw, 32px)', height: 'clamp(24px, 2vw, 32px)' }} />
                  Liquidity & Returns (Expanded)
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-black/60 border border-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🚀</div>
                    <h4 className="text-xs tracking-[1px] uppercase text-cyan-400 mb-2">The Exit Strategy</h4>
                    <p className="text-sm text-white/80">
                      <span className="font-semibold text-cyan-400">Acquisition Targets (Examples):</span> Fintech (e.g., Block, Stripe), Insurance, or Hospitality operators/platforms (examples only). <br/>
                      <span className="font-semibold text-cyan-400">Target Outcome:</span> Strategic acquisition OR major growth milestone <span className="text-white/60">(not guaranteed)</span>. <br/>
                      <span className="font-semibold text-cyan-400">Timeline:</span> 9-month execution runway for go-to-market and traction milestones. Any acquisition discussion is opportunistic and not guaranteed.
                    </p>
                  </div>
                  <div className="bg-black/60 border border-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <h4 className="text-xs tracking-[1px] uppercase text-cyan-400 mb-2">Dividend Distributions</h4>
                    <p className="text-sm text-white/80">VALID™ is a pipeline, not a burn machine. We intend to distribute a portion of Net Transaction Fees to equity holders once operations are stable <span className="text-white/60">(subject to board approval)</span>.</p>
                  </div>
                  <div className="bg-black/60 border border-white/10 rounded-lg p-4 text-center">
                    <div className="text-3xl mb-2">🔄</div>
                    <h4 className="text-xs tracking-[1px] uppercase text-cyan-400 mb-2">Secondary Market</h4>
                    <p className="text-sm text-white/80">Tranche 1 investors may have the option to sell shares in future secondary transactions <span className="text-white/60">(subject to company approval and buyer availability)</span>.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* ===== RISK DISCLOSURES (Accordion with Summary) ===== */}
        <section>
          <div className="bg-white/10 border border-white/20 rounded-xl p-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="risk" className="border-none">
                <AccordionTrigger className="py-2 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span className="font-bold text-amber-500">Important Risk Disclosures</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {/* 3-bullet summary */}
                  <div className="bg-amber-950/30 border border-amber-500/30 rounded-lg p-4 mb-4">
                    <ul className="text-sm text-amber-200 space-y-1">
                      <li>• High-risk speculative investment—you may lose your entire investment</li>
                      <li>• Convertible Note converts on qualifying event or at 18-month maturity</li>
                      <li>• Illiquid investment with indefinite holding period</li>
                    </ul>
                  </div>
                  
                  {/* Full text */}
                  <div className="space-y-4 text-sm text-white/80">
                    <div>
                      <h5 className="font-bold text-amber-400 mb-1">1. Speculative Investment</h5>
                      <p>Investment in Valid™ (via Giant Ventures, LLC) is highly speculative and involves a high degree of risk. This opportunity is suitable only for persons who can afford to lose their entire investment.</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-amber-400 mb-1">2. Convertible Note Terms</h5>
                      <p>Tranche 1 funds are contributed via Convertible Note with 18-month maturity, $6,000,000 valuation cap, and 50% discount. The Note converts to equity upon a qualifying financing event or at maturity.</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-amber-400 mb-1">3. No Personal Guarantee</h5>
                      <p>The investment is made solely into the corporate entity. Recourse is limited strictly to the assets of the Company.</p>
                    </div>
                    <div>
                      <h5 className="font-bold text-amber-400 mb-1">4. Indefinite Holding Period</h5>
                      <p>This is an illiquid investment. Investors may not be able to sell or transfer their equity for an indefinite period.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <SectionDivider label="Founder" />

        {/* ===== FOUNDER ===== */}
        <section>
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-cyan-950/30 border border-cyan-500/20 rounded-xl p-6 md:p-8">
            <div className="flex justify-center mb-4">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 px-4 py-1 text-xs tracking-[2px] uppercase">
                THE FOUNDER
              </Badge>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white font-orbitron mb-1">
                STEVEN GRILLO
              </h2>
              <p className="text-sm text-cyan-400 tracking-[2px] uppercase">
                Founder & Chief Architect
              </p>
            </div>
            
            {/* 3 Credibility Bullets */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-black/40 rounded-lg">
                <div className="text-xl font-bold text-white">35+</div>
                <div className="text-xs text-white/70">Years Execution</div>
              </div>
              <div className="text-center p-3 bg-black/40 rounded-lg">
                <div className="text-xl font-bold text-white">Multi-Exit</div>
                <div className="text-xs text-white/70">Operator</div>
              </div>
              <div className="text-center p-3 bg-black/40 rounded-lg">
                <div className="text-xl font-bold text-white">AI-Native</div>
                <div className="text-xs text-white/70">Builder</div>
              </div>
            </div>

            <p className="text-white/80 text-center text-sm mb-4">
              Self-made operator who scaled multiple businesses from zero to exit. Deep expertise in operations, risk management, and high-liability sectors.
            </p>

            <Accordion type="single" collapsible>
              <AccordionItem value="bio" className="border-white/10">
                <AccordionTrigger className="text-sm text-white/70 hover:text-white justify-center">
                  Full Bio
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-4">
                    <div className="border-l-4 border-cyan-500/50 pl-4">
                      <h4 className="text-cyan-400 font-bold mb-1">The Background</h4>
                      <p className="text-sm text-white/80">53 years of life. 35 years of execution. Bridged hard infrastructure with high-stakes regulation. Career built on tangible results, not theory.</p>
                    </div>
                    <div className="border-l-4 border-cyan-500/50 pl-4">
                      <h4 className="text-cyan-400 font-bold mb-1">The Operator</h4>
                      <p className="text-sm text-white/80">Veteran of the real economy. Deep mastery of Operations and Risk Management. Translates complex market necessities into revenue-generating systems.</p>
                    </div>
                    <div className="border-l-4 border-cyan-500/50 pl-4">
                      <h4 className="text-cyan-400 font-bold mb-1">The Architect</h4>
                      <p className="text-sm text-white/80">Pioneer of Synthesized AI Methodology. Commands a symphony of AI agents—delivering in 300 hours what teams fail to deliver in a year.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4 text-center mt-4">
              <p className="text-lg text-white font-bold italic">
                "Experience cannot be coded. It must be lived."
              </p>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="text-center py-8">
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-2 font-orbitron">Ready to Discuss?</h3>
            <p className="text-white/80 mb-6 text-sm">Schedule a direct call with our founding team.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                onClick={() => window.open('https://calendly.com/steve-bevalid/30min', '_blank')}
              >
                <Phone className="mr-2 h-5 w-5" />
                Book a 30-Minute Call
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-full"
                onClick={() => window.open('mailto:invest@bevalid.app?subject=Data Room Request', '_blank')}
              >
                <FileText className="mr-2 h-5 w-5" />
                Request Data Room
              </Button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default PitchDeck;
