import React, { useState } from 'react';
import { 
  Layers, 
  Crosshair, 
  Satellite, 
  Eye, 
  Search, 
  Filter, 
  Sliders, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2,
  Sparkles,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { Iceberg, RiskLevel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';

interface IceAnalysisViewProps {
  onOpenIcebergModal: (ib: Iceberg) => void;
}

export const IceAnalysisView: React.FC<IceAnalysisViewProps> = ({ onOpenIcebergModal }) => {
  const { icebergs, selectedIceberg, setSelectedIceberg, setActiveModule } = useAppState();
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [sarSliderPos, setSarSliderPos] = useState<number>(50);

  const filteredIcebergs = icebergs.filter((ib) => {
    const matchesSearch = 
      ib.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ib.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ib.classification.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === 'ALL' || ib.riskLevel === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const highRiskCount = icebergs.filter((ib) => ib.riskLevel === 'HIGH' || ib.riskLevel === 'CRITICAL').length;
  const mediumRiskCount = icebergs.filter((ib) => ib.riskLevel === 'MEDIUM').length;
  const lowRiskCount = icebergs.filter((ib) => ib.riskLevel === 'LOW').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 glass-panel p-4 rounded-xl border-cyan-500/20 bg-slate-950/80 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-400/40 text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-orbitron font-bold text-slate-100 uppercase tracking-wider">
              Sea Ice & Iceberg Detection Analytics
            </h2>
            <p className="text-[11px] text-slate-400">
              Sentinel-1 Synthetic Aperture Radar (SAR) Segmentation & Hydrodynamic Target Classification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Latest Pass Ingest:</span>
          <span className="text-cyan-300 font-bold bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            Sentinel-1B IW (17:15 UTC)
          </span>
        </div>
      </div>

      {/* SECTION A – SEA ICE EXTENT & CONCENTRATION METRICS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-orbitron font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span>SECTION A — SEA ICE CONCENTRATION & CLASSIFICATION</span>
          </h3>
          <span className="text-[11px] font-mono text-slate-500">Source: Sentinel-1 SAR + CryoSat-2 Altimetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
          <MetricCard
            title="Sea Ice Concentration"
            value="42%"
            subtitle="Regional Mean (Princess Astrid)"
            icon={Layers}
            accentColor="cyan"
            badge={<StatusBadge status="MEDIUM" label="MODERATE" size="sm" />}
          />

          <MetricCard
            title="Antarctic Ice Extent"
            value="3.2M km²"
            subtitle="Seasonal Minimum Margin"
            icon={Compass}
            accentColor="blue"
            badge={<StatusBadge status="OPERATIONAL" label="NSIDC ATLAS" size="sm" />}
          />

          <MetricCard
            title="Ice Thickness / Ridge"
            value="1.4 m avg"
            subtitle="Multi-Year Ridge: up to 3.8m"
            icon={TrendingUp}
            accentColor="amber"
            badge={<StatusBadge status="MEDIUM" label="PC5 CAPABLE" size="sm" />}
          />

          <MetricCard
            title="Total Targets Detected"
            value="17 Targets"
            subtitle="2 High • 5 Med • 10 Low"
            icon={Crosshair}
            accentColor="rose"
            badge={<StatusBadge status="HIGH" label="ACTIVE" size="sm" />}
          />
        </div>

        {/* Ice Classification Spectrum Bar */}
        <div className="glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-900/60 font-mono text-xs space-y-2.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="font-bold uppercase tracking-wider">Multi-Spectral Ice Classification Breakdown:</span>
            <span className="text-[11px] text-cyan-400">Total Navigable Open Leads: 58%</span>
          </div>

          {/* Color Stacked Bar */}
          <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner">
            <div style={{ width: '28%' }} className="bg-sky-500/80 hover:opacity-90" title="Open Water: 28%" />
            <div style={{ width: '30%' }} className="bg-cyan-400/80 hover:opacity-90" title="Thin Ice / Nilas: 30%" />
            <div style={{ width: '26%' }} className="bg-blue-600/80 hover:opacity-90" title="Medium First-Year Ice: 26%" />
            <div style={{ width: '16%' }} className="bg-slate-200 hover:opacity-90" title="Thick Multi-Year Ice: 16%" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span className="text-slate-300">Open Water (28%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Thin Ice / Nilas (30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-slate-300">Medium 1st-Year (26%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
              <span className="text-slate-300">Thick Multi-Year (16%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B – ICEBERG DETECTION RADAR TABLE */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div>
            <h3 className="text-xs font-orbitron font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <span>SECTION B — DETECTED ICEBERG INVENTORY (17 DETECTED)</span>
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Click any iceberg row to inspect telemetry, cross-section and 72-hour drift projections.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter by ID, name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-400 focus:outline-none"
            >
              <option value="ALL">All Risks ({icebergs.length})</option>
              <option value="HIGH">High Risk ({highRiskCount})</option>
              <option value="MEDIUM">Medium Risk ({mediumRiskCount})</option>
              <option value="LOW">Low Risk ({lowRiskCount})</option>
            </select>
          </div>
        </div>

        {/* Iceberg Table */}
        <div className="glass-panel rounded-xl border-cyan-500/20 bg-slate-950/80 overflow-hidden">
          <div className="overflow-x-auto max-h-[380px]">
            <table className="w-full text-xs font-mono text-left">
              <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase tracking-wider sticky top-0 border-b border-slate-800 z-10">
                <tr>
                  <th className="py-2.5 px-3">Iceberg ID</th>
                  <th className="py-2.5 px-3">Coordinates</th>
                  <th className="py-2.5 px-3">Est. Size</th>
                  <th className="py-2.5 px-3">Drift Speed</th>
                  <th className="py-2.5 px-3">Direction</th>
                  <th className="py-2.5 px-3">Clearance (CPA)</th>
                  <th className="py-2.5 px-3">Risk Rating</th>
                  <th className="py-2.5 px-3">AI Confidence</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredIcebergs.map((ib) => {
                  const isSelected = selectedIceberg?.id === ib.id;
                  return (
                    <tr
                      key={ib.id}
                      onClick={() => {
                        setSelectedIceberg(ib);
                        onOpenIcebergModal(ib);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-950/40 font-semibold'
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-orbitron font-bold text-cyan-300">{ib.code}</span>
                          <span className="text-[10px] text-slate-500 truncate max-w-[120px] hidden md:inline">
                            {ib.classification}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {ib.lat.toFixed(2)}°S, {ib.lon.toFixed(2)}°E
                      </td>
                      <td className="py-2.5 px-3 text-cyan-200 font-bold">{ib.sizeKm} km</td>
                      <td className="py-2.5 px-3 text-amber-300">{ib.speedKnots} kts</td>
                      <td className="py-2.5 px-3">{ib.directionText}</td>
                      <td className="py-2.5 px-3 font-bold">
                        <span className={ib.riskDistanceKm < 40 ? 'text-rose-400' : 'text-slate-300'}>
                          {ib.riskDistanceKm} km
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <StatusBadge status={ib.riskLevel} size="sm" />
                      </td>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">
                        {ib.confidencePercent}%
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIceberg(ib);
                            onOpenIcebergModal(ib);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-cyan-900 text-cyan-300 text-[10px] font-mono transition-colors"
                        >
                          Inspect →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION C – SENTINEL-1 SAR OBSERVATION & AI SEGMENTATION COMPARATOR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-orbitron font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <span>SECTION C — SATELLITE OBSERVATION: SENTINEL-1 C-SAR SPECKLE vs AI SEGMENTATION</span>
          </h3>
          <span className="text-[10px] font-mono text-amber-400">
            *Simulated Synthetic Aperture Radar Visualizer (Demo Prototype)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Interactive Radar Comparison Canvas / Visualizer */}
          <div className="lg:col-span-8 glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-950/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-300 font-bold">
                Sentinel-1 Interferometric Wide Swath (250 km)
              </span>
              <span className="text-cyan-300">
                Slider Position: {sarSliderPos}% AI Mask
              </span>
            </div>

            {/* Side-by-side simulated SAR canvas */}
            <div className="relative h-64 w-full rounded-xl overflow-hidden border border-cyan-500/30 bg-[#06101e]">
              {/* Layer 1: Raw SAR Microwave Speckle Pattern (Left) */}
              <div
                className="absolute inset-0 bg-[#0a1828] flex items-center justify-center p-4"
                style={{
                  backgroundImage: `radial-gradient(circle at 40% 40%, rgba(255,255,255,0.18) 0%, transparent 60%), radial-gradient(circle at 60% 60%, rgba(255,255,255,0.12) 0%, transparent 50%)`,
                }}
              >
                <div className="text-center font-mono text-xs text-slate-400 opacity-60">
                  <div className="text-base font-orbitron font-bold text-slate-200">RAW SAR SPECKLE RADAR (σ⁰ BACKSCATTER)</div>
                  <p className="mt-1 text-[11px]">24h Polar Darkness & Heavy Cloud Penetration</p>
                </div>
              </div>

              {/* Layer 2: AI-Segmented Mask (Revealed by Slider) */}
              <div
                className="absolute inset-0 bg-cyan-950/70 border-r-2 border-cyan-400 flex items-center justify-center p-4 transition-all"
                style={{
                  width: `${sarSliderPos}%`,
                  overflow: 'hidden',
                  backgroundImage: `radial-gradient(circle at 35% 45%, rgba(6, 182, 212, 0.4) 0%, transparent 40%), radial-gradient(circle at 65% 55%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)`,
                }}
              >
                <div className="min-w-[400px] text-center font-mono text-xs text-cyan-200">
                  <div className="text-base font-orbitron font-bold text-cyan-300">AI TARGET & ICE MASK SEGMENTATION</div>
                  <p className="mt-1 text-[11px] text-emerald-300">17 Icebergs Classified • 42% Pack Ice Extent</p>
                </div>
              </div>

              {/* Slider Control Handle */}
              <input
                type="range"
                min="0"
                max="100"
                value={sarSliderPos}
                onChange={(e) => setSarSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              />
            </div>

            <p className="text-[11px] font-mono text-slate-400">
              ↔ Drag the slider across the frame to compare Raw SAR microwave backscatter intensity against the AI deep-learning ice-edge segmentation mask.
            </p>
          </div>

          {/* Pipeline Step Infographic */}
          <div className="lg:col-span-4 glass-panel rounded-xl p-4 border-cyan-500/20 bg-slate-950/80 space-y-3 flex flex-col justify-between font-mono text-xs">
            <h4 className="text-xs font-orbitron font-bold text-cyan-300 uppercase tracking-wider">
              SAR Detection Pipeline
            </h4>

            <div className="space-y-2">
              {[
                { step: '1. SATELLITE INGEST', desc: 'Sentinel-1 C-band SAR Level-1 GRD microwave swath.', color: 'text-cyan-400' },
                { step: '2. DATA PROCESSING', desc: 'Radiometric calibration & Lee-Sigma speckle noise filter.', color: 'text-sky-400' },
                { step: '3. ICE DETECTION', desc: 'U-Net segmentation classifies icebergs vs open water leads.', color: 'text-emerald-400' },
                { step: '4. RISK ANALYSIS', desc: 'Hydrodynamic drift physics calculates 72h collision risk.', color: 'text-amber-400' },
              ].map((pipe, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 space-y-0.5">
                  <div className={`font-bold ${pipe.color} text-[11px]`}>{pipe.step}</div>
                  <div className="text-[10px] text-slate-400 leading-tight">{pipe.desc}</div>
                </div>
              ))}
            </div>

            <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30 text-[10px] text-cyan-300">
              ✓ <span className="font-bold">Next Satellite Pass:</span> Sentinel-1A in +3h 40m (Polar Orbit #44121)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
