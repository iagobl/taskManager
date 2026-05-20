# TaskManager

TaskManager es una aplicación web de gestión de proyectos y tareas desarrollada como práctica académica.

El proyecto incluye un **backend REST con ASP.NET Core Web API** y un **frontend con React + Vite + TypeScript**, conectados mediante JWT. La aplicación permite gestionar proyectos, tareas, categorías, etiquetas, comentarios y consultar próximos festivos mediante una API externa consumida desde el frontend.

---

## Tecnologías principales

### Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQL Server / SQL Server LocalDB
- JWT Bearer Authentication
- BCrypt
- Swagger / OpenAPI
- Serilog
- Middleware global de excepciones
- Arquitectura por capas: controllers, DTOs, repositories y services

### Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Lucide React
- API externa de festivos mediante JavaScript/fetch

---

## Funcionalidades principales

- Registro e inicio de sesión.
- Validación de contraseña segura en el frontend.
- Autenticación mediante JWT.
- Rutas protegidas en backend y frontend.
- Dashboard con datos reales.
- CRUD de proyectos.
- CRUD de tareas.
- Marcar tareas como completadas y reabrirlas.
- CRUD de categorías.
- Asignación de categorías a tareas.
- CRUD de etiquetas.
- Asociación y eliminación de etiquetas en tareas.
- CRUD de comentarios en tareas.
- Perfil del usuario autenticado.
- Integración externa de festivos/días no laborables.
- Swagger para probar la API.
- Logging con Serilog.
- Middleware de errores en JSON.

---

## Estructura del repositorio

```text
taskManager/
├── TaskManager.Api/
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Middleware/
│   ├── Models/
│   ├── Repositories/
│   ├── Services/
│   ├── Migrations/
│   ├── Program.cs
│   └── appsettings.json
│
├── TaskManager.Client/
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── .env
│
├── docs/
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
└── LICENSE
```

---

## Documentación

La documentación detallada está en la carpeta `docs/`.

| Archivo | Contenido |
| ------- | --------- |
| [`docs/project-setup.md`](docs/project-setup.md) | Instalación completa para desarrollar el proyecto |
| [`docs/backend-setup.md`](docs/backend-setup.md) | Configuración y ejecución del backend |
| [`docs/frontend-setup.md`](docs/frontend-setup.md) | Configuración y ejecución del frontend |
| [`docs/api-endpoints.md`](docs/api-endpoints.md) | Endpoints principales de la API |
| [`docs/database.md`](docs/database.md) | Modelo de datos, relaciones y migraciones |
| [`docs/testing-guide.md`](docs/testing-guide.md) | Guía completa de pruebas |
| [`docs/project-status.md`](docs/project-status.md) | Estado final del proyecto |
| [`docs/packaging.md`](docs/packaging.md) | Opciones de empaquetado, publicación y releases |

---

## Instalación rápida para probar el proyecto

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd taskManager
```

### 2. Backend

```bash
cd TaskManager.Api
dotnet restore
dotnet ef database update
dotnet run
```

Swagger debería estar disponible en una URL similar a:

```text
http://localhost:5087/swagger
```

### 3. Frontend

En otra terminal:

```bash
cd TaskManager.Client
npm install
npm run dev
```

La aplicación web debería estar disponible en:

```text
http://localhost:5173
```

El archivo `TaskManager.Client/.env` debe contener:

```env
VITE_API_BASE_URL=http://localhost:5087/api
```

Si el backend usa otro puerto, hay que modificar esa URL.

---

## Flujo básico de uso

1. Registrar un usuario.
2. Iniciar sesión.
3. Crear un proyecto.
4. Crear categorías y etiquetas.
5. Crear tareas dentro de un proyecto.
6. Asignar categorías y etiquetas a las tareas.
7. Añadir comentarios.
8. Completar o reabrir tareas.
9. Consultar el dashboard y los próximos festivos.

---

## Estado actual

El proyecto está funcionalmente finalizado para la práctica.

Incluye:

```text
Backend completo
Frontend completo
Autenticación JWT
CRUD principal
API externa
Documentación
Swagger
SQL Server
React
Tailwind
```

---

## Releases recomendadas

Se pueden usar tags de Git para marcar versiones:

```bash
git tag -a v0.1.0-backend -m "Backend implementation completed"
git tag -a v0.2.0-frontend -m "Frontend implementation completed"
```

Y subirlos con:

```bash
git push origin v0.1.0-backend
git push origin v0.2.0-frontend
```

---

## Licencia

Este proyecto se distribuye bajo la licencia incluida en el archivo `LICENSE`.

---

## Autor

Proyecto desarrollado por **Iago Becerra López** como parte de una práctica académica de desarrollo backend y aplicaciones web.
