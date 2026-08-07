'use client';

import React from 'react';
import { RefreshCw, LayoutGrid } from 'lucide-react';
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
        return 'Auditoría y Cruce Fiscal de Compras (CFDI vs ERP)';
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo de la Empresa & Branding */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateModule && onNavigateModule('hub')}
            className="flex items-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
            title="Ir al Menú Principal del Contador"
          >
            {/* Logo Oficial de la Empresa Grupo MV */}
            <img
              src="/logos/grupomv.png"
              alt="Grupo MV Logo"
              className="h-10 w-auto object-contain rounded-lg"
            />
          </button>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-widest text-slate-800">Grupo MV</span>
            </div>
            <h1 className="text-sm sm:text-base font-normal tracking-tight text-slate-800 truncate max-w-[200px] sm:max-w-md">
              {getModuleTitle()}
            </h1>
          </div>
        </div>

        {/* Right Section: Navigation Hub, Status ERP & User Menu */}
        <div className="flex items-center gap-2 sm:gap-3 font-normal">
          
          {/* Botón Menú Principal / Módulos */}
          {onNavigateModule && (
            <button
              onClick={() => onNavigateModule('hub')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                activeModule === 'hub'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-blue-50 border-blue-200 text-blue-950 hover:bg-blue-100'
              }`}
              title="Volver al Centro de Control de Módulos"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Módulos Contables</span>
            </button>
          )}

          <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-normal">
            <div className={`w-2.5 h-2.5 rounded-full ${erpConnected ? 'bg-blue-600 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-slate-600 font-normal">ERP Grupo MV:</span>
            <span className="font-medium text-slate-900">
              {isLoadingERP ? 'Cargando...' : `${erpCount} compras`}
            </span>
          </div>

          {onRefreshERP && hasPermission('sync_erp') && activeModule === 'conciliacion' && (
            <button
              onClick={onRefreshERP}
              disabled={isLoadingERP}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-medium transition-all shadow-2xs disabled:opacity-50 active:scale-95 cursor-pointer"
              title="Actualizar información de compras del ERP"
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
