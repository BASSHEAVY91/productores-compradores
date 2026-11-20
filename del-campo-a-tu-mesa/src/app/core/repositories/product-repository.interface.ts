import { Observable } from 'rxjs';
import { Product, ProductFilter } from '../models/product.model';

/**
 * Abstracción (puerto) para el acceso a datos de productos.
 * Permite sustituir la implementación (local storage, REST, Firebase, etc.)
 * sin modificar los servicios que la consumen (Open/Closed + Dependency Inversion).
 */
export abstract class ProductRepository {
  abstract getAll(): Observable<Product[]>;
  abstract getById(id: string): Observable<Product | undefined>;
  abstract getByProducer(producerId: string): Observable<Product[]>;
  abstract search(filter: ProductFilter): Observable<Product[]>;
  abstract create(product: Product): Observable<Product>;
  abstract update(product: Product): Observable<Product>;
  abstract delete(id: string): Observable<void>;
}
