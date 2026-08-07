import * as XLSX from 'xlsx';
import { FacturaSAT } from '@/types/reconciliation';

const UUID_REGEX = /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;

function getColumnValue(row: Record<string, any>, possibleKeys: string[]): any {
  const rowKeys = Object.keys(row);
  for (const key of possibleKeys) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    const foundKey = rowKeys.find(k => k.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedKey);
    if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null && String(row[foundKey]).trim() !== '') {
      return row[foundKey];
    }
  }
  return undefined;
}

function findUUIDInRow(row: Record<string, any>): string {
  const direct = getColumnValue(row, [
    'folio fiscal', 'uuid', 'folio_fiscal', 'foliofiscal', 'uuid cfdi', 'folio fiscal (uuid)', 'uuid sat'
  ]);
  
  if (direct) {
    const match = String(direct).match(UUID_REGEX);
    if (match) return match[0];
    const clean = String(direct).replace(/[^A-Za-z0-9]/g, '');
    if (clean.length === 32) return String(direct).trim();
  }

  for (const val of Object.values(row)) {
    if (typeof val === 'string') {
      const match = val.match(UUID_REGEX);
      if (match) return match[0];
    }
  }

  return '';
}

/**
 * Parsea y estandariza la Fecha de Emisión del SAT a formato YYYY-MM-DD
 * Soporta objetos Date, cadenas ISO YYYY-MM-DD, y cadenas en formato México DD/MM/YYYY
 */
function parseFechaEmision(val: any): string {
  if (!val) return '';

  if (val instanceof Date && !isNaN(val.getTime())) {
    const y = val.getFullYear();
    const m = String(val.getMonth() + 1).padStart(2, '0');
    const d = String(val.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  const str = String(val).trim();
  if (!str) return '';

  // 1. Formato YYYY-MM-DD (ISO)
  const isoMatch = str.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  // 2. Formato DD/MM/YYYY o DD-MM-YYYY (Estándar México SAT)
  const mxMatch = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (mxMatch) {
    const [, d, m, y] = mxMatch;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }

  return '';
}

export interface ParseExcelResult {
  facturas: FacturaSAT[];
  detectedMinDate?: string; // YYYY-MM-DD
  detectedMaxDate?: string; // YYYY-MM-DD
}

export async function parseExcelSAT(file: File): Promise<ParseExcelResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const rawRows: Record<string, any>[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        const facturas: FacturaSAT[] = [];
        const detectedDates: string[] = [];

        for (const row of rawRows) {
          const uuid = findUUIDInRow(row).toUpperCase().trim();
          if (!uuid) continue;

          const rfcEmisor = String(
            getColumnValue(row, ['rfc emisor', 'rfc_emisor', 'rfcemisor', 'rfc del emisor', 'emisor rfc', 'rfc']) || 'N/A'
          ).trim();

          const nombreEmisor = String(
            getColumnValue(row, ['nombre emisor', 'nombre_emisor', 'nombreemisor', 'nombre del emisor', 'razon social emisor', 'nombre o razon social del emisor', 'nombre']) || 'PROVEEDOR SAT'
          ).trim();

          // Prioridad estricta al campo "Fecha Emision" / "Fecha Emisión"
          const rawFechaVal = getColumnValue(row, [
            'fecha de emision', 'fecha emision', 'fecha emisión', 'fecha_emision', 'fechaemision',
            'fecha comprobante', 'fecha del comprobante', 'fecha'
          ]);

          const fecha = parseFechaEmision(rawFechaVal);

          if (fecha) {
            detectedDates.push(fecha);
          }

          const rawTotal = getColumnValue(row, ['total', 'monto total', 'importe total', 'monto', 'importe']);
          let total = 0;
          if (typeof rawTotal === 'number') {
            total = rawTotal;
          } else if (rawTotal) {
            const parsedNumber = parseFloat(String(rawTotal).replace(/[^0-9.-]+/g, ''));
            total = isNaN(parsedNumber) ? 0 : parsedNumber;
          }

          const rawEstatus = String(
            getColumnValue(row, ['estatus', 'estado', 'estatus comprobante', 'estado del comprobante', 'estado del cfdi', 'estatus del cfdi']) || 'Vigente'
          ).trim();

          let estatus = 'Vigente';
          if (rawEstatus.toLowerCase().includes('cancel')) {
            estatus = 'Cancelado';
          }

          const rawMetodoPago = String(
            getColumnValue(row, ['metodo de pago', 'metodo pago', 'metodopago', 'método de pago', 'método pago']) || 'PUE'
          ).trim();

          let metodoPago = rawMetodoPago.toUpperCase();
          if (metodoPago.includes('PUE')) metodoPago = 'PUE';
          else if (metodoPago.includes('PPD')) metodoPago = 'PPD';

          const folio = String(getColumnValue(row, ['folio', 'folio interno']) || '').trim();
          const serie = String(getColumnValue(row, ['serie']) || '').trim();

          facturas.push({
            uuid,
            rfcEmisor,
            nombreEmisor,
            fecha,
            total,
            estatus,
            metodoPago,
            folio,
            serie,
          });
        }

        // Calcular minDate y maxDate estrictamente basadas en las fechas reales de "Fecha Emisión" del Excel
        detectedDates.sort();
        let detectedMinDate: string | undefined;
        let detectedMaxDate: string | undefined;

        if (detectedDates.length > 0) {
          const firstDateStr = detectedDates[0];
          const lastDateStr = detectedDates[detectedDates.length - 1];

          // Extraer año y mes exacto de la Fecha Emisión de la primera factura
          const [minY, minM] = firstDateStr.split('-');
          detectedMinDate = `${minY}-${minM}-01`;

          const [maxY, maxM] = lastDateStr.split('-');
          const lastDay = new Date(parseInt(maxY, 10), parseInt(maxM, 10), 0).getDate();
          detectedMaxDate = `${maxY}-${maxM}-${String(lastDay).padStart(2, '0')}`;
        }

        resolve({
          facturas,
          detectedMinDate,
          detectedMaxDate,
        });
      } catch (err) {
        console.error('Error al procesar archivo SAT:', err);
        reject(new Error('No se pudo procesar el archivo del SAT. Verifique que sea un Excel (.xlsx, .xls) o CSV válido.'));
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
