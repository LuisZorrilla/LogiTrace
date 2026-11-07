import React, { useState, useRef, useEffect } from 'react';
import { Shipment, Company, User } from '../../types';
import {
  Smartphone,
  QrCode,
  Camera,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  PenTool,
  RotateCcw,
  Boxes,
  Truck,
  Ship,
  Plane,
  Train,
  Check,
  MapPin,
  AlertTriangle
} from 'lucide-react';

interface FieldOperatorViewProps {
  shipments: Shipment[];
  company: Company;
  currentUser: User;
  onUpdateShipmentSeal: (shipmentId: string, sealId: string, status: 'CHECKED_OK' | 'TAMPERED_ALERT') => void;
  onConfirmDelivery: (shipmentId: string, receiverName: string, signatureDataUrl: string) => void;
}

export const FieldOperatorView: React.FC<FieldOperatorViewProps> = ({
  shipments,
  company,
  currentUser,
  onUpdateShipmentSeal,
  onConfirmDelivery
}) => {
  const [selectedShipmentId, setSelectedShipmentId] = useState<string>(shipments[0]?.id || '');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [receiverName, setReceiverName] = useState<string>('Supervisor de Recepción Almacén');
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [photoCaptured, setPhotoCaptured] = useState<boolean>(false);

  // Digital Signature Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);

  const shipment = shipments.find(s => s.id === selectedShipmentId) || shipments[0];

  useEffect(() => {
    // Reset canvas when changing shipment
    clearCanvas();
  }, [selectedShipmentId]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setIsSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsSigned(false);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const randomShipment = shipments[Math.floor(Math.random() * shipments.length)];
      if (randomShipment) {
        setSelectedShipmentId(randomShipment.id);
        setScanResult(`Escaneo Exitoso: ${randomShipment.code} (Precinto: ${randomShipment.seals[0]?.sealNumber || 'N/A'})`);
        setTimeout(() => setScanResult(null), 4000);
      }
    }, 1200);
  };

  const handleDeliverySubmit = () => {
    if (!shipment || !isSigned) {
      alert('Por favor solicite la firma táctil antes de confirmar la entrega.');
      return;
    }
    const canvas = canvasRef.current;
    const dataUrl = canvas ? canvas.toDataURL() : '';
    onConfirmDelivery(shipment.id, receiverName, dataUrl);
  };

  return (
    <div className="max-w-xl mx-auto space-y-4 pb-8">
      {/* Mobile Top Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">
                Consola Móvil para Personal Operativo
              </h1>
              <p className="text-[11px] text-slate-400">
                Operador: {currentUser.name} ({currentUser.badgeNumber})
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-900">
            ONLINE
          </span>
        </div>

        {/* Quick Barcode / QR Scanner Button */}
        <button
          onClick={handleSimulateScan}
          disabled={isScanning}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
        >
          <QrCode className="w-5 h-5" />
          <span>{isScanning ? 'Escaneando Código de Precinto / Remito...' : 'Escanear QR / Código de Barras'}</span>
        </button>

        {scanResult && (
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>{scanResult}</span>
          </div>
        )}
      </div>

      {/* Shipment Selector */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
          Expediente Asignado a Recepción / Entrega
        </label>
        <select
          aria-label="Expediente Asignado a Recepción / Entrega"
          value={selectedShipmentId}
          onChange={(e) => setSelectedShipmentId(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-blue-500 cursor-pointer"
        >
          {shipments.map(s => (
            <option key={s.id} value={s.id}>
              {s.code} · {s.carrier.unitIdentifier} ({s.status})
            </option>
          ))}
        </select>
      </div>

      {/* Main Operational Cargo Card */}
      {shipment && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          {/* Unit & Route Brief */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="font-mono text-base font-bold text-white">
                {shipment.code}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {shipment.carrier.unitIdentifier} · {shipment.carrier.operatorName}
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-blue-400 text-sm">
                {shipment.totalGrossWeightKg.toLocaleString()} kg
              </span>
              <div className="text-[10px] text-slate-400">{shipment.packages.length} bulto(s)</div>
            </div>
          </div>

          {/* Destination Callout */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 space-y-1 text-xs">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Destino de Entrega</div>
            <div className="text-white font-semibold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{shipment.destination}</span>
            </div>
          </div>

          {/* 1. SEALS VERIFICATION (ISO 17712 / ISO 28000) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Chequeo de Precintos ISO 17712</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Norma ISO 28000</span>
            </div>

            <div className="space-y-2">
              {shipment.seals.map((seal) => (
                <div
                  key={seal.id}
                  className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                    seal.status === 'TAMPERED_ALERT'
                      ? 'bg-rose-950/40 border-rose-800 text-rose-200'
                      : seal.status === 'CHECKED_OK'
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono font-bold text-sm text-white">
                        {seal.sealNumber}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {seal.locationPoint} ({seal.sealType})
                      </div>
                    </div>

                    <span className="text-xs font-bold font-mono">
                      {seal.status}
                    </span>
                  </div>

                  {/* Big Touch Buttons for Seal Status */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => onUpdateShipmentSeal(shipment.id, seal.id, 'CHECKED_OK')}
                      className="py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Precinto OK</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateShipmentSeal(shipment.id, seal.id, 'TAMPERED_ALERT')}
                      className="py-2.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-md shadow-rose-600/20"
                    >
                      <ShieldAlert className="w-4 h-4" />
                      <span>Reportar Roto</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. PHOTO EVIDENCE CAPTURE */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>Evidencia Fotográfica de Carga</span>
            </span>

            <button
              onClick={() => setPhotoCaptured(true)}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4 text-cyan-400" />
              <span>{photoCaptured ? 'Foto de Evidencia Capturada (1 Archivo)' : 'Tomar Foto de Mercadería en Muelle'}</span>
            </button>

            {photoCaptured && (
              <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-800 text-cyan-300 text-xs flex items-center justify-between">
                <span>Foto de embalaje e integridad registrada.</span>
                <button
                  onClick={() => setPhotoCaptured(false)}
                  className="text-slate-400 hover:text-white"
                >
                  Descartar
                </button>
              </div>
            )}
          </div>

          {/* 3. DIGITAL RECEIPT SIGNATURE */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-emerald-400" />
                <span>Firma Táctil de Recepción / Entrega</span>
              </span>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-slate-400 hover:text-white text-xs flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Limpiar</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">
                Nombre de Quien Recibe / Cargo
              </label>
              <input
                type="text"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            {/* Canvas for finger/stylus drawing */}
            <div className="border border-slate-700 rounded-xl bg-white overflow-hidden touch-none relative">
              <canvas
                ref={canvasRef}
                width={360}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-28 cursor-crosshair block"
              />
              {!isSigned && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 text-xs font-medium">
                  Dibuje su firma con el dedo o puntero aquí
                </div>
              )}
            </div>

            {/* Confirm Handover Button */}
            <button
              onClick={handleDeliverySubmit}
              disabled={shipment.status === 'DELIVERED'}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>
                {shipment.status === 'DELIVERED'
                  ? 'Despacho ya Entregado y Firmado'
                  : 'Confirmar Entrega y Registrar en WebServices'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
