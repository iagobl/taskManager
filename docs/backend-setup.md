# Backend setup

Este documento explica cómo configurar, ejecutar y probar el backend de TaskManager.

---

## Tecnologías

- ASP.NET Core Web API.
- C#.
- Entity Framework Core.
- SQL Server / SQL Server LocalDB.
- JWT Bearer Authentication.
- BCrypt.
- Swagger / OpenAPI.
- Serilog.
- Middleware global de excepciones.

---

## Requisitos

- .NET SDK.
- SQL Server LocalDB o SQL Server Express.
- SQL Server Management Studio.
- Entity Framework Core Tools.

Comprobar .NET:

```bash
dotnet --version
```

Comprobar EF Core Tools:

```bash
dotnet ef --version
```

Instalar EF Core Tools si hace falta:

```bash
dotnet tool install --global dotnet-ef
```

---

## Restaurar dependencias

Desde `TaskManager.Api`:

```bash
dotnet restore
```

---

## Configuración

El archivo principal es:

```text
TaskManager.Api/appsettings.json
```

Ejemplo local:

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

La clave JWT de desarrollo no debe usarse en producción.

---

## CORS

El backend debe permitir peticiones desde el frontend de Vite:

```text
http://localhost:5173
```

En `Program.cs` se define una política CORS para el frontend.

---

## Crear base de datos

Desde `TaskManager.Api`:

```bash
dotnet ef database update
```

Esto crea o actualiza la base de datos:

```text
TaskManagerDb
```

---

## Compilar

```bash
dotnet build
```

---

## Ejecutar

```bash
dotnet run
```

La API suele levantarse en:

```text
http://localhost:5087
```

---

## Swagger

Abrir:

```text
http://localhost:5087/swagger
```

Desde Swagger se puede:

- Registrar usuarios.
- Iniciar sesión.
- Copiar el token JWT.
- Autorizar peticiones protegidas.
- Probar proyectos, tareas, categorías, etiquetas y comentarios.

---

## Logs

El backend usa Serilog.

Los logs se muestran en consola y se guardan en:

```text
TaskManager.Api/Logs/
```

Esta carpeta no debe subirse al repositorio.

---

## Comandos útiles

```bash
dotnet restore
dotnet build
dotnet run
dotnet list package
dotnet ef migrations add NombreMigracion
dotnet ef database update
dotnet ef migrations remove
```
