/**
 * Utilidad simple de hashing para el prototipo (RNF3: contraseñas cifradas).
 * En producción se recomienda usar un algoritmo robusto (bcrypt, Argon2) en backend.
 * Al ser una app standalone sin servidor, se aplica un hash determinístico en cliente.
 */
export function simpleHash(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    const char = value.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `h${Math.abs(hash)}_${value.length}`;
}
