import React from 'react';
import { 
  Ship, 
  Fuel, 
  Activity, 
  Compass, 
  Layers, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Radio, 
  Gauge,
  TrendingUp
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useAppState } from '../../context/AppStateContext';
import { vesselTelemetryHistory } from '../../data/mockVessel';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';

export const VesselView: React.FC = () => {
  const { vessel } = useAppState();

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-xl border-cyan-500/20 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-400">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-orbitron font-bold text-slate-100 uppercase tracking-wider">
              {vessel.name} Telemetry & Polar Engineering Deck
            </h2>
            <p className="text-[11px] text-slate-400">
              Callsign: <strong className="text-cyan-300">{vessel.callsign}</strong> • {vessel.polarClass}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-[11px]">Mission Progress to Maitri:</span>
          <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 font-orbitron font-bold border border-emerald-500/40">
            {vessel.progressPercent}% Completed (820 km sailed)
          </span>
        </div>
      </div>

      {/* 4 Core Vessel Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <MetricCard
          title="Speed Over Ground (SOG)"
          value={`${vessel.speedKnots} knots`}
          subtitle={`Heading: ${vessel.headingDeg}° • Rudder: +${vessel.rudderAngleDeg}°`}
          icon={Compass}
          accentColor="cyan"
          badge={<StatusBadge status="OPERATIONAL" size="sm" />}
        />

        <MetricCard
          title="Bunker Fuel Remaining"
          value={`${vessel.fuelRemainingTons} tons`}
          subtitle={`Burn Rate: ${vessel.fuelBurnRatePerHour} tons/hr (Cap: ${vessel.fuelCapacityTons}t)`}
          icon={Fuel}
          accentColor="amber"
          badge={<StatusBadge status="LOW" label="68% RESERVE" size="sm" />}
        />

        <MetricCard
          title="Engine Load & Propulsion"
          value={`${vessel.engineLoadPercent}%`}
          subtitle="Dual 8,500 kW ABB Azipod Thrusters"
          icon={Gauge}
          accentColor="emerald"
          badge={<StatusBadge status="OPERATIONAL" label="NOMINAL" size="sm" />}
        />

        <MetricCard
          title="Hull Incline & Dynamics"
          value={`${vessel.pitchDeg}° Pitch / ${Math.abs(vessel.rollDeg)}° Roll`}
          subtitle={`Draft: ${vessel.draftMeters}m (Reinforced Bow Stem)`}
          icon={Activity}
          accentColor="cyan"
          badge={<StatusBadge status="LOW" label="STABLE" size="sm" />}
        />
      </div>

      {/* Hull Isometric Diagram & Subsystems Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left 7 Cols: Vessel Subsystem Blueprint SVG */}
        <div className="xl:col-span-7 glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-950/80 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-orbitron font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>RV Dhruv Polar Class 5 Hull Architecture</span>
            </h3>
            <span className="text-[10px] text-cyan-400">Reinforced Icebreaking Bow (45mm NV E36 Steel)</span>
          </div>

          {/* SVG Vessel Schematic Diagram */}
          <div className="h-56 w-full flex items-center justify-center bg-slate-900/60 rounded-xl border border-slate-800 p-3">
            <svg viewBox="0 0 600 200" className="w-full h-full">
              {/* Waterline */}
              <line x1="20" y1="130" x2="580" y2="130" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="6 3" opacity="0.6" />
              <text x="30" y="124" fill="#0ea5e9" fontSize="9" fontFamily="monospace">Waterline (Draft 8.6m)</text>

              {/* Vessel Hull Shape */}
              <path
                d="M 80,130 L 140,165 L 480,165 L 540,130 L 530,90 L 480,90 L 480,60 L 380,60 L 380,90 L 160,90 L 80,130 Z"
                fill="#0f2744"
                stroke="#00f2fe"
                strokeWidth="2"
              />

              {/* Reinforced Icebreaker Bow Rake */}
              <path d="M 80,130 L 140,165 L 170,165 L 110,130 Z" fill="#0284c7" opacity="0.7" />
              <text x="70" y="180" fill="#38bdf8" fontSize="9" fontFamily="monospace">Reinforced Ice Spoon Bow (PC5)</text>

              {/* Azipod Thrusters (Stern) */}
              <rect x="500" y="165" width="25" height="15" fill="#f59e0b" rx="2" />
              <text x="470" y="192" fill="#f59e0b" fontSize="9" fontFamily="monospace">Dual Azipods (17 MW)</text>

              {/* Bridge Tower & Radar Masts */}
              <rect x="390" y="45" width="80" height="45" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1.5" />
              <line x1="430" y1="45" x2="430" y2="20" stroke="#00f2fe" strokeWidth="2" />
              <circle cx="430" cy="20" r="4" fill="#00f2fe" />
              <text x="395" y="15" fill="#00f2fe" fontSize="9" fontFamily="monospace">Dual X-Band Radar</text>

              {/* Forward Sonar Dome */}
              <circle cx="150" cy="165" r="7" fill="#10b981" />
              <text x="165" y="180" fill="#10b981" fontSize="9" fontFamily="monospace">Forward Sonar Dome</text>
            </svg>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500">Displacement:</span>
              <div className="text-slate-200 font-bold mt-0.5">12,400 DWT</div>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500">Length / Beam:</span>
              <div className="text-slate-200 font-bold mt-0.5">132m / 24.5m</div>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500">Ice Breaking Cap:</span>
              <div className="text-cyan-300 font-bold mt-0.5">1.5m First-Year Ice</div>
            </div>
            <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500">Crew / Scientists:</span>
              <div className="text-emerald-400 font-bold mt-0.5">42 Souls (POB)</div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Speed & Fuel Historical Charts */}
        <div className="xl:col-span-5 glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-950/80 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-orbitron font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Speed & Fuel Consumption History</span>
            </h3>
            <span className="text-[10px] text-slate-400">Past 24h Transit Log</span>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={vesselTelemetryHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="speedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={9} />
                <YAxis stroke="#64748b" fontSize={9} domain={[10, 15]} unit=" kts" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#091322', borderColor: '#00f2fe', borderRadius: '8px', fontSize: '11px', fontFamily: 'monospace' }}
                />
                <Area type="monotone" dataKey="speed" stroke="#00f2fe" strokeWidth={2.5} fillOpacity={1} fill="url(#speedGrad)" name="Speed Over Ground (kts)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300">
            ✓ <span className="font-bold">Fuel Optimization Status:</span> Operating at 12.5 kts cruise speed maintains optimal engine thermal efficiency and achieves 8.4% fuel savings with current route offset.
          </div>
        </div>
      </div>
    </div>
  );
};
