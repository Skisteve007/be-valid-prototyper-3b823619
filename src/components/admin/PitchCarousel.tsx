import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface PitchCarouselProps {
  images: string[];
  autoAdvanceMs?: number;
}

const PitchCarousel: React.FC<PitchCarouselProps> = ({ 
  images, 
  autoAdvanceMs = 8000 
}) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState(0);

  // Auto-advance
  useEffect(() => {
    if (isPaused || images.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, autoAdvanceMs);

    return () => clearInterval(timer);
  }, [isPaused, images.length, autoAdvanceMs]);

  const goTo = useCallback((index: number) => setCurrent(index), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  // Handle swipe
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart - touchEnd > 50) next();
    if (touchEnd - touchStart > 50) prev();
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next, isFullscreen]);

  if (images.length === 0) {
    return (
      <div className="w-full h-[60vh] bg-black rounded-2xl flex items-center justify-center">
        <p className="text-white/50">No pitch deck images available</p>
      </div>
    );
  }

  return (
    <div 
      className={`
        relative bg-black flex items-center justify-center group
        ${isFullscreen 
          ? 'fixed inset-0 z-50' 
          : 'w-full h-[70vh] md:h-[80vh] rounded-2xl overflow-hidden border border-white/10'}
      `}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Image Container */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
        <img
          src={images[current]}
          alt={`Pitch slide ${current + 1}`}
          className="max-w-full max-h-full object-contain transition-opacity duration-700 ease-in-out"
        />
      </div>

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/10 hover:bg-cyan-500/30 text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110 backdrop-blur-sm border border-white/10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-white/10 hover:bg-cyan-500/30 text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-110 backdrop-blur-sm border border-white/10"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Fullscreen Toggle */}
      <button
        onClick={() => setIsFullscreen(!isFullscreen)}
        className="absolute top-3 md:top-4 right-3 md:right-4 p-2 rounded-full bg-white/10 hover:bg-cyan-500/30 text-white transition-all hover:scale-110 backdrop-blur-sm border border-white/10"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 flex-wrap justify-center max-w-[90%]">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`
              h-2 rounded-full transition-all duration-300
              ${index === current 
                ? 'bg-cyan-400 w-6 shadow-[0_0_10px_rgba(0,240,255,0.5)]' 
                : 'bg-white/30 hover:bg-white/50 w-2'}
            `}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 text-white/50 text-sm font-mono tracking-wider">
        {current + 1} / {images.length}
      </div>

      {/* Auto-play indicator */}
      <div className="absolute top-3 md:top-4 left-3 md:left-4 flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full transition-colors ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
        <span className="text-white/40 text-xs font-mono hidden md:inline">
          {isPaused ? 'PAUSED' : 'AUTO'}
        </span>
      </div>
    </div>
  );
};

export default PitchCarousel;
