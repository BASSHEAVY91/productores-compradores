import { Injectable } from '@angular/core';
import { ProductCategory, ProductFilter } from '../models/product.model';

/**
 * Responsabilidad única: guardar los filtros de búsqueda activos del
 * comprador (RF9) para compartirlos entre el catálogo (P5) y la pantalla
 * de filtros (P6). Así ambos ven siempre los mismos filtros.
 */
@Injectable({ providedIn: 'root' })
export class CatalogFilterService {
  private current: ProductFilter = {};

  get filter(): ProductFilter {
    return { ...this.current };
  }

  /** Combina los valores recibidos con los filtros actuales. */
  update(partial: ProductFilter): void {
    this.current = this.clean({ ...this.current, ...partial });
  }

  setCategory(category: ProductCategory | undefined): void {
    this.update({ category });
  }

  /** Quita ubicación, categoría y precios, pero conserva el texto buscado. */
  clearAdvanced(): void {
    this.current = this.clean({ name: this.current.name });
  }

  /** Cantidad de filtros activos (sin contar el texto de búsqueda). */
  get activeCount(): number {
    const { category, location, minPrice, maxPrice } = this.current;
    return [category, location, minPrice, maxPrice].filter((v) => v !== undefined).length;
  }

  /** Elimina valores vacíos para no filtrar por campos en blanco. */
  private clean(filter: ProductFilter): ProductFilter {
    const result: ProductFilter = {};
    if (filter.name?.trim()) {
      result.name = filter.name.trim();
    }
    if (filter.category) {
      result.category = filter.category;
    }
    if (filter.location?.trim()) {
      result.location = filter.location.trim();
    }
    if (filter.minPrice != null && !Number.isNaN(filter.minPrice)) {
      result.minPrice = filter.minPrice;
    }
    if (filter.maxPrice != null && !Number.isNaN(filter.maxPrice)) {
      result.maxPrice = filter.maxPrice;
    }
    return result;
  }
}
