import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Shield, Upload, CheckCircle2, ArrowLeft, Sparkles, FileText, Download, CreditCard, DollarSign, Briefcase, Mail, Eye } from "lucide-react";
import jsPDF from "jspdf";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

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

  // Generate Partner Agreement PDF
  const generatePartnerContract = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = 20;
    
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Helper function to add text
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false, lineHeight: number = 5) => {
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

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("STRATEGIC PARTNER AGREEMENT", pageWidth / 2, y, { align: "center" });
    y += 15;

    // Company Info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Giant Ventures, LLC d/b/a Clean Check", pageWidth / 2, y, { align: "center" });
    y += 15;

    // Key Terms Box
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.rect(margin, y, contentWidth, 50);
    y += 8;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Partner:", margin + 5, y);
    doc.setFont("helvetica", "normal");
    doc.text(formData.fullName, margin + 30, y);
    y += 7;
    
    doc.setFont("helvetica", "bold");
    doc.text("Email:", margin + 5, y);
    doc.setFont("helvetica", "normal");
    doc.text(formData.email, margin + 25, y);
    y += 7;
    
    doc.setFont("helvetica", "bold");
    doc.text("Referral Code:", margin + 5, y);
    doc.setFont("helvetica", "normal");
    doc.text(generatedReferralCode || "Pending Assignment", margin + 40, y);
    y += 7;
    
    doc.setFont("helvetica", "bold");
    doc.text("Investment Amount:", margin + 5, y);
    doc.setFont("helvetica", "normal");
    const investmentLabel = INVESTMENT_TIERS.find(t => t.value === formData.investmentAmount)?.label || formData.investmentAmount;
    doc.text(investmentLabel, margin + 50, y);
    y += 7;
    
    doc.setFont("helvetica", "bold");
    doc.text("Payment Method:", margin + 5, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${formData.paymentMethod.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} - ${formData.paymentHandle}`, margin + 45, y);
    y += 7;
    
    doc.setFont("helvetica", "bold");
    doc.text("Effective Date:", margin + 5, y);
    doc.setFont("helvetica", "normal");
    doc.text(currentDate, margin + 40, y);
    y += 20;

    // Section 1 - Appointment
    addText("1. APPOINTMENT", 11, true, 6);
    y += 3;
    addText("Company hereby appoints Partner as a non-exclusive Strategic Partner for the purpose of referring potential customers to Company's verification services. Partner accepts such appointment subject to the terms and conditions set forth herein.", 10, false, 5);
    y += 8;

    // Section 2 - Investment
    addText("2. INVESTMENT COMMITMENT", 11, true, 6);
    y += 3;
    const investmentLabelForContract = INVESTMENT_TIERS.find(t => t.value === formData.investmentAmount)?.label || `$${formData.investmentAmount}`;
    addText(`Partner hereby commits to invest ${investmentLabelForContract} USD in the Company's Strategic Partner Program. This investment entitles Partner to the following benefits and commission structure.`, 10, false, 5);
    y += 8;

    // Section 3 - Commission
    addText("3. COMMISSION STRUCTURE", 11, true, 6);
    y += 3;
    addText("Partner shall receive the following commissions on qualified referrals:", 10, false, 5);
    y += 3;
    addText("• 20% commission on first-year subscription revenue from referred customers", 10, false, 5);
    addText("• 10% commission on renewal revenue for years 2-3", 10, false, 5);
    addText("• Commissions are paid monthly for the preceding calendar month", 10, false, 5);
    y += 8;

    // Section 4 - Payment
    addText("4. PAYMENT TERMS", 11, true, 6);
    y += 3;
    addText(`Investment payment shall be made via ${formData.paymentMethod.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())} to the account designated by Company. Minimum payout threshold for commissions is $50 USD. Commission payments are processed on or before the 15th of each month.`, 10, false, 5);
    y += 8;

    // Section 5 - Term
    addText("5. TERM AND TERMINATION", 11, true, 6);
    y += 3;
    addText("This Agreement shall commence on the Effective Date and continue for a period of one (1) year, automatically renewing for successive one-year terms unless terminated by either party with thirty (30) days written notice.", 10, false, 5);
    y += 8;

    // Section 6 - IP Assignment
    addText("6. INTELLECTUAL PROPERTY", 11, true, 6);
    y += 3;
    addText("Partner acknowledges that all intellectual property, trade secrets, and proprietary information of Company remain the exclusive property of Company. Partner shall not use Company's trademarks except as expressly authorized in writing.", 10, false, 5);
    y += 8;

    // Section 7 - Confidentiality
    addText("7. CONFIDENTIALITY", 11, true, 6);
    y += 3;
    addText("Partner agrees to maintain strict confidentiality of all non-public information, including but not limited to: customer lists, pricing strategies, technology implementations, and business operations. This obligation survives termination of this Agreement.", 10, false, 5);
    y += 15;

    // Signature Block
    addText("IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.", 10, false, 5);
    y += 15;

    doc.setFont("helvetica", "bold");
    doc.text("COMPANY:", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text("Giant Ventures, LLC", margin, y);
    y += 5;
    doc.text("By: Steven Grillo, Managing Member", margin, y);
    y += 15;

    doc.setFont("helvetica", "bold");
    doc.text("PARTNER:", margin, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(formData.fullName, margin, y);
    y += 5;
    doc.text("Signature: ________________________", margin, y);
    y += 5;
    doc.text(`Date: ${currentDate}`, margin, y);

    // Save PDF
    const fileName = `CleanCheck_Partner_Agreement_${formData.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    toast.success("Contract downloaded successfully!");
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
                
                <Button
                  onClick={generatePartnerContract}
                  variant="outline"
                  className="w-full py-4 border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
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
                onClick={() => {
                  // Generate sample contract for preview
                  const doc = new jsPDF();
                  const pageWidth = doc.internal.pageSize.getWidth();
                  const margin = 20;
                  const contentWidth = pageWidth - (margin * 2);
                  let y = 20;
                  
                  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                  // Title
                  doc.setFontSize(16);
                  doc.setFont("helvetica", "bold");
                  doc.text("STRATEGIC PARTNER AGREEMENT", pageWidth / 2, y, { align: "center" });
                  y += 10;
                  doc.setFontSize(10);
                  doc.setFont("helvetica", "italic");
                  doc.text("SAMPLE PREVIEW - NOT A BINDING DOCUMENT", pageWidth / 2, y, { align: "center" });
                  y += 15;

                  doc.setFont("helvetica", "normal");
                  doc.text("Giant Ventures, LLC d/b/a Clean Check", pageWidth / 2, y, { align: "center" });
                  y += 15;

                  // Key Terms Box
                  doc.setDrawColor(0);
                  doc.setLineWidth(0.5);
                  doc.rect(margin, y, contentWidth, 35);
                  y += 8;
                  
                  doc.setFontSize(10);
                  doc.setFont("helvetica", "bold");
                  doc.text("Partner:", margin + 5, y);
                  doc.setFont("helvetica", "normal");
                  doc.text("[Your Name]", margin + 30, y);
                  y += 7;
                  
                  doc.setFont("helvetica", "bold");
                  doc.text("Investment Amount:", margin + 5, y);
                  doc.setFont("helvetica", "normal");
                  doc.text("[Selected Amount]", margin + 50, y);
                  y += 7;
                  
                  doc.setFont("helvetica", "bold");
                  doc.text("Effective Date:", margin + 5, y);
                  doc.setFont("helvetica", "normal");
                  doc.text("[Date of Payment]", margin + 40, y);
                  y += 20;

                  const addSection = (title: string, content: string) => {
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(11);
                    doc.text(title, margin, y);
                    y += 7;
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(10);
                    const lines = doc.splitTextToSize(content, contentWidth);
                    doc.text(lines, margin, y);
                    y += lines.length * 5 + 8;
                  };

                  addSection("1. APPOINTMENT", "Company hereby appoints Partner as a non-exclusive Strategic Partner for the purpose of referring potential customers to Company's verification services. Partner accepts such appointment subject to the terms and conditions set forth herein.");
                  
                  addSection("2. INVESTMENT COMMITMENT", "Partner hereby commits to invest the selected amount in USD in the Company's Strategic Partner Program. This investment entitles Partner to the following benefits and commission structure.");
                  
                  addSection("3. COMMISSION STRUCTURE", "Partner shall receive: 20% commission on first-year subscription revenue from referred customers; 10% commission on renewal revenue for years 2-3; Commissions are paid monthly for the preceding calendar month. Minimum payout threshold is $50 USD.");
                  
                  addSection("4. TERM AND TERMINATION", "This Agreement shall commence on the Effective Date and continue for a period of one (1) year, automatically renewing for successive one-year terms unless terminated by either party with thirty (30) days written notice.");
                  
                  addSection("5. INTELLECTUAL PROPERTY", "Partner acknowledges that all intellectual property, trade secrets, and proprietary information of Company remain the exclusive property of Company. Partner shall not use Company's trademarks except as expressly authorized in writing.");
                  
                  addSection("6. CONFIDENTIALITY", "Partner agrees to maintain strict confidentiality of all non-public information, including but not limited to: customer lists, pricing strategies, technology implementations, and business operations. This obligation survives termination of this Agreement.");

                  y += 10;
                  doc.setFont("helvetica", "bold");
                  doc.text("COMPANY:", margin, y);
                  y += 7;
                  doc.setFont("helvetica", "normal");
                  doc.text("Giant Ventures, LLC", margin, y);
                  y += 5;
                  doc.text("By: Steven Grillo, Managing Member", margin, y);
                  y += 15;

                  doc.setFont("helvetica", "bold");
                  doc.text("PARTNER:", margin, y);
                  y += 7;
                  doc.setFont("helvetica", "normal");
                  doc.text("[Partner Signature]", margin, y);
                  y += 5;
                  doc.text("Date: [Upon Payment Confirmation]", margin, y);

                  doc.save("CleanCheck_Strategic_Partner_Agreement_SAMPLE.pdf");
                  toast.success("Sample contract downloaded for review!");
                }}
                className="border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Sample Contract
              </Button>
            </div>
          </CardContent>
        </Card>

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
