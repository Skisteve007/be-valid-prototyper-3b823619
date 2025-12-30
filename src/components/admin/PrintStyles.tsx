import { Button } from "@/components/ui/button";
import { Printer, Download, Shield, CheckCircle, ArrowRight } from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";

export const PrintButton = ({ className }: { className?: string }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      variant="outline"
      onClick={handlePrint}
      className={`print:hidden ${className || ""}`}
    >
      <Printer className="h-4 w-4 mr-2" />
      Print
    </Button>
  );
};

export const ExportPDFButton = ({ className }: { className?: string }) => {
  const handleExport = () => {
    window.print(); // Browser print dialog allows PDF export
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      className={`print:hidden ${className || ""}`}
    >
      <Download className="h-4 w-4 mr-2" />
      Export PDF
    </Button>
  );
};

export const LastUpdated = () => (
  <p className="text-sm text-muted-foreground mb-4 print:!text-gray-700">
    Last Updated: 2025-12-29
  </p>
);

export const BrandedHeader = ({ 
  title, 
  variant = "synth" 
}: { 
  title: string;
  variant?: "synth" | "valid" | "both";
}) => (
  <div className="print-header flex items-center justify-between mb-6 pb-4 border-b print:!border-gray-800 print:!border-b-2">
    <div className="flex items-center gap-3">
      <img src={logo} alt="VALID" className="h-10 w-10 rounded-lg print:h-12 print:w-12" />
      <span className="text-lg font-bold print:!text-black">{title}</span>
    </div>
    <div className="text-right">
      <span className="text-sm font-semibold text-primary print:!text-gray-800">
        {variant === "synth" && "SYNTH™"}
        {variant === "valid" && "VALID™"}
        {variant === "both" && "SYNTH™ / VALID™"}
      </span>
    </div>
  </div>
);

export const LegalFooter = () => (
  <div className="print-footer mt-8 pt-4 border-t border-border text-xs space-y-1 text-foreground/70 print:!text-gray-800 print:!border-gray-400">
    <p className="font-semibold text-foreground print:!text-black">Confidential — For discussion purposes only.</p>
    <p className="text-foreground/80 print:!text-gray-700">© 2025 Giant Ventures LLC. All rights reserved.</p>
    <p className="text-foreground/80 print:!text-gray-700">SYNTH™ and VALID™ are trademarks of Giant Ventures LLC.</p>
    <p className="text-foreground/80 print:!text-gray-700">Do not distribute without permission. No guarantee of accuracy; information subject to change.</p>
  </div>
);

export const ConfidentialityBanner = () => (
  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6 print:!bg-red-50 print:!border-red-600 print:!border-2">
    <p className="text-red-400 font-bold text-center print:!text-red-700">
      ⚠️ CONFIDENTIAL INTERNAL MATERIAL — Do not forward externally. No reverse engineering or reproduction.
    </p>
  </div>
);

export const PrintableSection = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => (
  <div className={`print:bg-white print:text-black print:p-8 ${className}`}>
    {children}
  </div>
);

export const PrintableHeading = ({ 
  level, 
  children, 
  className = "" 
}: { 
  level: 1 | 2 | 3; 
  children: React.ReactNode;
  className?: string;
}) => {
  const baseStyles = "font-bold print:text-black";
  
  switch (level) {
    case 1:
      return <h1 className={`text-3xl md:text-4xl mb-6 ${baseStyles} ${className}`}>{children}</h1>;
    case 2:
      return <h2 className={`text-2xl md:text-3xl mb-4 ${baseStyles} ${className}`}>{children}</h2>;
    case 3:
      return <h3 className={`text-xl md:text-2xl mb-3 ${baseStyles} ${className}`}>{children}</h3>;
    default:
      return <h2 className={`text-2xl mb-4 ${baseStyles} ${className}`}>{children}</h2>;
  }
};

export const PrintableParagraph = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) => (
  <p className={`text-base leading-relaxed mb-4 print:text-black ${className}`}>
    {children}
  </p>
);

export const PrintableBulletList = ({ 
  items, 
  className = "" 
}: { 
  items: string[];
  className?: string;
}) => (
  <ul className={`list-disc list-inside space-y-2 mb-4 print:text-black ${className}`}>
    {items.map((item, index) => (
      <li key={index} className="text-base leading-relaxed">{item}</li>
    ))}
  </ul>
);

export const PrintableCard = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`border rounded-lg p-6 mb-6 print:!border-gray-800 print:!border-2 print:!bg-white ${className}`}>
    {children}
  </div>
);

