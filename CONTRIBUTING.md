# Contributing

Thank you for your interest in this project.

This repository contains an academic web application developed as part of a backend and web development practice. The project consists of a task and project management system built with ASP.NET Core Web API, Entity Framework Core and SQL Server.

At this stage, the repository is mainly intended for academic development and evaluation. External contributions are not actively expected while the practice is being developed, but suggestions, issue reports and improvements may be considered.

---

## Project scope

The goal of this project is to implement a complete backend API for a task and project management application.

The backend should include:

- ASP.NET Core Web API
- REST endpoints
- SQL Server database
- Entity Framework Core
- Migrations and relationships
- Authentication and authorization
- Protected routes
- DTOs
- Repository layer
- Service layer
- Dependency injection
- Exception handling middleware
- Logging with Serilog / ILogger
- Input validation

The frontend will be developed later and will consume this backend API.

---

## Development environment setup

### Prerequisites

To work on this project, the following tools are recommended:

- Visual Studio 2022 Community or later
- .NET SDK
- SQL Server LocalDB or SQL Server Express
- SQL Server Management Studio
- Entity Framework Core CLI tools
- Git
- Node.js and npm, only if the frontend is developed with React, Angular or Vue

Check the .NET installation:

```bash
dotnet --version
```

Install the Entity Framework Core CLI tools:

```bash
dotnet tool install --global dotnet-ef
```

Check the EF Core tools installation:

```bash
dotnet ef --version
```

---

## Project structure

The backend project is located in:

```text
TaskManager.Api/
```

The expected backend structure is:

```text
TaskManager.Api/
├── Controllers/
├── Data/
├── DTOs/
├── Middleware/
├── Models/
├── Repositories/
├── Services/
├── Migrations/
├── Program.cs
└── appsettings.json
```

### Folder responsibilities

| Folder | Responsibility |
| ------ | -------------- |
| `Controllers/` | Expose REST endpoints and handle HTTP requests |
| `Data/` | Contains the Entity Framework Core `DbContext` |
| `DTOs/` | Defines request and response objects |
| `Middleware/` | Contains custom middleware, such as exception handling |
| `Models/` | Contains the database entity models |
| `Repositories/` | Handles direct data access logic |
| `Services/` | Contains business logic |
| `Migrations/` | Contains EF Core database migrations |

---

## Coding standards

The project follows C# and ASP.NET Core conventions.

### General rules

- Use clear and descriptive names for classes, methods and variables.
- Keep controllers simple and focused on HTTP request handling.
- Put business logic inside services.
- Put database access logic inside repositories.
- Use DTOs instead of exposing entity models directly.
- Use dependency injection for services and repositories.
- Validate incoming data before processing it.
- Use asynchronous methods when accessing the database.
- Avoid duplicating code between controllers and services.
- Keep methods short and focused on one responsibility.
- Do not expose internal database models directly in API responses.
- Keep security and user ownership checks in the service layer.

### Naming conventions

Use the following naming style:

| Element | Convention | Example |
| ------- | ---------- | ------- |
| Classes | PascalCase | `TaskService` |
| Interfaces | PascalCase with `I` prefix | `ITaskService` |
| Methods | PascalCase | `GetUserTasksAsync` |
| Variables | camelCase | `projectId` |
| Constants | PascalCase or UPPER_CASE | `DefaultPageSize` |
| DTOs | PascalCase ending in `Dto` | `CreateTaskDto` |
| Controllers | PascalCase ending in `Controller` | `TasksController` |
| Services | PascalCase ending in `Service` | `ProjectService` |
| Repositories | PascalCase ending in `Repository` | `TaskRepository` |

---

## Backend architecture

The backend should follow a layered structure.

### Controllers

Controllers should only coordinate HTTP requests and responses.

They should:

- Receive requests.
- Validate route parameters.
- Call the corresponding service.
- Return HTTP responses.

Example:

```csharp
[HttpGet]
public async Task<ActionResult<IEnumerable<TaskDto>>> GetTasks()
{
    var tasks = await _taskService.GetAllAsync();
    return Ok(tasks);
}
```

