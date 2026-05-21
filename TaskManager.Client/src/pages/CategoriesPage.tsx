import { useEffect, useMemo, useState } from 'react'
import {
    Edit3,
    Layers3,
    Palette,
    Plus,
    Search,
    Trash2,
} from 'lucide-react'
import { categoriesApi } from '../api/categoriesApi'
import type { Category } from '../types/category'

const defaultColors = [
    '#2563EB',
    '#7C3AED',
    '#DB2777',
    '#DC2626',
    '#EA580C',
    '#16A34A',
    '#0891B2',
    '#475569',
]

export function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [search, setSearch] = useState('')
    const [name, setName] = useState('')
    const [color, setColor] = useState(defaultColors[0])
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const filteredCategories = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        if (!normalizedSearch) {
            return categories
        }

        return categories.filter((category) =>
            category.name.toLowerCase().includes(normalizedSearch),
        )
    }, [categories, search])

    const loadCategories = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await categoriesApi.getAll()
            setCategories(data)
        } catch {
            setError('Could not load the categories.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadCategories()
    }, [])

    const resetForm = () => {
        setName('')
        setColor(defaultColors[0])
        setEditingCategory(null)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!name.trim()) {
            setError('The category name is required.')
            return
        }

        try {
            setSaving(true)
            setError('')

            if (editingCategory) {
                const updatedCategory = await categoriesApi.update(editingCategory.id, {
                    name: name.trim(),
                    color,
                })

                setCategories((currentCategories) =>
                    currentCategories.map((category) =>
                        category.id === updatedCategory.id ? updatedCategory : category,
                    ),
                )
            } else {
                const createdCategory = await categoriesApi.create({
                    name: name.trim(),
                    color,
                })

                setCategories((currentCategories) => [
                    createdCategory,
                    ...currentCategories,
                ])
            }

            resetForm()
        } catch {
            setError('Could not save the category.')
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        setName(category.name)
        setColor(category.color ?? defaultColors[0])
    }

    const handleDelete = async (category: Category) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete the category "${category.name}"?`,
        )

        if (!confirmed) {
            return
        }

        try {
            setError('')
            await categoriesApi.remove(category.id)

            setCategories((currentCategories) =>
                currentCategories.filter((item) => item.id !== category.id),
            )
        } catch {
            setError('Could not delete the category.')
        }
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-5 rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-8 text-white shadow-xl shadow-blue-900/20 lg:flex-row lg:items-end">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                        Categories
                    </p>
                    <h1 className="mt-4 text-4xl font-black tracking-tight">
                        Classify your tasks by context.
                    </h1>
                    <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                        Create visual categories to separate university tasks,
                        work, personal projects, or any activity area.
                    </p>
                </div>

                <div className="rounded-3xl bg-white/10 px-6 py-5 ring-1 ring-white/15 backdrop-blur">
                    <p className="text-3xl font-black">{categories.length}</p>
                    <p className="text-sm text-blue-100">Created categories</p>
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
                                {editingCategory ? 'Edit category' : 'New category'}
                            </h2>
                            <p className="text-sm text-slate-500">
                                Define a name and identifying color.
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
                                placeholder="E.g. University"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                maxLength={80}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-bold text-slate-700">
                                Color
                            </label>

                            <div className="mt-3 grid grid-cols-8 gap-2">
                                {defaultColors.map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setColor(item)}
                                        className={[
                                            'h-10 rounded-2xl border-2 transition hover:scale-105',
                                            color === item
                                                ? 'border-slate-950'
                                                : 'border-transparent',
                                        ].join(' ')}
                                        style={{ backgroundColor: item }}
                                        title={item}
                                    />
                                ))}
                            </div>

                            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                                <Palette className="h-5 w-5 text-slate-400" />
                                <input
                                    className="h-8 w-12 cursor-pointer border-0 bg-transparent p-0"
                                    type="color"
                                    value={color}
                                    onChange={(event) => setColor(event.target.value)}
                                />
                                <span className="text-sm font-semibold text-slate-500">
                                    {color}
                                </span>
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
                                ? 'Saving...'
                                : editingCategory
                                    ? 'Update'
                                    : 'Create category'}
                        </button>

                        {editingCategory && (
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
                                Your categories
                            </h2>
                            <p className="text-sm text-slate-500">
                                Manage the categories available for your tasks.
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

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {loading ? (
                            <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500 md:col-span-2">
                                Loading categories...
                            </div>
                        ) : filteredCategories.length === 0 ? (
                            <div className="rounded-3xl bg-slate-50 p-8 text-center md:col-span-2">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                                    <Layers3 className="h-7 w-7" />
                                </div>
                                <p className="mt-4 font-bold text-slate-700">
                                    There are no categories yet.
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Create the first one from the form.
                                </p>
                            </div>
                        ) : (
                            filteredCategories.map((category) => (
                                <article
                                    key={category.id}
                                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div
                                                className="h-12 w-12 rounded-2xl shadow-sm"
                                                style={{
                                                    backgroundColor: category.color ?? '#2563EB',
                                                }}
                                            />

                                            <div className="min-w-0">
                                                <h3 className="truncate text-lg font-black text-slate-950">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm font-semibold text-slate-500">
                                                    {category.color ?? 'No color'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                onClick={() => handleEdit(category)}
                                                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                                                title="Edit"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(category)}
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