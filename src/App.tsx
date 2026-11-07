import React, { useState } from 'react';
import {
  Company,
  User,
  Shipment,
  WebserviceLog,
  ISORequirement,
  NonConformity,
  AlertNotification,
  AuditLog
} from './types';
import {
  mockCompanies,
  mockUsers,
  initialShipments,
  mockWebserviceLogs,
  mockISORequirements,
  mockNonConformities,
  initialAlerts,
  initialAuditLogs
} from './data/mockData';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { RightSidebar } from './components/layout/RightSidebar';
import { AnalyticsDashboard } from './components/dashboard/AnalyticsDashboard';
import { ShipmentsList } from './components/shipments/ShipmentsList';
import { NewShipmentModal } from './components/shipments/NewShipmentModal';
import { ShipmentDetailModal } from './components/shipments/ShipmentDetailModal';
import { WebservicesHub } from './components/webservices/WebservicesHub';
import { ISOComplianceView } from './components/iso/ISOComplianceView';
import { GPSMapView } from './components/tracking/GPSMapView';
import { FieldOperatorView } from './components/mobile/FieldOperatorView';
import { ReportsView } from './components/reports/ReportsView';
import { AlertsDrawer } from './components/alerts/AlertsDrawer';

export default function App() {
  // Global Multiempresa and Auth / Role State
  const [activeCompany, setActiveCompany] = useState<Company>(mockCompanies[0]);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);

  // Operational Data State
  const [shipments, setShipments] = useState<Shipment[]>(initialShipments);
  const [webserviceLogs, setWebserviceLogs] = useState<WebserviceLog[]>(mockWebserviceLogs);
  const [isoRequirements, setIsoRequirements] = useState<ISORequirement[]>(mockISORequirements);
  const [nonConformities, setNonConformities] = useState<NonConformity[]>(mockNonConformities);
  const [alerts, setAlerts] = useState<AlertNotification[]>(initialAlerts);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  // Navigation and Panels State (Collapsible Panels)
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileFieldMode, setIsMobileFieldMode] = useState<boolean>(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState<boolean>(false);
  const [isMobileLeftOpen, setIsMobileLeftOpen] = useState<boolean>(false);

  // Modals and Drawers
  const [isNewShipmentModalOpen, setIsNewShipmentModalOpen] = useState<boolean>(false);
  const [selectedShipmentForDetail, setSelectedShipmentForDetail] = useState<Shipment | null>(null);
  const [selectedShipmentForPrint, setSelectedShipmentForPrint] = useState<Shipment | undefined>(undefined);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState<boolean>(false);

  // Helper to add audit log
  const logAuditEvent = (
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ) => {
    const newLog: AuditLog = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      companyId: activeCompany.id,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '190.220.45.12',
      hashSignature: `SHA256:${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Handler: Create new shipment
  const handleCreateShipment = (newShipment: Shipment, transmitImmediately: boolean) => {
    setShipments(prev => [newShipment, ...prev]);

    logAuditEvent(
      'CREATE_SHIPMENT',
      'SHIPMENT',
      newShipment.id,
      `Registro de carga multimodal ${newShipment.code} (${newShipment.transportMode}). Origen: ${newShipment.origin} → Destino: ${newShipment.destination}. Peso: ${newShipment.totalGrossWeightKg} kg.`
    );

    if (transmitImmediately) {
      handleDispatchWebservice(newShipment.id, 'ADUANA_VUCE');
    }
  };

  // Handler: Dispatch to Webservices
  const handleDispatchWebservice = (
    shipmentId: string,
    targetSystem: WebserviceLog['systemName']
  ) => {
    const targetShipment = shipments.find(s => s.id === shipmentId);
    if (!targetShipment) return;

    const token = `${targetSystem === 'ADUANA_VUCE' ? 'VUCE' : targetSystem === 'ERP_SAP' ? 'SAP' : 'ORCL'}-TX-${Math.floor(1000000 + Math.random() * 9000000)}-OK`;

    const newLog: WebserviceLog = {
      id: `ws_${Date.now()}`,
      shipmentId,
      systemName: targetSystem,
      direction: 'OUTBOUND',
      endpoint:
        targetSystem === 'ADUANA_VUCE'
          ? 'https://vuce.aduana.gob.ar/ws/v3/cargo/declaration'
          : activeCompany.erpEndpoint,
      timestamp: new Date().toISOString(),
      httpStatus: 200,
      latencyMs: Math.floor(120 + Math.random() * 200),
      transactionToken: token,
      status: 'SUCCESS',
      requestPayload: {
        manifiestoId: targetShipment.customsDeclarationCode || `MANI-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        codigoEmpresa: activeCompany.code,
        medioTransporte: targetShipment.transportMode,
        unidadPatente: targetShipment.carrier.unitIdentifier,
        pesoBrutoKg: targetShipment.totalGrossWeightKg,
        precintoSeguridadISO: targetShipment.seals[0]?.sealNumber || 'N/A'
      },
      responsePayload: {
        status: 'AUTORIZADO',
        canalAduanero: 'VERDE_DIRECTO',
        tokenAutorizacion: token,
        timestampRegistro: new Date().toISOString(),
        firmaDigitalAduana: `SHA256:${Math.random().toString(36).substring(2, 12)}`
      }
    };

    setWebserviceLogs(prev => [newLog, ...prev]);

    // Update shipment customs and ERP status
    setShipments(prev =>
      prev.map(s => {
        if (s.id === shipmentId) {
          return {
            ...s,
            customsStatus: 'TRANSMITTED',
            customsDeclarationCode: s.customsDeclarationCode || `MANI-2026-${Math.floor(10000 + Math.random() * 90000)}`,
            erpSyncStatus: 'SYNCED',
            lastWebserviceLogId: newLog.id
          };
        }
        return s;
      })
    );

    logAuditEvent(
      'DISPATCH_WEBSERVICE',
      'WEBSERVICE',
      newLog.id,
      `Transmisión telemática a ${targetSystem} para la carga ${targetShipment.code}. Token de autorización: ${token}.`
    );
  };

  // Handler: Toggle seal status
  const handleToggleSealStatus = (shipmentId: string, sealId: string) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id === shipmentId) {
          const updatedSeals = s.seals.map(seal => {
            if (seal.id === sealId) {
              const newStatus = seal.status === 'TAMPERED_ALERT' ? 'CHECKED_OK' : 'TAMPERED_ALERT';

              if (newStatus === 'TAMPERED_ALERT') {
                const newAlert: AlertNotification = {
                  id: `alt_${Date.now()}`,
                  shipmentId: s.id,
                  shipmentCode: s.code,
                  companyId: activeCompany.id,
                  type: 'SEAL_TAMPER',
                  severity: 'CRITICAL',
                  title: `Ruptura de Precinto ${seal.sealNumber}`,
                  message: `Alerta ISO 28000: Detección de rotura o alteración en ${seal.locationPoint} de la unidad ${s.carrier.unitIdentifier}.`,
                  timestamp: new Date().toISOString(),
                  resolved: false
                };
                setAlerts(a => [newAlert, ...a]);

                logAuditEvent(
                  'SEAL_TAMPER_ALERT',
                  'SEAL',
                  seal.id,
                  `ALERTA CRÍTICA ISO 28000: Precinto ${seal.sealNumber} marcado como TAMPERED en ${s.code}.`
                );
              } else {
                logAuditEvent(
                  'SEAL_RESTORED',
                  'SEAL',
                  seal.id,
                  `Precinto ${seal.sealNumber} restablecido a estado OK verificado en ${s.code}.`
                );
              }

              return {
                ...seal,
                status: newStatus as any,
                checkTimestamp: new Date().toISOString(),
                checkedBy: currentUser.name
              };
            }
            return seal;
          });

          const hasAlert = updatedSeals.some(seal => seal.status === 'TAMPERED_ALERT');

          return {
            ...s,
            seals: updatedSeals,
            status: hasAlert ? 'CUSTOMS_HOLD' : s.status === 'CUSTOMS_HOLD' ? 'IN_TRANSIT' : s.status
          };
        }
        return s;
      })
    );
  };

  // Handler: Field operator seal update
  const handleUpdateShipmentSeal = (
    shipmentId: string,
    sealId: string,
    status: 'CHECKED_OK' | 'TAMPERED_ALERT'
  ) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id === shipmentId) {
          const updatedSeals = s.seals.map(seal => {
            if (seal.id === sealId) {
              return {
                ...seal,
                status,
                checkTimestamp: new Date().toISOString(),
                checkedBy: `${currentUser.name} (Modo Móvil)`
              };
            }
            return seal;
          });

          if (status === 'TAMPERED_ALERT') {
            const newAlert: AlertNotification = {
              id: `alt_${Date.now()}`,
              shipmentId: s.id,
              shipmentCode: s.code,
              companyId: activeCompany.id,
              type: 'SEAL_TAMPER',
              severity: 'CRITICAL',
              title: `Ruptura Reportada en Muelle: ${sealId}`,
              message: `Personal operativo reportó daño físico en precinto durante inspección de recepción.`,
              timestamp: new Date().toISOString(),
              resolved: false
            };
            setAlerts(a => [newAlert, ...a]);
          }

          logAuditEvent(
            status === 'CHECKED_OK' ? 'FIELD_SEAL_VERIFIED' : 'FIELD_SEAL_TAMPERED',
            'SEAL',
            sealId,
            `Inspección de precinto en muelle por ${currentUser.name}: Estado ${status}.`
          );

          return {
            ...s,
            seals: updatedSeals,
            status: status === 'TAMPERED_ALERT' ? 'CUSTOMS_HOLD' : s.status
          };
        }
        return s;
      })
    );
  };

  // Handler: Confirm Delivery with Signature
  const handleConfirmDelivery = (
    shipmentId: string,
    receiverName: string,
    signatureDataUrl: string
  ) => {
    setShipments(prev =>
      prev.map(s => {
        if (s.id === shipmentId) {
          return {
            ...s,
            status: 'DELIVERED',
            actualArrival: new Date().toISOString(),
            deliverySignature: {
              receivedBy: receiverName,
              signatureDataUrl,
              timestamp: new Date().toISOString(),
              latitude: s.telemetry.destinationLat,
              longitude: s.telemetry.destinationLng
            }
          };
        }
        return s;
      })
    );

    logAuditEvent(
      'DELIVERY_CONFIRMED',
      'SHIPMENT',
      shipmentId,
      `Entrega confirmada y firmada digitalmente por ${receiverName}. Trazabilidad completada bajo ISO 9001.`
    );

    alert('¡Entrega y firma digital registradas con éxito! Expediente finalizado y sincronizado.');
  };

  // Handler: Add Non-Conformity CAPA
  const handleAddNonConformity = (newNC: NonConformity) => {
    setNonConformities(prev => [newNC, ...prev]);
    logAuditEvent(
      'RAISE_NON_CONFORMITY',
      'ISO_AUDIT',
      newNC.id,
      `Apertura de No Conformidad (${newNC.standard} - ${newNC.severity}): ${newNC.description}`
    );
  };

  // Handler: Close Non-Conformity
  const handleCloseNonConformity = (ncId: string) => {
    setNonConformities(prev =>
      prev.map(nc => {
        if (nc.id === ncId) {
          return {
            ...nc,
            status: 'CLOSED',
            closedAt: new Date().toISOString()
          };
        }
        return nc;
      })
    );
    logAuditEvent(
      'CLOSE_NON_CONFORMITY',
      'ISO_AUDIT',
      ncId,
      `Cierre formal y validación de acción correctiva de la No Conformidad ${ncId} por ${currentUser.name}.`
    );
  };

  // Handler: Resolve Alert
  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a => {
        if (a.id === alertId) {
          return {
            ...a,
            resolved: true,
            resolvedBy: currentUser.name,
            resolvedAt: new Date().toISOString()
          };
        }
        return a;
      })
    );
  };

  // Simulation Triggers
  const handleSimulateDeviation = (shipmentId: string) => {
    const s = shipments.find(item => item.id === shipmentId);
    if (!s) return;

    const newAlert: AlertNotification = {
      id: `alt_${Date.now()}`,
      shipmentId: s.id,
      shipmentCode: s.code,
      companyId: activeCompany.id,
      type: 'GEOFENCE_DEVIATION',
      severity: 'WARNING',
      title: `Desvío de Corredor Seguro: ${s.carrier.unitIdentifier}`,
      message: `La telemetría GPS registró salida de geocerca en ruta ${s.origin} → ${s.destination}.`,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    setAlerts(prev => [newAlert, ...prev]);
    logAuditEvent(
      'GEOFENCE_DEVIATION',
      'SHIPMENT',
      shipmentId,
      `Desvío de ruta detectado para ${s.code}. Unidad ${s.carrier.unitIdentifier}.`
    );
  };

  const handleSimulateTamper = (shipmentId: string) => {
    const s = shipments.find(item => item.id === shipmentId);
    if (!s || s.seals.length === 0) return;
    handleToggleSealStatus(shipmentId, s.seals[0].id);
  };

  const handleViewInMap = (shipment: Shipment) => {
    setSelectedShipmentForDetail(null);
    setActiveTab('tracking');
  };

  const handlePrintManifest = (shipment: Shipment) => {
    setSelectedShipmentForPrint(shipment);
    setSelectedShipmentForDetail(null);
    setActiveTab('reports');
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white overflow-x-hidden">
      {/* Top Header */}
      <Header
        companies={mockCompanies}
        activeCompany={activeCompany}
        onSelectCompany={(c) => setActiveCompany(c)}
        users={mockUsers}
        currentUser={currentUser}
        onSelectUser={(u) => setCurrentUser(u)}
        alerts={alerts}
        onOpenAlerts={() => setIsAlertsDrawerOpen(true)}
        isMobileFieldMode={isMobileFieldMode}
        onToggleFieldMode={() => {
          setIsMobileFieldMode(!isMobileFieldMode);
          if (!isMobileFieldMode) {
            setActiveTab('mobile');
          } else {
            setActiveTab('dashboard');
          }
        }}
        onNavigateTab={(tab) => setActiveTab(tab)}
        isLeftCollapsed={isLeftCollapsed}
        onToggleLeftCollapse={() => setIsLeftCollapsed(!isLeftCollapsed)}
        onOpenMobileLeft={() => setIsMobileLeftOpen(true)}
        isRightCollapsed={isRightCollapsed}
        onToggleRightCollapse={() => setIsRightCollapsed(!isRightCollapsed)}
      />

      {/* Main Container with Collapsible Left & Right Panels */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        {/* Left Sidebar (Collapsible in desktop & Mobile Drawer) */}
        {!isMobileFieldMode && (
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
            activeCompany={activeCompany}
            unresolvedAlertsCount={alerts.filter(a => !a.resolved).length}
            isCollapsed={isLeftCollapsed}
            onToggleCollapse={() => setIsLeftCollapsed(!isLeftCollapsed)}
            isMobileOpen={isMobileLeftOpen}
            onCloseMobile={() => setIsMobileLeftOpen(false)}
          />
        )}

        {/* Dynamic Center Content Viewport (Fluid & Responsive) */}
        <main className="flex-1 min-w-0 overflow-y-auto p-3 sm:p-5 lg:p-6 transition-all duration-300">
          <div className="w-full max-w-7xl mx-auto">
            {activeTab === 'dashboard' && (
              <AnalyticsDashboard
                shipments={shipments}
                company={activeCompany}
                alerts={alerts}
                onOpenNewShipment={() => setIsNewShipmentModalOpen(true)}
                onSelectShipment={(s) => setSelectedShipmentForDetail(s)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'shipments' && (
              <ShipmentsList
                shipments={shipments}
                company={activeCompany}
                onOpenNewShipment={() => setIsNewShipmentModalOpen(true)}
                onSelectShipment={(s) => setSelectedShipmentForDetail(s)}
                onTransmitWebservice={(s) => handleDispatchWebservice(s.id, 'ADUANA_VUCE')}
                onViewInMap={handleViewInMap}
                onPrintManifest={handlePrintManifest}
              />
            )}

            {activeTab === 'tracking' && (
              <GPSMapView
                shipments={shipments}
                selectedShipmentId={selectedShipmentForDetail?.id}
                onSelectShipment={(s) => setSelectedShipmentForDetail(s)}
                onSimulateDeviation={handleSimulateDeviation}
                onSimulateTamper={handleSimulateTamper}
              />
            )}

            {activeTab === 'webservices' && (
              <WebservicesHub
                shipments={shipments}
                company={activeCompany}
                logs={webserviceLogs}
                onDispatchWebservice={handleDispatchWebservice}
              />
            )}

            {activeTab === 'iso' && (
              <ISOComplianceView
                company={activeCompany}
                currentUser={currentUser}
                requirements={isoRequirements}
                nonConformities={nonConformities}
                auditLogs={auditLogs}
                onAddNonConformity={handleAddNonConformity}
                onCloseNonConformity={handleCloseNonConformity}
              />
            )}

            {activeTab === 'mobile' && (
              <FieldOperatorView
                shipments={shipments}
                company={activeCompany}
                currentUser={currentUser}
                onUpdateShipmentSeal={handleUpdateShipmentSeal}
                onConfirmDelivery={handleConfirmDelivery}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsView
                shipments={shipments}
                company={activeCompany}
                selectedShipmentForPrint={selectedShipmentForPrint}
              />
            )}
          </div>
        </main>

        {/* Right Collapsible Panel (Telemetría & Pasarelas) */}
        {!isMobileFieldMode && activeTab !== 'reports' && (
          <RightSidebar
            isCollapsed={isRightCollapsed}
            onToggleCollapse={() => setIsRightCollapsed(!isRightCollapsed)}
            shipments={shipments}
            company={activeCompany}
            alerts={alerts}
            webserviceLogs={webserviceLogs}
            onSelectShipment={(s) => setSelectedShipmentForDetail(s)}
            onOpenAlerts={() => setIsAlertsDrawerOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </div>

      {/* New Shipment Modal */}
      <NewShipmentModal
        company={activeCompany}
        isOpen={isNewShipmentModalOpen}
        onClose={() => setIsNewShipmentModalOpen(false)}
        onCreateShipment={handleCreateShipment}
      />

      {/* Shipment Inspector / Detail Modal */}
      <ShipmentDetailModal
        shipment={selectedShipmentForDetail}
        company={activeCompany}
        isOpen={!!selectedShipmentForDetail}
        onClose={() => setSelectedShipmentForDetail(null)}
        onTransmitWebservice={(s) => handleDispatchWebservice(s.id, 'ADUANA_VUCE')}
        onViewInMap={handleViewInMap}
        onPrintManifest={handlePrintManifest}
        onToggleSealStatus={handleToggleSealStatus}
      />

      {/* Alerts Drawer */}
      <AlertsDrawer
        isOpen={isAlertsDrawerOpen}
        onClose={() => setIsAlertsDrawerOpen(false)}
        alerts={alerts}
        onResolveAlert={handleResolveAlert}
        onNavigateToShipment={(shipmentId) => {
          const s = shipments.find(item => item.id === shipmentId);
          if (s) {
            setSelectedShipmentForDetail(s);
            setIsAlertsDrawerOpen(false);
          }
        }}
        onNavigateToISO={() => {
          setActiveTab('iso');
          setIsAlertsDrawerOpen(false);
        }}
      />
    </div>
  );
}
