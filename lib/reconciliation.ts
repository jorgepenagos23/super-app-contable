import {
  FacturaSAT,
  FacturaERP,
  ItemConciliado,
  ItemFaltanteERP,
  ItemSobranteERP,
  ResultadoConciliacion,
  MetricasConciliacion,
} from '@/types/reconciliation';

/**
 * Normaliza cadenas de texto para comparaciones insensibles a mayúsculas, minúsculas,
 * acentos, espacios, guiones, puntos o caracteres especiales.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return String(text)
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/S\.A\. DE C\.V\.|S\.A\.B\. DE C\.V\.|S\. DE R\.L\. DE C\.V\.|SA DE CV|SRL DE CV|S A DE C V/g, '')
    .replace(/[^A-Z0-9]/g, ''); // Deja únicamente caracteres alfanuméricos A-Z y 0-9
}

/**
 * Busca de forma insensible a mayúsculas/minúsculas y espacios entre múltiples posibles llaves de un objeto.
 */
export function getPropInsensitive(obj: any, keys: string[], defaultVal: string = ''): string {
  if (!obj || typeof obj !== 'object') return defaultVal;

  // 1. Coincidencia directa exacta de llave
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null && String(obj[key]).trim() !== '') {
      return String(obj[key]).trim();
    }
  }

  // 2. Coincidencia normalizada insensible a caso y caracteres especiales
  const objKeys = Object.keys(obj);
  const cleanKeys = keys.map(k => k.toUpperCase().replace(/[^A-Z0-9]/g, ''));

  for (const objKey of objKeys) {
    const cleanObjKey = objKey.toUpperCase().replace(/[^A-Z0-9]/g, '');
    for (const ck of cleanKeys) {
      if (cleanObjKey === ck || (ck.length >= 4 && cleanObjKey.includes(ck))) {
        const val = obj[objKey];
        if (val !== undefined && val !== null && String(val).trim() !== '') {
          return String(val).trim();
        }
      }
    }
  }

  return defaultVal;
}

/**
 * Normaliza respuestas de la API del ERP Grupo MV (Lista_Compras_773 / FROG API)
 * Extrae dinámicamente todos los campos disponibles sin asumir nombres de columna fijos.
 */
