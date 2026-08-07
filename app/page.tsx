'use client';

import React, { useState } from 'react';
import { useReconciliation } from '@/hooks/useReconciliation';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import { Navbar } from '@/components/Navbar';
import { FileUploadZone } from '@/components/FileUploadZone';
import { MetricsOverview } from '@/components/MetricsOverview';
import { ReconciliationTabs } from '@/components/ReconciliationTabs';
import { SupplierBreakdownCard } from '@/components/SupplierBreakdownCard';
import { UserManagementModal } from '@/components/UserManagementModal';
import { ApiCredentialsModal } from '@/components/ApiCredentialsModal';
import { SettingsModal } from '@/components/SettingsModal';
import { AccountantHub, ModuleId } from '@/components/AccountantHub';
import { AuditoriaSatModule } from '@/components/modules/AuditoriaSatModule';
import { CalculadoraImpuestosModule } from '@/components/modules/CalculadoraImpuestosModule';
import { ControlProveedoresModule } from '@/components/modules/ControlProveedoresModule';
import { UtilidadesContadorModule } from '@/components/modules/UtilidadesContadorModule';

import {
  Building,
  CheckCircle2,
  Play,
  SlidersHorizontal,
  ShieldAlert,
  RotateCcw,
  Calendar,
  Loader2,
  Globe,
  Sliders,
  Filter,
  ArrowLeft
} from 'lucide-react';

