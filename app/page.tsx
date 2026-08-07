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
  Filter
} from 'lucide-react';

export default function Home() {
  const { currentUser } = useAuth();
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Navbar */}
      <Navbar
        onRefreshERP={() => handleStartReconciliation()}
        isLoadingERP={isLoading}
        erpCount={erpData.length}
        erpConnected={!erpError}
        onOpenUserManagement={() => setIsUserModalOpen(true)}
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
                onFileSelect={(file) => setSatFile(file)}
                isLoading={isLoading}
                fileName={satFile ? satFile.name : fileName}
                totalParsedRows={satData.length}
                onClearFile={resetAll}
              />
            </div>

            {/* Fecha Desde (2 cols) */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-0.5">
                Desde
              </label>
              <input
                type="date"
                disabled={!isFileReady || isLoading}
                value={fechaInicial}
                onChange={(e) => setFechaInicial(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 font-extrabold text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-emerald-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            {/* Fecha Hasta (2 cols) */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase mb-0.5">
                Hasta
              </label>
              <input
                type="date"
                disabled={!isFileReady || isLoading}
                value={fechaFinal}
                onChange={(e) => setFechaFinal(e.target.value)}
                className="w-full bg-white border border-slate-300 text-slate-900 font-extrabold text-xs rounded-xl px-2.5 py-1.5 outline-none focus:border-emerald-500 cursor-pointer disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            {/* Botón Conciliar (3 cols) */}
            <div className="md:col-span-3 pt-4 md:pt-0">
              <button
                onClick={() => handleStartReconciliation()}
                disabled={!isFileReady || isLoading}
                className={`w-full h-10 flex items-center justify-center gap-2 px-4 rounded-xl font-black text-xs transition-all cursor-pointer shadow-xs ${
                  !isFileReady
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98 shadow-emerald-600/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Cruzando...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Conciliar</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Mensaje de Respuesta del ERP */}
          {lastFetchInfo && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-emerald-800 bg-emerald-50/80 border border-emerald-200 p-2.5 rounded-xl">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{lastFetchInfo}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {filtroProveedorRFC && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-black text-[10px] border border-amber-300 flex items-center gap-1">
                    🎯 Proveedor: {filtroProveedorRFC}
                    <button
                      onClick={() => {
                        updateSettings({ filtroProveedorRFC: '' });
                        if (isFileReady) handleStartReconciliation('');
                      }}
                      className="text-amber-700 hover:text-amber-950 font-black ml-1"
                    >
                      ×
                    </button>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 font-black text-[10px]">
                  Tolerancia: ${toleranciaDiferencia.toFixed(2)} MXN
                </span>
              </div>
            </div>
          )}

          {/* Error ERP */}
          {erpError && (
            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{erpError}</span>
              </div>
              {is401Error && isSuperAdmin && (
                <button
                  onClick={() => setIsApiModalOpen(true)}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[11px]"
                >
                  Token Admin
                </button>
              )}
            </div>
          )}

          {/* Alertas post conciliación */}
          {resultado && (
            tieneAlertas ? (
              <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 text-xs font-bold">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <span className="font-extrabold text-rose-900 block">
                    ⚠️ Discrepancias encontradas: {resultado.metricas.faltantesERPCount} facturas faltan en ERP y {resultado.metricas.canceladasSATCount} canceladas en SAT.
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>¡100% Conciliado perfectamente! Todas las facturas coinciden con el ERP.</span>
              </div>
            )
          )}

        </div>

        {/* Error de archivo */}
        {fileError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium">
            <span className="font-bold text-rose-900">Error: </span>{fileError}
          </div>
        )}

        {/* RESULTADOS */}
        {resultado && <MetricsOverview metricas={resultado.metricas} />}
        
        {/* DESGLOSE POR PROVEEDORES */}
        {resultado && (
          <SupplierBreakdownCard
            conciliadas={resultado.conciliadas}
            montoTotalConciliadas={resultado.metricas.montoConciliadas}
          />
        )}

        {/* TABLAS DETALLADAS */}
        {resultado && <ReconciliationTabs resultado={resultado} />}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-slate-800">Grupo MV • PARAL</span>
            <span>- Super App Contable</span>
          </div>
          <div>
            <span>Conciliación Fiscal por UUID (XML SAT vs ERP)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
