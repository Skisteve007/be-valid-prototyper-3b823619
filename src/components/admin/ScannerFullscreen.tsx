import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Maximize,
  Volume2,
  VolumeX,
  Flashlight
} from "lucide-react";
import logo from "@/assets/clean-check-logo.png";

interface ScannerFullscreenProps {
  onClose: () => void;
  venueLogo?: string | null;
}

type ScanResult = {
  status: "valid" | "invalid" | "expired" | null;
  name?: string;
  memberId?: string;
  expiresAt?: string;
};

export const ScannerFullscreen = ({ onClose, venueLogo }: ScannerFullscreenProps) => {
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult>({ status: null });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Request Wake Lock to keep screen on
  useEffect(() => {
    const requestWakeLock = async () => {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
          setWakeLockActive(true);
          console.log("Wake Lock active");

          wakeLockRef.current.addEventListener("release", () => {
            setWakeLockActive(false);
            console.log("Wake Lock released");
          });
        }
      } catch (err) {
        console.error("Wake Lock error:", err);
      }
    };

    requestWakeLock();

    // Re-acquire on visibility change
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible" && !wakeLockRef.current) {
        await requestWakeLock();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, []);

  // Enter fullscreen on mount
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
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  const playSound = (type: "success" | "error") => {
    if (!soundEnabled) return;
    
    // Use Web Audio API for simple beeps
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

  // Simulated scan handler - in real app, this would connect to camera/scanner
  const handleManualEntry = () => {
    // Demo: Simulate a valid scan
    const demoResults: ScanResult[] = [
      { status: "valid", name: "John D.", memberId: "CC-12345678", expiresAt: "2025-03-01" },
      { status: "expired", name: "Jane S.", memberId: "CC-87654321", expiresAt: "2024-12-01" },
      { status: "invalid" },
    ];
    
    const result = demoResults[Math.floor(Math.random() * demoResults.length)];
    setScanResult(result);
    playSound(result.status === "valid" ? "success" : "error");
    
    // Auto-clear after 5 seconds
    setTimeout(() => setScanResult({ status: null }), 5000);
  };

  const handleClose = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    onClose();
  };

  const getStatusUI = () => {
    switch (scanResult.status) {
      case "valid":
        return {
          bg: "bg-green-500/20",
          border: "border-green-500",
          icon: <CheckCircle2 className="h-24 w-24 text-green-500" />,
          text: "VERIFIED",
          textColor: "text-green-500",
        };
      case "expired":
        return {
          bg: "bg-yellow-500/20",
          border: "border-yellow-500",
          icon: <AlertTriangle className="h-24 w-24 text-yellow-500" />,
          text: "EXPIRED",
          textColor: "text-yellow-500",
        };
      case "invalid":
        return {
          bg: "bg-red-500/20",
          border: "border-red-500",
          icon: <XCircle className="h-24 w-24 text-red-500" />,
          text: "INVALID",
          textColor: "text-red-500",
        };
      default:
        return null;
    }
  };

  const statusUI = getStatusUI();

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col">
      {/* Header Bar */}
      <div className="flex items-center justify-between p-4 bg-card border-b safe-area-top">
        <div className="flex items-center gap-3">
          {venueLogo ? (
            <img src={venueLogo} alt="Venue" className="h-10 w-auto" />
          ) : (
            <img src={logo} alt="Clean Check" className="h-10 w-auto" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant={wakeLockActive ? "default" : "secondary"}
            className={wakeLockActive ? "bg-green-500" : ""}
          >
            {wakeLockActive ? "Screen Active" : "Screen May Sleep"}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="h-12 w-12"
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleClose}
            className="h-12 w-12"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Main Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {scanResult.status ? (
          // Result Display
          <div className={`w-full max-w-md p-8 rounded-3xl border-4 ${statusUI?.bg} ${statusUI?.border} animate-in zoom-in-95 duration-300`}>
            <div className="text-center space-y-4">
              {statusUI?.icon}
              <h2 className={`text-4xl font-black ${statusUI?.textColor}`}>
                {statusUI?.text}
              </h2>
              {scanResult.name && (
                <div className="space-y-1">
                  <p className="text-2xl font-semibold">{scanResult.name}</p>
                  <p className="text-muted-foreground">{scanResult.memberId}</p>
                  {scanResult.expiresAt && (
                    <p className="text-sm text-muted-foreground">
                      Expires: {scanResult.expiresAt}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Ready to Scan
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="w-64 h-64 border-4 border-primary/30 rounded-3xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
                <QrCode className="h-32 w-32 text-primary/50" />
                {/* Scanning animation */}
                <div className="absolute inset-x-0 top-0 h-1 bg-primary animate-pulse" 
                     style={{ animation: "scan 2s ease-in-out infinite" }} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Ready to Scan</h2>
              <p className="text-muted-foreground">
                Position QR code within the frame
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="p-4 bg-card border-t safe-area-bottom">
        <Button 
          onClick={handleManualEntry}
          className="w-full h-16 text-lg font-semibold"
          size="lg"
        >
          <QrCode className="h-6 w-6 mr-3" />
          Tap to Simulate Scan (Demo)
        </Button>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(250px); opacity: 0.5; }
        }
        .safe-area-top { padding-top: max(1rem, env(safe-area-inset-top)); }
        .safe-area-bottom { padding-bottom: max(1rem, env(safe-area-inset-bottom)); }
      `}</style>
    </div>
  );
};
