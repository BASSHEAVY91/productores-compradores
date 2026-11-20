import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular/lazy';

import { ProducerContactPageRoutingModule } from './producer-contact-routing.module';

import { ProducerContactPage } from './producer-contact.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProducerContactPageRoutingModule
  ],
  declarations: [ProducerContactPage]
})
export class ProducerContactPageModule {}
