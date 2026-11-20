import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthRepository } from './auth-repository.interface';
import { User } from '../models/user.model';

const STORAGE_KEY = 'dctm_users';

/**
 * Implementación concreta de AuthRepository usando localStorage.
 * Cumple el principio de Responsabilidad Única: solo se encarga de
 * la persistencia de usuarios en el dispositivo.
 */
@Injectable({ providedIn: 'root' })
export class LocalStorageAuthRepository extends AuthRepository {
  private readAll(): User[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  }

  private writeAll(users: User[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }

  getByEmail(email: string): Observable<User | undefined> {
    const users = this.readAll();
    return of(users.find((u) => u.email.toLowerCase() === email.toLowerCase()));
  }

  create(user: User): Observable<User> {
    const users = this.readAll();
    users.push(user);
    this.writeAll(users);
    return of(user);
  }

  update(user: User): Observable<User> {
    const users = this.readAll();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
      this.writeAll(users);
    }
    return of(user);
  }
}
