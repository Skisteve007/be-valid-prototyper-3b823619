import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Copy, Check, Mail, FileText, CreditCard, Loader2, Shield, PenLine } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from "@stripe/stripe-js";
import { BADGE_CONFIG, getBadgeDisplayName } from "@/config/badgeConfig";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

interface AgreementData {
  tierLabel: string;
  includedQueries: number;
  includedGhostPassScans: number;
  ghostPassRate: number;
  includedPorts: number;
  portOverageRate: number;
  verificationEnabled: boolean;
  usersGoverned: number;
  platformFee: number;
  perUserRate: number;
  anchor: number;
  queryOverage: number;
  ghostPassOverage: number;
  verificationCost: number;
  portOverage: number;
  riskMultiplier: number;
  totalMonthly: number;
}

interface ServiceAgreementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: AgreementData;
}

export function ServiceAgreementDialog({ open, onOpenChange, data }: ServiceAgreementDialogProps) {
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<'review' | 'sign' | 'pay'>('review');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerTitle, setCustomerTitle] = useState('');
  
  // Signature
  const [signatureText, setSignatureText] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPayment, setAgreedToPayment] = useState(false);
  
  // Email share
  const [vendorEmail, setVendorEmail] = useState('');

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${Math.round(amount).toLocaleString()}`;
  };

  const effectiveDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const agreementText = `
GIANT VENTURES LLC SERVICE AGREEMENT
=====================================================

This Service Agreement ("Agreement") is entered into as of ${effectiveDate} ("Effective Date") between Giant Ventures LLC ("Provider") and the Client ("Customer"). This Agreement outlines the terms and conditions under which Giant Ventures LLC will provide governance, security, and platform services as defined herein.

═══════════════════════════════════════════════════════
1. DEFINITIONS
═══════════════════════════════════════════════════════

1.1 "Platform": The governance infrastructure provided by Giant Ventures LLC, including but not limited to data pipelines, Ghost Pass QR scans, Senate Queries, and ports selected by the Customer.

1.2 "Senate Queries": AI governance rules and tasks processed within the platform.

1.3 "Ghost Pass": QR validation services provided as part of the Ghost ecosystem.

1.4 "Ports": Connections to external systems, including but not limited to CRMs, ticketing systems, and data repositories.

1.5 "Source of Truth": The Customer-managed systems and data external to the Platform that form the source of master data.

1.6 "Effective Date": The date on which this Agreement is executed or services begin, whichever is earlier.

═══════════════════════════════════════════════════════
2. SERVICES PROVIDED
═══════════════════════════════════════════════════════

2.1 Scope of Services:
   • Provider shall offer governance services, Ghost Pass QR code scanning, Senate Queries, and connectivity via Ports as per the Customer-selected pricing tier (details in Appendix A).
   • The Platform is a conduit for governance and data handling. It is not a data vault, storage service, or master data repository.
   • Provider complies with all applicable cybersecurity and data protection standards, including but not limited to ISO/IEC 27001, NIST, and GDPR.

2.2 Customizations:
   • Additional ports, queries, scans, or services beyond the selected tier shall incur overage costs as detailed in Appendix A.

═══════════════════════════════════════════════════════
3. CUSTOMER RESPONSIBILITIES
═══════════════════════════════════════════════════════

3.1 Source of Truth:
   • The Customer is solely responsible for the accuracy, reliability, and integrity of data from their systems (sources of truth) connected via Ports.
   • The Provider is not responsible for errors originating in the Customer's systems or the misuse of transmitted data.

3.2 Cybersecurity & Compliance:
   • The Customer shall ensure that connected systems adhere to best practices for cybersecurity, including firewalls, encryption, and secure authentication.

3.3 Port Configurations:
   • Correct port configurations are the sole responsibility of the Customer; the Provider assumes no liability for incorrect configurations.

═══════════════════════════════════════════════════════
4. INTELLECTUAL PROPERTY
═══════════════════════════════════════════════════════

4.1 All intellectual property rights in the Platform, architecture, methodologies, software, and governance mechanisms belong to Giant Ventures LLC.

4.2 The Customer may use the Platform during the Term under a non-transferable, non-exclusive license.

4.3 Reverse engineering, replication, or unauthorized use of the Provider's intellectual property is strictly prohibited.

═══════════════════════════════════════════════════════
5. PRICING AND PAYMENT
═══════════════════════════════════════════════════════

