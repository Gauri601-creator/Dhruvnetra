export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AppRole = 'NAVIGATOR' | 'GROUND_COMMAND';
export type AppNavModule = 
  | 'landing'
  | 'dashboard'
  | 'live-map'
  | 'ice-analysis'
  | 'trajectory'
  | 'risk-analysis'
  | 'route-planning'
  | 'alerts'
  | 'data-sources'
  | 'satellite-comm'
  | 'vessel'
  | 'system-health'
  | 'prediction-reality'
  | 'emergency'
  | 'ground-command';

export interface LatLon {
  lat: number;
  lon: number;
  name?: string;
  hours?: number;
  uncertaintyKm?: number;
}

export interface Vessel {
  id: string;
  name: string;
  callsign: string;
  type: string;
  polarClass: string;
  lat: number;
  lon: number;
  speedKnots: number;
  headingDeg: number;
  destination: string;
  destinationLat: number;
  destinationLon: number;
  etaDays: number;
  etaHours: number;
  fuelRemainingTons: number;
  fuelCapacityTons: number;
  fuelBurnRatePerHour: number;
  engineLoadPercent: number;
  rudderAngleDeg: number;
  draftMeters: number;
  pitchDeg: number;
  rollDeg: number;
  progressPercent: number;
  distanceSailedKm: number;
  distanceRemainingKm: number;
  currentRiskLevel: RiskLevel;
  gpsStatus: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
  sensorsStatus: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE';
  commStatus: 'CONNECTED' | 'INTERMITTENT' | 'OFFLINE';
  aiEngineStatus: 'READY' | 'COMPUTING' | 'OFFLINE';
}

export interface Iceberg {
  id: string;
  code: string;
  name: string;
  lat: number;
  lon: number;
  sizeKm: number;
  estimatedHeightM: number;
  estimatedDraftM: number;
  speedKnots: number;
  directionDeg: number;
  directionText: string;
  riskLevel: RiskLevel;
  confidencePercent: number;
  riskDistanceKm: number;
  sarCrossSection: string;
  detectionSource: string;
  lastObservedUtc: string;
  classification: 'Tabular Iceberg' | 'Pinnacled Iceberg' | 'Bergy Bit' | 'Growler' | 'Giant Ice Island';
  historyPoints: LatLon[];
  predictedPath: LatLon[];
}

export interface RouteOption {
  id: string;
  key: 'shortest' | 'recommended' | 'safest';
  name: string;
  badgeLabel: string;
  tagline: string;
  distanceKm: number;
  fuelTons: number;
  etaDays: number;
  etaHours: number;
  riskLevel: RiskLevel;
  safetyScore: number; // 0-100
  fuelScore: number;   // 0-100
  timeScore: number;   // 0-100
  iceExposurePercent: number;
  description: string;
  waypoints: LatLon[];
  isRecommended?: boolean;
}

export interface AlertItem {
  id: string;
  code: string;
  category: 'CRITICAL' | 'WARNING' | 'ADVISORY' | 'INFO';
  timestamp: string;
  locationName: string;
  coordinates: string;
  title: string;
  description: string;
  recommendedAction: string;
  source: string;
  resolved: boolean;
  acknowledged: boolean;
}

export interface DataSourceItem {
  id: string;
  name: string;
  provider: string;
  category: 'EO_SATELLITE' | 'OCEANOGRAPHIC' | 'METEOROLOGICAL' | 'VESSEL_SENSORS' | 'HISTORICAL_CLIMATE';
  satelliteType?: 'EARTH_OBSERVATION' | 'COMMUNICATION';
  dataType: string;
  observationScope: string;
  status: 'LIVE' | 'DELAYED' | 'OFFLINE';
  freshness: string;
  lastUpdate: string;
  confidencePercent: number;
  resolution: string;
  bandwidth: string;
  description: string;
}

export interface SystemHealthItem {
  id: string;
  name: string;
  category: string;
  status: 'OPERATIONAL' | 'WARNING' | 'OFFLINE';
  uptimePercent: number;
  latencyMs: number;
  confidencePercent: number;
  lastCheck: string;
  details: string;
}

export interface FleetVessel {
  id: string;
  name: string;
  callsign: string;
  lat: number;
  lon: number;
  speedKnots: number;
  headingDeg: number;
  status: 'TRANSIT' | 'SURVEYING' | 'RESEARCH' | 'ICE_ESCORT' | 'EMERGENCY';
  currentArea: string;
  destination: string;
  eta: string;
  riskLevel: RiskLevel;
  fuelPercent: number;
  crewCount: number;
  activeAlertsCount: number;
  lastSatPing: string;
}

export interface DemoScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  severity: 'NOMINAL' | 'WARNING' | 'CRITICAL' | 'CONFLICT';
  activeRouteKey: 'shortest' | 'recommended' | 'safest';
  weatherAlert?: string;
  iceRisk: RiskLevel;
  highlightIcebergId: string;
  hasDataConflict?: boolean;
}
