import { useEffect, useMemo, useState } from 'react'
import {
    CalendarDays,
    LogOut,
    Mail,
    ShieldCheck,
    Sparkles,
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
                setError('Could not load the profile information.')
            } finally {
                setLoading(false)
            }
        }

        void loadProfile()
    }, [])

    const initials = useMemo(() => {
        if (!profile?.fullName) return 'U'

        const parts = profile.fullName.trim().split(/\s+/)
        const first = parts[0]?.[0] ?? ''
        const second = parts.length > 1 ? parts[1]?.[0] ?? '' : ''

        return `${first}${second}`.toUpperCase()
    }, [profile?.fullName])

    if (loading) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center font-semibold text-slate-500 shadow-sm">
                Loading profile...
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center font-semibold text-red-700">
                {error || 'Profile not found.'}
            </div>
        )
    }

    return (
        <div className="space-y-7">
            <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-8 text-white shadow-xl shadow-blue-900/20">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                            User profile
                        </p>

                        <h1 className="mt-4 text-4xl font-black tracking-tight">
                            {profile.fullName}
                        </h1>

                        <p className="mt-3 max-w-2xl leading-7 text-blue-100">
                            Information about the account currently authenticated in TaskManager.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white/10 px-6 py-5 ring-1 ring-white/15 backdrop-blur">
                        <p className="text-sm text-blue-100">User ID</p>
                        <p className="mt-1 text-3xl font-black">#{profile.id}</p>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[0.9fr_1.35fr]">
                <aside className="rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative h-32 rounded-t-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950">
                        <div className="absolute inset-0 rounded-t-3xl bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_30%)]" />

                        <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white ring-1 ring-white/20 backdrop-blur">
                            <Sparkles className="h-3.5 w-3.5" />
                            Active account
                        </div>

                        <div className="absolute -bottom-12 left-6 flex h-24 w-24 items-center justify-center rounded-[1.75rem] border-4 border-white bg-blue-600 text-3xl font-black text-white shadow-xl shadow-blue-900/20">
                            {initials}
                        </div>
                    </div>

                    <div className="px-6 pb-6 pt-16">
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <h2 className="truncate text-2xl font-black tracking-tight text-slate-950">
                                    {profile.fullName}
                                </h2>

                                <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
                                    <Mail className="h-4 w-4 shrink-0 text-blue-600" />
                                    <span className="truncate">{profile.email}</span>
                                </div>
                            </div>

                            <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 ring-1 ring-emerald-100">
                                Online
                            </span>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                    Role
                                </p>
                                <p className="mt-1 font-black text-slate-950">User</p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                    Security
                                </p>
                                <p className="mt-1 font-black text-slate-950">JWT</p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-slate-600 ring-1 ring-blue-100">
                            This profile is linked to your authenticated workspace. Your projects,
                            tasks, categories and tags are loaded from your protected account.
                        </div>

                        <button
                            onClick={logout}
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/15"
                        >
                            <LogOut className="h-4 w-4" />
                            Log out
                        </button>
                    </div>
                </aside>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-black text-slate-950">
                        Account information
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        This data is retrieved directly from the protected backend endpoint.
                    </p>

                    <div className="mt-6 grid gap-4">
                        <article className="flex items-center gap-4 rounded-3xl bg-slate-50 p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <UserRound className="h-6 w-6" />
                            </div>

                            <div>
                                <p className="text-sm font-bold text-slate-500">
                                    Full name
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
                                    Creation date
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
                                    Authentication status
                                </p>
                                <p className="mt-1 font-black text-slate-950">
                                    Session protected with JWT
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </section>
        </div>
    )
}
