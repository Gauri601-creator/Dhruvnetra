import React from 'react';
import { 
  TrendingUp, 
  BrainCircuit, 
  Compass, 
  Clock, 
  ShieldAlert, 
  Layers, 
  Wind, 
  Waves, 
  HelpCircle,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  AreaChart,
  Area
} from 'recharts';
import { useAppState } from '../../context/AppStateContext';
import { AntarcticTacticalMap } from '../map/AntarcticTacticalMap';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';

export const TrajectoryPredictionView: React.FC = () => {
  const { icebergs, selectedIceberg, setSelectedIceberg, vessel } = useAppState();

  const targetIb = selectedIceberg || icebergs[0];

  // Simulated Time vs Distance-to-Vessel dataset over 72 hours
  const distanceOverTimeData = [
    { hour: '0h (Now)', distance: 34.2, uncertaintyLow: 33.0, uncertaintyHigh: 35.4, safeThreshold: 20 },
    { hour: '+6h', distance: 31.8, uncertaintyLow: 29.4, uncertaintyHigh: 34.2, safeThreshold: 20 },
    { hour: '+12h', distance: 29.5, uncertaintyLow: 25.7, uncertaintyHigh: 33.3, safeThreshold: 20 },
    { hour: '+18h (CPA)', distance: 28.4, uncertaintyLow: 23.2, uncertaintyHigh: 33.6, safeThreshold: 20 },
    { hour: '+24h', distance: 29.8, uncertaintyLow: 24.2, uncertaintyHigh: 35.4, safeThreshold: 20 },
    { hour: '+48h', distance: 38.6, uncertaintyLow: 30.1, uncertaintyHigh: 47.1, safeThreshold: 20 },
    { hour: '+72h', distance: 52.4, uncertaintyLow: 40.4, uncertaintyHigh: 64.4, safeThreshold: 20 },
  ];

  return (
    <div className="space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-xl border-cyan-500/20 bg-slate-950/80 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-orbitron font-bold text-slate-100 uppercase tracking-wider">
              Iceberg Trajectory & Drift Uncertainty Prediction
            </h2>
            <p className="text-[11px] text-slate-400">
              72-Hour Monte Carlo Ensemble Drift Model • Target: <strong className="text-cyan-300">{targetIb.name}</strong>
            </p>
          </div>
        </div>

        {/* Iceberg Target Selector */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Select Ice Target:</span>
          <select
            value={targetIb.id}
            onChange={(e) => {
              const found = icebergs.find((ib) => ib.id === e.target.value);
              if (found) setSelectedIceberg(found);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-cyan-300 font-orbitron font-bold text-xs focus:outline-none"
          >
            {icebergs.map((ib) => (
              <option key={ib.id} value={ib.id}>
                {ib.code} ({ib.sizeKm}km - {ib.riskLevel} Risk)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Core Prediction Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <MetricCard
          title="Prediction Horizon"
          value="72 Hours"
          subtitle="Multi-step drift steps (+6h to +72h)"
          icon={Clock}
          accentColor="cyan"
          badge={<StatusBadge status="OPERATIONAL" label="MONTE CARLO" size="sm" />}
        />

        <MetricCard
          title="Model Confidence"
          value={`${targetIb.confidencePercent}%`}
          subtitle="Ensemble convergence score"
          icon={BrainCircuit}
          accentColor="emerald"
          badge={<StatusBadge status="LOW" label="HIGH CERTAINTY" size="sm" />}
        />

        <MetricCard
          title="Estimated Drift Speed"
          value={`${targetIb.speedKnots} knots`}
          subtitle={`Heading: ${targetIb.directionText}`}
          icon={Compass}
          accentColor="amber"
          badge={<StatusBadge status="MEDIUM" label="STEADY" size="sm" />}
        />

        <MetricCard
          title="Closest Point (CPA)"
          value="28.4 km"
          subtitle="Projected approach at +18 hours"
          icon={ShieldAlert}
          accentColor={targetIb.riskLevel === 'HIGH' ? 'rose' : 'amber'}
          badge={<StatusBadge status={targetIb.riskLevel} size="sm" />}
        />
      </div>

      {/* Main Map & Chart Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Map with Trajectory & Uncertainty Corridor */}
        <div className="xl:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300 px-1">
            <span className="font-orbitron font-bold uppercase tracking-wider text-cyan-400">
              Visual Trajectory & Uncertainty Corridor Map
            </span>
            <span className="text-[11px] text-amber-400">
              Translucent Amber Cone = ±Uncertainty Expansion
            </span>
          </div>

          <AntarcticTacticalMap height="420px" />
        </div>

        {/* Recharts Distance vs Time Chart & Physics Breakdown */}
        <div className="xl:col-span-5 space-y-3.5 flex flex-col justify-between">
          {/* Chart Container */}
          <div className="glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-950/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-orbitron font-bold text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Time vs Distance from RV Dhruv</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">
                Min Safe Buffer: &gt;20 km
              </span>
            </div>

            {/* Recharts Line Chart */}
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={distanceOverTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="distGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00f2fe" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={9} />
                  <YAxis stroke="#64748b" fontSize={9} domain={[15, 70]} unit="km" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#091322', borderColor: '#00f2fe', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <ReferenceLine y={20} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '20km Danger', fill: '#ef4444', fontSize: 9 }} />
                  <Area type="monotone" dataKey="distance" stroke="#00f2fe" strokeWidth={2.5} fillOpacity={1} fill="url(#distGrad)" name="Distance (km)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="text-[10px] text-slate-400 leading-tight">
              Closest Point of Approach (CPA) occurs at <strong className="text-cyan-300">+18h (28.4 km)</strong>. Maintaining the recommended 18 km Westward offset keeps the vessel safely above the 20 km danger threshold.
            </div>
          </div>

          {/* Hydrodynamic Drift Physics Forces Breakdown */}
          <div className="glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-950/80 shadow-xl space-y-2.5 text-xs">
            <h3 className="text-xs font-orbitron font-bold text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Drift Physics Forces Decomposition</span>
            </h3>

            <div className="space-y-2 text-[11px]">
              {/* Ocean Current */}
              <div>
                <div className="flex justify-between text-slate-300">
                  <span>Sub-surface Keel Current Drag (0-50m depth):</span>
                  <span className="text-cyan-300 font-bold">65% Impact</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>

              {/* Surface Wind */}
              <div>
                <div className="flex justify-between text-slate-300">
                  <span>Surface Atmospheric Wind Drag (10m katabatic):</span>
                  <span className="text-sky-300 font-bold">25% Impact</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: '25%' }} />
                </div>
              </div>

              {/* Coriolis Force */}
              <div>
                <div className="flex justify-between text-slate-300">
                  <span>Earth Rotation Coriolis Force (Left deflection S.H.):</span>
                  <span className="text-amber-300 font-bold">10% Impact</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '10%' }} />
                </div>
              </div>
            </div>

            <div className="p-2 rounded bg-slate-900/90 border border-slate-800 text-[10px] text-slate-400 italic">
              *Note: Trajectory simulation combines real-time hydrodynamic drift physics, ECMWF wind spectrum, and NSIDC historical movement patterns (Simulated frontend demo data).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
