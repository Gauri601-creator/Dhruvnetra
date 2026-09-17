import React from 'react';
import { 
  Ship, 
  ShieldAlert, 
  CloudSun, 
  Route, 
  Activity, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  XCircle, 
  Sparkles, 
  Eye, 
  Layers, 
  TrendingUp, 
  Wind, 
  Waves, 
  Thermometer, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';
import { DecisionChainBar } from '../common/DecisionChainBar';
import { AntarcticTacticalMap } from '../map/AntarcticTacticalMap';
import { useAppState } from '../../context/AppStateContext';

interface DashboardViewProps {
  onOpenIcebergModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenIcebergModal }) => {
  const {
    vessel,
    selectedIceberg,
    routes,
    selectedRouteKey,
    appliedRouteKey,
    applyRoute,
    humanDecisionStatus,
    setHumanDecisionStatus,
    setIsRouteAdjustmentOpen,
    setIsExplainabilityOpen,
    setActiveModule,
    alerts,
    activeScenario,
    addToast
  } = useAppState();

  const handleAccept = () => {
    applyRoute('recommended');
    setHumanDecisionStatus('ACCEPTED');
    addToast({
      type: 'success',
      title: 'Recommendation Accepted by Navigator',
      message: 'Route Bravo (18 km West Shift) locked as active navigation course.',
    });
  };

  const handleReject = () => {
    applyRoute('shortest');
    setHumanDecisionStatus('REJECTED');
    addToast({
      type: 'warning',
      title: 'Recommendation Overridden by Navigator',
      message: 'Maintaining current direct track. Watch officer maintains continuous visual radar watch.',
    });
  };

  const activeRoute = routes.find((r) => r.key === appliedRouteKey) || routes[1];

  return (
    <div className="space-y-4">
      {/* 1. Decision-Support Workflow Chain Tracker */}
      <DecisionChainBar />

      {/* 2. Top Summary Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3.5">
        {/* Card 1: Vessel Status */}
        <MetricCard
          title="Vessel Telemetry"
          value={vessel.name}
          subtitle={`66.712°S, 67.324°E • HDG ${vessel.headingDeg}°`}
          icon={Ship}
          accentColor="cyan"
          badge={<StatusBadge status="OPERATIONAL" label="PC5 POLAR" size="sm" />}
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>SOG: <strong className="text-cyan-300">{vessel.speedKnots} kts</strong></span>
            <span>Dest: <strong className="text-slate-100">Maitri Station</strong></span>
          </div>
          <div className="text-[11px] font-mono text-amber-300 mt-1">
            ETA: <strong>{vessel.etaDays}d {vessel.etaHours}h</strong> (Progress: {vessel.progressPercent}%)
          </div>
        </MetricCard>

        {/* Card 2: Ice Risk */}
        <MetricCard
          title="Ice & Iceberg Risk"
          value={vessel.currentRiskLevel}
          subtitle="3 icebergs detected in 50 km"
          icon={ShieldAlert}
          accentColor={vessel.currentRiskLevel === 'HIGH' ? 'rose' : 'amber'}
          badge={<StatusBadge status={vessel.currentRiskLevel} size="sm" pulse />}
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>Sea Ice: <strong className="text-cyan-300">42%</strong></span>
            <span>Type: <strong className="text-slate-100">Medium 1st-Yr</strong></span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Nearest Target: <strong className="text-amber-400">IB-023 (34 km)</strong>
          </div>
        </MetricCard>

        {/* Card 3: Weather */}
        <MetricCard
          title="Marine Weather"
          value="-8.0°C"
          subtitle="ECMWF Polar Atmospheric Feed"
          icon={CloudSun}
          accentColor="blue"
          badge={<StatusBadge status="OPERATIONAL" label="MET FEED" size="sm" />}
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="flex items-center gap-1">
              <Wind className="w-3 h-3 text-sky-400" />
              <strong>24 kts NW</strong>
            </span>
            <span className="flex items-center gap-1">
              <Waves className="w-3 h-3 text-cyan-400" />
              <strong>2.8 m swell</strong>
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Visibility: <strong className="text-slate-200">8 km (Polar Haze)</strong>
          </div>
        </MetricCard>

        {/* Card 4: Active Route */}
        <MetricCard
          title="AI Route Optimization"
          value={activeRoute.badgeLabel.split(' ')[0] + ' (' + activeRoute.name.split(' ')[1] + ')'}
          subtitle={`${activeRoute.distanceKm} km • ${activeRoute.fuelTons} tons fuel`}
          icon={Route}
          accentColor="emerald"
          badge={<StatusBadge status={activeRoute.riskLevel} label="OPTIMAL" size="sm" />}
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>Fuel Saving: <strong className="text-emerald-400">8.4%</strong></span>
            <span>Confidence: <strong className="text-cyan-300">91%</strong></span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            Transit: <strong>{activeRoute.etaDays}d {activeRoute.etaHours}h</strong>
          </div>
        </MetricCard>

        {/* Card 5: System Status */}
        <MetricCard
          title="Data & AI Engine"
          value="ALL ONLINE"
          subtitle="Sentinel-1 SAR + Iridium NEXT"
          icon={Activity}
          accentColor="cyan"
          badge={<StatusBadge status="LIVE" size="sm" />}
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span>Sensors: <strong className="text-emerald-400">CONNECTED</strong></span>
            <span>AI: <strong className="text-cyan-400">READY</strong></span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 mt-1">
            SatCom Latency: <strong className="text-slate-200">680 ms</strong>
          </div>
        </MetricCard>
      </div>

      {/* 3. Main Command Center Grid: Map on Left (70%), AI Decision & Human-in-the-Loop on Right (30%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left 8 Cols: Large Interactive Antarctic Tactical Map */}
        <div className="xl:col-span-8 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-orbitron font-bold text-slate-100 uppercase tracking-wider">
                Tactical Polar Navigation Map (Princess Astrid Coast Sector)
              </h2>
            </div>
            <button
              onClick={() => setActiveModule('live-map')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Full Screen Bridge Map</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <AntarcticTacticalMap
            height="460px"
            onSelectIceberg={() => onOpenIcebergModal()}
          />
        </div>

        {/* Right 4 Cols: AI Decision Summary, Human Review & Live Alerts */}
        <div className="xl:col-span-4 space-y-3.5 flex flex-col justify-between">
          {/* AI Decision Summary Card */}
          <div className="glass-panel rounded-xl p-4 border-cyan-500/30 bg-slate-950/80 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-xs font-orbitron font-bold text-cyan-200 uppercase tracking-wide">
                  AI Decision Summary
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                Confidence: 91%
              </span>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Current direct route remains navigable, but <strong>3 icebergs are detected within 50 km</strong>. Predicted iceberg movement indicates rising collision risk along the eastern corridor due to <strong className="text-rose-400">IB-023 trajectory convergence</strong>. Recommended route shifts <strong>18 km West</strong> into open leads, exploiting coastal currents to save <strong>8.4% fuel</strong>.
            </p>

            <div className="flex items-center justify-between pt-1 font-mono text-xs">
              <button
                onClick={() => setIsExplainabilityOpen(true)}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <span>Why is this area risky?</span>
                <ChevronRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => setActiveModule('route-planning')}
                className="text-xs px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700"
              >
                Compare 3 Routes →
              </button>
            </div>
          </div>

          {/* Human-In-The-Loop Action Console */}
          <div className="glass-panel rounded-xl p-4 border-amber-500/30 bg-slate-950/90 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-orbitron font-bold text-amber-300 uppercase">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Human-In-The-Loop Review</span>
              </div>
              <span
                className={`text-[9px] px-2 py-0.5 rounded font-mono font-bold uppercase ${
                  humanDecisionStatus === 'ACCEPTED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    : humanDecisionStatus === 'MODIFIED'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                    : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                }`}
              >
                {humanDecisionStatus}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 font-mono italic">
              “Final navigation decision remains strictly with the vessel navigator.”
            </p>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <button
                onClick={handleAccept}
                className="py-2.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex flex-col items-center justify-center gap-1 shadow-md transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px]">Accept Rec.</span>
              </button>

              <button
                onClick={() => setIsRouteAdjustmentOpen(true)}
                className="py-2.5 px-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex flex-col items-center justify-center gap-1 shadow-md transition-all"
              >
                <Sliders className="w-4 h-4" />
                <span className="text-[10px]">Modify Route</span>
              </button>

              <button
                onClick={handleReject}
                className="py-2.5 px-2 rounded-lg bg-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 border border-slate-700 flex flex-col items-center justify-center gap-1 transition-all"
              >
                <XCircle className="w-4 h-4" />
                <span className="text-[10px]">Override</span>
              </button>
            </div>
          </div>

          {/* Live Alert Feed Snippet */}
          <div className="glass-panel rounded-xl p-3.5 border-slate-800 bg-slate-950/70 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-300 uppercase tracking-wider">
                Bridge Alerts ({alerts.filter(a => !a.resolved).length})
              </span>
              <button
                onClick={() => setActiveModule('alerts')}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-1.5">
              {alerts.slice(0, 2).map((alt) => (
                <div
                  key={alt.id}
                  className={`p-2 rounded-lg border text-xs font-mono flex items-start gap-2 ${
                    alt.category === 'CRITICAL'
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                      : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1 shrink-0 animate-ping"></span>
                  <div className="min-w-0">
                    <div className="font-bold truncate">{alt.title}</div>
                    <div className="text-[10px] text-slate-400 truncate">{alt.recommendedAction}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
