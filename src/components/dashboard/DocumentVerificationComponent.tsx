// *****************************************************************************
// FILE: DocumentVerificationComponent.tsx
// PURPOSE: IDV Hub - EXTERNAL HANDOFF (Zero-Liability Architecture)
// *****************************************************************************

import React, { useState } from 'react';
import { ExternalLink, CheckCircle } from 'lucide-react';

type DocType = 'dl' | 'passport';
type VerificationStatus = 'IDLE' | 'EXTERNAL_SESSION_ACTIVE' | 'VERIFIED' | 'FAILED';

const DocumentVerificationComponent: React.FC = () => {
  
  // --- STATE MANAGEMENT ---
  const [selectedDocType, setSelectedDocType] = useState<DocType>('dl');
  const [status, setStatus] = useState<VerificationStatus>('IDLE');
  
  // --- LOGIC: EXTERNAL REDIRECT ---
  const handleRedirect = (partner: 'veriff' | 'onfido') => {
    if (!selectedDocType) {
      alert("Please select a document type first.");
      return;
    }
    
    // 1. Set State to 'Waiting'
    setStatus('EXTERNAL_SESSION_ACTIVE');
    
    // 2. Open External Link (The Handoff)
    // In production, this URL comes from your backend API (e.g., /api/create-veriff-session)
    const demoUrl = partner === 'veriff' 
      ? 'https://www.veriff.com/demo' 
      : 'https://onfido.com/demo/';
      
    alert(`REDIRECTING SECURITY ALERT: You are now leaving VALID to perform a secure scan with ${partner.toUpperCase()}.`);
    
    window.open(demoUrl, '_blank');
  };

  // --- LOGIC: SIMULATE WEBHOOK/CALLBACK ---
  const handleCheckStatus = () => {
    // SIMULATION: 80% Success Rate
    const isSuccess = Math.random() > 0.2;
    
    if (isSuccess) {
      setStatus('VERIFIED');
    } else {
      setStatus('FAILED');
      alert("Partner reported an issue. Please try again.");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-900 rounded-lg shadow-xl border border-slate-600 mt-8">
      
      {/* HEADER */}
      <div className="mb-6 border-b border-slate-700 pb-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          🆔 Identity Verification Hub
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Liability Firewall: All documents are processed externally by certified partners.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* STEP 1: DOCUMENT TYPE */}
        <div className="p-4 bg-slate-800 rounded-lg border-l-4 border-slate-500">
          <h4 className="text-sm font-bold text-slate-400 uppercase mb-3">1. Select Document to Scan</h4>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            {/* Driver's License Option */}
            <div 
              onClick={() => status !== 'VERIFIED' && setSelectedDocType('dl')}
              className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition-all touch-manipulation ${
                selectedDocType === 'dl' 
                  ? 'bg-blue-900/40 border-blue-500' 
                  : 'border-transparent hover:bg-slate-700'
              } ${status === 'VERIFIED' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedDocType === 'dl' ? 'border-blue-500' : 'border-slate-500'
              }`}>
                {selectedDocType === 'dl' && <div className="w-3 h-3 rounded-full bg-blue-500" />}
              </div>
              <span className="text-white font-medium">Driver&apos;s License</span>
            </div>

            {/* Passport Option */}
            <div 
              onClick={() => status !== 'VERIFIED' && setSelectedDocType('passport')}
              className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition-all touch-manipulation ${
                selectedDocType === 'passport' 
                  ? 'bg-blue-900/40 border-blue-500' 
                  : 'border-transparent hover:bg-slate-700'
              } ${status === 'VERIFIED' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedDocType === 'passport' ? 'border-blue-500' : 'border-slate-500'
              }`}>
                {selectedDocType === 'passport' && <div className="w-3 h-3 rounded-full bg-blue-500" />}
              </div>
              <span className="text-white font-medium">Passport</span>
            </div>
          </div>
        </div>

        {/* STEP 2: PARTNER REDIRECT */}
        <div className="p-4 bg-slate-800 rounded-lg border-l-4 border-blue-500">
          <h4 className="text-sm font-bold text-blue-400 uppercase mb-3">2. Launch External Verification</h4>
          <p className="text-xs text-slate-500 mb-4">
            *Clicking below will open a secure window. VALID never touches your raw ID data.
          </p>
          
          {(status === 'IDLE' || status === 'FAILED') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => handleRedirect('veriff')}
                className="p-4 border-2 border-slate-600 rounded-lg hover:border-blue-500 hover:bg-slate-700 transition-all text-center touch-manipulation min-h-[80px]"
              >
                <h5 className="font-bold text-white text-lg">Veriff</h5>
                <p className="text-xs text-blue-300 mt-1 flex items-center justify-center gap-1">
                  LAUNCH SECURE SITE <ExternalLink className="h-3 w-3" />
                </p>
              </button>

              <button 
                onClick={() => handleRedirect('onfido')}
                className="p-4 border-2 border-slate-600 rounded-lg hover:border-blue-500 hover:bg-slate-700 transition-all text-center touch-manipulation min-h-[80px]"
              >
                <h5 className="font-bold text-white text-lg">Onfido</h5>
                <p className="text-xs text-blue-300 mt-1 flex items-center justify-center gap-1">
                  LAUNCH SECURE SITE <ExternalLink className="h-3 w-3" />
                </p>
              </button>
            </div>
          )}

          {/* STATUS: EXTERNAL SESSION ACTIVE */}
          {status === 'EXTERNAL_SESSION_ACTIVE' && (
            <div className="text-center py-6 bg-blue-900/20 border border-blue-500 rounded-lg animate-pulse">
              <h3 className="text-xl font-bold text-white mb-2">EXTERNAL SESSION ACTIVE</h3>
              <p className="text-sm text-blue-300 mb-4">Please complete the scan in the new window.</p>
              
              <button 
                onClick={handleCheckStatus}
                className="px-6 py-3 bg-green-400 text-black font-bold rounded-lg shadow-lg hover:scale-105 transition-transform touch-manipulation min-h-[48px]"
              >
                I HAVE COMPLETED THE SCAN
              </button>
            </div>
          )}

          {/* STATUS: VERIFIED */}
          {status === 'VERIFIED' && (
            <div className="text-center py-6 bg-green-900/20 border border-green-400 rounded-lg">
              <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white mb-2">VERIFICATION COMPLETE</h3>
              <p className="text-sm text-green-400">
                Partner confirmed Identity & Liveness. Your Profile is Updated.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DocumentVerificationComponent;
