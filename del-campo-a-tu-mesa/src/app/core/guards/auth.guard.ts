import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { SessionService } from '../services/session.service';

/**
 * Responsabilidad única: impedir el acceso a rutas protegidas
 * si no existe una sesión activa.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private readonly session: SessionService,
    private readonly router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (this.session.isAuthenticated) {
      return true;
    }
    return this.router.parseUrl('/welcome');
  }
}
