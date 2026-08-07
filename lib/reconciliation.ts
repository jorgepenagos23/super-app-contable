import {
  FacturaSAT,
  FacturaERP,
  ItemConciliado,
  ItemFaltanteERP,
  ItemSobranteERP,
  ResultadoConciliacion,
  MetricasConciliacion,
} from '@/types/reconciliation';

export function normalizeText(text: string): string {
  if (!text) return '';
  return String(text)
    .toUpperCase()
    .replace(/S\.A\. DE C\.V\.|S\.A\.B\. DE C\.V\.|S\. DE R\.L\. DE C\.V\.|SA DE CV|SRL DE CV|S A DE C V/g, '')
    .replace(/[^A-Z0-9]/g, '');
}

/**
 * Normaliza respuestas de la API del ERP Grupo MV (Lista_Compras_773)
 */
export function normalizeERPData(rawInput: any): FacturaERP[] {
  let rawErpList: any[] = [];

  if (Array.isArray(rawInput)) {
    rawErpList = rawInput;
  } else if (rawInput && typeof rawInput === 'object') {
    for (const key of ['data', 'compras', 'result', 'items', 'rows', 'table', 'LISTA', 'REPORTES_API']) {
      if (Array.isArray(rawInput[key])) {
        rawErpList = rawInput[key];
        break;
      }
    }
    if (rawErpList.length === 0) {
      const possibleArr = Object.values(rawInput).find(val => Array.isArray(val));
      if (possibleArr) rawErpList = possibleArr as any[];
    }
  }

  if (!Array.isArray(rawErpList)) return [];

  const facturasErp: FacturaERP[] = [];

  for (const item of rawErpList) {
    if (!item || typeof item !== 'object') continue;

    const rawXmlUuid = String(
      item["XML / UUID"] || item["XML/UUID"] || item["XML"] || item.UUID || item.uuid || item.FolioFiscal || ''
    ).trim();

    const refFactura = String(item["Ref. Factura"] || item.FOLIO || item.folio || '').trim();
    const remision = String(item.Remision || item.REMISION || item.DOCUMENTO || item.documento || '').trim();

    const proveedor = String(
      item.proveedor || item.PROVEEDOR || item.NOMBRE_PROVEEDOR || item.NombreProveedor ||
      item.RAZON_SOCIAL || item.RazonSocial || 'PROVEEDOR ERP'
    ).trim();

    const fecha = String(
      item.fecha_recepcion || item.FECHA_RECEPCION || item.FECHA || item.fecha || ''
    ).trim();

    const rawTotal = item["TOTAL FACTURA"] !== undefined 
      ? item["TOTAL FACTURA"] 
      : (item["Total Recibido (FROG)"] !== undefined ? item["Total Recibido (FROG)"] : (item.TOTAL || item.total || 0));

    const total = typeof rawTotal === 'number' 
      ? rawTotal 
      : parseFloat(String(rawTotal).replace(/[^0-9.-]+/g, '')) || 0;

    facturasErp.push({
      uuid: rawXmlUuid || refFactura || remision,
      cleanUuid: normalizeText(rawXmlUuid),
      cleanRef: normalizeText(refFactura),
      cleanRemision: normalizeText(remision),
      cleanProveedor: normalizeText(proveedor),
      proveedor,
      fecha,
      total,
      folio: refFactura,
      documento: remision,
      raw: item,
    } as any);
  }

  return facturasErp;
}

/**
 * Motor de Conciliación Fiscal SAT vs ERP
 * Ordena por defecto todas las listas de MAYOR a MENOR importe / diferencia
 */
