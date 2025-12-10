import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, ExternalLink, Shield, GripVertical, Eye, MousePointerClick, TrendingUp, Download, Calendar as CalendarIcon, FlaskConical, Code, Globe, Zap, QrCode, Users } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/valid-logo.jpeg";
import { useLongPressHome } from "@/hooks/useLongPressHome";
import StorageSponsorManager from "@/components/admin/StorageSponsorManager";
import { LabIntegrationsTab } from "@/components/admin/LabIntegrationsTab";
import { DevelopersIntegrationsTab } from "@/components/admin/DevelopersIntegrationsTab";
import { CampaignsTab } from "@/components/admin/CampaignsTab";
import { VenueDirectoryTab } from "@/components/admin/VenueDirectoryTab";
import SalesTeamTab from "@/components/admin/SalesTeamTab";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { QuickBrandingTool } from "@/components/admin/QuickBrandingTool";
import { ScannerFullscreen } from "@/components/admin/ScannerFullscreen";
import { LeadOutreachTab } from "@/components/admin/LeadOutreachTab";
import { MembersTab } from "@/components/admin/MembersTab";
import { InvestorCRMTab } from "@/components/admin/InvestorCRMTab";
import { IDVManagementTab } from "@/components/admin/IDVManagementTab";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Sponsor {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  active: boolean;
  display_order: number;
  tier: 'platinum' | 'gold' | 'silver';
  section: number;
}

interface SponsorAnalytics {
  views: number;
  clicks: number;
  ctr: number;
}

const SortableItem = ({ sponsor, onDelete, onToggleActive, analytics }: { 
  sponsor: Sponsor; 
  onDelete: (id: string) => void; 
  onToggleActive: (sponsor: Sponsor) => void;
  analytics: SponsorAnalytics;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: sponsor.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'bg-purple-500';
      case 'gold': return 'bg-yellow-500';
      case 'silver': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getTierSize = (tier: string) => {
    switch (tier) {
      case 'platinum': return 'h-20';
      case 'gold': return 'h-16';
      case 'silver': return 'h-12';
      default: return 'h-12';
    }
  };

  return (
    <Card ref={setNodeRef} style={style} className={!sponsor.active ? "opacity-50" : ""}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div 
            {...attributes} 
            {...listeners} 
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-muted rounded"
          >
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="flex items-center gap-4 flex-1">
            <div className={`flex items-center justify-center ${sponsor.logo_url ? '' : 'w-24'}`}>
              {sponsor.logo_url ? (
                <img 
                  src={sponsor.logo_url} 
                  alt={sponsor.name} 
                  className={`w-auto ${getTierSize(sponsor.tier)}`}
                />
              ) : (
                <div className={`${getTierSize(sponsor.tier)} bg-muted rounded flex items-center justify-center w-24`}>
                  <span className="text-xs text-muted-foreground">No logo</span>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold">{sponsor.name}</h4>
                <Badge className={getTierColor(sponsor.tier)}>
                  {sponsor.tier.toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  Section {sponsor.section}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Order: {sponsor.display_order}</p>
              {sponsor.website_url && (
                <a 
                  href={sponsor.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Visit website <ExternalLink className="h-3 w-3" />
                </a>
              )}
              
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{analytics.views} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <MousePointerClick className="h-4 w-4" />
                  <span>{analytics.clicks} clicks</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{analytics.ctr.toFixed(1)}% CTR</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={sponsor.active ? "outline" : "default"}
              size="sm"
              onClick={() => onToggleActive(sponsor)}
            >
              {sponsor.active ? "Deactivate" : "Activate"}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(sponsor.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const longPressHandlers = useLongPressHome();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [analytics, setAnalytics] = useState<Record<string, SponsorAnalytics>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [activeTab, setActiveTab] = useState("members");
  const [showScanner, setShowScanner] = useState(false);
  const [newSponsor, setNewSponsor] = useState({
    name: "",
    website_url: "",
    logo_url: "",
    display_order: 0,
    tier: "silver" as 'platinum' | 'gold' | 'silver',
    section: 1,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "administrator")
        .maybeSingle();

      if (roleError || !roleData) {
        toast.error("Access denied. Administrator privileges required.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await Promise.all([loadSponsors(), loadAnalytics()]);
    } catch (error) {
      toast.error("Failed to verify admin access");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAnalytics();
    }
  }, [dateFrom, dateTo, isAdmin]);

  const loadSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      setSponsors((data as Sponsor[]) || []);
    } catch (error: any) {
      toast.error("Failed to load sponsors");
    }
  };

  const loadAnalytics = async () => {
    try {
      let query = supabase
        .from("sponsor_analytics")
        .select("sponsor_id, event_type, viewed_at");

      if (dateFrom) {
        query = query.gte("viewed_at", dateFrom.toISOString());
      }
      if (dateTo) {
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        query = query.lte("viewed_at", endOfDay.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      const analyticsMap: Record<string, SponsorAnalytics> = {};
      
      data?.forEach((event) => {
        if (!analyticsMap[event.sponsor_id]) {
          analyticsMap[event.sponsor_id] = { views: 0, clicks: 0, ctr: 0 };
        }
        if (event.event_type === 'view') {
          analyticsMap[event.sponsor_id].views++;
        } else if (event.event_type === 'click') {
          analyticsMap[event.sponsor_id].clicks++;
        }
      });

      Object.keys(analyticsMap).forEach((sponsorId) => {
        const stats = analyticsMap[sponsorId];
        stats.ctr = stats.views > 0 ? (stats.clicks / stats.views) * 100 : 0;
      });

      setAnalytics(analyticsMap);
    } catch (error: any) {
      console.error("Failed to load analytics:", error);
    }
  };

  const exportToCSV = () => {
    const csvRows = [];
    csvRows.push(['Sponsor Name', 'Tier', 'Views', 'Clicks', 'CTR (%)', 'Status'].join(','));
    
    sponsors.forEach((sponsor) => {
      const stats = analytics[sponsor.id] || { views: 0, clicks: 0, ctr: 0 };
      csvRows.push([
        sponsor.name,
        sponsor.tier,
        stats.views,
        stats.clicks,
        stats.ctr.toFixed(2),
        sponsor.active ? 'Active' : 'Inactive'
      ].join(','));
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `sponsor-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Analytics exported to CSV");
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sponsors.findIndex((s) => s.id === active.id);
    const newIndex = sponsors.findIndex((s) => s.id === over.id);

    const newSponsors = arrayMove(sponsors, oldIndex, newIndex);
    setSponsors(newSponsors);

    try {
      const updates = newSponsors.map((sponsor, index) => 
        supabase
          .from("sponsors")
          .update({ display_order: index })
          .eq("id", sponsor.id)
      );

      await Promise.all(updates);
      toast.success("Sponsor order updated");
    } catch (error: any) {
      toast.error("Failed to update order");
      loadSponsors();
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `sponsor-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('sponsor-logos')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('sponsor-logos')
        .getPublicUrl(filePath);

      setNewSponsor({ ...newSponsor, logo_url: publicUrl });
      toast.success("Logo uploaded successfully");
    } catch (error: any) {
      toast.error("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleAddSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from("sponsors")
        .insert([
          {
            name: newSponsor.name,
            website_url: newSponsor.website_url || null,
            logo_url: newSponsor.logo_url || null,
            display_order: sponsors.length,
            tier: newSponsor.tier,
            section: newSponsor.section,
            active: true,
          },
        ]);

      if (error) throw error;

      toast.success("Sponsor added successfully");
      setDialogOpen(false);
      setNewSponsor({ name: "", website_url: "", logo_url: "", display_order: 0, tier: "silver", section: 1 });
      loadSponsors();
    } catch (error: any) {
      toast.error(error.message || "Failed to add sponsor");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sponsor?")) return;

    try {
      const { error } = await supabase
        .from("sponsors")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Sponsor deleted successfully");
      loadSponsors();
    } catch (error: any) {
      toast.error("Failed to delete sponsor");
    }
  };

  const handleToggleActive = async (sponsor: Sponsor) => {
    try {
      const { error } = await supabase
        .from("sponsors")
        .update({ active: !sponsor.active })
        .eq("id", sponsor.id);

      if (error) throw error;

      toast.success(`Sponsor ${!sponsor.active ? 'activated' : 'deactivated'}`);
      loadSponsors();
    } catch (error: any) {
      toast.error("Failed to update sponsor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Scanner Fullscreen Mode */}
      {showScanner && (
        <ScannerFullscreen onClose={() => setShowScanner(false)} />
      )}
      
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div 
              className="relative cursor-pointer"
              {...longPressHandlers}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/60 via-pink-500/60 to-blue-500/60 blur-3xl rounded-full scale-150"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/40 via-pink-400/40 to-blue-400/40 blur-2xl rounded-full scale-125 animate-pulse"></div>
              <img src={logo} alt="Clean Check" className="relative h-12 md:h-18 w-auto select-none" draggable={false} />
            </div>
            <div className="hidden md:flex items-center gap-2 ml-4">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Quick Scanner Button - Mobile */}
            <Button 
              variant="outline" 
              size="icon"
              className="md:hidden h-12 w-12"
              onClick={() => setShowScanner(true)}
            >
              <QrCode className="h-6 w-6" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")} className="hidden md:flex">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile Navigation */}
          <AdminMobileNav activeTab={activeTab} onTabChange={setActiveTab} />
          
          {/* Desktop Tab Navigation */}
          <TabsList className="hidden md:flex w-full justify-between relative z-10 flex-wrap gap-1">
            <TabsTrigger value="members" className="cursor-pointer flex-1">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="sponsors" className="cursor-pointer flex-1">
              Sponsor Management
            </TabsTrigger>
            <TabsTrigger value="lab-integrations" className="cursor-pointer flex-1">
              <FlaskConical className="h-4 w-4 mr-2" />
              Lab Integrations
            </TabsTrigger>
            <TabsTrigger value="developers" className="cursor-pointer flex-1">
              <Code className="h-4 w-4 mr-2" />
              Developers
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="cursor-pointer flex-1">
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="venues" className="cursor-pointer flex-1">
              <Globe className="h-4 w-4 mr-2" />
              Venues
            </TabsTrigger>
            <TabsTrigger value="sales-team" className="cursor-pointer flex-1">
              💰 Sales Team
            </TabsTrigger>
            <TabsTrigger value="lead-outreach" className="cursor-pointer flex-1">
              📧 Lead Outreach
            </TabsTrigger>
            <TabsTrigger value="investor-crm" className="cursor-pointer flex-1">
              💼 Investors
            </TabsTrigger>
            <TabsTrigger value="quick-branding" className="cursor-pointer flex-1">
              <Zap className="h-4 w-4 mr-2" />
              Fast Setup
            </TabsTrigger>
            <TabsTrigger value="scanner" className="cursor-pointer flex-1">
              <QrCode className="h-4 w-4 mr-2" />
              Scanner
            </TabsTrigger>
            <TabsTrigger value="idv-management" className="cursor-pointer flex-1">
              🪪 IDV
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="members" className="space-y-8">
            <MembersTab />
          </TabsContent>
          
          <TabsContent value="sponsors" className="space-y-8">
            <StorageSponsorManager />
            
            <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-3xl">Sponsor Management</CardTitle>
                <CardDescription>
                  Drag to reorder sponsors. Tier determines display size: Platinum (largest), Gold (medium), Silver (standard)
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Sponsor
                    </Button>
                  </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[70vh] flex flex-col p-0 top-[15%] translate-y-0">
                  <DialogHeader className="px-6 pt-6 pb-4 border-b flex-shrink-0">
                    <DialogTitle className="text-xl">Add New Sponsor</DialogTitle>
                    <DialogDescription>
                      Upload a sponsor logo and assign to a section
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="overflow-y-auto flex-1 px-6 py-4 min-h-0">
                    <form id="add-sponsor-form" onSubmit={handleAddSponsor} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="logo" className="text-base font-semibold">
                          Logo Image *
                        </Label>
                        <div className="border-2 border-dashed rounded-lg p-4 hover:border-primary transition-colors">
                          <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            disabled={uploadingLogo}
                            className="cursor-pointer"
                          />
                          {uploadingLogo && (
                            <div className="flex items-center gap-2 mt-2">
                              <Loader2 className="h-4 w-4 animate-spin text-primary" />
                              <p className="text-sm text-muted-foreground">Uploading...</p>
                            </div>
                          )}
                        </div>
                        {newSponsor.logo_url && (
                          <div className="aspect-video bg-muted rounded-lg overflow-hidden border-2 border-border mt-3">
                            <img
                              src={newSponsor.logo_url}
                              alt="Preview"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base font-semibold">
                          Sponsor Name *
                        </Label>
                        <Input
                          id="name"
                          value={newSponsor.name}
                          onChange={(e) => setNewSponsor({ ...newSponsor, name: e.target.value })}
                          placeholder="Enter sponsor name"
                          required
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-base font-semibold">
                          Website URL
                        </Label>
                        <Input
                          id="website"
                          type="url"
                          value={newSponsor.website_url}
                          onChange={(e) => setNewSponsor({ ...newSponsor, website_url: e.target.value })}
                          placeholder="https://example.com"
                          className="h-11"
                        />
                        <p className="text-xs text-muted-foreground">
                          Optional - When clicked, logo will open this URL
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="section" className="text-base font-semibold">
                          Display Section *
                        </Label>
                        <Select 
                          value={newSponsor.section.toString()} 
                          onValueChange={(value) => {
                            const section = parseInt(value);
                            const tier = (section === 1 || section === 2) ? 'platinum' : 'gold';
                            setNewSponsor({ ...newSponsor, section, tier });
                          }}
                        >
                          <SelectTrigger id="section" className="w-full h-11">
                            <SelectValue placeholder="Choose section placement" />
                          </SelectTrigger>
                          <SelectContent className="z-50 bg-popover">
                            {[1, 2, 3].map((sectionNum) => {
                              const sponsorsInSection = sponsors.filter(s => s.section === sectionNum);
                              const count = sponsorsInSection.length;
                              const tierLabel = sectionNum === 1 || sectionNum === 2 ? 'Platinum' : 'Gold';
                              
                              return (
                                <SelectItem key={sectionNum} value={sectionNum.toString()}>
                                  <div className="flex items-center justify-between w-full gap-3">
                                    <span>Section {sectionNum} ({tierLabel})</span>
                                    {count > 0 ? (
                                      <Badge variant="secondary" className="ml-auto text-xs">
                                        {count} sponsor{count !== 1 ? 's' : ''}
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="ml-auto text-xs bg-green-500/10 text-green-600 border-green-500/30">
                                        Empty
                                      </Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                          <p className="text-xs font-medium">Current Section Status:</p>
                          {[1, 2, 3].map((sectionNum) => {
                            const sponsorsInSection = sponsors.filter(s => s.section === sectionNum);
                            const count = sponsorsInSection.length;
                            const tierLabel = sectionNum === 1 || sectionNum === 2 ? 'Platinum' : 'Gold';
                            
                            return (
                              <div key={sectionNum} className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Section {sectionNum} ({tierLabel}):</span>
                                {count > 0 ? (
                                  <span className="font-medium">{count} sponsor{count !== 1 ? 's' : ''} assigned</span>
                                ) : (
                                  <span className="text-green-600 font-medium">✓ Available</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </form>
                  </div>

                  <div className="px-6 py-4 border-t bg-muted/20 flex gap-3 flex-shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        setNewSponsor({ name: "", website_url: "", logo_url: "", display_order: 0, tier: "silver", section: 1 });
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      form="add-sponsor-form"
                      disabled={saving || uploadingLogo || !newSponsor.logo_url}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "✓ Accept & Save"
                      )}
                    </Button>
                  </div>
                </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Label>Date From:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="flex items-center gap-2">
                <Label>Date To:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {(dateFrom || dateTo) && (
                <Button variant="ghost" onClick={() => {
                  setDateFrom(undefined);
                  setDateTo(undefined);
                }}>
                  Clear Filters
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sponsors.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No sponsors added yet. Click "Add Sponsor" to get started.
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={sponsors.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-4">
                      {sponsors.map((sponsor) => (
                        <SortableItem
                          key={sponsor.id}
                          sponsor={sponsor}
                          onDelete={handleDeleteSponsor}
                          onToggleActive={handleToggleActive}
                          analytics={analytics[sponsor.id] || { views: 0, clicks: 0, ctr: 0 }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="lab-integrations">
            <LabIntegrationsTab />
          </TabsContent>
          
          <TabsContent value="developers">
            <DevelopersIntegrationsTab />
          </TabsContent>
          
          <TabsContent value="campaigns">
            <CampaignsTab />
          </TabsContent>
          
          <TabsContent value="venues">
            <VenueDirectoryTab />
          </TabsContent>
          
          <TabsContent value="sales-team">
            <SalesTeamTab />
          </TabsContent>
          
          <TabsContent value="lead-outreach">
            <LeadOutreachTab />
          </TabsContent>
          
          <TabsContent value="investor-crm">
            <InvestorCRMTab />
          </TabsContent>
          
          <TabsContent value="quick-branding">
            <QuickBrandingTool />
          </TabsContent>
          
          <TabsContent value="scanner">
            <div className="space-y-6">
              <div className="text-center py-12">
                <QrCode className="h-16 w-16 mx-auto text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-2">QR Scanner Mode</h2>
                <p className="text-muted-foreground mb-6">
                  Launch fullscreen scanner for door check-ins
                </p>
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg"
                  onClick={() => setShowScanner(true)}
                >
                  <QrCode className="h-6 w-6 mr-3" />
                  Open Fullscreen Scanner
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="idv-management">
            <IDVManagementTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;