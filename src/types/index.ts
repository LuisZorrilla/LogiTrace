export type TransportMode = 'ROAD' | 'SEA' | 'AIR' | 'RAIL';

export type ShipmentStatus = 'DRAFT' | 'REGISTERED' | 'IN_TRANSIT' | 'CUSTOMS_HOLD' | 'DELIVERED';

export type UserRole = 'SUPER_ADMIN' | 'ISO_AUDITOR' | 'TRAFFIC_MANAGER' | 'FIELD_OPERATOR';

export interface Company {
  id: string;
  name: string;
  legalName: string;
  taxId: string; // CUIT / RFC / NIF
  country: string;
  code: string;
  logoText: string;
  erpEndpoint: string;
  customsAgentCode: string;
  certifications: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  badgeNumber: string;
}

export interface CargoPackage {
  id: string;
  description: string;
  packagingType: 'PALLET' | 'CONTAINER_20' | 'CONTAINER_40' | 'DRUM' | 'BOX' | 'BULK_HOPPER';
  quantity: number;
  grossWeightKg: number;
  netWeightKg: number;
  volumeM3: number;
  hsCode: string; // Código arancelario NCM / HS
  isDangerous: boolean;
  imoClass?: string;
  unNumber?: string;
  isPerishable: boolean;
  requiredTempCelsius?: {
    min: number;
    max: number;
  };
}

export interface SecuritySeal {
  id: string;
  sealNumber: string;
  sealType: 'ISO_17712_BOLT' | 'ELECTRONIC_RFID' | 'CABLE_LOCK';
  placedAt: string;
  placedBy: string;
  locationPoint: string; // e.g., 'Puerta Trasera Derecha', 'Válvula Tanque'
  status: 'INTACT' | 'CHECKED_OK' | 'TAMPERED_ALERT';
  checkTimestamp?: string;
  checkedBy?: string;
  photoUrl?: string;
}

export interface DocumentAttachment {
  id: string;
  documentType: 'COMMERCIAL_INVOICE' | 'BILL_OF_LADING' | 'WAYBILL_CRT' | 'AIR_WAYBILL' | 'PACKING_LIST' | 'CERT_ORIGIN' | 'PHYTOSANITARY' | 'MSDS_SAFETY';
  documentNumber: string;
  fileName: string;
  fileSizeKb: number;
  uploadDate: string;
  status: 'VERIFIED' | 'PENDING' | 'REJECTED';
  customsWebserviceRef?: string;
}

export interface WebserviceLog {
  id: string;
  shipmentId: string;
  systemName: 'ADUANA_VUCE' | 'ERP_SAP' | 'ERP_ORACLE' | 'PORT_AUTHORITY';
  direction: 'OUTBOUND' | 'INBOUND';
  endpoint: string;
  timestamp: string;
  httpStatus: number;
  latencyMs: number;
  requestPayload: Record<string, unknown>;
  responsePayload: Record<string, unknown>;
  transactionToken: string;
  status: 'SUCCESS' | 'ERROR' | 'RETRYING';
}

export interface ISORequirement {
  id: string;
  standard: 'ISO_9001' | 'ISO_28000';
  clause: string; // e.g. "7.1.5 Seguimiento y Medición", "4.4.2 Seguridad de Acceso Físico"
  title: string;
  description: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW';
  lastEvaluated: string;
  auditorNotes: string;
}

export interface NonConformity {
  id: string;
  shipmentId?: string;
  standard: 'ISO_9001' | 'ISO_28000';
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  description: string;
  detectedAt: string;
  detectedBy: string;
  rootCause: string;
  correctiveAction: string;
  responsiblePerson: string;
  deadline: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
  closedAt?: string;
}

export interface GPSTelemetry {
  currentLat: number;
  currentLng: number;
  speedKmH: number;
  headingDegrees: number;
  altitudeM: number;
  lastUpdate: string;
  temperatureCelsius?: number; // Para reefers/carga refrigerada
  batteryLevel?: number; // Para dispositivos GPS satelitales
  routeCoordinates: [number, number][];
  destinationLat: number;
  destinationLng: number;
  isOffRoute: boolean;
}

export interface AlertNotification {
  id: string;
  shipmentId: string;
  shipmentCode: string;
  companyId: string;
  type: 'SEAL_TAMPER' | 'GEOFENCE_DEVIATION' | 'COLD_CHAIN_BREACH' | 'CUSTOMS_DELAY' | 'WEBSERVICE_ERROR';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  companyId: string;
  action: string;
  entityType: 'SHIPMENT' | 'DOCUMENT' | 'SEAL' | 'WEBSERVICE' | 'ISO_AUDIT';
  entityId: string;
  details: string;
  ipAddress: string;
  hashSignature: string; // Cadena de integridad simulada
}

export interface Shipment {
  id: string;
  code: string; // ej: TRK-2026-0891
  companyId: string;
  transportMode: TransportMode;
  status: ShipmentStatus;
  origin: string;
  originCountry: string;
  destination: string;
  destinationCountry: string;
  departureDate: string;
  estimatedArrival: string;
  actualArrival?: string;

  // Detalles específicos por modo
  carrier: {
    companyName: string;
    operatorName: string; // Conductor / Capitán / Piloto / Maquinista
    operatorId: string; // DNI / Pasaporte / Licencia
    operatorPhone: string;
    unitIdentifier: string; // Patente camión / IMO buque / Vuelo / ID Tren
    trailerOrSecondaryId?: string; // Semirremolque / Contenedor / Vagón
  };

  // Carga
  packages: CargoPackage[];
  totalGrossWeightKg: number;
  totalVolumeM3: number;
  declaredValueUsd: number;

  // Precintos y Seguridad (ISO 28000)
  seals: SecuritySeal[];

  // Documentación
  documents: DocumentAttachment[];

  // Webservices
  customsDeclarationCode?: string;
  customsStatus: 'PENDING_TRANSMISSION' | 'TRANSMITTED' | 'CLEARED' | 'OBSERVED_HOLD';
  erpSyncStatus: 'SYNCED' | 'PENDING' | 'ERROR';
  lastWebserviceLogId?: string;

  // Telemetría GPS
  telemetry: GPSTelemetry;

  // Auditoría ISO
  isoComplianceRate: number; // Porcentaje de chequeo cumplido 0-100
  hasOpenNonConformity: boolean;

  // Datos de entrega
  deliverySignature?: {
    receivedBy: string;
    signatureDataUrl: string;
    timestamp: string;
    latitude: number;
    longitude: number;
  };

  notes?: string;
}