Controllers should not contain:

- Direct Entity Framework Core queries.
- Complex business rules.
- Password hashing logic.
- JWT generation logic.
- User ownership validation logic.

### Services

Services should contain the main business logic of the application.

Examples of service responsibilities:

- Validate if a project belongs to the authenticated user.
- Check whether a task can be updated or deleted.
- Coordinate calls between repositories.
- Build response DTOs.
- Apply authorization rules.
- Handle application-specific validations.

### Repositories

Repositories should handle direct access to the database using Entity Framework Core.

Examples of repository responsibilities:

- Get tasks from the database.
- Add a new project.
- Update a task.
- Delete a comment.
- Query categories and tags.
- Save changes through the database context.

### DTOs

DTOs should be used for API input and output.

Entity models should not be exposed directly through API responses.

Example DTO types:

```text
CreateProjectDto
UpdateProjectDto
ProjectDto

CreateTaskDto
UpdateTaskDto
TaskDto

RegisterUserDto
LoginUserDto
AuthResponseDto
```

---

## Database changes

Database changes must be made using Entity Framework Core migrations.

Create a migration:

```bash
dotnet ef migrations add MigrationName
```

Apply migrations to the database:

```bash
dotnet ef database update
```

Example:

```bash
dotnet ef migrations add AddTaskComments
dotnet ef database update
```

Do not manually edit generated migration files unless strictly necessary.

Before committing a migration, check that:

```bash
dotnet build
```

runs successfully.

### Migration naming

Migration names should be descriptive and use PascalCase.

Good examples:

```text
InitialCreate
AddTaskComments
AddTaskTags
AddUserProfileFields
UpdateTaskPriorityModel
```

Bad examples:

```text
migration1
test
changes
newdb
```

---

## Commit conventions

This project follows a lightweight version of Conventional Commits.

### Commit format

Each commit message should follow this structure:

```text
<type>(<scope>): <short description>
```

The scope is optional but recommended.

Examples:

```text
feat(auth): add user registration endpoint
fix(tasks): correct task completion update
docs(readme): update project setup instructions
chore: initialize ASP.NET Core Web API project
```

---

## Commit types

Use one of the following types:

| Type | When to use it |
| ---- | -------------- |
| `feat` | A new feature or capability |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting changes without code behavior changes |
| `refactor` | Code restructuring without changing behavior |
| `test` | Adding or modifying tests |
| `build` | Build system, dependencies or project configuration |
| `chore` | Maintenance tasks, setup or non-functional changes |
| `perf` | Performance improvements |

---

## Recommended commit scopes

Use the affected part of the project as the scope.

Recommended scopes:

| Scope | Meaning |
| ----- | ------- |
| `api` | General backend API changes |
| `auth` | Authentication and authorization |
| `users` | User-related logic |
| `projects` | Project management |
| `tasks` | Task management |
| `categories` | Task categories |
| `tags` | Task tags |
| `comments` | Task comments |
| `data` | DbContext, models or EF Core configuration |
| `migrations` | Database migrations |
| `repositories` | Repository layer |
| `services` | Service layer |
| `middleware` | Custom middleware |
| `logging` | Serilog or ILogger configuration |
| `swagger` | Swagger/OpenAPI configuration |
| `docs` | Documentation |
| `build` | Project configuration or dependencies |

---

## Commit examples

### Initial project setup

```text
chore: initialize ASP.NET Core Web API project
```

### Swagger configuration

```text
chore(swagger): enable Swagger UI for API testing
```

### Database model

```text
feat(data): configure EF Core data model and initial migration
```

### Authentication

```text
feat(auth): add user registration and login endpoints
```

### Protected routes

```text
feat(auth): protect project and task endpoints with JWT
```

### Project CRUD

```text
feat(projects): add project CRUD endpoints
```

### Task CRUD

```text
feat(tasks): add task management endpoints
```

### Categories

```text
feat(categories): add category management endpoints
```

### Tags

```text
feat(tags): add task tagging support
```

### Comments

```text
feat(comments): add comments to tasks
```

