import { Wallet, Ghost, Shield } from 'lucide-react';

export const JoinFreePills = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-4">
      {/* Join for Free */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 backdrop-blur-sm">
        <span className="text-sm font-bold text-green-400">Join for Free</span>
      </div>
      
      {/* Valid Lifestyle Wallet */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 backdrop-blur-sm">
        <Wallet className="w-4 h-4 text-cyan-400" />
        <span className="text-sm font-medium text-cyan-300">VALID™ Lifestyle Wallet</span>
      </div>
      
      {/* Ghostpass Ecosystem */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 backdrop-blur-sm">
        <Ghost className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-purple-300">GhostPass Ecosystem</span>
      </div>
      
      {/* VALID governed by SYNTH */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 backdrop-blur-sm">
        <Shield className="w-4 h-4 text-amber-400" />
        <span className="text-sm font-medium text-amber-300">VALID™ governed by SYNTH™</span>
      </div>
    </div>
  );
};

export default JoinFreePills;
