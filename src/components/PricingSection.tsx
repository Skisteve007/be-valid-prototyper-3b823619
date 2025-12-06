import { useCurrency, SUPPORTED_CURRENCIES } from '@/hooks/useCurrency';
import { CurrencySelector } from './CurrencySelector';

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

  // PayPal always processes in USD, but we show converted prices for display
  const getDisplayPrice = (usdPrice: number) => formatPrice(usdPrice);
  
  return (
    <>
      <style>{`
        .pricing-grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          padding: 20px;
        }
        .pricing-card {
          border: 1px solid hsl(var(--border));
          border-radius: 12px;
          padding: 20px;
          background: hsl(var(--card));
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 320px;
          position: relative;
          overflow: hidden;
        }
        .promo-badge {
          position: absolute;
          top: 12px;
          right: -35px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          padding: 4px 40px;
          font-size: 0.75em;
          font-weight: bold;
          transform: rotate(45deg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .original-price {
          font-size: 1.1em;
          color: hsl(var(--muted-foreground));
          text-decoration: line-through;
          margin-bottom: 4px;
        }
        .price-text {
          font-size: 1.8em;
          font-weight: 800;
          color: #16a34a;
        }
        .sub-text {
          font-size: 0.9em;
          color: hsl(var(--muted-foreground));
        }
        .pricing-card button {
          cursor: pointer;
          transition: transform 0.1s;
        }
        .pricing-card button:active {
          transform: scale(0.98);
        }
        .currency-note {
          font-size: 0.75em;
          color: hsl(var(--muted-foreground));
          margin-top: 8px;
        }
        .pricing-card h3 {
          color: hsl(var(--foreground));
        }
      `}</style>

      {/* Currency Selector */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3 px-4 py-2 bg-muted/50 rounded-full">
          <span className="text-sm text-muted-foreground">Display prices in:</span>
          <CurrencySelector />
        </div>
      </div>

      <div className="pricing-grid-container">

        {/* Single Member - Bi-Monthly */}
        <div className="pricing-card">
          <div className="promo-badge">50% OFF</div>
          <div>
            <h3>Single Member</h3>
            <div className="original-price">{getDisplayPrice(PRICES.originalSingleBiMonthly)}</div>
            <div className="price-text">{getDisplayPrice(PRICES.singleBiMonthly)}</div>
            <div className="sub-text">Billed every 60 days</div>
            <p style={{ marginTop: '10px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.85em' }}>🔥 Limited Time Offer!</p>
            {currency.code !== 'USD' && (
              <p className="currency-note">
                * Charged as ${PRICES.singleBiMonthly.toFixed(2)} USD
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
            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '15px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                zIndex: 10000,
                position: 'relative'
              }}
            >
              SELECT PLAN ({getDisplayPrice(PRICES.singleBiMonthly)})
            </button>
          </form>
        </div>

        {/* Joint Couple - Bi-Monthly */}
        <div className="pricing-card">
          <div className="promo-badge">50% OFF</div>
          <div>
            <h3>Joint Couple</h3>
            <div className="original-price">{getDisplayPrice(PRICES.originalCoupleBiMonthly)}</div>
            <div className="price-text">{getDisplayPrice(PRICES.coupleBiMonthly)}</div>
            <div className="sub-text">Billed every 60 days</div>
            <p style={{ marginTop: '10px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.85em' }}>🔥 Limited Time Offer!</p>
            {currency.code !== 'USD' && (
              <p className="currency-note">
                * Charged as ${PRICES.coupleBiMonthly.toFixed(2)} USD
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
            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '15px',
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                zIndex: 10000,
                position: 'relative'
              }}
            >
              SELECT PLAN ({getDisplayPrice(PRICES.coupleBiMonthly)})
            </button>
          </form>
        </div>

        {/* Single 1-Year Pass */}
        <div className="pricing-card" style={{ border: '2px solid #D4AF37' }}>
          <div className="promo-badge">50% OFF</div>
          <div>
            <h3 style={{ color: '#D4AF37' }}>Single 1-Year Pass</h3>
            <div className="original-price">{getDisplayPrice(PRICES.originalSingleAnnual)}</div>
            <div className="price-text">{getDisplayPrice(PRICES.singleAnnual)}</div>
            <div className="sub-text">One-time payment</div>
            <p style={{ marginTop: '10px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.85em' }}>🔥 Limited Time Offer!</p>
            {currency.code !== 'USD' && (
              <p className="currency-note">
                * Charged as ${PRICES.singleAnnual.toFixed(2)} USD
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
            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '15px',
                background: '#D4AF37',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                zIndex: 10000,
                position: 'relative'
              }}
            >
              BUY 1-YEAR ({getDisplayPrice(PRICES.singleAnnual)})
            </button>
          </form>
        </div>

        {/* Couple 1-Year Pass */}
        <div className="pricing-card" style={{ border: '2px solid #D4AF37' }}>
          <div className="promo-badge">50% OFF</div>
          <div>
            <h3 style={{ color: '#D4AF37' }}>Couple 1-Year Pass</h3>
            <div className="original-price">{getDisplayPrice(PRICES.originalCoupleAnnual)}</div>
            <div className="price-text">{getDisplayPrice(PRICES.coupleAnnual)}</div>
            <div className="sub-text">One-time payment</div>
            <p style={{ marginTop: '10px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.85em' }}>🔥 Limited Time Offer!</p>
            {currency.code !== 'USD' && (
              <p className="currency-note">
                * Charged as ${PRICES.coupleAnnual.toFixed(2)} USD
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
            <button 
              type="submit" 
              style={{
                width: '100%',
                padding: '15px',
                background: '#D4AF37',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                zIndex: 10000,
                position: 'relative'
              }}
            >
              BUY 1-YEAR ({getDisplayPrice(PRICES.coupleAnnual)})
            </button>
          </form>
        </div>

      </div>
    </>
  );
};
