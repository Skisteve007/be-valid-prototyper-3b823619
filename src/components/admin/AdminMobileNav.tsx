import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  X, 
  Users, 
  FlaskConical, 
  Code, 
  Mail, 
  Globe, 
  DollarSign,
  Zap,
  QrCode,
  Shield,
  Target,
  Briefcase
} from "lucide-react";

interface AdminMobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "members", label: "Clean Check Members", icon: Users },
  { id: "sponsors", label: "Sponsor Management", icon: Shield },
  { id: "lab-integrations", label: "Lab Integrations", icon: FlaskConical },
  { id: "developers", label: "Developers", icon: Code },
  { id: "campaigns", label: "Campaigns", icon: Mail },
  { id: "venues", label: "Venue Directory", icon: Globe },
  { id: "sales-team", label: "Sales Team", icon: DollarSign },
  { id: "lead-outreach", label: "Lead Outreach", icon: Target },
  { id: "investor-crm", label: "Investor CRM", icon: Briefcase },
  { id: "quick-branding", label: "Fast Event Setup", icon: Zap },
  { id: "scanner", label: "QR Scanner", icon: QrCode },
];

export const AdminMobileNav = ({ activeTab, onTabChange }: AdminMobileNavProps) => {
  const [open, setOpen] = useState(false);

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId);
    setOpen(false);
  };

  const activeItem = navItems.find(item => item.id === activeTab);

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
