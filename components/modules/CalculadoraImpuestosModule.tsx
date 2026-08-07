'use client';

import React, { useState } from 'react';
import {
  Calculator,
  ArrowLeft,
  DollarSign,
  Percent,
  FileSpreadsheet,
  CheckCircle2,
  HelpCircle,
  RefreshCcw
} from 'lucide-react';

interface CalculadoraImpuestosModuleProps {
  onBackToHub: () => void;
}

export const CalculadoraImpuestosModule: React.FC<CalculadoraImpuestosModuleProps> = ({ onBackToHub }) => {
  const [subtotal, setSubtotal] = useState<number>(100000);
  const [tasaIva, setTasaIva] = useState<number>(16);
  const [aplicaRetIva, setAplicaRetIva] = useState<boolean>(true); // 10.6667% (2/3 de IVA) o 6%
  const [aplicaRetIsr, setAplicaRetIsr] = useState<boolean>(true); // 1.25% (RESICO) o 10% (Honorarios)
  const [tipoRetIsr, setTipoRetIsr] = useState<'resico' | 'honorarios' | 'arrendamiento'>('resico');

  // Cálculos automáticos
  const montoIva = subtotal * (tasaIva / 100);
  const retencionIva = aplicaRetIva ? subtotal * 0.06 : 0; // 6% estándar servicios profesionales
  
  let tasaIsrCalc = 0;
  if (aplicaRetIsr) {
    if (tipoRetIsr === 'resico') tasaIsrCalc = 0.0125; // 1.25%
    else if (tipoRetIsr === 'honorarios') tasaIsrCalc = 0.10; // 10%
    else if (tipoRetIsr === 'arrendamiento') tasaIsrCalc = 0.10; // 10%
  }
  const retencionIsr = subtotal * tasaIsrCalc;

  const totalNeto = subtotal + montoIva - retencionIva - retencionIsr;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Navigation */}
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
            <Calculator className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-black text-slate-900">
              Calculadora de Impuestos, IVA & Retenciones ISR 2026
            </h2>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200 text-xs font-black">
          Tarifas Vigentes LISR & LIVA
        </span>
      </div>

      {/* Main Grid: Formulario de Parámetros y Papel de Trabajo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Panel Formulario (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-5">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-600" />
            Datos de Facturación / Base Gravable
          </h3>

          {/* Subtotal Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Subtotal / Base Gravable ($):</label>
            <input
              type="number"
              value={subtotal}
              onChange={(e) => setSubtotal(Number(e.target.value))}
              className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-base font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>

          {/* Tasa IVA */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Tasa de IVA (%):</label>
            <div className="grid grid-cols-3 gap-2">
              {[16, 8, 0].map((tasa) => (
                <button
                  key={tasa}
                  type="button"
                  onClick={() => setTasaIva(tasa)}
                  className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                    tasaIva === tasa
                      ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {tasa}% {tasa === 8 ? '(Frontera)' : tasa === 0 ? '(Exento/0%)' : '(General)'}
                </button>
              ))}
            </div>
          </div>

          {/* Opción Retención IVA */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800">Retención de IVA (6%):</span>
              <span className="text-[11px] text-slate-500">Aplica para prestación de servicios de personal/profesionales</span>
            </div>
            <input
              type="checkbox"
              checked={aplicaRetIva}
              onChange={(e) => setAplicaRetIva(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded cursor-pointer"
            />
          </div>

          {/* Opción Retención ISR */}
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Retención de ISR:</span>
              <input
                type="checkbox"
                checked={aplicaRetIsr}
                onChange={(e) => setAplicaRetIsr(e.target.checked)}
                className="w-4 h-4 text-amber-600 rounded cursor-pointer"
              />
            </div>

            {aplicaRetIsr && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200">
                {[
                  { id: 'resico', label: 'RESICO (1.25%)' },
                  { id: 'honorarios', label: 'Honorarios (10%)' },
                  { id: 'arrendamiento', label: 'Arrendamiento (10%)' },
                ].map((tipo) => (
                  <button
                    key={tipo.id}
                    type="button"
                    onClick={() => setTipoRetIsr(tipo.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                      tipoRetIsr === tipo.id
                        ? 'bg-amber-600 text-white border-amber-700'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {tipo.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel Papel de Trabajo y Resultados (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">Papel de Trabajo Fiscal</span>
              <span className="text-[11px] text-slate-400">SAT CFDI 4.0</span>
            </div>

            {/* Desglose de Cálculo */}
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Subtotal / Base Gravable:</span>
                <span className="font-mono font-bold text-white text-sm">${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                <span className="text-slate-400">(+) IVA Trasladado ({tasaIva}%):</span>
                <span className="font-mono font-bold text-emerald-400">+${montoIva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>

              {aplicaRetIva && (
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">(-) Retención IVA (6%):</span>
                  <span className="font-mono font-bold text-rose-400">-${retencionIva.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              {aplicaRetIsr && (
                <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">(-) Retención ISR ({(tasaIsrCalc * 100).toFixed(2)}%):</span>
                  <span className="font-mono font-bold text-rose-400">-${retencionIsr.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              {/* Total Neto a Cobrar / Pagar */}
              <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-1">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Total Neto a Cobrar / Pagar:</span>
                <span className="text-2xl font-black font-mono text-amber-400">
                  ${totalNeto.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Determinación conforme al Art. 1-A LIVA & Art. 106 LISR</span>
            <button
              onClick={() => alert('Cálculo copiado al portapapeles para papel de trabajo.')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer"
            >
              Copiar Papel de Trabajo
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
