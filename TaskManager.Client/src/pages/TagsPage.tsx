import { useEffect, useMemo, useState } from 'react'
import { Edit3, Hash, Palette, Plus, Search, Tags, Trash2 } from 'lucide-react'
import { tagsApi } from '../api/tagsApi'
import type { Tag } from '../types/tag'

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

export function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([])
    const [search, setSearch] = useState('')
    const [name, setName] = useState('')
    const [color, setColor] = useState(defaultColors[0])
    const [editingTag, setEditingTag] = useState<Tag | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const filteredTags = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase()

        if (!normalizedSearch) {
            return tags
        }

        return tags.filter((tag) =>
            tag.name.toLowerCase().includes(normalizedSearch),
        )
    }, [tags, search])

    const loadTags = async () => {
        try {
            setLoading(true)
            setError('')
            const data = await tagsApi.getAll()
            setTags(data)
        } catch {
            setError('No se pudieron cargar las etiquetas.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadTags()
    }, [])

    const resetForm = () => {
        setName('')
        setColor(defaultColors[0])
        setEditingTag(null)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!name.trim()) {
            setError('El nombre de la etiqueta es obligatorio.')
            return
        }

        try {
            setSaving(true)
            setError('')

            if (editingTag) {
                const updatedTag = await tagsApi.update(editingTag.id, {
                    name: name.trim(),
                    color,
                })

                setTags((currentTags) =>
                    currentTags.map((tag) =>
                        tag.id === updatedTag.id ? updatedTag : tag,
                    ),
                )
            } else {
                const createdTag = await tagsApi.create({
                    name: name.trim(),
                    color,
                })

                setTags((currentTags) => [createdTag, ...currentTags])
            }

            resetForm()
        } catch {
            setError('No se pudo guardar la etiqueta.')
        } finally {
            setSaving(false)
        }
    }

    const handleEdit = (tag: Tag) => {
        setEditingTag(tag)
        setName(tag.name)
        setColor(tag.color ?? defaultColors[0])
    }

    const handleDelete = async (tag: Tag) => {
        const confirmed = window.confirm(
            `¿Seguro que quieres eliminar la etiqueta "${tag.name}"?`,
        )

        if (!confirmed) {
            return
        }

        try {
            setError('')
            await tagsApi.remove(tag.id)

            setTags((currentTags) =>
                currentTags.filter((item) => item.id !== tag.id),
            )
        } catch {
            setError('No se pudo eliminar la etiqueta.')
        }
    }

    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-5 rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-8 text-white shadow-xl shadow-blue-900/20 lg:flex-row lg:items-end">
                <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                        Etiquetas
                    </p>
                    <h1 className="mt-4 text-4xl font-black tracking-tight">
                        Marca tus tareas con etiquetas visuales.
                    </h1>
                    <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                        Crea etiquetas para identificar tareas importantes, urgentes,
                        pendientes de revisión o relacionadas con una parte concreta del
                        proyecto.
                    </p>
                </div>

                <div className="rounded-3xl bg-white/10 px-6 py-5 ring-1 ring-white/15 backdrop-blur">
                    <p className="text-3xl font-black">{tags.length}</p>
                    <p className="text-sm text-blue-100">Etiquetas creadas</p>
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
                                {editingTag ? 'Editar etiqueta' : 'Nueva etiqueta'}
                            </h2>
                            <p className="text-sm text-slate-500">
                                Define nombre y color de identificación.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-5">
                        <div>
                            <label className="text-sm font-bold text-slate-700">
                                Nombre
                            </label>
                            <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10">
                                <Hash className="h-5 w-5 text-slate-400" />
                                <input
                                    className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                                    placeholder="Ej. Importante"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                    maxLength={80}
                                    required
                                />
                            </div>
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
                                ? 'Guardando...'
                                : editingTag
                                    ? 'Actualizar'
                                    : 'Crear etiqueta'}
                        </button>

                        {editingTag && (
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
                                Tus etiquetas
                            </h2>
                            <p className="text-sm text-slate-500">
                                Gestiona las etiquetas que podrás asociar a tus tareas.
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

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {loading ? (
                            <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500 md:col-span-2">
                                Cargando etiquetas...
                            </div>
                        ) : filteredTags.length === 0 ? (
                            <div className="rounded-3xl bg-slate-50 p-8 text-center md:col-span-2">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                                    <Tags className="h-7 w-7" />
                                </div>
                                <p className="mt-4 font-bold text-slate-700">
                                    No hay etiquetas todavía.
                                </p>
                                <p className="mt-1 text-sm text-slate-500">
                                    Crea la primera desde el formulario.
                                </p>
                            </div>
                        ) : (
                            filteredTags.map((tag) => (
                                <article
                                    key={tag.id}
                                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <span
                                                className="inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white shadow-sm"
                                                style={{
                                                    backgroundColor: tag.color ?? '#2563EB',
                                                }}
                                            >
                                                <Hash className="h-4 w-4 shrink-0" />
                                                <span className="truncate">{tag.name}</span>
                                            </span>

                                            <p className="mt-3 text-sm font-semibold text-slate-500">
                                                {tag.color ?? 'Sin color'}
                                            </p>
                                        </div>

                                        <div className="flex shrink-0 gap-2">
                                            <button
                                                onClick={() => handleEdit(tag)}
                                                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                                                title="Editar"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(tag)}
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