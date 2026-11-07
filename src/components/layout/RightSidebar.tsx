import React from 'react';
import {
  Shipment,
  Company,
  AlertNotification,
  WebserviceLog
} from '../../types';
import {
  PanelRightClose,
  PanelRightOpen,
  Activity,
  Server,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Radio,
  Clock,
  ThermometerSnowflake,
  ExternalLink,
  Bell
} from 'lucide-react';

interface RightSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  shipments: Shipment[];
  company: Company;
  alerts: AlertNotification[];
  webserviceLogs: WebserviceLog[];
  onSelectShipment: (shipment: Shipment) => void;
  onOpenAlerts: () => void;
  onNavigateTab: (tab: string) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  shipments,
  company,
  alerts,
  webserviceLogs,
  onSelectShipment,
  onOpenAlerts,
  onNavigateTab
}) => {
  const activeShipments = shipments.filter(s => s.status === 'IN_TRANSIT' || s.status === 'CUSTOMS_HOLD');
  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const latestLog = webserviceLogs[0];

  // Collapsed slim rail state
  if (isCollapsed) {
    return (
      <aside className="w-12 shrink-0 bg-slate-900 border-l border-slate-800 hidden xl:flex flex-col items-center py-4 justify-between h-[calc(100vh-4rem)] sticky top-16 select-none transition-all duration-300">
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Expandir Panel de Telemetría Derecho"
          >
            <PanelRightOpen className="w-4 h-4 text-blue-400" />
          </button>

          <div className="w-6 h-[1px] bg-slate-800" />

          {/* Icon indicators */}
          <button
            onClick={onToggleCollapse}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Telemetría en Vivo"
          >
            <Radio className="w-4 h-4 text-emerald-400" />
          </button>

          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Webservices Gateway"
          >
            <Server className="w-4 h-4 text-indigo-400" />
          </button>

          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Alertas Activas"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            {unresolvedAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-500 rotate-90 whitespace-nowrap mb-8">
          TELEMETRÍA
        </div>
      </aside>
    );
  }

  // Expanded panel state
  return (
    <aside className="w-72 shrink-0 bg-slate-900 border-l border-slate-800 hidden xl:flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 select-none transition-all duration-300">
      <div className="p-4 space-y-5 overflow-y-auto">
        {/* Panel Top Title with Collapse Button */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              Telemetría & Pasarelas
            </h2>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Colapsar Panel Derecho"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Webservices Gateway Pulse */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-400" />
              <span>WebServices Gateway</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900 font-bold">
              ACTIVO
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px] text-slate-400">
            <div className="flex justify-between">
              <span>Aduana VUCE:</span>
              <span className="text-slate-200">142ms · 200 OK</span>
            </div>
            <div className="flex justify-between">
              <span>SAP S/4HANA:</span>
              <span className="text-slate-200">188ms · OData v4</span>
            </div>
            {latestLog && (
              <div className="text-[10px] text-slate-500 truncate pt-1 border-t border-slate-800">
                Última TX: {latestLog.transactionToken.slice(0, 18)}...
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateTab('webservices')}
            className="w-full py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-medium transition-colors text-center"
          >
            Abrir Consola REST
          </button>
        </div>

        {/* 2. Security Seals ISO 28000 Pulse */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Precintos ISO 17712</span>
            </span>
            <span className="text-[10px] font-mono text-blue-400">
              ISO 28000
            </span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Total monitoreados:</span>
            <span className="text-white font-bold">15 unidades</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Incidentes de ruptura:</span>
            <span className="text-rose-400 font-bold">1 activo</span>
          </div>
        </div>

        {/* 3. In-Transit Cargo Quick List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
              Cargas en Tráfico ({activeShipments.length})
            </span>
            <button
              onClick={() => onNavigateTab('tracking')}
              className="text-[11px] text-blue-400 hover:text-blue-300"
            >
              Ver Mapa
            </button>
          </div>

          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {activeShipments.map(s => {
              const hasAlert = s.seals.some(seal => seal.status === 'TAMPERED_ALERT');
              return (
                <div
                  key={s.id}
                  onClick={() => onSelectShipment(s)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    hasAlert
                      ? 'bg-rose-950/30 border-rose-800/80 hover:border-rose-700'
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white">
                      {s.code}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {s.telemetry.speedKmH} km/h
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {s.carrier.unitIdentifier}
                  </div>
                  {s.telemetry.temperatureCelsius !== undefined && (
                    <div className="text-[10px] text-cyan-400 flex items-center gap-1 font-mono mt-1">
                      <ThermometerSnowflake className="w-3 h-3" />
                      <span>{s.telemetry.temperatureCelsius}°C Reefer</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Active Deviation Alerts Box */}
        {unresolvedAlerts.length > 0 && (
          <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-900/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-300 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                <span>Alertas Pendientes</span>
              </span>
              <span className="text-[10px] font-mono text-rose-400 font-bold">
                {unresolvedAlerts.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 line-clamp-2">
              {unresolvedAlerts[0].title}
            </p>
            <button
              onClick={onOpenAlerts}
              className="w-full py-1 text-[11px] rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors text-center"
            >
              Resolver Alertas
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/40 text-[10px] text-slate-500 font-mono text-center">
        LogiTrace Telemetry Link v2.6
      </div>
    </aside>
  );
};
