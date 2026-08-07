'use client';

import React, { useState } from 'react';
import { ItemConciliado } from '@/types/reconciliation';
import { InvoiceAuditModal } from './InvoiceAuditModal';
import { useSupplierProfiles, SupplierProfile } from '@/hooks/useSupplierProfiles';
import { SupplierConfigModal } from './SupplierConfigModal';
import { Building2, ChevronDown, ChevronUp, FileCheck, Eye, Settings, Building } from 'lucide-react';

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
  onOpenSupplierConfig?: (rfcOrNombre: string) => void;
}

export const SupplierBreakdownCard: React.FC<SupplierBreakdownCardProps> = ({
  conciliadas,
  montoTotalConciliadas,
  onOpenSupplierConfig
}) => {
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null);
  const [selectedAuditInvoice, setSelectedAuditInvoice] = useState<ItemConciliado | null>(null);
  const { getProfile } = useSupplierProfiles();

  if (!conciliadas || conciliadas.length === 0) return null;

  // Agrupar facturas conciliadas por proveedor (RFC o Nombre)
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

      {/* Header del Desglose por Proveedor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
            Resumen Ejecutivo Contable
          </span>
          <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Desglose de Compras Conciliadas por Proveedor ($ Pesos)
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Personaliza el logotipo, la marca y los parámetros de cada proveedor haciendo clic en el icono de configuración ⚙️.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200">
          <div className="text-right">
            <span className="text-[10px] uppercase font-extrabold text-emerald-700 block">Total Conciliado</span>
            <span className="text-base font-black text-emerald-900">{formatCurrency(montoTotalConciliadas)}</span>
          </div>
        </div>
      </div>

      {/* Lista de Proveedores */}
      <div className="space-y-3">
        {proveedoresList.map((prov, index) => {
          const isExpanded = expandedSupplier === prov.rfcEmisor;
          const profile = getProfile(prov.rfcEmisor || prov.nombreEmisor);

          return (
            <div
              key={prov.rfcEmisor || index}
              className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white hover:border-emerald-300 shadow-xs"
            >
              {/* Fila del Proveedor */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                {/* Logo & Identificación */}
                <div
                  onClick={() => setExpandedSupplier(isExpanded ? null : prov.rfcEmisor)}
                  className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                >
                  {/* Logo Personalizado o Badge por Defecto */}
                  <div className="relative w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0 border border-slate-700 overflow-hidden shadow-xs">
                    {profile?.logoUrl ? (
                      <img src={profile.logoUrl} alt={prov.nombreEmisor} className="w-full h-full object-contain p-0.5 bg-white" />
                    ) : (
                      <span>{prov.nombreEmisor.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-sm text-slate-900 truncate">
                        {prov.nombreEmisor}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                        {prov.rfcEmisor || 'Sin RFC'}
                      </span>
                      {profile?.regimenFiscal && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
                          SAT: {profile.regimenFiscal}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="w-32 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(100, prov.porcentajeDelTotal)}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500">
                        {prov.porcentajeDelTotal}% del total
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones y Métricas del Proveedor */}
                <div className="flex items-center gap-4 justify-between sm:justify-end shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Facturas</span>
                    <span className="text-xs font-black text-slate-700 flex items-center gap-1 justify-end">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {prov.facturasCount}
                    </span>
                  </div>

                  <div className="text-right min-w-[120px]">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Monto Total ($)</span>
                    <span className="text-sm font-black text-emerald-800">
                      {formatCurrency(prov.montoTotalSAT)}
                    </span>
                  </div>

                  {/* Botón Configurar Proveedor */}
                  {onOpenSupplierConfig && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenSupplierConfig(prov.rfcEmisor || prov.nombreEmisor);
                      }}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all cursor-pointer border border-slate-300"
                      title="Configurar Logotipo, Datos Fiscales y Marca del Proveedor"
                    >
                      <Settings className="w-4 h-4 text-slate-700" />
                    </button>
                  )}

                  <button
                    onClick={() => setExpandedSupplier(isExpanded ? null : prov.rfcEmisor)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-500 cursor-pointer hover:bg-slate-200"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Vista Desplegable de Facturas de este Proveedor */}
              {isExpanded && (
                <div className="bg-slate-50 p-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-800">
                      Facturas individuales conciliadas de {prov.nombreEmisor}:
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      Haga clic en cualquier renglón para abrir la Auditoría SAT vs FROG
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-700">
                      <thead className="bg-slate-200 text-slate-800 font-extrabold uppercase text-[10px]">
                        <tr>
                          <th className="px-3 py-2">Folio Fiscal (UUID)</th>
                          <th className="px-3 py-2">Fecha SAT</th>
                          <th className="px-3 py-2">Método</th>
                          <th className="px-3 py-2 text-right">Total SAT</th>
                          <th className="px-3 py-2 text-right">Total ERP</th>
                          <th className="px-3 py-2 text-center">Auditar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {prov.items.map((fact, fIdx) => (
                          <tr
                            key={fact.uuid || fIdx}
                            onClick={() => setSelectedAuditInvoice(fact)}
                            className="hover:bg-slate-100/80 transition-colors cursor-pointer group"
                          >
                            <td className="px-3 py-2 font-mono text-[11px] font-bold text-slate-800">
                              {fact.uuid}
                            </td>
                            <td className="px-3 py-2">{fact.fechaSAT || 'N/A'}</td>
                            <td className="px-3 py-2 font-bold">{fact.metodoPagoSAT}</td>
                            <td className="px-3 py-2 text-right font-black text-slate-900">
                              {formatCurrency(fact.totalSAT)}
                            </td>
                            <td className="px-3 py-2 text-right font-black text-emerald-800">
                              {formatCurrency(fact.totalERP)}
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
