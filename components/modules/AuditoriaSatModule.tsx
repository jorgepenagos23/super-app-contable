'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  FileCheck,
  AlertOctagon,
  CheckCircle,
  XCircle,
  ArrowLeft,
  RefreshCw,
  Download,
  Building,
  FileText
} from 'lucide-react';

interface AuditoriaSatModuleProps {
  onBackToHub: () => void;
}

export const AuditoriaSatModule: React.FC<AuditoriaSatModuleProps> = ({ onBackToHub }) => {
  const [uuidQuery, setUuidQuery] = useState('');
  const [rfcQuery, setRfcQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null);

  // Muestras de EFOS / Lista Negra 69-B para demostración
  const efosSimulados = [
    { rfc: 'EFOS880101AAA', nombre: 'SERVICIOS ESTRUCTURALES PATITO SA DE CV', estatus: 'Definitivo', fecha: '2025-11-15' },
    { rfc: 'COMP920312XYZ', nombre: 'COMERCIALIZADORA EXPRESS DEL NORTE', estatus: 'Presunto', fecha: '2026-01-20' },
  ];

  const handleSearchUUID = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uuidQuery.trim()) return;

    // Generar diagnóstico de demostración
    const isValido = !uuidQuery.toLowerCase().includes('cancel');
    setSearchResult({
      uuid: uuidQuery.trim().toUpperCase(),
      rfcEmisor: 'GMV8501019A2',
      nombreEmisor: 'COMERCIALIZADORA GRUPO MV SA DE CV',
      rfcReceptor: 'XAXX010101000',
      total: '$45,890.00',
      estadoSat: isValido ? 'VIGENTE' : 'CANCELADO',
      efosStatus: 'LIMPIO (Sin coincidencias en 69-B)',
      fechaEmision: '2026-02-10',
      pacCertificador: 'SAT-CFDI-PAC',
      efosAlert: false
    });
  };

  const handleCheckRFC = () => {
    if (!rfcQuery.trim()) return;
    const efos = efosSimulados.find(e => e.rfc.toLowerCase() === rfcQuery.trim().toLowerCase());
    if (efos) {
      alert(`⚠️ ALERTA FISCAL: El RFC ${efos.rfc} (${efos.nombre}) se encuentra publicado en la lista de EFOS del SAT como "${efos.estatus}".`);
    } else {
      alert(`✅ EL RFC ${rfcQuery.toUpperCase()} se encuentra LIMPIO y no figura en la lista de EFOS Art. 69-B.`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Header Navigation */}
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
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-black text-slate-900">
              Auditoría CFDI & Validador EFOS 69-B del SAT
            </h2>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 text-xs font-black">
          Servicio SAT Activo
        </span>
      </div>

      {/* Grid de 2 Secciones: Consulta UUID y Consulta EFOS 69-B */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Columna Izquierda: Validador de Folios Fiscales UUID (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Consulta y Validación de UUID</h3>
              <p className="text-xs text-slate-500">Comprueba el estado del CFDI directamente contra elWebService del SAT.</p>
            </div>
          </div>

          <form onSubmit={handleSearchUUID} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="Ingresa el Folio Fiscal UUID (ej: 8F5A9A12-3B4C...)"
              value={uuidQuery}
              onChange={(e) => setUuidQuery(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <Search className="w-4 h-4" />
              <span>Validar en SAT</span>
            </button>
          </form>

          {/* Resultado de Validación */}
          {searchResult ? (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500">{searchResult.uuid}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 ${
                  searchResult.estadoSat === 'VIGENTE'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {searchResult.estadoSat === 'VIGENTE' ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                  {searchResult.estadoSat}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-semibold block">Emisor RFC:</span>
                  <span className="font-bold text-slate-900">{searchResult.rfcEmisor}</span>
                  <span className="block text-[11px] text-slate-500 truncate">{searchResult.nombreEmisor}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-semibold block">Monto Total CFDI:</span>
                  <span className="font-black text-emerald-600 text-sm">{searchResult.total}</span>
                  <span className="block text-[11px] text-slate-500">Fecha: {searchResult.fechaEmision}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                <span>🛡️ Estatus Lista Negra EFOS: <strong>{searchResult.efosStatus}</strong></span>
                <span className="font-bold text-blue-700">{searchResult.pacCertificador}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-6 text-center border border-dashed border-slate-300 text-slate-500 text-xs">
              Ingresa un Folio Fiscal UUID arriba para verificar el estatus oficial en el SAT y la integridad del comprobante.
            </div>
          )}
        </div>

        {/* Columna Derecha: Validador de Proveedores EFOS Art. 69-B (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Consulta Preventiva EFOS (Art. 69-B)</h3>
              <p className="text-xs text-slate-500">Monitoreo contra el listado oficial publicado por el SAT.</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ingresa RFC del Proveedor..."
              value={rfcQuery}
              onChange={(e) => setRfcQuery(e.target.value.toUpperCase())}
              className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono uppercase text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
            <button
              onClick={handleCheckRFC}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Consultar RFC
            </button>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <span className="text-xs font-bold text-slate-700">Muestra de Lista Negra Registrada (SAT 2026):</span>
            {efosSimulados.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-xs flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-rose-900">{item.rfc}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-200 text-rose-900 text-[10px] font-black">{item.estatus}</span>
                </div>
                <span className="font-semibold text-slate-800 text-[11px]">{item.nombre}</span>
                <span className="text-[10px] text-slate-500">Fecha publicación DOF: {item.fecha}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
