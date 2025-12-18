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
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>SYNTH™ API Documentation | Developer Guide</title>
        <meta name="description" content="Complete API documentation for SYNTH™ - the AI audit gateway with sanitize, debate, judge, verify pipeline" />
      </Helmet>

      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/synth')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">SYNTH™ API Docs</h1>
                <p className="text-xs text-muted-foreground">Developer Reference</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Overview
            </CardTitle>
            <CardDescription>
              SYNTH™ is an AI governance gateway that audits prompts through a multi-step pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Classify', 'Sanitize', 'Debate', 'Judge', 'Verify', 'Log'].map((step, i) => (
                <React.Fragment key={step}>
                  <Badge variant="secondary" className="px-3 py-1">{step}</Badge>
                  {i < 5 && <span className="text-muted-foreground self-center">→</span>}
                </React.Fragment>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Every prompt is classified for risk, sanitized to remove PII/PHI, debated by three AI agents
              (Skeptic, Optimist, Fact-checker), judged for coherence and contradictions, verified against
              policies, and logged for audit compliance.
            </p>
          </CardContent>
        </Card>

        {/* Endpoint */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-400" />
              Endpoint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg font-mono text-sm">
              <Badge className="bg-green-500/20 text-green-400">POST</Badge>
              <span>/functions/v1/synth-audit</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto"
                onClick={() => copyToClipboard(`${window.location.origin}/functions/v1/synth-audit`)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Request/Response */}
        <Tabs defaultValue="request" className="mb-8">
          <TabsList>
            <TabsTrigger value="request">Request</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="curl">cURL Example</TabsTrigger>
          </TabsList>

          <TabsContent value="request">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Request Body (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 bg-muted/50 rounded-lg overflow-auto text-sm font-mono">
                    {requestExample}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(requestExample)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="response">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Response Body (JSON)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 bg-muted/50 rounded-lg overflow-auto text-sm font-mono max-h-[500px]">
                    {responseExample}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(responseExample)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curl">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">cURL Example</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="p-4 bg-muted/50 rounded-lg overflow-auto text-sm font-mono whitespace-pre-wrap">
                    {curlExample}
                  </pre>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2"
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
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              Decision Types
            </CardTitle>
            <CardDescription>
              Understanding the possible audit outcomes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <Badge className="bg-green-500/20 text-green-400">RELEASE_FULL</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Prompt passed all checks. Safe to release the full response with no modifications.
                Coherence ≥ 85%, Verification ≥ 90%, no contradictions.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-yellow-400" />
                <Badge className="bg-yellow-500/20 text-yellow-400">RELEASE_SAFE_PARTIAL</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Prompt contained PII/PHI that was redacted. Response is safe but some information
                was sanitized. Original entities replaced with [REDACTED_*] tokens.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <Badge className="bg-orange-500/20 text-orange-400">HUMAN_REVIEW_REQUIRED</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Agents disagree (coherence &lt; 85%) or claims are unverified (verification &lt; 90%).
                Response should not be auto-released. Escalate to human moderator.
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <Badge className="bg-red-500/20 text-red-400">REFUSE</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Prompt contains prohibited content or triggers a BLOCK risk classification.
                No response is generated. Request is logged for security review.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Scoring Thresholds */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-purple-400" />
              Scoring Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Score</th>
                    <th className="text-left py-2 font-medium">Threshold</th>
                    <th className="text-left py-2 font-medium">Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">Coherence Score</td>
                    <td className="py-2 font-mono">≥ 0.85</td>
                    <td className="py-2 text-muted-foreground">Below triggers HUMAN_REVIEW_REQUIRED</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Verification Score</td>
                    <td className="py-2 font-mono">≥ 0.90</td>
                    <td className="py-2 text-muted-foreground">Below triggers HUMAN_REVIEW_REQUIRED</td>
                  </tr>
                  <tr>
                    <td className="py-2">Risk Classification</td>
                    <td className="py-2 font-mono">BLOCK</td>
                    <td className="py-2 text-muted-foreground">Immediately returns REFUSE</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pipeline Details */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">1. Risk Classification</h4>
              <p className="text-sm text-muted-foreground">
                Prompts are classified as ALLOW, RESTRICT, or BLOCK based on content patterns.
                BLOCK immediately refuses. RESTRICT triggers extra verification.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">2. Sanitization</h4>
              <p className="text-sm text-muted-foreground">
                PII (emails, phones, SSNs, credit cards) and PHI (DOBs, medical IDs) are detected
                and replaced with [REDACTED_*] tokens. Original data is never stored.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">3. Multi-Agent Debate</h4>
              <p className="text-sm text-muted-foreground">
                Three AI agents process the prompt in parallel: Skeptic (risks), Optimist (helpful answer),
                Fact-checker (claim verification). Their outputs inform the final decision.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">4. Judge</h4>
              <p className="text-sm text-muted-foreground">
                A judge model reviews all agent outputs, detects contradictions, calculates coherence,
                and decides RELEASE or MISTRIAL.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">5. Verification Gate</h4>
              <p className="text-sm text-muted-foreground">
                Final policy checks ensure thresholds are met. Low scores trigger human review.
                All decisions are enforced deterministically.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">6. Flight Recorder</h4>
              <p className="text-sm text-muted-foreground">
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
