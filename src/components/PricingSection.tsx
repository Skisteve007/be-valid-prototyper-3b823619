export const PricingSection = () => {
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
          border: 1px solid #ddd;
          border-radius: 12px;
          padding: 20px;
          background: white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 280px;
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
          color: #999;
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
          color: #666;
        }
        .pricing-card button {
          cursor: pointer;
          transition: transform 0.1s;
        }
        .pricing-card button:active {
          transform: scale(0.98);
        }
      `}</style>

      <div className="pricing-grid-container">

        {/* Single Member - Bi-Monthly */}
        <div className="pricing-card">
          <div className="promo-badge">50% OFF</div>
          <div>
            <h3>Single Member</h3>
            <div className="original-price">$39.00</div>
            <div className="price-text">$19.50</div>
            <div className="sub-text">Billed every 60 days</div>
            <p style={{ marginTop: '10px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.85em' }}>🔥 Limited Time Offer!</p>
          </div>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick-subscriptions" />
            <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
            <input type="hidden" name="item_name" value="Cloud Hosting - Single (Bi-Monthly) - 50% OFF" />
            <input type="hidden" name="a3" value="19.50" />
            <input type="hidden" name="p3" value="2" />
            <input type="hidden" name="t3" value="M" />
            <input type="hidden" name="src" value="1" />
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
              SELECT PLAN ($19.50)
            </button>
          </form>
        </div>

        {/* Joint Couple - Bi-Monthly */}
        <div className="pricing-card">
          <div className="promo-badge">50% OFF</div>
          <div>
            <h3>Joint Couple</h3>
            <div className="original-price">$69.00</div>
            <div className="price-text">$34.50</div>
            <div className="sub-text">Billed every 60 days</div>
            <p style={{ marginTop: '10px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.85em' }}>🔥 Limited Time Offer!</p>
          </div>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick-subscriptions" />
            <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
            <input type="hidden" name="item_name" value="Cloud Hosting - Joint (Bi-Monthly) - 50% OFF" />
            <input type="hidden" name="a3" value="34.50" />
            <input type="hidden" name="p3" value="2" />
            <input type="hidden" name="t3" value="M" />
            <input type="hidden" name="src" value="1" />
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
              SELECT PLAN ($34.50)
            </button>
          </form>
        </div>

        {/* Single 1-Year Pass */}
        <div className="pricing-card" style={{ border: '2px solid #D4AF37' }}>
          <div className="promo-badge">50% OFF</div>
          <div>
            <h3 style={{ color: '#D4AF37' }}>Single 1-Year Pass</h3>
            <div className="original-price">$129.00</div>
            <div className="price-text">$64.50</div>
            <div className="sub-text">One-time payment</div>
            <p style={{ marginTop: '10px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.85em' }}>🔥 Limited Time Offer!</p>
          </div>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick" />
            <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
            <input type="hidden" name="item_name" value="Cloud Hosting - Single (1 Year) - 50% OFF" />
            <input type="hidden" name="amount" value="64.50" />
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
              BUY 1-YEAR ($64.50)
            </button>
          </form>
        </div>

        {/* Couple 1-Year Pass */}
        <div className="pricing-card" style={{ border: '2px solid #D4AF37' }}>
          <div className="promo-badge">50% OFF</div>
          <div>
            <h3 style={{ color: '#D4AF37' }}>Couple 1-Year Pass</h3>
            <div className="original-price">$219.00</div>
            <div className="price-text">$109.50</div>
            <div className="sub-text">One-time payment</div>
            <p style={{ marginTop: '10px', color: '#ef4444', fontWeight: 'bold', fontSize: '0.85em' }}>🔥 Limited Time Offer!</p>
          </div>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick" />
            <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
            <input type="hidden" name="item_name" value="Cloud Hosting - Joint (1 Year) - 50% OFF" />
            <input type="hidden" name="amount" value="109.50" />
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
              BUY 1-YEAR ($109.50)
            </button>
          </form>
        </div>

      </div>
    </>
  );
};
