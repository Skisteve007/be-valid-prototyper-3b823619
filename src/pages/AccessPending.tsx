import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Clock, Shield, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const AccessPending = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessType = searchParams.get("type") || "investor";
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUserEmail(session.user.email || "");
    };
    checkSession();
  }, [navigate]);

  const accessLabel = accessType === "investor" ? "Investor Deck" : "Partner Solutions";

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/20 border border-amber-500/50 mb-6">
            <Clock className="w-10 h-10 text-amber-400 animate-pulse" />
          </div>
          
          <h1 className="text-3xl font-bold font-orbitron mb-4">
            Access Request <span className="text-amber-400">Pending</span>
          </h1>
          
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-semibold uppercase tracking-wider text-sm">
                {accessLabel} Access
              </span>
            </div>
            
            <p className="text-gray-300 leading-relaxed">
              Your request to access the <span className="text-white font-semibold">{accessLabel}</span> has been submitted. 
              An administrator will review your request and grant access.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-400 mb-2">Request submitted for:</p>
            <p className="text-cyan-400 font-mono">{userEmail}</p>
          </div>

          <p className="text-gray-500 text-sm mb-8">
            You will receive an email notification once your access has been approved.
          </p>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
            >
              Go to Dashboard
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessPending;