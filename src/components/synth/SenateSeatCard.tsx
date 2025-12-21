import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertTriangle, Clock, Wifi, WifiOff } from 'lucide-react';

export interface SeatBallot {
  seat_id: number;
  provider: string;
  model: string;
  status: 'online' | 'offline' | 'timeout' | 'error';
  stance: 'approve' | 'revise' | 'block' | 'abstain';
  score: number;
  confidence: number;
  risk_flags: string[];
  key_points: string[];
  counterpoints: string[];
  recommended_edits?: string[];
  latency_ms?: number;
  token_usage?: number;
}

interface SenateSeatCardProps {
  seat: SeatBallot;
  weight: number;
}

const SEAT_CONFIG: Record<number, { name: string; color: string; icon: string }> = {
  1: { name: 'OpenAI', color: 'emerald', icon: '🟢' },
  2: { name: 'Anthropic', color: 'orange', icon: '🟠' },
  3: { name: 'Google', color: 'blue', icon: '🔵' },
  4: { name: 'Meta', color: 'indigo', icon: '🟣' },
  5: { name: 'DeepSeek', color: 'cyan', icon: '🔷' },
  6: { name: 'Mistral', color: 'amber', icon: '🟡' },
  7: { name: 'xAI', color: 'red', icon: '🔴' },
};

const getStanceIcon = (stance: string) => {
  switch (stance) {
    case 'approve': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    case 'revise': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    case 'block': return <XCircle className="w-4 h-4 text-red-400" />;
    case 'abstain': return <Clock className="w-4 h-4 text-gray-400" />;
    default: return null;
  }
};

const getStanceBadgeClass = (stance: string) => {
  switch (stance) {
    case 'approve': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
    case 'revise': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
    case 'block': return 'bg-red-500/20 text-red-400 border-red-500/50';
    case 'abstain': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
};

export const SenateSeatCard: React.FC<SenateSeatCardProps> = ({ seat, weight }) => {
  const config = SEAT_CONFIG[seat.seat_id] || { name: 'Unknown', color: 'gray', icon: '⚪' };
  const isOffline = seat.status === 'offline' || seat.status === 'timeout' || seat.status === 'error';

  return (
    <Card className={`synth-card border-0 transition-all ${isOffline ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <div>
              <h4 className="font-semibold text-sm text-white">{config.name}</h4>
              <p className="text-xs text-gray-400">{seat.model}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isOffline ? (
              <WifiOff className="w-4 h-4 text-gray-500" />
            ) : (
              <Wifi className="w-4 h-4 text-emerald-400" />
            )}
            <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
              {weight}%
            </Badge>
          </div>
        </div>

        {/* Status */}
        {isOffline ? (
          <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700 text-center">
            <span className="text-gray-400 text-sm font-medium">
              {seat.status === 'offline' ? 'Offline' : seat.status === 'timeout' ? 'Timeout' : 'Error'}
            </span>
            <p className="text-xs text-gray-500 mt-1">No API key configured</p>
          </div>
        ) : (
          <>
            {/* Stance & Score */}
            <div className="flex items-center justify-between mb-3">
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${getStanceBadgeClass(seat.stance)}`}>
                {getStanceIcon(seat.stance)}
                <span className="uppercase">{seat.stance}</span>
              </div>
              <div className="text-right">
                <span className={`font-mono font-bold text-lg ${getScoreColor(seat.score)}`}>
                  {seat.score}
                </span>
                <span className="text-gray-500 text-xs ml-1">/100</span>
              </div>
            </div>

            {/* Confidence */}
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Confidence</span>
                <span className="text-gray-300">{(seat.confidence * 100).toFixed(0)}%</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 rounded-full transition-all"
                  style={{ width: `${seat.confidence * 100}%` }}
                />
              </div>
            </div>

            {/* Key Points */}
            {seat.key_points.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-gray-400 mb-1">Key Points:</p>
                <ul className="space-y-0.5">
                  {seat.key_points.slice(0, 3).map((point, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-1">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span className="line-clamp-1">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Risk Flags */}
            {seat.risk_flags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {seat.risk_flags.map((flag, i) => (
                  <Badge key={i} variant="outline" className="text-[10px] border-red-500/30 text-red-400 bg-red-500/10">
                    {flag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Latency */}
            {seat.latency_ms && (
              <p className="text-[10px] text-gray-500 mt-2">
                {seat.latency_ms}ms
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SenateSeatCard;
