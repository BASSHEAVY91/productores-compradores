import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCategory, ProductFilter } from '../../core/models/product.model';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.page.html',
  styleUrls: ['./filters.page.scss'],
  standalone: false,
})
export class FiltersPage {
  readonly categories = Object.values(ProductCategory);

  filter: ProductFilter = {};

  constructor(private readonly router: Router) {}

  clear(): void {
    this.filter = {};
  }

  apply(): void {
    this.router.navigate(['/comprador/catalog'], {
      queryParams: { ...this.filter },
    });
  }
}
