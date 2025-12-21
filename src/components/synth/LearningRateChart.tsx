import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingDown, TrendingUp, Minus, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LearningEvent {
  date: string;
  errorRate: number;
  eventCount: number;
}

interface LearningRateChartProps {
  data: LearningEvent[];
  insufficientData?: boolean;
}

export const LearningRateChart: React.FC<LearningRateChartProps> = ({ 
  data, 
  insufficientData = false 
}) => {
  // Calculate trend
  const calculateTrend = () => {
    if (data.length < 2) return 'neutral';
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b.errorRate, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b.errorRate, 0) / secondHalf.length;
    
    if (secondAvg < firstAvg - 5) return 'improving';
    if (secondAvg > firstAvg + 5) return 'declining';
    return 'neutral';
  };

  const trend = calculateTrend();
  const latestErrorRate = data.length > 0 ? data[data.length - 1].errorRate : 0;

  const getTrendIcon = () => {
    switch (trend) {
      case 'improving': return <TrendingDown className="w-4 h-4 text-emerald-400" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-400" />;
      default: return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendLabel = () => {
    switch (trend) {
      case 'improving': return 'Improving';
      case 'declining': return 'Declining';
      default: return 'Stable';
    }
  };

  const getTrendBadgeClass = () => {
    switch (trend) {
      case 'improving': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'declining': return 'bg-red-500/20 text-red-400 border-red-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  if (insufficientData) {
    return (
      <Card className="synth-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <TrendingDown className="w-5 h-5 text-cyan-400" />
            Cognitive Velocity (Error Rate)
          </CardTitle>
          <CardDescription className="text-gray-400">
            Learning rate based on graded attempts and feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex flex-col items-center justify-center text-center p-6 rounded-lg bg-gray-800/30 border border-gray-700">
            <AlertTriangle className="w-10 h-10 text-amber-400 mb-3" />
            <h4 className="text-white font-medium mb-1">Not Enough Data Yet</h4>
            <p className="text-sm text-gray-400 max-w-sm">
              Learning rate requires objective events like graded attempts, explicit user feedback, or rubric scoring.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="synth-card border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingDown className="w-5 h-5 text-cyan-400" />
              Cognitive Velocity (Error Rate)
            </CardTitle>
            <CardDescription className="text-gray-400">
              Learning rate over time based on graded events
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xl font-mono font-bold text-white">{latestErrorRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-400">Current Error Rate</p>
            </div>
            <Badge className={`flex items-center gap-1 ${getTrendBadgeClass()}`}>
              {getTrendIcon()}
              {getTrendLabel()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#6b7280" 
                tick={{ fill: '#9ca3af', fontSize: 11 }}
              />
              <YAxis 
                stroke="#6b7280" 
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#9ca3af' }}
                itemStyle={{ color: '#06b6d4' }}
              />
              <ReferenceLine y={20} stroke="#10b981" strokeDasharray="5 5" label={{ value: 'Target', fill: '#10b981', fontSize: 10 }} />
              <Line 
                type="monotone" 
                dataKey="errorRate" 
                stroke="#06b6d4" 
                strokeWidth={2}
                dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#22d3ee' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>Based on {data.reduce((a, b) => a + b.eventCount, 0)} graded events</span>
          <span>Lower is better • Target: {'<'}20%</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningRateChart;
