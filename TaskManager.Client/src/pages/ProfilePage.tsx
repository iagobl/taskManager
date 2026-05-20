import { useAuth } from '../auth/AuthContext'

export function ProfilePage() {
    const { user } = useAuth()

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-black text-slate-950">Perfil</h1>
            <p className="mt-2 text-slate-500">
                Información del usuario autenticado.
            </p>

            <div className="mt-8 rounded-3xl bg-slate-50 p-6">
                <p className="text-sm font-bold text-slate-500">Nombre</p>
                <p className="mt-1 text-lg font-black text-slate-950">
                    {user?.fullName}
                </p>

                <p className="mt-5 text-sm font-bold text-slate-500">Email</p>
                <p className="mt-1 text-lg font-black text-slate-950">
                    {user?.email}
                </p>
            </div>
        </div>
    )
}