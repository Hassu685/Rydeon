"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Star, MoreVertical, ShieldOff, ShieldCheck, Loader2 } from "lucide-react";
import { adminApiFetch } from "@/lib/adminApi";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

const filters = ["All", "Active", "Suspended"];

function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function AdminDriversPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [drivers, setDrivers] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const loadDrivers = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (search.trim()) params.set("search", search.trim());
            if (activeFilter === "Active") params.set("isSuspended", "false");
            if (activeFilter === "Suspended") params.set("isSuspended", "true");

            const data = await adminApiFetch(`/api/admin/drivers?${params.toString()}`);
            setDrivers(data.drivers || []);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [search, activeFilter]);

    useEffect(() => {
        const timeout = setTimeout(() => loadDrivers(1), search ? 400 : 0);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFilter, search]);

    async function toggleSuspend(driver) {
        setActionLoadingId(driver._id);
        try {
            const data = await adminApiFetch(`/api/admin/drivers/${driver._id}`, {
                method: "PUT",
                body: JSON.stringify({ isSuspended: !driver.isSuspended }),
            });
            setDrivers((prev) =>
                prev.map((d) => (d._id === driver._id ? data.driver : d))
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoadingId(null);
        }
    }

    return (
        <>
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={0}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div className="flex flex-wrap items-center gap-2">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ${activeFilter === f
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/20"
                                    : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search driver name or email"
                        className="w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                    />
                </div>
            </motion.div>

            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={1}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                        <thead>
                            <tr className="text-left text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Driver</th>
                                <th className="px-4 py-4 font-medium">Vehicle</th>
                                <th className="px-4 py-4 font-medium">Rides</th>
                                <th className="px-4 py-4 font-medium">Rating</th>
                                <th className="px-4 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="px-6 py-4">
                                            <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : drivers.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                                        No drivers found.
                                    </td>
                                </tr>
                            ) : (
                                drivers.map((d) => (
                                    <tr key={d._id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold shrink-0">
                                                    {getInitials(d.name)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-900 truncate">{d.name}</p>
                                                    <p className="text-xs text-slate-400 truncate">{d.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-600">
                                            {d.vehicle?.make || d.vehicle?.model
                                                ? `${d.vehicle.make} ${d.vehicle.model}`.trim()
                                                : "—"}
                                        </td>
                                        <td className="px-4 py-4 text-slate-600">{d.totalTrips}</td>
                                        <td className="px-4 py-4">
                                            <span className="flex items-center gap-1 text-slate-700">
                                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                {d.rating?.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${d.isSuspended
                                                        ? "bg-red-50 text-red-600"
                                                        : d.isOnline
                                                            ? "bg-green-50 text-green-600"
                                                            : "bg-slate-100 text-slate-500"
                                                    }`}
                                            >
                                                {d.isSuspended ? "Suspended" : d.isOnline ? "Online" : "Offline"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => toggleSuspend(d)}
                                                    disabled={actionLoadingId === d._id}
                                                    title={d.isSuspended ? "Unsuspend driver" : "Suspend driver"}
                                                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${d.isSuspended
                                                            ? "bg-green-50 text-green-600 hover:bg-green-100"
                                                            : "bg-red-50 text-red-600 hover:bg-red-100"
                                                        }`}
                                                >
                                                    {actionLoadingId === d._id ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : d.isSuspended ? (
                                                        <ShieldCheck className="h-4 w-4" />
                                                    ) : (
                                                        <ShieldOff className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && pagination.pages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 text-sm text-slate-500">
                        <span>
                            Page {pagination.page} of {pagination.pages} · {pagination.total} drivers
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.page <= 1}
                                onClick={() => loadDrivers(pagination.page - 1)}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
                            >
                                Prev
                            </button>
                            <button
                                disabled={pagination.page >= pagination.pages}
                                onClick={() => loadDrivers(pagination.page + 1)}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </>
    );
}