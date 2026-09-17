import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AppRole, 
  AppNavModule, 
  Vessel, 
  Iceberg, 
  RouteOption, 
  AlertItem, 
  DemoScenario 
} from '../types';
import { mockVessel } from '../data/mockVessel';
import { mockIcebergs } from '../data/mockIcebergs';
import { mockRoutes } from '../data/mockRoutes';
import { mockAlerts } from '../data/mockAlerts';
import { mockScenarios } from '../data/mockScenarios';
import { maritimeAudio } from '../utils/audio';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

export interface MapLayerState {
  vessel: boolean;
  seaIce: boolean;
  icebergs: boolean;
  weather: boolean;
  oceanCurrents: boolean;
  riskZones: boolean;
  routes: boolean;
  uncertainty: boolean;
}

interface AppStateContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  activeModule: AppNavModule;
  setActiveModule: (module: AppNavModule) => void;
  vessel: Vessel;
  updateVessel: (partial: Partial<Vessel>) => void;
  icebergs: Iceberg[];
  selectedIceberg: Iceberg | null;
  setSelectedIceberg: (ib: Iceberg | null) => void;
  routes: RouteOption[];
  selectedRouteKey: 'shortest' | 'recommended' | 'safest';
  setSelectedRouteKey: (key: 'shortest' | 'recommended' | 'safest') => void;
  appliedRouteKey: 'shortest' | 'recommended' | 'safest';
  applyRoute: (key: 'shortest' | 'recommended' | 'safest') => void;
  alerts: AlertItem[];
  acknowledgeAlert: (id: string) => void;
  resolveAlert: (id: string) => void;
  activeScenario: DemoScenario;
  switchScenario: (scenarioId: string) => void;
  activeLayers: MapLayerState;
  toggleLayer: (layer: keyof MapLayerState) => void;
  setAllLayers: (layers: Partial<MapLayerState>) => void;
  humanDecisionStatus: 'PENDING' | 'ACCEPTED' | 'MODIFIED' | 'REJECTED';
  setHumanDecisionStatus: (status: 'PENDING' | 'ACCEPTED' | 'MODIFIED' | 'REJECTED') => void;
  isEmergencyOpen: boolean;
  setIsEmergencyOpen: (open: boolean) => void;
  isEmergencyTransmitted: boolean;
  triggerEmergencyTransmission: () => void;
  isSyncingSat: boolean;
  syncSatelliteData: () => void;
  dataConflictActive: boolean;
  setDataConflictActive: (active: boolean) => void;
  priorityWeights: { safety: number; fuel: number; time: number };
  setPriorityWeights: React.Dispatch<React.SetStateAction<{ safety: number; fuel: number; time: number }>>;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  isRouteAdjustmentOpen: boolean;
  setIsRouteAdjustmentOpen: (open: boolean) => void;
  isExplainabilityOpen: boolean;
  setIsExplainabilityOpen: (open: boolean) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<AppRole>('NAVIGATOR');
  const [activeModule, setActiveModuleState] = useState<AppNavModule>('dashboard');
  const [vessel, setVessel] = useState<Vessel>(mockVessel);
  const [icebergs, setIcebergs] = useState<Iceberg[]>(mockIcebergs);
  const [selectedIceberg, setSelectedIceberg] = useState<Iceberg | null>(mockIcebergs[0]);
  const [routes] = useState<RouteOption[]>(mockRoutes);
  const [selectedRouteKey, setSelectedRouteKey] = useState<'shortest' | 'recommended' | 'safest'>('recommended');
  const [appliedRouteKey, setAppliedRouteKey] = useState<'shortest' | 'recommended' | 'safest'>('recommended');
  const [alerts, setAlerts] = useState<AlertItem[]>(mockAlerts);
  const [activeScenario, setActiveScenario] = useState<DemoScenario>(mockScenarios[0]);
  
  const [activeLayers, setActiveLayers] = useState<MapLayerState>({
    vessel: true,
    seaIce: true,
    icebergs: true,
    weather: true,
    oceanCurrents: true,
    riskZones: true,
    routes: true,
    uncertainty: true,
  });

  const [humanDecisionStatus, setHumanDecisionStatus] = useState<'PENDING' | 'ACCEPTED' | 'MODIFIED' | 'REJECTED'>('PENDING');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState<boolean>(false);
  const [isEmergencyTransmitted, setIsEmergencyTransmitted] = useState<boolean>(false);
  const [isSyncingSat, setIsSyncingSat] = useState<boolean>(false);
  const [dataConflictActive, setDataConflictActive] = useState<boolean>(false);
  const [priorityWeights, setPriorityWeights] = useState({ safety: 85, fuel: 75, time: 60 });
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isRouteAdjustmentOpen, setIsRouteAdjustmentOpen] = useState<boolean>(false);
  const [isExplainabilityOpen, setIsExplainabilityOpen] = useState<boolean>(false);

  // Set sound
  const setSoundEnabled = (enabled: boolean) => {
    setSoundEnabledState(enabled);
    maritimeAudio.enabled = enabled;
  };

  const addToast = (toast: Omit<ToastMessage, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const timestamp = new Date().toLocaleTimeString();
    const newToast: ToastMessage = { ...toast, id, timestamp };
    setToasts((prev) => [newToast, ...prev.slice(0, 4)]);
    
    // Auto dismiss after 5s
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: AppRole) => {
    setRoleState(newRole);
    maritimeAudio.playUiClick();
    if (newRole === 'GROUND_COMMAND') {
      setActiveModuleState('ground-command');
      addToast({
        type: 'info',
        title: 'Role Switched: Ground Command',
        message: 'Accessing Antarctic Fleet Monitoring & Shore-to-Ship Operations Console.',
      });
    } else {
      setActiveModuleState('dashboard');
      addToast({
        type: 'info',
        title: 'Role Switched: Vessel Navigator',
        message: 'Connected to RV Dhruv Integrated Bridge System.',
      });
    }
  };

  const setActiveModule = (mod: AppNavModule) => {
    maritimeAudio.playUiClick();
    setActiveModuleState(mod);
  };

  const updateVessel = (partial: Partial<Vessel>) => {
    setVessel((prev) => ({ ...prev, ...partial }));
  };

  const applyRoute = (key: 'shortest' | 'recommended' | 'safest') => {
    setAppliedRouteKey(key);
    setSelectedRouteKey(key);
    setHumanDecisionStatus('ACCEPTED');
    maritimeAudio.playSonarPing();
    const route = routes.find((r) => r.key === key);
    addToast({
      type: 'success',
      title: 'Route Loaded into Navigation System',
      message: `${route?.name || 'Route'} is now active. Autopilot waypoints updated.`,
    });
  };

  const acknowledgeAlert = (id: string) => {
    maritimeAudio.playUiClick();
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
    addToast({
      type: 'info',
      title: 'Alert Acknowledged',
      message: 'Watch officer has confirmed awareness of this alert.',
    });
  };

  const resolveAlert = (id: string) => {
    maritimeAudio.playUiClick();
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
    addToast({
      type: 'success',
      title: 'Alert Resolved',
      message: 'Item has been moved to resolved log.',
    });
  };

  const toggleLayer = (layer: keyof MapLayerState) => {
    maritimeAudio.playUiClick();
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const setAllLayers = (layers: Partial<MapLayerState>) => {
    setActiveLayers((prev) => ({ ...prev, ...layers }));
  };

  const syncSatelliteData = () => {
    setIsSyncingSat(true);
    maritimeAudio.playSonarPing();
    addToast({
      type: 'info',
      title: 'Satellite Sync Initiated',
      message: 'Requesting updated Sentinel-1 SAR imagery and HYCOM current vectors over Iridium NEXT...',
    });

    setTimeout(() => {
      setIsSyncingSat(false);
      maritimeAudio.playSonarPing();
      addToast({
        type: 'success',
        title: 'Satellite Data Sync Complete',
        message: '2.4 MB received. 17 iceberg trajectories re-computed with 87% model confidence.',
      });
    }, 2400);
  };

  const triggerEmergencyTransmission = () => {
    setIsEmergencyTransmitted(true);
    maritimeAudio.playEmergencyAlarm();
    addToast({
      type: 'error',
      title: 'EMERGENCY DISTRESS BEACON ACTIVE',
      message: 'GMDSS Distress Telemetry & Geo-coordinates broadcasted to Maitri Ground Command & RV Aryabhata.',
    });
  };

  const switchScenario = (scenarioId: string) => {
    const found = mockScenarios.find((s) => s.id === scenarioId);
    if (!found) return;
    setActiveScenario(found);
    setSelectedRouteKey(found.activeRouteKey);
    setAppliedRouteKey(found.activeRouteKey);
    setDataConflictActive(Boolean(found.hasDataConflict));
    
    // Select the iceberg
    const targetIb = icebergs.find((ib) => ib.id === found.highlightIcebergId) || mockIcebergs[0];
    setSelectedIceberg(targetIb);

    if (found.severity === 'CRITICAL') {
      maritimeAudio.playAlertChime();
    } else {
      maritimeAudio.playUiClick();
    }

    addToast({
      type: found.severity === 'CRITICAL' ? 'error' : found.severity === 'WARNING' ? 'warning' : 'info',
      title: `Scenario Loaded: ${found.title}`,
      message: found.subtitle,
    });
  };

  // Initial welcome toast
  useEffect(() => {
    const timer = setTimeout(() => {
      addToast({
        type: 'info',
        title: 'Dhruv Netra Bridge AI Initialized',
        message: 'Sentinel-1 SAR online. Maitri route recommendation ready.',
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        role,
        setRole,
        activeModule,
        setActiveModule,
        vessel,
        updateVessel,
        icebergs,
        selectedIceberg,
        setSelectedIceberg,
        routes,
        selectedRouteKey,
        setSelectedRouteKey,
        appliedRouteKey,
        applyRoute,
        alerts,
        acknowledgeAlert,
        resolveAlert,
        activeScenario,
        switchScenario,
        activeLayers,
        toggleLayer,
        setAllLayers,
        humanDecisionStatus,
        setHumanDecisionStatus,
        isEmergencyOpen,
        setIsEmergencyOpen,
        isEmergencyTransmitted,
        triggerEmergencyTransmission,
        isSyncingSat,
        syncSatelliteData,
        dataConflictActive,
        setDataConflictActive,
        priorityWeights,
        setPriorityWeights,
        soundEnabled,
        setSoundEnabled,
        toasts,
        addToast,
        removeToast,
        isRouteAdjustmentOpen,
        setIsRouteAdjustmentOpen,
        isExplainabilityOpen,
        setIsExplainabilityOpen,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
