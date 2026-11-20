import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { SessionService } from '../../core/services/session.service';
import { Product, ProductCategory } from '../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.page.html',
  styleUrls: ['./product-form.page.scss'],
  standalone: false,
})
export class ProductFormPage implements OnInit {
  readonly categories = Object.values(ProductCategory);
  editingProduct: Product | null = null;
  saving = false;

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [null, [Validators.required, Validators.min(0)]],
    quantityAvailable: [null, [Validators.required, Validators.min(0)]],
    category: [ProductCategory.OTROS, Validators.required],
    location: ['', Validators.required],
    photoUrl: [''],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly session: SessionService,
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('id');
    if (id) {
      this.productService.getById(id).subscribe((product) => {
        if (product) {
          this.editingProduct = product;
          this.form.patchValue(product);
        }
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const user = this.session.currentUser;
    if (!user) {
      return;
    }

    this.saving = true;
    const value = this.form.value;

    if (this.editingProduct) {
      const updated: Product = { ...this.editingProduct, ...value };
      this.productService.updateProduct(updated).subscribe(() => this.goBack());
    } else {
      this.productService.publish(user.id, value).subscribe(() => this.goBack());
    }
  }

  private goBack(): void {
    this.saving = false;
    this.router.navigate(['/productor/home']);
  }
}
