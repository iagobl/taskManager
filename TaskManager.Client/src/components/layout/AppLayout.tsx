import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout() {
    return (
        <div className="min-h-screen bg-slate-100">
            <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex min-w-0 flex-1 flex-col">
                    <Topbar />

                    <main className="flex-1 px-6 py-6 lg:px-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    )
}