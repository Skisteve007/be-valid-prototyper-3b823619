import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MobileDataCardProps {
  title: string | ReactNode;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  };
  details?: Array<{ label: string; value: string | ReactNode }>;
  actions?: ReactNode;
  className?: string;
}

export const MobileDataCard = ({
  title,
  subtitle,
  badge,
  details,
  actions,
  className = "",
}: MobileDataCardProps) => {
  return (
    <Card className={`mb-3 ${className}`}>
      <CardContent className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base truncate">{title}</h4>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
          {badge && (
            <Badge 
              variant={badge.variant || "default"} 
              className={`shrink-0 ${badge.className || ""}`}
            >
              {badge.text}
            </Badge>
          )}
        </div>

        {/* Details Grid */}
        {details && details.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
            {details.map((detail, index) => (
              <div key={index} className="space-y-0.5">
                <p className="text-muted-foreground text-xs">{detail.label}</p>
                <p className="font-medium truncate">{detail.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Actions Row */}
        {actions && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
            {actions}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Wrapper for responsive table/card switching
interface ResponsiveDataListProps {
  children: ReactNode;
  mobileCards: ReactNode;
}

export const ResponsiveDataList = ({ children, mobileCards }: ResponsiveDataListProps) => {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        {children}
      </div>
      
      {/* Mobile Card View */}
      <div className="md:hidden">
        {mobileCards}
      </div>
    </>
  );
};
