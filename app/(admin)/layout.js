"use client";

import { useState } from "react";

import { AdminProvider, useAdmin } from "@/contexts/AdminContext";
import AdminSidebar from "@/components/admin-sidebar";
import AdminTopbar from "@/components/admin-topbar";

function AdminShell({ children, sidebarOpen, setSidebarOpen }) {
    const { checkingAuth } = useAdmin();

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-1 min-w-0">
                <AdminTopbar setSidebarOpen={setSidebarOpen} />
                <div className="px-5 sm:px-8 py-8 space-y-8">{children}</div>
            </main>
        </div>
    );
}

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <AdminProvider>
            <AdminShell sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                {children}
            </AdminShell>
        </AdminProvider>
    );
}