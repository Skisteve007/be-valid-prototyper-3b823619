import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const PricingSection = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Quarterly Subscriptions */}
      <div>
        <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-slate-400 via-primary to-slate-600 bg-clip-text text-transparent">
          Quarterly Subscriptions
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Single Quarterly</CardTitle>
              <CardDescription className="text-center">Perfect for individual members</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-primary text-center">$39.00 / 3 Months</div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="flex justify-center">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Cloud Hosting - Single (Quarterly)" />
                <input type="hidden" name="no_shipping" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?amount=39&type=Single+Member" />
                <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
                <input type="hidden" name="a3" value="39.00" />
                <input type="hidden" name="p3" value="3" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" name="submit" alt="Subscribe" />
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-primary">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Couple Quarterly</CardTitle>
              <CardDescription className="text-center">Great for couples</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-primary text-center">$69.00 / 3 Months</div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="flex justify-center">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Cloud Hosting - Joint (Quarterly)" />
                <input type="hidden" name="no_shipping" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?amount=69&type=Joint+Couple" />
                <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
                <input type="hidden" name="a3" value="69.00" />
                <input type="hidden" name="p3" value="3" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" name="submit" alt="Subscribe" />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Annual Subscriptions */}
      <div>
        <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-slate-400 via-primary to-slate-600 bg-clip-text text-transparent">
          Annual Subscriptions
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-green-500">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Single Annual</CardTitle>
              <CardDescription className="text-center">12 months - save 20%</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-primary text-center">$129.00 / Year</div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="flex justify-center">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Cloud Hosting - Single (Annual)" />
                <input type="hidden" name="no_shipping" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?amount=129&type=Single+Annual" />
                <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
                <input type="hidden" name="a3" value="129.00" />
                <input type="hidden" name="p3" value="12" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" name="submit" alt="Subscribe" />
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-green-500">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Couple Annual</CardTitle>
              <CardDescription className="text-center">12 months - save 20%</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-primary text-center">$219.00 / Year</div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="flex justify-center">
                <input type="hidden" name="cmd" value="_xclick-subscriptions" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Cloud Hosting - Joint (Annual)" />
                <input type="hidden" name="no_shipping" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?amount=219&type=Joint+Annual" />
                <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
                <input type="hidden" name="a3" value="219.00" />
                <input type="hidden" name="p3" value="12" />
                <input type="hidden" name="t3" value="M" />
                <input type="hidden" name="src" value="1" />
                <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_subscribeCC_LG.gif" name="submit" alt="Subscribe" />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
