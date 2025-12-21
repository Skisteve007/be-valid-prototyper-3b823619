import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";

interface InvestorDeckCarouselProps {
  images: string[];
  autoAdvanceMs?: number;
  /** Increment this value to programmatically open fullscreen (e.g., from a "View Deck" button). */
  openFullscreenRequest?: number;
}

const InvestorDeckCarousel: React.FC<InvestorDeckCarouselProps> = ({
  images,
  autoAdvanceMs = 9000,
  openFullscreenRequest,
}) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showMusicPrompt, setShowMusicPrompt] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/audio/pitch-deck-music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    // Attempt autoplay (will likely fail on mobile due to browser policies)
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
          setShowMusicPrompt(false);
          setHasUserInteracted(true);
        })
        .catch(() => {
          // Autoplay blocked - show prompt for user to tap
          setIsMuted(true);
          setShowMusicPrompt(true);
        });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle starting audio on first user interaction (for mobile)
  const startAudio = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current
      .play()
      .then(() => {
        setIsMuted(false);
        setShowMusicPrompt(false);
        setHasUserInteracted(true);
      })
      .catch(console.error);
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current
        .play()
        .then(() => {
          setIsMuted(false);
          setShowMusicPrompt(false);
          setHasUserInteracted(true);
        })
        .catch(console.error);
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  }, [isMuted]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  const goTo = useCallback((index: number) => setCurrent(index), []);

  // Auto-advance
  useEffect(() => {
    if (isPaused || images.length === 0) return;

    const timer = window.setInterval(() => {
      setCurrent((prevIdx) => (prevIdx + 1) % images.length);
    }, autoAdvanceMs);

    return () => window.clearInterval(timer);
  }, [isPaused, images.length, autoAdvanceMs]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next, isFullscreen]);

  // Programmatic fullscreen open
  useEffect(() => {
    if (!openFullscreenRequest) return;
    setIsFullscreen(true);
  }, [openFullscreenRequest]);

  // Handle swipe - track both start position and whether we're in a swipe gesture
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const deltaX = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
    const deltaY = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
    
    // If horizontal movement is greater than vertical, we're swiping slides
    if (deltaX > deltaY && deltaX > 10) {
      setIsSwiping(true);
      e.preventDefault(); // Prevent page scroll during horizontal swipe
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const deltaX = touchStartRef.current.x - touchEnd;
    
    // Only trigger navigation if we were swiping horizontally
    if (isSwiping || Math.abs(deltaX) > 50) {
      if (deltaX > 50) next();
      if (deltaX < -50) prev();
    }
    
    touchStartRef.current = null;
    setIsSwiping(false);
  };

  // When entering fullscreen, pause auto-advance and scroll into view
  useEffect(() => {
    if (!isFullscreen) return;
    setIsPaused(true);
    rootRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [isFullscreen]);

  // Hide music prompt after 8 seconds if user hasn't interacted
  useEffect(() => {
    if (!showMusicPrompt) return;
    const timer = setTimeout(() => {
      setShowMusicPrompt(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, [showMusicPrompt]);

  if (images.length === 0) {
    return (
      <div className="w-full h-[60vh] rounded-2xl border border-border bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No investor deck slides available</p>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className={
        "relative bg-black flex flex-col group select-none " +
        (isFullscreen
          ? "fixed inset-0 z-50"
          : "w-full h-auto min-h-[60vh] md:min-h-[75vh] rounded-2xl overflow-hidden border border-white/10")
      }
      style={{ touchAction: isSwiping ? 'none' : 'pan-y' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Investor deck slides"
    >
      {/* Main Image - object-contain ensures full visibility */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-2 sm:p-4 md:p-6">
        <img
          src={images[current]}
          alt={`VALID investor deck slide ${current + 1}`}
          className="max-w-full max-h-full object-contain transition-opacity duration-500 ease-in-out"
          style={{ aspectRatio: '16/9' }}
          loading="lazy"
        />
      </div>

      {/* Controls Footer - OUTSIDE slide area, always visible */}
      <div className="w-full shrink-0 border-t border-white/10 bg-black/95 px-3 md:px-4 py-2.5 md:py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Music + Auto indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleMute}
              className={
                "p-1.5 rounded-full transition-all hover:scale-105 backdrop-blur-sm border " +
                (isMuted
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                  : "bg-black/70 border-white/20 text-white")
              }
              aria-label={isMuted ? "Unmute music" : "Mute music"}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <div className="hidden sm:flex items-center gap-1.5">
              <div
                className={
                  "w-1.5 h-1.5 rounded-full transition-colors " +
                  (isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse")
                }
              />
              <span className="text-white/40 text-[10px] font-mono">
                {isPaused ? "PAUSED" : "AUTO"}
              </span>
            </div>
          </div>

          {/* Center: Dot indicators */}
          <div className="flex-1 flex justify-center overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 sm:gap-1.5 items-center">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={
                    "h-1.5 sm:h-2 rounded-full transition-all duration-300 flex-shrink-0 " +
                    (index === current
                      ? "bg-cyan-400 w-4 sm:w-6 shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                      : "bg-white/30 hover:bg-white/50 w-1.5 sm:w-2")
                  }
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Counter + Fullscreen */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-white/50 text-xs font-mono tracking-wider whitespace-nowrap">
              {current + 1}/{images.length}
            </span>
            <button
              onClick={() => setIsFullscreen((v) => !v)}
              className="p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-all hover:scale-105 backdrop-blur-sm border border-white/20"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Desktop hover only */}
      <button
        onClick={prev}
        className="absolute left-2 md:left-4 top-[calc(50%-2rem)] -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/70 hover:bg-black text-white transition-all opacity-0 md:group-hover:opacity-100 hover:scale-105 backdrop-blur-sm border border-white/20 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={next}
        className="absolute right-2 md:right-4 top-[calc(50%-2rem)] -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/70 hover:bg-black text-white transition-all opacity-0 md:group-hover:opacity-100 hover:scale-105 backdrop-blur-sm border border-white/20 z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Music Prompt Banner - Desktop only, positioned safely */}
      {showMusicPrompt && !hasUserInteracted && (
        <button
          onClick={startAudio}
          className="hidden md:flex absolute top-4 left-1/2 -translate-x-1/2 z-20 items-center gap-2 px-4 py-2 bg-cyan-500/90 text-black font-bold rounded-full shadow-lg animate-pulse hover:bg-cyan-400 transition-all"
        >
          <Music size={18} />
          <span className="text-sm">Tap for Music</span>
        </button>
      )}
    </div>
  );
};

export default InvestorDeckCarousel;
