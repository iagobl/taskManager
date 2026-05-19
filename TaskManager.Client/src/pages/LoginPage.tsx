import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    CheckCircle2,
    LockKeyhole,
    Mail,
    Sparkles,
    ArrowRight,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
    const navigate = useNavigate()
    const { login } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login({ email, password })
            navigate('/dashboard')
        } catch {
            setError('El email o la contraseña no son correctos.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
                <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />

                <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-12 lg:flex">
                    <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute bottom-20 left-20 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />

                    <div className="relative">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg ring-1 ring-white/15 backdrop-blur">
                            <Sparkles className="h-4 w-4" />
                            TaskManager
                        </div>

                        <h1 className="mt-12 max-w-2xl text-5xl font-black leading-tight tracking-tight xl:text-6xl">
                            Organiza proyectos, tareas y prioridades desde un único panel.
                        </h1>

                        <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
                            Una experiencia moderna para gestionar tu trabajo diario con
                            autenticación segura, datos protegidos y una interfaz clara.
                        </p>

                        <div className="mt-10 grid max-w-xl grid-cols-2 gap-4">
                            <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                                <p className="text-3xl font-black">JWT</p>
                                <p className="mt-1 text-sm text-blue-100">Rutas protegidas</p>
                            </div>
                            <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                                <p className="text-3xl font-black">CRUD</p>
                                <p className="mt-1 text-sm text-blue-100">Gestión completa</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative grid gap-4 text-sm text-blue-50">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-cyan-200" />
                            API protegida con JWT
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-cyan-200" />
                            Proyectos, tareas, etiquetas y comentarios
                        </div>
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-cyan-200" />
                            Diseño limpio, moderno y responsive
                        </div>
                    </div>
                </section>

                <section className="relative flex items-center justify-center px-6 py-12">
                    <form
                        onSubmit={handleSubmit}
                        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.08] p-8 shadow-2xl shadow-blue-950/40 ring-1 ring-white/10 backdrop-blur-xl"
                    >
                        <div className="mb-8">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/20">
                                <LockKeyhole className="h-6 w-6" />
                            </div>

                            <h2 className="text-3xl font-black tracking-tight">
                                Iniciar sesión
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                Accede a tu espacio de trabajo y continúa gestionando tus
                                proyectos.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div>
                                <label className="text-sm font-medium text-slate-300">
                                    Email
                                </label>
                                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                    <input
                                        className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                                        type="email"
                                        placeholder="user@example.com"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-300">
                                    Contraseña
                                </label>
                                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10">
                                    <LockKeyhole className="h-5 w-5 text-slate-400" />
                                    <input
                                        className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Entrando...' : 'Entrar'}
                            {!loading && <ArrowRight className="h-5 w-5" />}
                        </button>

                        <p className="mt-6 text-center text-sm text-slate-300">
                            ¿No tienes cuenta?{' '}
                            <Link className="font-bold text-blue-300 hover:text-blue-200" to="/register">
                                Crear cuenta
                            </Link>
                        </p>
                    </form>
                </section>
            </div>
        </main>
    )
}