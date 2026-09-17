import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Satellite, 
  Volume2, 
  VolumeX, 
  AlertOctagon, 
  Ship, 
  Building2, 
  Sparkles,
  RefreshCw,
  Compass,
  Navigation
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';

interface TopbarProps {
  onOpenScenarioModal: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenScenarioModal }) => {
  const { 
    role, 
    setRole, 
    vessel, 
    isSyncingSat, 
    syncSatelliteData, 
    setIsEmergencyOpen,
    soundEnabled,
    setSoundEnabled,
    activeScenario
  } = useAppState();

  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const iso = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      setUtcTime(iso);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 w-full glass-panel border-b border-cyan-500/20 bg-slate-950/80 px-4 flex items-center justify-between z-30 sticky top-0 backdrop-blur-md">
      {/* Left: Brand / Mode Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-400/40 shadow-md shadow-cyan-900/40">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-black font-orbitron tracking-wider text-slate-100 flex items-center gap-1.5">
                <span>DHRUV NETRA</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-medium border border-cyan-500/30">
                  SIH 26059
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-cyan-400/80 font-mono tracking-wide">
              AI-Powered Antarctic Navigation • <span className="text-slate-300 italic">“See Further. Sail Safer.”</span>
            </p>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden lg:block h-8 w-[1px] bg-slate-800" />

        {/* Live UTC Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-300 font-semibold">{utcTime}</span>
        </div>
      </div>

      {/* Middle: Vessel Telemetry Summary (If Navigator Role) */}
      <div className="hidden xl:flex items-center gap-3">
        {role === 'NAVIGATOR' ? (
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-cyan-300 font-bold">
              <Ship className="w-3.5 h-3.5 text-cyan-400" />
              <span>{vessel.name}</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-slate-300">
              <Navigation className="w-3 h-3 text-sky-400" />
              <span>{vessel.lat.toFixed(3)}°S, {vessel.lon.toFixed(3)}°E</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="flex items-center gap-1 text-emerald-300">
              <Compass className="w-3 h-3 text-emerald-400" />
              <span>{vessel.speedKnots} kts • HDG {vessel.headingDeg}°</span>
            </div>
            <span className="text-slate-600">|</span>
            <div className="text-amber-300 text-[11px]">
              ETA: <span className="font-bold">{vessel.etaDays}d {vessel.etaHours}h</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 text-xs font-mono text-cyan-300">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>GROUND COMMAND HQ (Antarctic Operations Control)</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-bold">3 Active Vessels Monitored</span>
          </div>
        )}
      </div>

      {/* Right: Actions, SatCom, Role Switcher, Emergency */}
      <div className="flex items-center gap-2.5">
        {/* SatCom sync pill */}
        <button
          onClick={syncSatelliteData}
          disabled={isSyncingSat}
          title="Earth Observation & Iridium NEXT Backhaul Link"
          className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono transition-all"
        >
          <Satellite className={`w-3.5 h-3.5 ${isSyncingSat ? 'text-amber-400 animate-spin' : 'text-cyan-400'}`} />
          <span className="text-slate-300">
            {isSyncingSat ? 'SYNCING...' : 'SATLINK: LIVE (680ms)'}
          </span>
          <RefreshCw className={`w-3 h-3 text-slate-500 ${isSyncingSat ? 'animate-spin' : ''}`} />
        </button>

        {/* Demo Scenario Selector button (for SIH Judges) */}
        <button
          onClick={onOpenScenarioModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-semibold transition-all shadow-md shadow-cyan-950/50"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="hidden md:inline">DEMO SCENARIO:</span>
          <span className="text-white font-bold">{activeScenario.title.split(':')[0]}</span>
        </button>

        {/* Role Switcher */}
        <div className="flex items-center rounded-lg bg-slate-900/90 p-0.5 border border-slate-800">
          <button
            onClick={() => setRole('NAVIGATOR')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
              role === 'NAVIGATOR'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ship className="w-3 h-3" />
            <span className="hidden md:inline">SHIP BRIDGE</span>
          </button>
          <button
            onClick={() => setRole('GROUND_COMMAND')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-all ${
              role === 'GROUND_COMMAND'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span className="hidden md:inline">GROUND COMMAND</span>
          </button>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Sonar Audio' : 'Unmute Sonar Audio'}
          className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>

        {/* Emergency SOS Button */}
        <button
          onClick={() => setIsEmergencyOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-orbitron font-bold text-xs shadow-lg shadow-rose-950/60 transition-all transform hover:scale-105 animate-pulse border border-rose-400"
        >
          <AlertOctagon className="w-4 h-4 text-white" />
          <span>SOS</span>
        </button>
      </div>
    </header>
  );
};