export function normalizeERPData(rawInput: any): FacturaERP[] {
  let rawErpList: any[] = [];

  if (Array.isArray(rawInput)) {
    rawErpList = rawInput;
  } else if (rawInput && typeof rawInput === 'object') {
    for (const key of ['data', 'compras', 'result', 'items', 'rows', 'table', 'LISTA', 'REPORTES_API', 'datos']) {
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

  for (let idx = 0; idx < rawErpList.length; idx++) {
    const item = rawErpList[idx];
    if (!item || typeof item !== 'object') continue;

    // Extracción inteligente de UUID / XML
    let rawXmlUuid = getPropInsensitive(item, [
      'XML / UUID', 'XML/UUID', 'XML', 'UUID', 'uuid', 'FolioFiscal', 'FOLIO_FISCAL', 'CLAVE_SAT', 'CFDI_UUID', 'FOLIOFISCAL', 'XML_UUID'
    ]);

    // Búsqueda de respaldo si no se encontró en llaves estándar
    if (!rawXmlUuid) {
      for (const val of Object.values(item)) {
        if (typeof val === 'string') {
          const cleanVal = normalizeText(val);
          if (cleanVal.length >= 6 && cleanVal.length <= 36 && /^[A-Z0-9]+$/.test(cleanVal)) {
            rawXmlUuid = val;
            break;
          }
        }
      }
    }

    // Extracción de Folio y Remisión
    const refFactura = getPropInsensitive(item, [
      'Ref. Factura', 'REF_FACTURA', 'RefFactura', 'FOLIO', 'Folio', 'folio', 'FACTURA', 'Factura', 'NO_FACTURA', 'FOLIO_FACTURA', 'DOCTO', 'DOCUMENTO'
    ]);

    const remision = getPropInsensitive(item, [
      'Remision', 'REMISION', 'DOCUMENTO', 'Documento', 'documento', 'ORDEN_COMPRA', 'REFERENCIA', 'RECIBO', 'NRO_DOCUMENTO', 'DOCUMENTO_ORIGEN'
    ]);

    // Extracción de Proveedor y RFC
    const proveedor = getPropInsensitive(item, [
      'proveedor', 'PROVEEDOR', 'NOMBRE_PROVEEDOR', 'NombreProveedor', 'RAZON_SOCIAL', 'RazonSocial', 'NOMBRE', 'Nombre', 'EMISOR', 'NombreEmisor', 'PROV_NOMBRE'
    ], 'PROVEEDOR GRUPO MV');

    const rfc = getPropInsensitive(item, [
      'RFC', 'Rfc', 'rfc', 'RFC_PROVEEDOR', 'RfcProveedor', 'RFC_EMISOR', 'RfcEmisor', 'RFC PROVEEDOR', 'RFCPROVEEDOR'
    ], '');

    // Extracción de Fecha
    const fecha = getPropInsensitive(item, [
      'fecha_recepcion', 'FECHA_RECEPCION', 'FECHA', 'Fecha', 'fecha', 'FECHA_COMPRA', 'FECHA_EMISION', 'FECHA_DOCTO', 'Fecha_Recepcion'
    ], '');

    // Extracción de Importes (Total, Subtotal, IVA)
    const rawTotalStr = getPropInsensitive(item, [
      'TOTAL FACTURA', 'TOTAL_FACTURA', 'Total Recibido (FROG)', 'TOTAL_RECIBIDO', 'TOTAL', 'Total', 'total', 'IMPORTE_TOTAL', 'MONTO_TOTAL', 'IMPORTE', 'MONTO'
    ], '0');

    const total = parseFloat(String(rawTotalStr).replace(/[^0-9.-]+/g, '')) || 0;

    const rawSubtotalStr = getPropInsensitive(item, ['SUBTOTAL', 'Subtotal', 'subtotal', 'IMPORTE_NETO', 'BASE', 'SUBTOTAL_COMPRA'], '');
    const subtotal = rawSubtotalStr ? parseFloat(String(rawSubtotalStr).replace(/[^0-9.-]+/g, '')) : undefined;

    const rawIvaStr = getPropInsensitive(item, ['IVA ', 'IVA', 'Iva', 'iva', 'IMPUESTO', 'IVA_TRASLADADO', 'MONTO_IVA'], '');
    const iva = rawIvaStr ? parseFloat(String(rawIvaStr).replace(/[^0-9.-]+/g, '')) : undefined;

    // UDN, Orden y Estado
    const udn = getPropInsensitive(item, ['UDN', 'Udn', 'udn', 'SUCURSAL', 'Sucursal', 'ALMACEN', 'EMPRESA'], '');
    const refOrden = getPropInsensitive(item, ['Referencia Orden', 'REFERENCIA_ORDEN', 'ORDEN_COMPRA', 'ORDEN', 'PEDIDO'], '');
    const estadoOrden = getPropInsensitive(item, ['Estado_Orden', 'ESTADO_ORDEN', 'ESTADO', 'ESTATUS', 'STATUS'], '');

    const effectiveUuid = rawXmlUuid || refFactura || remision || `FROG-REG-${idx + 1}`;

    facturasErp.push({
      uuid: effectiveUuid,
      cleanUuid: normalizeText(rawXmlUuid),
      cleanRef: normalizeText(refFactura),
      cleanRemision: normalizeText(remision),
      cleanProveedor: normalizeText(proveedor),
      proveedor,
      rfc,
      fecha,
      total,
      subtotal,
      iva,
      udn,
      refOrden,
      estadoOrden,
      folio: refFactura || remision || effectiveUuid,
      documento: remision || refFactura || 'Remisión Registrada',
      raw: item,
    } as any);
  }

  return facturasErp;
}

/**
 * Motor de Conciliación Fiscal SAT vs ERP
 * Jerarquía estricta para evitar falsos positivos de folios con montos dispares.
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

    // Extracción de los primeros 3 y últimos 3 del UUID del SAT
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

    // ========================================================
    // REGLA 1: AMARRE POR UUID (Completo o 3-3)
    // El Folio Fiscal UUID es el identificador oficial único del SAT.
    // ========================================================
    if (satFirst3 && satLast3 && satFirst3.length === 3 && satLast3.length === 3) {
      for (let i = 0; i < erpList.length; i++) {
        if (erpVisited.has(i)) continue;
        const erpItem = erpList[i] as any;
        const erpUuidClean = erpItem.cleanUuid || '';

        if (erpUuidClean.length >= 6) {
          const erpFirst3 = erpUuidClean.slice(0, 3);
          const erpLast3 = erpUuidClean.slice(-3);

          if (
            (satFirst3 === erpFirst3 && satLast3 === erpLast3) ||
            erpUuidClean === satAbbrevCombined ||
            erpUuidClean === satUuidClean ||
            satUuidClean.includes(erpUuidClean) ||
            erpUuidClean.includes(satUuidClean)
          ) {
            matchIdx = i;
            matchType = `Amarre UUID 3-3 (${satFirst3}...${satLast3})`;
            break;
          }
        }
      }
    }

    // ========================================================
    // REGLA 2: PROVEEDOR + TOTAL EXACTO (Tolerancia ≤ $1.00)
    // Si no hay UUID 3-3, priorizamos coincidencia de Proveedor e Importe Monetario.
    // ========================================================
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

    // ========================================================
    // REGLA 3: REF. FACTURA / FOLIO (CON COINCIDENCIA DE PROVEEDOR E IMPORTE RAZONABLE)
    // Evita falsos positivos de folios parciales con montos dispares ($479k vs $88).
    // ========================================================
    if (matchIdx === -1 && satFolioClean.length >= 3) {
      for (let i = 0; i < erpList.length; i++) {
        if (erpVisited.has(i)) continue;
        const erpItem = erpList[i] as any;
        const totalDiff = Math.abs(sat.total - erpItem.total);

        const matchFolio =
          (erpItem.cleanRef && (satFolioClean.includes(erpItem.cleanRef) || erpItem.cleanRef.includes(satFolioClean))) ||
          (erpItem.cleanRemision && (satFolioClean.includes(erpItem.cleanRemision) || erpItem.cleanRemision.includes(satFolioClean)));

        const matchProveedor =
          satProveedorClean.length >= 3 &&
          (satProveedorClean.includes(erpItem.cleanProveedor) || erpItem.cleanProveedor.includes(satProveedorClean));

        // Solo amarramos por Folio si el proveedor coincide Y el monto no difiere por cifras desproporcionadas
        if (matchFolio && (matchProveedor || totalDiff <= 50.0)) {
          matchIdx = i;
          matchType = 'Amarre por Ref. Factura / Folio';
          break;
        }
      }
    }

    // ========================================================
    // REGLA 4: IMPORTE TOTAL EXACTO ($0.05 Tolerancia entre mismo Proveedor)
    // ========================================================
    if (matchIdx === -1 && sat.total > 0) {
      for (let i = 0; i < erpList.length; i++) {
        if (erpVisited.has(i)) continue;
        const erpItem = erpList[i] as any;
        const totalDiff = Math.abs(sat.total - erpItem.total);

        if (
          totalDiff <= 0.05 &&
          (satProveedorClean.includes(erpItem.cleanProveedor) || erpItem.cleanProveedor.includes(satProveedorClean))
        ) {
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
        fechaERP: erpMatch.fecha || sat.fecha,
        totalSAT: sat.total,
        totalERP: erpMatch.total,
        diferencia: Number(dif.toFixed(2)),
        estatusSAT: sat.estatus,
        metodoPagoSAT: sat.metodoPago,
        tipoCoincidencia: matchType,
        folio: erpMatch.folio || sat.folio,
        documento: erpMatch.documento,
        raw: erpMatch.raw || erpMatch,
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
        raw: erp.raw || erp,
      } as any);
    }
  }

  // Identificar Proveedores Habituales (aquellos que concilian o existen en el ERP)
  const proveedoresHabitualesSet = new Set<string>();
  for (const item of conciliadas) {
    if (item.rfcEmisor) proveedoresHabitualesSet.add(normalizeText(item.rfcEmisor));
    if (item.nombreEmisor) proveedoresHabitualesSet.add(normalizeText(item.nombreEmisor));
  }
  for (const erp of erpData) {
    if (erp.rfc) proveedoresHabitualesSet.add(normalizeText(erp.rfc));
    if (erp.proveedor) proveedoresHabitualesSet.add(normalizeText(erp.proveedor));
  }

  for (const f of faltantesERP) {
    const cleanRfc = normalizeText(f.rfcEmisor);
    const cleanNombre = normalizeText(f.nombreEmisor);
    const match =
      (cleanRfc && proveedoresHabitualesSet.has(cleanRfc)) ||
      (cleanNombre && proveedoresHabitualesSet.has(cleanNombre)) ||
      Array.from(proveedoresHabitualesSet).some(
        (p) => p.length >= 4 && (cleanNombre.includes(p) || p.includes(cleanNombre))
      );
    f.esProveedorHabitual = Boolean(match);
  }

  // Ordenar de mayor a menor importe / diferencia
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

  const faltantesHabituales = faltantesERP.filter((f) => f.esProveedorHabitual);
  const faltantesERPCountHabituales = faltantesHabituales.length;
  const montoFaltantesERPHabituales = faltantesHabituales.reduce((acc, i) => acc + i.total, 0);

  const metricas: MetricasConciliacion = {
    totalSAT: satData.length,
    montoTotalSAT,
    totalERP: erpData.length,
    montoTotalERP,
    conciliadasCount: conciliadas.length,
    montoConciliadas,
    faltantesERPCount: faltantesERP.length,
    montoFaltantesERP,
    faltantesERPCountHabituales,
    montoFaltantesERPHabituales,
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
