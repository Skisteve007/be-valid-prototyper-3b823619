import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export const AdminFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, loading } = useIsAdmin();

  console.log('AdminFooter - isAdmin:', isAdmin, 'loading:', loading, 'pathname:', location.pathname);

  // Show button on all pages except lab-kit-order
  if (location.pathname === "/lab-kit-order") return null;

  // Only show for admin users
  if (!isAdmin || loading) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onClick={() => navigate("/admin")}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/50 text-white h-12"
      >
        <Settings className="h-4 w-4 mr-2" />
        Admin Panel
      </Button>
    </div>
  );
};