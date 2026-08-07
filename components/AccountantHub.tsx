'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export type ModuleId = 'hub' | 'conciliacion';

interface AccountantHubProps {
  onSelectModule: (moduleId: ModuleId) => void;
  erpCount: number;
  erpConnected: boolean;
  suppliersCount: number;
}

export const AccountantHub: React.FC<AccountantHubProps> = ({
  onSelectModule,
}) => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      
      {/* Tarjeta Ultra Minimalista Tipo Apple */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm max-w-md w-full text-center flex flex-col items-center gap-6">
        
        {/* Logo Oficial de Grupo MV */}
        <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-2 shadow-2xs">
          <img
            src="/logos/grupomv.png"
            alt="Grupo MV Logo"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        {/* Título & Breve Descripción */}
        <div className="space-y-2">
          <span className="text-[11px] font-medium uppercase tracking-widest text-slate-500 block">
            Grupo MV • Módulo Contable
          </span>
          <h2 className="text-xl font-normal text-slate-900 tracking-tight">
            Auditoría y Cruce Fiscal (CFDI vs ERP)
          </h2>
          <p className="text-xs text-slate-500 font-normal leading-relaxed max-w-xs mx-auto">
            Cruce automatizado de auxiliares de compras del SAT contra las recepciones de almacén del ERP.
          </p>
        </div>

        {/* UN SOLO BOTÓN PRINCIPAL DE ACCESO */}
        <button
          onClick={() => onSelectModule('conciliacion')}
          className="w-full py-3 px-6 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-medium transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-[0.98] cursor-pointer"
        >
          <span>Acceder al Módulo</span>
          <ArrowRight className="w-4 h-4 text-white" />
        </button>

      </div>

    </div>
  );
};
