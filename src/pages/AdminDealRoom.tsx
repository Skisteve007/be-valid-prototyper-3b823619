import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, FileText, Download, Shield, ArrowLeft, Plus, Trash2, TrendingUp, CheckCircle2, Brain, Lock, ExternalLink, FileDown, Pin, Lightbulb, Info, Target, Calendar, DollarSign, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThinkTankManager from "@/components/admin/ThinkTankManager";
import { jsPDF } from "jspdf";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import logo from "@/assets/valid-logo.jpeg";
import { 
  TRANCHE_0, 
  TRANCHE_1, 
  TRANCHE_2, 
  TRANCHE_3,
  ACTIVE_TRANCHES,
  formatUsd,
  formatUsdCompact,
  validateMinimumCheck,
  getMinCheckError,
  COMPANY_INFO,
  SAFE_ENABLED,
  SAFE_NOTICE,
  type TrancheConfig 
} from "@/config/fundraisingConfig";

// PUBLIC PDF URL - Same as PitchDeck.tsx for consistency
const INVESTOR_DECK_PDF_URL = "/images/pitch/VALID-Investor-Deck-2025.pdf";
const AUTHORIZED_EMAILS = ["sgrillocce@gmail.com", "aeidigitalsolutions@gmail.com", "steve@bevalid.app"];

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
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [selectedTranche, setSelectedTranche] = useState<TrancheConfig>(TRANCHE_0);
  const [isTranche2ModalOpen, setIsTranche2ModalOpen] = useState(false);

  // Derived values from selected tranche (read-only in form)
  const valuationCap = selectedTranche.valuationCapUsd.toString();
  const discountRate = selectedTranche.discountPercent.toString();

  // Handle tranche selection
  const handleTrancheSelect = (tranche: TrancheConfig) => {
    setSelectedTranche(tranche);
    // Reset investment amount when switching tranches
    setInvestmentAmount("");
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

  // Use selected tranche's target for progress
  const currentTrancheCap = selectedTranche.targetRaiseUsd;
  const progressPercentage = Math.min((totalRaised / currentTrancheCap) * 100, 100);
  const isTrancheComplete = totalRaised >= currentTrancheCap;

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
            trancheCap: currentTrancheCap,
            trancheName: selectedTranche.name,
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
    
    const amount = parseFloat(investmentAmount);
    if (!investmentAmount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid investment amount");
      return;
    }

    // Validate minimum check based on selected tranche
    if (!validateMinimumCheck(amount, selectedTranche)) {
      toast.error(getMinCheckError(selectedTranche));
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
      maturityDate.setMonth(maturityDate.getMonth() + selectedTranche.maturityMonths);
      const maturityDateStr = maturityDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      // Terms from config
      const interestRate = selectedTranche.interestRate;
      const qualifiedFinancingThreshold = 500000;
      const mfnEnabled = selectedTranche.mfnEnabled;

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
      doc.text(`${selectedTranche.name}`, pageWidth / 2, y, { align: "center" });
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

      // Section 4 - MFN (conditional)
      if (mfnEnabled) {
        addSectionHeader("4. Most Favored Nation (MFN).");
        addText(`If the Company issues any other convertible promissory note(s) or similar debt instruments prior to conversion of this Note that contain economic terms more favorable to the investor than the economic terms of this Note (valuation cap and/or discount rate), then, at the Holder's election, the Company shall amend this Note to match such more favorable economic term(s).`);
        addText(`This MFN does not apply to (i) employee compensation arrangements, (ii) bank debt or equipment financing, or (iii) strategic/vendor commercial contracts.`);
        y += 5;
      }

      // Section 5 - Events of Default
      const section5Num = mfnEnabled ? "5" : "4";
      addSectionHeader(`${section5Num}. Events of Default.`);
      addText(`Each of the following constitutes an "Event of Default": (i) the Company's failure to pay amounts due under this Note when due and such failure continues for ten (10) days after written notice; (ii) the Company files for bankruptcy or insolvency; (iii) the Company makes an assignment for the benefit of creditors; or (iv) the Company materially breaches this Note and fails to cure within fifteen (15) days after written notice.`);
      addText(`Upon an Event of Default, the Holder may declare the Note immediately due and payable; provided, however, the Holder agrees that its remedy shall be limited to repayment of the Principal Amount plus accrued interest, if any, and the Holder shall not seek to impose personal liability on any manager, member, officer, or employee of the Company solely by virtue of this Note.`);
      y += 5;

      // Section 6 - Company Representations
      const section6Num = mfnEnabled ? "6" : "5";
      addSectionHeader(`${section6Num}. Company Representations.`);
      addText(`The Company represents that (a) it is duly organized and in good standing under the laws of Texas, (b) it has authority to execute and deliver this Note, and (c) the execution and delivery of this Note have been duly authorized.`);
      y += 5;

      // Section 7 - Holder Representations
      const section7Num = mfnEnabled ? "7" : "6";
      addSectionHeader(`${section7Num}. Holder Representations.`);
      addText(`The Holder represents that (a) it has authority to execute and deliver this Note, (b) it is an "accredited investor" under Rule 501 of Regulation D, and (c) it is acquiring this Note for investment and not with a view to distribution.`);
      y += 5;

      // Section 8 - Transfer; Assignment
      const section8Num = mfnEnabled ? "8" : "7";
      addSectionHeader(`${section8Num}. Transfer; Assignment.`);
      addText(`The Holder may transfer or assign this Note only (i) to an affiliate, or (ii) with the Company's written consent (not to be unreasonably withheld), and in all cases in compliance with applicable securities laws. Any permitted transferee takes subject to this Note's terms.`);
      y += 5;

      // Section 9 - Amendments; Waivers
      const section9Num = mfnEnabled ? "9" : "8";
      addSectionHeader(`${section9Num}. Amendments; Waivers.`);
      addText(`Any term of this Note may be amended or waived only with the written consent of the Company and the Holder; provided that if the Company issues multiple notes of the same form, the Company may provide that amendments may be approved by holders of a majority of the outstanding principal amount of such notes.`);
      y += 5;

      // Section 10 - Governing Law
      const section10Num = mfnEnabled ? "10" : "9";
      addSectionHeader(`${section10Num}. Governing Law; Venue.`);
      addText(`This Note shall be governed by and construed in accordance with the laws of the State of Texas, without regard to conflicts of law principles. The parties consent to exclusive venue in state or federal courts located in Palm Beach County, Florida or Harris County, Texas.`);
      y += 5;

      // Section 11 - Miscellaneous
      const section11Num = mfnEnabled ? "11" : "10";
      addSectionHeader(`${section11Num}. Miscellaneous.`);
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
        doc.text(`CONFIDENTIAL - Giant Ventures, LLC d/b/a Valid | ${selectedTranche.shortName}`, pageWidth / 2, 290, { align: "center" });
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, 290, { align: "right" });
        doc.setTextColor(0);
      }

      // Save the PDF
      doc.save(`Convertible_Note_${selectedTranche.shortName.replace(/\s+/g, '_')}_${investorName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      
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
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111] pt-12 sm:pt-14 md:pt-16">
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


        <div className="max-w-2xl mx-auto">
          {/* Tranche Selector */}
          <div className="mb-6">
            <Label className="text-white text-sm mb-3 block">Select Investment Round</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tranche 0 - Emergency Bridge */}
              <button
                onClick={() => handleTrancheSelect(TRANCHE_0)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedTranche.id === 0
                    ? 'bg-red-500/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                    : 'bg-white/5 border-white/20 hover:border-white/40'
                }`}
              >
                <Badge className={`mb-2 ${selectedTranche.id === 0 ? 'bg-red-500/30 text-red-300 border-red-500/50' : 'bg-amber-500/20 text-amber-400 border-amber-500/50'}`}>
                  {TRANCHE_0.status === 'open' ? '🔴 ACTIVE NOW' : 'Upcoming'}
                </Badge>
                <div className={`font-bold text-lg mb-1 ${selectedTranche.id === 0 ? 'text-red-400' : 'text-white'}`}>
                  {TRANCHE_0.name}
                </div>
                <div className={`text-xs ${selectedTranche.id === 0 ? 'text-red-400/80' : 'text-gray-400'}`}>
                  {formatUsdCompact(TRANCHE_0.targetRaiseUsd)} Raise • {formatUsdCompact(TRANCHE_0.valuationCapUsd)} Cap • {TRANCHE_0.discountPercent}% Discount
                </div>
                {TRANCHE_0.mfnEnabled && (
                  <div className="text-[10px] text-amber-400 mt-1">+ MFN Protection</div>
                )}
              </button>
              
              {/* Tranche 1 - Launch Round */}
              <button
                onClick={() => handleTrancheSelect(TRANCHE_1)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  selectedTranche.id === 1
                    ? 'bg-amber-500/20 border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-white/5 border-white/20 hover:border-white/40'
                }`}
              >
                <Badge className={`mb-2 ${selectedTranche.id === 1 ? 'bg-amber-500/30 text-amber-300 border-amber-500/50' : 'bg-gray-500/20 text-gray-400 border-gray-500/50'}`}>
                  {TRANCHE_1.status === 'open' ? '🟢 OPEN' : 'Next Up'}
                </Badge>
                <div className={`font-bold text-lg mb-1 ${selectedTranche.id === 1 ? 'text-amber-400' : 'text-white'}`}>
                  {TRANCHE_1.name}
                </div>
                <div className={`text-xs ${selectedTranche.id === 1 ? 'text-amber-400/80' : 'text-gray-400'}`}>
                  {formatUsdCompact(TRANCHE_1.targetRaiseUsd)} Raise • {formatUsdCompact(TRANCHE_1.valuationCapUsd)} Cap • {TRANCHE_1.discountPercent}% Discount
                </div>
              </button>
              
              {/* Tranche 2 - Seed (Placeholder) */}
              <button
                onClick={() => setIsTranche2ModalOpen(true)}
                className="p-4 rounded-xl border-2 text-left bg-cyan-500/10 border-cyan-500/30 cursor-pointer relative shadow-[0_0_15px_rgba(0,240,255,0.2)] hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300"
              >
                <Badge className="absolute -top-2 -right-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 text-[10px] px-2 shadow-[0_0_10px_rgba(0,240,255,0.4)]">
                  {TRANCHE_2.timeline || 'Planned'}
                </Badge>
                <div className="font-bold text-lg mb-1 text-cyan-400">
                  {TRANCHE_2.name}
                </div>
                <div className="text-xs text-cyan-400/80">
                  {formatUsdCompact(TRANCHE_2.targetRaiseUsd)} Raise • {formatUsdCompact(TRANCHE_2.valuationCapRangeUsd?.min || 0)}-{formatUsdCompact(TRANCHE_2.valuationCapRangeUsd?.max || 0)} Cap • {TRANCHE_2.discountRangePercent?.min}-{TRANCHE_2.discountRangePercent?.max}% Discount
                </div>
                <div className="text-[10px] text-cyan-400/60 mt-1 flex items-center gap-1">
                  <Info className="h-3 w-3" /> Click for details
                </div>
              </button>
              
              {/* Tranche 3 - Priced Round (Placeholder) */}
              <div className="p-4 rounded-xl border-2 text-left bg-gray-500/5 border-gray-500/20 opacity-60">
                <Badge className="mb-2 bg-gray-500/20 text-gray-400 border-gray-500/50">
                  Planned
                </Badge>
                <div className="font-bold text-lg mb-1 text-gray-400">
                  {TRANCHE_3.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatUsdCompact(TRANCHE_3.targetRaiseUsd)} Target • Priced Equity
                </div>
              </div>
            </div>
            
            {/* Selected Tranche Status Tracker */}
            <div className="mt-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{selectedTranche.shortName} Status:</span>
                <span className={`font-mono font-bold ${progressPercentage >= 100 ? 'text-green-400' : 'text-amber-400'}`}>
                  {formatUsd(totalRaised)} / {formatUsd(selectedTranche.targetRaiseUsd)}
                  {progressPercentage >= 100 && ' ✓ Complete'}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2 mt-2" />
            </div>
            
            {/* SAFE Coming Soon Notice */}
            {!SAFE_ENABLED && (
              <div className="mt-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-center">
                <span className="text-purple-400 text-xs font-mono">{SAFE_NOTICE}</span>
              </div>
            )}
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
                  Investment Amount (USD) <span className="text-red-400">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    id="investmentAmount"
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder={`Minimum ${formatUsd(selectedTranche.minCheckUsd)}`}
                    className="bg-white/5 border-white/20 text-white pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500">Minimum for {selectedTranche.shortName}: {formatUsd(selectedTranche.minCheckUsd)}</p>
              </div>

              {/* Valuation Cap - AUTO-FILLED from tranche (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="valuationCap" className="text-white flex items-center gap-2">
                  Valuation Cap (USD)
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-[10px]">Auto-filled</Badge>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    id="valuationCap"
                    type="text"
                    value={formatUsd(parseInt(valuationCap))}
                    readOnly
                    disabled
                    className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400 pl-8 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500">Set by tranche: {selectedTranche.name}</p>
              </div>

              {/* Discount Rate - AUTO-FILLED from tranche (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="discountRate" className="text-white flex items-center gap-2">
                  Discount Rate (%)
                  <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-[10px]">Auto-filled</Badge>
                </Label>
                <div className="relative">
                  <Input
                    id="discountRate"
                    type="text"
                    value={`${discountRate}%`}
                    readOnly
                    disabled
                    className="bg-cyan-500/10 border-cyan-500/30 text-cyan-400 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Set by tranche: {selectedTranche.name}
                  {selectedTranche.mfnEnabled && ' • MFN Protection Enabled'}
                </p>
              </div>

              {/* Preview Summary */}
              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <h4 className="text-cyan-400 font-semibold mb-2 text-sm">Contract Summary</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-400">Tranche:</span>
                  <span className="text-cyan-400 font-bold">{selectedTranche.name}</span>
                  <span className="text-gray-400">Investor:</span>
                  <span className="text-white">{investorName || "—"}</span>
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white">{investmentAmount ? formatUsd(parseFloat(investmentAmount)) : "—"}</span>
                  <span className="text-gray-400">Valuation Cap:</span>
                  <span className="text-white">{formatUsd(selectedTranche.valuationCapUsd)}</span>
                  <span className="text-gray-400">Discount:</span>
                  <span className="text-white">{selectedTranche.discountPercent}%</span>
                  {selectedTranche.mfnEnabled && (
                    <>
                      <span className="text-gray-400">MFN:</span>
                      <span className="text-amber-400">Yes ✓</span>
                    </>
                  )}
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
                {isTrancheComplete && (
                  <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/50">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    {selectedTranche.shortName} Complete
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Track progress toward the {formatUsd(selectedTranche.targetRaiseUsd)} {selectedTranche.shortName} cap
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Total Raised (Wired/Cleared)</span>
                  <span className={isTrancheComplete ? "text-green-400 font-bold" : "text-white"}>
                    {formatUsd(totalRaised)} / {formatUsd(selectedTranche.targetRaiseUsd)}
                  </span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className={`h-4 ${isTrancheComplete ? "[&>div]:bg-green-500" : "[&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500"}`}
                />
                <p className="text-xs text-gray-500">
                  {progressPercentage.toFixed(1)}% of {selectedTranche.shortName} goal
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

        {/* SYNTH™ Think Tank Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <Tabs defaultValue="think-tank" className="space-y-6">
            <TabsList className="bg-purple-500/10 border border-purple-500/30 w-full grid grid-cols-1 h-auto p-1">
              <TabsTrigger 
                value="think-tank" 
                className="data-[state=active]:bg-purple-500/20 flex items-center gap-2 py-3 px-4 text-sm"
              >
                <Lightbulb className="w-4 h-4" />
                <span>SYNTH™ Think Tank</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="think-tank" className="space-y-6">
              <ThinkTankManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Tranche 2 Information Modal */}
      <Dialog open={isTranche2ModalOpen} onOpenChange={setIsTranche2ModalOpen}>
        <DialogContent className="bg-black/95 border border-cyan-500/50 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-cyan-400 font-mono tracking-widest text-center text-xl">
              TRANCHE 2: SERIES SEED
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center font-mono text-xs">
              Coming Q2 2026
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 pt-4">
            {/* Key Terms */}
            <div className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-sm tracking-widest flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                KEY TERMS
              </h3>
              <div className="grid gap-2">
                <div className="flex justify-between items-center p-3 bg-cyan-500/10 rounded border border-cyan-500/30">
                  <span className="text-gray-300 font-mono text-sm">Target Raise</span>
                  <span className="text-cyan-400 font-bold font-mono">$1,500,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-cyan-500/10 rounded border border-cyan-500/30">
                  <span className="text-gray-300 font-mono text-sm">Valuation Cap</span>
                  <span className="text-cyan-400 font-bold font-mono">$10M - $12M</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-cyan-500/10 rounded border border-cyan-500/30">
                  <span className="text-gray-300 font-mono text-sm">Discount Rate</span>
                  <span className="text-cyan-400 font-bold font-mono">25%</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-sm tracking-widest flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                TIMELINE
              </h3>
              <div className="p-3 bg-white/5 rounded border border-white/10">
                <div className="space-y-2 font-mono text-sm">
                  <p className="text-gray-300">
                    <span className="text-cyan-400 font-bold">Q1 2026:</span> Complete Tranche 1 deployment
                  </p>
                  <p className="text-gray-300">
                    <span className="text-cyan-400 font-bold">Q2 2026:</span> Open Series Seed round
                  </p>
                  <p className="text-gray-300">
                    <span className="text-cyan-400 font-bold">Q3 2026:</span> Close round, scale operations
                  </p>
                </div>
              </div>
            </div>

            {/* Use of Funds */}
            <div className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-sm tracking-widest flex items-center gap-2">
                <Target className="h-4 w-4" />
                USE OF FUNDS
              </h3>
              <div className="grid gap-2">
                <div className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/10">
                  <span className="text-gray-400 font-mono text-xs">Engineering & Product</span>
                  <span className="text-white font-mono text-xs">40%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/10">
                  <span className="text-gray-400 font-mono text-xs">Sales & Marketing</span>
                  <span className="text-white font-mono text-xs">30%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/10">
                  <span className="text-gray-400 font-mono text-xs">Operations & Legal</span>
                  <span className="text-white font-mono text-xs">20%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/10">
                  <span className="text-gray-400 font-mono text-xs">Reserve</span>
                  <span className="text-white font-mono text-xs">10%</span>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            <div className="space-y-3">
              <h3 className="font-mono text-cyan-400 text-sm tracking-widest flex items-center gap-2">
                <Users className="h-4 w-4" />
                PREREQUISITES
              </h3>
              <div className="p-3 bg-amber-500/10 rounded border border-amber-500/30">
                <p className="font-mono text-xs text-amber-400/90">
                  Tranche 2 opens after Tranche 1 ($200K) is fully deployed and key milestones are hit:
                </p>
                <ul className="mt-2 space-y-1 font-mono text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-amber-400" />
                    Patent applications filed
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-amber-400" />
                    Core team assembled
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-amber-400" />
                    Enterprise LOIs secured
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDealRoom;
