import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular/lazy';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthRepository } from './core/repositories/auth-repository.interface';
import { LocalStorageAuthRepository } from './core/repositories/local-storage-auth.repository';
import { ProductRepository } from './core/repositories/product-repository.interface';
import { LocalStorageProductRepository } from './core/repositories/local-storage-product.repository';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Inversión de Dependencias: se ligan las abstracciones a sus
    // implementaciones concretas en un único punto de composición.
    { provide: AuthRepository, useClass: LocalStorageAuthRepository },
    { provide: ProductRepository, useClass: LocalStorageProductRepository },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
