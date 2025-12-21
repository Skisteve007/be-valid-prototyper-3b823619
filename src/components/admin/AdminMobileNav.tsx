import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Users, 
  FlaskConical, 
  Code, 
  Globe, 
  DollarSign,
  Zap,
  QrCode,
  Shield,
  Target,
  Briefcase,
  BarChart3,
  Lock,
  Webhook,
  Send,
  FileText
} from "lucide-react";

interface AdminMobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  canAccessDealRoom?: boolean;
  canUnlockSynth?: boolean;
}

const navItems = [
  { id: "members", label: "VALID Members", icon: Users },
  { id: "sponsors", label: "Sponsor Management", icon: Shield },
  { id: "lab-integrations", label: "Lab Integrations", icon: FlaskConical },
  { id: "developers", label: "Developers", icon: Code },
  { id: "campaigns", label: "Campaigns", icon: Globe },
  { id: "venues", label: "Venue Directory", icon: Globe },
  { id: "sales-team", label: "Sales Team", icon: DollarSign },
  { id: "lead-outreach", label: "Lead Outreach", icon: Target },
  { id: "investor-crm", label: "Investor CRM", icon: Briefcase },
  { id: "quick-branding", label: "Fast Event Setup", icon: Zap },
  { id: "scanner", label: "QR Scanner", icon: QrCode },
  { id: "idv-management", label: "IDV Management", icon: Shield },
  { id: "access-control", label: "Access Control", icon: Lock },
  { id: "traffic", label: "Traffic Analytics", icon: BarChart3 },
  { id: "pricing", label: "Pricing & Contracts", icon: DollarSign },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
];

export const AdminMobileNav = ({ activeTab, onTabChange, canAccessDealRoom, canUnlockSynth }: AdminMobileNavProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId);
    setOpen(false);
  };

  const handleSynthSelect = () => {
    onTabChange("synth");
    if (canUnlockSynth) setOpen(false);
  };

  const menuItems = [{ id: "synth", label: "SYNTH™", icon: Send }, ...navItems];
  const activeItem = menuItems.find((item) => item.id === activeTab);

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="outline" 
            size="lg"
            className="w-full justify-between h-14 text-base font-medium"
          >
            <div className="flex items-center gap-3">
              <Menu className="h-5 w-5" />
              <span>{activeItem?.label || "Menu"}</span>
            </div>
            {activeItem && <activeItem.icon className="h-5 w-5 text-muted-foreground" />}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Admin Navigation
            </SheetTitle>
          </SheetHeader>
          <nav className="p-2">
            {/* SYNTH - Visible to admins, but only Steve can unlock */}
            <button
              onClick={handleSynthSelect}
              title={canUnlockSynth ? "Open SYNTH™" : "Locked: only Steve@bevalid.app can unlock"}
              className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg text-left transition-colors mb-2 border border-primary/30 ${
                activeTab === "synth"
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-muted text-foreground"
              } ${canUnlockSynth ? "" : "opacity-70"}`}
            >
              <Send className={`h-5 w-5 ${activeTab === "synth" ? "text-primary" : "text-muted-foreground"}`} />
              <span className="text-base">SYNTH™</span>
              {!canUnlockSynth && (
                <span className="ml-auto text-xs text-muted-foreground">Locked</span>
              )}
            </button>

            {/* Deal Room - Only for authorized users */}
            {canAccessDealRoom && (
              <button
                onClick={() => {
                  navigate("/admin/deal-room");
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-lg text-left transition-colors mb-1 hover:bg-muted text-amber-400 border border-amber-500/30"
              >
                <FileText className="h-5 w-5 text-amber-400" />
                <span className="text-base font-medium">Deal Room</span>
              </button>
            )}

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabSelect(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-lg text-left transition-colors mb-1 ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-base">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};
