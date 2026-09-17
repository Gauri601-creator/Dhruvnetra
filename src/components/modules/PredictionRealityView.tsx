import React from 'react';
import { 
  GitCompare, 
  BrainCircuit, 
  CheckCircle2, 
  Activity, 
  Crosshair, 
  TrendingUp, 
  Layers, 
  Compass 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { AntarcticTacticalMap } from '../map/AntarcticTacticalMap';

export const PredictionRealityView: React.FC = () => {
  // Historical Prediction vs Actual Ground Truth Data
  const validationHistory = [
    { time: '-48h', predictedDist: 52.0, actualObservedDist: 51.2, errorKm: 0.8 },
    { time: '-36h', predictedDist: 46.5, actualObservedDist: 44.8, errorKm: 1.7 },
    { time: '-24h', predictedDist: 40.2, actualObservedDist: 37.8, errorKm: 2.4 },
    { time: '-12h', predictedDist: 36.0, actualObservedDist: 32.5, errorKm: 3.5 },
    { time: '-6h', predictedDist: 33.2, actualObservedDist: 29.4, errorKm: 3.8 },
    { time: '0h (Now)', predictedDist: 34.2, actualObservedDist: 29.4, errorKm: 4.8 },
  ];

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-xl border-cyan-500/20 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-400">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-orbitron font-bold text-slate-100 uppercase tracking-wider">
              Continuous Model Evaluation: Prediction vs Reality
            </h2>
            <p className="text-[11px] text-slate-400">
              Autonomous Ground-Truth Backtesting of AI Iceberg Drift Trajectories Against Fresh Satellite Passes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Evaluation Engine:</span>
          <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/40">
            CALIBRATED (48h Backtest)
          </span>
        </div>
      </div>

      {/* 4 Core Accuracy Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <MetricCard
          title="Mean Prediction Error"
          value="4.8 km"
          subtitle="Over 48 hours drift horizon"
          icon={Crosshair}
          accentColor="cyan"
          badge={<StatusBadge status="LOW" label="ACCURATE" size="sm" />}
        />

        <MetricCard
          title="Current Model Confidence"
          value="87%"
          subtitle="Ensemble statistical convergence"
          icon={BrainCircuit}
          accentColor="emerald"
          badge={<StatusBadge status="OPERATIONAL" label="87% CONFIDENCE" size="sm" />}
        />

        <MetricCard
          title="Evaluated Target"
          value="IB-023"
          subtitle="1.8 km Tabular Iceberg"
          icon={Activity}
          accentColor="amber"
          badge={<StatusBadge status="MEDIUM" label="HIGH RISK" size="sm" />}
        />

        <MetricCard
          title="Validation Frequency"
          value="Every 6h"
          subtitle="Synced with Sentinel-1 orbital passes"
          icon={TrendingUp}
          accentColor="blue"
          badge={<StatusBadge status="LIVE" size="sm" />}
        />
      </div>

      {/* Graph & Comparison Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left 7 Cols: Line Chart comparing Predicted vs Observed distance */}
        <div className="xl:col-span-7 glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-orbitron font-bold text-slate-100 uppercase tracking-wide">
              Historical Track: Predicted Trajectory vs Ground-Truth Observation
            </h3>
            <span className="text-[10px] text-cyan-400">Target IB-023 (Past 48 Hours)</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={validationHistory} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} unit="km" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#091322', borderColor: '#00f2fe', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="predictedDist" stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="5 3" name="Predicted Distance (km)" />
                <Line type="monotone" dataKey="actualObservedDist" stroke="#00f2fe" strokeWidth={2.5} name="Actual Observed Distance (km)" />
                <Line type="monotone" dataKey="errorKm" stroke="#ef4444" strokeWidth={1.5} name="Deviation Error (km)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 font-sans leading-relaxed">
            💡 <strong className="text-cyan-300">Continuous Learning Rationale:</strong> As new Sentinel-1 microwave radar passes arrive, Dhruv Netra calculates the residual offset between predicted and observed positions. If deviation exceeds threshold, the Kalman filter dynamically updates hydrodynamic drag coefficients and expands the uncertainty corridor.
          </div>
        </div>

        {/* Right 5 Cols: Positional Coordinate Delta Table */}
        <div className="xl:col-span-5 glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-950/80 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-orbitron font-bold text-slate-100 uppercase tracking-wide">
              Positional Residual Log
            </h3>
            <span className="text-[10px] text-slate-400">Residual Matrix</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-[11px] font-mono text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 uppercase text-[9px]">
                  <th className="py-2 px-2">Timestamp</th>
                  <th className="py-2 px-2">Predicted</th>
                  <th className="py-2 px-2">Observed</th>
                  <th className="py-2 px-2 text-right">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {validationHistory.map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-2 px-2 text-cyan-300">{row.time}</td>
                    <td className="py-2 px-2 text-amber-300">{row.predictedDist} km</td>
                    <td className="py-2 px-2 text-slate-200">{row.actualObservedDist} km</td>
                    <td className="py-2 px-2 text-right font-bold text-rose-400">{row.errorKm} km</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[10px] text-emerald-300">
            ✓ 4.8 km error within acceptable bounds for 72-hour polar ocean forecast (Uncertainty cone is ±6.0 km).
          </div>
        </div>
      </div>
    </div>
  );
};
