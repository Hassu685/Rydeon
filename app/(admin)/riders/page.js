"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Info } from "lucide-react";
import { adminApiFetch } from "@/lib/adminApi";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

function getInitials(name) {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

export default function AdminRidersPage() {
    const [search, setSearch] = useState("");
    const [riders, setRiders] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadRiders = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (search.trim()) params.set("search", search.trim());
            const data = await adminApiFetch(`/api/admin/riders?${params.toString()}`);
            setRiders(data.riders || []);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const timeout = setTimeout(() => loadRiders(1), search ? 400 : 0);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    return (
        <>
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Honesty note — there's no real Rider account system yet */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={0}
                className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4"
            >
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                    Riders aren't user accounts in this system yet — this list is derived from
                    the rider name on each trip, so it's an approximation, not a precise count of
                    unique people.
                </p>
            </motion.div>

            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={1}
                className="relative w-full sm:w-80"
            >
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search rider name"
                    className="w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                />
            </motion.div>

            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={2}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead>
                            <tr className="text-left text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Rider</th>
                                <th className="px-4 py-4 font-medium">Total Trips</th>
                                <th className="px-4 py-4 font-medium">Completed</th>
                                <th className="px-4 py-4 font-medium">Total Spent</th>
                                <th className="px-6 py-4 font-medium text-right">Last Trip</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={5} className="px-6 py-4">
                                            <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : riders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-14 text-center text-slate-400">
                                        No riders found.
                                    </td>
                                </tr>
                            ) : (
                                riders.map((r) => (
                                    <tr key={r.name} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold shrink-0">
                                                    {getInitials(r.name)}
                                                </div>
                                                <p className="font-medium text-slate-900">{r.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-slate-600">{r.totalTrips}</td>
                                        <td className="px-4 py-4 text-slate-600">{r.completedTrips}</td>
                                        <td className="px-4 py-4 font-semibold text-slate-900">
                                            ₹{r.totalSpent.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-400">
                                            {formatDate(r.lastTripAt)}
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
                            Page {pagination.page} of {pagination.pages} · {pagination.total} riders
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.page <= 1}
                                onClick={() => loadRiders(pagination.page - 1)}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
                            >
                                Prev
                            </button>
                            <button
                                disabled={pagination.page >= pagination.pages}
                                onClick={() => loadRiders(pagination.page + 1)}
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