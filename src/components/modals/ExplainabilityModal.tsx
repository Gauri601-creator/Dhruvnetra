import React from 'react';
import { 
  BrainCircuit, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  Wind, 
  Waves, 
  Layers, 
  Eye, 
  Sparkles 
} from 'lucide-react';
import { Modal } from '../common/Modal';

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExplainabilityModal: React.FC<ExplainabilityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const riskFactors = [
    {
      factor: 'Iceberg IB-023 Proximity & Predicted Trajectory',
      impactPercent: 34,
      trend: '+34% Risk Contribution',
      color: 'rose',
      rationale: '1.8 km tabular iceberg with 195m underwater draft drifting at 0.7 kts directly crossing within 14.2 km of the direct rhumb line at +18h.',
      source: 'Sentinel-1 C-SAR + Hydrodynamic Drift Model',
    },
    {
      factor: 'Local Sea Ice Concentration (42% rising to 58%)',
      impactPercent: 22,
      trend: '+22% Risk Contribution',
      color: 'amber',
      rationale: 'Compressive first-year ice leads detected along the eastern shelf flank. Slows vessel speed and increases propeller blade cavitation.',
      source: 'Copernicus CryoSat-2 & SAR-C Segmentation',
    },
    {
      factor: 'Antarctic Coastal Current Cross-Flow (1.2 kts)',
      impactPercent: 18,
      trend: '+18% Risk Contribution',
      color: 'amber',
      rationale: 'Sub-surface current induces a lateral leeway drift on the hull, demanding constant rudder compensation of 2.4° to maintain heading.',
      source: 'HYCOM Global Ocean Analysis / Mercator 1/12°',
    },
    {
      factor: 'Katabatic Wind Shear & Reduced Visibility (8 km)',
      impactPercent: 15,
      trend: '+15% Risk Contribution',
      color: 'sky',
      rationale: '24 knot southeasterly winds off the Queen Maud ice sheet with sea smoke and polar haze reducing optical lookout range.',
      source: 'ECMWF IFS-HRES 10m Wind Forecast',
    },
    {
      factor: 'Model Trajectory Uncertainty (±6 km)',
      impactPercent: 11,
      trend: '+11% Risk Contribution',
      color: 'slate',
      rationale: '500 Monte Carlo dispersion runs show possible 6 km variance in iceberg drift due to unmodeled tidal oscillations.',
      source: 'Dhruv Netra Bayesian Ensemble Estimator',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI DECISION EXPLAINABILITY & RISK DECOMPOSITION"
      subtitle="Multi-Factor Attribution (SHAP-Based Risk Factor Decomposition)"
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full font-mono text-xs">
          <span className="text-slate-400">
            Algorithmic Rationale: <span className="text-cyan-300 font-bold">Uncertainty-Aware Pareto Optimization</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron font-bold text-xs shadow-md"
          >
            Acknowledge & Close
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Core Rationale Banner */}
        <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs font-mono space-y-1">
            <h4 className="font-bold text-cyan-200 text-sm font-orbitron">
              Why does Dhruv Netra recommend shifting 18 km West?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              The direct route passes through a high-probability collision zone for iceberg <strong className="text-white">IB-023</strong> and enters 58% compressed pack ice. By shifting 18 km West, the vessel gains an open leads channel, avoids structural hull strain, and aligns with the westward coastal current, saving <strong className="text-emerald-300">15 tons of bunker fuel (8.4%)</strong> while keeping risk <strong className="text-emerald-300">LOW (91% safety score)</strong>.
            </p>
          </div>
        </div>

        {/* Breakdown of contributing risk factors */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-orbitron font-bold text-slate-300 uppercase tracking-wider">
            Attributed Risk Contributors (Total: 100%)
          </h4>

          {riskFactors.map((rf, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-xl p-3 border-slate-800 bg-slate-900/60 font-mono text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">{rf.factor}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    rf.color === 'rose'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                      : rf.color === 'amber'
                      ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {rf.trend}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    rf.color === 'rose'
                      ? 'bg-rose-500'
                      : rf.color === 'amber'
                      ? 'bg-amber-400'
                      : 'bg-sky-400'
                  }`}
                  style={{ width: `${rf.impactPercent * 2.5}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{rf.rationale}</p>
              <div className="text-[10px] text-cyan-400/80">Source: {rf.source}</div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
