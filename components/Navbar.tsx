'use client';

import React from 'react';
import { Building2, RefreshCw, LayoutGrid, ArrowLeft } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/context/AuthContext';
import { ModuleId } from './AccountantHub';

interface NavbarProps {
  onRefreshERP?: () => void;
  isLoadingERP?: boolean;
  erpCount?: number;
  erpConnected?: boolean;
  onOpenUserManagement: () => void;
  activeModule?: ModuleId;
  onNavigateModule?: (module: ModuleId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRefreshERP,
  isLoadingERP = false,
  erpCount = 0,
  erpConnected = true,
  onOpenUserManagement,
  activeModule = 'hub',
  onNavigateModule,
}) => {
  const { hasPermission } = useAuth();

  const getModuleTitle = () => {
    switch (activeModule) {
      case 'conciliacion':
        return 'Conciliación Compras PARAL vs SAT';
      case 'auditoria_sat':
        return 'Auditoría CFDI & Validador SAT 69-B';
      case 'impuestos':
        return 'Calculadora de Impuestos & Retenciones';
      case 'proveedores':
        return 'Directorio de Proveedores & CXP';
      case 'utilidades':
        return 'Utilidades Financieras & INPC';
      default:
        return 'Centro de Control del Contador';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateModule && onNavigateModule('hub')}
            className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl shadow-md text-white font-bold hover:scale-105 transition-transform cursor-pointer"
            title="Ir al Menú Principal del Contador"
          >
            <Building2 className="w-6 h-6 text-white" />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Grupo MV</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
                Super App Contable
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 truncate max-w-[280px] sm:max-w-md">
              {getModuleTitle()}
            </h1>
          </div>
        </div>

        {/* Right Section: Navigation Hub, API Status, Sync ERP & User Menu */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Botón Menú Principal / Módulos */}
          {onNavigateModule && (
            <button
              onClick={() => onNavigateModule('hub')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                activeModule === 'hub'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
              }`}
              title="Volver al Centro de Control de Módulos"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Módulos Contables</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
            <div className={`w-2.5 h-2.5 rounded-full ${erpConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-slate-600 font-medium">ERP Grupo MV:</span>
            <span className="font-bold text-slate-900">
              {isLoadingERP ? 'Cargando...' : `${erpCount} compras`}
            </span>
          </div>

          {onRefreshERP && hasPermission('sync_erp') && activeModule === 'conciliacion' && (
            <button
              onClick={onRefreshERP}
              disabled={isLoadingERP}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 active:scale-95 cursor-pointer"
              title="Recargar datos del ERP vía API"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingERP ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sincronizar ERP</span>
            </button>
          )}

          {/* User Profile & Role Switcher */}
          <UserMenu onOpenUserManagement={onOpenUserManagement} />
        </div>

      </div>
    </header>
  );
};
