# LogiTrace ISO - Plataforma SaaS Multiempresa de Carga Multimodal y Trazabilidad

Sistema empresarial integral para el registro, trazabilidad y despacho de mercaderías multimodales (terrestre, marítimo, aéreo y ferroviario), con sincronización a webservices aduaneros y ERPs en la nube, gestión estricta de normativas ISO 9001 e ISO 28000, telemetría GPS en tiempo real y módulo adaptado para personal operativo en campo.

## Decisiones Críticas y Preferencias del Usuario

> [!IMPORTANT]
> A continuación se resumen las decisiones confirmadas en la fase de clarificación previa:

- **Medios de Transporte Priorizados**: Multimodal integral (Terrestre con camiones y precintos, Marítimo con contenedores/BL, Aéreo con guías AWB y Ferroviario con vagones/guías).
- **Normas ISO y Cumplimiento**: Enfoque prioritario en **ISO 9001** (Sistemas de Gestión de Calidad, control de no conformidades y calibración) e **ISO 28000** (Seguridad en la Cadena de Suministro, verificación de precintos, accesos e inspección de integridad).
- **Integración de Webservices y ERPs**: Conector universal REST con emulador/conector para transmisión de declaraciones de carga a webservices aduaneros (ej. VUCE/Aduana) y sincronización con sistemas ERP (SAP, Oracle, Odoo), visualización de payloads JSON y auditoría de respuestas HTTP.
- **Visualización Cartográfica GPS**: Mapa interactivo táctico en tiempo real con geolocalización de unidades en tránsito, trazado de rutas, geocercas aduaneras/portuarias e indicadores de telemetría (velocidad, estado de precinto, temperatura reefer).

---

## 1. Visión General y Concepto Central

### Qué Hace la Aplicación
**LogiTrace ISO** centraliza todo el ciclo de vida de las operaciones de transporte de mercancías para múltiples organizaciones:
1. **Registro Multimodal**: Carga y despacho de envíos terrestres, marítimos, aéreos y ferroviarios con validación de documentación regulatoria (remitos, CRT, BL, AWB, certificados fitosanitarios, hojas de seguridad MSDS).
2. **Conector Webservices & ERP**: Enlace configurable para enviar y sincronizar manifiestos y estados aduaneros vía API REST con logs de auditoría de payloads y tokens.
3. **Módulo de Calidad y Seguridad ISO (9001 / 28000)**: Inspecciones obligatorias de precintos, control de puntos críticos de control (PCC), checklist de no conformidades y bitácora de auditoría inmutable (Audit Trail).
4. **Analítica e Inventarios en Tránsito**: Métricas en tiempo real de OTIF (On-Time In-Full), ocupación de depósitos fiscales, volumen transportado (Tn/TEUs/m3) y alertas de rotura de cadena.
5. **Consola Operativa Móvil (Mobile Field Mode)**: Interfaz diseñada ergonómicamente para operarios en muelle y patios (escaneo rápido de códigos, check-in de precintos, captura de fotos de evidencia y firma digital táctil).
6. **Alertas Inteligentes**: Notificaciones automáticas por desvío de geocercas, variación térmica en reefers, retrasos aduaneros y anomalías de seguridad.
7. **Reportes y Exportación**: Generación de Manifiestos de Carga en PDF oficial y exportación de inventarios y trazabilidad a Excel/CSV.

### Perfil de Usuarios y Roles
- **Super Administrador / Auditor General**: Control multiempresa, auditoría de accesos y configuración de parámetros globales.
- **Responsable de Calidad y Seguridad ISO**: Gestión de matrices de riesgo ISO 28000, no conformidades ISO 9001 y aprobación de auditorías.
- **Jefe de Tráfico / Despachante Logístico**: Creación de expedientes de carga, asignación de medios, despacho y transmisión a webservices.
- **Operario de Muelle / Conductor**: Modo móvil con escaneo rápido, validación de precintos y registro de novedades en terreno.

---

## 2. Experiencia de Usuario y Diseño Visual

### Identidad Visual y Estilo
Siguiendo las directrices de SaaS y plataformas industriales de alta exigencia:
- **Estilo**: Utilitario de precisión, limpio, corporativo y de alta densidad de información sin saturación visual.
- **Paleta de Colores (Regla 60-30-10)**:
  - *60% Lienzo Neutral*: Fondo pizarra suave y limpio (`#0B0F19` en modo oscuro / `#F8FAFC` en modo claro).
  - *30% Superficies Estructurales*: Paneles y tarjetas en `#111827` / `#FFFFFF` con sutiles bordes milimétricos (`border-slate-200` / `border-slate-800`), sin efectos "pill badge" estáticos innecesarios.
  - *10% Acentos Funcionales*: Azul naval profundo (`#1D4ED8` / `#2563EB`) para acciones primarias, Esmeralda (`#16A34A`) para estados nominales/certificados, Ámbar (`#D97706`) para advertencias de ruta y Carmesí (`#DC2626`) para alarmas de seguridad o violaciones de precinto.
