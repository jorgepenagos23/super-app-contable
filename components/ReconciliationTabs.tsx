'use client';

import React, { useState } from 'react';
import { ResultadoConciliacion } from '@/types/reconciliation';
import { ReconciliationTable } from './ReconciliationTable';
import { StatusBadge } from './StatusBadge';
import { PaymentMethodBadge } from './PaymentMethodBadge';
import { AlertCircle, AlertTriangle, CheckCircle, Download, FileSpreadsheet, Sparkles } from 'lucide-react';
import * as XLSX from 'xlsx';

interface ReconciliationTabsProps {
  resultado: ResultadoConciliacion | null;
}

export const ReconciliationTabs: React.FC<ReconciliationTabsProps> = ({ resultado }) => {
  const [activeTab, setActiveTab] = useState<'faltantes' | 'sobrantes' | 'conciliadas'>('faltantes');

  if (!resultado) return null;

  const { faltantesERP, sobrantesERP, conciliadas } = resultado;

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    const wsFaltantes = XLSX.utils.json_to_sheet(
      faltantesERP.map((item) => ({
        'RFC Emisor': item.rfcEmisor,
        'Nombre Emisor': item.nombreEmisor,
        'Folio Fiscal (UUID)': item.uuid,
        'Estatus SAT': item.estatusSAT,
        'Método Pago': item.metodoPagoSAT,
        'Fecha': item.fecha,
        'Total SAT': item.total,
      }))
    );
    XLSX.utils.book_append_sheet(wb, wsFaltantes, 'Faltantes en ERP (Riesgo)');

    const wsSobrantes = XLSX.utils.json_to_sheet(
      sobrantesERP.map((item) => ({
        'Proveedor': item.proveedor,
        'RFC': item.rfc || 'N/A',
        'Folio Fiscal (UUID)': item.uuid,
        'Fecha': item.fecha,
        'Documento': item.documento || '',
        'Total ERP': item.total,
      }))
    );
    XLSX.utils.book_append_sheet(wb, wsSobrantes, 'Sobrantes en ERP');

    const wsConciliadas = XLSX.utils.json_to_sheet(
      conciliadas.map((item: any) => ({
        'RFC Emisor': item.rfcEmisor,
        'Nombre Emisor': item.nombreEmisor,
        'Folio Fiscal (UUID)': item.uuid,
        'Tipo de Amarre': item.tipoCoincidencia || 'Amarre por XML / UUID',
        'Estatus SAT': item.estatusSAT,
        'Método Pago': item.metodoPagoSAT,
        'Fecha SAT': item.fechaSAT,
        'Total SAT': item.totalSAT,
        'Total ERP': item.totalERP,
        'Diferencia': item.diferencia,
      }))
    );
    XLSX.utils.book_append_sheet(wb, wsConciliadas, 'Conciliadas');

    XLSX.writeFile(wb, `Conciliacion_Fiscal_PARAL_vs_SAT_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const columnsFaltantes = [
    { key: 'rfcEmisor', header: 'RFC Emisor', sortable: true },
    { key: 'nombreEmisor', header: 'Nombre / Razón Social', sortable: true },
    { key: 'uuid', header: 'UUID (Folio Fiscal)', sortable: true },
    {
      key: 'estatusSAT',
      header: 'Estatus (SAT)',
      render: (item: any) => <StatusBadge status={item.estatusSAT} />,
      align: 'center' as const,
    },
    {
      key: 'metodoPagoSAT',
      header: 'Método Pago',
      render: (item: any) => <PaymentMethodBadge method={item.metodoPagoSAT} />,
      align: 'center' as const,
    },
    { key: 'total', header: 'Total (SAT)', align: 'right' as const, sortable: true },
  ];

  const columnsSobrantes = [
    { key: 'proveedor', header: 'Proveedor (ERP)', sortable: true },
    { key: 'uuid', header: 'UUID / Ref (ERP)', sortable: true },
    { key: 'fecha', header: 'Fecha', sortable: true },
    { key: 'total', header: 'Total (ERP)', align: 'right' as const, sortable: true },
  ];

  const columnsConciliadas = [
    { key: 'rfcEmisor', header: 'RFC Emisor', sortable: true },
    { key: 'nombreEmisor', header: 'Nombre / Razón Social', sortable: true },
    { key: 'uuid', header: 'UUID (Folio Fiscal)', sortable: true },
    {
      key: 'tipoCoincidencia',
      header: 'Criterio de Amarre',
      render: (item: any) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <Sparkles className="w-3 h-3 text-emerald-600" />
          {item.tipoCoincidencia || 'Amarre por XML / UUID'}
        </span>
      ),
    },
    {
      key: 'estatusSAT',
      header: 'Estatus (SAT)',
      render: (item: any) => <StatusBadge status={item.estatusSAT} />,
      align: 'center' as const,
    },
    {
      key: 'metodoPagoSAT',
      header: 'Método Pago',
      render: (item: any) => <PaymentMethodBadge method={item.metodoPagoSAT} />,
      align: 'center' as const,
    },
    { key: 'totalSAT', header: 'Total SAT', align: 'right' as const, sortable: true },
    { key: 'totalERP', header: 'Total ERP', align: 'right' as const, sortable: true },
    {
      key: 'diferencia',
      header: 'Diferencia',
      align: 'right' as const,
      render: (item: any) => (
        <span className={item.diferencia > 0 ? 'text-amber-700 font-extrabold' : 'text-emerald-700 font-bold'}>
          {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.diferencia)}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm my-6">
      
      {/* Header & Export Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            Resultados del Cruce Fiscal
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Revisión amarrada por UUID, Folio y Razón Social. Utilice las pestañas para auditar faltantes, sobrantes y conciliadas.
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-all active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Todo a Excel</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 space-x-2 overflow-x-auto mb-6">
        
        {/* Tab 1: Faltantes ERP */}
        <button
          onClick={() => setActiveTab('faltantes')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'faltantes'
              ? 'border-rose-600 text-rose-700 bg-rose-50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>Faltantes en ERP (Peligro de Deducción)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-black border border-rose-300">
            {faltantesERP.length}
          </span>
        </button>

        {/* Tab 2: Sobrantes ERP */}
        <button
          onClick={() => setActiveTab('sobrantes')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'sobrantes'
              ? 'border-amber-500 text-amber-800 bg-amber-50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Sobrantes en ERP (Discrepancia)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-black border border-amber-300">
            {sobrantesERP.length}
          </span>
        </button>

        {/* Tab 3: Conciliadas */}
        <button
          onClick={() => setActiveTab('conciliadas')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'conciliadas'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Conciliadas Correctamente</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-black border border-emerald-300">
            {conciliadas.length}
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'faltantes' && (
          <ReconciliationTable
            data={faltantesERP}
            columns={columnsFaltantes}
            accentColor="red"
            emptyMessage="¡Excelente! No hay facturas del SAT faltantes en el ERP."
          />
        )}

        {activeTab === 'sobrantes' && (
          <ReconciliationTable
            data={sobrantesERP}
            columns={columnsSobrantes}
            accentColor="yellow"
            showSatFilters={false}
            emptyMessage="No se encontraron compras en ERP sobrantes fuera del SAT."
          />
        )}

        {activeTab === 'conciliadas' && (
          <ReconciliationTable
            data={conciliadas}
            columns={columnsConciliadas}
            accentColor="green"
            emptyMessage="No hay facturas conciliadas en esta vista."
          />
        )}
      </div>

    </div>
  );
};
