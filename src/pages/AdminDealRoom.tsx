import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, FileText, Download, Shield, ArrowLeft, Plus, Trash2, TrendingUp, CheckCircle2, Brain, Lock, ExternalLink, FileDown, Pin } from "lucide-react";
import { jsPDF } from "jspdf";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/valid-logo.jpeg";
import PitchCarousel from "@/components/admin/PitchCarousel";

// Pitch deck slide images
const pitchDeckImages = [
  '/images/pitch/slide-01.jpg',
  '/images/pitch/slide-02.jpg?v=20251217',
  '/images/pitch/slide-03.jpg',
  '/images/pitch/slide-04.jpg',
  '/images/pitch/slide-05.jpg?v=20251217',
  '/images/pitch/slide-06.jpg',
  '/images/pitch/slide-07.jpg',
  '/images/pitch/slide-08.jpg',
  '/images/pitch/slide-09.jpg',
  '/images/pitch/slide-10.jpg',
  '/images/pitch/slide-11.png',
  '/images/pitch/slide-12.jpg',
  '/images/pitch/slide-13.jpg',
  '/images/pitch/slide-14.jpg',
];

// PUBLIC PDF URL - Same as PitchDeck.tsx for consistency
const INVESTOR_DECK_PDF_URL = "/images/pitch/VALID-Investor-Deck-2025.pdf";
const AUTHORIZED_EMAILS = ["sgrillocce@gmail.com", "aeidigitalsolutions@gmail.com", "steve@bevalid.app"];
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

  const generateConvertibleNotePDF = () => {
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
      const maturityDate = new Date();
      maturityDate.setMonth(maturityDate.getMonth() + 18);
      const maturityDateStr = maturityDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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

      // Title - Convertible Note Header
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("CONVERTIBLE PROMISSORY NOTE", pageWidth / 2, y, { align: "center" });
      y += 12;

      // Securities Disclaimer
      doc.setFontSize(8);
      doc.setFont("helvetica", "bolditalic");
      const disclaimerText = "THIS NOTE AND THE SECURITIES ISSUABLE UPON CONVERSION HEREOF HAVE NOT BEEN REGISTERED UNDER THE SECURITIES ACT OF 1933, AS AMENDED.";
      const disclaimerLines = doc.splitTextToSize(disclaimerText, contentWidth);
      doc.text(disclaimerLines, pageWidth / 2, y, { align: "center" });
      y += disclaimerLines.length * 4 + 10;

      // Key Terms Box
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.rect(margin, y, contentWidth, 60);
      y += 8;
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Company:", margin + 5, y);
      doc.setFont("helvetica", "normal");
      doc.text("Giant Ventures, LLC (Texas Limited Liability Company) d/b/a \"Valid\"", margin + 35, y);
      y += 7;
      
      doc.setFont("helvetica", "bold");
      doc.text("Holder:", margin + 5, y);
      doc.setFont("helvetica", "normal");
      doc.text(investorName, margin + 25, y);
      y += 7;
      
      doc.setFont("helvetica", "bold");
      doc.text("Principal Amount:", margin + 5, y);
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
      doc.text("Maturity Date:", margin + 5, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${maturityDateStr} (18 months from Issue Date)`, margin + 40, y);
      y += 7;
      
      doc.setFont("helvetica", "bold");
      doc.text("Issue Date:", margin + 5, y);
      doc.setFont("helvetica", "normal");
      doc.text(currentDate, margin + 30, y);
      y += 15;

      // Principal paragraph
      const principalText = `FOR VALUE RECEIVED, Giant Ventures, LLC, a Texas Limited Liability Company (the "Company"), promises to pay to ${investorName} (the "Holder"), or the Holder's assigns, the principal sum of ${formatCurrency(investmentAmount)} (the "Principal Amount"), together with accrued and unpaid interest thereon, on the terms and conditions set forth below.`;
      addText(principalText, 10, false, 5);
      y += 10;

      // Section 1 - Interest
      addText("1. Interest", 11, true, 6);
      y += 3;

      const interestText = `This Note shall bear simple interest at a rate of 0% per annum. No interest shall accrue or be payable on this Note.`;
      addText(interestText, 10, false, 5);
      y += 8;

      // Section 2 - Maturity
      addText("2. Maturity", 11, true, 6);
      y += 3;

      const maturityText = `Unless earlier converted pursuant to Section 3, the outstanding Principal Amount of this Note shall be due and payable on ${maturityDateStr} (the "Maturity Date"), which is eighteen (18) months from the Issue Date.`;
      addText(maturityText, 10, false, 5);
      y += 8;

      // Section 3 - Conversion
      addText("3. Conversion", 11, true, 6);
      y += 3;

      const conversion3a = `(a) Qualified Financing. Upon the closing of an equity financing in which the Company raises at least $500,000 in gross proceeds (a "Qualified Financing"), the outstanding Principal Amount shall automatically convert into equity securities of the same type issued in the Qualified Financing at a conversion price equal to the lesser of: (i) the Valuation Cap Price (${formatCurrency(valuationCap)} divided by the Company's fully-diluted capitalization), or (ii) the Discount Price (${100 - parseInt(discountRate)}% of the price per share paid by investors in the Qualified Financing).`;
      addText(conversion3a, 10, false, 5);
      y += 5;

      const conversion3b = `(b) Change of Control. If a Change of Control (sale, merger, or acquisition) occurs prior to conversion, the Holder may elect to either: (i) receive a cash payment equal to two times (2x) the Principal Amount, or (ii) convert the Principal Amount at the Valuation Cap Price.`;
      addText(conversion3b, 10, false, 5);
      y += 5;

      const conversion3c = `(c) Maturity Conversion. If this Note has not been converted or repaid prior to the Maturity Date, the outstanding Principal Amount shall automatically convert into equity securities of the Company at the Valuation Cap Price.`;
      addText(conversion3c, 10, false, 5);
      y += 10;

      // Section 4 - Company Representations
      addText("4. Company Representations", 11, true, 6);
      y += 3;

      const rep4a = `(a) The Company is a Limited Liability Company duly organized, validly existing, and in good standing under the laws of the state of Texas.`;
      addText(rep4a, 10, false, 5);
      y += 5;

      const rep4b = `(b) The execution, delivery, and performance of this Note by the Company has been duly authorized by all necessary limited liability company action.`;
      addText(rep4b, 10, false, 5);
      y += 10;

      // Section 5 - Holder Representations
      addText("5. Holder Representations", 11, true, 6);
      y += 3;

      const rep5a = `(a) The Holder has full legal capacity, power, and authority to execute and deliver this Note.`;
      addText(rep5a, 10, false, 5);
      y += 5;

      const rep5b = `(b) The Holder is an accredited investor as such term is defined in Rule 501 of Regulation D under the Securities Act.`;
      addText(rep5b, 10, false, 5);
      y += 5;

      const rep5c = `(c) The Holder acknowledges that this investment is speculative and involves a high degree of risk, including the risk of losing the entire investment.`;
      addText(rep5c, 10, false, 5);
      y += 15;

      // Witness statement
      doc.setFont("helvetica", "bolditalic");
      doc.setFontSize(10);
      const witnessText = "IN WITNESS WHEREOF, the undersigned have caused this Note to be duly executed and delivered as of the Issue Date.";
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

      // Holder Signature Block
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`HOLDER: ${investorName}`, margin, y);
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
      doc.save(`Convertible_Note_${investorName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success("Convertible Note PDF generated successfully!");
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
              variant="outline" 
              size="sm" 
              onClick={() => navigate("/admin")}
              className="bg-gradient-to-r from-blue-600/20 to-cyan-500/20 border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/30 hover:border-cyan-300 hover:text-white shadow-[0_0_15px_rgba(0,200,255,0.3)] transition-all"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
          </div>
          <div className="flex items-center gap-4">
            {/* Top Secret Synth Access - Admin Only */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/synth")}
              className="relative bg-gradient-to-r from-purple-600/20 to-pink-500/20 border-purple-400/50 text-purple-300 hover:bg-purple-500/30 hover:border-purple-300 hover:text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all group"
            >
              <Brain className="h-4 w-4 mr-2" />
              <span className="font-mono text-xs tracking-wider">SYNTH™</span>
              <Lock className="h-3 w-3 ml-2 text-purple-400 group-hover:text-white" />
            </Button>
            <img src={logo} alt="Valid" className="h-14 w-auto rounded-lg shadow-[0_0_20px_rgba(0,200,255,0.3)]" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black mb-4 font-orbitron tracking-wider bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] [text-shadow:_0_4px_20px_rgba(0,200,255,0.4),_0_8px_40px_rgba(0,0,0,0.8)] transform perspective-1000 hover:scale-105 transition-transform duration-300">
            DEAL ROOM
          </h1>
          <p className="text-cyan-400 font-mono tracking-widest text-sm drop-shadow-[0_0_10px_rgba(0,200,255,0.5)]">
            INVESTOR PITCH DECK & CONVERTIBLE NOTE GENERATOR
          </p>
        </div>

        {/* ===== PINNED ASSETS ===== */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Pin className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white font-orbitron tracking-wide">PINNED ASSETS</h2>
          </div>
          <div className="bg-gradient-to-r from-amber-500/10 to-cyan-500/10 border border-amber-500/30 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/20 rounded-lg p-2">
                  <FileText className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <p className="font-bold text-white">Investor Deck (PDF, 14 slides)</p>
                  <p className="text-sm text-gray-400">Public link • No login required</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => window.open(INVESTOR_DECK_PDF_URL, '_blank')}
                  className="bg-amber-500/20 border border-amber-500/50 text-amber-300 hover:bg-amber-500/30"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = INVESTOR_DECK_PDF_URL;
                    link.download = 'VALID-Investor-Deck-2025.pdf';
                    link.click();
                  }}
                  className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20"
                >
                  <FileDown className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Pitch Deck Carousel */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-300 via-cyan-200 to-teal-300 bg-clip-text text-transparent mb-2 font-orbitron tracking-wide drop-shadow-[0_0_25px_rgba(45,212,191,0.8)] animate-[pulse_2s_ease-in-out_infinite]">
              PITCH DECK
            </h2>
            <p className="text-muted-foreground text-sm">
              Auto-advances every 5 seconds • Hover to pause • Click arrows or swipe to navigate
            </p>
          </div>
          {/* 3D Gradient Container for Pitch Deck */}
          <div className="relative p-1 rounded-2xl bg-gradient-to-br from-cyan-500/40 via-blue-600/30 to-purple-600/40 shadow-[0_0_40px_rgba(0,200,255,0.3),0_20px_60px_rgba(0,0,0,0.5)] transform perspective-1000 hover:scale-[1.01] transition-all duration-500">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-transparent via-white/5 to-white/10 pointer-events-none" />
            <PitchCarousel images={pitchDeckImages} autoAdvanceMs={5000} />
          </div>
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

          <Card className="bg-black/40 border-2 border-cyan-500/60 backdrop-blur-sm shadow-[0_0_30px_rgba(0,240,255,0.4)] animate-[pulse_3s_ease-in-out_infinite] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)] transition-shadow duration-300">
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
                onClick={generateConvertibleNotePDF}
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
                    Generate Convertible Note PDF
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                This tool generates a draft Convertible Note agreement. Always have legal counsel review before execution.
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
