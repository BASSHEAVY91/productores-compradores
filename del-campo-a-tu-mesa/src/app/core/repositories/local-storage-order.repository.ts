import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OrderRepository } from './order-repository.interface';
import { Order } from '../models/order.model';

const STORAGE_KEY = 'dctm_orders';

/**
 * Implementación concreta de OrderRepository usando localStorage.
 * Responsabilidad única: persistir y consultar pedidos en el dispositivo.
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageOrderRepository extends OrderRepository {
  private readAll(): Order[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  }

  private writeAll(orders: Order[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }

  private newestFirst(orders: Order[]): Order[] {
    return [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  create(order: Order): Observable<Order> {
    const orders = this.readAll();
    orders.push(order);
    this.writeAll(orders);
    return of(order);
  }

  getByBuyer(buyerId: string): Observable<Order[]> {
    return of(this.newestFirst(this.readAll().filter((o) => o.buyerId === buyerId)));
  }

  getByProducer(producerId: string): Observable<Order[]> {
    return of(this.newestFirst(this.readAll().filter((o) => o.producerId === producerId)));
  }
}
