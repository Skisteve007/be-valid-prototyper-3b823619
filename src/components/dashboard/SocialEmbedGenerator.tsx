// ******************************************************************************
// ************************* FULL FLOW EXPLAINER FOR DEVELOPERS *******************
// ******************************************************************************
//
// PURPOSE: Generates the unique "VALID STATUS CHECK" link for the member to embed on
// external platforms (Instagram, TikTok, Linktree). This turns the member's profile
// into a constant marketing and verification channel for VALID.
//
// FLOW:
// 1. GENERATION: User copies the <a> tag HTML/link below (which contains their unique userId).
// 2. EXTERNAL CLICK: A peer clicks the link (e.g., on Instagram).
// 3. TARGET PAGE: The user is directed to the public verification page (/verify/status/[User_ID]).
// 4. SERVER LOGIC: The backend must read the userId from the URL and dynamically render
//    a public profile view that displays ONLY the data the member has currently
//    toggled as shareable in their Member Sharing Settings.
//
// RESULT: Drives external traffic to VALID while strictly maintaining user privacy control.
// ******************************************************************************

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface SocialEmbedGeneratorProps {
  userId: string;
  userName?: string;
}

const SocialEmbedGenerator: React.FC<SocialEmbedGeneratorProps> = ({ userId, userName }) => {
  // The unique public URL that displays the user's verified status
  const publicUrl = `https://www.bevalid.app/verify/status/${userId}`;

  // The raw HTML code snippet the user will paste into Linktree/website bio
  const embedCode = `<a href="${publicUrl}" target="_blank" style="display: block; padding: 10px; background-color: #39FF14; color: #121212; text-align: center; text-decoration: none; border-radius: 8px; font-weight: bold; font-family: 'Orbitron', sans-serif;">✅ VALID STATUS CHECK</a>`;

  const [isCopied, setIsCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setIsCopied(true);
    toast.success('Embed code copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setIsLinkCopied(true);
    toast.success('Link copied to clipboard!');
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
        {/* Embed Code Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Embed Code (for websites/Linktree)</label>
          <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground font-mono overflow-x-auto border border-border">
            {embedCode}
          </div>
          <Button 
            onClick={handleCopyEmbed} 
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Code Copied!
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
            variant="outline"
            className="w-full border-accent/50 hover:bg-accent/10"
          >
            {isLinkCopied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Link Copied!
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
