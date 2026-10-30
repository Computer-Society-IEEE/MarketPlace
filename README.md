# 🛍️ Marketplace UD

Plataforma tipo marketplace orientada a estudiantes universitarios, permitiendo la promoción de emprendimientos dentro del campus y la comercialización de productos (artículos de segunda mano, servicios, etc.). Por ahora está enfocada en las sedes de la Universidad Distrital y se diseña para poder escalar a otras instituciones en el futuro. Incluye un entorno virtual 3D del campus donde se ubican los puestos de venta.

---

## 📁 Estructura del Proyecto

```
marketplace-app/
├── frontend/           # App móvil React Native + Expo
├── backend/            # API REST Node.js + TypeScript
├── docs/               # Diagrama ER, mockups, propuesta de monetización
├── docker/             # (próximamente) Dockerfiles de cada servicio
├── docker-compose.yml  # (próximamente)
├── .gitignore
└── README.md
```

> **Estado actual:** ya existen `frontend/` y `backend/DB`. Las demás carpetas y la estructura interna de `backend/src` se irán agregando a medida que avance el desarrollo.

---

## 🏗️ Arquitectura General

El sistema busca seguir una **arquitectura hexagonal (Ports & Adapters)** organizada en un **monolito modular**, con separación clara entre capas:

```
Frontend (Expo)
      ↓
API REST (Node.js + TypeScript)
      ↓
┌─────────────────────────────────┐
│  Capa de Aplicación (Casos de uso) │
│  Dominio (Entidades + Reglas)       │
│  Infraestructura (DB, Auth, Storage)│
└─────────────────────────────────┘
      ↓
PostgreSQL
```

> **Nota:** para el MVP se prioriza una estructura simple por módulos (users, products, entrepreneurships, etc.). La separación estricta en capas se aplicará de forma progresiva, tomando como referencia el primer módulo completo que se implemente.

### Módulos del sistema

- **Usuarios** — registro, login, roles (comprador, vendedor, admin)
- **Emprendimientos** — creación y gestión de negocios universitarios
- **Catálogo** — publicación y listado de productos
- **Transacciones** — historial de compras y ventas
- **Moderación** — reportes y control de publicaciones
- **Sedes (e instituciones, a futuro)** — el usuario elige su sede; todo el contenido (productos, tiendas, pedidos) pertenece a una sede. El cambio de institución queda como mejora futura
- **Publicidad (pauta)** — destacados y campañas pagadas por anunciantes; siempre se muestran etiquetados como *Destacado* o *Publicidad*
- **Entorno 3D** — recreación virtual del campus y de los puestos de venta

> **Preparado para escalar:** las entidades principales (usuarios, tiendas, publicaciones, pedidos) llevan referencia a la sede, y la sede a una institución, aunque por ahora solo esté activa la Universidad Distrital. La pauta y el portal de anunciantes se implementan en una fase posterior, pero su modelo de datos se diseña desde ahora.
---

## 🧑‍💻 Roles de usuario

| Rol           | Descripción                                                    |
| ------------- | -------------------------------------------------------------- |
| **Comprador** | Busca productos, consulta historial, encuentra tiendas físicas |
| **Vendedor**  | Publica productos, gestiona su emprendimiento                  |
| **Admin**     | Modera publicaciones, gestiona usuarios, instituciones y reportes |
| **Anunciante** | Crea campañas y destacados, paga la pauta y consulta resultados (fase posterior) |

---

## 📱 Frontend — Expo (React Native)

### Tecnologías

- React Native + Expo SDK
- Expo Router (file-system routing)
- TypeScript
- Zustand (manejo de estado)
- Three.js con `@react-three/fiber/native` + `expo-gl` (entorno 3D)

### Estructura de carpetas

`app/` contiene solo las rutas (Expo Router), agrupadas por rol y delgadas. La lógica vive en `features/`, organizada por módulo y compartida entre roles.

