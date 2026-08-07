'use client';

import React from 'react';
import { UserMenu } from './UserMenu';
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
  onOpenUserManagement,
  activeModule = 'hub',
  onNavigateModule,
}) => {
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
        
        {/* Logo de la Empresa, Nombre y Módulo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateModule && onNavigateModule('hub')}
            className="flex items-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
            title="Ir al Menú Principal"
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
            <h1 className="text-sm sm:text-base font-normal tracking-tight text-slate-800 truncate max-w-[240px] sm:max-w-md">
              {getModuleTitle()}
            </h1>
          </div>
        </div>

        {/* Únicamente el Menú de Usuario a la Derecha */}
        <div className="flex items-center font-normal">
          <UserMenu onOpenUserManagement={onOpenUserManagement} />
        </div>

      </div>
    </header>
  );
};
