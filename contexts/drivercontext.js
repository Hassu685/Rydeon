"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getToken, getStoredDriver, clearAuth, apiFetch } from "@/lib/api";

const DriverContext = createContext(null);

export function DriverProvider({ children }) {
    const router = useRouter();
    const [driver, setDriver] = useState(null);
    const [online, setOnlineState] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Auth guard — runs once on mount for every page inside (dashboard)
    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.replace("/login");
            return;
        }
        const stored = getStoredDriver();
        if (stored) {
            setDriver(stored);
            setOnlineState(!!stored.isOnline);
        }
        setCheckingAuth(false);
    }, [router]);

    const setOnline = useCallback(async (next) => {
        setOnlineState(next); // optimistic UI
        try {
            const data = await apiFetch("/api/driver/status", {
                method: "PUT",
                body: JSON.stringify({ isOnline: next }),
            });
            setOnlineState(data.isOnline);
            setDriver((d) => {
                if (!d) return d;
                const updated = { ...d, isOnline: data.isOnline };
                localStorage.setItem("driverData", JSON.stringify(updated));
                return updated;
            });
        } catch {
            setOnlineState((prev) => !next); // revert if the API call failed
        }
    }, []);

    const logout = useCallback(() => {
        clearAuth();
        router.replace("/login");
    }, [router]);

    return (
        <DriverContext.Provider
            value={{ driver, setDriver, online, setOnline, logout, checkingAuth }}
        >
            {children}
        </DriverContext.Provider>
    );
}

export function useDriver() {
    const ctx = useContext(DriverContext);
    if (!ctx) throw new Error("useDriver must be used inside <DriverProvider>");
    return ctx;
}