```
frontend/
├── app/
│   ├── _layout.tsx            # Layout raíz: Stack + guard de sesión y modo activo
│   ├── index.tsx              # Redirige según sesión y modo
│   ├── (onboarding)/          # Bienvenida
│   ├── (auth)/                # Login, registro, verificación, recuperar contraseña
│   ├── (comun)/               # Pantallas compartidas entre roles
│   │   ├── mensajes/          # Lista de chats y chat [id]
│   │   ├── notificaciones.tsx
│   │   ├── cuenta/            # Perfil, ajustes, políticas, eliminar cuenta
│   │   ├── ayuda/             # Ayuda, artículos, PQRS
│   │   ├── vendedor/[id].tsx  # Perfil público del vendedor y reseñas
│   │   └── reportar.tsx
│   ├── (comprador)/
│   │   ├── _layout.tsx        # Navegación del comprador
│   │   ├── index.tsx          # Inicio
│   │   ├── buscar/            # Búsqueda, resultados, filtros
│   │   ├── producto/[id].tsx
│   │   ├── carrito.tsx
│   │   ├── checkout.tsx
│   │   ├── pedidos/           # Historial y seguimiento [id]
│   │   └── favoritos.tsx
│   ├── (vendedor)/
│   │   ├── _layout.tsx
│   │   ├── index.tsx          # Hub vendedor
│   │   ├── productos/         # Mis productos, nuevo, [id]/editar
│   │   └── ventas/            # Ventas y confirmación
│   ├── (anunciante)/          # Fase posterior: pauta
│   │   ├── _layout.tsx
│   │   ├── campanas/          # Crear, pagar, activa, vencida
│   │   └── resultados.tsx
│   └── (admin)/
│       ├── _layout.tsx
│       ├── index.tsx          # Tablero y métricas
│       ├── moderacion/
│       ├── usuarios/
│       ├── anunciantes/       # Fase posterior
│       ├── pqrs/
│       └── instituciones/     # Fase posterior
├── features/                  # Lógica por módulo (components, hooks, services, store)
│   ├── auth/
│   ├── cuenta/
│   ├── sedes/                 # Sedes de la UD (instituciones, a futuro)
│   ├── tiendas/
│   ├── productos/             # Catálogo, publicar y editar (vistas de comprador y vendedor)
│   ├── pedidos/               # Carrito, checkout, cupones, seguimiento, historial
│   ├── chat/
│   ├── resenas/               # Calificaciones y reputación
│   ├── moderacion/            # Reportes y moderación
│   ├── soporte/               # Ayuda y PQRS
│   ├── notificaciones/
│   ├── publicidad/            # Pauta y campañas (fase posterior)
│   ├── admin/                 # Tablero, métricas, pronóstico
│   └── world3d/               # Archivos de Three.js por sede
│       └── ingenieria/
│           ├── piso1.js
│           └── piso2.js
├── components/                # Solo UI genérica (Button, Card, Input, estados vacío/error/carga)
├── constants/                 # Tokens de diseño (colores, tipografía) tomados del mockup verde
├── services/                  # Cliente HTTP base
└── utils/
```

Reglas:

- Una pantalla en `app/` importa de `features/`, nunca al revés.
- Un `feature` no importa de otro `feature`; lo compartido sube a `components/` o `utils/`.
- Un componente que usa un solo módulo se queda en ese módulo.
- Las variantes por rol dentro de un módulo se separan en subcarpetas (`productos/components/comprador/`, `productos/components/vendedor/`).
- Las variantes de una misma pantalla (por ejemplo cada sede) son una ruta dinámica, no archivos duplicados.

### Instalación y arranque

```
cd frontend
npm install
npx expo start
```

Para abrir en dispositivo físico descarga **Expo Go** y escanea el QR que aparece en la terminal.

---

## ⚙️ Backend — Node.js + TypeScript

### Tecnologías

- Node.js + TypeScript
- Express.js
- PostgreSQL
- JWT para autenticación
- ORM Prisma
- API rest
- Cloudinary para almacenamiento de imágenes

