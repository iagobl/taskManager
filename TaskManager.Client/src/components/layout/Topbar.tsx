import { useEffect, useMemo, useState } from 'react'
import { Bell, CalendarClock, ChevronDown, Search, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { projectsApi } from '../../api/projectsApi'
import { tasksApi } from '../../api/tasksApi'
import type { TaskItem } from '../../types/task'

const NOTIFICATION_WINDOW_DAYS = 3

export function Topbar() {
    const { user } = useAuth()
    const [tasks, setTasks] = useState<TaskItem[]>([])
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const [profileOpen, setProfileOpen] = useState(false)

    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const projects = await projectsApi.getAll()
                const taskGroups = await Promise.all(
                    projects.map((project) => tasksApi.getAllByProject(project.id)),
                )

                setTasks(taskGroups.flat())
            } catch {
                setTasks([])
            }
        }

        void loadNotifications()
    }, [])

    const dueSoonTasks = useMemo(() => {
        const now = new Date()
        now.setHours(0, 0, 0, 0)

        const limit = new Date(now)
        limit.setDate(limit.getDate() + NOTIFICATION_WINDOW_DAYS)
        limit.setHours(23, 59, 59, 999)

        return tasks
            .filter((task) => !task.isCompleted && task.dueDate)
            .filter((task) => {
                const dueDate = new Date(task.dueDate as string)
                return dueDate >= now && dueDate <= limit
            })
            .sort(
                (first, second) =>
                    new Date(first.dueDate as string).getTime() -
                    new Date(second.dueDate as string).getTime(),
            )
            .slice(0, 5)
    }, [tasks])

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/85 px-6 py-3 backdrop-blur lg:px-8">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-medium text-slate-500">Welcome</p>
                    <h2 className="text-lg font-black text-slate-950">
                        {user?.fullName ?? 'User'}
                    </h2>
                </div>

                <div className="hidden w-full max-w-md items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 md:flex">
                    <Search className="h-4 w-4 text-slate-400" />
                    <input
                        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                        placeholder="Search projects, tasks..."
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button
                            onClick={() => {
                                setNotificationsOpen((current) => !current)
                                setProfileOpen(false)
                            }}
                            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                            aria-label="Open notifications"
                        >
                            <Bell className="h-5 w-5" />
                            {dueSoonTasks.length > 0 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-black text-white ring-2 ring-white">
                                    {dueSoonTasks.length}
                                </span>
                            )}
                        </button>

                        {notificationsOpen && (
                            <div className="absolute right-0 mt-3 w-80 rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm font-black text-slate-950">
                                            Notifications
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Tasks due in the next {NOTIFICATION_WINDOW_DAYS} days.
                                        </p>
                                    </div>
                                    <CalendarClock className="h-5 w-5 text-blue-600" />
                                </div>

                                <div className="mt-4 space-y-2">
                                    {dueSoonTasks.length === 0 ? (
                                        <div className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                                            No upcoming task deadlines.
                                        </div>
                                    ) : (
                                        dueSoonTasks.map((task) => (
                                            <Link
                                                key={task.id}
                                                to={`/projects/${task.projectId}`}
                                                onClick={() => setNotificationsOpen(false)}
                                                className="block rounded-2xl border border-amber-100 bg-amber-50/70 p-3 transition hover:bg-amber-50"
                                            >
                                                <p className="line-clamp-1 text-sm font-black text-slate-950">
                                                    {task.title}
                                                </p>
                                                <p className="mt-1 text-xs font-semibold text-amber-700">
                                                    Due {formatDueDate(task.dueDate)}
                                                </p>
                                            </Link>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => {
                                setProfileOpen((current) => !current)
                                setNotificationsOpen(false)
                            }}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:bg-slate-50"
                            aria-label="Open profile menu"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <UserRound className="h-4 w-4" />
                            </span>
                            <span className="hidden text-left md:block">
                                <span className="block max-w-32 truncate text-sm font-black text-slate-950">
                                    {user?.fullName ?? 'Profile'}
                                </span>
                                <span className="block text-xs text-slate-500">Profile</span>
                            </span>
                            <ChevronDown className="hidden h-4 w-4 text-slate-400 md:block" />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10">
                                <Link
                                    to="/profile"
                                    onClick={() => setProfileOpen(false)}
                                    className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                                >
                                    <UserRound className="h-4 w-4" />
                                    View profile
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

function formatDueDate(value?: string | null) {
    if (!value) return 'soon'

    return new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    })
}
