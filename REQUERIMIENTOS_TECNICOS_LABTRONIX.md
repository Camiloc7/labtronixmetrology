# Requerimientos Técnicos – Plataforma MVP Labtronix Metrologi

**Versión:** 1.0  
**Fecha:** 18 de junio de 2026  
**Consultor:** Jhonatan Camilo Corredor Silva  
**Cliente:** Labtronix Metrologi

---

## 1. Stack Tecnológico

| Capa | Tecnología | Versión mínima recomendada |
|---|---|---|
| Frontend | Next.js + TypeScript | Next.js 14+ (App Router) |
| Backend | NestJS + TypeScript | NestJS 10+ |
| ORM | TypeORM | 0.3+ |
| Base de Datos | PostgreSQL | 15+ |
| Autenticación | JWT + Cookies HttpOnly | — |
| Infraestructura | VPS (Linux, Ubuntu 22.04 LTS) | — |
| Reverse Proxy | Nginx | — |
| Proceso Backend | PM2 | — |
| Contenedores (opcional) | Docker + Docker Compose | — |

---

## 2. Infraestructura y Despliegue (VPS)

### 2.1 Requisitos del servidor
- Sistema operativo: Ubuntu 22.04 LTS
- Node.js 20 LTS instalado
- PostgreSQL 15 instalado y configurado
- Nginx como reverse proxy (puerto 80/443)
- PM2 para gestión del proceso NestJS
- Certificado SSL con Let's Encrypt (Certbot)
- Firewall UFW habilitado (solo puertos 22, 80, 443)

### 2.2 Estructura de despliegue
- El frontend Next.js corre en modo `next start` (build de producción) o exportado como estático según necesidad.
- El backend NestJS expone una API REST bajo `/api/v1/`.
- Nginx redirige el tráfico al frontend (puerto 3000) y al backend (puerto 3001) según la ruta.
- Las variables de entorno se gestionan mediante archivos `.env` en cada servicio (nunca en el repositorio).

### 2.3 Backups
- Script de backup programado vía `cron` para exportar la base de datos PostgreSQL (`pg_dump`) diariamente.
- Retención mínima de 7 días de backups locales en el VPS.

---

## 3. Autenticación y Seguridad

### 3.1 Flujo de autenticación
- Login mediante `POST /api/v1/auth/login` con `email` y `password`.
- El backend valida credenciales, genera un **JWT firmado** y lo almacena en una **cookie HttpOnly, Secure, SameSite=Strict** (no expuesto a JavaScript del cliente).
- El JWT incluye: `sub` (userId), `email`, `role`, `iat`, `exp`.
- Expiración del token: configurable vía variable de entorno (`JWT_EXPIRES_IN`), por defecto `8h`.
- Logout mediante `POST /api/v1/auth/logout` que limpia la cookie en el servidor.
- Ruta `GET /api/v1/auth/me` para validar sesión activa y retornar datos del usuario actual.

### 3.2 Contraseñas
- Hash con **bcrypt** (salt rounds mínimo 10) antes de persistir en base de datos.
- Nunca se almacena ni retorna la contraseña en texto plano.

### 3.3 Guards y decoradores (NestJS)
- `JwtAuthGuard`: valida el JWT de la cookie en cada request protegido.
- `RolesGuard`: verifica que el rol del usuario tenga permiso para el endpoint solicitado.
- Decorador `@Roles(...roles)` aplicable a controladores o métodos individuales.
- Todas las rutas protegidas deben tener aplicados ambos guards.

### 3.4 CORS
- Configurado en NestJS para aceptar únicamente el origen del frontend (dominio del VPS).
- `credentials: true` habilitado para que las cookies funcionen correctamente.

---

## 4. Manejo de Roles

Se definen tres roles base para el MVP:

| Rol | Descripción |
|---|---|
| `ADMIN` | Acceso total al sistema. Gestión de usuarios y configuración. |
| `COMERCIAL` | Gestión de clientes, cotizaciones e ingreso de equipos. |
| `TECNICO` | Gestión de órdenes de trabajo, estados de calibración y stickers. |

### 4.1 Matriz de permisos por módulo

| Módulo / Acción | ADMIN | COMERCIAL | TECNICO |
|---|:---:|:---:|:---:|
| Gestión de usuarios | ✅ | ❌ | ❌ |
| Ver todos los usuarios | ✅ | ❌ | ❌ |
| Clientes – CRUD completo | ✅ | ✅ | ❌ |
| Clientes – solo lectura | ✅ | ✅ | ✅ |
| Cotizaciones – CRUD | ✅ | ✅ | ❌ |
| Cotizaciones – solo lectura | ✅ | ✅ | ✅ |
| Ingreso de equipos | ✅ | ✅ | ❌ |
| Órdenes de trabajo – CRUD | ✅ | ❌ | ✅ |
| Órdenes de trabajo – lectura | ✅ | ✅ | ✅ |
| Cambio de estado OT | ✅ | ❌ | ✅ |
| Impresión de stickers | ✅ | ❌ | ✅ |
| Configuración general | ✅ | ❌ | ❌ |

