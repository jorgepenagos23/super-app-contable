'use client';

import React, { useState } from 'react';
import {
  Building2,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building,
  DollarSign,
  FileSpreadsheet,
  Download,
  Filter
} from 'lucide-react';
import { ProveedorResumen } from '@/types/reconciliation';

interface ControlProveedoresModuleProps {
  onBackToHub: () => void;
  availableSuppliers: ProveedorResumen[];
  onSelectProveedorForReconciliation: (rfcOrNombre: string) => void;
}

export const ControlProveedoresModule: React.FC<ControlProveedoresModuleProps> = ({
  onBackToHub,
  availableSuppliers,
  onSelectProveedorForReconciliation
}) => {
  const [search, setSearch] = useState('');

  const filtered = availableSuppliers.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase()) ||
    p.rfc.toLowerCase().includes(search.toLowerCase())
  );

  const totalFacturas = availableSuppliers.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHub}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Menú</span>
          </button>
          <div className="h-6 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-black text-slate-900">
              Directorio de Proveedores & Control de Cuentas por Pagar (CXP)
            </h2>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200 text-xs font-black">
          {availableSuppliers.length} Proveedores Registrados
        </span>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">Total Proveedores:</span>
            <span className="text-xl font-black text-slate-900">{availableSuppliers.length}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">Facturas Totales Procesadas:</span>
            <span className="text-xl font-black text-slate-900">{totalFacturas}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-bold block">Estatus Fiscal:</span>
            <span className="text-xs font-black text-emerald-600">RFCs Liquidados & Validados</span>
          </div>
        </div>
      </div>

      {/* Tabla de Proveedores */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">Listado de Proveedores y Facturación Acumulada</h3>

          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filtrar proveedor por nombre o RFC..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100 text-slate-900 font-black border-b border-slate-200 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="p-3.5">#</th>
                <th className="p-3.5">Proveedor / Razón Social</th>
                <th className="p-3.5">RFC</th>
                <th className="p-3.5 text-center">Facturas Registradas</th>
                <th className="p-3.5 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prov, index) => (
                <tr key={index} className="hover:bg-purple-50/50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-400">{index + 1}</td>
                  <td className="p-3.5 font-bold text-slate-900">{prov.nombre}</td>
                  <td className="p-3.5 font-mono text-slate-600">{prov.rfc || 'NO REGISTRADO'}</td>
                  <td className="p-3.5 text-center font-black text-purple-700">{prov.count} facturas</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => onSelectProveedorForReconciliation(prov.rfc || prov.nombre)}
                      className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      Filtrar en Conciliación
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No se encontraron proveedores coincidentes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
