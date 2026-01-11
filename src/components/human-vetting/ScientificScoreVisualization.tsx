import React, { useEffect, useState } from 'react';
import { Brain, Zap, Shield, Target, Activity, Layers, Atom, Radar, Gauge, TrendingUp, AlertTriangle, CheckCircle2, Hexagon } from 'lucide-react';

interface ScoreCategory {
  name: string;
  shortName: string;
  score: number;
  color: string;
  tier: number;
  icon: React.ReactNode;
}

const SCORING_CATEGORIES: ScoreCategory[] = [
  { name: 'Epistemic Humility & Verification', shortName: 'VERIFY', score: 87, color: '#06B6D4', tier: 1, icon: <Shield className="w-4 h-4" /> },
  { name: 'Security Discipline & Data Hygiene', shortName: 'SECURE', score: 92, color: '#10B981', tier: 1, icon: <Target className="w-4 h-4" /> },
  { name: 'Clear Intent & Specification', shortName: 'INTENT', score: 78, color: '#F59E0B', tier: 1, icon: <Zap className="w-4 h-4" /> },
  { name: 'Multi-Model Orchestration', shortName: 'ORCH', score: 85, color: '#8B5CF6', tier: 2, icon: <Layers className="w-4 h-4" /> },
  { name: 'Structured Output Mastery', shortName: 'OUTPUT', score: 91, color: '#3B82F6', tier: 2, icon: <Brain className="w-4 h-4" /> },
  { name: 'Operational Circuit Breakers', shortName: 'SAFETY', score: 88, color: '#6366F1', tier: 2, icon: <AlertTriangle className="w-4 h-4" /> },
  { name: 'Dynamic Trust & Auditability', shortName: 'TRUST', score: 94, color: '#D946EF', tier: 3, icon: <CheckCircle2 className="w-4 h-4" /> },
  { name: 'Beneficial Ambition', shortName: 'AMBITION', score: 82, color: '#EC4899', tier: 3, icon: <Atom className="w-4 h-4" /> },
];

