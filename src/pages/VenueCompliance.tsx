import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles, PartyPopper, Video, Building2, Car, Key, FlaskConical, Lock, CreditCard, QrCode, Plug, Database, Server, FileCheck, Fingerprint, ShieldCheck, X, Code, TrendingUp } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ROICalculator from "@/components/ROICalculator";
import { ThemeToggle } from "@/components/ThemeToggle";

// Investor Relations Button Component
const InvestorRelationsButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-full md:w-auto px-4 py-2 text-sm font-bold rounded-lg 
                 bg-secondary/80 text-amber-500 dark:text-amber-400 border border-amber-600 
                 shadow-lg shadow-amber-900/40 hover:shadow-amber-600/60 transition-all 
                 flex items-center justify-center space-x-2"
    >
      <TrendingUp className="h-4 w-4" />
      <span style={{ fontFamily: 'Orbitron, sans-serif' }}>INVESTOR RELATIONS</span>
      <span style={{ fontSize: '1.2em', lineHeight: '1' }}>→</span>
    </button>
  );
};

// Builder's Vision Button Component
const BuilderVisionButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="relative group">
      {/* Pulsing glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-lg blur-md opacity-60 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-lg blur-sm opacity-40 animate-[pulse_1.5s_ease-in-out_infinite]"></div>
      <button
        onClick={onClick}
        className="relative w-full md:w-auto px-4 py-2 text-sm font-bold rounded-lg 
                   bg-secondary/90 text-amber-500 dark:text-amber-400 border border-amber-600 
                   shadow-lg shadow-amber-900/40 hover:shadow-amber-600/60 transition-all 
                   flex items-center justify-center space-x-2 hover:scale-105"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        <span role="img" aria-label="Alien">👽</span>
        <span>THE BUILDER'S VISION: WHY IT'S A UNICORN</span>
        <span role="img" aria-label="Diamond">💎</span>
      </button>
    </div>
  );
};

const VenueCompliance = () => {
  const navigate = useNavigate();
  const [securityModalOpen, setSecurityModalOpen] = useState(false);

  return (
    <div className="min-h-screen text-foreground font-sans bg-background">
      {/* Ambient Background Effects - matching homepage */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Header - matching homepage */}
      <header className="relative border-b border-primary/20 bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          {/* Mobile: Stack layout, Desktop: Row layout */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Top row on mobile: Logo + Back button */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                <div className="flex flex-col">
                  <span className="text-2xl md:text-3xl font-bold font-orbitron tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-blue-400 drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]">VALID<sup className="text-xs text-cyan-400">™</sup></span>
                  <span className="text-[8px] md:text-[10px] font-semibold text-cyan-400 tracking-[0.15em] md:tracking-[0.2em] uppercase">Enterprise Security</span>
                </div>
              </div>
              
              {/* Mobile: Back button + theme toggle */}
              <div className="flex items-center gap-2 md:hidden">
                <ThemeToggle />
                <Button
                  variant="outline" 
                  size="sm"
                  className="border-border bg-secondary text-foreground hover:bg-accent hover:text-accent-foreground font-medium text-xs px-2"
                  asChild
                >
                  <Link to="/">← Home</Link>
                </Button>
              </div>
            </div>
            
            {/* Center: Beta Badge - visible on all screens */}
            <div className="flex justify-center md:absolute md:left-1/2 md:-translate-x-1/2">
              <div className="relative group">
                <div className="absolute inset-0 bg-accent/30 blur-xl rounded-lg animate-pulse"></div>
                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-lg animate-[pulse_1.5s_ease-in-out_infinite]"></div>
                <div className="relative px-3 py-1.5 bg-secondary/80 border border-accent/50 rounded-full shadow-[0_0_20px_hsl(var(--accent)/0.5),inset_0_0_20px_hsl(var(--accent)/0.1)]">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 rounded-full"></div>
                  <span className="relative font-mono text-[10px] md:text-xs font-bold tracking-wider text-accent uppercase whitespace-nowrap" style={{ textShadow: '0 0 10px hsl(var(--accent)/0.8), 0 0 20px hsl(var(--accent)/0.5)' }}>
                    ⚡ Beta Version ⚡
                  </span>
                </div>
              </div>
            </div>
            
            {/* Desktop only: Right side buttons */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="outline" 
                className="border-border bg-secondary text-foreground hover:bg-accent hover:text-accent-foreground font-medium"
                asChild
              >
                <Link to="/">← Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Reduced size */}
      <div className="relative py-8 px-5">
        <div className="text-center space-y-4">
          {/* Powered by Synthesized AI */}
          <p className="text-sm md:text-base font-mono tracking-[0.15em] text-muted-foreground uppercase">
            Powered By Synthesized AI
          </p>
          <h1 className="text-3xl md:text-4xl font-black italic bg-gradient-to-r from-primary via-accent to-foreground bg-clip-text text-transparent">
            Partner Solutions: Choose Your Industry
          </h1>
          <button 
            onClick={() => setSecurityModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-secondary/80 text-accent font-semibold text-base md:text-lg border border-accent/40 shadow-[0_0_20px_hsl(var(--accent)/0.2)] hover:bg-secondary hover:border-accent/60 hover:shadow-[0_0_30px_hsl(var(--accent)/0.4)] transition-all duration-300 cursor-pointer"
          >
            <span>Automated Compliance And Risk Management For High-Liability Sectors.</span>
            <span className="animate-pulse text-accent text-2xl md:text-3xl drop-shadow-[0_0_8px_hsl(var(--accent))]">→</span>
          </button>
          
          {/* Investor Relations Button */}
          <div className="pt-3 flex flex-col items-center gap-3">
            <InvestorRelationsButton onClick={() => navigate("/pitch-deck")} />
            <BuilderVisionButton onClick={() => navigate("/builders-vision")} />
          </div>
        </div>
      </div>

      {/* Security Architecture Modal */}
      <Dialog open={securityModalOpen} onOpenChange={setSecurityModalOpen}>
        <DialogContent className="max-w-2xl bg-card border border-border text-foreground max-h-[85vh] overflow-y-auto top-[5%] translate-y-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary via-accent to-foreground bg-clip-text text-transparent">
              Enterprise Security Architecture
            </DialogTitle>
            <p className="text-center text-muted-foreground text-sm mt-1">Built for Fintech-Grade Compliance</p>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            {/* Database Security */}
            <div className="flex gap-4 p-4 bg-secondary/60 rounded-xl border border-border">
              <div className="h-12 w-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h4 className="font-bold text-primary mb-1">Row-Level Security (RLS)</h4>
                <p className="text-sm text-muted-foreground">PostgreSQL-native RLS policies enforce data isolation at the database layer. Users can only access their own records—enforced server-side, not client-side.</p>
              </div>
            </div>

            {/* Encryption */}
            <div className="flex gap-4 p-4 bg-secondary/60 rounded-xl border border-border">
              <div className="h-12 w-12 bg-gradient-to-br from-violet-500 to-violet-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-violet-500 dark:text-violet-400 mb-1">AES-256 Encryption at Rest</h4>
                <p className="text-sm text-muted-foreground">All sensitive data encrypted using AES-256-GCM. TLS 1.3 enforced for all data in transit. Zero plaintext storage of PII or PHI.</p>
              </div>
            </div>

            {/* Authentication */}
            <div className="flex gap-4 p-4 bg-secondary/60 rounded-xl border border-border">
              <div className="h-12 w-12 bg-gradient-to-br from-sky-500 to-sky-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Fingerprint className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sky-500 dark:text-sky-400 mb-1">JWT Authentication & RBAC</h4>
                <p className="text-sm text-muted-foreground">Stateless JWT tokens with role-based access control (guest, registered, paid, active_member, administrator). Token expiration and refresh rotation enforced.</p>
              </div>
            </div>

            {/* API Security */}
            <div className="flex gap-4 p-4 bg-secondary/60 rounded-xl border border-border">
              <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Server className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-amber-500 dark:text-amber-400 mb-1">Serverless Edge Functions</h4>
                <p className="text-sm text-muted-foreground">Deno-based edge functions with isolated execution environments. API keys stored in encrypted vault. CORS-protected endpoints with rate limiting.</p>
              </div>
            </div>

            {/* Compliance */}
            <div className="flex gap-4 p-4 bg-secondary/60 rounded-xl border border-border">
              <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-pink-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-pink-500 dark:text-pink-400 mb-1">HIPAA & GDPR Ready</h4>
                <p className="text-sm text-muted-foreground">FHIR R4 compatible data schemas. Privacy firewall requires explicit user consent before status publication. Complete audit trail with IP logging and timestamps.</p>
              </div>
            </div>

            {/* Identity Verification */}
            <div className="flex gap-4 p-4 bg-secondary/60 rounded-xl border border-border">
              <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-red-500 dark:text-red-400 mb-1">2257 Identity Verification</h4>
                <p className="text-sm text-muted-foreground">Government ID upload and verification for affiliate partners. KYC-compliant document storage in encrypted buckets with admin-only access.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              VALID™ infrastructure runs on SOC 2 Type II certified cloud providers. For security inquiries: Steve@bigtexasroof.com
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Value Propositions - Partner Cards */}
      <div className="relative grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-5 mb-8">
        
        <div className="p-6 bg-card/70 rounded-lg border border-destructive/50 shadow-lg hover:shadow-destructive/30 transition-all">
          <h3 className="text-xl font-extrabold text-destructive mb-2">1. UNMATCHED RISK TRANSFER</h3>
          <p className="text-muted-foreground text-sm">
            Outsource your operational liability instantly. Our <strong className="text-foreground">Zero-Trust Architecture</strong> provides the mandatory digital waiver and continuous audit trail, legally shielding your organization from health, security, and compliance liability. This is your definitive <strong className="text-foreground">HIPAA and GDPR firewall.</strong>
          </p>
        </div>

        <div className="p-6 bg-card/70 rounded-lg border border-amber-500/50 shadow-lg hover:shadow-amber-500/30 transition-all">
          <h3 className="text-xl font-extrabold text-amber-500 mb-2">2. HIGH-MARGIN REVENUE ENGINE</h3>
          <p className="text-muted-foreground text-sm">
            Transform the access checkpoint into an instant profit center. We enable you to collect <strong className="text-foreground">recurring subscription revenue</strong> plus high-margin earnings from the <strong className="text-foreground">$10 Incognito Access Token</strong>. Turn security compliance into a guaranteed, passive source of income.
          </p>
        </div>

        <div className="p-6 bg-card/70 rounded-lg border border-accent/50 shadow-lg hover:shadow-accent/30 transition-all">
          <h3 className="text-xl font-extrabold text-accent mb-2">3. CONTINUOUS ASSET VETTING</h3>
          <p className="text-muted-foreground text-sm">
            Secure your most valuable assets—from performer talent to exotic vehicles. Our <strong className="text-foreground">Rolling Compliance</strong> system provides continuous, real-time screening (Health &amp; Toxicology), dramatically reducing the risk of shutdowns, accidents, and financial loss due to non-compliance.
          </p>
        </div>

      </div>

      {/* Profit Maximizer Banner - CFO Alert */}
      <div className="my-12 mx-5 md:mx-10 max-w-7xl lg:mx-auto p-8 bg-gradient-to-r from-secondary to-card rounded-2xl border-2 border-accent shadow-[0_0_30px_hsl(var(--accent)/0.15)]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="md:w-2/3">
            <div className="flex items-center space-x-3 mb-3">
              <span className="px-3 py-1 bg-accent text-accent-foreground font-bold text-xs uppercase tracking-widest rounded-full">CFO Alert</span>
              <span className="text-amber-500 font-bold text-sm tracking-wide">ELIMINATE MERCHANT FEES</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Stop Losing 1.9% to 4.5% on Every Swipe.
            </h2>
            
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              Our <strong className="text-foreground">Pre-Funded Wallet Architecture</strong> changes the game. Users load funds into their Incognito Token <em>before</em> they arrive. When they scan at your business, the transaction is an instant <strong className="text-foreground">Zero-Fee Ledger Transfer</strong>.
            </p>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <li className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-foreground font-medium">0% Credit Card Fees for Venue</span>
              </li>
              <li className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span className="text-foreground font-medium">100% Chargeback Immunity</span>
              </li>
              <li className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-foreground font-medium">Instant Funds Verification</span>
              </li>
              <li className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="text-foreground font-medium">+4% Immediate Margin Boost</span>
              </li>
            </ul>
            
            <Button 
              onClick={() => navigate("/partner-application")}
              className="mt-6 px-8 py-3 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg rounded-full shadow-[0_0_20px_hsl(var(--accent)/0.5)] hover:shadow-[0_0_30px_hsl(var(--accent)/0.7)] transition-all duration-300"
            >
              Request Wallet Integration Demo →
            </Button>
          </div>

          <div className="md:w-1/3 flex justify-center">
            <div className="bg-background/50 p-6 rounded-xl border border-border text-center w-full max-w-xs">
              <p className="text-muted-foreground text-sm uppercase mb-2">Annual Savings Calculator</p>
              <div className="text-5xl font-extrabold text-foreground mb-1">$100k</div>
              <p className="text-accent text-sm font-bold">SAVED PER $2.5M REVENUE</p>
              <p className="text-xs text-muted-foreground mt-3 italic">*Based on avg. 4% interchange &amp; chargeback loss elimination.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Industry Cards Grid - Reduced card sizes */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 px-5 md:px-10 pb-16 max-w-7xl mx-auto">
        
        {/* Card 1: Nightlife & Events */}
        <div 
          className="rounded-2xl p-5 border border-border flex flex-col justify-between min-h-[420px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <PartyPopper className="h-8 w-8 text-blue-300" />
              <h3 className="text-xl font-bold text-white">Nightlife & Events</h3>
            </div>
            <p className="italic opacity-90 mb-3 text-base text-white">"Monetize the Door. Verify the Vibe."</p>
          </div>

          <div className="space-y-2">
            {/* Tier 1 */}
            <div className="border border-border/50 p-3 rounded-lg bg-black/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-white">Promoter Tier (Up to 200 Scans)</span>
                <span className="text-blue-300 font-bold text-base">$299/mo</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">Overage billed at $2.00/scan.</p>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="VALID - Nightlife Tier 1 (Promoter)" />
                <input type="hidden" name="a3" value="299.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                <input type="hidden" name="on0" value="Club Name" />
                <input type="text" name="os0" placeholder="Event/Club Name" required className="w-full px-3 py-2 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2.5 bg-blue-400 text-black font-bold rounded uppercase text-sm">
                  ACTIVATE TIER 1
                </button>
              </form>
            </div>

            {/* Tier 2 */}
            <div className="border border-border/50 p-3 rounded-lg bg-black/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-white">Club Tier (Up to 1,000 Scans)</span>
                <span className="text-blue-300 font-bold text-base">$999/mo</span>
              </div>
              <p className="text-xs text-gray-400 mb-2">Overage billed at $1.00/scan.</p>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="VALID - Nightlife Tier 2 (Club)" />
                <input type="hidden" name="a3" value="999.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                <input type="hidden" name="on0" value="Club Name" />
                <input type="text" name="os0" placeholder="Club Name" required className="w-full px-3 py-2 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2.5 bg-blue-400 text-black font-bold rounded uppercase text-sm">
                  ACTIVATE TIER 2
                </button>
              </form>
            </div>

            {/* Enterprise */}
            <a href="mailto:Steve@bigtexasroof.com?subject=Enterprise%20Nightlife%20Partnership" className="block">
              <button type="button" className="w-full py-2.5 bg-transparent text-blue-300 font-bold border border-blue-300 rounded uppercase text-sm">
                REQUEST MEGA-CLUB CONTRACT
              </button>
            </a>
          </div>
        </div>

        {/* Card 2: Talent & Content Creators */}
        <div 
          className="rounded-2xl p-5 border border-amber-500/50 flex flex-col justify-between min-h-[420px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1566415702213-94c3d828a2a7?auto=format&fit=crop&w=800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Video className="h-8 w-8 text-amber-400" />
              <h3 className="text-xl font-bold text-amber-400">Talent & Content Creators</h3>
            </div>
            <p className="italic opacity-90 mb-3 text-base text-white">"The Industry Standard for Talent."</p>
            <ul className="space-y-1 text-sm text-white">
              <li>✅ <strong>Get Booked:</strong> Verified safety for Bookings.</li>
              <li>✅ <strong>Digital Handshake:</strong> Auto-syncs status.</li>
              <li>✅ <strong>Auto-Renewal:</strong> 60-day testing cycle.</li>
            </ul>
          </div>

          <div className="mt-3">
            <div className="text-4xl font-black text-amber-400 mb-1">$39.00</div>
            <div className="font-bold mb-3 text-base text-white">Every 60 Days (Performer Pass)</div>
            
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
              <input type="hidden" name="cmd" value="_xclick-subscriptions" />
              <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
              <input type="hidden" name="item_name" value="VALID - Performer Compliance Pass" />
              <input type="hidden" name="a3" value="39.00" />
              <input type="hidden" name="p3" value="2" />
              <input type="hidden" name="t3" value="M" />
              <input type="hidden" name="src" value="1" />
              <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
              <input type="hidden" name="on0" value="Stage Name" />
              <input type="hidden" name="on1" value="Affiliation" />
              
              <input type="text" name="os0" placeholder="1. Professional Name" required className="w-full px-3 py-2 mb-2 rounded text-black text-sm" />
              <input type="text" name="os1" placeholder="2. Agency or Venue" required className="w-full px-3 py-2 mb-3 rounded text-black text-sm" />

              <button type="submit" className="w-full py-3 bg-amber-400 text-black font-extrabold rounded-lg uppercase text-base">
                ACTIVATE TALENT PASS
              </button>
            </form>
          </div>
        </div>

        {/* Card 3: Workforce Management */}
        <div 
          className="rounded-2xl p-5 border border-border flex flex-col justify-between min-h-[420px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="h-8 w-8 text-gray-400" />
              <h3 className="text-xl font-bold text-white">Workforce Management</h3>
            </div>
            <p className="italic opacity-90 mb-3 text-base text-white">"Connect your team. Monitor the data."</p>
            <p className="text-xs text-gray-400 uppercase font-bold mb-2">Select System Capacity</p>
          </div>

          <div className="space-y-2">
            {/* Tier 1 */}
            <div className="border border-border/50 p-3 rounded-lg bg-black/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-white">Small (1-50 Staff)</span>
                <span className="text-gray-400 font-bold text-base">$399/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="VALID - Workforce System (Tier 1: 1-50)" />
                <input type="hidden" name="a3" value="399.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-3 py-2 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2 bg-gray-400 text-black font-bold rounded text-sm">
                  ACTIVATE TIER 1
                </button>
              </form>
            </div>

            {/* Tier 2 */}
            <div className="border border-border/50 p-3 rounded-lg bg-black/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-white">Mid-Size (50-150 Staff)</span>
                <span className="text-gray-400 font-bold text-base">$699/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="VALID - Workforce System (Tier 2: 50-150)" />
                <input type="hidden" name="a3" value="699.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-3 py-2 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2 bg-gray-400 text-black font-bold rounded text-sm">
                  ACTIVATE TIER 2
                </button>
              </form>
            </div>

            {/* Tier 3 Enterprise */}
            <div className="border-2 border-amber-500 p-3 rounded-lg bg-black/60">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-amber-400">Enterprise (150-500 Staff)</span>
                <span className="text-amber-400 font-bold text-base">$1,299/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="VALID - Workforce System (Tier 3: 150-500)" />
                <input type="hidden" name="a3" value="1299.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-3 py-2 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2 bg-amber-400 text-black font-bold rounded text-sm">
                  ACTIVATE TIER 3
                </button>
              </form>
            </div>

            {/* Bulk Kits */}
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="mt-2">
              <input type="hidden" name="cmd" value="_xclick" />
              <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
              <input type="hidden" name="item_name" value="VALID - Bulk Employee Kits (10pk)" />
              <input type="hidden" name="amount" value="890.00" />
              <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
              <button type="submit" className="w-full py-2.5 bg-secondary text-foreground font-bold border border-border rounded text-sm">
                ORDER 10-PACK ($890)
              </button>
            </form>
          </div>
        </div>

        {/* Card 4: Transportation & Fleets */}
        <div 
          className="rounded-2xl p-5 border border-border flex flex-col justify-between min-h-[420px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Car className="h-8 w-8 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">Transportation & Fleets</h3>
            </div>
            <p className="italic opacity-90 mb-3 text-base text-white">"Protect the asset. Continuous driver screening."</p>
            <hr className="border-border/30 my-3" />
            <p className="text-xs text-gray-400 uppercase font-bold mb-2">Fleet Licenses (Monthly)</p>
          </div>

          <div className="space-y-2">
            {/* Tier 1: Small Fleet */}
            <div className="border border-border/50 p-3 rounded-lg bg-black/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-white">Small Fleet (1-50 Cars)</span>
                <span className="text-emerald-400 font-bold text-base">$299/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="VALID - Small Fleet License (1-50)" />
                <input type="hidden" name="a3" value="299.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-3 py-2 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2 bg-emerald-400 text-black font-bold rounded text-sm">
                  ACTIVATE TIER 1
                </button>
              </form>
            </div>

            {/* Tier 2: Mid Fleet */}
            <div className="border border-border/50 p-3 rounded-lg bg-black/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-white">Mid Fleet (50-200 Cars)</span>
                <span className="text-emerald-400 font-bold text-base">$599/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="VALID - Mid Fleet License (50-200)" />
                <input type="hidden" name="a3" value="599.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-3 py-2 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2 bg-emerald-400 text-black font-bold rounded text-sm">
                  ACTIVATE TIER 2
                </button>
              </form>
            </div>

            {/* Tier 3: Large Fleet (Gold) */}
            <div className="border-2 border-amber-500 p-3 rounded-lg bg-black/70">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-amber-400">Large Fleet (200+ Cars)</span>
                <span className="text-amber-400 font-bold text-base">$999/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="VALID - Large Fleet License (200+)" />
                <input type="hidden" name="a3" value="999.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-3 py-2 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2 bg-amber-400 text-black font-bold rounded text-sm">
                  ACTIVATE TIER 3
                </button>
              </form>
            </div>

            {/* Individual Driver */}
            <div className="border-t border-border/50 pt-2 mt-2">
              <p className="text-xs text-gray-400 uppercase font-bold mb-1">For Individual Drivers</p>
              <div className="text-xl font-bold mb-1 text-white">$119.00 <span className="text-sm font-normal text-gray-400">One-Time</span></div>
              <p className="text-xs text-gray-400 mb-2">Includes: Membership + <strong className="text-amber-400">14-Day QR Code</strong> + 1 Drug Test Kit.</p>
              
              <a 
                href="/toxicology-kit-order?type=driver"
                className="block w-full py-2.5 bg-secondary text-foreground font-bold border border-border rounded text-center text-sm"
              >
                BUY DRIVER PASS ($119)
              </a>
            </div>
          </div>
        </div>

        {/* Card 5: Exotic & Luxury Rentals */}
        <div 
          className="rounded-2xl p-5 border border-border flex flex-col justify-between min-h-[420px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Key className="h-8 w-8 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Exotic & Luxury Rentals</h3>
            </div>
            <p className="italic opacity-90 mb-3 text-base text-white">"Protect the asset. Verify the driver."</p>
            <ul className="space-y-1 text-sm text-white">
              <li>✅ <strong>Pre-Rental Screening:</strong> Verify driver sobriety.</li>
              <li>✅ <strong>Liability Documentation:</strong> Digital waiver.</li>
              <li>✅ <strong>Asset Protection:</strong> Reduce DUI risk.</li>
            </ul>
          </div>

          <div className="space-y-2 mt-3">
            {/* Small Rental Fleet */}
            <div className="border border-border/50 p-3 rounded-lg bg-black/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-white">Small Fleet (1-10 Vehicles)</span>
                <span className="text-yellow-400 font-bold text-base">$199/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="VALID - Exotic Rental (Small Fleet)" />
                <input type="hidden" name="a3" value="199.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-3 py-2 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2 bg-yellow-400 text-black font-bold rounded text-sm">
                  ACTIVATE SMALL FLEET
                </button>
              </form>
            </div>

            {/* Mid Rental Fleet */}
            <div className="border border-border/50 p-3 rounded-lg bg-black/50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-white">Mid Fleet (10-50 Vehicles)</span>
                <span className="text-yellow-400 font-bold text-base">$399/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="VALID - Exotic Rental (Mid Fleet)" />
                <input type="hidden" name="a3" value="399.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-3 py-2 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2 bg-yellow-400 text-black font-bold rounded text-sm">
                  ACTIVATE MID FLEET
                </button>
              </form>
            </div>

            {/* Enterprise Contact */}
            <a href="mailto:Steve@bigtexasroof.com?subject=Enterprise%20Exotic%20Rental%20Partnership" className="block">
              <button type="button" className="w-full py-2.5 bg-transparent text-yellow-400 font-bold border border-yellow-400 rounded uppercase text-sm">
                REQUEST ENTERPRISE PRICING
              </button>
            </a>
          </div>
        </div>

        {/* Card 6: Fintech & System Integration */}
        <div 
          className="rounded-2xl p-5 border border-violet-500/50 flex flex-col justify-between min-h-[420px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Lock className="h-8 w-8 text-violet-400" />
              <h3 className="text-xl font-bold text-violet-400">Fintech & Integration</h3>
            </div>
            <p className="italic opacity-90 mb-3 text-base text-white">"Plug into our ecosystem. Get paid instantly."</p>
            
            <div className="space-y-2">
              {/* Security Features */}
              <div className="bg-black/50 p-3 rounded-lg border border-violet-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="h-4 w-4 text-violet-400" />
                  <span className="font-bold text-sm text-violet-300">Bank-Grade Security</span>
                </div>
                <p className="text-xs text-gray-300">256-bit AES, SOC 2 Type II, HIPAA/GDPR, PCI DSS.</p>
              </div>

              {/* QR Integration */}
              <div className="bg-black/50 p-3 rounded-lg border border-violet-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <QrCode className="h-4 w-4 text-violet-400" />
                  <span className="font-bold text-sm text-violet-300">QR Environment Integration</span>
                </div>
                <p className="text-xs text-gray-300">Integrate existing POS into our QR ecosystem.</p>
              </div>

              {/* System Integration */}
              <div className="bg-black/50 p-3 rounded-lg border border-violet-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Plug className="h-4 w-4 text-violet-400" />
                  <span className="font-bold text-sm text-violet-300">Zero-Friction API</span>
                </div>
                <p className="text-xs text-gray-300">REST API connects your system in hours, not weeks.</p>
              </div>

              {/* Instant Payments */}
              <div className="bg-black/50 p-3 rounded-lg border border-violet-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4 text-violet-400" />
                  <span className="font-bold text-sm text-violet-300">Instant Payment Settlement</span>
                </div>
                <p className="text-xs text-gray-300">Same-day revenue, no 30+ day waits.</p>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-2">
            <a href="mailto:Steve@bigtexasroof.com?subject=Fintech%20Integration%20Inquiry" className="block">
              <button className="w-full py-3 bg-violet-500 text-white font-extrabold rounded-lg uppercase text-base hover:bg-violet-400 transition-colors">
                REQUEST INTEGRATION SPECS
              </button>
            </a>
            <Link to="/api-docs" className="block">
              <button className="w-full py-2.5 bg-transparent text-violet-400 font-bold border border-violet-400 rounded-lg uppercase hover:bg-violet-500/10 transition-colors flex items-center justify-center gap-2 text-sm">
                <Code className="h-4 w-4" />
                VIEW API DOCUMENTATION
              </button>
            </Link>
          </div>
        </div>

        {/* Card 7: Lab Access Portal */}
        <Link to="/partners" className="block">
          <div 
            className="rounded-2xl p-5 border border-sky-400/50 flex flex-col justify-between min-h-[420px] cursor-pointer hover:border-sky-400 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-all duration-300"
            style={{
              background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <FlaskConical className="h-8 w-8 text-sky-400" />
                <h3 className="text-xl font-bold text-sky-400">Lab Access Portal</h3>
              </div>
              <p className="italic opacity-90 mb-3 text-base text-white">"Integrated Health Compliance for Affiliate Social Ecosystems."</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">✦</span>
                  <span className="text-white"><strong className="text-sky-300">High-Volume Access:</strong> Tap into exclusive affiliate communities.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">✦</span>
                  <span className="text-white"><strong className="text-sky-300">Real-Time API:</strong> Low-latency, FHIR-compatible integration.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">✦</span>
                  <span className="text-white"><strong className="text-sky-300">Auto Compliance:</strong> Offload HIPAA/GDPR from your team.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">✦</span>
                  <span className="text-white"><strong className="text-sky-300">Zero-Friction:</strong> Batch processing and barcode scanning.</span>
                </li>
              </ul>
            </div>

            <div className="mt-3">
              <button className="w-full py-3 bg-sky-400 text-black font-extrabold rounded-lg uppercase text-base">
                Access Lab Portal →
              </button>
            </div>
          </div>
        </Link>

      </div>

      {/* ROI Calculator Section */}
      <div className="relative max-w-xl mx-auto px-5 pb-10">
        <ROICalculator />
      </div>

      {/* Strategic Partner CTA */}
      <div className="relative max-w-4xl mx-auto px-5 pb-16">
        <div className="bg-card/80 backdrop-blur-sm border border-primary/30 rounded-2xl p-6 shadow-[0_0_30px_hsl(var(--primary)/0.15)]">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
            Strategic Partner Program: Activate Your Revenue Stream
          </h2>
          <p className="text-muted-foreground mb-5 text-sm md:text-base">
            Connect venues, refer members, and transform your influence into income. We offer a <strong className="text-foreground">dual revenue model</strong>—earning instant commission from every Incognito scan <em>plus</em> a structured commission on the <strong className="text-foreground">Venue&apos;s Gross Revenue</strong> (Door and Bar Sales) generated by your patrons.
          </p>

          {/* Revenue Split Explainer */}
          <div className="p-4 bg-secondary/70 rounded-lg border border-primary/30 mb-5">
            <h3 className="text-base md:text-lg font-semibold text-primary mb-2">
              YOUR REVENUE OPPORTUNITY: DUAL EARNINGS
            </h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-3 text-xs md:text-sm">
              <li>
                <strong className="text-foreground">INSTANT ACCESS COMMISSION:</strong> Earn a highly competitive commission from every $5.00 Incognito QR scan sold via your referrals. This payout is credited to your Affiliate Fund <strong className="text-foreground">near-immediately</strong>.
              </li>
              <li>
                <strong className="text-foreground">GROSS REVENUE SHARE (The Big Picture):</strong> Earn a structured commission based on the <strong className="text-foreground">total venue revenue</strong> (door cover, bar tabs, bottle service) generated by every patron who scanned your QR code.
              </li>
            </ul>
            <p className="text-accent text-xs md:text-sm mt-3 font-medium">
              <strong>FAST FUNDS:</strong> Since the venue&apos;s funds are processed immediately via VALID, your commission on that gross revenue is processed and available to you as soon as the venue funds your Affiliate Fund.
            </p>
          </div>

          <div className="text-center">
            <Link to="/partner-application">
              <button className="px-5 md:px-6 py-3 bg-primary text-primary-foreground font-extrabold rounded-lg uppercase text-sm md:text-base shadow-[0_0_20px_hsl(var(--primary)/0.5)] hover:bg-primary/90 hover:shadow-[0_0_30px_hsl(var(--primary)/0.7)] transition-all">
                APPLY FOR PARTNERSHIP
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueCompliance;
