import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Brain, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  BarChart3,
  RefreshCw,
  AlertCircle,
  Zap,
  Eye
} from 'lucide-react';

interface CohortMetrics {
  total_events: number;
  total_sessions: number;
  unique_users: number;
  events_by_type: Record<string, number>;
  avg_coherence: number;
  avg_verification: number;
  decision_distribution: Record<string, number>;
  anomalies: Array<{ type: string; message: string; severity: 'low' | 'medium' | 'high' }>;
}

interface FunnelStep {
  label: string;
  count: number;
  percentage: number;
}

const SynthMetrics: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<CohortMetrics | null>(null);
  const [funnel, setFunnel] = useState<FunnelStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    setIsLoading(true);
    try {
      const daysAgo = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      // Fetch all events in the time range
      const { data: eventsData } = await supabase
        .from('synth_events')
        .select('*')
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: false });

      const { data: sessionsData } = await supabase
        .from('synth_sessions')
        .select('*')
        .gte('started_at', startDate.toISOString());

      if (eventsData) {
        // Calculate metrics
        const events = eventsData as unknown as Array<{
          event_type: string;
          user_id: string;
          coherence_score: number | null;
          verification_score: number | null;
          decision: string | null;
        }>;

        const eventsByType: Record<string, number> = {};
        const decisionDist: Record<string, number> = {};
        const uniqueUsers = new Set<string>();
        let totalCoherence = 0;
        let coherenceCount = 0;
        let totalVerification = 0;
        let verificationCount = 0;

        events.forEach(e => {
          // Count by type
          eventsByType[e.event_type] = (eventsByType[e.event_type] || 0) + 1;
          
          // Track users
          if (e.user_id) uniqueUsers.add(e.user_id);
          
          // Accumulate scores
          if (e.coherence_score !== null) {
            totalCoherence += e.coherence_score;
            coherenceCount++;
          }
          if (e.verification_score !== null) {
            totalVerification += e.verification_score;
            verificationCount++;
          }
          
          // Decision distribution
          if (e.decision) {
            decisionDist[e.decision] = (decisionDist[e.decision] || 0) + 1;
          }
        });

        // Detect anomalies
        const anomalies: CohortMetrics['anomalies'] = [];
        
        const policyBlocks = eventsByType['POLICY_BLOCK_TRIGGERED'] || 0;
        if (policyBlocks > events.length * 0.1) {
          anomalies.push({
            type: 'POLICY_BLOCKS_HIGH',
            message: `${policyBlocks} policy blocks (${((policyBlocks / events.length) * 100).toFixed(1)}% of events)`,
            severity: 'high'
          });
        }

        const avgCoh = coherenceCount > 0 ? totalCoherence / coherenceCount : 0;
        if (avgCoh < 0.7) {
          anomalies.push({
            type: 'LOW_AVG_COHERENCE',
            message: `Average coherence score is ${(avgCoh * 100).toFixed(0)}% (below 70% threshold)`,
            severity: 'medium'
          });
        }

        const reviewRequired = decisionDist['HUMAN_REVIEW_REQUIRED'] || 0;
        if (reviewRequired > events.length * 0.2) {
          anomalies.push({
            type: 'HIGH_REVIEW_RATE',
            message: `${reviewRequired} requests needed human review (${((reviewRequired / events.length) * 100).toFixed(1)}%)`,
            severity: 'medium'
          });
        }

        setMetrics({
          total_events: events.length,
          total_sessions: sessionsData?.length || 0,
          unique_users: uniqueUsers.size,
          events_by_type: eventsByType,
          avg_coherence: coherenceCount > 0 ? totalCoherence / coherenceCount : 0,
          avg_verification: verificationCount > 0 ? totalVerification / verificationCount : 0,
          decision_distribution: decisionDist,
          anomalies,
        });

        // Build funnel
        const submitted = eventsByType['PROMPT_SUBMITTED'] || eventsByType['AUDIT_COMPLETED'] || 0;
        const completed = eventsByType['AUDIT_COMPLETED'] || 0;
        const viewed = eventsByType['DECISION_VIEWED'] || 0;
        const accepted = eventsByType['USER_ACCEPTED_REWRITE'] || 0;
        const copied = eventsByType['SAFE_ANSWER_COPIED'] || 0;

        const funnelSteps: FunnelStep[] = [
          { label: 'Submitted', count: submitted, percentage: 100 },
          { label: 'Completed', count: completed, percentage: submitted > 0 ? (completed / submitted) * 100 : 0 },
          { label: 'Viewed', count: viewed, percentage: submitted > 0 ? (viewed / submitted) * 100 : 0 },
          { label: 'Accepted', count: accepted + copied, percentage: submitted > 0 ? ((accepted + copied) / submitted) * 100 : 0 },
        ];
        setFunnel(funnelSteps);
      }

    } catch (error) {
      console.error('Error loading metrics:', error);
      toast.error('Failed to load metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityClass = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'RELEASE_FULL': return 'bg-green-500';
      case 'RELEASE_SAFE_PARTIAL': return 'bg-amber-500';
      case 'HUMAN_REVIEW_REQUIRED': return 'bg-blue-500';
      case 'REFUSE': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen synth-bg">
      <Helmet>
        <title>SYNTH™ Metrics | Admin Dashboard</title>
        <meta name="description" content="SYNTH™ admin metrics and anomaly detection" />
      </Helmet>

      <div className="fixed inset-0 z-0 synth-grid opacity-50" />

      {/* Header */}
      <header className="synth-header sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/synth')}
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg synth-neon-blue">SYNTH™ Metrics</h1>
                <p className="text-xs text-gray-400">Admin Dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant="outline"
                size="sm"
                onClick={() => setTimeRange(range)}
                className={`border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent ${
                  timeRange === range ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : ''
                }`}
              >
                {range === '7d' ? 'Week' : range === '30d' ? 'Month' : 'Quarter'}
              </Button>
            ))}
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadMetrics}
              className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        ) : metrics ? (
          <div className="space-y-8">
            {/* Top Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card className="synth-card border-0">
                <CardContent className="pt-4">
                  <Activity className="w-5 h-5 text-cyan-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{metrics.total_events}</div>
                  <div className="text-xs text-gray-400">Total Events</div>
                </CardContent>
              </Card>
              <Card className="synth-card border-0">
                <CardContent className="pt-4">
                  <Zap className="w-5 h-5 text-amber-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{metrics.total_sessions}</div>
                  <div className="text-xs text-gray-400">Sessions</div>
                </CardContent>
              </Card>
              <Card className="synth-card border-0">
                <CardContent className="pt-4">
                  <Users className="w-5 h-5 text-purple-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{metrics.unique_users}</div>
                  <div className="text-xs text-gray-400">Unique Users</div>
                </CardContent>
              </Card>
              <Card className="synth-card border-0">
                <CardContent className="pt-4">
                  <Brain className="w-5 h-5 text-blue-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{(metrics.avg_coherence * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-400">Avg Coherence</div>
                </CardContent>
              </Card>
              <Card className="synth-card border-0">
                <CardContent className="pt-4">
                  <Shield className="w-5 h-5 text-green-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{(metrics.avg_verification * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-400">Avg Verification</div>
                </CardContent>
              </Card>
              <Card className="synth-card border-0">
                <CardContent className="pt-4">
                  <AlertCircle className="w-5 h-5 text-red-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{metrics.anomalies.length}</div>
                  <div className="text-xs text-gray-400">Anomalies</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Cohort Funnel */}
              <Card className="synth-card border-0">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-cyan-400" />
                    Cohort Funnel
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Submitted → Completed → Viewed → Resolved
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {funnel.map((step, i) => (
                    <div key={step.label} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-300">{step.label}</span>
                        <span className="text-gray-400">{step.count} ({step.percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                          style={{ width: `${step.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Decision Distribution */}
              <Card className="synth-card border-0">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-cyan-400" />
                    Decision Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(metrics.decision_distribution).map(([decision, count]) => {
                    const total = Object.values(metrics.decision_distribution).reduce((a, b) => a + b, 0);
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={decision} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">{decision.replace(/_/g, ' ')}</span>
                          <span className="text-gray-400">{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getDecisionColor(decision)} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(metrics.decision_distribution).length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">No decision data yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Anomaly Alerts */}
            <Card className="synth-card border-0">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  Anomaly Alerts
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Detected patterns requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {metrics.anomalies.length > 0 ? (
                  <div className="space-y-3">
                    {metrics.anomalies.map((anomaly, i) => (
                      <div 
                        key={i} 
                        className={`p-4 rounded-lg border ${getSeverityClass(anomaly.severity)}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={getSeverityClass(anomaly.severity)}>
                            {anomaly.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-medium">{anomaly.type.replace(/_/g, ' ')}</span>
                        </div>
                        <p className="text-sm opacity-80">{anomaly.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 mx-auto text-green-400 opacity-50 mb-2" />
                    <p className="text-gray-400">No anomalies detected</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Type Breakdown */}
            <Card className="synth-card border-0">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  Event Type Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(metrics.events_by_type)
                    .sort((a, b) => b[1] - a[1])
                    .map(([type, count]) => (
                      <div key={type} className="p-3 bg-white/5 rounded-lg border border-gray-800">
                        <div className="text-lg font-bold text-white">{count}</div>
                        <div className="text-xs text-gray-400 truncate">{type.replace(/_/g, ' ')}</div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No metrics data available</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SynthMetrics;