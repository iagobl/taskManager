import { Bell, Search } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'

export function Topbar() {
    const { user } = useAuth()

    return (
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-slate-500">Bienvenido</p>
                    <h2 className="text-xl font-black text-slate-950">
                        {user?.fullName ?? 'Usuario'}
                    </h2>
                </div>

                <div className="hidden w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex">
                    <Search className="h-5 w-5 text-slate-400" />
                    <input
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                        placeholder="Buscar proyectos, tareas..."
                    />
                </div>

                <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50">
                    <Bell className="h-5 w-5" />
                </button>
            </div>
        </header>
    )
}