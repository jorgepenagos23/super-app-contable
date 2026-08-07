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
    { key: 'fecha', header: 'Fecha Emisión', sortable: true },
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
    {
      key: 'total',
      header: 'Total (SAT)',
      align: 'right' as const,
      sortable: true,
      render: (item: any) => (
        <span className="font-black text-slate-900">
          {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.total)}
        </span>
      ),
    },
  ];

  const columnsSobrantes = [
    { key: 'proveedor', header: 'Proveedor (ERP)', sortable: true },
    { key: 'uuid', header: 'UUID / Ref (ERP)', sortable: true },
    { key: 'fecha', header: 'Fecha', sortable: true },
    {
      key: 'total',
      header: 'Total (ERP)',
      align: 'right' as const,
      sortable: true,
      render: (item: any) => (
        <span className="font-black text-amber-700">
          {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.total)}
        </span>
      ),
    },
  ];

  const columnsConciliadas = [
    { key: 'rfcEmisor', header: 'RFC Emisor', sortable: true },
    { key: 'nombreEmisor', header: 'Nombre / Razón Social', sortable: true },
    { key: 'uuid', header: 'UUID (Folio Fiscal)', sortable: true },
    {
      key: 'tipoCoincidencia',
      header: 'Criterio de Amarre',
      render: (item: any) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-normal bg-emerald-100 text-emerald-800 border border-emerald-200">
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
    {
      key: 'totalSAT',
      header: 'Total SAT',
      align: 'right' as const,
      sortable: true,
      render: (item: any) => (
        <span className="font-black text-slate-900">
          {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.totalSAT)}
        </span>
      ),
    },
    {
      key: 'totalERP',
      header: 'Total ERP',
      align: 'right' as const,
      sortable: true,
      render: (item: any) => (
        <span className="font-black text-emerald-800">
          {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.totalERP)}
        </span>
      ),
    },
    {
      key: 'diferencia',
      header: 'Diferencia',
      align: 'right' as const,
      render: (item: any) => (
        <span className={item.diferencia > 1.00 ? 'text-rose-600 font-black' : 'text-slate-700 font-black'}>
          {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(item.diferencia)}
        </span>
      ),
    },
  ];

  const [faltantesSubFilter, setFaltantesSubFilter] = useState<'habituales' | 'otros' | 'todos'>('habituales');

  const faltantesHabitualesList = faltantesERP.filter((f) => f.esProveedorHabitual !== false);
  const faltantesOtrosList = faltantesERP.filter((f) => f.esProveedorHabitual === false);

  const displayFaltantes =
    faltantesSubFilter === 'habituales'
      ? faltantesHabitualesList
      : faltantesSubFilter === 'otros'
      ? faltantesOtrosList
      : faltantesERP;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-sm my-6">
      
      {/* Header & Export Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-normal text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-900" />
            Resultados del Cruce Fiscal
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-normal">
            Revisión amarrada por UUID, Folio y Razón Social. Utilice las pestañas para auditar faltantes, sobrantes y conciliadas.
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-medium shadow transition-all active:scale-95 cursor-pointer"
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
          className={`flex items-center gap-2 py-3 px-5 border-b-2 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'faltantes'
              ? 'border-rose-600 text-rose-700 bg-rose-50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>Faltantes en ERP (Compras Habituales)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-800 font-normal border border-rose-200">
            {faltantesHabitualesList.length}
          </span>
        </button>

        {/* Tab 2: Sobrantes ERP */}
        <button
          onClick={() => setActiveTab('sobrantes')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'sobrantes'
              ? 'border-amber-500 text-amber-800 bg-amber-50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Sobrantes en ERP (Discrepancia)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 font-normal border border-amber-200">
            {sobrantesERP.length}
          </span>
        </button>

        {/* Tab 3: Conciliadas */}
        <button
          onClick={() => setActiveTab('conciliadas')}
          className={`flex items-center gap-2 py-3 px-5 border-b-2 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'conciliadas'
              ? 'border-blue-900 text-blue-950 bg-blue-50 rounded-t-lg'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CheckCircle className="w-4 h-4 text-blue-900" />
          <span>Conciliadas Correctamente</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-950 font-normal border border-blue-200">
            {conciliadas.length}
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      <div>
        {activeTab === 'faltantes' && (
          <div className="space-y-4">
            
            {/* Sub-Filtros para separar Compras Habituales vs Gastos Directos */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex-wrap gap-2">
              <span className="text-xs font-medium text-slate-700">
                Filtrar Faltantes en ERP por tipo de proveedor:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setFaltantesSubFilter('habituales')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    faltantesSubFilter === 'habituales'
                      ? 'bg-rose-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  🔴 Proveedores Habituales ({faltantesHabitualesList.length})
                </button>
                <button
                  onClick={() => setFaltantesSubFilter('otros')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    faltantesSubFilter === 'otros'
                      ? 'bg-slate-800 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  ⚪ Gastos Directos / Sin ERP ({faltantesOtrosList.length})
                </button>
                <button
                  onClick={() => setFaltantesSubFilter('todos')}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    faltantesSubFilter === 'todos'
                      ? 'bg-blue-900 text-white shadow-2xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Ver Todos ({faltantesERP.length})
                </button>
              </div>
            </div>

            <ReconciliationTable
              data={displayFaltantes}
              columns={columnsFaltantes}
              accentColor="red"
              emptyMessage="No se encontraron facturas faltantes bajo este filtro."
            />
          </div>
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
