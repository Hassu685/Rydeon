"use client";

export function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("driverToken");
}

export function getStoredDriver() {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem("driverData");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function storeAuth(token, driver) {
    localStorage.setItem("driverToken", token);
    if (driver) localStorage.setItem("driverData", JSON.stringify(driver));
}

export function clearAuth() {
    localStorage.removeItem("driverToken");
    localStorage.removeItem("driverData");
}

export async function apiFetch(path, options = {}) {
    const token = getToken();

    const res = await fetch(path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    if (res.status === 401) {
        clearAuth();
        if (typeof window !== "undefined") window.location.href = "/login";
        throw new Error("Session expired");
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
}