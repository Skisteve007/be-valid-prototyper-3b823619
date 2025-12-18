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
  const [touchStart, setTouchStart] = useState(0);
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

  // Handle swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) next();
    if (touchEnd - touchStart > 50) prev();
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
        "relative bg-black flex flex-col group " +
        (isFullscreen
          ? "fixed inset-0 z-50"
          : "w-full h-[70vh] md:h-[80vh] rounded-2xl overflow-hidden border border-white/10")
      }
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Investor deck slides"
    >
      {/* Music Prompt Banner (Mobile-friendly tap to enable) */}
      {showMusicPrompt && !hasUserInteracted && (
        <button
          onClick={startAudio}
          className="absolute top-12 md:top-14 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-2 bg-cyan-500/90 text-black font-bold rounded-full shadow-lg animate-pulse hover:bg-cyan-400 transition-all"
        >
          <Music size={18} />
          <span className="text-sm">Tap for Music</span>
        </button>
      )}

      {/* Main Image */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-3 md:p-6">
        <img
          src={images[current]}
          alt={`VALID investor deck slide ${current + 1}`}
          className="max-w-full max-h-full object-contain transition-opacity duration-500 ease-in-out"
          loading="lazy"
        />
      </div>

      {/* Controls Bar (below the image) */}
      <div className="w-full shrink-0 border-t border-white/10 bg-black/90 backdrop-blur-sm px-3 md:px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex justify-center">
            <div className="flex gap-1.5 md:gap-2 flex-wrap justify-center max-w-[92%]">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={
                    "h-2 rounded-full transition-all duration-300 " +
                    (index === current
                      ? "bg-cyan-400 w-6 shadow-[0_0_8px_rgba(0,240,255,0.6)]"
                      : "bg-white/30 hover:bg-white/50 w-2")
                  }
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-white/50 text-xs font-mono tracking-wider whitespace-nowrap">
            {current + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/70 hover:bg-black text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-105 backdrop-blur-sm border border-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/70 hover:bg-black text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-105 backdrop-blur-sm border border-white/20"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Auto indicator */}
      <div className="absolute top-3 md:top-4 left-3 md:left-4 flex items-center gap-2">
        <div
          className={
            "w-2 h-2 rounded-full transition-colors " +
            (isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse")
          }
        />
        <span className="text-white/40 text-xs font-mono hidden md:inline">
          {isPaused ? "PAUSED" : "AUTO"}
        </span>
      </div>

      {/* Mute Toggle */}
      <button
        onClick={toggleMute}
        className={
          "absolute top-3 md:top-4 right-14 md:right-16 p-2 rounded-full transition-all hover:scale-105 backdrop-blur-sm border " +
          (isMuted
            ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
            : "bg-black/70 border-white/20 text-white")
        }
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* Fullscreen Toggle */}
      <button
        onClick={() => setIsFullscreen((v) => !v)}
        className="absolute top-3 md:top-4 right-3 md:right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-all hover:scale-105 backdrop-blur-sm border border-white/20"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>
    </div>
  );
};

export default InvestorDeckCarousel;
