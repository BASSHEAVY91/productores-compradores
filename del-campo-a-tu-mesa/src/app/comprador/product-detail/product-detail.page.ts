import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
  standalone: false,
})
export class ProductDetailPage implements OnInit {
  product: Product | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(id).subscribe((product) => {
        this.product = product ?? null;
      });
    }
  }

  buy(): void {
    if (this.product) {
      this.router.navigate(['/comprador/checkout', this.product.id]);
    }
  }

  contactProducer(): void {
    if (this.product) {
      this.router.navigate(['/comprador/producer-contact', this.product.id]);
    }
  }
}
