import React, { useState } from 'react';
import {
  Shipment,
  Company,
  TransportMode,
  ShipmentStatus
} from '../../types';
import {
  Truck,
  Ship,
  Plane,
  Train,
  Search,
  Filter,
  PlusCircle,
  FileText,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldAlert,
  Send
} from 'lucide-react';

interface ShipmentsListProps {
  shipments: Shipment[];
  company: Company;
  onOpenNewShipment: () => void;
  onSelectShipment: (shipment: Shipment) => void;
  onTransmitWebservice: (shipment: Shipment) => void;
  onViewInMap: (shipment: Shipment) => void;
  onPrintManifest: (shipment: Shipment) => void;
}

export const ShipmentsList: React.FC<ShipmentsListProps> = ({
  shipments,
  company,
  onOpenNewShipment,
  onSelectShipment,
  onTransmitWebservice,
  onViewInMap,
  onPrintManifest
}) => {
  const [selectedMode, setSelectedMode] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter
  const filteredShipments = shipments.filter((s) => {
    // Mode match
    if (selectedMode !== 'ALL' && s.transportMode !== selectedMode) return false;
    // Status match
    if (selectedStatus !== 'ALL' && s.status !== selectedStatus) return false;
    // Search match
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchCode = s.code.toLowerCase().includes(q);
      const matchOrigin = s.origin.toLowerCase().includes(q);
      const matchDest = s.destination.toLowerCase().includes(q);
      const matchUnit = s.carrier.unitIdentifier.toLowerCase().includes(q);
      const matchOp = s.carrier.operatorName.toLowerCase().includes(q);
      const matchHs = s.packages.some(p => p.hsCode.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      if (!matchCode && !matchOrigin && !matchDest && !matchUnit && !matchOp && !matchHs) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Operaciones</span>
            <span aria-hidden="true">/</span>
            <span>Gestor de Cargas Multimodal</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Registro y Despacho de Mercaderías
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Trazabilidad punto a punto en medios terrestres, marítimos, aéreos y ferroviarios conforme a ISO 9001 e ISO 28000.
          </p>
        </div>

        <button
          onClick={onOpenNewShipment}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Registrar Nueva Carga</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        {/* Mode Tabs (Segmented controls) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-lg border border-slate-800/80">
          <button
            onClick={() => setSelectedMode('ALL')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedMode === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos los Medios ({shipments.length})
          </button>
          <button
            onClick={() => setSelectedMode('ROAD')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedMode === 'ROAD'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Terrestre ({shipments.filter(s => s.transportMode === 'ROAD').length})</span>
          </button>
          <button
            onClick={() => setSelectedMode('SEA')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedMode === 'SEA'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>Marítimo ({shipments.filter(s => s.transportMode === 'SEA').length})</span>
          </button>
          <button
            onClick={() => setSelectedMode('AIR')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedMode === 'AIR'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Aéreo ({shipments.filter(s => s.transportMode === 'AIR').length})</span>
          </button>
          <button
            onClick={() => setSelectedMode('RAIL')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedMode === 'RAIL'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>Ferroviario ({shipments.filter(s => s.transportMode === 'RAIL').length})</span>
          </button>
        </div>

        {/* Search & Status Filter Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por código, patente/unidad, conductor, puerto o posición arancelaria..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              aria-label="Filtrar por estado de carga"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="IN_TRANSIT">En Tránsito</option>
              <option value="CUSTOMS_HOLD">Retención Aduanera</option>
              <option value="DELIVERED">Entregado</option>
              <option value="REGISTERED">Registrado / En Muelle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                <th className="py-3 px-4">Identificación</th>
                <th className="py-3 px-4">Medio & Transporte</th>
                <th className="py-3 px-4">Ruta (Origen → Destino)</th>
                <th className="py-3 px-4 text-right">Carga & Peso</th>
                <th className="py-3 px-4">Precintos ISO 17712</th>
                <th className="py-3 px-4">Aduana & ERP</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-medium">
              {filteredShipments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No se encontraron cargas con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredShipments.map((s) => {
                  const ModeIcon =
                    s.transportMode === 'ROAD'
                      ? Truck
                      : s.transportMode === 'SEA'
                      ? Ship
                      : s.transportMode === 'AIR'
                      ? Plane
                      : Train;

                  const hasTamperedSeal = s.seals.some(seal => seal.status === 'TAMPERED_ALERT');

                  return (
                    <tr
                      key={s.id}
                      onClick={() => onSelectShipment(s)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
                    >
                      {/* Identificación */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-100 group-hover:text-blue-400 transition-colors text-sm">
                          {s.code}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(s.departureDate).toLocaleDateString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>

                      {/* Modo y Transporte */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-slate-800 text-blue-400 shrink-0">
                            <ModeIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200">
                              {s.carrier.unitIdentifier}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {s.carrier.operatorName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Ruta */}
                      <td className="py-3.5 px-4">
                        <div className="max-w-[220px] truncate text-slate-200 font-medium">
                          {s.origin}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[220px]">
                          → {s.destination}
                        </div>
                      </td>

                      {/* Carga y Peso */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-bold text-slate-200 tabular-nums">
                          {s.totalGrossWeightKg.toLocaleString()} kg
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {s.totalVolumeM3} m³ · {s.packages.length} línea(s)
                        </div>
                      </td>

                      {/* Precintos */}
                      <td className="py-3.5 px-4">
                        {hasTamperedSeal ? (
                          <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                            <ShieldAlert className="w-4 h-4 text-rose-500 animate-pulse" />
                            <span>Alerta Ruptura</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-400 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{s.seals.length} Precinto(s) OK</span>
                          </div>
                        )}
                        <div className="text-[10px] font-mono text-slate-400 truncate max-w-[140px]">
                          {s.seals[0]?.sealNumber || 'Sin precinto'}
                        </div>
                      </td>

                      {/* Estado Aduana y Webservices */}
                      <td className="py-3.5 px-4">
                        {s.customsStatus === 'CLEARED' && (
                          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Liberado
                          </span>
                        )}
                        {s.customsStatus === 'TRANSMITTED' && (
                          <span className="text-[11px] font-semibold text-blue-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Transmitido
                          </span>
                        )}
                        {s.customsStatus === 'OBSERVED_HOLD' && (
                          <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Retención
                          </span>
                        )}
                        <div className="text-[10px] font-mono text-slate-400">
                          {s.customsDeclarationCode || 'Pendiente'}
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onViewInMap(s);
                            }}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-blue-400 transition-colors"
                            title="Ver Posición en Mapa GPS"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onPrintManifest(s);
                            }}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
                            title="Emitir Manifiesto Oficial PDF"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTransmitWebservice(s);
                            }}
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-indigo-400 transition-colors"
                            title="Transmitir a Webservices Aduana/ERP"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
