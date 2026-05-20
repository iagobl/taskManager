import { useEffect, useState } from 'react'
import {
    CalendarDays,
    Mail,
    ShieldCheck,
    UserRound,
} from 'lucide-react'
import { authApi } from '../api/authApi'
import { useAuth } from '../auth/AuthContext'
import type { CurrentUser } from '../types/auth'

export function ProfilePage() {
    const { logout } = useAuth()

    const [profile, setProfile] = useState<CurrentUser | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true)
                setError('')

                const data = await authApi.getCurrentUser()
                setProfile(data)
            } catch {
                setError('No se pudo cargar la información del perfil.')
            } finally {
                setLoading(false)
            }
        }

        void loadProfile()
    }, [])

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-500 shadow-sm">
                Cargando perfil...
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center font-semibold text-red-700">
                {error || 'Perfil no encontrado.'}
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-8 text-white shadow-xl shadow-blue-900/20">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                            Perfil de usuario
                        </p>

                        <h1 className="mt-4 text-4xl font-black tracking-tight">
                            {profile.fullName}
                        </h1>

                        <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                            Información de la cuenta autenticada actualmente en TaskManager.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white/10 px-6 py-5 ring-1 ring-white/15 backdrop-blur">
                        <p className="text-sm text-blue-100">Usuario ID</p>
                        <p className="mt-1 text-3xl font-black">#{profile.id}</p>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col items-center text-center">
                        <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-blue-600 text-white shadow-lg shadow-blue-600/25">
                            <UserRound className="h-12 w-12" />
                        </div>

                        <h2 className="mt-5 text-2xl font-black text-slate-950">
                            {profile.fullName}
                        </h2>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                            {profile.email}
                        </p>

                        <button
                            onClick={logout}
                            className="mt-8 w-full rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-black text-slate-950">
                        Información de la cuenta
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Estos datos se obtienen directamente desde el endpoint protegido del
                        backend.
                    </p>

                    <div className="mt-6 grid gap-4">
                        <article className="flex items-center gap-4 rounded-3xl bg-slate-50 p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <UserRound className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-500">
                                    Nombre completo
                                </p>
                                <p className="mt-1 font-black text-slate-950">
                                    {profile.fullName}
                                </p>
                            </div>
                        </article>

                        <article className="flex items-center gap-4 rounded-3xl bg-slate-50 p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                <Mail className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-500">Email</p>
                                <p className="mt-1 font-black text-slate-950">
                                    {profile.email}
                                </p>
                            </div>
                        </article>

                        <article className="flex items-center gap-4 rounded-3xl bg-slate-50 p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <CalendarDays className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-500">
                                    Fecha de creación
                                </p>
                                <p className="mt-1 font-black text-slate-950">
                                    {new Date(profile.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </article>

                        <article className="flex items-center gap-4 rounded-3xl bg-slate-50 p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-600">
                                <ShieldCheck className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-500">
                                    Estado de autenticación
                                </p>
                                <p className="mt-1 font-black text-slate-950">
                                    Sesión protegida con JWT
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </div>
    )
}