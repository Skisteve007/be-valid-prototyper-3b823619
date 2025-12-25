import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Shield, Upload, CheckCircle2, ArrowLeft, Sparkles, FileText, Download, CreditCard, DollarSign, Briefcase, Mail, Eye, X, ScrollText, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import jsPDF from "jspdf";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { TRANCHE_1, formatUsd, COMPANY_INFO } from "@/config/fundraisingConfig";

const INVESTMENT_TIERS = [
  { value: "5000", label: "$5,000" },
  { value: "10000", label: "$10,000" },
  { value: "25000", label: "$25,000" },
  { value: "50000", label: "$50,000" },
  { value: "100000", label: "$100,000" },
];

const PartnerApplication = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [generatedReferralCode, setGeneratedReferralCode] = useState("");
  const [showContractPreview, setShowContractPreview] = useState(false);
  const [accreditedConfirmed, setAccreditedConfirmed] = useState(false);

  // Handle payment success callback
  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success');
    const investorDataParam = searchParams.get('investor_data');
    
    if (paymentSuccess === 'true' && investorDataParam) {
      try {
        const investorData = JSON.parse(decodeURIComponent(investorDataParam));
        // Send confirmation email
        supabase.functions.invoke('send-investment-confirmation', {
          body: {
            ...investorData,
            transactionDate: new Date().toISOString(),
          }
        }).then(({ error }) => {
          if (error) {
            console.error('Failed to send confirmation email:', error);
          } else {
            toast.success("Investment confirmed! Confirmation email sent.");
          }
        });
        setPaymentComplete(true);
        setSubmissionSuccess(true);
        // Clear URL params
        navigate('/partner-application', { replace: true });
      } catch (e) {
        console.error('Error parsing investor data:', e);
      }
    }
  }, [searchParams, navigate]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    investmentAmount: "",
    paymentMethod: "credit_card",
    paymentHandle: "",
    // Investor-specific fields
    accreditedInvestor: "",
    investmentExperience: "",
    sourceOfFunds: "",
    investmentObjective: "",
    riskTolerance: "",
    referralSource: "",
    linkedinUrl: "",
  });
  const [idFrontFile, setIdFrontFile] = useState<File | null>(null);
  const [idBackFile, setIdBackFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState({ front: false, back: false });

  // Generate Convertible Promissory Note PDF (uses Tranche 1 terms)
  const generatePartnerContract = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;
    
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + TRANCHE_1.maturityMonths);
    const maturityDateStr = maturityDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const investmentAmount = formData.investmentAmount || "0";
    const valuationCap = TRANCHE_1.valuationCapUsd.toString();
    const discountRate = TRANCHE_1.discountPercent.toString();
    const interestRate = TRANCHE_1.interestRate;
    const qualifiedFinancingThreshold = 500000;
    const investorName = formData.fullName || "[Investor Name]";

    const formatCurrency = (amount: string) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(parseFloat(amount));
    };

    // Helper function to add text and handle page breaks
    const addText = (text: string, fontSize: number = 9, isBold: boolean = false, lineHeight: number = 4.5) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      const lines = doc.splitTextToSize(text, contentWidth);
      if (y + (lines.length * lineHeight) > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(lines, margin, y);
      y += lines.length * lineHeight;
      return lines.length * lineHeight;
    };

    const addSectionHeader = (text: string) => {
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(text, margin, y);
      y += 6;
    };

    // Title - Convertible Note Header with Tranche
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("CONVERTIBLE PROMISSORY NOTE", pageWidth / 2, y, { align: "center" });
    y += 7;
    doc.setFontSize(10);
    doc.text(`${TRANCHE_1.name}`, pageWidth / 2, y, { align: "center" });
    y += 10;

    // Full Securities Disclaimer
    doc.setFontSize(7);
    doc.setFont("helvetica", "bolditalic");
    const disclaimerText = "THIS NOTE AND THE SECURITIES ISSUABLE UPON CONVERSION HEREOF HAVE NOT BEEN REGISTERED UNDER THE SECURITIES ACT OF 1933, AS AMENDED (THE \"SECURITIES ACT\"), OR UNDER ANY STATE SECURITIES LAWS. THIS NOTE IS BEING ISSUED IN RELIANCE UPON EXEMPTIONS FROM REGISTRATION REQUIREMENTS AND MAY NOT BE SOLD, TRANSFERRED OR OTHERWISE DISPOSED OF EXCEPT PURSUANT TO AN EFFECTIVE REGISTRATION STATEMENT OR AN APPLICABLE EXEMPTION.";
    const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth);
    doc.text(disclaimerLines, margin, y);
    y += disclaimerLines.length * 3.5 + 8;

    // Key Terms Box
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentWidth, 56);
    y += 7;
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Company:", margin + 3, y);
    doc.setFont("helvetica", "normal");
    doc.text("Giant Ventures, LLC, a Texas limited liability company, d/b/a \"Valid\" (the \"Company\")", margin + 28, y);
    y += 6;
    
    doc.setFont("helvetica", "bold");
    doc.text("Holder:", margin + 3, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${investorName} (the "Holder")`, margin + 22, y);
    y += 6;
    
    doc.setFont("helvetica", "bold");
    doc.text("Principal Amount:", margin + 3, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${formatCurrency(investmentAmount)} (the "Principal Amount")`, margin + 42, y);
    y += 6;
    
    doc.setFont("helvetica", "bold");
    doc.text("Valuation Cap:", margin + 3, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${formatCurrency(valuationCap)} (the "Valuation Cap")`, margin + 36, y);
    y += 6;
    
    doc.setFont("helvetica", "bold");
    doc.text("Discount Rate:", margin + 3, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${discountRate}% (the "Discount Rate")`, margin + 36, y);
    y += 6;

    doc.setFont("helvetica", "bold");
    doc.text("Issue Date:", margin + 3, y);
    doc.setFont("helvetica", "normal");
    doc.text(currentDate, margin + 28, y);
    y += 6;
    
    doc.setFont("helvetica", "bold");
    doc.text("Maturity Date:", margin + 3, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${maturityDateStr} (the "Maturity Date")`, margin + 36, y);
    y += 12;

    // WARNING #1 - LLC / C-Corp conversion risk
    doc.setFontSize(8);
    doc.setFont("helvetica", "bolditalic");
    const llcWarning = "Important: The issuing entity on this instrument is Giant Ventures, LLC (Texas) d/b/a 'Valid'. If we later convert to a Delaware C-Corp or restructure the equity, conversion mechanics may require additional documentation. Investors should review the issuer entity and capitalization assumptions.";
    const llcWarningLines = doc.splitTextToSize(llcWarning, contentWidth);
    if (y + (llcWarningLines.length * 3.5) > 275) {
      doc.addPage();
      y = 20;
    }
    doc.text(llcWarningLines, margin, y);
    y += llcWarningLines.length * 3.5 + 4;

    // WARNING #2 - Accredited investor reminder
    const accreditedWarning = "Important: This offering is intended only for accredited investors. Do not proceed unless you qualify as an accredited investor under Rule 501 of Regulation D. This investment is speculative and you may lose all of your investment.";
    const accreditedWarningLines = doc.splitTextToSize(accreditedWarning, contentWidth);
    doc.text(accreditedWarningLines, margin, y);
    y += accreditedWarningLines.length * 3.5 + 6;
    doc.setFont("helvetica", "normal");

    // Principal paragraph
    addText(`FOR VALUE RECEIVED, the Company promises to pay to the Holder or its permitted assigns the Principal Amount, together with accrued and unpaid interest thereon, if any, on the terms set forth below.`);
    y += 6;

    // Section 1 - Interest
    addSectionHeader("1. Interest.");
    const interestText = interestRate === 0 
      ? `This Note shall bear simple interest at a rate of 0% per annum. No interest shall accrue or be payable on this Note.`
      : `This Note shall bear simple interest at a rate of ${interestRate}% per annum. Interest shall accrue from the Issue Date and be payable only upon repayment or conversion.`;
    addText(interestText);
    y += 5;

    // Section 2 - Maturity
    addSectionHeader("2. Maturity; Payment.");
    addText(`Unless earlier converted pursuant to Section 3, the outstanding Principal Amount (and any accrued interest) shall be due and payable on the Maturity Date. The Company may prepay this Note only with the Holder's written consent.`);
    y += 5;

    // Section 3 - Conversion
    addSectionHeader("3. Conversion.");
    
    addText("3.1 Qualified Financing Automatic Conversion.", 9, true);
    y += 2;
    addText(`Upon the closing of the Company's next equity financing in which the Company receives at least ${formatUsd(qualifiedFinancingThreshold)} in gross cash proceeds from the sale of its equity securities (excluding conversion of this Note or other convertible instruments) (a "Qualified Financing"), the outstanding Principal Amount (and any accrued interest) shall automatically convert into the same class or series of equity securities issued to the new money investors in the Qualified Financing ("Financing Securities").`);
    y += 3;
    addText(`The conversion price per unit/share shall be the lesser of:`);
    addText(`(a) the price per unit/share equal to (the Valuation Cap divided by the Company's Fully Diluted Capitalization immediately prior to the Qualified Financing), or`);
    addText(`(b) the price per unit/share equal to (${100 - parseInt(discountRate)}%) of the price per unit/share paid by the new money investors in the Qualified Financing.`);
    y += 4;

    addText("3.2 Fully Diluted Capitalization.", 9, true);
    y += 2;
    addText(`"Fully Diluted Capitalization" means, as of immediately prior to the Qualified Financing, the total number of outstanding equity interests (or shares, if the Company has converted to a corporation), assuming full conversion/exercise of all outstanding options, warrants, and other rights to acquire equity, and including any equity reserved for issuance under any employee equity incentive plan, but excluding (i) the securities issuable upon conversion of this Note and (ii) other convertible instruments that convert in the Qualified Financing (to avoid double counting).`);
    y += 4;

    addText("3.3 Change of Control.", 9, true);
    y += 2;
    addText(`If a Change of Control (as defined below) occurs prior to conversion in a Qualified Financing, then the Holder shall have the right to elect (one time, by written notice delivered before the closing of the Change of Control) either:`);
    addText(`(a) repayment in cash of the outstanding Principal Amount (and any accrued interest), OR`);
    addText(`(b) conversion of the outstanding Principal Amount (and any accrued interest) into the same form of consideration as the holders of the Company's equity receive in the Change of Control, at a conversion price based on the Valuation Cap (i.e., Valuation Cap divided by Fully Diluted Capitalization, determined immediately prior to the Change of Control).`);
    y += 3;
    addText(`"Change of Control" means (i) a sale of all or substantially all of the Company's assets, (ii) a merger or consolidation resulting in the holders of the Company's equity immediately prior to such transaction owning less than a majority of the voting power immediately after, or (iii) any other transaction in which a third party acquires control of the Company.`);
    y += 4;

    addText("3.4 Maturity Conversion (Optional; Company Election).", 9, true);
    y += 2;
    addText(`If this Note has not converted pursuant to Section 3.1 prior to the Maturity Date, then, at the Company's election, either:`);
    addText(`(a) the Company shall repay the outstanding Principal Amount (and any accrued interest), OR`);
    addText(`(b) the Note shall convert into the Company's most senior outstanding equity securities then issued (or if none, common equity) at a conversion price based on the Valuation Cap (Valuation Cap divided by Fully Diluted Capitalization), determined as of the Maturity Date.`);
    y += 5;

    // Section 4 - Events of Default
    addSectionHeader("4. Events of Default.");
    addText(`Each of the following constitutes an "Event of Default": (i) the Company's failure to pay amounts due under this Note when due and such failure continues for ten (10) days after written notice; (ii) the Company files for bankruptcy or insolvency; (iii) the Company makes an assignment for the benefit of creditors; or (iv) the Company materially breaches this Note and fails to cure within fifteen (15) days after written notice.`);
    addText(`Upon an Event of Default, the Holder may declare the Note immediately due and payable; provided, however, the Holder agrees that its remedy shall be limited to repayment of the Principal Amount plus accrued interest, if any, and the Holder shall not seek to impose personal liability on any manager, member, officer, or employee of the Company solely by virtue of this Note.`);
    y += 5;

    // Section 5 - Company Representations
    addSectionHeader("5. Company Representations.");
    addText(`The Company represents that (a) it is duly organized and in good standing under the laws of Texas, (b) it has authority to execute and deliver this Note, and (c) the execution and delivery of this Note have been duly authorized.`);
    y += 5;

    // Section 6 - Holder Representations
    addSectionHeader("6. Holder Representations.");
    addText(`The Holder represents that (a) it has authority to execute and deliver this Note, (b) it is an "accredited investor" under Rule 501 of Regulation D, and (c) it is acquiring this Note for investment and not with a view to distribution.`);
    y += 5;

    // Section 7 - Transfer; Assignment
    addSectionHeader("7. Transfer; Assignment.");
    addText(`The Holder may transfer or assign this Note only (i) to an affiliate, or (ii) with the Company's written consent (not to be unreasonably withheld), and in all cases in compliance with applicable securities laws. Any permitted transferee takes subject to this Note's terms.`);
    y += 5;

    // Section 8 - Amendments; Waivers
    addSectionHeader("8. Amendments; Waivers.");
    addText(`Any term of this Note may be amended or waived only with the written consent of the Company and the Holder; provided that if the Company issues multiple notes of the same form, the Company may provide that amendments may be approved by holders of a majority of the outstanding principal amount of such notes.`);
    y += 5;

    // Section 9 - Governing Law
    addSectionHeader("9. Governing Law; Venue.");
    addText(`This Note shall be governed by and construed in accordance with the laws of the State of Texas, without regard to conflicts of law principles. The parties consent to exclusive venue in state or federal courts located in Palm Beach County, Florida or Harris County, Texas.`);
    y += 5;

    // Section 10 - Miscellaneous
    addSectionHeader("10. Miscellaneous.");
    addText(`Notices shall be in writing and delivered by email and/or certified mail to the addresses provided below (or as updated by notice). This Note constitutes the entire agreement with respect to its subject matter and supersedes prior discussions.`);
    y += 10;

    // Witness statement
    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(9);
    const witnessText = "IN WITNESS WHEREOF, the undersigned have executed this Note as of the Issue Date.";
    const witnessLines = doc.splitTextToSize(witnessText, contentWidth);
    if (y + 70 > 275) {
      doc.addPage();
      y = 20;
    }
    doc.text(witnessLines, margin, y);
    y += witnessLines.length * 4.5 + 12;

    // Company Signature Block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("COMPANY: Giant Ventures, LLC", margin, y);
    y += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("By: _________________________________", margin, y);
    y += 6;
    doc.text("Name: Steven Grillo", margin, y);
    y += 5;
    doc.text("Title: Chief Executive Officer", margin, y);
    y += 5;
    doc.text("Address: Boca Raton, FL 33487", margin, y);
    y += 5;
    doc.text("Email: steve@bevalid.app", margin, y);
    y += 15;

    // Holder Signature Block
    if (y + 40 > 275) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(`HOLDER: ${investorName}`, margin, y);
    y += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Signature: _________________________", margin, y);
    y += 6;
    doc.text(`Name: ${investorName}`, margin, y);
    y += 5;
    doc.text("Address: ___________________________", margin, y);
    y += 5;
    doc.text("Email: _____________________________", margin, y);
    y += 5;
    doc.text(`Date: ${currentDate}`, margin, y);

    // Footer on each page
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(128);
      doc.text(`CONFIDENTIAL - Giant Ventures, LLC d/b/a Valid | ${TRANCHE_1.shortName}`, pageWidth / 2, 290, { align: "center" });
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, 290, { align: "right" });
      doc.setTextColor(0);
    }

    // Save PDF
    const fileName = `Convertible_Note_${TRANCHE_1.shortName.replace(/\s+/g, '_')}_${(investorName).replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success("Convertible Note downloaded successfully!");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (type: "front" | "back", file: File | null) => {
    if (type === "front") {
      setIdFrontFile(file);
    } else {
      setIdBackFile(file);
    }
  };

  // Process investment payment via Stripe
  const handleProcessPayment = async () => {
    if (!formData.investmentAmount) {
      toast.error("Investment amount is required");
      return;
    }

    setIsProcessingPayment(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-deal-room-payment', {
        body: {
          name: formData.fullName,
          email: formData.email,
          amount: parseInt(formData.investmentAmount),
          tier: `partner_${formData.investmentAmount}`,
          phone: formData.phone,
          linkedinUrl: formData.linkedinUrl,
          accreditedInvestor: formData.accreditedInvestor,
          investmentExperience: formData.investmentExperience,
          sourceOfFunds: formData.sourceOfFunds,
          investmentObjective: formData.investmentObjective,
          riskTolerance: formData.riskTolerance,
          referralSource: formData.referralSource,
          paymentMethod: formData.paymentMethod,
          paymentHandle: formData.paymentHandle,
          referralCode: generatedReferralCode,
        }
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url; // Redirect in same tab for callback
      } else {
        throw new Error("No payment URL returned");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Failed to process payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const generateReferralCode = (name: string) => {
    const cleanName = name.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${cleanName}${random}`;
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const uploadFile = async (file: File, userId: string, type: string) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}/${type}-${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("affiliate-docs")
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("affiliate-docs")
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.paymentHandle || !formData.investmentAmount) {
      toast.error("Please fill in all required fields including investment amount");
      return;
    }

    if (!formData.accreditedInvestor || !formData.investmentExperience || !formData.sourceOfFunds || !formData.investmentObjective || !formData.riskTolerance) {
      toast.error("Please complete all investor qualification questions");
      return;
    }

    if (!idFrontFile || !idBackFile) {
      toast.error("Please upload both sides of your government ID");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Try to create account first
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: Math.random().toString(36).slice(-12) + "A1!", // Temporary password
          options: {
            data: { full_name: formData.fullName }
          }
        });

        // Handle user already exists - use edge function to bypass RLS
        if (signUpError && signUpError.message?.includes("already registered")) {
          console.log("User already exists, using edge function for submission");
          
          setUploadProgress({ front: true, back: false });
          const idFrontBase64 = await fileToBase64(idFrontFile);
          
          setUploadProgress({ front: true, back: true });
          const idBackBase64 = await fileToBase64(idBackFile);

          // Use edge function to handle upload with service role
          const { data: result, error: functionError } = await supabase.functions.invoke('submit-partner-application', {
            body: {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              paymentMethod: formData.paymentMethod,
              paymentHandle: formData.paymentHandle,
              investmentAmount: formData.investmentAmount,
              idFrontBase64,
              idBackBase64,
              idFrontName: idFrontFile.name,
              idBackName: idBackFile.name,
            }
          });

          if (functionError) {
            console.error("Edge function error:", functionError);
            throw new Error(functionError.message || "Failed to submit application");
          }

          console.log("Application submitted via edge function:", result);
          if (result?.referralCode) {
            setGeneratedReferralCode(result.referralCode);
          }
          setSubmissionSuccess(true);
          toast.success("Application submitted! Generate your contract below.");
        }
        
        if (signUpError) throw signUpError;
        
        if (!signUpData.user) {
          toast.error("Failed to create account. Please try again.");
          return;
        }

        // Upload ID documents
        setUploadProgress({ front: true, back: false });
        const idFrontUrl = await uploadFile(idFrontFile, signUpData.user.id, "id-front");
        
        setUploadProgress({ front: true, back: true });
        const idBackUrl = await uploadFile(idBackFile, signUpData.user.id, "id-back");

        // Create affiliate record
        const referralCode = generateReferralCode(formData.fullName);
        
        const { error: affiliateError } = await (supabase
          .from("affiliates") as any)
          .insert({
            user_id: signUpData.user.id,
            referral_code: referralCode,
            full_name: formData.fullName,
            email: formData.email,
            paypal_email: formData.paymentHandle,
            payout_method: formData.paymentMethod,
            phone_number: formData.phone,
            id_front_url: idFrontUrl,
            id_back_url: idBackUrl,
            status: "pending",
          });

        if (affiliateError) throw affiliateError;

        // Send admin notification email
        try {
          await supabase.functions.invoke('notify-partner-application', {
            body: {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              paymentMethod: formData.paymentMethod,
              paymentHandle: formData.paymentHandle,
              investmentAmount: formData.investmentAmount,
              referralCode: referralCode,
              idFrontUrl: idFrontUrl,
              idBackUrl: idBackUrl,
              submittedAt: new Date().toISOString(),
            }
          });
          console.log("Admin notification sent successfully");
        } catch (notifyError) {
          console.error("Failed to send admin notification:", notifyError);
          // Don't fail the submission if notification fails
        }

        setGeneratedReferralCode(referralCode);
        setSubmissionSuccess(true);
        toast.success("Application submitted! Generate your contract below.");
      } else {
        // User is logged in, just create affiliate record
        setUploadProgress({ front: true, back: false });
        const idFrontUrl = await uploadFile(idFrontFile, user.id, "id-front");
        
        setUploadProgress({ front: true, back: true });
        const idBackUrl = await uploadFile(idBackFile, user.id, "id-back");

        const referralCode = generateReferralCode(formData.fullName);

        const { error: affiliateError } = await (supabase
          .from("affiliates") as any)
          .insert({
            user_id: user.id,
            referral_code: referralCode,
            full_name: formData.fullName,
            email: formData.email,
            paypal_email: formData.paymentHandle,
            payout_method: formData.paymentMethod,
            phone_number: formData.phone,
            id_front_url: idFrontUrl,
            id_back_url: idBackUrl,
            status: "pending",
          });

        if (affiliateError) throw affiliateError;

        // Send admin notification email
        try {
          await supabase.functions.invoke('notify-partner-application', {
            body: {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              paymentMethod: formData.paymentMethod,
              paymentHandle: formData.paymentHandle,
              investmentAmount: formData.investmentAmount,
              referralCode: referralCode,
              idFrontUrl: idFrontUrl,
              idBackUrl: idBackUrl,
              submittedAt: new Date().toISOString(),
            }
          });
          console.log("Admin notification sent successfully");
        } catch (notifyError) {
          console.error("Failed to send admin notification:", notifyError);
          // Don't fail the submission if notification fails
        }

        setGeneratedReferralCode(referralCode);
        setSubmissionSuccess(true);
        toast.success("Application submitted! Generate your contract below.");
      }
    } catch (error: any) {
      console.error("Application error:", error);
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
      setUploadProgress({ front: false, back: false });
    }
  };

  return (
    <div 
      className="min-h-screen text-white font-sans"
      style={{
        background: 'radial-gradient(circle at 50% 30%, rgba(244, 114, 182, 0.25) 0%, rgba(15, 23, 42, 1) 90%)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
      }}
    >
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-pink-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent" />
      </div>
      {/* Header */}
      <header className="relative border-b border-pink-500/20 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-amber-400" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-300" />
            </div>
            <div>
              <span className="text-xl font-bold text-white">Clean Check</span>
              <span className="ml-2 text-xs font-semibold text-amber-400 tracking-wider">PARTNERS</span>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
            asChild
          >
            <Link to="/compliance"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Link>
          </Button>
        </div>
      </header>

      <main className="relative container mx-auto px-4 py-12 max-w-2xl">
        {submissionSuccess ? (
          // Success State with Contract Generation
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 mb-6">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Application Submitted!
              </h1>
              <p className="text-slate-400 max-w-lg mx-auto mb-2">
                Your partner application has been received. An admin will review and approve your account shortly.
              </p>
              {generatedReferralCode && (
                <p className="text-amber-400 font-mono text-lg mt-4">
                  Your Referral Code: <span className="font-bold">{generatedReferralCode}</span>
                </p>
              )}
            </div>

            <Card className="bg-slate-900/80 border-green-500/30 shadow-2xl shadow-green-500/10 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-center gap-2">
                  <FileText className="h-5 w-5 text-amber-400" />
                  Partner Agreement
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Download your official partner agreement with all terms and conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-left">
                  <p className="text-sm text-slate-300 mb-2"><strong>Partner:</strong> {formData.fullName}</p>
                  <p className="text-sm text-slate-300 mb-2"><strong>Email:</strong> {formData.email}</p>
                  <p className="text-sm text-slate-300 mb-2"><strong>Investment:</strong> {INVESTMENT_TIERS.find(t => t.value === formData.investmentAmount)?.label || formData.investmentAmount}</p>
                  <p className="text-sm text-slate-300 mb-2"><strong>Payment Method:</strong> {formData.paymentMethod.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</p>
                  <p className="text-sm text-slate-300"><strong>Referral Code:</strong> {generatedReferralCode || "Pending"}</p>
                </div>
                
                {/* Warning #1 - LLC / C-Corp Conversion Risk */}
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-200/90 leading-relaxed">
                      <span className="font-bold">Important:</span> The issuing entity is Giant Ventures, LLC (Texas) d/b/a "Valid". If we later convert to a Delaware C-Corp, conversion mechanics may require additional documentation.
                    </p>
                  </div>
                </div>

                {/* Warning #2 - Accredited Investor Reminder */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-200/90 leading-relaxed">
                      <span className="font-bold">Important:</span> This offering is intended only for accredited investors under Rule 501 of Regulation D. This investment is speculative and you may lose all of your investment.
                    </p>
                  </div>
                </div>

                {/* Accredited Investor Checkbox */}
                <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <Checkbox 
                    id="accredited-confirm-partner"
                    checked={accreditedConfirmed}
                    onCheckedChange={(checked) => setAccreditedConfirmed(checked === true)}
                    className="mt-0.5 border-green-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                  <Label 
                    htmlFor="accredited-confirm-partner" 
                    className="text-sm text-slate-300 cursor-pointer leading-relaxed"
                  >
                    I confirm I am an accredited investor and understand the risks.
                  </Label>
                </div>

                <Button
                  onClick={generatePartnerContract}
                  disabled={!accreditedConfirmed}
                  variant="outline"
                  className="w-full py-4 border-slate-600 bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Partner Agreement (PDF)
                </Button>
              </CardContent>
            </Card>

            {/* Payment Processing Card */}
            <Card className="bg-slate-900/80 border-amber-500/30 shadow-2xl shadow-amber-500/10 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-center gap-2">
                  <CreditCard className="h-5 w-5 text-amber-400" />
                  Process Investment Payment
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Complete your investment by processing your payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30 text-center">
                  <DollarSign className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white mb-1">
                    {INVESTMENT_TIERS.find(t => t.value === formData.investmentAmount)?.label || `$${formData.investmentAmount}`}
                  </p>
                  <p className="text-sm text-slate-400">Strategic Partner Investment</p>
                </div>
                
                <Button
                  onClick={handleProcessPayment}
                  disabled={isProcessingPayment}
                  className="w-full py-6 text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/25"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Confirm Payment
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-slate-500 text-center">
                  Secure payment processed via Stripe. You'll be redirected to complete your payment.
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate("/sales-portal")}
                className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
              >
                Go to Sales Portal
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
              >
                Return Home
              </Button>
            </div>
          </div>
        ) : (
          // Application Form
          <>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
            <CheckCircle2 className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-amber-300 font-medium">Exclusive Partner Program</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Strategic Partner</span>{" "}
            <span className="text-amber-400">Application</span>
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Join our global network of partners earning recurring commissions. Complete your application below.
          </p>
        </div>

        {/* Preview Contract Button */}
        <Card className="bg-slate-800/50 border-amber-500/30 mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-center sm:text-left">
                <Eye className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-white font-medium">Review Investment Contract</p>
                  <p className="text-slate-400 text-sm">Preview the terms you'll be agreeing to</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowContractPreview(true)}
                className="border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Sample Contract
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contract Preview Modal */}
        <Dialog open={showContractPreview} onOpenChange={setShowContractPreview}>
          <DialogContent className="max-w-3xl max-h-[90vh] bg-slate-900 border-amber-500/30 top-[5%] translate-y-0 sm:top-[10%]">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <ScrollText className="h-5 w-5 text-amber-400" />
                Convertible Promissory Note
              </DialogTitle>
              <DialogDescription className="text-amber-400 font-medium">
                SAMPLE PREVIEW - Tranche 1: Launch Round ($6M Cap, 50% Discount)
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6 text-slate-300 text-sm">
                {/* Header */}
                <div className="text-center border-b border-slate-700 pb-4">
                  <h2 className="text-lg font-bold text-white mb-2">CONVERTIBLE PROMISSORY NOTE</h2>
                  <p className="text-xs text-amber-400 italic mb-3">THIS NOTE AND THE SECURITIES ISSUABLE UPON CONVERSION HEREOF HAVE NOT BEEN REGISTERED UNDER THE SECURITIES ACT OF 1933, AS AMENDED.</p>
                </div>

                {/* Key Terms Box */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2">
                  <div className="flex gap-2">
                    <span className="font-bold text-white">Company:</span>
                    <span className="text-slate-300">Giant Ventures, LLC d/b/a "Valid"</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-white">Holder:</span>
                    <span className="text-slate-400">[Your Name]</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-white">Principal Amount:</span>
                    <span className="text-amber-400">[Selected Investment Amount]</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-white">Valuation Cap:</span>
                    <span className="text-slate-300">$6,000,000</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-white">Discount Rate:</span>
                    <span className="text-slate-300">50%</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-white">Maturity Date:</span>
                    <span className="text-slate-300">18 months from Issue Date</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-white">Issue Date:</span>
                    <span className="text-slate-400">[Date of Payment]</span>
                  </div>
                </div>

                {/* Principal Statement */}
                <p className="text-slate-300 leading-relaxed">
                  FOR VALUE RECEIVED, Giant Ventures, LLC, a Texas Limited Liability Company (the "Company"), promises to pay to the Holder, or the Holder's assigns, the Principal Amount, together with accrued and unpaid interest thereon, on the terms and conditions set forth below.
                </p>

                {/* Sections */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-base mb-2">1. Interest</h3>
                    <p>This Note shall bear simple interest at a rate of 0% per annum. No interest shall accrue or be payable on this Note.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base mb-2">2. Maturity</h3>
                    <p>Unless earlier converted pursuant to Section 3, the outstanding Principal Amount of this Note shall be due and payable on the Maturity Date, which is eighteen (18) months from the Issue Date.</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base mb-2">3. Conversion</h3>
                    <div className="space-y-3">
                      <p><span className="text-amber-400">(a) Qualified Financing.</span> Upon the closing of an equity financing in which the Company raises at least $500,000 in gross proceeds, the outstanding Principal Amount shall automatically convert into equity securities at a conversion price equal to the lesser of: (i) the Valuation Cap Price ($6,000,000 divided by the Company's fully-diluted capitalization), or (ii) the Discount Price (50% of the price per share paid by investors in the Qualified Financing).</p>
                      <p><span className="text-amber-400">(b) Change of Control.</span> If a Change of Control (sale, merger, or acquisition) occurs prior to conversion, the Holder may elect to either: (i) receive a cash payment equal to two times (2x) the Principal Amount, or (ii) convert the Principal Amount at the Valuation Cap Price.</p>
                      <p><span className="text-amber-400">(c) Maturity Conversion.</span> If this Note has not been converted or repaid prior to the Maturity Date, the outstanding Principal Amount shall automatically convert into equity securities of the Company at the Valuation Cap Price.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base mb-2">4. Company Representations</h3>
                    <div className="space-y-2">
                      <p>(a) The Company is a Limited Liability Company duly organized, validly existing, and in good standing under the laws of the state of Texas.</p>
                      <p>(b) The execution, delivery, and performance of this Note by the Company has been duly authorized by all necessary limited liability company action.</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-base mb-2">5. Holder Representations</h3>
                    <div className="space-y-2">
                      <p>(a) The Holder has full legal capacity, power, and authority to execute and deliver this Note.</p>
                      <p>(b) The Holder is an accredited investor as such term is defined in Rule 501 of Regulation D under the Securities Act.</p>
                      <p>(c) The Holder acknowledges that this investment is speculative and involves a high degree of risk, including the risk of losing the entire investment.</p>
                    </div>
                  </div>
                </div>

                {/* Witness Statement */}
                <p className="italic text-slate-400 border-t border-slate-700 pt-4">
                  IN WITNESS WHEREOF, the undersigned have caused this Note to be duly executed and delivered as of the Issue Date.
                </p>

                {/* Signatures */}
                <div className="border-t border-slate-700 pt-4 space-y-4">
                  <div>
                    <p className="font-bold text-white">COMPANY: Giant Ventures, LLC</p>
                    <p>Signature: _________________________________</p>
                    <p>By: Steven Grillo</p>
                    <p>Title: Chief Executive Officer</p>
                    <p>Address: Boca Raton, FL 33487</p>
                  </div>
                  <div>
                    <p className="font-bold text-white">HOLDER: [Your Name]</p>
                    <p>Signature: _________________________________</p>
                    <p className="text-slate-400">Date: [Upon Payment Confirmation]</p>
                  </div>
                </div>

                {/* Footer */}
                <p className="text-xs text-slate-500 text-center border-t border-slate-700 pt-4">
                  CONFIDENTIAL - Giant Ventures, LLC d/b/a Valid
                </p>
              </div>
            </ScrollArea>

            <div className="flex flex-col gap-3 pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500 text-center">
                By completing the application form below and processing payment, you agree to the terms of this Convertible Promissory Note.
                Your signed note will be available for download after payment is confirmed.
              </p>
              <Button
                onClick={() => setShowContractPreview(false)}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold"
              >
                I Understand - Continue to Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Card className="bg-slate-900/80 border-pink-500/30 shadow-2xl shadow-pink-500/10">
          <CardHeader>
            <CardTitle className="text-white">Partner Information</CardTitle>
            <CardDescription className="text-slate-400">
              All fields are required for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              name="strategic_partner_application"
              method="POST"
              data-lovable-form="true"
              data-email-to="{{ config.SITE_ADMIN_EMAIL }}"
            >
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Personal Details</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-slate-300">Full Legal Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300">Mobile Phone *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Investor Qualification */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Investor Qualification
                </h3>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Accredited Investor Status *</Label>
                  <Select 
                    value={formData.accreditedInvestor} 
                    onValueChange={(value) => setFormData({ ...formData, accreditedInvestor: value })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Select your accredited status" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-50 bg-slate-800 border-slate-600">
                      <SelectItem value="accredited_income">Accredited - Income ($200K+ individual / $300K+ joint)</SelectItem>
                      <SelectItem value="accredited_networth">Accredited - Net Worth ($1M+ excluding primary residence)</SelectItem>
                      <SelectItem value="accredited_professional">Accredited - Licensed Professional (Series 7, 65, 82)</SelectItem>
                      <SelectItem value="accredited_entity">Accredited - Entity ($5M+ in assets)</SelectItem>
                      <SelectItem value="sophisticated">Sophisticated Investor (non-accredited)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">SEC regulations may require accredited investor verification for certain investment amounts.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Investment Experience *</Label>
                  <Select 
                    value={formData.investmentExperience} 
                    onValueChange={(value) => setFormData({ ...formData, investmentExperience: value })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-50 bg-slate-800 border-slate-600">
                      <SelectItem value="first_time">First-Time Angel/Seed Investor</SelectItem>
                      <SelectItem value="some_experience">1-3 Private Investments</SelectItem>
                      <SelectItem value="experienced">4-10 Private Investments</SelectItem>
                      <SelectItem value="professional">Professional Investor (10+ investments)</SelectItem>
                      <SelectItem value="institutional">Institutional/Fund Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Source of Investment Funds *</Label>
                  <Select 
                    value={formData.sourceOfFunds} 
                    onValueChange={(value) => setFormData({ ...formData, sourceOfFunds: value })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Select source of funds" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-50 bg-slate-800 border-slate-600">
                      <SelectItem value="personal_savings">Personal Savings</SelectItem>
                      <SelectItem value="business_income">Business Income/Profits</SelectItem>
                      <SelectItem value="investment_returns">Investment Returns/Portfolio</SelectItem>
                      <SelectItem value="retirement">Retirement Funds (Self-Directed IRA)</SelectItem>
                      <SelectItem value="inheritance">Inheritance/Gift</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Investment Objective *</Label>
                  <Select 
                    value={formData.investmentObjective} 
                    onValueChange={(value) => setFormData({ ...formData, investmentObjective: value })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="What is your primary objective?" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-50 bg-slate-800 border-slate-600">
                      <SelectItem value="growth">Capital Growth / High Returns</SelectItem>
                      <SelectItem value="strategic">Strategic Partnership / Industry Access</SelectItem>
                      <SelectItem value="diversification">Portfolio Diversification</SelectItem>
                      <SelectItem value="impact">Impact Investing / Mission Alignment</SelectItem>
                      <SelectItem value="network">Network & Deal Flow Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Risk Tolerance *</Label>
                  <Select 
                    value={formData.riskTolerance} 
                    onValueChange={(value) => setFormData({ ...formData, riskTolerance: value })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Select your risk tolerance" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-50 bg-slate-800 border-slate-600">
                      <SelectItem value="conservative">Conservative - Prefer lower risk, stable returns</SelectItem>
                      <SelectItem value="moderate">Moderate - Balanced risk/reward approach</SelectItem>
                      <SelectItem value="aggressive">Aggressive - Comfortable with high-risk, high-reward</SelectItem>
                      <SelectItem value="speculative">Speculative - Understand potential total loss</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-slate-500">Early-stage investments carry significant risk including potential loss of entire investment.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">How did you hear about this opportunity?</Label>
                  <Select 
                    value={formData.referralSource} 
                    onValueChange={(value) => setFormData({ ...formData, referralSource: value })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Select referral source" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-50 bg-slate-800 border-slate-600">
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="twitter">Twitter/X</SelectItem>
                      <SelectItem value="personal_referral">Personal Referral</SelectItem>
                      <SelectItem value="investor_network">Investor Network/Platform</SelectItem>
                      <SelectItem value="event">Conference/Event</SelectItem>
                      <SelectItem value="website">Company Website</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl" className="text-slate-300">LinkedIn Profile URL</Label>
                  <Input
                    id="linkedinUrl"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Investment Amount */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Investment Amount</h3>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Select Investment Tier *</Label>
                  <Select 
                    value={formData.investmentAmount} 
                    onValueChange={(value) => setFormData({ ...formData, investmentAmount: value })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Select investment amount" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-50 bg-slate-800 border-slate-600">
                      {INVESTMENT_TIERS.map((tier) => (
                        <SelectItem key={tier.value} value={tier.value}>{tier.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Payment Method</h3>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">How will you pay? *</Label>
                  <Select 
                    value={formData.paymentMethod} 
                    onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                  >
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent position="popper" className="z-50 bg-slate-800 border-slate-600">
                      <SelectItem value="credit_card">Credit Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="venmo">Venmo</SelectItem>
                      <SelectItem value="coinbase">Coinbase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentHandle" className="text-slate-300">
                    {formData.paymentMethod === "venmo" ? "Venmo @Handle" : 
                     formData.paymentMethod === "coinbase" ? "Coinbase Email" :
                     formData.paymentMethod === "credit_card" ? "Email for Receipt" :
                     "PayPal Email"} *
                  </Label>
                  <Input
                    id="paymentHandle"
                    name="paymentHandle"
                    value={formData.paymentHandle}
                    onChange={handleInputChange}
                    placeholder={formData.paymentMethod === "venmo" ? "@username" : "email@example.com"}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Identity Verification */}
              <div className="space-y-4 pt-4 border-t border-slate-700">
                <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Identity Verification (KYC)</h3>
                <p className="text-xs text-slate-500">Upload clear photos of your government-issued ID. Files are encrypted and stored securely.</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Government ID (Front) *</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("front", e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                      />
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${idFrontFile ? "border-green-500 bg-green-500/10" : "border-slate-600 hover:border-amber-500/50"}`}>
                        {idFrontFile ? (
                          <div className="flex items-center justify-center gap-2 text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm truncate max-w-[150px]">{idFrontFile.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mx-auto mb-2 text-slate-500" />
                            <p className="text-sm text-slate-400">Click to upload</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Government ID (Back) *</Label>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange("back", e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        required
                      />
                      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${idBackFile ? "border-green-500 bg-green-500/10" : "border-slate-600 hover:border-amber-500/50"}`}>
                        {idBackFile ? (
                          <div className="flex items-center justify-center gap-2 text-green-400">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm truncate max-w-[150px]">{idBackFile.name}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-8 w-8 mx-auto mb-2 text-slate-500" />
                            <p className="text-sm text-slate-400">Click to upload</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-6 text-lg font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-500/25"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {uploadProgress.front && !uploadProgress.back ? "Uploading Documents..." : "Submitting..."}
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                By submitting, you agree to our Partner Terms and consent to identity verification.
              </p>
            </form>
          </CardContent>
        </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default PartnerApplication;
