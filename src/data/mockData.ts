import {
  Company,
  User,
  Shipment,
  WebserviceLog,
  ISORequirement,
  NonConformity,
  AlertNotification,
  AuditLog
} from '../types';

export const mockCompanies: Company[] = [
  {
    id: 'comp_translog',
    name: 'TransLog Global S.A.',
    legalName: 'TransLog Global Logística Internacional S.A.',
    taxId: 'CUIT 30-71489234-9',
    country: 'Argentina',
    code: 'TLG',
    logoText: 'TLG',
    erpEndpoint: 'https://erp.translog-global.com/api/v2/shipments',
    customsAgentCode: 'AFIP-DEP-9941',
    certifications: ['ISO 9001:2015', 'ISO 28000:2022', 'OEA-Certificado']
  },
  {
    id: 'comp_andespacific',
    name: 'Andes Pacific Freight Corp',
    legalName: 'Andes Pacific Logistics & Shipping S.A.C.',
    taxId: 'RUC 20549812401',
    country: 'Perú',
    code: 'APF',
    logoText: 'APF',
    erpEndpoint: 'https://sap-gateway.andespacific.io/odata/v4/logistics',
    customsAgentCode: 'SUNAT-EXP-4402',
    certifications: ['ISO 9001:2015', 'BASC V6-2022']
  },
  {
    id: 'comp_eurotrans',
    name: 'EuroTrans Intermodal Ibérica',
    legalName: 'EuroTrans Multimodal Freight S.L.',
    taxId: 'NIF B-88741029',
    country: 'España',
    code: 'ETI',
    logoText: 'ETI',
    erpEndpoint: 'https://odoo.eurotrans-iberica.es/jsonrpc/v1/cargo',
    customsAgentCode: 'AEAT-DUA-7719',
    certifications: ['ISO 9001:2015', 'ISO 28000:2022', 'ISO 14001:2015']
  }
];

export const mockUsers: User[] = [
  {
    id: 'usr_admin',
    name: 'Ing. Carlos Menéndez',
    email: 'carlos.menendez@translog.com',
    role: 'SUPER_ADMIN',
    companyId: 'comp_translog',
    badgeNumber: 'TLG-ADM-01'
  },
  {
    id: 'usr_auditor',
    name: 'Lic. Mariana Valdez',
    email: 'mariana.valdez@translog.com',
    role: 'ISO_AUDITOR',
    companyId: 'comp_translog',
    badgeNumber: 'TLG-ISO-09'
  },
  {
    id: 'usr_traffic',
    name: 'Martín Rodríguez',
    email: 'martin.rodriguez@translog.com',
    role: 'TRAFFIC_MANAGER',
    companyId: 'comp_translog',
    badgeNumber: 'TLG-LOG-24'
  },
  {
    id: 'usr_operator',
    name: 'Roberto Gómez',
    email: 'roberto.gomez@translog.com',
    role: 'FIELD_OPERATOR',
    companyId: 'comp_translog',
    badgeNumber: 'TLG-FLD-88'
  }
];

