import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

const SESSION_KEY = 'dctm_session_user_id';

/**
 * Responsabilidad única: mantener y exponer el estado de la sesión activa.
 * No conoce detalles de autenticación ni de persistencia de usuarios.
 */
@Injectable({ providedIn: 'root' })
export class SessionService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  start(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem(SESSION_KEY, user.id);
  }

  end(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem(SESSION_KEY);
  }

  getStoredUserId(): string | null {
    return localStorage.getItem(SESSION_KEY);
  }

  restore(user: User): void {
    this.currentUserSubject.next(user);
  }
}
