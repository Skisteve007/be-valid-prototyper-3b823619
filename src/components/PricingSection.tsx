export const PricingSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
      {/* Single Member */}
      <div className="border border-border rounded-xl p-5 bg-card shadow-md flex flex-col justify-between min-h-[250px]">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Single Member</h3>
          <div className="text-2xl font-bold text-foreground mt-2">
            $39.00 <span className="text-sm font-normal text-muted-foreground">/ 60 days</span>
          </div>
          <p className="text-muted-foreground mt-2">Billed bi-monthly. Cancel anytime.</p>
        </div>
        
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
          <input type="hidden" name="cmd" value="_xclick-subscriptions" />
          <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
          <input type="hidden" name="item_name" value="Cloud Hosting - Single (Bi-Monthly)" />
          <input type="hidden" name="no_shipping" value="1" />
          <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?amount=39&type=Single+Member" />
          <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
          <input type="hidden" name="a3" value="39.00" />
          <input type="hidden" name="p3" value="2" />
          <input type="hidden" name="t3" value="M" />
          <input type="hidden" name="src" value="1" />
          
          <button 
            type="submit" 
            className="w-full min-h-[50px] text-base mt-3 rounded font-bold cursor-pointer border-none"
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
          >
            SELECT PLAN ($39)
          </button>
        </form>
      </div>

      {/* Joint Couple */}
      <div className="border border-border rounded-xl p-5 bg-card shadow-md flex flex-col justify-between min-h-[250px]">
        <div>
          <h3 className="text-xl font-semibold text-foreground">Joint Couple</h3>
          <div className="text-2xl font-bold text-foreground mt-2">
            $69.00 <span className="text-sm font-normal text-muted-foreground">/ 60 days</span>
          </div>
          <p className="text-muted-foreground mt-2">Joint account. Billed bi-monthly.</p>
        </div>
        
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
          <input type="hidden" name="cmd" value="_xclick-subscriptions" />
          <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
          <input type="hidden" name="item_name" value="Cloud Hosting - Joint (Bi-Monthly)" />
          <input type="hidden" name="no_shipping" value="1" />
          <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?amount=69&type=Joint+Couple" />
          <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
          <input type="hidden" name="a3" value="69.00" />
          <input type="hidden" name="p3" value="2" />
          <input type="hidden" name="t3" value="M" />
          <input type="hidden" name="src" value="1" />
          
          <button 
            type="submit" 
            className="w-full min-h-[50px] text-base mt-3 rounded font-bold cursor-pointer border-none"
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
          >
            SELECT PLAN ($69)
          </button>
        </form>
      </div>

      {/* Single 1-Year Pass */}
      <div className="rounded-xl p-5 bg-card shadow-md flex flex-col justify-between min-h-[250px]" style={{ border: '2px solid gold' }}>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Single 1-Year Pass</h3>
          <div className="text-2xl font-bold text-foreground mt-2">
            $129.00 <span className="text-sm font-normal text-muted-foreground">/ year</span>
          </div>
          <p className="text-muted-foreground mt-2">Best Value. Save 45% vs Bi-Monthly.</p>
        </div>
        
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
          <input type="hidden" name="cmd" value="_xclick" />
          <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
          <input type="hidden" name="item_name" value="Cloud Hosting - Single (1 Year Pass)" />
          <input type="hidden" name="amount" value="129.00" />
          <input type="hidden" name="no_shipping" value="1" />
          <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?amount=129&type=Single+1-Year+Pass" />
          <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
          
          <button 
            type="submit" 
            className="w-full min-h-[50px] text-base mt-3 rounded font-bold cursor-pointer border-none"
            style={{ backgroundColor: '#FFD700', color: 'black' }}
          >
            BUY 1-YEAR PASS
          </button>
        </form>
      </div>

      {/* Couple 1-Year Pass */}
      <div className="rounded-xl p-5 bg-card shadow-md flex flex-col justify-between min-h-[250px]" style={{ border: '2px solid gold' }}>
        <div>
          <h3 className="text-xl font-semibold text-foreground">Couple 1-Year Pass</h3>
          <div className="text-2xl font-bold text-foreground mt-2">
            $219.00 <span className="text-sm font-normal text-muted-foreground">/ year</span>
          </div>
          <p className="text-muted-foreground mt-2">Best Value. Save 47% vs Bi-Monthly.</p>
        </div>
        
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
          <input type="hidden" name="cmd" value="_xclick" />
          <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
          <input type="hidden" name="item_name" value="Cloud Hosting - Joint (1 Year Pass)" />
          <input type="hidden" name="amount" value="219.00" />
          <input type="hidden" name="no_shipping" value="1" />
          <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?amount=219&type=Couple+1-Year+Pass" />
          <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
          
          <button 
            type="submit" 
            className="w-full min-h-[50px] text-base mt-3 rounded font-bold cursor-pointer border-none"
            style={{ backgroundColor: '#FFD700', color: 'black' }}
          >
            BUY 1-YEAR PASS
          </button>
        </form>
      </div>
    </div>
  );
};
