# Frontend setup

Este documento explica cómo configurar, ejecutar y probar el frontend de TaskManager.

---

## Tecnologías

- React.
- Vite.
- TypeScript.
- Tailwind CSS.
- React Router.
- Axios.
- Lucide React.
- API externa de festivos con `fetch`.

---

## Requisitos

- Node.js LTS.
- npm.
- Backend ejecutándose.

Comprobar instalación:

```bash
node --version
npm --version
```

---

## Instalar dependencias

Desde `TaskManager.Client`:

```bash
npm install
```

---

## Variables de entorno

Crear o revisar el archivo:

```text
TaskManager.Client/.env
```

Contenido:

```env
VITE_API_BASE_URL=http://localhost:5087/api
```

Si el backend usa otro puerto, cambiar la URL.

---

## Ejecutar frontend

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:5173
```

---

## Rutas principales

| Ruta | Descripción |
| ---- | ----------- |
| `/login` | Inicio de sesión |
| `/register` | Registro de usuario |
| `/dashboard` | Panel principal |
| `/projects` | Gestión de proyectos |
| `/projects/:id` | Detalle de proyecto y tareas |
| `/categories` | Gestión de categorías |
| `/tags` | Gestión de etiquetas |
| `/profile` | Perfil del usuario |

---

## Funcionalidades del frontend

- Login conectado al backend.
- Registro conectado al backend.
- Validación de contraseña segura.
- Campo de repetir contraseña.
- Mostrar/ocultar contraseña.
- Rutas protegidas.
- Layout con sidebar y topbar.
- Dashboard con datos reales.
- CRUD visual de proyectos.
- CRUD visual de tareas.
- Asignación de categorías a tareas.
- CRUD visual de categorías.
- CRUD visual de etiquetas.
- Asociación de etiquetas a tareas.
- Comentarios en tareas.
- Perfil conectado al backend.
- Integración externa de festivos/días no laborables.

---

## API externa

El frontend consulta festivos mediante una API pública de calendario.

Funcionalidad:

- Mostrar próximos festivos.
- Mostrar el siguiente día no laborable.
- Botón para actualizar.
- Manejo de error si la API externa falla.

---

## Comandos útiles

Instalar dependencias:

```bash
npm install
```

Ejecutar desarrollo:

```bash
npm run dev
```

Generar build de producción:

```bash
npm run build
```

Previsualizar build:

```bash
npm run preview
```

---

## Problemas frecuentes

### La pantalla de login/register no conecta

Revisar:

- Backend levantado.
- `.env` correcto.
- CORS configurado en backend.

### Error 401

Cerrar sesión e iniciar sesión de nuevo.

### Cambié `.env` y no funciona

Reiniciar Vite:

```bash
Ctrl + C
npm run dev
```
