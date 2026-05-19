import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    Layers3,
    LockKeyhole,
    Mail,
    Sparkles,
    UserRound,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export function RegisterPage() {
    const navigate = useNavigate()
    const { register } = useAuth()

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const validatePassword = (value: string) => {
        if (value.length < 8) {
            return 'La contraseña debe tener al menos 8 caracteres.'
        }

        if (!/[A-Z]/.test(value)) {
            return 'La contraseña debe incluir al menos una letra mayúscula.'
        }

        if (!/[a-z]/.test(value)) {
            return 'La contraseña debe incluir al menos una letra minúscula.'
        }

        if (!/[0-9]/.test(value)) {
            return 'La contraseña debe incluir al menos un número.'
        }

        if (!/[^A-Za-z0-9]/.test(value)) {
            return 'La contraseña debe incluir al menos un carácter especial.'
        }

        return ''
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')

        const passwordError = validatePassword(password)

        if (passwordError) {
            setError(passwordError)
            return
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.')
            return
        }

        setLoading(true)

        try {
            await register({ fullName, email, password })
            navigate('/dashboard')
        } catch {
            setError('No se pudo crear la cuenta. Revisa los datos introducidos.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
            <div className="relative grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
                <div className="absolute left-20 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                <div className="absolute bottom-0 right-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

                <section className="relative hidden overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-700 p-12 lg:block">
                    <div className="absolute -left-24 top-24 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
                    <div className="absolute -bottom-24 right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />

                    <div className="relative flex h-full flex-col justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg ring-1 ring-white/15 backdrop-blur">
                                <Sparkles className="h-4 w-4" />
                                Nuevo espacio de productividad
                            </div>

                            <h1 className="mt-12 max-w-2xl text-5xl font-black leading-tight tracking-tight xl:text-6xl">
                                Crea tu cuenta y empieza a ordenar tu trabajo con claridad.
                            </h1>

                            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
                                Gestiona proyectos, divide tareas, añade categorías, usa
                                etiquetas y documenta el avance con comentarios.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-400/20">
                                        <Layers3 className="h-6 w-6 text-blue-100" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Organización por proyectos</p>
                                        <p className="text-sm text-blue-100">
                                            Agrupa tareas, prioridades y fechas límite.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                                    <p className="text-3xl font-black">5+</p>
                                    <p className="mt-1 text-sm text-blue-100">
                                        Páginas principales
                                    </p>
                                </div>
                                <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15 backdrop-blur">
                                    <p className="text-3xl font-black">JWT</p>
                                    <p className="mt-1 text-sm text-blue-100">
                                        Acceso protegido
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-blue-50">
                                <CheckCircle2 className="h-5 w-5 text-cyan-200" />
                                Backend conectado con ASP.NET Core y SQL Server
                            </div>
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
                                <UserRound className="h-6 w-6" />
                            </div>

                            <h1 className="text-3xl font-black tracking-tight">
                                Crear cuenta
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-slate-300">
                                Crea tu espacio personal para organizar proyectos, tareas,
                                categorías y etiquetas.
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
                                    Nombre completo
                                </label>
                                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10">
                                    <UserRound className="h-5 w-5 text-slate-400" />
                                    <input
                                        className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                                        placeholder="User LastName"
                                        value={fullName}
                                        onChange={(event) => setFullName(event.target.value)}
                                        required
                                    />
                                </div>
                            </div>

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
                                        type={showPassword ? 'text' : 'password'}
                                        minLength={8}
                                        placeholder="Mínimo 8 caracteres"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((value) => !value)}
                                        className="rounded-xl p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                                        aria-label={
                                            showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>

                                <p className="mt-2 text-xs leading-5 text-slate-400">
                                    Debe tener 8 caracteres, una mayúscula, una minúscula, un
                                    número y un carácter especial.
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-300">
                                    Repetir contraseña
                                </label>
                                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10">
                                    <LockKeyhole className="h-5 w-5 text-slate-400" />
                                    <input
                                        className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        minLength={8}
                                        placeholder="Repite tu contraseña"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((value) => !value)}
                                        className="rounded-xl p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                                        aria-label={
                                            showConfirmPassword
                                                ? 'Ocultar contraseña repetida'
                                                : 'Mostrar contraseña repetida'
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-blue-600/25 transition hover:-translate-y-0.5 hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                            {!loading && <ArrowRight className="h-5 w-5" />}
                        </button>

                        <p className="mt-6 text-center text-sm text-slate-300">
                            ¿Ya tienes cuenta?{' '}
                            <Link
                                className="font-bold text-blue-300 hover:text-blue-200"
                                to="/login"
                            >
                                Iniciar sesión
                            </Link>
                        </p>
                    </form>
                </section>
            </div>
        </main>
    )
}