- **Tipografía**:
  - Encabezados y títulos: `Plus Jakarta Sans` para jerarquía ejecutiva nítida.
  - Textos y controles: `DM Sans` para legibilidad técnica a 13px–15px.
  - Métricas, coordenadas GPS, precintos y números de guía: Monospace con cifras tabulares (`font-mono tabular-nums`) para evitar desfases numéricos.
- **Disposición en Pantalla**:
  - Barra lateral de navegación colapsable (260px) con selector de empresa activa.
  - Encabezado con ruta de navegación (breadcrumbs), switch rápido de modo Operativo Móvil / Desktop, alertas activas y perfil de usuario con rol activo.
  - Área central de trabajo con vistas tabulares densas, filtros segmentados instantáneos y modales de inspección técnica.

---

## 3. Decisiones de Producto y Arquitectura de Datos

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LOGITRACE ISO SUITE                             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                                                               ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│     Multiempresa & Roles      │               │   Módulo Operativo Móvil      │
│  - Empresas Aisladas          │               │  - Check-in de Precinto       │
│  - Roles ISO / Tráfico / Muelle│              │  - Firma Táctil / Fotos       │
│  - Registro de Auditoría      │               │  - Validación Offline/Cache   │
└───────────────┬───────────────┘               └───────────────┬───────────────┘
                │                                               │
    ┌───────────┴───────────────────────────────────────────────┴───┐
    ▼                                                               ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│    Gestor de Carga Multimodal │               │   Geolocalización GPS & Mapa  │
│  - Terrestre / Marítimo       │               │  - Tracking de Vehículos/Naves│
│  - Aéreo / Ferroviario        │               │  - Geocercas & Telemetría     │
│  - Documentación Digital      │               │  - Alertas de Desvío de Ruta  │
└───────────────┬───────────────┘               └───────────────┬───────────────┘
                │                                               │
    ┌───────────┴───────────────────────────────────────────────┴───┐
    ▼                                                               ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│   Webservices & ERP Hub       │               │   Normas ISO 9001 / 28000     │
