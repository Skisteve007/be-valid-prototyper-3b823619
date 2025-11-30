import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Plus, Award } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date: string;
  status: string;
}

interface CertificationsTabProps {
  userId: string;
}

const CertificationsTab = ({ userId }: CertificationsTabProps) => {
  const [loading, setLoading] = useState(true);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
    issue_date: "",
    expiry_date: "",
  });

  useEffect(() => {
    loadCertifications();
    loadDisclaimer();
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

  const handleAddCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("certifications")
        .insert([
          {
            user_id: userId,
            ...newCert,
          },
        ]);

      if (error) throw error;

      toast.success("Document added successfully");
      setDialogOpen(false);
      setNewCert({ title: "", issuer: "", issue_date: "", expiry_date: "" });
      loadCertifications();
    } catch (error: any) {
      toast.error(error.message || "Failed to add document");
    } finally {
      setSaving(false);
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
        <h3 className="text-lg font-semibold">Your Documents</h3>
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
                <Label htmlFor="title">Document Title</Label>
                <Input
                  id="title"
                  value={newCert.title}
                  onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                  placeholder="e.g., IICRC Water Damage Restoration"
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
              <Button type="submit" disabled={saving} className="w-full">
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Document"
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
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{cert.title}</CardTitle>
                    <CardDescription>{cert.issuer}</CardDescription>
                  </div>
                  <Badge variant={cert.status === "approved" ? "default" : "secondary"}>
                    {cert.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground space-y-1">
                  {cert.issue_date && (
                    <p>Issued: {new Date(cert.issue_date).toLocaleDateString()}</p>
                  )}
                  {cert.expiry_date && (
                    <p>Expires: {new Date(cert.expiry_date).toLocaleDateString()}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-4 mt-6">
        <div className="space-y-4 p-4 bg-muted rounded-lg">
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
    </div>
  );
};

export default CertificationsTab;