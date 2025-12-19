import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Ghost, 
  ScanLine, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  RotateCcw,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  User,
  MapPin,
  ArrowLeftRight
} from "lucide-react";
import { toast } from "sonner";
import StationSelector from "@/components/door/StationSelector";

const DISPLAY_TTL_SECONDS = 60;

type ScanStatus = 'idle' | 'scanning' | 'verified' | 'review' | 'denied' | 'expired' | 'used' | 'invalid';

interface ScanResult {
  status: ScanStatus;
  decision: 'GOOD' | 'REVIEW' | 'NO';
  profile?: {
    fullName: string;
    memberId: string;
    profileImageUrl?: string;
    idFrontUrl?: string;
    idBackUrl?: string;
    isValid: boolean;
    idvStatus: string;
    idvTier: string;
  };
  expiresAt?: string;
  message: string;
}

interface StationContext {
  station: string;
  operator: string;
  shiftStartedAt: string;
}

export default function DoorDevice() {
  const [stationContext, setStationContext] = useState<StationContext | null>(null);
  const [showStationSelector, setShowStationSelector] = useState(false);
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [showBack, setShowBack] = useState(false);
  const [timeLeft, setTimeLeft] = useState(DISPLAY_TTL_SECONDS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manualInput, setManualInput] = useState('');
  const [scanCount, setScanCount] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Log operator event
  const logOperatorEvent = useCallback(async (
    eventType: string,
    options: {
      fromStation?: string;
      toStation?: string;
      currentStation?: string;
      metadata?: Record<string, unknown>;
    } = {}
  ) => {
    if (!stationContext) return;

    try {
      await supabase.functions.invoke('log-operator-event', {
        body: {
          eventType,
          operatorLabel: stationContext.operator,
          currentStationLabel: options.currentStation || stationContext.station,
          fromStationLabel: options.fromStation,
          toStationLabel: options.toStation,
          metadata: options.metadata
        }
      });
    } catch (error) {
      console.error('Failed to log operator event:', error);
    }
  }, [stationContext]);

  // Handle station selection complete
  const handleStationComplete = async (station: string, operator: string) => {
    const previousStation = stationContext?.station;
    const previousOperator = stationContext?.operator;
    
    const newContext: StationContext = {
      station,
      operator,
      shiftStartedAt: stationContext?.shiftStartedAt || new Date().toISOString()
    };
    
    setStationContext(newContext);
    setShowStationSelector(false);

    // Log the appropriate event
    try {
      if (previousStation && previousStation !== station) {
        // Station switch
        await supabase.functions.invoke('log-operator-event', {
          body: {
            eventType: 'STATION_SWITCH',
            operatorLabel: operator,
            fromStationLabel: previousStation,
            toStationLabel: station,
            currentStationLabel: station,
            metadata: { previousOperator }
          }
        });
        toast.success(`Switched to ${station}`);
      } else if (!previousStation) {
        // New shift start
        await supabase.functions.invoke('log-operator-event', {
          body: {
            eventType: 'SHIFT_START',
            operatorLabel: operator,
            currentStationLabel: station,
            toStationLabel: station
          }
        });
        toast.success(`Shift started at ${station}`);
      }
    } catch (error) {
      console.error('Failed to log station event:', error);
    }
  };

  // Play sound
  const playSound = useCallback((type: 'success' | 'error' | 'warning') => {
    if (!soundEnabled || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    if (type === 'success') {
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.setValueAtTime(1320, ctx.currentTime + 0.1);
    } else if (type === 'warning') {
      oscillator.frequency.setValueAtTime(660, ctx.currentTime);
      oscillator.frequency.setValueAtTime(440, ctx.currentTime + 0.15);
    } else {
      oscillator.frequency.setValueAtTime(220, ctx.currentTime);
      oscillator.frequency.setValueAtTime(165, ctx.currentTime + 0.2);
    }
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }, [soundEnabled]);

  // Display countdown timer
  useEffect(() => {
    if (status === 'idle' || status === 'scanning') return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleClear();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Process scan
  const processScan = useCallback(async (token: string) => {
    setStatus('scanning');
    
    try {
      const { data, error } = await supabase.functions.invoke('door-scan', {
        body: { 
          token,
          venueId: null,
          deviceId: null,
          stationLabel: stationContext?.station,
          operatorLabel: stationContext?.operator
        }
      });

      if (error) throw error;

      const scanResult = data as ScanResult;
      setResult(scanResult);
      setTimeLeft(DISPLAY_TTL_SECONDS);
      setShowBack(false);
      setScanCount(prev => prev + 1);

      // Log scan performed
      logOperatorEvent('SCAN_PERFORMED', {
        metadata: {
          decision: scanResult.decision,
          memberId: scanResult.profile?.memberId,
          scanNumber: scanCount + 1
        }
      });

      if (scanResult.decision === 'GOOD') {
        setStatus('verified');
        playSound('success');
      } else if (scanResult.decision === 'REVIEW') {
        setStatus('review');
        playSound('warning');
      } else {
        setStatus('denied');
        playSound('error');
      }
    } catch (error) {
      console.error('Scan error:', error);
      setStatus('invalid');
      setResult({
        status: 'invalid',
        decision: 'NO',
        message: 'Scan failed — try again'
      });
      playSound('error');
    }
  }, [playSound, stationContext, scanCount, logOperatorEvent]);

  // Handle manual token entry (for testing)
  const handleManualScan = () => {
    if (manualInput.trim()) {
      try {
        const parsed = JSON.parse(manualInput);
        if (parsed.t) {
          processScan(parsed.t);
        }
      } catch {
        processScan(manualInput.trim());
      }
      setManualInput('');
    }
  };

  // Clear display
  const handleClear = () => {
    setStatus('idle');
    setResult(null);
    setShowBack(false);
    setTimeLeft(DISPLAY_TTL_SECONDS);
  };

  // End shift
  const handleEndShift = async () => {
    if (stationContext) {
      await logOperatorEvent('SHIFT_END', {
        metadata: { 
          totalScans: scanCount,
          shiftDuration: Date.now() - new Date(stationContext.shiftStartedAt).getTime()
        }
      });
    }
    setStationContext(null);
    setScanCount(0);
    toast.info('Shift ended');
  };

  // Get status styling
  const getStatusStyle = () => {
    switch (status) {
      case 'verified':
        return 'bg-green-500/20 border-green-500';
      case 'review':
        return 'bg-amber-500/20 border-amber-500';
      case 'denied':
      case 'expired':
      case 'used':
      case 'invalid':
        return 'bg-red-500/20 border-red-500';
      default:
        return 'bg-card border-border';
    }
  };

  const getDecisionIcon = () => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-24 h-24 text-green-500" />;
      case 'review':
        return <AlertTriangle className="w-24 h-24 text-amber-500" />;
      case 'denied':
      case 'expired':
      case 'used':
      case 'invalid':
        return <XCircle className="w-24 h-24 text-red-500" />;
      default:
        return null;
    }
  };

  const getDecisionText = () => {
    switch (status) {
      case 'verified':
        return 'GOOD';
      case 'review':
        return 'REVIEW';
      case 'denied':
        return 'NO';
      case 'expired':
        return 'EXPIRED';
      case 'used':
        return 'USED';
      case 'invalid':
        return 'INVALID';
      default:
        return '';
    }
  };

  // Show station selector if no context or explicitly requested
  if (!stationContext || showStationSelector) {
    return (
      <StationSelector
        onComplete={handleStationComplete}
        currentStation={stationContext?.station}
        lastOperator={stationContext?.operator}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Ghost className="w-6 h-6 text-purple-400" />
          <span className="font-bold text-lg">Ghostware™</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Station & Operator Info */}
          <button 
            onClick={() => setShowStationSelector(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
          >
            <MapPin className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium">{stationContext.station}</span>
            <ArrowLeftRight className="w-3 h-3 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="w-4 h-4" />
            <span>{stationContext.operator}</span>
          </div>
          {status !== 'idle' && (
            <div className="flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4" />
              <span className={timeLeft <= 10 ? 'text-red-400' : ''}>{timeLeft}s</span>
            </div>
          )}
          <button onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-muted-foreground" />
            ) : (
              <VolumeX className="w-5 h-5 text-red-400" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {status === 'idle' ? (
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="w-64 h-64 border-2 border-dashed border-purple-500/50 rounded-2xl flex items-center justify-center">
                <ScanLine className="w-32 h-32 text-purple-400 animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-purple-500/5 rounded-2xl animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to Scan</h2>
              <p className="text-muted-foreground">Point camera at guest's QR code</p>
              <p className="text-xs text-muted-foreground mt-2">
                Scans this shift: {scanCount}
              </p>
            </div>

            {/* Manual Entry for Testing */}
            <div className="w-full max-w-xs space-y-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Enter token (testing)"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm"
                onKeyDown={(e) => e.key === 'Enter' && handleManualScan()}
              />
              <Button onClick={handleManualScan} className="w-full" variant="outline">
                Test Scan
              </Button>
            </div>
          </div>
        ) : status === 'scanning' ? (
          <div className="text-center space-y-4">
            <div className="w-32 h-32 border-4 border-purple-500 rounded-full flex items-center justify-center animate-pulse">
              <ScanLine className="w-16 h-16 text-purple-400 animate-spin" />
            </div>
            <p className="text-lg">Validating...</p>
          </div>
        ) : (
          <div className={`w-full max-w-md rounded-2xl border-2 ${getStatusStyle()} overflow-hidden`}>
            {/* Decision Banner */}
            <div className={`py-4 text-center ${
              status === 'verified' ? 'bg-green-500' :
              status === 'review' ? 'bg-amber-500' :
              'bg-red-500'
            }`}>
              <div className="flex items-center justify-center gap-3">
                {getDecisionIcon()}
                <span className="text-4xl font-black">{getDecisionText()}</span>
              </div>
            </div>

            {/* ID Card View */}
            {result?.profile && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setShowBack(false)}
                    className={`flex items-center gap-1 px-3 py-1 rounded ${!showBack ? 'bg-white/20' : ''}`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Front
                  </button>
                  <span className="text-sm text-muted-foreground">
                    {showBack ? 'ID Back' : 'ID Front'}
                  </span>
                  <button
                    onClick={() => setShowBack(true)}
                    className={`flex items-center gap-1 px-3 py-1 rounded ${showBack ? 'bg-white/20' : ''}`}
                  >
                    Back
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="aspect-[1.6/1] bg-white/5 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                  {showBack ? (
                    result.profile.idBackUrl ? (
                      <img 
                        src={result.profile.idBackUrl} 
                        alt="ID Back" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <p>ID Back</p>
                        <p className="text-xs">(Barcode side)</p>
                      </div>
                    )
                  ) : (
                    result.profile.idFrontUrl ? (
                      <img 
                        src={result.profile.idFrontUrl} 
                        alt="ID Front" 
                        className="w-full h-full object-contain"
                      />
                    ) : result.profile.profileImageUrl ? (
                      <img 
                        src={result.profile.profileImageUrl} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <Ghost className="w-16 h-16 mx-auto mb-2 opacity-50" />
                        <p>No ID image</p>
                      </div>
                    )
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{result.profile.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member ID</span>
                    <span className="font-mono">{result.profile.memberId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IDV Status</span>
                    <span className={result.profile.idvStatus === 'verified' ? 'text-green-400' : 'text-amber-400'}>
                      {result.profile.idvStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="px-4 py-3 border-t border-white/10 text-center">
              <p className="text-sm">{result?.message}</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer Controls */}
      <footer className="p-4 border-t border-white/10">
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            onClick={handleClear}
            variant="destructive"
            className="flex-1"
            disabled={status === 'idle'}
          >
            <X className="w-4 h-4 mr-2" />
            KILL / CLEAR
          </Button>
          <Button
            onClick={handleClear}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            NEXT SCAN
          </Button>
        </div>
        
        {/* End Shift Button */}
        <div className="mt-3 max-w-md mx-auto">
          <Button
            onClick={handleEndShift}
            variant="ghost"
            className="w-full text-muted-foreground hover:text-red-400"
          >
            End Shift
          </Button>
        </div>
      </footer>
    </div>
  );
}
