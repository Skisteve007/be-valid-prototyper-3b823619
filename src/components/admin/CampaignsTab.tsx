import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Send, Edit, Users, Clock, Filter } from "lucide-react";

interface MarketingTemplate {
  id: string;
  campaign_name: string;
  subject_line: string;
  body_content: string;
  target_segment: string;
  created_at: string;
  updated_at: string;
}

export function CampaignsTab() {
  const [templates, setTemplates] = useState<MarketingTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignTrack, setCampaignTrack] = useState<string>("All");
  const [editingTemplate, setEditingTemplate] = useState<MarketingTemplate | null>(null);
  const [sendingTemplate, setSendingTemplate] = useState<MarketingTemplate | null>(null);
  const [recipientCount, setRecipientCount] = useState<number>(0);
  const [sending, setSending] = useState(false);

  const [editForm, setEditForm] = useState({
    campaign_name: "",
    subject_line: "",
    body_content: "",
    target_segment: "",
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("marketing_templates")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast.error("Failed to load templates");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (template: MarketingTemplate) => {
    setEditingTemplate(template);
    setEditForm({
      campaign_name: template.campaign_name,
      subject_line: template.subject_line,
      body_content: template.body_content,
      target_segment: template.target_segment,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingTemplate) return;

    try {
      const { error } = await supabase
        .from("marketing_templates")
        .update(editForm)
        .eq("id", editingTemplate.id);

      if (error) throw error;

      toast.success("Template updated successfully");
      setEditingTemplate(null);
      fetchTemplates();
    } catch (error: any) {
      toast.error("Failed to update template");
      console.error(error);
    }
  };

  const handleSendBlast = async (template: MarketingTemplate) => {
    try {
      // Calculate recipient count based on target segment
      let query = supabase.from("profiles").select("id", { count: "exact", head: true });

      if (template.target_segment === "Unpaid Users") {
        query = query.or("payment_status.is.null,payment_status.eq.unpaid");
      } else if (template.target_segment === "Expired Members") {
        query = query.lt("payment_date", new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString());
      }

      const { count, error } = await query;

      if (error) throw error;

      setRecipientCount(count || 0);
      setSendingTemplate(template);
    } catch (error: any) {
      toast.error("Failed to calculate recipients");
      console.error(error);
    }
  };

  const confirmSendBlast = async () => {
    if (!sendingTemplate) return;

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-marketing-campaign", {
        body: {
          template_id: sendingTemplate.id,
          campaign_name: sendingTemplate.campaign_name,
          target_segment: sendingTemplate.target_segment,
        },
      });

      if (error) throw error;

      toast.success(`Campaign sent to ${data.sent_count} recipients!`);
      setSendingTemplate(null);
    } catch (error: any) {
      toast.error("Failed to send campaign");
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading campaigns...</div>;
  }

  // Filter templates based on campaign track
  const filteredTemplates = templates.filter((template) => {
    if (campaignTrack === "All") return true;
    if (campaignTrack === "Member Growth") {
      return ["All Users", "Unpaid Users", "Expired Members", "Monthly Subscribers"].includes(template.target_segment);
    }
    if (campaignTrack === "Lab Partners") {
      return template.target_segment === "Lab Partners";
    }
    if (campaignTrack === "Club/Community") {
      return template.target_segment === "Club/Community";
    }
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
            Marketing Command Center
          </h2>
          <p className="text-muted-foreground mt-1">Manage and send email campaigns to your user base</p>
        </div>
        <Mail className="h-8 w-8 text-primary" />
      </div>

      {/* Campaign Track Filter */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Filter className="h-5 w-5 text-primary" />
              Campaign Track:
            </Label>
            <Select value={campaignTrack} onValueChange={setCampaignTrack}>
              <SelectTrigger className="w-64 bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Campaigns</SelectItem>
                <SelectItem value="Member Growth">Member Growth</SelectItem>
                <SelectItem value="Lab Partners">Lab Partners</SelectItem>
                <SelectItem value="Club/Community">Club/Community</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Showing {filteredTemplates.length} of {templates.length} campaigns
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    {template.campaign_name}
                  </CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Target: {template.target_segment}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(template.updated_at).toLocaleDateString()}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(template)}
                    className="gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSendBlast(template)}
                    className="bg-gradient-to-r from-blue-600 to-pink-600 hover:from-blue-700 hover:to-pink-700 gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send Blast
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Subject Line:</p>
                  <p className="text-base">{template.subject_line}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Body Preview:</p>
                  <p className="text-sm text-muted-foreground line-clamp-3">{template.body_content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTemplate} onOpenChange={() => setEditingTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Campaign Template</DialogTitle>
            <DialogDescription>Update the campaign details below</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="campaign_name">Campaign Name</Label>
              <Input
                id="campaign_name"
                value={editForm.campaign_name}
                onChange={(e) => setEditForm({ ...editForm, campaign_name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="target_segment">Target Segment</Label>
              <Select
                value={editForm.target_segment}
                onValueChange={(value) => setEditForm({ ...editForm, target_segment: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Users">All Users</SelectItem>
                  <SelectItem value="Unpaid Users">Unpaid Users</SelectItem>
                  <SelectItem value="Expired Members">Expired Members</SelectItem>
                  <SelectItem value="Monthly Subscribers">Monthly Subscribers</SelectItem>
                  <SelectItem value="Lab Partners">Lab Partners</SelectItem>
                  <SelectItem value="Club/Community">Club/Community</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="subject_line">Subject Line</Label>
              <Input
                id="subject_line"
                value={editForm.subject_line}
                onChange={(e) => setEditForm({ ...editForm, subject_line: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="body_content">Body Content</Label>
              <Textarea
                id="body_content"
                value={editForm.body_content}
                onChange={(e) => setEditForm({ ...editForm, body_content: e.target.value })}
                rows={12}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTemplate(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-gradient-to-r from-blue-600 to-pink-600">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Confirmation Dialog */}
      <Dialog open={!!sendingTemplate} onOpenChange={() => setSendingTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Campaign Send</DialogTitle>
            <DialogDescription>
              Ready to send "{sendingTemplate?.campaign_name}" to {recipientCount} users?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              This campaign will be sent to all users matching the "{sendingTemplate?.target_segment}" segment.
              Users who have already received this campaign will be skipped.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSendingTemplate(null)} disabled={sending}>
              Cancel
            </Button>
            <Button
              onClick={confirmSendBlast}
              disabled={sending}
              className="bg-gradient-to-r from-blue-600 to-pink-600"
            >
              {sending ? "Sending..." : `Send to ${recipientCount} Users`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
