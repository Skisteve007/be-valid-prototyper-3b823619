import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, FileText, Download, Shield, ArrowLeft, Plus, Trash2, TrendingUp, CheckCircle2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/valid-logo.jpeg";
import PitchCarousel from "@/components/admin/PitchCarousel";

// Pitch deck slide images - replace with actual URLs when uploaded
const pitchDeckImages = [
  '/images/pitch/slide-01.png',
  '/images/pitch/slide-02.png',
  '/images/pitch/slide-03.png',
  '/images/pitch/slide-04.png',
  '/images/pitch/slide-05.png',
  '/images/pitch/slide-06.png',
  '/images/pitch/slide-07.png',
  '/images/pitch/slide-08.png',
  '/images/pitch/slide-09.png',
  '/images/pitch/slide-10.png',
  '/images/pitch/slide-11.png',
  '/images/pitch/slide-12.png',
  '/images/pitch/slide-13.png',
  '/images/pitch/slide-14.png',
];

const AUTHORIZED_EMAILS = ["sgrillocce@gmail.com", "aeidigitalsolutions@gmail.com"];
const TRANCHE_1_CAP = 200000;

type InvestorStatus = "Contract Sent" | "Signed" | "Funds Wired" | "Cleared in Bank";

interface TrackedInvestor {
  id: string;
  name: string;
  amount: number;
  date: string;
  status: InvestorStatus;
}

const AdminDealRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // Form state
  const [investorName, setInvestorName] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("25000");
  const [valuationCap, setValuationCap] = useState("6000000");
  const [discountRate, setDiscountRate] = useState("50");
  const [selectedTranche, setSelectedTranche] = useState<1 | 2>(1);

  // Handle tranche selection
  const handleTrancheSelect = (tranche: 1 | 2) => {
    setSelectedTranche(tranche);
    if (tranche === 1) {
      setValuationCap("6000000");
      setDiscountRate("50");
    } else {
      setValuationCap("12000000");
      setDiscountRate("25");
    }
  };

  // Investment Tracker state
  const [trackedInvestors, setTrackedInvestors] = useState<TrackedInvestor[]>(() => {
    const saved = localStorage.getItem("dealroom_investors");
    return saved ? JSON.parse(saved) : [];
  });
  const [newInvestorName, setNewInvestorName] = useState("");
  const [newInvestorAmount, setNewInvestorAmount] = useState("");
  const [newInvestorDate, setNewInvestorDate] = useState(new Date().toISOString().split('T')[0]);
  const [newInvestorStatus, setNewInvestorStatus] = useState<InvestorStatus>("Contract Sent");

  // Save to localStorage whenever investors change
  useEffect(() => {
    localStorage.setItem("dealroom_investors", JSON.stringify(trackedInvestors));
  }, [trackedInvestors]);

  // Calculate total raised (only "Funds Wired" or "Cleared in Bank")
  const totalRaised = trackedInvestors
    .filter(inv => inv.status === "Funds Wired" || inv.status === "Cleared in Bank")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const progressPercentage = Math.min((totalRaised / TRANCHE_1_CAP) * 100, 100);
  const isTranche1Filled = totalRaised >= TRANCHE_1_CAP;

  const addInvestor = () => {
    if (!newInvestorName.trim() || !newInvestorAmount) {
      toast.error("Please enter investor name and amount");
      return;
    }
    const newInvestor: TrackedInvestor = {
      id: crypto.randomUUID(),
      name: newInvestorName.trim(),
      amount: parseFloat(newInvestorAmount),
      date: newInvestorDate,
      status: newInvestorStatus,
    };
    setTrackedInvestors([...trackedInvestors, newInvestor]);
    setNewInvestorName("");
    setNewInvestorAmount("");
    setNewInvestorDate(new Date().toISOString().split('T')[0]);
    setNewInvestorStatus("Contract Sent");
    toast.success("Investor added to tracker");
  };

  const updateInvestorStatus = async (id: string, status: InvestorStatus) => {
    const investor = trackedInvestors.find(inv => inv.id === id);
    if (!investor) return;

    const previousStatus = investor.status;
    
    // Update state first
    setTrackedInvestors(prev => 
      prev.map(inv => inv.id === id ? { ...inv, status } : inv)
    );

    // Send notification if status changed to "Funds Wired" or "Cleared in Bank"
    if ((status === "Funds Wired" || status === "Cleared in Bank") && previousStatus !== status) {
      try {
        // Calculate new total with updated status
        const newTotal = trackedInvestors
          .map(inv => inv.id === id ? { ...inv, status } : inv)
          .filter(inv => inv.status === "Funds Wired" || inv.status === "Cleared in Bank")
          .reduce((sum, inv) => sum + inv.amount, 0);

        const response = await supabase.functions.invoke('notify-investment-status', {
          body: {
            investorName: investor.name,
            amount: investor.amount,
            status: status,
            date: investor.date,
            totalRaised: newTotal,
            trancheCap: TRANCHE_1_CAP,
          },
        });

        if (response.error) {
          console.error("Failed to send notification:", response.error);
        } else {
          toast.success(`Notification sent for ${investor.name}`);
        }
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    }
  };

  const removeInvestor = (id: string) => {
    setTrackedInvestors(prev => prev.filter(inv => inv.id !== id));
    toast.success("Investor removed");
  };

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
    
    if (!valuationCap || parseFloat(valuationCap) <= 0) {
      toast.error("Please enter a valid valuation cap");
      return;
    }

    setGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (margin * 2);
      let y = 20;
      
      const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      // Helper function to add text and handle page breaks
      const addText = (text: string, fontSize: number = 10, isBold: boolean = false, lineHeight: number = 5) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        const lines = doc.splitTextToSize(text, contentWidth);
        
        // Check if we need a new page
        if (y + (lines.length * lineHeight) > 275) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(lines, margin, y);
        y += lines.length * lineHeight;
        return lines.length * lineHeight;
      };

      // Title - SAFE Header
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("SAFE", pageWidth / 2, y, { align: "center" });
      y += 6;
      doc.setFontSize(11);
      doc.text("(Simple Agreement for Future Equity)", pageWidth / 2, y, { align: "center" });
      y += 12;

      // Securities Disclaimer
      doc.setFontSize(8);
      doc.setFont("helvetica", "bolditalic");
      const disclaimerText = "THIS INSTRUMENT AND THE SECURITIES ISSUABLE PURSUANT HERETO HAVE NOT BEEN REGISTERED UNDER THE SECURITIES ACT OF 1933.";
      const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth);
      doc.text(disclaimerLines, pageWidth / 2, y, { align: "center" });
      y += disclaimerLines.length * 4 + 10;

      // Key Terms Box
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.rect(margin, y, contentWidth, 45);
      y += 8;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Company:", margin + 5, y);
      doc.setFont("helvetica", "normal");
      doc.text("Giant Ventures, LLC (Texas Limited Liability Company) d/b/a \"Valid\"", margin + 35, y);
      y += 7;
      
      doc.setFont("helvetica", "bold");
      doc.text("Purchaser:", margin + 5, y);
      doc.setFont("helvetica", "normal");
      doc.text(investorName, margin + 35, y);
      y += 7;
      
      doc.setFont("helvetica", "bold");
      doc.text("Purchase Amount:", margin + 5, y);
      doc.setFont("helvetica", "normal");
      doc.text(formatCurrency(investmentAmount), margin + 45, y);
      y += 7;
      
      doc.setFont("helvetica", "bold");
      doc.text("Valuation Cap:", margin + 5, y);
      doc.setFont("helvetica", "normal");
      doc.text(formatCurrency(valuationCap), margin + 40, y);
      y += 7;
      
      doc.setFont("helvetica", "bold");
      doc.text("Discount Rate:", margin + 5, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${discountRate}%`, margin + 40, y);
      y += 7;
      
      doc.setFont("helvetica", "bold");
      doc.text("Date:", margin + 5, y);
      doc.setFont("helvetica", "normal");
      doc.text(currentDate, margin + 20, y);
      y += 15;

      // Certification paragraph
      const certText = `THIS CERTIFIES THAT in exchange for the payment by the Investor (the "Purchase Amount") on or about the date of this instrument, Giant Ventures, LLC, a Texas Limited Liability Company (the "Company"), hereby issues to the Investor the right to certain units of the Company's Capital Stock, subject to the terms set forth below.`;
      addText(certText, 10, false, 5);
      y += 10;

      // Section 1 - Events
      addText("1. Events", 11, true, 6);
      y += 3;

      const event1a = `(a) Equity Financing. If there is an Equity Financing before the expiration or termination of this instrument, the Company will automatically issue to the Investor a number of Safe Units equal to the Purchase Amount divided by the Conversion Price. (The Conversion Price is the lower of: (i) the Valuation Cap Price or (ii) the Discount Price).`;
      addText(event1a, 10, false, 5);
      y += 5;

      const event1b = `(b) Liquidity Event. If there is a Liquidity Event (Sale of Company, Merger, IPO) before the expiration or termination of this instrument, the Investor will, at its option, receive (i) a cash payment equal to the Purchase Amount or (ii) the amount payable as if the Investor had converted to Common Stock at the Valuation Cap.`;
      addText(event1b, 10, false, 5);
      y += 5;

      const event1c = `(c) Dissolution. If there is a Dissolution Event (Company fails/closes) before this instrument expires, the Company will pay an amount equal to the Purchase Amount, due and payable to the Investor immediately prior to, or concurrent with, the consummation of the Dissolution Event. The Investor acknowledges that if assets are insufficient, they may receive $0.`;
      addText(event1c, 10, false, 5);
      y += 10;

      // Section 2 - Company Representations
      addText("2. Company Representations", 11, true, 6);
      y += 3;

      const rep2a = `(a) The Company is a Limited Liability Company duly organized, validly existing, and in good standing under the laws of the state of Texas.`;
      addText(rep2a, 10, false, 5);
      y += 5;

      const rep2b = `(b) The execution, delivery, and performance of this instrument by the Company has been duly authorized by all necessary limited liability company action.`;
      addText(rep2b, 10, false, 5);
      y += 10;

      // Section 3 - Investor Representations
      addText("3. Investor Representations", 11, true, 6);
      y += 3;

      const rep3a = `(a) The Investor has full legal capacity, power, and authority to execute and deliver this instrument.`;
      addText(rep3a, 10, false, 5);
      y += 5;

      const rep3b = `(b) The Investor is an accredited investor as such term is defined in Rule 501 of Regulation D under the Securities Act.`;
      addText(rep3b, 10, false, 5);
      y += 5;

      const rep3c = `(c) The Investor acknowledges that this SAFE is speculative and involves a high degree of risk, including the risk of losing the entire investment.`;
      addText(rep3c, 10, false, 5);
      y += 15;

      // Witness statement
      doc.setFont("helvetica", "bolditalic");
      doc.setFontSize(10);
      const witnessText = "IN WITNESS WHEREOF, the undersigned have caused this instrument to be duly executed and delivered.";
      const witnessLines = doc.splitTextToSize(witnessText, contentWidth);
      if (y + 60 > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(witnessLines, margin, y);
      y += witnessLines.length * 5 + 15;

      // Company Signature Block
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("COMPANY: Giant Ventures, LLC", margin, y);
      y += 15;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Signature: _________________________________", margin, y);
      y += 8;
      doc.text("By: Steven Grillo", margin, y);
      y += 6;
      doc.text("Title: Chief Executive Officer", margin, y);
      y += 6;
      doc.text("Address: Boca Raton, FL 33487", margin, y);
      y += 20;

      // Investor Signature Block
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`INVESTOR: ${investorName}`, margin, y);
      y += 15;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Signature: _________________________________", margin, y);
      y += 8;
      doc.text(`Date: ${currentDate}`, margin, y);

      // Footer on each page
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128);
        doc.text("CONFIDENTIAL - Giant Ventures, LLC d/b/a Valid", pageWidth / 2, 290, { align: "center" });
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, 290, { align: "right" });
        doc.setTextColor(0);
      }

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
            INVESTOR PITCH DECK & SAFE CONTRACT GENERATOR
          </p>
        </div>

        {/* Pitch Deck Carousel */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2 font-orbitron tracking-wide">
              PITCH DECK
            </h2>
            <p className="text-gray-400 text-sm">
              Auto-advances every 8 seconds • Hover to pause • Click arrows or swipe to navigate
            </p>
          </div>
          <PitchCarousel images={pitchDeckImages} autoAdvanceMs={8000} />
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Tranche Selector */}
          <div className="mb-6">
            <Label className="text-white text-sm mb-3 block">Select Investment Round</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleTrancheSelect(1)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedTranche === 1
                    ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-white/5 border-white/20 hover:border-white/40'
                }`}
              >
                <div className={`font-bold text-lg mb-1 ${selectedTranche === 1 ? 'text-amber-400' : 'text-white'}`}>
                  Tranche 1: Launch Round
                </div>
                <div className={`text-xs ${selectedTranche === 1 ? 'text-amber-400/80' : 'text-gray-400'}`}>$200K Raise • $6M Valuation Cap • 50% Discount</div>
              </button>
              <div
                className="p-4 rounded-xl border-2 text-left bg-cyan-500/10 border-cyan-500/30 cursor-not-allowed relative shadow-[0_0_15px_rgba(0,240,255,0.2)]"
              >
                <Badge className="absolute -top-2 -right-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 text-[10px] px-2 shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                  Coming Q2 2026
                </Badge>
                <div className="font-bold text-lg mb-1 text-cyan-400">
                  Tranche 2: Series Seed
                </div>
                <div className="text-xs text-cyan-400/80">$1.5M Raise • $10-12M Valuation Cap • 25% Discount</div>
              </div>
            </div>
            
            {/* Tranche 1 Status Tracker */}
            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Tranche 1 Status:</span>
                <span className={`font-mono font-bold ${progressPercentage >= 100 ? 'text-green-400' : 'text-amber-400'}`}>
                  {formatCurrency(totalRaised.toString())} / $200,000
                  {progressPercentage >= 100 && ' ✓ Complete'}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2 mt-2" />
            </div>
          </div>

          <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                Generate Convertible Note Agreement
                <Badge className="ml-2 bg-amber-500/20 text-amber-400 border-amber-500/50">
                  Tranche 1
                </Badge>
              </CardTitle>
              <CardDescription className="text-gray-400">
                Fill in the investor details to generate a customized Convertible Note contract PDF.
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
                <p className="text-xs text-gray-500">Default: $10,000 minimum</p>
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
                <p className="text-xs text-gray-500">Default: $6,000,000 Valuation Cap (Launch Round)</p>
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
                <p className="text-xs text-gray-500">Default: 50% discount on next round (Launch Round)</p>
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
                disabled={generating || !investorName.trim() || !valuationCap || parseFloat(valuationCap) <= 0}
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

          {/* Investment Tracker */}
          <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm mt-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                Investment Tracker
                {isTranche1Filled && (
                  <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/50">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Tranche 1 Filled - Switch to Tranche 2
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Track progress toward the $200,000 Launch Round cap
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Raised (Wired/Cleared)</span>
                  <span className={isTranche1Filled ? "text-green-400 font-bold" : "text-white"}>
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalRaised)} / $200,000
                  </span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className={`h-4 ${isTranche1Filled ? "[&>div]:bg-green-500" : "[&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500"}`}
                />
                <p className="text-xs text-gray-500">
                  {progressPercentage.toFixed(1)}% of Tranche 1 goal
                </p>
              </div>

              {/* Add New Investor Form */}
              <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
                <h4 className="text-white font-semibold text-sm">Add Investor</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Input
                    placeholder="Investor Name"
                    value={newInvestorName}
                    onChange={(e) => setNewInvestorName(e.target.value)}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={newInvestorAmount}
                      onChange={(e) => setNewInvestorAmount(e.target.value)}
                      className="bg-white/5 border-white/20 text-white pl-8 placeholder:text-gray-500"
                    />
                  </div>
                  <Input
                    type="date"
                    value={newInvestorDate}
                    onChange={(e) => setNewInvestorDate(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                  />
                  <Select value={newInvestorStatus} onValueChange={(v) => setNewInvestorStatus(v as InvestorStatus)}>
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Contract Sent">Contract Sent</SelectItem>
                      <SelectItem value="Signed">Signed</SelectItem>
                      <SelectItem value="Funds Wired">Funds Wired</SelectItem>
                      <SelectItem value="Cleared in Bank">Cleared in Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addInvestor} size="sm" className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Investor
                </Button>
              </div>

              {/* Investors Table */}
              {trackedInvestors.length > 0 ? (
                <div className="rounded-lg border border-white/10 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-transparent">
                        <TableHead className="text-gray-400">Investor Name</TableHead>
                        <TableHead className="text-gray-400">Amount Pledged</TableHead>
                        <TableHead className="text-gray-400">Date</TableHead>
                        <TableHead className="text-gray-400">Status</TableHead>
                        <TableHead className="text-gray-400 w-12"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trackedInvestors.map((investor) => (
                        <TableRow key={investor.id} className="border-white/10 hover:bg-white/5">
                          <TableCell className="text-white font-medium">{investor.name}</TableCell>
                          <TableCell className="text-white">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(investor.amount)}
                          </TableCell>
                          <TableCell className="text-gray-400">
                            {new Date(investor.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Select 
                              value={investor.status} 
                              onValueChange={(v) => updateInvestorStatus(investor.id, v as InvestorStatus)}
                            >
                              <SelectTrigger className={`w-40 text-xs h-8 ${
                                investor.status === "Cleared in Bank" ? "bg-green-500/20 border-green-500/50 text-green-400" :
                                investor.status === "Funds Wired" ? "bg-blue-500/20 border-blue-500/50 text-blue-400" :
                                investor.status === "Signed" ? "bg-amber-500/20 border-amber-500/50 text-amber-400" :
                                "bg-white/5 border-white/20 text-gray-400"
                              }`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Contract Sent">Contract Sent</SelectItem>
                                <SelectItem value="Signed">Signed</SelectItem>
                                <SelectItem value="Funds Wired">Funds Wired</SelectItem>
                                <SelectItem value="Cleared in Bank">Cleared in Bank</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => removeInvestor(investor.id)}
                              className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No investors tracked yet. Add your first investor above.
                </div>
              )}

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/10">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{trackedInvestors.length}</p>
                  <p className="text-xs text-gray-400">Total Investors</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-amber-400">
                    {trackedInvestors.filter(i => i.status === "Contract Sent" || i.status === "Signed").length}
                  </p>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">
                    {trackedInvestors.filter(i => i.status === "Funds Wired" || i.status === "Cleared in Bank").length}
                  </p>
                  <p className="text-xs text-gray-400">Confirmed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-400">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(
                      trackedInvestors.reduce((sum, inv) => sum + inv.amount, 0)
                    )}
                  </p>
                  <p className="text-xs text-gray-400">Total Pledged</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDealRoom;
