import { Injectable } from '@angular/core';
import { ContactMethod } from '../models/user.model';

/**
 * Responsabilidad única: construir y abrir el enlace externo adecuado
 * según el medio de contacto autorizado por el productor (RF11).
 * Abierto a extensión (Open/Closed): agregar un nuevo medio de contacto
 * solo requiere añadir un caso, sin modificar el resto de la lógica.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  buildLink(contact: ContactMethod): string {
    switch (contact.type) {
      case 'whatsapp':
        return `https://wa.me/${contact.value.replace(/\D/g, '')}`;
      case 'phone':
        return `tel:${contact.value}`;
      case 'email':
        return `mailto:${contact.value}`;
      default:
        throw new Error('Medio de contacto no soportado.');
    }
  }

  open(contact: ContactMethod): void {
    const link = this.buildLink(contact);
    window.open(link, '_blank');
  }
}
