import React, { useState } from 'react';
import { AppStateProvider, useAppState } from './context/AppStateContext';
import { Topbar } from './components/common/Topbar';
import { Sidebar } from './components/common/Sidebar';
import { ToastContainer } from './components/common/Toast';

// Modals
import { IcebergDetailModal } from './components/modals/IcebergDetailModal';
import { RouteAdjustmentModal } from './components/modals/RouteAdjustmentModal';
import { ExplainabilityModal } from './components/modals/ExplainabilityModal';
import { EmergencySosModal } from './components/modals/EmergencySosModal';
import { ScenarioSelectorModal } from './components/modals/ScenarioSelectorModal';

// Views
import { LandingView } from './components/modules/LandingView';
import { DashboardView } from './components/modules/DashboardView';
import { LiveMapView } from './components/modules/LiveMapView';
import { IceAnalysisView } from './components/modules/IceAnalysisView';
import { TrajectoryPredictionView } from './components/modules/TrajectoryPredictionView';
import { RiskAnalysisView } from './components/modules/RiskAnalysisView';
import { RoutePlanningView } from './components/modules/RoutePlanningView';
import { AlertsView } from './components/modules/AlertsView';
import { DataFusionView } from './components/modules/DataFusionView';
import { SatelliteCommView } from './components/modules/SatelliteCommView';
import { VesselView } from './components/modules/VesselView';
import { SystemHealthView } from './components/modules/SystemHealthView';
import { PredictionRealityView } from './components/modules/PredictionRealityView';
import { GroundCommandView } from './components/modules/GroundCommandView';

const MainLayout: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    selectedIceberg,
    isEmergencyOpen,
    setIsEmergencyOpen,
    isRouteAdjustmentOpen,
    setIsRouteAdjustmentOpen,
    isExplainabilityOpen,
    setIsExplainabilityOpen,
  } = useAppState();

  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState<boolean>(false);
  const [isIcebergModalOpen, setIsIcebergModalOpen] = useState<boolean>(false);

  // Render current active screen
  const renderActiveModule = () => {
    switch (activeModule) {
      case 'landing':
        return <LandingView />;
      case 'dashboard':
        return <DashboardView onOpenIcebergModal={() => setIsIcebergModalOpen(true)} />;
      case 'live-map':
        return <LiveMapView onOpenIcebergModal={() => setIsIcebergModalOpen(true)} />;
      case 'ice-analysis':
        return <IceAnalysisView onOpenIcebergModal={() => setIsIcebergModalOpen(true)} />;
      case 'trajectory':
        return <TrajectoryPredictionView />;
      case 'risk-analysis':
        return <RiskAnalysisView />;
      case 'route-planning':
        return <RoutePlanningView />;
      case 'alerts':
        return <AlertsView />;
      case 'data-sources':
        return <DataFusionView />;
      case 'satellite-comm':
        return <SatelliteCommView />;
      case 'vessel':
        return <VesselView />;
      case 'system-health':
        return <SystemHealthView />;
      case 'prediction-reality':
        return <PredictionRealityView />;
      case 'emergency':
        return (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl glass-panel-danger border-rose-500/60 text-center space-y-3">
              <h2 className="text-2xl font-orbitron font-black text-rose-300">
                EMERGENCY DISTRESS OPERATIONS CENTER
              </h2>
              <p className="text-sm font-mono text-rose-200/90 max-w-xl mx-auto">
                GMDSS Polar Emergency Protocol active. Transmit distress position to Ground Command, Maitri Station Haven, and nearby vessels.
              </p>
              <button
                onClick={() => setIsEmergencyOpen(true)}
                className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-orbitron font-bold text-sm shadow-2xl animate-pulse"
              >
                OPEN EMERGENCY SOS CONSOLE
              </button>
            </div>
            <DashboardView onOpenIcebergModal={() => setIsIcebergModalOpen(true)} />
          </div>
        );
      case 'ground-command':
        return <GroundCommandView />;
      default:
        return <DashboardView onOpenIcebergModal={() => setIsIcebergModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#040814] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Topbar */}
      <Topbar onOpenScenarioModal={() => setIsScenarioModalOpen(true)} />

      {/* Main Workspace Area with Sidebar and Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* If not in landing view, show Sidebar */}
        {activeModule !== 'landing' && <Sidebar />}

        {/* Dynamic Screen Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-5 relative">
          {renderActiveModule()}
        </main>
      </div>

      {/* Floating Notifications Toast Container */}
      <ToastContainer />

      {/* Global Modals */}
      <IcebergDetailModal
        iceberg={selectedIceberg}
        isOpen={isIcebergModalOpen}
        onClose={() => setIsIcebergModalOpen(false)}
        onViewTrajectory={() => setActiveModule('trajectory')}
      />

      <RouteAdjustmentModal
        isOpen={isRouteAdjustmentOpen}
        onClose={() => setIsRouteAdjustmentOpen(false)}
      />

      <ExplainabilityModal
        isOpen={isExplainabilityOpen}
        onClose={() => setIsExplainabilityOpen(false)}
      />

      <EmergencySosModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
      />

      <ScenarioSelectorModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppStateProvider>
      <MainLayout />
    </AppStateProvider>
  );
}

export default App;
