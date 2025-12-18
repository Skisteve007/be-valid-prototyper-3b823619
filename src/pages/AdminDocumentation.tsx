import { DocumentationLayout } from "@/components/documentation/DocumentationLayout";

export default function AdminDocumentation() {
  return (
    <DocumentationLayout
      title="VALID™ Owner's Manual"
      showSearch={true}
      showPdfDownload={true}
      variant="admin"
    />
  );
}
