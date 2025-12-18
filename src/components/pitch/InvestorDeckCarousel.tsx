import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
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
  const [isMuted, setIsMuted] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio and attempt autoplay
  useEffect(() => {
    audioRef.current = new Audio("/audio/pitch-deck-music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsMuted(false))
        .catch(() => {
          // Autoplay blocked - user can tap the sound icon to start
          setIsMuted(true);
        });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }

    setIsMuted((v) => !v);
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
        "relative bg-background flex flex-col group " +
        (isFullscreen
          ? "fixed inset-0 z-50"
          : "w-full h-[70vh] md:h-[80vh] rounded-2xl overflow-hidden border border-border")
      }
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Investor deck slides"
    >
      {/* Main Image */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-3 md:p-6">
        <img
          src={images[current]}
          alt={`VALID investor deck slide ${current + 1}`}
          className="max-w-full max-h-full object-contain transition-opacity duration-500 ease-in-out"
          loading="lazy"
        />
      </div>

      {/* Controls Bar (kept below the image) */}
      <div className="w-full shrink-0 border-t border-border bg-background/80 backdrop-blur-sm px-3 md:px-4 py-3">
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
                      ? "bg-primary w-6"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-2")
                  }
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="text-muted-foreground text-xs font-mono tracking-wider whitespace-nowrap">
            {current + 1} / {images.length}
          </div>
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-background/70 hover:bg-background text-foreground transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-105 backdrop-blur-sm border border-border"
        aria-label="Previous slide"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-background/70 hover:bg-background text-foreground transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-105 backdrop-blur-sm border border-border"
        aria-label="Next slide"
      >
        <ChevronRight size={22} />
      </button>

      {/* Auto indicator */}
      <div className="absolute top-3 md:top-4 left-3 md:left-4 flex items-center gap-2">
        <div
          className={
            "w-2 h-2 rounded-full transition-colors " +
            (isPaused ? "bg-muted-foreground" : "bg-primary animate-pulse")
          }
        />
        <span className="text-muted-foreground text-xs font-mono hidden md:inline">
          {isPaused ? "PAUSED" : "AUTO"}
        </span>
      </div>

      {/* Mute Toggle */}
      <button
        onClick={toggleMute}
        className="absolute top-3 md:top-4 right-14 md:right-16 p-2 rounded-full bg-background/70 hover:bg-background text-foreground transition-all hover:scale-105 backdrop-blur-sm border border-border"
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>

      {/* Fullscreen Toggle */}
      <button
        onClick={() => setIsFullscreen((v) => !v)}
        className="absolute top-3 md:top-4 right-3 md:right-4 p-2 rounded-full bg-background/70 hover:bg-background text-foreground transition-all hover:scale-105 backdrop-blur-sm border border-border"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>
    </div>
  );
};

export default InvestorDeckCarousel;
