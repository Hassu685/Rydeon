"use client";

import { usePathname } from "next/navigation";
import { Bell, Menu } from "lucide-react";
import { useDriver } from "@/contexts/drivercontext";

const pageMeta = {
    "/driver-dashboard": { title: "Welcome back", subtitle: "Here's what's happening with your rides today." },
    "/my-trips": { title: "My Trips", subtitle: "View and manage all your completed and ongoing trips." },
    "/earnings": { title: "Earnings", subtitle: "Track your income, payouts and earning trends." },
    "/ratings": { title: "Ratings", subtitle: "See what riders are saying about your service." },
    "/profile": { title: "Profile", subtitle: "Manage your personal and vehicle information." },
    "/settings": { title: "Settings", subtitle: "Customize your account and app preferences." },
};

function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function Topbar({ setSidebarOpen }) {
    const pathname = usePathname();
    const { driver } = useDriver();
    const meta = pageMeta[pathname] || { title: "Dashboard", subtitle: "" };
    const greetingTitle =
        pathname === "/driver-dashboard" && driver?.name
            ? `Welcome back, ${driver.name.split(" ")[0]} 👋`
            : meta.title;

    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-slate-200">
            <div className="flex items-center justify-between px-5 sm:px-8 py-4">
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600">
                        <Menu className="h-6 w-6" />
                    </button>
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-900">{greetingTitle}</h2>
                        <p className="text-xs sm:text-sm text-slate-500">{meta.subtitle}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                        <Bell className="h-4.5 w-4.5" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                    </button>

                    <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-sm font-bold">
                        {getInitials(driver?.name)}
                    </div>
                </div>
            </div>
        </header>
    );
}