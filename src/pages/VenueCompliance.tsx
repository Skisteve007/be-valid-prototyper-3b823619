import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Sparkles, PartyPopper, Video, Building2, Car, Key } from "lucide-react";

const VenueCompliance = () => {
  return (
    <div 
      className="min-h-screen text-white font-sans"
      style={{
        background: 'radial-gradient(circle at 50% 25%, rgba(255, 255, 255, 0.5) 0%, rgba(244, 114, 182, 0.4) 20%, rgba(15, 23, 42, 0.9) 80%)',
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
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="border-slate-300 bg-slate-100 text-slate-900 hover:bg-white hover:text-black hover:border-slate-400 font-medium"
              asChild
            >
              <Link to="/">← Back to Home</Link>
            </Button>
            <Button 
              className="bg-gradient-to-r from-sky-600 to-sky-500 text-white border-0 hover:from-sky-500 hover:to-sky-400 font-medium"
              asChild
            >
              <Link to="/partners">🔬 Lab Access Portal</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="py-10 px-5">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-black mb-4 italic">Partner Solutions: Choose Your Industry</h1>
          <span className="inline-block px-5 py-1.5 rounded-full bg-sky-400/30 text-amber-400 font-semibold text-base md:text-lg border border-sky-400/40 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
            Automated compliance and risk management for high-liability sectors.
          </span>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="flex flex-col md:flex-row justify-center max-w-5xl mx-auto gap-5 px-5 mb-12">
        <div className="flex-1 bg-white/5 p-5 rounded-lg">
          <h3 className="text-emerald-400 font-bold mb-2">1. LIABILITY SHIELD</h3>
          <p className="text-sm text-slate-300">Outsource compliance tracking. We provide the mandatory digital waiver and audit trail, moving medical liability away from your venue.</p>
        </div>
        <div className="flex-1 bg-white/5 p-5 rounded-lg">
          <h3 className="text-yellow-400 font-bold mb-2">2. MONETIZE ACCESS</h3>
          <p className="text-sm text-slate-300">Transform the security checkpoint into a profit center. Collect subscription and per-scan revenue by offering 'Verified Entry' speed.</p>
        </div>
        <div className="flex-1 bg-white/5 p-5 rounded-lg">
          <h3 className="text-blue-200 font-bold mb-2">3. SECURE TALENT</h3>
          <p className="text-sm text-slate-300">Provide a verified environment for Performer Talent and Content Creators. Reduces the risk of set/venue shutdowns due to health incidents.</p>
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
              <p className="text-xs text-slate-400 mb-3">Includes: Membership + QR Code + 1 Drug Test Kit.</p>
              
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                <input type="hidden" name="cmd" value="_xclick" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Clean Check - Driver Verification Pass" />
                <input type="hidden" name="amount" value="119.00" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success" />
                <button type="submit" className="w-full py-2.5 bg-slate-800 text-white font-bold border border-white rounded">
                  BUY DRIVER PASS ($119)
                </button>
              </form>
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
