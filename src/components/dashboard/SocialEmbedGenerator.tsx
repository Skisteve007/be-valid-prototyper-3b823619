// ******************************************************************************
// ************************* FULL FLOW EXPLAINER FOR DEVELOPERS *******************
// ******************************************************************************
//
// PURPOSE: Generates the unique "VALID STATUS CHECK" link for the member to embed on
// external platforms (Instagram, TikTok, Linktree). This turns the member's profile
// into a constant marketing and verification channel for VALID.
//
// FLOW:
// 1. GENERATION: User selects their destination platform and copies the embed code.
// 2. LOGGING: The backend logs which platform the user selected for analytics.
// 3. EXTERNAL CLICK: A peer clicks the link (e.g., on Instagram).
// 4. TARGET PAGE: The user is directed to the public verification page (/verify/status/[User_ID]).
// 5. SERVER LOGIC: The backend reads the userId and renders ONLY shareable data.
//
// RESULT: Drives external traffic to VALID while maintaining user privacy control.
// ******************************************************************************

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface SocialEmbedGeneratorProps {
  userId: string;
  userName?: string;
}

const SocialEmbedGenerator: React.FC<SocialEmbedGeneratorProps> = ({ userId, userName }) => {
  // State to track the platform the user intends to embed the link on
  const [destinationPlatform, setDestinationPlatform] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const [isLogging, setIsLogging] = useState(false);

  // The unique public URL that displays the user's verified status
  const publicUrl = `https://www.bevalid.app/verify/status/${userId}`;

  // The raw HTML code snippet the user will paste into Linktree/website bio
  const embedCode = `<a href="${publicUrl}" target="_blank" style="display: block; padding: 10px; background-color: #39FF14; color: #121212; text-align: center; text-decoration: none; border-radius: 8px; font-weight: bold; font-family: 'Orbitron', sans-serif;">✅ VALID STATUS CHECK</a>`;

  // Backend logging function
  const logSocialEmbedEvent = async (platform: string) => {
    if (!platform) return;

    setIsLogging(true);
    try {
      const { error } = await supabase.functions.invoke('log-social-embed', {
        body: {
          userId: userId,
          platform: platform,
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Failed to log social embed event:', error);
      } else {
        console.log(`[BACKEND LOG] User ${userId} logged embed event to: ${platform}`);
      }
    } catch (error) {
      console.error('Failed to log social embed event:', error);
    } finally {
      setIsLogging(false);
    }
  };

  // Copy embed code handler
  const handleCopyEmbed = async () => {
    if (!destinationPlatform) {
      toast.error('Please select the social network you will use before copying.');
      return;
    }

    // 1. Copy the code to clipboard
    await navigator.clipboard.writeText(embedCode);

    // 2. Log the event to the backend
    await logSocialEmbedEvent(destinationPlatform);

    // 3. Update UI state
    setIsCopied(true);
    toast.success('Embed code copied & event logged!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Copy direct link handler
  const handleCopyLink = async () => {
    if (!destinationPlatform) {
      toast.error('Please select the social network you will use before copying.');
      return;
    }

    await navigator.clipboard.writeText(publicUrl);
    await logSocialEmbedEvent(destinationPlatform);
    setIsLinkCopied(true);
    toast.success('Link copied & event logged!');
    setTimeout(() => setIsLinkCopied(false), 2000);
  };

  return (
    <Card className="border-2 border-accent/30 shadow-[0_0_30px_hsl(var(--accent)/0.3)]">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Link2 className="h-6 w-6 text-accent" />
          <CardTitle className="text-xl text-foreground">Social Network Verification Widget</CardTitle>
        </div>
        <CardDescription>
          Generate a unique link to embed on your Instagram, TikTok, or Linktree profiles. This transforms your profile into a constant marketing and verification channel.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Platform Selection Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Where will you embed this code? *</label>
          <Select value={destinationPlatform} onValueChange={setDestinationPlatform}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="-- Select Network --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="OnlyFans">OnlyFans</SelectItem>
              <SelectItem value="Twitter/X">Twitter/X</SelectItem>
              <SelectItem value="Linktree/BioSite">Linktree / Bio Site</SelectItem>
              <SelectItem value="PersonalWebsite">Personal Website</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Embed Code Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Embed Code (for websites/Linktree)</label>
          <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground font-mono overflow-x-auto border border-border">
            {embedCode}
          </div>
          <Button
            onClick={handleCopyEmbed}
            disabled={!destinationPlatform || isLogging}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold disabled:opacity-50"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Code Copied & Event Logged!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Embed Code
              </>
            )}
          </Button>
        </div>

        {/* Direct Link */}
        <div className="space-y-2 pt-2 border-t border-border">
          <label className="text-sm font-medium text-muted-foreground">Direct Link (for bio links)</label>
          <div className="bg-muted/50 p-3 rounded-lg text-xs text-accent font-mono break-all border border-border">
            {publicUrl}
          </div>
          <Button
            onClick={handleCopyLink}
            disabled={!destinationPlatform || isLogging}
            variant="outline"
            className="w-full border-accent/50 hover:bg-accent/10 disabled:opacity-50"
          >
            {isLinkCopied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Link Copied & Event Logged!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Direct Link
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2">
          Only data you have toggled as shareable in your Member Sharing Settings will be visible.
        </p>
      </CardContent>
    </Card>
  );
};

export default SocialEmbedGenerator;
