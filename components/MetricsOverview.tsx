'use client';

import React from 'react';
import { MetricasConciliacion } from '@/types/reconciliation';
import { CheckCircle, FileWarning, ShieldAlert } from 'lucide-react';

interface MetricsOverviewProps {
  metricas: MetricasConciliacion | null;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metricas }) => {
  if (!metricas) return null;

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 my-6">

      {/* Card 1: Conciliadas */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-2xs relative overflow-hidden transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-700 uppercase tracking-wider">Conciliadas</span>
          <div className="p-2 rounded-2xl bg-blue-50 text-blue-900 border border-blue-200">
            <CheckCircle className="w-4 h-4 text-blue-900" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-medium text-slate-900 tracking-tight">
            {metricas.conciliadasCount} <span className="text-xs font-normal text-slate-500">facturas</span>
          </div>
          {/* MONTO EN NEGRITA DESTACADA */}
          <div className="text-xl font-black text-blue-900 mt-1">
            {formatMoney(metricas.montoConciliadas)}
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3 font-normal">
          <span>Coincidencia por UUID / Impuesto</span>
          <span className="text-blue-900 font-medium">100% OK</span>
        </div>
      </div>

      {/* Card 2: Faltantes en ERP (Riesgo Deducción) */}
      <div className="bg-white border border-rose-200 rounded-3xl p-6 shadow-xs relative overflow-hidden transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-rose-700 uppercase tracking-wider">Faltantes en ERP</span>
          <div className="p-2 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-medium text-slate-900 tracking-tight">
            {metricas.faltantesERPCount} <span className="text-xs font-normal text-slate-500">facturas</span>
          </div>
          {/* MONTO EN NEGRITA DESTACADA */}
          <div className="text-xl font-black text-rose-700 mt-1">
            {formatMoney(metricas.montoFaltantesERP)}
          </div>
        </div>
        <div className="mt-4 text-xs text-rose-800 flex items-center justify-between border-t border-rose-100 pt-3 font-medium">
          <span>Riesgo de Deducción Fiscal</span>
          <span>En SAT, No ERP</span>
        </div>
      </div>

      {/* Card 3: Sobrantes en ERP (Discrepancia Interna) */}
      <div className="bg-white border border-amber-200 rounded-3xl p-6 shadow-xs relative overflow-hidden transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-amber-700 uppercase tracking-wider">Sobrantes en ERP</span>
          <div className="p-2 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200">
            <FileWarning className="w-4 h-4 text-amber-600" />
          </div>
        </div>
        <div className="mt-4">
          <div className="text-2xl font-medium text-slate-900 tracking-tight">
            {metricas.sobrantesERPCount} <span className="text-xs font-normal text-slate-500">registros</span>
          </div>
          {/* MONTO EN NEGRITA DESTACADA */}
          <div className="text-xl font-black text-amber-700 mt-1">
            {formatMoney(metricas.montoSobrantesERP)}
          </div>
        </div>
        <div className="mt-4 text-xs text-slate-500 flex items-center justify-between border-t border-amber-100 pt-3 font-normal">
          <span>Discrepancia interna</span>
          <span className="text-amber-700 font-medium">En ERP, No SAT</span>
        </div>
      </div>

    </div>
  );
};
