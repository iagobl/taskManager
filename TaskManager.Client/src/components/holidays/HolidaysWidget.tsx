import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, RefreshCw, Umbrella } from 'lucide-react'
import { holidaysApi } from '../../api/holidaysApi'
import type { PublicHoliday } from '../../types/holidays'

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
            .slice(0, 4)
    }, [holidays])

    const nextHoliday = upcomingHolidays[0]

    const loadHolidays = async () => {
        try {
            setLoading(true)
            setError('')

            const data = await holidaysApi.getPublicHolidays(currentYear)
            setHolidays(data)
        } catch {
            setError('Could not load the holidays.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        void loadHolidays()
    }, [])

    return (
        <section className="h-full rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                        <CalendarDays className="h-4 w-4" />
                    </div>

                    <div>
                        <h2 className="text-base font-black text-slate-950">
                            Upcoming holidays
                        </h2>
                        <p className="text-xs text-slate-500">
                            Non-working days calendar.
                        </p>
                    </div>
                </div>

                <button
                    onClick={() => void loadHolidays()}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 py-2 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw className={loading ? 'h-3.5 w-3.5 animate-spin' : 'h-3.5 w-3.5'} />
                    Update
                </button>
            </div>

            {error && (
                <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold text-amber-700">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="mt-4 rounded-3xl bg-slate-50 p-6 text-center text-sm font-semibold text-slate-500">
                    Loading holidays...
                </div>
            ) : upcomingHolidays.length === 0 ? (
                <div className="mt-4 rounded-3xl bg-slate-50 p-6 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                        <Umbrella className="h-6 w-6" />
                    </div>
                    <p className="mt-3 font-bold text-slate-700">
                        There are no holidays left this year.
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        You can keep planning your tasks as usual.
                    </p>
                </div>
            ) : (
                <div className="mt-4 space-y-2.5">
                    {nextHoliday && (
                        <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-950 p-3.5 text-white shadow-lg shadow-blue-900/20">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-100">
                                Next non-working day
                            </p>

                            <h3 className="mt-2 line-clamp-1 text-base font-black">
                                {nextHoliday.name}
                            </h3>

                            <div className="mt-2 inline-flex rounded-2xl bg-white/10 px-3 py-1.5 text-xs font-bold ring-1 ring-white/15">
                                {new Date(nextHoliday.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        {upcomingHolidays.map((holiday) => (
                            <article
                                key={holiday.date}
                                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm"
                            >
                                <div className="min-w-0">
                                    <h3 className="truncate text-sm font-black text-slate-950">
                                        {holiday.name}
                                    </h3>
                                    <p className="text-xs text-slate-500">Public holiday in Spain</p>
                                </div>

                                <div className="shrink-0 rounded-2xl bg-blue-50 px-3 py-1.5 text-right text-xs font-black text-blue-600">
                                    {new Date(holiday.date).toLocaleDateString('en-US', {
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
