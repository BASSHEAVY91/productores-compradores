import { UserRole } from '../models/role.enum';
import { ProductCategory } from '../models/product.model';
import { ContactMethod } from '../models/user.model';

/**
 * Datos de demostración que se cargan automáticamente la primera vez
 * que se abre la app (ver SeedService). Permiten probar la app (y el APK)
 * sin tener que registrar usuarios ni publicar productos a mano.
 *
 * Fotos: Wikimedia Commons (licencias libres). Ver CREDITOS.md.
 */

/** Contraseña de todas las cuentas de demostración. */
export const DEMO_PASSWORD = 'demo123';

/**
 * Número de WhatsApp del productor de demostración.
 * Reemplazar por el número (con indicativo 57) de un integrante del grupo
 * que acepte recibir mensajes de prueba.
 */
const DEMO_WHATSAPP = '573183313820';

const WIKIMEDIA = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';

export interface SeedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  location?: string;
  contactMethod?: ContactMethod;
}

export interface SeedProduct {
  id: string;
  producerId: string;
  name: string;
  description: string;
  price: number;
  quantityAvailable: number;
  category: ProductCategory;
  location: string;
  photoUrl?: string;
}

export const SEED_USERS: SeedUser[] = [
  {
    id: 'demo-productor-1',
    name: 'Finca La Esperanza',
    email: 'productor1@demo.com',
    role: UserRole.PRODUCTOR,
    location: 'Fusagasugá, Cundinamarca',
    contactMethod: { type: 'whatsapp', value: DEMO_WHATSAPP },
  },
  {
    id: 'demo-productor-2',
    name: 'Asociación Campesina de Ubaté',
    email: 'productor2@demo.com',
    role: UserRole.PRODUCTOR,
    location: 'Ubaté, Cundinamarca',
    contactMethod: { type: 'phone', value: '6010000000' },
  },
  {
    id: 'demo-productor-3',
    name: 'Granja El Roble',
    email: 'productor3@demo.com',
    role: UserRole.PRODUCTOR,
    location: 'Tunja, Boyacá',
    contactMethod: { type: 'email', value: 'granjaelroble@example.com' },
  },
  {
    id: 'demo-comprador-1',
    name: 'Restaurante Sabor Local',
    email: 'comprador@demo.com',
    role: UserRole.COMPRADOR,
  },
];

export const SEED_PRODUCTS: SeedProduct[] = [
  // Finca La Esperanza - Fusagasugá
  {
    id: 'demo-prod-guanabana',
    producerId: 'demo-productor-1',
    name: 'Guanábana',
    description:
      'Guanábana fresca de finca, pulpa blanca, cremosa y dulce. Ideal para jugos, batidos y postres. Precio por kilo.',
    price: 5500,
    quantityAvailable: 80,
    category: ProductCategory.FRUTAS,
    location: 'Fusagasugá, Cundinamarca',
    photoUrl:
      WIKIMEDIA +
      'a/a3/Soursop%2C_Annona_muricata.jpg/960px-Soursop%2C_Annona_muricata.jpg',
  },
  {
    id: 'demo-prod-naranja',
    producerId: 'demo-productor-1',
    name: 'Naranja tangelo',
    description:
      'Naranja jugosa recién cosechada, perfecta para jugo natural. Precio por kilo.',
    price: 2500,
    quantityAvailable: 200,
    category: ProductCategory.FRUTAS,
    location: 'Fusagasugá, Cundinamarca',
    photoUrl:
      WIKIMEDIA +
      'e/e3/Oranges_-_whole-halved-segment.jpg/960px-Oranges_-_whole-halved-segment.jpg',
  },
  {
    id: 'demo-prod-platano',
    producerId: 'demo-productor-1',
    name: 'Plátano verde',
    description:
      'Plátano hartón verde, ideal para patacones y sopas. Precio por kilo.',
    price: 2800,
    quantityAvailable: 150,
    category: ProductCategory.VERDURAS,
    location: 'Fusagasugá, Cundinamarca',
    photoUrl:
      WIKIMEDIA +
      '3/3f/PlatanosVerdesBarranquilla.jpg/960px-PlatanosVerdesBarranquilla.jpg',
  },

  // Asociación Campesina de Ubaté
  {
    id: 'demo-prod-queso',
    producerId: 'demo-productor-2',
    name: 'Queso campesino',
    description:
      'Queso campesino fresco, hecho en finca con leche del día. Precio por libra.',
    price: 9000,
    quantityAvailable: 25,
    category: ProductCategory.LACTEOS,
    location: 'Ubaté, Cundinamarca',
    photoUrl:
      WIKIMEDIA +
      'c/c5/Queso_Criollo_campesino.jpg/960px-Queso_Criollo_campesino.jpg',
  },
  {
    id: 'demo-prod-huevos',
    producerId: 'demo-productor-2',
    name: 'Huevos campesinos',
    description:
      'Huevos de gallina criolla de pastoreo. Precio por cubeta de 30 unidades.',
    price: 18000,
    quantityAvailable: 40,
    category: ProductCategory.OTROS,
    location: 'Ubaté, Cundinamarca',
    photoUrl:
      WIKIMEDIA +
      'd/dd/Eggs_in_basket_2020_G1.jpg/960px-Eggs_in_basket_2020_G1.jpg',
  },
  {
    id: 'demo-prod-papa',
    producerId: 'demo-productor-2',
    name: 'Papa criolla',
    description:
      'Papa criolla amarilla recién cosechada. Ideal para ajiaco, sudados o frita. Precio por kilo.',
    price: 3500,
    quantityAvailable: 150,
    category: ProductCategory.VERDURAS,
    location: 'Ubaté, Cundinamarca',
    photoUrl: WIKIMEDIA + 'd/d6/Papa_criolla_1.jpg/960px-Papa_criolla_1.jpg',
  },

  // Granja El Roble - Tunja
  {
    id: 'demo-prod-mora',
    producerId: 'demo-productor-3',
    name: 'Mora de Castilla',
    description:
      'Mora de Castilla fresca, dulce y ácida. Ideal para jugos y mermeladas. Precio por kilo.',
    price: 6000,
    quantityAvailable: 40,
    category: ProductCategory.FRUTAS,
    location: 'Tunja, Boyacá',
    photoUrl: WIKIMEDIA + '8/8c/Rubus_glaucus.jpg/960px-Rubus_glaucus.jpg',
  },
  {
    id: 'demo-prod-aguacate',
    producerId: 'demo-productor-3',
    name: 'Aguacate Hass',
    description:
      'Aguacate Hass de pulpa cremosa, listo para consumir en 2 a 3 días. Precio por kilo.',
    price: 7000,
    quantityAvailable: 60,
    category: ProductCategory.FRUTAS,
    location: 'Tunja, Boyacá',
    photoUrl:
      WIKIMEDIA +
      'c/c9/Avocado_Hass_-_single_and_halved.jpg/960px-Avocado_Hass_-_single_and_halved.jpg',
  },
  {
    id: 'demo-prod-panela',
    producerId: 'demo-productor-3',
    name: 'Panela',
    description:
      'Panela de caña de trapiche tradicional, sin químicos. Precio por bloque de 500 g.',
    price: 3000,
    quantityAvailable: 120,
    category: ProductCategory.OTROS,
    location: 'Tunja, Boyacá',
    photoUrl: WIKIMEDIA + '0/08/Panela.jpg/960px-Panela.jpg',
  },
];
