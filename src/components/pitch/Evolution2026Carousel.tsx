import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
} from "lucide-react";
import Evolution2026Slide from "./Evolution2026Slide";
import { evolution2026Slides } from "./Evolution2026SlideData";

interface Evolution2026CarouselProps {
  autoAdvanceMs?: number;
  openFullscreenRequest?: number;
}

const Evolution2026Carousel: React.FC<Evolution2026CarouselProps> = ({
  autoAdvanceMs = 12000,
  openFullscreenRequest,
}) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const rootRef = useRef<HTMLDivElement | null>(null);

  const totalSlides = evolution2026Slides.length;

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % totalSlides);
  }, [totalSlides]);

  // Auto-advance
  useEffect(() => {
    if (isPaused || autoAdvanceMs <= 0) return;
    const timer = setInterval(next, autoAdvanceMs);
    return () => clearInterval(timer);
  }, [isPaused, next, autoAdvanceMs]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape" && isFullscreen) toggleFullscreen();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, isFullscreen]);

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!rootRef.current) return;
    if (!document.fullscreenElement) {
      rootRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(console.error);
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(console.error);
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // External fullscreen request
  useEffect(() => {
    if (openFullscreenRequest && openFullscreenRequest > 0 && !isFullscreen) {
      toggleFullscreen();
    }
  }, [openFullscreenRequest, isFullscreen, toggleFullscreen]);

  return (
    <div
      ref={rootRef}
      className="relative w-full bg-black select-none overflow-visible"
      style={{ 
        aspectRatio: "16/9",
        WebkitOverflowScrolling: 'touch'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div className="absolute inset-0 overflow-hidden">
        {evolution2026Slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: idx === current ? 1 : 0,
              pointerEvents: idx === current ? "auto" : "none",
            }}
          >
            <Evolution2026Slide slide={slide} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      {/* Fullscreen Toggle */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-20"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        ) : (
          <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        )}
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20">
        {evolution2026Slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
              idx === current
                ? "bg-cyan-400 scale-125"
                : "bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Deck Title Watermark */}
      <div 
        className="absolute top-2 left-3 sm:top-4 sm:left-4 z-20"
        style={{
          fontSize: 'clamp(8px, 1.2vw, 12px)',
          color: 'rgba(255, 255, 255, 0.4)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}
      >
        2026 EVOLUTION
      </div>
    </div>
  );
};

export default Evolution2026Carousel;
