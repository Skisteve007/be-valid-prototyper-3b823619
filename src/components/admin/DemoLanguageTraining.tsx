import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { 
  Copy, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  AlertTriangle,
  ChevronDown,
  Pin,
  Shield
} from "lucide-react";

const DemoLanguageTraining = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const approvedNotice = `This experience demonstrates the Valid/SYNTH governance workflow, proof-record verification, and integration patterns. Outputs shown may be produced using demo-safe simulation and sample data. Production deployments run with client-specific rule packs and verified integrations under contract.`;

  const sayThis = [
    "This demo shows the workflow, enforcement path, and proof record you'll get in production.",
    "We run side-by-side with your stack; you remain the system of record.",
    "Production verdicts run on your rule pack + verified integrations under contract.",
  ];

  const dontSayThis = [
    "This is fake.",
    "We already have full Senate production everywhere.",
    "We store your underlying records.",
  ];

  const liveAnswer = `The product workflow is live; this demo may use demo-safe simulation where integrations aren't yet connected. Production deployments run with your configured rule packs and verification sources under contract, with proof records and audit trails.`;

  return (
    <div className="space-y-6">
      {/* Pinned Card - Always Visible */}
      <Card className="border-amber-500/50 bg-amber-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Pin className="h-5 w-5 text-amber-400" />
            <CardTitle className="text-lg">Demo Language (Say This / Don't Say This)</CardTitle>
          </div>
          <CardDescription>
            Use these approved phrases when discussing demos with prospects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Demo Environment Notice */}
          <div className="p-4 rounded-lg border border-primary/30 bg-primary/5">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Demo Environment Notice (Approved)
              </h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(approvedNotice, "Notice")}
              >
                <Copy className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
            <p className="text-sm text-muted-foreground italic">
              "{approvedNotice}"
            </p>
          </div>

          {/* Say This */}
          <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                SAY THIS (Approved)
              </h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(sayThis.join("\n\n"), "Approved phrases")}
              >
                <Copy className="h-3 w-3 mr-1" /> Copy All
              </Button>
            </div>
            <ul className="space-y-2">
              {sayThis.map((phrase, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-foreground">"{phrase}"</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don't Say This */}
          <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-400" />
                DON'T SAY THIS (Forbidden)
              </h4>
            </div>
            <ul className="space-y-2">
              {dontSayThis.map((phrase, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground line-through">"{phrase}"</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Accordion Section */}
      <Collapsible
        open={expandedSection === "compliance"}
        onOpenChange={(isOpen) => setExpandedSection(isOpen ? "compliance" : null)}
      >
        <Card className="border-border/50">
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <CardTitle className="text-lg">Compliance & Claims (Demo vs Production)</CardTitle>
                </div>
                <ChevronDown className={`h-5 w-5 transition-transform ${expandedSection === "compliance" ? "rotate-180" : ""}`} />
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {/* How to answer "Is this live?" */}
              <div className="p-4 rounded-lg border border-cyan-500/30 bg-cyan-500/5">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-cyan-400" />
                    How to answer: "Is this live?"
                  </h4>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(liveAnswer, "Answer")}
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  "{liveAnswer}"
                </p>
              </div>

              {/* Key Distinctions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <h5 className="font-medium text-foreground mb-2">Demo Environment</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Demo-safe simulation data</li>
                    <li>• Sample rule packs</li>
                    <li>• Illustrative verdicts</li>
                    <li>• Real proof record format</li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <h5 className="font-medium text-foreground mb-2">Production Environment</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Client-specific rule packs</li>
                    <li>• Verified integrations</li>
                    <li>• Contractual SLAs</li>
                    <li>• Full audit trails</li>
                  </ul>
                </div>
              </div>

              {/* Words to Avoid */}
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">
                  <strong>Never use:</strong> "fake," "not real," "prototype," "coming soon" on demo pages or in sales conversations.
                </p>
              </div>

              {/* Internal Architecture Note */}
              <Collapsible>
                <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <ChevronDown className="h-4 w-4" />
                  <span>Internal detail (restricted)</span>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="mt-2 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <p className="text-xs text-muted-foreground">
                      Architecture uses multiple independent models/agents for adversarial cross-examination. 
                      Do NOT list counts or vendor names unless explicitly required for a deal.
                    </p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  );
};

export default DemoLanguageTraining;