### Estructura de carpetas (objetivo)

```
backend/
└── src/
    ├── domain/           # Entidades y reglas de negocio puras
    ├── application/      # Casos de uso
    ├── infrastructure/   # Controladores, repositorios, auth, storage
    ├── shared/           # Errores, tipos, utilidades comunes
    └── main.ts           # Punto de entrada
```

### Instalación y arranque

```
cd backend
npm install
npm run dev
```

---

## 🌐 Entorno Virtual 3D — Three.js

Recreación virtual del campus en 3D. La universidad cuenta con **2 pisos** donde está autorizada la venta; el desarrollo inicia con el **piso 1**.

- Vive **dentro de la app Expo** (`frontend/features/world3d/`) y se abre desde la sección de Tiendas físicas.
- Se construye con `react-three-fiber` para que corra en móvil desde el inicio; se debe probar en un dispositivo real desde la primera semana (rendimiento y carga de GLB).
- Mantener los modelos livianos (pocos polígonos y texturas pequeñas).- Los modelos (usuarios, puestos, escenario) se exportan en formato **glTF/GLB**.
- Cada puesto 3D tiene un **ID** que debe coincidir con el registro del puesto/emprendimiento en la base de datos.
- Jerarquía: **institución → sede → piso/zona → puesto**. Cada sede referencia su escena 3D; si todavía no tiene modelo, la app carga un **placeholder** (escena genérica con aviso "Modelo en construcción").
- Estado actual: diseños de los 2 pisos de la primera sede; las demás sedes quedan con placeholder hasta contar con sus modelos.
### Instalación y arranque

*(Próximamente)*

---

## 🗂️ Historias de Usuario principales

### Comprador

- `HU-01` Como comprador quiero buscar productos por nombre o categoría para encontrar lo que necesito
- `HU-02` Como comprador quiero ver el historial de mis compras para llevar un registro
- `HU-03` Como comprador quiero ver tiendas físicas cercanas dentro del campus
- `HU-04` Como comprador quiero poder convertirme en vendedor desde la app

### Vendedor

- `HU-05` Como vendedor quiero publicar mis productos con foto, nombre y precio
- `HU-06` Como vendedor quiero gestionar mi emprendimiento con nombre y descripción
- `HU-07` Como vendedor quiero ver el historial de mis ventas

### Admin

- `HU-08` Como admin quiero moderar publicaciones reportadas por los usuarios
- `HU-09` Como admin quiero gestionar los usuarios de la plataforma
- `HU-10` Como admin quiero ver métricas generales del marketplace

---

## 🤝 Flujo de trabajo

- Cada tarea se trabaja en una **rama propia** a partir de una issue: `feat/HU-05-publicar-producto`, `fix/login-error`, `docs/diagrama-er`.
- **Nadie sube directo a `main`**: todo cambio entra por Pull Request con al menos una revisión.
- Mensajes de commit con prefijo: `feat:`, `fix:`, `docs:`, `chore:`.
- En el PR, referenciar la issue correspondiente (`Closes #número`).
- Para recibir acceso al repo, enviar tu usuario de GitHub a la presidencia del capítulo.
- Uso de Camel Case para cada variable

---

## 🐳 Docker (próximamente)

```
docker-compose up --build
```

---

## 👥 Equipo

Proyecto desarrollado por **IEEE CS UD 2026**

| Integrante         | Rol                                              |
| ------------------ | ------------------------------------------------ |
| Juan Gonzalez      | Presidente del capítulo / coordinación           |
| Javier Alvarez     | Diseño (mockup) y propuesta de monetización      |
| Laura Alvarez      | Frontend (React + Expo) e integración del mockup |
| Pablo Gomez        | Base de datos y backend                          |
| Gabriela Navarro   | Entorno 3D — código del piso 1                   |
| Cristian Salamanca | Entorno 3D — modelos de usuarios y puestos       |
