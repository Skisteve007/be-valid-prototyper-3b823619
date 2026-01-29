import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldAlert, Target, CheckCircle, FileText, ArrowRight, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface RiskStabilizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RiskStabilizationModal = ({ isOpen, onClose }: RiskStabilizationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-8">
            <DialogHeader className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30">
                  <ShieldAlert className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <DialogTitle className="text-2xl md:text-3xl font-orbitron text-foreground">
                    AI & Operational Risk Stabilization
                  </DialogTitle>
                  <p className="text-lg text-red-400 font-semibold">30-Day Engagement</p>
                </div>
              </div>
            </DialogHeader>

            {/* Who This Is For */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-red-400" />
                Who This Is For
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Organizations deploying AI, automation, or complex workflows in regulated or high-liability 
                environments that feel exposed, inefficient, or out of control — but cannot afford failure, 
                regulatory blowback, or public mistakes.
              </p>
            </section>

            {/* The Problem I Solve */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-3">The Problem I Solve</h3>
              <p className="text-muted-foreground mb-4">
                Most AI and automated systems fail not because of the model, but because of:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Poor decision controls
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  No auditability
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Undefined failure boundaries
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  Unclear accountability
                </li>
              </ul>
              <p className="text-red-400/90 mt-4 font-medium">
                This creates legal, regulatory, financial, and reputational risk.
              </p>
            </section>

            {/* What I Do */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-400" />
                What I Do (30 Days)
              </h3>
              <p className="text-muted-foreground mb-4">In a focused 30-day engagement, I:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                  Map your real operational and liability risk
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                  Identify where automation helps vs. hurts
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                  Design deterministic guardrails and decision boundaries
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                  Install audit-ready workflows (logging, traceability, approvals)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-red-400 mt-1 flex-shrink-0" />
                  Deliver a clear control blueprint your team can operate
                </li>
              </ul>
            </section>

            {/* What You Get */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-400" />
                What You Get
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-sm text-foreground">Risk & failure-mode assessment</p>
                  <p className="text-xs text-muted-foreground">(plain English, exec-ready)</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-sm text-foreground">Governance-by-design architecture</p>
                  <p className="text-xs text-muted-foreground">(not theory)</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-sm text-foreground">Control plane & audit strategy</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border/50">
                  <p className="text-sm text-foreground">Practical remediation roadmap</p>
                </div>
                <div className="p-3 rounded-lg bg-background/50 border border-border/50 md:col-span-2">
                  <p className="text-sm text-foreground">Optional hands-on implementation support</p>
                </div>
              </div>
            </section>

            {/* How This Is Different */}
            <section className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <h3 className="text-lg font-bold text-foreground mb-3">How This Is Different</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">→</span>
                  Built by someone with real litigation and claims exposure
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">→</span>
                  Designed to survive audits, disputes, and regulators
                </li>
              </ul>
            </section>

            {/* Engagement Structure */}
            <section className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-red-400" />
                Engagement Structure
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-lg bg-background/50 border border-border/50 text-center">
                  <p className="text-xl font-bold text-foreground">30</p>
                  <p className="text-xs text-muted-foreground">Day Engagement</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/50 text-center">
                  <p className="text-xl font-bold text-red-400">$25k</p>
                  <p className="text-xs text-muted-foreground">Flat Fee</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/50 text-center">
                  <p className="text-sm font-bold text-foreground">Remote</p>
                  <p className="text-xs text-muted-foreground">/ Hybrid</p>
                </div>
                <div className="p-4 rounded-lg bg-background/50 border border-border/50 text-center">
                  <p className="text-sm font-bold text-foreground">Extensions</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </section>

            {/* Closing Statement */}
            <div className="text-center mb-6 p-4 border-t border-border/50">
              <p className="text-lg font-semibold text-foreground italic">
                I don't sell AI. I stabilize systems where mistakes matter.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                <Link to="/demos">
                  Request Consultation
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Close
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RiskStabilizationModal;
