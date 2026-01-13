import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { 
  Target, Copy, ChevronDown, Gavel, Building2, Shield,
  FileText, Users, AlertTriangle, Check, Zap, ArrowRight
} from "lucide-react";

interface BattleCardScript {
  id: string;
  target: string;
  icon: React.ElementType;
  hook: string;
  expandedPitch: string;
  asset: string;
  objectionHandlers: { objection: string; response: string }[];
  closingQuestion: string;
}

const BATTLE_CARDS: BattleCardScript[] = [
  {
    id: "attorney",
    target: "Attorney / General Counsel",
    icon: Gavel,
    hook: "We implement enforceable AI governance. Your current policy is a PDF. Ours is a Circuit Breaker.",
    expandedPitch: `Your AI governance policy right now is a document—employees can ignore it, and you only find out after something bad happens. 

SYNTH makes governance enforceable. Every AI output passes through a multi-model Senate. If it violates your policy, it gets blocked in real-time with a tamper-evident audit record. 

When litigation comes, you don't show them a policy document—you show them proof that the policy was enforced automatically on every single output.`,
    asset: "Grillo AI Governance Standard (Constitution PDF)",
    objectionHandlers: [
      {
        objection: "We already have AI policies in place.",
        response: "Policies define intent. We enforce execution. When a regulator asks 'did you enforce this?', you'll have timestamped proof, not promises."
      },
      {
        objection: "Our legal team handles AI compliance.",
        response: "Your legal team writes the rules. We make them unbreakable. Think of us as the execution layer for their strategy."
      }
    ],
    closingQuestion: "Would you rather explain your AI policy in court, or show proof it was automatically enforced?"
  },
  {
    id: "event",
    target: "Event Vendor / Ticketing",
    icon: Building2,
    hook: "Ticket fraud is costing you 20%. Ghost Pass kills it with identity verification that deletes itself.",
    expandedPitch: `Screenshot fraud, duplicate tickets, and reseller scams are bleeding your margins. Every fake ticket is a refund claim, a chargebacks, and a customer service nightmare.

Ghost Pass creates a cryptographically verified identity token that's bound to the ticket holder. It can't be screenshotted, forwarded, or faked. The scan at the door verifies the person, not just the QR.

And here's the kicker: we don't store any personal data. The token expires after entry. Zero data liability for you.`,
    asset: "Ghost Pass Demo Video",
    objectionHandlers: [
      {
        objection: "We use standard ticketing systems with security features.",
        response: "Those systems verify the ticket, not the person. We verify both, and we do it without creating a data liability for you."
      },
      {
        objection: "Our fraud rate isn't that high.",
        response: "What's your chargeback rate on ticket disputes? What does customer service spend on fraud claims? Ghost Pass makes those go to zero."
      }
    ],
    closingQuestion: "What if you could eliminate ticket fraud completely and reduce your data liability at the same time?"
  },
  {
    id: "ciso",
    target: "Enterprise CISO",
    icon: Shield,
    hook: "You have a firewall for your network. Where is your firewall for your AI Agents? We built the brakes.",
    expandedPitch: `You've spent millions on network security, endpoint protection, and data loss prevention. But your AI agents are operating without a single output-level control.

Every response an AI generates is a potential liability—regulatory violations, IP leaks, hallucinated facts presented as truth. Your current stack monitors these systems, but monitoring doesn't stop the bad output from shipping.

SYNTH is the firewall for AI outputs. Multi-model consensus, real-time policy enforcement, and tamper-evident audit logs. We don't replace your security stack—we complete it.`,
    asset: "Enterprise Security Architecture Diagram",
    objectionHandlers: [
      {
        objection: "We already have guardrails on our AI systems.",
        response: "Guardrails filter content. We verify truth. A polite, policy-compliant hallucination passes guardrails but fails us. We're the verification layer you're missing."
      },
      {
        objection: "We can build this internally.",
        response: "You could. Multi-model consensus, adversarial verification, tamper-evident audit trails, and revocation logic is about 18 months of R&D. We deploy in 45 days."
      },
      {
        objection: "We can't share data with external systems.",
        response: "We're a conduit, not a storage system. Requests flow through, we verify, we return. No data custody shift. On-prem deployment available for classified environments."
      }
    ],
    closingQuestion: "Your network has a firewall. Your endpoints have EDR. What's the control layer for your AI outputs?"
  }
];

