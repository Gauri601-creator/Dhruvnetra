import React from 'react';
import { Sparkles, Check, AlertTriangle, ShieldAlert, GitCompare, Radio } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useAppState } from '../../context/AppStateContext';
import { mockScenarios } from '../../data/mockScenarios';

interface ScenarioSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScenarioSelectorModal: React.FC<ScenarioSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activeScenario, switchScenario } = useAppState();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="DEMO SCENARIO SANDBOX (SMART INDIA HACKATHON 2026)"
      subtitle="Simulate real-world Antarctic navigation and sensor conditions"
      maxWidth="2xl"
      footer={
        <div className="flex items-center justify-between w-full font-mono text-xs text-slate-400">
          <span>Preset conditions update map overlays, alerts, risk scores and AI recommendations.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-orbitron font-bold text-xs"
          >
            Done
          </button>
        </div>
      }
    >
      <div className="space-y-3 font-mono text-xs">
        <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 text-xs">
          💡 <span className="font-bold">Judge Demo Guide:</span> Use this sandbox to instantly showcase how Dhruv Netra responds to nominal conditions, sudden iceberg trajectory shifts, sensor data conflicts, and severe polar gales without manual setup.
        </div>

        <div className="grid grid-cols-1 gap-3">
          {mockScenarios.map((sc) => {
            const isSelected = activeScenario.id === sc.id;
            const icons = {
              NOMINAL: <Radio className="w-5 h-5 text-emerald-400" />,
              CRITICAL: <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />,
              CONFLICT: <GitCompare className="w-5 h-5 text-amber-400" />,
              WARNING: <AlertTriangle className="w-5 h-5 text-amber-400" />,
            };

            const borderColors = isSelected
              ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/50'
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700';

            return (
              <div
                key={sc.id}
                onClick={() => {
                  switchScenario(sc.id);
                  onClose();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-4 ${borderColors}`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800 shrink-0 mt-0.5">
                    {icons[sc.severity]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-orbitron font-bold text-slate-100 text-sm">
                        {sc.title}
                      </h4>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                          sc.severity === 'CRITICAL'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40'
                            : sc.severity === 'CONFLICT'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                            : sc.severity === 'WARNING'
                            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {sc.severity}
                      </span>
                    </div>
                    <div className="text-cyan-400 text-xs font-semibold mt-0.5">
                      {sc.subtitle}
                    </div>
                    <p className="text-slate-400 text-[11px] mt-1 font-sans leading-relaxed">
                      {sc.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-4 h-4 font-bold" />
                    </div>
                  ) : (
                    <button className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]">
                      Activate
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
