import React from 'react';
import {
  Shipment,
  Company,
  AlertNotification,
  TransportMode
} from '../../types';
import {
  Truck,
  Ship,
  Plane,
  Train,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Boxes,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  ChevronRight,
  PlusCircle,
  FileText,
  Warehouse,
  ThermometerSnowflake,
  Activity
} from 'lucide-react';

interface AnalyticsDashboardProps {
  shipments: Shipment[];
  company: Company;
  alerts: AlertNotification[];
  onOpenNewShipment: () => void;
  onSelectShipment: (shipment: Shipment) => void;
  onNavigateTab: (tab: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  shipments,
  company,
  alerts,
  onOpenNewShipment,
  onSelectShipment,
  onNavigateTab
}) => {
  // Filter shipments for active company or show all if none specifically matching
  const companyShipments = shipments.filter(s => s.companyId === company.id);
  const activeList = companyShipments.length > 0 ? companyShipments : shipments;

  const inTransitCount = activeList.filter(s => s.status === 'IN_TRANSIT').length;
  const customsHoldCount = activeList.filter(s => s.status === 'CUSTOMS_HOLD').length;
  const deliveredCount = activeList.filter(s => s.status === 'DELIVERED').length;

  const totalGrossWeightTn = Math.round(
    activeList.reduce((acc, s) => acc + s.totalGrossWeightKg, 0) / 1000
  );
  const totalVolumeM3 = Math.round(
    activeList.reduce((acc, s) => acc + s.totalVolumeM3, 0)
  );

  // Mode breakdown
  const roadCount = activeList.filter(s => s.transportMode === 'ROAD').length;
  const seaCount = activeList.filter(s => s.transportMode === 'SEA').length;
  const airCount = activeList.filter(s => s.transportMode === 'AIR').length;
  const railCount = activeList.filter(s => s.transportMode === 'RAIL').length;

  const unresolvedAlerts = alerts.filter(a => !a.resolved);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Operaciones</span>
            <span aria-hidden="true">/</span>
            <span>Dashboard Ejecutivo</span>
            <span aria-hidden="true">/</span>
            <span className="text-blue-400">{company.name}</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Control de Cargas e Inventarios en Tránsito
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoreo en tiempo real con trazabilidad ISO 9001 / ISO 28000 y enlace a Webservices aduaneros.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('reports')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <FileText className="w-4 h-4 text-slate-400" />
            <span>Emitir Manifiesto</span>
          </button>
          <button
            onClick={onOpenNewShipment}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all hover:translate-y-[-1px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Registrar Carga Multimodal</span>
          </button>
        </div>
      </div>

      {/* Critical Alert Banner if holds exist */}
      {unresolvedAlerts.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-300 uppercase tracking-wider">
                Desviación Detectada en la Cadena Logística ({unresolvedAlerts.length} Alertas Activas)
              </div>
              <div className="text-xs text-slate-300 font-medium">
                {unresolvedAlerts[0].title}: {unresolvedAlerts[0].message}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('tracking')}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold whitespace-nowrap self-start sm:self-auto transition-colors"
          >
            Inspeccionar en Mapa GPS
          </button>
        </div>
      )}

      {/* Primary KPI Grid (60-30-10, Tabular Figures) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Cargas en Tránsito</span>
            <Boxes className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-mono text-2xl lg:text-3xl font-bold text-white tabular-nums">
            {inTransitCount} <span className="text-xs font-sans text-slate-400 font-normal">unidades</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> 98.2%
            </span>
            <span>Rutas dentro de ventana</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Volumen Total en Movimiento</span>
            <Warehouse className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-mono text-2xl lg:text-3xl font-bold text-white tabular-nums">
            {totalGrossWeightTn} <span className="text-xs font-sans text-slate-400 font-normal">Tn</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-mono">
            <span>{totalVolumeM3.toLocaleString()} m³ volumen total</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Cumplimiento ISO 9001/28000</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="font-mono text-2xl lg:text-3xl font-bold text-emerald-400 tabular-nums">
            96.8%
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
            <span>Precintos ISO 17712 trazados</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">WebServices Aduana & ERP</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="font-mono text-2xl lg:text-3xl font-bold text-white tabular-nums">
            100%
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pasarelas REST operativas</span>
          </div>
        </div>
      </div>

      {/* Multimodal Transport Distribution Strip */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-white">
              Distribución por Modo de Transporte
            </h2>
            <span className="text-xs text-slate-400">· Flota Multimodal</span>
          </div>
          <button
            onClick={() => onNavigateTab('shipments')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>Ver listado detallado</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Terrestre */}
          <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Terrestre (Camión)</div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                {roadCount} <span className="text-xs font-normal text-slate-400">despachos</span>
              </div>
            </div>
          </div>

          {/* Marítimo */}
          <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Ship className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Marítimo (Contenedores)</div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                {seaCount} <span className="text-xs font-normal text-slate-400">buques</span>
              </div>
            </div>
          </div>

          {/* Aéreo */}
          <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-sky-600/20 text-sky-400 flex items-center justify-center shrink-0">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Aéreo (Vuelos Cargo)</div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                {airCount} <span className="text-xs font-normal text-slate-400">vuelos</span>
              </div>
            </div>
          </div>

          {/* Ferroviario */}
          <div className="p-3.5 rounded-lg bg-slate-800/70 border border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Ferroviario (Trenes)</div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                {railCount} <span className="text-xs font-normal text-slate-400">convoyes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Core Layout: Active Shipments Grid + Real-time Telemetry & Customs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Live Cargo Status Table */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">
                Cargas Activas en Tráfico
              </h2>
              <p className="text-xs text-slate-400">
                Seleccione cualquier envío para abrir el expediente completo, documentos y precintos.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('shipments')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Ver Todo ({activeList.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                  <th className="py-2.5 px-3">Código / Modo</th>
                  <th className="py-2.5 px-3">Origen → Destino</th>
                  <th className="py-2.5 px-3">Operador / Unidad</th>
                  <th className="py-2.5 px-3 text-right">Peso (Kg)</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                {activeList.map((s) => {
                  const ModeIcon =
                    s.transportMode === 'ROAD'
                      ? Truck
                      : s.transportMode === 'SEA'
                      ? Ship
                      : s.transportMode === 'AIR'
                      ? Plane
                      : Train;

                  return (
                    <tr
                      key={s.id}
                      onClick={() => onSelectShipment(s)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded bg-slate-800 text-slate-300 group-hover:text-blue-400 transition-colors">
                            <ModeIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-mono font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                              {s.code}
                            </div>
                            <div className="text-[10px] text-slate-400 capitalize">
                              {s.transportMode.toLowerCase()}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="max-w-[200px] truncate text-slate-200">
                          {s.origin}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          → {s.destination}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="truncate max-w-[170px] text-slate-200">
                          {s.carrier.unitIdentifier}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {s.carrier.operatorName}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-200">
                        {s.totalGrossWeightKg.toLocaleString()}
                      </td>

                      <td className="py-3 px-3">
                        {s.status === 'IN_TRANSIT' && (
                          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            En Tránsito
                          </span>
                        )}
                        {s.status === 'CUSTOMS_HOLD' && (
                          <span className="text-[11px] text-rose-400 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Retención Aduanera
                          </span>
                        )}
                        {s.status === 'DELIVERED' && (
                          <span className="text-[11px] text-blue-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Entregado
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectShipment(s);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                        >
                          Expediente
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 Col): Webservices Health & Security Control */}
        <div className="space-y-4">
          {/* Webservices Status Panel */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Pasarelas Webservices
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                ONLINE
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Aduana / VUCE</div>
                  <div className="text-[10px] text-slate-400">Declaración de Manifiestos</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-mono text-[11px]">200 OK</span>
                  <div className="text-[10px] text-slate-400 font-mono">140ms</div>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">ERP SAP S/4HANA</div>
                  <div className="text-[10px] text-slate-400">Sincronización de Remitos</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-mono text-[11px]">201 OK</span>
                  <div className="text-[10px] text-slate-400 font-mono">188ms</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('webservices')}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 text-xs font-semibold transition-colors text-center"
            >
              Consola de Peticiones y JSON
            </button>
          </div>

          {/* Quick Cold Chain & High Security Status */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Trazabilidad ISO 28000
              </h3>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>Sellos ISO 17712 Verificados:</span>
                <span className="font-mono font-bold text-white">14 / 15</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Rupturas o Violaciones:</span>
                <span className="font-mono font-bold text-rose-400">1 (Tolva San Lorenzo)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Monitoreo Reefer Activo:</span>
                <span className="font-mono font-bold text-cyan-400 flex items-center gap-1">
                  <ThermometerSnowflake className="w-3.5 h-3.5" /> +0.8°C nominal
                </span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('iso')}
              className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors text-center"
            >
              Auditoría y No Conformidades
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
