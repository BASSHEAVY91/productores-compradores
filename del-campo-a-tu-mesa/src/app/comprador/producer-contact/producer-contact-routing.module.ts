import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProducerContactPage } from './producer-contact.page';

const routes: Routes = [
  {
    path: '',
    component: ProducerContactPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProducerContactPageRoutingModule {}
