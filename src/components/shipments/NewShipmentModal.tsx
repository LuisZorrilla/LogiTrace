import React, { useState } from 'react';
import {
  Company,
  Shipment,
  TransportMode,
  CargoPackage,
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
  FileText,
  ShieldCheck,
  Package,
  ArrowRight,
  ArrowLeft,
  Upload,
  Send,
  Plus
} from 'lucide-react';

interface NewShipmentModalProps {
  company: Company;
  isOpen: boolean;
  onClose: () => void;
  onCreateShipment: (newShipment: Shipment, transmitImmediately: boolean) => void;
}

export const NewShipmentModal: React.FC<NewShipmentModalProps> = ({
  company,
  isOpen,
  onClose,
  onCreateShipment
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<number>(1);
  const [transportMode, setTransportMode] = useState<TransportMode>('ROAD');

  // Step 1: Operator / Carrier
  const [carrierCompany, setCarrierCompany] = useState<string>('Transportes del Cono Sur S.A.');
  const [operatorName, setOperatorName] = useState<string>('Esteban Marín');
  const [operatorId, setOperatorId] = useState<string>('DNI 32.891.402');
  const [operatorPhone, setOperatorPhone] = useState<string>('+54 9 11 5820-1199');
  const [unitIdentifier, setUnitIdentifier] = useState<string>('AF 102 PZ (Volvo FH540)');
  const [trailerOrSecondaryId, setTrailerOrSecondaryId] = useState<string>('SEMI-CURTAIN-991');

  // Step 2: Route
  const [origin, setOrigin] = useState<string>('Planta Logística Zárate');
  const [originCountry, setOriginCountry] = useState<string>(company.country);
  const [destination, setDestination] = useState<string>('Terminal Portuaria Dock Sud');
  const [destinationCountry, setDestinationCountry] = useState<string>(company.country);
  const [departureDate, setDepartureDate] = useState<string>(new Date().toISOString().slice(0, 16));
  const [estimatedArrival, setEstimatedArrival] = useState<string>(
    new Date(Date.now() + 8 * 3600 * 1000).toISOString().slice(0, 16)
  );

  // Step 3: Cargo
  const [cargoDesc, setCargoDesc] = useState<string>('Insumos Industriales y Bobinas de Acero');
  const [packagingType, setPackagingType] = useState<CargoPackage['packagingType']>('PALLET');
  const [quantity, setQuantity] = useState<number>(24);
  const [grossWeightKg, setGrossWeightKg] = useState<number>(19800);
  const [volumeM3, setVolumeM3] = useState<number>(54);
  const [hsCode, setHsCode] = useState<string>('7210.49.10');
  const [isDangerous, setIsDangerous] = useState<boolean>(false);
  const [isPerishable, setIsPerishable] = useState<boolean>(false);
  const [minTemp, setMinTemp] = useState<number>(2);
  const [maxTemp, setMaxTemp] = useState<number>(8);
  const [declaredValueUsd, setDeclaredValueUsd] = useState<number>(85000);

  // Step 4: Seals ISO 17712
  const [sealNumber, setSealNumber] = useState<string>(`ISO-${Math.floor(100000 + Math.random() * 900000)}`);
  const [sealType, setSealType] = useState<SecuritySeal['sealType']>('ISO_17712_BOLT');
  const [sealLocation, setSealLocation] = useState<string>('Cerrojo Puerta Trasera Derecha');

  // Step 5: Document
  const [docNumber, setDocNumber] = useState<string>(`CRT-${Math.floor(1000 + Math.random() * 9000)}`);
  const [invoiceNumber, setInvoiceNumber] = useState<string>(`FAC-${Math.floor(10000 + Math.random() * 90000)}`);

  // Step 6: Webservices Dispatch Option
  const [transmitImmediately, setTransmitImmediately] = useState<boolean>(true);

  // Handle Mode Change Defaults
  const handleModeChange = (mode: TransportMode) => {
    setTransportMode(mode);
    if (mode === 'ROAD') {
      setUnitIdentifier('AF 102 PZ (Volvo FH540)');
      setTrailerOrSecondaryId('SEMI-CURTAIN-991');
      setCarrierCompany('Transportes del Cono Sur S.A.');
    } else if (mode === 'SEA') {
      setUnitIdentifier('MV MSC Gülsün (IMO 9839438)');
      setTrailerOrSecondaryId('MSCU-994102-8 (40ft High Cube)');
      setCarrierCompany('Mediterranean Shipping Company (MSC)');
      setPackagingType('CONTAINER_40');
    } else if (mode === 'AIR') {
      setUnitIdentifier('Boeing 777F (LV-CDA)');
      setTrailerOrSecondaryId('ULD Pallet PMC-1102');
      setCarrierCompany('Aerolíneas Cargo');
      setPackagingType('BOX');
    } else if (mode === 'RAIL') {
      setUnitIdentifier('Locomotora EMD GT22CW (#9041)');
      setTrailerOrSecondaryId('12 Vagones Tolva (SERIE-T-88)');
      setCarrierCompany('Nuevo Central Argentino (NCA)');
      setPackagingType('BULK_HOPPER');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCode = `${transportMode === 'ROAD' ? 'TRK' : transportMode === 'SEA' ? 'SEA' : transportMode === 'AIR' ? 'AIR' : 'RAIL'}-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPackage: CargoPackage = {
      id: `pkg_${Date.now()}`,
      description: cargoDesc,
      packagingType,
      quantity,
      grossWeightKg,
      netWeightKg: Math.round(grossWeightKg * 0.95),
      volumeM3,
      hsCode,
      isDangerous,
      isPerishable,
      ...(isPerishable ? { requiredTempCelsius: { min: minTemp, max: maxTemp } } : {})
    };

    const newSeal: SecuritySeal = {
      id: `seal_${Date.now()}`,
      sealNumber,
      sealType,
      placedAt: new Date().toISOString(),
      placedBy: 'Supervisor de Muelle y Despacho',
      locationPoint: sealLocation,
      status: 'INTACT'
    };

    const newDocs: DocumentAttachment[] = [
      {
        id: `doc_${Date.now()}_1`,
        documentType: transportMode === 'ROAD' ? 'WAYBILL_CRT' : transportMode === 'SEA' ? 'BILL_OF_LADING' : transportMode === 'AIR' ? 'AIR_WAYBILL' : 'WAYBILL_CRT',
        documentNumber: docNumber,
        fileName: `Documento_Transporte_${docNumber}.pdf`,
        fileSizeKb: 680,
        uploadDate: new Date().toISOString(),
        status: 'VERIFIED'
      },
      {
        id: `doc_${Date.now()}_2`,
        documentType: 'COMMERCIAL_INVOICE',
        documentNumber: invoiceNumber,
        fileName: `Factura_Comercial_${invoiceNumber}.pdf`,
        fileSizeKb: 420,
        uploadDate: new Date().toISOString(),
        status: 'VERIFIED'
      }
    ];

    const newShipment: Shipment = {
      id: `ship_${Date.now()}`,
      code: newCode,
      companyId: company.id,
      transportMode,
      status: 'IN_TRANSIT',
      origin,
      originCountry,
      destination,
      destinationCountry,
      departureDate: new Date(departureDate).toISOString(),
      estimatedArrival: new Date(estimatedArrival).toISOString(),
      carrier: {
        companyName: carrierCompany,
        operatorName,
        operatorId,
        operatorPhone,
        unitIdentifier,
        trailerOrSecondaryId
      },
      packages: [newPackage],
      totalGrossWeightKg: grossWeightKg,
      totalVolumeM3: volumeM3,
      declaredValueUsd,
      seals: [newSeal],
      documents: newDocs,
      customsStatus: transmitImmediately ? 'TRANSMITTED' : 'PENDING_TRANSMISSION',
      customsDeclarationCode: transmitImmediately ? `MANI-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}` : undefined,
      erpSyncStatus: transmitImmediately ? 'SYNCED' : 'PENDING',
      telemetry: {
        currentLat: -34.6037,
        currentLng: -58.3816,
        speedKmH: transportMode === 'AIR' ? 790 : transportMode === 'SEA' ? 32 : transportMode === 'ROAD' ? 70 : 45,
        headingDegrees: 90,
        altitudeM: transportMode === 'AIR' ? 9500 : 25,
        lastUpdate: new Date().toISOString(),
        batteryLevel: 98,
        routeCoordinates: [
          [-34.6037, -58.3816],
          [-34.5822, -58.3711]
        ],
        destinationLat: -34.5822,
        destinationLng: -58.3711,
        isOffRoute: false,
        ...(isPerishable ? { temperatureCelsius: (minTemp + maxTemp) / 2 } : {})
      },
      isoComplianceRate: 100,
      hasOpenNonConformity: false,
      notes: `Registro formalizado bajo normas ISO 9001 e ISO 28000. Precinto trazado ${sealNumber}.`
    };

    onCreateShipment(newShipment, transmitImmediately);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Registro de Carga Multimodal
              </h2>
              <p className="text-xs text-slate-400">
                Paso {step} de 5 · {company.name}
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

        {/* Wizard Steps Progress Indicator */}
        <div className="grid grid-cols-5 border-b border-slate-800 text-center text-[10px] sm:text-[11px] font-medium">
          <div className={`py-2 px-0.5 sm:px-1 border-b-2 truncate ${step === 1 ? 'border-blue-500 text-blue-400 bg-blue-950/20' : step > 1 ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500'}`}>
            <span className="sm:hidden">1. Modo</span>
            <span className="hidden sm:inline">1. Medio & Operador</span>
          </div>
          <div className={`py-2 px-0.5 sm:px-1 border-b-2 truncate ${step === 2 ? 'border-blue-500 text-blue-400 bg-blue-950/20' : step > 2 ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500'}`}>
            <span className="sm:hidden">2. Ruta</span>
            <span className="hidden sm:inline">2. Ruta & Horarios</span>
          </div>
          <div className={`py-2 px-0.5 sm:px-1 border-b-2 truncate ${step === 3 ? 'border-blue-500 text-blue-400 bg-blue-950/20' : step > 3 ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500'}`}>
            <span className="sm:hidden">3. Carga</span>
            <span className="hidden sm:inline">3. Mercadería & Peso</span>
          </div>
          <div className={`py-2 px-0.5 sm:px-1 border-b-2 truncate ${step === 4 ? 'border-blue-500 text-blue-400 bg-blue-950/20' : step > 4 ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-slate-500'}`}>
            <span className="sm:hidden">4. Sellos</span>
            <span className="hidden sm:inline">4. Precintos ISO</span>
          </div>
          <div className={`py-2 px-0.5 sm:px-1 border-b-2 truncate ${step === 5 ? 'border-blue-500 text-blue-400 bg-blue-950/20' : 'border-transparent text-slate-500'}`}>
            <span className="sm:hidden">5. Enlace</span>
            <span className="hidden sm:inline">5. Webservices</span>
          </div>
        </div>

        {/* Modal Form Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: TRANSPORT MODE & OPERATOR */}
          {step === 1 && (
            <div className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Seleccione el Medio de Transporte
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => handleModeChange('ROAD')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                    transportMode === 'ROAD'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 shadow-md shadow-blue-500/20'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Truck className="w-6 h-6" />
                  <span className="text-xs font-semibold">Terrestre</span>
                  <span className="text-[10px] text-slate-500">Camiones / Semi</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('SEA')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                    transportMode === 'SEA'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 shadow-md shadow-blue-500/20'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Ship className="w-6 h-6" />
                  <span className="text-xs font-semibold">Marítimo</span>
                  <span className="text-[10px] text-slate-500">Buques / Contenedor</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('AIR')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                    transportMode === 'AIR'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 shadow-md shadow-blue-500/20'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Plane className="w-6 h-6" />
                  <span className="text-xs font-semibold">Aéreo</span>
                  <span className="text-[10px] text-slate-500">Vuelos Cargo / ULD</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeChange('RAIL')}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                    transportMode === 'RAIL'
                      ? 'border-blue-500 bg-blue-950/40 text-blue-400 shadow-md shadow-blue-500/20'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Train className="w-6 h-6" />
                  <span className="text-xs font-semibold">Ferroviario</span>
                  <span className="text-[10px] text-slate-500">Trenes / Tolvas</span>
                </button>
              </div>

              {/* Mode Specific Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Empresa Transportista
                  </label>
                  <input
                    type="text"
                    value={carrierCompany}
                    onChange={(e) => setCarrierCompany(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {transportMode === 'ROAD' ? 'Patente / Unidad Tractora' : transportMode === 'SEA' ? 'Nombre Buque & IMO' : transportMode === 'AIR' ? 'Número de Vuelo & Aeronave' : 'Identificador Locomotora'}
                  </label>
                  <input
                    type="text"
                    value={unitIdentifier}
                    onChange={(e) => setUnitIdentifier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {transportMode === 'ROAD' ? 'Semirremolque / Furgón' : transportMode === 'SEA' ? 'Número Contenedor (40HC/20)' : transportMode === 'AIR' ? 'Contenedor ULD / Pallet Aéreo' : 'Serie de Vagones Tolva'}
                  </label>
                  <input
                    type="text"
                    value={trailerOrSecondaryId}
                    onChange={(e) => setTrailerOrSecondaryId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {transportMode === 'ROAD' ? 'Conductor Asignado' : transportMode === 'SEA' ? 'Capitán de Navío' : transportMode === 'AIR' ? 'Comandante de Vuelo' : 'Maquinista de Convoy'}
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Documento de Identidad / Licencia CNRT / IMO
                  </label>
                  <input
                    type="text"
                    value={operatorId}
                    onChange={(e) => setOperatorId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Teléfono Operativo / Enlace Satelital
                  </label>
                  <input
                    type="text"
                    value={operatorPhone}
                    onChange={(e) => setOperatorPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ROUTE & TIMETABLE */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Punto de Carga / Origen
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    País de Origen
                  </label>
                  <input
                    type="text"
                    value={originCountry}
                    onChange={(e) => setOriginCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Punto de Descarga / Destino Aduanero
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    País de Destino
                  </label>
                  <input
                    type="text"
                    value={destinationCountry}
                    onChange={(e) => setDestinationCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Fecha y Hora de Salida Programada
                  </label>
                  <input
                    type="datetime-local"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Ventana Estimada de Arribo (ETA)
                  </label>
                  <input
                    type="datetime-local"
                    value={estimatedArrival}
                    onChange={(e) => setEstimatedArrival(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CARGO & WEIGHT */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descripción Comercial de la Mercadería
                </label>
                <input
                  type="text"
                  value={cargoDesc}
                  onChange={(e) => setCargoDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tipo de Embalaje
                  </label>
                  <select
                    value={packagingType}
                    onChange={(e) => setPackagingType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="PALLET">Pallets Homologados</option>
                    <option value="CONTAINER_40">Contenedor 40ft HC</option>
                    <option value="CONTAINER_20">Contenedor 20ft</option>
                    <option value="BOX">Cajas / Bultos</option>
                    <option value="DRUM">Tambores Industriales</option>
                    <option value="BULK_HOPPER">Granel en Tolva</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Cantidad Bultos
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Peso Bruto (Kg)
                  </label>
                  <input
                    type="number"
                    value={grossWeightKg}
                    onChange={(e) => setGrossWeightKg(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Volumen (m³)
                  </label>
                  <input
                    type="number"
                    value={volumeM3}
                    onChange={(e) => setVolumeM3(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Posición Arancelaria NCM / HS Code
                  </label>
                  <input
                    type="text"
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    placeholder="ej: 7210.49.10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Valor Declarado FOB (USD)
                  </label>
                  <input
                    type="number"
                    value={declaredValueUsd}
                    onChange={(e) => setDeclaredValueUsd(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Special Cargo Conditions */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-300">
                  Condiciones Especiales de Trazabilidad y Seguridad
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={isPerishable}
                      onChange={(e) => setIsPerishable(e.target.checked)}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span>Cadena de Frío Requerida (Reefer)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={isDangerous}
                      onChange={(e) => setIsDangerous(e.target.checked)}
                      className="rounded border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <span>Mercancía Peligrosa (IMO / ADR)</span>
                  </label>
                </div>

                {isPerishable && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Temp Mínima (°C)
                      </label>
                      <input
                        type="number"
                        value={minTemp}
                        onChange={(e) => setMinTemp(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Temp Máxima (°C)
                      </label>
                      <input
                        type="number"
                        value={maxTemp}
                        onChange={(e) => setMaxTemp(Number(e.target.value))}
                        className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: SEALS ISO 17712 (ISO 28000) */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 text-xs text-slate-300">
                <span className="font-semibold text-blue-400">Normativa ISO 28000:</span> Todo despacho multimodal requiere al menos un precinto de alta seguridad homologado ISO 17712 para garantizar la inviolabilidad de la carga.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Número de Precinto Serializado
                  </label>
                  <input
                    type="text"
                    value={sealNumber}
                    onChange={(e) => setSealNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tipo de Precinto Homologado
                  </label>
                  <select
                    value={sealType}
                    onChange={(e) => setSealType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ISO_17712_BOLT">Perno de Alta Seguridad (Bolt ISO 17712)</option>
                    <option value="ELECTRONIC_RFID">Precinto Electrónico RFID Activo</option>
                    <option value="CABLE_LOCK">Sello de Cable de Acero Trenzado</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Punto de Colocación / Verificación
                  </label>
                  <input
                    type="text"
                    value={sealLocation}
                    onChange={(e) => setSealLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    placeholder="ej: Compuerta Trasera Derecha / Válvula de Descarga"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Estado de precinto: <strong>INTACTO</strong> verificado por escaneo fotográfico.</span>
              </div>
            </div>
          )}

          {/* STEP 5: DOCUMENTS & WEBSERVICES DISPATCH */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Documentación Aduanera y Comercial
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {transportMode === 'ROAD' ? 'Carta de Porte Internacional (CRT)' : transportMode === 'SEA' ? 'Bill of Lading (B/L)' : transportMode === 'AIR' ? 'Air Waybill (AWB)' : 'Guía de Carga Ferroviaria'}
                  </label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Factura Comercial de Exportación / Remito
                  </label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Automatic Webservices Submission Checkbox */}
              <div className="p-4 rounded-xl bg-slate-950 border border-blue-900/60 space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transmitImmediately}
                    onChange={(e) => setTransmitImmediately(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-blue-400" />
                      <span>Transmitir Declaración a WebServices Aduana & ERP Ahora</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Envía automáticamente el JSON a {company.customsAgentCode} y sincroniza con el ERP en la nube.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div></div>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-colors"
            >
              <span>Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finalizar y Registrar Despacho</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
