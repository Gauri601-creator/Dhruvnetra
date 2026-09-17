import React from 'react';
import { 
  Eye, 
  Layers, 
  TrendingUp, 
  ShieldAlert, 
  Compass, 
  Clock, 
  Satellite, 
  Radio, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Iceberg } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface IcebergDetailModalProps {
  iceberg: Iceberg | null;
  isOpen: boolean;
  onClose: () => void;
  onViewTrajectory: () => void;
}

export const IcebergDetailModal: React.FC<IcebergDetailModalProps> = ({
  iceberg,
  isOpen,
  onClose,
  onViewTrajectory,
}) => {
  if (!iceberg) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`TARGET TELEMETRY: ${iceberg.code}`}
      subtitle={`${iceberg.name} • Classification: ${iceberg.classification}`}
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Satellite className="w-3.5 h-3.5 text-cyan-400" />
            <span>Data Ingest: {iceberg.detectionSource}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onViewTrajectory();
              }}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron font-bold text-xs shadow-md shadow-cyan-950/50 transition-all flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Open 72h Trajectory Predictor</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Top Summary Header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Risk Level</div>
            <div className="mt-1">
              <StatusBadge status={iceberg.riskLevel} />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Estimated Size</div>
            <div className="text-base font-orbitron font-bold text-cyan-300 mt-0.5">
              {iceberg.sizeKm} km
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase">Drift Velocity</div>
            <div className="text-base font-orbitron font-bold text-amber-300 mt-0.5">
              {iceberg.speedKnots} kts
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] font-mono text-slate-500 uppercase">CPA Clearance</div>
            <div className="text-base font-orbitron font-bold text-slate-100 mt-0.5">
              {iceberg.riskDistanceKm} km
            </div>
          </div>
        </div>

        {/* Physical Dimensions & Underwater Keel */}
        <div className="glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-900/50 space-y-3">
          <h4 className="text-xs font-orbitron font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Hydrodynamic & Geometric Dimensions</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Freeboard Height:</span>
              <div className="text-slate-200 font-bold mt-0.5">{iceberg.estimatedHeightM} meters above sea level</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Underwater Draft (Keel):</span>
              <div className="text-cyan-300 font-bold mt-0.5">~{iceberg.estimatedDraftM} meters depth</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">SAR Radar Signature:</span>
              <div className="text-slate-200 font-bold mt-0.5">{iceberg.sarCrossSection}</div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono text-cyan-200">
            ℹ️ <span className="font-bold">Keel-Current Interaction:</span> Approximately 88% of iceberg mass is submerged beneath the sea surface. Drift trajectory is primarily driven by 0-50m depth sub-surface ocean currents (65%) rather than surface wind forces alone.
          </div>
        </div>

        {/* 72-Hour Prediction Trajectory Table */}
        <div className="glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-900/50 space-y-2">
          <h4 className="text-xs font-orbitron font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Multi-Horizon Trajectory Forecast</span>
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase">
                  <th className="py-1.5 px-2">Time Horizon</th>
                  <th className="py-1.5 px-2">Projected Lat/Lon</th>
                  <th className="py-1.5 px-2">Uncertainty Radius</th>
                  <th className="py-1.5 px-2">RV Dhruv Proximity</th>
                  <th className="py-1.5 px-2">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {iceberg.predictedPath.map((step, idx) => (
                  <tr key={idx} className={idx === 2 ? 'bg-cyan-950/30 font-bold' : ''}>
                    <td className="py-2 px-2 text-cyan-300">+{step.hours} Hours</td>
                    <td className="py-2 px-2 font-mono">
                      {step.lat.toFixed(3)}°S, {step.lon.toFixed(3)}°E
                    </td>
                    <td className="py-2 px-2 text-amber-400">
                      ±{step.uncertaintyKm} km
                    </td>
                    <td className="py-2 px-2">
                      {Math.max(14, iceberg.riskDistanceKm - idx * 3.5).toFixed(1)} km
                    </td>
                    <td className="py-2 px-2 text-emerald-400">
                      {Math.max(65, iceberg.confidencePercent - idx * 3)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Modal>
  );
};
