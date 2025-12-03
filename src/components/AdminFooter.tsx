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
      <button
        onClick={handleAdminSetup}
        style={{ 
          backgroundColor: '#e9d5ff', 
          color: '#581c87',
          boxShadow: '0 0 15px rgba(233, 213, 255, 0.8)'
        }}
        className="flex items-center justify-center rounded-full px-4 h-10 font-medium text-sm hover:brightness-105 transition-all"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Admin Setup
      </button>
      <button
        onClick={handleAdminClick}
        style={{ 
          backgroundColor: '#e9d5ff', 
          color: '#581c87',
          boxShadow: '0 0 15px rgba(233, 213, 255, 0.8)'
        }}
        className="flex items-center justify-center rounded-full px-4 h-10 font-medium text-sm hover:brightness-105 transition-all"
      >
        <Settings className="h-4 w-4 mr-2" />
        {isAdmin ? "Admin Panel" : "Admin Login"}
      </button>
    </div>
  );
};
