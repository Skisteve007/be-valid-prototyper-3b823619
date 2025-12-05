import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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

        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Terms of Service</h1>
          <p className="text-muted-foreground mb-6">Last Updated: January 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using VALID, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Service Description</h2>
            <p className="text-muted-foreground">
              VALID is a peer-to-peer health information sharing platform. We are NOT a medical service provider, diagnostic tool, or healthcare facility. We provide a platform for adults to voluntarily share verified health information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Eligibility</h2>
            <p className="text-muted-foreground">
              You must be at least 18 years of age to use VALID. By using this service, you represent and warrant that you meet this age requirement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. User Generated Content (UGC)</h2>
            <p className="font-semibold text-foreground">
              We have zero tolerance for objectionable content or abusive behavior.
            </p>
            <ul className="list-disc pl-6 mt-4 text-muted-foreground">
              <li>Users can block and report abusive behavior at any time</li>
              <li>We reserve the right to ban users immediately for violations of our policies</li>
              <li>Prohibited content includes: harassment, hate speech, explicit sexual content, illegal activities, false health information, or any content that violates applicable laws</li>
              <li>Users are solely responsible for the content they upload and share</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Membership and Payments</h2>
            <p className="text-muted-foreground">
              Membership is provided on a subscription basis. By subscribing, you authorize recurring monthly charges. All sales are final and non-refundable as outlined in our Refund Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              VALID and its sponsors are held with NO LIABILITY for any health, financial, or informational consequences resulting from use of this service. You use this platform entirely at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">7. User Responsibilities</h2>
            <ul className="list-disc pl-6 text-muted-foreground">
              <li>Provide accurate and truthful health information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Respect other users and their privacy</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate your account at any time for violation of these terms, without notice or refund.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8 border-l-4 border-yellow-500 pl-6 bg-yellow-500/10 p-6 rounded-r">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-400">10. Laboratory Integration Disclaimer</h2>
            <p className="font-bold mb-4 text-yellow-300">
              ⚠️ CRITICAL LEGAL NOTICE: VALID is NOT affiliated with, endorsed by, or responsible for any laboratory testing facility or lab integrator.
            </p>
            <div className="space-y-4 text-muted-foreground">
              <p>
                <strong className="text-foreground">No Medical Relationship:</strong> VALID does NOT provide medical services, laboratory testing, diagnostic services, or healthcare advice. We are solely a technology platform that facilitates the communication of test result statuses.
              </p>
              <p>
                <strong className="text-foreground">Lab Partner Responsibility:</strong> Any laboratory or testing facility ("Lab Partner") that integrates with VALID's API:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Is solely and exclusively responsible for HIPAA compliance and all federal, state, and local healthcare privacy laws</li>
                <li>Must maintain their own Business Associate Agreements (BAAs) with patients</li>
                <li>Is responsible for all medical testing, result accuracy, and patient care</li>
                <li>Must implement and maintain appropriate technical, physical, and administrative safeguards for Protected Health Information (PHI)</li>
                <li>Bears full liability for any breach of patient data or HIPAA violations</li>
              </ul>
              <p>
                <strong className="text-foreground">VALID's Limited Role:</strong> VALID provides ONLY a secure API endpoint for receiving test result status updates (e.g., "negative," "positive," "inconclusive"). We do NOT:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Store, access, or process any Protected Health Information (PHI) beyond basic result status</li>
                <li>Conduct medical testing or diagnostics</li>
                <li>Provide medical advice or interpretation of test results</li>
                <li>Act as a healthcare provider or Business Associate under HIPAA</li>
                <li>Assume any liability for lab results, medical decisions, or patient outcomes</li>
              </ul>
              <p>
                <strong className="text-foreground">Data Protection:</strong> Lab Partners must ensure that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All PHI is encrypted in transit using industry-standard protocols (TLS 1.2+)</li>
                <li>API keys are stored securely and never exposed in client-side code</li>
                <li>Only minimum necessary information is transmitted via the API</li>
                <li>Patient consent is obtained for result sharing through VALID</li>
              </ul>
              <p className="font-bold mt-4 text-yellow-300">
                By using VALID's laboratory integration API, Lab Partners acknowledge they have read, understood, and agree to comply with all terms of this disclaimer. Lab Partners indemnify and hold harmless VALID from any claims, damages, or liabilities arising from lab services, test results, or HIPAA compliance failures.
              </p>
            </div>
          </section>

          <section className="mb-8 border-l-4 border-primary pl-6 bg-primary/10 p-6 rounded-r">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Confidentiality & Restricted Use</h2>
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold mb-2 text-foreground">1. Confidential Information</h3>
                <p>
                  "Confidential Information" includes all proprietary, technical, operational, and business information disclosed through the Platform, including but not limited to system workflows, verification logic, matching algorithms, operational processes, and non-public features or data.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">2. Use & Protection</h3>
                <p>
                  You agree to protect Confidential Information using at least the same degree of care you use to protect your own sensitive information, and no less than a reasonable standard of care.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">3. No Unauthorized Disclosure</h3>
                <p>
                  You agree not to disclose, publish, transfer, distribute, or allow access to Confidential Information to any third party without VALID's express written authorization.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">4. No Copying or Reverse Engineering</h3>
                <p>
                  You agree not to copy, reproduce, modify, scrape, decompile, disassemble, reverse engineer, attempt to derive source code, or create derivative works from any part of VALID's systems, the BeValid.app website, or any proprietary technology or processes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-foreground">5. Term</h3>
                <p>
                  These confidentiality obligations shall remain in effect for five (5) years from acceptance or as long as the information remains confidential, whichever is longer.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-foreground">12. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms of Service, please contact us through our support channels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;