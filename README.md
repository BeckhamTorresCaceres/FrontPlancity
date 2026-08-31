# PlanCity

PlanCity es una aplicación web para descubrir, guardar y administrar eventos locales. Este repositorio contiene el frontend: se conecta a una API REST para autenticación, eventos, categorías y favoritos.

Está construida con React, TypeScript y Vite. La interfaz usa Tailwind CSS y cuenta con áreas protegidas para clientes y administradores.

## Funcionalidades

### Visitantes

- Consultar el catálogo público de eventos.
- Ver nombre, descripción, fecha, ubicación, precio, capacidad, categoría e imágenes.
- Crear una cuenta o iniciar sesión.

### Clientes

- Buscar eventos por nombre o descripción y filtrarlos por categoría.
- Agregar y quitar eventos de favoritos.
- Consultar la vista exclusiva de favoritos.
- Cambiar la contraseña indicando la actual y confirmando la nueva.

### Administradores

- Crear, editar y eliminar eventos.
- Añadir imágenes a un evento mediante URL.
- Crear, editar y eliminar categorías.
- Evitar eliminar categorías que todavía tengan eventos asociados.

## Tecnologías

- React 19, TypeScript y Vite 8
- React Router 7
- Axios
- Tailwind CSS 4 y Lucide React
- Vitest, React Testing Library y jsdom
- ESLint

## Requisitos

- Node.js 20 o superior
- npm 10 o superior
- La API de PlanCity ejecutándose y accesible desde el navegador

## Instalación y ejecución

1. Clona el repositorio y entra en la carpeta.

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd FrontPlancity
   ```

2. Instala las dependencias.

   ```bash
   npm install
   ```

3. Crea o ajusta `.env` con la URL de la API.

   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. Inicia el proyecto.

   ```bash
   npm run dev
   ```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

## Comandos

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el entorno de desarrollo. |
| `npm run build` | Comprueba TypeScript y crea `dist/` para producción. |
| `npm run preview` | Sirve localmente la versión construida. |
| `npm run lint` | Analiza el código con ESLint. |
| `npm run test` | Ejecuta la suite de pruebas una sola vez. |
| `npm run test:watch` | Ejecuta las pruebas en modo observación. |

## Pruebas

Las pruebas se escriben con Vitest y React Testing Library. Cubren los flujos principales de autenticación, cambio de contraseña, catálogo, favoritos, tarjetas de eventos, formularios administrativos y servicios HTTP.

```bash
npm run test
```

Los archivos de prueba están junto al código que validan, con el sufijo `.test.ts` o `.test.tsx`. La configuración común está en `src/test/setup.ts`.

## Rutas

| Ruta | Acceso | Descripción |
| --- | --- | --- |
| `/` | Público | Catálogo de eventos para visitantes. |
| `/auth` | Público | Inicio de sesión y registro. |
| `/client` | Cliente autenticado | Catálogo con búsqueda, filtros y favoritos. |
| `/client/favorites` | Cliente autenticado | Eventos favoritos. |
| `/client/password` | Cliente autenticado | Cambio de contraseña. |
| `/admin` y `/admin/events` | Administrador | Gestión de eventos. |
| `/admin/categories` | Administrador | Gestión de categorías. |

Las rutas privadas comprueban la sesión y el rol (`user` o `admin`). Los visitantes son redirigidos a `/auth` cuando intentan abrir un área privada.

## Integración con la API

La URL base se toma de `VITE_API_URL`. Axios añade automáticamente `Authorization: Bearer <token>` a cada solicitud autenticada.

El token se guarda en `localStorage` con la clave `accessToken`. Ante una respuesta `401`, se elimina para cerrar una sesión inválida; el cambio de contraseña conserva el token para permitir informar un error de contraseña actual sin cerrar sesión.

| Recurso | Operaciones utilizadas |
| --- | --- |
| Autenticación | `POST /auth/login`, `POST /auth/register`, `POST /auth/logout` |
| Perfil | `GET /users/me`, `PATCH /users/me/password` |
| Eventos | `GET`, `POST`, `PATCH` y `DELETE /events` |
| Categorías | `GET`, `POST`, `PATCH` y `DELETE /categories` |
| Favoritos | `GET /favorites`, `POST` y `DELETE /favorites/:eventId` |

## Estructura

```text
src/
├── Context/              # Estado global de autenticación
├── features/
│   ├── admin/            # Gestión de eventos y categorías
│   ├── auth/             # Login, registro y guards
│   ├── client/           # Catálogo privado, favoritos y contraseña
│   └── home/             # Catálogo público y tarjetas de evento
├── lib/                  # Axios y almacenamiento del token
├── services/             # Clientes de recursos de la API
├── test/                 # Configuración compartida de pruebas
├── types/                # Tipos de dominio
├── App.tsx               # Punto de entrada de la interfaz
└── Router.tsx            # Rutas y layouts
```

## Flujo de autenticación

1. El usuario inicia sesión o se registra.
2. La API devuelve un `accessToken`, que se guarda localmente.
3. El frontend consulta `/users/me` para conocer el perfil y el rol.
4. Según el rol, navega a `/client` o `/admin`.
5. Al cerrar sesión se intenta notificar a la API y se elimina el token local.

## Producción

Configura `VITE_API_URL` con la URL pública de la API y ejecuta:

```bash
npm run build
```

El resultado se genera en `dist/` y puede desplegarse como sitio estático.
