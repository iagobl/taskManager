# Project status

Este documento resume el estado final de TaskManager.

---

## Estado final

El proyecto está funcionalmente finalizado para la práctica.

Incluye:

```text
Backend completo
Frontend completo
Base de datos SQL Server
Autenticación JWT
Rutas protegidas
CRUD principal
API externa
Documentación
```

---

## Backend implementado

- ASP.NET Core Web API.
- SQL Server / LocalDB.
- Entity Framework Core.
- Migraciones.
- Modelos y relaciones.
- DTOs.
- Repositorios.
- Servicios.
- Inyección de dependencias.
- Registro y login.
- BCrypt.
- JWT.
- Swagger con autorización.
- Middleware global de excepciones.
- Logging con Serilog.
- CRUD de proyectos.
- CRUD de tareas.
- CRUD de categorías.
- CRUD de etiquetas.
- Asociación de etiquetas a tareas.
- CRUD de comentarios.
- Endpoint de usuario actual.
- Tareas devuelven etiquetas asociadas.

---

## Frontend implementado

- React + Vite + TypeScript.
- Tailwind CSS.
- React Router.
- Axios.
- Login.
- Registro.
- Validación de contraseña fuerte.
- Repetir contraseña.
- Ver/ocultar contraseña.
- Rutas protegidas.
- Layout con sidebar y topbar.
- Dashboard con datos reales.
- CRUD de proyectos.
- CRUD de tareas.
- Asignación de categorías a tareas.
- CRUD de categorías.
- CRUD de etiquetas.
- Asociación de etiquetas a tareas.
- Comentarios en tareas.
- Perfil de usuario conectado al backend.
- API externa de festivos/días no laborables.

---

## Páginas del frontend

- `/login`
- `/register`
- `/dashboard`
- `/projects`
- `/projects/:id`
- `/categories`
- `/tags`
- `/profile`

El requisito de mínimo 5 páginas queda cubierto.

---

## API externa

La integración externa se realiza desde el frontend mediante JavaScript.

Funcionalidad:

- Consultar próximos festivos.
- Mostrar el siguiente día no laborable.
- Mostrar lista de próximos festivos.
- Actualizar la información desde el dashboard.

---

## Tags recomendados

Versiones sugeridas:

```text
v0.1.0-backend
v0.2.0-frontend
```

Crear tag:

```bash
git tag -a v0.2.0-frontend -m "Frontend implementation completed"
git push origin v0.2.0-frontend
```

---

## Posibles mejoras futuras

- Menú móvil más completo.
- Tests automatizados.
- Despliegue en servidor.
- Docker.
- Paginación y filtros avanzados.
- Recuperación de contraseña.
- Edición avanzada de perfil.
- Roles de usuario.
