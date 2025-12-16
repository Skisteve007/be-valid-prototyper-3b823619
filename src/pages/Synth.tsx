import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Code2, Palette, BarChart3, ToggleRight, Home, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Synth = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Code Lab',
      description: 'Build and test new VALID™ features in a sandbox environment.',
      Icon: Code2,
      colorClass: 'text-purple-400',
      bgClass: 'bg-purple-500/20',
    },
    {
      title: 'Design Lab',
      description: 'Explore new interfaces for the Universal Lifestyle Wallet.',
      Icon: Palette,
      colorClass: 'text-pink-400',
      bgClass: 'bg-pink-500/20',
    },
    {
      title: 'Analytics Lab',
      description: 'Prototype dashboards and metrics for enterprise partners.',
      Icon: BarChart3,
      colorClass: 'text-cyan-400',
      bgClass: 'bg-cyan-500/20',
    },
    {
      title: 'Feature Flags',
      description: 'Toggle experimental features on and off.',
      Icon: ToggleRight,
      colorClass: 'text-green-400',
      bgClass: 'bg-green-500/20',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Synth - VALID™ AI Lab</title>
        <meta name="description" content="Your AI-powered idea laboratory. Explore, create, and innovate with VALID™ Synth." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-purple-500/20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full bg-muted hover:bg-muted/80 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Synth — The VALID™ Idea Lab
                </h1>
                <p className="text-muted-foreground text-xs">Prototype new features, explore concepts, and shape the future of VALID™</p>
              </div>
            </div>
            
            <span className="text-purple-400 text-xs font-medium bg-purple-500/20 px-3 py-1 rounded-full">
              BETA
            </span>
          </div>
        </header>

        {/* Spacer */}
        <div className="h-20" />

        {/* Main Content */}
        <main className="p-4 sm:p-8 max-w-4xl mx-auto">
          {/* Hero */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-3xl p-8 mb-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6">
              <Brain className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Synth — The VALID™ Idea Lab
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
              Prototype new features, explore concepts, and shape the future of VALID™. This is your innovation sandbox.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="bg-card border border-border rounded-2xl p-6">
                <div className={`w-12 h-12 rounded-xl ${feature.bgClass} flex items-center justify-center mb-4`}>
                  <feature.Icon className={`w-6 h-6 ${feature.colorClass}`} />
                </div>
                <h3 className="text-foreground font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Coming Soon */}
          <div className="mt-8 p-6 bg-card border border-border rounded-2xl text-center">
            <p className="text-muted-foreground text-sm">
              More Synth features coming soon. This is your playground for innovation.
            </p>
          </div>
        </main>

        {/* Home FAB */}
        <button
          onClick={() => navigate('/')}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-muted/80 transition"
        >
          <Home className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};

export default Synth;
