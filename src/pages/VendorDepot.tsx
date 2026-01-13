import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { 
  Upload, FileText, CheckCircle, Shield, ArrowLeft, 
  Download, Loader2, UserCheck, Stethoscope, Scale, FileSearch 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const serviceTypes = [
  {
    id: "identity-verification",
    label: "ID / Identity Verification",
    description: "Verify identity documents against authoritative sources",
    icon: UserCheck,
  },
  {
    id: "medical-record-review",
    label: "Medical Record Review",
    description: "AI-governed review of medical records and prescriptions",
    icon: Stethoscope,
  },
  {
    id: "legal-document-analysis",
    label: "Legal Document Analysis",
    description: "Multi-model validation of legal documents and contracts",
    icon: Scale,
  },
  {
    id: "general-output-validation",
    label: "General Output Validation",
    description: "Validate AI-generated outputs for accuracy and compliance",
    icon: FileSearch,
  },
];

const VendorDepot = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // Form state
  const [vendorName, setVendorName] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateSubmissionPackage = () => {
    const timestamp = new Date().toISOString();
    const submissionId = `VD-${Date.now().toString(36).toUpperCase()}`;
    
    const packageData = {
      submissionId,
      timestamp,
      vendor: {
        name: vendorName,
        email: vendorEmail,
        id: vendorId || "Not provided",
      },
      serviceRequested: serviceTypes.find(s => s.id === serviceType)?.label || serviceType,
      notes: notes || "None",
      filesAttached: files.map(f => ({
        name: f.name,
        type: f.type,
        size: `${(f.size / 1024).toFixed(2)} KB`,
      })),
    };

    return { submissionId, packageData };
  };

  const downloadSubmissionPackage = (packageData: any, submissionId: string) => {
    const blob = new Blob([JSON.stringify(packageData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submission-${submissionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!vendorName || !vendorEmail || !serviceType) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (files.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }

    setIsSubmitting(true);

    try {
      const { submissionId, packageData } = generateSubmissionPackage();

      // Convert files to base64 for email attachment info
      const fileDetails = files.map(f => ({
        name: f.name,
        type: f.type,
        size: `${(f.size / 1024).toFixed(2)} KB`,
      }));

      // Send to edge function which emails steve@bvalid.app
      const { error } = await supabase.functions.invoke("vendor-depot-submit", {
        body: {
          submissionId,
          vendorName,
          vendorEmail,
          vendorId: vendorId || "Not provided",
          serviceType: serviceTypes.find(s => s.id === serviceType)?.label || serviceType,
          notes: notes || "None",
          files: fileDetails,
          timestamp: packageData.timestamp,
        },
      });

      if (error) throw error;

      // Download the package for the user
      downloadSubmissionPackage(packageData, submissionId);

      setSubmitted(true);
      toast.success("Documents submitted successfully!");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Helmet>
          <title>Submission Received | Valid™ SYNTH</title>
        </Helmet>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-lg w-full border-primary/30 bg-primary/5">
            <CardContent className="pt-8 pb-6 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Submission Received</h2>
              <p className="text-muted-foreground mb-6">
                Your documents have been submitted to the Valid™ SYNTH governance pipeline for processing.
              </p>
              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <p className="text-sm font-medium text-foreground mb-2">What happens next:</p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Your documents enter our 7-seat AI Senate for multi-model validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>A proof record with scores and verdict will be generated</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>Results returned within <strong>20 minutes</strong> (pre-demo model)</span>
                  </li>
                </ul>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                A confirmation package has been downloaded to your device.
              </p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate("/demos")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Demos
                </Button>
                <Button onClick={() => {
                  setSubmitted(false);
                  setVendorName("");
                  setVendorEmail("");
                  setVendorId("");
                  setServiceType("");
                  setNotes("");
                  setFiles([]);
                }}>
                  Submit Another
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Vendor Depot | Valid™ SYNTH</title>
        <meta name="description" content="Upload documents for AI-governed validation. Attorneys, doctors, and enterprise vendors can submit for multi-model verification." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/demos")} className="shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/30 shrink-0">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-foreground truncate">Vendor Depot</h1>
                  <p className="text-xs text-muted-foreground">VALID | SYNTH™ Document Intake</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Info Banner */}
          <Card className="mb-6 border-primary/30 bg-primary/5">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">Governed AI Validation</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Documents are processed through our 7-seat AI Senate for multi-model consensus validation. 
                    Results include scores, verdict, and cryptographic proof record.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Notice */}
          <Card className="mb-6 border-border/50 bg-muted/30">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">
                This experience demonstrates the Valid/SYNTH governance workflow, proof-record verification, 
                and integration patterns. Outputs shown may be produced using demo-safe simulation and sample data.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Production deployments run with client-specific rule packs and verified integrations under contract.
              </p>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vendor Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Vendor Information</CardTitle>
                <CardDescription>Your contact and identification details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendorName">Name *</Label>
                    <Input 
                      id="vendorName" 
                      value={vendorName}
                      onChange={(e) => setVendorName(e.target.value)}
                      placeholder="Dr. Jane Smith"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendorEmail">Email *</Label>
                    <Input 
                      id="vendorEmail" 
                      type="email"
                      value={vendorEmail}
                      onChange={(e) => setVendorEmail(e.target.value)}
                      placeholder="jane@lawfirm.com"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vendorId">Vendor ID (optional)</Label>
                  <Input 
                    id="vendorId" 
                    value={vendorId}
                    onChange={(e) => setVendorId(e.target.value)}
                    placeholder="VND-12345 or license number"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Service Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Service Requested *</CardTitle>
                <CardDescription>Select the type of validation you need</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={serviceType} onValueChange={setServiceType}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {serviceTypes.map((service) => {
                      const Icon = service.icon;
                      return (
                        <label
                          key={service.id}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            serviceType === service.id 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <RadioGroupItem value={service.id} className="mt-1" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="h-4 w-4 text-primary" />
                              <span className="text-sm font-medium text-foreground">{service.label}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{service.description}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Upload Documents *</CardTitle>
                <CardDescription>Attach files for validation (PDF, images, or documents)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div 
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, PNG, JPG, DOCX (max 10MB each)
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span className="text-sm text-foreground truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Additional Notes</CardTitle>
                <CardDescription>Any specific instructions or context</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., 'Please verify patient consent signatures' or 'Cross-reference with case #12345'"
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex flex-col gap-4">
              <Button 
                type="submit" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting to SYNTH...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Submit for Validation
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Pre-demo model: Results returned within 20 minutes. 
                A confirmation package will be downloaded automatically.
              </p>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default VendorDepot;
