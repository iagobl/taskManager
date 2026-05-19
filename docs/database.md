# Database

Este documento describe el modelo de datos, las relaciones principales y el uso de Entity Framework Core en TaskManager.

---

## Tecnología

La base de datos utiliza:

- SQL Server / SQL Server LocalDB
- Entity Framework Core
- Migraciones EF Core

La cadena de conexión local por defecto es:

```text
Server=(localdb)\MSSQLLocalDB;Database=TaskManagerDb;Trusted_Connection=True;TrustServerCertificate=True
```

---

## Entidades principales

El backend trabaja con estas entidades:

- `User`
- `Project`
- `TaskItem`
- `Category`
- `Tag`
- `TaskTag`
- `Comment`

---

## Relaciones

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

## Descripción de entidades

### User

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

### Project

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

### TaskItem

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
- Puede tener varios comentarios.
- Puede tener varias etiquetas mediante `TaskTag`.

---

### Category

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

### Tag

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

### TaskTag

Tabla intermedia para representar la relación N:M entre tareas y etiquetas.

Campos principales:

- `TaskItemId`
- `TagId`

---

### Comment

Representa un comentario o nota dentro de una tarea.

Campos principales:

- `Id`
- `Content`
- `CreatedAt`
- `TaskItemId`

Relaciones:

- Pertenece a una tarea.

---

## Migraciones

Las migraciones se encuentran en:

```text
TaskManager.Api/Migrations/
```

### Aplicar migraciones

Desde `TaskManager.Api`:

```bash
dotnet ef database update
```

### Crear una nueva migración

```bash
dotnet ef migrations add NombreMigracion
```

Ejemplo:

```bash
dotnet ef migrations add AddTaskComments
```

Después aplicar:

```bash
dotnet ef database update
```

### Eliminar última migración no aplicada

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

El nombre exacto de las tablas puede depender del nombre definido en los `DbSet` del `AppDbContext`.

---

## Seguridad de datos

Puntos importantes:

- Las contraseñas no se almacenan en texto plano.
- Solo se guarda `PasswordHash`.
- Los usuarios no deben acceder a datos de otros usuarios.
- La lógica de ownership se comprueba desde los servicios.
- Los DTOs evitan exponer entidades internas directamente.
