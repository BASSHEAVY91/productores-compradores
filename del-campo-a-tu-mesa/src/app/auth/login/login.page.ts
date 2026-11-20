import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SessionService } from '../../core/services/session.service';
import { UserRole } from '../../core/models/role.enum';

type AuthMode = 'login' | 'register' | 'recover';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  mode: AuthMode = 'login';
  errorMessage = '';
  successMessage = '';
  loading = false;

  form: FormGroup = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly session: SessionService,
    private readonly router: Router
  ) {}

  setMode(mode: AuthMode | string | number | undefined): void {
    if (!mode) {
      return;
    }
    this.mode = mode as AuthMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;
    const { name, email, password } = this.form.value;

    if (this.mode === 'login') {
      this.authService.login(email, password).subscribe({
        next: () => this.redirectAfterAuth(),
        error: (err) => this.handleError(err),
      });
    } else if (this.mode === 'register') {
      // El rol se define definitivamente en P2 (Selección de rol).
      this.authService.register(name, email, password, UserRole.COMPRADOR).subscribe({
        next: () => this.router.navigate(['/role-selection']),
        error: (err) => this.handleError(err),
      });
    } else {
      this.authService.recoverPassword(email, password).subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = 'Contraseña actualizada. Ya puedes iniciar sesión.';
          this.mode = 'login';
        },
        error: (err) => this.handleError(err),
      });
    }
  }

  private redirectAfterAuth(): void {
    this.loading = false;
    const user = this.session.currentUser;
    if (!user) {
      this.router.navigate(['/role-selection']);
      return;
    }
    if (user.role === UserRole.PRODUCTOR) {
      this.router.navigate(['/productor/home']);
    } else {
      this.router.navigate(['/comprador/catalog']);
    }
  }

  private handleError(err: Error): void {
    this.loading = false;
    this.errorMessage = err.message || 'Ocurrió un error inesperado.';
  }
}
