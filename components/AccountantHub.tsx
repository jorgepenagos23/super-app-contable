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
  CheckCircle2,
  Info,
  Building,
  Sliders,
  Scale,
  Database
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ModuleDetailsModal, ModuleDetailItem } from './ModuleDetailsModal';

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
  const [selectedDetailModal, setSelectedDetailModal] = useState<ModuleDetailItem | null>(null);

  const modulesData: (ModuleDetailItem & {
    category: string;
    icon: any;
    stats: string;
    features: string[];
  })[] = [
    {
      id: 'conciliacion',
      category: 'conciliacion',
      title: 'Conciliación Compras PARAL vs. SAT',
      subtitle: 'Auditoría y Cruce Automatizado de Facturación ERP',
      description: 'Herramienta institucional para el cotejo masivo de auxiliares de compras (Excel/XML) contra los registros ERP de Grupo MV y la base de datos fiscal.',
      badge: '🟢 Operativo / Producción',
      normativa: 'Art. 28 CFF (Contabilidad Fiscal) & Anexo 20 del SAT',
      icon: FileSpreadsheet,
      stats: `${erpCount} compras ERP • ${suppliersCount} proveedores`,
      entradas: [
        'Archivos auxiliares de compras (.xlsx / .csv)',
        'Conexión API REST ERP Grupo MV',
        'Rango de fechas y filtros por RFC'
      ],
      salidas: [
        'Matriz de facturas conciliadas vs. faltantes',
        'Reporte de discrepancias de importes e IVA',
        'Exportable ejecutivo a Excel con fórmulas'
      ],
      funcionesClave: [
        'Cruce automático por Folio Fiscal / UUID',
        'Tolerancia configurable de centavos',
        'Emparejamiento masivo por RFC y Monto',
        'Auditoría visual con resumen por proveedor'
      ],
      features: [
        'Cruce masivo por UUID, RFC y Monto',
        'Sincronización directa API Grupo MV',
        'Auditoría de facturas faltantes y canceladas'
      ]
    },
    {
      id: 'auditoria_sat',
      category: 'fiscal',
      title: 'Auditoría CFDI & Validador EFOS 69-B',
      subtitle: 'Monitoreo de Estado SAT y Prevención de Riesgo Fiscal',
      description: 'Módulo de verificación institucional para comprobar la validez de comprobantes fiscales y consultar preventivamente listas de empresas con operaciones simuladas.',
      badge: '🛡️ Verificación Fiscal',
      normativa: 'Art. 69-B CFF (EFOS / EDOS) & WebService SAT',
      icon: ShieldCheck,
      stats: 'Validación SAT activa',
      entradas: [
        'Folio Fiscal UUID de la factura',
        'RFC de proveedores contratados',
        'Estructura XML de CFDI 4.0'
      ],
      salidas: [
        'Dictamen de estatus SAT (Vigente / Cancelado)',
        'Certificado de no coincidencia en 69-B',
        'Registro de trazabilidad para auditoría'
      ],
      funcionesClave: [
        'Consulta directa a base de datos EFOS',
        'Validación de vigencia de folios fiscales',
        'Verificación de sello digital y PAC',
        'Alertas de prevención ante revisiones del SAT'
      ],
      features: [
        'Buscador y validador oficial de UUIDs',
        'Monitoreo preventiva de lista negra EFOS 69-B',
        'Dictamen de estatus de comprobante'
      ]
    },
    {
      id: 'impuestos',
      category: 'impuestos',
      title: 'Calculadora de Impuestos & Retenciones',
      subtitle: 'Determinación de IVA Acreditable e ISR Retenido',
      description: 'Calculadora y papel de trabajo corporativo para la determinación de impuestos mensuales, retenciones de IVA/ISR y proyecciones fiscales.',
      badge: '💰 Papel de Trabajo',
      normativa: 'Art. 1-A Ley del IVA & Art. 106 Ley del ISR 2026',
      icon: Calculator,
      stats: 'Tarifas 2026 Integradas',
      entradas: [
        'Base gravable / Subtotal acumulado',
        'Tasa de IVA aplicable (16%, 8%, 0%)',
        'Régimen fiscal del prestador (RESICO, PM, PF)'
      ],
      salidas: [
        'Papel de trabajo para pago provisional',
        'Desglose de IVA neto a pagar o a favor',
        'Resumen de retenciones a enterar al SAT'
      ],
      funcionesClave: [
        'Cálculo automático de retención 6% IVA',
        'Retención ISR RESICO (1.25%) y Honorarios (10%)',
        'Papel de trabajo listo para copiar',
        'Soporte para tasa general y zona fronteriza'
      ],
      features: [
        'Determinación de IVA neto y retenciones',
        'Soporte RESICO (1.25%) y Honorarios (10%)',
        'Papel de trabajo exportable para declaración'
      ]
    },
    {
      id: 'proveedores',
      category: 'reportes',
      title: 'Directorio de Proveedores & Control CXP',
      subtitle: 'Gestión Institucional de Cuentas por Pagar',
      description: 'Expediente consolidado de proveedores registrados con seguimiento de volumen acumulado de facturación, estado de cuenta y estatus de conciliación.',
      badge: '💼 Cuentas por Pagar',
      normativa: 'Control Interno & Contabilidad Electrónica',
      icon: Building2,
      stats: `${suppliersCount} Proveedores activos`,
      entradas: [
        'Registros fiscales de proveedores',
        'Historial de facturas recibidas',
        'Auxiliares de cuentas por pagar'
      ],
      salidas: [
        'Ranking de compras por proveedor',
        'Estado de conciliación individual',
        'Reporte consolidado de facturación acumulada'
      ],
      funcionesClave: [
        'Directorio completo con RFC y Razón Social',
        'Filtrado instantáneo en módulo de conciliación',
        'Monitoreo de proveedores con mayor volumen',
        'Validación de consistencia fiscal de emisor'
      ],
      features: [
        'Directorio centralizado con RFC validado',
        'Ranking de facturación acumulada',
        'Filtrado directo en módulo de conciliación'
      ]
    },
    {
      id: 'utilidades',
      category: 'utilidades',
      title: 'Utilidades Financieras & INPC / Banxico',
      subtitle: 'Herramientas de Actualización y Recargos Fiscales',
      description: 'Módulo de utilidades contables para el cálculo de recargos por extemporaneidad según el CFF, consulta de Tipo de Cambio oficial Banxico y validador de sintaxis RFC.',
      badge: '🛠️ Utilidades',
      normativa: 'Art. 21 Código Fiscal de la Federación (Recargos)',
      icon: Wrench,
      stats: 'Indicadores Banxico / UMA',
      entradas: [
        'Monto contributivo extemporáneo',
        'Meses de mora / extemporaneidad',
        'Estructura de RFC / Curp a evaluar'
      ],
      salidas: [
        'Cálculo de recargos y actualización INPC',
        'Valor de tipo de cambio USD/EUR del día',
        'Dictamen de validez de RFC y homoclave'
      ],
      funcionesClave: [
        'Calculadora de recargos CFF a tasa del 1.47%',
        'Tipo de cambio oficial Banco de México (FIX)',
        'Validador de sintaxis de RFC para PF y PM',
        'Consulta de valor diario/mensual de UMA'
      ],
      features: [
        'Calculadora de recargos CFF 1.47%',
        'Tipo de cambio oficial Banxico USD / EUR',
        'Validador de estructura de RFC y Homoclave'
      ]
    }
  ];

  const filteredModules = modulesData.filter(mod => {
    const matchesCategory = selectedCategory === 'todos' || mod.category === selectedCategory;
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 pb-10">
      
      {/* Institutional Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-7 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-bold uppercase tracking-wider">
                Grupo MV • Portal Contable
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Ejercicio Fiscal 2026
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Centro de Control del Contador & Módulos Institucionales
            </h2>
            <p className="text-slate-300 text-xs leading-relaxed">
              Panel corporativo de herramientas para contabilidad general, auditoría fiscal de compras y conciliación ERP.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-700/80 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${erpConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-slate-300">Conexión ERP:</span>
              <span className="font-bold text-emerald-400">{erpConnected ? 'En Línea' : 'Standby'}</span>
            </div>
            <div className="h-4 w-px bg-slate-700" />
            <div className="flex items-center gap-1.5 text-slate-300">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span>Compras: <strong className="text-white">{erpCount}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Categories */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filtrar módulos por nombre o función..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'todos', label: 'Todos los Módulos' },
            { id: 'conciliacion', label: 'Conciliación' },
            { id: 'fiscal', label: 'Fiscal & SAT' },
            { id: 'impuestos', label: 'Impuestos' },
            { id: 'reportes', label: 'Proveedores' },
            { id: 'utilidades', label: 'Utilidades' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Institutional Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredModules.map((mod) => {
          const Icon = mod.icon;

          return (
            <div
              key={mod.id}
              className="bg-white rounded-2xl border border-slate-300 p-5 shadow-xs hover:border-slate-400 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-900 text-white">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200">
                    {mod.badge}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-base font-black text-slate-900 tracking-tight mb-0.5">
                  {mod.title}
                </h3>
                <p className="text-[11px] font-bold text-slate-500 mb-2">
                  {mod.subtitle}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {mod.description}
                </p>

                {/* Features List */}
                <ul className="flex flex-col gap-1.5 mb-5 pt-3 border-t border-slate-100">
                  {mod.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-[11px] text-slate-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Card Footer with TWO BUTTONS */}
              <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
                
                {/* Button 1: Ver Detalles (Dialog) */}
                <button
                  onClick={() => setSelectedDetailModal(mod)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-300"
                  title="Ver descripción detallada y marco técnico del módulo"
                >
                  <Info className="w-3.5 h-3.5 text-slate-600" />
                  <span>Ver detalles</span>
                </button>

                {/* Button 2: Abrir Módulo */}
                <button
                  onClick={() => onSelectModule(mod.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Abrir Módulo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal Dialog Component */}
      <ModuleDetailsModal
        isOpen={Boolean(selectedDetailModal)}
        onClose={() => setSelectedDetailModal(null)}
        moduleDetail={selectedDetailModal}
        onConfirmOpenModule={(id) => onSelectModule(id)}
      />

    </div>
  );
};