│  - Declaración Aduanera REST  │               │  - Matriz Riesgos de Seguridad│
│  - Sincronización SAP/ERP     │               │  - Gestión No Conformidades   │
│  - JSON Logs & Reintentos     │               │  - Exportación PDF / Excel    │
└───────────────────────────────┘               └───────────────────────────────┘
```

### Entidades y Modelos de Datos Centrales
1. **Company (Multiempresa)**: `id`, `name`, `taxId`, `country`, `logo`, `settings` (ERPEndpoint, customsCode).
2. **Shipment (Carga Multimodal)**:
   - `id`, `code` (ej. `TRK-2026-0891`), `companyId`, `transportMode` (`ROAD` | `SEA` | `AIR` | `RAIL`).
   - `origin`, `destination`, `departureDate`, `estimatedArrival`, `status` (`DRAFT` | `REGISTERED` | `IN_TRANSIT` | `CUSTOMS_HOLD` | `DELIVERED`).
   - `operatorInfo`: Transportista, conductor/capitán, identificación del vehículo/buque/vuelo/tren, patente/matrícula.
   - `cargoDetails`: Tipo de mercadería, peso neto/bruto (kg/tn), volumen (m3), unidades, valor declarado, temperatura consignada (si es refrigerada).
   - `securityDetails`: Números de precintos (sellos de alta seguridad ISO 17712), estado de verificación de precintos, fecha de colocación.
   - `documents`: Lista de documentos adjuntos (Factura, BL/CRT/AWB, Packing List, Fitosanitario, etc.) con metadatos y estado de verificación.
   - `gpsTelemetry`: Coordenadas actuales `[lat, lng]`, velocidad, última actualización, historial de waypoints, alertas de desvío.
   - `customsWebserviceStatus`: Estado de transmisión (`PENDING` | `TRANSMITTED` | `ACCEPTED` | `REJECTED`), código de respuesta, payload y timestamp.
3. **ISO Compliance Log (ISO 9001 & ISO 28000)**:
   - Control de calidad (temperatura, peso verificado, embalaje intacto).
   - Control de seguridad de cadena (integridad de contenedor, verificación de conductor con documento y antecedentes, estado de cerraduras).
   - No conformidades: Clasificación (Leve, Mayor, Crítica), acción correctiva inmediata, responsable y estado de cierre.
4. **Audit Trail**:
   - Registro inmutable de cada acción: `timestamp`, `userId`, `userName`, `userRole`, `companyId`, `action` (`CREATE_SHIPMENT`, `SUBMIT_WEBSERVICE`, `BREAK_SEAL_ALERT`, `CLOSE_NON_CONFORMITY`), `details`, `ipAddress`.
5. **Alert System**:
   - Alertas generadas automáticamente con prioridad (`CRITICAL`, `WARNING`, `INFO`), timestamp, estado (activa / resuelta) y vinculación a la carga correspondiente.

---

## 4. Estructura de Módulos y Flujos Funcionales

### Módulo 1: Selector Multiempresa y Control de Acceso (RBAC)
- Selector visible en la barra superior para alternar entre empresas del grupo logístico o clientes asignados.
- Selector de rol de usuario para simulación y pruebas de auditoría (Admin, Auditor ISO, Despachante, Operario de Campo).

### Módulo 2: Registro Multimodal de Carga
- Formulario guiado por pasos (Wizard dinámico según medio de transporte seleccionado):
  1. **Datos Generales y Transporte**: Selección de modo (Camión, Barco, Avión, Ferrocarril) con campos adaptativos (patente + semirremolque, IMO buque + contenedor, número de vuelo + IATA, número de tren + vagón).
  2. **Mercadería e Inventario**: Descripción de bultos, peso, volumen, lote, clasificación arancelaria.
  3. **Seguridad y Precintos (ISO 28000)**: Registro de precintos de seguridad, foto de verificación y chequeo de integridad.
  4. **Documentación Digital**: Carga de documentos con indicador de estado (Subido, Validado, Pendiente).
  5. **Despacho & Sincronización Webservices**: Disparo opcional de la transmisión a aduana/ERP al completar.

### Módulo 3: Conector Webservices & ERP Hub
- Interfaz interactiva donde se monitorean las transacciones con servicios web:
  - Transmisión instantánea de declaraciones de carga (Manifiesto Aduanero / Factura Electrónica / ERP Sync).
  - Visor de peticiones JSON y respuestas HTTP con cabeceras de autorización y tiempos de latencia.
  - Simulador de respuestas (Aprobado, En Revisión, Rechazado con código de error) para validar la resiliencia operativa.

### Módulo 4: Geolocalización GPS y Monitoreo Cartográfico
- Mapa interactivo táctico que muestra la posición de todos los medios en tránsito con íconos específicos (camión, barco, avión, tren).
- Ventanas informativas con telemetría: velocidad, conductor, estado de precinto, tiempo estimado de llegada (ETA) y trazado de ruta óptima frente a ruta real.
- Capa de geocercas activas (puntos aduaneros, terminales portuarias, almacenes centrales).

### Módulo 5: Dashboard de Analítica de Inventarios y Rendimiento
- KPIs en tiempo real: Tasa de entregas a tiempo (OTIF), Cargas en tránsito por modalidad, Índice de incidentes de seguridad, Ocupación de inventario en depósito fiscal.
- Gráficos interactivos de distribución por modo de transporte y tiempos de tránsito promedio.
- Alertas activas en tiempo real con botón directo de resolución y protocolo de contención.

### Módulo 6: Auditoría y Calidad ISO 9001 / ISO 28000
- Panel dedicado al oficial de cumplimiento y auditores externos:
  - Checklist de seguridad de la cadena de suministro (ISO 28000).
  - Libro de no conformidades (ISO 9001) con acciones preventivas y correctivas (CAPA).
  - Bitácora inmutable de auditoría (Audit Trail) con filtro por usuario, fecha y tipo de evento.

### Módulo 7: Modo Operativo Móvil (Field Operator Experience)
- Vista táctil optimizada para teléfonos y tablets de operarios de patio:
  - Botones grandes (touch targets > 48px).
  - Escáner de precintos y códigos de carga.
  - Verificación visual de daños / incidencias con captura de notas.
  - Firma digital en pantalla para entrega y recepción de mercadería conforme a normas ISO.

### Módulo 8: Reportes y Exportación (PDF & Excel)
- **Generador de Manifiesto Oficial en PDF**: Hoja de ruta y certificado de despacho con QR de validación, sello de empresa, firmas de responsabilidad y desglose de mercadería.
- **Exportador a Excel/CSV**: Exportación filtrada de todos los movimientos de carga con formato listo para auditoría contable y aduanera.

---

## 5. Verificación y Plan de Ejecución

1. **Estructura y Tipado**: Implementar los modelos de datos en TypeScript para empresas, cargas multimodales, eventos de auditoría, precintos y logs de webservices.
2. **Componentes y Vistas**:
   - Sidebar, Header y selector de empresa y rol.
   - Vista Dashboard Principal (KPIs, alertas, resumen de inventarios).
   - Vista Registro y Gestión de Cargas (Terrestre, Marítimo, Aéreo, Ferroviario).
   - Vista Mapa GPS Interactivo en Tiempo Real con telemetría.
   - Vista Webservices & ERP Sync (explorador JSON y consola de transmisión).
   - Vista Auditoría ISO 9001 / 28000 (Matriz de riesgo, no conformidades, log de auditoría).
   - Vista Operativa Móvil (Escaneo, precintos, firma digital táctil).
   - Módulo de Reportes (Visualizador y exportador a PDF y Excel).
3. **Control de Calidad y Compilación**:
   - Verificación de que no existen dependencias faltantes ni errores de tipos.
   - Ejecución de `compile_applet` y `lint_applet` para garantizar cero fallos de compilación.
