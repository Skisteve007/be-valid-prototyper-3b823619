import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Brain, Shield, Lock, Cpu, Network, Eye, Zap, Layers } from "lucide-react";

const AUTHORIZED_EMAILS = ["sgrillocce@gmail.com", "aeidigitalsolutions@gmail.com"];

const SynthVault = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/");
        return;
      }

      if (!AUTHORIZED_EMAILS.includes(user.email?.toLowerCase() || "")) {
        navigate("/");
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
          <p className="text-cyan-500/60 text-sm tracking-[0.3em] uppercase">Verifying Access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/20 via-transparent to-emerald-950/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 sm:py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 mb-6">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs tracking-[0.3em] text-cyan-400 uppercase">Classified • Founder Access Only</span>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-4">
            <span className="bg-gradient-to-r from-cyan-400 via-white to-emerald-400 bg-clip-text text-transparent">
              SYNTH™
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-400 tracking-wide">
            The Cognitive Trust Layer
          </p>
          <p className="text-sm text-gray-600 mt-4 tracking-[0.2em] uppercase">
            Architecture & Thesis Documentation
          </p>
        </div>

        {/* Core Vision Card */}
        <Card className="mb-8 border border-cyan-500/20 bg-black/60 backdrop-blur-xl shadow-[0_0_40px_rgba(0,240,255,0.1)]">
          <CardHeader className="border-b border-cyan-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
              <CardTitle className="text-2xl text-white">Core Vision</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              <span className="text-cyan-400 font-semibold">SYNTH™</span> represents the evolution from Valid™'s identity verification 
              into a fully autonomous <span className="text-emerald-400 font-semibold">Cognitive Trust Layer</span> — 
              an AI-native infrastructure that doesn't just verify identity, but <span className="text-white font-semibold">understands, predicts, and orchestrates trust</span> across 
              every digital and physical interaction.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                <Eye className="w-5 h-5 text-cyan-400 mb-2" />
                <p className="text-sm text-gray-400">From <span className="text-white">Verification</span> to <span className="text-cyan-400">Cognition</span></p>
              </div>
              <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                <Network className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-sm text-gray-400">From <span className="text-white">Transactions</span> to <span className="text-emerald-400">Relationships</span></p>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <Zap className="w-5 h-5 text-purple-400 mb-2" />
                <p className="text-sm text-gray-400">From <span className="text-white">Reactive</span> to <span className="text-purple-400">Predictive</span></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pillar 1 */}
          <Card className="border border-emerald-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <Shield className="w-5 h-5 text-emerald-400" />
                </div>
                <CardTitle className="text-lg text-white">Pillar 1: Trust Genome</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Every user develops a dynamic "Trust Genome" — a living, evolving representation of their 
                verified attributes, behavioral patterns, and network relationships.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Behavioral biometrics beyond static credentials
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Network trust propagation algorithms
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Zero-knowledge trust attestations
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pillar 2 */}
          <Card className="border border-cyan-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
                <CardTitle className="text-lg text-white">Pillar 2: Cognitive Inference Engine</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                AI-native decision layer that continuously evaluates trust contexts in real-time, 
                adapting verification requirements dynamically based on risk signals.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Context-aware trust scoring (location, time, behavior)
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Predictive fraud detection pre-transaction
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Self-healing trust recovery mechanisms
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pillar 3 */}
          <Card className="border border-purple-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <Layers className="w-5 h-5 text-purple-400" />
                </div>
                <CardTitle className="text-lg text-white">Pillar 3: Universal Trust Protocol</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Open standard for trust interoperability — enabling any platform, venue, or service 
                to query and contribute to the SYNTH trust network without exposing raw PII.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Cross-platform trust portability
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Federated trust consensus mechanism
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  Cryptographic trust proofs (no data exposure)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Pillar 4 */}
          <Card className="border border-amber-500/20 bg-black/60 backdrop-blur-xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <Network className="w-5 h-5 text-amber-400" />
                </div>
                <CardTitle className="text-lg text-white">Pillar 4: Trust Economy</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 text-sm mb-4">
                Monetization layer where trust becomes a tradeable, stakeable asset — users earn from 
                their trust contributions, platforms pay for trust consumption.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Trust staking for premium access tiers
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  Platform-to-platform trust API pricing
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  User trust dividend distributions
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Market Positioning */}
        <Card className="mb-8 border border-white/10 bg-black/60 backdrop-blur-xl">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-xl text-white">Strategic Positioning</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-cyan-400 font-semibold mb-3 tracking-wide uppercase text-sm">Valid™ → SYNTH™ Evolution</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Valid™ establishes the foundational infrastructure: identity verification, Ghost Pass™ monetization, 
                  venue integration, and the viral network effect. SYNTH™ builds upon this network to create an 
                  AI-powered trust intelligence layer that transcends simple verification.
                </p>
              </div>
              <div>
                <h4 className="text-emerald-400 font-semibold mb-3 tracking-wide uppercase text-sm">Competitive Moat</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  No competitor has the combination of: (1) Real-world venue network, (2) Health/identity data fusion, 
                  (3) FBO payment infrastructure, and (4) AI-native architecture. SYNTH™ turns this moat into an 
                  unassailable cognitive advantage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="border border-cyan-500/20 bg-black/60 backdrop-blur-xl">
          <CardHeader className="border-b border-cyan-500/10">
            <CardTitle className="text-xl text-white">Development Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-emerald-500 to-purple-500" />
              
              <div className="space-y-8 pl-12">
                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 rounded-full bg-cyan-500 border-4 border-[#030303]" />
                  <div className="text-sm text-cyan-400 font-semibold tracking-wide uppercase">Phase 1: Foundation (Now - Q4 2025)</div>
                  <p className="text-gray-400 text-sm mt-1">Valid™ network expansion, venue density, user acquisition, data foundation</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#030303]" />
                  <div className="text-sm text-emerald-400 font-semibold tracking-wide uppercase">Phase 2: Intelligence (2026)</div>
                  <p className="text-gray-400 text-sm mt-1">Trust Genome beta, Cognitive Inference Engine v1, behavioral analytics</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 rounded-full bg-purple-500 border-4 border-[#030303]" />
                  <div className="text-sm text-purple-400 font-semibold tracking-wide uppercase">Phase 3: Protocol (2027)</div>
                  <p className="text-gray-400 text-sm mt-1">Universal Trust Protocol launch, cross-platform integration, Trust Economy beta</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-10 w-4 h-4 rounded-full bg-amber-500 border-4 border-[#030303]" />
                  <div className="text-sm text-amber-400 font-semibold tracking-wide uppercase">Phase 4: Autonomy (2028+)</div>
                  <p className="text-gray-400 text-sm mt-1">Full SYNTH™ deployment, autonomous trust orchestration, global scale</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-white/5">
          <p className="text-gray-600 text-xs tracking-[0.3em] uppercase">
            Confidential • SYNTH™ Architecture Document v0.1
          </p>
          <p className="text-gray-700 text-xs mt-2">
            © 2025 Valid™ Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SynthVault;
