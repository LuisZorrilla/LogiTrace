import React, { useState } from 'react';
import { AlertNotification } from '../../types';
import {
  X,
  AlertTriangle,
  ShieldAlert,
  ThermometerSnowflake,
  Clock,
  CheckCircle2,
  MapPin,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface AlertsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: AlertNotification[];
  onResolveAlert: (alertId: string) => void;
  onNavigateToShipment: (shipmentId: string) => void;
  onNavigateToISO: () => void;
}

export const AlertsDrawer: React.FC<AlertsDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onResolveAlert,
  onNavigateToShipment,
  onNavigateToISO
}) => {
  if (!isOpen) return null;

  const [filterState, setFilterState] = useState<'ALL' | 'UNRESOLVED' | 'RESOLVED'>('UNRESOLVED');

  const filteredAlerts = alerts.filter(a => {
    if (filterState === 'UNRESOLVED') return !a.resolved;
    if (filterState === 'RESOLVED') return a.resolved;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Centro de Alertas Logísticas
              </h2>
              <p className="text-[11px] text-slate-400">
                Detección automatizada de desviaciones en la cadena
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 px-6 py-2.5 border-b border-slate-800 bg-slate-950/30 text-xs font-semibold">
          <button
            onClick={() => setFilterState('UNRESOLVED')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterState === 'UNRESOLVED'
                ? 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pendientes ({alerts.filter(a => !a.resolved).length})
          </button>
          <button
            onClick={() => setFilterState('RESOLVED')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterState === 'RESOLVED'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Resueltas ({alerts.filter(a => a.resolved).length})
          </button>
          <button
            onClick={() => setFilterState('ALL')}
            className={`px-3 py-1 rounded-md transition-colors ${
              filterState === 'ALL'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todas ({alerts.length})
          </button>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
              <span>No hay alertas en este estado. Toda la cadena logística opera dentro de parámetros nominales.</span>
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isCritical = alert.severity === 'CRITICAL';
              const isWarning = alert.severity === 'WARNING';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                    alert.resolved
                      ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                      : isCritical
                      ? 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                      : 'bg-amber-950/30 border-amber-800/80 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.5 rounded ${
                        isCritical ? 'bg-rose-900 text-rose-300' : isWarning ? 'bg-amber-900 text-amber-300' : 'bg-blue-900 text-blue-300'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="font-mono text-xs font-bold text-white">
                        {alert.shipmentCode}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-white">{alert.title}</h3>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      {alert.message}
                    </p>
                  </div>

                  {alert.resolved ? (
                    <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 pt-1 border-t border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resuelto por {alert.resolvedBy || 'Sistema'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => onNavigateToShipment(alert.shipmentId)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                      >
                        <MapPin className="w-3 h-3" />
                        <span>Ver Carga</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={onNavigateToISO}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                        >
                          Abrir NC ISO
                        </button>
                        <button
                          onClick={() => onResolveAlert(alert.id)}
                          className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors"
                        >
                          Resolver
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cerrar Panel
          </button>
        </div>
      </div>
    </div>
  );
};
