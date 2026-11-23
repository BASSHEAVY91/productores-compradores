import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { SessionService } from '../../core/services/session.service';
import { Product } from '../../core/models/product.model';
import { Order, PAYMENT_METHOD_LABELS, PaymentMethod } from '../../core/models/order.model';

/**
 * P9 - Pago simulado.
 * El comprador elige cantidad y medio de pago; la app simula el cobro,
 * registra el pedido y descuenta el inventario del productor.
 */
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: false,
})
export class CheckoutPage implements OnInit {
  product: Product | null = null;
  quantity = 1;
  paymentMethod: PaymentMethod = PaymentMethod.NEQUI;
  readonly methods = Object.values(PaymentMethod);
  readonly labels = PAYMENT_METHOD_LABELS;

  processing = false;
  errorMessage = '';
  resultMessage = '';
  order: Order | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
    private readonly session: SessionService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getById(id).subscribe((product) => {
        this.product = product ?? null;
        this.cdr.markForCheck();
      });
    }
  }

  get total(): number {
    return this.product ? this.orderService.calculateTotal(this.product, this.quantity || 0) : 0;
  }

  pay(): void {
    const buyer = this.session.currentUser;
    if (!this.product || !buyer || this.processing) {
      return;
    }

    this.errorMessage = '';
    this.processing = true;

    this.orderService
      .checkout(buyer.id, this.product, Number(this.quantity), this.paymentMethod)
      .subscribe({
        next: (result) => {
          this.processing = false;
          if (result.payment.approved && result.order) {
            this.order = result.order;
            this.resultMessage = result.payment.message;
          } else {
            this.errorMessage = result.payment.message;
          }
          // La app es zoneless: hay que avisarle a Angular que refresque la vista.
          this.cdr.markForCheck();
        },
        error: (err: Error) => {
          this.processing = false;
          this.errorMessage = err.message;
          this.cdr.markForCheck();
        },
      });
  }

  goToPurchases(): void {
    this.router.navigate(['/comprador/purchases']);
  }

  goToCatalog(): void {
    this.router.navigate(['/comprador/catalog']);
  }
}
