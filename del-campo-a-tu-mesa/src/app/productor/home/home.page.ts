import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { SessionService } from '../../core/services/session.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-productor-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  products: Product[] = [];
  loading = false;

  constructor(
    private readonly productService: ProductService,
    private readonly session: SessionService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ionViewWillEnter(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    const user = this.session.currentUser;
    if (!user) {
      return;
    }
    this.loading = true;
    this.productService.getMyProducts(user.id).subscribe((products) => {
      this.products = products;
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  publish(): void {
    this.router.navigate(['/productor/product-form']);
  }

  edit(product: Product): void {
    this.router.navigate(['/productor/product-form'], {
      queryParams: { id: product.id },
    });
  }

  deactivate(product: Product): void {
    this.productService
      .deactivate(product)
      .subscribe(() => this.loadProducts());
  }

  goToProfile(): void {
    this.router.navigate(['/productor/profile']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/welcome']);
  }
}
