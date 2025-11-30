import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Plus, Award, FileText, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  status: string;
  document_url: string | null;
}

interface CertificationsTabProps {
  userId: string;
}

const CertificationsTab = ({ userId }: CertificationsTabProps) => {
  const [loading, setLoading] = useState(true);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [viewerMemberId, setViewerMemberId] = useState<string>("");
  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
    issue_date: "",
    expiry_date: "",
  });

  useEffect(() => {
    loadCertifications();
    loadDisclaimer();
    loadViewerMemberId();
  }, [userId]);

  const loadDisclaimer = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("disclaimer_accepted")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      setDisclaimerAccepted(data?.disclaimer_accepted || false);
    } catch (error: any) {
      console.error("Failed to load disclaimer status");
    }
  };

  const loadViewerMemberId = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("member_id")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      setViewerMemberId(data?.member_id || "");
    } catch (error: any) {
      console.error("Failed to load member ID");
    }
  };

  const loadCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from("certifications")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error: any) {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  const handleAddCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!documentFile) {
      toast.error("Please select a document file to upload");
      return;
    }

    setSaving(true);
    setUploading(true);

    try {
      // Upload file to storage
      const fileExt = documentFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, documentFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      // Insert certification record with document URL
      const { error } = await supabase
        .from("certifications")
        .insert([
          {
            user_id: userId,
            document_url: publicUrl,
            ...newCert,
          },
        ]);

      if (error) throw error;

      toast.success("Document uploaded successfully");
      setDialogOpen(false);
      setNewCert({ title: "", issuer: "", issue_date: "", expiry_date: "" });
      setDocumentFile(null);
      loadCertifications();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload document");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleComplete = async () => {
    if (!disclaimerAccepted) {
      toast.error("You must accept the disclaimer to complete this section");
      return;
    }

    if (certifications.length === 0) {
      toast.error("Please add at least one document before completing");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ disclaimer_accepted: true })
        .eq("user_id", userId);

      if (error) throw error;
      toast.success("Documents section completed successfully");
    } catch (error: any) {
      toast.error("Failed to save disclaimer");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-500" />
          <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">Your Documents</span>
        </h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Document</DialogTitle>
              <DialogDescription>
                Add a new professional document to your profile
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCertification} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="document-file">Upload Document *</Label>
                <Input
                  id="document-file"
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  Accepted formats: Images, PDF, Word documents (Max 20MB)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  placeholder="e.g., Health Certificate"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuer">Issuing Organization</Label>
                <Input
                  id="issuer"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  placeholder="e.g., IICRC"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue_date">Issue Date</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={newCert.issue_date}
                  onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry_date">Expiry Date</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={newCert.expiry_date}
                  onChange={(e) => setNewCert({ ...newCert, expiry_date: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={saving || uploading} className="w-full">
                {saving || uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploading ? "Uploading..." : "Adding..."}
                  </>
                ) : (
                  "Upload Document"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {certifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              No documents added yet. Add your first document to get started.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {certifications.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4 flex-1">
                    {cert.document_url && (
                      <div className="flex-shrink-0">
                        <img
                          src={cert.document_url}
                          alt={cert.title}
                          className="w-24 h-24 object-cover rounded-lg border-2 border-border"
                          onError={(e) => {
                            // If image fails to load, show a placeholder
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden w-24 h-24 bg-muted rounded-lg border-2 border-border flex items-center justify-center">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-xl">{cert.title}</CardTitle>
                      <CardDescription>{cert.issuer}</CardDescription>
                      <div className="text-sm text-muted-foreground space-y-1 mt-2">
                        {cert.issue_date && (
                          <p>Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                        )}
                        {cert.expiry_date && (
                          <p>Expires: {new Date(cert.expiry_date).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant={cert.status === "approved" ? "default" : "secondary"}>
                      {cert.status}
                    </Badge>
                    {cert.document_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDocument(cert.document_url);
                          setViewerOpen(true);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-4 mt-6">
        <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <p className="text-sm">
            By checking this box, I certify that all information provided is accurate and I understand that 
            Clean Check is a platform for sharing health information. I take full responsibility for the 
            accuracy of my information and understand the importance of maintaining up-to-date health records.
          </p>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={disclaimerAccepted}
              onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
              required
            />
            <Label className="cursor-pointer">I accept the disclaimer and certify all information is accurate *</Label>
          </div>
        </div>

        <Button 
          onClick={handleComplete} 
          disabled={saving || !disclaimerAccepted || certifications.length === 0}
          className="w-full"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save & Close"
          )}
        </Button>
      </div>

      {/* Document Viewer Modal */}
      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Document Viewer</DialogTitle>
            <DialogDescription>
              View-only access. Download is restricted for privacy protection.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            {selectedDocument && (
              <img
                src={selectedDocument}
                alt="Document"
                className="w-full h-auto rounded-lg"
                onContextMenu={(e) => e.preventDefault()}
                style={{ userSelect: 'none', pointerEvents: 'none' }}
                draggable={false}
              />
            )}
            {/* Watermark overlay with member ID */}
            <div 
              className="absolute inset-0 pointer-events-none select-none"
              onContextMenu={(e) => e.preventDefault()}
              style={{
                background: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 200px,
                  rgba(0, 0, 0, 0.03) 200px,
                  rgba(0, 0, 0, 0.03) 201px
                )`
              }}
            >
              {/* Multiple watermarks across the document */}
              <div className="absolute top-[20%] left-[10%] transform -rotate-45 opacity-20 text-gray-900 dark:text-gray-100 text-2xl font-bold select-none pointer-events-none">
                {viewerMemberId}
              </div>
              <div className="absolute top-[40%] right-[10%] transform -rotate-45 opacity-20 text-gray-900 dark:text-gray-100 text-2xl font-bold select-none pointer-events-none">
                {viewerMemberId}
              </div>
              <div className="absolute bottom-[20%] left-[30%] transform -rotate-45 opacity-20 text-gray-900 dark:text-gray-100 text-2xl font-bold select-none pointer-events-none">
                {viewerMemberId}
              </div>
              <div className="absolute top-[60%] left-[50%] transform -translate-x-1/2 -rotate-45 opacity-20 text-gray-900 dark:text-gray-100 text-2xl font-bold select-none pointer-events-none">
                {viewerMemberId}
              </div>
              <div className="absolute top-[10%] right-[40%] transform -rotate-45 opacity-20 text-gray-900 dark:text-gray-100 text-2xl font-bold select-none pointer-events-none">
                {viewerMemberId}
              </div>
              <div className="absolute bottom-[40%] right-[30%] transform -rotate-45 opacity-20 text-gray-900 dark:text-gray-100 text-2xl font-bold select-none pointer-events-none">
                {viewerMemberId}
              </div>
              {/* Timestamp watermark */}
              <div className="absolute bottom-4 right-4 opacity-30 text-gray-900 dark:text-gray-100 text-xs font-mono select-none pointer-events-none bg-white/50 dark:bg-black/50 px-2 py-1 rounded">
                Viewed: {new Date().toLocaleString()} | {viewerMemberId}
              </div>
            </div>
            {/* Overlay to prevent right-click and interactions */}
            <div 
              className="absolute inset-0 bg-transparent"
              onContextMenu={(e) => e.preventDefault()}
              style={{ userSelect: 'none' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CertificationsTab;