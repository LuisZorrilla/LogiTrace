import React, { useState } from 'react';
import { Shipment, Company } from '../../types';
import {
  FileSpreadsheet,
  FileText,
  Printer,
  Download,
  Filter,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Building2
} from 'lucide-react';

interface ReportsViewProps {
  shipments: Shipment[];
  company: Company;
  selectedShipmentForPrint?: Shipment;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  shipments,
  company,
  selectedShipmentForPrint
}) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(
    selectedShipmentForPrint?.id || shipments[0]?.id || ''
  );
  const [filterMode, setFilterMode] = useState<string>('ALL');

  const activeShipment = shipments.find(s => s.id === selectedShipmentId) || shipments[0];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'Codigo_Carga',
      'Modo_Transporte',
      'Empresa_Cliente',
      'Origen',
      'Destino',
      'Fecha_Salida',
      'Transportista',
      'Unidad_Patente',
      'Operador_Chofer',
      'Peso_Bruto_Kg',
      'Volumen_M3',
      'Valor_Declarado_USD',
      'Precinto_ISO17712',
      'Estado_Aduana',
      'Estado_Logistico'
    ];

    const rows = shipments.map(s => [
      s.code,
      s.transportMode,
      company.name,
      `"${s.origin}"`,
      `"${s.destination}"`,
      s.departureDate,
      `"${s.carrier.companyName}"`,
      `"${s.carrier.unitIdentifier}"`,
      `"${s.carrier.operatorName}"`,
      s.totalGrossWeightKg,
      s.totalVolumeM3,
      s.declaredValueUsd,
      s.seals[0]?.sealNumber || 'N/A',
      s.customsStatus,
      s.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LogiTrace_Reporte_Cargas_${company.code}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header (Hidden on print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Informes Oficiales</span>
            <span aria-hidden="true">/</span>
            <span>Manifiestos y Exportación de Datos</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Generador de Manifiestos y Planillas de Inventario
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Emisión de Manifiestos de Carga con validez legal y exportación estructurada en formato Excel/CSV.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-md shadow-emerald-700/20 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Exportar Excel / CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Manifiesto Oficial (PDF)</span>
          </button>
        </div>
      </div>

      {/* Selector of which shipment to preview/print (Hidden on print) */}
      <div className="no-print p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-xs font-semibold text-slate-300 whitespace-nowrap">
            Seleccionar Despacho:
          </label>
          <select
            aria-label="Seleccionar Despacho"
            value={selectedShipmentId}
            onChange={(e) => setSelectedShipmentId(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500 cursor-pointer w-full sm:w-72"
          >
            {shipments.map(s => (
              <option key={s.id} value={s.id}>
                {s.code} · {s.transportMode} · {s.carrier.unitIdentifier}
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          Certificación: <span className="text-emerald-400 font-bold">ISO 9001 / ISO 28000</span>
        </div>
      </div>

      {/* Official Printable Cargo Manifest Document */}
      {activeShipment && (
        <div className="bg-white text-slate-900 rounded-2xl p-8 border border-slate-300 shadow-xl max-w-4xl mx-auto space-y-6 font-sans">
          {/* Header with Company Logo & ISO Stamp */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-lg font-mono">
                  {company.code}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-950 leading-tight">
                    {company.legalName}
                  </h2>
                  <div className="text-xs text-slate-600 font-mono">
                    {company.taxId} · Agente Aduanero: {company.customsAgentCode}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {company.country} · Certificaciones: {company.certifications.join(' · ')}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
                Documento Oficial de Transporte
              </div>
              <div className="text-xl font-extrabold text-blue-900 font-mono">
                {activeShipment.code}
              </div>
              <div className="text-xs text-slate-600 font-mono mt-0.5">
                Manifiesto Aduana: {activeShipment.customsDeclarationCode || 'PENDIENTE'}
              </div>
              <div className="inline-block mt-2 px-2 py-0.5 text-[10px] font-mono uppercase bg-slate-100 text-slate-800 border border-slate-300 rounded font-bold">
                Medio: {activeShipment.transportMode}
              </div>
            </div>
          </div>

          {/* Transport & Itinerary Section */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Datos de la Unidad y Conductor
              </div>
              <div className="font-semibold text-slate-900">
                Transportista: {activeShipment.carrier.companyName}
              </div>
              <div className="font-mono text-slate-700">
                Unidad: {activeShipment.carrier.unitIdentifier}
              </div>
              {activeShipment.carrier.trailerOrSecondaryId && (
                <div className="font-mono text-slate-700">
                  Semirremolque/Contenedor: {activeShipment.carrier.trailerOrSecondaryId}
                </div>
              )}
              <div className="text-slate-800 pt-1 border-t border-slate-200">
                Operador: <strong>{activeShipment.carrier.operatorName}</strong> ({activeShipment.carrier.operatorId})
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
              <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                Itinerario de Ruta y Fechas
              </div>
              <div className="text-slate-900">
                <strong>Origen:</strong> {activeShipment.origin} ({activeShipment.originCountry})
              </div>
              <div className="text-slate-900">
                <strong>Destino:</strong> {activeShipment.destination} ({activeShipment.destinationCountry})
              </div>
              <div className="font-mono text-slate-700 pt-1 border-t border-slate-200">
                Salida: {new Date(activeShipment.departureDate).toLocaleString('es-ES')}
              </div>
              <div className="font-mono text-slate-700">
                Arribo Estimado: {new Date(activeShipment.estimatedArrival).toLocaleString('es-ES')}
              </div>
            </div>
          </div>

          {/* Merchandise & Packages Table */}
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Detalle de Mercancías Declaradas
            </div>
            <table className="w-full text-left text-xs border border-slate-200 rounded overflow-hidden">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] border-b border-slate-200">
                  <th className="py-2 px-3">Descripción de Mercadería</th>
                  <th className="py-2 px-3">Posición NCM</th>
                  <th className="py-2 px-3">Embalaje</th>
                  <th className="py-2 px-3 text-right">Cantidad</th>
                  <th className="py-2 px-3 text-right">Peso Bruto (Kg)</th>
                  <th className="py-2 px-3 text-right">Volumen (m³)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {activeShipment.packages.map((pkg) => (
                  <tr key={pkg.id}>
                    <td className="py-2 px-3 font-semibold">{pkg.description}</td>
                    <td className="py-2 px-3 font-mono">{pkg.hsCode}</td>
                    <td className="py-2 px-3">{pkg.packagingType}</td>
                    <td className="py-2 px-3 text-right font-mono">{pkg.quantity}</td>
                    <td className="py-2 px-3 text-right font-mono font-bold">{pkg.grossWeightKg.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono">{pkg.volumeM3}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-bold text-slate-950 border-t-2 border-slate-300">
                  <td colSpan={3} className="py-2 px-3">Totales Oficiales:</td>
                  <td className="py-2 px-3 text-right font-mono">{activeShipment.packages.reduce((a, b) => a + b.quantity, 0)}</td>
                  <td className="py-2 px-3 text-right font-mono">{activeShipment.totalGrossWeightKg.toLocaleString()} kg</td>
                  <td className="py-2 px-3 text-right font-mono">{activeShipment.totalVolumeM3} m³</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Seals (ISO 17712) and Security Clause */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs space-y-1">
            <div className="font-bold text-blue-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              <span>Precintos de Alta Seguridad Homologados (ISO 17712 / ISO 28000)</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-800 font-mono">
              {activeShipment.seals.map((seal) => (
                <div key={seal.id}>
                  Precinto Nº <strong>{seal.sealNumber}</strong> ({seal.sealType}) · {seal.locationPoint} · Estado: <strong className="text-emerald-700">{seal.status}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures and Legal Verification */}
          <div className="pt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-xs">
            <div className="space-y-8">
              <div className="border-b border-slate-400 pb-1">
                {activeShipment.deliverySignature ? (
                  <img
                    src={activeShipment.deliverySignature.signatureDataUrl}
                    alt="Firma"
                    className="h-10 mx-auto object-contain"
                  />
                ) : (
                  <div className="h-10 flex items-center justify-center text-[10px] text-slate-400 italic">
                    Pendiente al arribo
                  </div>
                )}
              </div>
              <div className="text-[11px] font-semibold text-slate-700">
                Recepción en Destino / Cliente
              </div>
            </div>

            <div className="space-y-8">
              <div className="border-b border-slate-400 pb-1">
                <div className="h-10 flex items-center justify-center text-xs font-mono font-bold text-slate-800">
                  {activeShipment.carrier.operatorName}
                </div>
              </div>
              <div className="text-[11px] font-semibold text-slate-700">
                Firma Conductor / Transportista
              </div>
            </div>

            <div className="space-y-8">
              <div className="border-b border-slate-400 pb-1 flex items-center justify-center">
                <div className="w-12 h-12 bg-slate-100 rounded border border-slate-300 flex items-center justify-center">
                  <QrCode className="w-8 h-8 text-slate-800" />
                </div>
              </div>
              <div className="text-[11px] font-semibold text-slate-700 font-mono">
                Validación Hash VUCE/AFIP
              </div>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 text-center font-mono pt-4 border-t border-slate-200">
            Documento emitido telemáticamente por LogiTrace ISO Platform. Cumple con normativas internacionales de transporte y trazabilidad logística.
          </div>
        </div>
      )}
    </div>
  );
};
