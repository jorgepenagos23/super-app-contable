'use client';

import React from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, FileText, Database, Scale, Info } from 'lucide-react';
import { ModuleId } from './AccountantHub';

export interface ModuleDetailItem {
  id: ModuleId;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  normativa: string;
  entradas: string[];
  salidas: string[];
  funcionesClave: string[];
}

interface ModuleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleDetail: ModuleDetailItem | null;
  onConfirmOpenModule: (id: ModuleId) => void;
}

export const ModuleDetailsModal: React.FC<ModuleDetailsModalProps> = ({
  isOpen,
  onClose,
  moduleDetail,
  onConfirmOpenModule,
}) => {
  if (!isOpen || !moduleDetail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Institutional Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
              <Info className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">
                Ficha Técnica del Módulo
              </span>
              <h3 className="text-lg font-black text-white">{moduleDetail.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex flex-col gap-5 text-xs text-slate-700">
          
          {/* Subtítulo & Descripción */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block text-sm mb-1">{moduleDetail.subtitle}</span>
            <p className="text-slate-600 leading-relaxed">{moduleDetail.description}</p>
          </div>

          {/* Normativa y Marco Legal */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-950 font-medium">
            <Scale className="w-4 h-4 text-blue-700 shrink-0" />
            <span><strong>Marco Fiscal Aplicable:</strong> {moduleDetail.normativa}</span>
          </div>

          {/* Grid Entradas & Salidas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Insumos / Entradas */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5 mb-2.5 text-slate-800">
                <Database className="w-3.5 h-3.5 text-slate-600" />
                Insumos & Datos Requeridos:
              </span>
              <ul className="flex flex-col gap-1.5">
                {moduleDetail.entradas.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Entregables / Salidas */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <span className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5 mb-2.5 text-slate-800">
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                Entregables & Papeles de Trabajo:
              </span>
              <ul className="flex flex-col gap-1.5">
                {moduleDetail.salidas.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Funciones Clave */}
          <div className="flex flex-col gap-2">
            <span className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider">
              Capacidades y Automatizaciones Integradas:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {moduleDetail.funcionesClave.map((func, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-slate-100 border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium text-slate-800">{func}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500 font-semibold">
            Super App Contable • Estatus: {moduleDetail.badge}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onClose();
                onConfirmOpenModule(moduleDetail.id);
              }}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Abrir Módulo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
