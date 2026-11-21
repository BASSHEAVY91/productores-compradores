import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { CatalogFilterService } from '../../core/services/catalog-filter.service';
import { Product, ProductCategory } from '../../core/models/product.model';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
  standalone: false,
})
export class CatalogPage {
  products: Product[] = [];
  searchTerm = '';
  loading = false;
  readonly categories = Object.values(ProductCategory);

  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService,
    readonly filters: CatalogFilterService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  /** Cada vez que se entra al catálogo (también al volver de Filtros). */
  ionViewWillEnter(): void {
    this.searchTerm = this.filters.filter.name ?? '';
    this.applyFilters();
  }

  onSearch(): void {
    this.filters.update({ name: this.searchTerm });
    this.applyFilters();
  }

  /** Toca una categoría para filtrar; tócala otra vez para quitar el filtro. */
  toggleCategory(category: ProductCategory): void {
    const current = this.filters.filter.category;
    this.filters.setCategory(current === category ? undefined : category);
    this.applyFilters();
  }

  isActiveCategory(category: ProductCategory): boolean {
    return this.filters.filter.category === category;
  }

  /** Texto con los filtros avanzados activos, por ejemplo "Tunja · hasta $6000". */
  get activeFiltersText(): string {
    const { location, minPrice, maxPrice } = this.filters.filter;
    const parts: string[] = [];
    if (location) {
      parts.push(location);
    }
    if (minPrice != null && maxPrice != null) {
      parts.push(`$${minPrice} a $${maxPrice}`);
    } else if (minPrice != null) {
      parts.push(`desde $${minPrice}`);
    } else if (maxPrice != null) {
      parts.push(`hasta $${maxPrice}`);
    }
    return parts.join(' · ');
  }

  clearFilters(): void {
    this.filters.clearAdvanced();
    this.applyFilters();
  }

  private applyFilters(): void {
    this.loading = true;
    this.productService.search(this.filters.filter).subscribe((products) => {
      this.products = products;
      this.loading = false;
      // La app no usa zone.js: se avisa a Angular que redibuje la lista.
      this.cdr.markForCheck();
    });
  }

  goToFilters(): void {
    this.router.navigate(['/comprador/filters']);
  }

  openDetail(product: Product): void {
    this.router.navigate(['/comprador/product-detail', product.id]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}
