# Testing guide

Este documento define un flujo recomendado para probar el backend de TaskManager desde Swagger.

---

## 1. Ejecutar backend

Desde `TaskManager.Api`:

```bash
dotnet run
```

Abrir Swagger:

```text
http://localhost:5087/swagger
```

---

## 2. Registrar usuario

Endpoint:

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

---

## 3. Iniciar sesión

Endpoint:

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

Copiar el token devuelto.

---

## 4. Autorizar Swagger

Pulsar `Authorize` y pegar:

```text
Bearer TU_TOKEN
```

---

## 5. Probar usuario actual

Endpoint:

```text
GET /api/Users/me
```

Debe devolver los datos del usuario autenticado.

---

## 6. Crear proyecto

Endpoint:

```text
POST /api/Projects
```

Body:

```json
{
  "name": "Práctica backend",
  "description": "Proyecto para organizar las tareas de la práctica"
}
```

Guardar el `id` del proyecto creado.

---

## 7. Crear categoría

Endpoint:

```text
POST /api/Categories
```

Body:

```json
{
  "name": "Universidad",
  "color": "#2563EB"
}
```

Guardar el `id` de la categoría si se quiere usar en tareas.

---

## 8. Crear tarea

Endpoint:

```text
POST /api/projects/{projectId}/tasks
```

Body:

```json
{
  "title": "Implementar CRUD de tareas",
  "description": "Crear endpoints protegidos para gestionar tareas",
  "priority": "High",
  "dueDate": "2026-05-25T23:59:00",
  "categoryId": null
}
```

Guardar el `id` de la tarea creada.

---

## 9. Completar y reabrir tarea

Completar:

```text
PATCH /api/tasks/{id}/complete
```

Reabrir:

```text
PATCH /api/tasks/{id}/reopen
```

---

## 10. Crear etiqueta

Endpoint:

```text
POST /api/Tags
```

Body:

```json
{
  "name": "Importante",
  "color": "#EF4444"
}
```

Guardar el `id` de la etiqueta.

---

## 11. Asociar etiqueta a tarea

Endpoint:

```text
POST /api/tasks/{taskId}/tags/{tagId}
```

Debe devolver `204 No Content`.

---

## 12. Eliminar etiqueta de tarea

Endpoint:

```text
DELETE /api/tasks/{taskId}/tags/{tagId}
```

Debe devolver `204 No Content`.

---

## 13. Crear comentario

Endpoint:

```text
POST /api/tasks/{taskId}/comments
```

Body:

```json
{
  "content": "Revisar esta tarea antes de entregar la práctica."
}
```

---

## 14. Consultar comentarios

Endpoint:

```text
GET /api/tasks/{taskId}/comments
```

Debe devolver los comentarios de la tarea.

---

## 15. Probar errores controlados

### Proyecto inexistente

```text
GET /api/Projects/999999
```

Respuesta esperada:

```json
{
  "statusCode": 404,
  "message": "Project not found."
}
```

### Sin token

Cerrar autorización en Swagger o no enviar token y probar:

```text
GET /api/Projects
```

Respuesta esperada:

```text
401 Unauthorized
```

---

## 16. Prueba de seguridad entre usuarios

1. Crear usuario A.
2. Crear un proyecto con usuario A.
3. Crear usuario B.
4. Iniciar sesión con usuario B.
5. Intentar acceder al proyecto del usuario A.

Resultado esperado:

```json
{
  "statusCode": 404,
  "message": "Project not found."
}
```

Esto confirma que un usuario no puede acceder a recursos de otro.

---

## 17. Orden de prueba completo

Orden recomendado:

```text
Register
Login
Authorize
GET /api/Users/me
POST /api/Projects
GET /api/Projects
POST /api/Categories
POST /api/projects/{projectId}/tasks
GET /api/projects/{projectId}/tasks
PATCH /api/tasks/{id}/complete
PATCH /api/tasks/{id}/reopen
POST /api/Tags
POST /api/tasks/{taskId}/tags/{tagId}
DELETE /api/tasks/{taskId}/tags/{tagId}
POST /api/tasks/{taskId}/comments
GET /api/tasks/{taskId}/comments
PUT /api/comments/{id}
DELETE /api/comments/{id}
DELETE /api/tasks/{id}
DELETE /api/Projects/{id}
```
