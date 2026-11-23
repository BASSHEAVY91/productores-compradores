import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { OrderRepository } from '../repositories/order-repository.interface';
import { ProductRepository } from '../repositories/product-repository.interface';
import { PaymentGateway } from './payment-gateway';
import { Product } from '../models/product.model';
import { Order, OrderStatus, PaymentMethod, PaymentResult } from '../models/order.model';

export interface CheckoutResult {
  payment: PaymentResult;
  order?: Order;
}

/**
 * Responsabilidad única: reglas de negocio de la compra.
 * Valida la cantidad, cobra con la pasarela (simulada), registra el pedido
 * y descuenta el inventario del producto.
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly paymentGateway: PaymentGateway,
  ) {}

  calculateTotal(product: Product, quantity: number): number {
    return product.price * quantity;
  }

  checkout(
    buyerId: string,
    product: Product,
    quantity: number,
    method: PaymentMethod,
  ): Observable<CheckoutResult> {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return throwError(() => new Error('La cantidad debe ser un número entero mayor a cero.'));
    }
    if (quantity > product.quantityAvailable) {
      return throwError(
        () => new Error(`Solo hay ${product.quantityAvailable} unidades disponibles.`),
      );
    }

    const total = this.calculateTotal(product, quantity);

    return this.paymentGateway.pay(total, method).pipe(
      switchMap((payment) => {
        if (!payment.approved) {
          return of<CheckoutResult>({ payment });
        }

        const order: Order = {
          id: crypto.randomUUID(),
          reference: payment.reference,
          productId: product.id,
          productName: product.name,
          producerId: product.producerId,
          buyerId,
          quantity,
          unitPrice: product.price,
          total,
          paymentMethod: method,
          status:
            method === PaymentMethod.CONTRAENTREGA
              ? OrderStatus.PENDIENTE_ENTREGA
              : OrderStatus.PAGADO,
          createdAt: new Date().toISOString(),
        };

        const remaining = product.quantityAvailable - quantity;
        return this.productRepository
          .update({ ...product, quantityAvailable: remaining, active: remaining > 0 })
          .pipe(
            switchMap(() => this.orderRepository.create(order)),
            map((saved) => ({ payment, order: saved })),
          );
      }),
    );
  }

  getMyPurchases(buyerId: string): Observable<Order[]> {
    return this.orderRepository.getByBuyer(buyerId);
  }

  getMySales(producerId: string): Observable<Order[]> {
    return this.orderRepository.getByProducer(producerId);
  }
}
