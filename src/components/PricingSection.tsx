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
        }
        .price-text {
          font-size: 1.8em;
          font-weight: 800;
          color: #333;
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
          <div>
            <h3>Single Member</h3>
            <div className="price-text">$39.00</div>
            <div className="sub-text">Billed every 60 days</div>
            <p style={{ marginTop: '10px' }}>Recurring billing. Cancel anytime.</p>
          </div>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick-subscriptions" />
            <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
            <input type="hidden" name="item_name" value="Cloud Hosting - Single (Bi-Monthly)" />
            <input type="hidden" name="a3" value="39.00" />
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
              SELECT PLAN ($39)
            </button>
          </form>
        </div>

        {/* Joint Couple - Bi-Monthly */}
        <div className="pricing-card">
          <div>
            <h3>Joint Couple</h3>
            <div className="price-text">$69.00</div>
            <div className="sub-text">Billed every 60 days</div>
            <p style={{ marginTop: '10px' }}>Joint account access.</p>
          </div>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick-subscriptions" />
            <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
            <input type="hidden" name="item_name" value="Cloud Hosting - Joint (Bi-Monthly)" />
            <input type="hidden" name="a3" value="69.00" />
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
              SELECT PLAN ($69)
            </button>
          </form>
        </div>

        {/* Single 1-Year Pass */}
        <div className="pricing-card" style={{ border: '2px solid #D4AF37' }}>
          <div>
            <h3 style={{ color: '#D4AF37' }}>Single 1-Year Pass</h3>
            <div className="price-text">$129.00</div>
            <div className="sub-text">One-time payment</div>
            <p style={{ marginTop: '10px' }}>Valid for 365 days. Save 45%.</p>
          </div>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick" />
            <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
            <input type="hidden" name="item_name" value="Cloud Hosting - Single (1 Year)" />
            <input type="hidden" name="amount" value="129.00" />
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
              BUY 1-YEAR ($129)
            </button>
          </form>
        </div>

        {/* Couple 1-Year Pass */}
        <div className="pricing-card" style={{ border: '2px solid #D4AF37' }}>
          <div>
            <h3 style={{ color: '#D4AF37' }}>Couple 1-Year Pass</h3>
            <div className="price-text">$219.00</div>
            <div className="sub-text">One-time payment</div>
            <p style={{ marginTop: '10px' }}>Valid for 365 days. Save 47%.</p>
          </div>
          <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
            <input type="hidden" name="cmd" value="_xclick" />
            <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
            <input type="hidden" name="item_name" value="Cloud Hosting - Joint (1 Year)" />
            <input type="hidden" name="amount" value="219.00" />
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
              BUY 1-YEAR ($219)
            </button>
          </form>
        </div>

      </div>
    </>
  );
};
