import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Layers, 
  TrendingUp, 
  ShieldAlert, 
  Route, 
  Bell, 
  Database, 
  Ship, 
  Activity, 
  AlertTriangle,
  GitCompare,
  Satellite,
  Radio,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { AppNavModule } from '../../types';

interface NavItem {
  id: AppNavModule;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: 'cyan' | 'rose' | 'amber';
  roles?: Array<'NAVIGATOR' | 'GROUND_COMMAND'>;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
  { id: 'live-map', label: '2. Live Map', icon: Map, badge: 'TACTICAL' },
  { id: 'ice-analysis', label: '3. Ice & Icebergs', icon: Layers, badge: '17' },
  { id: 'trajectory', label: '4. Trajectory Pred.', icon: TrendingUp, badge: '72h' },
  { id: 'risk-analysis', label: '5. Risk Analysis', icon: ShieldAlert, badge: 'MED', badgeColor: 'amber' },
  { id: 'route-planning', label: '6. Route Planning', icon: Route, badge: '3' },
  { id: 'alerts', label: '7. Alerts Feed', icon: Bell, badge: '2', badgeColor: 'rose' },
  { id: 'data-sources', label: '8. Data Sources', icon: Database },
  { id: 'satellite-comm', label: '9. SatCom Arch.', icon: Satellite },
  { id: 'vessel', label: '10. Vessel Telemetry', icon: Ship },
  { id: 'system-health', label: '11. System Health', icon: Activity },
  { id: 'prediction-reality', label: '12. Pred. vs Reality', icon: GitCompare, badge: '4.8km' },
  { id: 'emergency', label: '13. Emergency SOS', icon: AlertTriangle, badgeColor: 'rose' },
];

export const Sidebar: React.FC = () => {
  const { 
    activeModule, 
    setActiveModule, 
    role, 
    alerts, 
    isSyncingSat,
    dataConflictActive 
  } = useAppState();

  const criticalAlertsCount = alerts.filter(a => a.category === 'CRITICAL' && !a.resolved).length;

  return (
    <aside className="w-64 glass-panel border-r border-cyan-500/20 bg-slate-950/90 flex flex-col justify-between shrink-0 h-[calc(100vh-4rem)] select-none">
      {/* Top section with Navigation items */}
      <div className="p-3 overflow-y-auto space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-cyan-400/70 font-semibold flex items-center justify-between">
          <span>NAVIGATION CONSOLE</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
            {role === 'NAVIGATOR' ? 'SHIP' : 'HQ'}
          </span>
        </div>

        {/* If Ground Command view, show direct link to Ground Command overview */}
        {role === 'GROUND_COMMAND' && (
          <button
            onClick={() => setActiveModule('ground-command')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-150 ${
              activeModule === 'ground-command'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400 shadow-md shadow-cyan-950/40'
                : 'text-cyan-300 hover:bg-slate-900/80 border border-cyan-500/30'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Ship className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span>Fleet Control Center</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-500/30 text-cyan-200">
              3 SHIPS
            </span>
          </button>
        )}

        <div className="pt-1 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            const isAlertItem = item.id === 'alerts';
            const badgeValue = isAlertItem && criticalAlertsCount > 0 ? criticalAlertsCount : item.badge;
            const isEmergencyItem = item.id === 'emergency';

            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all duration-150 group ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 shadow-md shadow-cyan-950/40 font-bold'
                    : isEmergencyItem
                    ? 'text-rose-400 hover:bg-rose-950/30 hover:text-rose-200'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-cyan-300'
                        : isEmergencyItem
                        ? 'text-rose-400'
                        : 'text-slate-400 group-hover:text-cyan-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {badgeValue && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold uppercase shrink-0 ${
                      item.badgeColor === 'rose' || (isAlertItem && criticalAlertsCount > 0)
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40 animate-pulse'
                        : item.badgeColor === 'amber'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {badgeValue}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Status Section */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 space-y-2">
        <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold px-1">
          SYSTEM HEALTH & TELEMETRY
        </div>

        {/* Satellite Link */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">Satellite Link</span>
          </div>
          <span className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            CONNECTED
          </span>
        </div>

        {/* Data Sync */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Satellite className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-300">Data Sync</span>
          </div>
          <span className={`font-bold text-[10px] flex items-center gap-1 ${isSyncingSat ? 'text-amber-400' : 'text-emerald-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isSyncingSat ? 'bg-amber-400 animate-spin' : 'bg-emerald-400'}`}></span>
            {isSyncingSat ? 'SYNCING...' : 'LIVE'}
          </span>
        </div>

        {/* AI Engine */}
        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-300">AI Engine</span>
          </div>
          <span className={`font-bold text-[10px] flex items-center gap-1 ${dataConflictActive ? 'text-amber-400' : 'text-cyan-400'}`}>
            <CheckCircle2 className="w-3 h-3" />
            {dataConflictActive ? 'CAUTION' : 'READY'}
          </span>
        </div>
      </div>
    </aside>
  );
};
