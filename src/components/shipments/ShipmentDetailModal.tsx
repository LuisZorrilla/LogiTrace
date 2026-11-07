import React, { useState } from 'react';
import {
  Shipment,
  Company,
  SecuritySeal,
  DocumentAttachment
} from '../../types';
import {
  X,
  Truck,
  Ship,
  Plane,
  Train,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Send,
  MapPin,
  ExternalLink,
  Download,
  ThermometerSnowflake,
  Activity,
  History,
  QrCode
} from 'lucide-react';

interface ShipmentDetailModalProps {
  shipment: Shipment | null;
  company: Company;
  isOpen: boolean;
  onClose: () => void;
  onTransmitWebservice: (shipment: Shipment) => void;
  onViewInMap: (shipment: Shipment) => void;
  onPrintManifest: (shipment: Shipment) => void;
  onToggleSealStatus: (shipmentId: string, sealId: string) => void;
}

export const ShipmentDetailModal: React.FC<ShipmentDetailModalProps> = ({
  shipment,
  company,
  isOpen,
  onClose,
  onTransmitWebservice,
  onViewInMap,
  onPrintManifest,
  onToggleSealStatus
}) => {
  if (!isOpen || !shipment) return null;

  const [activeTab, setActiveTab] = useState<'GENERAL' | 'CARGO' | 'SEALS' | 'DOCS' | 'WEBSERVICE' | 'AUDIT'>('GENERAL');

  const ModeIcon =
    shipment.transportMode === 'ROAD'
      ? Truck
      : shipment.transportMode === 'SEA'
      ? Ship
      : shipment.transportMode === 'AIR'
      ? Plane
      : Train;

  const hasSealAlert = shipment.seals.some(s => s.status === 'TAMPERED_ALERT');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ModeIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-mono">
                  {shipment.code}
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  {shipment.transportMode}
                </span>
                {shipment.status === 'IN_TRANSIT' && (
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> En Tránsito
                  </span>
                )}
                {shipment.status === 'CUSTOMS_HOLD' && (
                  <span className="text-[11px] text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Retención Aduanera
                  </span>
                )}
                {shipment.status === 'DELIVERED' && (
                  <span className="text-[11px] text-blue-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Entregado
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <span>{shipment.origin}</span>
                <span aria-hidden="true">→</span>
                <span className="text-slate-200 font-medium">{shipment.destination}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPrintManifest(shipment)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              title="Emitir Manifiesto Oficial"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Manifiesto PDF</span>
            </button>
            <button
              onClick={() => onViewInMap(shipment)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-colors"
              title="Ver en Mapa GPS en tiempo real"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ruta GPS</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-800 bg-slate-950/30 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('GENERAL')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'GENERAL'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            General & Operador
          </button>
          <button
            onClick={() => setActiveTab('CARGO')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'CARGO'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Mercadería & Pesos
          </button>
          <button
            onClick={() => setActiveTab('SEALS')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'SEALS'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Precintos ISO 17712</span>
            {hasSealAlert && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('DOCS')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'DOCS'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Documentación ({shipment.documents.length})
          </button>
          <button
            onClick={() => setActiveTab('WEBSERVICE')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'WEBSERVICE'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            WebServices Aduana & ERP
          </button>
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'AUDIT'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            Trazabilidad ISO 9001
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* TAB 1: GENERAL & OPERATOR */}
          {activeTab === 'GENERAL' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Transport Unit Card */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="text-slate-400 uppercase font-semibold text-[11px]">
                    Unidad de Transporte
                  </div>
                  <div className="text-sm font-bold text-white font-mono">
                    {shipment.carrier.unitIdentifier}
                  </div>
                  {shipment.carrier.trailerOrSecondaryId && (
                    <div className="text-slate-300 font-mono">
                      Acoplado/Contenedor: {shipment.carrier.trailerOrSecondaryId}
                    </div>
                  )}
                  <div className="text-slate-400 pt-1 border-t border-slate-800">
                    Empresa: <strong className="text-slate-200">{shipment.carrier.companyName}</strong>
                  </div>
                </div>

                {/* Operator Card */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="text-slate-400 uppercase font-semibold text-[11px]">
                    Conductor / Responsable Operativo
                  </div>
                  <div className="text-sm font-bold text-white">
                    {shipment.carrier.operatorName}
                  </div>
                  <div className="text-slate-300 font-mono">
                    Identificación: {shipment.carrier.operatorId}
                  </div>
                  <div className="text-slate-400 pt-1 border-t border-slate-800 font-mono">
                    Contacto: {shipment.carrier.operatorPhone}
                  </div>
                </div>
              </div>

              {/* Itinerary */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="text-slate-400 uppercase font-semibold text-[11px]">
                  Itinerario y Cronograma
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div>
                    <div className="text-slate-500 text-[10px]">Salida Efectiva</div>
                    <div className="text-slate-200 font-semibold mt-0.5">
                      {new Date(shipment.departureDate).toLocaleString('es-ES')}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Arribo Estimado (ETA)</div>
                    <div className="text-slate-200 font-semibold mt-0.5">
                      {new Date(shipment.estimatedArrival).toLocaleString('es-ES')}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Velocidad Telemetría</div>
                    <div className="text-slate-200 font-semibold mt-0.5">
                      {shipment.telemetry.speedKmH} km/h
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-[10px]">Coordenadas GPS</div>
                    <div className="text-slate-200 font-semibold mt-0.5 text-[11px]">
                      {shipment.telemetry.currentLat.toFixed(4)}, {shipment.telemetry.currentLng.toFixed(4)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Signature if Delivered */}
              {shipment.deliverySignature && (
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/60 space-y-2">
                  <div className="text-emerald-400 uppercase font-semibold text-[11px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Constancia de Entrega y Firma Digital de Recepción</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{shipment.deliverySignature.receivedBy}</div>
                      <div className="text-slate-400 font-mono text-[10px]">
                        {new Date(shipment.deliverySignature.timestamp).toLocaleString('es-ES')} · Lat: {shipment.deliverySignature.latitude}, Lng: {shipment.deliverySignature.longitude}
                      </div>
                    </div>
                    <div className="p-2 bg-white rounded-lg">
                      <img
                        src={shipment.deliverySignature.signatureDataUrl}
                        alt="Firma"
                        className="h-10 w-28 object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CARGO & PACKAGES */}
          {activeTab === 'CARGO' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-slate-400 uppercase font-semibold text-[11px]">
                    Detalle de Mercancías Declaradas
                  </div>
                  <span className="font-mono text-slate-300 font-bold">
                    Valor FOB: USD ${shipment.declaredValueUsd.toLocaleString()}
                  </span>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {shipment.packages.map((pkg) => (
                    <div key={pkg.id} className="py-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-100 text-sm">
                          {pkg.description}
                        </div>
                        <div className="text-slate-400 font-mono">
                          NCM: <strong className="text-blue-400">{pkg.hsCode}</strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-slate-300">
                        <div>Embalaje: <span className="text-white">{pkg.packagingType}</span></div>
                        <div>Cantidad: <span className="text-white">{pkg.quantity}</span></div>
                        <div>Peso Bruto: <span className="text-white">{pkg.grossWeightKg.toLocaleString()} kg</span></div>
                        <div>Volumen: <span className="text-white">{pkg.volumeM3} m³</span></div>
                      </div>

                      {pkg.isPerishable && pkg.requiredTempCelsius && (
                        <div className="flex items-center gap-2 text-cyan-400 bg-cyan-950/30 p-2 rounded-lg border border-cyan-900/50">
                          <ThermometerSnowflake className="w-4 h-4 shrink-0" />
                          <span>
                            Cadena de Frío Estricta: Rango permitido {pkg.requiredTempCelsius.min}°C a {pkg.requiredTempCelsius.max}°C. Temperatura actual: {shipment.telemetry.temperatureCelsius ?? 'N/D'}°C.
                          </span>
                        </div>
                      )}

                      {pkg.isDangerous && (
                        <div className="flex items-center gap-2 text-amber-400 bg-amber-950/30 p-2 rounded-lg border border-amber-900/50">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>
                            Mercancía Peligrosa: {pkg.imoClass} (UN {pkg.unNumber}). Protocolo de respuesta de emergencia activo.
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SEALS ISO 17712 (ISO 28000) */}
          {activeTab === 'SEALS' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 text-slate-300">
                <span className="font-bold text-blue-400">Seguridad de Cadena ISO 28000:</span> Trazabilidad de sellos de alta seguridad (High Security Seals). Todo evento de inspección o ruptura genera una alerta inmutable en la bitácora.
              </div>

              <div className="space-y-3">
                {shipment.seals.map((seal) => (
                  <div
                    key={seal.id}
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      seal.status === 'TAMPERED_ALERT'
                        ? 'bg-rose-950/40 border-rose-800 text-rose-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-white">
                          Precinto: {seal.sealNumber}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {seal.sealType}
                        </span>
                        {seal.status === 'TAMPERED_ALERT' ? (
                          <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                            ALERTA RUPTURA
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {seal.status}
                          </span>
                        )}
                      </div>

                      <div className="text-slate-400 text-xs">
                        Ubicación: <strong className="text-slate-300">{seal.locationPoint}</strong> · Colocado por: {seal.placedBy} ({new Date(seal.placedAt).toLocaleTimeString('es-ES')})
                      </div>
                      {seal.checkedBy && (
                        <div className="text-slate-400 text-[11px]">
                          Última verificación en muelle por: <span className="text-emerald-400">{seal.checkedBy}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onToggleSealStatus(shipment.id, seal.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors self-start sm:self-auto ${
                        seal.status === 'TAMPERED_ALERT'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      {seal.status === 'TAMPERED_ALERT' ? 'Restablecer Precinto (OK)' : 'Reportar Violación / Ruptura'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DIGITAL DOCUMENTS */}
          {activeTab === 'DOCS' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400 uppercase font-semibold text-[11px]">
                <span>Documentos Digitales Vinculados</span>
                <span>{shipment.documents.length} Archivos</span>
              </div>

              <div className="space-y-2">
                {shipment.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-800 text-blue-400 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{doc.fileName}</div>
                        <div className="text-slate-400 text-[11px] font-mono">
                          Nº {doc.documentNumber} · {doc.documentType} · {doc.fileSizeKb} KB
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900">
                        {doc.status}
                      </span>
                      <button
                        onClick={() => alert(`Previsualizando documento oficial: ${doc.fileName}\nRegistrado en Webservices con referencia: ${doc.customsWebserviceRef || 'AFIP/SUNAT-OK'}`)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                      >
                        Ver Documento
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: WEBSERVICES & ERP */}
          {activeTab === 'WEBSERVICE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-slate-400 uppercase font-semibold text-[11px]">
                    Estado de Transmisión a la Ventanilla Única y ERP
                  </div>
                  <button
                    onClick={() => onTransmitWebservice(shipment)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Re-Transmitir Ahora</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Manifiesto Aduana</div>
                    <div className="font-bold text-white text-xs mt-0.5">
                      {shipment.customsDeclarationCode || 'PENDIENTE'}
                    </div>
                    <div className="text-emerald-400 text-[10px] mt-1">{shipment.customsStatus}</div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Sincronización ERP</div>
                    <div className="font-bold text-white text-xs mt-0.5">{company.erpEndpoint.split('/')[2]}</div>
                    <div className="text-emerald-400 text-[10px] mt-1">{shipment.erpSyncStatus}</div>
                  </div>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="text-slate-500 text-[10px]">Agente Aduanero</div>
                    <div className="font-bold text-white text-xs mt-0.5">{company.customsAgentCode}</div>
                    <div className="text-blue-400 text-[10px] mt-1">Conector REST v3</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: AUDIT TRAIL */}
          {activeTab === 'AUDIT' && (
            <div className="space-y-3">
              <div className="text-slate-400 uppercase font-semibold text-[11px]">
                Bitácora Inmutable de Auditoría ISO 9001
              </div>

              <div className="space-y-2 font-mono">
                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>{new Date(shipment.departureDate).toLocaleString('es-ES')}</span>
                    <span className="text-blue-400">CREATE_SHIPMENT</span>
                  </div>
                  <div className="text-white text-xs">
                    Despacho registrado por Operador de Tráfico. Precinto {shipment.seals[0]?.sealNumber || 'N/A'} verificado.
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Firma Hash: SHA256:7a941f88...20c · IP: 190.220.45.12
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span>{new Date(Date.now() - 3600000).toLocaleString('es-ES')}</span>
                    <span className="text-emerald-400">GPS_TELEMETRY_PING</span>
                  </div>
                  <div className="text-white text-xs">
                    Telemetría satelital recibida. Velocidad: {shipment.telemetry.speedKmH} km/h. Ruta nominal.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Cerrar Expediente
          </button>
        </div>
      </div>
    </div>
  );
};
