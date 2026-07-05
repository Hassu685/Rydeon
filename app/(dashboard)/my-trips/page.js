"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Filter, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

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

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (isToday) return `Today, ${time}`;
    if (isYesterday) return `Yesterday, ${time}`;
    return `${date.toLocaleDateString([], { month: "short", day: "numeric" })}, ${time}`;
}

export default function MyTripsPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");
    const [trips, setTrips] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);

    const loadTrips = useCallback(async (pageNum, filter, replace) => {
        try {
            if (replace) setLoading(true);
            else setLoadingMore(true);

            const params = new URLSearchParams({ page: String(pageNum), limit: "10" });
            if (filter !== "All") params.set("status", filter);

            const data = await apiFetch(`/api/trips?${params.toString()}`);

            setTrips((prev) => (replace ? data.trips : [...prev, ...data.trips]));
            setTotalPages(data.pagination?.totalPages || 1);
            setPage(pageNum);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, []);

    // Reload from page 1 whenever the status filter changes
    useEffect(() => {
        loadTrips(1, activeFilter, true);
    }, [activeFilter, loadTrips]);

    const searchedTrips = trips.filter((t) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            t.tripCode?.toLowerCase().includes(q) ||
            t.riderName?.toLowerCase().includes(q)
        );
    });

    return (
        <>
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Filters + search */}
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
                        placeholder="Search trip ID or rider"
                        className="w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                    />
                </div>
            </motion.div>

            {/* Trip cards */}
            <div className="grid gap-4">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-24 rounded-2xl bg-white border border-slate-200 animate-pulse" />
                    ))
                ) : searchedTrips.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        <Filter className="h-8 w-8 mx-auto mb-3" />
                        No trips found{search ? " for this search" : " for this filter"}.
                    </div>
                ) : (
                    searchedTrips.map((trip, i) => (
                        <motion.div
                            key={trip._id}
                            initial="hidden"
                            animate="show"
                            variants={fadeUp}
                            custom={i + 1}
                            className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                        <MapPin className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="font-semibold text-slate-900">{trip.riderName}</p>
                                            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[trip.status]}`}>
                                                {trip.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">
                                            {trip.pickup} → {trip.drop}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            {trip.tripCode}
                                            {trip.distanceKm ? ` · ${trip.distanceKm} km` : ""} · {formatDate(trip.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-left sm:text-right">
                                    <p className="text-lg font-bold text-slate-900">₹{trip.fare}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Load more */}
            {!loading && !search && page < totalPages && (
                <div className="flex justify-center">
                    <button
                        onClick={() => loadTrips(page + 1, activeFilter, false)}
                        disabled={loadingMore}
                        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors disabled:opacity-50"
                    >
                        {loadingMore && <Loader2 className="h-4 w-4 animate-spin" />}
                        {loadingMore ? "Loading…" : "Load more trips"}
                    </button>
                </div>
            )}
        </>
    );
}