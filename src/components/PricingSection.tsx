import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const PAYPAL_CLIENT_ID = "your-paypal-client-id-placeholder";

interface PricingSectionProps {
  onPaymentSuccess?: (amount: string, type: string) => void;
}

export const PricingSection = ({ onPaymentSuccess }: PricingSectionProps) => {
  const { toast } = useToast();

  const handleApprove = async (amount: string, type: string) => {
    try {
      // Notify admin via edge function
      await supabase.functions.invoke('notify-payment', {
        body: { amount, type, timestamp: new Date().toISOString() }
      });

      toast({
        title: "Payment Successful",
        description: `Payment Successful for $${amount}`,
      });

      onPaymentSuccess?.(amount, type);
    } catch (error) {
      console.error('Error notifying admin:', error);
    }
  };

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, vault: true, intent: "subscription" }}>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto p-6">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="text-2xl">Single Account</CardTitle>
            <CardDescription>Perfect for individual members</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-primary">$29.00</div>
            <p className="text-sm text-muted-foreground">per month</p>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: "29.00",
                      },
                      description: "Single Account Membership",
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                if (actions.order) {
                  await actions.order.capture();
                  await handleApprove("29.00", "Single");
                }
              }}
              onError={(err) => {
                console.error("PayPal error:", err);
                toast({
                  title: "Payment Failed",
                  description: "There was an error processing your payment.",
                  variant: "destructive",
                });
              }}
              style={{
                layout: "vertical",
                color: "blue",
                shape: "rect",
                label: "pay",
              }}
            />
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow border-primary">
          <CardHeader>
            <CardTitle className="text-2xl">Joint Account</CardTitle>
            <CardDescription>Great for couples</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold text-primary">$49.00</div>
            <p className="text-sm text-muted-foreground">per month</p>
            <PayPalButtons
              createOrder={(data, actions) => {
                return actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [
                    {
                      amount: {
                        currency_code: "USD",
                        value: "49.00",
                      },
                      description: "Joint Account Membership",
                    },
                  ],
                });
              }}
              onApprove={async (data, actions) => {
                if (actions.order) {
                  await actions.order.capture();
                  await handleApprove("49.00", "Joint");
                }
              }}
              onError={(err) => {
                console.error("PayPal error:", err);
                toast({
                  title: "Payment Failed",
                  description: "There was an error processing your payment.",
                  variant: "destructive",
                });
              }}
              style={{
                layout: "vertical",
                color: "blue",
                shape: "rect",
                label: "pay",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </PayPalScriptProvider>
  );
};
