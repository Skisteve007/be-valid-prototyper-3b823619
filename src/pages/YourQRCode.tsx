// *****************************************************************************
// FILE: src/pages/YourQRCode.tsx
// PURPOSE: CLEAN PAGE - BULLETPROOF IMPORT
// *****************************************************************************

import React from 'react';
// Note: Navbar component does not exist in this project yet
// import Navbar from '../components/Navbar'; 

// --- IMPORT SAFETY CHECK ---
// Component located at: src/components/dashboard/IncognitoQRCodeGenerator.tsx
import IncognitoQRCodeGenerator from '@/components/dashboard/IncognitoQRCodeGenerator';

const YourQRCode = () => {
    // MOCK USER DATA (Hardcoded for safety so the page never crashes)
    const safeUserData = {
        userId: 'user_active_001',
        name: 'Authorized Member',
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80', 
        isVerified: true
    };

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* <Navbar /> */}
            
            <main className="container mx-auto px-4 py-8">
                {/* HEADER */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        YOUR VALID ACCESS
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Secure Control Center
                    </p>
                </div>

                {/* THE MASTER COMPONENT */}
                <div className="w-full flex justify-center">
                    <IncognitoQRCodeGenerator userData={safeUserData} />
                </div>
            </main>
        </div>
    );
};

export default YourQRCode;