### 4.2 Implementación frontend
- El frontend consume el endpoint `/api/v1/auth/me` al cargar para conocer el rol del usuario autenticado.
- Los componentes de navegación y las rutas de Next.js se renderizan condicionalmente según el rol.
- Las rutas protegidas usan un componente `ProtectedRoute` o middleware de Next.js que redirige a `/login` si no hay sesión válida.

---

## 5. Modelo de Base de Datos (PostgreSQL + TypeORM)

### 5.1 Entidades principales

#### `users`
```
id             UUID PK
name           VARCHAR(150) NOT NULL
email          VARCHAR(200) UNIQUE NOT NULL
password_hash  VARCHAR NOT NULL
role           ENUM('ADMIN','COMERCIAL','TECNICO') NOT NULL DEFAULT 'COMERCIAL'
is_active      BOOLEAN DEFAULT true
created_at     TIMESTAMP DEFAULT NOW()
updated_at     TIMESTAMP DEFAULT NOW()
```

#### `clients`
```
id             UUID PK
company_name   VARCHAR(200) NOT NULL
nit            VARCHAR(20) UNIQUE
contact_name   VARCHAR(150)
phone          VARCHAR(30)
email          VARCHAR(200)
address        TEXT
city           VARCHAR(100)
notes          TEXT
is_active      BOOLEAN DEFAULT true
created_at     TIMESTAMP DEFAULT NOW()
updated_at     TIMESTAMP DEFAULT NOW()
```

#### `quotes` (Cotizaciones)
```
id             UUID PK
quote_number   VARCHAR(30) UNIQUE NOT NULL  -- autogenerado
client_id      UUID FK → clients.id
created_by     UUID FK → users.id
status         ENUM('BORRADOR','ENVIADA','APROBADA','RECHAZADA') DEFAULT 'BORRADOR'
total_value    DECIMAL(12,2)
notes          TEXT
pdf_url        VARCHAR  -- ruta del PDF generado
valid_until    DATE
created_at     TIMESTAMP DEFAULT NOW()
updated_at     TIMESTAMP DEFAULT NOW()
```

#### `quote_items` (Ítems de cotización)
```
id             UUID PK
quote_id       UUID FK → quotes.id
description    VARCHAR(300) NOT NULL
quantity       INTEGER DEFAULT 1
unit_price     DECIMAL(12,2) NOT NULL
subtotal       DECIMAL(12,2) NOT NULL
```

#### `equipment` (Equipos recibidos)
```
id             UUID PK
client_id      UUID FK → clients.id
internal_code  VARCHAR(50) UNIQUE NOT NULL  -- autogenerado
brand          VARCHAR(100)
model          VARCHAR(100)
serial_number  VARCHAR(100)
capacity       VARCHAR(100)
location       VARCHAR(150)  -- ubicación dentro del laboratorio
received_at    TIMESTAMP DEFAULT NOW()
received_by    UUID FK → users.id
notes          TEXT
created_at     TIMESTAMP DEFAULT NOW()
updated_at     TIMESTAMP DEFAULT NOW()
```

#### `work_orders` (Órdenes de Trabajo)
```
id             UUID PK
ot_number      VARCHAR(30) UNIQUE NOT NULL  -- autogenerado, ej: OT-2026-0001
equipment_id   UUID FK → equipment.id
client_id      UUID FK → clients.id
quote_id       UUID FK → quotes.id NULLABLE
assigned_to    UUID FK → users.id NULLABLE
service_type   ENUM('PROPIO','TERCERIZADO') NOT NULL DEFAULT 'PROPIO'
status         ENUM('RECIBIDO','EN_PROCESO','CALIBRADO','LISTO_ENVIO','DESPACHADO') DEFAULT 'RECIBIDO'
technical_notes TEXT
sticker_printed BOOLEAN DEFAULT false
dispatched_at  TIMESTAMP NULLABLE
created_at     TIMESTAMP DEFAULT NOW()
updated_at     TIMESTAMP DEFAULT NOW()
```

#### `status_history` (Trazabilidad de cambios de estado)
```
id             UUID PK
work_order_id  UUID FK → work_orders.id
changed_by     UUID FK → users.id
previous_status VARCHAR(50)
new_status     VARCHAR(50)
changed_at     TIMESTAMP DEFAULT NOW()
notes          TEXT
```

