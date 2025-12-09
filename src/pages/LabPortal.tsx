import React, { useState } from 'react';
import { Database, Activity, Server, ShieldCheck, Zap, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';

const LabPortal = () => {
  const [showScripts, setShowScripts] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500 selection:text-black">

      {/* 1. HERO SECTION */}
      <header className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-900/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="inline-block mb-6 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-mono tracking-widest uppercase">
          For Clinical Partners
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter font-orbitron text-white">
          WHY LABS CHOOSE <span className="text-cyan-400">VALID</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          The infrastructure layer for high-volume toxicology and health status verification.
        </p>
      </header>

      {/* 2. VALUE PROPS (The 4 Pillars) */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Activity className="text-cyan-400"/>}
            title="High-Volume Client Access"
            desc="Instantly tap into exclusive affiliate communities, guaranteeing a consistent, mandated volume for Sexual Health and Toxicology testing."
          />
          <FeatureCard 
            icon={<Zap className="text-purple-400"/>}
            title="Real-Time API Integration"
            desc="Utilize our low-latency, FHIR-compatible API to securely and instantaneously power the member's VALID Status."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-green-400"/>}
            title="Automated Compliance"
            desc="The system automatically manages secure result sharing, offloading complex HIPAA/GDPR compliance from your internal team."
          />
          <FeatureCard 
            icon={<Database className="text-blue-400"/>}
            title="Zero-Friction Efficiency"
            desc="Upload results using batch processing and barcode scanning, minimizing manual entry and ensuring zero delays."
          />
        </div>
      </section>

      {/* 3. TECHNICAL SPECS (The Developer Section) */}
      <section className="py-24 bg-white/5 border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: The Specs List */}
          <div>
            <h2 className="text-3xl font-bold mb-8 font-orbitron">BUILT FOR MODERN <span className="text-cyan-400">API INTEGRATION</span></h2>
            <p className="text-gray-400 mb-8">Enterprise-grade infrastructure designed for seamless lab partner integration.</p>
            
            <div className="space-y-6">
              <SpecItem title="Real-time Webhook Event Inspector" desc="Live logging of every API interaction with payload inspection and replay capabilities." />
              <SpecItem title="Automated Sample Exception Engine" desc="Intelligent handling of sample issues and inconclusive results with auto-notifications." />
              <SpecItem title="Universal Lab Requisition Standard" desc="FHIR-compatible data schemas ensuring seamless integration with LIMS." />
              <SpecItem title="Comprehensive API Documentation" desc="Complete REST API docs with authentication standards and payload specs." />
            </div>

            {/* Compliance Badges */}
            <div className="flex flex-wrap gap-3 mt-10">
              <Badge text="FHIR R4 Compliant" color="border-cyan-500 text-cyan-400" />
              <Badge text="HIPAA-Ready" color="border-purple-500 text-purple-400" />
              <Badge text="2257 Compliance" color="border-green-500 text-green-400" />
              <Badge text="REST API + Webhooks" color="border-white/30 text-white" />
            </div>
          </div>

          {/* Right: The Console Visual */}
          <div className="bg-black border border-cyan-500/30 rounded-xl p-8 shadow-[0_0_50px_rgba(0,240,255,0.1)] relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-t-xl"></div>
            <div className="flex items-center gap-2 mb-6 border-b border-gray-800 pb-4">
              <Server size={20} className="text-cyan-400" />
              <span className="font-mono text-sm tracking-widest text-gray-300">LAB PARTNER CONSOLE</span>
            </div>
            
            <p className="text-gray-400 mb-6 text-sm">
              Already a partner? Access real-time data, manage compliance standards, and debug integrations through our enterprise-grade administrative suite.
            </p>

            <button className="w-full py-4 bg-cyan-900/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black font-bold font-mono text-sm transition rounded uppercase tracking-widest mb-4">
              ACCESS PARTNER DASHBOARD
            </button>
            <div className="text-center">
              <a href="#" className="text-xs text-gray-500 hover:text-white underline">View System Status</a>
            </div>
          </div>

        </div>
      </section>

      {/* 4. EXPLAINER SCRIPTS (Toggle Section) */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4 font-orbitron">ON-DEMAND EXPLAINER SERIES</h2>
        <p className="text-gray-400 mb-8">Review the 1-minute video scripts that clearly explain the VALID system to everyone—from the member to the CEO.</p>
        
        <button 
          onClick={() => setShowScripts(!showScripts)}
          className="flex items-center justify-center gap-2 mx-auto px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-full text-white font-bold transition border border-gray-700"
        >
          {showScripts ? 'HIDE SCRIPTS' : 'VIEW 1-MINUTE SCRIPTS'}
          {showScripts ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
        </button>

        {showScripts && (
          <div className="mt-8 p-8 bg-white/5 rounded-xl border border-white/10 text-left animate-fade-in">
            <h3 className="text-cyan-400 font-bold mb-2">Script 1: The Lab Director</h3>
            <p className="text-gray-300 italic mb-6">"Stop chasing patient follow-ups. VALID integrates directly with your LIMS via FHIR..."</p>
            <h3 className="text-cyan-400 font-bold mb-2">Script 2: The Member Experience</h3>
            <p className="text-gray-300 italic">"Walk in, scan, get tested. Your results hit your phone instantly. No paper, no waiting..."</p>
          </div>
        )}
      </section>

      {/* 5. PARTNER FORM */}
      <section className="py-24 bg-black relative">
         <div className="max-w-3xl mx-auto px-6">
           <div className="bg-gray-900/50 border border-white/10 p-10 rounded-2xl backdrop-blur-md">
             <div className="text-center mb-10">
               <div className="text-4xl mb-4">📈</div>
               <h2 className="text-3xl font-bold font-orbitron mb-2">PARTNER WITH VALID</h2>
               <p className="text-gray-400">Let's discuss how we can integrate your lab services.</p>
             </div>

             <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Name *</label>
                   <input type="text" className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-cyan-500 focus:outline-none transition" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Company *</label>
                   <input type="text" className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-cyan-500 focus:outline-none transition" />
                 </div>
               </div>
               
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Email *</label>
                 <input type="email" className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-cyan-500 focus:outline-none transition" />
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">API Documentation Link (Optional)</label>
                 <input type="text" className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-cyan-500 focus:outline-none transition" />
               </div>

               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Message</label>
                 <textarea className="w-full bg-black border border-gray-700 rounded p-3 text-white focus:border-cyan-500 focus:outline-none transition h-32"></textarea>
               </div>

               <button type="submit" className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded hover:scale-[1.02] transition shadow-lg shadow-cyan-900/20 uppercase tracking-widest">
                 Send Inquiry
               </button>
               <p className="text-center text-xs text-gray-500 mt-4">We typically respond to partner inquiries within 24 hours.</p>
             </form>
           </div>
         </div>
      </section>
    </div>
  );
};

// --- SUBCOMPONENTS ---
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FeatureCard = ({ icon, title, desc }: FeatureCardProps) => (
  <div className="bg-white/5 p-8 rounded-xl border border-white/10 hover:border-cyan-500/50 transition duration-300 hover:-translate-y-1">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-bold font-orbitron mb-2">{title}</h3>
    <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

interface SpecItemProps {
  title: string;
  desc: string;
}

const SpecItem = ({ title, desc }: SpecItemProps) => (
  <div className="flex gap-4">
    <div className="mt-1"><CheckCircle size={20} className="text-cyan-500" /></div>
    <div>
      <h4 className="font-bold text-white mb-1">{title}</h4>
      <p className="text-sm text-gray-400">{desc}</p>
    </div>
  </div>
);

interface BadgeProps {
  text: string;
  color: string;
}

const Badge = ({ text, color }: BadgeProps) => (
  <span className={`px-3 py-1 rounded text-xs font-bold border ${color} bg-black/50`}>
    {text}
  </span>
);

export default LabPortal;
