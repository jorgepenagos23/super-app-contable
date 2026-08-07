export interface FacturaSAT {
  uuid: string;
  rfcEmisor: string;
  nombreEmisor: string;
  rfcReceptor?: string;
  nombreReceptor?: string;
  fecha: string;
  total: number;
  subtotal?: number;
  iva?: number;
  estatus: 'Vigente' | 'Cancelado' | string;
  metodoPago: 'PUE' | 'PPD' | string;
  formaPago?: string;
  tipoComprobante?: string;
  serie?: string;
  folio?: string;
}

export interface FacturaERP {
  uuid: string;
  proveedor: string;
  rfc?: string;
  fecha: string;
  total: number;
  subtotal?: number;
  iva?: number;
  estatus?: string;
  folio?: string;
  serie?: string;
  documento?: string;
  [key: string]: any;
}

export interface ItemConciliado {
  uuid: string;
  rfcEmisor: string;
  nombreEmisor: string;
  fechaSAT: string;
  fechaERP?: string;
  totalSAT: number;
  totalERP: number;
  diferencia: number;
  estatusSAT: string;
  metodoPagoSAT: string;
}

export interface ItemFaltanteERP {
  uuid: string;
  rfcEmisor: string;
  nombreEmisor: string;
  fecha: string;
  total: number;
  estatusSAT: string;
  metodoPagoSAT: string;
  folio?: string;
  serie?: string;
}

export interface ItemSobranteERP {
  uuid: string;
  proveedor: string;
  rfc?: string;
  fecha: string;
  total: number;
  folio?: string;
  serie?: string;
  documento?: string;
}

export interface MetricasConciliacion {
  totalSAT: number;
  montoTotalSAT: number;
  totalERP: number;
  montoTotalERP: number;
  conciliadasCount: number;
  montoConciliadas: number;
  faltantesERPCount: number;
  montoFaltantesERP: number;
  sobrantesERPCount: number;
  montoSobrantesERP: number;
  canceladasSATCount: number;
  montoCanceladasSAT: number;
  pueCount: number;
  ppdCount: number;
  diferenciaTotalMonto: number;
}

export interface ResultadoConciliacion {
  conciliadas: ItemConciliado[];
  faltantesERP: ItemFaltanteERP[];
  sobrantesERP: ItemSobranteERP[];
  metricas: MetricasConciliacion;
}
