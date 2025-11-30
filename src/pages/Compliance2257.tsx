import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

const Compliance2257 = () => {
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
          <h1 className="text-4xl font-bold mb-8">18 U.S.C. § 2257 Compliance Notice</h1>
          <p className="text-muted-foreground mb-6">Record Keeping Requirements Compliance Statement</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Age Verification Statement</h2>
            <p className="text-lg font-semibold mb-4">
              🔞 All models, performers, and users appearing on this site are 18 years of age or older.
            </p>
            <p>
              Clean Check strictly enforces age verification requirements in compliance with 18 U.S.C. § 2257 and 28 C.F.R. § 75. We maintain comprehensive age verification records for all users who appear in any visual content on this platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Compliance with Federal Law</h2>
            <p>
              This website complies with all federal record-keeping requirements as set forth in:
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li>18 U.S.C. § 2257 - Record Keeping Requirements</li>
              <li>18 U.S.C. § 2257A - Record Keeping Requirements for Simulated Sexual Content</li>
              <li>28 C.F.R. § 75 - Regulations implementing 18 U.S.C. § 2257</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Record Keeping</h2>
            <p>
              All records required by 18 U.S.C. § 2257 and 28 C.F.R. § 75 for content hosted on this website are kept by the Custodian of Records at:
            </p>
            <div className="bg-muted p-6 rounded-lg mt-4">
              <p className="font-semibold mb-2">Custodian of Records</p>
              <p>Clean Check</p>
              <p>[Business Address]</p>
              <p>[City, State ZIP]</p>
              <p>Email: [compliance email]</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Age Verification Process</h2>
            <p>
              Clean Check employs a multi-layer age verification system:
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li>Mandatory age gate requiring users to confirm they are 18 years or older before accessing the site</li>
              <li>Government-issued identification verification during registration</li>
              <li>Ongoing monitoring and compliance checks</li>
              <li>Immediate removal of any content that violates age requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">User-Generated Content Policy</h2>
            <p>
              Users who upload any visual content must:
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li>Verify they are 18 years of age or older</li>
              <li>Confirm all individuals depicted in uploaded content are 18 years of age or older</li>
              <li>Maintain proof of age for all individuals depicted</li>
              <li>Agree to provide such records upon request by authorities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Reporting Violations</h2>
            <p>
              If you become aware of any content on this site that may violate age verification requirements, report it immediately:
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li>Use the "Report" button available on user profiles</li>
              <li>Email: [compliance email]</li>
              <li>We investigate all reports within 24 hours</li>
              <li>Verified violations result in immediate content removal and account termination</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Exemption Information</h2>
            <p>
              Clean Check is primarily a health information sharing platform. Content not subject to 18 U.S.C. § 2257 includes:
            </p>
            <ul className="list-disc pl-6 mt-4">
              <li>Profile photographs (non-sexual in nature)</li>
              <li>Health certification documents</li>
              <li>QR codes and verification badges</li>
              <li>Text-based health status information</li>
            </ul>
            <p className="mt-4">
              All sexually explicit content, if any, is subject to full compliance with 18 U.S.C. § 2257.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p>
              For questions regarding this compliance statement or to request inspection of records (authorized parties only), contact:
            </p>
            <p className="mt-4">
              <strong>Custodian of Records</strong><br />
              [Contact details]
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Compliance2257;
