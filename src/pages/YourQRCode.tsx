// *****************************************************************************
// FILE: src/pages/YourQRCode.tsx
// PURPOSE: CLEAN PAGE - Renders ONLY the New Master Dashboard
// *****************************************************************************

import React from 'react';
// Note: Navbar component does not exist - uncomment when created
// import Navbar from '../components/Navbar'; 
// This imports your complex banking component (The Masterpiece)
import IncognitoQRCodeGenerator from '../components/dashboard/IncognitoQRCodeGenerator';

// MOCK USER DATA
const MOCK_USER = {
    userId: 'user_12345',
    name: 'Steven Grillo',
    photoUrl: 'https://via.placeholder.com/150', 
    isVerified: true
};

const YourQRCode = () => {
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
                        Secure Control Center. Select venue, fund wallet, and activate.
                    </p>
                </div>

                {/* THE ONLY THING ON THE PAGE (The Master Component) */}
                <div className="w-full flex justify-center">
                    <IncognitoQRCodeGenerator userData={MOCK_USER} />
                </div>
            </main>
        </div>
    );
};

export default YourQRCode;
