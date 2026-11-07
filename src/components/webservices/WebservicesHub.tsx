import React, { useState } from 'react';
import {
  Shipment,
  Company,
  WebserviceLog
} from '../../types';
import {
  Network,
  Server,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Code2,
  Copy,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  ExternalLink,
  Layers
} from 'lucide-react';

interface WebservicesHubProps {
  shipments: Shipment[];
  company: Company;
  logs: WebserviceLog[];
  onDispatchWebservice: (shipmentId: string, targetSystem: WebserviceLog['systemName']) => void;
}

export const WebservicesHub: React.FC<WebservicesHubProps> = ({
  shipments,
  company,
  logs,
  onDispatchWebservice
}) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(shipments[0]?.id || '');
  const [targetSystem, setTargetSystem] = useState<WebserviceLog['systemName']>('ADUANA_VUCE');
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [inspectedLog, setInspectedLog] = useState<WebserviceLog | null>(logs[0] || null);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedShipment = shipments.find(s => s.id === selectedShipmentId) || shipments[0];

  const handleSend = () => {
    if (!selectedShipment) return;
    setIsTransmitting(true);
    setTimeout(() => {
      onDispatchWebservice(selectedShipment.id, targetSystem);
      setIsTransmitting(false);
    }, 600);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Preview JSON Payload for the currently selected shipment
  const previewPayload = selectedShipment
    ? {
        transactionId: `TX-DISPATCH-${Date.now()}`,
        clientCompanyCode: company.code,
        taxId: company.taxId,
        customsAgentCode: company.customsAgentCode,
        shipment: {
          code: selectedShipment.code,
          transportMode: selectedShipment.transportMode,
          carrierUnit: selectedShipment.carrier.unitIdentifier,
          trailer: selectedShipment.carrier.trailerOrSecondaryId,
          operator: {
            name: selectedShipment.carrier.operatorName,
            idNumber: selectedShipment.carrier.operatorId
          },
          route: {
            origin: selectedShipment.origin,
            destination: selectedShipment.destination,
            departurePlanned: selectedShipment.departureDate,
            eta: selectedShipment.estimatedArrival
          },
          cargo: selectedShipment.packages.map(p => ({
            hsCode: p.hsCode,
            description: p.description,
            quantity: p.quantity,
            grossWeightKg: p.grossWeightKg,
            volumeM3: p.volumeM3,
            isDangerous: p.isDangerous,
            isPerishable: p.isPerishable
          })),
          securitySeals: selectedShipment.seals.map(s => ({
            sealNumber: s.sealNumber,
            sealType: s.sealType,
            status: s.status,
            placedAt: s.placedAt,
            placedBy: s.placedBy
          })),
          documents: selectedShipment.documents.map(d => ({
            documentType: d.documentType,
            documentNumber: d.documentNumber,
            status: d.status
          }))
        }
      }
    : {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Integraciones</span>
            <span aria-hidden="true">/</span>
            <span>WebServices & ERP Cloud Gateway</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Conector REST Aduana & Sistemas ERP
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Transmisión oficial de declaraciones de carga, remitos y precintos a webservices aduaneros (VUCE/AFIP/SUNAT) y ERPs corporativos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Endpoints Operativos
          </span>
        </div>
      </div>

      {/* Gateway Cards Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Aduana VUCE */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Server className="w-4 h-4 text-blue-400" />
              <span>Aduanas & VUCE REST v3</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">200 OK</span>
          </div>
          <p className="text-xs text-slate-400 font-mono truncate">
            https://vuce.aduana.gob.ar/ws/v3/cargo
          </p>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80 font-mono">
            <span>Certificado: PKCS#12 Activo</span>
            <span className="text-slate-300">Latencia: 142ms</span>
          </div>
        </div>

        {/* SAP S/4HANA */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>SAP S/4HANA OData v4</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">201 OK</span>
          </div>
          <p className="text-xs text-slate-400 font-mono truncate">
            {company.erpEndpoint}
          </p>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80 font-mono">
            <span>OAuth 2.0 Bearer</span>
            <span className="text-slate-300">Latencia: 188ms</span>
          </div>
        </div>

        {/* Oracle Cloud SCM */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Network className="w-4 h-4 text-cyan-400" />
              <span>Oracle Cloud SCM / WMS</span>
            </div>
            <span className="text-[10px] font-mono text-blue-400 font-semibold">STANDBY</span>
          </div>
          <p className="text-xs text-slate-400 font-mono truncate">
            https://oracle-scm.translog-global.com/api/v1
          </p>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80 font-mono">
            <span>Sincronización Periódica</span>
            <span className="text-slate-300">Latencia: 210ms</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Transmission Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Workbench (5 Cols): Dispatch Controller */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Consola de Transmisión WebService
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Seleccione la carga y el servicio destino para generar y enviar la declaración telemática.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Shipment Select */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Expediente de Carga a Transmitir
              </label>
              <select
                aria-label="Expediente de Carga a Transmitir"
                value={selectedShipmentId}
                onChange={(e) => setSelectedShipmentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono cursor-pointer"
              >
                {shipments.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} · {s.transportMode} · {s.carrier.unitIdentifier} ({s.totalGrossWeightKg.toLocaleString()} kg)
                  </option>
                ))}
              </select>
            </div>

            {/* Target WebService */}
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Webservice / Sistema Receptor
              </label>
              <select
                aria-label="Webservice / Sistema Receptor"
                value={targetSystem}
                onChange={(e) => setTargetSystem(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="ADUANA_VUCE">Aduana VUCE / AFIP (Manifiesto & Precinto)</option>
                <option value="ERP_SAP">ERP SAP S/4HANA (Remito & Cost Center)</option>
                <option value="ERP_ORACLE">ERP Oracle SCM (Inventario en Tránsito)</option>
                <option value="PORT_AUTHORITY">Sistema de Comunidad Portuaria (PCS)</option>
              </select>
            </div>

            {/* Shipment Summary Quick Specs */}
            {selectedShipment && (
              <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1.5 font-mono text-[11px] text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Medio:</span>
                  <span className="text-white font-bold">{selectedShipment.transportMode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Ruta:</span>
                  <span className="text-white truncate max-w-[200px]">{selectedShipment.origin} → {selectedShipment.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Precinto ISO 17712:</span>
                  <span className="text-emerald-400">{selectedShipment.seals[0]?.sealNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estado Actual:</span>
                  <span className="text-blue-400">{selectedShipment.customsStatus}</span>
                </div>
              </div>
            )}

            {/* Dispatch Action Button */}
            <button
              onClick={handleSend}
              disabled={isTransmitting}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
            >
              {isTransmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Transmitiendo Payload REST...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Ejecutar Transmisión WebService</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Workbench (7 Cols): Live Payload JSON Inspector */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Inspector de Payload JSON (Request Outbound)</span>
            </div>
            <button
              onClick={() => handleCopy(JSON.stringify(previewPayload, null, 2))}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? '¡Copiado!' : 'Copiar JSON'}</span>
            </button>
          </div>

          <div className="flex-1 bg-slate-950 rounded-lg p-3 border border-slate-800 font-mono text-xs overflow-auto max-h-[320px] text-blue-200">
            <pre className="whitespace-pre-wrap leading-relaxed">
              {JSON.stringify(previewPayload, null, 2)}
            </pre>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
            <span>Content-Type: application/json; charset=utf-8</span>
            <span>Firma SHA256 calculada al vuelo</span>
          </div>
        </div>
      </div>

      {/* Historical Transactions Audit Table */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Historial de Transmisiones a WebServices
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Registro auditado de peticiones y respuestas con tokens y códigos de estado HTTP.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                <th className="py-2.5 px-3">Fecha y Hora</th>
                <th className="py-2.5 px-3">Sistema Receptor</th>
                <th className="py-2.5 px-3">Token Transacción</th>
                <th className="py-2.5 px-3">Estado HTTP</th>
                <th className="py-2.5 px-3 text-right">Latencia</th>
                <th className="py-2.5 px-3 text-right">Detalle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
              {logs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setInspectedLog(log)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-mono text-slate-400">
                    {new Date(log.timestamp).toLocaleTimeString('es-ES')}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-white">{log.systemName}</span>
                    <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                      {log.endpoint}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-blue-400">
                    {log.transactionToken}
                  </td>
                  <td className="py-3 px-3">
                    {log.httpStatus === 200 || log.httpStatus === 201 ? (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {log.httpStatus} OK
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 font-mono">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                        {log.httpStatus} ERROR
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300">
                    {log.latencyMs} ms
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectedLog(log);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                    >
                      Inspeccionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Log Inspector Modal/Drawer if opened */}
        {inspectedLog && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs">
                  Detalle de Transacción: {inspectedLog.transactionToken}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400">
                  {inspectedLog.systemName}
                </span>
              </div>
              <button
                onClick={() => setInspectedLog(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                Ocultar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-[10px] text-slate-400 font-medium mb-1 uppercase">Respuesta Servidor (JSON)</div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-auto max-h-[160px]">
                  <pre>{JSON.stringify(inspectedLog.responsePayload, null, 2)}</pre>
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-medium mb-1 uppercase">Petición Enviada (JSON)</div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 overflow-auto max-h-[160px]">
                  <pre>{JSON.stringify(inspectedLog.requestPayload, null, 2)}</pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
