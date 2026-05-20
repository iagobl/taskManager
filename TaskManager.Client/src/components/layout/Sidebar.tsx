import {
    FolderKanban,
    Home,
    Layers3,
    LogOut,
    Tags,
    UserRound,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const links = [
    {
        label: 'Dashboard',
        to: '/dashboard',
        icon: Home,
    },
    {
        label: 'Proyectos',
        to: '/projects',
        icon: FolderKanban,
    },
    {
        label: 'Categorías',
        to: '/categories',
        icon: Layers3,
    },
    {
        label: 'Etiquetas',
        to: '/tags',
        icon: Tags,
    },
    {
        label: 'Perfil',
        to: '/profile',
        icon: UserRound,
    },
]

export function Sidebar() {
    const { logout } = useAuth()

    return (
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
            <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    <FolderKanban className="h-6 w-6" />
                </div>

                <div>
                    <h1 className="text-lg font-black text-slate-950">TaskManager</h1>
                    <p className="text-xs font-medium text-slate-500">
                        Productivity panel
                    </p>
                </div>
            </div>

            <nav className="mt-10 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon

                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                [
                                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                                ].join(' ')
                            }
                        >
                            <Icon className="h-5 w-5" />
                            {link.label}
                        </NavLink>
                    )
                })}
            </nav>

            <div className="mt-auto rounded-3xl bg-slate-950 p-5 text-white">
                <p className="text-sm font-bold">Backend conectado</p>
                <p className="mt-1 text-xs leading-5 text-slate-300">
                    API REST protegida con JWT, SQL Server y Entity Framework Core.
                </p>

                <button
                    onClick={logout}
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-slate-200"
                >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                </button>
            </div>
        </aside>
    )
}