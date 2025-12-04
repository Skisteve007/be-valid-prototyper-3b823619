import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  
  return (
    <footer className="w-full mt-auto border-t-2 border-gray-400" style={{ backgroundColor: '#e5e7eb' }}>
      <div className="container mx-auto px-4 py-4">
        {/* Compact Legal Section */}
        <div className="text-[12px] leading-relaxed space-y-1.5 mb-3" style={{ color: '#000000' }}>
          <p>© 2025 Clean Check. All Rights Reserved. Clean Check™, The Safety Shield™, Dual-Verification System™ pending trademarks. Protected under U.S. Copyright Law.</p>
          <p><strong>Disclaimer:</strong> Clean Check is a technology platform, not a healthcare provider. Services are for informational purposes only. All testing by independent CLIA-certified labs. HIPAA-compliant. We do not sell PHI.</p>
        </div>

        {/* Links & Compliance Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[12px] border-t-2 border-gray-400 pt-3" style={{ color: '#000000' }}>
          <Link to="/terms" className="hover:opacity-70 transition-colors underline font-medium" style={{ color: '#000000' }}>Terms</Link>
          <span style={{ color: '#000000' }}>|</span>
          <Link to="/privacy" className="hover:opacity-70 transition-colors underline font-medium" style={{ color: '#000000' }}>Privacy</Link>
          <span style={{ color: '#000000' }}>|</span>
          <Link to="/refund" className="hover:opacity-70 transition-colors underline font-medium" style={{ color: '#000000' }}>Refund</Link>
          <span style={{ color: '#000000' }}>•</span>
          <span style={{ color: '#000000' }}>🔞 18 U.S.C. § 2257: All users 18+</span>
          <span className="ml-auto">
            <button
              onClick={() => navigate("/admin")}
              className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all duration-200 hover:brightness-110 focus:outline-none text-white animate-pulse"
              style={{
                backgroundColor: '#9333ea',
                boxShadow: '0 0 20px rgba(147, 51, 234, 0.9), 0 0 40px rgba(168, 85, 247, 0.6), 0 0 60px rgba(147, 51, 234, 0.4)'
              }}
            >
              Admin
            </button>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;