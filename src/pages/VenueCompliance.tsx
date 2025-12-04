import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles, PartyPopper, Video, Building2, Car, Key, FlaskConical, Lock, CreditCard, QrCode, Plug, Database, Server, FileCheck, Fingerprint, ShieldCheck, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const VenueCompliance = () => {
  const [securityModalOpen, setSecurityModalOpen] = useState(false);

  return (
    <div 
      className="min-h-screen text-white font-sans"
      style={{
        background: 'radial-gradient(circle at 50% 25%, rgba(255, 255, 255, 0.15) 0%, rgba(244, 114, 182, 0.2) 25%, rgba(15, 23, 42, 0.95) 60%)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      }}
    >
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
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
          
          {/* Beta Pricing Badge */}
          <div className="flex relative group">
            <div className="absolute inset-0 bg-green-500/40 blur-xl rounded-lg animate-pulse"></div>
            <div className="absolute inset-0 bg-green-400/20 blur-2xl rounded-lg animate-[pulse_1.5s_ease-in-out_infinite]"></div>
            <div className="relative px-3 py-1.5 md:px-4 md:py-2 bg-black/80 border border-green-500/60 rounded-md shadow-[0_0_20px_rgba(34,197,94,0.5),inset_0_0_20px_rgba(34,197,94,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-green-400/5 to-green-500/10 rounded-md"></div>
              <span className="relative font-mono text-[10px] md:text-xs font-bold tracking-wider text-green-400 uppercase" style={{ textShadow: '0 0 10px rgba(34,197,94,0.8), 0 0 20px rgba(34,197,94,0.5)' }}>
                ⚡ Beta Version ⚡
              </span>
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
      <div className="py-10 px-5">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-4 italic text-amber-400">Partner Solutions: Choose Your Industry</h1>
          <button 
            onClick={() => setSecurityModalOpen(true)}
            className="inline-block px-5 py-1.5 rounded-full bg-slate-900/80 text-amber-400 font-semibold text-base md:text-lg border border-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:bg-slate-800/90 hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(251,191,36,0.4)] transition-all duration-300 cursor-pointer"
            style={{ textShadow: '0 0 10px rgba(251,191,36,0.5)' }}
          >
            Automated Compliance And Risk Management For High-Liability Sectors. →
          </button>
        </div>
      </div>

      {/* Security Architecture Modal */}
      <Dialog open={securityModalOpen} onOpenChange={setSecurityModalOpen}>
        <DialogContent className="max-w-2xl bg-slate-950 border border-slate-700 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-amber-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
              Enterprise Security Architecture
            </DialogTitle>
            <p className="text-center text-slate-400 text-sm mt-1">Built for Fintech-Grade Compliance</p>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            {/* Database Security */}
            <div className="flex gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-400 mb-1">Row-Level Security (RLS)</h4>
                <p className="text-sm text-slate-300">PostgreSQL-native RLS policies enforce data isolation at the database layer. Users can only access their own records—enforced server-side, not client-side.</p>
              </div>
            </div>

            {/* Encryption */}
            <div className="flex gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <div className="h-12 w-12 bg-gradient-to-br from-violet-500 to-violet-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-violet-400 mb-1">AES-256 Encryption at Rest</h4>
                <p className="text-sm text-slate-300">All sensitive data encrypted using AES-256-GCM. TLS 1.3 enforced for all data in transit. Zero plaintext storage of PII or PHI.</p>
              </div>
            </div>

            {/* Authentication */}
            <div className="flex gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <div className="h-12 w-12 bg-gradient-to-br from-sky-500 to-sky-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Fingerprint className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-sky-400 mb-1">JWT Authentication & RBAC</h4>
                <p className="text-sm text-slate-300">Stateless JWT tokens with role-based access control (guest, registered, paid, active_member, administrator). Token expiration and refresh rotation enforced.</p>
              </div>
            </div>

            {/* API Security */}
            <div className="flex gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <div className="h-12 w-12 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Server className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-amber-400 mb-1">Serverless Edge Functions</h4>
                <p className="text-sm text-slate-300">Deno-based edge functions with isolated execution environments. API keys stored in encrypted vault. CORS-protected endpoints with rate limiting.</p>
              </div>
            </div>

            {/* Compliance */}
            <div className="flex gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <div className="h-12 w-12 bg-gradient-to-br from-pink-500 to-pink-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-pink-400 mb-1">HIPAA & GDPR Ready</h4>
                <p className="text-sm text-slate-300">FHIR R4 compatible data schemas. Privacy firewall requires explicit user consent before status publication. Complete audit trail with IP logging and timestamps.</p>
              </div>
            </div>

            {/* Identity Verification */}
            <div className="flex gap-4 p-4 bg-slate-900/60 rounded-xl border border-slate-700/50">
              <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-red-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-red-400 mb-1">2257 Identity Verification</h4>
                <p className="text-sm text-slate-300">Government ID upload and verification for affiliate partners. KYC-compliant document storage in encrypted buckets with admin-only access.</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              Clean Check infrastructure runs on SOC 2 Type II certified cloud providers. For security inquiries: Steve@bigtexasroof.com
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Value Propositions */}
      <div className="flex flex-col md:flex-row justify-center max-w-5xl mx-auto gap-6 px-5 mb-12">
        <div className="flex-1 bg-white/5 p-6 rounded-xl">
          <h3 className="text-red-400 font-bold mb-3 text-lg">1. LIABILITY SHIELD</h3>
          <p className="text-base text-white">Outsource compliance tracking. We provide the mandatory digital waiver and audit trail, moving medical liability away from your venue.</p>
        </div>
        <div className="flex-1 bg-white/5 p-6 rounded-xl">
          <h3 className="text-blue-400 font-bold mb-3 text-lg">2. MONETIZE ACCESS</h3>
          <p className="text-base text-white">Transform the security checkpoint into a profit center. Collect subscription and per-scan revenue by offering 'Verified Entry' speed.</p>
        </div>
        <div className="flex-1 bg-white/5 p-6 rounded-xl">
          <h3 className="text-emerald-400 font-bold mb-3 text-lg">3. SECURE TALENT</h3>
          <p className="text-base text-white">Provide a verified environment for Performer Talent and Content Creators. Reduces the risk of set/venue shutdowns due to health incidents.</p>
        </div>
      </div>

      {/* Industry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-5 md:px-10 pb-20 max-w-7xl mx-auto">
        
        {/* Card 1: Nightlife & Events */}
        <div 
          className="rounded-2xl p-6 border border-white/10 flex flex-col justify-between min-h-[550px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <PartyPopper className="h-8 w-8 text-blue-200" />
              <h3 className="text-xl font-bold">Nightlife & Events</h3>
            </div>
            <p className="italic opacity-90 mb-4">"Monetize the Door. Verify the Vibe."</p>
          </div>

          <div className="space-y-3">
            {/* Tier 1 */}
            <div className="border border-slate-600 p-3 rounded-lg bg-black/40">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Promoter Tier (Up to 200 Scans)</span>
                <span className="text-blue-200 font-bold">$299/mo</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Overage billed at $2.00/scan.</p>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Clean Check - Nightlife Tier 1 (Promoter)" />
                <input type="hidden" name="a3" value="299.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                <input type="hidden" name="on0" value="Club Name" />
                <input type="text" name="os0" placeholder="Event/Club Name" required className="w-full px-2 py-1.5 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2.5 bg-blue-200 text-black font-bold rounded uppercase text-sm">
                  ACTIVATE TIER 1
                </button>
              </form>
            </div>

            {/* Tier 2 */}
            <div className="border border-slate-600 p-3 rounded-lg bg-black/40">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Club Tier (Up to 1,000 Scans)</span>
                <span className="text-blue-200 font-bold">$999/mo</span>
              </div>
              <p className="text-xs text-slate-400 mb-2">Overage billed at $1.00/scan.</p>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Clean Check - Nightlife Tier 2 (Club)" />
                <input type="hidden" name="a3" value="999.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                <input type="hidden" name="on0" value="Club Name" />
                <input type="text" name="os0" placeholder="Club Name" required className="w-full px-2 py-1.5 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2.5 bg-blue-200 text-black font-bold rounded uppercase text-sm">
                  ACTIVATE TIER 2
                </button>
              </form>
            </div>

            {/* Enterprise */}
            <a href="mailto:Steve@bigtexasroof.com?subject=Enterprise%20Nightlife%20Partnership" className="block">
              <button type="button" className="w-full py-3 bg-transparent text-blue-200 font-bold border border-blue-200 rounded uppercase text-sm">
                REQUEST MEGA-CLUB CONTRACT
              </button>
            </a>
          </div>
        </div>

        {/* Card 2: Talent & Content Creators */}
        <div 
          className="rounded-2xl p-6 border border-amber-500/50 flex flex-col justify-between min-h-[550px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1566415702213-94c3d828a2a7?auto=format&fit=crop&w=800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Video className="h-8 w-8 text-amber-400" />
              <h3 className="text-xl font-bold text-amber-400">Talent & Content Creators</h3>
            </div>
            <p className="italic opacity-90 mb-4">"The Industry Standard for Talent."</p>
            <ul className="space-y-2 text-sm">
              <li>✅ <strong>Get Booked:</strong> Verified safety for Club Bookings & Film Sets.</li>
              <li>✅ <strong>Digital Handshake:</strong> Auto-syncs status with your employer.</li>
              <li>✅ <strong>Auto-Renewal:</strong> Aligns with 60-day testing cycle.</li>
            </ul>
          </div>

          <div className="mt-4">
            <div className="text-4xl font-black text-amber-400 mb-1">$39.00</div>
            <div className="font-bold mb-4">Every 60 Days (Performer Pass)</div>
            
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
              <input type="hidden" name="cmd" value="_xclick-subscriptions" />
              <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
              <input type="hidden" name="item_name" value="Clean Check - Performer Compliance Pass" />
              <input type="hidden" name="a3" value="39.00" />
              <input type="hidden" name="p3" value="2" />
              <input type="hidden" name="t3" value="M" />
              <input type="hidden" name="src" value="1" />
              <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
              <input type="hidden" name="on0" value="Stage Name" />
              <input type="hidden" name="on1" value="Affiliation" />
              
              <input type="text" name="os0" placeholder="1. Professional Name" required className="w-full px-3 py-2 mb-3 rounded text-black" />
              <input type="text" name="os1" placeholder="2. Agency or Venue" required className="w-full px-3 py-2 mb-4 rounded text-black" />

              <button type="submit" className="w-full py-4 bg-amber-400 text-black font-extrabold rounded-lg uppercase">
                ACTIVATE TALENT PASS
              </button>
            </form>
          </div>
        </div>

        {/* Card 3: Workforce Management */}
        <div 
          className="rounded-2xl p-6 border border-white/10 flex flex-col justify-between min-h-[550px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-8 w-8 text-slate-400" />
              <h3 className="text-xl font-bold">Workforce Management</h3>
            </div>
            <p className="italic opacity-90 mb-4">"Connect your team. Monitor the data."</p>
            <p className="text-xs text-slate-400 uppercase font-bold mb-3">Select System Capacity</p>
          </div>

          <div className="space-y-2">
            {/* Tier 1 */}
            <div className="border border-slate-600 p-3 rounded-lg bg-black/40">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Small (1-50 Staff)</span>
                <span className="text-slate-400 font-bold">$399/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Clean Check - Workforce System (Tier 1: 1-50)" />
                <input type="hidden" name="a3" value="399.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-2 py-1 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-1.5 bg-slate-400 text-black font-bold rounded text-sm">
                  ACTIVATE TIER 1
                </button>
              </form>
            </div>

            {/* Tier 2 */}
            <div className="border border-slate-600 p-3 rounded-lg bg-black/40">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Mid-Size (50-150 Staff)</span>
                <span className="text-slate-400 font-bold">$699/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Clean Check - Workforce System (Tier 2: 50-150)" />
                <input type="hidden" name="a3" value="699.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-2 py-1 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-1.5 bg-slate-400 text-black font-bold rounded text-sm">
                  ACTIVATE TIER 2
                </button>
              </form>
            </div>

            {/* Tier 3 Enterprise */}
            <div className="border-2 border-amber-500 p-3 rounded-lg bg-black/60">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-amber-400">Enterprise (150-500 Staff)</span>
                <span className="text-amber-400 font-bold">$1,299/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Clean Check - Workforce System (Tier 3: 150-500)" />
                <input type="hidden" name="a3" value="1299.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-2 py-1 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-1.5 bg-amber-400 text-black font-bold rounded text-sm">
                  ACTIVATE TIER 3
                </button>
              </form>
            </div>

            {/* Bulk Kits */}
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="mt-2">
              <input type="hidden" name="cmd" value="_xclick" />
              <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
              <input type="hidden" name="item_name" value="Clean Check - Bulk Employee Kits (10pk)" />
              <input type="hidden" name="amount" value="890.00" />
              <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
              <button type="submit" className="w-full py-2.5 bg-slate-800 text-white font-bold border border-white rounded">
                ORDER 10-PACK ($890)
              </button>
            </form>
          </div>
        </div>

        {/* Card 4: Transportation & Fleets */}
        <div 
          className="rounded-2xl p-6 border border-white/10 flex flex-col justify-between min-h-[550px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Car className="h-8 w-8 text-emerald-400" />
              <h3 className="text-xl font-bold">Transportation & Fleets</h3>
            </div>
            <p className="italic opacity-90 mb-4">"Protect the asset. Continuous driver screening."</p>
            <hr className="border-white/20 my-4" />
            <p className="text-xs text-slate-400 uppercase font-bold mb-3">Fleet Licenses (Monthly)</p>
          </div>

          <div className="space-y-2">
            {/* Tier 1: Small Fleet */}
            <div className="border border-slate-600 p-3 rounded-lg bg-black/40">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Small Fleet (1-50 Cars)</span>
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
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-2 py-1.5 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2 bg-emerald-400 text-black font-bold rounded text-sm">
                  ACTIVATE TIER 1
                </button>
              </form>
            </div>

            {/* Tier 2: Mid Fleet */}
            <div className="border border-slate-600 p-3 rounded-lg bg-black/40">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Mid Fleet (50-200 Cars)</span>
                <span className="text-emerald-400 font-bold">$599/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Clean Check - Mid Fleet License (50-200)" />
                <input type="hidden" name="a3" value="599.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-2 py-1.5 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2 bg-emerald-400 text-black font-bold rounded text-sm">
                  ACTIVATE TIER 2
                </button>
              </form>
            </div>

            {/* Tier 3: Large Fleet (Gold) */}
            <div className="border-2 border-amber-500 p-3 rounded-lg bg-black/70">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm text-amber-400">Large Fleet (200+ Cars)</span>
                <span className="text-amber-400 font-bold">$999/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Clean Check - Large Fleet License (200+)" />
                <input type="hidden" name="a3" value="999.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-2 py-1.5 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2 bg-amber-400 text-black font-bold rounded text-sm">
                  ACTIVATE TIER 3
                </button>
              </form>
            </div>

            {/* Individual Driver */}
            <div className="border-t border-slate-600 pt-3 mt-3">
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">For Individual Drivers</p>
              <div className="text-xl font-bold mb-1">$119.00 <span className="text-sm font-normal text-slate-400">One-Time</span></div>
              <p className="text-xs text-slate-400 mb-3">Includes: Membership + <strong className="text-amber-400">14-Day QR Code</strong> + 1 Drug Test Kit.</p>
              
              <a 
                href="/toxicology-kit-order?type=driver"
                className="block w-full py-2.5 bg-slate-800 text-white font-bold border border-white rounded text-center"
              >
                BUY DRIVER PASS ($119)
              </a>
            </div>
          </div>
        </div>

        {/* Card 5: Exotic & Luxury Rentals */}
        <div 
          className="rounded-2xl p-6 border border-white/10 flex flex-col justify-between min-h-[550px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Key className="h-8 w-8 text-yellow-400" />
              <h3 className="text-xl font-bold">Exotic & Luxury Rentals</h3>
            </div>
            <p className="italic opacity-90 mb-4">"Protect the asset. Verify the driver."</p>
            <ul className="space-y-2 text-sm">
              <li>✅ <strong>Pre-Rental Screening:</strong> Verify driver sobriety before handoff.</li>
              <li>✅ <strong>Liability Documentation:</strong> Digital waiver and compliance trail.</li>
              <li>✅ <strong>Asset Protection:</strong> Reduce risk of DUI-related incidents.</li>
            </ul>
          </div>

          <div className="space-y-3 mt-4">
            {/* Small Rental Fleet */}
            <div className="border border-slate-600 p-3 rounded-lg bg-black/40">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Small Fleet (1-10 Vehicles)</span>
                <span className="text-yellow-400 font-bold">$199/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Clean Check - Exotic Rental (Small Fleet)" />
                <input type="hidden" name="a3" value="199.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-2 py-1.5 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2 bg-yellow-400 text-black font-bold rounded text-sm">
                  ACTIVATE SMALL FLEET
                </button>
              </form>
            </div>

            {/* Mid Rental Fleet */}
            <div className="border border-slate-600 p-3 rounded-lg bg-black/40">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-sm">Mid Fleet (10-50 Vehicles)</span>
                <span className="text-yellow-400 font-bold">$399/mo</span>
              </div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Clean Check - Exotic Rental (Mid Fleet)" />
                <input type="hidden" name="a3" value="399.00" />
                <input type="hidden" name="p3" value="1" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                <input type="hidden" name="on0" value="Company Name" />
                <input type="text" name="os0" placeholder="Company Name" required className="w-full px-2 py-1.5 mb-2 rounded text-black text-sm" />
                <button type="submit" className="w-full py-2 bg-yellow-400 text-black font-bold rounded text-sm">
                  ACTIVATE MID FLEET
                </button>
              </form>
            </div>

            {/* Enterprise Contact */}
            <a href="mailto:Steve@bigtexasroof.com?subject=Enterprise%20Exotic%20Rental%20Partnership" className="block">
              <button type="button" className="w-full py-3 bg-transparent text-yellow-400 font-bold border border-yellow-400 rounded uppercase text-sm">
                REQUEST ENTERPRISE PRICING
              </button>
            </a>
          </div>
        </div>

        {/* Card 6: Fintech & System Integration */}
        <div 
          className="rounded-2xl p-6 border border-violet-500/50 flex flex-col justify-between min-h-[550px]"
          style={{
            background: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url('https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-8 w-8 text-violet-400" />
              <h3 className="text-xl font-bold text-violet-400">Fintech & Integration</h3>
            </div>
            <p className="italic opacity-90 mb-4">"Plug into our ecosystem. Get paid instantly."</p>
            
            <div className="space-y-4">
              {/* Security Features */}
              <div className="bg-black/40 p-3 rounded-lg border border-violet-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-violet-400" />
                  <span className="font-bold text-sm text-violet-300">Bank-Grade Security</span>
                </div>
                <p className="text-xs text-slate-300">256-bit AES encryption, SOC 2 Type II compliant infrastructure, HIPAA/GDPR data handling, and PCI DSS payment processing.</p>
              </div>

              {/* QR Integration */}
              <div className="bg-black/40 p-3 rounded-lg border border-violet-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <QrCode className="h-5 w-5 text-violet-400" />
                  <span className="font-bold text-sm text-violet-300">QR Environment Integration</span>
                </div>
                <p className="text-xs text-slate-300">Seamlessly integrate your existing POS or venue system into our QR ecosystem. Accept scans, verify members, and track entry—all through your current workflow.</p>
              </div>

              {/* System Integration */}
              <div className="bg-black/40 p-3 rounded-lg border border-violet-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Plug className="h-5 w-5 text-violet-400" />
                  <span className="font-bold text-sm text-violet-300">Zero-Friction API</span>
                </div>
                <p className="text-xs text-slate-300">Our REST API connects your system to Clean Check in hours, not weeks. Real-time webhooks, batch processing, and full documentation included.</p>
              </div>

              {/* Instant Payments */}
              <div className="bg-black/40 p-3 rounded-lg border border-violet-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="h-5 w-5 text-violet-400" />
                  <span className="font-bold text-sm text-violet-300">Instant Payment Settlement</span>
                </div>
                <p className="text-xs text-slate-300">Get paid immediately through our integrated payment system. No waiting 30+ days—revenue hits your account the same day members transact.</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <a href="mailto:Steve@bigtexasroof.com?subject=Fintech%20Integration%20Inquiry" className="block">
              <button className="w-full py-4 bg-violet-500 text-white font-extrabold rounded-lg uppercase hover:bg-violet-400 transition-colors">
                REQUEST INTEGRATION SPECS
              </button>
            </a>
          </div>
        </div>

        {/* Card 7: Lab Access Portal */}
        <Link to="/partners" className="block">
          <div 
            className="rounded-2xl p-6 border border-sky-400/50 flex flex-col justify-between min-h-[550px] cursor-pointer hover:border-sky-400 hover:shadow-[0_0_30px_rgba(56,189,248,0.3)] transition-all duration-300"
            style={{
              background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url('https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FlaskConical className="h-8 w-8 text-sky-400" />
                <h3 className="text-xl font-bold text-sky-400">Lab Access Portal</h3>
              </div>
              <p className="italic opacity-90 mb-4">"Integrated Health Compliance for Affiliate Social Ecosystems."</p>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">✦</span>
                  <span><strong className="text-sky-300">High-Volume Client Access:</strong> Instantly tap into exclusive affiliate communities, guaranteeing <strong>consistent, mandated volume</strong> for Sexual Health and Toxicology testing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">✦</span>
                  <span><strong className="text-sky-300">Real-Time API Integration:</strong> Utilize our <strong>low-latency, FHIR-compatible API</strong> to securely and instantaneously power the member's Clean Check Status.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">✦</span>
                  <span><strong className="text-sky-300">Automated Compliance Reporting:</strong> The system automatically manages secure result sharing with Establishments, <strong>offloading complex HIPAA/GDPR compliance</strong> from your internal team.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">✦</span>
                  <span><strong className="text-sky-300">Zero-Friction Efficiency:</strong> Upload results using <strong>batch processing</strong> and barcode scanning, minimizing manual entry and ensuring <strong>zero delays</strong> in updating member status.</span>
                </li>
              </ul>
            </div>

            <div className="mt-4">
              <button className="w-full py-4 bg-sky-400 text-black font-extrabold rounded-lg uppercase">
                Access Lab Portal →
              </button>
            </div>
          </div>
        </Link>

      </div>

      {/* Strategic Partner CTA */}
      <div className="max-w-4xl mx-auto px-5 pb-20">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-amber-500/30 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Strategic Partner Program</h2>
          <p className="text-slate-400 mb-6">Connect venues, refer members, and earn recurring revenue. Join the Clean Check global network.</p>
          <Link to="/partner-application">
            <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 text-black font-extrabold rounded-lg uppercase">
              APPLY FOR PARTNERSHIP
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VenueCompliance;
