# Project setup

Este documento explica cómo preparar el entorno completo para desarrollar y probar TaskManager.

---

## Requisitos generales

Para trabajar con el proyecto completo se necesita:

- Git.
- Visual Studio 2022 Community o Visual Studio Code.
- .NET SDK.
- SQL Server LocalDB o SQL Server Express.
- SQL Server Management Studio.
- Node.js LTS.
- npm.
- Entity Framework Core CLI Tools.

---

## Instalación de herramientas

### Git

Comprobar instalación:

```bash
git --version
```

### .NET SDK

Comprobar instalación:

```bash
dotnet --version
```

### Entity Framework Core Tools

Instalar:

```bash
dotnet tool install --global dotnet-ef
```

Comprobar:

```bash
dotnet ef --version
```

### Node.js y npm

Comprobar:

```bash
node --version
npm --version
```

Se recomienda instalar una versión LTS de Node.js.

### SQL Server LocalDB

Para desarrollo local se puede usar LocalDB. La cadena de conexión usada por defecto es:

```text
Server=(localdb)\MSSQLLocalDB;Database=TaskManagerDb;Trusted_Connection=True;TrustServerCertificate=True
```

---

## Clonar el repositorio

```bash
git clone <repository-url>
cd taskManager
```

---

## Preparar backend

```bash
cd TaskManager.Api
dotnet restore
dotnet build
dotnet ef database update
dotnet run
```

Swagger debería estar disponible en:

```text
http://localhost:5087/swagger
```

El puerto puede variar según la configuración local.

---

## Preparar frontend

Desde otra terminal:

```bash
cd TaskManager.Client
npm install
npm run dev
```

La aplicación debería abrirse en:

```text
http://localhost:5173
```

---

## Variables de entorno del frontend

Crear o revisar:

```text
TaskManager.Client/.env
```

Contenido:

```env
VITE_API_BASE_URL=http://localhost:5087/api
```

Si el backend se ejecuta en otro puerto, modificar esa URL.

---

## Orden recomendado para arrancar el proyecto

1. Arrancar SQL Server LocalDB o tenerlo disponible.
2. Ejecutar backend:

```bash
cd TaskManager.Api
dotnet run
```

3. Ejecutar frontend:

```bash
cd TaskManager.Client
npm run dev
```

4. Abrir:

```text
http://localhost:5173
```

---

## Comprobación rápida

Backend:

```bash
dotnet build
dotnet run
```

Frontend:

```bash
npm install
npm run dev
```

Base de datos:

```bash
dotnet ef database update
```

---

## Problemas frecuentes

### El frontend no conecta con el backend

Revisar:

- Que el backend esté ejecutándose.
- Que `VITE_API_BASE_URL` tenga el puerto correcto.
- Que CORS esté configurado en `Program.cs`.
- Que el frontend esté en `http://localhost:5173`.

### Swagger funciona pero React no

Normalmente es problema de CORS o de URL incorrecta en `.env`.

### Error de base de datos

Ejecutar:

```bash
dotnet ef database update
```

y comprobar que SQL Server LocalDB está instalado.

### Error de token o 401

Volver a iniciar sesión desde el frontend o limpiar `localStorage`.