#### `email_requests` (Solicitudes capturadas desde correo)
```
id             UUID PK
raw_content    TEXT NOT NULL  -- contenido original del correo
extracted_data JSONB          -- datos estructurados extraídos
client_id      UUID FK → clients.id NULLABLE
status         ENUM('PENDIENTE','PROCESADO','DESCARTADO') DEFAULT 'PENDIENTE'
processed_by   UUID FK → users.id NULLABLE
created_at     TIMESTAMP DEFAULT NOW()
```

---

## 6. API REST – Endpoints principales

Base URL: `/api/v1`

### Auth
| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| POST | `/auth/login` | Iniciar sesión | Público |
| POST | `/auth/logout` | Cerrar sesión | Autenticado |
| GET | `/auth/me` | Datos del usuario actual | Autenticado |

### Usuarios
| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/users` | Listar usuarios | ADMIN |
| POST | `/users` | Crear usuario | ADMIN |
| PATCH | `/users/:id` | Actualizar usuario | ADMIN |
| DELETE | `/users/:id` | Desactivar usuario | ADMIN |

### Clientes
| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/clients` | Listar clientes | ADMIN, COMERCIAL, TECNICO |
| GET | `/clients/:id` | Detalle de cliente | ADMIN, COMERCIAL, TECNICO |
| POST | `/clients` | Crear cliente | ADMIN, COMERCIAL |
| PATCH | `/clients/:id` | Actualizar cliente | ADMIN, COMERCIAL |
| DELETE | `/clients/:id` | Desactivar cliente | ADMIN |

### Cotizaciones
| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/quotes` | Listar cotizaciones | ADMIN, COMERCIAL, TECNICO |
| GET | `/quotes/:id` | Detalle | ADMIN, COMERCIAL, TECNICO |
| POST | `/quotes` | Crear cotización | ADMIN, COMERCIAL |
| PATCH | `/quotes/:id` | Actualizar cotización | ADMIN, COMERCIAL |
| GET | `/quotes/:id/pdf` | Generar y descargar PDF | ADMIN, COMERCIAL |

### Equipos
| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/equipment` | Listar equipos | ADMIN, COMERCIAL, TECNICO |
| GET | `/equipment/:id` | Detalle | ADMIN, COMERCIAL, TECNICO |
| POST | `/equipment` | Registrar ingreso de equipo | ADMIN, COMERCIAL |
| PATCH | `/equipment/:id` | Actualizar equipo | ADMIN, COMERCIAL |

### Órdenes de Trabajo
| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/work-orders` | Listar OTs | ADMIN, COMERCIAL, TECNICO |
| GET | `/work-orders/:id` | Detalle OT | ADMIN, COMERCIAL, TECNICO |
| POST | `/work-orders` | Crear OT | ADMIN, TECNICO |
| PATCH | `/work-orders/:id` | Actualizar OT | ADMIN, TECNICO |
| PATCH | `/work-orders/:id/status` | Cambiar estado OT | ADMIN, TECNICO |
| GET | `/work-orders/:id/sticker` | Datos para sticker térmico | ADMIN, TECNICO |

### Solicitudes de correo
| Método | Ruta | Descripción | Roles |
|---|---|---|---|
| GET | `/email-requests` | Listar solicitudes capturadas | ADMIN, COMERCIAL |
| PATCH | `/email-requests/:id/process` | Procesar y asociar solicitud | ADMIN, COMERCIAL |
| PATCH | `/email-requests/:id/discard` | Descartar solicitud | ADMIN, COMERCIAL |

---

## 7. Frontend – Estructura de vistas (Next.js App Router)

```
app/
├── (auth)/
│   └── login/                  # Página de login
├── (dashboard)/
│   ├── layout.tsx              # Layout con sidebar + validación de sesión
│   ├── dashboard/              # Resumen general (conteos por estado)
│   ├── clients/
│   │   ├── page.tsx            # Listado de clientes
│   │   ├── new/page.tsx        # Formulario creación
│   │   └── [id]/page.tsx       # Detalle / edición
│   ├── quotes/
│   │   ├── page.tsx            # Listado de cotizaciones
│   │   ├── new/page.tsx        # Formulario creación con ítems dinámicos
│   │   └── [id]/page.tsx       # Detalle + botón exportar PDF
│   ├── equipment/
│   │   ├── page.tsx            # Listado de equipos recibidos
│   │   └── new/page.tsx        # Formulario de recepción
│   ├── work-orders/
│   │   ├── page.tsx            # Listado de OTs con filtros por estado
│   │   └── [id]/page.tsx       # Detalle OT + cambio de estado + sticker
│   ├── email-requests/
│   │   └── page.tsx            # Bandeja de solicitudes capturadas
│   └── users/
│       └── page.tsx            # Gestión de usuarios (solo ADMIN)
└── middleware.ts               # Protección de rutas con validación JWT via cookie
```

---

## 8. Módulo de Generación de PDF (Cotizaciones)

- Librería recomendada en backend: `@nestjs/serve-static` + `pdfmake` o `puppeteer` (headless).
- El PDF de cotización debe incluir: logo de Labtronix, datos del cliente, tabla de ítems, totales, observaciones, fecha de validez y firma/datos del consultor.
- El endpoint `GET /quotes/:id/pdf` genera el PDF en tiempo real y lo retorna como stream con `Content-Type: application/pdf`.
- Opcionalmente guarda el PDF generado en el servidor y almacena la ruta en `quotes.pdf_url`.

---

## 9. Módulo de Impresión Térmica (Stickers 57mm)

- El endpoint `GET /work-orders/:id/sticker` retorna los datos estructurados para el sticker en JSON.
- El frontend tiene una vista de impresión optimizada para papel térmico de 57mm de ancho.
- El sticker debe contener: número de OT, código interno del equipo, cliente, fecha de ingreso, estado actual y código de barras/QR opcional.
- La impresión se dispara mediante `window.print()` con CSS `@media print` específico para el formato de 57mm.
- No se requiere integración con SDK propietario de impresora; el flujo pasa por el sistema de impresión del navegador/OS.

---

## 10. Módulo de Captura de Solicitudes por Correo

- El módulo permite que un usuario con rol ADMIN o COMERCIAL **pegue manualmente el contenido de un correo** en un campo de texto dentro del sistema.
- El backend aplica lógica de parsing (expresiones regulares + opcionalmente un modelo de lenguaje vía API) para extraer campos como: nombre del cliente, equipos, servicios solicitados y fecha.
- Los datos extraídos se almacenan en `email_requests.extracted_data` (JSONB) para revisión.
- El usuario revisa y confirma/corrige la extracción antes de convertir la solicitud en un cliente o cotización formal.
- **Nota:** El procesamiento automático directo desde el servidor de correo (IMAP/SMTP listener) está fuera del alcance del MVP pero la estructura de datos lo permite a futuro.

---

## 11. Variables de Entorno requeridas

### Backend (`.env`)
```env
# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=labtronix_db
DATABASE_USER=labtronix_user
DATABASE_PASSWORD=CHANGE_ME

