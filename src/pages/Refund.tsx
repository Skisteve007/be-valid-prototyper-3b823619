import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Refund = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1">
        <Link to="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <div className="max-w-4xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
          <p className="text-muted-foreground mb-6">Last Updated: January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">No Refunds Policy</h2>
            <p className="text-lg font-semibold text-destructive mb-4">
              All sales are final. No refunds will be provided.
            </p>
            <p>
              Because Clean Check is a digital subscription service that provides immediate access to verified health status sharing features, all membership contributions are non-refundable and final once processed.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Why No Refunds?</h2>
            <p>Our no-refund policy exists for several important reasons:</p>
            <ul className="list-disc pl-6 mt-4">
              <li><strong>Instant Digital Access:</strong> Upon payment, you immediately gain access to all membership features</li>
              <li><strong>QR Code Generation:</strong> Once your unique QR code is generated, the service has been fully rendered</li>
              <li><strong>Document Verification:</strong> Resources are allocated immediately to process and verify your health documentation</li>
              <li><strong>Platform Infrastructure:</strong> Costs are incurred instantly to maintain your secure member profile</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Subscription Cancellation</h2>
            <p>While we do not offer refunds, you may cancel your subscription at any time to prevent future charges:</p>
            <ul className="list-disc pl-6 mt-4">
              <li>Log into your PayPal account</li>
              <li>Navigate to Settings → Payments → Manage automatic payments</li>
              <li>Locate Clean Check subscription and click Cancel</li>
              <li>Your access will continue until the end of your current billing period</li>
            </ul>
            <p className="mt-4 font-semibold">
              Note: Canceling your subscription does not entitle you to a refund for the current billing period or any previous payments.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Exceptional Circumstances</h2>
            <p>
              In extremely rare cases involving technical errors on our part that prevent service delivery, we may consider refund requests on a case-by-case basis. To request review:
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li>Contact our support team within 48 hours of the charge</li>
              <li>Provide detailed documentation of the technical issue</li>
              <li>Demonstrate that the service was completely inaccessible</li>
            </ul>
            <p className="mt-4">
              Refund requests based on dissatisfaction, change of mind, or user error will not be approved.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Billing Disputes</h2>
            <p>
              If you believe you were charged in error or have concerns about a charge, please contact our support team immediately before initiating a chargeback with your payment provider.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Acknowledgment</h2>
            <p>
              By subscribing to Clean Check, you acknowledge that you have read, understood, and agree to this No Refunds Policy. You understand that all payments are final and non-refundable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Questions</h2>
            <p>
              If you have questions about this Refund Policy, please contact our support team before making a purchase.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Refund;
