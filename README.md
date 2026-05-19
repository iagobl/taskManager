# TaskManager

TaskManager es una aplicación web de gestión de proyectos y tareas desarrollada como práctica académica.

El objetivo principal del proyecto es implementar un backend completo mediante **ASP.NET Core Web API**, **Entity Framework Core** y **SQL Server**, aplicando una arquitectura organizada por capas, autenticación con JWT, rutas protegidas, DTOs, repositorios, servicios, middleware de errores, logging y documentación del proyecto.

Actualmente el proyecto incluye la parte backend. El frontend se desarrollará posteriormente y consumirá esta API REST.

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

## Funcionalidades principales del backend

El backend incluye:

- Registro de usuarios.
- Inicio de sesión.
- Hash de contraseñas con BCrypt.
- Generación de tokens JWT.
- Rutas protegidas mediante autenticación JWT.
- Gestión de perfil del usuario autenticado.
- CRUD de proyectos.
- CRUD de tareas.
- Marcar tareas como completadas.
- Reabrir tareas completadas.
- CRUD de categorías.
- CRUD de etiquetas.
- Asociación y eliminación de etiquetas en tareas.
- CRUD de comentarios en tareas.
- Validación mediante DTOs.
- Repositorios para acceso a datos.
- Servicios para lógica de negocio.
- Inyección de dependencias.
- Middleware global de gestión de excepciones.
- Logging con Serilog.
- Documentación y pruebas de endpoints mediante Swagger.

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

### Responsabilidad de cada carpeta

| Carpeta | Descripción |
| ------ | ----------- |
| `Controllers/` | Define los endpoints REST de la API |
| `Data/` | Contiene el `AppDbContext` de Entity Framework Core |
| `DTOs/` | Define los objetos de entrada y salida de la API |
| `Middleware/` | Contiene el middleware global de excepciones |
| `Models/` | Contiene las entidades de la base de datos |
| `Repositories/` | Contiene la lógica de acceso a datos |
| `Services/` | Contiene la lógica de negocio |
| `Migrations/` | Contiene las migraciones generadas por EF Core |

---

## Modelo de datos

El backend trabaja con las siguientes entidades principales:

- `User`
- `Project`
- `TaskItem`
- `Category`
- `Tag`
- `TaskTag`
- `Comment`

Relaciones principales:

```text
User 1:N Project
User 1:N Category
User 1:N Tag

Project 1:N TaskItem

TaskItem N:1 Category
TaskItem 1:N Comment
TaskItem N:M Tag mediante TaskTag
```

---

## Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalado:

### 1. Visual Studio 2022 Community

Durante la instalación se recomienda marcar:

```text
Desarrollo de ASP.NET y web
Almacenamiento y procesamiento de datos
Desarrollo de Node.js, si se va a crear frontend con React, Angular o Vue
```

### 2. .NET SDK

Comprobar instalación:

```bash
dotnet --version
```

Se recomienda usar una versión moderna compatible con ASP.NET Core.

### 3. SQL Server LocalDB o SQL Server Express

Para desarrollo local se recomienda usar:

```text
SQL Server LocalDB
```

La cadena de conexión usada por defecto es:

```text
Server=(localdb)\MSSQLLocalDB;Database=TaskManagerDb;Trusted_Connection=True;TrustServerCertificate=True
```

### 4. SQL Server Management Studio

Se recomienda instalar SSMS para revisar:

- Bases de datos.
- Tablas.
- Relaciones.
- Datos insertados.
- Migraciones aplicadas.

### 5. Entity Framework Core Tools

Instalar la herramienta global de EF Core:

```bash
dotnet tool install --global dotnet-ef
```

Comprobar instalación:

```bash
dotnet ef --version
```

### 6. Git

Comprobar instalación:

```bash
git --version
```

---

