'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  ShieldCheck,
  Calculator,
  Building2,
  Wrench,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  FileCheck,
  Zap,
  BookOpen,
  Filter
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export type ModuleId = 'hub' | 'conciliacion' | 'auditoria_sat' | 'impuestos' | 'proveedores' | 'utilidades';

interface AccountantHubProps {
  onSelectModule: (moduleId: ModuleId) => void;
  erpCount: number;
  erpConnected: boolean;
  suppliersCount: number;
}

export const AccountantHub: React.FC<AccountantHubProps> = ({
  onSelectModule,
  erpCount,
  erpConnected,
  suppliersCount
}) => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const modules = [
    {
      id: 'conciliacion' as ModuleId,
      category: 'conciliacion',
      title: 'Conciliación Compras PARAL vs SAT',
      subtitle: 'Cruces automatizados de auxiliares Excel vs ERP Grupo MV',
      description: 'Carga masiva de facturas en Excel/XML, comparación instantánea por UUID, monto, impuesto y RFC. Identificación de facturas faltantes en ERP o canceladas en el SAT.',
      icon: FileSpreadsheet,
      badge: '🟢 Producción',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      gradient: 'from-emerald-600 to-teal-500',
      stats: `${erpCount} facturas en ERP • ${suppliersCount} proveedores`,
      features: [
        'Carga de auxiliar de compras Excel/XML',
        'Sincronización directa con API ERP Grupo MV',
        'Filtros dinámicos por Proveedor y Folio',
        'Exportación de informes ejecutivos en Excel'
      ],
      primaryAction: 'Iniciar Conciliación'
    },
    {
      id: 'auditoria_sat' as ModuleId,
      category: 'fiscal',
      title: 'Auditoría CFDI & Validador EFOS 69-B',
      subtitle: 'Inspección de facturas y listas negras del SAT',
      description: 'Verificación masiva de estado de comprobantes (Vigente / Cancelado), validación de folios fiscales UUID y consulta preventiva de proveedores en listas negras del Art. 69-B del CFF.',
      icon: ShieldCheck,
      badge: '🛡️ Fiscal',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      gradient: 'from-blue-600 to-indigo-600',
      stats: 'Validación SAT 100% activa',
      features: [
        'Buscador y validador de UUIDs',
        'Inspección de lista EFOS (Empresas Facturadoras de Operaciones Simuladas)',
        'Validador de estructura XML CFDI 4.0',
        'Alertas preventivas de riesgo fiscal'
      ],
      primaryAction: 'Abrir Auditoría SAT'
    },
    {
      id: 'impuestos' as ModuleId,
      category: 'impuestos',
      title: 'Calculadora de Impuestos & Retenciones',
      subtitle: 'Estimador fiscal IVA Acreditable vs Trasladado e ISR',
      description: 'Calculadora especializada para contadores: estimación rápida de IVA acreditable de compras, retenciones de IVA/ISR (6%, 1.25%, RESICO, Personas Morales) y papeles de trabajo.',
      icon: Calculator,
      badge: '💰 Calculadora',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      gradient: 'from-amber-500 to-orange-600',
      stats: 'Cálculo RESICO y PM 2026',
      features: [
        'Determinación de IVA neto a pagar o a favor',
        'Desglose de retenciones de ISR e IVA',
        'Papel de trabajo para declaración mensual',
        'Simulador de coeficientes de utilidad'
      ],
      primaryAction: 'Calcular Impuestos'
    },
    {
      id: 'proveedores' as ModuleId,
      category: 'reportes',
      title: 'Directorio de Proveedores & Control CXP',
      subtitle: 'Gestión fiscal de cuentas por pagar y volumen de compras',
      description: 'Directorio consolidado de proveedores con RFC validado, historial acumulado de compras, saldos conciliados y monitoreo de proveedores con mayor volumen de facturación.',
      icon: Building2,
      badge: '💼 CXP',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      gradient: 'from-purple-600 to-violet-600',
      stats: `${suppliersCount} Proveedores registrados`,
      features: [
        'Directorio completo con RFC y Razón Social',
        'Ranking de volumen acumulado de facturación',
        'Estado de cuenta y conciliación individual',
        'Validación de domicilio fiscal y régimen'
      ],
      primaryAction: 'Ver Proveedores'
    },
    {
      id: 'utilidades' as ModuleId,
      category: 'utilidades',
      title: 'Utilidades Financieras & INPC / Banxico',
      subtitle: 'Recargos, Tipo de Cambio y Validador RFC/CURP',
      description: 'Herramientas esenciales del contador público: tabla de actualización por recargos según el INPC, tipo de cambio oficial del Banco de México (Banxico/DOF) y generador/validador de RFC y CURP.',
      icon: Wrench,
      badge: '🛠️ Utilidades',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      gradient: 'from-slate-700 to-slate-900',
      stats: 'Banxico API / INPC Actualizado',
      features: [
        'Calculadora de recargos y actualización (INPC)',
        'Tipo de cambio oficial Banxico USD/EUR',
        'Validador de estructura de RFC y homoclave',
        'Convertidor de monedas para facturación'
      ],
      primaryAction: 'Abrir Herramientas'
    }
  ];

  const filteredModules = modules.filter(mod => {
    const matchesCategory = selectedCategory === 'todos' || mod.category === selectedCategory;
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* Banner de Bienvenida del Contador */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700">
        
        {/* Glow & Decorative elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Portal del Contador Publico & Auditor
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Periodo Fiscal 2026
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Centro de Control Contable & Conciliación
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Hola, <span className="font-bold text-white">{currentUser?.name || 'Contador'}</span>. Selecciona la herramienta o módulo fiscal en el que deseas trabajar hoy. Todas tus fuentes de datos y ERP Grupo MV están sincronizados.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex flex-wrap md:flex-col gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${erpConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="text-xs text-slate-300">Conexión ERP Grupo MV:</span>
              <span className="text-xs font-bold text-emerald-300">{erpConnected ? 'En línea' : 'Standby'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-slate-300">Compras ERP:</span>
              <span className="text-xs font-black text-white">{erpCount} registros</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span className="text-xs text-slate-300">Proveedores:</span>
              <span className="text-xs font-black text-white">{suppliersCount} registrados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Búsqueda y Categorías */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Input de Búsqueda */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar herramienta, módulo o función..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Filtro por Categorías */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'todos', label: '🌐 Todos los Módulos' },
            { id: 'conciliacion', label: '🔄 Conciliación' },
            { id: 'fiscal', label: '🛡️ Fiscal & SAT' },
            { id: 'impuestos', label: '💰 Impuestos' },
            { id: 'reportes', label: '💼 Proveedores' },
            { id: 'utilidades', label: '🛠️ Utilidades' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModules.map((mod) => {
          const Icon = mod.icon;

          return (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className="group relative bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle Gradient Line Top */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${mod.gradient}`} />

              <div>
                {/* Header de Card */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-tr ${mod.gradient} text-white shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${mod.badgeColor}`}>
                    {mod.badge}
                  </span>
                </div>

                {/* Título & Subtítulo */}
                <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-700 transition-colors tracking-tight mb-1">
                  {mod.title}
                </h3>
                <p className="text-xs font-bold text-slate-500 mb-3">
                  {mod.subtitle}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {mod.description}
                </p>

                {/* Lista de Funciones */}
                <ul className="flex flex-col gap-2 mb-6 pt-3 border-t border-slate-100">
                  {mod.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action & Stats Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-slate-400 truncate">
                  {mod.stats}
                </span>
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 group-hover:bg-emerald-600 text-white text-xs font-extrabold transition-colors shadow-xs shrink-0">
                  <span>{mod.primaryAction}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredModules.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-900 mb-1">No se encontraron módulos</h4>
          <p className="text-xs text-slate-500">Prueba con otra palabra clave en la búsqueda o borra los filtros.</p>
        </div>
      )}

      {/* Footer Info / Soporte */}
      <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600" />
          <span><strong>Super App Contable Grupo MV v2.5</strong> — Diseñado para Contabilidad General, Auditoría Fiscal y Cuentas por Pagar.</span>
        </div>
        <div className="flex items-center gap-3 font-semibold text-slate-700">
          <span>Soporte Técnico</span>
          <span>•</span>
          <span>Guía de Uso</span>
        </div>
      </div>

    </div>
  );
};
