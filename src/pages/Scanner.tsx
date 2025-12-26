import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  X,
  QrCode,
  CheckCircle2,
  XCircle,
  Loader2,
  Volume2,
  VolumeX,
  Keyboard,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/valid-logo.jpeg";

type ScanResult = {
  status: "verified" | "not_verified" | "expired" | "loading" | null;
  memberId?: string;
  displayName?: string;
  statusColor?: string;
  profileImage?: string;
  error?: string;
  badges?: {
    idv_verified?: boolean;
    lab_certified?: boolean;
    status_valid?: boolean;
  };
};

type GhostQRPayload = {
  t: string; // token
  p: string; // profileId
  v?: string; // version (e.g., "ghostware")
  exp?: number; // expiration timestamp
};

const Scanner = () => {
  const navigate = useNavigate();
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult>({ status: null });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manualInput, setManualInput] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Request Wake Lock
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
          setWakeLockActive(true);
          wakeLockRef.current.addEventListener("release", () => {
            setWakeLockActive(false);
          });
        }
      } catch (err) {
        console.error("Wake Lock error:", err);
      }
    };

    requestWakeLock();
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible" && !wakeLockRef.current) {
        requestWakeLock();
      }
    });

    return () => {
      if (wakeLockRef.current) wakeLockRef.current.release();
    };
  }, []);

  // Enter fullscreen
  useEffect(() => {
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.log("Fullscreen not available");
      }
    };
    enterFullscreen();

    return () => {
      if (document.fullscreenElement) document.exitFullscreen();
    };
  }, []);

  const playSound = (type: "success" | "error") => {
    if (!soundEnabled) return;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = type === "success" ? 800 : 300;
    oscillator.type = "sine";
    gainNode.gain.value = 0.3;
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  // Parse Ghost QR JSON format
  const parseGhostQR = (input: string): GhostQRPayload | null => {
    const trimmed = input.trim();
    if (!trimmed.startsWith("{")) return null;
    
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed.t && parsed.p) {
        return { t: parsed.t, p: parsed.p, v: parsed.v, exp: parsed.exp };
      }
    } catch {
      return null;
    }
    return null;
  };

  // Parse VALID:<memberId> format (legacy)
  const parseLegacyQRCode = (input: string): string | null => {
    const trimmed = input.trim();
    
    // Match VALID:<memberId> format
    const match = trimmed.match(/^VALID:(.+)$/i);
    if (match) {
      return match[1];
    }
    
    // Also accept raw member ID format (CC-XXXXXXXX)
    if (/^CC-\d{8}$/i.test(trimmed)) {
      return trimmed.toUpperCase();
    }
    
    return null;
  };

  // Verify Ghost QR token via edge function
  const verifyGhostToken = async (payload: GhostQRPayload) => {
    setScanResult({ status: "loading" });
    
    try {
      console.log("[Scanner] Verifying Ghost QR token for profile:", payload.p);
      
      const { data, error } = await supabase.functions.invoke("verify-qr-token", {
        body: { token: payload.t, profileId: payload.p },
      });

      if (error) {
        console.error("[Scanner] Ghost verification error:", error);
        setScanResult({ status: "not_verified", error: "Verification failed" });
        playSound("error");
        return;
      }

      console.log("[Scanner] Ghost verification result:", data?.result);

      if (data?.result === "ALLOW") {
        setScanResult({
          status: "verified",
          memberId: data.profile?.member_id,
          displayName: data.profile?.display_name,
          statusColor: data.badges?.status_color,
          badges: {
            idv_verified: data.badges?.idv_verified,
            lab_certified: data.badges?.lab_certified,
            status_valid: data.badges?.status_valid,
          },
        });
        playSound("success");
      } else if (data?.result === "EXPIRED") {
        setScanResult({
          status: "expired",
          error: "Expired — ask guest to refresh code",
        });
        playSound("error");
      } else {
        setScanResult({
          status: "not_verified",
          error: data?.reason || "Invalid code",
        });
        playSound("error");
      }
    } catch (err) {
      console.error("[Scanner] Ghost verification error:", err);
      setScanResult({ status: "not_verified", error: "Connection error" });
      playSound("error");
    }

    // Auto-clear after 5 seconds
    setTimeout(() => setScanResult({ status: null }), 5000);
  };

  // Validate member via endpoint
  const validateMember = async (memberId: string) => {
    setScanResult({ status: "loading" });
    
    try {
      console.log("Validating member:", memberId);
      
      const { data, error } = await supabase.functions.invoke("validate-member", {
        body: { memberId },
      });

      if (error) {
        console.error("Validation error:", error);
        setScanResult({ status: "not_verified", error: "Validation failed" });
        playSound("error");
        return;
      }

      if (data?.verified) {
        setScanResult({
          status: "verified",
          memberId: data.memberId,
          displayName: data.displayName,
          statusColor: data.statusColor,
          profileImage: data.profileImage,
        });
        playSound("success");
      } else {
        setScanResult({
          status: "not_verified",
          memberId: data?.memberId,
          error: data?.error || "Not verified",
        });
        playSound("error");
      }
    } catch (err) {
      console.error("Validation error:", err);
      setScanResult({ status: "not_verified", error: "Connection error" });
      playSound("error");
    }

    // Auto-clear after 5 seconds
    setTimeout(() => setScanResult({ status: null }), 5000);
  };

  // Handle manual entry - supports both Ghost QR JSON and legacy format
  const handleManualSubmit = () => {
    // Try Ghost QR JSON first
    const ghostPayload = parseGhostQR(manualInput);
    if (ghostPayload) {
      verifyGhostToken(ghostPayload);
      setManualInput("");
      setShowManualEntry(false);
      return;
    }

    // Fallback to legacy VALID:CC-XXXXXXXX format
    const memberId = parseLegacyQRCode(manualInput);
    if (memberId) {
      validateMember(memberId);
      setManualInput("");
      setShowManualEntry(false);
    } else {
      toast.error("Invalid format. Paste Ghost QR JSON or use VALID:CC-XXXXXXXX");
    }
  };

  // Focus input when manual entry shown
  useEffect(() => {
    if (showManualEntry && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showManualEntry]);

  const handleClose = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/80 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <img src={logo} alt="VALID" className="h-8 w-auto rounded" />
          <span className="text-white font-bold tracking-wider">SCANNER</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={wakeLockActive ? "default" : "secondary"} className={wakeLockActive ? "bg-green-500" : ""}>
            {wakeLockActive ? "Active" : "Sleep"}
          </Badge>
          <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)} className="text-white">
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClose} className="text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {scanResult.status === "loading" ? (
          <div className="text-center space-y-4">
            <Loader2 className="h-24 w-24 text-cyan-400 animate-spin mx-auto" />
            <p className="text-white text-xl">Validating...</p>
          </div>
        ) : scanResult.status === "verified" ? (
          <Card className="w-full max-w-md bg-green-500/20 border-4 border-green-500 animate-in zoom-in-95">
            <CardContent className="p-8 text-center space-y-4">
              <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto" />
              <h2 className="text-4xl font-black text-green-500">VERIFIED</h2>
              {scanResult.profileImage && (
                <img src={scanResult.profileImage} alt="" className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-green-500" />
              )}
              {scanResult.displayName && (
                <p className="text-2xl font-semibold text-white">{scanResult.displayName}</p>
              )}
              <p className="text-gray-400 font-mono">{scanResult.memberId}</p>
              {scanResult.statusColor && (
                <Badge className={`text-sm ${
                  scanResult.statusColor === "green" ? "bg-green-500" :
                  scanResult.statusColor === "yellow" ? "bg-yellow-500" :
                  scanResult.statusColor === "red" ? "bg-red-500" : "bg-gray-500"
                }`}>
                  Status: {scanResult.statusColor.toUpperCase()}
                </Badge>
              )}
            </CardContent>
          </Card>
        ) : scanResult.status === "expired" ? (
          <Card className="w-full max-w-md bg-amber-500/20 border-4 border-amber-500 animate-in zoom-in-95">
            <CardContent className="p-8 text-center space-y-4">
              <XCircle className="h-24 w-24 text-amber-500 mx-auto" />
              <h2 className="text-4xl font-black text-amber-500">EXPIRED</h2>
              <p className="text-amber-400 text-sm">{scanResult.error || "Ask guest to refresh their code"}</p>
            </CardContent>
          </Card>
        ) : scanResult.status === "not_verified" ? (
          <Card className="w-full max-w-md bg-red-500/20 border-4 border-red-500 animate-in zoom-in-95">
            <CardContent className="p-8 text-center space-y-4">
              <XCircle className="h-24 w-24 text-red-500 mx-auto" />
              <h2 className="text-4xl font-black text-red-500">NOT VERIFIED</h2>
              {scanResult.memberId && (
                <p className="text-gray-400 font-mono">{scanResult.memberId}</p>
              )}
              {scanResult.error && (
                <p className="text-red-400 text-sm">{scanResult.error}</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="text-center space-y-8">
            <div className="w-64 h-64 border-4 border-cyan-500/50 rounded-3xl flex items-center justify-center relative overflow-hidden mx-auto">
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent" />
              <QrCode className="h-32 w-32 text-cyan-500/50" />
              <div className="absolute inset-x-0 top-0 h-1 bg-cyan-500 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white">Ready to Scan</h2>
              <p className="text-gray-400">Scan Ghost QR or VALID:CC-XXXXXXXX</p>
            </div>
          </div>
        )}
      </div>

      {/* Manual Entry Section */}
      {showManualEntry && (
        <div className="p-4 bg-black/80 border-t border-white/10">
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              ref={inputRef}
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder='{"t":"token","p":"profileId"} or VALID:CC-12345678'
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
            />
            <Button onClick={handleManualSubmit} className="bg-cyan-500 hover:bg-cyan-600">
              Verify
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="p-4 bg-black/80 border-t border-white/10 safe-area-bottom">
        <Button
          onClick={() => setShowManualEntry(!showManualEntry)}
          className="w-full h-14 text-lg font-semibold bg-cyan-600 hover:bg-cyan-700"
          size="lg"
        >
          <Keyboard className="h-5 w-5 mr-3" />
          {showManualEntry ? "Hide Manual Entry" : "Manual Entry"}
        </Button>
      </div>

      <style>{`
        .safe-area-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
      `}</style>
    </div>
  );
};

export default Scanner;