export const initialShipments: Shipment[] = [
  // 1. CARGA TERRESTRE: Scania R500 Frigorífico (Carne Bovina para Exportación)
  {
    id: 'ship_001',
    code: 'TRK-2026-0891',
    companyId: 'comp_translog',
    transportMode: 'ROAD',
    status: 'IN_TRANSIT',
    origin: 'Río Cuarto, Córdoba',
    originCountry: 'Argentina',
    destination: 'Puerto de Buenos Aires - Terminal 4',
    destinationCountry: 'Argentina',
    departureDate: '2026-11-06T06:30:00Z',
    estimatedArrival: '2026-11-06T18:45:00Z',
    carrier: {
      companyName: 'Transportes Cordillera S.R.L.',
      operatorName: 'Jorge Alberto Sosa',
      operatorId: 'DNI 28.914.331',
      operatorPhone: '+54 9 358 411-9022',
      unitIdentifier: 'AE 944 TR (Scania R500)',
      trailerOrSecondaryId: 'SEMI-FRIGO-882 (Termo King)'
    },
    packages: [
      {
        id: 'pkg_001',
        description: 'Cortes Vacunos Enfriados al Vacío (Cuota Hilton)',
        packagingType: 'PALLET',
        quantity: 26,
        grossWeightKg: 21500,
        netWeightKg: 20200,
        volumeM3: 68.5,
        hsCode: '0201.30.00',
        isDangerous: false,
        isPerishable: true,
        requiredTempCelsius: { min: -1.5, max: 2.0 }
      }
    ],
    totalGrossWeightKg: 21500,
    totalVolumeM3: 68.5,
    declaredValueUsd: 184500,
    seals: [
      {
        id: 'seal_001',
        sealNumber: 'SENASA-AR-994102',
        sealType: 'ISO_17712_BOLT',
        placedAt: '2026-11-06T06:15:00Z',
        placedBy: 'Insp. Dr. Horacio Paz (SENASA)',
        locationPoint: 'Cierre Central Puerta Trasera',
        status: 'CHECKED_OK',
        checkTimestamp: '2026-11-06T10:30:00Z',
        checkedBy: 'Roberto Gómez (Muelle)'
      },
      {
        id: 'seal_002',
        sealNumber: 'TLG-SEC-88120',
        sealType: 'ELECTRONIC_RFID',
        placedAt: '2026-11-06T06:20:00Z',
        placedBy: 'Supervisor Planta Frigorífica',
        locationPoint: 'Traba Electrónica Compartimiento Frío',
        status: 'INTACT'
      }
    ],
    documents: [
      {
        id: 'doc_001',
        documentType: 'WAYBILL_CRT',
        documentNumber: 'CRT-AR-2026-8841',
        fileName: 'Carta_Porte_CRT_8841.pdf',
        fileSizeKb: 640,
        uploadDate: '2026-11-06T06:25:00Z',
        status: 'VERIFIED',
        customsWebserviceRef: 'AFIP-CRT-99214'
      },
      {
        id: 'doc_002',
        documentType: 'PHYTOSANITARY',
        documentNumber: 'SENASA-EXP-004419',
        fileName: 'Certificado_Sanitario_Hilton.pdf',
        fileSizeKb: 1250,
        uploadDate: '2026-11-06T06:28:00Z',
        status: 'VERIFIED',
        customsWebserviceRef: 'VUCE-SENASA-OK'
      },
      {
        id: 'doc_003',
        documentType: 'COMMERCIAL_INVOICE',
        documentNumber: 'FACT-E-0004-99120',
        fileName: 'Factura_Exportacion_Hilton.pdf',
        fileSizeKb: 480,
        uploadDate: '2026-11-06T06:30:00Z',
        status: 'VERIFIED'
      }
    ],
    customsDeclarationCode: 'MANI-2026-004128-X',
    customsStatus: 'TRANSMITTED',
    erpSyncStatus: 'SYNCED',
    lastWebserviceLogId: 'ws_001',
    telemetry: {
      currentLat: -34.2541,
      currentLng: -59.5123,
      speedKmH: 78,
      headingDegrees: 115,
      altitudeM: 42,
      lastUpdate: '2026-11-06T14:40:00Z',
      temperatureCelsius: 0.8,
      batteryLevel: 94,
      routeCoordinates: [
        [-33.1232, -64.3493], // Río Cuarto
        [-33.6421, -63.2201], // Villa María
        [-34.0201, -61.5412], // Pergamino
        [-34.2541, -59.5123], // En ruta (San Pedro / Zárate)
        [-34.5822, -58.3711]  // Pto Buenos Aires
      ],
      destinationLat: -34.5822,
      destinationLng: -58.3711,
      isOffRoute: false
    },
    isoComplianceRate: 100,
    hasOpenNonConformity: false,
    notes: 'Temperatura nominal controlada a +0.8°C. Rango estricto Cuota Hilton Unión Europea.'
  },

  // 2. CARGA MARÍTIMA: Buque Portacontenedores (Vino Malbec & Maquinaria)
  {
    id: 'ship_002',
    code: 'SEA-2026-4402',
    companyId: 'comp_translog',
    transportMode: 'SEA',
    status: 'IN_TRANSIT',
    origin: 'Terminal Portuaria Exolgan, Buenos Aires',
    originCountry: 'Argentina',
    destination: 'Port of Rotterdam, Terminal Maasvlakte',
    destinationCountry: 'Países Bajos',
    departureDate: '2026-11-04T12:00:00Z',
    estimatedArrival: '2026-11-24T08:00:00Z',
    carrier: {
      companyName: 'Maersk Line A/S',
      operatorName: 'Capitán Lars Lindholm',
      operatorId: 'IMO-CERT-884912',
      operatorPhone: '+31 10 440 2200',
      unitIdentifier: 'MV Maersk Mc-Kinney (IMO 9619907)',
      trailerOrSecondaryId: 'MSKU-884912-3 / MSKU-991204-1'
    },
    packages: [
      {
        id: 'pkg_002a',
        description: 'Vino Fino Malbec Reserva - 2 Contenedores 40ft High Cube',
        packagingType: 'CONTAINER_40',
        quantity: 2,
        grossWeightKg: 46800,
        netWeightKg: 44200,
        volumeM3: 152.0,
        hsCode: '2204.21.00',
        isDangerous: false,
        isPerishable: false
      }
    ],
    totalGrossWeightKg: 46800,
    totalVolumeM3: 152.0,
    declaredValueUsd: 312000,
    seals: [
      {
        id: 'seal_003',
        sealNumber: 'MSK-HSS-9921008',
        sealType: 'ISO_17712_BOLT',
        placedAt: '2026-11-04T10:00:00Z',
        placedBy: 'Oficial de Seguridad Terminal Exolgan',
        locationPoint: 'Contenedor MSKU-884912-3',
        status: 'CHECKED_OK',
        checkTimestamp: '2026-11-04T11:15:00Z',
        checkedBy: 'Aduana AR - Puesto Control Muelle'
      }
    ],
    documents: [
      {
        id: 'doc_004',
        documentType: 'BILL_OF_LADING',
        documentNumber: 'BL-MSK-BUE-ROT-4402',
        fileName: 'Ocean_Bill_of_Lading_4402.pdf',
        fileSizeKb: 1480,
        uploadDate: '2026-11-04T11:30:00Z',
        status: 'VERIFIED',
        customsWebserviceRef: 'SIDIF-BL-MAERSK-990'
      },
      {
        id: 'doc_005',
        documentType: 'CERT_ORIGIN',
        documentNumber: 'CO-MERCOSUR-2026-091',
        fileName: 'Certificado_Origen_Bodegas.pdf',
        fileSizeKb: 512,
        uploadDate: '2026-11-04T09:45:00Z',
        status: 'VERIFIED'
      }
    ],
    customsDeclarationCode: 'MANI-MAR-2026-77881',
    customsStatus: 'CLEARED',
    erpSyncStatus: 'SYNCED',
    telemetry: {
      currentLat: -23.8541,
      currentLng: -42.1205,
      speedKmH: 34, // ~18.5 nudos
      headingDegrees: 48,
      altitudeM: 0,
      lastUpdate: '2026-11-06T14:15:00Z',
      routeCoordinates: [
        [-34.5822, -58.3711], // Buenos Aires
        [-30.1204, -49.5012], // Costa Sur Brasil
        [-23.8541, -42.1205], // Frente a Río de Janeiro (Tránsito Atlántico)
        [15.1204, -28.4501],  // Cabo Verde
        [51.9541, 4.0201]     // Rotterdam
      ],
      destinationLat: 51.9541,
      destinationLng: 4.0201,
      isOffRoute: false
    },
    isoComplianceRate: 100,
    hasOpenNonConformity: false,
    notes: 'Navegación oceánica nominal en velocidad económica. Protocolo ISO 28000 verificado antes del zarpe.'
  },

  // 3. CARGA AÉREA: Insumos Farmacéuticos Oncológicos (Vuelo Express)
  {
    id: 'ship_003',
    code: 'AIR-2026-1190',
    companyId: 'comp_andespacific',
    transportMode: 'AIR',
    status: 'IN_TRANSIT',
    origin: 'Aeropuerto Internacional Jorge Chávez (LIM)',
    originCountry: 'Perú',
    destination: 'Aeropuerto Internacional de Miami (MIA)',
    destinationCountry: 'Estados Unidos',
    departureDate: '2026-11-06T11:20:00Z',
    estimatedArrival: '2026-11-06T17:15:00Z',
    carrier: {
      companyName: 'LATAM Cargo Airlines',
      operatorName: 'Comandante Andrés Paredes',
      operatorId: 'DGAC-PE-44810',
      operatorPhone: '+51 1 511-8900',
      unitIdentifier: 'Boeing 767-300F (N542LA)',
      trailerOrSecondaryId: 'ULD Pallet PMC-44120-UC'
    },
    packages: [
      {
        id: 'pkg_003',
        description: 'Reactivos Biológicos & Vacunas Oncológicas',
        packagingType: 'BOX',
        quantity: 18,
        grossWeightKg: 1420,
        netWeightKg: 1180,
        volumeM3: 8.4,
        hsCode: '3002.20.00',
        isDangerous: true,
        imoClass: 'Class 6.2 (Sustancias Infecciosas / Biológicas)',
        unNumber: 'UN 3373',
        isPerishable: true,
        requiredTempCelsius: { min: 2.0, max: 8.0 }
      }
    ],
    totalGrossWeightKg: 1420,
    totalVolumeM3: 8.4,
    declaredValueUsd: 495000,
    seals: [
      {
        id: 'seal_004',
        sealNumber: 'APF-AIR-CRYO-0992',
        sealType: 'ELECTRONIC_RFID',
        placedAt: '2026-11-06T09:40:00Z',
        placedBy: 'Ing. Químico Farma Andean Lab',
        locationPoint: 'Contenedor Isotérmico Envirotainer',
        status: 'INTACT'
      }
    ],
    documents: [
      {
        id: 'doc_006',
        documentType: 'AIR_WAYBILL',
        documentNumber: 'AWB-045-88491022',
        fileName: 'Air_Waybill_045_88491022.pdf',
        fileSizeKb: 890,
        uploadDate: '2026-11-06T10:15:00Z',
        status: 'VERIFIED',
        customsWebserviceRef: 'SUNAT-AIR-EXP-1102'
      },
      {
        id: 'doc_007',
        documentType: 'MSDS_SAFETY',
        documentNumber: 'MSDS-BIO-2026-V3',
        fileName: 'Hoja_Seguridad_IATA_DGR.pdf',
        fileSizeKb: 1720,
        uploadDate: '2026-11-06T09:50:00Z',
        status: 'VERIFIED'
      }
    ],
    customsDeclarationCode: 'SUNAT-DUA-2026-884102',
    customsStatus: 'TRANSMITTED',
    erpSyncStatus: 'SYNCED',
    telemetry: {
      currentLat: 4.8541,
      currentLng: -77.9123,
      speedKmH: 840,
      headingDegrees: 12,
      altitudeM: 10600,
      lastUpdate: '2026-11-06T14:38:00Z',
      temperatureCelsius: 4.2,
      batteryLevel: 98,
      routeCoordinates: [
        [-12.0219, -77.1143], // Lima (LIM)
        [-2.1541, -78.4512],  // Ecuador
        [4.8541, -77.9123],   // Colombia Pacífico (En vuelo)
        [15.4201, -81.2501],  // Mar Caribe
        [25.7959, -80.2870]   // Miami (MIA)
      ],
      destinationLat: 25.7959,
      destinationLng: -80.2870,
      isOffRoute: false
    },
    isoComplianceRate: 98,
    hasOpenNonConformity: false,
    notes: 'Embarque crítico con data logger térmico activo Bluetooth/Satélite. Temperatura actual +4.2°C.'
  },

  // 4. CARGA FERROVIARIA: Tren Tolva Granelero (Cereales y Soja)
  {
    id: 'ship_004',
    code: 'RAIL-2026-0318',
    companyId: 'comp_translog',
    transportMode: 'RAIL',
    status: 'CUSTOMS_HOLD',
    origin: 'Centro de Acopio Vicentina, Santa Fe',
    originCountry: 'Argentina',
    destination: 'Terminal Portuaria Rosario Sur (Río Paraná)',
    destinationCountry: 'Argentina',
    departureDate: '2026-11-05T20:00:00Z',
    estimatedArrival: '2026-11-06T12:00:00Z',
    carrier: {
      companyName: 'Ferrosur Roca Cargas',
      operatorName: 'Maquinista Walter Benítez',
      operatorId: 'CNRT-MAQ-11840',
      operatorPhone: '+54 9 341 559-0012',
      unitIdentifier: 'Locomotora ALCO RSD-16 (ID #8490)',
      trailerOrSecondaryId: '18 Vagones Tolva Graneleros (VAG-901 a 918)'
    },
    packages: [
      {
        id: 'pkg_004',
        description: 'Soja Grano Primera Calidad No OGM a Granel',
        packagingType: 'BULK_HOPPER',
        quantity: 18,
        grossWeightKg: 900000, // 900 Toneladas
        netWeightKg: 892000,
        volumeM3: 1120.0,
        hsCode: '1201.90.00',
        isDangerous: false,
        isPerishable: false
      }
    ],
    totalGrossWeightKg: 900000,
    totalVolumeM3: 1120.0,
    declaredValueUsd: 405000,
    seals: [
      {
        id: 'seal_005',
        sealNumber: 'FSR-GRAIN-99120',
        sealType: 'CABLE_LOCK',
        placedAt: '2026-11-05T19:30:00Z',
        placedBy: 'Jefe Playa Maniobras Acopio',
        locationPoint: 'Compuerta Superior Tolva 04',
        status: 'TAMPERED_ALERT',
        checkTimestamp: '2026-11-06T08:15:00Z',
        checkedBy: 'Inspector de Vía Puesto San Lorenzo'
      }
    ],
    documents: [
      {
        id: 'doc_008',
        documentType: 'WAYBILL_CRT',
        documentNumber: 'GUIA-FERRO-2026-991',
        fileName: 'Guia_Ferroviaria_Cereal.pdf',
        fileSizeKb: 720,
        uploadDate: '2026-11-05T19:45:00Z',
        status: 'VERIFIED',
        customsWebserviceRef: 'AFIP-CTG-GRAIN-0012'
      }
    ],
    customsDeclarationCode: 'MANI-FERRO-2026-0012',
    customsStatus: 'OBSERVED_HOLD',
    erpSyncStatus: 'ERROR',
    lastWebserviceLogId: 'ws_003',
    telemetry: {
      currentLat: -32.7481,
      currentLng: -60.7291,
      speedKmH: 0,
      headingDegrees: 180,
      altitudeM: 28,
      lastUpdate: '2026-11-06T14:22:00Z',
      batteryLevel: 82,
      routeCoordinates: [
        [-31.6321, -60.7123], // Santa Fe Capital
        [-32.7481, -60.7291], // Detenido en San Lorenzo (Playa Ferroviaria)
        [-32.9587, -60.6393]  // Puerto Rosario
      ],
      destinationLat: -32.9587,
      destinationLng: -60.6393,
      isOffRoute: false
    },
    isoComplianceRate: 72,
    hasOpenNonConformity: true,
    notes: 'ALERTA DE SEGURIDAD: Precinto de compuerta tolva 04 con daño mecánico o apertura no autorizada. Retención aduanera preventiva.'
  },

  // 5. CARGA TERRESTRE: EuroTrans Ibérica (Automotriz - Repuestos Valencia a Madrid)
  {
    id: 'ship_005',
    code: 'TRK-2026-9021',
    companyId: 'comp_eurotrans',
    transportMode: 'ROAD',
    status: 'DELIVERED',
    origin: 'Polígono Industrial Almussafes, Valencia',
    originCountry: 'España',
    destination: 'Planta de Ensamblaje Villaverde, Madrid',
    destinationCountry: 'España',
    departureDate: '2026-11-05T07:00:00Z',
    estimatedArrival: '2026-11-05T13:30:00Z',
    actualArrival: '2026-11-05T13:15:00Z',
    carrier: {
      companyName: 'EuroTrans Flota Propia',
      operatorName: 'David Serrano Moreno',
      operatorId: 'DNI 53.421.889-M',
      operatorPhone: '+34 612 994 002',
      unitIdentifier: '9012-LMY (Mercedes Actros 1845)',
      trailerOrSecondaryId: 'R-4412-BDC (Tauliner Mega)'
    },
    packages: [
      {
        id: 'pkg_005',
        description: 'Chasis de Precisión y Componentes Electrónicos OEM',
        packagingType: 'PALLET',
        quantity: 32,
        grossWeightKg: 18400,
        netWeightKg: 17100,
        volumeM3: 82.0,
        hsCode: '8708.29.90',
        isDangerous: false,
        isPerishable: false
      }
    ],
    totalGrossWeightKg: 18400,
    totalVolumeM3: 82.0,
    declaredValueUsd: 260000,
    seals: [
      {
        id: 'seal_006',
        sealNumber: 'ETI-SECURITY-441029',
        sealType: 'ISO_17712_BOLT',
        placedAt: '2026-11-05T06:45:00Z',
        placedBy: 'Supervisor Calidad Ford Almussafes',
        locationPoint: 'Cerrojo Principal Portón Trasero',
        status: 'CHECKED_OK',
        checkTimestamp: '2026-11-05T13:15:00Z',
        checkedBy: 'Recepción Almacén Central Madrid'
      }
    ],
    documents: [
      {
        id: 'doc_009',
        documentType: 'WAYBILL_CRT',
        documentNumber: 'CMR-ES-2026-771',
        fileName: 'CMR_Electronico_771.pdf',
        fileSizeKb: 540,
        uploadDate: '2026-11-05T06:50:00Z',
        status: 'VERIFIED',
        customsWebserviceRef: 'DGT-CMR-VALID'
      }
    ],
    customsDeclarationCode: 'TRANS-UE-2026-0091',
    customsStatus: 'CLEARED',
    erpSyncStatus: 'SYNCED',
    telemetry: {
      currentLat: 40.3541,
      currentLng: -3.7012,
      speedKmH: 0,
      headingDegrees: 270,
      altitudeM: 650,
      lastUpdate: '2026-11-05T13:20:00Z',
      batteryLevel: 100,
      routeCoordinates: [
        [39.3141, -0.4201], // Valencia
        [39.8541, -1.8201], // Motilla del Palancar
        [40.3541, -3.7012]  // Madrid Villaverde
      ],
      destinationLat: 40.3541,
      destinationLng: -3.7012,
      isOffRoute: false
    },
    isoComplianceRate: 100,
    hasOpenNonConformity: false,
    deliverySignature: {
      receivedBy: 'Alfonso Gómez (Recepción Villaverde)',
      signatureDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10 40 Q 50 10, 90 35 T 180 30" stroke="black" stroke-width="2" fill="none"/></svg>',
      timestamp: '2026-11-05T13:15:00Z',
      latitude: 40.3541,
      longitude: -3.7012
    },
    notes: 'Entrega Just-In-Time completada 15 minutos antes de la ventana estimada sin daños ni novedades.'
  }
];

