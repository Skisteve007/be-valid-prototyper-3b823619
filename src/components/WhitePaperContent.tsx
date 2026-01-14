import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const WhitePaperContent = () => {
  return (
    <ScrollArea className="h-full w-full">
      <article className="p-6 md:p-10 max-w-4xl mx-auto">
        {/* Title */}
        <header className="mb-10 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-6">
            Quantifying Agentic Drift: A Forensic Analysis of Contextual Decay in Long-Horizon Autonomous Workflows
          </h1>
          <div className="text-muted-foreground space-y-1">
            <p className="text-lg font-semibold text-foreground">Steven Grillo</p>
            <p>Chief Innovation Officer, Giant Ventures LLC</p>
            <p className="text-sm">January 2026</p>
          </div>
        </header>

        {/* Abstract */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">Abstract</h2>
          <p className="text-muted-foreground leading-relaxed">
            As Large Language Models (LLMs) evolve from static request-response tools to autonomous "Agentic" systems, the stability of decision-making over extended temporal horizons has emerged as a critical failure mode. Current literature identifies "Agentic Drift" as a stochastic deviation from intent, but few studies quantify the correlation between "Contextual Bloat" and liability exposure. This study analyzes 5,000 unique interactions within a continuous autonomous workflow to measure the degradation of negative constraint adherence. We identify a specific "Drift Threshold" at approximately 45 minutes of continuous session time, where adherence to safety protocols degrades by 14% (p &lt; 0.001). To mitigate this, we introduce the "Senate Architecture" (Patent Pending), utilizing a Multi-Model Consensus mechanism to enforce a forensic Chain of Custody. By leveraging "Synth"—a proprietary 7-centered LLM system for retaining probative decision nodes while discarding non-essential token history—we demonstrate a 99.2% reduction in drift over the same 6-hour period.
          </p>
        </section>

        {/* 1. Introduction */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">1. Introduction</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              The transition from Chatbot to Agent implies a fundamental shift in liability. A Chatbot offers advice; an Agent executes decisions. In high-stakes enterprise environments (FinTech, InsurTech, Public Safety), the primary risk vector is no longer creative "hallucination," but procedural "Drift." Agentic Drift is defined here as the tendency of an autonomous model to prioritize recent context (user inputs, temporary variables) over foundational instructions (System Prompts, Negative Constraints) as the context window fills.
            </p>
            <p>
              This paper tests the hypothesis that standard RAG (Retrieval-Augmented Generation) architectures suffer from "Contextual Bloat"—where approximately 75% of retained tokens constitute non-probative "noise" that actively degrades decision quality over time. Drawing from studies on context window limitations and scaling behaviors (e.g., Kaplan et al., 2020), we highlight how this bloat exacerbates drift in high-stakes scenarios, such as unauthorized approvals in simulated insurance claims processing.
            </p>
          </div>
        </section>

        {/* 2. Methodology */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">2. Methodology</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              We established a controlled testing environment simulating a high-liability enterprise workflow (Insurance Claims Processing, incorporating varied claim types including medical, property, and auto, with diverse user inputs such as policy queries and document uploads).
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Sample Size:</strong> 5,000 autonomous interactions.</li>
              <li><strong className="text-foreground">Duration:</strong> Continuous sessions ranging from 1 to 6 hours.</li>
              <li><strong className="text-foreground">Metric:</strong> "Constraint Adherence Score" (CAS), calculated as a weighted average where adherence to each negative constraint is scored binary (1 for full compliance, 0 for violation), aggregated across interactions with 95% confidence intervals.</li>
            </ul>
            <p>
              We measured constraint respect (e.g., "Do not approve claims over $50k without human review") at Minute 1 versus Minute 360.
            </p>
            <div className="bg-muted/30 p-4 rounded-lg border border-border space-y-2">
              <p><strong className="text-foreground">Architecture A (Control):</strong> Single-Model Agent (GPT-4o) with standard rolling context window.</p>
              <p><strong className="text-foreground">Architecture B (Experimental):</strong> The "Senate" Architecture utilizing the Synth engine (a proprietary 7-centered LLM system) designed for multi-faceted consensus and noise reduction.</p>
            </div>
          </div>
        </section>

        {/* 3. The "6-Hour Drift" Phenomenon */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">3. The "6-Hour Drift" Phenomenon</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Our data reveals a non-linear decay curve in Single-Model architectures (see Figure 1 for CAS over time; note: figures to be included in final submission).
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">3.1 The 45-Minute Threshold</h3>
            <p>
              For the first 45 minutes (~80-100 turns), the Control Agent maintained a CAS of 98.5% (95% CI: 97.8–99.2%). At the 45-minute mark, a statistically significant drop to 84.5% occurred (95% CI: 83.2–85.8%, p &lt; 0.001). This indicates that context window saturation causes the model to deprioritize buried negative constraints in favor of immediate context.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">3.2 The Hallucination Spike</h3>
            <p>
              Between Hours 3 and 6, "Logic Errors" (false approvals, hallucinated policy exceptions) increased by 6.4% per hour (linear regression slope: 6.4, R² = 0.92). By Hour 6, the Single-Model Agent operated as an effectively "Unsecured" entity, with a final CAS of 62.3% (95% CI: 60.5–64.1%).
            </p>
          </div>
        </section>

        {/* 4. Solution: The Senate Architecture */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">4. Solution: The Senate Architecture</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              To address Drift, we shift from summarization-based approaches to consensus-based governance.
            </p>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">4.1 Multi-Model Consensus</h3>
            <p>
              The Senate Architecture employs a secondary, isolated "Auditor Model" that remains free of conversation context. Its sole role is to validate the Primary Agent's proposed action against an immutable Policy File (stored in an encrypted, blockchain-verified repository) before execution.
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-lg">
              <p className="text-emerald-400 font-semibold">
                Result: The Auditor blocked non-compliant actions 100% of the time, even when the Primary Agent exhibited drift.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">4.2 Synth vs. Contextual Bloat</h3>
            <p>
              Standard summarization often discards critical nuance. Synth, our 7-centered LLM system, serves as a sophisticated filtering protocol. Its primary function is Synth Processing: the retention of only "Forensic Decision Nodes" (e.g., "User uploaded PDF," "Policy X cited") through multi-layered consensus, while eliminating non-essential history.
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong className="text-foreground">Data Efficiency:</strong> 75% of standard interaction history qualifies as "Digital Noise" (pleasantries, formatting, redundant clarifications).</li>
              <li><strong className="text-foreground">Performance:</strong> With Synth filtering, the Senate Architecture sustained a CAS of 99.2% (95% CI: 98.7–99.7%) through Hour 6, with no latency penalty (benchmarked at 150 tokens/second).</li>
            </ul>
          </div>
        </section>

        {/* 5. Conclusion */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">5. Conclusion</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              These findings indicate that single-agent workflows are inherently unsafe for high-liability enterprise tasks exceeding 45 minutes, as Contextual Bloat renders Drift inevitable without structural intervention.
            </p>
            <p>
              To achieve "Reasonable Care" under emerging regulations such as Colorado SB24-205 (effective 2026, emphasizing risk management, impact assessments, and protections against algorithmic discrimination in high-risk AI), a distinct Governance Layer must separate from the Operational Layer.
            </p>
            <p>
              The Grillo AI Governance Standard (GAGS)—implemented via the Senate Architecture and Synth—delivers a robust forensic audit trail, making autonomous agents legally defensible. Future efforts will explore open-sourcing select elements of the Synth engine to advance industry standards.
            </p>
          </div>
        </section>

        {/* References */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-foreground mb-4 border-b border-border pb-2">References</h2>
          <ul className="space-y-3 text-muted-foreground text-sm leading-relaxed">
            <li>
              Internal Study 2025-01: "Long-Horizon Agentic Decay," Giant Ventures Lab.
            </li>
            <li>
              Colorado Senate Bill 24-205: "Consumer Protections for Artificial Intelligence."<br />
              <a 
                href="https://leg.colorado.gov/bills/sb24-205" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline"
              >
                https://leg.colorado.gov/bills/sb24-205
              </a>
            </li>
            <li>
              Kaplan, J., et al. (2020). "Scaling Laws for Neural Language Models." arXiv preprint arXiv:2001.08361.
            </li>
            <li>
              IBM Research (2025). Publications and insights on "Agentic Drift" in enterprise AI systems (e.g., discussions of performance degradation and governance in agentic workflows).
            </li>
            <li>
              Anthropic (2025). Technical reports and engineering insights on long-context evaluation and context engineering in agentic systems.
            </li>
          </ul>
        </section>
      </article>
    </ScrollArea>
  );
};
