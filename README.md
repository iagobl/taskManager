# TaskManager

TaskManager es una aplicación web de gestión de proyectos y tareas desarrollada como práctica académica.

El objetivo principal del proyecto es implementar un backend completo con **ASP.NET Core Web API**, **Entity Framework Core** y **SQL Server**, aplicando autenticación con JWT, rutas protegidas, DTOs, repositorios, servicios, middleware de errores, logging y documentación del proyecto.

Actualmente el repositorio incluye la parte backend. El frontend se desarrollará posteriormente y consumirá esta API REST.

---

## Tecnologías utilizadas

### Backend

- ASP.NET Core Web API
- C#
- Entity Framework Core
- SQL Server / SQL Server LocalDB
- JWT Bearer Authentication
- BCrypt
- Swagger / OpenAPI
- Serilog
- Middleware personalizado de gestión de excepciones

### Herramientas de desarrollo

- Visual Studio 2022 Community
- .NET SDK
- SQL Server Management Studio
- Git
- Entity Framework Core CLI Tools

---

## Funcionalidades principales

El backend incluye:

- Registro e inicio de sesión de usuarios.
- Hash de contraseñas con BCrypt.
- Generación y validación de tokens JWT.
- Rutas protegidas mediante autenticación JWT.
- Perfil del usuario autenticado.
- CRUD de proyectos.
- CRUD de tareas.
- Marcar tareas como completadas y reabrirlas.
- CRUD de categorías.
- CRUD de etiquetas.
- Asociación y eliminación de etiquetas en tareas.
- CRUD de comentarios en tareas.
- Validaciones mediante DTOs.
- Repositorios para acceso a datos.
- Servicios para lógica de negocio.
- Inyección de dependencias.
- Middleware global de gestión de excepciones.
- Logging con Serilog.
- Documentación y pruebas mediante Swagger.

---

## Arquitectura del proyecto

La estructura principal del backend es:

```text
TaskManager.Api/
├── Controllers/
├── Data/
├── DTOs/
├── Middleware/
├── Models/
├── Repositories/
│   ├── Interfaces/
│   └── Implementations/
├── Services/
│   ├── Interfaces/
│   └── Implementations/
├── Migrations/
├── Program.cs
├── appsettings.json
└── TaskManager.Api.csproj
```

---

## Documentación

La documentación detallada se encuentra en la carpeta `docs/`:

| Archivo | Contenido |
| ------- | --------- |
| [`docs/backend-setup.md`](docs/backend-setup.md) | Requisitos, instalación, configuración y ejecución del backend |
| [`docs/api-endpoints.md`](docs/api-endpoints.md) | Endpoints principales de la API y ejemplos de uso |
| [`docs/database.md`](docs/database.md) | Modelo de datos, relaciones, EF Core y migraciones |
| [`docs/testing-guide.md`](docs/testing-guide.md) | Flujo recomendado de prueba en Swagger |
| [`docs/backend-status.md`](docs/backend-status.md) | Estado actual del backend y próximos pasos |

Además, el repositorio incluye:

```text
CONTRIBUTING.md
SECURITY.md
CODE_OF_CONDUCT.md
LICENSE
```

---

## Instalación rápida

Clonar el repositorio:

```bash
git clone <repository-url>
cd taskManager
```

Restaurar dependencias:

```bash
dotnet restore
```

Entrar en el proyecto backend:

```bash
cd TaskManager.Api
```

Aplicar migraciones:

```bash
dotnet ef database update
```

Ejecutar el backend:

```bash
dotnet run
```

Abrir Swagger:

```text
http://localhost:5087/swagger
```

El puerto puede variar según la configuración local.

---

## Configuración básica

El archivo principal de configuración es:

```text
TaskManager.Api/appsettings.json
```

Ejemplo de configuración local:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=TaskManagerDb;Trusted_Connection=True;TrustServerCertificate=True"
  },
  "Jwt": {
    "Key": "TaskManagerApi_Development_Secret_Key_Change_In_Production_123456789",
    "Issuer": "TaskManagerApi",
    "Audience": "TaskManagerClient",
    "DurationInMinutes": 120
  },
  "AllowedHosts": "*"
}
```

La clave JWT incluida en `appsettings.json` debe usarse únicamente para desarrollo local.

---

## Comandos útiles

Compilar:

```bash
dotnet build
```

Ejecutar:

```bash
dotnet run
```

Restaurar paquetes:

```bash
dotnet restore
```

Ver paquetes instalados:

```bash
dotnet list package
```

Crear migración:

```bash
dotnet ef migrations add NombreMigracion
```

Aplicar migraciones:

```bash
dotnet ef database update
```

---

## Estado actual

Backend funcionalmente finalizado.

Pendiente para fases posteriores:

- Frontend.
- Integración de API externa desde JavaScript/frontend.
- Mejoras visuales.
- Pruebas automatizadas opcionales.
- Despliegue opcional.

---

## Licencia

Este proyecto se distribuye bajo la licencia incluida en el archivo `LICENSE`.

---

## Autor

Proyecto desarrollado por **Iago Becerra López** como parte de una práctica académica de desarrollo backend y aplicaciones web.
