import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Copy, Gavel, ShieldAlert, Shield, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// ============================================================
// JUDGE OUTPUT V1 SCHEMA - Matches backend contract
// ============================================================
interface JudgeSeatInfluence {
  seat_id: number;
  influence: "high" | "medium" | "low" | "none";
}

interface JudgeRiskVerdict {
  level: "low" | "medium" | "high";
  notes: string[];
}

export interface JudgeOutput {
  provider: "OpenAI";
  model: string;
  final_answer: string;
  rationale: string[];
  risk_verdict: JudgeRiskVerdict;
  seat_influence?: JudgeSeatInfluence[];
}

export interface ParticipationSummary {
  online_seats: number[];
  offline_seats: number[];
  timeout_seats: number[];
  error_seats: number[];
}

interface SenateJudgeCardProps {
  judge: JudgeOutput;
  participation_summary: ParticipationSummary;
  contested: boolean;
  contested_reasons: string[];
  trace_id: string;
  isLoading?: boolean;
}

const getRiskIcon = (level: string) => {
  switch (level) {
    case 'low': return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    case 'medium': return <Shield className="w-4 h-4 text-amber-400" />;
    case 'high': return <ShieldAlert className="w-4 h-4 text-red-400" />;
    default: return <Shield className="w-4 h-4 text-gray-400" />;
  }
};

const getRiskBadgeClass = (level: string) => {
  switch (level) {
    case 'low': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
    case 'high': return 'bg-red-500/20 text-red-400 border-red-500/50';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

const getInfluenceBadgeClass = (influence: string) => {
  switch (influence) {
    case 'high': return 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10';
    case 'medium': return 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10';
    case 'low': return 'border-gray-500/50 text-gray-400 bg-gray-500/10';
    case 'none': return 'border-gray-700 text-gray-600 bg-gray-800/50';
    default: return 'border-gray-700 text-gray-600 bg-gray-800/50';
  }
};

export const SenateJudgeCard: React.FC<SenateJudgeCardProps> = ({ 
  judge, 
  participation_summary, 
  contested, 
  contested_reasons,
  trace_id,
  isLoading 
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const onlineCount = participation_summary.online_seats.length;
  const totalSeats = 7;

  return (
    <Card className={`synth-card border-0 ${contested ? 'ring-2 ring-amber-500/50' : 'ring-2 ring-cyan-500/30'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${contested ? 'bg-amber-500/20 border border-amber-500/50' : 'bg-purple-500/20 border border-purple-500/50'}`}>
              <Gavel className={`w-6 h-6 ${contested ? 'text-amber-400' : 'text-purple-400'}`} />
            </div>
            <div>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                Judge: {judge.provider} ({judge.model})
                {contested ? (
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    CONTESTED
                  </Badge>
                ) : (
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    CERTIFIED
                  </Badge>
                )}
              </CardTitle>
              <p className="text-xs text-gray-400">
                Final Arbiter • {onlineCount}/{totalSeats} seats participated
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-mono">trace: {trace_id}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contested Reasons */}
        {contested && contested_reasons.length > 0 && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm text-amber-300 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Disagreement Detected
            </p>
            <ul className="mt-2 space-y-1">
              {contested_reasons.map((reason, i) => (
                <li key={i} className="text-xs text-amber-400/80">• {reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Verdict */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getRiskBadgeClass(judge.risk_verdict.level)}`}>
            {getRiskIcon(judge.risk_verdict.level)}
            <span className="uppercase">Risk: {judge.risk_verdict.level}</span>
          </div>
        </div>

        {judge.risk_verdict.notes.length > 0 && (
          <ul className="space-y-1">
            {judge.risk_verdict.notes.map((note, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-start gap-1">
                <span className="text-amber-400 mt-0.5">⚠</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Final Answer */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-300">Final Answer</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(judge.final_answer)}
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            >
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </Button>
          </div>
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
            <p className="text-sm text-gray-200 whitespace-pre-wrap">
              {isLoading ? (
                <span className="text-gray-500 animate-pulse">Synthesizing responses...</span>
              ) : (
                judge.final_answer
              )}
            </p>
          </div>
        </div>

        {/* Rationale */}
        {judge.rationale.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Judge Rationale</h4>
            <ul className="space-y-1">
              {judge.rationale.map((point, i) => (
                <li key={i} className="text-xs text-gray-400 flex items-start gap-1">
                  <span className="text-purple-400 mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Seat Influence */}
        {judge.seat_influence && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Seat Influence</h4>
            <div className="flex flex-wrap gap-2">
              {judge.seat_influence.map((seat) => (
                <Badge
                  key={seat.seat_id}
                  variant="outline"
                  className={`text-xs ${getInfluenceBadgeClass(seat.influence)}`}
                >
                  Seat {seat.seat_id}: {seat.influence}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Participation Summary */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Participation Summary</h4>
          <div className="flex flex-wrap gap-2">
            {participation_summary.online_seats.length > 0 && (
              <Badge variant="outline" className="text-xs border-emerald-500/50 text-emerald-400 bg-emerald-500/10">
                Online: {participation_summary.online_seats.join(', ')}
              </Badge>
            )}
            {participation_summary.offline_seats.length > 0 && (
              <Badge variant="outline" className="text-xs border-gray-500/50 text-gray-400 bg-gray-500/10">
                Offline: {participation_summary.offline_seats.join(', ')}
              </Badge>
            )}
            {participation_summary.timeout_seats.length > 0 && (
              <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-400 bg-amber-500/10">
                Timeout: {participation_summary.timeout_seats.join(', ')}
              </Badge>
            )}
            {participation_summary.error_seats.length > 0 && (
              <Badge variant="outline" className="text-xs border-red-500/50 text-red-400 bg-red-500/10">
                Error: {participation_summary.error_seats.join(', ')}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SenateJudgeCard;