export default function Home() {
  const { currentUser } = useAuth();
  const [activeModule, setActiveModule] = useState<ModuleId>('hub');
  
  const { toleranciaDiferencia, filtroProveedorRFC, updateSettings } = useSettings();
  const {
    satFile,
    setSatFile,
    satData,
    erpData,
    fileName,
    resultado,
    isLoading,
    fileError,
    erpError,
    is401Error,
    apiToken,
    fechaInicial,
    fechaFinal,
    lastFetchInfo,
    availableSuppliers,
    setFechaInicial,
    setFechaFinal,
    saveApiToken,
    loadDemoERPData,
    startReconciliation,
    resetAll,
  } = useReconciliation();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const isSuperAdmin = currentUser?.role === 'admin' || currentUser?.email === 'jorge.ramirez@grupomv.mx';

  const isFileReady = Boolean(satFile || fileName);
  const faltantesCount = resultado?.metricas.faltantesERPCount || 0;
  const canceladasCount = resultado?.metricas.canceladasSATCount || 0;
  const tieneAlertas = faltantesCount > 0 || canceladasCount > 0;

  const handleStartReconciliation = (overrideProveedor?: string) => {
    const provToUse = overrideProveedor !== undefined ? overrideProveedor : filtroProveedorRFC;
    startReconciliation(undefined, provToUse);
  };

  const handleSelectProveedorForReconciliation = (rfcOrNombre: string) => {
    updateSettings({ filtroProveedorRFC: rfcOrNombre });
    setActiveModule('conciliacion');
    if (isFileReady) {
      startReconciliation(undefined, rfcOrNombre);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Navbar */}
      <Navbar
        onRefreshERP={() => handleStartReconciliation()}
        isLoadingERP={isLoading}
        erpCount={erpData.length}
        erpConnected={!erpError}
        onOpenUserManagement={() => setIsUserModalOpen(true)}
        activeModule={activeModule}
        onNavigateModule={(mod) => setActiveModule(mod)}
      />

      {/* Modals */}
      <UserManagementModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
      />

      {/* Modal de Parametrización y Desplegable de Proveedores */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        toleranciaActual={toleranciaDiferencia}
        filtroProveedorActual={filtroProveedorRFC}
        opcionesProveedores={availableSuppliers}
        onSaveSettings={(nuevaTol, nuevoFiltro) => {
          updateSettings({ toleranciaDiferencia: nuevaTol, filtroProveedorRFC: nuevoFiltro });
          if (isFileReady) {
            startReconciliation(undefined, nuevoFiltro);
          }
        }}
      />

      {isSuperAdmin && (
        <ApiCredentialsModal
          isOpen={isApiModalOpen}
          onClose={() => setIsApiModalOpen(false)}
          currentToken={apiToken}
          onSaveToken={saveApiToken}
          onLoadDemo={loadDemoERPData}
          isLoading={isLoading}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
        
        {/* MODULO 0: HUB INICIAL / CENTRO DE CONTROL DEL CONTADOR */}
        {activeModule === 'hub' && (
          <AccountantHub
            onSelectModule={(mod) => setActiveModule(mod)}
            erpCount={erpData.length}
            erpConnected={!erpError}
            suppliersCount={availableSuppliers.length}
          />
        )}

        {/* MODULO 1: CONCILIACION DE COMPRAS PARAL vs SAT */}
        {activeModule === 'conciliacion' && (
          <div className="flex flex-col gap-5">
            
            {/* Header / Back to Hub */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveModule('hub')}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver al Menú Principal</span>
              </button>

              <span className="text-xs text-slate-500 font-medium">
                Módulo en Producción • API Grupo MV Conectado
              </span>
            </div>

            {/* Control Card Unificado */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col gap-4">
              
              {/* Header Compacto */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Conciliación Compras PARAL vs. SAT
                  </h2>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  
                  {/* Desplegable Rápido de Proveedores Detectados */}
                  {availableSuppliers.length > 0 && (
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-300">
                      <Building className="w-3.5 h-3.5 text-emerald-600 ml-1.5" />
                      <select
                        value={filtroProveedorRFC}
                        onChange={(e) => {
                          const selected = e.target.value;
                          updateSettings({ filtroProveedorRFC: selected });
                          if (isFileReady) {
                            startReconciliation(undefined, selected);
                          }
                        }}
                        className="bg-transparent font-extrabold text-xs text-slate-800 outline-none cursor-pointer max-w-[180px] truncate"
                      >
                        <option value="">🏢 Todos los Proveedores ({availableSuppliers.length})</option>
                        {availableSuppliers.map((prov, pIdx) => (
                          <option key={pIdx} value={prov.rfc || prov.nombre}>
                            {prov.nombre} ({prov.count})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Botón Parámetros / Ajustes */}
                  <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold ${
                      filtroProveedorRFC
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                        : 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-700'
                    }`}
                    title="Configurar Parámetros de Conciliación"
                  >
                    <Sliders className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Parámetros {filtroProveedorRFC ? `(🎯 ${filtroProveedorRFC})` : `($${toleranciaDiferencia.toFixed(2)})`}
                    </span>
                  </button>

                  <button
                    onClick={resetAll}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                    title="Reiniciar"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Limpiar</span>
                  </button>

                  {/* Botón Token EXCLUSIVO para Super Admin */}
                  {isSuperAdmin && (
                    <button
                      onClick={() => setIsApiModalOpen(true)}
                      className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold"
                      title="Configurar Token (Solo Super Admin)"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-amber-800">Token</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Grid Compacto: Cargar Excel + Fechas + Botón Conciliar */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50/70 p-3 rounded-2xl border border-slate-200">
                
                {/* Cargar Archivo SAT (5 cols) */}
                <div className="md:col-span-5">
                  <FileUploadZone
                    onFileSelected={(file) => {
                      setSatFile(file);
                      startReconciliation(file, filtroProveedorRFC);
                    }}
                    fileName={fileName}
                    fileError={fileError}
                  />
                </div>

                {/* Filtro Rango de Fechas ERP (4 cols) */}
                <div className="md:col-span-4 bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col gap-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      Rango Fechas ERP:
                    </span>
                    {lastFetchInfo && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        API: {lastFetchInfo.fechaInicialStr} a {lastFetchInfo.fechaFinalStr}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Inicio:</span>
                      <input
                        type="date"
                        value={fechaInicial}
                        onChange={(e) => setFechaInicial(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Fin:</span>
                      <input
                        type="date"
                        value={fechaFinal}
                        onChange={(e) => setFechaFinal(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Botón Ejecutar Conciliación (3 cols) */}
                <div className="md:col-span-3 flex flex-col gap-1">
                  <button
                    onClick={() => handleStartReconciliation()}
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Ejecutar Conciliación</span>
                      </>
                    )}
                  </button>

                  <span className="text-[10px] text-center text-slate-400 font-medium">
                    {erpData.length > 0 ? `🟢 ${erpData.length} registros cargados` : 'Esperando datos...'}
                  </span>
                </div>
              </div>

              {/* Banner de Estado / Errores */}
              {is401Error && isSuperAdmin && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Se requieren credenciales de la API de Grupo MV.</span>
                  </div>
                  <button
                    onClick={() => setIsApiModalOpen(true)}
                    className="px-3 py-1 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 cursor-pointer"
                  >
                    Configurar Token
                  </button>
                </div>
              )}
            </div>

            {/* Si aún no se ejecuta resultado, mostrar banner explicativo */}
            {!resultado && (
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800">
                <div className="flex flex-col gap-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-black uppercase">
                      Motor de Conciliación Listo
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight">
                    Auditoría Automática de Compras y Facturación
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Sube tu auxiliar de compras en Excel o haz clic en <strong>"Ejecutar Conciliación"</strong> para cruzar automáticamente las compras registradas en el ERP de Grupo MV contra las facturas reportadas.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleStartReconciliation()}
                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Iniciar Auditoría ERP</span>
                  </button>
                </div>
              </div>
            )}

            {/* Si ya hay resultados */}
            {resultado && (
              <>
                {/* Desglose resumido por Proveedor */}
                <SupplierBreakdownCard
                  proveedores={availableSuppliers}
                  filtroActual={filtroProveedorRFC}
                  onSelectProveedor={(rfcOrNombre) => {
                    updateSettings({ filtroProveedorRFC: rfcOrNombre });
                    startReconciliation(undefined, rfcOrNombre);
                  }}
                />

                {/* Métricas Globales */}
                <MetricsOverview metricas={resultado.metricas} />

                {/* Tabla Auditable en Pestañas */}
                <ReconciliationTabs resultado={resultado} />
              </>
            )}

          </div>
        )}

        {/* MODULO 2: AUDITORIA CFDI & SAT 69-B */}
        {activeModule === 'auditoria_sat' && (
          <AuditoriaSatModule onBackToHub={() => setActiveModule('hub')} />
        )}

        {/* MODULO 3: CALCULADORA DE IMPUESTOS */}
        {activeModule === 'impuestos' && (
          <CalculadoraImpuestosModule onBackToHub={() => setActiveModule('hub')} />
        )}

        {/* MODULO 4: CONTROL DE PROVEEDORES & CXP */}
        {activeModule === 'proveedores' && (
          <ControlProveedoresModule
            onBackToHub={() => setActiveModule('hub')}
            availableSuppliers={availableSuppliers}
            onSelectProveedorForReconciliation={handleSelectProveedorForReconciliation}
          />
        )}

        {/* MODULO 5: UTILIDADES DEL CONTADOR */}
        {activeModule === 'utilidades' && (
          <UtilidadesContadorModule onBackToHub={() => setActiveModule('hub')} />
        )}

      </main>
    </div>
  );
}
