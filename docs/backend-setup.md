# Backend setup

Este documento explica los requisitos, instalación, configuración y ejecución del backend de TaskManager.

---

## Requisitos previos

Antes de ejecutar el proyecto, es necesario tener instalado:

### Visual Studio 2022 Community

Durante la instalación se recomienda marcar:

```text
Desarrollo de ASP.NET y web
Almacenamiento y procesamiento de datos
Desarrollo de Node.js, si se va a crear frontend con React, Angular o Vue
```

### .NET SDK

Comprobar instalación:

```bash
dotnet --version
```

### SQL Server LocalDB o SQL Server Express

Para desarrollo local se recomienda usar:

```text
SQL Server LocalDB
```

La cadena de conexión usada por defecto es:

```text
Server=(localdb)\MSSQLLocalDB;Database=TaskManagerDb;Trusted_Connection=True;TrustServerCertificate=True
```

### SQL Server Management Studio

Se recomienda instalar SSMS para revisar:

- Bases de datos.
- Tablas.
- Relaciones.
- Datos insertados.
- Migraciones aplicadas.

### Entity Framework Core Tools

Instalar la herramienta global de EF Core:

```bash
dotnet tool install --global dotnet-ef
```

Comprobar instalación:

```bash
dotnet ef --version
```

### Git

Comprobar instalación:

```bash
git --version
```

---

## Instalación del proyecto

Clonar el repositorio:

```bash
git clone <repository-url>
cd taskManager
```

Restaurar dependencias:

```bash
dotnet restore
```

Entrar en el backend:

```bash
cd TaskManager.Api
```

Comprobar que compila:

```bash
dotnet build
```

Si todo está correcto, debería aparecer:

```text
Build succeeded.
```

---

## Configuración

El archivo principal de configuración está en:

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

## Importante sobre secretos

No se deben subir al repositorio:

- Contraseñas reales.
- Claves JWT de producción.
- Tokens privados.
- Cadenas de conexión de producción.
- Credenciales personales.

Para producción se deberían usar variables de entorno, .NET user secrets o un gestor de secretos.

---

## Base de datos

El proyecto usa Entity Framework Core con SQL Server.

Aplicar migraciones:

```bash
dotnet ef database update
```

Esto crea la base de datos:

```text
TaskManagerDb
```

y aplica las migraciones existentes.

---

## Ejecución

Desde la carpeta `TaskManager.Api`:

```bash
dotnet run
```

La API se levantará en una dirección similar a:

```text
http://localhost:5087
```

El puerto puede variar.

---

## Swagger

Una vez ejecutado el backend, abrir:

```text
http://localhost:5087/swagger
```

Swagger permite:

- Ver endpoints.
- Probar peticiones.
- Registrar usuarios.
- Iniciar sesión.
- Copiar el token JWT.
- Autorizar peticiones protegidas.
- Probar el CRUD completo.

---

## Autenticación con JWT en Swagger

Primero registrar usuario:

```text
POST /api/Auth/register
```

Ejemplo:

```json
{
  "fullName": "Iago Becerra",
  "email": "iago@example.com",
  "password": "123456"
}
```

Después iniciar sesión:

```text
POST /api/Auth/login
```

Ejemplo:

```json
{
  "email": "iago@example.com",
  "password": "123456"
}
```

La respuesta devuelve un token JWT.

En Swagger:

1. Pulsar `Authorize`.
2. Pegar el token con el formato:

```text
Bearer TU_TOKEN
```

3. Pulsar `Authorize`.
4. Probar endpoints protegidos.

---

## Logs

El proyecto utiliza Serilog.

Los logs aparecen en consola y también se guardan en:

```text
TaskManager.Api/Logs/
```

Esta carpeta debe estar excluida en `.gitignore`:

```gitignore
# Application logs
TaskManager.Api/Logs/
```
