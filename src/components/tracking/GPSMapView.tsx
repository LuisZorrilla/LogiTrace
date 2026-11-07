import React, { useState, useEffect } from 'react';
import { Shipment, TransportMode } from '../../types';
import {
  Truck,
  Ship,
  Plane,
  Train,
  MapPin,
  Navigation,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Play,
  RotateCcw,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  ThermometerSnowflake,
  BatteryCharging,
  Compass
} from 'lucide-react';

interface GPSMapViewProps {
  shipments: Shipment[];
  selectedShipmentId?: string;
  onSelectShipment: (shipment: Shipment) => void;
  onSimulateDeviation: (shipmentId: string) => void;
  onSimulateTamper: (shipmentId: string) => void;
}

export const GPSMapView: React.FC<GPSMapViewProps> = ({
  shipments,
  selectedShipmentId,
  onSelectShipment,
  onSimulateDeviation,
  onSimulateTamper
}) => {
  const [activeShipmentId, setActiveShipmentId] = useState<string>(
    selectedShipmentId || shipments[0]?.id || ''
  );
  const [isSimulatingMovement, setIsSimulatingMovement] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeFilterMode, setActiveFilterMode] = useState<string>('ALL');

  useEffect(() => {
    if (selectedShipmentId) {
      setActiveShipmentId(selectedShipmentId);
    }
  }, [selectedShipmentId]);

  const activeShipment = shipments.find(s => s.id === activeShipmentId) || shipments[0];

  const filteredShipments = shipments.filter(
    s => activeFilterMode === 'ALL' || s.transportMode === activeFilterMode
  );

  // SVG Map Coordinate Projection helper (Mercator projection normalized to 800x500 canvas)
  const projectCoords = (lat: number, lng: number) => {
    // Normalizing world bounds: lat [-55 to 55], lng [-120 to 20]
    const minLat = -55;
    const maxLat = 55;
    const minLng = -120;
    const maxLng = 20;

    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 500;
    return { x, y };
  };

  const getModeIcon = (mode: TransportMode) => {
    switch (mode) {
      case 'ROAD': return Truck;
      case 'SEA': return Ship;
      case 'AIR': return Plane;
      case 'RAIL': return Train;
    }
  };

  const ModeIcon = activeShipment ? getModeIcon(activeShipment.transportMode) : Truck;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Telemetría</span>
            <span aria-hidden="true">/</span>
            <span>Geolocalización GPS en Tiempo Real</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Centro de Control Cartográfico Multimodal
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Seguimiento satelital de posiciones, trazado de rutas óptimas, control de geocercas aduaneras e integridad de precintos.
          </p>
        </div>

        {/* Filter modes buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveFilterMode('ALL')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeFilterMode === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setActiveFilterMode('ROAD')}
            className={`p-1.5 rounded transition-colors ${
              activeFilterMode === 'ROAD' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Terrestre"
          >
            <Truck className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveFilterMode('SEA')}
            className={`p-1.5 rounded transition-colors ${
              activeFilterMode === 'SEA' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Marítimo"
          >
            <Ship className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveFilterMode('AIR')}
            className={`p-1.5 rounded transition-colors ${
              activeFilterMode === 'AIR' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Aéreo"
          >
            <Plane className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveFilterMode('RAIL')}
            className={`p-1.5 rounded transition-colors ${
              activeFilterMode === 'RAIL' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Ferroviario"
          >
            <Train className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Map + Unit Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: Interactive Map Canvas (8 Cols) */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden flex flex-col min-h-[520px]">
          {/* Map Top Bar Controls */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>GPS FEED: SATÉLITE ACTIVO</span>
              <span className="text-slate-500">·</span>
              <span className="text-blue-400">{filteredShipments.length} UNIDADES</span>
            </div>

            <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur-md p-1 rounded-lg border border-slate-800 shadow-lg">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.0))}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Acercar mapa"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Alejar mapa"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Centrar mapa"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Tactical Vector Map Canvas */}
          <div className="w-full h-full flex-1 relative flex items-center justify-center p-2 overflow-hidden bg-[#070b14]">
            <svg
              viewBox="0 0 800 500"
              className="w-full h-full transition-transform duration-300 ease-out select-none"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Tactical Grid Background */}
              <defs>
                <pattern id="tacticalGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
                </pattern>
                <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#0f172a" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#020617" stopOpacity="1" />
                </radialGradient>
              </defs>

              <rect width="800" height="500" fill="url(#oceanGlow)" />
              <rect width="800" height="500" fill="url(#tacticalGrid)" />

              {/* Simplified Continental Shorelines (Americas, Atlantic, Europe) */}
              <g stroke="#334155" strokeWidth="1.2" fill="#0f172a" fillOpacity="0.7">
                {/* North America */}
                <path d="M 80 80 Q 140 60, 240 70 Q 280 120, 260 180 Q 200 230, 160 210 Q 100 170, 80 80 Z" />
                {/* Central & South America */}
                <path d="M 180 230 Q 260 240, 310 320 Q 340 400, 280 470 Q 240 460, 220 380 Q 170 300, 180 230 Z" />
                {/* Europe & North Africa */}
                <path d="M 540 80 Q 640 70, 710 120 Q 680 180, 600 200 Q 530 180, 520 120 Z" />
                <path d="M 520 200 Q 660 210, 720 280 Q 660 380, 580 360 Q 520 300, 520 200 Z" />
              </g>

              {/* Geofence Circles */}
              {/* Puerto Buenos Aires / Dock Sud */}
              <g>
                <circle cx="280" cy="410" r="18" fill="#3b82f6" fillOpacity="0.12" stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" />
                <text x="280" y="434" fill="#94a3b8" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
                  Geocerca Pto Buenos Aires
                </text>
              </g>

              {/* Puerto Rotterdam */}
              <g>
                <circle cx="560" cy="110" r="16" fill="#06b6d4" fillOpacity="0.12" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3,3" />
                <text x="560" y="132" fill="#94a3b8" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
                  Geocerca Port Rotterdam
                </text>
              </g>

              {/* Miami Int Airport */}
              <g>
                <circle cx="240" cy="190" r="16" fill="#38bdf8" fillOpacity="0.12" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3,3" />
                <text x="240" y="212" fill="#94a3b8" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
                  Geocerca MIA Cargo
                </text>
              </g>

              {/* Active Route Paths */}
              {filteredShipments.map((s) => {
                const isSelected = s.id === activeShipmentId;
                const points = s.telemetry.routeCoordinates.map(c => projectCoords(c[0], c[1]));
                if (points.length < 2) return null;

                const pathData = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;

                return (
                  <g key={`path-${s.id}`}>
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isSelected ? '#3b82f6' : '#475569'}
                      strokeWidth={isSelected ? '2.5' : '1.5'}
                      strokeDasharray={s.transportMode === 'AIR' ? '4,4' : 'none'}
                      strokeOpacity={isSelected ? 0.9 : 0.4}
                    />
                  </g>
                );
              })}

              {/* Vehicle Markers */}
              {filteredShipments.map((s) => {
                const { x, y } = projectCoords(s.telemetry.currentLat, s.telemetry.currentLng);
                const isSelected = s.id === activeShipmentId;
                const hasAlert = s.seals.some(seal => seal.status === 'TAMPERED_ALERT');

                return (
                  <g
                    key={`unit-${s.id}`}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => {
                      setActiveShipmentId(s.id);
                      onSelectShipment(s);
                    }}
                  >
                    {/* Pulsing ring if selected or alert */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="14"
                        fill="none"
                        stroke={hasAlert ? '#f43f5e' : '#3b82f6'}
                        strokeWidth="1.5"
                        className="animate-ping"
                        opacity="0.75"
                      />
                    )}

                    {/* Marker base pin */}
                    <circle
                      cx={x}
                      cy={y}
                      r="9"
                      fill={hasAlert ? '#e11d48' : isSelected ? '#2563eb' : '#1e293b'}
                      stroke={isSelected ? '#60a5fa' : '#64748b'}
                      strokeWidth="2"
                    />

                    {/* Label Badge above unit */}
                    <rect
                      x={x - 30}
                      y={y - 24}
                      width="60"
                      height="14"
                      rx="3"
                      fill="#0f172a"
                      fillOpacity="0.9"
                      stroke={isSelected ? '#3b82f6' : '#334155'}
                      strokeWidth="1"
                    />
                    <text
                      x={x}
                      y={y - 14}
                      fill={isSelected ? '#ffffff' : '#cbd5e1'}
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {s.code}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Bottom Telemetry Bar */}
          <div className="p-3 bg-slate-900/95 border-t border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ModeIcon className="w-4 h-4 text-blue-400" />
                <span>{activeShipment?.carrier.unitIdentifier}</span>
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">Ruta: {activeShipment?.origin} → {activeShipment?.destination}</span>
            </div>

            <div className="flex items-center gap-4 font-mono text-slate-400 text-[11px]">
              <span>Velocidad: <strong className="text-white">{activeShipment?.telemetry.speedKmH} km/h</strong></span>
              {activeShipment?.telemetry.temperatureCelsius !== undefined && (
                <span className="flex items-center gap-1 text-cyan-400">
                  <ThermometerSnowflake className="w-3.5 h-3.5" />
                  <strong>{activeShipment.telemetry.temperatureCelsius}°C</strong>
                </span>
              )}
              <span>GPS Sat: <strong className="text-emerald-400">{activeShipment?.telemetry.batteryLevel ?? 96}%</strong></span>
            </div>
          </div>
        </div>

        {/* Right Side: Unit Selector & Tactical Telemetry (4 Cols) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col">
          {/* Active Unit Telemetry Card */}
          {activeShipment && (
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    <ModeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-white text-sm">
                      {activeShipment.code}
                    </div>
                    <div className="text-[11px] text-slate-400 capitalize">
                      Modo {activeShipment.transportMode.toLowerCase()} · {activeShipment.carrier.companyName}
                    </div>
                  </div>
                </div>

                {activeShipment.seals.some(s => s.status === 'TAMPERED_ALERT') ? (
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 animate-pulse">
                    ALERTA SELLO
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    NOMINAL OK
                  </span>
                )}
              </div>

              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Velocidad Actual</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {activeShipment.telemetry.speedKmH} <span className="text-[10px] text-slate-400">km/h</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Rumbo / Dirección</div>
                  <div className="text-base font-bold text-white mt-0.5 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-blue-400" />
                    <span>{activeShipment.telemetry.headingDegrees}°</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Precinto ISO 17712</div>
                  <div className="text-xs font-bold text-emerald-400 truncate mt-0.5">
                    {activeShipment.seals[0]?.sealNumber || 'N/A'}
                  </div>
                </div>

                <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800">
                  <div className="text-slate-500 text-[10px]">Temperatura Frío</div>
                  <div className="text-xs font-bold text-cyan-400 mt-0.5">
                    {activeShipment.telemetry.temperatureCelsius !== undefined
                      ? `${activeShipment.telemetry.temperatureCelsius}°C`
                      : 'Carga Seca'}
                  </div>
                </div>
              </div>

              {/* Operator details */}
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1 text-xs">
                <div className="text-slate-400 text-[10px] uppercase font-semibold">Operador / Conductor</div>
                <div className="text-white font-semibold">{activeShipment.carrier.operatorName}</div>
                <div className="text-slate-400 font-mono text-[11px]">{activeShipment.carrier.operatorPhone} · {activeShipment.carrier.operatorId}</div>
              </div>

              {/* Simulation Sandbox Triggers */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Simulación de Contingencias (Sandbox)
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSimulateDeviation(activeShipment.id)}
                    className="p-2 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800 text-amber-300 text-xs font-semibold transition-colors text-center"
                  >
                    Simular Desvío Ruta
                  </button>
                  <button
                    onClick={() => onSimulateTamper(activeShipment.id)}
                    className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-semibold transition-colors text-center"
                  >
                    Simular Corte Precinto
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick List of All In-Transit Units */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex-1 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Unidades en Monitoreo Satelital
            </div>

            <div className="space-y-1.5 overflow-y-auto max-h-[220px]">
              {filteredShipments.map((s) => {
                const isSelected = s.id === activeShipmentId;
                const UnitIcon = getModeIcon(s.transportMode);
                const hasAlert = s.seals.some(seal => seal.status === 'TAMPERED_ALERT');

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveShipmentId(s.id);
                      onSelectShipment(s);
                    }}
                    className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-blue-950/50 border-blue-500 text-white'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <UnitIcon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                      <div>
                        <div className="font-mono font-bold text-xs">{s.code}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{s.destination}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-[11px]">
                      {hasAlert ? (
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> ALERTA
                        </span>
                      ) : (
                        <span className="text-emerald-400">{s.telemetry.speedKmH} km/h</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
