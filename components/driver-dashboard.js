"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Car,
    Wallet,
    Star,
    MapPin,
    Navigation,
    TrendingUp,
    ChevronRight,
    ClipboardList,
    CheckCircle2,
    XCircle,
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
import { apiFetch } from "@/lib/api";
import { useDriver } from "@/contexts/drivercontext";

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

export default function DriverDashboard() {
    const { online, setOnline } = useDriver();

    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [incomingRide, setIncomingRide] = useState(null);
    const [rideActionLoading, setRideActionLoading] = useState(false);
    const [recentTrips, setRecentTrips] = useState([]);
    const [tripsLoading, setTripsLoading] = useState(true);
    const [ongoingTrip, setOngoingTrip] = useState(null);
    const [tripActionLoading, setTripActionLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadStats = useCallback(async () => {
        try {
            const data = await apiFetch("/api/driver/stats");
            setStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setStatsLoading(false);
        }
    }, []);

    const loadRecentTrips = useCallback(async () => {
        try {
            const data = await apiFetch("/api/trips?limit=4");
            setRecentTrips(data.trips || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setTripsLoading(false);
        }
    }, []);

    const loadOngoingTrip = useCallback(async () => {
        try {
            const data = await apiFetch("/api/trips?status=Ongoing&limit=1");
            setOngoingTrip(data.trips?.[0] || null);
        } catch (err) {
            setError(err.message);
        }
    }, []);

    async function refreshAll() {
        loadStats();
        loadRecentTrips();
        loadOngoingTrip();
    }

    useEffect(() => {
        refreshAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!online) {
            setIncomingRide(null);
            return;
        }

        let cancelled = false;

        async function poll() {
            try {
                const data = await apiFetch("/api/ride-requests?status=pending");
                if (!cancelled && data.requests?.length) {
                    setIncomingRide((current) => current || data.requests[0]);
                }
            } catch {
                // Silently ignore poll failures — the next tick will retry.
            }
        }

        poll();
        const interval = setInterval(poll, 5000);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, [online]);

    async function handleRideAction(action) {
        if (!incomingRide) return;
        setRideActionLoading(true);
        try {
            await apiFetch(`/api/ride-requests/${incomingRide._id}`, {
                method: "PUT",
                body: JSON.stringify({ action }),
            });
            setIncomingRide(null);
            refreshAll();
        } catch (err) {
            setError(err.message);
        } finally {
            setRideActionLoading(false);
        }
    }

    async function handleTripAction(newStatus) {
        if (!ongoingTrip) return;
        setTripActionLoading(true);
        try {
            await apiFetch(`/api/trips/${ongoingTrip._id}`, {
                method: "PUT",
                body: JSON.stringify({ status: newStatus }),
            });
            setOngoingTrip(null);
            refreshAll();
        } catch (err) {
            setError(err.message);
        } finally {
            setTripActionLoading(false);
        }
    }

    const statCards = stats
        ? [
            { label: "Today's Earnings", value: `₹${(stats.todaysEarnings ?? 0).toLocaleString()}`, icon: Wallet },
            { label: "Today's Trips", value: String(stats.todaysTripCount ?? 0), icon: Car },
            { label: "Rating", value: stats.rating != null ? stats.rating.toFixed(2) : "—", icon: Star },
            { label: "Total Trips (all time)", value: String(stats.totalTrips ?? 0), icon: ClipboardList },
        ]
        : [];

    return (
        <>
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 sm:px-5 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Online toggle */}
            <div className="flex justify-end -mt-2 sm:-mt-4">
                <button
                    onClick={() => setOnline(!online)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-colors duration-300 ${online ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
                        }`}
                >
                    <span
                        className={`h-2 w-2 rounded-full shrink-0 ${online ? "bg-green-500 animate-pulse" : "bg-slate-400"
                            }`}
                    />
                    {online ? "You're Online" : "You're Offline"}
                </button>
            </div>

            {/* Incoming ride request */}
            <AnimatePresence>
                {incomingRide && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-7 text-white shadow-xl shadow-blue-900/20"
                    >
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                        <div className="relative flex flex-col gap-4 sm:gap-5">
                            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                                    <Navigation className="h-5 w-5 sm:h-6 sm:w-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-100">
                                        New Ride Request
                                    </p>
                                    <p className="mt-0.5 sm:mt-1 font-bold text-base sm:text-lg truncate">
                                        {incomingRide.riderName}
                                    </p>
                                    <p className="text-xs sm:text-sm text-blue-100 flex items-center gap-1.5 mt-0.5">
                                        <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                        <span className="truncate">
                                            {incomingRide.pickup} → {incomingRide.drop}
                                            {incomingRide.distanceKm ? ` · ${incomingRide.distanceKm} km` : ""}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold">₹{incomingRide.estimatedFare}</p>
                                    <p className="text-[10px] sm:text-xs text-blue-100">Est. fare</p>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <button
                                        disabled={rideActionLoading}
                                        onClick={() => handleRideAction("decline")}
                                        className="rounded-full bg-white/15 hover:bg-white/25 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        disabled={rideActionLoading}
                                        onClick={() => handleRideAction("accept")}
                                        className="rounded-full bg-white text-blue-700 hover:bg-blue-50 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-colors shadow-lg disabled:opacity-50 whitespace-nowrap"
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Ongoing trip */}
            <AnimatePresence>
                {ongoingTrip && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-blue-200 bg-blue-50/50 p-4 sm:p-7"
                    >
                        <div className="flex flex-col gap-4 sm:gap-5">
                            <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                <div className="flex h-11 w-11 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-100">
                                    <Car className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-600 truncate">
                                        Ongoing Trip · {ongoingTrip.tripCode}
                                    </p>
                                    <p className="mt-0.5 sm:mt-1 font-bold text-base sm:text-lg text-slate-900 truncate">
                                        {ongoingTrip.riderName}
                                    </p>
                                    <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                                        <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                        <span className="truncate">
                                            {ongoingTrip.pickup} → {ongoingTrip.drop}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                <div>
                                    <p className="text-xl sm:text-2xl font-bold text-slate-900">₹{ongoingTrip.fare}</p>
                                    <p className="text-[10px] sm:text-xs text-slate-500">Fare</p>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <button
                                        disabled={tripActionLoading}
                                        onClick={() => handleTripAction("Cancelled")}
                                        className="flex items-center gap-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-600 px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
                                    >
                                        <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        Cancel
                                    </button>
                                    <button
                                        disabled={tripActionLoading}
                                        onClick={() => handleTripAction("Completed")}
                                        className="flex items-center gap-1.5 rounded-full bg-green-600 hover:bg-green-700 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-colors shadow-lg disabled:opacity-50 whitespace-nowrap"
                                    >
                                        <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                        <span className="hidden xs:inline">Complete Trip</span>
                                        <span className="xs:hidden">Complete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                {statsLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm animate-pulse h-28 sm:h-32"
                        />
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
                                className="rounded-2xl bg-white border border-slate-200 p-3.5 sm:p-5 shadow-sm hover:shadow-lg hover:shadow-blue-600/5 hover:border-blue-200 transition-colors duration-300"
                            >
                                <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-blue-50">
                                    <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5 text-blue-600" />
                                </div>
                                <p className="mt-3 sm:mt-4 text-lg sm:text-2xl font-bold text-slate-900 truncate">
                                    {stat.value}
                                </p>
                                <p className="text-[11px] sm:text-sm text-slate-500 truncate">{stat.label}</p>
                            </motion.div>
                        );
                    })}
            </div>

            {/* Chart + Performance */}
            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    custom={4}
                    className="lg:col-span-2 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-4 sm:p-7 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
                        <div className="min-w-0">
                            <h3 className="text-sm sm:text-lg font-bold text-slate-900">Weekly Earnings</h3>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5 truncate">Your earnings for the past 7 days</p>
                        </div>
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-green-50 text-green-600 text-[10px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1 sm:py-1.5">
                            <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                            Live
                        </span>
                    </div>

                    <div className="h-52 sm:h-72 -ml-3 sm:ml-0">
                        {statsLoading ? (
                            <div className="h-full w-full animate-pulse bg-slate-100 rounded-xl" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.weeklyEarnings || []}>
                                    <defs>
                                        <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 11 }} tickFormatter={(v) => `₹${v}`} width={40} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(15,23,42,.08)" }}
                                        formatter={(value) => [`₹${value}`, "Earnings"]}
                                    />
                                    <Area type="monotone" dataKey="earnings" stroke="#4F46E5" strokeWidth={2.5} fill="url(#earningsGradient)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    custom={5}
                    className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-4 sm:p-7 shadow-sm flex flex-col"
                >
                    <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-4 sm:mb-5">Performance</h3>

                    <div className="space-y-4 sm:space-y-5 flex-1">
                        {[
                            { label: "Acceptance Rate", value: stats?.performance?.acceptanceRate ?? 0, color: "bg-blue-600" },
                            { label: "Completion Rate", value: stats?.performance?.completionRate ?? 0, color: "bg-green-500" },
                            { label: "Cancellation Rate", value: stats?.performance?.cancellationRate ?? 0, color: "bg-red-400" },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                                    <span className="text-slate-600">{item.label}</span>
                                    <span className="font-semibold text-slate-900">{item.value}%</span>
                                </div>
                                <div className="h-1.5 sm:h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.value}%` }}
                                        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                                        className={`h-full rounded-full ${item.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-5 sm:mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-3.5 sm:p-4 text-white">
                        <p className="text-xs sm:text-sm font-semibold">Total Earnings 💰</p>
                        <p className="text-[11px] sm:text-xs text-blue-100 mt-1">
                            ₹{(stats?.totalEarnings ?? 0).toLocaleString()} earned all-time.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Recent trips */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={6}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="flex items-center justify-between px-4 sm:px-7 py-4 sm:py-5 border-b border-slate-100">
                    <h3 className="text-sm sm:text-lg font-bold text-slate-900">Recent Trips</h3>
                    <a href="/my-trips" className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap">
                        View all
                        <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </a>
                </div>

                {tripsLoading ? (
                    <div className="p-4 sm:p-6 space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-10 rounded-lg bg-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : recentTrips.length === 0 ? (
                    <p className="p-6 sm:p-8 text-center text-sm text-slate-400">No trips yet.</p>
                ) : (
                    <>
                        <div className="hidden sm:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-slate-400 text-xs uppercase tracking-wider">
                                        <th className="px-7 py-3 font-medium">Trip</th>
                                        <th className="px-4 py-3 font-medium">Rider</th>
                                        <th className="px-4 py-3 font-medium">Route</th>
                                        <th className="px-4 py-3 font-medium">Fare</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-7 py-3 font-medium text-right">Time</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentTrips.map((trip) => (
                                        <tr key={trip._id} className="hover:bg-slate-50/60 transition-colors">
                                            <td className="px-7 py-4 font-medium text-slate-900">{trip.tripCode}</td>
                                            <td className="px-4 py-4 text-slate-600">{trip.riderName}</td>
                                            <td className="px-4 py-4 text-slate-500">{trip.pickup} → {trip.drop}</td>
                                            <td className="px-4 py-4 font-semibold text-slate-900">₹{trip.fare}</td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[trip.status]}`}>
                                                    {trip.status}
                                                </span>
                                            </td>
                                            <td className="px-7 py-4 text-right text-slate-400">
                                                {new Date(trip.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="sm:hidden divide-y divide-slate-100">
                            {recentTrips.map((trip) => (
                                <div key={trip._id} className="p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-semibold text-slate-900 text-sm truncate">{trip.riderName}</p>
                                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[trip.status]}`}>
                                            {trip.status}
                                        </span>
                                    </div>
                                    <p className="mt-1.5 text-xs text-slate-500 truncate">{trip.pickup} → {trip.drop}</p>
                                    <div className="mt-2 flex items-center justify-between text-xs">
                                        <span className="text-slate-400">
                                            {new Date(trip.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                        <span className="font-bold text-slate-900">₹{trip.fare}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </motion.div>
        </>
    );
}