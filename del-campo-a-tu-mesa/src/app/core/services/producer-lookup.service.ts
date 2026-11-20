import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

/**
 * Servicio auxiliar de sólo lectura para obtener datos públicos del productor
 * a partir de su id. Responsabilidad única: consulta de usuarios por id.
 */
@Injectable({ providedIn: 'root' })
export class ProducerLookupService {
  getProducerById(producerId: string): Observable<User | undefined> {
    const raw = localStorage.getItem('dctm_users');
    const users: User[] = raw ? JSON.parse(raw) : [];
    const user = users.find((u) => u.id === producerId);
    return new Observable<User | undefined>((subscriber) => {
      subscriber.next(user);
      subscriber.complete();
    });
  }
}
