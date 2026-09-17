import React, { useState } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Search, 
  Volume2, 
  VolumeX, 
  Check, 
  Eye, 
  ArrowRight 
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { AlertItem } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const AlertsView: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, soundEnabled, setSoundEnabled } = useAppState();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredAlerts = alerts.filter((a) => {
    const matchesCategory = 
      filterCategory === 'ALL' 
        ? true 
        : filterCategory === 'RESOLVED' 
        ? a.resolved 
        : a.category === filterCategory && !a.resolved;
    
    const matchesSearch = 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.locationName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const criticalCount = alerts.filter((a) => a.category === 'CRITICAL' && !a.resolved).length;
  const warningCount = alerts.filter((a) => a.category === 'WARNING' && !a.resolved).length;
  const advisoryCount = alerts.filter((a) => a.category === 'ADVISORY' && !a.resolved).length;
  const resolvedCount = alerts.filter((a) => a.resolved).length;

  return (
    <div className="space-y-4 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-xl border-cyan-500/20 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-950 border border-rose-500/40 text-rose-400">
            <Bell className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-orbitron font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>Bridge Alerts & Hazardous Event Feed</span>
              {criticalCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/50 font-bold animate-pulse">
                  {criticalCount} CRITICAL ACTIVE
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-400">
              Real-time multi-sensor threshold warnings, trajectory crossing alerts, and oceanographic advisories.
            </p>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          <span>{soundEnabled ? 'Audio Alert Chimes ON' : 'Audio Muted'}</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-3 rounded-xl border-slate-800 bg-slate-950/70">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { key: 'ALL', label: `All Alerts (${alerts.length})` },
            { key: 'CRITICAL', label: `Critical (${criticalCount})`, color: 'rose' },
            { key: 'WARNING', label: `Warning (${warningCount})`, color: 'amber' },
            { key: 'ADVISORY', label: `Advisory (${advisoryCount})`, color: 'sky' },
            { key: 'RESOLVED', label: `Resolved Log (${resolvedCount})`, color: 'emerald' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterCategory(tab.key)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterCategory === tab.key
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400 font-bold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search alerts by title or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none w-64"
          />
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center glass-panel rounded-xl border-slate-800 text-slate-400">
            No alerts matching current category and search filter.
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.category === 'CRITICAL';
            const isWarning = alert.category === 'WARNING';
            const isAdvisory = alert.category === 'ADVISORY';

            const borderColors = alert.resolved
              ? 'border-slate-800 bg-slate-950/40 opacity-70'
              : isCritical
              ? 'border-rose-500/50 bg-rose-950/30 shadow-lg shadow-rose-950/30'
              : isWarning
              ? 'border-amber-500/40 bg-amber-950/20 shadow-md'
              : isAdvisory
              ? 'border-sky-500/30 bg-sky-950/20'
              : 'border-emerald-500/30 bg-emerald-950/20';

            const iconMap = {
              CRITICAL: <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />,
              WARNING: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />,
              ADVISORY: <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />,
              INFO: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
            };

            return (
              <div
                key={alert.id}
                className={`glass-panel rounded-xl p-4 border transition-all flex flex-col md:flex-row items-start justify-between gap-4 ${borderColors}`}
              >
                {/* Left Side Info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {iconMap[alert.category]}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-orbitron font-bold text-sm text-slate-100">
                        {alert.title}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {alert.code}
                      </span>
                      <StatusBadge status={alert.category} size="sm" pulse={isCritical && !alert.resolved} />
                    </div>

                    <div className="text-[11px] text-cyan-400/90">
                      📍 {alert.locationName} ({alert.coordinates}) • <span className="text-slate-400">{alert.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300 font-sans leading-relaxed pt-0.5">
                      {alert.description}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-amber-300 flex items-start gap-2 mt-2">
                      <span className="font-bold uppercase text-slate-400">Action:</span>
                      <span className="text-slate-200">{alert.recommendedAction}</span>
                    </div>

                    <div className="text-[10px] text-slate-500 pt-1">
                      Sensor Source: {alert.source}
                    </div>
                  </div>
                </div>

                {/* Right Side Buttons */}
                <div className="shrink-0 flex items-center md:flex-col gap-2 w-full md:w-auto justify-end">
                  {!alert.resolved ? (
                    <>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors"
                        >
                          Acknowledge
                        </button>
                      )}
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600/80 hover:bg-emerald-600 text-white font-mono text-xs transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolve</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolved</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
