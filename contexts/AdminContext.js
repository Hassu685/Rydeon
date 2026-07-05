"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAdminToken, getStoredAdmin, clearAdminAuth } from "@/lib/adminApi";

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
    const router = useRouter();
    const [admin, setAdmin] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const token = getAdminToken();
        if (!token) {
            router.replace("/admin/login");
            return;
        }
        setAdmin(getStoredAdmin());
        setCheckingAuth(false);
    }, [router]);

    const logout = useCallback(() => {
        clearAdminAuth();
        router.replace("/admin/login");
    }, [router]);

    return (
        <AdminContext.Provider value={{ admin, setAdmin, logout, checkingAuth }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdmin must be used inside <AdminProvider>");
    return ctx;
}