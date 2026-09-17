import React, { useState } from 'react';
import { 
  Satellite, 
  Radio, 
  Server, 
  Building2, 
  Ship, 
  RefreshCw, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Zap,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';

export const SatelliteCommView: React.FC = () => {
  const { isSyncingSat, syncSatelliteData, vessel } = useAppState();
  const [syncLogs, setSyncLogs] = useState<string[]>([
    '[17:28:10 UTC] Iridium NEXT Polar Constellation beam 16 locked.',
    '[17:28:12 UTC] Telemetry packet uplink dispatched (RV Dhruv SOG 12.5 kts, HDG 184°).',
    '[17:28:14 UTC] Cloud AI inference response received (17 targets, 87% model confidence).',
    '[17:28:18 UTC] Local navigation recommendations cache updated successfully.',
  ]);

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-xl border-cyan-500/20 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-sky-950 border border-sky-400/40 text-sky-400">
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-orbitron font-bold text-slate-100 uppercase tracking-wider">
              Satellite Communication & Ingest Architecture
            </h2>
            <p className="text-[11px] text-slate-400">
              Clear Architectural Separation between Earth Observation Sensing and Telemetry Backhaul
            </p>
          </div>
        </div>

        <button
          onClick={syncSatelliteData}
          disabled={isSyncingSat}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingSat ? 'animate-spin' : ''}`} />
          <span>{isSyncingSat ? 'Syncing Over Iridium...' : 'Sync Satellite Data Now'}</span>
        </button>
      </div>

      {/* Concept Clarification Banner: EO Satellites vs Comm Satellites */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box A: Earth Observation Satellites */}
        <div className="glass-panel rounded-xl p-4 border-cyan-500/30 bg-cyan-950/20 space-y-2">
          <div className="flex items-center gap-2 text-cyan-300 font-orbitron font-bold">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>1. Earth Observation (EO) Satellites</span>
          </div>
          <div className="text-[11px] text-slate-300 font-sans leading-relaxed">
            <strong>Role: Remote Sensing & Ice Imaging.</strong> Spacecraft like <span className="text-cyan-300 font-bold">Sentinel-1 (C-SAR)</span> and <span className="text-cyan-300 font-bold">CryoSat-2</span> orbit Earth carrying radar sensors that capture raw microwave backscatter to detect iceberg size, freeboard height, and sea ice extent through 24-hour polar winter darkness.
          </div>
        </div>

        {/* Box B: Communication Satellites */}
        <div className="glass-panel rounded-xl p-4 border-sky-500/30 bg-sky-950/20 space-y-2">
          <div className="flex items-center gap-2 text-sky-300 font-orbitron font-bold">
            <Radio className="w-4 h-4 text-sky-400" />
            <span>2. Communication (Comm) Satellites</span>
          </div>
          <div className="text-[11px] text-slate-300 font-sans leading-relaxed">
            <strong>Role: Telemetry Data Link & Backhaul.</strong> Low Earth Orbit constellations like <span className="text-sky-300 font-bold">Iridium NEXT</span> and <span className="text-sky-300 font-bold">Inmarsat</span> provide bidirectional IP connectivity between RV Dhruv in Antarctica and cloud AI computing clusters on the mainland.
          </div>
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <MetricCard
          title="Satellite Link Status"
          value="CONNECTED"
          subtitle="Iridium NEXT LEO Constellation"
          icon={Radio}
          accentColor="emerald"
          badge={<StatusBadge status="CONNECTED" size="sm" pulse />}
        />

        <MetricCard
          title="Link Latency (RTT)"
          value="680 ms"
          subtitle="Polar orbit hop to Ground Station"
          icon={Activity}
          accentColor="cyan"
          badge={<StatusBadge status="LOW" label="NOMINAL" size="sm" />}
        />

        <MetricCard
          title="Last Full Data Sync"
          value="18 sec ago"
          subtitle="Continuous delta sync active"
          icon={RefreshCw}
          accentColor="blue"
          badge={<StatusBadge status="LIVE" size="sm" />}
        />

        <MetricCard
          title="Transferred Volume"
          value="2.4 MB / pass"
          subtitle="Compressed vector telemetry"
          icon={Zap}
          accentColor="cyan"
          badge={<StatusBadge status="OPERATIONAL" label="OPTIMAL" size="sm" />}
        />
      </div>

      {/* Visual End-to-End Satellite Telemetry Loop Diagram */}
      <div className="glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-950/90 shadow-xl space-y-3">
        <h3 className="text-xs font-orbitron font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Bidirectional Closed-Loop Telemetry Architecture</span>
        </h3>

        {/* Closed Loop Visual */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: '1. VESSEL SENSORS', desc: 'RV Dhruv sends GPS, heading, onboard X-band radar targets via Sat Terminal.', icon: Ship, color: 'text-cyan-400' },
              { title: '2. COMM SATELLITE', desc: 'Iridium NEXT relays packet to Svalbard / Ground Earth Station network.', icon: Satellite, color: 'text-sky-400' },
              { title: '3. CLOUD AI SERVER', desc: 'Fuses EO Sentinel SAR with ECMWF & HYCOM; runs 72h Monte Carlo drift inference.', icon: Server, color: 'text-purple-400' },
              { title: '4. DECISION UPLINK', desc: 'Optimized clearance waypoints and risk maps streamed back to RV Dhruv bridge.', icon: Radio, color: 'text-emerald-400' },
            ].map((node, i) => {
              const Icon = node.icon;
              return (
                <div key={i} className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${node.color}`} />
                    <span className="font-orbitron font-bold text-slate-200 text-xs">{node.title}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">{node.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Sync Terminal Live Log */}
          <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 space-y-1 font-mono text-[10px]">
            <div className="text-slate-500 uppercase font-bold text-[9px] mb-1">SatCom IP Stream Log:</div>
            {syncLogs.map((log, idx) => (
              <div key={idx} className="text-slate-300">
                <span className="text-cyan-400">❯</span> {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
