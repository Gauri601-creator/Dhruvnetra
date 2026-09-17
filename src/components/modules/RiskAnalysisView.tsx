import React from 'react';
import { 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  Sliders, 
  Wind, 
  Waves, 
  Layers, 
  Eye, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { AntarcticTacticalMap } from '../map/AntarcticTacticalMap';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';

export const RiskAnalysisView: React.FC = () => {
  const { 
    vessel, 
    setIsExplainabilityOpen, 
    setIsRouteAdjustmentOpen,
    setActiveModule,
    applyRoute 
  } = useAppState();

  const riskFactorsList = [
    { title: 'ICEBERG PROXIMITY', status: 'MEDIUM', desc: 'Target IB-023 within 34 km corridor', icon: Eye, color: 'amber' },
    { title: 'SEA ICE CONCENTRATION', status: 'LOW', desc: '42% localized first-year ice leads', icon: Layers, color: 'emerald' },
    { title: 'WEATHER & KATABATIC WIND', status: 'MEDIUM', desc: '24 kt NW gale with 8 km visibility', icon: Wind, color: 'amber' },
    { title: 'WAVE CONDITIONS', status: 'LOW', desc: '2.8 m significant swell height', icon: Waves, color: 'emerald' },
    { title: 'OCEAN CURRENTS', status: 'LOW', desc: '0.8 kt Antarctic Coastal assistance', icon: Compass, color: 'emerald' },
    { title: 'PREDICTION UNCERTAINTY', status: 'MEDIUM', desc: '±6 km Monte Carlo dispersion at +24h', icon: HelpCircle, color: 'amber' },
  ];

  return (
    <div className="space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-xl border-cyan-500/20 bg-slate-950/80 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-950 border border-amber-400/40 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-orbitron font-bold text-slate-100 uppercase tracking-wider">
              Vessel-Specific Risk Assessment Matrix (IACS Polar Class 5)
            </h2>
            <p className="text-[11px] text-slate-400">
              Multi-Factor Dynamic Environmental & Hull Vulnerability Scoring Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Overall Navigation Risk:</span>
          <StatusBadge status="MEDIUM" size="lg" pulse />
        </div>
      </div>

      {/* 6 Multi-Factor Risk Assessment Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {riskFactorsList.map((rf, idx) => {
          const Icon = rf.icon;
          return (
            <div
              key={idx}
              className="glass-panel p-3 rounded-xl border-slate-800 bg-slate-950/70 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <Icon className="w-4 h-4 text-cyan-400" />
                <StatusBadge status={rf.status as 'LOW' | 'MEDIUM' | 'HIGH'} size="sm" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-200 uppercase tracking-tight">
                  {rf.title}
                </div>
                <p className="text-[9px] text-slate-400 font-sans mt-0.5 leading-tight">
                  {rf.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Map & Factor Analysis Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left 7 Cols: Tactical Risk Zone Map */}
        <div className="xl:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 px-1">
            <span className="font-orbitron font-bold uppercase tracking-wider text-cyan-400">
              Antarctic High-Risk Zones & Danger Polygons
            </span>
            <span className="text-[11px] text-rose-400">
              Red Hatched = High Risk Collision Sector
            </span>
          </div>

          <AntarcticTacticalMap height="440px" />
        </div>

        {/* Right 5 Cols: "Why is this area risky?" & "Recommended Action" */}
        <div className="xl:col-span-5 space-y-3.5 flex flex-col justify-between">
          {/* Why is this area risky? */}
          <div className="glass-panel rounded-xl p-4 border-amber-500/30 bg-slate-950/80 shadow-xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <h3 className="font-orbitron font-bold text-amber-300 uppercase tracking-wide">
                  Why is this area risky?
                </h3>
              </div>
              <button
                onClick={() => setIsExplainabilityOpen(true)}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>View Full SHAP Breakdown</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 text-slate-300 text-[11px]">
              <div className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span><strong>Iceberg IB-023 predicted within 34 km:</strong> 1.8 km tabular iceberg drift vector intersects eastern waypoint leg at +18h.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong>Increasing sea ice concentration:</strong> Local ice density rises from 28% to 58% along the coastal shelf edge.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">•</span>
                <span><strong>Cross-current of 1.2 knots:</strong> Induces hull lateral leeway toward the ice field flank.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-400 font-bold">•</span>
                <span><strong>Reduced visibility expected:</strong> Katabatic fog and polar haze reducing visual watch range to 8 km.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-400 font-bold">•</span>
                <span><strong>Prediction uncertainty:</strong> Model variance of ±6 km at +24 hours.</span>
              </div>
            </div>
          </div>

          {/* Recommended Action Card */}
          <div className="glass-panel rounded-xl p-4 border-emerald-500/30 bg-slate-950/90 shadow-xl space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-300 font-orbitron font-bold uppercase">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AI Recommended Mitigation Action</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold">
                ROUTE BRAVO
              </span>
            </div>

            <p className="text-slate-200 text-xs font-sans leading-relaxed">
              “Shift route <strong>18 km West</strong> to maintain a minimum 30+ km clearance from IB-023 while avoiding compressed first-year pressure ridges.”
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  applyRoute('recommended');
                  setActiveModule('route-planning');
                }}
                className="py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-orbitron font-bold text-xs shadow-md transition-all text-center"
              >
                Apply Route Bravo →
              </button>

              <button
                onClick={() => setIsRouteAdjustmentOpen(true)}
                className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-mono text-xs transition-all text-center"
              >
                Custom Adjust...
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
