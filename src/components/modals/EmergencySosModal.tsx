import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Radio, 
  ShieldAlert, 
  Send, 
  LifeBuoy, 
  MapPin, 
  Ship, 
  CheckCircle2, 
  Compass, 
  AlertTriangle 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAppState } from '../../context/AppStateContext';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    vessel, 
    isEmergencyTransmitted, 
    triggerEmergencyTransmission, 
    applyRoute 
  } = useAppState();

  const [distressNature, setDistressNature] = useState<string>('ICE_TRAPPED_COMPRESSION');
  const [transmitting, setTransmitting] = useState<boolean>(false);

  const handleTransmitDistress = () => {
    setTransmitting(true);
    setTimeout(() => {
      setTransmitting(false);
      triggerEmergencyTransmission();
    }, 1500);
  };

  const handleAdoptSafeCorridor = () => {
    applyRoute('safest');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="MARITIME EMERGENCY COMMAND CONSOLE (GMDSS / SOS)"
      subtitle="Antarctic High-Urgency Vessel Distress & Safe Corridor Protocol"
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full font-mono text-xs">
          <span className="text-rose-400 font-bold flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>EPIRB & AIS-SART 406 MHz Ready</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              Stand Down / Close
            </button>
            <button
              onClick={handleAdoptSafeCorridor}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-orbitron font-bold text-xs shadow-md flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Engage Safe Escape Corridor</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Emergency Alert Banner */}
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 shadow-xl shadow-rose-950/50 flex items-start gap-3 animate-pulse-glow">
          <AlertOctagon className="w-7 h-7 text-rose-400 shrink-0 mt-0.5 animate-bounce" />
          <div className="space-y-1">
            <h3 className="text-base font-orbitron font-bold text-rose-200">
              VESSEL EMERGENCY DISTRESS TRANSMISSION (SIMULATION)
            </h3>
            <p className="text-xs text-rose-300/90 font-mono leading-relaxed">
              Initiates satellite telemetry broadcast to Ground Command HQ (Goa / Maitri), Antarctic Search & Rescue (MRCC Cape Town), and sister vessel <strong className="text-white">RV Aryabhata (140 NM East)</strong>.
            </p>
          </div>
        </div>

        {/* Live Vessel Distress Coordinates */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500">Distress Position:</span>
            <div className="text-slate-100 font-bold mt-0.5">{vessel.lat.toFixed(3)}°S, {vessel.lon.toFixed(3)}°E</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500">POB (Souls Onboard):</span>
            <div className="text-cyan-300 font-bold mt-0.5">42 Crew & Scientists</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500">Nearest Haven:</span>
            <div className="text-emerald-400 font-bold mt-0.5">Maitri Ice Shelter (168 km)</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
            <span className="text-slate-500">Nearest Vessel:</span>
            <div className="text-sky-300 font-bold mt-0.5">RV Aryabhata (140 NM)</div>
          </div>
        </div>

        {/* Select Nature of Distress */}
        <div className="glass-panel rounded-xl p-4 border-slate-800 bg-slate-900/60 space-y-3 font-mono text-xs">
          <label className="text-slate-200 font-bold uppercase tracking-wider block">
            Select Nature of Distress:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: 'ICE_TRAPPED_COMPRESSION', label: 'Severe Ice Compression / Beset' },
              { id: 'ICEBERG_PROXIMITY_COLLISION', label: 'Imminent Iceberg Hull Hazard' },
              { id: 'ENGINE_PROPULSION_FAILURE', label: 'Main Propulsion / Azipod Loss' },
              { id: 'SEVERE_WEATHER_SWELL', label: 'Severe Katabatic Gale / Heavy Incline' },
            ].map((nature) => (
              <button
                key={nature.id}
                onClick={() => setDistressNature(nature.id)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  distressNature === nature.id
                    ? 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold'
                    : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {nature.label}
              </button>
            ))}
          </div>

          {/* SOS Broadcast Button */}
          <div className="pt-2">
            {isEmergencyTransmitted ? (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="font-bold">Distress Telemetry Transmitted (ACK Received from Maitri Ground)</span>
                </div>
                <span className="text-[10px] font-mono bg-emerald-900/80 px-2 py-0.5 rounded">ACK 17:28 UTC</span>
              </div>
            ) : (
              <button
                onClick={handleTransmitDistress}
                disabled={transmitting}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-orbitron font-bold text-sm tracking-wider shadow-xl shadow-rose-950/70 transition-all flex items-center justify-center gap-2"
              >
                <Send className={`w-4 h-4 ${transmitting ? 'animate-spin' : ''}`} />
                <span>{transmitting ? 'BROADCASTING EMERGENCY SATELLITE PACKET...' : 'SEND SOS / DISTRESS POSITION BROADCAST'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Emergency Recommended Safe Corridor */}
        <div className="glass-panel rounded-xl p-4 border-emerald-500/30 bg-slate-900/60 space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-emerald-300 font-bold font-orbitron flex items-center gap-1.5">
              <LifeBuoy className="w-4 h-4 text-emerald-400" />
              <span>AI EMERGENCY SAFE CORRIDOR COMPUTED</span>
            </span>
            <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
              Clear Water Bypass (Route Charlie)
            </span>
          </div>

          <p className="text-slate-300 text-[11px] leading-relaxed">
            Emergency route diverts 28 km West into low-pressure open water lead (ice concentration &lt;15%), clear of tabular iceberg IB-023 drift cone. Provides immediate calm water access within 4.5 hours steaming.
          </p>
        </div>
      </div>
    </Modal>
  );
};
