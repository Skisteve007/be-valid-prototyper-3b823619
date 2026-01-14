import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, Terminal, Calculator, Users, FileText, 
  ArrowLeft, Lock, Zap, Target
} from "lucide-react";

// Module imports
import { SenateSimulator } from "@/components/sales-command/SenateSimulator";
import { DynamicPricingCalculator } from "@/components/sales-command/DynamicPricingCalculator";
import { GhostPassDemo } from "@/components/sales-command/GhostPassDemo";
import { BattleCards } from "@/components/sales-command/BattleCards";
import { CommandHeader } from "@/components/sales-command/CommandHeader";
import { BADGE_CONFIG, getBadgeDisplayName } from "@/config/badgeConfig";

// JSON-LD schema for AI Governance Badge
const badgeJsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": getBadgeDisplayName(),
  "provider": {
    "@type": "Organization",
    "name": BADGE_CONFIG.issuer,
    "url": "https://bevalid.app"
  },
  "description": "Public badge indicating adherence to Reasonable Care AI governance controls, including policy-to-code guardrails, human approvals, immutable audit, and zero-trust data handling.",
  "url": `https://bevalid.app${BADGE_CONFIG.guidelines_url}`
};

const SynthSalesCommandCenter = () => {
  const [activeTab, setActiveTab] = useState("education");

  return (
    <>
      <Helmet>
        <title>SYNTH Sales Command Center | Giant Ventures LLC</title>
        <meta name="robots" content="noindex, nofollow" />
        <script type="application/ld+json">
          {JSON.stringify(badgeJsonLd)}
        </script>
      </Helmet>
      
      <main className="min-h-screen bg-[#0a0a0f] text-foreground">
        {/* Background Grid Effect */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,255,255,0.03)_0%,_transparent_70%)]" />
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="relative z-10">
          {/* Navigation */}
          <div className="border-b border-cyan-500/20 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <Link 
                to="/admin" 
                className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-mono"
              >
                <ArrowLeft className="h-4 w-4" />
                RETURN TO BASE
              </Link>
              
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="border-red-500/50 text-red-400 font-mono text-xs animate-pulse">
                  <Lock className="h-3 w-3 mr-1" />
                  CLASSIFIED
                </Badge>
                <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 font-mono text-xs">
                  INTERNAL USE ONLY
                </Badge>
              </div>
            </div>
          </div>

          {/* Command Header */}
          <CommandHeader />

          {/* Main Content */}
          <div className="container mx-auto px-4 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full bg-black/40 border border-cyan-500/30 p-1 h-auto flex-wrap gap-1 mb-8">
                <TabsTrigger 
                  value="education" 
                  className="flex-1 min-w-[140px] data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono text-sm py-3"
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  EDUCATION HUB
                </TabsTrigger>
                <TabsTrigger 
                  value="pricing" 
                  className="flex-1 min-w-[140px] data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono text-sm py-3"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  PRICING ENGINE
                </TabsTrigger>
                <TabsTrigger 
                  value="ghost" 
                  className="flex-1 min-w-[140px] data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono text-sm py-3"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  GHOST PASS
                </TabsTrigger>
                <TabsTrigger 
                  value="battlecards" 
                  className="flex-1 min-w-[140px] data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 font-mono text-sm py-3"
                >
                  <Target className="h-4 w-4 mr-2" />
                  BATTLE CARDS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="education" className="mt-0">
                <SenateSimulator />
              </TabsContent>

              <TabsContent value="pricing" className="mt-0">
                <DynamicPricingCalculator />
              </TabsContent>

              <TabsContent value="ghost" className="mt-0">
                <GhostPassDemo />
              </TabsContent>

              <TabsContent value="battlecards" className="mt-0">
                <BattleCards />
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <footer className="border-t border-cyan-500/20 bg-black/60 py-6">
            <div className="container mx-auto px-4 text-center">
              <p className="text-cyan-400/60 font-mono text-xs">
                © 2026 Giant Ventures LLC • THE GRILLO AI GOVERNANCE STANDARD
              </p>
              <p className="text-cyan-400/40 font-mono text-[10px] mt-1">
                U.S. Provisional 63/958,297 • U.S. Provisional 63/948,868
              </p>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
};

export default SynthSalesCommandCenter;
