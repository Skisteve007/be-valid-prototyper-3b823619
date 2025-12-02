import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const PricingSection = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Bi-Monthly Subscriptions */}
      <div>
        <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-slate-400 via-primary to-slate-600 bg-clip-text text-transparent">
          Bi-Monthly Subscriptions
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Single Member</CardTitle>
              <CardDescription className="text-center">Billed every 60 days. Cancel anytime.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-primary text-center">$39.00 <span className="text-lg font-normal text-muted-foreground">/ 2 months</span></div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="flex flex-col items-center">
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
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                  SELECT PLAN ($39)
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-primary">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Joint Couple</CardTitle>
              <CardDescription className="text-center">Joint account. Billed every 60 days.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-primary text-center">$69.00 <span className="text-lg font-normal text-muted-foreground">/ 2 months</span></div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="flex flex-col items-center">
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
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                  SELECT PLAN ($69)
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 1-Year Passes */}
      <div>
        <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-slate-400 via-primary to-slate-600 bg-clip-text text-transparent">
          1-Year Passes
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 border-yellow-500">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Single 1-Year Pass</CardTitle>
              <CardDescription className="text-center">Best Value. Save 45% vs Bi-Monthly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-primary text-center">$129.00 <span className="text-lg font-normal text-muted-foreground">/ one-time</span></div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="flex flex-col items-center">
                <input type="hidden" name="cmd" value="_xclick" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Cloud Hosting - Single (1 Year Pass)" />
                <input type="hidden" name="amount" value="129.00" />
                <input type="hidden" name="no_shipping" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?amount=129&type=Single+1-Year+Pass" />
                <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                  BUY 1-YEAR PASS
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow border-2 border-yellow-500">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Couple 1-Year Pass</CardTitle>
              <CardDescription className="text-center">Best Value. Save 47% vs Bi-Monthly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold text-primary text-center">$219.00 <span className="text-lg font-normal text-muted-foreground">/ one-time</span></div>
              <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" className="flex flex-col items-center">
                <input type="hidden" name="cmd" value="_xclick" />
                <input type="hidden" name="business" value="Steve@bigtexasroof.com" />
                <input type="hidden" name="item_name" value="Cloud Hosting - Joint (1 Year Pass)" />
                <input type="hidden" name="amount" value="219.00" />
                <input type="hidden" name="no_shipping" value="1" />
                <input type="hidden" name="return" value="https://cleancheck.fit/payment-success?amount=219&type=Couple+1-Year+Pass" />
                <input type="hidden" name="cancel_return" value="https://cleancheck.fit" />
                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                  BUY 1-YEAR PASS
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