## Instalación del proyecto

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd taskManager
```

### 2. Restaurar dependencias

Desde la raíz del repositorio o desde la carpeta del backend:

```bash
dotnet restore
```

### 3. Entrar en el proyecto backend

```bash
cd TaskManager.Api
```

### 4. Comprobar que el proyecto compila

```bash
dotnet build
```

Si todo está correcto, debería aparecer un mensaje similar a:

```text
Build succeeded.
```

---

## Configuración

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

### Importante

La clave JWT incluida en `appsettings.json` es solo para desarrollo local.

No se deben subir claves reales, tokens, contraseñas ni cadenas de conexión de producción al repositorio.

---

## Base de datos

El proyecto utiliza **Entity Framework Core** con **SQL Server**.

### Crear la base de datos

Desde la carpeta `TaskManager.Api`, ejecutar:

```bash
dotnet ef database update
```

Esto creará la base de datos local:

```text
TaskManagerDb
```

y aplicará las migraciones existentes.

### Crear una nueva migración

Si se modifica el modelo de datos:

```bash
dotnet ef migrations add NombreDeLaMigracion
```

Después aplicar los cambios:

```bash
dotnet ef database update
```

Ejemplo:

```bash
dotnet ef migrations add AddUserProfileFields
dotnet ef database update
```

---

## Ejecución del backend

Desde la carpeta `TaskManager.Api`:

```bash
dotnet run
```

La API se levantará en una dirección similar a:

```text
http://localhost:5087
```

El puerto puede variar según la configuración local.

---

## Swagger

Una vez ejecutado el backend, se puede acceder a Swagger desde:

```text
http://localhost:5087/swagger
```

Swagger permite:

- Ver todos los endpoints disponibles.
- Probar peticiones directamente desde el navegador.
- Registrar usuarios.
- Iniciar sesión.
- Copiar el token JWT.
- Autorizar peticiones protegidas.
- Probar el CRUD completo de la API.

---

## Autenticación con JWT en Swagger

### 1. Registrar usuario

Endpoint:

```text
POST /api/Auth/register
```

Body de ejemplo:

```json
{
  "fullName": "Iago Becerra",
  "email": "iago@example.com",
  "password": "123456"
}
```

### 2. Iniciar sesión

Endpoint:

```text
POST /api/Auth/login
```

Body de ejemplo:

```json
{
  "email": "iago@example.com",
  "password": "123456"
}
```

Respuesta esperada:

```json
{
  "userId": 1,
  "fullName": "Iago Becerra",
  "email": "iago@example.com",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 3. Autorizar en Swagger

En Swagger:

1. Pulsar el botón `Authorize`.
2. Pegar el token con el formato:

```text
Bearer TU_TOKEN
```

Ejemplo:

```text
Bearer eyJhbGciOiJIUzI1NiIs...
```

3. Pulsar `Authorize`.
4. Probar endpoints protegidos.

---

## Endpoints principales

### Auth

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| `POST` | `/api/Auth/register` | Registrar usuario |
| `POST` | `/api/Auth/login` | Iniciar sesión |

### Users

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| `GET` | `/api/Users/me` | Obtener perfil del usuario autenticado |

### Projects

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| `GET` | `/api/Projects` | Obtener proyectos del usuario |
| `GET` | `/api/Projects/{id}` | Obtener un proyecto |
| `POST` | `/api/Projects` | Crear proyecto |
| `PUT` | `/api/Projects/{id}` | Actualizar proyecto |
| `DELETE` | `/api/Projects/{id}` | Eliminar proyecto |

Ejemplo de creación:

```json
{
  "name": "Práctica backend",
  "description": "Proyecto para organizar las tareas de la práctica"
}
```

### Tasks

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| `GET` | `/api/projects/{projectId}/tasks` | Obtener tareas de un proyecto |
| `GET` | `/api/tasks/{id}` | Obtener una tarea |
| `POST` | `/api/projects/{projectId}/tasks` | Crear tarea |
| `PUT` | `/api/tasks/{id}` | Actualizar tarea |
| `DELETE` | `/api/tasks/{id}` | Eliminar tarea |
| `PATCH` | `/api/tasks/{id}/complete` | Marcar tarea como completada |
| `PATCH` | `/api/tasks/{id}/reopen` | Reabrir tarea |

Ejemplo de creación:

```json
{
  "title": "Implementar CRUD de tareas",
  "description": "Crear endpoints protegidos para gestionar tareas",
  "priority": "High",
  "dueDate": "2026-05-25T23:59:00",
  "categoryId": null
}
```

### Categories

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| `GET` | `/api/Categories` | Obtener categorías |
| `GET` | `/api/Categories/{id}` | Obtener una categoría |
| `POST` | `/api/Categories` | Crear categoría |
| `PUT` | `/api/Categories/{id}` | Actualizar categoría |
| `DELETE` | `/api/Categories/{id}` | Eliminar categoría |

Ejemplo de creación:

```json
{
  "name": "Universidad",
  "color": "#2563EB"
}
```

### Tags

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| `GET` | `/api/Tags` | Obtener etiquetas |
| `GET` | `/api/Tags/{id}` | Obtener una etiqueta |
| `POST` | `/api/Tags` | Crear etiqueta |
| `PUT` | `/api/Tags/{id}` | Actualizar etiqueta |
| `DELETE` | `/api/Tags/{id}` | Eliminar etiqueta |
| `POST` | `/api/tasks/{taskId}/tags/{tagId}` | Asociar etiqueta a tarea |
| `DELETE` | `/api/tasks/{taskId}/tags/{tagId}` | Eliminar etiqueta de tarea |

Ejemplo de creación:

```json
{
  "name": "Importante",
  "color": "#EF4444"
}
```

### Comments

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| `GET` | `/api/tasks/{taskId}/comments` | Obtener comentarios de una tarea |
| `GET` | `/api/comments/{id}` | Obtener un comentario |
| `POST` | `/api/tasks/{taskId}/comments` | Crear comentario |
| `PUT` | `/api/comments/{id}` | Actualizar comentario |
| `DELETE` | `/api/comments/{id}` | Eliminar comentario |

Ejemplo de creación:

```json
{
  "content": "Revisar esta tarea antes de entregar la práctica."
}
```

---

## Seguridad

El backend aplica varias medidas de seguridad:

- Las contraseñas no se almacenan en texto plano.
- Las contraseñas se guardan hasheadas con BCrypt.
- Los endpoints privados requieren JWT.
- El usuario solo puede acceder a sus propios recursos.
- Los DTOs evitan exponer entidades internas directamente.
- El middleware global evita devolver errores internos sin controlar.
- Los logs no deben almacenar contraseñas ni tokens.
- Las cadenas de conexión de producción no deben guardarse en el repositorio.

---

## Middleware de excepciones

El proyecto incluye un middleware global para capturar errores y devolver respuestas JSON limpias.

Ejemplo de error controlado:

```json
{
  "statusCode": 404,
  "message": "Project not found."
}
```

Ejemplos de errores gestionados:

| Excepción | Código HTTP |
| --------- | ----------- |
| `KeyNotFoundException` | `404 Not Found` |
| `UnauthorizedAccessException` | `401 Unauthorized` |
| `InvalidOperationException` | `400 Bad Request` |
| `ArgumentException` | `400 Bad Request` |
| Otros errores | `500 Internal Server Error` |

---

## Logging

El proyecto utiliza **Serilog** para registrar información de ejecución.

Los logs se muestran por consola y también se guardan en:

```text
TaskManager.Api/Logs/
```

Esta carpeta está excluida del repositorio mediante `.gitignore`.

Ejemplo recomendado en `.gitignore`:

```gitignore
# Application logs
TaskManager.Api/Logs/
```

---

## Validaciones

El proyecto utiliza DTOs con atributos de validación, por ejemplo:

```csharp
[Required]
[MaxLength(120)]
[EmailAddress]
[MinLength(6)]
```

Estas validaciones se aplican en operaciones como:

- Registro.
- Login.
- Creación de proyectos.
- Actualización de proyectos.
- Creación de tareas.
- Actualización de tareas.
- Creación de categorías.
- Creación de etiquetas.
- Creación de comentarios.

---

## Flujo recomendado de prueba

Para comprobar que el backend funciona correctamente:

1. Ejecutar la API:

```bash
dotnet run
```

2. Abrir Swagger:

```text
http://localhost:5087/swagger
```

3. Registrar un usuario.
4. Iniciar sesión.
5. Copiar el token JWT.
6. Autorizar Swagger con:

```text
Bearer TU_TOKEN
```

7. Crear un proyecto.
8. Crear una categoría.
9. Crear una tarea dentro del proyecto.
10. Crear una etiqueta.
11. Asociar la etiqueta a la tarea.
12. Crear un comentario en la tarea.
13. Marcar la tarea como completada.
14. Reabrir la tarea.
15. Probar eliminación de comentarios, etiquetas, tareas y proyectos.

---

## Comandos útiles

### Compilar el proyecto

```bash
dotnet build
```

### Ejecutar el backend

```bash
dotnet run
```

### Restaurar paquetes

```bash
dotnet restore
```

### Ver paquetes instalados

```bash
dotnet list package
```

### Crear migración

```bash
dotnet ef migrations add NombreMigracion
```

### Aplicar migraciones

```bash
dotnet ef database update
```

### Eliminar última migración no aplicada

```bash
dotnet ef migrations remove
```

---

## Archivos de documentación incluidos

El repositorio incluye:

```text
README.md
CONTRIBUTING.md
SECURITY.md
CODE_OF_CONDUCT.md
LICENSE
```

### `CONTRIBUTING.md`

Explica cómo contribuir al proyecto, cómo estructurar commits, ramas y cambios.

### `SECURITY.md`

Define recomendaciones de seguridad, gestión de secretos, contraseñas, JWT y reporte de vulnerabilidades.

### `CODE_OF_CONDUCT.md`

Define normas básicas de comportamiento, comunicación y uso responsable del repositorio.

### `LICENSE`

Define la licencia del proyecto.

---

## Estado actual del proyecto

Backend funcionalmente finalizado.

Incluye:

```text
API REST
Autenticación
Autorización
JWT
SQL Server
EF Core
Migraciones
Relaciones
DTOs
Repositorios
Servicios
Middleware
Logging
Swagger
CRUD completo
Documentación base
```

Pendiente para fases posteriores:

```text
Frontend
Integración de API externa desde JavaScript/frontend
Mejoras visuales
Pruebas automatizadas opcionales
Despliegue opcional
```

---

## Licencia

Este proyecto se distribuye bajo la licencia incluida en el archivo `LICENSE`.

---

## Autor

Proyecto desarrollado por:

```text
Iago Becerra López
```

Como parte de una práctica académica de desarrollo backend y aplicaciones web.
