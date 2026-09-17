import React from 'react';
import { 
  Map as MapIcon, 
  Layers, 
  Eye, 
  Compass, 
  Crosshair, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2,
  Sliders,
  Filter
} from 'lucide-react';
import { AntarcticTacticalMap } from '../map/AntarcticTacticalMap';
import { useAppState } from '../../context/AppStateContext';

interface LiveMapViewProps {
  onOpenIcebergModal: () => void;
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({ onOpenIcebergModal }) => {
  const { 
    vessel, 
    icebergs, 
    selectedIceberg, 
    setSelectedIceberg, 
    activeLayers, 
    toggleLayer, 
    routes, 
    selectedRouteKey, 
    setSelectedRouteKey,
    applyRoute 
  } = useAppState();

  return (
    <div className="space-y-3">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-3 rounded-xl border-cyan-500/20 bg-slate-950/80 font-mono text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-400">
            <MapIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-orbitron font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <span>Full-Screen Tactical Navigation Bridge Display</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                POLAR STEREO 67°E
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Interactive multi-layer polar radar overlay with hydrodynamic iceberg vectors & safe corridor routes.
            </p>
          </div>
        </div>

        {/* Quick Route Selector in Live Map */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          {routes.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRouteKey(r.key)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all ${
                selectedRouteKey === r.key
                  ? r.key === 'recommended'
                    ? 'bg-cyan-500/30 text-cyan-200 border border-cyan-400 font-bold'
                    : r.key === 'safest'
                    ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400 font-bold'
                    : 'bg-rose-500/30 text-rose-200 border border-rose-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {r.name.split(' ')[1]} ({r.distanceKm} km)
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative">
        <AntarcticTacticalMap
          height="calc(100vh - 15rem)"
          fullscreen={true}
          onSelectIceberg={() => onOpenIcebergModal()}
        />
      </div>
    </div>
  );
};
