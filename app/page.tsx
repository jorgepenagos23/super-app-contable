'use client';

import React, { useState } from 'react';
import { useReconciliation } from '@/hooks/useReconciliation';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import { useSupplierProfiles } from '@/hooks/useSupplierProfiles';
import { Navbar } from '@/components/Navbar';
import { FileUploadZone } from '@/components/FileUploadZone';
import { MetricsOverview } from '@/components/MetricsOverview';
import { ReconciliationTabs } from '@/components/ReconciliationTabs';
import { SupplierBreakdownCard } from '@/components/SupplierBreakdownCard';
import { UserManagementModal } from '@/components/UserManagementModal';
import { ApiCredentialsModal } from '@/components/ApiCredentialsModal';
import { SettingsModal } from '@/components/SettingsModal';
import { SupplierConfigModal } from '@/components/SupplierConfigModal';
import { AccountantHub, ModuleId } from '@/components/AccountantHub';

import {
  Building,
  CheckCircle2,
  Play,
  SlidersHorizontal,
  ShieldAlert,
  RotateCcw,
  Calendar,
  Loader2,
  Sliders,
  ArrowLeft,
  Building2,
  Zap
} from 'lucide-react';

export default function Home() {
  const { currentUser } = useAuth();
  const [activeModule, setActiveModule] = useState<ModuleId>('conciliacion');
  
  const { toleranciaDiferencia, filtroProveedorRFC, updateSettings } = useSettings();
  const { saveProfile, getProfile, removeProfile } = useSupplierProfiles();

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
    uploadSatFile,
    startReconciliation,
    resetAll,
  } = useReconciliation();

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSupplierConfigModalOpen, setIsSupplierConfigModalOpen] = useState(false);
  const [selectedSupplierForConfig, setSelectedSupplierForConfig] = useState('');

  const isSuperAdmin = currentUser?.role === 'admin' || currentUser?.email === 'jorge.ramirez@grupomv.mx';

  const isFileReady = Boolean(satFile || fileName);

  const handleStartReconciliation = (overrideProveedor?: string) => {
    const provToUse = overrideProveedor !== undefined ? overrideProveedor : filtroProveedorRFC;
    startReconciliation(undefined, provToUse);
  };

  const handleOpenSupplierConfig = (rfcOrNombre: string) => {
    setSelectedSupplierForConfig(rfcOrNombre);
    setIsSupplierConfigModalOpen(true);
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

      {/* Modal de Parametrización */}
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

      {/* Modal de Configuración de Proveedor */}
      <SupplierConfigModal
        isOpen={isSupplierConfigModalOpen}
        onClose={() => setIsSupplierConfigModalOpen(false)}
        opcionesProveedores={availableSuppliers}
        initialSupplier={selectedSupplierForConfig}
        onSaveProfile={saveProfile}
        getProfile={getProfile}
        onDeleteProfile={removeProfile}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5">
        
        {/* HUB INICIAL */}
        {activeModule === 'hub' && (
          <AccountantHub
            onSelectModule={(mod) => setActiveModule(mod)}
            erpCount={erpData.length}
            erpConnected={!erpError}
            suppliersCount={availableSuppliers.length}
          />
        )}

        {/* WORKSPACE DE CONCILIACIÓN DE COMPRAS PARAL vs SAT */}
        {activeModule === 'conciliacion' && (
          <div className="flex flex-col gap-5">
            
            {/* Header Navegación */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveModule('hub')}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Menú Principal</span>
              </button>
            </div>

            {/* Control Panel Minimalista */}
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs flex flex-col gap-3">

              {/* Encabezado con Logos de SAT y FROG ERP */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img src="/logos/sat.png" alt="SAT México" className="h-8 object-contain drop-shadow-xs rounded-lg" />
                  <span className="text-slate-400 font-medium text-xs">VS</span>
                  <img src="/logos/frog.png" alt="FROG ERP Grupo MV" className="h-8 object-contain drop-shadow-xs rounded-lg" />
                </div>

                <span className="text-xs text-slate-500 font-normal">
                  Conciliación Automatizada de Compras
                </span>
              </div>

              {/* Grid Principal: 1. Cargar Archivo, 2. Rango Fechas, 3. UNICO BOTÓN CONCILIAR */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
                
                {/* 1. Cargar Archivo SAT (5 cols) */}
                <div className="md:col-span-5">
                  <FileUploadZone
                    onFileSelect={(file) => {
                      uploadSatFile(file);
                    }}
                    onFileSelected={(file) => {
                      uploadSatFile(file);
                    }}
                    fileName={fileName}
                    fileError={fileError}
                  />
                </div>

                {/* 2. Rango de Fechas ERP (4 cols) */}
                <div className="md:col-span-4 bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col gap-1 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      Rango Fechas ERP:
                    </span>
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

                {/* 3. ÚNICO BOTÓN PRINCIPAL DE CONCILIACIÓN (3 cols) */}
                <div className="md:col-span-3 flex flex-col gap-1">
                  <button
                    onClick={() => {
                      if (!isFileReady) {
                        alert('⚠️ Por favor cargue primero su archivo Excel o CSV del SAT antes de ejecutar la conciliación.');
                        return;
                      }
                      handleStartReconciliation();
                    }}
                    disabled={!isFileReady || isLoading}
                    className={`w-full py-2.5 px-4 font-medium text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 border ${
                      isFileReady
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer active:scale-[0.98] border-emerald-600'
                        : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    }`}
                    title={isFileReady ? 'Ejecutar Conciliación SAT vs ERP' : 'Cargue primero un archivo Excel del SAT'}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                        <span>Procesando...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Ejecutar Conciliación</span>
                      </>
                    )}
                  </button>

                  <span className="text-[10px] text-center text-slate-400 font-medium">
                    {isFileReady ? '🟢 Archivo cargado • Por Conciliar' : '⚠️ Archivo Excel requerido'}
                  </span>
                </div>
              </div>

              {/* Banner Informativo Conciso "Por Conciliar" */}
              {isFileReady && !resultado && !isLoading && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900 shadow-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                    <span>
                      📄 <strong>{fileName}</strong> ({satData.length.toLocaleString('es-MX')} facturas) — <span className="text-emerald-700">Listo para conciliar</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Mensaje Informativo / Estado */}
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

            {/* Si ya hay resultados */}
            {resultado && (
              <>
                {/* Desglose resumido por Proveedor */}
                <SupplierBreakdownCard
                  conciliadas={resultado.conciliadas}
                  montoTotalConciliadas={resultado.metricas.montoConciliadas}
                  onOpenSupplierConfig={handleOpenSupplierConfig}
                />

                {/* Métricas Globales */}
                <MetricsOverview metricas={resultado.metricas} />

                {/* Tabla Auditable en Pestañas */}
                <ReconciliationTabs resultado={resultado} />
              </>
            )}

          </div>
        )}

      </main>
    </div>
  );
}
