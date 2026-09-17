import React from 'react';
import { 
  Eye, 
  Layers, 
  Crosshair, 
  TrendingUp, 
  BrainCircuit, 
  HelpCircle, 
  ShieldAlert, 
  Sliders, 
  UserCheck, 
  Compass, 
  RefreshCw 
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { AppNavModule } from '../../types';

interface StepNode {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  targetModule?: AppNavModule;
  stageNum: number;
}

const steps: StepNode[] = [
  { id: 'observe', label: 'OBSERVE', sublabel: 'Sentinel-1 SAR / Met', icon: Eye, targetModule: 'data-sources', stageNum: 1 },
  { id: 'fusion', label: 'DATA FUSION', sublabel: '5 Multi-Feeds', icon: Layers, targetModule: 'data-sources', stageNum: 2 },
  { id: 'detect', label: 'DETECT', sublabel: '17 Ice Targets', icon: Crosshair, targetModule: 'ice-analysis', stageNum: 3 },
  { id: 'track', label: 'TRACK', sublabel: 'Keel & Drift', icon: TrendingUp, targetModule: 'trajectory', stageNum: 4 },
  { id: 'predict', label: 'PREDICT', sublabel: '72h Monte Carlo', icon: BrainCircuit, targetModule: 'trajectory', stageNum: 5 },
  { id: 'uncertainty', label: 'UNCERTAINTY', sublabel: '±6 km Corridor', icon: HelpCircle, targetModule: 'trajectory', stageNum: 6 },
  { id: 'vessel-risk', label: 'VESSEL RISK', sublabel: 'PC5 Polar Class', icon: ShieldAlert, targetModule: 'risk-analysis', stageNum: 7 },
  { id: 'optimize', label: 'OPTIMIZE', sublabel: 'Multi-Objective', icon: Sliders, targetModule: 'route-planning', stageNum: 8 },
  { id: 'human-review', label: 'HUMAN REVIEW', sublabel: 'Navigator in Loop', icon: UserCheck, targetModule: 'route-planning', stageNum: 9 },
  { id: 'recommend', label: 'RECOMMEND', sublabel: 'Route Bravo Active', icon: Compass, targetModule: 'dashboard', stageNum: 10 },
  { id: 'continuous', label: 'CONTINUOUS UPDATE', sublabel: 'Dynamic Refresh', icon: RefreshCw, targetModule: 'system-health', stageNum: 11 },
];

export const DecisionChainBar: React.FC = () => {
  const { activeModule, setActiveModule, humanDecisionStatus } = useAppState();

  const getStepStatus = (step: StepNode) => {
    if (step.targetModule === activeModule) return 'active';
    if (step.id === 'human-review' && humanDecisionStatus === 'ACCEPTED') return 'completed';
    return 'nominal';
  };

  return (
    <div className="w-full glass-panel rounded-xl p-3 border-cyan-500/20 bg-slate-950/70 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[960px] gap-1">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(step);
          const isActive = status === 'active';
          const isHumanStep = step.id === 'human-review';

          return (
            <React.Fragment key={step.id}>
              {/* Step Button */}
              <button
                onClick={() => step.targetModule && setActiveModule(step.targetModule)}
                title={`Jump to ${step.label} (${step.sublabel})`}
                className={`flex-1 flex flex-col items-center text-center p-1.5 rounded-lg transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-cyan-500/20 border border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : isHumanStep
                    ? 'bg-amber-500/10 border border-amber-500/30 hover:border-amber-400'
                    : 'bg-slate-900/50 border border-slate-800 hover:border-cyan-500/30 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span
                    className={`w-3.5 h-3.5 rounded-full text-[9px] font-mono font-bold flex items-center justify-center ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950'
                        : isHumanStep
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {step.stageNum}
                  </span>
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive
                        ? 'text-cyan-300 animate-pulse'
                        : isHumanStep
                        ? 'text-amber-300'
                        : 'text-slate-400 group-hover:text-cyan-400'
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-orbitron font-bold tracking-tight uppercase leading-none ${
                    isActive
                      ? 'text-cyan-200'
                      : isHumanStep
                      ? 'text-amber-200'
                      : 'text-slate-200 group-hover:text-cyan-300'
                  }`}
                >
                  {step.label}
                </span>
                <span className="text-[8px] font-mono text-slate-400 mt-0.5 truncate max-w-full">
                  {step.sublabel}
                </span>
              </button>

              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="flex items-center px-0.5 text-cyan-600/40 text-[10px] font-mono select-none">
                  →
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
