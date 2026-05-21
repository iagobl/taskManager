import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
    CheckCircle2,
    Clock3,
    FolderKanban,
    Layers3,
    Tags,
    ArrowRight,
    Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projectsApi } from '../api/projectsApi'
import { categoriesApi } from '../api/categoriesApi'
import { tagsApi } from '../api/tagsApi'
import { tasksApi } from '../api/tasksApi'
import { HolidaysWidget } from '../components/holidays/HolidaysWidget'
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

    const recentProjects = projects.slice(0, 4)

    const urgentTasks = tasks
        .filter((task) => !task.isCompleted)
        .filter((task) => task.priority.toLowerCase() === 'high')
        .slice(0, 5)

    const dashboardStats: DashboardStat[] = [
        {
            label: 'Projects',
            value: projects.length,
            icon: FolderKanban,
        },
        {
            label: 'Pending',
            value: pendingTasks,
            icon: Clock3,
        },
        {
            label: 'Completed',
            value: completedTasks,
            icon: CheckCircle2,
        },
        {
            label: 'Categories',
            value: categories.length,
            icon: Layers3,
        },
        {
            label: 'Tags',
            value: tags.length,
            icon: Tags,
        },
    ]

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
                setError('Could not load the dashboard data.')
            } finally {
                setLoading(false)
            }
        }

        void loadDashboard()
    }, [])

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-500 shadow-sm">
                Loading dashboard...
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-5 text-white shadow-xl shadow-blue-900/20">
                <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold ring-1 ring-white/15 backdrop-blur">
                            <Sparkles className="h-4 w-4" />
                            Dashboard
                        </div>

                        <h1 className="mt-3 max-w-3xl text-2xl font-black tracking-tight xl:text-3xl">
                            Overview of your projects and tasks.
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                            Quickly check the status of your work, pending tasks,
                            active projects, created categories, and tags.
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center justify-start gap-3 xl:justify-end">
                        {dashboardStats.map((stat) => (
                            <HeroStat key={stat.label} {...stat} />
                        ))}

                        <div className="ml-0 rounded-3xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur xl:ml-2">
                            <p className="text-xs font-semibold text-blue-100">
                                Overall progress
                            </p>
                            <p className="mt-0.5 text-2xl font-black">
                                {completionRate}%
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            <section className="grid items-start gap-4 xl:grid-cols-3">
                <HolidaysWidget />

                <DashboardPanel
                    title="Recent projects"
                    subtitle="Latest created workspaces."
                    action={
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-blue-500"
                        >
                            View all
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    }
                >
                    {recentProjects.length === 0 ? (
                        <EmptyState
                            title="There are no projects yet."
                            description="Create your first project to start organizing your tasks."
                        />
                    ) : (
                        recentProjects.map((project) => (
                            <Link
                                key={project.id}
                                to={`/projects/${project.id}`}
                                className="block rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="truncate text-sm font-black text-slate-950">
                                            {project.name}
                                        </h3>

                                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                                            {project.description || 'No description'}
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-black text-blue-600">
                                        {project.taskCount} tasks
                                    </span>
                                </div>
                            </Link>
                        ))
                    )}
                </DashboardPanel>

                <DashboardPanel
                    title="Important tasks"
                    subtitle="Pending high-priority tasks."
                >
                    {urgentTasks.length === 0 ? (
                        <EmptyState
                            title="There are no urgent tasks."
                            description="High-priority tasks will appear here."
                        />
                    ) : (
                        urgentTasks.map((task) => (
                            <article
                                key={task.id}
                                className="rounded-2xl border border-red-100 bg-red-50/60 px-3.5 py-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="line-clamp-1 text-sm font-black text-slate-950">
                                            {task.title}
                                        </h3>

                                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                            {task.description || 'No description'}
                                        </p>
                                    </div>

                                    <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-black text-red-600">
                                        High
                                    </span>
                                </div>
                            </article>
                        ))
                    )}
                </DashboardPanel>
            </section>
        </div>
    )
}

interface DashboardStat {
    label: string
    value: number
    icon: LucideIcon
}

function HeroStat({ label, value, icon: Icon }: DashboardStat) {
    return (
        <div className="inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2 ring-1 ring-white/15 backdrop-blur">
            <Icon className="h-4 w-4 text-blue-100" />
            <div className="leading-none">
                <p className="text-base font-black text-white">{value}</p>
                <p className="mt-1 text-[11px] font-semibold text-blue-100">{label}</p>
            </div>
        </div>
    )
}

function DashboardPanel({
    title,
    subtitle,
    action,
    children,
}: {
    title: string
    subtitle: string
    action?: ReactNode
    children: ReactNode
}) {
    return (
        <div className="h-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-base font-black text-slate-950">{title}</h2>
                    <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
                </div>

                {action}
            </div>

            <div className="mt-4 space-y-2.5">{children}</div>
        </div>
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
        <div className="rounded-2xl bg-slate-50 p-5 text-center">
            <p className="text-sm font-bold text-slate-700">{title}</p>
            <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
    )
}
