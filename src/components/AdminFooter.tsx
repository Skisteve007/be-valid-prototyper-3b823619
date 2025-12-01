import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Settings } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export const AdminFooter = () => {
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-4 left-4 md:bottom-8 md:left-8 z-50">
      <Button
        onClick={() => navigate("/admin")}
        className="h-12 px-4 md:h-14 md:px-6 bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl shadow-purple-500/50 hover:shadow-purple-600/60 transition-all duration-300 hover:scale-110 text-white"
        title="Go to Admin Panel"
      >
        <Settings className="h-5 w-5 md:h-6 md:w-6 mr-2" />
        <span className="font-medium">Admin Panel</span>
      </Button>
    </div>
  );
};