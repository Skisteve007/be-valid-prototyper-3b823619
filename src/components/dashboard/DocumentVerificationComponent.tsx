// --- Secure Document Verification Component ---

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IdCard, BookUser, ScanFace, Shield, Check } from 'lucide-react';

type VerificationStatus = 'Pending' | 'Verifying...' | 'Camera Active...' | 'Verified (Third Party)' | 'Verified (Liveness Check)';

const DocumentVerificationComponent: React.FC = () => {

  // States to track verification status
  const [dlStatus, setDlStatus] = useState<VerificationStatus>('Pending');
  const [passportStatus, setPassportStatus] = useState<VerificationStatus>('Pending');
  const [faceStatus, setFaceStatus] = useState<VerificationStatus>('Pending');

  // Simulates calling the backend service, which then talks to the 3rd party IDV vendor
  const startVerificationFlow = async (documentType: 'DL' | 'Passport') => {
    alert(`Starting secure scan for ${documentType}...`);

    // CRITICAL: Text confirms liability shift to the user
    const confirmLiability = window.confirm(
      "By proceeding, you agree to share your document data with our certified third-party ID Verification Partner for authentication. This process keeps VALID's liability low."
    );

    if (confirmLiability) {
      // Placeholder API call to the backend, which proxies the data to the third-party IDV
      // CALL: backend.startIDV(userData.userId, documentType);

      // --- SIMULATION ---
      if (documentType === 'DL') setDlStatus('Verifying...');
      if (documentType === 'Passport') setPassportStatus('Verifying...');

      // Simulate successful response after a delay
      setTimeout(() => {
        if (documentType === 'DL') setDlStatus('Verified (Third Party)');
        if (documentType === 'Passport') setPassportStatus('Verified (Third Party)');
      }, 3000);
    }
  };

  // --- FACIAL RECOGNITION / LIVENESS CHECK ---
  const startLivenessCheck = async () => {
    setFaceStatus('Camera Active...');
    alert("Starting Liveness Check: Please turn your head RIGHT and LEFT as prompted by the camera.");

    // Placeholder call to the backend which uses the 3rd party vendor's Liveness SDK
    // CALL: backend.startLivenessCheck(userData.userId);

    // --- SIMULATION ---
    setTimeout(() => {
      setFaceStatus('Verified (Liveness Check)');
    }, 5000);
  };

  // Helper to determine status color
  const getStatusClass = (status: VerificationStatus): string => {
    if (status.includes('Verified')) return 'text-green-400 font-bold';
    if (status.includes('Pending')) return 'text-amber-500';
    return 'text-red-500';
  };

  const isVerified = (status: VerificationStatus): boolean => status.includes('Verified');

  return (
    <div className="p-6 bg-card rounded-lg shadow-xl border border-border mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-6 w-6 text-primary" />
        <h3 className="text-2xl font-bold text-foreground font-orbitron">
          Identity Verification Hub (IDV)
        </h3>
      </div>
      
      <div className="text-sm text-amber-500 mb-6 border p-3 rounded border-amber-500/50 bg-amber-500/10">
        <strong>Liability Firewall:</strong> All document authentication and facial recognition is handled by a certified third-party partner, insulating VALID from data authenticity claims.
      </div>

      <div className="space-y-4">

        {/* Driver's License Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <IdCard className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg text-foreground">Driver's License Scan</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => startVerificationFlow('DL')}
              disabled={isVerified(dlStatus)}
              variant={isVerified(dlStatus) ? "outline" : "default"}
              className={isVerified(dlStatus) ? 'border-green-500/50 text-green-400' : ''}
            >
              {isVerified(dlStatus) ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Verified
                </>
              ) : (
                'Start DL Scan'
              )}
            </Button>
            <span className={`min-w-[120px] text-right ${getStatusClass(dlStatus)}`}>{dlStatus}</span>
          </div>
        </div>

        {/* Passport Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <BookUser className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg text-foreground">Passport Scan</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => startVerificationFlow('Passport')}
              disabled={isVerified(passportStatus)}
              variant={isVerified(passportStatus) ? "outline" : "default"}
              className={isVerified(passportStatus) ? 'border-green-500/50 text-green-400' : ''}
            >
              {isVerified(passportStatus) ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Verified
                </>
              ) : (
                'Start Passport Scan'
              )}
            </Button>
            <span className={`min-w-[120px] text-right ${getStatusClass(passportStatus)}`}>{passportStatus}</span>
          </div>
        </div>

        <hr className="border-border my-4" />

        {/* Facial Liveness Check Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <ScanFace className="h-5 w-5 text-muted-foreground" />
            <span className="text-lg text-foreground">Facial Liveness Check</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={startLivenessCheck}
              disabled={isVerified(faceStatus)}
              variant={isVerified(faceStatus) ? "outline" : "secondary"}
              className={isVerified(faceStatus) ? 'border-green-500/50 text-green-400' : 'bg-purple-600 hover:bg-purple-700 text-white'}
            >
              {isVerified(faceStatus) ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Liveness Confirmed
                </>
              ) : (
                'Start Liveness Check'
              )}
            </Button>
            <span className={`min-w-[120px] text-right ${getStatusClass(faceStatus)}`}>{faceStatus}</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          <strong>Final Step:</strong> Once all three are verified, the <strong>ID Verified</strong> status is tokenized and added to your Incognito QR Code payload.
        </p>
      </div>
    </div>
  );
};

export default DocumentVerificationComponent;
