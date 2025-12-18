import { DocumentationLayout } from "@/components/documentation/DocumentationLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentGuide() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="container py-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
      </div>
      <DocumentationLayout
        title="Payment Guide"
        showSearch={true}
        showPdfDownload={true}
        variant="public"
      />
    </div>
  );
}
