import { FacturaERP } from '@/types/reconciliation';

/**
 * Estructura de compras idéntica a la devuelta por el endpoint de Grupo MV FROG ERP (Lista_Compras_773)
 */
export const MOCK_FROG_ERP_RESPONSE = [
  {
    "UDN": "PDSC",
    "fecha_recepcion": "2026-01-03T00:00:00",
    "Ref. Factura": "PDSC BRINV_COMPRAS/AB-283",
    "Remision": "FACT-0710063",
    "XML / UUID": "A1B2C3D4-E5F6-7890-ABCD-123456789012",
    "proveedor": "PROVEEDOR MODELO S.A. DE C.V.",
    "Referencia Orden": "PDSC BRCOM_ORDEN/OC-446",
    "Estado_Orden": "Ingresada",
    "Total Recibido (FROG)": 15400.50,
    "SUBTOTAL": 15400.50,
    "DESCUENTO": 0.00,
    "Subtotal Neto Orden": 15400.50,
    "IEPS ": 0.00,
    "IVA ": 0.00,
    "TOTAL FACTURA": 15400.50
  },
  {
    "UDN": "PDSC",
    "fecha_recepcion": "2026-01-18T00:00:00",
    "Ref. Factura": "PDSC BRINV_COMPRAS/AB-284",
    "Remision": "FACT-0710064",
    "XML / UUID": "B2C3D4E5-F6A7-8901-BCDE-234567890123",
    "proveedor": "COMERCIALIZADORA DEL NORTE",
    "Referencia Orden": "PDSC BRCOM_ORDEN/OC-447",
    "Estado_Orden": "Ingresada",
    "Total Recibido (FROG)": 8920.00,
    "SUBTOTAL": 8920.00,
    "DESCUENTO": 0.00,
    "Subtotal Neto Orden": 8920.00,
    "IEPS ": 0.00,
    "IVA ": 0.00,
    "TOTAL FACTURA": 8920.00
  },
  {
    "UDN": "PDSC",
    "fecha_recepcion": "2026-01-20T00:00:00",
    "Ref. Factura": "PDSC BRINV_COMPRAS/AB-285",
    "Remision": "FACT-0710065",
    "XML / UUID": "C3D4E5F6-A7B8-9012-CDEF-345678901234",
    "proveedor": "SERVICIOS INDUSTRIALES GMV",
    "Referencia Orden": "PDSC BRCOM_ORDEN/OC-448",
    "Estado_Orden": "Ingresada",
    "Total Recibido (FROG)": 43250.00,
    "SUBTOTAL": 43250.00,
    "DESCUENTO": 0.00,
    "Subtotal Neto Orden": 43250.00,
    "IEPS ": 0.00,
    "IVA ": 0.00,
    "TOTAL FACTURA": 43250.00
  }
];

export const MOCK_ERP_PURCHASES: FacturaERP[] = [
  {
    uuid: 'A1B2C3D4-E5F6-7890-ABCD-123456789012',
    cleanUuid: 'A1B2C3D4E5F67890ABCD123456789012',
    proveedor: 'PROVEEDOR MODELO S.A. DE C.V.',
    fecha: '2026-01-15',
    total: 15400.50,
    folio: 'PDSC BRINV_COMPRAS/AB-283',
    documento: 'FACT-0710063',
  },
  {
    uuid: 'B2C3D4E5-F6A7-8901-BCDE-234567890123',
    cleanUuid: 'B2C3D4E5F6A78901BCDE234567890123',
    proveedor: 'COMERCIALIZADORA DEL NORTE',
    fecha: '2026-01-18',
    total: 8920.00,
    folio: 'PDSC BRINV_COMPRAS/AB-284',
    documento: 'FACT-0710064',
  },
  {
    uuid: 'C3D4E5F6-A7B8-9012-CDEF-345678901234',
    cleanUuid: 'C3D4E5F6A7B89012CDEF345678901234',
    proveedor: 'SERVICIOS INDUSTRIALES GMV',
    fecha: '2026-01-20',
    total: 43250.00,
    folio: 'PDSC BRINV_COMPRAS/AB-285',
    documento: 'FACT-0710065',
  },
];
