import { useState } from "react";
import { PrintButton, LastUpdated, PrintableSection, PrintableHeading, QualityGateChecklist, BrandedHeader, LegalFooter } from "../PrintStyles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQ {
  question: string;
  shortAnswer: string;
  longerAnswer: string[];
  safeWording: string;
}

interface PersonaFAQs {
  persona: string;
  description: string;
  faqs: FAQ[];
}

const personaData: PersonaFAQs[] = [
  {
    persona: "CIO / CTO",
    description: "Technical leadership focused on architecture, integration, and reliability",
    faqs: [
      { question: "What do you actually deploy?", shortAnswer: "A governance and verification layer that sits alongside your existing AI and access systems.", longerAnswer: ["API-first architecture", "Configuration-driven behavior", "Optional private deployment support"], safeWording: "We deploy a governance layer that integrates with your existing stack." },
      { question: "How does this integrate with existing systems?", shortAnswer: "Via APIs. We complement, not replace.", longerAnswer: ["RESTful APIs for integration", "Works alongside existing IAM, CRM, and AI tools", "Configuration for your business rules"], safeWording: "We're designed to complement your current systems, not replace them." },
      { question: "What are the infrastructure requirements?", shortAnswer: "Standard cloud infrastructure. Details vary by deployment model.", longerAnswer: ["Cloud-native architecture", "Scales with demand", "Private deployment options available"], safeWording: "We can discuss specific requirements based on your environment." },
      { question: "How do you handle scaling and reliability?", shortAnswer: "Built for high-volume operations with fail-safe modes.", longerAnswer: ["Horizontal scaling", "Redundancy built in", "Graceful degradation under load"], safeWording: "We're built for enterprise scale with reliability as a core requirement." },
      { question: "How do you handle outages?", shortAnswer: "Fail-safe modes that degrade gracefully or fail closed depending on risk.", longerAnswer: ["Monitoring and alerting", "Automatic failover where possible", "Clear escalation paths"], safeWording: "We have fail-safe modes designed to protect you during outages." },
      { question: "What data do you store?", shortAnswer: "We minimize storage. We prefer verification signals over raw data.", longerAnswer: ["Audit logs for compliance", "Configurable retention", "Privacy-first approach"], safeWording: "We store what's needed for audit trails, minimizing sensitive data." },
      { question: "What does rollout look like?", shortAnswer: "30–45 days from kickoff to go-live, depending on your inputs.", longerAnswer: ["Kickoff and requirements gathering", "Configuration and integration", "Testing and validation", "Go-live and monitoring"], safeWording: "Typical rollout is 30–45 days after receiving your requirements." },
      { question: "How do you measure success?", shortAnswer: "Metrics you define: fraud reduction, verification speed, audit readiness.", longerAnswer: ["Custom success criteria", "Reporting and dashboards", "Regular review cycles"], safeWording: "We'll define success metrics together during onboarding." }
    ]
  },
  {
    persona: "CISO / Security",
    description: "Security leadership focused on risk, access control, and incident response",
    faqs: [
      { question: "How does this reduce security risk?", shortAnswer: "Verification gates catch problems early. Audit trails prove what happened.", longerAnswer: ["Policy enforcement before action", "Anomaly detection signals", "Tamper-evident logs"], safeWording: "We add verification and auditability to reduce risk exposure." },
      { question: "Do you support least privilege and RBAC?", shortAnswer: "Yes. Role-based access control is built in.", longerAnswer: ["Configurable roles and permissions", "Least-privilege principles", "Logged privileged actions"], safeWording: "We support RBAC and least-privilege access controls." },
      { question: "How do you protect sensitive data?", shortAnswer: "We minimize what we store and encrypt what we must.", longerAnswer: ["Privacy-first architecture", "Encryption at rest and in transit", "Configurable retention policies"], safeWording: "We minimize sensitive data and protect what we store." },
      { question: "Do you provide audit logs?", shortAnswer: "Yes. Tamper-evident audit trails are core to what we do.", longerAnswer: ["Who did what, when, and why", "Protected against silent modification", "Exportable for compliance"], safeWording: "Audit-ready records are a core capability." },
      { question: "How do you handle incident response?", shortAnswer: "We provide logs and signals for investigation. Coordination depends on engagement model.", longerAnswer: ["Log access for forensics", "Alerting integration options", "Clear escalation paths"], safeWording: "We provide the data you need for incident investigation." },
      { question: "What is your 'zero trust' stance?", shortAnswer: "No request is trusted by default. Actions require verification and authorization.", longerAnswer: ["Every action is logged", "Verification gates enforce policy", "No implicit trust"], safeWording: "We follow zero-trust principles: verify, then trust." },
      { question: "How do you prevent fraud/abuse?", shortAnswer: "Verification gates, monitoring signals, and step-up checks.", longerAnswer: ["Configurable detection thresholds", "Escalation for suspicious behavior", "Audit trail for investigation"], safeWording: "We use verification gates and monitoring to detect and prevent abuse." },
      { question: "Can we run this in a restricted environment?", shortAnswer: "Yes. We support private deployment options.", longerAnswer: ["On-prem or VPC options", "Air-gapped support on roadmap", "Configuration for your requirements"], safeWording: "We can discuss private deployment options for restricted environments." }
    ]
  },
  {
    persona: "Compliance / Legal / Risk",
    description: "Risk and compliance leadership focused on liability, audit, and policy",
    faqs: [
      { question: "How does this reduce liability?", shortAnswer: "Audit trails prove what happened. Policy enforcement ensures rules were followed.", longerAnswer: ["Defensible decision records", "Policy version tracking", "Clear accountability"], safeWording: "We create records that help you defend decisions when challenged." },
      { question: "Can you produce audit-ready records?", shortAnswer: "Yes. That's a core capability.", longerAnswer: ["Who, what, when, why", "Tamper-evident", "Exportable formats"], safeWording: "Audit-ready records are what we're built for." },
      { question: "How do you support retention requirements?", shortAnswer: "Configurable retention policies based on your compliance needs.", longerAnswer: ["Set retention by data type", "Automated purge where appropriate", "Audit log for retention actions"], safeWording: "We support configurable retention to meet your compliance requirements." },
      { question: "How do you avoid over-collection of personal data?", shortAnswer: "We prefer verification signals over raw data. We minimize by design.", longerAnswer: ["Privacy-first architecture", "Collect only what's needed", "Clear data lifecycle"], safeWording: "We minimize data collection and prefer verification signals." },
      { question: "How do you handle disputes/appeals (process-wise)?", shortAnswer: "Audit trails provide the evidence. Your process handles the decision.", longerAnswer: ["Records show what happened", "We don't make the legal decision", "Data available for review"], safeWording: "We provide the evidence; you control the dispute process." },
      { question: "What claims do you make about accuracy?", shortAnswer: "We improve reliability and auditability. We don't claim perfection.", longerAnswer: ["Verification gates reduce errors", "Multiple checks improve confidence", "Honest about limitations"], safeWording: "We improve reliability, not guarantee perfection." },
      { question: "How do you support policy enforcement?", shortAnswer: "Configurable rules that are enforced before action, not just suggested.", longerAnswer: ["Policy gates before execution", "Version-controlled policies", "Logged enforcement"], safeWording: "Policies are enforced, not just documented." },
      { question: "What does 'source of truth' mean in practice?", shortAnswer: "The audit trail is the definitive record of what happened.", longerAnswer: ["Tamper-evident", "Timestamped", "Attributable"], safeWording: "Our audit trail is the authoritative record for compliance purposes." }
    ]
  },
  {
    persona: "Operations Leader",
    description: "Operations leadership focused on throughput, training, and reliability",
    faqs: [
      { question: "How does this speed up throughput?", shortAnswer: "QR verification in seconds. Automated checks instead of manual review.", longerAnswer: ["Sub-3-second scans", "Reduce manual verification steps", "Handle volume without adding headcount"], safeWording: "We verify faster than manual processes and scale with volume." },
      { question: "How hard is training?", shortAnswer: "Simple. Staff learn the basics in under an hour.", longerAnswer: ["Intuitive interfaces", "Clear workflows", "Training materials provided"], safeWording: "Training is straightforward — most staff are productive quickly." },
      { question: "What does day-1 go-live look like?", shortAnswer: "Tested, monitored, with support available. Ramp up as you're comfortable.", longerAnswer: ["Phased rollout option", "Monitoring from the start", "Support during launch"], safeWording: "We plan go-live carefully with testing and support in place." },
      { question: "What happens when internet is slow?", shortAnswer: "We have offline and degraded-connectivity modes depending on configuration.", longerAnswer: ["Local caching where appropriate", "Graceful degradation", "Sync when connectivity returns"], safeWording: "We handle connectivity issues with graceful degradation." },
      { question: "How do we handle exceptions?", shortAnswer: "Escalation paths for edge cases. Human review when needed.", longerAnswer: ["Configurable escalation rules", "Clear exception workflows", "Audit trail for exceptions"], safeWording: "We have escalation paths for cases that need human review." },
      { question: "How do we stop credential sharing/fraud?", shortAnswer: "Verification gates, time-limited tokens, and monitoring signals.", longerAnswer: ["Anti-sharing controls", "Anomaly detection", "Step-up verification for suspicious behavior"], safeWording: "We have controls to detect and prevent credential misuse." },
      { question: "What reporting do we get?", shortAnswer: "Dashboards and exports for operational metrics.", longerAnswer: ["Volume and throughput metrics", "Exception and escalation tracking", "Customizable views"], safeWording: "We provide reporting on the metrics that matter to you." },
      { question: "How do we expand to more sites?", shortAnswer: "Configuration-driven. Adding sites is straightforward.", longerAnswer: ["Template-based setup", "Centralized management", "Site-specific tuning"], safeWording: "Expansion is configuration-driven and designed for multi-site operations." }
    ]
  },
  {
    persona: "Finance (CFO/Controller)",
    description: "Finance leadership focused on ROI, cost, and financial controls",
    faqs: [
      { question: "What's the ROI?", shortAnswer: "Reduced fraud, faster ops, lower compliance cost. Compare to cost of one incident.", longerAnswer: ["Fraud reduction", "Staff efficiency", "Audit readiness", "Risk mitigation"], safeWording: "ROI comes from fraud reduction, efficiency, and compliance readiness." },
      { question: "How do pricing and billing work?", shortAnswer: "See the pricing menu for current packages. We'll match to your scale and use case.", longerAnswer: ["Package-based pricing", "Volume considerations", "Annual or monthly options"], safeWording: "Let's review the pricing menu to find the right package." },
      { question: "How do you reduce chargebacks/fraud?", shortAnswer: "Verification gates catch problems before they become disputes.", longerAnswer: ["Pre-action verification", "Audit trail for disputes", "Reduced fraudulent transactions"], safeWording: "We catch fraud early and provide evidence for disputes." },
      { question: "How do you reduce operational cost?", shortAnswer: "Automation replaces manual verification. Scale without adding headcount.", longerAnswer: ["Faster throughput", "Fewer manual steps", "Reduced exception handling"], safeWording: "We automate verification to reduce manual costs." },
      { question: "What reporting is available?", shortAnswer: "Dashboards for volume, exceptions, and key metrics. Exportable.", longerAnswer: ["Real-time and historical views", "Custom reports possible", "Integration with BI tools"], safeWording: "We provide the reporting you need for financial oversight." },
      { question: "What's the contract structure?", shortAnswer: "Typically annual with renewal. Terms negotiable for enterprise.", longerAnswer: ["Standard terms available", "Enterprise agreements", "Pilot options"], safeWording: "Let's discuss terms that work for your organization." },
      { question: "How do we control spend?", shortAnswer: "Clear pricing, volume visibility, and alerts for unexpected usage.", longerAnswer: ["Predictable pricing", "Usage dashboards", "Budget controls"], safeWording: "We give you visibility and control over costs." },
      { question: "How do we validate savings?", shortAnswer: "Compare before/after on fraud, throughput, and staff time.", longerAnswer: ["Baseline metrics before go-live", "Track improvements", "ROI review process"], safeWording: "We'll help you measure and validate savings." }
    ]
  },
  {
    persona: "Product/AI Lead",
    description: "Product and AI leadership focused on trust, policy, and performance",
    faqs: [
      { question: "How does SYNTH improve trust in outputs?", shortAnswer: "Policy controls, verification gates, and audit trails make outputs defensible.", longerAnswer: ["Multiple checks reduce errors", "Policies enforce constraints", "Records prove what happened"], safeWording: "We add governance to make AI outputs trustworthy and auditable." },
      { question: "How do we enforce policy constraints?", shortAnswer: "Configurable policies enforced before action, not just suggested.", longerAnswer: ["Policy gates at decision points", "Version-controlled policies", "Logged enforcement"], safeWording: "Policies are enforced at decision points, not just documented." },
      { question: "How do you handle model changes over time?", shortAnswer: "Configuration-driven. Swap or update without rebuilding.", longerAnswer: ["Abstracted from specific models", "Configuration changes, not code changes", "Testing before rollout"], safeWording: "We're designed to adapt to model changes over time." },
      { question: "How do you evaluate performance?", shortAnswer: "Metrics on accuracy, throughput, and exception rates. Configurable thresholds.", longerAnswer: ["Monitoring built in", "Alerting for anomalies", "Continuous improvement process"], safeWording: "We provide metrics and monitoring for performance evaluation." },
      { question: "Can we tune behavior by business unit?", shortAnswer: "Yes. Configuration is hierarchical and can vary by context.", longerAnswer: ["Different policies per unit", "Inheritance and override", "Audit trail for changes"], safeWording: "We support per-unit configuration and policy tuning." },
      { question: "How do you support auditability for agents?", shortAnswer: "Every action is logged with attribution, timestamp, and policy context.", longerAnswer: ["Tamper-evident logs", "Agent-specific tracking", "Full decision context"], safeWording: "We log agent actions with full context for auditability." },
      { question: "How do we roll out safely?", shortAnswer: "Phased rollout, testing, and monitoring. Start small, expand as confidence grows.", longerAnswer: ["Pilot phase option", "Canary deployments", "Rollback capability"], safeWording: "We support phased rollouts with testing and monitoring." },
      { question: "What's the right first use case?", shortAnswer: "Start with highest pain: biggest fraud vector, most audit risk, or slowest process.", longerAnswer: ["Identify pain point", "Define success criteria", "Quick win builds confidence"], safeWording: "We'll help you identify the best first use case for quick impact." }
    ]
  }
];

