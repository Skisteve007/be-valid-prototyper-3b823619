import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Shield, Download, ArrowLeft, FileText, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";

const securityContent = `## 0) Purpose (Why this exists)
This document defines what we **do**, what we **do not claim**, and what we are **building toward** so that:
- investor / enterprise diligence questions have consistent answers,
- we avoid overstatement ("HIPAA-compliant", "we store nothing", etc.),
- we reduce legal and reputational risk during outbound enterprise conversations.

## 1) Truth-in-Claims Policy (Non‑negotiable)
We do **not** claim certifications or regulatory compliance unless we can evidence it.
Examples:
- Do NOT say "HIPAA compliant" unless we have a signed BAA and defined PHI controls.
- Do NOT say "SOC 2 Type II" unless audited and report exists.
- Do NOT say "patented" unless issued. Use "patent-pending" only if filed.

Approved phrasing:
- "privacy by design"
- "data minimization"
- "bank-grade roadmap / enterprise-ready architecture path"
- "prototype with security controls appropriate for current stage"

## 2) Data Lifecycle & Retention (Answer before anyone asks)
We explicitly define retention for:
A) **PII / identity artifacts** (if collected)  
B) **verification outputs** (e.g. pass/fail / tiered status)  
C) **transaction metadata** (timestamps, device, scan events)  
D) **audit logs**

### 2.1 Default Retention Targets (can be configured per customer/region)
- **PII / raw documents:** minimize; retain only as required for verification workflow.  
- **Verification result token metadata:** retain only what is necessary to prove a valid verification state.  
- **Scan events / transactional metadata:** retain for **X days** (default: 30) for fraud & dispute resolution.  
- **Security audit logs (admin access, key events):** retain for **Y days** (default: 90–180) subject to legal requirements.

### 2.2 Deletion & Purge
- Automated purge jobs must exist for metadata beyond retention windows.
- Deletion events should be logged (without retaining deleted content).
- Any exception requires explicit documented approval.

## 3) Token/QR Security Model (Stop screenshot replay)
### 3.1 Threat
Static QR codes can be copied (screenshots) and replayed.

### 3.2 Required Controls (roadmap items are allowed—label them)
- **Ephemeral token** (short TTL) OR **nonce challenge** during scan.
- **One-time-use** option for high-risk flows.
- **Digital signatures**: tokens must be signed server-side; scanners verify signature.
- **Server-side invalidation** after scan (optional mode).

## 4) Dependency & Fallback Plan (No single point of failure)
We depend on external sources (labs, IDV vendors). Diligence questions must be answered:

### 4.1 Failure Modes
- Vendor API down
- Vendor false negative/positive
- Vendor SLA breach / region outage
- Data quality degradation

### 4.2 Graceful Degradation
Approved fallback behaviors:
- "Last-known-good verification" only if timestamped + expired clearly.
- "Verification unavailable" fail-closed mode for high-risk venues.
- Queue + retry with user-visible status for consumer flows.

We do not promise 100% uptime without contracted SLAs.

## 5) Insider Threat + Human Layer (Fourth Ring)
We explicitly address:
- least privilege / RBAC for staff,
- privileged access logging,
- separate prod vs dev environments,
- break-glass access with approvals,
- phishing-resistant admin auth (MFA required),
- documented incident response runbooks + breach drills.

## 6) Key Management & Signing
- Private signing keys should be stored in managed KMS/HSM where possible.
- No private keys in client apps or public repos.
- Secret scanning + mandatory MFA for GitHub org/repo access.
- Rotate keys on schedule; log key usage.

## 7) Compliance Roadmap (Transparent and timeboxed)
This is a roadmap, not a claim:
- SOC 2 Type I → Type II
- Pen test cadence (e.g., annual + before major launches)
- HIPAA posture (only if/when PHI is processed; BAA required)
- GDPR readiness (DPA templates, deletion rights, export)

## 8) Enterprise Deployment Posture
Supported / planned options:
- Vercel/managed cloud for early stage
- Phase 2: VPC deployment
- Phase 3: hybrid/on‑prem for regulated clients

## 9) Patent Positioning (Do not oversell)
We separate:
- what is standard (QR + hashes) vs
- what is novel (multi-party arbitration, contradiction resolution, ephemeral signed token chaining, auditable dissent logs).

We only use "patent-pending" if filed.

## 10) Required Disclaimers (Use in decks, demos, meetings)
- "This is a prototype / early-stage system."
- "No regulatory compliance is claimed unless explicitly stated with evidence."
- "This is not legal advice."
- "We can support regulated deployments via VPC/on‑prem roadmap and third-party security validation."`;

