import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";

export const AdminFooter = () => {
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();

  if (!isAdmin) return null;

  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-start">
          <Button
            onClick={() => navigate("/admin")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/50 text-white"
          >
            <Settings className="h-4 w-4 mr-2" />
            Admin Panel
          </Button>
        </div>
      </div>
    </footer>
  );
};