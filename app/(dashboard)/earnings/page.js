"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, Clock, Calendar, Inbox } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { apiFetch } from "@/lib/api";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

export default function EarningsPage() {
    const [stats, setStats] = useState(null);
    const [completedTrips, setCompletedTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const [statsData, tripsData] = await Promise.all([
                    apiFetch("/api/driver/stats"),
                    // Pull a large-ish recent batch of completed trips so we can
                    // derive "this month" client-side — there's no dedicated
                    // monthly-earnings endpoint on the backend yet.
                    apiFetch("/api/trips?status=Completed&limit=100"),
                ]);
                if (cancelled) return;
                setStats(statsData);
                setCompletedTrips(tripsData.trips || []);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const derived = useMemo(() => {
        if (!stats) return null;

        const thisWeek = stats.weeklyEarnings.reduce((sum, d) => sum + d.earnings, 0);

        const now = new Date();
        const thisMonth = completedTrips
            .filter((t) => {
                const d = new Date(t.createdAt);
                return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            })
            .reduce((sum, t) => sum + (t.fare || 0), 0);

        const avgPerTrip =
            stats.totalTrips > 0 ? Math.round(stats.totalEarnings / stats.totalTrips) : 0;

        return { thisWeek, thisMonth, avgPerTrip };
    }, [stats, completedTrips]);

    const summaryCards = derived
        ? [
            { label: "This Week", value: `₹${derived.thisWeek.toLocaleString()}`, icon: Wallet },
            { label: "This Month", value: `₹${derived.thisMonth.toLocaleString()}`, icon: Calendar },
            { label: "Avg. Per Trip", value: `₹${derived.avgPerTrip.toLocaleString()}`, icon: TrendingUp },
            { label: "All-Time Total", value: `₹${(stats.totalEarnings || 0).toLocaleString()}`, icon: Wallet },
        ]
        : [];

    return (
        <>
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm animate-pulse h-28"
                        />
                    ))
                    : summaryCards.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial="hidden"
                                animate="show"
                                variants={fadeUp}
                                custom={i}
                                whileHover={{ y: -4 }}
                                transition={{ type: "spring", stiffness: 240, damping: 20 }}
                                className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-lg hover:border-blue-200 transition-colors duration-300"
                            >
                                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-blue-50">
                                    <Icon className="h-5 w-5 text-blue-600" />
                                </div>
                                <p className="mt-4 text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</p>
                                <p className="text-xs sm:text-sm text-slate-500">{stat.label}</p>
                            </motion.div>
                        );
                    })}
            </div>

            {/* Chart */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={4}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">Earnings Trend</h3>
                        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Last 7 days breakdown</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold px-3 py-1.5">
                        <TrendingUp className="h-3.5 w-3.5" />
                        Live
                    </span>
                </div>

                <div className="h-64 sm:h-72 -ml-3 sm:ml-0">
                    {loading ? (
                        <div className="h-full w-full animate-pulse bg-slate-100 rounded-xl" />
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.weeklyEarnings || []}>
                                <defs>
                                    <linearGradient id="earningsGradient2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(15,23,42,.08)" }}
                                    formatter={(value) => [`₹${value}`, "Earnings"]}
                                />
                                <Area type="monotone" dataKey="earnings" stroke="#4F46E5" strokeWidth={2.5} fill="url(#earningsGradient2)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </motion.div>

            {/* Recent completed trips (stand-in for payout history — no payouts backend yet) */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={5}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-slate-100">
                    <div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">Payout History</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Payouts aren't tracked in the backend yet — showing your recent completed trips instead.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="p-6 space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : completedTrips.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-14 text-slate-400">
                        <Inbox className="h-8 w-8 mb-3" />
                        <p className="text-sm">No completed trips yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {completedTrips.slice(0, 8).map((t) => (
                            <div key={t._id} className="flex items-center justify-between px-5 sm:px-7 py-4">
                                <div>
                                    <p className="font-medium text-slate-900 text-sm">{t.tripCode}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {new Date(t.createdAt).toLocaleDateString([], {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1 rounded-full bg-green-50 text-green-600 px-3 py-1 text-xs font-semibold">
                                        <Clock className="h-3 w-3" />
                                        {t.status}
                                    </span>
                                    <p className="font-bold text-slate-900 w-20 text-right">₹{t.fare}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </>
    );
}