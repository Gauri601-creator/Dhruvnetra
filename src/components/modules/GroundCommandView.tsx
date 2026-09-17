import React, { useState } from 'react';
import { 
  Building2, 
  Ship, 
  MapPin, 
  Activity, 
  ShieldAlert, 
  Compass, 
  Radio, 
  Satellite, 
  Send, 
  CheckCircle2, 
  Users, 
  Fuel, 
  Clock, 
  AlertTriangle,
  Layers,
  Sparkles
} from 'lucide-react';
import { mockFleet } from '../../data/mockFleet';
import { FleetVessel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';
import { AntarcticTacticalMap } from '../map/AntarcticTacticalMap';
import { useAppState } from '../../context/AppStateContext';

export const GroundCommandView: React.FC = () => {
  const { setRole, setActiveModule, addToast } = useAppState();
  const [selectedFleetVessel, setSelectedFleetVessel] = useState<FleetVessel>(mockFleet[0]);
  const [hqAdvisoryText, setHqAdvisoryText] = useState<string>(
    'HQ Advisory: Severe katabatic winds forecasted in Queen Maud sector in +12h. Maintain Route Bravo offset.'
  );
  const [advisorySent, setAdvisorySent] = useState<boolean>(false);

  const handleSendAdvisory = () => {
    setAdvisorySent(true);
    addToast({
      type: 'success',
      title: 'Shore-to-Ship Advisory Dispatched',
      message: `Uplinked to ${selectedFleetVessel.name} via Iridium NEXT LEO satellite terminal.`,
    });
    setTimeout(() => setAdvisorySent(false), 3000);
  };

  const handleSwitchToShipView = () => {
    setRole('NAVIGATOR');
    setActiveModule('dashboard');
  };

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-xl border-cyan-500/30 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-orbitron font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>Ground Command & Antarctic Fleet Control HQ</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                HQ CONSOLE (GOA / MAITRI)
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              National Centre for Polar and Ocean Research (NCPOR) Maritime Decision Support System
            </p>
          </div>
        </div>

        <button
          onClick={handleSwitchToShipView}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-md"
        >
          <Ship className="w-3.5 h-3.5" />
          <span>Switch to RV Dhruv Bridge View</span>
        </button>
      </div>

      {/* 4 Fleet Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <MetricCard
          title="Active Antarctic Vessels"
          value="3 Vessels + 2 Bases"
          subtitle="RV Dhruv • RV Aryabhata • RV Sagar"
          icon={Ship}
          accentColor="cyan"
          badge={<StatusBadge status="OPERATIONAL" label="ALL ACTIVE" size="sm" />}
        />

        <MetricCard
          title="Regional Iceberg Threat Index"
          value="MEDIUM RISK"
          subtitle="17 Tracked Targets in Active Sectors"
          icon={ShieldAlert}
          accentColor="amber"
          badge={<StatusBadge status="MEDIUM" size="sm" pulse />}
        />

        <MetricCard
          title="Satellite Ingest Bandwidth"
          value="48.2 Mbps"
          subtitle="Sentinel-1 SAR C-Band + CryoSat-2"
          icon={Satellite}
          accentColor="emerald"
          badge={<StatusBadge status="LIVE" size="sm" />}
        />

        <MetricCard
          title="Fleet Personnel (POB)"
          value="173 Souls"
          subtitle="Scientists, Crew & Base Operators"
          icon={Users}
          accentColor="cyan"
          badge={<StatusBadge status="OPERATIONAL" label="ACCOUNTED" size="sm" />}
        />
      </div>

      {/* Main Ground Command Fleet Grid: Left (Active Vessels list), Right (Tactical Overview & Shore Dispatch) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left 4 Cols: Active Vessels List */}
        <div className="xl:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 px-1">
            <span className="font-orbitron font-bold uppercase tracking-wider text-cyan-400">
              Active Antarctic Fleet
            </span>
            <span className="text-[10px] text-slate-500">Select to monitor</span>
          </div>

          <div className="space-y-2.5">
            {mockFleet.map((v) => {
              const isSelected = selectedFleetVessel.id === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => setSelectedFleetVessel(v)}
                  className={`glass-panel p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-900/90 shadow-xl shadow-cyan-950/50'
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Ship className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <h4 className="font-orbitron font-bold text-sm text-slate-100">{v.name}</h4>
                    </div>
                    <StatusBadge status={v.riskLevel} size="sm" />
                  </div>

                  <div className="text-[11px] text-cyan-300/90 font-semibold">
                    📍 {v.currentArea}
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px] pt-1 border-t border-slate-800/80">
                    <div className="p-1 rounded bg-slate-950/60">
                      <span className="text-slate-500">Speed:</span>
                      <div className="font-bold text-slate-200 mt-0.5">{v.speedKnots} kts</div>
                    </div>
                    <div className="p-1 rounded bg-slate-950/60">
                      <span className="text-slate-500">Destination:</span>
                      <div className="font-bold text-slate-200 mt-0.5 truncate">{v.destination.split(' ')[0]}</div>
                    </div>
                    <div className="p-1 rounded bg-slate-950/60">
                      <span className="text-slate-500">ETA:</span>
                      <div className="font-bold text-amber-300 mt-0.5">{v.eta}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 8 Cols: Large Antarctic Fleet Map & Shore-to-Ship Advisory Console */}
        <div className="xl:col-span-8 space-y-3.5">
          {/* Tactical Map */}
          <div className="glass-panel rounded-xl p-3 border-cyan-500/20 bg-slate-950/80 space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-orbitron font-bold uppercase tracking-wider text-slate-100">
                Antarctic Regional Overview & Fleet Tracking
              </span>
              <span className="text-[10px] text-cyan-400">
                Monitoring Vessel: <strong>{selectedFleetVessel.name}</strong>
              </span>
            </div>

            <AntarcticTacticalMap height="360px" />
          </div>

          {/* Shore-to-Ship Advisory Dispatcher */}
          <div className="glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-950/90 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <h3 className="font-orbitron font-bold text-slate-100 uppercase tracking-wide">
                  Ground Command Shore-to-Ship Advisory Uplink
                </h3>
              </div>
              <span className="text-[10px] text-slate-400">
                Target: <strong className="text-cyan-300">{selectedFleetVessel.name}</strong> ({selectedFleetVessel.callsign})
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={hqAdvisoryText}
                onChange={(e) => setHqAdvisoryText(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none font-mono"
              />
              <button
                onClick={handleSendAdvisory}
                disabled={advisorySent}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Send className={`w-3.5 h-3.5 ${advisorySent ? 'animate-bounce' : ''}`} />
                <span>{advisorySent ? 'Advisory Uplinked!' : 'Transmit to Bridge'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
