# Database

Este documento describe el modelo de datos, relaciones y migraciones de TaskManager.

---

## Tecnología

- SQL Server / SQL Server LocalDB.
- Entity Framework Core.
- Migraciones EF Core.

Cadena local por defecto:

```text
Server=(localdb)\MSSQLLocalDB;Database=TaskManagerDb;Trusted_Connection=True;TrustServerCertificate=True
```

---

## Entidades principales

- `User`
- `Project`
- `TaskItem`
- `Category`
- `Tag`
- `TaskTag`
- `Comment`

---

## Relaciones

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

## User

Representa a un usuario registrado.

Campos principales:

- `Id`
- `FullName`
- `Email`
- `PasswordHash`
- `CreatedAt`

Relaciones:

- Un usuario puede tener varios proyectos.
- Un usuario puede tener varias categorías.
- Un usuario puede tener varias etiquetas.

---

## Project

Representa un proyecto o grupo de tareas.

Campos principales:

- `Id`
- `Name`
- `Description`
- `CreatedAt`
- `UserId`

Relaciones:

- Pertenece a un usuario.
- Tiene varias tareas.

---

## TaskItem

Representa una tarea dentro de un proyecto.

Campos principales:

- `Id`
- `Title`
- `Description`
- `IsCompleted`
- `Priority`
- `DueDate`
- `CreatedAt`
- `CompletedAt`
- `ProjectId`
- `CategoryId`

Relaciones:

- Pertenece a un proyecto.
- Puede pertenecer a una categoría.
- Puede tener comentarios.
- Puede tener etiquetas mediante `TaskTag`.

---

## Category

Representa una categoría creada por el usuario.

Campos principales:

- `Id`
- `Name`
- `Color`
- `UserId`

Relaciones:

- Pertenece a un usuario.
- Puede estar asociada a varias tareas.

---

## Tag

Representa una etiqueta creada por el usuario.

Campos principales:

- `Id`
- `Name`
- `Color`
- `UserId`

Relaciones:

- Pertenece a un usuario.
- Puede estar asociada a varias tareas mediante `TaskTag`.

---

## TaskTag

Tabla intermedia para representar la relación muchos a muchos entre tareas y etiquetas.

Campos principales:

- `TaskItemId`
- `TagId`

---

## Comment

Representa un comentario dentro de una tarea.

Campos principales:

- `Id`
- `Content`
- `CreatedAt`
- `TaskItemId`

Relaciones:

- Pertenece a una tarea.

---

## Migraciones

Aplicar migraciones:

```bash
cd TaskManager.Api
dotnet ef database update
```

Crear migración:

```bash
dotnet ef migrations add NombreMigracion
```

Eliminar última migración no aplicada:

```bash
dotnet ef migrations remove
```

---

## Revisión en SQL Server Management Studio

Conectar a:

```text
(localdb)\MSSQLLocalDB
```

Base de datos:

```text
TaskManagerDb
```

Tablas esperadas:

```text
Users
Projects
Tasks
Categories
Tags
TaskTags
Comments
__EFMigrationsHistory
```

---

## Seguridad de datos

- Las contraseñas no se almacenan en texto plano.
- Solo se guarda `PasswordHash`.
- El usuario solo puede acceder a sus propios recursos.
- La lógica de propiedad se comprueba en servicios.
- Los DTOs evitan exponer entidades internas completas.
