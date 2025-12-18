import { SlideData } from './PitchSlideData';

interface PitchSlideProps {
  slide: SlideData;
}

const PitchSlide: React.FC<PitchSlideProps> = ({ slide }) => {
  // Chrome gradient style for metallic elements
  const chromeGradient = 'linear-gradient(180deg, #A0A0A0 0%, #D0D0D0 40%, #F0F0F0 70%, #FFFFFF 100%)';
  
  const renderCoverSlide = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      {slide.highlight && (
        <span 
          className="uppercase tracking-[0.3em] mb-8"
          style={{ 
            fontSize: 'clamp(14px, 2vw, 20px)',
            color: '#00E5E5',
            textShadow: '0 0 20px rgba(0, 229, 229, 0.5)'
          }}
        >
          {slide.highlight}
        </span>
      )}
      <h1 
        className="font-bold mb-6"
        style={{ 
          fontSize: 'clamp(60px, 10vw, 100px)',
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
          className="max-w-3xl"
          style={{ 
            fontSize: 'clamp(22px, 3vw, 36px)',
            color: '#00E5E5',
            textShadow: '0 0 15px rgba(0, 229, 229, 0.4)'
          }}
        >
          {slide.subtitle}
        </p>
      )}
    </div>
  );

  const renderTitleContentSlide = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
      <h2 
        className="font-bold mb-8"
        style={{ 
          fontSize: 'clamp(48px, 7vw, 80px)',
          color: '#00E5E5',
          textShadow: '0 0 25px rgba(0, 229, 229, 0.5)'
        }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p 
          className="mb-8"
          style={{ 
            fontSize: 'clamp(24px, 3.5vw, 40px)',
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
        <div className="space-y-4 max-w-4xl">
          {slide.content.map((text, i) => (
            <p 
              key={i}
              className="text-white"
              style={{ 
                fontSize: 'clamp(18px, 2.5vw, 28px)',
                lineHeight: '1.5'
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
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
      <h2 
        className="font-bold mb-8"
        style={{ 
          fontSize: 'clamp(48px, 7vw, 80px)',
          color: '#00E5E5',
          textShadow: '0 0 25px rgba(0, 229, 229, 0.5)'
        }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p 
          className="mb-10"
          style={{ 
            fontSize: 'clamp(20px, 3vw, 32px)',
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          {slide.subtitle}
        </p>
      )}
      {slide.stats && (
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-8">
          {slide.stats.map((stat, i) => (
            <div 
              key={i}
              className="text-center px-6 py-4"
              style={{
                background: 'rgba(0, 229, 229, 0.05)',
                border: '1px solid rgba(0, 229, 229, 0.2)',
                borderRadius: '16px',
                boxShadow: '0 0 30px rgba(0, 229, 229, 0.1)'
              }}
            >
              <div 
                className="font-bold"
                style={{ 
                  fontSize: 'clamp(32px, 5vw, 56px)',
                  background: chromeGradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'brightness(1.15) contrast(1.2)',
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                }}
              >
                {stat.value}
              </div>
              <div 
                style={{ 
                  fontSize: 'clamp(14px, 2vw, 22px)',
                  color: '#00E5E5',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
      {slide.content && (
        <div className="space-y-2 max-w-3xl">
          {slide.content.map((text, i) => (
            <p 
              key={i}
              className="text-white/70"
              style={{ fontSize: 'clamp(16px, 2vw, 24px)' }}
            >
              {text}
            </p>
          ))}
        </div>
      )}
      {slide.highlight && (
        <div 
          className="mt-8 px-8 py-3 rounded-full"
          style={{
            background: 'rgba(0, 229, 229, 0.15)',
            border: '1px solid rgba(0, 229, 229, 0.4)',
            color: '#00E5E5',
            fontSize: 'clamp(16px, 2vw, 24px)',
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
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
      <h2 
        className="font-bold mb-6"
        style={{ 
          fontSize: 'clamp(48px, 7vw, 80px)',
          color: '#00E5E5',
          textShadow: '0 0 25px rgba(0, 229, 229, 0.5)'
        }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p 
          className="mb-10"
          style={{ 
            fontSize: 'clamp(22px, 3vw, 36px)',
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
        <ul className="space-y-4 max-w-4xl text-left">
          {slide.bullets.map((bullet, i) => (
            <li 
              key={i}
              className="flex items-start gap-4"
            >
              <span 
                className="mt-2 w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  background: '#00E5E5',
                  boxShadow: '0 0 12px rgba(0, 229, 229, 0.6)'
                }}
              />
              <span 
                className="text-white"
                style={{ 
                  fontSize: 'clamp(18px, 2.5vw, 28px)',
                  lineHeight: '1.4'
                }}
              >
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderComparisonSlide = () => (
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
      <h2 
        className="font-bold mb-4"
        style={{ 
          fontSize: 'clamp(48px, 7vw, 80px)',
          color: '#00E5E5',
          textShadow: '0 0 25px rgba(0, 229, 229, 0.5)'
        }}
      >
        {slide.title}
      </h2>
      {slide.subtitle && (
        <p 
          className="mb-8"
          style={{ 
            fontSize: 'clamp(20px, 3vw, 32px)',
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          {slide.subtitle}
        </p>
      )}
      {slide.content && (
        <div className="space-y-3 max-w-4xl text-left mb-8">
          {slide.content.map((text, i) => (
            <p 
              key={i}
              className={i === slide.content!.length - 1 ? '' : 'text-white/60'}
              style={{ 
                fontSize: 'clamp(16px, 2.2vw, 26px)',
                lineHeight: '1.5',
                color: i === slide.content!.length - 1 ? '#00E5E5' : undefined,
                fontWeight: i === slide.content!.length - 1 ? 'bold' : 'normal'
              }}
            >
              {text}
            </p>
          ))}
        </div>
      )}
      {slide.highlight && (
        <div 
          className="px-8 py-4 rounded-xl"
          style={{
            background: 'rgba(0, 229, 229, 0.1)',
            border: '2px solid rgba(0, 229, 229, 0.4)',
            boxShadow: '0 0 40px rgba(0, 229, 229, 0.2)'
          }}
        >
          <span 
            className="font-bold"
            style={{ 
              fontSize: 'clamp(24px, 3.5vw, 44px)',
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
    <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12">
      <h2 
        className="font-bold mb-6"
        style={{ 
          fontSize: 'clamp(52px, 8vw, 90px)',
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
          className="mb-10"
          style={{ 
            fontSize: 'clamp(24px, 3.5vw, 40px)',
            color: '#00E5E5',
            textShadow: '0 0 15px rgba(0, 229, 229, 0.4)'
          }}
        >
          {slide.subtitle}
        </p>
      )}
      {slide.content && (
        <div className="space-y-3 mb-10">
          {slide.content.map((text, i) => (
            <p 
              key={i}
              className="text-white"
              style={{ 
                fontSize: 'clamp(20px, 2.8vw, 32px)',
                lineHeight: '1.4'
              }}
            >
              {text}
            </p>
          ))}
        </div>
      )}
      {slide.highlight && (
        <button 
          className="px-10 py-5 rounded-full font-bold transition-all hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #00E5E5, #0066FF)',
            color: '#000',
            fontSize: 'clamp(20px, 2.5vw, 32px)',
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

  return (
    <div 
      className="w-full h-full relative overflow-hidden"
      style={{ 
        background: '#000000',
        fontFamily: 'Exo, sans-serif'
      }}
    >
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(rgba(0, 229, 229, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 229, 0.02) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Ambient glow */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 229, 229, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)'
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-80 h-80 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.06) 0%, transparent 70%)',
          filter: 'blur(50px)'
        }}
      />

      {/* Slide content */}
      <div className="relative z-10 h-full">
        {renderSlideContent()}
      </div>

      {/* Slide number */}
      <div 
        className="absolute bottom-4 right-4"
        style={{
          fontSize: 'clamp(12px, 1.5vw, 16px)',
          color: 'rgba(0, 229, 229, 0.5)',
          fontFamily: 'monospace'
        }}
      >
        {String(slide.id).padStart(2, '0')}
      </div>
    </div>
  );
};

export default PitchSlide;
