import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Plus, Award, FileText, Eye, X, Trash2, AlertTriangle, Camera, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

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
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [viewerMemberId, setViewerMemberId] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [hasProfileImage, setHasProfileImage] = useState(false);
  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
    issue_date: "",
  });

  useEffect(() => {
    loadCertifications();
    loadDisclaimer();
    loadViewerMemberId();
    loadProfileImage();
  }, [userId]);

  const loadProfileImage = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("profile_image_url")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      setHasProfileImage(!!data?.profile_image_url);
    } catch (error: any) {
      console.error("Failed to load profile image status");
    }
  };

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
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setDocumentFiles(files);
    }
  };

  const removeFile = (index: number) => {
    setDocumentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (documentFiles.length === 0) {
      toast.error("Please select at least one document to upload");
      return;
    }

    setSaving(true);
    setUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = documentFiles.length;
      let completedFiles = 0;

      for (const file of documentFiles) {
        // Upload file to storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}_${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('profile-images')
          .upload(fileName, file);

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
              title: newCert.title || file.name.split('.')[0],
              issuer: newCert.issuer,
              issue_date: newCert.issue_date || null,
            },
          ]);

        if (error) throw error;

        completedFiles++;
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
      }

      toast.success(`${totalFiles} document(s) uploaded successfully`);
      setDialogOpen(false);
      setNewCert({ title: "", issuer: "", issue_date: "" });
      setDocumentFiles([]);
      setUploadProgress(0);
      loadCertifications();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload documents");
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
      toast.error("Please upload at least one document before completing");
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

  const handleDeleteDocument = async (certId: string, documentUrl: string | null) => {
    if (!confirm("Are you sure you want to delete this document? This action cannot be undone.")) {
      return;
    }

    setDeletingId(certId);
    try {
      // Delete from storage if document URL exists
      if (documentUrl) {
        const urlParts = documentUrl.split('/');
        const fileName = urlParts.slice(-2).join('/'); // Get userId/filename
        
        const { error: storageError } = await supabase.storage
          .from('profile-images')
          .remove([fileName]);
        
        if (storageError) {
          console.error("Storage deletion error:", storageError);
          // Continue even if storage deletion fails
        }
      }

      // Delete from database
      const { error } = await supabase
        .from("certifications")
        .delete()
        .eq("id", certId);

      if (error) throw error;

      toast.success("Document deleted successfully");
      loadCertifications();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show prompt if no profile image
  if (!hasProfileImage) {
    return (
      <div className="space-y-4 py-4">
        <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="py-6">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                <Camera className="h-8 w-8 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Profile Photo Required
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
                  Please upload a profile photo in the Profile tab before adding documents. This is required for verification.
                </p>
                <Button 
                  onClick={() => {
                    const params = new URLSearchParams(window.location.search);
                    params.set("tab", "profile");
                    window.location.search = params.toString();
                  }}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Go to Profile Tab
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
          <DialogContent 
            className="w-[95vw] max-w-md mx-auto top-[5%] translate-y-0 max-h-[90vh] flex flex-col"
            onPointerDownOutside={(e) => e.preventDefault()}
            onInteractOutside={(e) => e.preventDefault()}
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Add Documents</DialogTitle>
              <DialogDescription className="text-xs">
                Upload your health or verification documents.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCertification} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                <div className="space-y-1.5">
                  <Label htmlFor="document-file" className="text-sm font-medium">Select Files *</Label>
                  <input
                    id="document-file"
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    multiple
                    className="block w-full text-sm text-foreground file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                  />
                </div>
                
                {documentFiles.length > 0 && (
                  <div className="space-y-1.5">
                    <Label className="text-sm">Selected ({documentFiles.length})</Label>
                    <div className="max-h-24 overflow-y-auto space-y-1 rounded-md border border-border p-2 bg-muted/30">
                      {documentFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-xs bg-background px-2 py-1 rounded">
                          <span className="truncate flex-1">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="h-5 w-5 p-0 ml-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-sm">Title (Optional)</Label>
                  <Input
                    id="title"
                    value={newCert.title}
                    onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                    placeholder="Leave blank to use file name"
                    className="text-sm h-9"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="issuer" className="text-sm">Issuing Organization</Label>
                  <Input
                    id="issuer"
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    placeholder="e.g., Lab Name"
                    className="text-sm h-9"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="issue_date" className="text-sm">Issue Date</Label>
                  <Input
                    id="issue_date"
                    type="date"
                    value={newCert.issue_date}
                    onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                    className="text-sm h-9"
                    onFocus={(e) => e.target.showPicker?.()}
                  />
                </div>

                {uploading && uploadProgress > 0 && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </div>

              <div className="flex-shrink-0 pt-3 mt-3 border-t border-border">
                <Button 
                  type="submit" 
                  disabled={saving || uploading || documentFiles.length === 0} 
                  className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700"
                >
                  {saving || uploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5" />
                      {documentFiles.length > 0 
                        ? `Upload ${documentFiles.length} Document${documentFiles.length !== 1 ? 's' : ''}`
                        : 'Select Files First'
                      }
                    </>
                  )}
                </Button>
              </div>
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
                      <div 
                        className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => {
                          setSelectedDocument(cert.document_url);
                          setViewerOpen(true);
                        }}
                      >
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
                    {cert.document_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedDocument(cert.document_url);
                          setViewerOpen(true);
                        }}
                        className="flex items-center gap-1 border-green-500 text-green-600 hover:bg-green-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-950/30"
                      >
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteDocument(cert.id, cert.document_url)}
                      disabled={deletingId === cert.id}
                      className="flex items-center gap-1 h-7 text-xs"
                    >
                      {deletingId === cert.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-4 mt-6">
        <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            ⚠️ Important: You must upload at least one document and accept this disclaimer to complete your profile.
          </p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            By checking this box, I certify that all information provided is accurate and I understand that 
            Clean Check is a Peer to Peer platform for sharing information. I take full responsibility for the 
            accuracy of my information and understand the importance of maintaining up-to-date record documents. 
            In agreement with the site's membership policy, you're also reinforcing there is no liability to 
            Clean Check or any of its sponsors or associated members.
          </p>
          <div className="flex items-start space-x-2">
            <Checkbox
              id="disclaimer"
              checked={disclaimerAccepted}
              onCheckedChange={(checked) => setDisclaimerAccepted(checked === true)}
              required
            />
            <Label htmlFor="disclaimer" className="cursor-pointer text-sm leading-tight">
              I accept the disclaimer and certify all information is accurate *
            </Label>
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
        
        {certifications.length === 0 && (
          <p className="text-xs text-center text-muted-foreground">
            Upload at least one document to enable Save & Close
          </p>
        )}
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
          <div className="relative min-h-[400px]">
            {selectedDocument && (
              <>
                {/* Check if it's a PDF or image based on URL */}
                {selectedDocument.toLowerCase().includes('.pdf') ? (
                  <iframe
                    src={`${selectedDocument}#toolbar=0&navpanes=0`}
                    className="w-full h-[70vh] rounded-lg border border-border"
                    title="Document Preview"
                  />
                ) : (
                  <img
                    src={selectedDocument}
                    alt="Document"
                    className="w-full h-auto rounded-lg"
                    onContextMenu={(e) => e.preventDefault()}
                    style={{ userSelect: 'none', pointerEvents: 'none' }}
                    draggable={false}
                    onError={(e) => {
                      // If image fails, try showing as iframe (might be PDF without extension)
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        e.currentTarget.style.display = 'none';
                        const iframe = document.createElement('iframe');
                        iframe.src = `${selectedDocument}#toolbar=0&navpanes=0`;
                        iframe.className = 'w-full h-[70vh] rounded-lg border border-border';
                        iframe.title = 'Document Preview';
                        parent.appendChild(iframe);
                      }
                    }}
                  />
                )}
              </>
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