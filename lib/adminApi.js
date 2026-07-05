"use client";

export function getAdminToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("adminToken");
}

export function storeAdminAuth(token, admin) {
    localStorage.setItem("adminToken", token);
    if (admin) localStorage.setItem("adminData", JSON.stringify(admin));
}

export function clearAdminAuth() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");
}

export function getStoredAdmin() {
    if (typeof window === "undefined") return null;
    try {
        const raw = localStorage.getItem("adminData");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export async function adminApiFetch(path, options = {}) {
    const token = getAdminToken();

    const res = await fetch(path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    if (res.status === 401) {
        clearAdminAuth();
        if (typeof window !== "undefined") window.location.href = "/admin/login";
        throw new Error("Session expired");
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Something went wrong");
    return data;
}