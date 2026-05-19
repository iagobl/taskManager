# Backend status

Este documento resume el estado actual del backend de TaskManager.

---

## Backend finalizado

La parte principal del backend está funcionalmente finalizada.

Incluye:

```text
API REST
Autenticación
Autorización
JWT
SQL Server
Entity Framework Core
Migraciones
Relaciones
DTOs
Repositorios
Servicios
Inyección de dependencias
Middleware global de excepciones
Logging con Serilog
Swagger con autorización JWT
CRUD completo
Documentación base
```

---

## Funcionalidades implementadas

### Proyecto base

- Proyecto ASP.NET Core Web API.
- Solución configurada.
- Swagger funcionando.
- `.gitignore` configurado.
- Documentación base del repositorio.

### Base de datos

- SQL Server / LocalDB.
- Entity Framework Core.
- `AppDbContext`.
- Entidades principales.
- Relaciones entre entidades.
- Migración inicial.
- Base de datos `TaskManagerDb`.

### Autenticación

- Registro de usuarios.
- Login.
- BCrypt para contraseñas.
- Generación de JWT.
- Configuración de JWT Bearer.
- Swagger con botón `Authorize`.

### Usuarios

- Endpoint para obtener el usuario autenticado:

```text
GET /api/Users/me
```

### Proyectos

- CRUD protegido de proyectos.
- Cada usuario solo puede acceder a sus propios proyectos.

### Tareas

- CRUD protegido de tareas.
- Crear tareas dentro de proyectos.
- Marcar tareas como completadas.
- Reabrir tareas completadas.
- Validación de propiedad del usuario.

### Categorías

- CRUD protegido de categorías.
- Categorías asociadas al usuario autenticado.

### Etiquetas

- CRUD protegido de etiquetas.
- Asociación de etiquetas a tareas.
- Eliminación de etiquetas de tareas.
- Relación muchos a muchos mediante `TaskTag`.

### Comentarios

- CRUD protegido de comentarios en tareas.
- Validación de propiedad del usuario.

### Middleware

- Middleware global de excepciones.
- Respuestas JSON limpias para errores controlados.

### Logging

- Serilog configurado.
- Logs en consola.
- Logs en carpeta `TaskManager.Api/Logs/`.
- Carpeta de logs excluida en `.gitignore`.

---

## Pendiente para fases posteriores

Queda fuera del backend principal:

- Frontend.
- Integración de API externa desde JavaScript/frontend.
- Mejoras visuales.
- Pruebas automatizadas opcionales.
- Despliegue opcional.

---

## Siguiente fase recomendada

La siguiente fase del proyecto debería ser el frontend.

Opciones recomendadas:

- React.
- Angular.
- Blazor.

Para esta práctica, si el requisito menciona integración JS, una buena opción sería desarrollar el frontend con React e integrar una API externa desde JavaScript.

Ejemplos de integración externa:

- Frase motivacional del día.
- Calendario o festivos.
- Clima.
- Consejos de productividad.

---

## Commits principales recomendados

Ejemplos de commits usados o recomendados:

```text
chore: initialize ASP.NET Core Web API project
feat(data): configure EF Core data model and initial migration
feat(auth): add user registration and login
chore(swagger): add JWT authorization support
feat(projects): add protected project CRUD
feat(tasks): add protected task CRUD
feat(categories): add protected category CRUD
feat(tags): add protected tag CRUD and task tagging
feat(comments): add protected comment CRUD
feat(users): add current user profile endpoint
feat(middleware): add global exception handling
feat(logging): configure Serilog logging
docs: add backend setup and usage documentation
```

---

## Estado final

El backend puede considerarse cerrado a nivel funcional.

Antes de entregar o pasar al frontend, se recomienda:

- Ejecutar `dotnet build`.
- Ejecutar `dotnet run`.
- Probar Swagger.
- Revisar que no haya archivos temporales pendientes en Git.
- Revisar que no se suban logs.
- Revisar que no se suban secretos reales.
