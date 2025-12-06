// *****************************************************************************
// FILE: DocumentVerificationComponent.tsx
// PURPOSE: IDV Hub - User Selects Provider (Liability Shield) + Status Feedback
// *****************************************************************************

import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, Ban, Loader2 } from 'lucide-react';

const DocumentVerificationComponent: React.FC = () => {

  // --- STATE MANAGEMENT ---
  const [selectedDocType, setSelectedDocType] = useState<'dl' | 'passport'>('dl');
  const [selectedProvider, setSelectedProvider] = useState<'veriff' | 'onfido' | null>(null);

  // The Status Loop: 'IDLE', 'PROCESSING', 'GREEN', 'YELLOW', 'RED'
  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'PROCESSING' | 'GREEN' | 'YELLOW' | 'RED'>('IDLE');
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');

  // --- MOCK BACKEND / SDK SIMULATION ---

  const startProviderSession = () => {
    if (!selectedProvider) {
      alert("Please select a Verification Partner first.");
      return;
    }

    setVerificationStatus('PROCESSING');
    setFeedbackMessage(`Connecting to ${selectedProvider === 'veriff' ? 'Veriff' : 'Onfido'} Secure Server...`);

    // SIMULATION: This mimics the SDK callback flow
    // In production, the SDK returns a code, and your backend updates this status.
    setTimeout(() => {
      // RANDOMIZER FOR DEMO PURPOSES (To show you the flows)
      // 80% chance of Green, 10% Yellow, 10% Red
      const rand = Math.random();

      if (rand > 0.2) {
        // SCENARIO: GREEN (Good to Go)
        setVerificationStatus('GREEN');
        setFeedbackMessage("Identity & Liveness Confirmed. You are Verified.");
        // Backend: Update User Profile -> isVerified = true
      } else if (rand > 0.1) {
        // SCENARIO: YELLOW (Adjustment Needed)
        setVerificationStatus('YELLOW');
        setFeedbackMessage("Image Blurry or Glare Detected. Please clean camera and retry.");
      } else {
        // SCENARIO: RED (Rejected)
        setVerificationStatus('RED');
        setFeedbackMessage("Verification Failed. ID Invalid or Liveness Check Failed.");
      }
    }, 4000);
  };

  // --- HELPER: STATUS BADGES ---
  const renderStatusBadge = () => {
    switch (verificationStatus) {
      case 'GREEN':
        return (
          <div className="p-4 bg-green-900/30 border-2 border-green-400 rounded-lg text-center animate-pulse">
            <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-white">VERIFICATION SUCCESSFUL</h3>
            <p className="text-green-400">✔ {feedbackMessage}</p>
          </div>
        );
      case 'YELLOW':
        return (
          <div className="p-4 bg-yellow-900/30 border-2 border-amber-500 rounded-lg text-center">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-white">ADJUSTMENT NEEDED</h3>
            <p className="text-amber-500">⚠ {feedbackMessage}</p>
            <button onClick={startProviderSession} className="mt-2 text-sm underline text-slate-300 hover:text-white">
              Try Again
            </button>
          </div>
        );
      case 'RED':
        return (
          <div className="p-4 bg-red-900/30 border-2 border-red-500 rounded-lg text-center">
            <Ban className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-white">ACCESS DENIED</h3>
            <p className="text-red-400">⛔ {feedbackMessage}</p>
            <p className="text-xs text-slate-400 mt-2">Contact Support if you believe this is an error.</p>
          </div>
        );
      case 'PROCESSING':
        return (
          <div className="p-4 bg-blue-900/20 border border-blue-500 rounded-lg text-center">
            <Loader2 className="h-8 w-8 text-blue-400 mx-auto mb-2 animate-spin" />
            <h3 className="text-lg font-bold text-white">PROCESSING...</h3>
            <p className="text-blue-300 text-sm">Performing Biometric Analysis...</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-slate-900 rounded-lg shadow-xl border border-slate-600 mt-8">

      {/* HEADER */}
      <div className="mb-6 border-b border-slate-700 pb-4">
        <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          🆔 Identity Verification Hub
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Select a third-party partner to verify your documents and facial liveness.
        </p>
      </div>

      <div className="space-y-6">

        {/* STEP 1: DOCUMENT TYPE */}
        <div className="p-4 bg-slate-800 rounded border-l-4 border-slate-500">
          <h4 className="text-sm font-bold text-slate-400 uppercase mb-3">1. Select Document</h4>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={selectedDocType === 'dl'}
                onChange={() => setSelectedDocType('dl')}
                disabled={verificationStatus === 'GREEN'}
                className="text-blue-500 focus:ring-blue-500 h-4 w-4"
              />
              <span className="text-white">Driver&apos;s License</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={selectedDocType === 'passport'}
                onChange={() => setSelectedDocType('passport')}
                disabled={verificationStatus === 'GREEN'}
                className="text-blue-500 focus:ring-blue-500 h-4 w-4"
              />
              <span className="text-white">Passport</span>
            </label>
          </div>
        </div>

        {/* STEP 2: PROVIDER SELECTION (LIABILITY SHIELD) */}
        <div className="p-4 bg-slate-800 rounded border-l-4 border-blue-500">
          <h4 className="text-sm font-bold text-blue-400 uppercase mb-3">2. Select Verification Partner</h4>
          <p className="text-xs text-slate-500 mb-3">
            *By selecting a partner, you agree to their specific Terms of Service and Privacy Policy. VALID does not process your raw biometric data.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* VERIFF OPTION */}
            <div
              onClick={() => verificationStatus !== 'GREEN' && setSelectedProvider('veriff')}
              className={`p-3 rounded border-2 cursor-pointer transition-all text-center min-h-[80px] flex flex-col justify-center touch-manipulation ${
                selectedProvider === 'veriff'
                  ? 'border-blue-500 bg-slate-700'
                  : 'border-slate-600 hover:border-slate-500'
              } ${verificationStatus === 'GREEN' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <h5 className="font-bold text-white text-lg">Veriff</h5>
              <p className="text-xs text-slate-400">Fastest for Passports</p>
            </div>

            {/* ONFIDO OPTION */}
            <div
              onClick={() => verificationStatus !== 'GREEN' && setSelectedProvider('onfido')}
              className={`p-3 rounded border-2 cursor-pointer transition-all text-center min-h-[80px] flex flex-col justify-center touch-manipulation ${
                selectedProvider === 'onfido'
                  ? 'border-blue-500 bg-slate-700'
                  : 'border-slate-600 hover:border-slate-500'
              } ${verificationStatus === 'GREEN' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <h5 className="font-bold text-white text-lg">Onfido</h5>
              <p className="text-xs text-slate-400">Best for Driver&apos;s Licenses</p>
            </div>
          </div>
        </div>

        {/* STEP 3: ACTION & RESULTS */}
        <div className="p-4 bg-slate-800 rounded border-l-4 border-green-400">
          <h4 className="text-sm font-bold text-green-400 uppercase mb-3">3. Status & Results</h4>

          {/* START BUTTON */}
          {(verificationStatus === 'IDLE' || verificationStatus === 'YELLOW' || verificationStatus === 'RED') && (
            <button
              onClick={startProviderSession}
              disabled={!selectedProvider}
              className={`w-full py-3 rounded font-bold text-white shadow-lg transition-all min-h-[48px] touch-manipulation ${
                !selectedProvider
                  ? 'bg-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {selectedProvider
                ? `Start Scan with ${selectedProvider === 'veriff' ? 'Veriff' : 'Onfido'}`
                : 'Select a Partner Above'}
            </button>
          )}

          {/* STATUS DISPLAY AREA */}
          <div className="mt-4">
            {renderStatusBadge()}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentVerificationComponent;
