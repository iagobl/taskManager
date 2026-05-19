import { useAuth } from '../auth/AuthContext'

export function DashboardPage() {
    const { user, logout } = useAuth()

    return (
        <main className="min-h-screen bg-slate-100 p-8">
            <div className="mx-auto max-w-5xl">
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Bienvenido, {user?.fullName}
                    </h1>
                    <p className="mt-2 text-slate-600">
                        Tu frontend ya está conectado al backend y protegido con JWT.
                    </p>

                    <button
                        onClick={logout}
                        className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </main>
    )
}