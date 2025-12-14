import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield, Lock, Check, Sparkles, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Footer from "@/components/Footer";

const investorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  linkedin_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  accredited_confirmed: z.boolean().refine((val) => val === true, {
    message: "You must confirm accredited investor status",
  }),
});

type InvestorFormData = z.infer<typeof investorFormSchema>;

const InvestorPortal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<InvestorFormData>({
    resolver: zodResolver(investorFormSchema),
    defaultValues: {
      name: "",
      email: "",
      linkedin_url: "",
      accredited_confirmed: false,
    },
  });

  const onSubmit = async (data: InvestorFormData) => {
    setIsSubmitting(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const utmSource = urlParams.get("utm_source") || null;

      const { error } = await supabase.from("investor_leads").insert({
        name: data.name,
        email: data.email,
        linkedin_url: data.linkedin_url || null,
        accredited_confirmed: data.accredited_confirmed,
        tranche_interest: "launch_round",
        utm_source: utmSource,
      });

      if (error) throw error;

      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Error submitting investor lead:", error);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWaitlist = async () => {
    toast.info("Series Seed round opening Q2 2026. We'll notify you when available.");
  };

  return (
    <>
      <Helmet>
        <title>Investor Portal | Valid™ Funding Tranches</title>
        <meta name="description" content="Invest in Valid™ - Priority access to our Launch Round. Limited allocation for accredited investors." />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-foreground">
              Investor Portal
            </h1>
            <p className="text-muted-foreground mt-1 tracking-wide">Funding Opportunities</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 md:py-12 space-y-8 md:space-y-12">
          {/* Priority Access Section Header */}
          <div className="text-center mb-4">
            <div className="inline-block px-6 py-2 rounded-full border border-primary/30 bg-primary/5 mb-4">
              <span className="text-primary text-sm font-semibold tracking-widest uppercase">Priority Access</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-wider">
              Launch Round
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-4"></div>
          </div>

          {/* SECTION 1: Launch Round (Active) */}
          <section className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-cyan-500/20 to-primary/20 rounded-2xl blur-xl opacity-50"></div>
            <div className="relative border-2 border-primary/40 rounded-2xl bg-card/80 backdrop-blur-sm p-6 md:p-10 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
              {/* Now Open Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-sm font-semibold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                  NOW OPEN
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-400 text-xs font-semibold tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  LIMITED ALLOCATION
                </span>
              </div>

              <h3 className="text-2xl md:text-4xl font-bold text-foreground tracking-wider mb-2">
                Tranche 1: Launch Round (Friends & Family)
              </h3>
              <p className="text-xl md:text-2xl text-primary font-semibold tracking-wide mb-8">
                $200,000 Target Raise
              </p>

              {/* Terms Card */}
              <div className="bg-background/60 rounded-xl border border-border/60 overflow-hidden mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/60">
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Instrument</p>
                    <p className="text-foreground font-semibold tracking-wide">Convertible Note</p>
                  </div>
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Valuation Cap</p>
                    <p className="text-foreground font-semibold tracking-wide">$200,000</p>
                  </div>
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Discount</p>
                    <p className="text-primary font-semibold tracking-wide">50% on Series Seed</p>
                  </div>
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Minimum Check</p>
                    <p className="text-foreground font-semibold tracking-wide">$10,000</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col items-start gap-3">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wider px-8 py-6 text-base shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Request Access
                </Button>
                <p className="text-xs text-muted-foreground tracking-wide">
                  Allocation is limited. Accredited investors only.
                </p>
              </div>
            </div>
          </section>

          {/* Future Round Section Header */}
          <div className="text-center mb-4 opacity-60">
            <div className="inline-block px-6 py-2 rounded-full border border-border/30 bg-muted/20 mb-4">
              <span className="text-muted-foreground text-sm font-semibold tracking-widest uppercase">Future Round</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-muted-foreground tracking-wider">
              Series Seed
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-border to-transparent mx-auto mt-4"></div>
          </div>

          {/* SECTION 2: Series Seed (Locked) */}
          <section className="relative opacity-60">
            <div className="border border-border/40 rounded-2xl bg-muted/30 p-6 md:p-10">
              {/* Locked Badge */}
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted border border-border text-muted-foreground text-sm font-semibold tracking-wider">
                  <Lock className="w-3.5 h-3.5" />
                  LOCKED
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted border border-border text-muted-foreground text-xs font-semibold tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  COMING 2026
                </span>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold text-muted-foreground tracking-wider mb-2">
                Tranche 2: Series Seed
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-semibold tracking-wide mb-8">
                $1.5 Million Target Raise
              </p>

              {/* Terms Card - Muted */}
              <div className="bg-background/30 rounded-xl border border-border/40 overflow-hidden mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/40">
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-muted-foreground/70 uppercase tracking-widest mb-1">Instrument</p>
                    <p className="text-muted-foreground font-semibold tracking-wide">SAFE Note</p>
                  </div>
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-muted-foreground/70 uppercase tracking-widest mb-1">Valuation Cap</p>
                    <p className="text-muted-foreground font-semibold tracking-wide">TBD</p>
                  </div>
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-muted-foreground/70 uppercase tracking-widest mb-1">Discount</p>
                    <p className="text-muted-foreground font-semibold tracking-wide">Standard</p>
                  </div>
                  <div className="p-4 md:p-6">
                    <p className="text-xs text-muted-foreground/70 uppercase tracking-widest mb-1">Minimum Check</p>
                    <p className="text-muted-foreground font-semibold tracking-wide">$25,000</p>
                  </div>
                </div>
              </div>

              {/* CTA - Disabled */}
              <Button
                onClick={handleWaitlist}
                variant="outline"
                size="lg"
                className="font-bold tracking-wider px-8 py-6 text-base border-border/60 text-muted-foreground hover:bg-muted/50"
              >
                Join Waitlist
              </Button>
            </div>
          </section>

          {/* Legal Disclaimer Footer */}
          <footer className="border-t border-border/40 pt-8 pb-4">
            <p className="text-xs md:text-[13px] text-muted-foreground/70 leading-relaxed tracking-wide max-w-4xl">
              <strong>IMPORTANT DISCLOSURES:</strong> This page is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities. Any offering will be made only to accredited investors pursuant to a formal offering memorandum. Investment involves significant risk, including the potential loss of your entire investment. Past performance is not indicative of future results. Giant Ventures LLC and its affiliates make no representations or warranties regarding the information presented.
            </p>
          </footer>
        </div>

        <Footer />

        {/* Request Access Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold tracking-wider flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Request Access
              </DialogTitle>
              <DialogDescription className="text-muted-foreground tracking-wide">
                Submit your information to request allocation in our Launch Round.
              </DialogDescription>
            </DialogHeader>

            {isSubmitted ? (
              <div className="py-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 tracking-wide">Thank You</h3>
                <p className="text-muted-foreground tracking-wide">
                  We'll be in touch within 48 hours.
                </p>
                <Button
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsSubmitted(false);
                  }}
                  className="mt-6"
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John Smith"
                            {...field}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="linkedin_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground flex items-center gap-2">
                          LinkedIn URL
                          <span className="text-xs text-muted-foreground">(optional)</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="https://linkedin.com/in/yourprofile"
                            {...field}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accredited_confirmed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border/60 p-4 bg-muted/30">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-foreground text-sm cursor-pointer">
                            I confirm I am an accredited investor as defined by{" "}
                            <a
                              href="https://www.sec.gov/education/capitalraising/building-blocks/accredited-investor"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center gap-1"
                            >
                              SEC Rule 501
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wider py-6"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default InvestorPortal;
