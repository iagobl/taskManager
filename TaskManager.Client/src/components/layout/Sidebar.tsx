import {
    FolderKanban,
    Home,
    Layers3,
    LogOut,
    Tags,
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
        label: 'Projects',
        to: '/projects',
        icon: FolderKanban,
    },
    {
        label: 'Categories',
        to: '/categories',
        icon: Layers3,
    },
    {
        label: 'Tags',
        to: '/tags',
        icon: Tags,
    },
]

export function Sidebar() {
    const { logout } = useAuth()

    return (
        <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-5 py-5 lg:sticky lg:top-0 lg:flex lg:flex-col">
            <div className="flex items-center gap-3.5 px-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    <FolderKanban className="h-6 w-6" />
                </div>

                <div>
                    <h1 className="text-lg font-black text-slate-950">TaskManager</h1>
                    <p className="text-xs font-semibold text-slate-500">
                        Productivity panel
                    </p>
                </div>
            </div>

            <nav className="mt-8 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon

                    return (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                [
                                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-bold transition',
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

            <div className="mt-auto border-t border-slate-100 pt-5">
                <button
                    onClick={logout}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-[15px] font-bold text-white transition hover:bg-slate-800"
                >
                    <LogOut className="h-5 w-5" />
                    Log out
                </button>
            </div>
        </aside>
    )
}
