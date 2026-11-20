import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserRole } from '../../core/models/role.enum';

@Component({
  selector: 'app-role-selection',
  templateUrl: './role-selection.page.html',
  styleUrls: ['./role-selection.page.scss'],
  standalone: false,
})
export class RoleSelectionPage {
  loading = false;
  readonly UserRole = UserRole;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  selectRole(role: UserRole): void {
    this.loading = true;
    this.authService.updateRole(role).subscribe({
      next: () => {
        this.loading = false;
        if (role === UserRole.PRODUCTOR) {
          this.router.navigate(['/productor/home']);
        } else {
          this.router.navigate(['/comprador/catalog']);
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
