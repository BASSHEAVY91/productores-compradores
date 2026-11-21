import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SessionService } from '../../core/services/session.service';
import { ContactMethod } from '../../core/models/user.model';

/**
 * P3.1 - Perfil del productor (RF4).
 * Permite registrar nombre, ubicación y el medio de contacto autorizado,
 * que luego usa el comprador en P8 para contactarlo (RF11).
 */
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  saving = false;

  readonly contactTypes = [
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'phone', label: 'Llamada' },
    { value: 'email', label: 'Correo' },
  ];

  form: FormGroup = this.fb.group({
    name: ['', Validators.required],
    location: ['', Validators.required],
    contactType: ['whatsapp', Validators.required],
    contactValue: ['', Validators.required],
    authorizeContact: [false, Validators.requiredTrue],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly session: SessionService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    const user = this.session.currentUser;
    if (!user) {
      return;
    }
    this.form.patchValue({
      name: user.name,
      location: user.location ?? '',
      contactType: user.contactMethod?.type ?? 'whatsapp',
      contactValue: user.contactMethod?.value ?? '',
      authorizeContact: !!user.contactMethod,
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const contactMethod: ContactMethod = {
      type: value.contactType,
      value: value.contactValue.trim(),
    };

    this.saving = true;
    this.authService
      .updateProfile({
        name: value.name.trim(),
        location: value.location.trim(),
        contactMethod,
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.router.navigate(['/productor/home']);
        },
        error: () => (this.saving = false),
      });
  }
}
