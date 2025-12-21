import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';

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
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/audio/pitch-deck-music.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle mute toggle
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

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
        relative bg-black flex flex-col group select-none
        ${isFullscreen 
          ? 'fixed inset-0 z-50' 
          : 'w-full h-auto min-h-[50vh] sm:min-h-[60vh] md:min-h-[75vh] rounded-xl md:rounded-2xl overflow-hidden border border-white/10'}
      `}
      style={{ touchAction: isSwiping ? 'none' : 'pan-y' }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Image Container - No overlays on mobile */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-2 sm:p-4 md:p-8">
        <img
          src={images[current]}
          alt={`Pitch slide ${current + 1}`}
          className="max-w-full max-h-full object-contain transition-opacity duration-700 ease-in-out"
          style={{ aspectRatio: '16/9' }}
        />
      </div>

      {/* Controls Footer - OUTSIDE slide area */}
      <div className="w-full shrink-0 border-t border-white/10 bg-black/95 px-3 md:px-4 py-2.5 md:py-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Music + Auto indicator */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleMute}
              className="p-1.5 rounded-full bg-black/60 hover:bg-cyan-500/30 text-white transition-all backdrop-blur-sm border border-white/20"
              aria-label={isMuted ? 'Unmute music' : 'Mute music'}
            >
              {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <div className="hidden sm:flex items-center gap-1.5">
              <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
              <span className="text-white/60 text-[10px] font-mono">
                {isPaused ? 'PAUSED' : 'AUTO'}
              </span>
            </div>
          </div>

          {/* Center: Dot Indicators */}
          <div className="flex-1 flex justify-center overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 sm:gap-1.5 items-center">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`
                    h-1.5 sm:h-2 rounded-full transition-all duration-300 flex-shrink-0
                    ${index === current 
                      ? 'bg-cyan-400 w-4 sm:w-6 shadow-[0_0_10px_rgba(0,240,255,0.5)]' 
                      : 'bg-white/30 hover:bg-white/50 w-1.5 sm:w-2'}
                  `}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right: Counter + Fullscreen */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-white/60 text-xs font-mono tracking-wider whitespace-nowrap">
              {current + 1}/{images.length}
            </span>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-full bg-black/60 hover:bg-cyan-500/30 text-white transition-all backdrop-blur-sm border border-white/20"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows - Desktop hover only */}
      <button
        onClick={prev}
        className="absolute left-1 md:left-4 top-[calc(50%-2rem)] -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/60 hover:bg-cyan-500/30 text-white transition-all opacity-0 md:group-hover:opacity-100 hover:scale-110 backdrop-blur-sm border border-white/20 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} className="md:w-6 md:h-6" />
      </button>

      <button
        onClick={next}
        className="absolute right-1 md:right-4 top-[calc(50%-2rem)] -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/60 hover:bg-cyan-500/30 text-white transition-all opacity-0 md:group-hover:opacity-100 hover:scale-110 backdrop-blur-sm border border-white/20 z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={18} className="md:w-6 md:h-6" />
      </button>
    </div>
  );
};

export default PitchCarousel;
