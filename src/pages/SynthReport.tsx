import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  User,
  Calendar,
  Zap,
  Eye,
  Copy,
  RefreshCw,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface SynthEvent {
  id: string;
  timestamp: string;
  event_type: string;
  request_id: string;
  risk_decision: string | null;
  decision: string | null;
  coherence_score: number | null;
  verification_score: number | null;
  metadata: Record<string, unknown>;
}

interface SynthSession {
  id: string;
  started_at: string;
  ended_at: string | null;
  event_count: number;
  source: string;
}

interface UserMetrics {
  prompts_submitted: number;
  audits_completed: number;
  rewrites_accepted: number;
  rewrites_rejected: number;
  completion_rate: number;
  acceptance_rate: number;
  avg_coherence_score: number;
  avg_verification_score: number;
  reason_codes: string[];
  tier_percentile: number | null;
}

const SynthReport: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [events, setEvents] = useState<SynthEvent[]>([]);
  const [sessions, setSessions] = useState<SynthSession[]>([]);
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadUserData(userId);
    }
  }, [userId]);

  const loadUserData = async (uid: string) => {
    setIsLoading(true);
    try {
      // Fetch events
      const { data: eventsData } = await supabase
        .from('synth_events')
        .select('*')
        .eq('user_id', uid)
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (eventsData) {
        setEvents(eventsData as unknown as SynthEvent[]);
      }

      // Fetch sessions
      const { data: sessionsData } = await supabase
        .from('synth_sessions')
        .select('*')
        .eq('user_id', uid)
        .order('started_at', { ascending: false })
        .limit(20);
      
      if (sessionsData) {
        setSessions(sessionsData as unknown as SynthSession[]);
      }

      // Calculate metrics from events
      calculateMetrics(eventsData as unknown as SynthEvent[] || []);

    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = (eventsData: SynthEvent[]) => {
    const submitted = eventsData.filter(e => e.event_type === 'PROMPT_SUBMITTED').length;
    const completed = eventsData.filter(e => e.event_type === 'AUDIT_COMPLETED').length;
    const accepted = eventsData.filter(e => e.event_type === 'USER_ACCEPTED_REWRITE').length;
    const rejected = eventsData.filter(e => e.event_type === 'USER_REJECTED_REWRITE').length;
    
    const coherenceScores = eventsData
      .filter(e => e.coherence_score !== null)
      .map(e => e.coherence_score as number);
    
    const verificationScores = eventsData
      .filter(e => e.verification_score !== null)
      .map(e => e.verification_score as number);

    const avgCoherence = coherenceScores.length > 0 
      ? coherenceScores.reduce((a, b) => a + b, 0) / coherenceScores.length 
      : 0;
    
    const avgVerification = verificationScores.length > 0 
      ? verificationScores.reduce((a, b) => a + b, 0) / verificationScores.length 
      : 0;

    // Determine reason codes based on behavior
    const reasonCodes: string[] = [];
    
    if (avgCoherence >= 0.85) reasonCodes.push('HIGH_STABILITY_OVER_TIME');
    if (avgVerification >= 0.9) reasonCodes.push('STRONG_EVIDENCE_DISCIPLINE');
    if (accepted > rejected * 2) reasonCodes.push('HIGH_ACCEPTANCE_OF_SAFE_REWRITES');
    
    if (avgCoherence < 0.6) reasonCodes.push('LOW_STABILITY_HIGH_VARIANCE');
    if (eventsData.filter(e => e.event_type === 'POLICY_BLOCK_TRIGGERED').length > 3) {
      reasonCodes.push('FREQUENT_POLICY_BOUNDARY_HITS');
    }

    setMetrics({
      prompts_submitted: submitted || completed, // Fallback if PROMPT_SUBMITTED not logged
      audits_completed: completed,
      rewrites_accepted: accepted,
      rewrites_rejected: rejected,
      completion_rate: submitted > 0 ? completed / submitted : 1,
      acceptance_rate: (accepted + rejected) > 0 ? accepted / (accepted + rejected) : 0,
      avg_coherence_score: avgCoherence,
      avg_verification_score: avgVerification,
      reason_codes: reasonCodes,
      tier_percentile: null, // Would be computed from aggregated data
    });
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'PROMPT_SUBMITTED': return <Brain className="w-4 h-4 text-cyan-400" />;
      case 'AUDIT_STARTED': return <Activity className="w-4 h-4 text-blue-400" />;
      case 'AUDIT_COMPLETED': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'DECISION_VIEWED': return <Eye className="w-4 h-4 text-purple-400" />;
      case 'SAFE_ANSWER_COPIED': return <Copy className="w-4 h-4 text-cyan-400" />;
      case 'USER_ACCEPTED_REWRITE': return <ThumbsUp className="w-4 h-4 text-green-400" />;
      case 'USER_REJECTED_REWRITE': return <ThumbsDown className="w-4 h-4 text-red-400" />;
      case 'USER_EDITED_AND_RESUBMITTED': return <RefreshCw className="w-4 h-4 text-amber-400" />;
      case 'HUMAN_REVIEW_REQUESTED': return <Clock className="w-4 h-4 text-amber-400" />;
      case 'POLICY_BLOCK_TRIGGERED': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Zap className="w-4 h-4 text-gray-400" />;
    }
  };

  const getDecisionBadge = (decision: string | null) => {
    if (!decision) return null;
    const classes: Record<string, string> = {
      'RELEASE_FULL': 'bg-green-500/20 text-green-400 border-green-500/30',
      'RELEASE_SAFE_PARTIAL': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'HUMAN_REVIEW_REQUIRED': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'REFUSE': 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return <Badge className={classes[decision] || 'bg-gray-500/20 text-gray-400'}>{decision.replace(/_/g, ' ')}</Badge>;
  };

  const getReasonCodeClass = (code: string) => {
    if (code.includes('HIGH') || code.includes('STRONG') || code.includes('CONSISTENT') || code.includes('CALIBRATED') || code.includes('SAFE')) {
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
    if (code.includes('ESCALATED') || code.includes('REFUSED') || code.includes('RELEASED')) {
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  };

  const formatTimestamp = (ts: string) => {
    return new Date(ts).toLocaleString();
  };

  const filteredEvents = selectedSession 
    ? events.filter(e => {
        // Find session this event belongs to
        const session = sessions.find(s => s.id === selectedSession);
        if (!session) return false;
        const eventTime = new Date(e.timestamp);
        const sessionStart = new Date(session.started_at);
        const sessionEnd = session.ended_at ? new Date(session.ended_at) : new Date();
        return eventTime >= sessionStart && eventTime <= sessionEnd;
      })
    : events;

  return (
    <div className="min-h-screen synth-bg">
      <Helmet>
        <title>SYNTH™ Report | Movement Timeline</title>
        <meta name="description" content="SYNTH™ user movement report and timeline" />
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
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg synth-neon-blue">Movement Report</h1>
                <p className="text-xs text-gray-400 font-mono">{userId?.substring(0, 8)}...</p>
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => userId && loadUserData(userId)}
            className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Metrics Overview */}
            {metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <Card className="synth-card border-0">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-white">{metrics.audits_completed}</div>
                    <div className="text-xs text-gray-400">Audits</div>
                  </CardContent>
                </Card>
                <Card className="synth-card border-0">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-green-400">{(metrics.completion_rate * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-400">Completion</div>
                  </CardContent>
                </Card>
                <Card className="synth-card border-0">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-cyan-400">{(metrics.acceptance_rate * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-400">Acceptance</div>
                  </CardContent>
                </Card>
                <Card className="synth-card border-0">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-blue-400">{(metrics.avg_coherence_score * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-400">Avg Coherence</div>
                  </CardContent>
                </Card>
                <Card className="synth-card border-0">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-purple-400">{(metrics.avg_verification_score * 100).toFixed(0)}%</div>
                    <div className="text-xs text-gray-400">Avg Verification</div>
                  </CardContent>
                </Card>
                <Card className="synth-card border-0">
                  <CardContent className="pt-4">
                    <div className="text-2xl font-bold text-amber-400">{sessions.length}</div>
                    <div className="text-xs text-gray-400">Sessions</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Reason Codes */}
            {metrics && metrics.reason_codes.length > 0 && (
              <Card className="synth-card border-0">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    Reason Codes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {metrics.reason_codes.map((code, i) => (
                      <Badge key={i} variant="outline" className={getReasonCodeClass(code)}>
                        {code.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Sessions List */}
              <Card className="synth-card border-0">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    Sessions
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    30-min inactivity threshold
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full justify-start ${!selectedSession ? 'bg-cyan-500/20 border-cyan-500/50' : 'border-gray-700'} text-gray-200 bg-transparent`}
                    onClick={() => setSelectedSession(null)}
                  >
                    All Events ({events.length})
                  </Button>
                  {sessions.map((session) => (
                    <Button
                      key={session.id}
                      variant="outline"
                      size="sm"
                      className={`w-full justify-start ${selectedSession === session.id ? 'bg-cyan-500/20 border-cyan-500/50' : 'border-gray-700'} text-gray-200 bg-transparent`}
                      onClick={() => setSelectedSession(session.id)}
                    >
                      <div className="flex flex-col items-start text-xs">
                        <span>{new Date(session.started_at).toLocaleDateString()}</span>
                        <span className="text-gray-500">{session.event_count} events</span>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Movement Timeline */}
              <div className="lg:col-span-2">
                <Card className="synth-card border-0">
                  <CardHeader>
                    <CardTitle className="text-white text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      Movement Timeline
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      {filteredEvents.length} events
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-[600px] overflow-y-auto">
                      {filteredEvents.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-8">No events recorded</p>
                      ) : (
                        filteredEvents.map((event) => (
                          <div 
                            key={event.id} 
                            className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-gray-800 hover:border-gray-700 transition-colors"
                          >
                            <div className="mt-1">{getEventIcon(event.event_type)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-medium text-white">
                                  {event.event_type.replace(/_/g, ' ')}
                                </span>
                                {getDecisionBadge(event.decision)}
                                {event.risk_decision && (
                                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                                    {event.risk_decision}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                <span>{formatTimestamp(event.timestamp)}</span>
                                {event.coherence_score !== null && (
                                  <span className="text-cyan-400">C: {(event.coherence_score * 100).toFixed(0)}%</span>
                                )}
                                {event.verification_score !== null && (
                                  <span className="text-purple-400">V: {(event.verification_score * 100).toFixed(0)}%</span>
                                )}
                              </div>
                              {event.request_id && (
                                <div className="text-xs text-gray-600 font-mono mt-1 truncate">
                                  {event.request_id}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SynthReport;