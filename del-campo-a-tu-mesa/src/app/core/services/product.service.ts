import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '../repositories/product-repository.interface';
import { Product, ProductFilter } from '../models/product.model';

/**
 * Responsabilidad única: reglas de negocio sobre productos
 * (publicar, editar, desactivar, consultar catálogo, buscar/filtrar).
 * Depende de la abstracción ProductRepository (Inversión de Dependencias).
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  getCatalog(): Observable<Product[]> {
    return this.productRepository.getAll();
  }

  getById(id: string): Observable<Product | undefined> {
    return this.productRepository.getById(id);
  }

  getMyProducts(producerId: string): Observable<Product[]> {
    return this.productRepository.getByProducer(producerId);
  }

  search(filter: ProductFilter): Observable<Product[]> {
    return this.productRepository.search(filter);
  }

  publish(
    producerId: string,
    data: Omit<Product, 'id' | 'producerId' | 'active' | 'createdAt'>
  ): Observable<Product> {
    const product: Product = {
      ...data,
      id: crypto.randomUUID(),
      producerId,
      active: true,
      createdAt: new Date().toISOString(),
    };
    return this.productRepository.create(product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.productRepository.update(product);
  }

  deactivate(product: Product): Observable<Product> {
    return this.productRepository.update({ ...product, active: false });
  }

  delete(id: string): Observable<void> {
    return this.productRepository.delete(id);
  }
}
