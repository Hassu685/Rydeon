"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { adminApiFetch } from "@/lib/adminApi";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

const statusStyles = {
    Completed: "bg-green-50 text-green-600",
    Cancelled: "bg-red-50 text-red-600",
    Ongoing: "bg-blue-50 text-blue-600",
};

const filters = ["All", "Completed", "Ongoing", "Cancelled"];

export default function AdminBookingsPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [bookings, setBookings] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadBookings = useCallback(
        async (page = 1) => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ page: String(page), limit: "20" });
                if (activeFilter !== "All") params.set("status", activeFilter);
                if (search.trim()) params.set("search", search.trim());

                const data = await adminApiFetch(`/api/admin/trips?${params.toString()}`);
                setBookings(data.trips || []);
                setPagination(data.pagination);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        },
        [activeFilter, search]
    );

    useEffect(() => {
        const timeout = setTimeout(() => loadBookings(1), search ? 400 : 0);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeFilter, search]);

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
                        placeholder="Search trip ID or rider name"
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
                    <table className="w-full text-sm min-w-[650px]">
                        <thead>
                            <tr className="text-left text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Trip ID</th>
                                <th className="px-4 py-4 font-medium">Rider</th>
                                <th className="px-4 py-4 font-medium">Driver</th>
                                <th className="px-4 py-4 font-medium">Fare</th>
                                <th className="px-4 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i}>
                                        <td colSpan={6} className="px-6 py-4">
                                            <div className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                                        </td>
                                    </tr>
                                ))
                            ) : bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((b) => (
                                    <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{b.tripCode}</td>
                                        <td className="px-4 py-4 text-slate-600">{b.riderName}</td>
                                        <td className="px-4 py-4 text-slate-600">{b.driverId?.name || "—"}</td>
                                        <td className="px-4 py-4 font-semibold text-slate-900">₹{b.fare}</td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[b.status]}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-400">
                                            {new Date(b.createdAt).toLocaleString([], {
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
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
                            Page {pagination.page} of {pagination.pages} · {pagination.total} bookings
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.page <= 1}
                                onClick={() => loadBookings(pagination.page - 1)}
                                className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-40"
                            >
                                Prev
                            </button>
                            <button
                                disabled={pagination.page >= pagination.pages}
                                onClick={() => loadBookings(pagination.page + 1)}
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