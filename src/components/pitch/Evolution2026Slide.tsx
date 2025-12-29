import { EvolutionSlideData } from './Evolution2026SlideData';

interface Evolution2026SlideProps {
  slide: EvolutionSlideData;
}

const Evolution2026Slide: React.FC<Evolution2026SlideProps> = ({ slide }) => {
  // Chrome gradient style for metallic elements
  const chromeGradient = 'linear-gradient(180deg, #A0A0A0 0%, #D0D0D0 40%, #F0F0F0 70%, #FFFFFF 100%)';
  
  const renderCoverSlide = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-8">
      <h1 
        className="font-bold mb-3 sm:mb-6"
        style={{ 
          fontSize: 'clamp(40px, 12vw, 120px)',
          background: chromeGradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'brightness(1.15) contrast(1.2)',
          textShadow: '0 0 40px rgba(255, 255, 255, 0.3)'
        }}
      >
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p 
          className="max-w-4xl mb-4"
          style={{ 
            fontSize: 'clamp(14px, 3vw, 32px)',
            color: '#00E5E5',
            textShadow: '0 0 15px rgba(0, 229, 229, 0.4)'
          }}
        >
          {slide.subtitle}
        </p>
      )}
      {slide.highlight && (
        <div 
          className="mt-4 px-6 py-3 rounded-full"
          style={{
            background: 'rgba(0, 229, 229, 0.1)',
            border: '1px solid rgba(0, 229, 229, 0.3)',
            color: '#00E5E5',
            fontSize: 'clamp(12px, 2vw, 20px)',
            fontWeight: '500'
          }}
        >
          {slide.highlight}
        </div>
      )}
    </div>
  );

  const renderTitleContentSlide = () => (
    <div className="flex flex-col items-center h-full text-center px-3 sm:px-6 py-6 sm:py-12 justify-center">
      <h2 
        className="font-bold mb-4 sm:mb-8"
        style={{ 
          fontSize: 'clamp(24px, 7vw, 80px)',
          color: '#00E5E5',
          textShadow: '0 0 25px rgba(0, 229, 229, 0.5)'
        }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p 
          className="mb-4 sm:mb-8"
          style={{ 
            fontSize: 'clamp(14px, 3.5vw, 40px)',
            background: chromeGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'brightness(1.15) contrast(1.2)'
          }}
        >
          {slide.subtitle}
        </p>
      )}
      {slide.content && (
        <div className="space-y-2 sm:space-y-4 max-w-4xl">
          {slide.content.map((text, i) => (
            <p 
              key={i}
              className="text-white"
              style={{ 
                fontSize: 'clamp(12px, 2.5vw, 28px)',
                lineHeight: '1.4'
              }}
            >
              {text}
            </p>
          ))}
        </div>
      )}
    </div>
  );

  const renderStatsSlide = () => (
    <div className="flex flex-col items-center h-full text-center px-3 sm:px-6 py-4 sm:py-12 justify-center">
      <h2 
        className="font-bold mb-3 sm:mb-6"
        style={{ 
          fontSize: 'clamp(22px, 6vw, 70px)',
          color: '#00E5E5',
          textShadow: '0 0 25px rgba(0, 229, 229, 0.5)'
        }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p 
          className="mb-4 sm:mb-8"
          style={{ 
            fontSize: 'clamp(12px, 2.5vw, 28px)',
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          {slide.subtitle}
        </p>
      )}
      {slide.stats && (
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 md:gap-8 mb-4 sm:mb-8">
          {slide.stats.map((stat, i) => (
            <div 
              key={i}
              className="text-center px-3 sm:px-5 py-2 sm:py-4"
              style={{
                background: 'rgba(0, 229, 229, 0.05)',
                border: '1px solid rgba(0, 229, 229, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 0 30px rgba(0, 229, 229, 0.1)',
                minWidth: 'clamp(80px, 18vw, 140px)'
              }}
            >
              <div 
                className="font-bold"
                style={{ 
                  fontSize: 'clamp(16px, 4vw, 44px)',
                  background: chromeGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'brightness(1.15) contrast(1.2)'
                }}
              >
                {stat.value}
              </div>
              <div 
                style={{ 
                  fontSize: 'clamp(9px, 1.8vw, 16px)',
                  color: '#00E5E5',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
      {slide.bullets && (
        <ul className="space-y-1 sm:space-y-2 max-w-4xl text-left">
          {slide.bullets.map((bullet, i) => (
            <li 
              key={i}
              className="flex items-start gap-2 sm:gap-3"
            >
              <span 
                className="mt-1.5 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
                style={{
                  background: '#00E5E5',
                  boxShadow: '0 0 10px rgba(0, 229, 229, 0.5)'
                }}
              />
              <span 
                className="text-white/80"
                style={{ fontSize: 'clamp(11px, 2vw, 20px)' }}
              >
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      )}
      {slide.highlight && (
        <div 
          className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 sm:py-3 rounded-full"
          style={{
            background: 'rgba(0, 229, 229, 0.15)',
            border: '1px solid rgba(0, 229, 229, 0.4)',
            color: '#00E5E5',
            fontSize: 'clamp(10px, 1.8vw, 20px)',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 229, 229, 0.5)'
          }}
        >
          {slide.highlight}
        </div>
      )}
    </div>
  );

  const renderBulletsSlide = () => (
    <div className="flex flex-col items-center h-full text-center px-3 sm:px-6 py-4 sm:py-12 justify-center">
      <h2 
        className="font-bold mb-2 sm:mb-4"
        style={{ 
          fontSize: 'clamp(22px, 6vw, 70px)',
          color: '#00E5E5',
          textShadow: '0 0 25px rgba(0, 229, 229, 0.5)'
        }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p 
          className="mb-4 sm:mb-8"
          style={{ 
            fontSize: 'clamp(12px, 2.8vw, 32px)',
            background: chromeGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'brightness(1.15) contrast(1.2)'
          }}
        >
          {slide.subtitle}
        </p>
      )}
      {slide.bullets && (
        <ul className="space-y-2 sm:space-y-4 max-w-4xl text-left">
          {slide.bullets.map((bullet, i) => (
            <li 
              key={i}
              className="flex items-start gap-2 sm:gap-4"
            >
              <span 
                className="mt-1.5 w-2 h-2 sm:mt-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                style={{
                  background: '#00E5E5',
                  boxShadow: '0 0 12px rgba(0, 229, 229, 0.6)'
                }}
              />
              <span 
                className="text-white"
                style={{ 
                  fontSize: 'clamp(12px, 2.5vw, 26px)',
                  lineHeight: '1.4'
                }}
              >
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      )}
      {slide.highlight && (
        <div 
          className="mt-4 sm:mt-8 px-4 sm:px-8 py-2 sm:py-3 rounded-full"
          style={{
            background: 'rgba(0, 229, 229, 0.15)',
            border: '1px solid rgba(0, 229, 229, 0.4)',
            color: '#00E5E5',
            fontSize: 'clamp(11px, 2vw, 22px)',
            fontWeight: 'bold',
            textShadow: '0 0 10px rgba(0, 229, 229, 0.5)'
          }}
        >
          {slide.highlight}
        </div>
      )}
    </div>
  );

  const renderComparisonSlide = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-8 py-4 sm:py-12">
      <h2 
        className="font-bold mb-2 sm:mb-4"
        style={{ 
          fontSize: 'clamp(22px, 7vw, 80px)',
          color: '#00E5E5',
          textShadow: '0 0 25px rgba(0, 229, 229, 0.5)'
        }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p 
          className="mb-4 sm:mb-8"
          style={{ 
            fontSize: 'clamp(12px, 3vw, 32px)',
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          {slide.subtitle}
        </p>
      )}
      {slide.content && (
        <div className="space-y-2 sm:space-y-3 max-w-4xl text-left mb-4 sm:mb-8">
          {slide.content.map((text, i) => (
            <p 
              key={i}
              className="text-white/60"
              style={{ fontSize: 'clamp(11px, 2.2vw, 26px)', lineHeight: '1.4' }}
            >
              {text}
            </p>
          ))}
        </div>
      )}
      {slide.highlight && (
        <div 
          className="px-4 sm:px-8 py-2 sm:py-4 rounded-xl"
          style={{
            background: 'rgba(0, 229, 229, 0.1)',
            border: '2px solid rgba(0, 229, 229, 0.4)',
            boxShadow: '0 0 40px rgba(0, 229, 229, 0.2)'
          }}
        >
          <span 
            className="font-bold"
            style={{ 
              fontSize: 'clamp(14px, 3.5vw, 44px)',
              background: chromeGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'brightness(1.15) contrast(1.2)'
            }}
          >
            {slide.highlight}
          </span>
        </div>
      )}
    </div>
  );

  const renderCtaSlide = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 py-4 sm:py-6">
      <h2 
        className="font-bold mb-2 sm:mb-4"
        style={{ 
          fontSize: 'clamp(24px, 6vw, 72px)',
          background: chromeGradient,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'brightness(1.15) contrast(1.2)',
          textShadow: '0 0 40px rgba(255, 255, 255, 0.3)'
        }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p 
          className="mb-3 sm:mb-6 max-w-3xl"
          style={{ 
            fontSize: 'clamp(12px, 2.5vw, 28px)',
            color: '#00E5E5',
            textShadow: '0 0 15px rgba(0, 229, 229, 0.4)'
          }}
        >
          {slide.subtitle}
        </p>
      )}
      {slide.content && (
        <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
          {slide.content.map((text, i) => (
            <p 
              key={i}
              className="text-white"
              style={{ fontSize: 'clamp(11px, 2vw, 24px)', lineHeight: '1.3' }}
            >
              {text}
            </p>
          ))}
        </div>
      )}
      {slide.highlight && (
        <button 
          className="mt-4 px-4 sm:px-8 py-2 sm:py-4 rounded-full font-bold transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #00E5E5, #0066FF)',
            color: '#000',
            fontSize: 'clamp(12px, 2vw, 24px)',
            boxShadow: '0 0 40px rgba(0, 229, 229, 0.5)'
          }}
          onClick={() => window.open('https://calendly.com/steve-bevalid/30min', '_blank')}
        >
          {slide.highlight}
        </button>
      )}
    </div>
  );

  const renderSlideContent = () => {
    switch (slide.layout) {
      case 'cover':
        return renderCoverSlide();
      case 'title-content':
        return renderTitleContentSlide();
      case 'stats':
        return renderStatsSlide();
      case 'bullets':
        return renderBulletsSlide();
      case 'comparison':
        return renderComparisonSlide();
      case 'cta':
        return renderCtaSlide();
      default:
        return renderTitleContentSlide();
    }
  };

  // Determine chrome position based on slide ID for variety
  const getChromePosition = () => {
    const positions = [
      { top: '-10%', left: '-10%', rotate: '0deg' },
      { bottom: '-10%', right: '-10%', rotate: '180deg' },
      { top: '-10%', right: '-10%', rotate: '90deg' },
      { bottom: '-10%', left: '-10%', rotate: '270deg' },
    ];
    const groupIndex = Math.floor((slide.id - 1) / 3) % 4;
    return positions[groupIndex];
  };

  const chromePos = getChromePosition();

  return (
    <div 
      className="w-full h-full relative overflow-hidden"
      style={{ 
        background: '#000000',
        fontFamily: 'Exo, sans-serif'
      }}
    >
      {/* Chrome/Silver Swirl Backdrop - Primary */}
      <div 
        className="absolute pointer-events-none"
        style={{
          width: '60%',
          height: '60%',
          ...chromePos,
          background: `
            radial-gradient(ellipse at 30% 30%, 
              rgba(240, 240, 240, 0.4) 0%, 
              rgba(200, 200, 200, 0.3) 20%, 
              rgba(160, 160, 160, 0.2) 40%, 
              rgba(120, 120, 120, 0.1) 60%, 
              transparent 80%
            )
          `,
          filter: 'blur(40px) brightness(1.2)',
          transform: `rotate(${chromePos.rotate})`,
          mixBlendMode: 'screen',
          opacity: 0.35,
        }}
      />

      {/* Chrome/Silver Swirl Backdrop - Secondary */}
      <div 
        className="absolute pointer-events-none"
        style={{
          width: '45%',
          height: '45%',
          ...(chromePos.top ? { bottom: '-5%' } : { top: '-5%' }),
          ...(chromePos.left ? { right: '-5%' } : { left: '-5%' }),
          background: `
            radial-gradient(ellipse at 60% 60%, 
              rgba(255, 255, 255, 0.3) 0%, 
              rgba(220, 220, 220, 0.25) 15%, 
              rgba(180, 180, 180, 0.15) 35%, 
              rgba(140, 140, 140, 0.08) 55%, 
              transparent 75%
            )
          `,
          filter: 'blur(35px) brightness(1.15)',
          transform: `rotate(${parseInt(chromePos.rotate) + 45}deg)`,
          mixBlendMode: 'screen',
          opacity: 0.25,
        }}
      />

      {/* Liquid Chrome Wave Effect */}
      <div 
        className="absolute pointer-events-none"
        style={{
          width: '80%',
          height: '30%',
          left: '10%',
          top: slide.id % 2 === 0 ? '60%' : '10%',
          background: `
            linear-gradient(
              ${90 + (slide.id * 15)}deg,
              transparent 0%,
              rgba(192, 192, 192, 0.08) 20%,
              rgba(224, 224, 224, 0.15) 40%,
              rgba(255, 255, 255, 0.2) 50%,
              rgba(224, 224, 224, 0.15) 60%,
              rgba(192, 192, 192, 0.08) 80%,
              transparent 100%
            )
          `,
          filter: 'blur(25px)',
          mixBlendMode: 'screen',
          opacity: 0.4,
        }}
      />

      {/* Slide Number */}
      <div 
        className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6"
        style={{
          fontSize: 'clamp(10px, 1.5vw, 14px)',
          color: 'rgba(255, 255, 255, 0.3)',
          fontFamily: 'monospace'
        }}
      >
        {String(slide.id).padStart(2, '0')} / 10
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        {renderSlideContent()}
      </div>
    </div>
  );
};

export default Evolution2026Slide;
