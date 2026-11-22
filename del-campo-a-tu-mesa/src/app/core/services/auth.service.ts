import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AuthRepository } from '../repositories/auth-repository.interface';
import { SessionService } from './session.service';
import { User } from '../models/user.model';
import { UserRole } from '../models/role.enum';
import { simpleHash } from '../utils/hash.util';

/**
 * Responsabilidad única: reglas de negocio de autenticación
 * (registro, login, logout, recuperación de contraseña).
 * Depende de la abstracción AuthRepository (Inversión de Dependencias),
 * por lo que puede trabajar con cualquier implementación de persistencia.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly session: SessionService
  ) {}

  register(name: string, email: string, password: string, role: UserRole): Observable<User> {
    return this.authRepository.getByEmail(email).pipe(
      switchMap((existing) => {
        if (existing) {
          return throwError(() => new Error('El correo ya está registrado.'));
        }
        const user: User = {
          id: crypto.randomUUID(),
          name,
          email,
          passwordHash: simpleHash(password),
          role,
        };
        return this.authRepository.create(user);
      }),
      tap((user) => this.session.start(user))
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.authRepository.getByEmail(email).pipe(
      map((user) => {
        if (!user || user.passwordHash !== simpleHash(password)) {
          throw new Error('Credenciales inválidas.');
        }
        return user;
      }),
      tap((user) => this.session.start(user))
    );
  }

  updateRole(role: UserRole): Observable<User> {
    const current = this.session.currentUser;
    if (!current) {
      return throwError(() => new Error('No hay sesión activa.'));
    }
    const updated: User = { ...current, role };
    return this.authRepository.update(updated).pipe(tap((user) => this.session.start(user)));
  }

  updateProfile(partial: Partial<User>): Observable<User> {
    const current = this.session.currentUser;
    if (!current) {
      return throwError(() => new Error('No hay sesión activa.'));
    }
    const updated: User = { ...current, ...partial };
    return this.authRepository.update(updated).pipe(tap((user) => this.session.start(user)));
  }

  recoverPassword(email: string, newPassword: string): Observable<User> {
    return this.authRepository.getByEmail(email).pipe(
      switchMap((user) => {
        if (!user) {
          return throwError(() => new Error('No existe una cuenta con ese correo.'));
        }
        const updated: User = { ...user, passwordHash: simpleHash(newPassword) };
        return this.authRepository.update(updated);
      })
    );
  }

  /**
   * Recupera la sesión guardada al abrir o recargar la app, para que el
   * usuario no tenga que iniciar sesión cada vez (RNF2, usabilidad).
   */
  restoreSession(): void {
    const storedId = this.session.getStoredUserId();
    if (!storedId) {
      return;
    }
    this.authRepository.getById(storedId).subscribe((user) => {
      if (user) {
        this.session.restore(user);
      } else {
        this.session.end();
      }
    });
  }

  logout(): void {
    this.session.end();
  }
}
