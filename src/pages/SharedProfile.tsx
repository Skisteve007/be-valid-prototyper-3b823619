import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldCheck, UserPlus } from "lucide-react";
import logo from "@/assets/valid-logo.jpeg";

interface SharedProfileData {
  id: string;
  full_name: string;
  profile_image_url: string | null;
  idv_status: string | null;
}

const SharedProfile = () => {
  const { shortId } = useParams<{ shortId: string }>();
  const [profile, setProfile] = useState<SharedProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!shortId) {
        setError("Invalid profile link");
        setLoading(false);
        return;
      }

      try {
        // Find profile by matching the first 8 characters of the ID
        const { data: profiles, error: fetchError } = await supabase
          .from("profiles")
          .select("id, full_name, profile_image_url, idv_status")
          .ilike("id", `${shortId}%`)
          .limit(1);

        if (fetchError) {
          console.error("Error fetching profile:", fetchError);
          setError("Profile not found");
          return;
        }

        if (profiles && profiles.length > 0) {
          setProfile(profiles[0]);
        } else {
          setError("Profile not found");
        }
      } catch (err) {
        console.error("Error:", err);
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [shortId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0A0E1A 0%, #120a21 50%, #0A0E1A 100%)' }}>
        <Loader2 className="h-8 w-8 animate-spin text-[#00FFC2]" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0A0E1A 0%, #120a21 50%, #0A0E1A 100%)' }}>
        <Card className="w-full max-w-md bg-black/40 border-red-500/30 backdrop-blur-xl">
          <CardContent className="pt-6 text-center">
            <p className="text-red-400 mb-4">{error || "Profile not found"}</p>
            <Link to="/">
              <Button className="bg-[#00FFC2]/20 hover:bg-[#00FFC2]/30 text-[#00FFC2] border border-[#00FFC2]/40">
                Go to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get first name or alias
  const displayName = profile.full_name?.split(" ")[0] || "Valid Member";
  const isVerified = profile.idv_status === "verified";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0A0E1A 0%, #120a21 50%, #0A0E1A 100%)' }}>
      {/* Plasma Background Effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-violet-500/15 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Valid" className="h-16 w-auto drop-shadow-[0_0_15px_rgba(0,255,194,0.5)]" />
        </div>

        {/* Profile Card */}
        <Card className="bg-black/40 border-[#00FFC2]/30 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,194,0.2)]">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center text-center space-y-6">
              {/* Profile Photo */}
              <Avatar className="h-32 w-32 border-4 border-[#00FFC2]/50 shadow-[0_0_30px_rgba(0,255,194,0.4)]">
                <AvatarImage src={profile.profile_image_url || undefined} />
                <AvatarFallback className="text-3xl bg-[#00FFC2]/20 text-[#00FFC2]">
                  {displayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Name */}
              <div>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  {displayName}
                </h1>
              </div>

              {/* Verification Badge */}
              <div className="flex items-center justify-center">
                <Badge className="bg-[#00FFC2]/20 text-[#00FFC2] border border-[#00FFC2]/40 text-lg py-2 px-6 gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Identity Verified by Valid™
                </Badge>
              </div>

              {/* Divider */}
              <div className="w-full border-t border-white/10 pt-6">
                <p className="text-[#E0E0FF]/60 text-sm mb-4">
                  Join the trusted network of verified members
                </p>

                {/* Join Button */}
                <Link to="/auth" className="block">
                  <Button className="w-full h-14 text-lg font-bold bg-gradient-to-r from-[#00FFC2] to-cyan-400 text-black hover:from-[#00FFC2]/90 hover:to-cyan-400/90 shadow-[0_0_20px_rgba(0,255,194,0.4)] hover:shadow-[0_0_30px_rgba(0,255,194,0.6)]">
                    <UserPlus className="h-5 w-5 mr-2" />
                    Join Valid™
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-[#E0E0FF]/40 text-xs">
          Valid™ - Verified Identity Network
        </p>
      </div>
    </div>
  );
};

export default SharedProfile;
