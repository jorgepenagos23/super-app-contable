'use client';

import React from 'react';
import { MetricasConciliacion } from '@/types/reconciliation';
import { CheckCircle, FileWarning, CreditCard, ShieldAlert } from 'lucide-react';

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
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-6">

      {/* Card 1: Conciliadas */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-emerald-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Conciliadas</span>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900">
            {metricas.conciliadasCount} <span className="text-xs font-semibold text-slate-500">facturas</span>
          </div>
          <div className="text-sm font-extrabold text-emerald-700 mt-0.5">
            {formatMoney(metricas.montoConciliadas)}
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2 font-medium">
          <span>Coincidencia exacta por UUID</span>
          <span className="text-emerald-700 font-bold">100% OK</span>
        </div>
      </div>

      {/* Card 2: Faltantes en ERP (Riesgo Deducción) */}
      <div className="bg-white border border-rose-200 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-rose-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-rose-700 uppercase tracking-wider">Faltantes en ERP</span>
          <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900">
            {metricas.faltantesERPCount} <span className="text-xs font-semibold text-slate-500">facturas</span>
          </div>
          <div className="text-sm font-extrabold text-rose-700 mt-0.5">
            {formatMoney(metricas.montoFaltantesERP)}
          </div>
        </div>
        <div className="mt-3 text-xs text-rose-800 flex items-center justify-between border-t border-rose-100 pt-2 font-bold">
          <span>Riesgo de Deducción Fiscal</span>
          <span>En SAT, No ERP</span>
        </div>
      </div>

      {/* Card 3: Sobrantes en ERP (Discrepancia) */}
      <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-amber-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider">Sobrantes en ERP</span>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            <FileWarning className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl font-black text-slate-900">
            {metricas.sobrantesERPCount} <span className="text-xs font-semibold text-slate-500">registros</span>
          </div>
          <div className="text-sm font-extrabold text-amber-700 mt-0.5">
            {formatMoney(metricas.montoSobrantesERP)}
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-amber-100 pt-2 font-medium">
          <span>Discrepancia interna</span>
          <span className="text-amber-700 font-bold">En ERP, No SAT</span>
        </div>
      </div>

      {/* Card 4: Alertas SAT & Pagos */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs relative overflow-hidden group hover:border-sky-400 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-sky-800 uppercase tracking-wider">Alertas SAT & Pagos</span>
          <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 border border-sky-200">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-slate-500">Canceladas en SAT</div>
            <div className="text-lg font-black text-rose-700">
              {metricas.canceladasSATCount} <span className="text-xs font-semibold text-slate-500">({formatMoney(metricas.montoCanceladasSAT)})</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-medium text-slate-500">Métodos Pago</div>
            <div className="text-xs font-bold text-slate-800 mt-1">
              <span className="text-sky-800 font-extrabold">PUE: {metricas.pueCount}</span> | <span className="text-amber-800 font-extrabold">PPD: {metricas.ppdCount}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100 pt-2 font-medium">
          <span>Facturas SAT procesadas</span>
          <span className="text-slate-900 font-extrabold">{metricas.totalSAT}</span>
        </div>
      </div>

    </div>
  );
};
