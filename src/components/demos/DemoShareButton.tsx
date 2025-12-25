import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface DemoShareButtonProps {
  path?: string;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
}

const DemoShareButton = ({ 
  path, 
  label = "Share Link", 
  variant = "outline",
  size = "sm" 
}: DemoShareButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = path 
      ? `${window.location.origin}${path}` 
      : window.location.href;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-2" />
          {label}
        </>
      )}
    </Button>
  );
};

export default DemoShareButton;
