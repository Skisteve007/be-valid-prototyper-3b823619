import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, FileText, Download, Shield, ArrowLeft } from "lucide-react";
import { jsPDF } from "jspdf";
import logo from "@/assets/valid-logo.jpeg";

const AUTHORIZED_EMAILS = ["sgrillocce@gmail.com", "aeidigitalsolutions@gmail.com"];

const AdminDealRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // Form state
  const [investorName, setInvestorName] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("25000");
  const [valuationCap, setValuationCap] = useState("12500000");
  const [discountRate, setDiscountRate] = useState("20");

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      if (!AUTHORIZED_EMAILS.includes(user.email?.toLowerCase() || "")) {
        toast.error("Access denied. This page is restricted.");
        navigate("/");
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      toast.error("Failed to verify access");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "$0";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);
  };

  const generateSAFEPDF = () => {
    if (!investorName.trim()) {
      toast.error("Please enter the investor name");
      return;
    }

    setGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let y = 20;

      // Title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("SIMPLE AGREEMENT FOR FUTURE EQUITY (SAFE)", pageWidth / 2, y, { align: "center" });
      y += 10;
      
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("Giant Ventures, LLC d/b/a Valid™", pageWidth / 2, y, { align: "center" });
      y += 15;

      // Date
      doc.setFontSize(10);
      doc.text(`Effective Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, y);
      y += 15;

      // Parties
      doc.setFont("helvetica", "bold");
      doc.text("PARTIES:", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      const partiesText = `This Simple Agreement for Future Equity ("SAFE") is entered into by and between Giant Ventures, LLC, a Delaware limited liability company doing business as "Valid™" (the "Company"), and ${investorName} (the "Investor").`;
      const partiesLines = doc.splitTextToSize(partiesText, contentWidth);
      doc.text(partiesLines, margin, y);
      y += partiesLines.length * 5 + 10;

      // Investment Terms
      doc.setFont("helvetica", "bold");
      doc.text("INVESTMENT TERMS:", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.text(`Investment Amount: ${formatCurrency(investmentAmount)}`, margin, y);
      y += 6;
      doc.text(`Valuation Cap: ${formatCurrency(valuationCap)}`, margin, y);
      y += 6;
      doc.text(`Discount Rate: ${discountRate}%`, margin, y);
      y += 15;

      // Section 1
      doc.setFont("helvetica", "bold");
      doc.text("1. EVENTS", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      
      const section1Text = `(a) Equity Financing. If there is an Equity Financing before the termination of this SAFE, on the initial closing of such Equity Financing, this SAFE will automatically convert into the number of shares of Safe Preferred Stock equal to the Purchase Amount divided by the Conversion Price.

(b) Liquidity Event. If there is a Liquidity Event before the termination of this SAFE, this SAFE will automatically be entitled to receive a portion of Proceeds, due and payable to the Investor immediately prior to, or concurrent with, the consummation of such Liquidity Event.

(c) Dissolution Event. If there is a Dissolution Event before the termination of this SAFE, the Investor will automatically be entitled to receive a portion of Proceeds equal to the Purchase Amount, due and payable to the Investor immediately prior to the consummation of the Dissolution Event.`;
      
      const section1Lines = doc.splitTextToSize(section1Text, contentWidth);
      doc.text(section1Lines, margin, y);
      y += section1Lines.length * 4 + 10;

      // Check if we need a new page
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Section 2
      doc.setFont("helvetica", "bold");
      doc.text("2. DEFINITIONS", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      
      const section2Text = `"Conversion Price" means the either: (1) the Safe Price or (2) the Discount Price, whichever calculation results in a greater number of shares of Safe Preferred Stock.

"Discount Price" means the price per share of the Standard Preferred Stock sold in the Equity Financing multiplied by the Discount Rate (${discountRate}%).

"Safe Price" means the price per share equal to the Valuation Cap (${formatCurrency(valuationCap)}) divided by the Company Capitalization.`;
      
      const section2Lines = doc.splitTextToSize(section2Text, contentWidth);
      doc.text(section2Lines, margin, y);
      y += section2Lines.length * 4 + 10;

      // Check if we need a new page
      if (y > 250) {
        doc.addPage();
        y = 20;
      }

      // Section 3 - Risk Disclosure
      doc.setFont("helvetica", "bold");
      doc.text("3. RISK DISCLOSURE & LIMITATION OF LIABILITY", margin, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      
      const riskText = `SPECULATIVE INVESTMENT: Investment in Valid™ (via Giant Ventures, LLC) is highly speculative and involves a high degree of risk. This opportunity is suitable only for persons who can afford to lose their entire investment. There is no guarantee that the company will achieve its business objectives or that the valuation targets will be met.

NOT A LOAN: The funds contributed via this SAFE are not a loan. There is no maturity date, no interest rate, and no requirement for repayment. If the company dissolves or ceases operations, investors may receive $0.

NO PERSONAL GUARANTEE: The investment is made solely into the corporate entity. The Founder/CEO provides no personal guarantee or collateral. By proceeding, the investor acknowledges that recourse is limited strictly to the assets of the Company, not the personal assets of its officers or directors.

INDEFINITE HOLDING PERIOD: This is an illiquid investment. Investors may not be able to sell or transfer their equity for an indefinite period.`;
      
      const riskLines = doc.splitTextToSize(riskText, contentWidth);
      doc.text(riskLines, margin, y);
      y += riskLines.length * 4 + 15;

      // Check if we need a new page
      if (y > 230) {
        doc.addPage();
        y = 20;
      }

      // Signature Section
      doc.setFont("helvetica", "bold");
      doc.text("SIGNATURES", margin, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.text("COMPANY:", margin, y);
      y += 20;
      doc.line(margin, y, margin + 80, y);
      y += 5;
      doc.text("Giant Ventures, LLC d/b/a Valid™", margin, y);
      y += 5;
      doc.text("By: ________________________________", margin, y);
      y += 5;
      doc.text("Title: CEO", margin, y);
      y += 5;
      doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y);
      y += 20;

      doc.text("INVESTOR:", margin, y);
      y += 20;
      doc.line(margin, y, margin + 80, y);
      y += 5;
      doc.text(investorName, margin, y);
      y += 5;
      doc.text(`Investment Amount: ${formatCurrency(investmentAmount)}`, margin, y);
      y += 5;
      doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, y);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(128);
      doc.text("CONFIDENTIAL - Giant Ventures, LLC / Valid™", pageWidth / 2, 285, { align: "center" });

      // Save the PDF
      doc.save(`SAFE_Agreement_${investorName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success("SAFE Agreement PDF generated successfully!");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/admin")}
              className="text-cyan-400 hover:text-cyan-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-400" />
              <span className="text-amber-400 font-mono text-sm tracking-wider">RESTRICTED ACCESS</span>
            </div>
          </div>
          <img src={logo} alt="Valid" className="h-10 w-auto" />
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 font-orbitron tracking-wider">
            DEAL ROOM
          </h1>
          <p className="text-cyan-400 font-mono tracking-widest text-sm">
            SAFE CONTRACT GENERATOR
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                Generate SAFE Agreement
              </CardTitle>
              <CardDescription className="text-gray-400">
                Fill in the investor details to generate a customized SAFE contract PDF.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Investor Name */}
              <div className="space-y-2">
                <Label htmlFor="investorName" className="text-white">
                  Investor Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="investorName"
                  value={investorName}
                  onChange={(e) => setInvestorName(e.target.value)}
                  placeholder="Enter investor's full legal name"
                  className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                />
              </div>

              {/* Investment Amount */}
              <div className="space-y-2">
                <Label htmlFor="investmentAmount" className="text-white">
                  Investment Amount (USD)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    id="investmentAmount"
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="bg-white/5 border-white/20 text-white pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500">Default: $25,000 minimum</p>
              </div>

              {/* Valuation Cap */}
              <div className="space-y-2">
                <Label htmlFor="valuationCap" className="text-white">
                  Valuation Cap (USD)
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    id="valuationCap"
                    type="number"
                    value={valuationCap}
                    onChange={(e) => setValuationCap(e.target.value)}
                    className="bg-white/5 border-white/20 text-white pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500">Default: $12,500,000 (Alpha Tranche)</p>
              </div>

              {/* Discount Rate */}
              <div className="space-y-2">
                <Label htmlFor="discountRate" className="text-white">
                  Discount Rate (%)
                </Label>
                <div className="relative">
                  <Input
                    id="discountRate"
                    type="number"
                    value={discountRate}
                    onChange={(e) => setDiscountRate(e.target.value)}
                    className="bg-white/5 border-white/20 text-white pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                </div>
                <p className="text-xs text-gray-500">Default: 20% discount on next round</p>
              </div>

              {/* Preview Summary */}
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <h4 className="text-cyan-400 font-semibold mb-2 text-sm">Contract Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-400">Investor:</span>
                  <span className="text-white">{investorName || "—"}</span>
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">{formatCurrency(investmentAmount)}</span>
                  <span className="text-gray-400">Valuation Cap:</span>
                  <span className="text-white">{formatCurrency(valuationCap)}</span>
                  <span className="text-gray-400">Discount:</span>
                  <span className="text-white">{discountRate}%</span>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateSAFEPDF}
                disabled={generating || !investorName.trim()}
                className="w-full h-14 text-lg font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(0,240,255,0.3)]"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5 mr-2" />
                    Generate SAFE PDF
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                This tool generates a draft SAFE agreement. Always have legal counsel review before execution.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDealRoom;