const copyToClipboard = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copied to clipboard`);
};

export function BattleCards() {
  const [openCards, setOpenCards] = useState<string[]>([]);

  const toggleCard = (id: string) => {
    setOpenCards(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-cyan-500/30 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-cyan-400 font-mono">
                <Target className="h-6 w-6" />
                MODULE D: THE OUTBOUND ASSASSIN
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Battle Cards for high-value targets. Memorize these scripts. Land the meeting. Close the deal.
              </p>
            </div>
            <Badge variant="outline" className="border-red-500/50 text-red-400 font-mono">
              <AlertTriangle className="h-3 w-3 mr-1" />
              INTERNAL ONLY
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Battle Cards */}
      <div className="space-y-4">
        {BATTLE_CARDS.map((card) => (
          <Card 
            key={card.id} 
            className="border-cyan-500/30 bg-black/40 overflow-hidden"
          >
            <Collapsible open={openCards.includes(card.id)} onOpenChange={() => toggleCard(card.id)}>
              <CollapsibleTrigger asChild>
                <div className="p-6 cursor-pointer hover:bg-cyan-500/5 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-cyan-500/10">
                        <card.icon className="h-6 w-6 text-cyan-400" />
                      </div>
                      <div>
                        <Badge className="bg-cyan-500/20 text-cyan-400 border-0 font-mono text-xs mb-2">
                          TARGET
                        </Badge>
                        <h3 className="text-xl font-bold text-foreground mb-2">{card.target}</h3>
                        <div className="flex items-start gap-2">
                          <Zap className="h-4 w-4 text-amber-400 mt-1 flex-shrink-0" />
                          <p className="text-amber-400 font-medium italic">"{card.hook}"</p>
                        </div>
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${
                      openCards.includes(card.id) ? 'rotate-180' : ''
                    }`} />
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="px-6 pb-6 space-y-6 border-t border-cyan-500/20 pt-6">
                  {/* Hook with Copy */}
                  <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-amber-400">OPENING HOOK</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => copyToClipboard(card.hook, "Hook")}
                        className="h-7"
                      >
                        <Copy className="h-3 w-3 mr-1" /> Copy
                      </Button>
                    </div>
                    <p className="text-foreground font-medium">"{card.hook}"</p>
                  </div>

                  {/* Expanded Pitch */}
                  <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-cyan-400">FULL PITCH (2 MINUTES)</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => copyToClipboard(card.expandedPitch, "Pitch")}
                        className="h-7"
                      >
                        <Copy className="h-3 w-3 mr-1" /> Copy
                      </Button>
                    </div>
                    <p className="text-foreground whitespace-pre-line">{card.expandedPitch}</p>
                  </div>

                  {/* Attached Asset */}
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">ATTACHED ASSET</p>
                      <p className="text-sm font-medium">{card.asset}</p>
                    </div>
                  </div>

                  {/* Objection Handlers */}
                  <div className="space-y-3">
                    <h4 className="font-mono text-xs text-red-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      OBJECTION HANDLERS
                    </h4>
                    {card.objectionHandlers.map((handler, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-black/40 border border-red-500/20">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="p-1 rounded bg-red-500/20">
                            <AlertTriangle className="h-3 w-3 text-red-400" />
                          </div>
                          <p className="text-red-400 font-medium">"{handler.objection}"</p>
                        </div>
                        <div className="flex items-start gap-3 ml-6">
                          <ArrowRight className="h-4 w-4 text-green-400 mt-0.5" />
                          <div>
                            <p className="text-foreground">{handler.response}</p>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => copyToClipboard(handler.response, "Response")}
                              className="h-6 text-xs mt-2"
                            >
                              <Copy className="h-3 w-3 mr-1" /> Copy Response
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Closing Question */}
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-green-400">CLOSING QUESTION</span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => copyToClipboard(card.closingQuestion, "Closing question")}
                        className="h-7"
                      >
                        <Copy className="h-3 w-3 mr-1" /> Copy
                      </Button>
                    </div>
                    <p className="text-foreground font-medium">"{card.closingQuestion}"</p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Quick Reference */}
      <Card className="border-cyan-500/30 bg-black/40">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-cyan-400" />
            QUICK REFERENCE: THE THREE HOOKS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {BATTLE_CARDS.map((card) => (
              <div 
                key={card.id}
                className="p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5 cursor-pointer hover:border-cyan-500/40 transition-colors"
                onClick={() => copyToClipboard(card.hook, `${card.target} hook`)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <card.icon className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-mono text-cyan-400">{card.target.split('/')[0].toUpperCase()}</span>
                </div>
                <p className="text-sm text-foreground italic">"{card.hook}"</p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Copy className="h-3 w-3" /> Click to copy
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