const AdminSecurityPositioning = () => {
  const navigate = useNavigate();
  const { isAdmin, loading } = useIsAdmin();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/admin/login");
    }
  }, [loading, isAdmin, navigate]);

  const handleDownloadPdf = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("SECURITY, PRIVACY & DILIGENCE POSITIONING", 20, 20);
    doc.setFontSize(10);
    doc.text("Document ID: SEC-POS-001", 20, 30);
    doc.text("Status: Internal Working Draft (Not a certification)", 20, 36);
    doc.text("Last Updated: 2025-12-23", 20, 42);
    doc.text("Owner: Founder / Security Lead", 20, 48);
    doc.text("Scope: Project VALID + AI Senate (prototype → enterprise readiness)", 20, 54);
    
    doc.setFontSize(12);
    let y = 70;
    const lines = securityContent.split('\n');
    
    for (const line of lines) {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      
      if (line.startsWith('## ')) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.text(line.replace('## ', ''), 20, y);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        y += 8;
      } else if (line.startsWith('### ')) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(line.replace('### ', ''), 20, y);
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        y += 7;
      } else if (line.startsWith('- ')) {
        const text = line.replace('- ', '• ');
        const splitText = doc.splitTextToSize(text, 170);
        doc.text(splitText, 25, y);
        y += splitText.length * 5;
      } else if (line.trim()) {
        const splitText = doc.splitTextToSize(line.replace(/\*\*/g, ''), 170);
        doc.text(splitText, 20, y);
        y += splitText.length * 5;
      } else {
        y += 3;
      }
    }
    
    doc.save("Security-Positioning-Internal.pdf");
  };

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let listItems: string[] = [];
    
    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 mb-4 text-muted-foreground">
            {listItems.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
            ))}
          </ul>
        );
        listItems = [];
      }
    };
    
    lines.forEach((line, index) => {
      if (line.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-xl font-bold text-foreground mt-8 mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-lg font-semibold text-foreground mt-6 mb-3">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        listItems.push(line.replace('- ', ''));
      } else if (line.trim()) {
        flushList();
        elements.push(
          <p key={index} className="text-muted-foreground mb-3" dangerouslySetInnerHTML={{ 
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') 
          }} />
        );
      }
    });
    
    flushList();
    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Security Positioning | Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate("/deal-room")}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Deal Room
              </Button>
              <Button
                onClick={handleDownloadPdf}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download as PDF
              </Button>
            </div>
          </div>

          {/* Document Header Card */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Security, Privacy & Diligence Positioning
                  </CardTitle>
                  <p className="text-muted-foreground text-sm">Internal Documentation</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="gap-1">
                  <FileText className="h-3 w-3" />
                  SEC-POS-001
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Internal Working Draft
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  2025-12-23
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <User className="h-3 w-3" />
                  Founder / Security Lead
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Scope:</strong> Project VALID + AI Senate (prototype → enterprise readiness)
              </p>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Document Content */}
          <Card>
            <CardContent className="pt-6">
              <div className="prose prose-invert max-w-none">
                {renderMarkdown(securityContent)}
              </div>
              
              <Separator className="my-8" />
              
              <p className="text-center text-muted-foreground text-sm font-medium">
                — End of Internal Policy —
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminSecurityPositioning;
