import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  MapPin,
  Network,
  ShieldCheck,
  Smartphone,
  FileSpreadsheet,
  Building2,
  Award,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X
} from 'lucide-react';
import { Company } from '../../types';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  activeCompany: Company;
  unresolvedAlertsCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  activeCompany,
  unresolvedAlertsCount,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Analítico',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'shipments',
      label: 'Cargas Multimodales',
      icon: Boxes,
      badge: '4 Medios'
    },
    {
      id: 'tracking',
      label: 'Mapa GPS & Telemetría',
      icon: MapPin,
      badge: 'En Vivo'
    },
    {
      id: 'webservices',
      label: 'WebServices & ERP Hub',
      icon: Network,
      badge: 'REST/JSON'
    },
    {
      id: 'iso',
      label: 'Normas ISO 9001 / 28000',
      icon: ShieldCheck,
      badge: 'Auditoría'
    },
    {
      id: 'mobile',
      label: 'Consola Operativa Móvil',
      icon: Smartphone,
      badge: 'Campo'
    },
    {
      id: 'reports',
      label: 'Manifiestos & Exportación',
      icon: FileSpreadsheet,
      badge: 'PDF/XLS'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        className={`fixed md:sticky top-16 left-0 z-40 md:z-30 h-[calc(100vh-4rem)] bg-slate-900 border-r border-slate-800 flex flex-col justify-between select-none transition-all duration-300 ${
          isMobileOpen
            ? 'translate-x-0 w-64 shadow-2xl'
            : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-16' : 'md:w-64'}`}
      >
        <div className={`p-3 space-y-4 overflow-y-auto ${isCollapsed ? 'md:px-2' : 'md:p-4'}`}>
          {/* Header Controls inside Sidebar */}
          <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
            {!isCollapsed && (
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Navegación
              </span>
            )}
            {/* Desktop Collapse Toggle */}
            <button
              onClick={onToggleCollapse}
              className={`p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors hidden md:flex ${
                isCollapsed ? 'mx-auto' : ''
              }`}
              title={isCollapsed ? 'Expandir panel izquierdo' : 'Colapsar panel izquierdo'}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-blue-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors md:hidden ml-auto"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Active Company Stamp */}
          {!isCollapsed ? (
            <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/70">
              <div className="flex items-center gap-2 mb-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider truncate">
                  Organización Activa
                </span>
              </div>
              <div className="font-semibold text-sm text-white truncate">
                {activeCompany.name}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5 truncate">
                {activeCompany.customsAgentCode}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-700/60 flex flex-wrap gap-1">
                {activeCompany.certifications.slice(0, 2).map((cert) => (
                  <span
                    key={cert}
                    className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900"
                  >
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div
              className="w-10 h-10 mx-auto rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold font-mono text-blue-400"
              title={`${activeCompany.name} (${activeCompany.customsAgentCode})`}
            >
              {activeCompany.code}
            </div>
          )}

          {/* Navigation Items */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-lg text-xs font-medium transition-all group ${
                    isCollapsed
                      ? 'justify-center p-2.5'
                      : 'justify-between px-3 py-2.5'
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                      }`}
                    />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-blue-700 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className={`p-3 border-t border-slate-800 bg-slate-900/50 ${isCollapsed ? 'text-center' : ''}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="leading-tight truncate">
                <div className="text-slate-200 font-medium truncate">Cumplimiento Asegurado</div>
                <div className="text-[10px] text-slate-400 truncate">ISO 9001 / 28000</div>
              </div>
            </div>
          ) : (
            <div title="ISO 9001 / ISO 28000">
              <Award className="w-4 h-4 text-emerald-400 mx-auto" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
