import React from 'react';
import { 
  Radio, 
  Ship, 
  Building2, 
  ShieldCheck, 
  Compass, 
  Eye, 
  Cpu, 
  Satellite, 
  Layers, 
  TrendingUp, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

export const LandingView: React.FC = () => {
  const { setActiveModule, setRole } = useAppState();

  const handleEnterNavigator = () => {
    setRole('NAVIGATOR');
    setActiveModule('dashboard');
  };

  const handleEnterGroundCommand = () => {
    setRole('GROUND_COMMAND');
    setActiveModule('ground-command');
  };

  return (
    <div className="min-h-full flex flex-col justify-between p-6 lg:p-12 relative overflow-hidden">
      {/* Background Animated Polar Radar Graphics */}
      <div className="absolute -right-40 -top-40 w-[650px] h-[650px] rounded-full border border-cyan-500/10 pointer-events-none animate-pulse-glow" />
      <div className="absolute -right-20 -top-20 w-[450px] h-[450px] rounded-full border border-cyan-500/15 pointer-events-none" />
      <div className="absolute -right-5 -top-5 w-[250px] h-[250px] rounded-full border border-cyan-500/20 pointer-events-none" />

      {/* Top Tag & SIH Banner */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold">SMART INDIA HACKATHON 2026</span>
          <span className="text-slate-600">•</span>
          <span>PROBLEM STATEMENT SIH 26059</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <Satellite className="w-3.5 h-3.5 text-cyan-400" />
          <span>Antarctic Earth Observation & Maritime AI Prototype</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl my-auto py-8 z-10 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/40 text-cyan-400">
              <Radio className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-6xl font-black font-orbitron tracking-tight text-white glow-cyan">
                DHRUV NETRA
              </h1>
              <p className="text-cyan-400 font-orbitron font-semibold text-lg sm:text-xl tracking-widest mt-0.5">
                “SEE FURTHER. SAIL SAFER.”
              </p>
            </div>
          </div>

          <p className="text-base sm:text-lg text-slate-300 font-sans max-w-2xl leading-relaxed pt-2">
            An AI-Powered Decision-Support Platform for Antarctic research vessels navigating extreme polar environments. Combines Earth Observation SAR imagery, hydrodynamic ocean currents, atmospheric forecasts, and vessel-specific constraints to calculate uncertainty-aware, fuel-efficient clearance corridors.
          </p>
        </div>

        {/* Action Buttons for Role Entry */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={handleEnterNavigator}
            className="flex items-center gap-3 px-6 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-orbitron font-extrabold text-sm sm:text-base shadow-xl shadow-cyan-500/30 transition-all transform hover:scale-105 group"
          >
            <Ship className="w-5 h-5 text-slate-950" />
            <span>ENTER NAVIGATOR BRIDGE (RV DHRUV)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleEnterGroundCommand}
            className="flex items-center gap-3 px-6 py-4 rounded-xl glass-panel hover:bg-slate-900/90 text-cyan-300 border-cyan-500/40 font-orbitron font-bold text-sm sm:text-base shadow-lg transition-all transform hover:scale-105 group"
          >
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>ENTER GROUND COMMAND VIEW (FLEET HQ)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 5 Core Decision Pillars */}
        <div className="pt-6 border-t border-slate-800/80">
          <div className="text-[11px] font-mono text-cyan-400/80 uppercase tracking-widest font-semibold mb-3">
            COMPLETE DECISION-SUPPORT CHAIN
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
            {[
              { title: 'OBSERVE', desc: 'Sentinel-1 C-SAR & Altimetry', icon: Eye },
              { title: 'PREDICT', desc: '72h Monte Carlo Drift Models', icon: TrendingUp },
              { title: 'ANALYZE', desc: 'Vessel-Specific PC5 Risk', icon: ShieldCheck },
              { title: 'OPTIMIZE', desc: 'Multi-Objective Pareto Frontier', icon: Compass },
              { title: 'RECOMMEND', desc: 'Human-in-the-Loop Decision', icon: Cpu },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="glass-panel p-3 rounded-xl border-slate-800 bg-slate-950/70 hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center gap-2 text-cyan-400 mb-1">
                    <Icon className="w-4 h-4" />
                    <span className="font-orbitron font-bold text-slate-200">{pillar.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-500 pt-6 border-t border-slate-900 z-10">
        <div>
          Target Vessel: <span className="text-slate-300 font-bold">RV Dhruv (IACS Polar Class 5)</span> • Destination: <span className="text-cyan-400 font-bold">Maitri Station</span>
        </div>
        <div>
          Frontend Prototype • Smart India Hackathon 2026 • Simulated Data Models
        </div>
      </div>
    </div>
  );
};
