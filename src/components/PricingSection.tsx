import { useCurrency, SUPPORTED_CURRENCIES } from '@/hooks/useCurrency';
import { CurrencySelector } from './CurrencySelector';
import { useTranslation } from 'react-i18next';

// Base prices in USD
const PRICES = {
  singleBiMonthly: 19.50,
  coupleBiMonthly: 34.50,
  singleAnnual: 64.50,
  coupleAnnual: 109.50,
  // Original prices for strikethrough
  originalSingleBiMonthly: 39.00,
  originalCoupleBiMonthly: 69.00,
  originalSingleAnnual: 129.00,
  originalCoupleAnnual: 219.00,
};

export const PricingSection = () => {
  const { currency, formatPrice, convertPrice } = useCurrency();
  const { t } = useTranslation();

  // PayPal always processes in USD, but we show converted prices for display
  const getDisplayPrice = (usdPrice: number) => formatPrice(usdPrice);
  
  return (
    <>
      <style>{`
        @keyframes neon-pulse {
          0%, 100% {
            box-shadow: 0 0 4px currentColor, 0 0 8px currentColor;
          }
          50% {
            box-shadow: 0 0 6px currentColor, 0 0 12px currentColor;
          }
        }
        @keyframes border-glow {
          0%, 100% {
            box-shadow: 0 0 8px rgba(0, 240, 255, 0.2), inset 0 0 10px rgba(0, 240, 255, 0.03);
          }
          50% {
            box-shadow: 0 0 12px rgba(0, 240, 255, 0.3), inset 0 0 15px rgba(0, 240, 255, 0.05);
          }
        }
        .pricing-grid-container {
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          gap: 12px;
          padding: 16px;
          justify-content: center;
          overflow-x: auto;
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
          width: 240px;
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
        .promo-badge {
          position: absolute;
          top: 12px;
          right: -35px;
          background: linear-gradient(135deg, #ff00ff, #00f0ff);
          color: white;
          padding: 4px 40px;
          font-size: 0.7em;
          font-weight: bold;
          transform: rotate(45deg);
          box-shadow: 0 0 15px rgba(255, 0, 255, 0.5);
          text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
        }
        .original-price {
          font-size: 1em;
          color: #888;
          text-decoration: line-through;
          margin-bottom: 4px;
        }
        .price-text {
          font-size: 1.6em;
          font-weight: 800;
          background: linear-gradient(135deg, #39ff14, #00f0ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 30px rgba(57, 255, 20, 0.3);
        }
        .sub-text {
          font-size: 0.85em;
          color: #a0a0a0;
        }
        .neon-btn {
          width: 100%;
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          position: relative;
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
        .neon-btn-green:hover {
          transform: scale(1.02);
        }
        .neon-btn-cyan {
          background: linear-gradient(135deg, #00f0ff, #0088ff);
          color: #000;
          animation: neon-pulse 2.5s ease-in-out infinite 0.5s;
        }
        .neon-btn-cyan:hover {
          transform: scale(1.02);
        }
        .currency-note {
          font-size: 0.7em;
          color: #666;
          margin-top: 6px;
        }
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

      {/* Currency Selector */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3 px-4 py-2 bg-black/40 border border-cyan-500/30 rounded-full backdrop-blur-sm">
          <span className="text-sm text-cyan-300/80">{t('pricing.displayIn')}</span>
          <CurrencySelector />
        </div>
      </div>

      <div className="pricing-grid-container">

        {/* Single Member - Bi-Monthly */}
        <div className="pricing-card">
          <div className="promo-badge">{t('pricing.discount')}</div>
          <div>
            <div className="tier-label">Starter</div>
            <h3>{t('pricing.singleMember')}</h3>
            <div className="original-price">{getDisplayPrice(PRICES.originalSingleBiMonthly)}</div>
            <div className="price-text">{getDisplayPrice(PRICES.singleBiMonthly)}</div>
            <div className="sub-text">{t('pricing.billedBiMonthly')}</div>
            <p style={{ marginTop: '8px', color: '#ff00ff', fontWeight: 'bold', fontSize: '0.75em', textShadow: '0 0 10px rgba(255,0,255,0.5)' }}>🔥 {t('pricing.limitedTime')}</p>
            {currency.code !== 'USD' && (
              <p className="currency-note">
                * {t('pricing.chargedAs')} ${PRICES.singleBiMonthly.toFixed(2)} USD
              </p>
            )}
          </div>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick-subscriptions" />
            <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
            <input type="hidden" name="item_name" value="VALID - Single Member (Bi-Monthly) - 50% OFF" />
            <input type="hidden" name="a3" value="19.50" />
            <input type="hidden" name="p3" value="2" />
            <input type="hidden" name="t3" value="M" />
            <input type="hidden" name="src" value="1" />
            <input type="hidden" name="currency_code" value="USD" />
            <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
            <input type="hidden" name="cancel_return" value="https://bevalid.app" />
            <button type="submit" className="neon-btn neon-btn-green">
              {t('pricing.selectPlan')}
            </button>
          </form>
        </div>

        {/* Joint Couple - Bi-Monthly */}
        <div className="pricing-card">
          <div className="promo-badge">{t('pricing.discount')}</div>
          <div>
            <div className="tier-label">Duo</div>
            <h3>{t('pricing.jointCouple')}</h3>
            <div className="original-price">{getDisplayPrice(PRICES.originalCoupleBiMonthly)}</div>
            <div className="price-text">{getDisplayPrice(PRICES.coupleBiMonthly)}</div>
            <div className="sub-text">{t('pricing.billedBiMonthly')}</div>
            <p style={{ marginTop: '8px', color: '#ff00ff', fontWeight: 'bold', fontSize: '0.75em', textShadow: '0 0 10px rgba(255,0,255,0.5)' }}>🔥 {t('pricing.limitedTime')}</p>
            {currency.code !== 'USD' && (
              <p className="currency-note">
                * {t('pricing.chargedAs')} ${PRICES.coupleBiMonthly.toFixed(2)} USD
              </p>
            )}
          </div>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick-subscriptions" />
            <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
            <input type="hidden" name="item_name" value="VALID - Joint Couple (Bi-Monthly) - 50% OFF" />
            <input type="hidden" name="a3" value="34.50" />
            <input type="hidden" name="p3" value="2" />
            <input type="hidden" name="t3" value="M" />
            <input type="hidden" name="src" value="1" />
            <input type="hidden" name="currency_code" value="USD" />
            <input type="hidden" name="return" value="https://bevalid.app/payment-success" />
            <input type="hidden" name="cancel_return" value="https://bevalid.app" />
            <button type="submit" className="neon-btn neon-btn-green">
              {t('pricing.selectPlan')}
            </button>
          </form>
        </div>

        {/* Single 1-Year Pass */}
        <div className="pricing-card premium">
          <div className="promo-badge">{t('pricing.discount')}</div>
          <div>
            <div className="tier-label" style={{ background: 'linear-gradient(90deg, #00f0ff, #ff00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Premium</div>
            <h3 style={{ color: '#00f0ff' }}>{t('pricing.singleAnnual')}</h3>
            <div className="original-price">{getDisplayPrice(PRICES.originalSingleAnnual)}</div>
            <div className="price-text">{getDisplayPrice(PRICES.singleAnnual)}</div>
            <div className="sub-text">{t('pricing.oneTime')}</div>
            <p style={{ marginTop: '8px', color: '#ff00ff', fontWeight: 'bold', fontSize: '0.75em', textShadow: '0 0 10px rgba(255,0,255,0.5)' }}>🔥 {t('pricing.limitedTime')}</p>
            {currency.code !== 'USD' && (
              <p className="currency-note">
                * {t('pricing.chargedAs')} ${PRICES.singleAnnual.toFixed(2)} USD
              </p>
            )}
          </div>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick" />
            <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
            <input type="hidden" name="item_name" value="VALID - Single 1-Year Pass - 50% OFF" />
            <input type="hidden" name="amount" value="64.50" />
            <input type="hidden" name="currency_code" value="USD" />
            <input type="hidden" name="return" value="https://bevalid.app/payment-success?type=annual" />
            <input type="hidden" name="cancel_return" value="https://bevalid.app" />
            <button type="submit" className="neon-btn neon-btn-cyan">
              {t('pricing.buyAnnual')}
            </button>
          </form>
        </div>

        {/* Couple 1-Year Pass */}
        <div className="pricing-card premium">
          <div className="promo-badge">{t('pricing.discount')}</div>
          <div>
            <div className="tier-label" style={{ background: 'linear-gradient(90deg, #00f0ff, #ff00ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Premium Duo</div>
            <h3 style={{ color: '#00f0ff' }}>{t('pricing.coupleAnnual')}</h3>
            <div className="original-price">{getDisplayPrice(PRICES.originalCoupleAnnual)}</div>
            <div className="price-text">{getDisplayPrice(PRICES.coupleAnnual)}</div>
            <div className="sub-text">{t('pricing.oneTime')}</div>
            <p style={{ marginTop: '8px', color: '#ff00ff', fontWeight: 'bold', fontSize: '0.75em', textShadow: '0 0 10px rgba(255,0,255,0.5)' }}>🔥 {t('pricing.limitedTime')}</p>
            {currency.code !== 'USD' && (
              <p className="currency-note">
                * {t('pricing.chargedAs')} ${PRICES.coupleAnnual.toFixed(2)} USD
              </p>
            )}
          </div>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick" />
            <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
            <input type="hidden" name="item_name" value="VALID - Couple 1-Year Pass - 50% OFF" />
            <input type="hidden" name="amount" value="109.50" />
            <input type="hidden" name="currency_code" value="USD" />
            <input type="hidden" name="return" value="https://bevalid.app/payment-success?type=annual-couple" />
            <input type="hidden" name="cancel_return" value="https://bevalid.app" />
            <button type="submit" className="neon-btn neon-btn-cyan">
              {t('pricing.buyAnnual')}
            </button>
          </form>
        </div>

      </div>
    </>
  );
};
