"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";

const pageMeta = {
    "/admin-dashboard": { title: "Platform Overview", subtitle: "Real-time snapshot of your entire operation." },
    "/admin/drivers": { title: "Drivers", subtitle: "Manage driver accounts, approvals and status." },
    "/admin/riders": { title: "Riders", subtitle: "View and manage all registered riders." },
    "/admin/bookings": { title: "Bookings", subtitle: "Track and manage all ride bookings." },
    "/admin/reports": { title: "Reports & Analytics", subtitle: "Platform performance and revenue insights." },
    "/admin/settings": { title: "Platform Settings", subtitle: "Configure fares, zones and app preferences." },
};

export default function AdminTopbar({ setSidebarOpen }) {
    const pathname = usePathname();
    const meta = pageMeta[pathname] || { title: "Admin", subtitle: "" };

    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200">
            <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-4">
                <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 shrink-0">
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="min-w-0">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">{meta.title}</h2>
                        <p className="text-xs sm:text-sm text-slate-500 truncate">{meta.subtitle}</p>
                    </div>
                </div>

                <div className="hidden md:block relative w-64">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        placeholder="Search drivers, riders, bookings..."
                        className="w-full rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
                    />
                </div>

                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                        <Bell className="h-4.5 w-4.5" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                    </button>
                    <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm font-bold">
                        AZ
                    </div>
                </div>
            </div>
        </header>
    );
}