import { Observable } from 'rxjs';
import { User } from '../models/user.model';

/**
 * Abstracción (puerto) para la persistencia y consulta de usuarios.
 * Principio de Inversión de Dependencias (D de SOLID): los servicios
 * de autenticación dependen de esta interfaz, no de una implementación concreta.
 */
export abstract class AuthRepository {
  abstract getByEmail(email: string): Observable<User | undefined>;
  abstract create(user: User): Observable<User>;
  abstract update(user: User): Observable<User>;
}
