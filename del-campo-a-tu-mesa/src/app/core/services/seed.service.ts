import { Injectable } from '@angular/core';
import { AuthRepository } from '../repositories/auth-repository.interface';
import { ProductRepository } from '../repositories/product-repository.interface';
import { DEMO_PASSWORD, SEED_PRODUCTS, SEED_USERS } from '../data/seed-data';
import { simpleHash } from '../utils/hash.util';

/**
 * Versión de los datos de demostración. Si se cambia algo en seed-data.ts
 * (por ejemplo el número de WhatsApp), subir este número para que los
 * dispositivos que ya tenían los datos reciban la actualización.
 */
const SEED_VERSION = 2;
const SEED_FLAG_KEY = 'dctm_seed_version';

/**
 * Responsabilidad única: cargar los datos de demostración una sola vez
 * por dispositivo. Usa las abstracciones de repositorio (Inversión de
 * Dependencias), así que seguirá funcionando si se cambia localStorage
 * por Firebase u otra persistencia.
 */
@Injectable({ providedIn: 'root' })
export class SeedService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly productRepository: ProductRepository
  ) {}

  seedIfNeeded(): void {
    const savedVersion = Number(localStorage.getItem(SEED_FLAG_KEY) ?? 0);
    if (savedVersion >= SEED_VERSION) {
      return;
    }

    for (const seedUser of SEED_USERS) {
      this.authRepository.getByEmail(seedUser.email).subscribe((existing) => {
        if (!existing) {
          this.authRepository
            .create({ ...seedUser, passwordHash: simpleHash(DEMO_PASSWORD) })
            .subscribe();
        } else if (existing.id === seedUser.id) {
          // Cuenta de demostración ya existente: se actualizan sus datos
          // (nombre, ubicación, contacto) conservando la contraseña.
          this.authRepository.update({ ...existing, ...seedUser }).subscribe();
        }
      });
    }

    const createdAt = new Date().toISOString();
    for (const seedProduct of SEED_PRODUCTS) {
      this.productRepository.getById(seedProduct.id).subscribe((existing) => {
        if (!existing) {
          this.productRepository
            .create({ ...seedProduct, active: true, createdAt })
            .subscribe();
        }
      });
    }

    localStorage.setItem(SEED_FLAG_KEY, String(SEED_VERSION));
  }
}
