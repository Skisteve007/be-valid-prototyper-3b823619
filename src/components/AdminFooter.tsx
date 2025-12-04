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
        className="flex items-center justify-center rounded-full px-4 h-10 font-medium text-sm hover:brightness-110 transition-all bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.9)] hover:shadow-[0_0_30px_rgba(37,99,235,1)]"
      >
        <UserPlus className="h-4 w-4 mr-2" />
        Admin Setup
      </button>
      <button
        onClick={handleAdminClick}
        className="flex items-center justify-center rounded-full px-4 h-10 font-medium text-sm hover:brightness-110 transition-all bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.9)] hover:shadow-[0_0_30px_rgba(37,99,235,1)]"
      >
        <Settings className="h-4 w-4 mr-2" />
        {isAdmin ? "Admin Panel" : "Admin Login"}
      </button>
    </div>
  );
};
