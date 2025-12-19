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
  ArrowLeftRight,
  Moon,
  Wifi
} from "lucide-react";
import { toast } from "sonner";
import StationSelector from "@/components/door/StationSelector";

const DISPLAY_TTL_SECONDS = 60;

// Premium color palette
const COLORS = {
  background: '#07090D',
  backgroundAlt: '#0B0F14',
  accent: '#4DEBFF',
  verified: '#2EE59D',
  review: '#FFB020',
  denied: '#FF3B3B',
  text: '#E9EEF5',
  textMuted: '#6B7280'
};

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

// Demo Alien ID Component
const DemoAlienIdFront = () => (
  <div className="w-full h-full relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)' }}>
    {/* Hologram strip */}
    <div className="absolute top-0 right-0 w-8 h-full opacity-30"
      style={{ 
        background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(77,235,255,0.3) 2px, rgba(77,235,255,0.3) 4px)'
      }} 
    />
    
    {/* Card content */}
    <div className="p-4 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[8px] tracking-[0.3em] opacity-40" style={{ color: COLORS.accent }}>
            GALACTIC AUTHORITY
          </div>
          <div className="text-lg font-bold tracking-wide" style={{ color: COLORS.text }}>
            BEVALID
          </div>
        </div>
        <div className="text-right">
          <div className="text-[8px] opacity-40" style={{ color: COLORS.textMuted }}>ID NO.</div>
          <div className="text-xs font-mono" style={{ color: COLORS.accent }}>GW-07A9-221</div>
        </div>
      </div>
      
      {/* Photo + Info */}
      <div className="flex gap-4 items-center">
        {/* Alien silhouette photo */}
        <div className="w-20 h-24 rounded flex items-center justify-center"
          style={{ background: 'linear-gradient(180deg, #1f2937 0%, #111827 100%)', border: '1px solid rgba(77,235,255,0.2)' }}>
          <svg viewBox="0 0 60 80" className="w-14 h-18 opacity-60" style={{ color: COLORS.accent }}>
            <ellipse cx="30" cy="28" rx="18" ry="22" fill="currentColor" opacity="0.3"/>
            <ellipse cx="22" cy="26" rx="5" ry="7" fill="currentColor" opacity="0.5"/>
            <ellipse cx="38" cy="26" rx="5" ry="7" fill="currentColor" opacity="0.5"/>
            <path d="M20 45 Q30 55 40 45 L42 75 Q30 80 18 75 Z" fill="currentColor" opacity="0.3"/>
          </svg>
        </div>
        
        <div className="flex-1">
          <div className="text-[8px] opacity-40" style={{ color: COLORS.textMuted }}>NAME</div>
          <div className="text-base font-bold tracking-wide mb-2" style={{ color: COLORS.text }}>ZORP QUELL</div>
          
          <div className="text-[8px] opacity-40" style={{ color: COLORS.textMuted }}>EXPIRES</div>
          <div className="text-xs font-mono" style={{ color: COLORS.text }}>12/2099</div>
        </div>
      </div>
      
      {/* Microtext footer */}
      <div className="text-[6px] tracking-widest opacity-20" style={{ color: COLORS.textMuted }}>
        VERIFIED • BIOMETRIC CONFIRMED • CLASS-A CLEARANCE • VALID NETWORK AUTHORIZED
      </div>
    </div>
  </div>
);