export const DeprecationBanner = () => (
  <div className="bg-amber-500/20 border border-amber-500 rounded-lg p-4 mb-6 print:hidden">
    <p className="text-amber-400 font-semibold">
      ⚠️ DEPRECATED — This content has been replaced. Use the Canonical Pitch &amp; Positioning section in CEO Playbook.
    </p>
  </div>
);

export const QualityGateChecklist = () => (
  <div className="mt-8 p-6 border-2 border-dashed rounded-lg print:!border-gray-800 print:!border-2">
    <h4 className="text-lg font-bold mb-4 print:!text-black">FINAL Q&A PASS (CHECKLIST)</h4>
    <div className="space-y-2 print:!text-black">
      <div className="flex items-center gap-2">
        <span className="font-mono">☐</span>
        <span>Readable at high-school level</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono">☐</span>
        <span>No secret sauce disclosed</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono">☐</span>
        <span>No overclaims (no "guaranteed/unhackable/100% secure")</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono">☐</span>
        <span>Clear who it's for + what problem it solves</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono">☐</span>
        <span>Print-ready layout</span>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t print:!border-gray-800 print:!text-black">
      <div className="flex items-center gap-4">
        <span>Passed:</span>
        <span className="font-mono">☐ Yes</span>
        <span className="font-mono">☐ No</span>
      </div>
      <div className="mt-2">
        <span>Reviewer: ____________</span>
        <span className="ml-8">Date: ____________</span>
      </div>
    </div>
  </div>
);

// Simple conceptual visuals for decks
export const SimpleFlowDiagram = () => (
  <div className="my-6 p-6 bg-muted/30 rounded-lg print:!bg-gray-100 print:!border print:!border-gray-400">
    <div className="flex items-center justify-center gap-4 flex-wrap">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center print:!bg-blue-100 print:!border print:!border-blue-400">
          <span className="text-2xl">📥</span>
        </div>
        <span className="text-sm mt-2 font-medium print:!text-black">Input</span>
      </div>
      <ArrowRight className="h-6 w-6 text-muted-foreground print:!text-gray-600" />
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center print:!bg-blue-100 print:!border print:!border-blue-400">
          <Shield className="h-8 w-8 text-primary print:!text-blue-700" />
        </div>
        <span className="text-sm mt-2 font-medium print:!text-black">Verify</span>
      </div>
      <ArrowRight className="h-6 w-6 text-muted-foreground print:!text-gray-600" />
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center print:!bg-blue-100 print:!border print:!border-blue-400">
          <CheckCircle className="h-8 w-8 text-primary print:!text-blue-700" />
        </div>
        <span className="text-sm mt-2 font-medium print:!text-black">Audit</span>
      </div>
    </div>
  </div>
);

export const LayerCakeDiagram = () => (
  <div className="my-6 p-6 bg-muted/30 rounded-lg print:bg-gray-50 print:border print:border-gray-300">
    <div className="space-y-3">
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center print:bg-blue-50 print:border-blue-300">
        <span className="font-semibold print:text-black">Outputs / Actions</span>
        <p className="text-xs text-muted-foreground print:text-gray-600">Governed decisions, verified results</p>
      </div>
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4 text-center print:bg-cyan-50 print:border-cyan-300">
        <span className="font-bold text-cyan-400 print:text-cyan-700">SYNTH™ Governance Layer</span>
        <p className="text-xs text-muted-foreground print:text-gray-600">Policy control, verification, audit trails</p>
      </div>
      <div className="bg-muted border border-border rounded-lg p-4 text-center print:bg-gray-100 print:border-gray-300">
        <span className="font-semibold print:text-black">Systems of Record</span>
        <p className="text-xs text-muted-foreground print:text-gray-600">Existing data, AI models, enterprise tools</p>
      </div>
    </div>
  </div>
);

export const PhysicalDigitalSplit = () => (
  <div className="my-6 grid grid-cols-2 gap-4">
    <div className="p-4 border rounded-lg text-center print:border-black">
      <div className="text-3xl mb-2">🏢</div>
      <span className="font-bold print:text-black">VALID™ / GhostPass™</span>
      <p className="text-xs text-muted-foreground mt-1 print:text-gray-600">Physical World Verification</p>
      <p className="text-xs print:text-black">Identity • Access • Payments</p>
    </div>
    <div className="p-4 border rounded-lg text-center print:border-black">
      <div className="text-3xl mb-2">🤖</div>
      <span className="font-bold print:text-black">SYNTH™</span>
      <p className="text-xs text-muted-foreground mt-1 print:text-gray-600">Digital AI Governance</p>
      <p className="text-xs print:text-black">Policy • Audit • Control</p>
    </div>
  </div>
);
