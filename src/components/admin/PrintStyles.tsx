import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

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

export const LastUpdated = () => (
  <p className="text-sm text-muted-foreground mb-4 print:text-black">
    Last Updated: 2025-12-29
  </p>
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
  <div className={`border rounded-lg p-6 mb-6 print:border-black print:bg-white ${className}`}>
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
