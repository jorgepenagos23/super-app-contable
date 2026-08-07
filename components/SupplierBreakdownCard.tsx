'use client';

import React, { useState } from 'react';
import { ItemConciliado } from '@/types/reconciliation';
import { InvoiceAuditModal } from './InvoiceAuditModal';
import { useSupplierProfiles } from '@/hooks/useSupplierProfiles';
import { getSupplierBrandLogo } from '@/lib/supplier-logos';
import { Building2, ChevronDown, ChevronUp, FileCheck, Eye, CheckCircle2 } from 'lucide-react';

interface SupplierGroup {
  nombreEmisor: string;
  rfcEmisor: string;
  facturasCount: number;
  montoTotalSAT: number;
  montoTotalERP: number;
  diferenciaTotal: number;
  porcentajeDelTotal: number;
  items: ItemConciliado[];
}

interface SupplierBreakdownCardProps {
  conciliadas: ItemConciliado[];
  montoTotalConciliadas: number;
}

export const SupplierBreakdownCard: React.FC<SupplierBreakdownCardProps> = ({
  conciliadas,
  montoTotalConciliadas,
}) => {
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null);
  const [selectedAuditInvoice, setSelectedAuditInvoice] = useState<ItemConciliado | null>(null);
  const { getProfile } = useSupplierProfiles();

  if (!conciliadas || conciliadas.length === 0) return null;

  // Agrupar ÚNICAMENTE facturas conciliadas vs FROG por proveedor
  const mapProveedores = new Map<string, SupplierGroup>();

  for (const item of conciliadas) {
    const key = item.rfcEmisor || item.nombreEmisor;
    const existing = mapProveedores.get(key);

    if (existing) {
      existing.facturasCount += 1;
      existing.montoTotalSAT += item.totalSAT;
      existing.montoTotalERP += item.totalERP;
      existing.diferenciaTotal += item.diferencia;
      existing.items.push(item);
    } else {
      mapProveedores.set(key, {
        nombreEmisor: item.nombreEmisor,
        rfcEmisor: item.rfcEmisor,
        facturasCount: 1,
        montoTotalSAT: item.totalSAT,
        montoTotalERP: item.totalERP,
        diferenciaTotal: item.diferencia,
        porcentajeDelTotal: 0,
        items: [item],
      });
    }
  }

  const proveedoresList = Array.from(mapProveedores.values()).map((prov) => {
    const porcentaje = montoTotalConciliadas > 0
      ? (prov.montoTotalSAT / montoTotalConciliadas) * 100
      : 0;
    return {
      ...prov,
      porcentajeDelTotal: Number(porcentaje.toFixed(1)),
    };
  });

  proveedoresList.sort((a, b) => b.montoTotalSAT - a.montoTotalSAT);

  const montoTotalERPConciliadas = conciliadas.reduce((acc, i) => acc + i.totalERP, 0);
  const diferenciaTotalConciliadas = Math.abs(montoTotalConciliadas - montoTotalERPConciliadas);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm my-6">
      
      {/* Modal de Auditoría Crítica por Factura */}
      <InvoiceAuditModal
        isOpen={Boolean(selectedAuditInvoice)}
        onClose={() => setSelectedAuditInvoice(null)}
        factura={selectedAuditInvoice}
      />

      {/* Header Limpio */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-950 text-xs font-medium border border-blue-200 flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-900" />
            Compras Conciliadas SAT vs FROG ERP
          </span>
          <h3 className="text-xl font-normal text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-900" />
            Conciliaciones Exitosas por Proveedor
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            Muestra únicamente las facturas del SAT amarradas y conciliadas contra recepciones del ERP de Grupo MV.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 shadow-2xs flex-wrap sm:flex-nowrap">
          <div className="text-right border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0 sm:pr-4">
            <span className="text-[10px] uppercase font-normal text-slate-600 block">Total Conciliado SAT</span>
            {/* MONTO EN NEGRITA DESTACADA */}
            <span className="text-base font-black text-slate-950">{formatCurrency(montoTotalConciliadas)}</span>
          </div>

          <div className="text-right border-b sm:border-b-0 sm:border-r border-slate-200 pb-2 sm:pb-0 sm:pr-4">
            <span className="text-[10px] uppercase font-normal text-blue-900 block">Total Conciliado FROG</span>
            {/* MONTO EN NEGRITA DESTACADA */}
            <span className="text-base font-black text-blue-950">{formatCurrency(montoTotalERPConciliadas)}</span>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase font-normal text-slate-600 block">Diferencia Neta</span>
            {/* MONTO CON DIFERENCIA EN ROJO SI ES MAYOR A 0 */}
            <span className={`text-base font-black ${diferenciaTotalConciliadas > 0.01 ? 'text-rose-600' : 'text-slate-800'}`}>
              {formatCurrency(diferenciaTotalConciliadas)}
            </span>
          </div>
        </div>
      </div>

      {/* Lista de Proveedores Conciliados */}
      <div className="space-y-3">
        {proveedoresList.map((prov, index) => {
          const isExpanded = expandedSupplier === prov.rfcEmisor;
          const profile = getProfile(prov.rfcEmisor || prov.nombreEmisor);
          const logoUrl = getSupplierBrandLogo(prov.nombreEmisor, prov.rfcEmisor, profile?.logoUrl);

          return (
            <div
              key={prov.rfcEmisor || index}
              className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white hover:border-emerald-400 shadow-xs"
            >
              {/* Fila del Proveedor */}
              <div
                onClick={() => setExpandedSupplier(isExpanded ? null : prov.rfcEmisor)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/80 transition-all"
              >
                {/* Logo & Identificación */}
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  
                  {/* Badge de Logotipo */}
                  <div className="relative w-12 h-12 rounded-2xl bg-white text-slate-900 font-medium text-sm flex items-center justify-center shrink-0 border border-slate-200 shadow-sm overflow-hidden p-1">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={prov.nombreEmisor}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-slate-700 font-medium">
                        {prov.nombreEmisor.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-slate-900 truncate">
                        {prov.nombreEmisor}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-normal bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                        {prov.rfcEmisor || 'Sin RFC'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="w-36 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, prov.porcentajeDelTotal)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-normal text-slate-500">
                        {prov.porcentajeDelTotal}% del total conciliado
                      </span>
                    </div>
                  </div>
                </div>

                {/* Métricas Exclusivas de Conciliación SAT vs FROG */}
                <div className="flex items-center gap-6 justify-between sm:justify-end shrink-0">
                  
                  {/* Facturas Conciliadas */}
                  <div className="text-right">
                    <span className="text-[10px] font-normal text-slate-500 uppercase block">Facturas</span>
                    <span className="text-xs font-medium text-slate-800 flex items-center gap-1 justify-end">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {prov.facturasCount}
                    </span>
                  </div>

                  {/* Total SAT Conciliado (MONTO EN NEGRITA) */}
                  <div className="text-right min-w-[110px]">
                    <span className="text-[10px] font-normal text-slate-500 uppercase block">Total SAT ($)</span>
                    <span className="text-xs font-black text-slate-900">
                      {formatCurrency(prov.montoTotalSAT)}
                    </span>
                  </div>

                  {/* Total FROG ERP Conciliado (MONTO EN NEGRITA) */}
                  <div className="text-right min-w-[110px]">
                    <span className="text-[10px] font-normal text-emerald-700 uppercase block">Total FROG ($)</span>
                    <span className="text-xs font-black text-emerald-800">
                      {formatCurrency(prov.montoTotalERP)}
                    </span>
                  </div>

                  {/* Diferencia (EN ROJO SI ES MAYOR A 0) */}
                  <div className="text-right min-w-[90px]">
                    <span className="text-[10px] font-normal text-slate-500 uppercase block">Diferencia</span>
                    <span className={`text-xs font-black ${prov.diferenciaTotal > 0.01 ? 'text-rose-600' : 'text-slate-600'}`}>
                      {formatCurrency(prov.diferenciaTotal)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedSupplier(isExpanded ? null : prov.rfcEmisor);
                    }}
                    className="p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Detalle de Facturas Conciliadas SAT vs FROG */}
              {isExpanded && (
                <div className="bg-slate-50 p-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-800">
                      Facturas conciliadas de {prov.nombreEmisor}:
                    </span>
                    <span className="text-[10px] font-normal text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                      Haga clic en cualquier renglón para auditar la factura en FROG ERP
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-700">
                      <thead className="bg-slate-200 text-slate-800 font-medium uppercase text-[10px]">
                        <tr>
                          <th className="px-3 py-2">Folio Fiscal (UUID)</th>
                          <th className="px-3 py-2">Fecha SAT</th>
                          <th className="px-3 py-2">Método</th>
                          <th className="px-3 py-2 text-right">Total SAT</th>
                          <th className="px-3 py-2 text-right">Total FROG</th>
                          <th className="px-3 py-2 text-right">Diferencia</th>
                          <th className="px-3 py-2 text-center">Auditar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {prov.items.map((fact, fIdx) => (
                          <tr
                            key={fact.uuid || fIdx}
                            onClick={() => setSelectedAuditInvoice(fact)}
                            className="hover:bg-slate-100/80 transition-colors cursor-pointer group font-normal"
                          >
                            <td className="px-3 py-2 font-mono text-[11px] text-slate-800">
                              {fact.uuid}
                            </td>
                            <td className="px-3 py-2">{fact.fechaSAT || 'N/A'}</td>
                            <td className="px-3 py-2">{fact.metodoPagoSAT}</td>
                            {/* MONTOS EN NEGRITA EN LA TABLA */}
                            <td className="px-3 py-2 text-right font-black text-slate-900">
                              {formatCurrency(fact.totalSAT)}
                            </td>
                            <td className="px-3 py-2 text-right font-black text-emerald-800">
                              {formatCurrency(fact.totalERP)}
                            </td>
                            <td className={`px-3 py-2 text-right font-black ${fact.diferencia > 0.01 ? 'text-rose-600' : 'text-slate-700'}`}>
                              {formatCurrency(fact.diferencia)}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAuditInvoice(fact);
                                }}
                                className="p-1 rounded-lg bg-emerald-100 text-emerald-800 group-hover:bg-emerald-600 group-hover:text-white transition-all"
                                title="Ver comparativo detallado"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