# JWT
JWT_SECRET=CHANGE_ME_SECRET_KEY_LONG_AND_RANDOM
JWT_EXPIRES_IN=8h

# App
PORT=3001
NODE_ENV=production

# Frontend URL (CORS)
FRONTEND_URL=https://tudominio.com
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=https://tudominio.com/api/v1
```

---

## 12. Estructura de repositorio recomendada

```
labtronix/
├── backend/          # Proyecto NestJS
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── clients/
│   │   ├── quotes/
│   │   ├── equipment/
│   │   ├── work-orders/
│   │   ├── email-requests/
│   │   ├── common/          # Guards, decoradores, interceptores, DTOs base
│   │   └── main.ts
│   ├── .env
│   └── package.json
├── frontend/         # Proyecto Next.js
│   ├── app/
│   ├── components/
│   ├── lib/          # API client, hooks, helpers
│   ├── .env.local
│   └── package.json
├── nginx/
│   └── labtronix.conf
└── docker-compose.yml  (opcional)
```

---

## 13. Criterios de aceptación técnica

Un módulo se considera **completo y aceptado** cuando cumple todos los siguientes puntos:

- Los endpoints CRUD del módulo responden correctamente con los códigos HTTP esperados (200, 201, 400, 401, 403, 404).
- Los guards de autenticación y roles rechazan correctamente accesos no autorizados (401/403).
- Los datos persisten correctamente en PostgreSQL y las relaciones entre entidades se mantienen con integridad referencial.
- El frontend muestra, crea y actualiza la información del módulo sin errores en consola.
- Las acciones restringidas por rol no son visibles ni ejecutables desde el frontend para usuarios sin permiso.
- El módulo pasa al menos una ronda de pruebas funcionales con el cliente sin errores bloqueantes.

---

## 14. Exclusiones explícitas (fuera de alcance MVP)

- Facturación electrónica DIAN.
- Integración API con sistemas contables (SIIGO, World Office).
- WhatsApp Business API o bots automáticos.
- Aplicaciones móviles nativas (Android / iOS).
- Módulos de compras, bodega y catálogo de proveedores.
- Firmas digitales con token legal.
- Gestión documental con versionamiento (manuales de calidad).
- Dashboards analíticos gerenciales complejos.
- Listener automático de correos por IMAP/SMTP.

---

## 15. Roadmap de fases futuras

| Fase | Descripción |
|---|---|
| Fase 2 | Módulo de compras, requisiciones y gestión de proveedores |
| Fase 3 | Certificados avanzados y gestión documental ISO-17025 |
| Fase 4 | Facturación electrónica e integración contable |

---

*Documento de requerimientos técnicos – Uso interno del proyecto. Versión 1.0 – junio 2026.*
