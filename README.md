# Labtronix Metrology – Plataforma de Gestión MVP

<p align="center">
  <img src="./log_Labronix-Cuadrado.png" alt="Labtronix Logo" width="120" />
</p>

<p align="center">
  <strong>Sistema de gestión integral para laboratorio de metrología</strong><br/>
  NestJS + Next.js 14 · PostgreSQL · TypeORM · JWT · TypeScript
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Backend-NestJS%2010-ea2845?style=for-the-badge&logo=nestjs" />
  <img src="https://img.shields.io/badge/Frontend-Next.js%2014-000000?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL%2015-336791?style=for-the-badge&logo=postgresql" />
  <img src="https://img.shields.io/badge/ORM-TypeORM-fe0902?style=for-the-badge" />
</p>

---

## 📋 Tabla de Contenido

- [Arquitectura](#arquitectura)
- [Requisitos previos](#requisitos-previos)
- [Instalación y Setup](#instalación-y-setup)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Módulos del sistema](#módulos-del-sistema)
- [Roles y permisos](#roles-y-permisos)
- [API Reference](#api-reference)
- [Despliegue en VPS](#despliegue-en-vps)
- [Estructura del repositorio](#estructura-del-repositorio)

---

## Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                        Nginx (443/80)                    │
│              Reverse Proxy + SSL (Let's Encrypt)         │
└────────────────┬──────────────────────────┬─────────────┘
                 │                          │
         ┌───────▼──────┐          ┌────────▼───────┐
         │  Next.js 14  │          │   NestJS API   │
         │  Port: 3000  │          │   Port: 3001   │
         │  (Frontend)  │          │   /api/v1/     │
         └──────────────┘          └────────┬───────┘
                                            │
                                   ┌────────▼───────┐
                                   │  PostgreSQL 15 │
                                   │  Port: 5432    │
                                   └────────────────┘
```

---

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 20 LTS |
| npm | 10+ |
| PostgreSQL | 15+ |
| Git | 2.40+ |

---

## Instalación y Setup

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/labtronixmetrology.git
cd labtronixmetrology
```

### 2. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL y JWT secret
```

### 3. Configurar la Base de Datos

```bash
# Crear la base de datos en PostgreSQL
psql -U postgres -c "CREATE DATABASE labtronix_db;"
psql -U postgres -c "CREATE USER labtronix_user WITH ENCRYPTED PASSWORD 'tu_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE labtronix_db TO labtronix_user;"
```

### 4. Ejecutar migraciones y seed

```bash
cd backend

# Las tablas se crean automáticamente con synchronize: true (desarrollo)
# Para producción usar migraciones: npm run migration:run

# Sembrar usuario administrador inicial
npm run seed
```

> El seed crea los siguientes usuarios por defecto:
> | Email | Contraseña | Rol |
> |---|---|---|
> | admin@labtronix.com | Admin2026! | ADMIN |
> | comercial@labtronix.com | Comercial2026! | COMERCIAL |
> | tecnico@labtronix.com | Tecnico2026! | TECNICO |

### 5. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.local.example .env.local
# Editar NEXT_PUBLIC_API_URL
```

### 6. Ejecutar en desarrollo

```bash
# Terminal 1 – Backend
cd backend && npm run start:dev

# Terminal 2 – Frontend
cd frontend && npm run dev
```

El sistema estará disponible en:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api/v1
- **Swagger Docs:** http://localhost:3001/api/docs

---

## Variables de entorno

### Backend (`backend/.env`)

```env
# Base de datos
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=labtronix_db
DATABASE_USER=labtronix_user
DATABASE_PASSWORD=CHANGE_ME

# JWT
JWT_SECRET=CHANGE_ME_SECRET_KEY_LONG_AND_RANDOM_MIN_32_CHARS
JWT_EXPIRES_IN=8h

# App
PORT=3001
NODE_ENV=development

# Frontend URL (CORS)
FRONTEND_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

---

## Scripts disponibles

### Backend

| Script | Descripción |
|---|---|
| `npm run start:dev` | Servidor en modo desarrollo (hot-reload) |
| `npm run build` | Compilación TypeScript para producción |
| `npm run start:prod` | Iniciar en modo producción |
| `npm run seed` | Sembrar usuarios iniciales |
| `npm run lint` | ESLint |

### Frontend

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Iniciar build de producción |
| `npm run lint` | ESLint |

---

## Módulos del sistema

| Módulo | Descripción | Roles con acceso |
|---|---|---|
| 🏠 Dashboard | KPIs, métricas y resumen general | Todos |
| 👥 Clientes | CRUD completo de empresas clientes | ADMIN, COMERCIAL |
| 📄 Cotizaciones | Gestión con ítems dinámicos + PDF | ADMIN, COMERCIAL |
| 🔧 Equipos | Registro de recepción de equipos | ADMIN, COMERCIAL |
| 📋 Órdenes de Trabajo | Gestión de OTs + estados + sticker | ADMIN, TECNICO |
| 📬 Solicitudes Email | Bandeja de correos capturados | ADMIN, COMERCIAL |
| 👤 Usuarios | Gestión de cuentas del sistema | ADMIN |
| ⚙️ Admin | Logs de actividad + configuración | ADMIN |

---

## Roles y permisos

| Módulo / Acción | ADMIN | COMERCIAL | TECNICO |
|---|:---:|:---:|:---:|
| Gestión de usuarios | ✅ | ❌ | ❌ |
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
| Logs de actividad | ✅ | ❌ | ❌ |

---

## API Reference

Base URL: `http://localhost:3001/api/v1`

### Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/logout` | Cerrar sesión |
| GET | `/auth/me` | Datos del usuario actual |

### Usuarios
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/users` | Listar usuarios |
| POST | `/users` | Crear usuario |
| PATCH | `/users/:id` | Actualizar usuario |
| DELETE | `/users/:id` | Desactivar usuario |

### Clientes
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/clients` | Listar clientes |
| GET | `/clients/:id` | Detalle de cliente |
| POST | `/clients` | Crear cliente |
| PATCH | `/clients/:id` | Actualizar cliente |
| DELETE | `/clients/:id` | Desactivar cliente |

### Cotizaciones
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/quotes` | Listar cotizaciones |
| GET | `/quotes/:id` | Detalle |
| POST | `/quotes` | Crear cotización |
| PATCH | `/quotes/:id` | Actualizar cotización |
| GET | `/quotes/:id/pdf` | Generar y descargar PDF |

### Equipos
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/equipment` | Listar equipos |
| GET | `/equipment/:id` | Detalle |
| POST | `/equipment` | Registrar ingreso |
| PATCH | `/equipment/:id` | Actualizar equipo |

### Órdenes de Trabajo
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/work-orders` | Listar OTs |
| GET | `/work-orders/:id` | Detalle OT |
| POST | `/work-orders` | Crear OT |
| PATCH | `/work-orders/:id` | Actualizar OT |
| PATCH | `/work-orders/:id/status` | Cambiar estado OT |
| GET | `/work-orders/:id/sticker` | Datos para sticker térmico |

### Solicitudes de correo
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/email-requests` | Listar solicitudes |
| PATCH | `/email-requests/:id/process` | Procesar solicitud |
| PATCH | `/email-requests/:id/discard` | Descartar solicitud |

### Logs de actividad
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/activity-logs` | Listar logs (ADMIN) |

---

## Despliegue en VPS

### Requisitos del servidor
- Ubuntu 22.04 LTS
- 2 GB RAM mínimo
- Node.js 20 LTS
- PostgreSQL 15
- Nginx + Certbot (SSL)
- PM2

### Pasos rápidos

```bash
# 1. Clonar en el VPS
git clone ... && cd labtronixmetrology

# 2. Backend
cd backend && npm install && npm run build
pm2 start dist/main.js --name labtronix-api

# 3. Frontend
cd frontend && npm install && npm run build
pm2 start npm --name labtronix-web -- start

# 4. Nginx
sudo cp nginx/labtronix.conf /etc/nginx/sites-available/labtronix
sudo ln -s /etc/nginx/sites-available/labtronix /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 5. SSL
sudo certbot --nginx -d tudominio.com
```

---

## Estructura del repositorio

```
labtronixmetrology/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── clients/
│   │   ├── quotes/
│   │   ├── equipment/
│   │   ├── work-orders/
│   │   ├── email-requests/
│   │   ├── activity-logs/
│   │   ├── common/
│   │   │   ├── guards/
│   │   │   ├── decorators/
│   │   │   └── interceptors/
│   │   ├── database/
│   │   │   └── seed.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── app/
│   │   ├── (auth)/login/
│   │   └── (dashboard)/
│   │       ├── layout.tsx
│   │       ├── dashboard/
│   │       ├── clients/
│   │       ├── quotes/
│   │       ├── equipment/
│   │       ├── work-orders/
│   │       ├── email-requests/
│   │       ├── users/
│   │       └── admin/
│   ├── components/
│   │   ├── ui/
│   │   └── layout/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── hooks/
│   │   ├── types/
│   │   └── utils/
│   ├── middleware.ts
│   ├── .env.local.example
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── package.json
├── nginx/
│   └── labtronix.conf
├── docker-compose.yml
├── .gitignore
├── README.md
└── REQUERIMIENTOS_TECNICOS_LABTRONIX.md
```

---

## Solución de Problemas (Troubleshooting)

### Error: listen EADDRINUSE (Puerto ocupado en Windows)
Si al ejecutar `npm run start:dev` te aparece un error indicando que el puerto (ej. 3002 o 3001) ya está en uso (`EADDRINUSE`), puedes forzar el cierre del proceso en PowerShell con este comando:

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3002).OwningProcess | Stop-Process -Force
```
*(Cambia el 3002 por el puerto que esté fallando).*

---

*Labtronix Metrology – Plataforma MVP v1.0 · Desarrollado por Jhonatan Camilo Corredor Silva*

<!-- Kill port -->
npx kill-port 3002