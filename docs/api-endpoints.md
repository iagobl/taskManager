# API endpoints

Este documento recoge los endpoints principales del backend de TaskManager.

Los endpoints privados requieren autenticación JWT mediante el botón `Authorize` de Swagger.

---

## Auth

### Registrar usuario

```text
POST /api/Auth/register
```

Body:

```json
{
  "fullName": "Iago Becerra",
  "email": "iago@example.com",
  "password": "123456"
}
```

### Iniciar sesión

```text
POST /api/Auth/login
```

Body:

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

---

## Users

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| `GET` | `/api/Users/me` | Obtener perfil del usuario autenticado |

---

## Projects

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| `GET` | `/api/Projects` | Obtener proyectos del usuario |
| `GET` | `/api/Projects/{id}` | Obtener un proyecto |
| `POST` | `/api/Projects` | Crear proyecto |
| `PUT` | `/api/Projects/{id}` | Actualizar proyecto |
| `DELETE` | `/api/Projects/{id}` | Eliminar proyecto |

Ejemplo para crear proyecto:

```json
{
  "name": "Práctica backend",
  "description": "Proyecto para organizar las tareas de la práctica"
}
```

---

## Tasks

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| `GET` | `/api/projects/{projectId}/tasks` | Obtener tareas de un proyecto |
| `GET` | `/api/tasks/{id}` | Obtener una tarea |
| `POST` | `/api/projects/{projectId}/tasks` | Crear tarea |
| `PUT` | `/api/tasks/{id}` | Actualizar tarea |
| `DELETE` | `/api/tasks/{id}` | Eliminar tarea |
| `PATCH` | `/api/tasks/{id}/complete` | Marcar tarea como completada |
| `PATCH` | `/api/tasks/{id}/reopen` | Reabrir tarea |

Ejemplo para crear tarea:

```json
{
  "title": "Implementar CRUD de tareas",
  "description": "Crear endpoints protegidos para gestionar tareas",
  "priority": "High",
  "dueDate": "2026-05-25T23:59:00",
  "categoryId": null
}
```

---

## Categories

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| `GET` | `/api/Categories` | Obtener categorías |
| `GET` | `/api/Categories/{id}` | Obtener una categoría |
| `POST` | `/api/Categories` | Crear categoría |
| `PUT` | `/api/Categories/{id}` | Actualizar categoría |
| `DELETE` | `/api/Categories/{id}` | Eliminar categoría |

Ejemplo para crear categoría:

```json
{
  "name": "Universidad",
  "color": "#2563EB"
}
```

---

## Tags

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| `GET` | `/api/Tags` | Obtener etiquetas |
| `GET` | `/api/Tags/{id}` | Obtener una etiqueta |
| `POST` | `/api/Tags` | Crear etiqueta |
| `PUT` | `/api/Tags/{id}` | Actualizar etiqueta |
| `DELETE` | `/api/Tags/{id}` | Eliminar etiqueta |
| `POST` | `/api/tasks/{taskId}/tags/{tagId}` | Asociar etiqueta a tarea |
| `DELETE` | `/api/tasks/{taskId}/tags/{tagId}` | Eliminar etiqueta de tarea |

Ejemplo para crear etiqueta:

```json
{
  "name": "Importante",
  "color": "#EF4444"
}
```

---

## Comments

| Método | Endpoint | Descripción |
| ------ | -------- | ----------- |
| `GET` | `/api/tasks/{taskId}/comments` | Obtener comentarios de una tarea |
| `GET` | `/api/comments/{id}` | Obtener un comentario |
| `POST` | `/api/tasks/{taskId}/comments` | Crear comentario |
| `PUT` | `/api/comments/{id}` | Actualizar comentario |
| `DELETE` | `/api/comments/{id}` | Eliminar comentario |

Ejemplo para crear comentario:

```json
{
  "content": "Revisar esta tarea antes de entregar la práctica."
}
```

---

## Errores habituales

### Sin token

Respuesta esperada:

```text
401 Unauthorized
```

### Recurso inexistente

Ejemplo:

```json
{
  "statusCode": 404,
  "message": "Project not found."
}
```

### Error de validación

ASP.NET Core devuelve automáticamente un `400 Bad Request` cuando los DTOs no cumplen las validaciones.
