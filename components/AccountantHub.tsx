'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  ArrowRight,
  CheckCircle2,
  Info,
  Database,
  Play
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ModuleDetailsModal, ModuleDetailItem } from './ModuleDetailsModal';

export type ModuleId = 'hub' | 'conciliacion';

interface AccountantHubProps {
  onSelectModule: (moduleId: ModuleId) => void;
  erpCount: number;
  erpConnected: boolean;
  suppliersCount: number;
}

export const AccountantHub: React.FC<AccountantHubProps> = ({
  onSelectModule,
  erpCount,
  erpConnected,
  suppliersCount
}) => {
  const { currentUser } = useAuth();
  const [selectedDetailModal, setSelectedDetailModal] = useState<ModuleDetailItem | null>(null);

  const conciliacionModule: ModuleDetailItem & {
    icon: any;
    stats: string;
    features: string[];
  } = {
    id: 'conciliacion',
    title: 'Conciliación Compras PARAL vs. SAT',
    subtitle: 'Auditoría y Cruce Automatizado de Facturación ERP',
    description: 'Herramienta institucional para el cotejo masivo de auxiliares de compras (Excel/XML) contra los registros ERP de Grupo MV y la base de datos fiscal.',
    badge: '🟢 Operativo / Producción',
    normativa: 'Art. 28 CFF (Contabilidad Fiscal) & Anexo 20 del SAT',
    icon: FileSpreadsheet,
    stats: `${erpCount} compras ERP • ${suppliersCount} proveedores`,
    entradas: [
      'Archivos auxiliares de compras (.xlsx / .csv)',
      'Conexión API REST ERP Grupo MV (Lista_Compras_773)',
      'Rango de fechas y filtros por RFC / Proveedor'
    ],
    salidas: [
      'Matriz de facturas conciliadas vs. faltantes',
      'Reporte de discrepancias de importes e IVA',
      'Exportable ejecutivo a Excel con formato institucional'
    ],
    funcionesClave: [
      'Cruce automático por Folio Fiscal / UUID',
      'Tolerancia configurable de centavos ($0.00 - $100.00)',
      'Emparejamiento masivo por RFC y Monto',
      'Auditoría visual con resumen por proveedor'
    ],
    features: [
      'Cruce masivo automático por UUID, RFC y Monto',
      'Sincronización directa en tiempo real con API Grupo MV',
      'Identificación de facturas faltantes en ERP o canceladas en el SAT',
      'Exportación instantánea a hojas de trabajo en Excel'
    ]
  };

  const Icon = conciliacionModule.icon;

  return (
    <div className="flex flex-col gap-6 pb-10">
      
      {/* Header Banner Institucional */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-7 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold uppercase tracking-wider">
                Grupo MV • Portal Contable
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Ejercicio Fiscal 2026
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Centro de Control • Conciliación Fiscal & ERP
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed">
              Sistema institucional de auditoría y cruce de facturación para la Conciliación de Compras PARAL vs. SAT.
            </p>
          </div>

          {/* Estado de Conexión ERP */}
          <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700/80 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${erpConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-slate-300">Conexión ERP:</span>
              <span className="font-bold text-emerald-400">{erpConnected ? 'En Línea' : 'Standby'}</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Compras: <strong className="text-white">{erpCount}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Módulo Principal Único: Conciliación Compras PARAL vs. SAT */}
      <div className="bg-white rounded-2xl border border-slate-300 p-6 shadow-sm flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <div>
          {/* Header Card */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="p-3 rounded-xl bg-slate-900 text-white shadow-xs">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
              {conciliacionModule.badge}
            </span>
          </div>

          {/* Título & Subtítulo */}
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">
            {conciliacionModule.title}
          </h3>
          <p className="text-xs font-bold text-slate-500 mb-3">
            {conciliacionModule.subtitle}
          </p>
          <p className="text-xs text-slate-600 leading-relaxed mb-5">
            {conciliacionModule.description}
          </p>

          {/* Lista de Capacidades */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider block mb-3">
              Capacidades Principales del Módulo:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {conciliacionModule.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer de Tarjeta con 2 Botones: Ver detalles & Iniciar Conciliación */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 font-bold">
            {conciliacionModule.stats}
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Botón Ver detalles */}
            <button
              onClick={() => setSelectedDetailModal(conciliacionModule)}
              className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-300"
              title="Ver ficha técnica y marco regulatorio"
            >
              <Info className="w-4 h-4 text-slate-600" />
              <span>Ver detalles</span>
            </button>

            {/* Botón Abrir Módulo */}
            <button
              onClick={() => onSelectModule('conciliacion')}
              className="flex-1 sm:flex-none py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Iniciar Conciliación</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Dialog Component */}
      <ModuleDetailsModal
        isOpen={Boolean(selectedDetailModal)}
        onClose={() => setSelectedDetailModal(null)}
        moduleDetail={selectedDetailModal}
        onConfirmOpenModule={(id) => onSelectModule(id)}
      />

    </div>
  );
};
