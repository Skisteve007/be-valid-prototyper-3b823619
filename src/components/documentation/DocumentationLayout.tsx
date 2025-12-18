import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Search, Menu, Printer, Download, 
  Shield, Wallet, Zap, CreditCard, 
  BarChart3, Clock, FileText, Calculator
} from "lucide-react";
import {
  WelcomeSection,
  WalletSection,
  GhostPassSection,
  DirectPaymentSection,
  FeeScheduleSection,
  PayoutSection,
  QuickReferenceSection,
  CalculatorSection,
} from "./DocumentationContent";

const SECTIONS = [
  { id: "welcome", label: "Welcome to VALID™", icon: Shield },
  { id: "wallet", label: "How the Wallet Works", icon: Wallet },
  { id: "ghost-pass", label: "GHOST™ Pass", icon: Zap },
  { id: "direct-payment", label: "Direct Payments", icon: CreditCard },
  { id: "fee-schedule", label: "Complete Fee Schedule", icon: BarChart3 },
  { id: "payouts", label: "Payouts & Transfers", icon: Clock },
  { id: "quick-reference", label: "Quick Reference", icon: FileText },
  { id: "calculator", label: "Interactive Calculator", icon: Calculator },
];

interface DocumentationLayoutProps {
  title?: string;
  showSearch?: boolean;
  showPdfDownload?: boolean;
  variant?: "admin" | "partner" | "public";
}

export function DocumentationLayout({
  title = "VALID™ Payment Documentation",
  showSearch = true,
  showPdfDownload = true,
  variant = "public",
}: DocumentationLayoutProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("welcome");
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    // Dynamic import to reduce bundle size
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text("VALID™ Payment Documentation", 20, 20);
    
    doc.setFontSize(12);
    let y = 40;
    
    // Welcome section
    doc.setFontSize(14);
    doc.text("Welcome to VALID™", 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.text("VALID™ is a comprehensive payment and verification platform.", 20, y);
    y += 20;
    
    // Ghost Pass section
    doc.setFontSize(14);
    doc.text("GHOST™ Pass (30/30/10/30 Split)", 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.text("Bronze: $10 | Silver: $20 | Gold: $50", 20, y);
    y += 7;
    doc.text("Split: 30% Venue, 30% Promoter, 10% Pool, 30% VALID™", 20, y);
    y += 20;
    
    // Fee schedule
    doc.setFontSize(14);
    doc.text("Fee Schedule", 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.text("Transaction Fee: 1.5%", 20, y);
    y += 7;
    doc.text("Gas Fee: $0.05-$0.50 per scan (volume-based)", 20, y);
    y += 7;
    doc.text("Standard Payout: Free (1-2 days)", 20, y);
    y += 7;
    doc.text("Instant Payout: 1.5%", 20, y);
    y += 20;
    
    // Gas fee tiers
    doc.setFontSize(14);
    doc.text("Gas Fee Tiers", 20, y);
    y += 10;
    doc.setFontSize(10);
    doc.text("Under 1,000 scans: $0.25-$0.50", 20, y);
    y += 7;
    doc.text("1,000-10,000 scans: $0.15-$0.25", 20, y);
    y += 7;
    doc.text("10,000-100,000 scans: $0.10-$0.15", 20, y);
    y += 7;
    doc.text("100,000+ scans: $0.05-$0.10", 20, y);
    
    doc.save("VALID-Payment-Documentation.pdf");
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredSections = SECTIONS.filter((section) =>
    section.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const NavContent = () => (
    <div className="space-y-1">
      {filteredSections.map((section) => {
        const Icon = section.icon;
        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left
              ${activeSection === section.id 
                ? "bg-primary/10 text-primary font-medium" 
                : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {section.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="mt-6">
                <NavContent />
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="font-semibold text-lg truncate">{title}</h1>

          <div className="flex-1" />

          {showSearch && (
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          )}

          <Button variant="outline" size="sm" onClick={handlePrint} className="hidden sm:flex">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>

          {showPdfDownload && (
            <Button variant="outline" size="sm" onClick={handleDownloadPdf} className="hidden sm:flex">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          )}
        </div>
      </header>

      <div className="container flex gap-6 py-6">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="sticky top-20">
            <ScrollArea className="h-[calc(100vh-6rem)]">
              <NavContent />
            </ScrollArea>
          </div>
        </aside>

        {/* Main Content */}
        <main ref={contentRef} className="flex-1 min-w-0 space-y-12 print:space-y-8">
          <WelcomeSection id="welcome" />
          <WalletSection id="wallet" />
          <GhostPassSection id="ghost-pass" />
          <DirectPaymentSection id="direct-payment" />
          <FeeScheduleSection id="fee-schedule" />
          <PayoutSection id="payouts" />
          <QuickReferenceSection id="quick-reference" />
          <CalculatorSection id="calculator" />
        </main>
      </div>
    </div>
  );
}
