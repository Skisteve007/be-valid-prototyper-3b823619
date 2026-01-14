import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Terminal, Target, Calculator, Shield, Users, BookOpen, 
  ExternalLink, Zap, FileText, ChevronRight
} from "lucide-react";
import SalesTeamTab from "./admin/SalesTeamTab";
import { SalesBattlecardsTab } from "./admin/SalesBattlecardsTab";
import { SalesManualTab } from "./admin/SalesManualTab";

interface StrategicDevelopmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function StrategicDevelopmentDialog({ open, onOpenChange }: StrategicDevelopmentDialogProps) {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("command-center");

  const handleNavigate = (path: string) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <Terminal className="h-7 w-7 text-primary" />
            Strategic Development Hub
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Hero Card - Sales Command Center Launch */}
          <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-cyan-500/30 overflow-hidden relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,255,255,0.1)_0%,_transparent_50%)]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '30px 30px'
            }} />
            
            <CardContent className="relative p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                      <Terminal className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white font-mono tracking-tight">
                        SYNTH™ SALES COMMAND CENTER
                      </h2>
                      <p className="text-cyan-400/80 text-xs font-mono">
                        THE GRILLO AI GOVERNANCE STANDARD
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm max-w-xl">
                    Interactive demos, dynamic pricing calculator, and battle-tested scripts for closing 
                    enterprise deals from $5K Pilots to $5M+ Licenses.
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 font-mono text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      SENATE SIMULATOR
                    </Badge>
                    <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 font-mono text-xs">
                      <Calculator className="h-3 w-3 mr-1" />
                      PRICING ENGINE
                    </Badge>
                    <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 font-mono text-xs">
                      <Target className="h-3 w-3 mr-1" />
                      BATTLE CARDS
                    </Badge>
                  </div>
                </div>
                
                <Button 
                  size="lg"
                  onClick={() => handleNavigate("/admin/sales-command")}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold h-12 px-6 text-base shadow-[0_0_30px_rgba(0,255,255,0.3)] hover:shadow-[0_0_40px_rgba(0,255,255,0.5)] transition-all group"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  LAUNCH COMMAND CENTER
                  <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="border-primary/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-primary">6</div>
                <div className="text-xs text-muted-foreground">Pricing Tiers</div>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-primary">4</div>
                <div className="text-xs text-muted-foreground">Demo Modules</div>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-primary">2</div>
                <div className="text-xs text-muted-foreground">Patents</div>
              </CardContent>
            </Card>
            <Card className="border-primary/20">
              <CardContent className="p-3 text-center">
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-xs text-muted-foreground">Moat Depth</div>
              </CardContent>
            </Card>
          </div>

          {/* Sub-tabs for Sales Resources */}
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="w-full grid grid-cols-3 h-auto p-1">
              <TabsTrigger value="command-center" className="py-2 text-sm">
                <Terminal className="h-4 w-4 mr-2" />
                Quick Access
              </TabsTrigger>
              <TabsTrigger value="team" className="py-2 text-sm">
                <Users className="h-4 w-4 mr-2" />
                Sales Team
              </TabsTrigger>
              <TabsTrigger value="manual" className="py-2 text-sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Sales Manual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="command-center" className="mt-4 space-y-4">
              {/* Quick Access Cards */}
              <div className="grid md:grid-cols-2 gap-3">
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => handleNavigate("/admin/sales-command")}>
                  <CardHeader className="p-4">
                    <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary transition-colors">
                      <Shield className="h-4 w-4" />
                      Senate Simulator
                      <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Visual demo of 7-AI voting with Hardware Gate veto
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => handleNavigate("/admin/sales-command")}>
                  <CardHeader className="p-4">
                    <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary transition-colors">
                      <Calculator className="h-4 w-4" />
                      Pricing Engine
                      <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Per-user pricing with transparent overages
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => handleNavigate("/admin/sales-command")}>
                  <CardHeader className="p-4">
                    <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary transition-colors">
                      <Zap className="h-4 w-4" />
                      Ghost Pass Demo
                      <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    <CardDescription className="text-sm">
                      QR Scan → Senate Check → Zero-Persistence
                    </CardDescription>
                  </CardHeader>
                </Card>
                
                <Card className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => handleNavigate("/admin/sales-command")}>
                  <CardHeader className="p-4">
                    <CardTitle className="flex items-center gap-2 text-base group-hover:text-primary transition-colors">
                      <Target className="h-4 w-4" />
                      Battle Cards
                      <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Scripts for Attorney, Vendor, and CISO targets
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              {/* Battlecards Quick Reference */}
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4" />
                    Sales Battlecards Reference
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <SalesBattlecardsTab />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="mt-4">
              <SalesTeamTab />
            </TabsContent>

            <TabsContent value="manual" className="mt-4">
              <SalesManualTab />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
