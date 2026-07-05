"use client";

import { useState } from "react";
import Sidebar from "@/components/driver-sidebar";
import Topbar from "@/components/admin-topbar";
import { DriverProvider, useDriver } from "@/contexts/drivercontext";

function DashboardShell({ children, sidebarOpen, setSidebarOpen }) {
    const { checkingAuth } = useDriver();

    if (checkingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            </div>
        );
    }

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

export default function DashboardLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <DriverProvider>
            <DashboardShell sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
                {children}
            </DashboardShell>
        </DriverProvider>
    );
}