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
  const [touchStart, setTouchStart] = useState(0);
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
          : 'w-full h-[50vh] sm:h-[60vh] md:h-[80vh] rounded-xl md:rounded-2xl overflow-hidden border border-white/10'}
      `}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main Image Container */}
      <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4 md:p-8">
        <img
          src={images[current]}
          alt={`Pitch slide ${current + 1}`}
          className="max-w-full max-h-full object-contain transition-opacity duration-700 ease-in-out"
        />
      </div>

      {/* Left Arrow - always visible on mobile */}
      <button
        onClick={prev}
        className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/60 md:bg-white/10 hover:bg-cyan-500/30 text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 backdrop-blur-sm border border-white/20 z-10"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="md:w-6 md:h-6" />
      </button>

      {/* Right Arrow - always visible on mobile */}
      <button
        onClick={next}
        className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 rounded-full bg-black/60 md:bg-white/10 hover:bg-cyan-500/30 text-white transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 backdrop-blur-sm border border-white/20 z-10"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="md:w-6 md:h-6" />
      </button>

      {/* Top Controls Container - properly positioned on mobile */}
      <div className="absolute top-2 md:top-4 right-2 md:right-4 flex items-center gap-2 z-10">
        {/* Mute Toggle */}
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/60 md:bg-white/10 hover:bg-cyan-500/30 text-white transition-all hover:scale-110 backdrop-blur-sm border border-white/20"
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
        >
          {isMuted ? <VolumeX size={18} className="md:w-5 md:h-5" /> : <Volume2 size={18} className="md:w-5 md:h-5" />}
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded-full bg-black/60 md:bg-white/10 hover:bg-cyan-500/30 text-white transition-all hover:scale-110 backdrop-blur-sm border border-white/20"
          aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {isFullscreen ? <Minimize2 size={18} className="md:w-5 md:h-5" /> : <Maximize2 size={18} className="md:w-5 md:h-5" />}
        </button>
      </div>

      {/* Bottom Controls - dots and counter */}
      <div className="absolute bottom-2 md:bottom-6 left-0 right-0 px-2 md:px-4 flex items-center justify-between z-10">
        {/* Auto-play indicator */}
        <div className="flex items-center gap-1 md:gap-2 bg-black/40 md:bg-transparent px-2 py-1 rounded-full">
          <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${isPaused ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`} />
          <span className="text-white/60 text-[10px] md:text-xs font-mono">
            {isPaused ? 'PAUSED' : 'AUTO'}
          </span>
        </div>

        {/* Dot Indicators */}
        <div className="flex gap-1 md:gap-2 flex-wrap justify-center max-w-[50%] md:max-w-[60%]">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goTo(index)}
              className={`
                h-1.5 md:h-2 rounded-full transition-all duration-300
                ${index === current 
                  ? 'bg-cyan-400 w-4 md:w-6 shadow-[0_0_10px_rgba(0,240,255,0.5)]' 
                  : 'bg-white/30 hover:bg-white/50 w-1.5 md:w-2'}
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-white/60 text-[10px] md:text-sm font-mono tracking-wider bg-black/40 md:bg-transparent px-2 py-1 rounded-full">
          {current + 1}/{images.length}
        </div>
      </div>
    </div>
  );
};

export default PitchCarousel;
