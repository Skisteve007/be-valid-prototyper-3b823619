import { PrintButton, ExportPDFButton, LastUpdated, PrintableSection, PrintableHeading, BrandedHeader, LegalFooter } from "../PrintStyles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, ExternalLink } from "lucide-react";

export const CEOPortfolio = () => {
  const pdfUrl = "/documents/Steve_Exc_AI_Arch.pdf";

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'Steve_Executive_AI_Architecture_Portfolio.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };

  return (
    <PrintableSection>
      <BrandedHeader title="CEO Professional Portfolio" variant="both" />
      
      <div className="flex items-center justify-between mb-6">
        <PrintableHeading level={2}>CEO Professional Portfolio</PrintableHeading>
        <div className="flex gap-2 print:hidden">
          <Button onClick={handleDownloadPDF} variant="default" size="sm" className="gap-2">
            <FileDown className="h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={handleOpenInNewTab} variant="outline" size="sm" className="gap-2">
            <ExternalLink className="h-4 w-4" />
            Open in New Tab
          </Button>
          <PrintButton />
          <ExportPDFButton />
        </div>
      </div>
      <LastUpdated />

      <p className="text-muted-foreground mb-6 print:text-black">
        Executive portfolio showcasing AI architecture expertise and leadership experience. 
        Use the "Download PDF" button to quickly grab a copy for email attachments.
      </p>

      <Card className="print:border-black print:bg-white mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold print:text-black">Quick Actions for Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleDownloadPDF} size="lg" className="gap-2 print:hidden">
              <FileDown className="h-5 w-5" />
              Download Portfolio PDF for Email
            </Button>
          </div>
          <p className="text-sm text-muted-foreground print:text-black">
            Click above to download the PDF, then attach it to your email.
          </p>
        </CardContent>
      </Card>

      <Card className="print:border-black print:bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold print:text-black">Portfolio Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full print:hidden">
            <iframe 
              src={pdfUrl}
              className="w-full h-[800px] border rounded-lg"
              title="CEO Professional Portfolio"
            />
          </div>
          <div className="hidden print:block">
            <p className="text-sm italic">
              [PDF document - see attached file: Steve_Executive_AI_Architecture_Portfolio.pdf]
            </p>
          </div>
        </CardContent>
      </Card>

      <LegalFooter />
    </PrintableSection>
  );
};
