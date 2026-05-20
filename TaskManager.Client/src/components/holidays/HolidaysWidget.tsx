import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, RefreshCw, Umbrella } from 'lucide-react'
import { holidaysApi } from '../../api/holidaysApi'
import type { PublicHoliday } from '../../types/holiday'

export function HolidaysWidget() {
    const [holidays, setHolidays] = useState<PublicHoliday[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const currentYear = new Date().getFullYear()

    const upcomingHolidays = useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return holidays
            .filter((holiday) => new Date(holiday.date) >= today)
            .sort(
                (first, second) =>
                    new Date(first.date).getTime() - new Date(second.date).getTime(),
            )
            .slice(0, 5)
    }, [holidays])

    const nextHoliday = upcomingHolidays[0]

    const loadHolidays = async () => {
        try {
            setLoading(true)
            setError('')

            const data = await holidaysApi.getPublicHolidays(currentYear)
            setHolidays(data)
        } catch {
            setError('No se pudieron cargar los festivos.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadHolidays()
    }, [])

    return (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <CalendarDays className="h-6 w-6" />
                    </div>

                    <div>
                        <h2 className="text-xl font-black text-slate-950">
                            Próximos festivos
                        </h2>
                        <p className="text-sm text-slate-500">
                            Integración externa con calendario de días no laborables.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => void loadHolidays()}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
                    Actualizar
                </button>
            </div>

            {error && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="mt-6 rounded-3xl bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
                    Cargando festivos...
                </div>
            ) : upcomingHolidays.length === 0 ? (
                <div className="mt-6 rounded-3xl bg-slate-50 p-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                        <Umbrella className="h-7 w-7" />
                    </div>
                    <p className="mt-4 font-bold text-slate-700">
                        No quedan festivos este año.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        Puedes seguir planificando tus tareas con normalidad.
                    </p>
                </div>
            ) : (
                <div className="mt-6 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
                    <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-6 text-white shadow-lg shadow-blue-900/20">
                        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100">
                            Próximo día no laborable
                        </p>

                        <h3 className="mt-4 text-2xl font-black">
                            {nextHoliday.localName}
                        </h3>

                        <p className="mt-2 text-sm text-blue-100">{nextHoliday.name}</p>

                        <div className="mt-6 inline-flex rounded-2xl bg-white/10 px-4 py-3 text-sm font-bold ring-1 ring-white/15">
                            {new Date(nextHoliday.date).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {upcomingHolidays.map((holiday) => (
                            <article
                                key={holiday.date}
                                className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div>
                                    <h3 className="font-black text-slate-950">
                                        {holiday.localName}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">{holiday.name}</p>
                                </div>

                                <div className="shrink-0 rounded-2xl bg-blue-50 px-4 py-2 text-right text-sm font-black text-blue-600">
                                    {new Date(holiday.date).toLocaleDateString('es-ES', {
                                        day: '2-digit',
                                        month: 'short',
                                    })}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}