export const mockWebserviceLogs: WebserviceLog[] = [
  {
    id: 'ws_001',
    shipmentId: 'ship_001',
    systemName: 'ADUANA_VUCE',
    direction: 'OUTBOUND',
    endpoint: 'https://vuce.aduana.gob.ar/ws/v3/cargo/declaration',
    timestamp: '2026-11-06T06:31:15Z',
    httpStatus: 200,
    latencyMs: 342,
    transactionToken: 'VUCE-TX-8849120-OK',
    status: 'SUCCESS',
    requestPayload: {
      manifiestoId: 'MANI-2026-004128-X',
      medioTransporte: 'ROAD_CAMION',
      patente: 'AE 944 TR',
      semirremolque: 'SEMI-FRIGO-882',
      precintoISO17712: 'SENASA-AR-994102',
      cuitExportador: '30-71489234-9',
      mercaderia: {
        posicionArancelaria: '0201.30.00',
        pesoBrutoKg: 21500,
        bultos: 26,
        valorDeclaradoFOB: 184500
      }
    },
    responsePayload: {
      status: 'AUTORIZADO',
      canalAsignado: 'VERDE',
      numeroTransmisionAFIP: 'AFIP-2026-X8841-BUE',
      timestampAprobacion: '2026-11-06T06:31:16Z',
      firmaElectronicaAduana: 'SHA256:d891bca782103f...'
    }
  },
  {
    id: 'ws_002',
    shipmentId: 'ship_001',
    systemName: 'ERP_SAP',
    direction: 'OUTBOUND',
    endpoint: 'https://sap-prod.translog-global.com/odata/v4/ShipmentService/Shipments',
    timestamp: '2026-11-06T06:32:00Z',
    httpStatus: 201,
    latencyMs: 188,
    transactionToken: 'SAP-ODATA-9941-CREATED',
    status: 'SUCCESS',
    requestPayload: {
      ShipmentNumber: 'TRK-2026-0891',
      CompanyCode: '1000',
      TransportType: '01_ROAD',
      PlannedDeparture: '2026-11-06T06:30:00Z',
      WeightUnit: 'KG',
      TotalWeight: 21500
    },
    responsePayload: {
      d: {
        ShipmentDocument: '10088921',
        Status: 'DISPATCHED',
        CostCenter: 'CC-LOG-EXP-04',
        Message: 'Document created and synchronized successfully'
      }
    }
  },
  {
    id: 'ws_003',
    shipmentId: 'ship_004',
    systemName: 'ADUANA_VUCE',
    direction: 'OUTBOUND',
    endpoint: 'https://vuce.aduana.gob.ar/ws/v3/cargo/declaration',
    timestamp: '2026-11-06T08:20:00Z',
    httpStatus: 422,
    latencyMs: 512,
    transactionToken: 'VUCE-ERR-PREC-991',
    status: 'ERROR',
    requestPayload: {
      manifiestoId: 'MANI-FERRO-2026-0012',
      medioTransporte: 'RAIL_TREN',
      idTren: 'Locomotora ALCO RSD-16 (ID #8490)',
      precintoDeclarado: 'FSR-GRAIN-99120',
      estadoPrecintoEnRuta: 'TAMPERED_ALERT'
    },
    responsePayload: {
      error: 'DECLARATION_HOLD_PRECAUTIONARY',
      code: 'ERR_CUSTOMS_SEAL_INTEGRITY_FAIL',
      message: 'Discrepancia detectada en precinto FSR-GRAIN-99120. Tránsito bloqueado para inspección física OEA/Aduana.',
      inspectionOffice: 'Puesto Fitosanitario San Lorenzo'
    }
  }
];

export const mockISORequirements: ISORequirement[] = [
  {
    id: 'req_001',
    standard: 'ISO_9001',
    clause: '8.5.1 Control de la Producción y Provisión del Servicio',
    title: 'Control de Condiciones de Estiba y Cadena de Frío',
    description: 'Verificación estricta de parámetros de temperatura y peso neto registrado antes de liberar la orden de transporte.',
    status: 'COMPLIANT',
    lastEvaluated: '2026-11-06T07:00:00Z',
    auditorNotes: 'Termógrafos calibrados con certificado INTI vigente hasta Dic 2026.'
  },
  {
    id: 'req_002',
    standard: 'ISO_9001',
    clause: '8.5.2 Identificación y Trazabilidad',
    title: 'Trazabilidad Unívoca de Lote y Código de Manifiesto',
    description: 'Cada bulto o contenedor debe contar con código QR/código de barras que correlacione con la documentación aduanera en los webservices.',
    status: 'COMPLIANT',
    lastEvaluated: '2026-11-06T08:30:00Z',
    auditorNotes: 'Sistema LogiTrace correlaciona automáticamente el CRT con el webservice aduanero.'
  },
  {
    id: 'req_003',
    standard: 'ISO_28000',
    clause: '4.4.2 Control de Seguridad en Carga y Precintos',
    title: 'Homologación de Precintos de Alta Seguridad ISO 17712',
    description: 'Obligatoriedad de uso de sellos mecánicos tipo perno (bolt) o electrónicos RFID certificados para transporte internacional.',
    status: 'COMPLIANT',
    lastEvaluated: '2026-11-05T14:00:00Z',
    auditorNotes: 'Lote de precintos trazado con certificación del fabricante.'
  },
  {
    id: 'req_004',
    standard: 'ISO_28000',
    clause: '4.4.7 Gestión de Incidentes de Seguridad en Tránsito',
    title: 'Protocolo de Respuesta Inmediata ante Ruptura de Precinto',
    description: 'Activación de alerta automática en el centro de control y notificación inmediata al despachante aduanero y fuerza policial.',
    status: 'NON_COMPLIANT',
    lastEvaluated: '2026-11-06T08:25:00Z',
    auditorNotes: 'Caso RAIL-2026-0318 disparó alerta. Se abrió la No Conformidad NC-2026-014 en proceso de investigación.'
  }
];

