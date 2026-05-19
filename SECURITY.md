# Security Policy

## Overview

This document describes the security policy for this repository.

This project is an academic web application for task and project management. The backend is developed with ASP.NET Core Web API, Entity Framework Core and SQL Server.

The project includes, or will include, security-related features such as:

- User registration and login
- Password hashing
- JWT-based authentication
- Protected API routes
- Authorization checks
- Input validation
- Centralized exception handling
- Logging
- SQL Server access through Entity Framework Core

---

## Supported versions

This project is currently under active academic development. Security updates and fixes will be applied only to the current development version.

| Version | Supported |
| ------- | --------- |
| Current development version | Yes |
| Older versions | No |

---

## Reporting a vulnerability

If you find a security issue in this project, please report it privately instead of opening a public issue.

You can contact the repository maintainer through the contact information associated with the repository.

When reporting a vulnerability, please include as much information as possible:

- A clear description of the issue
- Steps to reproduce it
- The affected endpoint, component or feature
- The possible impact
- Any logs, screenshots or error messages that may help
- A suggested fix or mitigation, if available

Please do not publicly disclose the vulnerability until it has been reviewed and fixed.

---

## Security scope

Security issues may include, but are not limited to:

- Authentication bypass
- Authorization problems
- Access to another user's projects or tasks
- Passwords stored or exposed incorrectly
- JWT secrets exposed in the repository
- Sensitive information returned in API responses
- SQL injection risks
- Insecure database access
- Excessive error details exposed to clients
- Logging of sensitive data
- Missing validation in user input

---

## Sensitive data

The following information must never be committed to the repository:

- Real passwords
- Production database connection strings
- JWT production secrets
- API keys
- Private tokens
- Service credentials
- Real user data
- Personal or confidential information

Development values in `appsettings.json` must only be used for local development.

For production or deployment environments, secrets should be stored using one of the following options:

- Environment variables
- .NET user secrets
- A secure secret manager
- Deployment platform secret storage

---

## Configuration files

Configuration files such as `appsettings.json` may contain local development values.

Allowed in local development:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=TaskManagerDb;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

Not allowed:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=production-server;Database=RealDb;User Id=admin;Password=real-password"
  }
}
```

Production credentials must not be stored directly in repository files.

---

## Password handling

Passwords must never be stored in plain text.

The backend should store only password hashes generated with a secure hashing algorithm such as BCrypt.

Recommended rules:

- Hash passwords before saving users in the database.
- Never return password hashes in API responses.
- Never log passwords or password hashes.
- Validate login credentials through the authentication service.
- Use DTOs to avoid exposing internal user entities directly.

---

## JWT authentication

JWT tokens should be signed using a sufficiently long secret key.

For local development, a placeholder key may be used. For production or deployment environments, the key must be replaced with a secure value and must not be committed to the repository.

JWT-related recommendations:

- Keep the signing key private.
- Use token expiration.
- Validate issuer and audience.
- Protect private endpoints with `[Authorize]`.
- Do not store JWT tokens in logs.
- Do not return unnecessary user information inside tokens.

---

## Authorization and user ownership

The application must ensure that users can only access their own data.

This applies to:

- Projects
- Tasks
- Categories
- Tags
- Comments
- User profile information

Examples of required checks:

- A user must not be able to view another user's projects.
- A user must not be able to edit or delete another user's tasks.
- A user must not be able to assign a task to a project they do not own.
- A user must not be able to create tags or categories for another user.
- A user must not be able to read comments from tasks outside their own projects.

Ownership checks should be handled in the service layer whenever possible.

---

## Database security

Database access is handled through Entity Framework Core and SQL Server.

Recommended practices:

- Use EF Core LINQ queries whenever possible.
- Avoid raw SQL unless strictly necessary.
- If raw SQL is used, make sure it is parameterized.
- Validate user ownership before returning or modifying data.
- Keep migrations under version control.
- Do not manually modify generated migration files unless necessary.
- Do not expose database exceptions directly to API clients.

---

## Input validation

All incoming data should be validated before being processed.

Validation should be applied to:

- Registration data
- Login data
- Project creation and updates
- Task creation and updates
- Categories
- Tags
- Comments
- Query parameters
- Route parameters

Recommended practices:

- Use DTOs for request bodies.
- Add validation attributes where appropriate.
- Check string lengths.
- Validate required fields.
- Validate dates and priorities.
- Avoid trusting client-provided user IDs.

---

## Error handling

The application should avoid exposing internal implementation details in API responses.

API responses should not expose:

- Stack traces
- Full exception messages
- Database connection strings
- SQL queries
- File paths
- JWT secrets
- Internal server details

Detailed errors may be logged internally during development, but client responses should remain clear and safe.

A centralized exception handling middleware should be used to manage errors consistently.

---

## Logging

Logging should help diagnose application problems and security-relevant events.

Logs may include:

- Failed login attempts
- Unexpected server errors
- Invalid access attempts
- Important backend events
- Database operation failures

Logs must not contain:

- Passwords
- Password hashes
- JWT tokens
- Private keys
- Full connection strings
- API keys
- Sensitive personal data

If Serilog is used, make sure log files are not used to store sensitive information.

---

## Dependency management

Dependencies should be kept up to date where possible.

Before delivery, it is recommended to review installed NuGet packages and remove unused dependencies.

Recommended checks:

```bash
dotnet list package
dotnet build
```

If a dependency is added, it should have a clear purpose and should not introduce unnecessary security risks.

---

## API security checklist

Before considering the backend ready, check that:

- [ ] Passwords are hashed before being stored.
- [ ] Password hashes are never returned in API responses.
- [ ] JWT authentication is configured.
- [ ] Protected endpoints use `[Authorize]`.
- [ ] Users can only access their own data.
- [ ] DTOs are used instead of exposing entities directly.
- [ ] Input validation is applied.
- [ ] Entity Framework Core is used safely.
- [ ] Errors are handled through middleware.
- [ ] Logs do not contain sensitive information.
- [ ] Development secrets are not real production secrets.
- [ ] The project builds successfully with `dotnet build`.

---

## Local development security

This project is developed locally using tools such as:

- Visual Studio 2022
- ASP.NET Core Web API
- SQL Server LocalDB or SQL Server Express
- SQL Server Management Studio
- Entity Framework Core

Local development configuration is acceptable for academic testing, but it should not be treated as production-ready without additional hardening.

For deployment, review:

- HTTPS configuration
- CORS policy
- JWT secret management
- Database connection security
- Logging configuration
- Error handling
- Production environment variables

---

## Academic context

This repository is part of an academic practice.

The project is not intended to store real personal data or production information. Any test data used during development should be fictitious.

Do not use real passwords, real users or confidential information when testing the application.
