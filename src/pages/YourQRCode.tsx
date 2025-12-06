// *****************************************************************************
// FILE: src/pages/YourQRCode.tsx
// PURPOSE: The Clean Container - Renders ONLY the Master Dashboard
// *****************************************************************************

import React from 'react';
import IncognitoQRCodeGenerator from '../components/dashboard/IncognitoQRCodeGenerator';

// MOCK DATA (Or pull from your Context/Auth)
const MOCK_USER = {
    userId: 'user_12345',
    name: 'Steven Grillo',
    photoUrl: 'https://via.placeholder.com/150', // Replace with real photo logic
    isVerified: true
};

const YourQRCode = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <main className="container mx-auto px-4 py-8">
                {/* HEADER SECTION */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        YOUR VALID ACCESS
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        This is your secure control center. Select your venue, fund your wallet, and activate your token.
                    </p>
                </div>

                {/* THE ONLY COMPONENT ALLOWED ON THIS PAGE */}
                <div className="w-full flex justify-center">
                    <IncognitoQRCodeGenerator userData={MOCK_USER} />
                </div>
            </main>
        </div>
    );
};

export default YourQRCode;
