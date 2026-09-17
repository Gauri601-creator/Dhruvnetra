import React, { useState } from 'react';
import { 
  Sliders, 
  Compass, 
  CheckCircle2, 
  RotateCcw, 
  Ship, 
  Navigation, 
  Fuel, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAppState } from '../../context/AppStateContext';

interface RouteAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RouteAdjustmentModal: React.FC<RouteAdjustmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { 
    routes, 
    selectedRouteKey, 
    applyRoute, 
    setHumanDecisionStatus,
    addToast 
  } = useAppState();

  const [westOffsetKm, setWestOffsetKm] = useState<number>(18);
  const [transitSpeedKnots, setTransitSpeedKnots] = useState<number>(12.5);
  const [iceBufferDistanceKm, setIceBufferDistanceKm] = useState<number>(30);
  const [navigatorRemarks, setNavigatorRemarks] = useState<string>(
    'Course adjusted by 18 km West to maintain 30+ km clearance from IB-023 while exploiting favorable Antarctic Coastal Current.'
  );

  // Dynamic simulated metrics based on sliders
  const estimatedFuelTons = Math.round(167 + (transitSpeedKnots - 12.5) * 8 + (westOffsetKm - 18) * 0.4);
  const estimatedHours = Math.round(122 - (transitSpeedKnots - 12.5) * 6 + (westOffsetKm - 18) * 0.3);
  const safetyConfidence = Math.min(99, Math.round(91 + (iceBufferDistanceKm - 30) * 0.3));

  const handleApplyModification = () => {
    applyRoute('recommended');
    setHumanDecisionStatus('MODIFIED');
    addToast({
      type: 'success',
      title: 'Modified Route Applied by Navigator',
      message: `Offset: ${westOffsetKm} km W | Speed: ${transitSpeedKnots} kts | Clearance: ${iceBufferDistanceKm} km. Autopilot waypoints synced.`,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="HUMAN-IN-THE-LOOP ROUTE ADJUSTMENT"
      subtitle="Interactive Waypoint & Clearance Tuning Console"
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => {
              setWestOffsetKm(18);
              setTransitSpeedKnots(12.5);
              setIceBufferDistanceKm(30);
            }}
            className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-cyan-300"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset AI Recommendation Defaults</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyModification}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron font-bold text-xs shadow-lg shadow-cyan-950/60 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Apply Navigator Route</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Dynamic Impact Summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-cyan-400 mb-1">
              <Fuel className="w-3.5 h-3.5" />
              <span>Fuel Burn</span>
            </div>
            <div className="text-lg font-orbitron font-bold text-slate-100">{estimatedFuelTons} tons</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5">8.4% savings vs direct</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-sky-400 mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Transit Time</span>
            </div>
            <div className="text-lg font-orbitron font-bold text-slate-100">
              {Math.floor(estimatedHours / 24)}d {estimatedHours % 24}h
            </div>
            <div className="text-[10px] font-mono text-slate-400 mt-0.5">ETA: Nominal</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-center">
            <div className="flex items-center justify-center gap-1 text-[11px] font-mono text-emerald-400 mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safety Rating</span>
            </div>
            <div className="text-lg font-orbitron font-bold text-emerald-300">{safetyConfidence}%</div>
            <div className="text-[10px] font-mono text-emerald-400 mt-0.5">Low Ice Risk</div>
          </div>
        </div>

        {/* Sliders Console */}
        <div className="glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-900/60 space-y-4 font-mono text-xs">
          {/* Slider 1: Westward Divergence Offset */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-300 font-bold">1. Westward Corridor Offset:</span>
              <span className="text-cyan-300 font-orbitron font-bold">{westOffsetKm} km West</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={westOffsetKm}
              onChange={(e) => setWestOffsetKm(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>0 km (Direct rhumb line)</span>
              <span>18 km (AI Optimal)</span>
              <span>50 km (Deep Open Water)</span>
            </div>
          </div>

          {/* Slider 2: Planned Transit Speed */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-300 font-bold">2. Commanded Speed Over Ground:</span>
              <span className="text-sky-300 font-orbitron font-bold">{transitSpeedKnots.toFixed(1)} knots</span>
            </div>
            <input
              type="range"
              min="8.0"
              max="15.0"
              step="0.5"
              value={transitSpeedKnots}
              onChange={(e) => setTransitSpeedKnots(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>8.0 kts (Heavy Ice Crawl)</span>
              <span>12.5 kts (Cruise)</span>
              <span>15.0 kts (Full Ahead)</span>
            </div>
          </div>

          {/* Slider 3: Iceberg Minimum Proximity Buffer */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-300 font-bold">3. Minimum Iceberg Stand-off Buffer:</span>
              <span className="text-emerald-300 font-orbitron font-bold">{iceBufferDistanceKm} km</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={iceBufferDistanceKm}
              onChange={(e) => setIceBufferDistanceKm(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>10 km (Close Recon)</span>
              <span>30 km (Standard Protocol)</span>
              <span>60 km (Ultra-Cautious)</span>
            </div>
          </div>
        </div>

        {/* Navigator Bridge Remarks */}
        <div className="space-y-1.5 font-mono text-xs">
          <label className="text-slate-300 font-bold">Bridge Officer Remarks & Voyage Log:</label>
          <textarea
            value={navigatorRemarks}
            onChange={(e) => setNavigatorRemarks(e.target.value)}
            rows={3}
            className="w-full rounded-xl bg-slate-950/80 border border-slate-800 p-3 text-slate-200 focus:border-cyan-400 focus:outline-none resize-none font-mono text-xs"
          />
        </div>
      </div>
    </Modal>
  );
};
