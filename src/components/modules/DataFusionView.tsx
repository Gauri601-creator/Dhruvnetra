import React from 'react';
import { 
  Database, 
  Satellite, 
  Layers, 
  Compass, 
  Wind, 
  Ship, 
  Clock, 
  BrainCircuit, 
  ShieldAlert, 
  Sliders, 
  UserCheck, 
  CheckCircle2, 
  RefreshCw,
  ArrowRight,
  GitMerge
} from 'lucide-react';
import { mockDataSources } from '../../data/mockDataSources';
import { StatusBadge } from '../common/StatusBadge';
import { useAppState } from '../../context/AppStateContext';

export const DataFusionView: React.FC = () => {
  const { isSyncingSat, syncSatelliteData } = useAppState();

  const fusionPipelineSteps = [
    { name: '1. SATELLITE SENSING', desc: 'Sentinel-1 SAR C-band & CryoSat-2 altimetry', icon: Satellite, color: 'text-cyan-400' },
    { name: '2. OCEANOGRAPHIC FEED', desc: 'Copernicus Marine & HYCOM currents (0-50m)', icon: Compass, color: 'text-sky-400' },
    { name: '3. METEOROLOGY', desc: 'ECMWF IFS-HRES wind & swell spectrum', icon: Wind, color: 'text-blue-400' },
    { name: '4. VESSEL SENSORS', desc: 'X-band radar, sonar & inertial telemetry', icon: Ship, color: 'text-emerald-400' },
    { name: '5. DATA FUSION', desc: 'Multi-sensor alignment & Bayesian kalman filtering', icon: GitMerge, color: 'text-purple-400' },
    { name: '6. AI PREDICTION', desc: '72h Monte Carlo drift simulation ensemble', icon: BrainCircuit, color: 'text-amber-400' },
    { name: '7. RISK ASSESSMENT', desc: 'PC5 Polar Class hull vulnerability evaluation', icon: ShieldAlert, color: 'text-rose-400' },
    { name: '8. ROUTE OPTIMIZATION', desc: 'Pareto-optimal safety & fuel trade-off engine', icon: Sliders, color: 'text-cyan-400' },
    { name: '9. NAVIGATOR RECOMMENDATION', desc: 'Human-in-the-loop decision display', icon: UserCheck, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-xl border-cyan-500/20 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-orbitron font-bold text-slate-100 uppercase tracking-wider">
              Multi-Source Environmental Data Fusion Hub
            </h2>
            <p className="text-[11px] text-slate-400">
              Synchronous Ingestion of Earth Observation, Hydrodynamics, Atmosphere, and Shipboard Sensors
            </p>
          </div>
        </div>

        <button
          onClick={syncSatelliteData}
          disabled={isSyncingSat}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSat ? 'animate-spin' : ''}`} />
          <span>{isSyncingSat ? 'Syncing Satellite Ingest...' : 'Poll Satellite Feeds Now'}</span>
        </button>
      </div>

      {/* Visual End-to-End Decision & Fusion Pipeline Architecture */}
      <div className="glass-panel rounded-xl p-4 border-cyan-500/30 bg-slate-950/90 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="font-orbitron font-bold text-slate-100 uppercase tracking-wide text-xs flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-cyan-400" />
            <span>End-to-End AI Data Fusion & Decision Pipeline</span>
          </h3>
          <span className="text-[10px] text-emerald-400">
            ✓ 5 Concurrent Real-Time Data Streams Active
          </span>
        </div>

        {/* 9-Step Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {fusionPipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-2.5 rounded-lg border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-1"
              >
                <div className="flex items-center justify-between">
                  <Icon className={`w-4 h-4 ${step.color}`} />
                  <span className="text-[9px] text-slate-500 font-bold">#{idx + 1}</span>
                </div>
                <div>
                  <div className="text-[10px] font-orbitron font-bold text-slate-200 leading-tight">
                    {step.name}
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight mt-0.5 font-sans">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5 Data Source Detail Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {mockDataSources.map((ds) => {
          const categoryColors = {
            EO_SATELLITE: 'border-cyan-500/30 bg-cyan-950/20',
            OCEANOGRAPHIC: 'border-sky-500/30 bg-sky-950/20',
            METEOROLOGICAL: 'border-blue-500/30 bg-blue-950/20',
            VESSEL_SENSORS: 'border-emerald-500/30 bg-emerald-950/20',
            HISTORICAL_CLIMATE: 'border-amber-500/30 bg-amber-950/20',
          }[ds.category];

          return (
            <div
              key={ds.id}
              className={`glass-panel rounded-xl p-4 border transition-all flex flex-col justify-between space-y-3 ${categoryColors}`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">
                    {ds.category.replace('_', ' ')}
                  </span>
                  <StatusBadge status={ds.status} size="sm" />
                </div>

                <h3 className="font-orbitron font-bold text-sm text-slate-100">
                  {ds.name}
                </h3>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  Provider: <span className="text-slate-200 font-semibold">{ds.provider}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] py-2 border-y border-slate-800/80">
                <div>
                  <span className="text-slate-500">Freshness:</span>
                  <div className="text-slate-200 font-bold">{ds.freshness}</div>
                </div>
                <div>
                  <span className="text-slate-500">Resolution:</span>
                  <div className="text-cyan-300 font-bold">{ds.resolution}</div>
                </div>
                <div>
                  <span className="text-slate-500">Confidence:</span>
                  <div className="text-emerald-400 font-bold">{ds.confidencePercent}%</div>
                </div>
                <div>
                  <span className="text-slate-500">Bandwidth:</span>
                  <div className="text-slate-200">{ds.bandwidth}</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {ds.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
