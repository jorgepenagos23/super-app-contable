'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Filter, Eye } from 'lucide-react';
import { InvoiceAuditModal } from './InvoiceAuditModal';
import { ItemConciliado } from '@/types/reconciliation';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface ReconciliationTableProps<T> {
  data: T[];
  columns: Column<T>[];
  accentColor?: 'emerald' | 'rose' | 'amber' | 'slate' | 'red' | 'yellow' | 'green';
  showSatFilters?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

export function ReconciliationTable<T extends Record<string, any>>({
  data,
  columns,
  accentColor = 'slate',
  showSatFilters = true,
  emptyMessage = 'No se encontraron registros.',
  onRowClick,
}: ReconciliationTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [estatusFilter, setEstatusFilter] = useState('ALL');
  const [metodoFilter, setMetodoFilter] = useState('ALL');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedAuditInvoice, setSelectedAuditInvoice] = useState<ItemConciliado | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch =
        !searchTerm ||
        Object.values(item).some(
          (val) => val && String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchEstatus =
        estatusFilter === 'ALL' ||
        !item.estatusSAT ||
        item.estatusSAT.toLowerCase() === estatusFilter.toLowerCase();

      const matchMetodo =
        metodoFilter === 'ALL' ||
        !item.metodoPagoSAT ||
        item.metodoPagoSAT.toUpperCase() === metodoFilter.toUpperCase();

      return matchSearch && matchEstatus && matchMetodo;
    });
  }, [data, searchTerm, estatusFilter, metodoFilter]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage]);

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('desc');
    }
  };

  const handleRowSelect = (item: T) => {
    if (onRowClick) {
      onRowClick(item);
    } else if (item.uuid && (item.totalSAT !== undefined || item.totalERP !== undefined)) {
      setSelectedAuditInvoice(item as any);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(val);
  };

  return (
    <div className="w-full space-y-4">

      {/* Modal de Auditoría Crítica de Factura */}
      <InvoiceAuditModal
        isOpen={Boolean(selectedAuditInvoice)}
        onClose={() => setSelectedAuditInvoice(null)}
        factura={selectedAuditInvoice}
      />

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por RFC, Razón Social, Folio o UUID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-4 py-1.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500 shadow-2xs"
          />
        </div>

        {/* SAT Filters */}
        {showSatFilters && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl px-2 py-1 shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={estatusFilter}
                onChange={(e) => {
                  setEstatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="ALL">Todos Estatus</option>
                <option value="Vigente">Vigentes</option>
                <option value="Cancelado">Cancelados</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl px-2 py-1 shadow-2xs">
              <select
                value={metodoFilter}
                onChange={(e) => {
                  setMetodoFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="ALL">Todos Métodos</option>
                <option value="PUE">PUE (Contado)</option>
                <option value="PPD">PPD (Crédito)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table Component */}
      <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-xs">
        <table className="w-full text-xs text-left text-slate-700">
          <thead className="bg-slate-100/90 text-slate-800 uppercase font-extrabold text-[10px] tracking-wider border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={`px-4 py-3 ${
                    col.sortable ? 'cursor-pointer hover:bg-slate-200/70 select-none' : ''
                  } ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  <div
                    className={`flex items-center gap-1 ${
                      col.align === 'right'
                        ? 'justify-end'
                        : col.align === 'center'
                        ? 'justify-center'
                        : 'justify-start'
                    }`}
                  >
                    <span>{col.header}</span>
                    {col.sortable && sortColumn === col.key && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center">Auditar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => handleRowSelect(row)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-3 ${
                        col.align === 'right'
                          ? 'text-right font-medium'
                          : col.align === 'center'
                          ? 'text-center'
                          : 'text-left'
                      }`}
                    >
                      {col.render ? (
                        col.render(row)
                      ) : typeof row[col.key] === 'number' ? (
                        <span className="font-extrabold text-slate-900">
                          {formatCurrency(row[col.key])}
                        </span>
                      ) : (
                        <span className="font-medium text-slate-800">{row[col.key] || '-'}</span>
                      )}
                    </td>
                  ))}

                  {/* Acciones de Auditoría */}
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowSelect(row);
                      }}
                      className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 transition-all cursor-pointer"
                      title="Auditar Factura SAT vs FROG"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-slate-400 font-medium">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <div>
          Mostrando {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)} a{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} de {sortedData.length} registros
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 disabled:opacity-40 cursor-pointer"
          >
            Anterior
          </button>
          <span className="px-2 font-bold text-slate-700">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 disabled:opacity-40 cursor-pointer"
          >
            Siguiente
          </button>
        </div>
      </div>

    </div>
  );
}
