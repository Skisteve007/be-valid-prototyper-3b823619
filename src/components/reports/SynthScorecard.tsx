import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  ExternalLink,
  Sparkles,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface SeatSummary {
  seat_id: number;
  seat_name: string;
  provider: string;
  status: string;
  stance: string;
  score: number;
  confidence: number;
}

interface ScorecardData {
  trace_id: string;
  synth_index: number;
  tier: "PASS" | "REVIEW" | "DENY";
  why_reasons: string[];
  improvement_suggestions: string[];
  seats: SeatSummary[];
  judge_used: boolean;
  created_at: string;
}

interface SynthScorecardProps {
  data: ScorecardData;
  onDownloadPDF?: () => void;
  onDownloadJSON?: () => void;
}

const SynthScorecard = ({ data, onDownloadPDF, onDownloadJSON }: SynthScorecardProps) => {
  const [seatsExpanded, setSeatsExpanded] = useState(false);

  const getTierConfig = (tier: string) => {
    switch (tier) {
      case "PASS":
        return {
          icon: CheckCircle,
          color: "text-emerald-400",
          bgColor: "bg-emerald-500/20",
          borderColor: "border-emerald-500/50",
          ringColor: "stroke-emerald-500",
          label: "PASS"
        };
      case "REVIEW":
        return {
          icon: AlertTriangle,
          color: "text-amber-400",
          bgColor: "bg-amber-500/20",
          borderColor: "border-amber-500/50",
          ringColor: "stroke-amber-500",
          label: "REVIEW"
        };
      case "DENY":
        return {
          icon: XCircle,
          color: "text-red-400",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500/50",
          ringColor: "stroke-red-500",
          label: "DENY"
        };
      default:
        return {
          icon: Shield,
          color: "text-muted-foreground",
          bgColor: "bg-muted",
          borderColor: "border-border",
          ringColor: "stroke-muted-foreground",
          label: "UNKNOWN"
        };
    }
  };

  const tierConfig = getTierConfig(data.tier);
  const TierIcon = tierConfig.icon;

  // SVG gauge component
  const renderGauge = () => {
    const radius = 60;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    const progress = (data.synth_index / 100) * circumference;
    const offset = circumference - progress;

    return (
      <div className="relative w-40 h-40 mx-auto">
        <svg className="transform -rotate-90 w-40 h-40" viewBox="0 0 160 160">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={tierConfig.ringColor}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">{data.synth_index}</span>
          <span className="text-xs text-muted-foreground">Synth Index</span>
        </div>
      </div>
    );
  };

  const getStanceIcon = (stance: string) => {
    switch (stance) {
      case "approve": return <TrendingUp className="h-4 w-4 text-emerald-400" />;
      case "revise": return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case "block": return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <Shield className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className={`${tierConfig.borderColor} ${tierConfig.bgColor.replace('/20', '/5')}`}>
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Synth Scorecard</CardTitle>
        </div>
        <CardDescription>AI Governance Assessment</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Gauge + Tier Badge */}
        <div className="flex flex-col items-center gap-4">
          {renderGauge()}
          
          <Badge 
            variant="outline" 
            className={`${tierConfig.bgColor} ${tierConfig.color} ${tierConfig.borderColor} px-4 py-2 text-lg font-bold`}
          >
            <TierIcon className="h-5 w-5 mr-2" />
            {tierConfig.label}
          </Badge>
        </div>

        {/* Why Reasons */}
        {data.why_reasons.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Why This Score
            </h4>
            <ul className="space-y-1">
              {data.why_reasons.slice(0, 3).map((reason, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvement Suggestions */}
        {data.improvement_suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-400" />
              What to Improve
            </h4>
            <ul className="space-y-1">
              {data.improvement_suggestions.slice(0, 3).map((suggestion, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-amber-400">•</span>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Seat Summary (Collapsible) */}
        <Collapsible open={seatsExpanded} onOpenChange={setSeatsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between" size="sm">
              <span className="text-sm text-muted-foreground">
                {data.seats.filter(s => s.status === "online" || s.status === "voted").length} Seats Voted
              </span>
              {seatsExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2">
            {data.seats.map((seat) => (
              <div 
                key={seat.seat_id} 
                className="flex items-center justify-between p-2 bg-muted/30 rounded border border-border/50"
              >
                <div className="flex items-center gap-2">
                  {getStanceIcon(seat.stance)}
                  <span className="text-xs font-medium">{seat.provider}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress 
                    value={seat.confidence * 100} 
                    className="w-16 h-1.5" 
                  />
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {seat.score}
                  </span>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
          <div className="flex gap-2">
            {onDownloadPDF && (
              <Button variant="outline" size="sm" className="flex-1" onClick={onDownloadPDF}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            )}
            {onDownloadJSON && (
              <Button variant="outline" size="sm" className="flex-1" onClick={onDownloadJSON}>
                <Download className="h-4 w-4 mr-1" />
                JSON
              </Button>
            )}
          </div>
          
          <Button variant="ghost" size="sm" asChild className="w-full">
            <Link to={`/demos/audit-verifier?trace=${data.trace_id}`}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Verify Proof
            </Link>
          </Button>
        </div>

        {/* Trace ID */}
        <p className="text-xs text-muted-foreground text-center">
          Trace: {data.trace_id}
        </p>
      </CardContent>
    </Card>
  );
};

export default SynthScorecard;