5.1 Monthly Price Summary (see Appendix A):
   • Tier: ${data.tierLabel}
   • Platform Fee: ${formatCurrency(data.platformFee)}
   • Per-User Rate: $${data.perUserRate}/user/month
   • Users Governed: ${data.usersGoverned}
   • Subscription Subtotal: ${formatCurrency(data.anchor)}/month
   • Any overages (queries, scans, ports): As per tier rates
   • Risk Multiplier: ×${data.riskMultiplier.toFixed(2)}
   • TOTAL MONTHLY ESTIMATE: ${formatCurrency(data.totalMonthly)}/month

5.2 Payments are due monthly, net 30 from the invoice date.

5.3 Changes in Pricing:
   • The Provider reserves the right to update the pricing upon 60 days' written notice.

═══════════════════════════════════════════════════════
6. SECURITY AND DATA LIMITATIONS
═══════════════════════════════════════════════════════

6.1 Cybersecurity Standards:
   • Provider maintains compliance with major cybersecurity frameworks and certifications.
   • However, Provider does not store or retain customer data. The Platform is designed as a conduit, not a data vault or repository.

6.2 Limitations:
   • If system errors arise from data corruption or integration issues in Customer-managed systems, the Provider is absolved of all liability.

═══════════════════════════════════════════════════════
7. MUTUAL INDEMNIFICATION
═══════════════════════════════════════════════════════

7.1 Customer Indemnity:
   • The Customer agrees to indemnify and hold the Provider harmless against claims arising from improper configuration, the misuse of transmitted data, or operational failures in the Customer's source-of-truth systems.

7.2 Provider Indemnity:
   • The Provider agrees to indemnify and hold the Customer harmless from claims arising from breaches of its intellectual property rights or systemic negligence.

═══════════════════════════════════════════════════════
8. PLATFORM DOWNTIME AND MAINTENANCE
═══════════════════════════════════════════════════════

8.1 Scheduled Maintenance:
   • Provider will schedule maintenance windows during off-peak hours and notify the Customer 72 hours in advance.

8.2 Downtime:
   • The Provider shall make commercially reasonable efforts to maintain 99.5% uptime but cannot guarantee uninterrupted services.

═══════════════════════════════════════════════════════
9. TERMINATION
═══════════════════════════════════════════════════════

9.1 Either party may terminate the Agreement with 30 days' written notice.

9.2 Either party may terminate for cause in the event of a material breach that is not remedied within 15 days of written notice.

═══════════════════════════════════════════════════════
10. CONFIDENTIALITY
═══════════════════════════════════════════════════════

10.1 Both parties agree to protect confidential information disclosed under this Agreement.

═══════════════════════════════════════════════════════
APPENDIX A: MONTHLY PRICING SUMMARY
═══════════════════════════════════════════════════════

Customer's Selected Tier: ${data.tierLabel}

Base Pricing:
  • Platform Fee: ${formatCurrency(data.platformFee)}/month
  • Per-User Rate: $${data.perUserRate}/user/month
  • Users: ${data.usersGoverned}
  • Base Subtotal: ${formatCurrency(data.anchor)}/month

Included Allocations:
  • Senate Queries: ${data.includedQueries === -1 ? '∞' : data.includedQueries.toLocaleString()}/month
  • Ghost Pass Scans: ${data.includedGhostPassScans === -1 ? '∞' : data.includedGhostPassScans.toLocaleString()}/month
  • Ports: ${data.includedPorts === -1 ? '∞' : data.includedPorts}

Overage Rates:
  • Queries: $0.080/query (above included)
  • Ghost Pass Scans: $${data.ghostPassRate.toFixed(2)}/scan (above included)
  • Ports: $${data.portOverageRate}/port/month (above included)

Estimated Overages:
  • Query Overage: ${formatCurrency(data.queryOverage)}
  • Ghost Pass Overage: ${formatCurrency(data.ghostPassOverage)}
  • Verification Add-on: ${formatCurrency(data.verificationCost)}
  • Port Overage: ${formatCurrency(data.portOverage)}

Risk Multiplier: ×${data.riskMultiplier.toFixed(2)}
TOTAL MONTHLY: ${formatCurrency(data.totalMonthly)}

${getBadgeDisplayName()}: Included. Client is authorized to display the badge while subscription is active and ${BADGE_CONFIG.issuer} governance standards are met.

═══════════════════════════════════════════════════════
APPENDIX B: PLATFORM ARCHITECTURE
═══════════════════════════════════════════════════════

The Platform includes:
  • 7-Seat Senate Framework: Policy-to-code approval workflows, immutable audit trails, drift monitoring, and alignment to Reasonable Care standards.
  • Ghost Pass Ecosystem: QR code scanning for events, universities, hospitals, and zero-trust environments.
  • Port Connections: Default integrations by tier; additional ports configured under Customer responsibility.

