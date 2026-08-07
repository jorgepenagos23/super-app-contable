'use client';

import React from 'react';
import { ArrowRight, ShoppingCart, TrendingUp, ShieldAlert } from 'lucide-react';

export type ModuleId = 'hub' | 'conciliacion' | 'ingresos' | 'auditoria_sat';

interface AccountantHubProps {
  onSelectModule: (moduleId: ModuleId) => void;
  erpCount?: number;
  erpConnected?: boolean;
  suppliersCount?: number;
}

export const AccountantHub: React.FC<AccountantHubProps> = ({
  onSelectModule,
}) => {
  return (
    <div className="py-8 px-4 max-w-6xl mx-auto space-y-8">
      
      {/* Header Institucional de Grupo MV */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          <img
            src="/logos/grupomv.png"
            alt="Grupo MV"
            className="h-4 w-auto object-contain"
          />
          <span className="text-xs font-medium text-slate-700 uppercase tracking-widest">
            Grupo MV • Portal Contable 2026
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-normal text-slate-900 tracking-tight">
          Módulos de Auditoría & Conciliación Fiscal
        </h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto font-normal">
          Seleccione el módulo contable para iniciar el cruce automatizado.
        </p>
      </div>

      {/* Grid Responsivo de 3 Módulos Contables (1 col en móvil, 3 cols en tablet/desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* MÓDULO 1: Cruce de Compras (CFDI vs ERP) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:border-blue-500 transition-all flex flex-col justify-between gap-6 group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-900" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wider text-blue-900">
                Compras & Almacén
              </span>
              <h3 className="text-base font-normal text-slate-900 leading-snug">
                Auditoría y Cruce Fiscal de Compras (CFDI vs ERP)
              </h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                Cruce automatizado de auxiliares de compras del SAT contra las recepciones de almacén del ERP.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectModule('conciliacion')}
            className="w-full py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-medium transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-[0.98] cursor-pointer"
          >
            <span>Acceder al Módulo</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* MÓDULO 2: Cruce de Ingresos & Facturación Ventas */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:border-blue-500 transition-all flex flex-col justify-between gap-6 group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-900 border border-teal-200 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-teal-900" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wider text-teal-900">
                Ingresos & Ventas
              </span>
              <h3 className="text-base font-normal text-slate-900 leading-snug">
                Cruce Fiscal de Ingresos & Facturación Ventas
              </h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                Conciliación de depósitos bancarios, cobros registrados y facturas de ingresos emitidas ante el SAT.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectModule('ingresos')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-[0.98] cursor-pointer"
          >
            <span>Acceder al Módulo</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* MÓDULO 3: CFDI Cancelados & Validador SAT 69-B */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-2xs hover:border-blue-500 transition-all flex flex-col justify-between gap-6 group">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-900 border border-rose-200 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6 text-rose-700" />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wider text-rose-700">
                Cumplimiento & Listas Negras
              </span>
              <h3 className="text-base font-normal text-slate-900 leading-snug">
                CFDI Cancelados & Validador SAT 69-B
              </h3>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">
                Monitoreo automático de facturas canceladas en tiempo real y detección de proveedores EFOS.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectModule('auditoria_sat')}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-[0.98] cursor-pointer"
          >
            <span>Acceder al Módulo</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>
        </div>

      </div>

    </div>
  );
};
