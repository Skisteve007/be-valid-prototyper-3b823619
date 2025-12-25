import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import DemoShareButton from "./DemoShareButton";

interface DemoCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  bullets: string[];
  whoFor: string;
  path: string;
}

const DemoCard = ({ title, subtitle, icon: Icon, bullets, whoFor, path }: DemoCardProps) => {
  return (
    <Card className="border-border/50 hover:border-primary/40 transition-colors h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg">{title}</CardTitle>
            {subtitle && (
              <CardDescription className="text-xs mt-0.5">{subtitle}</CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-1 flex flex-col">
        <div className="mb-4 flex-1">
          <p className="text-xs text-muted-foreground font-medium mb-2">What you'll see:</p>
          <ul className="text-sm text-foreground/80 space-y-1">
            {bullets.map((bullet, i) => (
              <li key={i}>• {bullet}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-4">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Who it's for:</span> {whoFor}
          </p>
        </div>

        <div className="flex gap-2 mt-auto">
          <Button asChild className="flex-1">
            <Link to={path}>Launch Demo</Link>
          </Button>
          <DemoShareButton path={path} label="Copy Link" variant="outline" />
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoCard;
