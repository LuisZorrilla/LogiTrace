import React, { useState } from 'react';
import {
  ISORequirement,
  NonConformity,
  AuditLog,
  Company,
  User
} from '../../types';
import {
  ShieldCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  PlusCircle,
  FileText,
  Search,
  Filter,
  Layers,
  History,
  Lock,
  ExternalLink
} from 'lucide-react';

interface ISOComplianceViewProps {
  company: Company;
  currentUser: User;
  requirements: ISORequirement[];
  nonConformities: NonConformity[];
  auditLogs: AuditLog[];
  onAddNonConformity: (nc: NonConformity) => void;
  onCloseNonConformity: (ncId: string) => void;
}

export const ISOComplianceView: React.FC<ISOComplianceViewProps> = ({
  company,
  currentUser,
  requirements,
  nonConformities,
  auditLogs,
  onAddNonConformity,
  onCloseNonConformity
}) => {
  const [activeStandard, setActiveStandard] = useState<'ALL' | 'ISO_9001' | 'ISO_28000'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // New NC form state
  const [ncDesc, setNcDesc] = useState<string>('');
  const [ncStandard, setNcStandard] = useState<'ISO_9001' | 'ISO_28000'>('ISO_28000');
  const [ncSeverity, setNcSeverity] = useState<NonConformity['severity']>('MAJOR');
  const [ncRootCause, setNcRootCause] = useState<string>('');
  const [ncAction, setNcAction] = useState<string>('');
  const [ncResp, setNcResp] = useState<string>(currentUser.name);

  const filteredRequirements = requirements.filter(
    r => activeStandard === 'ALL' || r.standard === activeStandard
  );

  const handleCreateNC = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ncDesc.trim()) return;

    const newNC: NonConformity = {
      id: `nc_${Date.now()}`,
      standard: ncStandard,
      severity: ncSeverity,
      description: ncDesc,
      detectedAt: new Date().toISOString(),
      detectedBy: currentUser.name,
      rootCause: ncRootCause || 'Investigación preliminar en curso.',
      correctiveAction: ncAction || 'Contención inmediata y revisión de precintos.',
      responsiblePerson: ncResp,
      deadline: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
      status: 'OPEN'
    };

    onAddNonConformity(newNC);
    setIsModalOpen(false);
    setNcDesc('');
    setNcRootCause('');
    setNcAction('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Calidad & Cumplimiento</span>
            <span aria-hidden="true">/</span>
            <span>Auditoría de Normas ISO</span>
          </div>
          <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Gestión de Calidad ISO 9001 y Seguridad en Cadena ISO 28000
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Marco normativo de aseguramiento de calidad, precintado de alta seguridad y bitácora inmutable de auditoría.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Apertura de No Conformidad</span>
        </button>
      </div>

      {/* Certification Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* ISO 9001 Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-white text-sm">ISO 9001:2015</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900 font-semibold">
              CALIDAD CERTIFICADA
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Control estricto de estiba, pesaje certificado, calibración de sensores de frío y trazabilidad de órdenes de transporte.
          </p>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>98.5% Requisitos Cumplidos</span>
          </div>
        </div>

        {/* ISO 28000 Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-white text-sm">ISO 28000:2022</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900 font-semibold">
              SEGURIDAD CADENA
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Gestión de riesgos en cadena de suministro, homologación de precintos mecánicos/RFID ISO 17712 y respuesta a incidentes.
          </p>
          <div className="text-[11px] text-amber-400 font-semibold flex items-center gap-1 pt-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>1 No Conformidad en Tratamiento</span>
          </div>
        </div>

        {/* OEA / BASC Card */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-indigo-400" />
              <span className="font-bold text-white text-sm">OEA & Auditoría</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 border border-indigo-900 font-semibold">
              OPERADOR SEGURO
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Acreditación aduanera de facilitación y seguridad con canal preferencial en puertos y pasos de frontera.
          </p>
          <div className="text-[11px] text-slate-300 font-mono pt-1">
            Auditado por: <span className="text-blue-400">{currentUser.name}</span>
          </div>
        </div>
      </div>

      {/* ISO Requirements & Checkpoints Checklist */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Puntos Críticos de Control Normativo
            </h2>
            <p className="text-xs text-slate-400">
              Evaluación periódica de requisitos según las cláusulas de gestión y seguridad.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStandard('ALL')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeStandard === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveStandard('ISO_9001')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeStandard === 'ISO_9001'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ISO 9001 (Calidad)
            </button>
            <button
              onClick={() => setActiveStandard('ISO_28000')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                activeStandard === 'ISO_28000'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ISO 28000 (Seguridad)
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredRequirements.map((req) => (
            <div
              key={req.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400">
                    {req.standard} · Cláusula {req.clause}
                  </span>
                  {req.status === 'COMPLIANT' ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                      CONFORME
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-900">
                      NO CONFORME
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-white">{req.title}</div>
                <p className="text-xs text-slate-400 max-w-2xl">{req.description}</p>
                <div className="text-[11px] text-slate-300 italic pt-1">
                  Nota Auditor: "{req.auditorNotes}"
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-500 font-mono shrink-0 self-start sm:self-auto">
                Evaluado: {new Date(req.lastEvaluated).toLocaleDateString('es-ES')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Conformities CAPA Tracker */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Plan de Acciones Correctivas y Preventivas (CAPA)
          </h2>
          <p className="text-xs text-slate-400">
            Tratamiento formal de desviaciones logísticas, precintos alterados y no conformidades de auditoría.
          </p>
        </div>

        <div className="space-y-3">
          {nonConformities.map((nc) => (
            <div
              key={nc.id}
              className={`p-4 rounded-xl border space-y-3 ${
                nc.status === 'CLOSED'
                  ? 'bg-slate-950/40 border-slate-800 text-slate-400'
                  : 'bg-rose-950/20 border-rose-900/60 text-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">
                    {nc.id.toUpperCase()}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {nc.standard}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    nc.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-amber-950 text-amber-400'
                  }`}>
                    {nc.severity}
                  </span>
                  <span className="text-xs font-semibold text-slate-300">
                    Estado: <strong className={nc.status === 'CLOSED' ? 'text-emerald-400' : 'text-rose-400'}>{nc.status}</strong>
                  </span>
                </div>

                {nc.status !== 'CLOSED' && (
                  <button
                    onClick={() => onCloseNonConformity(nc.id)}
                    className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors self-start sm:self-auto"
                  >
                    Aprobar Cierre de NC
                  </button>
                )}
              </div>

              <div className="text-xs text-white font-medium">{nc.description}</div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-slate-400 font-medium">Causa Raíz Identificada:</span>
                  <p className="text-slate-300 mt-0.5">{nc.rootCause}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">Acción Correctiva Ejecutada:</span>
                  <p className="text-slate-300 mt-0.5">{nc.correctiveAction}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Responsable: {nc.responsiblePerson}</span>
                <span>Plazo Límite: {new Date(nc.deadline).toLocaleDateString('es-ES')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Immutable Audit Trail Section */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4 text-blue-400" />
              <span>Bitácora Inmutable de Auditoría (Audit Trail)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Registro secuencial de eventos protegidos con hash criptográfico para auditoría externa ISO.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold text-[11px]">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Usuario / Rol</th>
                <th className="py-2.5 px-3">Acción Registrada</th>
                <th className="py-2.5 px-3">Detalle del Evento</th>
                <th className="py-2.5 px-3 text-right">Firma Hash SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString('es-ES')}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="text-white font-semibold">{log.userName}</span>
                    <div className="text-[10px] text-slate-400">{log.userRole}</div>
                  </td>
                  <td className="py-2.5 px-3 text-blue-400 font-bold whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300 max-w-md truncate">
                    {log.details}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500 text-[10px] whitespace-nowrap">
                    {log.hashSignature}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for New Non-Conformity */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
              Apertura de No Conformidad (CAPA)
            </h3>
            <form onSubmit={handleCreateNC} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Norma Aplicable</label>
                <select
                  value={ncStandard}
                  onChange={(e) => setNcStandard(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  <option value="ISO_28000">ISO 28000 (Seguridad en Cadena de Suministro)</option>
                  <option value="ISO_9001">ISO 9001 (Gestión de Calidad Logística)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Severidad</label>
                <select
                  value={ncSeverity}
                  onChange={(e) => setNcSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                >
                  <option value="MINOR">Leve (Desvío menor de procedimiento)</option>
                  <option value="MAJOR">Mayor (Falla de documentación / demora)</option>
                  <option value="CRITICAL">Crítica (Ruptura de precinto / retención aduanera)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Descripción del Hallazgo</label>
                <textarea
                  rows={2}
                  value={ncDesc}
                  onChange={(e) => setNcDesc(e.target.value)}
                  placeholder="Detalle exacto de la desviación observada..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:outline-none focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Causa Raíz Preliminar</label>
                <input
                  type="text"
                  value={ncRootCause}
                  onChange={(e) => setNcRootCause(e.target.value)}
                  placeholder="ej: Desgaste de sellos en maniobra o manipulación no autorizada"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Acción Correctiva Inmediata</label>
                <input
                  type="text"
                  value={ncAction}
                  onChange={(e) => setNcAction(e.target.value)}
                  placeholder="ej: Re-precintado, acta judicial y pesaje en báscula fiscal"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 text-white font-semibold"
                >
                  Registrar No Conformidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
