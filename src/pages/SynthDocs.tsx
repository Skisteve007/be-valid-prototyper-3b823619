import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Brain, 
  Copy,
  Code,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';

const SynthDocs: React.FC = () => {
  const navigate = useNavigate();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const curlExample = `curl -X POST "${window.location.origin}/functions/v1/synth-audit" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_ANON_KEY" \\
  -d '{
    "prompt": "What are the side effects of aspirin?",
    "user_role": "user",
    "metadata": {
      "source": "api",
      "session_id": "optional-session-id"
    }
  }'`;

  const requestExample = `{
  "prompt": "string (required) - The prompt to audit",
  "user_role": "string (optional) - User role context",
  "metadata": {
    "source": "console | extension | api",
    "session_id": "string (optional)"
  }
}`;

  const responseExample = `{
  "request_id": "synth_1702934567_abc123",
  "decision": "RELEASE_FULL | RELEASE_SAFE_PARTIAL | REFUSE | HUMAN_REVIEW_REQUIRED",
  "risk_decision": "ALLOW | RESTRICT | BLOCK",
  "coherence_score": 0.92,
  "verification_score": 0.88,
  "redaction_summary": {
    "pii_detected": false,
    "phi_detected": false,
    "entities_redacted": 0
  },
  "risks": [
    "Medical topic requires disclaimer"
  ],
  "claims": [
    {
      "claim": "Aspirin can cause stomach bleeding",
      "status": "SUPPORTED",
      "notes": "Well-documented side effect"
    }
  ],
  "contradictions": [],
  "final_answer": "Aspirin may cause side effects including..."
}`;

  return (
    <div className="min-h-screen synth-bg">
      <Helmet>
        <title>SYNTH™ API Documentation | Developer Guide</title>
        <meta name="description" content="Complete API documentation for SYNTH™ - the AI audit gateway with sanitize, debate, judge, verify pipeline" />
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
                <h1 className="font-bold text-lg synth-neon-blue">SYNTH™ API Docs</h1>
                <p className="text-xs text-gray-400">Developer Reference</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Overview */}
        <Card className="synth-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5 text-cyan-400" />
              Overview
            </CardTitle>
            <CardDescription className="text-gray-400">
              SYNTH™ is an AI governance gateway that audits prompts through a multi-step pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Classify', 'Sanitize', 'Debate', 'Judge', 'Verify', 'Log'].map((step, i) => (
                <React.Fragment key={step}>
                  <Badge className="synth-badge-release px-3 py-1">{step}</Badge>
                  {i < 5 && <span className="text-gray-500 self-center">→</span>}
                </React.Fragment>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              Every prompt is classified for risk, sanitized to remove PII/PHI, debated by three AI agents
              (Skeptic, Optimist, Fact-checker), judged for coherence and contradictions, verified against
              policies, and logged for audit compliance.
            </p>
          </CardContent>
        </Card>

        {/* Endpoint */}
        <Card className="synth-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Code className="w-5 h-5 text-cyan-400" />
              Endpoint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-4 synth-terminal rounded-lg font-mono text-sm">
              <Badge className="synth-badge-release">POST</Badge>
              <span className="text-gray-300">/functions/v1/synth-audit</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-cyan-400 hover:bg-cyan-500/10"
                onClick={() => copyToClipboard(`${window.location.origin}/functions/v1/synth-audit`)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Request/Response */}
        <Tabs defaultValue="request" className="mb-8">
          <TabsList className="bg-white/5">
            <TabsTrigger value="request" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">Request</TabsTrigger>
            <TabsTrigger value="response" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">Response</TabsTrigger>
            <TabsTrigger value="curl" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">cURL Example</TabsTrigger>
          </TabsList>

          <TabsContent value="request">
            <Card className="synth-card border-0">
              <CardHeader>
                <CardTitle className="text-sm text-white">Request Body (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 synth-terminal rounded-lg overflow-auto text-sm font-mono text-gray-300">
                    {requestExample}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 text-cyan-400 hover:bg-cyan-500/10"
                    onClick={() => copyToClipboard(requestExample)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="response">
            <Card className="synth-card border-0">
              <CardHeader>
                <CardTitle className="text-sm text-white">Response Body (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 synth-terminal rounded-lg overflow-auto text-sm font-mono max-h-[500px] text-gray-300">
                    {responseExample}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 text-cyan-400 hover:bg-cyan-500/10"
                    onClick={() => copyToClipboard(responseExample)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curl">
            <Card className="synth-card border-0">
              <CardHeader>
                <CardTitle className="text-sm text-white">cURL Example</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 synth-terminal rounded-lg overflow-auto text-sm font-mono whitespace-pre-wrap text-gray-300">
                    {curlExample}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 text-cyan-400 hover:bg-cyan-500/10"
                    onClick={() => copyToClipboard(curlExample)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Decision Types */}
        <Card className="synth-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-cyan-400" />
              Decision Types
            </CardTitle>
            <CardDescription className="text-gray-400">
              Understanding the possible audit outcomes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border border-cyan-500/30 rounded-lg bg-cyan-500/5">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                <span className="synth-badge-release px-2 py-0.5 rounded-full text-sm">RELEASE_FULL</span>
              </div>
              <p className="text-sm text-gray-400">
                Prompt passed all checks. Safe to release the full response with no modifications.
                Coherence ≥ 85%, Verification ≥ 90%, no contradictions.
              </p>
            </div>

            <div className="p-4 border border-amber-500/30 rounded-lg bg-amber-500/5">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <span className="synth-badge-partial px-2 py-0.5 rounded-full text-sm">RELEASE_SAFE_PARTIAL</span>
              </div>
              <p className="text-sm text-gray-400">
                Prompt contained PII/PHI that was redacted. Response is safe but some information
                was sanitized. Original entities replaced with [REDACTED_*] tokens.
              </p>
            </div>

            <div className="p-4 border border-orange-500/30 rounded-lg bg-orange-500/5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="synth-badge-review px-2 py-0.5 rounded-full text-sm">HUMAN_REVIEW_REQUIRED</span>
              </div>
              <p className="text-sm text-gray-400">
                Agents disagree (coherence &lt; 85%) or claims are unverified (verification &lt; 90%).
                Response should not be auto-released. Escalate to human moderator.
              </p>
            </div>

            <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/5">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="synth-badge-refuse px-2 py-0.5 rounded-full text-sm">REFUSE</span>
              </div>
              <p className="text-sm text-gray-400">
                Prompt contains prohibited content or triggers a BLOCK risk classification.
                No response is generated. Request is logged for security review.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scoring Thresholds */}
        <Card className="synth-card border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="w-5 h-5 text-cyan-400" />
              Scoring Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 font-medium text-gray-300">Score</th>
                    <th className="text-left py-2 font-medium text-gray-300">Threshold</th>
                    <th className="text-left py-2 font-medium text-gray-300">Behavior</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  <tr className="border-b border-gray-700/50">
                    <td className="py-2">Coherence Score</td>
                    <td className="py-2 font-mono text-cyan-400">≥ 0.85</td>
                    <td className="py-2">Below triggers HUMAN_REVIEW_REQUIRED</td>
                  </tr>
                  <tr className="border-b border-gray-700/50">
                    <td className="py-2">Verification Score</td>
                    <td className="py-2 font-mono text-cyan-400">≥ 0.90</td>
                    <td className="py-2">Below triggers HUMAN_REVIEW_REQUIRED</td>
                  </tr>
                  <tr>
                    <td className="py-2">Risk Classification</td>
                    <td className="py-2 font-mono text-red-400">BLOCK</td>
                    <td className="py-2">Immediately returns REFUSE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Details */}
        <Card className="synth-card border-0">
          <CardHeader>
            <CardTitle className="text-white">Pipeline Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-2 text-cyan-400">1. Risk Classification</h4>
              <p className="text-sm text-gray-400">
                Prompts are classified as ALLOW, RESTRICT, or BLOCK based on content patterns.
                BLOCK immediately refuses. RESTRICT triggers extra verification.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-cyan-400">2. Sanitization</h4>
              <p className="text-sm text-gray-400">
                PII (emails, phones, SSNs, credit cards) and PHI (DOBs, medical IDs) are detected
                and replaced with [REDACTED_*] tokens. Original data is never stored.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-cyan-400">3. Multi-Agent Debate</h4>
              <p className="text-sm text-gray-400">
                Three AI agents process the prompt in parallel: Skeptic (risks), Optimist (helpful answer),
                Fact-checker (claim verification). Their outputs inform the final decision.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-cyan-400">4. Judge</h4>
              <p className="text-sm text-gray-400">
                A judge model reviews all agent outputs, detects contradictions, calculates coherence,
                and decides RELEASE or MISTRIAL.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-cyan-400">5. Verification Gate</h4>
              <p className="text-sm text-gray-400">
                Final policy checks ensure thresholds are met. Low scores trigger human review.
                All decisions are enforced deterministically.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 text-cyan-400">6. Flight Recorder</h4>
              <p className="text-sm text-gray-400">
                Every audit is logged with request_id, scores, decision, and hashed prompt/answer.
                Logs are exportable for compliance audits.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SynthDocs;
