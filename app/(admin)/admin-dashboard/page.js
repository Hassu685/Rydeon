"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    Users,
    Car,
    Wallet,
    ClipboardList,
    TrendingUp,
    TrendingDown,
    Minus,
    ChevronRight,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
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

function TrendBadge({ pct }) {
    if (pct === null || pct === undefined) {
        return (
            <span className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-400">
                <Minus className="h-3 w-3" />
                No prior-week data yet
            </span>
        );
    }
    const positive = pct >= 0;
    return (
        <span className={`mt-2 flex items-center gap-1 text-xs font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {positive ? "+" : ""}{pct}% vs last week
        </span>
    );
}

export default function AdminOverviewPage() {
    const [data, setData] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const analytics = await adminApiFetch("/api/admin/analytics?days=7");
                if (!cancelled) setData(analytics);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        async function loadBookings() {
            try {
                const res = await adminApiFetch("/api/admin/trips?limit=4");
                if (!cancelled) setBookings(res.trips || []);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setBookingsLoading(false);
            }
        }

        load();
        loadBookings();
        return () => {
            cancelled = true;
        };
    }, []);

    const statCards = data
        ? [
            {
                label: "Total Revenue (all-time)",
                value: `₹${data.totals.totalRevenue.toLocaleString()}`,
                icon: Wallet,
                trendPct: data.weekOverWeek.revenueChangePct,
            },
            {
                label: "Active Drivers",
                value: data.totals.activeDrivers.toLocaleString(),
                icon: Car,
                customTrend: `+${data.totals.newDriversThisWeek} joined this week`,
            },
            {
                label: "Unique Riders (by name)",
                value: data.totals.distinctRiderNames.toLocaleString(),
                icon: Users,
                customTrend: "Approximate — riders aren't user accounts yet",
            },
            {
                label: "Completed Trips (all-time)",
                value: data.totals.totalCompletedTrips.toLocaleString(),
                icon: ClipboardList,
                trendPct: data.weekOverWeek.tripsChangePct,
            },
        ]
        : [];

    return (
        <>
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm animate-pulse h-32" />
                    ))
                    : statCards.map((stat, i) => {
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
                                {stat.customTrend ? (
                                    <span className="mt-2 block text-xs font-medium text-slate-400">
                                        {stat.customTrend}
                                    </span>
                                ) : (
                                    <TrendBadge pct={stat.trendPct} />
                                )}
                            </motion.div>
                        );
                    })}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-3 gap-6">
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    custom={4}
                    className="lg:col-span-2 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900">Platform Revenue</h3>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Last 7 days</p>
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
                                <AreaChart data={data.dailyTrend}>
                                    <defs>
                                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(15,23,42,.08)" }}
                                        formatter={(value) => [`₹${value.toLocaleString()}`, "Revenue"]}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={2.5} fill="url(#revenueGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                {/* Top drivers */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    custom={5}
                    className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
                >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5">Top Drivers</h3>

                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                            ))}
                        </div>
                    ) : data.topDrivers.length === 0 ? (
                        <p className="text-sm text-slate-400 py-6 text-center">No drivers yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {data.topDrivers.map((d, i) => (
                                <div key={d._id} className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900 truncate">{d.name}</p>
                                        <p className="text-xs text-slate-500">
                                            {d.totalTrips} rides · {d.rating?.toFixed(2)}★
                                        </p>
                                    </div>
                                    <p className="text-xs font-semibold text-slate-700">
                                        ₹{d.totalEarnings.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && (
                        <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                            <p className="text-sm font-semibold">Platform snapshot 📊</p>
                            <p className="text-xs text-blue-100 mt-1">
                                {data.totals.activeDrivers} active drivers · {data.totals.suspendedDrivers} suspended
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Recent bookings */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={6}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-slate-100">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Recent Bookings</h3>
                    <a href="/bookings" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
                        View all
                        <ChevronRight className="h-4 w-4" />
                    </a>
                </div>

                {bookingsLoading ? (
                    <div className="p-6 space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : bookings.length === 0 ? (
                    <p className="p-8 text-center text-sm text-slate-400">No bookings yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm min-w-[600px]">
                            <thead>
                                <tr className="text-left text-slate-400 text-xs uppercase tracking-wider">
                                    <th className="px-7 py-3 font-medium">Trip ID</th>
                                    <th className="px-4 py-3 font-medium">Rider</th>
                                    <th className="px-4 py-3 font-medium">Driver</th>
                                    <th className="px-4 py-3 font-medium">Fare</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-7 py-3 font-medium text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bookings.map((b) => (
                                    <tr key={b._id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="px-7 py-4 font-medium text-slate-900">{b.tripCode}</td>
                                        <td className="px-4 py-4 text-slate-600">{b.riderName}</td>
                                        <td className="px-4 py-4 text-slate-600">{b.driverId?.name || "—"}</td>
                                        <td className="px-4 py-4 font-semibold text-slate-900">₹{b.fare}</td>
                                        <td className="px-4 py-4">
                                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[b.status]}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-7 py-4 text-right text-slate-400">
                                            {new Date(b.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </>
    );
}