export function reconcile(
  satData: FacturaSAT[],
  erpData: FacturaERP[]
): ResultadoConciliacion {
  const erpList = erpData;
  const erpVisited = new Set<number>();

  const conciliadas: (ItemConciliado & { tipoCoincidencia?: string })[] = [];
  const faltantesERP: ItemFaltanteERP[] = [];
  const sobrantesERP: ItemSobranteERP[] = [];

  let canceladasSATCount = 0;
  let montoCanceladasSAT = 0;
  let pueCount = 0;
  let ppdCount = 0;

  for (const sat of satData) {
    const satUuidClean = normalizeText(sat.uuid);
    const satFolioClean = normalizeText(sat.folio || '');
    const satProveedorClean = normalizeText(sat.nombreEmisor);

    const satFirst3 = satUuidClean.length >= 6 ? satUuidClean.slice(0, 3) : '';
    const satLast3 = satUuidClean.length >= 6 ? satUuidClean.slice(-3) : '';
    const satAbbrevCombined = `${satFirst3}${satLast3}`;

    if (sat.estatus === 'Cancelado') {
      canceladasSATCount++;
      montoCanceladasSAT += sat.total;
    }

    if (sat.metodoPago === 'PUE') pueCount++;
    else if (sat.metodoPago === 'PPD') ppdCount++;

    let matchIdx = -1;
    let matchType = '';

    // REGLA 1: FROG ERP 3-3 (Primeros 3 + Últimos 3)
    if (satFirst3 && satLast3) {
      for (let i = 0; i < erpList.length; i++) {
        if (erpVisited.has(i)) continue;
        const erpUuidClean = (erpList[i] as any).cleanUuid;
        if (!erpUuidClean || erpUuidClean.length < 6) continue;

        if (
          erpUuidClean === satAbbrevCombined ||
          (erpUuidClean.startsWith(satFirst3) && erpUuidClean.endsWith(satLast3)) ||
          (satUuidClean.startsWith(erpUuidClean.slice(0, 3)) && satUuidClean.endsWith(erpUuidClean.slice(-3)))
        ) {
          matchIdx = i;
          matchType = `Amarre FROG ERP (${satFirst3}...${satLast3})`;
          break;
        }
      }
    }

    // REGLA 2: UUID COMPLETO
    if (matchIdx === -1 && satUuidClean.length >= 6) {
      for (let i = 0; i < erpList.length; i++) {
        if (erpVisited.has(i)) continue;
        const erpUuidClean = (erpList[i] as any).cleanUuid;
        if (!erpUuidClean) continue;

        if (satUuidClean === erpUuidClean || satUuidClean.includes(erpUuidClean) || erpUuidClean.includes(satUuidClean)) {
          matchIdx = i;
          matchType = 'Amarre por XML / UUID Completo';
          break;
        }
      }
    }

    // REGLA 3: REF. FACTURA / FOLIO
    if (matchIdx === -1 && satFolioClean.length >= 3) {
      for (let i = 0; i < erpList.length; i++) {
        if (erpVisited.has(i)) continue;
        const erpItem = erpList[i] as any;

        if (
          (erpItem.cleanRef && (satFolioClean.includes(erpItem.cleanRef) || erpItem.cleanRef.includes(satFolioClean))) ||
          (erpItem.cleanRemision && (satFolioClean.includes(erpItem.cleanRemision) || erpItem.cleanRemision.includes(satFolioClean)))
        ) {
          matchIdx = i;
          matchType = 'Amarre por Ref. Factura / Folio';
          break;
        }
      }
    }

    // REGLA 4: PROVEEDOR + TOTAL EXACTO
    if (matchIdx === -1 && satProveedorClean.length >= 3) {
      for (let i = 0; i < erpList.length; i++) {
        if (erpVisited.has(i)) continue;
        const erpItem = erpList[i] as any;
        const totalDiff = Math.abs(sat.total - erpItem.total);

        if (
          totalDiff <= 1.0 &&
          (satProveedorClean.includes(erpItem.cleanProveedor) || erpItem.cleanProveedor.includes(satProveedorClean))
        ) {
          matchIdx = i;
          matchType = 'Amarre por Proveedor + Total ($)';
          break;
        }
      }
    }

    // REGLA 5: TOTAL EXACTO
    if (matchIdx === -1 && sat.total > 0) {
      for (let i = 0; i < erpList.length; i++) {
        if (erpVisited.has(i)) continue;
        const erpItem = erpList[i] as any;
        const totalDiff = Math.abs(sat.total - erpItem.total);

        if (totalDiff <= 0.05) {
          matchIdx = i;
          matchType = 'Amarre por Importe Total ($)';
          break;
        }
      }
    }

    if (matchIdx !== -1) {
      erpVisited.add(matchIdx);
      const erpMatch = erpList[matchIdx];
      const dif = Math.abs(sat.total - erpMatch.total);

      conciliadas.push({
        uuid: sat.uuid,
        rfcEmisor: sat.rfcEmisor,
        nombreEmisor: sat.nombreEmisor,
        fechaSAT: sat.fecha,
        fechaERP: erpMatch.fecha,
        totalSAT: sat.total,
        totalERP: erpMatch.total,
        diferencia: Number(dif.toFixed(2)),
        estatusSAT: sat.estatus,
        metodoPagoSAT: sat.metodoPago,
        tipoCoincidencia: matchType,
      } as any);
    } else {
      faltantesERP.push({
        uuid: sat.uuid,
        rfcEmisor: sat.rfcEmisor,
        nombreEmisor: sat.nombreEmisor,
        fecha: sat.fecha,
        total: sat.total,
        estatusSAT: sat.estatus,
        metodoPagoSAT: sat.metodoPago,
        folio: sat.folio,
        serie: sat.serie,
      });
    }
  }

  for (let i = 0; i < erpList.length; i++) {
    if (!erpVisited.has(i)) {
      const erp = erpList[i];
      sobrantesERP.push({
        uuid: erp.uuid,
        proveedor: erp.proveedor,
        rfc: erp.rfc,
        fecha: erp.fecha,
        total: erp.total,
        folio: erp.folio,
        serie: erp.serie,
        documento: erp.documento,
      });
    }
  }

  // ========================================================
  // ORDENAR TODAS LAS LISTAS DE MAYOR A MENOR IMPORTE / DIFERENCIA
  // ========================================================
  faltantesERP.sort((a, b) => b.total - a.total);
  sobrantesERP.sort((a, b) => b.total - a.total);
  conciliadas.sort((a, b) => {
    if (b.diferencia !== a.diferencia) {
      return b.diferencia - a.diferencia;
    }
    return b.totalSAT - a.totalSAT;
  });

  const montoTotalSAT = satData.reduce((acc, i) => acc + i.total, 0);
  const montoTotalERP = erpData.reduce((acc, i) => acc + i.total, 0);
  const montoConciliadas = conciliadas.reduce((acc, i) => acc + i.totalSAT, 0);
  const montoFaltantesERP = faltantesERP.reduce((acc, i) => acc + i.total, 0);
  const montoSobrantesERP = sobrantesERP.reduce((acc, i) => acc + i.total, 0);

  const metricas: MetricasConciliacion = {
    totalSAT: satData.length,
    montoTotalSAT,
    totalERP: erpData.length,
    montoTotalERP,
    conciliadasCount: conciliadas.length,
    montoConciliadas,
    faltantesERPCount: faltantesERP.length,
    montoFaltantesERP,
    sobrantesERPCount: sobrantesERP.length,
    montoSobrantesERP,
    canceladasSATCount,
    montoCanceladasSAT,
    pueCount,
    ppdCount,
    diferenciaTotalMonto: Number(Math.abs(montoTotalSAT - montoTotalERP).toFixed(2)),
  };

  return {
    conciliadas,
    faltantesERP,
    sobrantesERP,
    metricas,
  };
}