const ScientificScoreVisualization: React.FC = () => {
  const [animatedScores, setAnimatedScores] = useState<number[]>(SCORING_CATEGORIES.map(() => 0));
  const [scanLinePos, setScanLinePos] = useState(0);
  const overallScore = 87;

  useEffect(() => {
    // Animate scores on mount
    const timer = setTimeout(() => {
      setAnimatedScores(SCORING_CATEGORIES.map(c => c.score));
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Scanning line animation
    const interval = setInterval(() => {
      setScanLinePos(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Calculate radar chart points
  const calculateRadarPoints = (radius: number, scores: number[]) => {
    const angleStep = (2 * Math.PI) / scores.length;
    return scores.map((score, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (score / 100) * radius;
      return {
        x: 150 + r * Math.cos(angle),
        y: 150 + r * Math.sin(angle),
      };
    });
  };

  const radarPoints = calculateRadarPoints(120, animatedScores);
  const radarPath = radarPoints.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ') + ' Z';

  return (
    <div className="space-y-8">
      {/* Main Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
          <Radar className="w-6 h-6 text-cyan-400 animate-pulse" />
          <span className="text-lg md:text-xl font-bold text-cyan-400 tracking-wider">COGNITIVE ANALYSIS MATRIX</span>
        </div>
      </div>

      {/* Primary Score Display */}
      <div className="relative">
        {/* Scanning effect overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          <div 
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent blur-sm"
            style={{ top: `${scanLinePos}%`, transition: 'top 0.05s linear' }}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Radar Chart */}
          <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-cyan-500/30 shadow-[0_0_60px_rgba(6,182,212,0.15)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05)_0%,transparent_70%)]" />
            
            <h3 className="text-lg md:text-xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
              <Hexagon className="w-6 h-6" />
              DIMENSIONAL ANALYSIS
            </h3>

            <div className="relative flex justify-center">
              <svg viewBox="0 0 300 300" className="w-full max-w-[300px] md:max-w-[350px]">
                {/* Grid circles */}
                {[20, 40, 60, 80, 100].map((percent, i) => (
                  <circle
                    key={i}
                    cx="150"
                    cy="150"
                    r={(percent / 100) * 120}
                    fill="none"
                    stroke="rgba(6, 182, 212, 0.15)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Grid lines */}
                {SCORING_CATEGORIES.map((_, i) => {
                  const angle = (i * 2 * Math.PI) / SCORING_CATEGORIES.length - Math.PI / 2;
                  const endX = 150 + 130 * Math.cos(angle);
                  const endY = 150 + 130 * Math.sin(angle);
                  return (
                    <line
                      key={i}
                      x1="150"
                      y1="150"
                      x2={endX}
                      y2={endY}
                      stroke="rgba(6, 182, 212, 0.2)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Score polygon - glow effect */}
                <path
                  d={radarPath}
                  fill="rgba(6, 182, 212, 0.1)"
                  stroke="rgba(6, 182, 212, 0.6)"
                  strokeWidth="3"
                  filter="url(#glow)"
                  style={{ transition: 'all 1s ease-out' }}
                />

                {/* Score polygon - main */}
                <path
                  d={radarPath}
                  fill="url(#radarGradient)"
                  stroke="#06B6D4"
                  strokeWidth="2"
                  style={{ transition: 'all 1s ease-out' }}
                />

                {/* Data points */}
                {radarPoints.map((point, i) => (
                  <g key={i}>
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="6"
                      fill={SCORING_CATEGORIES[i].color}
                      stroke="#fff"
                      strokeWidth="2"
                      style={{ transition: 'all 1s ease-out' }}
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="10"
                      fill="none"
                      stroke={SCORING_CATEGORIES[i].color}
                      strokeWidth="1"
                      opacity="0.5"
                      className="animate-ping"
                      style={{ animationDuration: '2s', animationDelay: `${i * 0.2}s` }}
                    />
                  </g>
                ))}

                {/* Labels */}
                {SCORING_CATEGORIES.map((cat, i) => {
                  const angle = (i * 2 * Math.PI) / SCORING_CATEGORIES.length - Math.PI / 2;
                  const labelX = 150 + 145 * Math.cos(angle);
                  const labelY = 150 + 145 * Math.sin(angle);
                  return (
                    <text
                      key={i}
                      x={labelX}
                      y={labelY}
                      fill={cat.color}
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="uppercase tracking-wider"
                    >
                      {cat.shortName}
                    </text>
                  );
                })}

                {/* Gradients and filters */}
                <defs>
                  <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
                    <stop offset="100%" stopColor="rgba(139, 92, 246, 0.2)" />
                  </radialGradient>
                  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>
            </div>
          </div>

          {/* Central Score Gauge */}
          <div className="relative p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-violet-500/30 shadow-[0_0_60px_rgba(139,92,246,0.15)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_70%)]" />
            
            <h3 className="text-lg md:text-xl font-bold text-violet-400 mb-4 flex items-center gap-3">
              <Gauge className="w-6 h-6" />
              COMPOSITE OPERATOR SCORE
            </h3>

            <div className="relative flex flex-col items-center">
              {/* Main gauge */}
              <div className="relative w-56 h-56 md:w-64 md:h-64">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {/* Background track */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="rgba(139, 92, 246, 0.1)"
                    strokeWidth="12"
                  />
                  
                  {/* Tier markers */}
                  {[0, 25, 50, 75, 100].map((mark, i) => {
                    const angle = ((mark / 100) * 270 - 135) * (Math.PI / 180);
                    return (
                      <circle
                        key={i}
                        cx={100 + 85 * Math.cos(angle)}
                        cy={100 + 85 * Math.sin(angle)}
                        r="3"
                        fill="rgba(139, 92, 246, 0.5)"
                      />
                    );
                  })}

                  {/* Score arc */}
                  <circle
                    cx="100"
                    cy="100"
                    r="85"
                    fill="none"
                    stroke="url(#gaugeGradient)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={`${(animatedScores.reduce((a, b) => a + b, 0) / SCORING_CATEGORIES.length / 100) * 534} 534`}
                    style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                    filter="url(#gaugeGlow)"
                  />

                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="50%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <filter id="gaugeGlow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                </svg>

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl md:text-7xl font-black bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    {overallScore}
                  </div>
                  <div className="text-lg text-muted-foreground font-medium">/ 100</div>
                  <div className="mt-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm text-emerald-400 font-semibold">+4.2%</span>
                  </div>
                </div>
              </div>

              {/* Certification badge */}
              <div className="mt-6 flex flex-col items-center gap-3">
                <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <div className="w-4 h-4 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  <span className="text-xl font-bold text-emerald-400 tracking-wider">CERTIFIED</span>
                </div>
                <span className="text-sm text-muted-foreground">Verified AI Collaboration Competency</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="space-y-6">
        <h3 className="text-xl md:text-2xl font-bold text-foreground flex items-center gap-3">
          <Activity className="w-7 h-7 text-cyan-400" />
          PERFORMANCE METRICS BY DIMENSION
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {SCORING_CATEGORIES.map((cat, idx) => (
            <div 
              key={idx} 
              className="relative p-5 md:p-6 rounded-xl bg-gradient-to-br from-slate-900/60 to-slate-800/60 border border-border/50 overflow-hidden group hover:border-cyan-500/50 transition-all duration-300"
            >
              {/* Background gradient based on tier */}
              <div 
                className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                style={{ background: `linear-gradient(135deg, ${cat.color}40, transparent)` }}
              />

              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2.5 rounded-lg border"
                      style={{ 
                        backgroundColor: `${cat.color}20`,
                        borderColor: `${cat.color}40`
                      }}
                    >
                      <div style={{ color: cat.color }}>{cat.icon}</div>
                    </div>
                    <div>
                      <div className="text-base md:text-lg font-bold text-foreground leading-tight">
                        {cat.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Tier {cat.tier} • {cat.tier === 1 ? 'Foundation' : cat.tier === 2 ? 'Architecture' : 'Wisdom'}
                      </div>
                    </div>
                  </div>
                  <div 
                    className="text-2xl md:text-3xl font-black"
                    style={{ color: cat.color }}
                  >
                    {animatedScores[idx]}
                  </div>
                </div>

                {/* Score bar with segments */}
                <div className="relative h-6 md:h-7 rounded-full bg-muted/30 overflow-hidden">
                  {/* Grid markers */}
                  {[25, 50, 75].map((mark) => (
                    <div 
                      key={mark}
                      className="absolute top-0 bottom-0 w-px bg-muted/40"
                      style={{ left: `${mark}%` }}
                    />
                  ))}
                  
                  {/* Score fill */}
                  <div 
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${animatedScores[idx]}%`,
                      background: `linear-gradient(90deg, ${cat.color}80, ${cat.color})`
                    }}
                  >
                    {/* Animated shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </div>

                  {/* Threshold markers */}
                  <div className="absolute top-0 bottom-0 w-0.5 bg-amber-500/60" style={{ left: '70%' }} />
                  <div className="absolute top-0 bottom-0 w-0.5 bg-emerald-500/60" style={{ left: '85%' }} />
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <span>0</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      Baseline (70)
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      Certified (85)
                    </span>
                  </div>
                  <span>100</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Waveform Activity Monitor */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-cyan-500/20">
        <h3 className="text-xl md:text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
          <Activity className="w-7 h-7" />
          REAL-TIME COGNITIVE WAVEFORM
        </h3>

        <div className="relative h-32 md:h-40 overflow-hidden rounded-xl bg-slate-950/50 border border-cyan-500/20">
          {/* Grid */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-4">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border-r border-b border-cyan-500/10" />
            ))}
          </div>

          {/* Waveform SVG */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(6, 182, 212, 0.5)" />
                <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
              </linearGradient>
            </defs>
            
            {/* Filled area */}
            <path
              d="M0,80 Q25,60 50,70 T100,65 T150,75 T200,60 T250,70 T300,55 T350,65 T400,60 T450,70 T500,65 L500,160 L0,160 Z"
              fill="url(#waveGradient)"
              className="animate-pulse"
              style={{ animationDuration: '3s' }}
            />
            
            {/* Line */}
            <path
              d="M0,80 Q25,60 50,70 T100,65 T150,75 T200,60 T250,70 T300,55 T350,65 T400,60 T450,70 T500,65"
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2"
              filter="url(#glow)"
            />
          </svg>

          {/* Scanning line */}
          <div 
            className="absolute top-0 bottom-0 w-px bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
            style={{ left: `${scanLinePos}%`, transition: 'left 0.05s linear' }}
          />

          {/* Labels */}
          <div className="absolute bottom-2 left-4 text-xs text-cyan-400/60 font-mono">
            COGNITIVE_STREAM_001
          </div>
          <div className="absolute top-2 right-4 flex items-center gap-2 text-xs text-emerald-400 font-mono">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </div>
        </div>
      </div>

      {/* Add shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default ScientificScoreVisualization;
