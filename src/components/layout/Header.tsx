import React from 'react';
import { Company, User, AlertNotification } from '../../types';
import {
  ShieldCheck,
  Building2,
  UserCheck,
  Bell,
  Smartphone,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';

interface HeaderProps {
  companies: Company[];
  activeCompany: Company;
  onSelectCompany: (company: Company) => void;
  users: User[];
  currentUser: User;
  onSelectUser: (user: User) => void;
  alerts: AlertNotification[];
  onOpenAlerts: () => void;
  isMobileFieldMode: boolean;
  onToggleFieldMode: () => void;
  onNavigateTab: (tab: string) => void;
  // Collapsible controls
  isLeftCollapsed: boolean;
  onToggleLeftCollapse: () => void;
  onOpenMobileLeft: () => void;
  isRightCollapsed: boolean;
  onToggleRightCollapse: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  companies,
  activeCompany,
  onSelectCompany,
  users,
  currentUser,
  onSelectUser,
  alerts,
  onOpenAlerts,
  isMobileFieldMode,
  onToggleFieldMode,
  onNavigateTab,
  isLeftCollapsed,
  onToggleLeftCollapse,
  onOpenMobileLeft,
  isRightCollapsed,
  onToggleRightCollapse
}) => {
  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const criticalCount = unresolvedAlerts.filter(a => a.severity === 'CRITICAL').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 select-none">
      <div className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-4 lg:px-6 h-16 max-w-full">
        {/* Brand & Left Collapse Toggles */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Menu Hamburger */}
          <button
            onClick={onOpenMobileLeft}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white md:hidden transition-colors"
            title="Abrir menú de navegación"
            aria-label="Abrir menú de navegación"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Left Sidebar Collapse Button */}
          <button
            onClick={onToggleLeftCollapse}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white hidden md:flex transition-colors border border-slate-700/60"
            title={isLeftCollapsed ? 'Expandir panel izquierdo' : 'Colapsar panel izquierdo'}
            aria-label="Alternar panel izquierdo"
          >
            {isLeftCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-blue-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {/* Brand Mark */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shrink-0">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-bold text-sm sm:text-base tracking-tight text-white whitespace-nowrap">
                  LogiTrace ISO
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-800/50 hidden xs:inline">
                  Multiempresa
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-400">
                <span>ISO 9001 / 28000</span>
                <span aria-hidden="true">·</span>
                <span>WebServices REST</span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Zone: Multiempresa & Role Selector (Responsive) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Company Selector */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 cursor-pointer transition-colors">
              <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <select
                aria-label="Empresa Activa"
                value={activeCompany.id}
                onChange={(e) => {
                  const comp = companies.find(c => c.id === e.target.value);
                  if (comp) onSelectCompany(comp);
                }}
                className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer pr-2 max-w-[170px] truncate"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* User Role Selector */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 cursor-pointer transition-colors">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <select
                aria-label="Rol / Auditoría"
                value={currentUser.id}
                onChange={(e) => {
                  const usr = users.find(u => u.id === e.target.value);
                  if (usr) onSelectUser(usr);
                }}
                className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none cursor-pointer pr-2 max-w-[170px] truncate"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id} className="bg-slate-900 text-slate-100">
                    {u.name} ({u.role.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Zone: Controls, Alerts, Field Mode & Right Panel Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Quick Field Mode Toggle Button */}
          <button
            onClick={onToggleFieldMode}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isMobileFieldMode
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="Cambiar a Consola Móvil para Operarios de Muelle / Choferes"
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden md:inline">
              {isMobileFieldMode ? 'Escritorio' : 'Modo Móvil'}
            </span>
          </button>

          {/* Alerts Bell Button */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-colors"
            title="Centro de Alertas Logísticas"
            aria-label="Centro de Alertas"
          >
            <Bell className="w-4 h-4" />
            {unresolvedAlerts.length > 0 && (
              <span className={`absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono ${
                criticalCount > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500 text-slate-950'
              }`}>
                {unresolvedAlerts.length}
              </span>
            )}
          </button>

          {/* Right Panel Collapse / Expand Button */}
          <button
            onClick={onToggleRightCollapse}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white hidden xl:flex transition-colors border border-slate-700/60"
            title={isRightCollapsed ? 'Expandir panel derecho' : 'Colapsar panel derecho'}
            aria-label="Alternar panel derecho"
          >
            {isRightCollapsed ? (
              <PanelRightOpen className="w-4 h-4 text-blue-400" />
            ) : (
              <PanelRightClose className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
