import { useCurrency } from '@/hooks/useCurrency';
import { CurrencySelector } from './CurrencySelector';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { BetaRibbon } from './BetaRibbon';
import { isBetaPeriodActive, getBetaTimeRemaining, BETA_CONFIG } from '@/config/betaConfig';
import { useState, useEffect } from 'react';

// Base prices in USD
const PRICES = {
  singleBiMonthly: 19.00,
  coupleBiMonthly: 34.50,
  singleAnnual: 64.50,
  coupleAnnual: 109.50,
  // Standard prices for strikethrough
  standardSingleBiMonthly: 39.00,
  standardCoupleBiMonthly: 69.00,
  standardSingleAnnual: 129.00,
  standardCoupleAnnual: 219.00,
};

const BetaCountdown = () => {
  const [timeRemaining, setTimeRemaining] = useState(getBetaTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getBetaTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (timeRemaining.expired) {
    return null;
  }

  return (
    <span className="text-cyan-400">
      {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m
    </span>
  );
};

export const PricingSection = () => {
  const { currency, formatPrice } = useCurrency();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isBeta = isBetaPeriodActive();

  const getDisplayPrice = (usdPrice: number) => formatPrice(usdPrice);

  const handleSelectPlan = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("email_verified")
          .eq("user_id", session.user.id)
          .single();
        
        if (profile?.email_verified) {
          navigate('/dashboard');
        } else {
          navigate('/auth?mode=login');
        }
      } else {
        navigate('/auth?mode=signup');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth?mode=signup');
    }
  };

  const renderPriceBlock = (introPrice: number, standardPrice: number, isOneTime: boolean = false) => {
    if (isBeta) {
      return (
        <>
          <div className="price-text text-3xl font-black">$0.00</div>
          <div className="sub-text text-xs mt-1 text-gray-400">
            First {BETA_CONFIG.maxBetaMembers} members • Beta ends <BetaCountdown />
          </div>
          <div className="sub-text text-xs mt-1 text-gray-500">
            (After beta: {getDisplayPrice(introPrice)}/{isOneTime ? 'year' : '60 days'} | <span className="line-through">{getDisplayPrice(standardPrice)}</span>)
          </div>
        </>
      );
    }
    return (
      <>
        <div className="original-price text-gray-500 line-through text-sm">{getDisplayPrice(standardPrice)}</div>
        <div className="price-text text-2xl font-bold">{getDisplayPrice(introPrice)}</div>
        <div className="sub-text text-sm text-gray-400">{isOneTime ? t('pricing.oneTime') : t('pricing.billedBiMonthly')}</div>
      </>
    );
  };

  return (
    <>
      <style>{`
        @keyframes neon-pulse {
          0%, 100% { box-shadow: 0 0 8px currentColor, 0 0 16px currentColor; }
          50% { box-shadow: 0 0 12px currentColor, 0 0 24px currentColor; }
        }
        @keyframes border-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(0, 240, 255, 0.2), inset 0 0 10px rgba(0, 240, 255, 0.03); }
          50% { box-shadow: 0 0 12px rgba(0, 240, 255, 0.3), inset 0 0 15px rgba(0, 240, 255, 0.05); }
        }
        .pricing-grid-container {
          display: flex;
          flex-direction: row;
          gap: 16px;
          padding: 20px 16px;
          justify-content: center;
          max-width: 1100px;
          margin: 0 auto;
        }
        .pricing-card {
          border: 1px solid rgba(0, 240, 255, 0.3);
          border-radius: 16px;
          padding: 20px;
          background: linear-gradient(145deg, rgba(10, 15, 30, 0.95), rgba(20, 30, 50, 0.9));
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 320px;
          flex: 1;
          position: relative;
          overflow: hidden;
          animation: border-glow 3s ease-in-out infinite;
        }
        .pricing-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00f0ff, #39ff14, #00f0ff, transparent);
        }
        .price-text {
          background: linear-gradient(135deg, #39ff14, #00f0ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .neon-btn {
          width: 100%;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          font-size: 0.85em;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .neon-btn-green {
          background: linear-gradient(135deg, #39ff14, #00ff88);
          color: #000;
          animation: neon-pulse 2.5s ease-in-out infinite;
        }
        .neon-btn-green:hover { transform: scale(1.02); }
        .neon-btn-cyan {
          background: linear-gradient(135deg, #00f0ff, #0088ff);
          color: #000;
          animation: neon-pulse 2.5s ease-in-out infinite 0.5s;
        }
        .neon-btn-cyan:hover { transform: scale(1.02); }
        .pricing-card h3 {
          color: #e0e0e0;
          font-size: 1em;
          margin-bottom: 8px;
        }
        .pricing-card.premium {
          border-color: rgba(0, 240, 255, 0.6);
          background: linear-gradient(145deg, rgba(0, 30, 50, 0.95), rgba(10, 40, 60, 0.9));
        }
        .pricing-card.premium::before {
          background: linear-gradient(90deg, transparent, #00f0ff, #ff00ff, #00f0ff, transparent);
        }
        .tier-label {
          font-size: 0.7em;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
          background: linear-gradient(90deg, #c0c0c0, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @media (max-width: 768px) {
          .pricing-grid-container {
            flex-direction: column;
            align-items: center;
          }
          .pricing-card {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>

      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-cyan-500/30 rounded-full backdrop-blur-sm">
          <span className="text-sm text-cyan-300/80">{t('pricing.displayIn')}</span>
          <CurrencySelector />
        </div>
      </div>

      <div className="pricing-grid-container">
        {/* Single Member - Bi-Monthly */}
        <div className="pricing-card">
          <BetaRibbon />
          <div>
            <div className="tier-label">Starter</div>
            <h3>{t('pricing.singleMember')}</h3>
            {renderPriceBlock(PRICES.singleBiMonthly, PRICES.standardSingleBiMonthly)}
          </div>
          <button onClick={handleSelectPlan} className="neon-btn neon-btn-green">
            {isBeta ? 'JOIN FREE BETA' : t('pricing.selectPlan')}
          </button>
        </div>

        {/* Joint Couple - Bi-Monthly */}
        <div className="pricing-card">
          <BetaRibbon />
          <div>
            <div className="tier-label">Duo</div>
            <h3>{t('pricing.jointCouple')}</h3>
            {renderPriceBlock(PRICES.coupleBiMonthly, PRICES.standardCoupleBiMonthly)}
          </div>
          <button onClick={handleSelectPlan} className="neon-btn neon-btn-green">
            {isBeta ? 'JOIN FREE BETA' : t('pricing.selectPlan')}
          </button>
        </div>

        {/* Single 1-Year Pass */}
        <div className="pricing-card premium">
          <BetaRibbon />
          <div>
            <div className="tier-label" style={{ background: 'linear-gradient(90deg, #00f0ff, #ff00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Premium</div>
            <h3 style={{ color: '#00f0ff' }}>{t('pricing.singleAnnual')}</h3>
            {renderPriceBlock(PRICES.singleAnnual, PRICES.standardSingleAnnual, true)}
          </div>
          <button onClick={handleSelectPlan} className="neon-btn neon-btn-cyan">
            {isBeta ? 'JOIN FREE BETA' : t('pricing.buyAnnual')}
          </button>
        </div>

        {/* Couple 1-Year Pass */}
        <div className="pricing-card premium">
          <BetaRibbon />
          <div>
            <div className="tier-label" style={{ background: 'linear-gradient(90deg, #00f0ff, #ff00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Premium Duo</div>
            <h3 style={{ color: '#00f0ff' }}>{t('pricing.coupleAnnual')}</h3>
            {renderPriceBlock(PRICES.coupleAnnual, PRICES.standardCoupleAnnual, true)}
          </div>
          <button onClick={handleSelectPlan} className="neon-btn neon-btn-cyan">
            {isBeta ? 'JOIN FREE BETA' : t('pricing.buyAnnual')}
          </button>
        </div>
      </div>
    </>
  );
};
