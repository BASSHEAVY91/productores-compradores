import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductRepository } from './product-repository.interface';
import { Product, ProductFilter } from '../models/product.model';

const STORAGE_KEY = 'dctm_products';

/**
 * Pasa el texto a minúsculas y le quita las tildes, para que buscar
 * "guanabana" encuentre "Guanábana" y "fusagasuga" encuentre "Fusagasugá".
 */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Implementación concreta de ProductRepository usando localStorage.
 * Responsabilidad única: persistencia y consulta de productos en el dispositivo.
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageProductRepository extends ProductRepository {
  private readAll(): Product[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  }

  private writeAll(products: Product[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }

  getAll(): Observable<Product[]> {
    return of(this.readAll().filter((p) => p.active));
  }

  getById(id: string): Observable<Product | undefined> {
    return of(this.readAll().find((p) => p.id === id));
  }

  getByProducer(producerId: string): Observable<Product[]> {
    return of(this.readAll().filter((p) => p.producerId === producerId));
  }

  search(filter: ProductFilter): Observable<Product[]> {
    let results = this.readAll().filter((p) => p.active);

    if (filter.name) {
      const term = normalize(filter.name);
      results = results.filter((p) => normalize(p.name).includes(term));
    }
    if (filter.category) {
      results = results.filter((p) => p.category === filter.category);
    }
    if (filter.location) {
      const loc = normalize(filter.location);
      results = results.filter((p) => normalize(p.location).includes(loc));
    }
    if (filter.minPrice != null) {
      results = results.filter((p) => p.price >= filter.minPrice!);
    }
    if (filter.maxPrice != null) {
      results = results.filter((p) => p.price <= filter.maxPrice!);
    }

    return of(results);
  }

  create(product: Product): Observable<Product> {
    const products = this.readAll();
    products.push(product);
    this.writeAll(products);
    return of(product);
  }

  update(product: Product): Observable<Product> {
    const products = this.readAll();
    const idx = products.findIndex((p) => p.id === product.id);
    if (idx >= 0) {
      products[idx] = product;
      this.writeAll(products);
    }
    return of(product);
  }

  delete(id: string): Observable<void> {
    const products = this.readAll().filter((p) => p.id !== id);
    this.writeAll(products);
    return of(undefined);
  }
}
