"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Car,
    Users,
    ClipboardList,
    BarChart3,
    Settings,
    LogOut,
    ShieldCheck,
    X,
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

const navItems = [
    { name: "Overview", icon: LayoutDashboard, path: "/admin-dashboard" },
    { name: "Drivers", icon: Car, path: "/drivers" },
    { name: "Riders", icon: Users, path: "/riders" },
    { name: "Bookings", icon: ClipboardList, path: "/bookings" },
    { name: "Reports", icon: BarChart3, path: "/reports" },
    { name: "Settings", icon: Settings, path: "/admin-settings" },
];

function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }) {
    const pathname = usePathname();
    const { admin, logout } = useAdmin();

    return (
        <>
            <aside
                className={`fixed lg:sticky top-0 h-screen w-72 bg-slate-950 text-slate-300 flex flex-col z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    }`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
                    <div>
                        <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Rydeon
                        </h1>
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                            Admin Panel
                        </span>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Admin mini profile */}
                <div className="px-6 py-5 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-bold">
                            {getInitials(admin?.name)}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                                {admin?.name || "Loading…"}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-slate-400">
                                <ShieldCheck className="h-3 w-3 text-blue-400" />
                                {admin?.role === "superadmin" ? "Super Admin" : "Admin"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${active
                                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/30"
                                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon className="h-4.5 w-4.5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-4 py-6 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-red-400 transition-colors duration-200"
                    >
                        <LogOut className="h-4.5 w-4.5" />
                        Log Out
                    </button>
                </div>
            </aside>

            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    />
                )}
            </AnimatePresence>
        </>
    );
}