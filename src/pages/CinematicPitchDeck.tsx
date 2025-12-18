import React, { useEffect, useRef } from 'react';

const slidesData = [
  {
    id: 1,
    label: 'INTRODUCTION',
    title: 'VALID™',
    subtitle: 'The Universal Lifestyle Wallet',
    body: 'Identity. Payments. Safety. Social.',
    highlight: "We Check. We Don't Collect.",
  },
  {
    id: 2,
    label: 'THE PROBLEM',
    title: 'The $47B Problem',
    subtitle: 'Venues are bleeding money on unsafe crowds.',
    body: '$47B in annual losses from venue violence, fraud & liability. 73% of stadium operators say security is their #1 cost concern. 1 in 4 fans have felt unsafe at a live event.',
    highlight: 'The industry needs a new standard.',
  },
  {
    id: 3,
    label: 'THE SOLUTION',
    title: 'Safety That Scales',
    subtitle: 'Real-time identity verification + federal watchlist screening.',
    body: 'Fan scans in (2.3 seconds) → Federal watchlist check → CLEARED → Data PURGED immediately.',
    highlight: 'Zero data retention. Instant clearance.',
  },
  {
    id: 4,
    label: 'HOW IT WORKS',
    title: 'The VALID™ Flow',
    subtitle: 'Scan → Verify → Clear → Purge',
    body: 'Government ID validation. National Sex Offender Registry. Terrorist Watchlist (TSA/DHS). Venue-specific ban lists. Age verification.',
    highlight: "What we DON'T do: Store data. Build profiles. Sell information.",
  },
  {
    id: 5,
    label: 'PRODUCT ECOSYSTEM',
    title: 'The VALID™ Stack',
    subtitle: 'Consumer App + Enterprise Platform + API',
    body: 'VALID™ App (Fans): Digital ID wallet, QR code, social signals. VALID™ Venue (Operators): Scanning hardware, admin dashboard. Ghost Pass™ Wallet: Secure storage for passes, rewards, payments.',
    highlight: 'Gamification: Valid Access Card • The Bounty • Signal Sync',
  },
  {
    id: 6,
    label: 'REVENUE MODEL',
    title: 'The Invisible Fee',
    subtitle: "Guest pays. You profit. We split 50/50.",
    body: 'Safety Surcharge: $3.00. Vendor Cost: $1.25–$1.75. Gross Profit: $1.25–$1.75/head. YOUR CUT (50%): $0.625–$0.875/head. VALID™ (50%): $0.625–$0.875/head.',
    highlight: '50K fans → You make $31K–$44K per game',
  },
  {
    id: 7,
    label: 'MARKET SIZE',
    title: '$1.6B+ TAM',
    subtitle: 'A massive, underserved market.',
    body: 'NFL Stadiums: $39M ARR. MLB Stadiums: $161M ARR. Concerts/Festivals: $230M ARR. Nightclubs: $1.15B ARR. Universities: $46M ARR.',
    highlight: 'Beachhead: NFL & major concert venues',
  },
  {
    id: 8,
    label: 'TRACTION',
    title: 'Early Momentum',
    subtitle: 'Product built. Pipeline growing.',
    body: 'App Live (React/Supabase). Core Features Complete. Privacy Compliance (GDPR/CCPA/SOC2). B2B Pipeline: 3 venue conversations.',
    highlight: 'Targeting Q1 2025 pilot launch',
  },
  {
    id: 9,
    label: 'COMPETITIVE ADVANTAGE',
    title: 'Why VALID™ Wins',
    subtitle: 'Privacy-first. Consumer-loved. Enterprise-ready.',
    body: 'Federal Watchlist ✓ (competitors: ✗). Zero Data Retention ✓. Fan-Facing App ✓. Gamification ✓. Scan Speed: <3s.',
    highlight: 'Our moat: Privacy architecture + Network effects',
  },
  {
    id: 10,
    label: 'PRIVACY',
    title: "We Check. We Don't Collect.",
    subtitle: 'Privacy is our competitive moat.',
    body: 'For Fans: Your ID is checked to keep your family safe, without ever saving your data. For Venues: Unlike older systems that hoard data, VALID™ blocks threats while keeping data private.',
    highlight: 'GDPR • CCPA • SOC2 Compliant',
  },
  {
    id: 11,
    label: 'GO-TO-MARKET',
    title: 'GTM Strategy',
    subtitle: 'Land stadiums. Expand to lifestyle.',
    body: 'Phase 1 (Months 1-6): 3 NFL/major venue pilots. Phase 2 (Months 6-12): 10 venues across sports, concerts, nightlife. Phase 3 (Year 2): API licensing to ticketing platforms.',
    highlight: 'Consumer flywheel: Fans demand VALID™ venues',
  },
  {
    id: 12,
    label: 'THE TEAM',
    title: 'The War Room',
    subtitle: 'Lean team. AI-augmented. 10x execution.',
    body: 'CEO/Strategist: Steven. AI Board: Copilot (Surgeon), Claude (Auditor), Lovable (Builder), ChatGPT (Strategist).',
    highlight: 'Strategy-first approach. Enterprise architecture from day one.',
  },
  {
    id: 13,
    label: 'THE ASK',
    title: '$200K Convertible Note',
    subtitle: 'Fuel the first three venue pilots.',
    body: 'Terms: 50% discount, $6M cap, 5% interest, 18-month maturity. Use: Hardware Fleet $60K, Venue Pilots $40K, Sales Hire $50K, Development $30K, Legal $20K.',
    highlight: 'Milestone: 3 paying venues → Series A ready',
  },
  {
    id: 14,
    label: 'THE VISION',
    title: 'The Future of VALID™',
    subtitle: 'Every scan. Every venue. Every fan.',
    body: 'Year 1: Stadium safety standard. Year 3: Universal lifestyle wallet. Year 5: Global trust layer for physical spaces.',
    highlight: 'VALID™',
    isQRSlide: true,
  },
];

