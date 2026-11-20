import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { Product, ProductCategory } from '../../core/models/product.model';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
  standalone: false,
})
export class CatalogPage implements OnInit {
  products: Product[] = [];
  searchTerm = '';
  loading = false;
  readonly categories = Object.values(ProductCategory);

  constructor(
    private readonly productService: ProductService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadCatalog();
  }

  ionViewWillEnter(): void {
    this.loadCatalog();
  }

  private loadCatalog(): void {
    this.loading = true;
    this.productService.getCatalog().subscribe((products) => {
      this.products = products;
      this.loading = false;
    });
  }

  onSearch(): void {
    this.loading = true;
    this.productService.search({ name: this.searchTerm }).subscribe((products) => {
      this.products = products;
      this.loading = false;
    });
  }

  filterByCategory(category: ProductCategory): void {
    this.loading = true;
    this.productService.search({ category }).subscribe((products) => {
      this.products = products;
      this.loading = false;
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
