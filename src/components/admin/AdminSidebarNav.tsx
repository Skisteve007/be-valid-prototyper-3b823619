import { Building2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  canAccessDealRoom?: boolean;
  canUnlockSynth?: boolean;
}

export const AdminSidebarNav = ({ activeTab, onTabChange }: AdminSidebarNavProps) => {
  return (
    <aside className="rounded-lg border bg-card p-2">
      <nav aria-label="Admin navigation" className="space-y-1">
        <Button
          type="button"
          variant={activeTab === "members" ? "default" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => onTabChange("members")}
        >
          <Users className="h-4 w-4" />
          Members
        </Button>

        <Button
          type="button"
          variant={activeTab === "accounts" ? "default" : "ghost"}
          className="w-full justify-start gap-2"
          onClick={() => onTabChange("accounts")}
        >
          <Building2 className="h-4 w-4" />
          Accounts
        </Button>
      </nav>
    </aside>
  );
};
