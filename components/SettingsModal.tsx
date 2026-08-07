'use client';

import React, { useState, useEffect } from 'react';
import { Sliders, X, Save, Check, Building } from 'lucide-react';
import { SupplierOption } from '@/hooks/useReconciliation';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  toleranciaActual: number;
  filtroProveedorActual: string;
  opcionesProveedores?: SupplierOption[];
  onSaveSettings: (tolerancia: number, filtroProveedor: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  toleranciaActual,
  filtroProveedorActual,
  opcionesProveedores = [],
  onSaveSettings,
}) => {
  const [valTolerancia, setValTolerancia] = useState<string>(String(toleranciaActual));
  const [valProveedor, setValProveedor] = useState<string>(filtroProveedorActual);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setValTolerancia(String(toleranciaActual));
    setValProveedor(filtroProveedorActual);
  }, [toleranciaActual, filtroProveedorActual, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(valTolerancia);
    if (!isNaN(num) && num >= 0) {
      onSaveSettings(num, valProveedor);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Parámetros de Conciliación
              </h3>
              <p className="text-[11px] font-bold text-slate-500">
                Selección de Proveedor y Semáforo Contable
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          
          {/* DESPLEGABLE DE PROVEEDORES */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <label className="block text-xs font-black text-slate-900 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-emerald-600" />
              Seleccionar Proveedor Objetivo
            </label>
            <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
              Elija un proveedor de la lista detectada para conciliar <strong className="text-emerald-700 font-extrabold">exclusivamente</strong> sus facturas.
            </p>

            {/* Menú Desplegable con Opciones de Proveedores */}
            <div className="relative mt-2">
              <select
                value={valProveedor}
                onChange={(e) => setValProveedor(e.target.value)}
                className="w-full bg-white border border-slate-300 font-extrabold text-xs text-slate-900 rounded-xl px-3 py-2.5 outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
              >
                <option value="">🏢 Todos los Proveedores (Sin filtro)</option>
                {opcionesProveedores.map((prov, pIdx) => (
                  <option key={pIdx} value={prov.rfc || prov.nombre}>
                    🏢 {prov.nombre} ({prov.count} factura{prov.count > 1 ? 's' : ''}) - {prov.rfc}
                  </option>
                ))}
              </select>
            </div>

            {/* Búsqueda manual como alternativa */}
            <div className="pt-1">
              <input
                type="text"
                value={valProveedor}
                onChange={(e) => setValProveedor(e.target.value)}
                placeholder="O escriba manualmente: PEÑAFIEL, PRO991231AAA..."
                className="w-full bg-white border border-slate-300 font-medium text-[11px] text-slate-800 rounded-xl px-3 py-1.5 outline-none focus:border-emerald-500 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* PARÁMETRO DE TOLERANCIA ($ MXN) */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <label className="block text-xs font-black text-slate-900">
              Tolerancia Máxima de Diferencia ($ MXN)
            </label>

            <div className="relative mt-2">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={valTolerancia}
                onChange={(e) => setValTolerancia(e.target.value)}
                placeholder="1.00"
                className="w-full bg-white border border-slate-300 font-black text-base text-slate-900 rounded-xl pl-8 pr-16 py-2 outline-none focus:border-emerald-500 shadow-2xs"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">
                MXN
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md cursor-pointer transition-all active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar Parámetros</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