export const mockNonConformities: NonConformity[] = [
  {
    id: 'nc_014',
    shipmentId: 'ship_004',
    standard: 'ISO_28000',
    severity: 'CRITICAL',
    description: 'Precinto FSR-GRAIN-99120 de la tolva 04 del tren Ferrosur reportó corte de cable en puesto de pesaje San Lorenzo.',
    detectedAt: '2026-11-06T08:15:00Z',
    detectedBy: 'Inspector de Vía Puesto San Lorenzo',
    rootCause: 'Intento de apertura no autorizada durante detención técnica en señalamiento ferroviario.',
    correctiveAction: 'Detención del convoy, custodia de prefectura/policía, re-precintado con sello oficial judicial y auditoría de pesaje.',
    responsiblePerson: 'Comité de Seguridad de Cadena (Lic. Mariana Valdez)',
    deadline: '2026-11-07T18:00:00Z',
    status: 'IN_PROGRESS'
  },
  {
    id: 'nc_012',
    shipmentId: 'ship_001',
    standard: 'ISO_9001',
    severity: 'MINOR',
    description: 'Demora de 12 minutos en la sincronización del token de autorización del WebService aduanero AFIP.',
    detectedAt: '2026-11-04T09:10:00Z',
    detectedBy: 'Sistema Automático LogiTrace',
    rootCause: 'Timeout intermitente en la pasarela de la agencia aduanera por sobrecarga de peticiones.',
    correctiveAction: 'Implementación de política de reintento exponencial (Backoff) de 3 intentos en el conector REST.',
    responsiblePerson: 'Ing. Sistemas WebServices',
    deadline: '2026-11-05T12:00:00Z',
    status: 'CLOSED',
    closedAt: '2026-11-05T11:30:00Z'
  }
];

