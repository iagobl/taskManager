# Testing guide

Este documento define un flujo recomendado para probar TaskManager completo.

---

## 1. Ejecutar backend

```bash
cd TaskManager.Api
dotnet run
```

Swagger:

```text
http://localhost:5087/swagger
```

---

## 2. Ejecutar frontend

En otra terminal:

```bash
cd TaskManager.Client
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 3. Flujo desde el frontend

1. Abrir `/register`.
2. Crear usuario con contraseña fuerte, por ejemplo:

```text
Password123!
```

3. Entrar al dashboard.
4. Crear un proyecto.
5. Crear una categoría.
6. Crear una etiqueta.
7. Entrar al detalle del proyecto.
8. Crear una tarea.
9. Asignar categoría a la tarea.
10. Asignar etiqueta a la tarea.
11. Crear comentario en la tarea.
12. Marcar tarea como completada.
13. Reabrir tarea.
14. Revisar dashboard.
15. Revisar perfil.
16. Revisar festivos en el dashboard.

---

## 4. Flujo desde Swagger

### Auth

```text
POST /api/Auth/register
POST /api/Auth/login
```

Copiar token y pulsar `Authorize`.

Formato:

```text
Bearer TU_TOKEN
```

### Users

```text
GET /api/Users/me
```

### Projects

```text
POST /api/Projects
GET /api/Projects
GET /api/Projects/{id}
PUT /api/Projects/{id}
DELETE /api/Projects/{id}
```

### Categories

```text
POST /api/Categories
GET /api/Categories
PUT /api/Categories/{id}
DELETE /api/Categories/{id}
```

### Tags

```text
POST /api/Tags
GET /api/Tags
PUT /api/Tags/{id}
DELETE /api/Tags/{id}
```

### Tasks

```text
POST /api/projects/{projectId}/tasks
GET /api/projects/{projectId}/tasks
GET /api/tasks/{id}
PUT /api/tasks/{id}
PATCH /api/tasks/{id}/complete
PATCH /api/tasks/{id}/reopen
DELETE /api/tasks/{id}
```

### Task tags

```text
POST /api/tasks/{taskId}/tags/{tagId}
DELETE /api/tasks/{taskId}/tags/{tagId}
```

### Comments

```text
POST /api/tasks/{taskId}/comments
GET /api/tasks/{taskId}/comments
PUT /api/comments/{id}
DELETE /api/comments/{id}
```

---

## 5. Casos de error recomendados

### Sin token

Probar una ruta protegida sin token:

```text
GET /api/Projects
```

Resultado esperado:

```text
401 Unauthorized
```

### Recurso inexistente

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

### Usuario sin acceso

1. Crear usuario A.
2. Crear proyecto con usuario A.
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

### Registro incorrecto

Probar email repetido o contraseña no válida en frontend.

---

## 6. Checklist final

- Backend compila.
- Frontend compila.
- Swagger abre.
- React abre.
- Registro funciona.
- Login funciona.
- JWT se guarda.
- Rutas protegidas funcionan.
- CRUD de proyectos funciona.
- CRUD de tareas funciona.
- Categorías funcionan.
- Etiquetas funcionan.
- Etiquetas en tareas funcionan.
- Comentarios funcionan.
- Perfil funciona.
- Festivos externos funcionan.