═══════════════════════════════════════════════════════
APPENDIX C: DISPUTE RESOLUTION
═══════════════════════════════════════════════════════

1. If disputes arise, both parties shall attempt mediation before initiating litigation.

2. Governing Law: State of Florida, United States

3. Exclusive Venue: Broward County, Florida

═══════════════════════════════════════════════════════
SIGNATURES
═══════════════════════════════════════════════════════

Signed as of the Effective Date (${effectiveDate}):

Customer Company Name: ${customerCompany || '______________________________'}
Customer Authorized Signatory: ${customerName || '______________________________'}
Title: ${customerTitle || '______________________________'}
Email: ${customerEmail || '______________________________'}

Giant Ventures LLC
Authorized Signatory: Steven Grillo
Title: Founder & System Architect
`.trim();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(agreementText);
    setCopied(true);
    toast.success("Agreement copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([agreementText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `giant-ventures-service-agreement-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Agreement downloaded");
  };

  const handleEmailShare = () => {
    if (!vendorEmail) {
      toast.error("Please enter a vendor email address");
      return;
    }
    
    const subject = encodeURIComponent(`Giant Ventures LLC Service Agreement - ${data.tierLabel} Tier`);
    const body = encodeURIComponent(`Dear Vendor,\n\nPlease find attached the Giant Ventures LLC Service Agreement for your review.\n\n${agreementText}\n\nBest regards`);
    
    window.open(`mailto:${vendorEmail}?subject=${subject}&body=${body}`, '_blank');
    toast.success("Email client opened");
  };

  const handleProceedToSign = () => {
    if (!customerName || !customerCompany || !customerEmail) {
      toast.error("Please fill in all required customer details");
      return;
    }
    setStep('sign');
  };

  const handleProceedToPayment = () => {
    if (!signatureText) {
      toast.error("Please enter your signature");
      return;
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }
    if (!agreedToPayment) {
      toast.error("Please acknowledge the payment authorization");
      return;
    }
    setStep('pay');
  };

  const handleStripePayment = async () => {
    setIsProcessing(true);
    try {
      const { data: sessionData, error } = await supabase.functions.invoke('create-agreement-checkout', {
        body: {
          tierId: data.tierLabel.toLowerCase().replace(/\s+/g, '-'),
          tierName: data.tierLabel,
          priceId: 'price_1Sj6ntQVr0M2u4MsuloQ3BfC', // Enterprise tier price ID as default
          organizationName: customerCompany,
          sector: 'Enterprise',
          signerName: customerName,
          signerEmail: customerEmail,
          totalAmount: Math.round(data.totalMonthly * 100), // Convert to cents
        },
      });

      if (error) throw error;

      if (sessionData?.url) {
        window.open(sessionData.url, '_blank');
        toast.success("Redirecting to payment...");
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const canProceedToSign = customerName && customerCompany && customerEmail;
  const canProceedToPayment = signatureText && agreedToTerms && agreedToPayment;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-background border-border flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Service Agreement — Giant Ventures LLC
            <Badge className="bg-primary/20 text-primary">{data.tierLabel}</Badge>
          </DialogTitle>
          <DialogDescription>
            {step === 'review' && "Review the agreement, share with vendor, then proceed to sign"}
            {step === 'sign' && "Sign the agreement electronically"}
            {step === 'pay' && "Complete payment to activate services"}
          </DialogDescription>
          
          {/* Progress indicator */}
          <div className="flex items-center gap-2 pt-2">
            <Badge variant={step === 'review' ? 'default' : 'outline'} className="text-xs">
              1. Review
            </Badge>
            <div className="w-8 h-px bg-border" />
            <Badge variant={step === 'sign' ? 'default' : 'outline'} className="text-xs">
              2. Sign
            </Badge>
            <div className="w-8 h-px bg-border" />
            <Badge variant={step === 'pay' ? 'default' : 'outline'} className="text-xs">
              3. Pay
            </Badge>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {/* Step 1: Review */}
          {step === 'review' && (
            <div className="space-y-4 h-full flex flex-col">
              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-4 shrink-0">
                <div className="space-y-1.5">
                  <Label htmlFor="company" className="text-sm">Company Name *</Label>
                  <Input 
                    id="company"
                    value={customerCompany}
                    onChange={(e) => setCustomerCompany(e.target.value)}
                    placeholder="Your company name..."
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm">Authorized Signatory *</Label>
                  <Input 
                    id="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Full legal name..."
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm">Email *</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="your@company.com"
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-sm">Title</Label>
                  <Input 
                    id="title"
                    value={customerTitle}
                    onChange={(e) => setCustomerTitle(e.target.value)}
                    placeholder="CEO, CTO, etc."
                    className="bg-muted/50"
                  />
                </div>
              </div>

              {/* Agreement Preview */}
              <ScrollArea className="flex-1 border rounded-lg bg-muted/20">
                <pre className="text-xs p-4 whitespace-pre-wrap font-mono text-muted-foreground">
                  {agreementText}
                </pre>
              </ScrollArea>

              {/* Email Share */}
              <div className="flex gap-2 shrink-0">
                <Input 
                  type="email"
                  value={vendorEmail}
                  onChange={(e) => setVendorEmail(e.target.value)}
                  placeholder="Enter vendor email to share..."
                  className="bg-muted/50"
                />
                <Button variant="outline" onClick={handleEmailShare} className="shrink-0">
                  <Mail className="h-4 w-4 mr-2" />
                  Email to Vendor
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 shrink-0">
                <Button onClick={handleCopy} variant="outline" className="flex-1">
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </Button>
                <Button onClick={handleDownload} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={handleProceedToSign} 
                  disabled={!canProceedToSign}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <PenLine className="h-4 w-4 mr-2" />
                  Proceed to Sign
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Sign */}
          {step === 'sign' && (
            <div className="space-y-6 py-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <h4 className="font-semibold mb-2">Agreement Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Company:</span>{' '}
                    <span className="font-medium">{customerCompany}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Tier:</span>{' '}
                    <Badge variant="outline">{data.tierLabel}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Monthly Total:</span>{' '}
                    <span className="font-medium text-primary">{formatCurrency(data.totalMonthly)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Effective Date:</span>{' '}
                    <span className="font-medium">{effectiveDate}</span>
                  </div>
                </div>
              </div>

              {/* Signature Box */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <PenLine className="h-5 w-5 text-primary" />
                  Electronic Signature
                </Label>
                <div className="p-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
                  <Label htmlFor="signature" className="text-sm text-muted-foreground">
                    Type your full legal name to sign electronically
                  </Label>
                  <Input 
                    id="signature"
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="Type your full legal name..."
                    className="mt-2 text-lg font-signature bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    style={{ fontFamily: "'Brush Script MT', cursive" }}
                  />
                  {signatureText && (
                    <div className="mt-3 pt-3 border-t border-primary/20">
                      <p className="text-xs text-muted-foreground">Signature Preview:</p>
                      <p className="text-2xl mt-1" style={{ fontFamily: "'Brush Script MT', cursive" }}>
                        {signatureText}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {customerName} • {customerTitle || 'Authorized Signatory'} • {customerCompany}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms Checkboxes */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="terms" 
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I have read and agree to the Giant Ventures LLC Service Agreement, including all terms, conditions, and pricing outlined in Appendix A. I understand this is a legally binding contract.
                  </Label>
                </div>
                
                <div className="flex items-start gap-3">
                  <Checkbox 
                    id="payment" 
                    checked={agreedToPayment}
                    onCheckedChange={(checked) => setAgreedToPayment(checked === true)}
                  />
                  <Label htmlFor="payment" className="text-sm leading-relaxed cursor-pointer">
                    I authorize Giant Ventures LLC to charge the payment method I provide for the monthly subscription amount of {formatCurrency(data.totalMonthly)} plus any applicable overages as outlined in Appendix A.
                  </Label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setStep('review')} className="flex-1">
                  Back to Review
                </Button>
                <Button 
                  onClick={handleProceedToPayment}
                  disabled={!canProceedToPayment}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceed to Payment
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Pay */}
          {step === 'pay' && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-4">
                <Shield className="h-16 w-16 mx-auto text-primary" />
                <h3 className="text-2xl font-bold">Complete Your Payment</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  You're about to activate your {data.tierLabel} tier subscription with Giant Ventures LLC.
                </p>
              </div>

              <div className="p-6 rounded-lg bg-primary/5 border border-primary/20 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span>First Month Payment</span>
                  <span className="text-2xl font-bold text-primary">{formatCurrency(data.totalMonthly)}</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Includes platform fee + per-user pricing</p>
                  <p>• Estimated overages billed monthly in arrears</p>
                  <p>• Cancel anytime with 30 days notice</p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30 border border-border">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-400" />
                  Agreement Signed
                </h4>
                <div className="text-sm text-muted-foreground">
                  <p>Signed by: {signatureText}</p>
                  <p>Company: {customerCompany}</p>
                  <p>Date: {effectiveDate}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep('sign')} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleStripePayment}
                  disabled={isProcessing}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-black font-bold"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay with Stripe
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Secure payment powered by Stripe. Your payment information is encrypted and never stored on our servers.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