const DemoAlienIdBack = () => (
  <div className="w-full h-full relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)' }}>
    {/* Stripe pattern */}
    <div className="absolute top-6 left-0 right-0 h-8 opacity-20"
      style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(77,235,255,0.2) 2px, rgba(77,235,255,0.2) 4px)' }}
    />
    
    <div className="p-4 h-full flex flex-col justify-between">
      {/* Barcode area */}
      <div className="mt-8">
        <div className="h-16 flex items-end gap-[2px]">
          {Array.from({ length: 40 }).map((_, i) => (
            <div 
              key={i}
              className="flex-1 bg-current"
              style={{ 
                height: `${30 + Math.random() * 70}%`,
                color: COLORS.text,
                opacity: 0.8
              }}
            />
          ))}
        </div>
        <div className="text-center text-xs font-mono mt-2 tracking-widest" style={{ color: COLORS.text }}>
          GW-07A9-221
        </div>
      </div>
      
      {/* Authorized text */}
      <div className="text-center">
        <div className="text-[10px] tracking-[0.4em] font-bold" style={{ color: COLORS.accent }}>
          AUTHORIZED ENTRY
        </div>
      </div>
      
      {/* Microtext */}
      <div className="text-[6px] tracking-widest opacity-20 text-center" style={{ color: COLORS.textMuted }}>
        SCAN AT DESIGNATED PORTAL • SINGLE-USE TOKEN REQUIRED • BEVALID NETWORK
      </div>
    </div>
  </div>
);

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
  const [isSleeping, setIsSleeping] = useState(false);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Wake Lock management
  useEffect(() => {
    const requestWakeLock = async () => {
      if ('wakeLock' in navigator) {
        setWakeLockSupported(true);
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          wakeLockRef.current.addEventListener('release', () => {
            console.log('Wake Lock released');
          });
        } catch (err) {
          console.log('Wake Lock request failed:', err);
        }
      }
    };

    requestWakeLock();

    // Re-acquire wake lock on visibility change
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && wakeLockSupported) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        } catch (err) {
          console.log('Wake Lock re-request failed:', err);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      wakeLockRef.current?.release();
    };
  }, [wakeLockSupported]);

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

    try {
      if (previousStation && previousStation !== station) {
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

  // Demo scan (uses demo Alien ID)
  const handleDemoScan = (decision: 'GOOD' | 'REVIEW' | 'NO') => {
    const demoResult: ScanResult = {
      status: decision === 'GOOD' ? 'verified' : decision === 'REVIEW' ? 'review' : 'denied',
      decision,
      profile: {
        fullName: 'ZORP QUELL',
        memberId: 'GW-07A9-221',
        isValid: decision === 'GOOD',
        idvStatus: decision === 'GOOD' ? 'verified' : 'pending',
        idvTier: 'standard'
      },
      message: decision === 'GOOD' ? 'Identity verified — Access granted' :
               decision === 'REVIEW' ? 'Manual verification required' :
               'Access denied — Policy violation'
    };
    
    setResult(demoResult);
    setTimeLeft(DISPLAY_TTL_SECONDS);
    setShowBack(false);
    setScanCount(prev => prev + 1);
    
    if (decision === 'GOOD') {
      setStatus('verified');
      playSound('success');
    } else if (decision === 'REVIEW') {
      setStatus('review');
      playSound('warning');
    } else {
      setStatus('denied');
      playSound('error');
    }
  };

  // Handle manual token entry
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

  // Sleep screen
  if (isSleeping) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center cursor-pointer select-none"
        style={{ background: '#000000' }}
        onClick={() => setIsSleeping(false)}
      >
        <p className="text-[10px] opacity-20" style={{ color: COLORS.textMuted }}>
          Tap to Wake
        </p>
      </div>
    );
  }

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

  const getDecisionColor = () => {
    switch (status) {
      case 'verified': return COLORS.verified;
      case 'review': return COLORS.review;
      default: return COLORS.denied;
    }
  };

  const getDecisionText = () => {
    switch (status) {
      case 'verified': return 'GOOD';
      case 'review': return 'REVIEW';
      case 'denied': return 'NO';
      case 'expired': return 'EXPIRED';
      case 'used': return 'USED';
      case 'invalid': return 'INVALID';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: COLORS.background, color: COLORS.text }}>
      {/* Ghost watermark background */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <Ghost 
          className="w-96 h-96 animate-pulse"
          style={{ 
            color: COLORS.accent,
            opacity: 0.05,
            animation: 'ghostPulse 8s ease-in-out infinite'
          }} 
        />
      </div>
      
      <style>{`
        @keyframes ghostPulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.10; }
        }
      `}</style>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4" style={{ borderBottom: `1px solid rgba(77,235,255,0.1)` }}>
        <div className="flex items-center gap-3">
          <Ghost className="w-6 h-6" style={{ color: COLORS.accent }} />
          <span className="font-bold text-lg tracking-wide">Ghostware™</span>
        </div>
        <div className="flex items-center gap-4">
          {/* Network indicator */}
          <div className="flex items-center gap-1">
            <Wifi className="w-3 h-3" style={{ color: COLORS.verified }} />
          </div>
          
          {/* Station & Operator Info */}
          <button 
            onClick={() => setShowStationSelector(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ 
              background: 'rgba(77,235,255,0.05)',
              border: `1px solid rgba(77,235,255,0.2)`
            }}
          >
            <MapPin className="w-4 h-4" style={{ color: COLORS.accent }} />
            <span className="text-sm font-medium">{stationContext.station}</span>
            <ArrowLeftRight className="w-3 h-3" style={{ color: COLORS.textMuted }} />
          </button>
          
          <div className="flex items-center gap-1 text-sm" style={{ color: COLORS.textMuted }}>
            <User className="w-4 h-4" />
            <span>{stationContext.operator}</span>
          </div>
          
          {status !== 'idle' && (
            <div className="flex items-center gap-1 text-sm">
              <Clock className="w-4 h-4" />
              <span style={{ color: timeLeft <= 10 ? COLORS.denied : COLORS.text }}>{timeLeft}s</span>
            </div>
          )}
          
          <button onClick={() => setSoundEnabled(!soundEnabled)}>
            {soundEnabled ? (
              <Volume2 className="w-5 h-5" style={{ color: COLORS.textMuted }} />
            ) : (
              <VolumeX className="w-5 h-5" style={{ color: COLORS.denied }} />
            )}
          </button>
          
          <button 
            onClick={() => setIsSleeping(true)}
            className="p-2 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(77,235,255,0.05)' }}
            title="Sleep Screen"
          >
            <Moon className="w-4 h-4" style={{ color: COLORS.textMuted }} />
          </button>
        </div>
      </header>

      {/* Wake Lock warning */}
      {!wakeLockSupported && (
        <div className="px-4 py-2 text-center text-[10px]" style={{ background: 'rgba(255,176,32,0.1)', color: COLORS.review }}>
          Set device screen timeout to max in Settings for best experience
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        {status === 'idle' ? (
          <div className="text-center space-y-8">
            {/* Ready status */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ border: `1px solid ${COLORS.accent}`, background: 'rgba(77,235,255,0.05)' }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: COLORS.accent }} />
              <span className="text-sm font-medium tracking-wider" style={{ color: COLORS.accent }}>READY</span>
            </div>

            {/* Scan area */}
            <div className="relative">
              <div 
                className="w-64 h-64 rounded-2xl flex items-center justify-center"
                style={{ 
                  border: `2px dashed rgba(77,235,255,0.3)`,
                  background: 'rgba(77,235,255,0.02)'
                }}
              >
                <ScanLine className="w-24 h-24 animate-pulse" style={{ color: COLORS.accent, opacity: 0.6 }} />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2 tracking-wide">Ghostware™ Door</h2>
              <p className="text-sm" style={{ color: COLORS.textMuted }}>Point camera at guest's QR code</p>
              <p className="text-xs mt-2" style={{ color: COLORS.textMuted }}>
                Scans this shift: {scanCount}
              </p>
            </div>

            {/* Demo Buttons */}
            <div className="flex gap-2 flex-wrap justify-center">
              <Button 
                onClick={() => handleDemoScan('GOOD')}
                className="text-xs px-3 py-1"
                style={{ background: COLORS.verified, color: '#000' }}
              >
                Demo: GOOD
              </Button>
              <Button 
                onClick={() => handleDemoScan('REVIEW')}
                className="text-xs px-3 py-1"
                style={{ background: COLORS.review, color: '#000' }}
              >
                Demo: REVIEW
              </Button>
              <Button 
                onClick={() => handleDemoScan('NO')}
                className="text-xs px-3 py-1"
                style={{ background: COLORS.denied, color: '#fff' }}
              >
                Demo: NO
              </Button>
            </div>

            {/* Manual Entry */}
            <div className="w-full max-w-xs space-y-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Enter token (testing)"
                className="w-full px-4 py-2 rounded-lg text-sm"
                style={{ 
                  background: 'rgba(77,235,255,0.05)',
                  border: `1px solid rgba(77,235,255,0.2)`,
                  color: COLORS.text
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleManualScan()}
              />
              <Button 
                onClick={handleManualScan} 
                className="w-full"
                variant="outline"
                style={{ borderColor: 'rgba(77,235,255,0.3)', color: COLORS.text }}
              >
                Test Scan
              </Button>
            </div>
          </div>
        ) : status === 'scanning' ? (
          <div className="text-center space-y-4">
            <div 
              className="w-32 h-32 rounded-full flex items-center justify-center animate-pulse"
              style={{ border: `4px solid ${COLORS.accent}` }}
            >
              <ScanLine className="w-16 h-16 animate-spin" style={{ color: COLORS.accent }} />
            </div>
            <p className="text-lg tracking-wide">Validating...</p>
          </div>
        ) : (
          <div 
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ 
              border: `2px solid ${getDecisionColor()}`,
              background: `${getDecisionColor()}10`
            }}
          >
            {/* Decision Banner */}
            <div className="py-6 text-center" style={{ background: getDecisionColor() }}>
              <div className="flex items-center justify-center gap-3">
                {status === 'verified' ? (
                  <CheckCircle2 className="w-16 h-16" style={{ color: '#000' }} />
                ) : status === 'review' ? (
                  <AlertTriangle className="w-16 h-16" style={{ color: '#000' }} />
                ) : (
                  <XCircle className="w-16 h-16" style={{ color: '#fff' }} />
                )}
                <span 
                  className="text-5xl font-black tracking-wider"
                  style={{ color: status === 'denied' || status === 'expired' || status === 'used' || status === 'invalid' ? '#fff' : '#000' }}
                >
                  {getDecisionText()}
                </span>
              </div>
            </div>

            {/* ID Card View */}
            {result?.profile && (
              <div className="p-4" style={{ background: COLORS.backgroundAlt }}>
                {/* Front/Back tabs */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setShowBack(false)}
                    className="flex items-center gap-1 px-3 py-1 rounded transition-all"
                    style={{ 
                      background: !showBack ? 'rgba(77,235,255,0.2)' : 'transparent',
                      color: COLORS.text
                    }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Front
                  </button>
                  <span className="text-sm" style={{ color: COLORS.textMuted }}>
                    {showBack ? 'ID Back' : 'ID Front'}
                  </span>
                  <button
                    onClick={() => setShowBack(true)}
                    className="flex items-center gap-1 px-3 py-1 rounded transition-all"
                    style={{ 
                      background: showBack ? 'rgba(77,235,255,0.2)' : 'transparent',
                      color: COLORS.text
                    }}
                  >
                    Back
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* ID Card display */}
                <div 
                  className="aspect-[1.6/1] rounded-xl mb-4 overflow-hidden"
                  style={{ border: `1px solid rgba(77,235,255,0.2)` }}
                >
                  {showBack ? (
                    result.profile.idBackUrl ? (
                      <img 
                        src={result.profile.idBackUrl} 
                        alt="ID Back" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <DemoAlienIdBack />
                    )
                  ) : (
                    result.profile.idFrontUrl ? (
                      <img 
                        src={result.profile.idFrontUrl} 
                        alt="ID Front" 
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <DemoAlienIdFront />
                    )
                  )}
                </div>

                {/* Profile info */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span style={{ color: COLORS.textMuted }}>Name</span>
                    <span className="font-medium">{result.profile.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: COLORS.textMuted }}>Member ID</span>
                    <span className="font-mono" style={{ color: COLORS.accent }}>{result.profile.memberId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: COLORS.textMuted }}>IDV Status</span>
                    <span style={{ color: result.profile.idvStatus === 'verified' ? COLORS.verified : COLORS.review }}>
                      {result.profile.idvStatus}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Message footer */}
            <div className="px-4 py-3 text-center" style={{ borderTop: `1px solid rgba(77,235,255,0.1)`, background: COLORS.background }}>
              <p className="text-sm" style={{ color: COLORS.textMuted }}>{result?.message}</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer Controls */}
      <footer className="relative z-10 p-4" style={{ borderTop: `1px solid rgba(77,235,255,0.1)` }}>
        <div className="flex gap-3 max-w-md mx-auto">
          <Button
            onClick={handleClear}
            className="flex-1 font-bold"
            style={{ background: COLORS.denied, color: '#fff' }}
            disabled={status === 'idle'}
          >
            <X className="w-4 h-4 mr-2" />
            KILL / CLEAR
          </Button>
          <Button
            onClick={handleClear}
            className="flex-1 font-bold"
            style={{ background: COLORS.accent, color: '#000' }}
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
            className="w-full hover:opacity-80"
            style={{ color: COLORS.textMuted }}
          >
            End Shift
          </Button>
        </div>
      </footer>
    </div>
  );
}
