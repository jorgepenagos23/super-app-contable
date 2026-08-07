'use client';

import React from 'react';
import { ItemConciliado } from '@/types/reconciliation';
import {
  FileText,
  X,
  AlertTriangle,
  CheckCircle2,
  Building,
  Receipt,
  Sparkles,
  Package,
  Info
} from 'lucide-react';

interface InvoiceAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  factura: ItemConciliado | null;
  toleranciaParametro?: number; // Tolerancia en Pesos ($), defecto 1.00 MXN
}

export const InvoiceAuditModal: React.FC<InvoiceAuditModalProps> = ({
  isOpen,
  onClose,
  factura,
  toleranciaParametro = 1.00,
}) => {
  if (!isOpen || !factura) return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val || 0);

  const totalSAT = factura.totalSAT;
  const totalERP = factura.totalERP;
  const diferencia = Number(Math.abs(totalSAT - totalERP).toFixed(2));
  
  // Lógica del Semáforo de Diferencias
  const esExacto = diferencia === 0;
  const esTolerable = !esExacto && diferencia <= toleranciaParametro;
  const esCritico = diferencia > toleranciaParametro;

  const rawErp: Record<string, any> = (factura as any).raw || {};

  const udn = rawErp["UDN"] || 'PDSC';
  const refFactura = rawErp["Ref. Factura"] || (factura as any).folio || 'N/A';
  const remision = rawErp["Remision"] || (factura as any).documento || 'N/A';
  const refOrden = rawErp["Referencia Orden"] || 'N/A';
  const estadoOrden = rawErp["Estado_Orden"] || 'Ingresada';
  
  const subtotalErp = rawErp["SUBTOTAL"] !== undefined ? rawErp["SUBTOTAL"] : totalERP;
  const descuentoErp = rawErp["DESCUENTO"] || 0;
  const iepsErp = rawErp["IEPS "] !== undefined ? rawErp["IEPS "] : (rawErp["IEPS"] || 0);
  const ivaErp = rawErp["IVA "] !== undefined ? rawErp["IVA "] : (rawErp["IVA"] || 0);

  const productosRelacionados: any[] = rawErp.partidas || rawErp.items || rawErp.conceptos || [
    {
      codigo: remision !== 'N/A' ? remision : 'PROD-001',
      descripcion: `Mercancía/Producto recibido en Orden (${refOrden !== 'N/A' ? refOrden : 'Compra Directa'})`,
      cantidad: 1,
      unidad: 'PZA',
      precioUnitario: subtotalErp,
      subtotal: subtotalErp,
      iva: ivaErp,
      total: totalERP,
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                Auditoría Detallada SAT vs FROG ERP
              </h3>
              <p className="text-[11px] font-bold text-slate-600">
                Proveedor: {factura.nombreEmisor} ({factura.rfcEmisor})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Identificador de UUID */}
          <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
                Folio Fiscal (UUID del XML SAT)
              </span>
              <span className="font-mono text-xs font-black text-slate-900 break-all">
                {factura.uuid}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
              {(factura as any).tipoCoincidencia || 'Coincidencia por XML'}
            </span>
          </div>

          {/* SEMÁFORO DE DIFERENCIA (Verde / Amarillo / Rojo Crítico) */}
          {esCritico ? (
            <div className="p-4 bg-rose-50 border-2 border-rose-500 rounded-2xl text-rose-950 space-y-2">
              <div className="flex items-center gap-2 text-rose-900 font-black text-sm">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-600 animate-ping inline-block" />
                <span>🔴 SEMÁFORO ROJO: DIFERENCIA CRÍTICA (&gt; ${formatCurrency(toleranciaParametro)})</span>
              </div>
              <p className="text-xs font-medium text-rose-900 leading-relaxed">
                El importe difiere por <strong className="text-rose-700 font-black underline">{formatCurrency(diferencia)}</strong> (SAT: {formatCurrency(totalSAT)} vs FROG: {formatCurrency(totalERP)}), superando el parámetro permitido de ${formatCurrency(toleranciaParametro)} MXN.
                Revise si existen notas de crédito, retenciones o recepciones parciales.
              </p>
            </div>
          ) : esTolerable ? (
            <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-amber-950 space-y-1">
              <div className="flex items-center gap-2 text-amber-900 font-black text-sm">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                <span>🟡 SEMÁFORO AMARILLO: Diferencia dentro de Tolerancia (${formatCurrency(diferencia)})</span>
              </div>
              <p className="text-xs font-medium text-amber-800">
                Existe una variación menor de {formatCurrency(diferencia)}, que se encuentra dentro del rango de tolerancia parametrizado de ${formatCurrency(toleranciaParametro)} MXN.
              </p>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 flex items-center gap-2.5 text-xs font-extrabold">
              <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
              <span>🟢 SEMÁFORO VERDE: Coincidencia Monetaria Exacta (Diferencia $0.00).</span>
            </div>
          )}

          {/* TARJETAS COMPARATIVAS LADO A LADO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* LADO SAT */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Reporte Fiscal SAT (XML)
                </span>
                <span className="text-[10px] font-bold text-slate-500">Documento Oficial</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Razón Social Emisor</span>
                <span className="text-xs font-extrabold text-slate-900 block">{factura.nombreEmisor}</span>
                <span className="text-[11px] font-mono font-bold text-slate-500">{factura.rfcEmisor}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Fecha Emisión SAT</span>
                <span className="text-xs font-extrabold text-slate-800">{factura.fechaSAT || 'N/A'}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total SAT ($)</span>
                <span className="text-xl font-black text-slate-900">{formatCurrency(totalSAT)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Estatus SAT</span>
                  <span className="font-extrabold text-emerald-700">{factura.estatusSAT}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block">Método Pago</span>
                  <span className="font-extrabold text-slate-800">{factura.metodoPagoSAT}</span>
                </div>
              </div>
            </div>

            {/* LADO FROG ERP */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-emerald-600" />
                  API FROG ERP (Grupo MV)
                </span>
                <span className="text-[10px] font-bold text-slate-500">UDN: {udn}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Proveedor Registrado</span>
                <span className="text-xs font-extrabold text-slate-900 block">{factura.nombreEmisor}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Ref. Factura</span>
                  <span className="font-extrabold text-slate-800">{refFactura}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Remisión</span>
                  <span className="font-extrabold text-slate-800">{remision}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Ref. Orden</span>
                  <span className="font-extrabold text-slate-800">{refOrden}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Estado Orden</span>
                  <span className="font-extrabold text-emerald-800">{estadoOrden}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-600">
                  <span>Subtotal ERP:</span>
                  <span>{formatCurrency(subtotalErp)}</span>
                </div>
                {descuentoErp > 0 && (
                  <div className="flex justify-between text-xs font-bold text-rose-600">
                    <span>Descuento:</span>
                    <span>-{formatCurrency(descuentoErp)}</span>
                  </div>
                )}
                {iepsErp > 0 && (
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>IEPS:</span>
                    <span>+{formatCurrency(iepsErp)}</span>
                  </div>
                )}
                {ivaErp > 0 && (
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>IVA:</span>
                    <span>+{formatCurrency(ivaErp)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-emerald-800 pt-1 border-t border-slate-200">
                  <span>Total Factura (FROG):</span>
                  <span>{formatCurrency(totalERP)}</span>
                </div>
              </div>

            </div>

          </div>

          {/* DESGLOSE DE PRODUCTOS / PARTIDAS */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-black text-slate-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                Detalle de Productos y Conceptos Relacionados en la Compra
              </span>
              <span className="text-[10px] font-extrabold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                {productosRelacionados.length} producto(s)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 text-slate-800 font-extrabold uppercase text-[10px]">
                  <tr>
                    <th className="px-3 py-2">Código / Ref</th>
                    <th className="px-3 py-2">Descripción del Producto</th>
                    <th className="px-3 py-2 text-center">Cant.</th>
                    <th className="px-3 py-2 text-right">P. Unitario</th>
                    <th className="px-3 py-2 text-right">Total ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productosRelacionados.map((prod, pIdx) => (
                    <tr key={pIdx} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono font-bold text-slate-800 text-[11px]">
                        {prod.codigo || prod.clave || `PART-${pIdx + 1}`}
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-900">
                        {prod.descripcion || prod.concepto || prod.nombre || 'Compra de Insumos / Mercancía General'}
                      </td>
                      <td className="px-3 py-2 text-center font-bold">
                        {prod.cantidad || 1} {prod.unidad || 'PZA'}
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        {formatCurrency(prod.precioUnitario || prod.subtotal || subtotalErp)}
                      </td>
                      <td className="px-3 py-2 text-right font-black text-slate-900">
                        {formatCurrency(prod.total || prod.subtotal || totalERP)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
            <Info className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Semáforo parametrizado: Tolerancia ${formatCurrency(toleranciaParametro)} MXN</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all cursor-pointer shadow-xs"
          >
            Cerrar Auditoría
          </button>
        </div>

      </div>
    </div>
  );
};
