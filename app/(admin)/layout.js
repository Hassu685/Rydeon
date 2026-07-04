"use client";

import { useState } from "react";
import AdminSidebar from "../../components/admin-sidebar";
import AdminTopbar from "../../components/admin-topbar";


export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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