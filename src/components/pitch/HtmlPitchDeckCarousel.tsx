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
  const [showMobileControls, setShowMobileControls] = useState(true);

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

  // Auto-hide mobile controls after 4 seconds of inactivity
  useEffect(() => {
    if (!showMobileControls) return;
    const timer = setTimeout(() => {
      setShowMobileControls(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [showMobileControls, current]);

  // Show controls on tap (mobile)
  const handleTap = () => {
    setShowMobileControls(true);
  };

  return (
    <div
      ref={rootRef}
      className={
        "relative bg-black flex flex-col group touch-pan-y " +
        (isFullscreen
          ? "fixed inset-0 z-50"
          : "w-full h-[55vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] rounded-xl md:rounded-2xl overflow-hidden border border-white/10")
      }
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleTap}
      aria-label="Investor deck slides"
    >
      {/* Music Prompt Banner - positioned safely */}
      {showMusicPrompt && !hasUserInteracted && (
        <button
          onClick={(e) => { e.stopPropagation(); startAudio(); }}
          className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3 py-1.5 font-bold rounded-full shadow-lg animate-pulse transition-all text-xs"
          style={{
            background: '#00E5E5',
            color: '#000'
          }}
        >
          <Music size={14} />
          <span>Tap for Music</span>
        </button>
      )}

      {/* Main Slide Content - Horizontal sliding carousel */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden">
        <div 
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ 
            width: `${totalSlides * 100}%`,
            transform: `translateX(-${(current * 100) / totalSlides}%)`
          }}
        >
          {pitchSlides.map((slide, index) => (
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

      {/* Controls Bar - Bottom (auto-hides on mobile after tap) */}
      <div 
        className={`w-full shrink-0 border-t border-white/10 bg-black/90 backdrop-blur-sm px-2 md:px-4 py-2 md:py-3 transition-all duration-300 ${
          showMobileControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 md:translate-y-0 md:opacity-100'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Auto indicator - left (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div
              className={
                "w-2 h-2 rounded-full transition-colors " +
                (isPaused ? "bg-amber-400" : "bg-emerald-400 animate-pulse")
              }
            />
            <span className="text-white/50 text-xs font-mono">
              {isPaused ? "PAUSED" : "AUTO"}
            </span>
          </div>

          {/* Slide counter - mobile only (left side) */}
          <div className="md:hidden text-white/70 text-sm font-mono tracking-wider whitespace-nowrap shrink-0">
            {current + 1}/{totalSlides}
          </div>

          {/* Dot indicators - center (simplified on mobile) */}
          <div className="flex-1 flex justify-center overflow-hidden">
            <div className="hidden md:flex gap-1.5 flex-wrap justify-center max-w-[80%]">
              {pitchSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); goTo(index); }}
                  className={
                    "h-2 rounded-full transition-all duration-300 " +
                    (index === current ? "w-6" : "w-2")
                  }
                  style={{
                    background: index === current ? '#00E5E5' : 'rgba(255, 255, 255, 0.3)',
                    boxShadow: index === current ? '0 0 8px rgba(0, 229, 229, 0.6)' : 'none'
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            {/* Mobile: simple progress bar instead of dots */}
            <div className="md:hidden w-full max-w-[200px] h-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-300"
                style={{ 
                  width: `${((current + 1) / totalSlides) * 100}%`,
                  background: '#00E5E5',
                  boxShadow: '0 0 8px rgba(0, 229, 229, 0.6)'
                }}
              />
            </div>
          </div>

          {/* Slide counter - desktop only (right side) */}
          <div className="hidden md:block text-white/50 text-xs font-mono tracking-wider whitespace-nowrap shrink-0">
            {current + 1}/{totalSlides}
          </div>
        </div>
      </div>

      {/* Left Arrow - auto-hides on mobile */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className={`absolute left-1 md:left-3 top-1/2 -translate-y-1/2 p-2 md:p-2.5 rounded-full bg-black/80 text-white transition-all hover:scale-105 backdrop-blur-sm border border-white/30 z-10 ${
          showMobileControls ? 'opacity-90' : 'opacity-0 md:opacity-0'
        } md:group-hover:opacity-100`}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="md:w-5 md:h-5" />
      </button>

      {/* Right Arrow - auto-hides on mobile */}
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className={`absolute right-1 md:right-3 top-1/2 -translate-y-1/2 p-2 md:p-2.5 rounded-full bg-black/80 text-white transition-all hover:scale-105 backdrop-blur-sm border border-white/30 z-10 ${
          showMobileControls ? 'opacity-90' : 'opacity-0 md:opacity-0'
        } md:group-hover:opacity-100`}
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="md:w-5 md:h-5" />
      </button>

      {/* Top Controls - auto-hides on mobile */}
      <div className={`absolute top-2 md:top-3 right-2 md:right-3 flex items-center gap-1.5 md:gap-2 z-10 transition-opacity duration-300 ${
        showMobileControls ? 'opacity-100' : 'opacity-0 md:opacity-100'
      }`}>
        {/* Mute Toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="p-1.5 md:p-2 rounded-full transition-all hover:scale-105 backdrop-blur-sm border"
          style={{
            background: isMuted ? 'rgba(0, 229, 229, 0.2)' : 'rgba(0, 0, 0, 0.8)',
            borderColor: isMuted ? 'rgba(0, 229, 229, 0.5)' : 'rgba(255, 255, 255, 0.3)',
            color: isMuted ? '#00E5E5' : '#fff'
          }}
          aria-label={isMuted ? "Unmute music" : "Mute music"}
        >
          {isMuted ? <VolumeX size={16} className="md:w-[18px] md:h-[18px]" /> : <Volume2 size={16} className="md:w-[18px] md:h-[18px]" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={(e) => { e.stopPropagation(); setIsFullscreen((v) => !v); }}
          className="p-1.5 md:p-2 rounded-full bg-black/80 text-white transition-all hover:scale-105 backdrop-blur-sm border border-white/30"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={16} className="md:w-[18px] md:h-[18px]" /> : <Maximize2 size={16} className="md:w-[18px] md:h-[18px]" />}
        </button>
      </div>
    </div>
  );
};

export default HtmlPitchDeckCarousel;
