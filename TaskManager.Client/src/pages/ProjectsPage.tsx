import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    CalendarDays,
    Edit3,
    FolderKanban,
    Plus,
    Search,
    Trash2,
} from 'lucide-react'
import { projectsApi } from '../api/projectsApi'
import type { Project } from '../types/project'

export function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([])
    const [search, setSearch] = useState('')
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const filteredProjects = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        if (!normalizedSearch) {
            return projects
        }

        return projects.filter((project) => {
            return (
                project.name.toLowerCase().includes(normalizedSearch) ||
                project.description?.toLowerCase().includes(normalizedSearch)
            )
        })
    }, [projects, search])

    const loadProjects = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await projectsApi.getAll()
            setProjects(data)
        } catch {
            setError('Could not load the projects.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadProjects()
    }, [])

    const resetForm = () => {
        setName('')
        setDescription('')
        setEditingProject(null)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!name.trim()) {
            setError('The project name is required.')
            return
        }

        try {
            setSaving(true)
            setError('')

            if (editingProject) {
                const updatedProject = await projectsApi.update(editingProject.id, {
                    name: name.trim(),
                    description: description.trim(),
                })

                setProjects((currentProjects) =>
                    currentProjects.map((project) =>
                        project.id === updatedProject.id ? updatedProject : project,
                    ),
                )
            } else {
                const createdProject = await projectsApi.create({
                    name: name.trim(),
                    description: description.trim(),
                })

                setProjects((currentProjects) => [createdProject, ...currentProjects])
            }

            resetForm()
        } catch {
            setError('Could not save the project.')
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (project: Project) => {
        setEditingProject(project)
        setName(project.name)
        setDescription(project.description ?? '')
    }

    const handleDelete = async (project: Project) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete the project "${project.name}"?`,
        )

        if (!confirmed) {
            return
        }

        try {
            setError('')
            await projectsApi.remove(project.id)

            setProjects((currentProjects) =>
                currentProjects.filter((item) => item.id !== project.id),
            )
        } catch {
            setError('Could not delete the project.')
        }
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-5 rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-8 text-white shadow-xl shadow-blue-900/20 lg:flex-row lg:items-end">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                        Project management
                    </p>
                    <h1 className="mt-4 text-4xl font-black tracking-tight">
                        Organize your work by projects.
                    </h1>
                    <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                        Create workspaces, group tasks, and track the progress of each
                        project from a clear and protected view.
                    </p>
                </div>

                <div className="rounded-3xl bg-white/10 px-6 py-5 ring-1 ring-white/15 backdrop-blur">
                    <p className="text-3xl font-black">{projects.length}</p>
                    <p className="text-sm text-blue-100">Projects creados</p>
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
                                {editingProject ? 'Edit project' : 'Nuevo project'}
                            </h2>
                            <p className="text-sm text-slate-500">
                                Define name and description.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-5">
                        <div>
                            <label className="text-sm font-bold text-slate-700">
                                Name
                            </label>
                            <input
                                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                                placeholder="E.g. Backend practice"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                maxLength={120}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700">
                                Description
                            </label>
                            <textarea
                                className="mt-2 min-h-32 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                                placeholder="Describe the project objective..."
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                maxLength={500}
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving
                                ? 'Saving...'
                                : editingProject
                                    ? 'Update'
                                    : 'Create project'}
                        </button>

                        {editingProject && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-950">
                                Tus projects
                            </h2>
                            <p className="text-sm text-slate-500">
                                View, edit, or delete your projects.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                            <Search className="h-5 w-5 text-slate-400" />
                            <input
                                className="bg-transparent text-sm outline-none placeholder:text-slate-400"
                                placeholder="Search..."
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-6 space-y-4">
                        {loading ? (
                            <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
                                Loading projects...
                            </div>
                        ) : filteredProjects.length === 0 ? (
                            <div className="rounded-3xl bg-slate-50 p-8 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                                    <FolderKanban className="h-7 w-7" />
                                </div>
                                <p className="mt-4 font-bold text-slate-700">
                                    There are no projects yet.
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Create the first one from the form.
                                </p>
                            </div>
                        ) : (
                            filteredProjects.map((project) => (
                                <article
                                    key={project.id}
                                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <Link to={`/projects/${project.id}`} className="min-w-0">
                                            <h3 className="text-lg font-black text-slate-950 transition hover:text-blue-600">
                                                {project.name}
                                            </h3>
                                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                                                {project.description || 'No description'}
                                            </p>

                                            <div className="mt-4 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                                                    <CalendarDays className="h-4 w-4" />
                                                    {new Date(project.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-600">
                                                    {project.taskCount} tasks
                                                </span>
                                            </div>
                                        </Link>

                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                onClick={() => handleEdit(project)}
                                                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                                                title="Edit"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(project)}
                                                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                                                title="Delete"
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