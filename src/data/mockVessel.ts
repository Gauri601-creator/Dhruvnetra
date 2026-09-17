import { Vessel } from '../types';

export const mockVessel: Vessel = {
  id: 'vessel-dhruv-01',
  name: 'RV Dhruv',
  callsign: 'VT-DHRUV',
  type: 'Polar Research & Icebreaker Vessel',
  polarClass: 'IACS Polar Class 5 (PC5 - Year-round medium first-year ice)',
  lat: 66.712, // 66.712° S
  lon: 67.324, // 67.324° E (Approaching Antarctic Convergence toward Maitri Support Zone)
  speedKnots: 12.5,
  headingDeg: 184,
  destination: 'Maitri Station (Schirmacher Oasis)',
  destinationLat: 70.767,
  destinationLon: 11.733,
  etaDays: 5,
  etaHours: 14,
  fuelRemainingTons: 642,
  fuelCapacityTons: 950,
  fuelBurnRatePerHour: 1.34,
  engineLoadPercent: 68,
  rudderAngleDeg: 2.4,
  draftMeters: 8.6,
  pitchDeg: 1.2,
  rollDeg: -2.1,
  progressPercent: 64,
  distanceSailedKm: 1820,
  distanceRemainingKm: 1465,
  currentRiskLevel: 'MEDIUM',
  gpsStatus: 'OPERATIONAL',
  sensorsStatus: 'OPERATIONAL',
  commStatus: 'CONNECTED',
  aiEngineStatus: 'READY',
};

export const vesselTelemetryHistory = [
  { time: '00:00', speed: 13.1, fuelBurn: 1.42, waveHeight: 3.2, iceConc: 20 },
  { time: '04:00', speed: 12.8, fuelBurn: 1.38, waveHeight: 3.0, iceConc: 28 },
  { time: '08:00', speed: 12.5, fuelBurn: 1.35, waveHeight: 2.8, iceConc: 35 },
  { time: '12:00', speed: 12.2, fuelBurn: 1.32, waveHeight: 2.9, iceConc: 40 },
  { time: '16:00', speed: 12.5, fuelBurn: 1.34, waveHeight: 2.8, iceConc: 42 },
  { time: '20:00', speed: 12.4, fuelBurn: 1.33, waveHeight: 2.7, iceConc: 44 },
];
