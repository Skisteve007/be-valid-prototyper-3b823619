import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, CheckCircle, AlertTriangle, Copy, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export interface JudgeOutput {
  final_answer: string;
  participation_summary: Record<string, { responded: boolean; weight: number; stance?: string }>;
  contested: boolean;
  trace_id: string;
  reasoning?: string;
  disagreement_explanation?: string;
  score_variance?: number;
  blocks_count?: number;
}

interface SenateJudgeCardProps {
  judge: JudgeOutput;
  isLoading?: boolean;
}

export const SenateJudgeCard: React.FC<SenateJudgeCardProps> = ({ judge, isLoading }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const participationCount = Object.values(judge.participation_summary).filter(p => p.responded).length;

  return (
    <Card className={`synth-card border-0 ${judge.contested ? 'ring-2 ring-amber-500/50' : 'ring-2 ring-cyan-500/30'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${judge.contested ? 'bg-amber-500/20 border border-amber-500/50' : 'bg-purple-500/20 border border-purple-500/50'}`}>
              <Gavel className={`w-6 h-6 ${judge.contested ? 'text-amber-400' : 'text-purple-400'}`} />
            </div>
            <div>
              <CardTitle className="text-lg text-white flex items-center gap-2">
                Judge: ChatGPT (o1)
                {judge.contested ? (
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
                Final Arbiter • {participationCount}/7 seats participated
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-mono">trace: {judge.trace_id.slice(0, 12)}...</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contested Explanation */}
        {judge.contested && judge.disagreement_explanation && (
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm text-amber-300">
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              <strong>Disagreement Detected:</strong> {judge.disagreement_explanation}
            </p>
            {judge.score_variance !== undefined && (
              <p className="text-xs text-amber-400/80 mt-1">
                Score variance: {judge.score_variance.toFixed(1)}% • Blocks: {judge.blocks_count || 0}
              </p>
            )}
          </div>
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

        {/* Reasoning */}
        {judge.reasoning && (
          <div>
            <h4 className="text-sm font-medium text-gray-300 mb-2">Judge Reasoning</h4>
            <p className="text-xs text-gray-400">{judge.reasoning}</p>
          </div>
        )}

        {/* Participation Summary */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Participation Summary</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(judge.participation_summary).map(([seat, data]) => (
              <Badge
                key={seat}
                variant="outline"
                className={`text-xs ${
                  data.responded
                    ? data.stance === 'approve' 
                      ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10'
                      : data.stance === 'block'
                        ? 'border-red-500/50 text-red-400 bg-red-500/10'
                        : data.stance === 'revise'
                          ? 'border-amber-500/50 text-amber-400 bg-amber-500/10'
                          : 'border-gray-500/50 text-gray-400 bg-gray-500/10'
                    : 'border-gray-700 text-gray-600 bg-gray-800/50'
                }`}
              >
                {seat}: {data.responded ? `${data.weight}%` : 'offline'}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SenateJudgeCard;
