import { ChangeDetectorRef, Component } from '@angular/core';
import { OrderService } from '../../core/services/order.service';
import { SessionService } from '../../core/services/session.service';
import { Order, OrderStatus, PAYMENT_METHOD_LABELS } from '../../core/models/order.model';

/** P10 - Mis compras: historial de pedidos del comprador. */
@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.page.html',
  styleUrls: ['./purchases.page.scss'],
  standalone: false,
})
export class PurchasesPage {
  orders: Order[] = [];
  readonly labels = PAYMENT_METHOD_LABELS;
  readonly OrderStatus = OrderStatus;

  constructor(
    private readonly orderService: OrderService,
    private readonly session: SessionService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  /** Se recarga cada vez que se entra a la pantalla (Ionic reutiliza páginas). */
  ionViewWillEnter(): void {
    const buyer = this.session.currentUser;
    if (buyer) {
      this.orderService.getMyPurchases(buyer.id).subscribe((orders) => {
        this.orders = orders;
        this.cdr.markForCheck();
      });
    }
  }
}
