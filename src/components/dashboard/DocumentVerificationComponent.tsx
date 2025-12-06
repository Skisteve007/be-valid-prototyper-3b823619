import React, { useState } from 'react';

type VerificationStatus = 'IDLE' | 'EXTERNAL_SESSION_ACTIVE' | 'VERIFIED' | 'FAILED';

const DocumentVerificationComponent: React.FC = () => {
    const [selectedDocType, setSelectedDocType] = useState<'dl' | 'passport'>('dl'); 
    const [status, setStatus] = useState<VerificationStatus>('IDLE'); 
    
    const handleRedirect = (partner: 'veriff' | 'onfido') => {
        setStatus('EXTERNAL_SESSION_ACTIVE');
        const demoUrl = partner === 'veriff' ? 'https://www.veriff.com/demo' : 'https://onfido.com/demo/';
        alert(`REDIRECTING SECURITY ALERT: Leaving VALID to scan with ${partner.toUpperCase()}.`);
        window.open(demoUrl, '_blank');
    };

    const handleCheckStatus = () => {
        const isSuccess = Math.random() > 0.2; 
        if (isSuccess) {
            setStatus('VERIFIED');
        } else {
            setStatus('FAILED');
            alert("Partner reported an issue. Please try again.");
        }
    };

    return (
        <div className="p-6 bg-gray-900 rounded-lg shadow-xl border border-gray-600 mt-8">
            <div className="mb-6 border-b border-gray-700 pb-4">
                <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    🆔 Identity Verification Hub
                </h3>
                <p className="text-sm text-gray-400 mt-1">Liability Firewall: Documents processed externally.</p>
            </div>

            <div className="space-y-6">
                <div className="p-4 bg-gray-800 rounded border-l-4 border-gray-500">
                    <h4 className="text-sm font-bold text-gray-400 uppercase mb-3">1. Select Document to Scan</h4>
                    <div className="flex space-x-6">
                        <div onClick={() => status !== 'VERIFIED' && setSelectedDocType('dl')} className={`flex items-center space-x-3 cursor-pointer p-3 rounded border transition-all ${selectedDocType === 'dl' ? 'bg-blue-900/40 border-blue-500' : 'border-transparent hover:bg-gray-700'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedDocType === 'dl' ? 'border-blue-500' : 'border-gray-500'}`}>
                                {selectedDocType === 'dl' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                            </div>
                            <span className="text-white font-medium">Driver&apos;s License</span>
                        </div>
                        <div onClick={() => status !== 'VERIFIED' && setSelectedDocType('passport')} className={`flex items-center space-x-3 cursor-pointer p-3 rounded border transition-all ${selectedDocType === 'passport' ? 'bg-blue-900/40 border-blue-500' : 'border-transparent hover:bg-gray-700'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedDocType === 'passport' ? 'border-blue-500' : 'border-gray-500'}`}>
                                {selectedDocType === 'passport' && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                            </div>
                            <span className="text-white font-medium">Passport</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-gray-800 rounded border-l-4 border-blue-500">
                    <h4 className="text-sm font-bold text-blue-400 uppercase mb-3">2. Launch External Verification</h4>
                    {(status === 'IDLE' || status === 'FAILED') && (
                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={() => handleRedirect('veriff')} className="p-4 border-2 border-gray-600 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition-all text-center">
                                <h5 className="font-bold text-white text-lg">Veriff</h5>
                                <p className="text-xs text-blue-300 mt-1">LAUNCH SECURE SITE ↗</p>
                            </button>
                            <button onClick={() => handleRedirect('onfido')} className="p-4 border-2 border-gray-600 rounded-lg hover:border-blue-500 hover:bg-gray-700 transition-all text-center">
                                <h5 className="font-bold text-white text-lg">Onfido</h5>
                                <p className="text-xs text-blue-300 mt-1">LAUNCH SECURE SITE ↗</p>
                            </button>
                        </div>
                    )}

                    {status === 'EXTERNAL_SESSION_ACTIVE' && (
                        <div className="text-center py-6 bg-blue-900/20 border border-blue-500 rounded-lg animate-pulse">
                            <h3 className="text-xl font-bold text-white mb-2">EXTERNAL SESSION ACTIVE</h3>
                            <button onClick={handleCheckStatus} className="px-6 py-2 bg-green-400 text-black font-bold rounded shadow-lg hover:scale-105 transition-transform">I HAVE COMPLETED THE SCAN</button>
                        </div>
                    )}
                    {status === 'VERIFIED' && (
                        <div className="text-center py-6 bg-green-900/20 border border-green-400 rounded-lg">
                            <h3 className="text-xl font-bold text-white mb-2">✔ VERIFICATION COMPLETE</h3>
                            <p className="text-sm text-green-400">Identity & Liveness Confirmed.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DocumentVerificationComponent;
