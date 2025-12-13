import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAccessControl } from "@/hooks/useAccessControl";
import { Shield, Lock, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AccessGateProps {
  accessType: "investor" | "partner";
  children: ReactNode;
}

export const AccessGate = ({ accessType, children }: AccessGateProps) => {
  const navigate = useNavigate();
  const { isLoading, hasAccess, hasPendingRequest, requestAccess } = useAccessControl(accessType);

  const accessLabel = accessType === "investor" ? "Investor Deck" : "Partner Solutions";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show request access UI
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 mb-8">
          <Lock className="w-12 h-12 text-cyan-400" />
        </div>

        <h1 className="text-4xl font-bold font-orbitron mb-4">
          {accessLabel} <span className="text-cyan-400">Access Required</span>
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-400 font-semibold uppercase tracking-wider text-sm">
              Protected Content
            </span>
          </div>

          <p className="text-gray-300 leading-relaxed mb-6">
            The <span className="text-white font-semibold">{accessLabel}</span> contains proprietary 
            information protected under NDA. Access requires explicit approval from VALID™ administrators.
          </p>

          {hasPendingRequest ? (
            <>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-4">
                <p className="text-amber-400 font-semibold mb-2">Request Pending</p>
                <p className="text-sm text-gray-400">
                  Your access request is being reviewed. You'll receive an email when approved.
                </p>
              </div>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            </>
          ) : (
            <Button
              onClick={requestAccess}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold py-6 text-lg"
            >
              Request Access
            </Button>
          )}
        </div>

        <p className="text-gray-500 text-sm">
          By requesting access, you acknowledge that you have agreed to our Terms of Service and NDA requirements.
        </p>
      </div>
    </div>
  );
};