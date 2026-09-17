import React from 'react';
import { 
  Activity, 
  Cpu, 
  Satellite, 
  Compass, 
  Wind, 
  Ship, 
  Radio, 
  Route, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ShieldAlert, 
  RefreshCw,
  GitCompare
} from 'lucide-react';
import { mockSystemHealth } from '../../data/mockDataSources';
import { StatusBadge } from '../common/StatusBadge';
import { useAppState } from '../../context/AppStateContext';

export const SystemHealthView: React.FC = () => {
  const { dataConflictActive, setDataConflictActive, isSyncingSat, syncSatelliteData } = useAppState();

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-xl border-cyan-500/20 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-950 border border-emerald-400/40 text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-orbitron font-bold text-slate-100 uppercase tracking-wider">
              System Diagnostics, Data Quality & Conflict Detection
            </h2>
            <p className="text-[11px] text-slate-400">
              Microservice Health Monitoring & Multi-Sensor Cross-Validation Engine
            </p>
          </div>
        </div>

        {/* Toggle Conflict Scenario simulation button */}
        <button
          onClick={() => setDataConflictActive(!dataConflictActive)}
          className={`px-3 py-1.5 rounded-lg border font-bold text-xs transition-all flex items-center gap-1.5 ${
            dataConflictActive
              ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-md'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>{dataConflictActive ? 'Simulating Sensor Conflict (Active)' : 'Simulate Data Conflict Discrepancy'}</span>
        </button>
      </div>

      {/* SPECIAL FEATURE: DATA QUALITY & CONFLICT DETECTION PANEL */}
      <div
        className={`glass-panel rounded-xl p-4 border transition-all space-y-3 ${
          dataConflictActive
            ? 'border-amber-500/50 bg-amber-950/20 shadow-xl shadow-amber-950/40'
            : 'border-cyan-500/20 bg-slate-950/80'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <GitCompare className={`w-4 h-4 ${dataConflictActive ? 'text-amber-400 animate-pulse' : 'text-cyan-400'}`} />
            <h3 className="font-orbitron font-bold text-slate-100 uppercase tracking-wide text-xs">
              Data Quality & Sensor Consistency Analysis
            </h3>
          </div>
          <StatusBadge
            status={dataConflictActive ? 'WARNING' : 'OPERATIONAL'}
            label={dataConflictActive ? 'CONFLICT DETECTED' : 'DATA CONSISTENT'}
            size="sm"
            pulse={dataConflictActive}
          />
        </div>

        {/* 4 Data Stream Quality Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 text-[10px]">Sentinel-1 SAR Feed:</span>
            <div className="text-emerald-400 font-bold mt-0.5">EXCELLENT (Level 1 GRD)</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 text-[10px]">ECMWF Weather Model:</span>
            <div className="text-emerald-400 font-bold mt-0.5">GOOD (9 km grid)</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 text-[10px]">Shipboard X-Band Radar:</span>
            <div className="text-emerald-400 font-bold mt-0.5">GOOD (12 NM Sweep)</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500 text-[10px]">Iceberg Observation:</span>
            <div className={`font-bold mt-0.5 ${dataConflictActive ? 'text-amber-400' : 'text-emerald-400'}`}>
              {dataConflictActive ? 'MODERATE (Discrepancy)' : 'HIGH ACCURACY'}
            </div>
          </div>
        </div>

        {/* Conflict Alert Box if discrepancy is active */}
        {dataConflictActive && (
          <div className="p-3.5 rounded-xl bg-amber-950/60 border border-amber-500/50 space-y-2 text-slate-200">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Multi-Source Positional Discrepancy Flagged on Target IB-007</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500">Sentinel-1 SAR Observation (Pass 16:45 UTC):</span>
                <div className="text-cyan-300 font-bold mt-0.5">Lat: 66.150°S, Lon: 65.800°E</div>
              </div>
              <div className="p-2 rounded bg-slate-950/80 border border-slate-800">
                <span className="text-slate-500">Onboard Bridge Radar (17:20 UTC Tactical):</span>
                <div className="text-amber-300 font-bold mt-0.5">Lat: 66.182°S, Lon: 65.864°E (4.2 km Delta)</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] text-amber-200 font-sans leading-relaxed">
              ⚠️ <strong className="text-amber-400">System Safeguard Active:</strong> "Conflict under analysis — recommendation confidence reduced to 74% and uncertainty corridor expanded to ±9.4 km. System prioritizes navigator safety rather than blindly trusting outdated satellite passes."
            </div>
          </div>
        )}
      </div>

      {/* Subsystem Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {mockSystemHealth.map((sys) => (
          <div
            key={sys.id}
            className="glass-panel rounded-xl p-4 border border-slate-800 bg-slate-950/70 space-y-2.5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-slate-500 uppercase">{sys.category}</span>
                <StatusBadge status={sys.status} size="sm" />
              </div>
              <h3 className="font-orbitron font-bold text-sm text-slate-100">{sys.name}</h3>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] py-1.5 border-y border-slate-800/80">
              <div className="p-1 rounded bg-slate-900/60">
                <span className="text-slate-500">Uptime:</span>
                <div className="font-bold text-emerald-400 mt-0.5">{sys.uptimePercent}%</div>
              </div>
              <div className="p-1 rounded bg-slate-900/60">
                <span className="text-slate-500">Latency:</span>
                <div className="font-bold text-cyan-300 mt-0.5">{sys.latencyMs} ms</div>
              </div>
              <div className="p-1 rounded bg-slate-900/60">
                <span className="text-slate-500">Confidence:</span>
                <div className="font-bold text-slate-200 mt-0.5">{sys.confidencePercent}%</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
              {sys.details}
            </p>

            <div className="text-[9px] text-slate-500 pt-1">
              Last Diagnostic Check: {sys.lastCheck}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
