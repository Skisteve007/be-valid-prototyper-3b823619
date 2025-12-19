import { 
  Users, 
  Building2, 
  Zap, 
  Ghost, 
  CreditCard, 
  Fingerprint, 
  Activity,
  Layers,
  DollarSign,
  Wallet,
  BadgeCheck,
  Receipt
} from "lucide-react";

const RevenueModelSection = () => {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/40 mb-4">
          <DollarSign className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-bold tracking-wide uppercase text-sm">Revenue Model</span>
        </div>
        <h2 
          className="font-bold font-orbitron text-white"
          style={{ 
            fontSize: 'clamp(24px, 2.2vw, 38px)',
            textShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
          }}
        >
          How Ghostware™ Makes Money
        </h2>
        <p className="text-white/70 mt-2" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>
          Multiple revenue streams—each tied to verified usage.
        </p>
      </div>

      {/* === BUCKET 1: MEMBER REVENUE (B2C) === */}
      <div className="bg-gradient-to-br from-amber-950/40 to-black/60 border border-amber-500/30 rounded-2xl overflow-hidden">
        <div className="bg-amber-500/20 border-b border-amber-500/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-bold text-amber-400 text-lg">BUCKET 1 — MEMBER REVENUE</h3>
              <p className="text-amber-400/70 text-sm">B2C (Consumer pays)</p>
            </div>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-4">
          {/* Member Subscriptions */}
          <div className="bg-black/40 border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Wallet className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-white">Member Subscription</h4>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Basic</span>
                <span className="text-amber-400 font-bold">$10/month</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Pro</span>
                <span className="text-amber-400 font-bold">$20/month</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Elite</span>
                <span className="text-amber-400 font-bold">$50/month</span>
              </div>
            </div>
            <p className="text-white/60 text-xs">
              Includes: Ghostware™ Pass, wallet features, faster entry, premium verification benefits
            </p>
          </div>

          {/* Ghost Passes */}
          <div className="bg-black/40 border border-amber-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Ghost className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-white">GHOST™ Passes</h4>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Single Event Pass</span>
                <span className="text-amber-400 font-bold">$19–$49/event</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Weekend Pass</span>
                <span className="text-amber-400 font-bold">$39–$79/weekend</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Intro Pass (60 days)</span>
                <span className="text-amber-400 font-bold">$19</span>
              </div>
            </div>
            <p className="text-white/60 text-xs">
              One-time verification passes for events or time-limited access
            </p>
          </div>
        </div>
      </div>

      {/* === BUCKET 2: VENUE REVENUE (B2B) === */}
      <div className="bg-gradient-to-br from-purple-950/40 to-black/60 border border-purple-500/30 rounded-2xl overflow-hidden">
        <div className="bg-purple-500/20 border-b border-purple-500/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="font-bold text-purple-400 text-lg">BUCKET 2 — VENUE REVENUE</h3>
              <p className="text-purple-400/70 text-sm">B2B (Venue pays)</p>
            </div>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-4">
          {/* Venue Licensing */}
          <div className="bg-black/40 border border-purple-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <BadgeCheck className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-white">Venue Licensing</h4>
              <span className="text-xs text-white/50">(monthly)</span>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Starter</span>
                <span className="text-purple-400 font-bold">$99–$299/mo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Pro</span>
                <span className="text-purple-400 font-bold">$499–$1,500/mo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Enterprise</span>
                <span className="text-purple-400 font-bold">$2,500–$7,500/mo</span>
              </div>
            </div>
            <p className="text-white/60 text-xs">
              Tiered by venue size, scan volume, and feature access
            </p>
          </div>

          {/* Per Terminal Fees */}
          <div className="bg-black/40 border border-purple-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Layers className="w-5 h-5 text-purple-400" />
              <h4 className="font-bold text-white">Per Terminal Fee</h4>
              <span className="text-xs text-white/50">(optional)</span>
            </div>
            <div className="space-y-2 mb-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">Door Device</span>
                <span className="text-purple-400 font-bold">$29–$79/device/mo</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/70">POS Terminal</span>
                <span className="text-purple-400 font-bold">$19–$49/terminal/mo</span>
              </div>
            </div>
            <p className="text-white/60 text-xs">
              Additional devices beyond base license allocation
            </p>
          </div>
        </div>
      </div>

      {/* === BUCKET 3: USAGE / NETWORK REVENUE === */}
      <div className="bg-gradient-to-br from-cyan-950/40 to-black/60 border border-cyan-500/30 rounded-2xl overflow-hidden">
        <div className="bg-cyan-500/20 border-b border-cyan-500/30 px-6 py-4">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="font-bold text-cyan-400 text-lg">BUCKET 3 — USAGE / NETWORK REVENUE</h3>
              <p className="text-cyan-400/70 text-sm">Per-action fees (scales with usage)</p>
            </div>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Verification Fees */}
          <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Fingerprint className="w-5 h-5 text-cyan-400" />
              <h4 className="font-bold text-white">Verification Fees</h4>
            </div>
            <div className="text-2xl font-bold text-cyan-400 mb-2">$0.05–$0.50</div>
            <p className="text-white/70 text-sm mb-2">per scan</p>
            <p className="text-white/50 text-xs">
              Priced by volume and risk tier. High-volume venues pay less per scan.
            </p>
          </div>

          {/* Transaction Fees */}
          <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              <h4 className="font-bold text-white">Transaction Fees</h4>
            </div>
            <div className="text-2xl font-bold text-cyan-400 mb-2">1.5%</div>
            <p className="text-white/70 text-sm mb-2">on eligible payment volume</p>
            <p className="text-white/50 text-xs">
              Platform take-rate on wallet-based payments processed through Ghostware™
            </p>
          </div>

          {/* Health/Lab Margins */}
          <div className="bg-black/40 border border-cyan-500/20 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <Activity className="w-5 h-5 text-cyan-400" />
              <h4 className="font-bold text-white">Health / Lab Services</h4>
            </div>
            <div className="text-2xl font-bold text-cyan-400 mb-2">40–60%</div>
            <p className="text-white/70 text-sm mb-2">gross margin</p>
            <p className="text-white/50 text-xs">
              On eligible health verification and toxicology services
            </p>
          </div>
        </div>
      </div>

      {/* === COMMUNITY POOL (Mechanism, Not Direct Revenue) === */}
      <div className="bg-gradient-to-br from-green-950/30 to-black/40 border border-green-500/20 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-green-500/20 border border-green-500/30 flex-shrink-0">
            <Receipt className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h4 className="font-bold text-green-400 mb-1">Community Pool (Weekly Distribution)</h4>
            <p className="text-white/70 text-sm mb-2">
              30% of each GHOST™ Pass purchase is deposited into a shared pool, distributed weekly to participating venues based on verified check-ins.
            </p>
            <p className="text-white/50 text-xs">
              <span className="text-green-400/80">Note:</span> This is a revenue-sharing mechanism, not counted as direct platform revenue.
            </p>
          </div>
        </div>
      </div>

      {/* === GAS FEES (Pass-through, NOT Revenue) === */}
      <div className="bg-black/40 border border-white/10 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-white/10 border border-white/20 flex-shrink-0">
            <Zap className="w-5 h-5 text-white/60" />
          </div>
          <div>
            <h4 className="font-bold text-white/80 mb-1">Network Gas Fees (Pass-through)</h4>
            <p className="text-white/60 text-sm mb-2">
              $0.05–$0.50 per verification depending on network congestion and verification complexity.
            </p>
            <p className="text-white/40 text-xs">
              <span className="text-amber-400/80">Note:</span> Gas fees are operational costs passed through to venues, not platform revenue. Often subsidized for high-volume partners.
            </p>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="text-center pt-4">
        <p className="text-white/70" style={{ fontSize: 'clamp(14px, 1.1vw, 18px)' }}>
          <span className="text-green-400 font-bold">Revenue grouped by who pays:</span>{" "}
          Member (B2C) • Venue (B2B) • Usage (per action)
        </p>
        <p className="text-white/50 text-sm mt-2">
          Clear units. No ambiguity. Each stream compounds the next.
        </p>
      </div>
    </div>
  );
};

export default RevenueModelSection;
