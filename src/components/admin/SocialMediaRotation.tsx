import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialContent {
  id: string;
  day_of_week: string;
  content_type: string;
  caption_template: string;
  hashtags: string;
  asset_placeholder: string;
}

export const SocialMediaRotation = () => {
  const [todayContent, setTodayContent] = useState<SocialContent | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodayContent();
  }, []);

  const fetchTodayContent = async () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = daysOfWeek[new Date().getDay()];

    const { data, error } = await supabase
      .from("social_content_rotation")
      .select("*")
      .eq("day_of_week", today)
      .single();

    if (error) {
      console.error("Error fetching social content:", error);
      toast({
        title: "Error",
        description: "Failed to load today's social content",
        variant: "destructive",
      });
      return;
    }

    setTodayContent(data);
  };

  const copyToClipboard = async (text: string, type: "caption" | "hashtags") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "caption") {
        setCopiedCaption(true);
        setTimeout(() => setCopiedCaption(false), 2000);
      } else {
        setCopiedHashtags(true);
        setTimeout(() => setCopiedHashtags(false), 2000);
      }
      toast({
        title: "Copied!",
        description: `${type === "caption" ? "Caption" : "Hashtags"} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  if (!todayContent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Social Media Rotation</CardTitle>
          <CardDescription>Loading today's content...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Social Post</CardTitle>
        <CardDescription>{todayContent.day_of_week} - {todayContent.content_type}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Caption */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Caption:</label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(todayContent.caption_template, "caption")}
              className="h-8"
            >
              {copiedCaption ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
            {todayContent.caption_template}
          </div>
        </div>

        {/* Hashtags */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Hashtags:</label>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(todayContent.hashtags, "hashtags")}
              className="h-8"
            >
              {copiedHashtags ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="p-3 bg-muted rounded-md text-sm">
            {todayContent.hashtags}
          </div>
        </div>

        {/* Asset */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Asset Needed:</label>
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-md text-sm">
            {todayContent.asset_placeholder}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
