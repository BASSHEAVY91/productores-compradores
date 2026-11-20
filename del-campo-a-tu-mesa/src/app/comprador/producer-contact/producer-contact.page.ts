import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { ProducerLookupService } from '../../core/services/producer-lookup.service';
import { ContactService } from '../../core/services/contact.service';
import { Product } from '../../core/models/product.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-producer-contact',
  templateUrl: './producer-contact.page.html',
  styleUrls: ['./producer-contact.page.scss'],
  standalone: false,
})
export class ProducerContactPage implements OnInit {
  product: Product | null = null;
  producer: User | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly producerLookup: ProducerLookupService,
    private readonly contactService: ContactService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (!productId) {
      return;
    }
    this.productService.getById(productId).subscribe((product) => {
      this.product = product ?? null;
      if (product) {
        this.producerLookup.getProducerById(product.producerId).subscribe((producer) => {
          this.producer = producer ?? null;
        });
      }
    });
  }

  openContact(): void {
    if (this.producer?.contactMethod) {
      this.contactService.open(this.producer.contactMethod);
    }
  }
}
