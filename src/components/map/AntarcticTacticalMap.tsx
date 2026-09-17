import React, { useState, useRef, useEffect } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  Layers, 
  Compass, 
  Eye, 
  Ruler, 
  Radio, 
  Maximize2 
} from 'lucide-react';
import { useAppState } from '../../context/AppStateContext';
import { Iceberg, LatLon } from '../../types';

interface MapProps {
  height?: string;
  showControls?: boolean;
  interactive?: boolean;
  onSelectIceberg?: (ib: Iceberg) => void;
  highlightRouteKey?: 'shortest' | 'recommended' | 'safest';
  fullscreen?: boolean;
}

export const AntarcticTacticalMap: React.FC<MapProps> = ({
  height = '500px',
  showControls = true,
  interactive = true,
  onSelectIceberg,
  highlightRouteKey,
  fullscreen = false,
}) => {
  const {
    vessel,
    icebergs,
    selectedIceberg,
    setSelectedIceberg,
    routes,
    selectedRouteKey,
    appliedRouteKey,
    activeLayers,
    toggleLayer,
    activeScenario
  } = useAppState();

  const [zoom, setZoom] = useState<number>(1.2);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [radarScanActive, setRadarScanActive] = useState<boolean>(true);
  const [layerMenuOpen, setLayerMenuOpen] = useState<boolean>(false);
  const [hoveredIceberg, setHoveredIceberg] = useState<Iceberg | null>(null);
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lon: string }>({ lat: '66.712°S', lon: '67.324°E' });

  const containerRef = useRef<HTMLDivElement>(null);

  // Map coordinate bounds
  // Lat: 63°S (Top) to 72°S (Bottom)
  // Lon: 58°E (Left) to 76°E (Right)
  const minLat = 63.0;
  const maxLat = 72.0;
  const minLon = 58.0;
  const maxLon = 76.0;

  // Transform Lat/Lon to SVG coordinate space (800 x 600 viewbox)
  const project = (lat: number, lon: number): { x: number; y: number } => {
    // Normalization
    const xNorm = (lon - minLon) / (maxLon - minLon);
    const yNorm = (lat - minLat) / (maxLat - minLat);
    return {
      x: xNorm * 800,
      y: yNorm * 600,
    };
  };

  // Convert SVG coordinate back to Lat/Lon for cursor readout
  const unproject = (svgX: number, svgY: number): { lat: number; lon: number } => {
    const lon = minLon + (svgX / 800) * (maxLon - minLon);
    const lat = minLat + (svgY / 600) * (maxLat - minLat);
    return { lat, lon };
  };

  // Mouse handlers for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }

    // Readout coordinates
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left - pan.x) / zoom;
      const relY = (e.clientY - rect.top - pan.y) / zoom;
      const svgX = (relX / rect.width) * 800;
      const svgY = (relY / rect.height) * 600;
      const { lat, lon } = unproject(svgX, svgY);
      setCursorCoords({
        lat: `${Math.abs(lat).toFixed(3)}°S`,
        lon: `${Math.abs(lon).toFixed(3)}°E`,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoom(1.2);
    setPan({ x: 0, y: 0 });
  };

  const centerOnVessel = () => {
    setZoom(1.8);
    const vesselProj = project(vessel.lat, vessel.lon);
    // Center vessel in 800x600 viewBox
    const targetPanX = 400 - vesselProj.x * 1.8;
    const targetPanY = 300 - vesselProj.y * 1.8;
    setPan({ x: targetPanX / 3, y: targetPanY / 3 });
  };

  const vesselPos = project(vessel.lat, vessel.lon);
  const maitriPos = project(70.767, 68.200); // Projected anchor approach coordinates
  const activeRoute = routes.find((r) => r.key === (highlightRouteKey || selectedRouteKey)) || routes[1];

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full overflow-hidden rounded-xl border border-cyan-500/30 bg-[#030914] select-none ${
        fullscreen ? 'h-[calc(100vh-10rem)]' : ''
      }`}
      style={{ height: fullscreen ? undefined : height }}
    >
      {/* Background Tactical Grid & Radar Polar Display */}
      <div className="absolute inset-0 tactical-grid-bg opacity-30 pointer-events-none" />

      {/* Dynamic SVG Map Layer */}
      <svg
        viewBox="0 0 800 600"
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-75"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <defs>
          {/* Radial Gradient for Radar Sweep */}
          <radialGradient id="radarSweepGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#00f2fe" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#00f2fe" stopOpacity="0" />
          </radialGradient>

          {/* Sea Ice Concentration Gradient */}
          <linearGradient id="seaIceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.05" />
            <stop offset="40%" stopColor="#0ea5e9" stopOpacity="0.25" />
            <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.9" />
          </linearGradient>

          {/* Risk Zone Pattern */}
          <pattern id="riskHatch" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="12" stroke="#ef4444" strokeWidth="2.5" opacity="0.4" />
          </pattern>

          {/* Uncertainty Cone Pattern */}
          <radialGradient id="uncertaintyGradient" cx="20%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
          </radialGradient>
        </defs>

        {/* 1. POLAR COORDINATE LATITUDE & LONGITUDE RINGS */}
        <g className="opacity-25" stroke="#00f2fe" strokeWidth="0.75" strokeDasharray="3 3">
          {/* Latitude Lines */}
          {[64, 66, 68, 70, 72].map((latVal) => {
            const p = project(latVal, 60);
            return (
              <g key={`lat-${latVal}`}>
                <line x1="0" y1={p.y} x2="800" y2={p.y} />
                <text x="15" y={p.y - 4} fill="#00f2fe" fontSize="9" fontFamily="monospace" opacity="0.8">
                  {latVal}°00'S
                </text>
              </g>
            );
          })}
          {/* Longitude Meridians */}
          {[60, 64, 68, 72, 76].map((lonVal) => {
            const p = project(64, lonVal);
            return (
              <g key={`lon-${lonVal}`}>
                <line x1={p.x} y1="0" x2={p.x} y2="600" />
                <text x={p.x + 4} y="590" fill="#00f2fe" fontSize="9" fontFamily="monospace" opacity="0.8">
                  {lonVal}°00'E
                </text>
              </g>
            );
          })}
        </g>

        {/* 2. ANTARCTICA CONTINENTAL COASTLINE & FAST ICE SHELF (Queen Maud Land / Princess Astrid) */}
        <g id="antarctic-coast">
          {/* Deep Antarctic Continental Ice Sheet */}
          <path
            d="M 0,480 Q 150,490 320,470 T 520,495 T 700,460 T 800,480 L 800,600 L 0,600 Z"
            fill="#081e3a"
            stroke="#38bdf8"
            strokeWidth="2"
            opacity="0.95"
          />
          {/* Amery Ice Shelf & Queen Maud Glacier Tongues */}
          <path
            d="M 280,470 Q 360,430 420,450 T 480,490 Z"
            fill="#0c2d54"
            stroke="#7dd3fc"
            strokeWidth="1.5"
            opacity="0.85"
          />
          <text x="40" y="550" fill="#93c5fd" fontSize="13" fontFamily="Orbitron" fontWeight="bold" opacity="0.7">
            ANTARCTIC CONTINENT (QUEEN MAUD LAND)
          </text>
          <text x="40" y="568" fill="#38bdf8" fontSize="10" fontFamily="monospace" opacity="0.6">
            Princess Astrid Coast • Sector 67°E - 72°E
          </text>
        </g>

        {/* 3. SEA ICE CONCENTRATION HEATMAP (Layer Toggle) */}
        {activeLayers.seaIce && (
          <g id="sea-ice-layer" opacity="0.75">
            {/* Open Water Lead vs Medium Ice (40-60%) */}
            <path
              d="M 0,220 Q 200,280 400,240 T 800,260 L 800,480 L 0,480 Z"
              fill="url(#seaIceGradient)"
            />
            {/* Dense Pack Ice Zone (60-85%) */}
            <path
              d="M 120,340 Q 280,310 440,350 T 780,320 L 780,480 L 120,480 Z"
              fill="#38bdf8"
              opacity="0.25"
            />
            {/* Sea Ice Lead Annotation */}
            <text x="140" y="270" fill="#38bdf8" fontSize="9" fontFamily="monospace" opacity="0.8">
              [CONC: 42% FIRST-YEAR ICE LEAD]
            </text>
            <text x="480" y="360" fill="#f43f5e" fontSize="9" fontFamily="monospace" opacity="0.8">
              [CONC: 74% HEAVY PRESSURE RIDGES]
            </text>
          </g>
        )}

        {/* 4. OCEAN CURRENTS & WIND VECTORS (Layer Toggle) */}
        {activeLayers.oceanCurrents && (
          <g id="ocean-currents" stroke="#38bdf8" strokeWidth="1" opacity="0.55">
            {/* Antarctic Coastal Current (Westward / NW drift) */}
            {[
              { x: 180, y: 150, dx: -25, dy: 15 },
              { x: 320, y: 180, dx: -28, dy: 18 },
              { x: 480, y: 160, dx: -30, dy: 12 },
              { x: 620, y: 200, dx: -24, dy: 16 },
              { x: 260, y: 290, dx: -22, dy: 14 },
              { x: 430, y: 310, dx: -26, dy: 18 },
              { x: 590, y: 300, dx: -20, dy: 12 },
            ].map((v, i) => (
              <g key={`cur-${i}`}>
                <line x1={v.x} y1={v.y} x2={v.x + v.dx} y2={v.y + v.dy} />
                <polygon
                  points={`${v.x + v.dx},${v.y + v.dy} ${v.x + v.dx + 4},${v.y + v.dy - 3} ${v.x + v.dx + 4},${v.y + v.dy + 3}`}
                  fill="#38bdf8"
                />
              </g>
            ))}
            <text x="220" y="140" fill="#38bdf8" fontSize="9" fontFamily="monospace">
              Antarctic Coastal Current (0.8 kt WSW)
            </text>
          </g>
        )}

        {/* 5. HIGH RISK ICEBERG DRIFT / COMPRESSION ZONES (Layer Toggle) */}
        {activeLayers.riskZones && (
          <g id="risk-zones">
            {/* Danger Polygon near IB-023 Eastern corridor */}
            <polygon
              points="420,180 580,190 620,330 460,310"
              fill="url(#riskHatch)"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.8"
            />
            <text x="470" y="240" fill="#ef4444" fontSize="10" fontFamily="Orbitron" fontWeight="bold">
              HIGH RISK ZONE (IB-023 CONVERGENCE)
            </text>
          </g>
        )}

        {/* 6. ROUTE OVERLAYS (Routes A, B, C) */}
        {activeLayers.routes && (
          <g id="routes-layer">
            {/* ROUTE A: SHORTEST (Red / Caution dashed) */}
            <path
              d={`M ${project(66.712, 67.324).x},${project(66.712, 67.324).y} L ${project(67.35, 67.45).x},${project(67.35, 67.45).y} L ${project(68.2, 67.6).x},${project(68.2, 67.6).y} L ${project(69.4, 66.8).x},${project(69.4, 66.8).y} L ${maitriPos.x},${maitriPos.y}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth={selectedRouteKey === 'shortest' ? '3.5' : '2'}
              strokeDasharray="6 4"
              opacity={selectedRouteKey === 'shortest' ? 1 : 0.45}
            />

            {/* ROUTE C: SAFEST ALTERNATIVE (Emerald dotted) */}
            <path
              d={`M ${project(66.712, 67.324).x},${project(66.712, 67.324).y} L ${project(66.9, 65.5).x},${project(66.9, 65.5).y} L ${project(67.6, 64.8).x},${project(67.6, 64.8).y} L ${project(68.6, 64.1).x},${project(68.6, 64.1).y} L ${project(69.9, 63.8).x},${project(69.9, 63.8).y} L ${maitriPos.x},${maitriPos.y}`}
              fill="none"
              stroke="#10b981"
              strokeWidth={selectedRouteKey === 'safest' ? '3.5' : '2'}
              strokeDasharray="4 4"
              opacity={selectedRouteKey === 'safest' ? 1 : 0.5}
            />

            {/* ROUTE B: RECOMMENDED (Cyan Solid Glowing) */}
            <path
              d={`M ${project(66.712, 67.324).x},${project(66.712, 67.324).y} L ${project(67.15, 66.75).x},${project(67.15, 66.75).y} L ${project(67.95, 66.3).x},${project(67.95, 66.3).y} L ${project(68.85, 65.8).x},${project(68.85, 65.8).y} L ${project(69.8, 64.9).x},${project(69.8, 64.9).y} L ${maitriPos.x},${maitriPos.y}`}
              fill="none"
              stroke="#00f2fe"
              strokeWidth={selectedRouteKey === 'recommended' ? '4' : '2.5'}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={selectedRouteKey === 'recommended' ? 1 : 0.6}
              filter="drop-shadow(0 0 8px rgba(0, 242, 254, 0.7))"
            />

            {/* Waypoints for Active Route */}
            {activeRoute.waypoints.map((wp: LatLon, idx: number) => {
              const p = project(wp.lat, wp.lon);
              return (
                <g key={`wp-${idx}`}>
                  <circle cx={p.x} cy={p.y} r="4" fill="#030712" stroke="#00f2fe" strokeWidth="2" />
                  <text x={p.x + 7} y={p.y + 3} fill="#00f2fe" fontSize="8" fontFamily="monospace">
                    WP{idx}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* 7. DESTINATION: MAITRI STATION HAVEN */}
        <g id="destination-marker">
          <circle cx={maitriPos.x} cy={maitriPos.y} r="8" fill="#10b981" opacity="0.3" className="animate-ping" />
          <circle cx={maitriPos.x} cy={maitriPos.y} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
          <polygon
            points={`${maitriPos.x},${maitriPos.y - 12} ${maitriPos.x + 14},${maitriPos.y - 7} ${maitriPos.x},${maitriPos.y - 2}`}
            fill="#10b981"
          />
          <text x={maitriPos.x + 10} y={maitriPos.y + 16} fill="#10b981" fontSize="10" fontFamily="Orbitron" fontWeight="bold">
            MAITRI STATION (HAVEN)
          </text>
          <text x={maitriPos.x + 10} y={maitriPos.y + 27} fill="#94a3b8" fontSize="8" fontFamily="monospace">
            70.767°S, 11.733°E (Approach)
          </text>
        </g>

        {/* 8. ICEBERG PREDICTED TRAJECTORY & UNCERTAINTY CONE (For Selected Iceberg e.g. IB-023) */}
        {activeLayers.uncertainty && selectedIceberg && (
          <g id="iceberg-trajectory-corridor">
            {/* Uncertainty Cone Polygon */}
            {selectedIceberg.predictedPath.length > 1 && (
              <path
                d={`M ${project(selectedIceberg.lat, selectedIceberg.lon).x},${project(selectedIceberg.lat, selectedIceberg.lon).y} 
                    L ${project(selectedIceberg.predictedPath[5]?.lat || selectedIceberg.lat, selectedIceberg.predictedPath[5]?.lon || selectedIceberg.lon).x + 24},${project(selectedIceberg.predictedPath[5]?.lat || selectedIceberg.lat, selectedIceberg.predictedPath[5]?.lon || selectedIceberg.lon).y + 18}
                    L ${project(selectedIceberg.predictedPath[5]?.lat || selectedIceberg.lat, selectedIceberg.predictedPath[5]?.lon || selectedIceberg.lon).x - 24},${project(selectedIceberg.predictedPath[5]?.lat || selectedIceberg.lat, selectedIceberg.predictedPath[5]?.lon || selectedIceberg.lon).y - 18}
                    Z`}
                fill="url(#uncertaintyGradient)"
                stroke="#f59e0b"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            )}

            {/* Historical Trail */}
            {selectedIceberg.historyPoints.length > 1 && (
              <path
                d={selectedIceberg.historyPoints.reduce((acc, pt, i) => {
                  const p = project(pt.lat, pt.lon);
                  return i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
                }, '')}
                fill="none"
                stroke="#94a3b8"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                opacity="0.6"
              />
            )}

            {/* Predicted 72h Path */}
            <path
              d={selectedIceberg.predictedPath.reduce((acc, pt, i) => {
                const p = project(pt.lat, pt.lon);
                return i === 0 ? `M ${p.x},${p.y}` : `${acc} L ${p.x},${p.y}`;
              }, '')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />

            {/* Predicted Waypoint Markers */}
            {selectedIceberg.predictedPath.map((pt, i) => {
              const p = project(pt.lat, pt.lon);
              return (
                <g key={`pred-pt-${i}`}>
                  <circle cx={p.x} cy={p.y} r={2.5 + i * 0.4} fill="#f59e0b" opacity="0.9" />
                  <text x={p.x + 5} y={p.y + 3} fill="#fcd34d" fontSize="7" fontFamily="monospace">
                    +{pt.hours}h (±{pt.uncertaintyKm}km)
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* 9. ICEBERG MARKERS (17 Targets) */}
        {activeLayers.icebergs && (
          <g id="icebergs-layer">
            {icebergs.map((ib) => {
              const p = project(ib.lat, ib.lon);
              const isSelected = selectedIceberg?.id === ib.id;
              const isHovered = hoveredIceberg?.id === ib.id;
              const sizeRadius = Math.max(4, Math.min(12, ib.sizeKm * 3.5));

              const isHighRisk = ib.riskLevel === 'HIGH' || ib.riskLevel === 'CRITICAL';
              const markerColor = isHighRisk ? '#ef4444' : ib.riskLevel === 'MEDIUM' ? '#f59e0b' : '#38bdf8';

              return (
                <g
                  key={ib.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIceberg(ib);
                    if (onSelectIceberg) onSelectIceberg(ib);
                  }}
                  onMouseEnter={() => setHoveredIceberg(ib)}
                  onMouseLeave={() => setHoveredIceberg(null)}
                  className="cursor-pointer group"
                >
                  {/* Danger pulse ring */}
                  {isHighRisk && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={sizeRadius + 6}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.2"
                      opacity="0.6"
                      className="animate-ping"
                    />
                  )}

                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={sizeRadius + 5}
                      fill="none"
                      stroke="#00f2fe"
                      strokeWidth="2"
                      strokeDasharray="3 2"
                    />
                  )}

                  {/* Iceberg Polygon Body (Polygonal tabular iceberg shape) */}
                  <polygon
                    points={`
                      ${p.x - sizeRadius},${p.y + sizeRadius * 0.6}
                      ${p.x - sizeRadius * 0.7},${p.y - sizeRadius}
                      ${p.x + sizeRadius * 0.8},${p.y - sizeRadius * 0.8}
                      ${p.x + sizeRadius},${p.y + sizeRadius * 0.5}
                      ${p.x + sizeRadius * 0.2},${p.y + sizeRadius}
                    `}
                    fill={markerColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? '2' : '1'}
                    opacity={isSelected || isHovered ? 1 : 0.85}
                  />

                  {/* Velocity Vector Arrow */}
                  <line
                    x1={p.x}
                    y1={p.y}
                    x2={p.x + Math.sin((ib.directionDeg * Math.PI) / 180) * (ib.speedKnots * 18)}
                    y2={p.y - Math.cos((ib.directionDeg * Math.PI) / 180) * (ib.speedKnots * 18)}
                    stroke={markerColor}
                    strokeWidth="1.5"
                  />

                  {/* Iceberg ID Tag */}
                  <text
                    x={p.x + sizeRadius + 3}
                    y={p.y + 3}
                    fill={isSelected ? '#00f2fe' : '#e2e8f0'}
                    fontSize={isSelected ? '10' : '8'}
                    fontFamily="Orbitron"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {ib.code} ({ib.sizeKm}km)
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {/* 10. VESSEL MARKER: RV DHRUV */}
        {activeLayers.vessel && (
          <g id="vessel-marker">
            {/* Safety Proximity Zone (12 NM / approx. 22 km) */}
            <circle
              cx={vesselPos.x}
              cy={vesselPos.y}
              r="28"
              fill="rgba(0, 242, 254, 0.06)"
              stroke="#00f2fe"
              strokeWidth="1"
              strokeDasharray="4 2"
            />

            {/* Heading Vector (HDG 184°) */}
            <line
              x1={vesselPos.x}
              y1={vesselPos.y}
              x2={vesselPos.x + Math.sin((vessel.headingDeg * Math.PI) / 180) * 45}
              y2={vesselPos.y - Math.cos((vessel.headingDeg * Math.PI) / 180) * 45}
              stroke="#00f2fe"
              strokeWidth="2.5"
              strokeDasharray="2 2"
            />

            {/* Vessel Hull Silhouette (Pointed Ship Arrow) */}
            <g transform={`translate(${vesselPos.x}, ${vesselPos.y}) rotate(${vessel.headingDeg})`}>
              <polygon
                points="0,-16 9,12 0,7 -9,12"
                fill="#00f2fe"
                stroke="#ffffff"
                strokeWidth="1.5"
                filter="drop-shadow(0 0 6px rgba(0, 242, 254, 0.9))"
              />
              <circle cx="0" cy="0" r="2.5" fill="#030712" />
            </g>

            {/* Vessel Label */}
            <g transform={`translate(${vesselPos.x + 16}, ${vesselPos.y - 12})`}>
              <rect x="0" y="0" width="95" height="32" rx="4" fill="#050b14" stroke="#00f2fe" strokeWidth="1" opacity="0.9" />
              <text x="6" y="13" fill="#00f2fe" fontSize="9" fontFamily="Orbitron" fontWeight="bold">
                {vessel.name}
              </text>
              <text x="6" y="25" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                {vessel.speedKnots} kts • HDG {vessel.headingDeg}°
              </text>
            </g>
          </g>
        )}

        {/* 11. RADAR SWEEP ANIMATION OVERLAY */}
        {radarScanActive && (
          <g id="radar-sweep" transform={`translate(${vesselPos.x}, ${vesselPos.y})`}>
            <circle cx="0" cy="0" r="140" fill="none" stroke="#00f2fe" strokeWidth="0.5" opacity="0.2" />
            <circle cx="0" cy="0" r="80" fill="none" stroke="#00f2fe" strokeWidth="0.5" opacity="0.3" />
            <path
              d="M 0,0 L 0,-140 A 140,140 0 0,1 120,-70 Z"
              fill="url(#radarSweepGradient)"
              className="animate-radar origin-center"
            />
          </g>
        )}
      </svg>

      {/* FLOATING TOP-LEFT MAP OVERLAYS & CONTROLS */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
        {/* Active Map Scenario & Mode Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg glass-panel text-xs font-mono border-cyan-500/40 text-cyan-300 shadow-lg">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-bold">ANTARCTIC TACTICAL RADAR</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">POLAR STEREO 67°E</span>
        </div>

        {/* Cursor Coordinates Readout */}
        <div className="px-3 py-1 rounded-md bg-slate-950/90 border border-slate-800 text-[11px] font-mono text-slate-400">
          POS: <span className="text-cyan-300 font-bold">{cursorCoords.lat}, {cursorCoords.lon}</span>
        </div>
      </div>

      {/* FLOATING TOP-RIGHT MAP CONTROLS */}
      {showControls && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {/* Layer Selector Toggle */}
          <div className="relative">
            <button
              onClick={() => setLayerMenuOpen(!layerMenuOpen)}
              className="p-2 rounded-lg glass-panel hover:bg-slate-800 text-cyan-400 border-cyan-500/30 transition-all flex items-center gap-1 text-xs font-mono"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Layers</span>
            </button>

            {/* Layer Checklist Dropdown */}
            {layerMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 glass-panel rounded-xl p-3 border-cyan-500/30 shadow-2xl bg-slate-950/95 space-y-2 z-30 font-mono text-xs">
                <div className="font-bold text-slate-200 border-b border-slate-800 pb-1.5 text-[11px] uppercase tracking-wider text-cyan-400">
                  Tactical Map Layers
                </div>
                {[
                  { key: 'vessel' as const, label: 'RV Dhruv Vessel' },
                  { key: 'seaIce' as const, label: 'Sea Ice Heatmap' },
                  { key: 'icebergs' as const, label: '17 Icebergs & Vectors' },
                  { key: 'oceanCurrents' as const, label: 'Ocean Currents' },
                  { key: 'riskZones' as const, label: 'High Risk Zones' },
                  { key: 'routes' as const, label: 'Multi-Routes (A/B/C)' },
                  { key: 'uncertainty' as const, label: '72h Uncertainty Cone' },
                ].map((layer) => (
                  <label key={layer.key} className="flex items-center gap-2 cursor-pointer hover:text-cyan-300 text-slate-300">
                    <input
                      type="checkbox"
                      checked={activeLayers[layer.key]}
                      onChange={() => toggleLayer(layer.key)}
                      className="rounded border-cyan-500/50 bg-slate-900 text-cyan-500 focus:ring-0"
                    />
                    <span>{layer.label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Radar Sweep Toggle */}
          <button
            onClick={() => setRadarScanActive(!radarScanActive)}
            title={radarScanActive ? 'Stop Radar Sweep' : 'Start Radar Sweep'}
            className={`p-2 rounded-lg glass-panel border-cyan-500/30 transition-all ${
              radarScanActive ? 'text-cyan-400 bg-cyan-950/50' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Radio className="w-4 h-4" />
          </button>

          {/* Center on vessel */}
          <button
            onClick={centerOnVessel}
            title="Center on RV Dhruv"
            className="p-2 rounded-lg glass-panel hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border-cyan-500/30 transition-all"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Zoom In */}
          <button
            onClick={() => setZoom((prev) => Math.min(prev + 0.3, 3.5))}
            title="Zoom In"
            className="p-2 rounded-lg glass-panel hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border-cyan-500/30 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => setZoom((prev) => Math.max(prev - 0.3, 0.7))}
            title="Zoom Out"
            className="p-2 rounded-lg glass-panel hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border-cyan-500/30 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset View */}
          <button
            onClick={resetView}
            title="Reset Map Bounds"
            className="p-2 rounded-lg glass-panel hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border-cyan-500/30 transition-all"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* FLOATING BOTTOM-LEFT: SELECTED / HOVERED ICEBERG QUICK INSPECTION CARD */}
      {(hoveredIceberg || selectedIceberg) && (
        <div className="absolute bottom-3 left-3 max-w-sm w-full glass-panel rounded-xl p-3 border-cyan-500/40 bg-slate-950/90 shadow-2xl z-10 animate-fadeIn font-mono text-xs">
          {(() => {
            const ib = hoveredIceberg || selectedIceberg!;
            return (
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
                  <div className="flex items-center gap-1.5 text-cyan-300 font-bold font-orbitron">
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{ib.code}</span>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                      ib.riskLevel === 'HIGH'
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-500/50'
                        : ib.riskLevel === 'MEDIUM'
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50'
                    }`}
                  >
                    {ib.riskLevel} RISK
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-500">Location:</span> {ib.lat.toFixed(2)}°S, {ib.lon.toFixed(2)}°E
                  </div>
                  <div>
                    <span className="text-slate-500">Size:</span> <span className="text-cyan-300 font-bold">{ib.sizeKm} km</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Drift:</span> {ib.speedKnots} kts ({ib.directionText})
                  </div>
                  <div>
                    <span className="text-slate-500">Clearance:</span> <span className="text-amber-300 font-bold">{ib.riskDistanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Confidence:</span> <span className="text-emerald-300 font-bold">{ib.confidencePercent}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Source:</span> Sentinel-1 SAR
                  </div>
                </div>

                <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Draft: ~{ib.estimatedDraftM}m</span>
                  <span className="text-cyan-400">Click for 72h forecast →</span>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* FLOATING BOTTOM-RIGHT: ROUTE COMPARISON LEGEND */}
      <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg glass-panel bg-slate-950/90 border-cyan-500/30 text-[11px] font-mono z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-rose-500 border-b border-dashed border-rose-400"></span>
          <span className="text-slate-300">Route Alpha (Shortest)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400"></span>
          <span className="text-cyan-300 font-bold">Route Bravo (Recommended)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-emerald-400 border-b border-dotted border-emerald-300"></span>
          <span className="text-emerald-300">Route Charlie (Safest)</span>
        </div>
      </div>
    </div>
  );
};
