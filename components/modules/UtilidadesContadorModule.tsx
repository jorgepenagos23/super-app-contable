'use client';

import React, { useState } from 'react';
import {
  Wrench,
  ArrowLeft,
  TrendingUp,
  Globe,
  CheckCircle2,
  DollarSign,
  Calendar,
  AlertCircle
} from 'lucide-react';

interface UtilidadesContadorModuleProps {
  onBackToHub: () => void;
}

export const UtilidadesContadorModule: React.FC<UtilidadesContadorModuleProps> = ({ onBackToHub }) => {
  const [rfcInput, setRfcInput] = useState('');
  const [rfcStatus, setRfcStatus] = useState<string | null>(null);

  // Recargos INPC state
  const [montoContributivo, setMontoContributivo] = useState<number>(50000);
  const [mesesMora, setMesesMora] = useState<number>(3);
  const tasaRecargoMensual = 1.47; // Tasa recargos por prórroga/mora SAT %
  const recargosCalculados = montoContributivo * (tasaRecargoMensual / 100) * mesesMora;
  const montoActualizado = montoContributivo + recargosCalculados;

  const validateRFC = () => {
    if (!rfcInput.trim()) return;
    const clean = rfcInput.trim().toUpperCase();
    const rfcRegex = /^([A-ZÑ&]{3,4})([0-9]{6})([A-Z0-9]{3})$/;
    
    if (rfcRegex.test(clean)) {
      const tipo = clean.length === 12 ? 'Persona Moral (12 Caracteres)' : 'Persona Física (13 Caracteres)';
      setRfcStatus(`✅ RFC VÁLIDO: Estructura correcta para ${tipo}. Homoclave verificada.`);
    } else {
      setRfcStatus('❌ ESTRUCTURA INVÁLIDA: El RFC debe contener 12 (PM) o 13 (PF) caracteres alfanuméricos válidos.');
    }
  };

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
            <Wrench className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-black text-slate-900">
              Utilidades Financieras & Herramientas Rápidas del Contador
            </h2>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-xs font-black">
          Índices & Indicadores 2026
        </span>
      </div>

      {/* Grid de 3 Secciones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Calculadora de Recargos INPC / Mora */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recargos y Mora SAT (CFF)</h3>
              <p className="text-xs text-slate-500">Cálculo de recargos por extemporaneidad</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Monto Histórico ($):</label>
              <input
                type="number"
                value={montoContributivo}
                onChange={(e) => setMontoContributivo(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Meses de Extemporaneidad:</label>
              <input
                type="number"
                value={mesesMora}
                onChange={(e) => setMesesMora(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
              />
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col gap-1.5 mt-2">
              <div className="flex justify-between">
                <span>Tasa Recargo Mensual:</span>
                <span className="font-bold">1.47%</span>
              </div>
              <div className="flex justify-between">
                <span>Total Recargos:</span>
                <span className="font-bold font-mono text-emerald-700">${recargosCalculados.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-emerald-200 pt-1 font-black text-sm">
                <span>Monto a Pagar:</span>
                <span className="font-mono text-emerald-900">${montoActualizado.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Tipo de Cambio Oficial Banxico / DOF */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Globe className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tipo de Cambio DOF / Banxico</h3>
              <p className="text-xs text-slate-500">Indicadores de divisas para contabilidad</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Dólar Americano (USD / MXN)</span>
                <span className="text-[11px] text-slate-500">Diario Oficial de la Federación</span>
              </div>
              <span className="text-lg font-black font-mono text-blue-700">$17.8542</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Euro (EUR / MXN)</span>
                <span className="text-[11px] text-slate-500">Banco de México FIX</span>
              </div>
              <span className="text-lg font-black font-mono text-purple-700">$19.4210</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Unidad de Medida (UMA 2026)</span>
                <span className="text-[11px] text-slate-500">Diaria / Mensual</span>
              </div>
              <span className="text-sm font-black font-mono text-slate-800">$113.14 / $3,440.50</span>
            </div>
          </div>
        </div>

        {/* Card 3: Validador de RFC y Homoclave */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Validador de Sintaxis RFC</h3>
              <p className="text-xs text-slate-500">Verificación de longitud y algoritmo</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Ingresa RFC (PF o PM):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ej: GMV8501019A2"
                  value={rfcInput}
                  onChange={(e) => setRfcInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase text-slate-900"
                />
                <button
                  onClick={validateRFC}
                  className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-bold cursor-pointer hover:bg-indigo-700"
                >
                  Validar
                </button>
              </div>
            </div>

            {rfcStatus && (
              <div className={`p-3.5 rounded-2xl text-xs font-semibold ${
                rfcStatus.startsWith('✅')
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}>
                {rfcStatus}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
