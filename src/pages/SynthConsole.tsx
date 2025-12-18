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
  BookOpen
} from 'lucide-react';

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

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'RELEASE_FULL': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'RELEASE_SAFE_PARTIAL': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'HUMAN_REVIEW_REQUIRED': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'REFUSE': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>SYNTH™ Console | Digital Auditor</title>
        <meta name="description" content="SYNTH™ AI audit console - test prompts through the sanitize, debate, judge, verify pipeline" />
      </Helmet>

      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">SYNTH™ Console</h1>
                <p className="text-xs text-muted-foreground">Digital Auditor</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/synth')}>
              <Brain className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/synth/logs')}>
              <History className="w-4 h-4 mr-2" />
              Logs
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/synth/docs')}>
              <BookOpen className="w-4 h-4 mr-2" />
              Docs
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/synth/policies')}>
              <Shield className="w-4 h-4 mr-2" />
              Policies
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Audit Prompt
                </CardTitle>
                <CardDescription>
                  Paste any prompt to run it through the SYNTH™ pipeline
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter the prompt you want to audit..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[200px] font-mono text-sm"
                />
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Select value={userRole} onValueChange={setUserRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="User Role (optional)" />
                      </SelectTrigger>
                      <SelectContent>
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
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Pipeline Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  {['Classify', 'Sanitize', 'Debate', 'Judge', 'Verify', 'Log'].map((step, i) => (
                    <React.Fragment key={step}>
                      <div className={`px-2 py-1 rounded text-xs ${
                        isLoading 
                          ? 'bg-purple-500/20 text-purple-400 animate-pulse' 
                          : result 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {step}
                      </div>
                      {i < 5 && <span className="text-muted-foreground">→</span>}
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
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge className={`text-base px-4 py-2 ${getDecisionColor(result.decision)}`}>
                          {getDecisionIcon(result.decision)}
                          <span className="ml-2">{result.decision.replace(/_/g, ' ')}</span>
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Risk: {result.risk_decision}
                        </Badge>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>Coherence: <span className="text-foreground font-mono">{(result.coherence_score * 100).toFixed(0)}%</span></div>
                        <div>Verification: <span className="text-foreground font-mono">{(result.verification_score * 100).toFixed(0)}%</span></div>
                      </div>
                    </div>
                    
                    {result.redaction_summary.entities_redacted > 0 && (
                      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-sm">
                        <Shield className="w-4 h-4 inline mr-2 text-yellow-400" />
                        {result.redaction_summary.entities_redacted} entities redacted
                        {result.redaction_summary.pii_detected && ' (PII detected)'}
                        {result.redaction_summary.phi_detected && ' (PHI detected)'}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tabbed Results */}
                <Card>
                  <CardContent className="pt-6">
                    <Tabs defaultValue="answer">
                      <TabsList className="grid grid-cols-5 mb-4">
                        <TabsTrigger value="answer">Answer</TabsTrigger>
                        <TabsTrigger value="risks">Risks</TabsTrigger>
                        <TabsTrigger value="claims">Claims</TabsTrigger>
                        <TabsTrigger value="contradictions">Issues</TabsTrigger>
                        <TabsTrigger value="raw">Raw</TabsTrigger>
                      </TabsList>

                      <TabsContent value="answer" className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm whitespace-pre-wrap">{result.final_answer}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(result.final_answer)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Safe Answer
                        </Button>
                      </TabsContent>

                      <TabsContent value="risks">
                        {result.risks.length > 0 ? (
                          <ul className="space-y-2">
                            {result.risks.map((risk, i) => (
                              <li key={i} className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm">
                                <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                                {risk}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground text-sm">No risks identified</p>
                        )}
                      </TabsContent>

                      <TabsContent value="claims">
                        {result.claims.length > 0 ? (
                          <div className="space-y-2">
                            {result.claims.map((claim, i) => (
                              <div key={i} className="p-3 border rounded-lg text-sm">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium">{claim.claim}</span>
                                  <Badge variant={
                                    claim.status === 'SUPPORTED' ? 'default' :
                                    claim.status === 'CONTRADICTED' ? 'destructive' : 'secondary'
                                  } className="text-xs">
                                    {claim.status}
                                  </Badge>
                                </div>
                                {claim.notes && <p className="text-muted-foreground text-xs">{claim.notes}</p>}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">No claims extracted</p>
                        )}
                      </TabsContent>

                      <TabsContent value="contradictions">
                        {result.contradictions.length > 0 ? (
                          <ul className="space-y-2">
                            {result.contradictions.map((c, i) => (
                              <li key={i} className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg text-sm">
                                {c}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-muted-foreground text-sm">No contradictions detected</p>
                        )}
                      </TabsContent>

                      <TabsContent value="raw">
                        <pre className="p-4 bg-muted/50 rounded-lg overflow-auto text-xs max-h-[400px]">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="mt-2"
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
              <Card className="h-full min-h-[400px] flex items-center justify-center">
                <CardContent className="text-center text-muted-foreground">
                  <Brain className="w-16 h-16 mx-auto mb-4 opacity-20" />
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

export default SynthConsole;