### Middleware

```text
feat(middleware): add global exception handling
```

### Logging

```text
feat(logging): configure Serilog file logging
```

### Bug fix

```text
fix(tasks): prevent users from editing tasks from other projects
```

### Documentation

```text
docs: add contribution and security guidelines
```

### Refactor

```text
refactor(services): move task validation logic to service layer
```

### Dependencies

```text
build(api): add JWT authentication package
```

---

## Commit message rules

Follow these rules when writing commits:

- Use English commit messages.
- Use lowercase for the type and scope.
- Use the imperative mood.
- Do not end the subject with a period.
- Keep the subject short and clear.
- Keep the subject under 72 characters when possible.
- Keep each commit focused on one logical change.
- Do not mix unrelated changes in the same commit.
- Explain the reason for complex changes in the commit body if needed.

Good examples:

```text
feat(tasks): add endpoint to complete a task
fix(auth): validate duplicated email during registration
docs: update backend setup instructions
```

Bad examples:

```text
added stuff
fix things
update
changes
feat: added task controller and fixed readme and changed database
```

---

## Commit body

For simple commits, a one-line message is enough.

For larger commits, use a body to explain why the change was made.

Example:

```text
feat(auth): add JWT login endpoint

Adds token generation after a successful login so the frontend can access
protected project and task routes.
```

Use the body when:

- The change is complex.
- A design decision needs explanation.
- A migration modifies important relationships.
- A security-related change is introduced.

---

## Branch naming

If branches are used, their names should follow this structure:

```text
<type>/<short-description>
```

Examples:

```text
feat/user-authentication
feat/project-crud
feat/task-comments
fix/task-ownership-validation
docs/backend-setup
refactor/service-layer
```

Recommended prefixes:

| Prefix | When to use it |
| ------ | -------------- |
| `feat/` | New functionality |
| `fix/` | Bug fixes |
| `docs/` | Documentation |
| `refactor/` | Code restructuring |
| `chore/` | Maintenance or setup |
| `build/` | Dependencies or build configuration |

---

## Pull request process

If pull requests are used, they should follow this process:

1. Create a branch from `main`.
2. Use a descriptive branch name.
3. Keep the pull request focused on one topic.
4. Explain what was changed.
5. Mention any database migration added.
6. Include testing or verification steps.
7. Make sure the project builds successfully.
8. Open the pull request against `main`.

A pull request description should include:

```md
## Description

Briefly explain what this change does.

## Changes

- Added ...
- Updated ...
- Fixed ...

## Database changes

Mention whether a migration was added.

## Testing

Explain how the change was tested.

## Notes

Mention limitations or pending work if needed.
```

---

## Testing and verification

Before committing or opening a pull request, run:

```bash
dotnet build
```

If the backend is runnable, also test:

```bash
dotnet run
```

Then open Swagger:

```text
http://localhost:<port>/swagger
```

For database changes, verify that the migration works:

```bash
dotnet ef database update
```

If using SQL Server Management Studio, check that the expected tables and relationships were created correctly.

---

## Security rules

Do not commit sensitive information.

Never commit:

- Real passwords
- Production database connection strings
- JWT production secrets
- API keys
- Private tokens
- Service credentials
- Personal or confidential data

Development values in `appsettings.json` must only be used for local development.

For production or deployment environments, use:

- Environment variables
- .NET user secrets
- A secure secret manager

---

## Academic integrity

This repository is part of an academic practice.

Any reused code, external resource or third-party library should be properly acknowledged when necessary. The project should represent the author's own work and follow the academic rules of the course.

---

## Review expectations

When reviewing or modifying code, check that:

- The code builds successfully.
- The change is related to the commit message.
- The API behavior is clear.
- Controllers do not contain unnecessary business logic.
- Services and repositories are used properly.
- Entity relationships are correctly configured.
- User authorization is respected.
- Sensitive information is not exposed.
- The documentation is updated if needed.

---

## Questions

If there are doubts about the project structure, commit format or development process, they should be clarified before making large changes.

This helps keep the repository clean, understandable and easier to evaluate.
