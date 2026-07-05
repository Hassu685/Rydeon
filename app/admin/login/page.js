"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { storeAdminAuth } from "@/lib/adminApi";

const fieldClass =
    "admin-dark-input w-full rounded-xl border border-white/15 bg-white/[0.04] text-white placeholder:text-slate-500 pl-11 pr-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]";

export default function AdminLoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function handleChange(e) {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/admin/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Login failed");

            storeAdminAuth(data.token, data.admin);
            router.push("/admin-dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-5">
            {/* Scoped fix: browser autofill forces a white input background by
                default, which made white text invisible. This overrides it
                only for inputs with the .admin-dark-input class, so it
                doesn't affect the light-themed dashboard forms elsewhere. */}
            <style jsx global>{`
                .admin-dark-input:-webkit-autofill,
                .admin-dark-input:-webkit-autofill:hover,
                .admin-dark-input:-webkit-autofill:focus {
                    -webkit-text-fill-color: #ffffff;
                    -webkit-box-shadow: 0 0 0px 1000px rgba(30, 41, 59, 0.9) inset;
                    box-shadow: 0 0 0px 1000px rgba(30, 41, 59, 0.9) inset;
                    transition: background-color 9999s ease-in-out 0s;
                    caret-color: #ffffff;
                }
            `}</style>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl p-8 shadow-2xl"
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                        <ShieldCheck className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Admin Login</h1>
                        <p className="text-xs text-slate-400">Rydeon Platform Management</p>
                    </div>
                </div>

                {error && (
                    <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="relative">
                        <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500 z-10" />
                        <input
                            type="email"
                            name="email"
                            required
                            autoComplete="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="admin@rydeon.com"
                            className={fieldClass}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500 z-10" />
                        <input
                            type="password"
                            name="password"
                            required
                            autoComplete="current-password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className={fieldClass}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/30 disabled:opacity-60"
                    >
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>
            </motion.div>
        </section>
    );
}