import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PaymentMethod, PaymentResult } from '../models/order.model';

/**
 * Abstracción de la pasarela de pago. Hoy se usa la versión simulada;
 * mañana se podría enchufar Wompi, PayU, etc. sin tocar OrderService
 * (Abierto/Cerrado + Inversión de Dependencias).
 */
export abstract class PaymentGateway {
  abstract pay(amount: number, method: PaymentMethod): Observable<PaymentResult>;
}

/**
 * Pasarela SIMULADA: no cobra dinero real ni pide datos bancarios.
 * Espera un momento (como si consultara al banco) y aprueba el pago
 * devolviendo un número de referencia.
 */
@Injectable({ providedIn: 'root' })
export class SimulatedPaymentGateway extends PaymentGateway {
  pay(amount: number, method: PaymentMethod): Observable<PaymentResult> {
    const reference = 'DCTM-' + Date.now().toString().slice(-8);

    if (amount <= 0) {
      return of({ approved: false, reference, message: 'El monto debe ser mayor a cero.' });
    }

    const message =
      method === PaymentMethod.CONTRAENTREGA
        ? 'Pedido registrado. Pagas al recibir el producto.'
        : 'Pago aprobado (simulado).';

    return of({ approved: true, reference, message }).pipe(delay(1500));
  }
}
