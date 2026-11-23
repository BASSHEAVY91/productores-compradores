# Del Campo a Tu Mesa

Aplicación móvil multiplataforma (híbrida) construida con **Ionic + Angular + Capacitor**
que conecta productores campesinos con compradores de productos agrícolas, permitiendo
publicar, consultar, filtrar y contactar directamente sin intermediarios.

Este proyecto corresponde a la **Entrega 2 (Semana 5)** del módulo *Desarrollo de aplicación
móvil multiplataforma*: navegación completa implementada y avance de los requerimientos
funcionales definidos en el documento de diseño (Entrega 1).

## Stack tecnológico

- **Ionic 9** + **Angular 22** (NgModules, lazy loading por página)
- **Capacitor 8** (empaquetado nativo Android/iOS)
- Persistencia **local (localStorage)** — arquitectura *standalone*, sin backend externo
- Node 22 / npm 10

## Arquitectura y principios SOLID aplicados

```
src/app/
├── core/                        # Capa de dominio e infraestructura (compartida)
│   ├── models/                  # Entidades e interfaces de datos
│   │   ├── user.model.ts
│   │   ├── product.model.ts
│   │   ├── order.model.ts
│   │   └── role.enum.ts
│   ├── repositories/            # Abstracciones (puertos) + implementaciones
│   │   ├── auth-repository.interface.ts        (abstracción)
│   │   ├── product-repository.interface.ts     (abstracción)
│   │   ├── local-storage-auth.repository.ts    (implementación concreta)
│   │   ├── local-storage-product.repository.ts (implementación concreta)
│   │   ├── order-repository.interface.ts       (abstracción)
│   │   └── local-storage-order.repository.ts   (implementación concreta)
│   ├── services/                # Lógica de negocio (casos de uso)
│   │   ├── auth.service.ts
│   │   ├── product.service.ts
│   │   ├── session.service.ts
│   │   ├── contact.service.ts
│   │   ├── producer-lookup.service.ts
│   │   ├── order.service.ts
│   │   └── payment-gateway.ts   (PaymentGateway + SimulatedPaymentGateway)
│   ├── guards/                  # Control de acceso por ruta
│   │   ├── auth.guard.ts
│   │   └── role.guard.ts
│   └── utils/
│       └── hash.util.ts
├── welcome/                     # P0 - Inicio / Bienvenida
├── auth/
│   ├── login/                   # P1 - Registro / Inicio de sesión
│   └── role-selection/          # P2 - Selección de rol
├── productor/
│   ├── home/                    # P3 - Home Productor
│   └── product-form/            # P4 - Publicar / Editar producto
└── comprador/
    ├── catalog/                 # P5 - Home Comprador (catálogo)
    ├── filters/                 # P6 - Búsqueda y filtros
    ├── product-detail/          # P7 - Detalle de producto
    ├── producer-contact/        # P8 - Perfil del productor / Contacto
    ├── checkout/                # P9 - Pago simulado
    └── purchases/               # P10 - Mis compras
```

### Cómo se aplican los principios SOLID

- **S — Responsabilidad única.** Cada servicio tiene una sola razón de cambio:
  `SessionService` solo gestiona el estado de sesión, `AuthService` solo reglas de
  autenticación, `ProductService` solo reglas de productos, `ContactService` solo
  construcción/apertura de enlaces de contacto.
- **O — Abierto/Cerrado.** `ContactService` puede soportar nuevos medios de contacto
  (ej. Telegram) agregando un caso, sin modificar los componentes que lo consumen.
  Las rutas protegidas usan `RoleGuard` genérico basado en `route.data['role']`, por lo
  que agregar una nueva ruta con rol no requiere tocar el guard.
- **L — Sustitución de Liskov.** `LocalStorageAuthRepository` y
  `LocalStorageProductRepository` cumplen completamente el contrato de sus abstracciones
  (`AuthRepository`, `ProductRepository`) y pueden sustituirse por una implementación
  basada en Firebase/REST sin romper a los servicios que las consumen.
