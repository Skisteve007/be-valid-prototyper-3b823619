export const PricingSection = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3">
      {/* Single Member */}
      <div className="border border-border rounded-lg p-3 bg-card shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Single Member</h3>
          <div className="text-lg font-bold text-foreground mt-1">
            $39 <span className="text-xs font-normal text-muted-foreground">/ 60 days</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Bi-monthly. Cancel anytime.</p>
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
            className="w-full h-8 text-xs mt-2 rounded font-bold cursor-pointer border-none"
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
          >
            SELECT $39
          </button>
        </form>
      </div>

      {/* Joint Couple */}
      <div className="border border-border rounded-lg p-3 bg-card shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Joint Couple</h3>
          <div className="text-lg font-bold text-foreground mt-1">
            $69 <span className="text-xs font-normal text-muted-foreground">/ 60 days</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Joint account. Bi-monthly.</p>
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
            className="w-full h-8 text-xs mt-2 rounded font-bold cursor-pointer border-none"
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
          >
            SELECT $69
          </button>
        </form>
      </div>

      {/* Single 1-Year Pass */}
      <div className="rounded-lg p-3 bg-card shadow-sm flex flex-col justify-between" style={{ border: '2px solid gold' }}>
        <div>
          <h3 className="text-sm font-semibold text-foreground">1-Year Single</h3>
          <div className="text-lg font-bold text-foreground mt-1">
            $129 <span className="text-xs font-normal text-muted-foreground">/ year</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Save 45%</p>
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
            className="w-full h-8 text-xs mt-2 rounded font-bold cursor-pointer border-none"
            style={{ backgroundColor: '#FFD700', color: 'black' }}
          >
            BUY $129
          </button>
        </form>
      </div>

      {/* Couple 1-Year Pass */}
      <div className="rounded-lg p-3 bg-card shadow-sm flex flex-col justify-between" style={{ border: '2px solid gold' }}>
        <div>
          <h3 className="text-sm font-semibold text-foreground">1-Year Couple</h3>
          <div className="text-lg font-bold text-foreground mt-1">
            $219 <span className="text-xs font-normal text-muted-foreground">/ year</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Save 47%</p>
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
            className="w-full h-8 text-xs mt-2 rounded font-bold cursor-pointer border-none"
            style={{ backgroundColor: '#FFD700', color: 'black' }}
          >
            BUY $219
          </button>
        </form>
      </div>
    </div>
  );
};
