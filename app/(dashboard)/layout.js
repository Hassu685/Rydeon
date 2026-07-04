"use client";

import { useState } from "react";
import Sidebar from "../../components/driver-sidebar";
import Topbar from "../../components/driver-topbar";


export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex">
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <main className="flex-1 min-w-0">
                <Topbar setSidebarOpen={setSidebarOpen} />
                <div className="px-5 sm:px-8 py-8 space-y-8">{children}</div>
            </main>
        </div>
    );
}