- **I — Segregación de interfaces.** Las abstracciones de repositorio exponen únicamente
  los métodos que sus consumidores necesitan (no hay métodos "god interface").
- **D — Inversión de dependencias.** Los servicios de negocio (`AuthService`,
  `ProductService`) dependen de las clases abstractas `AuthRepository` /
  `ProductRepository`, nunca de la implementación en localStorage. El enlace entre
  abstracción e implementación se resuelve en un único punto de composición:
  `app.module.ts` (`providers`).

## Flujo de navegación (P0 → P10)

| Código | Pantalla | Ruta |
|---|---|---|
| P0 | Inicio / Bienvenida | `/welcome` |
| P1 | Registro / Inicio de sesión | `/login` |
| P2 | Selección de rol | `/role-selection` |
| P3 | Home Productor | `/productor/home` |
| P4 | Publicar / Editar producto | `/productor/product-form` |
| P5 | Catálogo (Comprador) | `/comprador/catalog` |
| P6 | Búsqueda y filtros | `/comprador/filters` |
| P7 | Detalle de producto | `/comprador/product-detail/:id` |
| P8 | Perfil del productor / Contacto | `/comprador/producer-contact/:id` |
| P9 | Pago simulado | `/comprador/checkout/:id` |
| P10 | Mis compras | `/comprador/purchases` |

El acceso a `/productor/*` y `/comprador/*` está protegido por `AuthGuard` (sesión activa)
y `RoleGuard` (rol correspondiente), implementando RF1 y RNF3.

## Requerimientos funcionales cubiertos en este avance

- RF1, RF2, RF3 — Registro, login, recuperación de contraseña y cierre de sesión.
- RF4 — Selección/actualización de rol (perfil).
- RF5, RF6, RF7 — Publicar, editar y desactivar productos.
- RF8, RF9 — Consultar catálogo y buscar/filtrar por nombre, categoría, ubicación y precio.
- RF10, RF11 — Ver detalle del producto y contactar al productor (WhatsApp/llamada/correo).
- Pago simulado — el comprador elige cantidad y medio de pago (Nequi, PSE, tarjeta o
  contraentrega), la app simula el cobro, genera un pedido con número de referencia,
  descuenta el inventario del producto y lo muestra en *Mis compras* (P10).

### Pago simulado y SOLID

- `PaymentGateway` es una abstracción; `SimulatedPaymentGateway` es la implementación
  usada en este prototipo (no cobra dinero real ni pide datos bancarios). Se enlaza en
  `app.module.ts`, así que una pasarela real (Wompi, PayU…) se podría conectar sin
  modificar `OrderService` (Abierto/Cerrado + Inversión de Dependencias).
- `OrderService` solo contiene las reglas de la compra (validar cantidad, cobrar,
  registrar pedido, descontar inventario) y `LocalStorageOrderRepository` solo
  persiste los pedidos (Responsabilidad única).

## Scripts

```bash
npm install          # instalar dependencias (requiere Node >= 22.13)
npm start             # servir en navegador (ng serve)
npm run build         # build de producción (ng build)
npx cap sync android  # sincronizar build web con el proyecto Android nativo
npx cap open android  # abrir el proyecto en Android Studio para generar el APK
```

## Generar el APK

1. `npm run build`
2. `npx cap sync android`
3. `npx cap open android` (abre Android Studio)
4. Build > Build Bundle(s) / APK(s) > Build APK(s)

## Notas de la entrega

- La arquitectura es **standalone**: toda la información (usuarios y productos) se
  almacena en el dispositivo mediante `localStorage`, sin depender de un servidor externo,
  conforme a lo indicado en las instrucciones del proyecto (Semana 3).
- El cifrado de contraseñas (`hash.util.ts`) es una implementación simplificada adecuada
  para un prototipo académico; en un entorno de producción se recomienda delegar la
  autenticación a un backend con bcrypt/Argon2 y HTTPS.
