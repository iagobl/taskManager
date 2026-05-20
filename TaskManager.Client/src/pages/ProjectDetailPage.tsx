import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Circle,
    Clock3,
    Edit3,
    Plus,
    Search,
    Trash2,
} from 'lucide-react'
import { projectsApi } from '../api/projectsApi'
import { tasksApi } from '../api/tasksApi'
import type { Project } from '../types/project'
import type { TaskItem } from '../types/task'

const priorities = ['Low', 'Medium', 'High']

function getPriorityStyle(priority: string) {
    switch (priority.toLowerCase()) {
        case 'high':
            return 'bg-red-50 text-red-600'
        case 'medium':
            return 'bg-amber-50 text-amber-600'
        case 'low':
            return 'bg-emerald-50 text-emerald-600'
        default:
            return 'bg-slate-100 text-slate-600'
    }
}

export function ProjectDetailPage() {
    const { id } = useParams()
    const projectId = Number(id)

    const [project, setProject] = useState<Project | null>(null)
    const [tasks, setTasks] = useState<TaskItem[]>([])
    const [search, setSearch] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('Medium')
    const [dueDate, setDueDate] = useState('')
    const [editingTask, setEditingTask] = useState<TaskItem | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const filteredTasks = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        if (!normalizedSearch) {
            return tasks
        }

        return tasks.filter((task) => {
            return (
                task.title.toLowerCase().includes(normalizedSearch) ||
                task.description?.toLowerCase().includes(normalizedSearch) ||
                task.priority.toLowerCase().includes(normalizedSearch)
            )
        })
    }, [tasks, search])

    const completedTasks = tasks.filter((task) => task.isCompleted).length
    const pendingTasks = tasks.length - completedTasks

    const loadData = async () => {
        try {
            setLoading(true)
            setError('')

            const [projectData, tasksData] = await Promise.all([
                projectsApi.getById(projectId),
                tasksApi.getAllByProject(projectId),
            ])

            setProject(projectData)
            setTasks(tasksData)
        } catch {
            setError('No se pudo cargar el proyecto.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!Number.isNaN(projectId)) {
            void loadData()
        }
    }, [projectId])

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setPriority('Medium')
        setDueDate('')
        setEditingTask(null)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!title.trim()) {
            setError('El título de la tarea es obligatorio.')
            return
        }

        try {
            setSaving(true)
            setError('')

            const payload = {
                title: title.trim(),
                description: description.trim(),
                priority,
                dueDate: dueDate ? new Date(dueDate).toISOString() : null,
                categoryId: null,
            }

            if (editingTask) {
                const updatedTask = await tasksApi.update(editingTask.id, payload)

                setTasks((currentTasks) =>
                    currentTasks.map((task) =>
                        task.id === updatedTask.id ? updatedTask : task,
                    ),
                )
            } else {
                const createdTask = await tasksApi.create(projectId, payload)
                setTasks((currentTasks) => [createdTask, ...currentTasks])
            }

            resetForm()
        } catch {
            setError('No se pudo guardar la tarea.')
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (task: TaskItem) => {
        setEditingTask(task)
        setTitle(task.title)
        setDescription(task.description ?? '')
        setPriority(task.priority)
        setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '')
    }

    const handleDelete = async (task: TaskItem) => {
        const confirmed = window.confirm(
            `¿Seguro que quieres eliminar la tarea "${task.title}"?`,
        )

        if (!confirmed) {
            return
        }

        try {
            setError('')
            await tasksApi.remove(task.id)

            setTasks((currentTasks) =>
                currentTasks.filter((item) => item.id !== task.id),
            )
        } catch {
            setError('No se pudo eliminar la tarea.')
        }
    }

    const handleToggleCompleted = async (task: TaskItem) => {
        try {
            setError('')

            const updatedTask = task.isCompleted
                ? await tasksApi.reopen(task.id)
                : await tasksApi.complete(task.id)

            setTasks((currentTasks) =>
                currentTasks.map((item) =>
                    item.id === updatedTask.id ? updatedTask : item,
                ),
            )
        } catch {
            setError('No se pudo actualizar el estado de la tarea.')
        }
    }

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-500 shadow-sm">
                Cargando proyecto...
            </div>
        )
    }

    if (!project) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center font-semibold text-red-700">
                Proyecto no encontrado.
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-8 text-white shadow-xl shadow-blue-900/20">
                <Link
                    to="/projects"
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-blue-50 ring-1 ring-white/15 transition hover:bg-white/15"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a proyectos
                </Link>

                <div className="mt-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                            Detalle de proyecto
                        </p>
                        <h1 className="mt-4 text-4xl font-black tracking-tight">
                            {project.name}
                        </h1>
                        <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                            {project.description || 'Proyecto sin descripción.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="rounded-3xl bg-white/10 px-5 py-4 text-center ring-1 ring-white/15 backdrop-blur">
                            <p className="text-2xl font-black">{tasks.length}</p>
                            <p className="text-xs text-blue-100">Total</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 px-5 py-4 text-center ring-1 ring-white/15 backdrop-blur">
                            <p className="text-2xl font-black">{pendingTasks}</p>
                            <p className="text-xs text-blue-100">Pendientes</p>
                        </div>
                        <div className="rounded-3xl bg-white/10 px-5 py-4 text-center ring-1 ring-white/15 backdrop-blur">
                            <p className="text-2xl font-black">{completedTasks}</p>
                            <p className="text-xs text-blue-100">Hechas</p>
                        </div>
                    </div>
                </div>
            </section>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <Plus className="h-6 w-6" />
                        </div>

                        <div>
                            <h2 className="text-xl font-black text-slate-950">
                                {editingTask ? 'Editar tarea' : 'Nueva tarea'}
                            </h2>
                            <p className="text-sm text-slate-500">
                                Define tarea, prioridad y fecha límite.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-5">
                        <div>
                            <label className="text-sm font-bold text-slate-700">
                                Título
                            </label>
                            <input
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                                placeholder="Ej. Preparar documentación"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                maxLength={160}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700">
                                Descripción
                            </label>
                            <textarea
                                className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                                placeholder="Añade detalles de la tarea..."
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                maxLength={1000}
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-sm font-bold text-slate-700">
                                    Prioridad
                                </label>
                                <select
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                                    value={priority}
                                    onChange={(event) => setPriority(event.target.value)}
                                >
                                    {priorities.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-slate-700">
                                    Fecha límite
                                </label>
                                <input
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                                    type="date"
                                    value={dueDate}
                                    onChange={(event) => setDueDate(event.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? 'Guardando...'
                                : editingTask
                                    ? 'Actualizar'
                                    : 'Crear tarea'}
                        </button>

                        {editingTask && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-950">
                                Tareas del proyecto
                            </h2>
                            <p className="text-sm text-slate-500">
                                Gestiona el avance del proyecto.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <Search className="h-5 w-5 text-slate-400" />
                            <input
                                className="bg-transparent text-sm outline-none placeholder:text-slate-400"
                                placeholder="Buscar..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {filteredTasks.length === 0 ? (
                            <div className="rounded-3xl bg-slate-50 p-8 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                                    <Clock3 className="h-7 w-7" />
                                </div>
                                <p className="mt-4 font-bold text-slate-700">
                                    No hay tareas todavía.
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Crea la primera tarea desde el formulario.
                                </p>
                            </div>
                        ) : (
                            filteredTasks.map((task) => (
                                <article
                                    key={task.id}
                                    className={[
                                        'rounded-3xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
                                        task.isCompleted
                                            ? 'border-emerald-200 bg-emerald-50/60'
                                            : 'border-slate-200 bg-white',
                                    ].join(' ')}
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div className="min-w-0">
                                            <button
                                                onClick={() => handleToggleCompleted(task)}
                                                className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
                                            >
                                                {task.isCompleted ? (
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                                ) : (
                                                    <Circle className="h-5 w-5" />
                                                )}
                                                {task.isCompleted ? 'Completada' : 'Pendiente'}
                                            </button>

                                            <h3
                                                className={[
                                                    'text-lg font-black',
                                                    task.isCompleted
                                                        ? 'text-slate-500 line-through'
                                                        : 'text-slate-950',
                                                ].join(' ')}
                                            >
                                                {task.title}
                                            </h3>

                                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                                                {task.description || 'Sin descripción'}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold">
                                                <span
                                                    className={[
                                                        'rounded-full px-3 py-1',
                                                        getPriorityStyle(task.priority),
                                                    ].join(' ')}
                                                >
                                                    {task.priority}
                                                </span>

                                                {task.dueDate && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-500">
                                                        <CalendarDays className="h-4 w-4" />
                                                        {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                onClick={() => handleEdit(task)}
                                                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                                                title="Editar"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(task)}
                                                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}