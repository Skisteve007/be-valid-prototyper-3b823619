import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, UserPlus } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export const AdminFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, loading } = useIsAdmin();

  // Hide only on lab-kit-order page
  if (location.pathname === "/lab-kit-order") return null;

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/admin/login");
    }
  };

  const handleAdminSetup = () => {
    navigate("/admin/setup");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <Button
        onClick={handleAdminSetup}
        style={{ backgroundColor: '#a855f7', color: 'white' }}
        className="hover:opacity-90 shadow-[0_0_15px_rgba(168,85,247,0.6)] hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] rounded-full px-4 h-10"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Admin Setup
      </Button>
      <Button
        onClick={handleAdminClick}
        style={{ backgroundColor: '#a855f7', color: 'white' }}
        className="hover:opacity-90 shadow-[0_0_15px_rgba(168,85,247,0.6)] hover:shadow-[0_0_20px_rgba(168,85,247,0.8)] rounded-full px-4 h-10"
      >
        <Settings className="h-4 w-4 mr-2" />
        {isAdmin ? "Admin Panel" : "Admin Login"}
      </Button>
    </div>
  );
};