interface SlideCardProps {
  label: string;
  title: string;
  subtitle: string;
  body: string;
  highlight: string;
  isQRSlide?: boolean;
}

const SlideCard: React.FC<SlideCardProps> = ({
  label,
  title,
  subtitle,
  body,
  highlight,
  isQRSlide = false,
}) => {
  return (
    <div 
      className="relative w-full max-w-2xl mx-auto p-8 md:p-12 rounded-3xl border border-border/30 bg-background/40 backdrop-blur-xl shadow-2xl"
      style={{
        boxShadow: '0 0 60px rgba(0, 255, 255, 0.1), inset 0 0 60px rgba(0, 0, 0, 0.3)',
        animation: 'fade-in-up 0.8s ease-out forwards',
      }}
    >
      {/* HUD Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-3xl" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/50 rounded-tr-3xl" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/50 rounded-bl-3xl" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-3xl" />

      <div className="text-primary text-xs md:text-sm font-mono tracking-[0.3em] mb-4 opacity-70">
        {label}
      </div>

      <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3 tracking-tight font-orbitron">
        {title}
      </h1>

      <h2 className="text-lg md:text-xl text-muted-foreground mb-6 font-light">
        {subtitle}
      </h2>

      <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8">
        {body}
      </p>

      {!isQRSlide ? (
        <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
          <span className="text-primary text-sm md:text-base font-medium">
            {highlight}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center mt-4">
          <div 
            className="w-48 h-48 md:w-64 md:h-64 bg-card rounded-2xl flex items-center justify-center relative"
            style={{
              boxShadow: '0 0 40px rgba(0, 255, 255, 0.5), 0 0 80px rgba(0, 255, 255, 0.3), 0 0 120px rgba(0, 255, 255, 0.1)',
              animation: 'glow-pulse 3s ease-in-out infinite',
            }}
          >
            <div className="w-40 h-40 md:w-56 md:h-56 bg-background rounded-xl flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full p-4">
                <rect x="10" y="10" width="25" height="25" fill="currentColor" className="text-foreground"/>
                <rect x="65" y="10" width="25" height="25" fill="currentColor" className="text-foreground"/>
                <rect x="10" y="65" width="25" height="25" fill="currentColor" className="text-foreground"/>
                <rect x="15" y="15" width="15" height="15" fill="currentColor" className="text-background"/>
                <rect x="70" y="15" width="15" height="15" fill="currentColor" className="text-background"/>
                <rect x="15" y="70" width="15" height="15" fill="currentColor" className="text-background"/>
                <rect x="18" y="18" width="9" height="9" fill="currentColor" className="text-foreground"/>
                <rect x="73" y="18" width="9" height="9" fill="currentColor" className="text-foreground"/>
                <rect x="18" y="73" width="9" height="9" fill="currentColor" className="text-foreground"/>
                <rect x="40" y="10" width="5" height="5" fill="currentColor" className="text-foreground"/>
                <rect x="50" y="10" width="5" height="5" fill="currentColor" className="text-foreground"/>
                <rect x="40" y="20" width="5" height="5" fill="currentColor" className="text-foreground"/>
                <rect x="45" y="25" width="5" height="5" fill="currentColor" className="text-foreground"/>
                <rect x="40" y="40" width="20" height="20" fill="currentColor" className="text-foreground"/>
                <rect x="45" y="45" width="10" height="10" fill="currentColor" className="text-background"/>
                <rect x="10" y="40" width="5" height="5" fill="currentColor" className="text-foreground"/>
                <rect x="20" y="45" width="5" height="5" fill="currentColor" className="text-foreground"/>
                <rect x="65" y="40" width="5" height="5" fill="currentColor" className="text-foreground"/>
                <rect x="75" y="50" width="5" height="5" fill="currentColor" className="text-foreground"/>
                <rect x="85" y="65" width="5" height="25" fill="currentColor" className="text-foreground"/>
                <rect x="65" y="85" width="20" height="5" fill="currentColor" className="text-foreground"/>
              </svg>
            </div>
          </div>
          
          <p className="text-primary text-sm mt-6 font-mono tracking-wider">
            SCAN TO CONNECT
          </p>
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-xs">steve@bevalid.app</p>
            <p className="text-muted-foreground text-xs">bevalid.app</p>
          </div>
        </div>
      )}
    </div>
  );
};

const CinematicPitchDeck: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((e) => {
        console.log('Video autoplay prevented:', e);
      });
    }
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-background font-orbitron">
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glow-pulse {
          0%, 100% {
            box-shadow: 0 0 40px rgba(0, 255, 255, 0.5), 0 0 80px rgba(0, 255, 255, 0.3), 0 0 120px rgba(0, 255, 255, 0.1);
          }
          50% {
            box-shadow: 0 0 60px rgba(0, 255, 255, 0.7), 0 0 100px rgba(0, 255, 255, 0.5), 0 0 140px rgba(0, 255, 255, 0.2);
          }
        }
      `}</style>

      {/* Fixed Video Background */}
      <video
        ref={videoRef}
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        src="https://cdn.pixabay.com/video/2020/05/25/40130-424930032_large.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          filter: 'brightness(0.4) saturate(1.2)',
        }}
      />

      {/* Overlay gradient */}
      <div 
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Snap Scroll Container */}
      <div 
        className="relative z-10 w-full h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {slidesData.map((slide) => (
          <section
            key={slide.id}
            className="w-full h-screen min-h-screen snap-start snap-always flex items-center justify-center p-4 md:p-8"
          >
            <SlideCard
              label={`${String(slide.id).padStart(2, '0')} / ${String(slidesData.length).padStart(2, '0')} — ${slide.label}`}
              title={slide.title}
              subtitle={slide.subtitle}
              body={slide.body}
              highlight={slide.highlight}
              isQRSlide={slide.isQRSlide}
            />
          </section>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center animate-bounce opacity-50">
        <span className="text-foreground/50 text-xs font-mono tracking-widest mb-2">SCROLL</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-foreground/50">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>

      {/* Logo Watermark */}
      <div className="fixed top-6 left-6 z-20 text-foreground/30 font-bold text-lg tracking-[0.2em] font-mono">
        VALID™
      </div>

      {/* Slide Counter */}
      <div className="fixed top-6 right-6 z-20 text-foreground/30 text-xs font-mono tracking-widest">
        PITCH DECK 2025
      </div>
    </div>
  );
};

export default CinematicPitchDeck;
