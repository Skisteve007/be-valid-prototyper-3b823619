import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

const Terms = () => {
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
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">Last Updated: January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using Clean Check, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p>
              Clean Check is a peer-to-peer health information sharing platform. We are NOT a medical service provider, diagnostic tool, or healthcare facility. We provide a platform for adults to voluntarily share verified health information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Eligibility</h2>
            <p>
              You must be at least 18 years of age to use Clean Check. By using this service, you represent and warrant that you meet this age requirement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. User Generated Content (UGC)</h2>
            <p className="font-semibold">
              We have zero tolerance for objectionable content or abusive behavior.
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li>Users can block and report abusive behavior at any time</li>
              <li>We reserve the right to ban users immediately for violations of our policies</li>
              <li>Prohibited content includes: harassment, hate speech, explicit sexual content, illegal activities, false health information, or any content that violates applicable laws</li>
              <li>Users are solely responsible for the content they upload and share</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Membership and Payments</h2>
            <p>
              Membership is provided on a subscription basis. By subscribing, you authorize recurring monthly charges. All sales are final and non-refundable as outlined in our Refund Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Limitation of Liability</h2>
            <p>
              Clean Check and its sponsors are held with NO LIABILITY for any health, financial, or informational consequences resulting from use of this service. You use this platform entirely at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. User Responsibilities</h2>
            <ul className="list-disc pl-6">
              <li>Provide accurate and truthful health information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Respect other users and their privacy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time for violation of these terms, without notice or refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p>
              We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
            <p>
              For questions about these Terms of Service, please contact us through our support channels.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Terms;
