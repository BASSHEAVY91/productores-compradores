import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular/lazy';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthRepository } from './core/repositories/auth-repository.interface';
import { LocalStorageAuthRepository } from './core/repositories/local-storage-auth.repository';
import { ProductRepository } from './core/repositories/product-repository.interface';
import { LocalStorageProductRepository } from './core/repositories/local-storage-product.repository';
import { SeedService } from './core/services/seed.service';
import { AuthService } from './core/services/auth.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // Inversión de Dependencias: se ligan las abstracciones a sus
    // implementaciones concretas en un único punto de composición.
    { provide: AuthRepository, useClass: LocalStorageAuthRepository },
    { provide: ProductRepository, useClass: LocalStorageProductRepository },
    // Carga los datos de demostración la primera vez que se abre la app.
    provideAppInitializer(() => inject(SeedService).seedIfNeeded()),
    // Recupera la sesión guardada para no pedir login al recargar o reabrir.
    provideAppInitializer(() => inject(AuthService).restoreSession()),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