export const initialAlerts: AlertNotification[] = [
  {
    id: 'alt_001',
    shipmentId: 'ship_004',
    shipmentCode: 'RAIL-2026-0318',
    companyId: 'comp_translog',
    type: 'SEAL_TAMPER',
    severity: 'CRITICAL',
    title: 'Precinto Forzado en Tolva Ferroviaria',
    message: 'Alerta ISO 28000: Precinto FSR-GRAIN-99120 con estado TAMPERED. Detención obligatoria en San Lorenzo.',
    timestamp: '2026-11-06T08:15:00Z',
    resolved: false
  },
  {
    id: 'alt_002',
    shipmentId: 'ship_004',
    shipmentCode: 'RAIL-2026-0318',
    companyId: 'comp_translog',
    type: 'CUSTOMS_DELAY',
    severity: 'WARNING',
    title: 'Retención Aduanera por Discrepancia',
    message: 'WebService Aduana VUCE devolvió HTTP 422: Carga en estado OBSERVED_HOLD.',
    timestamp: '2026-11-06T08:20:00Z',
    resolved: false
  },
  {
    id: 'alt_003',
    shipmentId: 'ship_001',
    shipmentCode: 'TRK-2026-0891',
    companyId: 'comp_translog',
    type: 'COLD_CHAIN_BREACH',
    severity: 'INFO',
    title: 'Variación Térmica Transitoria (+0.8°C)',
    message: 'Termógrafo reportó leve subida por apertura para inspección intermedia. Dentro del umbral reglamentario (-1.5°C a +2.0°C).',
    timestamp: '2026-11-06T10:35:00Z',
    resolved: true,
    resolvedBy: 'Roberto Gómez (Muelle)',
    resolvedAt: '2026-11-06T10:45:00Z'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'aud_001',
    timestamp: '2026-11-06T06:30:00Z',
    userId: 'usr_traffic',
    userName: 'Martín Rodríguez',
    userRole: 'TRAFFIC_MANAGER',
    companyId: 'comp_translog',
    action: 'CREATE_SHIPMENT',
    entityType: 'SHIPMENT',
    entityId: 'ship_001',
    details: 'Creado despacho terrestre TRK-2026-0891 (21.5 Tn Carne Bovina Cuota Hilton).',
    ipAddress: '190.220.45.12',
    hashSignature: 'SHA256:7a941f...8820c'
  },
  {
    id: 'aud_002',
    timestamp: '2026-11-06T06:31:15Z',
    userId: 'usr_traffic',
    userName: 'Martín Rodríguez',
    userRole: 'TRAFFIC_MANAGER',
    companyId: 'comp_translog',
    action: 'DISPATCH_WEBSERVICE',
    entityType: 'WEBSERVICE',
    entityId: 'ws_001',
    details: 'Transmisión exitosa a VUCE Aduana Argentina. Token VUCE-TX-8849120-OK otorgado.',
    ipAddress: '190.220.45.12',
    hashSignature: 'SHA256:88102a...4490e'
  },
  {
    id: 'aud_003',
    timestamp: '2026-11-06T08:15:00Z',
    userId: 'usr_auditor',
    userName: 'Lic. Mariana Valdez',
    userRole: 'ISO_AUDITOR',
    companyId: 'comp_translog',
    action: 'RAISE_NON_CONFORMITY',
    entityType: 'ISO_AUDIT',
    entityId: 'nc_014',
    details: 'Apertura de No Conformidad Crítica ISO 28000 por daño en precinto tolva 04 (RAIL-2026-0318).',
    ipAddress: '190.220.45.18',
    hashSignature: 'SHA256:bb4012...7710a'
  }
];
