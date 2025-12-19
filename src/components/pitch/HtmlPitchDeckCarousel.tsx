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
import PitchSlide from "./PitchSlide";
import { pitchSlides } from "./PitchSlideData";

interface HtmlPitchDeckCarouselProps {
  autoAdvanceMs?: number;
  openFullscreenRequest?: number;
}

const HtmlPitchDeckCarousel: React.FC<HtmlPitchDeckCarouselProps> = ({
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

  const totalSlides = pitchSlides.length;

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/audio/pitch-deck-music.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsMuted(false);
          setShowMusicPrompt(false);
          setHasUserInteracted(true);
        })
        .catch(() => {
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
    setCurrent((c) => (c - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % totalSlides);
  }, [totalSlides]);

  const goTo = useCallback((index: number) => setCurrent(index), []);

  // Auto-advance
  useEffect(() => {
    if (isPaused || totalSlides === 0) return;

    const timer = window.setInterval(() => {
      setCurrent((prevIdx) => (prevIdx + 1) % totalSlides);
    }, autoAdvanceMs);

    return () => window.clearInterval(timer);
  }, [isPaused, totalSlides, autoAdvanceMs]);

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


  // Mobile-first: use viewport height on small screens, aspect ratio on larger
  const slideContainerClass = isFullscreen
    ? "flex-1 min-h-0"
    : "h-[70dvh] min-h-[280px] max-h-[82dvh] sm:h-auto sm:min-h-0 sm:max-h-none sm:aspect-[16/10] md:aspect-video";

  return (
    <div
      ref={rootRef}
      className={
        "relative bg-black flex flex-col group touch-pan-y " +
        (isFullscreen
          ? "fixed inset-0 z-50"
          : "w-full rounded-lg md:rounded-2xl overflow-hidden border border-white/10")
      }
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="Investor deck slides"
    >
      {/* Main Slide Content - Large viewport height on mobile, aspect ratio on desktop */}
      <div className={"relative w-full overflow-hidden " + slideContainerClass}>
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
          style={{
            width: `${totalSlides * 100}%`,
            transform: `translateX(-${(current * 100) / totalSlides}%)`,
          }}
        >
          {pitchSlides.map((slide) => (
            <div
              key={slide.id}
              className="h-full flex-shrink-0"
              style={{ width: `${100 / totalSlides}%` }}
            >
              <PitchSlide slide={slide} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls Footer - Compact on mobile, normal on desktop */}
      <div className="w-full shrink-0 border-t border-white/10 bg-black/95 px-2 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          {/* Left: Music + Auto indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="p-1.5 sm:p-2 rounded-full transition-all backdrop-blur-sm border hover:scale-110"
              style={{
                background: isMuted ? 'rgba(0, 229, 229, 0.25)' : 'rgba(0, 0, 0, 0.8)',
                borderColor: isMuted ? 'rgba(0, 229, 229, 0.6)' : 'rgba(255, 255, 255, 0.4)',
                color: isMuted ? '#00E5E5' : '#fff',
                boxShadow: isMuted ? '0 0 10px rgba(0, 229, 229, 0.3)' : 'none'
              }}
              aria-label={isMuted ? "Unmute music" : "Mute music"}
            >
              {isMuted ? <VolumeX size={14} className="sm:w-4 sm:h-4" /> : <Volume2 size={14} className="sm:w-4 sm:h-4" />}
            </button>
            <div className="hidden sm:flex items-center gap-1.5">
              <div
                className={
                  "w-1.5 h-1.5 rounded-full transition-colors " +
                  (isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse")
                }
              />
              <span className="text-white/50 text-[10px] font-mono">
                {isPaused ? "PAUSED" : "AUTO"}
              </span>
            </div>
          </div>

          {/* Center: Dot indicators - smaller on mobile */}
          <div className="flex-1 flex justify-center overflow-x-auto scrollbar-hide">
            <div className="flex gap-0.5 sm:gap-1.5 items-center">
              {pitchSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); goTo(index); }}
                  className={
                    "h-1 sm:h-2 rounded-full transition-all duration-300 flex-shrink-0 " +
                    (index === current ? "w-3 sm:w-6" : "w-1 sm:w-2")
                  }
                  style={{
                    background: index === current ? '#00E5E5' : 'rgba(255, 255, 255, 0.3)',
                    boxShadow: index === current ? '0 0 8px rgba(0, 229, 229, 0.6)' : 'none'
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Mobile nav + Counter + Fullscreen */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="md:hidden p-1 sm:p-1.5 rounded-full bg-black/80 text-white transition-all backdrop-blur-sm border border-white/30"
              aria-label="Previous slide"
            >
              <ChevronLeft size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>

            <span className="text-white/60 text-[10px] sm:text-xs font-mono tracking-wider whitespace-nowrap">
              {current + 1}/{totalSlides}
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="md:hidden p-1 sm:p-1.5 rounded-full bg-black/80 text-white transition-all backdrop-blur-sm border border-white/30"
              aria-label="Next slide"
            >
              <ChevronRight size={12} className="sm:w-3.5 sm:h-3.5" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen((v) => !v);
              }}
              className="p-1 sm:p-1.5 rounded-full bg-black/80 text-white transition-all hover:scale-105 backdrop-blur-sm border border-white/30"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={12} className="sm:w-3.5 sm:h-3.5" /> : <Maximize2 size={12} className="sm:w-3.5 sm:h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Desktop hover only (never overlays mobile) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/80 text-white transition-all hover:scale-105 backdrop-blur-sm border border-white/30 z-10 opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/80 text-white transition-all hover:scale-105 backdrop-blur-sm border border-white/30 z-10 opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Music Prompt - Only on desktop, positioned safely */}
      {showMusicPrompt && !hasUserInteracted && (
        <button
          onClick={(e) => { e.stopPropagation(); startAudio(); }}
          className="hidden md:flex absolute top-3 left-1/2 -translate-x-1/2 z-30 items-center gap-2 px-3 py-1.5 font-bold rounded-full shadow-lg animate-pulse transition-all text-xs"
          style={{
            background: '#00E5E5',
            color: '#000'
          }}
        >
          <Music size={14} />
          <span>Tap for Music</span>
        </button>
      )}
    </div>
  );
};

export default HtmlPitchDeckCarousel;
