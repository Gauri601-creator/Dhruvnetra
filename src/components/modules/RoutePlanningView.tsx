import React from 'react';
import { 
  Route, 
  Compass, 
  Fuel, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Sliders, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Layers, 
  Ship, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { useAppState } from '../../context/AppStateContext';
import { AntarcticTacticalMap } from '../map/AntarcticTacticalMap';
import { StatusBadge } from '../common/StatusBadge';

export const RoutePlanningView: React.FC = () => {
  const {
    vessel,
    routes,
    selectedRouteKey,
    setSelectedRouteKey,
    appliedRouteKey,
    applyRoute,
    humanDecisionStatus,
    setHumanDecisionStatus,
    setIsRouteAdjustmentOpen,
    priorityWeights,
    setPriorityWeights,
    addToast
  } = useAppState();

  // Dynamic simulated score calculation based on sliders
  const calculateDynamicScore = (routeKey: 'shortest' | 'recommended' | 'safest') => {
    const { safety, fuel, time } = priorityWeights;
    if (routeKey === 'shortest') {
      return Math.round((58 * safety + 74 * fuel + 95 * time) / (safety + fuel + time));
    } else if (routeKey === 'recommended') {
      return Math.round((91 * safety + 92 * fuel + 84 * time) / (safety + fuel + time));
    } else {
      return Math.round((98 * safety + 82 * fuel + 68 * time) / (safety + fuel + time));
    }
  };

  const routeComparisonChartData = routes.map((r) => ({
    name: r.name.split(' ')[1], // Alpha, Bravo, Charlie
    distance: r.distanceKm,
    fuel: r.fuelTons,
    timeHours: r.etaDays * 24 + r.etaHours,
    iceExposure: r.iceExposurePercent,
    safetyScore: r.safetyScore,
  }));

  const handleApplyRecommended = () => {
    applyRoute('recommended');
    setHumanDecisionStatus('ACCEPTED');
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-xl border-cyan-500/20 bg-slate-950/80 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-400">
            <Route className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-orbitron font-bold text-slate-100 uppercase tracking-wider">
              AI Multi-Objective Route Optimization
            </h2>
            <p className="text-[11px] text-slate-400">
              Origin: <strong className="text-cyan-300">RV Dhruv (66.712°S, 67.324°E)</strong> → Destination: <strong className="text-emerald-400">Maitri Station (Schirmacher Oasis)</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Active Applied Route:</span>
          <span className="px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 font-orbitron font-bold border border-cyan-500/40">
            {appliedRouteKey === 'recommended' ? 'Route Bravo (AI Recommended)' : appliedRouteKey === 'safest' ? 'Route Charlie (Safest)' : 'Route Alpha (Shortest)'}
          </span>
        </div>
      </div>

      {/* 3 Routes Comparison Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {routes.map((route) => {
          const isSelected = selectedRouteKey === route.key;
          const isApplied = appliedRouteKey === route.key;
          const dynamicScore = calculateDynamicScore(route.key);

          const borderColors = isSelected
            ? 'border-cyan-400 bg-slate-900/90 shadow-xl shadow-cyan-950/60'
            : 'border-slate-800 bg-slate-950/70 hover:border-slate-700';

          return (
            <div
              key={route.id}
              onClick={() => setSelectedRouteKey(route.key)}
              className={`glass-panel rounded-xl p-4 border cursor-pointer transition-all flex flex-col justify-between space-y-3.5 ${borderColors}`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-3 h-3 rounded-full ${
                        route.key === 'shortest'
                          ? 'bg-rose-500'
                          : route.key === 'recommended'
                          ? 'bg-cyan-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <h3 className="font-orbitron font-bold text-sm text-slate-100">
                      {route.name}
                    </h3>
                  </div>
                  <StatusBadge status={route.riskLevel} size="sm" />
                </div>

                <div className="text-[11px] font-bold text-cyan-400">
                  {route.badgeLabel}
                </div>
                <div className="text-[10px] text-slate-400 italic mt-0.5">
                  {route.tagline}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-slate-800/80">
                <div className="p-1.5 rounded bg-slate-900/60">
                  <div className="text-[10px] text-slate-500">Distance</div>
                  <div className="font-orbitron font-bold text-slate-200 mt-0.5">{route.distanceKm} km</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900/60">
                  <div className="text-[10px] text-slate-500">Fuel Burn</div>
                  <div className="font-orbitron font-bold text-amber-300 mt-0.5">{route.fuelTons} tons</div>
                </div>
                <div className="p-1.5 rounded bg-slate-900/60">
                  <div className="text-[10px] text-slate-500">Transit ETA</div>
                  <div className="font-orbitron font-bold text-slate-200 mt-0.5">{route.etaDays}d {route.etaHours}h</div>
                </div>
              </div>

              {/* Rationale description */}
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">
                {route.description}
              </p>

              {/* Dynamic Suitability Score Bar */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Weighted Suitability Index:</span>
                  <span className="font-bold text-cyan-300">{dynamicScore}/100</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      dynamicScore > 80 ? 'bg-cyan-400' : dynamicScore > 60 ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                    style={{ width: `${dynamicScore}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  applyRoute(route.key);
                }}
                className={`w-full py-2 rounded-lg font-orbitron font-bold text-xs transition-all ${
                  isApplied
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-cyan-300'
                }`}
              >
                {isApplied ? '✓ Currently Loaded in Nav' : 'Load This Route'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Interactive Optimization Sliders & Recharts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Sliders Console */}
        <div className="xl:col-span-4 glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-950/80 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="font-orbitron font-bold text-slate-100 uppercase tracking-wide">
                Multi-Objective Priority Weights
              </h3>
            </div>
            <button
              onClick={() => setPriorityWeights({ safety: 85, fuel: 75, time: 60 })}
              className="text-[10px] text-slate-400 hover:text-cyan-300"
            >
              Reset
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-sans">
            Adjust trade-off preferences to simulate how the AI optimizer recalculates route suitability across extreme polar constraints.
          </p>

          {/* Slider 1: Safety Priority */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Safety / Ice Clearance:</span>
              </span>
              <span className="text-emerald-300 font-orbitron font-bold">{priorityWeights.safety}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={priorityWeights.safety}
              onChange={(e) => setPriorityWeights((prev) => ({ ...prev, safety: Number(e.target.value) }))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
          </div>

          {/* Slider 2: Fuel Efficiency */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-amber-300 font-bold flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5" />
                <span>Fuel Conservation:</span>
              </span>
              <span className="text-amber-300 font-orbitron font-bold">{priorityWeights.fuel}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={priorityWeights.fuel}
              onChange={(e) => setPriorityWeights((prev) => ({ ...prev, fuel: Number(e.target.value) }))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Slider 3: Time / Speed Priority */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sky-300 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Time / Arrival Priority:</span>
              </span>
              <span className="text-sky-300 font-orbitron font-bold">{priorityWeights.time}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              value={priorityWeights.time}
              onChange={(e) => setPriorityWeights((prev) => ({ ...prev, time: Number(e.target.value) }))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>

          {/* Apply Recommended Button */}
          <button
            onClick={handleApplyRecommended}
            className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron font-bold text-xs shadow-lg shadow-cyan-950/60 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Recommended Route (Route Bravo)</span>
          </button>
        </div>

        {/* Recharts Route Comparison Bar Chart */}
        <div className="xl:col-span-8 glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
            <h3 className="font-orbitron font-bold text-slate-100 uppercase tracking-wide">
              Comparative Route Trade-Offs (Distance vs Fuel vs Ice Exposure)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              3 Evaluated Candidates
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={routeComparisonChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#091322', borderColor: '#00f2fe', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Bar dataKey="distance" fill="#38bdf8" name="Distance (km)" />
                <Bar dataKey="fuel" fill="#f59e0b" name="Fuel (tons)" />
                <Bar dataKey="iceExposure" fill="#ef4444" name="Ice Exposure (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Human-In-The-Loop Route Action Banner */}
      <div className="glass-panel rounded-xl p-4 border-cyan-500/30 bg-slate-950/90 shadow-xl flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-orbitron font-bold text-slate-100 flex items-center gap-2">
              <span>Human-In-The-Loop Route Validation</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                RECOMMENDATION READY
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              “Final navigation decision remains with the vessel navigator.”
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyRecommended}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-orbitron font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accept Recommendation</span>
          </button>

          <button
            onClick={() => setIsRouteAdjustmentOpen(true)}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Modify Route</span>
          </button>

          <button
            onClick={() => {
              applyRoute('shortest');
              setHumanDecisionStatus('REJECTED');
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 border border-slate-700 text-xs font-mono transition-colors flex items-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Reject / Direct Course</span>
          </button>
        </div>
      </div>
    </div>
  );
};
