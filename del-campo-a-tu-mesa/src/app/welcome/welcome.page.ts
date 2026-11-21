import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../core/services/session.service';
import { UserRole } from '../core/models/role.enum';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: false,
})
export class WelcomePage implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly session: SessionService
  ) {}

  ngOnInit(): void {
    // Si ya hay una sesión activa (recuperada al abrir la app),
    // se lleva al usuario directamente a su pantalla principal.
    const user = this.session.currentUser;
    if (user) {
      const home = user.role === UserRole.PRODUCTOR ? '/productor/home' : '/comprador/catalog';
      this.router.navigate([home], { replaceUrl: true });
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
