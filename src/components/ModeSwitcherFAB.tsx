import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Ghost, Home, LayoutDashboard, Building2, ShieldCheck, Users, Briefcase, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useVendorAccess } from "@/hooks/useVendorAccess";
import { useToast } from "@/hooks/use-toast";

const ModeSwitcherFAB = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { isLoggedIn, isAdmin, isVendor, isStaff, hasInvestorAccess, hasPartnerAccess, loading } = useVendorAccess();

  // Don't show on auth pages
  if (location.pathname.startsWith("/auth") || location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  const handleNavigate = (path: string, requiresAuth?: boolean, requiresVendorAccess?: boolean) => {
    setOpen(false);
    
    // Check if login is required
    if (requiresAuth && !isLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to continue.",
      });
      navigate(`/auth?mode=login&redirect=${encodeURIComponent(path)}`);
      return;
    }
    
    // Check if vendor access is required
    if (requiresVendorAccess && !isVendor && !isStaff && !isAdmin) {
      toast({
        title: "Access required",
        description: "Request vendor onboarding to access the dashboard.",
        variant: "destructive",
      });
      navigate("/vendor-portal");
      return;
    }
    
    navigate(path);
  };

  const menuItems = [
    // Always visible
    { label: "Home", icon: Home, path: "/", show: true },
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard", show: true, requiresAuth: true },
    { label: "Demos", icon: Sparkles, path: "/demos", show: true },
    { label: "For Business", icon: Building2, path: "/vendor-portal", show: true },
    
    // Vendor/Staff only - show to logged in users who have access
    { label: "Vendor Dashboard", icon: Briefcase, path: "/vendor-portal/dashboard", show: isVendor || isStaff || isAdmin, requiresVendorAccess: true },
    
    // Admin only
    { label: "Admin", icon: ShieldCheck, path: "/admin", show: isAdmin },
    
    // Investor access only
    { label: "Investor Portal", icon: Users, path: "/investor-portal", show: hasInvestorAccess },
    
    // Partner access only
    { label: "Partners", icon: Users, path: "/partners", show: hasPartnerAccess },
  ];

  const visibleItems = menuItems.filter(item => item.show);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-black shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:shadow-[0_0_50px_rgba(0,255,255,0.6)] transition-all duration-300 border-2 border-cyan-400/50 animate-pulse hover:animate-none"
          aria-label="Mode Switcher"
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Ghost className="h-6 w-6" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        side="top" 
        align="end" 
        className="w-56 p-2 bg-card/95 backdrop-blur-md border-border/50"
        sideOffset={12}
      >
        <div className="space-y-1">
          {loading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">Loading...</div>
          ) : (
            visibleItems.map((item) => (
              <Button
                key={item.path}
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 h-10"
                onClick={() => handleNavigate(item.path, item.requiresAuth, (item as any).requiresVendorAccess)}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </Button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ModeSwitcherFAB;
