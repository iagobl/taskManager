import {
    CheckCircle2,
    Clock3,
    FolderKanban,
    Layers3,
    Tags,
} from 'lucide-react'

const stats = [
    {
        label: 'Proyectos activos',
        value: '0',
        icon: FolderKanban,
    },
    {
        label: 'Tareas pendientes',
        value: '0',
        icon: Clock3,
    },
    {
        label: 'Tareas completadas',
        value: '0',
        icon: CheckCircle2,
    },
    {
        label: 'Categorías',
        value: '0',
        icon: Layers3,
    },
]

export function DashboardPage() {
    return (
        <div className="space-y-8">
            <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-8 text-white shadow-xl shadow-blue-900/20">
                <div className="max-w-3xl">
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                        Panel principal
                    </p>
                    <h1 className="mt-4 text-4xl font-black tracking-tight">
                        Organiza tu trabajo con una vista clara de tus proyectos.
                    </h1>
                    <p className="mt-4 max-w-2xl leading-7 text-blue-100">
                        Desde aquí podrás consultar el estado general, revisar tareas
                        pendientes y acceder rápidamente a tus proyectos, categorías y
                        etiquetas.
                    </p>
                </div>
            </section>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon

                    return (
                        <article
                            key={stat.label}
                            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-500">
                                    Demo
                                </span>
                            </div>

                            <p className="mt-6 text-3xl font-black text-slate-950">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-sm font-medium text-slate-500">
                                {stat.label}
                            </p>
                        </article>
                    )
                })}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-black text-slate-950">
                        Actividad reciente
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Cuando conectemos los datos reales, aquí aparecerán tus últimas
                        tareas y proyectos.
                    </p>

                    <div className="mt-6 rounded-3xl bg-slate-50 p-8 text-center">
                        <p className="font-bold text-slate-700">
                            Todavía no hay actividad.
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Crea tu primer proyecto para empezar.
                        </p>
                    </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                            <Tags className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="font-black text-slate-950">Siguiente paso</h2>
                            <p className="text-sm text-slate-500">Conectar proyectos reales</p>
                        </div>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-slate-600">
                        La interfaz ya tiene rutas protegidas y diseño base. Ahora toca
                        conectar el CRUD de proyectos con el backend.
                    </p>
                </div>
            </section>
        </div>
    )
}