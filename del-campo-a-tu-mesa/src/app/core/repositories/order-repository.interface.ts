import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

/**
 * Abstracción (puerto) para el acceso a datos de pedidos.
 * Se puede sustituir por una implementación REST/Firebase sin tocar los servicios.
 */
export abstract class OrderRepository {
  abstract create(order: Order): Observable<Order>;
  abstract getByBuyer(buyerId: string): Observable<Order[]>;
  abstract getByProducer(producerId: string): Observable<Order[]>;
}
