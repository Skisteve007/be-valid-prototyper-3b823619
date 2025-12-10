import { Shield, ShieldCheck, ShieldAlert, Loader2, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface IDVStatusBadgeProps {
  status: "unverified" | "pending" | "verified" | "failed";
  tier?: "standard" | "vip" | null;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const IDVStatusBadge = ({ 
  status, 
  tier, 
  size = "md",
  showLabel = true 
}: IDVStatusBadgeProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const badgeSizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5"
  };

  const getStatusConfig = () => {
    switch (status) {
      case "verified":
        if (tier === "vip") {
          return {
            icon: Globe,
            label: "GLOBAL ACCESS VERIFIED",
            shortLabel: "VIP",
            className: "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.4)]",
            iconClass: "text-white"
          };
        }
        return {
          icon: ShieldCheck,
          label: "VIBE-ID VERIFIED",
          shortLabel: "VERIFIED",
          className: "bg-gradient-to-r from-emerald-600 to-green-600 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]",
          iconClass: "text-white"
        };
      case "pending":
        return {
          icon: Loader2,
          label: "VERIFICATION PENDING",
          shortLabel: "PENDING",
          className: "bg-amber-500/20 text-amber-400 border-amber-500/50",
          iconClass: "text-amber-400 animate-spin"
        };
      case "failed":
        return {
          icon: ShieldAlert,
          label: "VERIFICATION FAILED",
          shortLabel: "FAILED",
          className: "bg-red-500/20 text-red-400 border-red-500/50",
          iconClass: "text-red-400"
        };
      default:
        return {
          icon: Shield,
          label: "UNVERIFIED",
          shortLabel: "UNVERIFIED",
          className: "bg-gray-500/20 text-gray-400 border-gray-500/50",
          iconClass: "text-gray-400"
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge 
      className={cn(
        "font-bold tracking-wider uppercase flex items-center gap-1.5 border",
        badgeSizeClasses[size],
        config.className
      )}
    >
      <Icon className={cn(sizeClasses[size], config.iconClass)} />
      {showLabel && (
        <span>{size === "sm" ? config.shortLabel : config.label}</span>
      )}
    </Badge>
  );
};
