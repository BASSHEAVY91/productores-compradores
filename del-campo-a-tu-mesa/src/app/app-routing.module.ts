import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { UserRole } from './core/models/role.enum';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  // P0 - Inicio / Bienvenida
  {
    path: 'welcome',
    loadChildren: () =>
      import('./welcome/welcome.module').then((m) => m.WelcomePageModule),
  },
  // P1 - Registro / Inicio de sesión
  {
    path: 'login',
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginPageModule),
  },
  // P2 - Selección de rol
  {
    path: 'role-selection',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./auth/role-selection/role-selection.module').then(
        (m) => m.RoleSelectionPageModule,
      ),
  },
  // P3 - Home Productor
  {
    path: 'productor/home',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.PRODUCTOR },
    loadChildren: () =>
      import('./productor/home/home.module').then((m) => m.HomePageModule),
  },
  // P4 - Publicar / Editar producto
  {
    path: 'productor/product-form',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.PRODUCTOR },
    loadChildren: () =>
      import('./productor/product-form/product-form.module').then(
        (m) => m.ProductFormPageModule,
      ),
  },

  // P3.1 - Perfil del productor (RF4)
  {
    path: 'productor/profile',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.PRODUCTOR },
    loadChildren: () =>
      import('./productor/profile/profile.module').then(
        (m) => m.ProfilePageModule,
      ),
  },

  // P5 - Home Comprador (catálogo)
  {
    path: 'comprador/catalog',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.COMPRADOR },
    loadChildren: () =>
      import('./comprador/catalog/catalog.module').then(
        (m) => m.CatalogPageModule,
      ),
  },
  // P6 - Búsqueda y filtros
  {
    path: 'comprador/filters',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.COMPRADOR },
    loadChildren: () =>
      import('./comprador/filters/filters.module').then(
        (m) => m.FiltersPageModule,
      ),
  },
  // P7 - Detalle de producto
  {
    path: 'comprador/product-detail/:id',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.COMPRADOR },
    loadChildren: () =>
      import('./comprador/product-detail/product-detail.module').then(
        (m) => m.ProductDetailPageModule,
      ),
  },
  // P8 - Perfil del productor / Contacto
  {
    path: 'comprador/producer-contact/:id',
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.COMPRADOR },
    loadChildren: () =>
      import('./comprador/producer-contact/producer-contact.module').then(
        (m) => m.ProducerContactPageModule,
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
