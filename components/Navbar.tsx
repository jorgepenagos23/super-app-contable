'use client';

import React from 'react';
import { Building2, RefreshCw } from 'lucide-react';
import { UserMenu } from './UserMenu';
import { useAuth } from '@/context/AuthContext';

interface NavbarProps {
  onRefreshERP?: () => void;
  isLoadingERP?: boolean;
  erpCount?: number;
  erpConnected?: boolean;
  onOpenUserManagement: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRefreshERP,
  isLoadingERP = false,
  erpCount = 0,
  erpConnected = true,
  onOpenUserManagement,
}) => {
  const { hasPermission } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Branding */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl shadow-md text-white font-bold">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Grupo MV</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-semibold">Declaración Anual</span>
            </div>
            <h1 className="text-lg font-black tracking-tight text-slate-900">
              Conciliación Fiscal PARAL vs SAT
            </h1>
          </div>
        </div>

        {/* Right Section: API Status, Sync ERP & User Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
            <div className={`w-2.5 h-2.5 rounded-full ${erpConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-slate-600 font-medium">ERP Grupo MV:</span>
            <span className="font-bold text-slate-900">
              {isLoadingERP ? 'Cargando...' : `${erpCount} compras`}
            </span>
          </div>

          {onRefreshERP && hasPermission('sync_erp') && (
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
