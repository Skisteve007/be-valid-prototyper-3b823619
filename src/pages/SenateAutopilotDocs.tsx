import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Download, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

const ADMIN_EMAILS = [
  'larry@cleancheck.com',
  'larryblankson@gmail.com',
  'jamesumner@gmail.com'
];

const SenateAutopilotDocs = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email && ADMIN_EMAILS.includes(session.user.email)) {
        setIsAdmin(true);
      } else {
        toast.error('Admin access required');
        navigate('/admin/login');
      }
      setIsLoading(false);
    };
    checkAdmin();
  }, [navigate]);

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;
    const lineHeight = 7;
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;

    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SENATE AUTOPILOT INTERNAL', margin, yPosition);
    yPosition += lineHeight * 2;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Status: Internal roadmap (not a promise, not a certification)', margin, yPosition);
    yPosition += lineHeight;
    pdf.text('Default Mode: Async (minutes) with audit logging', margin, yPosition);
    yPosition += lineHeight * 2;

    const sections = [
      { title: 'Goal', content: 'When a challenge arrives, the system automatically routes it through the Senate, resolves contradictions, and presents one final decision from the Judge—without manual copy/paste between models.' },
      { title: 'Minimal Flow (MVP)', content: '1) Intake: Create challenge_id, normalize into ChallengePacket (JSON), store packet + timestamp + constraints.\n\n2) Round 1: Parallel Senators - Send packet to each Senator role with structured output requirements.\n\n3) Contradiction Pass - Detect conflicting claims, generate conflict questions.\n\n4) Round 2: Targeted Responses - Only Senators involved in contradictions respond.\n\n5) Judge Arbitration - Judge outputs final decision, rationale, conditions, and action checklist.\n\n6) Audit Log - Append-only transcript with PII redaction.' },
      { title: 'Guardrails', content: '• No certification claims unless evidenced\n• Fail-closed option: if confidence too low → "defer + gather X"\n• Access control: admin-only viewing of logs & internal docs' },
    ];

    sections.forEach(section => {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(section.title, margin, yPosition);
      yPosition += lineHeight * 1.5;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const lines = pdf.splitTextToSize(section.content, maxWidth);
      lines.forEach((line: string) => {
        if (yPosition > 280) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += lineHeight;
    });

    pdf.save('senate-autopilot-internal.pdf');
    toast.success('PDF downloaded');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Verifying access...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/admin" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
          <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Download as PDF
          </Button>
        </div>

        {/* Document Header */}
        <Card className="bg-slate-900/50 border-slate-700 mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-cyan-400" />
              <h1 className="text-2xl font-bold text-white">SENATE AUTOPILOT INTERNAL</h1>
              <Badge variant="outline" className="text-red-400 border-red-400/50">
                <Lock className="h-3 w-3 mr-1" />
                Admin Only
              </Badge>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <Badge variant="secondary">Status: Internal Roadmap</Badge>
              <Badge variant="secondary">Default Mode: Async (minutes)</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Document Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-bold text-cyan-400 border-b border-slate-700 pb-2">Goal</h2>
            <p className="text-slate-300 leading-relaxed">
              When a challenge arrives, the system automatically routes it through the Senate, resolves contradictions, 
              and presents one final decision from the Judge—without manual copy/paste between models.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-cyan-400 border-b border-slate-700 pb-2">Minimal Flow (MVP)</h2>
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="font-semibold text-white mb-2">1) Intake</h3>
                <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                  <li>Create <code className="bg-slate-700 px-1 rounded">challenge_id</code></li>
                  <li>Normalize into a canonical <code className="bg-slate-700 px-1 rounded">ChallengePacket</code> (JSON)</li>
                  <li>Store packet + timestamp + constraints</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="font-semibold text-white mb-2">2) Round 1: Parallel Senators</h3>
                <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                  <li>Send packet to each Senator role</li>
                  <li>Require structured output: Claims, Assumptions, Evidence Needed, Risks, Recommendation, Confidence (0–1)</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="font-semibold text-white mb-2">3) Contradiction Pass</h3>
                <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                  <li>Detect conflicting claims</li>
                  <li>Generate a small set of "conflict questions"</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="font-semibold text-white mb-2">4) Round 2: Targeted Responses</h3>
                <p className="text-slate-300 text-sm">Only the Senators involved in contradictions respond</p>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="font-semibold text-white mb-2">5) Judge Arbitration</h3>
                <p className="text-slate-300 text-sm mb-2">Judge receives: summaries + contradictions + dissent</p>
                <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                  <li>Final Decision</li>
                  <li>Rationale</li>
                  <li>Conditions / Guardrails</li>
                  <li>What would change the decision</li>
                  <li>Action checklist</li>
                </ul>
              </div>

              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <h3 className="font-semibold text-white mb-2">6) Audit Log</h3>
                <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                  <li>Append-only transcript: packets, outputs, judge decision, timestamps</li>
                  <li>Redact secrets/PII by policy</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-cyan-400 border-b border-slate-700 pb-2">Guardrails</h2>
            <ul className="text-slate-300 space-y-2 list-disc list-inside">
              <li>No certification claims unless evidenced (SOC2/HIPAA/etc.)</li>
              <li>Fail-closed option: if confidence too low → "defer + gather X"</li>
              <li>Access control: admin-only viewing of logs & internal docs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-cyan-400 border-b border-slate-700 pb-2">Implementation Notes (non-binding)</h2>
            <ul className="text-slate-300 space-y-2 list-disc list-inside">
              <li>Central Orchestrator service (recommended) calls model APIs</li>
              <li>Store transcripts in DB (or object storage) with retention controls</li>
              <li>Provide an admin UI route: <code className="bg-slate-700 px-1 rounded">/synth/docs/senate-autopilot</code> rendering this doc</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SenateAutopilotDocs;