export const FAQsByPersona = () => {
  return (
    <PrintableSection>
      <BrandedHeader title="FAQs by Persona" variant="both" />
      <div className="flex items-center justify-between mb-6">
        <PrintableHeading level={2}>FAQs by Persona (Use on Calls)</PrintableHeading>
        <PrintButton />
      </div>
      <LastUpdated />

      <p className="text-muted-foreground mb-6 print:text-black">
        8 FAQs for each persona. Each includes short answer, longer answer, and safe wording example.
      </p>

      <Tabs defaultValue="cio" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6 print:hidden">
          <TabsTrigger value="cio">CIO/CTO</TabsTrigger>
          <TabsTrigger value="ciso">CISO</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="ops">Operations</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="product">Product/AI</TabsTrigger>
        </TabsList>

        {personaData.map((persona, pIndex) => (
          <TabsContent key={pIndex} value={["cio", "ciso", "compliance", "ops", "finance", "product"][pIndex]} className="space-y-4">
            <Card className="print:border-black print:bg-white">
              <CardHeader>
                <CardTitle className="text-xl print:text-black">{persona.persona}</CardTitle>
                <p className="text-sm text-muted-foreground print:text-black">{persona.description}</p>
              </CardHeader>
            </Card>

            <Accordion type="single" collapsible className="w-full space-y-2">
              {persona.faqs.map((faq, fIndex) => (
                <AccordionItem key={fIndex} value={`faq-${fIndex}`} className="border rounded-lg px-4 print:border-black">
                  <AccordionTrigger className="text-sm font-semibold print:text-black">
                    {fIndex + 1}. {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-primary print:text-black">Short Answer:</p>
                      <p className="text-sm print:text-black">{faq.shortAnswer}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-600 print:text-black">Longer Answer:</p>
                      <ul className="list-disc list-inside text-sm print:text-black">
                        {faq.longerAnswer.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-600 print:text-black">✅ Safe Wording:</p>
                      <p className="text-sm italic print:text-black">"{faq.safeWording}"</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        ))}
      </Tabs>

      {/* Print version shows all personas */}
      <div className="hidden print:block space-y-8">
        {personaData.map((persona, pIndex) => (
          <div key={pIndex} className="break-before-page">
            <h3 className="text-xl font-bold mb-2">{persona.persona}</h3>
            <p className="text-sm mb-4">{persona.description}</p>
            {persona.faqs.map((faq, fIndex) => (
              <div key={fIndex} className="mb-4 border-b pb-4">
                <p className="font-semibold">{fIndex + 1}. {faq.question}</p>
                <p className="text-sm"><strong>Short:</strong> {faq.shortAnswer}</p>
                <p className="text-sm"><strong>Safe wording:</strong> "{faq.safeWording}"</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <QualityGateChecklist />
      <LegalFooter />
    </PrintableSection>
  );
};
