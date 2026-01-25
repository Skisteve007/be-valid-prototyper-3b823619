import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdoptionRunwayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdoptionRunwayModal: React.FC<AdoptionRunwayModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 bg-background border-cyan-500/30">
        <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-cyan-500/30 px-6 py-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-cyan-400">
              The Grillo AI Governance Adoption Runway
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-full px-6 pb-8">
          <div className="prose prose-invert max-w-none py-6 space-y-6">
            {/* Title Block */}
            <div className="text-center space-y-4 pb-8 border-b border-cyan-500/20">
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 tracking-wide">
                THE GRILLO AI GOVERNANCE ADOPTION RUNWAY
              </h1>
              <p className="text-lg italic text-muted-foreground">
                A Constitutional, Phased Framework for Practical AI Oversight
              </p>
              <p className="text-sm text-muted-foreground">January 23rd 2026</p>
              <p className="text-sm text-cyan-300/80">Companion Implementation Doctrine</p>
              <p className="text-sm text-muted-foreground">
                Derived from The Grillo AI Governance Standard (GAGS)
              </p>
              <p className="text-xs text-muted-foreground/70">
                The Grillo AI Governance Standard (GAGS) The First Mechanical Protocols for Autonomous AI
              </p>
            </div>

            {/* PREAMBLE */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-400 border-b border-cyan-500/20 pb-2">PREAMBLE</h2>
              <p className="text-foreground/90 leading-relaxed">
                We recognize that artificial intelligence systems are now being deployed in environments affecting commerce, public safety, civil rights, healthcare, finance, and national security.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                We further recognize that while comprehensive AI governance is necessary, immediate full adoption of complex frameworks may overwhelm institutions, businesses, and governments if not implemented responsibly.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                Therefore, this document establishes a phased adoption runway—allowing organizations to comply, mature, and scale AI governance over time without sacrificing safety, accountability, or innovation.
              </p>
              <p className="text-foreground/90 leading-relaxed font-medium">
                This runway preserves the full constitutional end-state while enabling practical, staged deployment.
              </p>
            </section>

            {/* ARTICLE I */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-400 border-b border-cyan-500/20 pb-2">
                ARTICLE I — TIERED ADOPTION PRINCIPLE
              </h2>
              <h3 className="text-lg font-bold text-foreground">Section 1.1 — Phased Compliance Doctrine</h3>
              <p className="text-foreground/90 leading-relaxed">
                AI governance shall be adopted through graduated tiers, each representing a meaningful increase in safety, accountability, and trust.
              </p>
              <ul className="list-disc list-inside text-foreground/90 space-y-1 ml-4">
                <li>No tier weakens the final standard.</li>
                <li>Each tier prepares organizations for the next.</li>
              </ul>
            </section>

            {/* ARTICLE II */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-400 border-b border-cyan-500/20 pb-2">
                ARTICLE II — TIER I
              </h2>
              <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
                <p className="font-bold text-cyan-300">Transparency & Human Authority</p>
                <p className="text-sm text-muted-foreground">Adoption Window: Immediate to 6 Months</p>
                <p className="text-sm text-muted-foreground">Applies To: All organizations using AI in decision support or automation</p>
              </div>

              <h3 className="text-lg font-bold text-foreground">Section 2.1 — Human Authority Requirement</h3>
              <p className="text-foreground/90 leading-relaxed">
                A human shall retain absolute authority to halt, override, or reverse any AI output.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                No justification shall be required to exercise this authority.
              </p>

              <h3 className="text-lg font-bold text-foreground">Section 2.2 — Disclosure Requirement</h3>
              <p className="text-foreground/90 leading-relaxed">
                Organizations shall disclose where AI is being used and for what purpose.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                AI systems shall not operate invisibly in decision pipelines.
              </p>

              <h3 className="text-lg font-bold text-foreground">Section 2.3 — Scope Definition</h3>
              <p className="text-foreground/90 leading-relaxed">
                Every AI system shall operate within a clearly defined scope:
              </p>
              <ul className="list-disc list-inside text-foreground/90 space-y-1 ml-4">
                <li>What it may do</li>
                <li>What it may not do</li>
                <li>When it must stop and escalate</li>
              </ul>

              <h3 className="text-lg font-bold text-foreground">Section 2.4 — Fail-Safe Default</h3>
              <p className="text-foreground/90 leading-relaxed">
                In conditions of uncertainty, AI systems shall default to inaction, not speculation.
              </p>
              <p className="text-foreground/90 leading-relaxed italic text-muted-foreground">
                <strong className="text-foreground">Intent:</strong> This tier ensures basic safety, public trust, and executive control without requiring architectural overhaul.
              </p>
            </section>

            {/* ARTICLE III */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-400 border-b border-cyan-500/20 pb-2">
                ARTICLE III — TIER II
              </h2>
              <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
                <p className="font-bold text-cyan-300">Auditability & Explainability</p>
                <p className="text-sm text-muted-foreground">Adoption Window: 6 to 12 Months</p>
                <p className="text-sm text-muted-foreground">Applies To: AI systems affecting money, rights, safety, or compliance</p>
              </div>

              <h3 className="text-lg font-bold text-foreground">Section 3.1 — Audit Trail Requirement</h3>
              <p className="text-foreground/90 leading-relaxed">
                AI inputs, outputs, overrides, and escalations shall be recorded.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                Records must be tamper-resistant and reviewable.
              </p>

              <h3 className="text-lg font-bold text-foreground">Section 3.2 — Explanation Requirement</h3>
              <p className="text-foreground/90 leading-relaxed">
                AI systems must be capable of explaining:
              </p>
              <ul className="list-disc list-inside text-foreground/90 space-y-1 ml-4">
                <li>Why a recommendation was made</li>
                <li>What data was relied upon</li>
                <li>What risks were identified</li>
              </ul>

              <h3 className="text-lg font-bold text-foreground">Section 3.3 — High-Stakes Safeguard</h3>
              <p className="text-foreground/90 leading-relaxed">
                No high-impact decision shall rely on a single AI model.
              </p>

              <h3 className="text-lg font-bold text-foreground">Section 3.4 — Truth Anchoring</h3>
              <p className="text-foreground/90 leading-relaxed">
                Factual outputs must be sourced or explicitly labeled as uncertain.
              </p>
              <p className="text-foreground/90 leading-relaxed italic text-muted-foreground">
                <strong className="text-foreground">Intent:</strong> This tier enables investigations, audits, legal review, and executive accountability.
              </p>
            </section>

            {/* ARTICLE IV */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-400 border-b border-cyan-500/20 pb-2">
                ARTICLE IV — TIER III
              </h2>
              <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
                <p className="font-bold text-cyan-300">Multi-Model Governance & Safety Controls</p>
                <p className="text-sm text-muted-foreground">Adoption Window: 12 to 18 Months</p>
                <p className="text-sm text-muted-foreground">Applies To: Semi-autonomous or autonomous AI systems</p>
              </div>

              <h3 className="text-lg font-bold text-foreground">Section 4.1 — Consensus Before Action</h3>
              <p className="text-foreground/90 leading-relaxed">
                Multiple independent AI systems must agree before execution of high-stakes actions.
              </p>

              <h3 className="text-lg font-bold text-foreground">Section 4.2 — Disagreement Resolution</h3>
              <p className="text-foreground/90 leading-relaxed">
                Model disagreement shall trigger refinement or human review.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                Systems shall never "average through" uncertainty.
              </p>

              <h3 className="text-lg font-bold text-foreground">Section 4.3 — Circuit Breakers</h3>
              <p className="text-foreground/90 leading-relaxed">
                Hard limits shall exist on:
              </p>
              <ul className="list-disc list-inside text-foreground/90 space-y-1 ml-4">
                <li>Execution time</li>
                <li>Cost</li>
                <li>Iterations</li>
                <li>Authority</li>
              </ul>

              <h3 className="text-lg font-bold text-foreground">Section 4.4 — Pre-Deployment Testing</h3>
              <p className="text-foreground/90 leading-relaxed">
                AI systems must survive adversarial testing before production use.
              </p>
              <p className="text-foreground/90 leading-relaxed italic text-muted-foreground">
                <strong className="text-foreground">Intent:</strong> This tier prevents runaway automation, silent failure, and compounding error.
              </p>
            </section>

            {/* ARTICLE V */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-400 border-b border-cyan-500/20 pb-2">
                ARTICLE V — TIER IV
              </h2>
              <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
                <p className="font-bold text-cyan-300">Dynamic Trust & Judicial Oversight</p>
                <p className="text-sm text-muted-foreground">Adoption Window: 18 to 24 Months</p>
                <p className="text-sm text-muted-foreground">Applies To: Critical infrastructure, public systems, national-scale AI</p>
              </div>

              <h3 className="text-lg font-bold text-foreground">Section 5.1 — Dynamic Trust Assignment</h3>
              <p className="text-foreground/90 leading-relaxed">
                AI systems shall earn influence based on demonstrated reliability.
              </p>

              <h3 className="text-lg font-bold text-foreground">Section 5.2 — Drift Disqualification</h3>
              <p className="text-foreground/90 leading-relaxed">
                An AI system that hallucinates, violates constraints, or drifts materially shall be removed from the decision process for that matter.
              </p>

              <h3 className="text-lg font-bold text-foreground">Section 5.3 — Judicial AI Function</h3>
              <p className="text-foreground/90 leading-relaxed">
                Designated arbiter systems may halt decisions on ethical or safety grounds.
              </p>

              <h3 className="text-lg font-bold text-foreground">Section 5.4 — Human on the Rail</h3>
              <p className="text-foreground/90 leading-relaxed">
                A human authority shall always exist above unresolved AI decisions.
              </p>
              <p className="text-foreground/90 leading-relaxed italic text-muted-foreground">
                <strong className="text-foreground">Intent:</strong> This tier establishes constitutional checks and balances inside AI itself.
              </p>
            </section>

            {/* ARTICLE VI */}
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-cyan-400 border-b border-cyan-500/20 pb-2">
                ARTICLE VI — TIER V
              </h2>
              <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
                <p className="font-bold text-cyan-300">Constitutional AI Infrastructure</p>
                <p className="text-sm text-muted-foreground">Adoption Window: 24 Months and Beyond</p>
                <p className="text-sm text-muted-foreground">Applies To: Long-term national and international governance</p>
              </div>

              <h3 className="text-lg font-bold text-foreground">Section 6.1 — Continuous Review</h3>
              <p className="text-foreground/90 leading-relaxed">
                AI governance frameworks shall undergo periodic review and revision.
              </p>

              <h3 className="text-lg font-bold text-foreground">Section 6.2 — Independent Oversight</h3>
              <p className="text-foreground/90 leading-relaxed">
                Compliance verification shall be conducted by independent inspectors.
              </p>

              <h3 className="text-lg font-bold text-foreground">Section 6.3 — Amendment Process</h3>
              <p className="text-foreground/90 leading-relaxed">
                Governance standards shall evolve through transparent, documented processes.
              </p>
              <p className="text-foreground/90 leading-relaxed italic text-muted-foreground">
                <strong className="text-foreground">Intent:</strong> This tier treats AI governance as critical infrastructure, comparable to aviation, finance, and public safety systems.
              </p>
            </section>

            {/* CLOSING STATEMENT */}
            <section className="space-y-4 pt-6 border-t border-cyan-500/20">
              <h2 className="text-xl font-bold text-cyan-400">CLOSING STATEMENT</h2>
              <p className="text-foreground/90 leading-relaxed">
                This adoption runway does not slow innovation.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                It prevents irreversible harm while allowing responsible growth.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                Organizations may adopt voluntarily, by mandate, or through certification.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                The final constitutional standard remains unchanged.
              </p>
              <p className="text-foreground/90 leading-relaxed font-medium">
                This framework simply ensures the path to it is understandable, achievable, and enforceable.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AdoptionRunwayModal;
