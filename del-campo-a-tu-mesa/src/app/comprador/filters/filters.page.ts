import { ChangeDetectorRef, Component } from '@angular/core';
import { NavController } from '@ionic/angular/lazy';
import { CatalogFilterService } from '../../core/services/catalog-filter.service';
import { ProductCategory } from '../../core/models/product.model';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
  standalone: false,
})
export class FiltersPage {
  readonly categories = Object.values(ProductCategory);

  // Valores del formulario (los campos de texto llegan como string).
  category: ProductCategory | undefined;
  location = '';
  minPrice: string | number | null = null;
  maxPrice: string | number | null = null;
  errorMessage = '';

  constructor(
    private readonly filters: CatalogFilterService,
    private readonly navCtrl: NavController,
    private readonly cdr: ChangeDetectorRef
  ) {}

  /** Al abrir la pantalla, muestra los filtros que ya estaban activos. */
  ionViewWillEnter(): void {
    const current = this.filters.filter;
    this.category = current.category;
    this.location = current.location ?? '';
    this.minPrice = current.minPrice ?? null;
    this.maxPrice = current.maxPrice ?? null;
    this.errorMessage = '';
    // La app no usa zone.js: se avisa a Angular que muestre estos valores.
    this.cdr.markForCheck();
  }

  clear(): void {
    this.category = undefined;
    this.location = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.errorMessage = '';
  }

  apply(): void {
    const min = this.toNumber(this.minPrice);
    const max = this.toNumber(this.maxPrice);

    if (min !== undefined && max !== undefined && min > max) {
      this.errorMessage = 'El precio mínimo no puede ser mayor que el máximo.';
      return;
    }

    this.filters.update({
      category: this.category,
      location: this.location,
      minPrice: min,
      maxPrice: max,
    });
    // Vuelve al catálogo, que se actualiza con los filtros nuevos.
    this.navCtrl.navigateBack('/comprador/catalog');
  }

  private toNumber(value: string | number | null): number | undefined {
    if (value === null || value === '') {
      return undefined;
    }
    const n = Number(value);
    return Number.isNaN(n) ? undefined : n;
  }
}
