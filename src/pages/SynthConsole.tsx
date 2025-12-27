import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Brain, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Copy,
  FileText,
  History,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { SteveOwnerGate } from '@/components/SteveOwnerGate';

interface AuditResult {
  request_id: string;
  decision: string;
  risk_decision: string;
  coherence_score: number;
  verification_score: number;
  redaction_summary: {
    pii_detected: boolean;
    phi_detected: boolean;
    entities_redacted: number;
  };
  risks: string[];
  claims: Array<{ claim: string; status: string; notes: string }>;
  contradictions: string[];
  final_answer: string;
}

const SynthConsole: React.FC = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleAudit = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt to audit');
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('synth-audit', {
        body: {
          prompt: prompt.trim(),
          user_role: userRole || undefined,
          metadata: { source: 'console' }
        }
      });

      if (error) throw error;
      
      setResult(data);
      toast.success('Audit complete');
    } catch (error) {
      console.error('Audit error:', error);
      toast.error('Audit failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getDecisionBadgeClass = (decision: string) => {
    switch (decision) {
      case 'RELEASE_FULL': return 'synth-badge-release';
      case 'RELEASE_SAFE_PARTIAL': return 'synth-badge-partial';
      case 'HUMAN_REVIEW_REQUIRED': return 'synth-badge-review';
      case 'REFUSE': return 'synth-badge-refuse';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getDecisionIcon = (decision: string) => {
    switch (decision) {
      case 'RELEASE_FULL': return <CheckCircle className="w-5 h-5" />;
      case 'RELEASE_SAFE_PARTIAL': return <Shield className="w-5 h-5" />;
      case 'HUMAN_REVIEW_REQUIRED': return <Clock className="w-5 h-5" />;
      case 'REFUSE': return <XCircle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 0.85) return 'synth-score-high';
    if (score >= 0.6) return 'synth-score-medium';
    return 'synth-score-low';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="min-h-screen synth-bg">
      <Helmet>
        <title>SYNTH™ Console | Digital Auditor</title>
        <meta name="description" content="SYNTH™ AI audit console - test prompts through the sanitize, debate, judge, verify pipeline" />
      </Helmet>

      {/* Grid overlay */}
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
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center synth-pulse">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg synth-neon-blue">SYNTH™ Console</h1>
                <p className="text-xs text-gray-400">Digital Auditor</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/synth')} className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent">
              <Brain className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/synth/logs')} className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent">
              <History className="w-4 h-4 mr-2" />
              Logs
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/synth/docs')} className="border-gray-600 text-gray-300 hover:bg-white/10 bg-transparent">
              <BookOpen className="w-4 h-4 mr-2" />
              Docs
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/synth/challenges')} className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 bg-transparent">
              <Sparkles className="w-4 h-4 mr-2" />
              Challenges
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <Card className="synth-card border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  Audit Prompt
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Paste any prompt to run it through the SYNTH™ pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter the prompt you want to audit..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[200px] font-mono text-sm synth-terminal text-gray-200 placeholder:text-gray-500 border-gray-700 focus:border-cyan-500/50"
                />
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Select value={userRole} onValueChange={setUserRole}>
                      <SelectTrigger className="bg-white/5 border-gray-700 text-gray-200">
                        <SelectValue placeholder="User Role (optional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-gray-700">
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleAudit} 
                    disabled={isLoading || !prompt.trim()}
                    className="synth-btn-primary"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Auditing...
                      </>
                    ) : (
                      <>
                        <Brain className="w-4 h-4 mr-2" />
                        Audit
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Pipeline Status */}
            <Card className="synth-card border-0">
              <CardHeader>
                <CardTitle className="text-sm text-white">Pipeline Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  {['Classify', 'Sanitize', 'Debate', 'Judge', 'Verify', 'Log'].map((step, i) => (
                    <React.Fragment key={step}>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        isLoading 
                          ? 'bg-cyan-500/20 text-cyan-400 animate-pulse' 
                          : result 
                            ? 'synth-badge-release' 
                            : 'bg-gray-700/50 text-gray-400'
                      }`}>
                        {step}
                      </div>
                      {i < 5 && <span className="text-gray-600">→</span>}
                    </React.Fragment>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {result ? (
              <>
                {/* Decision Badge */}
                <Card className="synth-card border-0">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`text-base px-4 py-2 rounded-full flex items-center gap-2 ${getDecisionBadgeClass(result.decision)}`}>
                          {getDecisionIcon(result.decision)}
                          <span className="font-semibold">{result.decision.replace(/_/g, ' ')}</span>
                        </div>
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                          Risk: {result.risk_decision}
                        </Badge>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-400">
                          Coherence: <span className={`font-mono font-bold ${getScoreClass(result.coherence_score)}`}>{(result.coherence_score * 100).toFixed(0)}%</span>
                        </div>
                        <div className="text-gray-400">
                          Verification: <span className={`font-mono font-bold ${getScoreClass(result.verification_score)}`}>{(result.verification_score * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {result.redaction_summary.entities_redacted > 0 && (
                      <div className="mt-4 p-3 synth-badge-partial rounded-lg text-sm">
                        <Shield className="w-4 h-4 inline mr-2" />
                        {result.redaction_summary.entities_redacted} entities redacted
                        {result.redaction_summary.pii_detected && ' (PII detected)'}
                        {result.redaction_summary.phi_detected && ' (PHI detected)'}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tabbed Results */}
                <Card className="synth-card border-0">
                  <CardContent className="pt-6">
                    <Tabs defaultValue="answer">
                      <TabsList className="grid grid-cols-5 mb-4 bg-white/5">
                        <TabsTrigger value="answer" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">Answer</TabsTrigger>
                        <TabsTrigger value="risks" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">Risks</TabsTrigger>
                        <TabsTrigger value="claims" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">Claims</TabsTrigger>
                        <TabsTrigger value="contradictions" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-400">Issues</TabsTrigger>
                        <TabsTrigger value="raw" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">Raw</TabsTrigger>
                      </TabsList>

                      <TabsContent value="answer" className="space-y-4">
                        <div className="p-4 synth-terminal rounded-lg">
                          <p className="text-sm whitespace-pre-wrap text-gray-200">{result.final_answer}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(result.final_answer)}
                          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Safe Answer
                        </Button>
                      </TabsContent>

                      <TabsContent value="risks">
                        {result.risks.length > 0 ? (
                          <ul className="space-y-2">
                            {result.risks.map((risk, i) => (
                              <li key={i} className="flex items-start gap-2 p-3 synth-badge-refuse rounded-lg text-sm">
                                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                                {risk}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400 text-sm">No risks identified</p>
                        )}
                      </TabsContent>

                      <TabsContent value="claims">
                        {result.claims.length > 0 ? (
                          <div className="space-y-2">
                            {result.claims.map((claim, i) => (
                              <div key={i} className="p-3 border border-gray-700 rounded-lg text-sm bg-white/5">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-gray-200">{claim.claim}</span>
                                  <Badge className={
                                    claim.status === 'SUPPORTED' ? 'synth-badge-release' :
                                    claim.status === 'CONTRADICTED' ? 'synth-badge-refuse' : 'synth-badge-partial'
                                  }>
                                    {claim.status}
                                  </Badge>
                                </div>
                                {claim.notes && <p className="text-gray-400 text-xs">{claim.notes}</p>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 text-sm">No claims extracted</p>
                        )}
                      </TabsContent>

                      <TabsContent value="contradictions">
                        {result.contradictions.length > 0 ? (
                          <ul className="space-y-2">
                            {result.contradictions.map((c, i) => (
                              <li key={i} className="p-3 synth-badge-review rounded-lg text-sm">
                                {c}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-400 text-sm">No contradictions detected</p>
                        )}
                      </TabsContent>

                      <TabsContent value="raw">
                        <pre className="p-4 synth-terminal rounded-lg overflow-auto text-xs max-h-[400px] text-gray-300">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="mt-2 border-purple-500/50 text-purple-400 hover:bg-purple-500/10 bg-transparent"
                          onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy JSON
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="synth-card border-0 h-full min-h-[400px] flex items-center justify-center">
                <CardContent className="text-center text-gray-400">
                  <Brain className="w-16 h-16 mx-auto mb-4 opacity-20 text-cyan-400" />
                  <p>Enter a prompt and click Audit to see results</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Wrap with SteveOwnerGate for Tier-0 access control
const SynthConsoleProtected = () => (
  <SteveOwnerGate>
    <SynthConsole />
  </SteveOwnerGate>
);

export default SynthConsoleProtected;
