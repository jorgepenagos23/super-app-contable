'use client';

import { useState, useEffect, useMemo } from 'react';
import { FacturaSAT, FacturaERP, ResultadoConciliacion } from '@/types/reconciliation';
import { parseExcelSAT } from '@/lib/excel-parser';
import { reconcile, normalizeERPData } from '@/lib/reconciliation';
import { MOCK_ERP_PURCHASES } from '@/lib/mock-erp';

export interface SupplierOption {
  nombre: string;
  rfc: string;
  count: number;
}

export function useReconciliation() {
  const [satFile, setSatFile] = useState<File | null>(null);
  const [satData, setSatData] = useState<FacturaSAT[]>([]);
  const [erpData, setErpData] = useState<FacturaERP[]>([]);
  const [fileName, setFileName] = useState<string>('');
  
  const [resultado, setResultado] = useState<ResultadoConciliacion | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [erpError, setErpError] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [is401Error, setIs401Error] = useState(false);
  const [lastFetchInfo, setLastFetchInfo] = useState<string | null>(null);

  // Rango de fechas por defecto: Enero 2026 (20260101 a 20260131)
  const [fechaInicial, setFechaInicial] = useState<string>('2026-01-01');
  const [fechaFinal, setFechaFinal] = useState<string>('2026-01-31');
  const [apiToken, setApiToken] = useState<string>('');

  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('grupomv_api_token');
      if (savedToken) setApiToken(savedToken);
    }
  }, []);

  const toYYYYMMDD = (dateStr: string) => {
    if (!dateStr) return '';
    return dateStr.replace(/[^0-9]/g, '');
  };

  const formatFechaHuman = (f: string) => {
    if (f && f.length === 8) {
      return `${f.slice(6, 8)}/${f.slice(4, 6)}/${f.slice(0, 4)}`;
    }
    return f;
  };

  // Extraer lista única de proveedores disponibles en el archivo cargado
  const availableSuppliers = useMemo(() => {
    const map = new Map<string, SupplierOption>();

    for (const sat of satData) {
      const key = sat.rfcEmisor || sat.nombreEmisor;
      const existing = map.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(key, {
          nombre: sat.nombreEmisor,
          rfc: sat.rfcEmisor,
          count: 1,
        });
      }
    }

    const list = Array.from(map.values());
    list.sort((a, b) => b.count - a.count);
    return list;
  }, [satData]);

  // Función Principal: Ejecuta la consulta y conciliación
  const startReconciliation = async (customFile?: File, targetSupplierFilter?: string) => {
    const fileToProcess = customFile || satFile;
    if (!fileToProcess && !isDemoMode) {
      setFileError('Por favor seleccione primero su archivo Excel del SAT antes de conciliar.');
      return;
    }

    setIsLoading(true);
    setFileError(null);
    setErpError(null);
    setIs401Error(false);
    setResultado(null);

    const startStr = fechaInicial;
    const endStr = fechaFinal;
    const pFechaInicial = toYYYYMMDD(startStr);
    const pFechaFinal = toYYYYMMDD(endStr);

    try {
      // 1. Leer y parsear el archivo del SAT
      let parsedSat: FacturaSAT[] = [];
      if (fileToProcess) {
        const parseResult = await parseExcelSAT(fileToProcess);
        parsedSat = parseResult.facturas;
        setSatData(parsedSat);
        setFileName(fileToProcess.name);

        if (parseResult.detectedMinDate && parseResult.detectedMaxDate) {
          setFechaInicial(parseResult.detectedMinDate);
          setFechaFinal(parseResult.detectedMaxDate);
        }
      } else {
        parsedSat = satData;
      }

      // 2. Realizar la consulta a la API del ERP
      let currentErpList: FacturaERP[] = [];

      if (isDemoMode) {
        currentErpList = MOCK_ERP_PURCHASES;
        setErpData(MOCK_ERP_PURCHASES);
        setLastFetchInfo(`Modo Prueba: Se cargaron ${MOCK_ERP_PURCHASES.length} compras de ejemplo.`);
      } else {
        const payload = {
          fechaInicial: pFechaInicial,
          fechaFinal: pFechaFinal,
        };

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (apiToken) {
          headers['Authorization'] = `Bearer ${apiToken}`;
        }

        const response = await fetch('/api/compras/paral', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        const json = await response.json();

        if (!response.ok) {
          if (response.status === 401) setIs401Error(true);
          throw new Error(json.details || json.error || 'Error al conectar con el ERP.');
        }

        const rawItems = json.data ? (Array.isArray(json.data) ? json.data : (json.data.data || [])) : [];
        currentErpList = normalizeERPData(rawItems);
        setErpData(currentErpList);

        const fechaIniFormateada = formatFechaHuman(pFechaInicial);
        const fechaFinFormateada = formatFechaHuman(pFechaFinal);

        setLastFetchInfo(
          `Conexión Exitosa con Grupo MV: Se obtuvieron ${currentErpList.length} compras en el ERP (Del ${fechaIniFormateada} al ${fechaFinFormateada}).`
        );
      }

      // 3. Filtrar por Proveedor / RFC seleccionado si aplica
      let filteredSat = parsedSat;
      let filteredErp = currentErpList;

      if (targetSupplierFilter && targetSupplierFilter.trim() !== '' && targetSupplierFilter !== 'ALL') {
        const query = targetSupplierFilter.trim().toLowerCase();
        filteredSat = parsedSat.filter(
          (sat) =>
            sat.nombreEmisor.toLowerCase().includes(query) ||
            sat.rfcEmisor.toLowerCase().includes(query)
        );
        filteredErp = currentErpList.filter(
          (erp) =>
            erp.proveedor.toLowerCase().includes(query) ||
            (erp.rfc && erp.rfc.toLowerCase().includes(query)) ||
            (erp.uuid && erp.uuid.toLowerCase().includes(query))
        );

        setLastFetchInfo(
          `🎯 Conciliación dirigida para "${targetSupplierFilter}": ${filteredSat.length} facturas SAT y ${filteredErp.length} compras ERP filtradas.`
        );
      }

      // 4. Ejecutar la conciliación
      const resultadoConciliado = reconcile(filteredSat, filteredErp);
      setResultado(resultadoConciliado);

    } catch (err: any) {
      console.error('Error en conciliación:', err);
      if (!isDemoMode && String(err.message).includes('401')) {
        setIs401Error(true);
      }
      setErpError(err.message || 'Error al ejecutar la conciliación.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoERPData = () => {
    setIsDemoMode(true);
    setErpData(MOCK_ERP_PURCHASES);
    setErpError(null);
  };

  const resetAll = () => {
    setSatFile(null);
    setSatData([]);
    setErpData([]);
    setFileName('');
    setResultado(null);
    setFileError(null);
    setErpError(null);
    setIs401Error(false);
    setLastFetchInfo(null);
  };

  const saveApiToken = (token: string) => {
    setApiToken(token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('grupomv_api_token', token);
    }
  };

  return {
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
    isDemoMode,
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
  };
}
