import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { SessionService } from '../services/session.service';
import { UserRole } from '../models/role.enum';

/**
 * Responsabilidad única: restringir el acceso a rutas según el rol
 * del usuario autenticado (productor o comprador).
 * El rol esperado se define por ruta mediante route.data['role'],
 * cumpliendo Abierto/Cerrado: nuevas rutas no requieren modificar el guard.
 */
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private readonly session: SessionService,
    private readonly router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredRole: UserRole | undefined = route.data['role'];
    const user = this.session.currentUser;

    if (!user) {
      return this.router.parseUrl('/welcome');
    }

    if (requiredRole && user.role !== requiredRole) {
      return this.router.parseUrl('/role-selection');
    }

    return true;
  }
}
