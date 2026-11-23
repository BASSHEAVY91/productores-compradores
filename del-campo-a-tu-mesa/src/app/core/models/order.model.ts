/**
 * Medios de pago disponibles en el pago simulado.
 * Ninguno se conecta a una pasarela real: es un prototipo académico.
 */
export enum PaymentMethod {
  NEQUI = 'nequi',
  PSE = 'pse',
  TARJETA = 'tarjeta',
  CONTRAENTREGA = 'contraentrega',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.NEQUI]: 'Nequi',
  [PaymentMethod.PSE]: 'PSE',
  [PaymentMethod.TARJETA]: 'Tarjeta débito/crédito',
  [PaymentMethod.CONTRAENTREGA]: 'Pago contraentrega',
};

export enum OrderStatus {
  PAGADO = 'pagado',
  PENDIENTE_ENTREGA = 'pendiente_entrega',
}

/** Pedido generado cuando un comprador paga un producto. */
export interface Order {
  id: string;
  reference: string;
  productId: string;
  productName: string;
  producerId: string;
  buyerId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}

/** Resultado que devuelve la pasarela de pago (simulada). */
export interface PaymentResult {
  approved: boolean;
  reference: string;
  message: string;
}
