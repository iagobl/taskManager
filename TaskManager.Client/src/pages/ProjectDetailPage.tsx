import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Circle,
    Clock3,
    Edit3,
    Hash,
    Layers3,
    MessageSquare,
    Plus,
    Search,
    Send,
    Tags,
    Trash2,
    X,
} from 'lucide-react'
import { categoriesApi } from '../api/categoriesApi'
import { commentsApi } from '../api/commentsApi'
import { projectsApi } from '../api/projectsApi'
import { tagsApi } from '../api/tagsApi'
import { tasksApi } from '../api/tasksApi'
import type { Category } from '../types/category'
import type { Comment } from '../types/comment'
import type { Project } from '../types/project'
import type { Tag } from '../types/tag'
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
    const [categories, setCategories] = useState<Category[]>([])
    const [tags, setTags] = useState<Tag[]>([])

    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('Medium')
    const [dueDate, setDueDate] = useState('')
    const [categoryId, setCategoryId] = useState<string>('')
    const [showTaskForm, setShowTaskForm] = useState(false)

    const [editingTask, setEditingTask] = useState<TaskItem | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [commentContent, setCommentContent] = useState('')
    const [editingComment, setEditingComment] = useState<Comment | null>(null)
    const [commentsLoading, setCommentsLoading] = useState(false)
    const [commentSaving, setCommentSaving] = useState(false)

    const [selectedTagTask, setSelectedTagTask] = useState<TaskItem | null>(null)
    const [tagSaving, setTagSaving] = useState(false)

    const normalizeTask = (task: TaskItem): TaskItem => ({
        ...task,
        tags: task.tags ?? [],
    })

    const filteredTasks = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        return tasks.filter((task) => {
            const category = categories.find((item) => item.id === task.categoryId)

            const matchesSearch =
                !normalizedSearch ||
                task.title.toLowerCase().includes(normalizedSearch) ||
                task.description?.toLowerCase().includes(normalizedSearch) ||
                task.priority.toLowerCase().includes(normalizedSearch) ||
                category?.name.toLowerCase().includes(normalizedSearch) ||
                (task.tags ?? []).some((tag) =>
                    tag.name.toLowerCase().includes(normalizedSearch),
                )

            const matchesCategory =
                categoryFilter === 'all' ||
                (categoryFilter === 'none' && !task.categoryId) ||
                String(task.categoryId) === categoryFilter

            return matchesSearch && matchesCategory
        })
    }, [tasks, search, categories, categoryFilter])

    const completedTasks = tasks.filter((task) => task.isCompleted).length
    const pendingTasks = tasks.length - completedTasks

    const selectedTagIds = useMemo(() => {
        return new Set((selectedTagTask?.tags ?? []).map((tag) => tag.id))
    }, [selectedTagTask])

    const availableTags = useMemo(() => {
        return tags.filter((tag) => !selectedTagIds.has(tag.id))
    }, [tags, selectedTagIds])

    const getCategoryById = (id?: number | null) => {
        if (!id) {
            return null
        }

        return categories.find((category) => category.id === id) ?? null
    }

    const loadData = async () => {
        try {
            setLoading(true)
            setError('')

            if (Number.isNaN(projectId)) {
                throw new Error('Invalid project id')
            }

            const [projectData, tasksData, categoriesData, tagsData] =
                await Promise.all([
                    projectsApi.getById(projectId),
                    tasksApi.getAllByProject(projectId),
                    categoriesApi.getAll(),
                    tagsApi.getAll(),
                ])

            setProject(projectData)
            setTasks(tasksData.map(normalizeTask))
            setCategories(categoriesData)
            setTags(tagsData)
        } catch {
            setProject(null)
            setError('Could not load the project.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadData()
    }, [projectId])

    const refreshTask = async (taskId: number) => {
        const refreshedTask = normalizeTask(await tasksApi.getById(taskId))

        setTasks((currentTasks) =>
            currentTasks.map((task) =>
                task.id === refreshedTask.id ? refreshedTask : task,
            ),
        )

        setSelectedTagTask((currentTask) =>
            currentTask?.id === refreshedTask.id ? refreshedTask : currentTask,
        )

        setSelectedTask((currentTask) =>
            currentTask?.id === refreshedTask.id ? refreshedTask : currentTask,
        )

        return refreshedTask
    }

    const resetForm = () => {
        setTitle('')
        setDescription('')
        setPriority('Medium')
        setDueDate('')
        setCategoryId('')
        setEditingTask(null)
    }

    const closeTaskForm = () => {
        resetForm()
        setShowTaskForm(false)
    }

    const openNewTaskForm = () => {
        resetForm()
        setShowTaskForm(true)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!title.trim()) {
            setError('The task title is required.')
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
                categoryId: categoryId ? Number(categoryId) : null,
            }

            if (editingTask) {
                const updatedTask = normalizeTask(
                    await tasksApi.update(editingTask.id, payload),
                )

                setTasks((currentTasks) =>
                    currentTasks.map((task) =>
                        task.id === updatedTask.id ? updatedTask : task,
                    ),
                )
            } else {
                const createdTask = normalizeTask(
                    await tasksApi.create(projectId, payload),
                )

                setTasks((currentTasks) => [createdTask, ...currentTasks])
            }

            closeTaskForm()
        } catch {
            setError('Could not save the task.')
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (task: TaskItem) => {
        const normalizedTask = normalizeTask(task)

        setEditingTask(normalizedTask)
        setTitle(normalizedTask.title)
        setDescription(normalizedTask.description ?? '')
        setPriority(normalizedTask.priority)
        setDueDate(normalizedTask.dueDate ? normalizedTask.dueDate.slice(0, 10) : '')
        setCategoryId(
            normalizedTask.categoryId ? String(normalizedTask.categoryId) : '',
        )
        setShowTaskForm(true)
    }

    const handleDelete = async (task: TaskItem) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete the task "${task.title}"?`,
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

            if (selectedTask?.id === task.id) {
                setSelectedTask(null)
                setComments([])
            }

            if (selectedTagTask?.id === task.id) {
                setSelectedTagTask(null)
            }
        } catch {
            setError('Could not delete the task.')
        }
    }

    const handleToggleCompleted = async (task: TaskItem) => {
        try {
            setError('')

            const updatedTask = normalizeTask(
                task.isCompleted
                    ? await tasksApi.reopen(task.id)
                    : await tasksApi.complete(task.id),
            )

            setTasks((currentTasks) =>
                currentTasks.map((item) =>
                    item.id === updatedTask.id ? updatedTask : item,
                ),
            )
        } catch {
            setError('Could not update the task status.')
        }
    }

    const loadComments = async (task: TaskItem) => {
        try {
            setSelectedTask(normalizeTask(task))
            setCommentsLoading(true)
            setError('')

            const data = await commentsApi.getAllByTask(task.id)
            setComments(data)
            setCommentContent('')
            setEditingComment(null)
        } catch {
            setError('Could not load the comments.')
        } finally {
            setCommentsLoading(false)
        }
    }

    const resetCommentForm = () => {
        setCommentContent('')
        setEditingComment(null)
    }

    const handleCommentSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault()

        if (!selectedTask) {
            return
        }

        if (!commentContent.trim()) {
            setError('The comment cannot be empty.')
            return
        }

        try {
            setCommentSaving(true)
            setError('')

            if (editingComment) {
                const updatedComment = await commentsApi.update(editingComment.id, {
                    content: commentContent.trim(),
                })

                setComments((currentComments) =>
                    currentComments.map((comment) =>
                        comment.id === updatedComment.id ? updatedComment : comment,
                    ),
                )
            } else {
                const createdComment = await commentsApi.create(selectedTask.id, {
                    content: commentContent.trim(),
                })

                setComments((currentComments) => [createdComment, ...currentComments])
            }

            resetCommentForm()
        } catch {
            setError('Could not save the comment.')
        } finally {
            setCommentSaving(false)
        }
    }

    const handleEditComment = (comment: Comment) => {
        setEditingComment(comment)
        setCommentContent(comment.content)
    }

    const handleDeleteComment = async (comment: Comment) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this comment?',
        )

        if (!confirmed) {
            return
        }

        try {
            setError('')
            await commentsApi.remove(comment.id)

            setComments((currentComments) =>
                currentComments.filter((item) => item.id !== comment.id),
            )
        } catch {
            setError('Could not delete the comment.')
        }
    }

    const openTagPanel = async (task: TaskItem) => {
        try {
            setError('')
            setTagSaving(true)

            const refreshedTask = await refreshTask(task.id)
            setSelectedTagTask(refreshedTask)
        } catch {
            setError('Could not load the task tags.')
        } finally {
            setTagSaving(false)
        }
    }

    const closeTagPanel = () => {
        setSelectedTagTask(null)
    }

    const handleAddTagToTask = async (tag: Tag) => {
        if (!selectedTagTask) {
            return
        }

        const alreadyAssigned = (selectedTagTask.tags ?? []).some(
            (currentTag) => currentTag.id === tag.id,
        )

        if (alreadyAssigned) {
            setError('')
            await refreshTask(selectedTagTask.id)
            return
        }

        try {
            setTagSaving(true)
            setError('')

            await tagsApi.addToTask(selectedTagTask.id, tag.id)
            await refreshTask(selectedTagTask.id)
        } catch {
            await refreshTask(selectedTagTask.id)
            setError('The tag was already assigned or the task could not be updated.')
        } finally {
            setTagSaving(false)
        }
    }

    const handleRemoveTagFromTask = async (tag: Tag) => {
        if (!selectedTagTask) {
            return
        }

        try {
            setTagSaving(true)
            setError('')

            await tagsApi.removeFromTask(selectedTagTask.id, tag.id)
            await refreshTask(selectedTagTask.id)
        } catch {
            await refreshTask(selectedTagTask.id)
            setError('Could not remove the tag from the task.')
        } finally {
            setTagSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-500 shadow-sm">
                Loading project...
            </div>
        )
    }

    if (!project) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center font-semibold text-red-700">
                {error || 'Project not found.'}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-6 text-white shadow-xl shadow-blue-900/20">
                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
                    <div>
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-blue-50 ring-1 ring-white/15 transition hover:bg-white/15"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to projects
                        </Link>

                        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
                            Project details
                        </p>
                        <h1 className="mt-3 text-3xl font-black tracking-tight">
                            {project.name}
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                            {project.description || 'Project without description.'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
                        <div className="rounded-2xl bg-white/10 px-4 py-3 text-center ring-1 ring-white/15 backdrop-blur">
                            <p className="text-xl font-black">{tasks.length}</p>
                            <p className="text-[11px] text-blue-100">Total</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 px-4 py-3 text-center ring-1 ring-white/15 backdrop-blur">
                            <p className="text-xl font-black">{pendingTasks}</p>
                            <p className="text-[11px] text-blue-100">Pending</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 px-4 py-3 text-center ring-1 ring-white/15 backdrop-blur">
                            <p className="text-xl font-black">{completedTasks}</p>
                            <p className="text-[11px] text-blue-100">Done</p>
                        </div>
                        <button
                            type="button"
                            onClick={openNewTaskForm}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-blue-700 shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-blue-50"
                        >
                            <Plus className="h-4 w-4" />
                            New task
                        </button>
                    </div>
                </div>
            </section>

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            {showTaskForm && (
                <section className="rounded-3xl border border-blue-100 bg-white p-5 shadow-sm">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <Plus className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-950">
                                        {editingTask ? 'Edit task' : 'Create a new task'}
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Define the task, priority, category, and due date.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeTaskForm}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                                title="Close form"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-5 grid gap-4 lg:grid-cols-2">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Title
                                </label>
                                <input
                                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                                    placeholder="E.g. Prepare documentation"
                                    value={title}
                                    onChange={(event) => setTitle(event.target.value)}
                                    maxLength={160}
                                    required
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Priority
                                    </label>
                                    <select
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
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
                                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Due date
                                    </label>
                                    <input
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                                        type="date"
                                        value={dueDate}
                                        onChange={(event) => setDueDate(event.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                        Category
                                    </label>
                                    <select
                                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                                        value={categoryId}
                                        onChange={(event) => setCategoryId(event.target.value)}
                                    >
                                        <option value="">No category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="lg:col-span-2">
                                <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Description
                                </label>
                                <textarea
                                    className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                                    placeholder="Add task details..."
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    maxLength={1000}
                                />
                            </div>
                        </div>

                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeTaskForm}
                                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? 'Saving...'
                                    : editingTask
                                        ? 'Update task'
                                        : 'Create task'}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-black text-slate-950">
                                Project tasks
                            </h2>
                            <p className="text-sm text-slate-500">
                                Manage the project progress from the task list.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 md:flex-row md:items-center">
                            <select
                                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                                value={categoryFilter}
                                onChange={(event) => setCategoryFilter(event.target.value)}
                            >
                                <option value="all">All categories</option>
                                <option value="none">No category</option>

                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>

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
                    </div>

                    <div className="mt-5 max-h-[720px] space-y-4 overflow-y-auto pr-1">
                        {filteredTasks.length === 0 ? (
                            <div className="rounded-3xl bg-slate-50 p-8 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                                    <Clock3 className="h-7 w-7" />
                                </div>
                                <p className="mt-4 font-bold text-slate-700">
                                    There are no tasks for this filter.
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Change the selected category or create a new task.
                                </p>
                            </div>
                        ) : (
                            filteredTasks.map((task) => {
                                const normalizedTask = normalizeTask(task)
                                const category = getCategoryById(normalizedTask.categoryId)

                                return (
                                    <article
                                        key={normalizedTask.id}
                                        className={[
                                            'rounded-3xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
                                            normalizedTask.isCompleted
                                                ? 'border-emerald-200 bg-emerald-50/60'
                                                : 'border-slate-200 bg-white',
                                        ].join(' ')}
                                    >
                                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                            <div className="min-w-0 flex-1">
                                                <button
                                                    onClick={() => handleToggleCompleted(normalizedTask)}
                                                    className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-slate-600 transition hover:text-blue-600"
                                                >
                                                    {normalizedTask.isCompleted ? (
                                                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                                    ) : (
                                                        <Circle className="h-5 w-5" />
                                                    )}
                                                    {normalizedTask.isCompleted ? 'Completed' : 'Pending'}
                                                </button>

                                                <h3
                                                    className={[
                                                        'text-lg font-black',
                                                        normalizedTask.isCompleted
                                                            ? 'text-slate-500 line-through'
                                                            : 'text-slate-950',
                                                    ].join(' ')}
                                                >
                                                    {normalizedTask.title}
                                                </h3>

                                                <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">
                                                    {normalizedTask.description || 'No description'}
                                                </p>

                                                <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold">
                                                    <span
                                                        className={[
                                                            'rounded-full px-3 py-1',
                                                            getPriorityStyle(normalizedTask.priority),
                                                        ].join(' ')}
                                                    >
                                                        {normalizedTask.priority}
                                                    </span>

                                                    {category && (
                                                        <span
                                                            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-white"
                                                            style={{
                                                                backgroundColor: category.color ?? '#2563EB',
                                                            }}
                                                        >
                                                            <Layers3 className="h-4 w-4" />
                                                            {category.name}
                                                        </span>
                                                    )}

                                                    {(normalizedTask.tags ?? []).map((tag) => (
                                                        <span
                                                            key={tag.id}
                                                            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-white"
                                                            style={{
                                                                backgroundColor: tag.color ?? '#2563EB',
                                                            }}
                                                        >
                                                            <Hash className="h-4 w-4" />
                                                            {tag.name}
                                                        </span>
                                                    ))}

                                                    {normalizedTask.dueDate && (
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-slate-500">
                                                            <CalendarDays className="h-4 w-4" />
                                                            {new Date(normalizedTask.dueDate).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 gap-2">
                                                <button
                                                    onClick={() => void openTagPanel(normalizedTask)}
                                                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-pink-50 hover:text-pink-600"
                                                    title="Manage tags"
                                                >
                                                    <Tags className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => void loadComments(normalizedTask)}
                                                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600"
                                                    title="Comments"
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => handleEdit(normalizedTask)}
                                                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                                                    title="Edit task"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>

                                                <button
                                                    onClick={() => void handleDelete(normalizedTask)}
                                                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                                                    title="Delete task"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                )
                            })
                        )}
                    </div>
                </div>

                <aside className="space-y-5">
                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
                                    <Tags className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-950">
                                        Task tags
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        {selectedTagTask
                                            ? `Selected task: ${selectedTagTask.title}`
                                            : 'Select a task tag icon to manage tags.'}
                                    </p>
                                </div>
                            </div>

                            {selectedTagTask && (
                                <button
                                    onClick={closeTagPanel}
                                    className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Close
                                </button>
                            )}
                        </div>

                        {!selectedTagTask ? (
                            <div className="mt-5 rounded-3xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
                                Tags for the selected task will appear here.
                            </div>
                        ) : (
                            <div className="mt-5 space-y-4">
                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <h3 className="font-black text-slate-950">Assigned</h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Click a tag to remove it.
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {(selectedTagTask.tags ?? []).length === 0 ? (
                                            <p className="text-sm font-semibold text-slate-500">
                                                This task has no tags yet.
                                            </p>
                                        ) : (
                                            (selectedTagTask.tags ?? []).map((tag) => (
                                                <button
                                                    key={tag.id}
                                                    onClick={() => void handleRemoveTagFromTask(tag)}
                                                    disabled={tagSaving}
                                                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                                                    style={{
                                                        backgroundColor: tag.color ?? '#2563EB',
                                                    }}
                                                    title="Remove tag"
                                                >
                                                    <Hash className="h-4 w-4" />
                                                    {tag.name}
                                                    <span className="text-white/70">×</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="rounded-3xl bg-slate-50 p-4">
                                    <h3 className="font-black text-slate-950">Available</h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Click a tag to add it.
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {tags.length === 0 ? (
                                            <p className="text-sm font-semibold text-slate-500">
                                                You do not have any tags created yet.
                                            </p>
                                        ) : availableTags.length === 0 ? (
                                            <p className="text-sm font-semibold text-slate-500">
                                                All tags are already assigned to this task.
                                            </p>
                                        ) : (
                                            availableTags.map((tag) => (
                                                <button
                                                    key={tag.id}
                                                    onClick={() => void handleAddTagToTask(tag)}
                                                    disabled={tagSaving}
                                                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                                                    style={{
                                                        backgroundColor: tag.color ?? '#2563EB',
                                                    }}
                                                    title="Add tag"
                                                >
                                                    <Hash className="h-4 w-4" />
                                                    {tag.name}
                                                    <span className="text-white/70">+</span>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black text-slate-950">
                                        Comments
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        {selectedTask
                                            ? `Selected task: ${selectedTask.title}`
                                            : 'Select a task comment icon to read or add comments.'}
                                    </p>
                                </div>
                            </div>

                            {selectedTask && (
                                <button
                                    onClick={() => {
                                        setSelectedTask(null)
                                        setComments([])
                                        resetCommentForm()
                                    }}
                                    className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Close
                                </button>
                            )}
                        </div>

                        {!selectedTask ? (
                            <div className="mt-5 rounded-3xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
                                Comments for the selected task will appear here.
                            </div>
                        ) : (
                            <>
                                <form onSubmit={handleCommentSubmit} className="mt-5">
                                    <label className="text-xs font-bold uppercase tracking-wide text-slate-500">
                                        {editingComment ? 'Edit comment' : 'New comment'}
                                    </label>

                                    <textarea
                                        className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10"
                                        placeholder="Write a note about this task..."
                                        value={commentContent}
                                        onChange={(event) => setCommentContent(event.target.value)}
                                        maxLength={1000}
                                        required
                                    />

                                    <div className="mt-3 flex flex-wrap gap-3">
                                        <button
                                            type="submit"
                                            disabled={commentSaving}
                                            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {commentSaving
                                                ? 'Saving...'
                                                : editingComment
                                                    ? 'Update comment'
                                                    : 'Add comment'}
                                            <Send className="h-4 w-4" />
                                        </button>

                                        {editingComment && (
                                            <button
                                                type="button"
                                                onClick={resetCommentForm}
                                                className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>

                                <div className="mt-5 max-h-[360px] space-y-3 overflow-y-auto pr-1">
                                    {commentsLoading ? (
                                        <div className="rounded-3xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
                                            Loading comments...
                                        </div>
                                    ) : comments.length === 0 ? (
                                        <div className="rounded-3xl bg-slate-50 p-6 text-center">
                                            <p className="font-bold text-slate-700">
                                                This task does not have any comments yet.
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Add the first one from the form.
                                            </p>
                                        </div>
                                    ) : (
                                        comments.map((comment) => (
                                            <article
                                                key={comment.id}
                                                className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                                            >
                                                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                                    <div>
                                                        <p className="text-sm leading-6 text-slate-700">
                                                            {comment.content}
                                                        </p>

                                                        <p className="mt-3 text-xs font-bold text-slate-400">
                                                            {new Date(comment.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>

                                                    <div className="flex shrink-0 gap-2">
                                                        <button
                                                            onClick={() => handleEditComment(comment)}
                                                            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                                                            title="Edit comment"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => void handleDeleteComment(comment)}
                                                            className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                                                            title="Delete comment"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </article>
                                        ))
                                    )}
                                </div>
                            </>
                        )}
                    </section>
                </aside>
            </section>
        </div>
    )
}
