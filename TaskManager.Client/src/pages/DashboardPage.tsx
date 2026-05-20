import { useEffect, useMemo, useState } from 'react'
import {
    CheckCircle2,
    Clock3,
    FolderKanban,
    Layers3,
    Tags,
    ArrowRight,
    Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { projectsApi } from '../api/projectsApi'
import { categoriesApi } from '../api/categoriesApi'
import { tagsApi } from '../api/tagsApi'
import { tasksApi } from '../api/tasksApi'
import type { Project } from '../types/project'
import type { Category } from '../types/category'
import type { Tag } from '../types/tag'
import type { TaskItem } from '../types/task'

export function DashboardPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [tasks, setTasks] = useState<TaskItem[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [tags, setTags] = useState<Tag[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    const completedTasks = useMemo(
        () => tasks.filter((task) => task.isCompleted).length,
        [tasks],
    )

    const pendingTasks = tasks.length - completedTasks

    const completionRate =
        tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100)

    const recentProjects = projects.slice(0, 3)

    const urgentTasks = tasks
        .filter((task) => !task.isCompleted)
        .filter((task) => task.priority.toLowerCase() === 'high')
        .slice(0, 4)

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true)
                setError('')

                const [projectsData, categoriesData, tagsData] = await Promise.all([
                    projectsApi.getAll(),
                    categoriesApi.getAll(),
                    tagsApi.getAll(),
                ])

                const tasksByProject = await Promise.all(
                    projectsData.map((project) => tasksApi.getAllByProject(project.id)),
                )

                setProjects(projectsData)
                setCategories(categoriesData)
                setTags(tagsData)
                setTasks(tasksByProject.flat())
            } catch {
                setError('No se pudieron cargar los datos del panel principal.')
            } finally {
                setLoading(false)
            }
        }

        void loadDashboard()
    }, [])

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-500 shadow-sm">
                Cargando dashboard...
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-8 text-white shadow-xl shadow-blue-900/20">
                <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold ring-1 ring-white/15 backdrop-blur">
                            <Sparkles className="h-4 w-4" />
                            Panel principal
                        </div>

                        <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight">
                            Vista general de tus proyectos y tareas.
                        </h1>

                        <p className="mt-4 max-w-2xl leading-7 text-blue-100">
                            Consulta rápidamente el estado de tu trabajo, tareas pendientes,
                            proyectos activos, categorías y etiquetas creadas.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white/10 px-6 py-5 ring-1 ring-white/15 backdrop-blur">
                        <p className="text-sm text-blue-100">Progreso general</p>
                        <p className="mt-1 text-4xl font-black">{completionRate}%</p>
                    </div>
                </div>
            </section>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
                <StatCard
                    label="Proyectos"
                    value={projects.length}
                    icon={FolderKanban}
                    color="blue"
                />
                <StatCard
                    label="Pendientes"
                    value={pendingTasks}
                    icon={Clock3}
                    color="amber"
                />
                <StatCard
                    label="Completadas"
                    value={completedTasks}
                    icon={CheckCircle2}
                    color="emerald"
                />
                <StatCard
                    label="Categorías"
                    value={categories.length}
                    icon={Layers3}
                    color="indigo"
                />
                <StatCard label="Etiquetas" value={tags.length} icon={Tags} color="pink" />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-black text-slate-950">
                                Proyectos recientes
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Últimos espacios de trabajo creados.
                            </p>
                        </div>

                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500"
                        >
                            Ver todos
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    <div className="mt-6 space-y-4">
                        {recentProjects.length === 0 ? (
                            <EmptyState
                                title="Todavía no hay proyectos."
                                description="Crea tu primer proyecto para empezar a organizar tus tareas."
                            />
                        ) : (
                            recentProjects.map((project) => (
                                <Link
                                    key={project.id}
                                    to={`/projects/${project.id}`}
                                    className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h3 className="font-black text-slate-950">
                                                {project.name}
                                            </h3>
                                            <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                                                {project.description || 'Sin descripción'}
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">
                                            {project.taskCount} tareas
                                        </span>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-black text-slate-950">
                        Tareas importantes
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Tareas pendientes con prioridad alta.
                    </p>

                    <div className="mt-6 space-y-4">
                        {urgentTasks.length === 0 ? (
                            <EmptyState
                                title="No hay tareas urgentes."
                                description="Las tareas con prioridad alta aparecerán aquí."
                            />
                        ) : (
                            urgentTasks.map((task) => (
                                <article
                                    key={task.id}
                                    className="rounded-3xl border border-red-100 bg-red-50/60 p-5"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-black text-slate-950">{task.title}</h3>
                                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                                {task.description || 'Sin descripción'}
                                            </p>
                                        </div>

                                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-600">
                                            High
                                        </span>
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

interface StatCardProps {
    label: string
    value: number
    icon: React.ElementType
    color: 'blue' | 'amber' | 'emerald' | 'indigo' | 'pink'
}

function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
    const styles = {
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        pink: 'bg-pink-50 text-pink-600',
    }

    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-center justify-between">
                <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles[color]}`}
                >
                    <Icon className="h-6 w-6" />
                </div>
            </div>

            <p className="mt-6 text-3xl font-black text-slate-950">{value}</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
        </article>
    )
}

function EmptyState({
    title,
    description,
}: {
    title: string
    description: string
}) {
    return (
        <div className="rounded-3xl bg-slate-50 p-8 text-center">
            <p className="font-bold text-slate-700">{title}</p>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
    )
}