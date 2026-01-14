import { Shield, ExternalLink, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BADGE_CONFIG, getBadgeDisplayName } from "@/config/badgeConfig";

export function AIGovernanceBadge() {
  const displayName = getBadgeDisplayName();

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Badge Icon */}
          <div className="shrink-0">
            <div className="w-16 h-16 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>

          {/* Badge Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">{displayName}</h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{BADGE_CONFIG.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Included with all tiers. Publicly displayable mark of adherence to Reasonable Care controls — policy‑to‑code, approvals, immutable audit, zero‑trust data handling.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <Badge variant="outline" className="text-xs bg-primary/10 border-primary/30 text-primary">
                Included
              </Badge>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="link" className="h-auto p-0 text-xs text-muted-foreground hover:text-primary">
                    Learn more
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      About the {displayName}
                    </DialogTitle>
                    <DialogDescription>
                      Display rights and governance standards
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>Signals active adherence to Reasonable Care standards</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>Policy-to-code guardrails and human-in-the-loop approvals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>Immutable audit trails and zero-trust data handling</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span>Model-agnostic: best models earn a seat; governance remains constant</span>
                      </li>
                    </ul>
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        Badge display rights require an active subscription and compliance with {BADGE_CONFIG.issuer} badge guidelines.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Link 
                to={BADGE_CONFIG.guidelines_url}
                className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
              >
                Badge use guidelines
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact version for plan cards
export function AIGovernanceBadgeCompact() {
  const displayName = getBadgeDisplayName();
  
  return (
    <div className="flex items-center gap-2 text-sm">
      <Shield className="h-4 w-4 text-primary shrink-0" />
      <span>{displayName} — included</span>
    </div>
  );
}
