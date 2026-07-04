"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Car,
    Wallet,
    Star,
    MapPin,
    Navigation,
    Clock,
    TrendingUp,
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

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

const earningsData = [
    { day: "Mon", earnings: 1200 },
    { day: "Tue", earnings: 1850 },
    { day: "Wed", earnings: 1400 },
    { day: "Thu", earnings: 2100 },
    { day: "Fri", earnings: 2600 },
    { day: "Sat", earnings: 3200 },
    { day: "Sun", earnings: 2450 },
];

const recentTrips = [
    { id: "TRP-8823", rider: "Ayesha Khan", pickup: "Gulberg III", drop: "DHA Phase 5", fare: "₹340", status: "Completed", time: "10:24 AM" },
    { id: "TRP-8822", rider: "Bilal Ahmed", pickup: "Model Town", drop: "Johar Town", fare: "₹210", status: "Completed", time: "09:10 AM" },
    { id: "TRP-8821", rider: "Sara Malik", pickup: "Liberty Market", drop: "Wapda Town", fare: "₹280", status: "Cancelled", time: "08:45 AM" },
    { id: "TRP-8820", rider: "Usman Tariq", pickup: "Iqbal Town", drop: "Airport", fare: "₹520", status: "Completed", time: "07:58 AM" },
];

const statusStyles = {
    Completed: "bg-green-50 text-green-600",
    Cancelled: "bg-red-50 text-red-600",
    Ongoing: "bg-blue-50 text-blue-600",
};

export default function DriverDashboard() {
    const [online, setOnline] = useState(true);
    const [incomingRide, setIncomingRide] = useState(true);

    return (
        <>
            {/* Online toggle */}
            <div className="flex justify-end -mt-2 sm:-mt-4">
                <button
                    onClick={() => setOnline(!online)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300 ${
                        online ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-500"
                    }`}
                >
                    <span
                        className={`h-2 w-2 rounded-full ${
                            online ? "bg-green-500 animate-pulse" : "bg-slate-400"
                        }`}
                    />
                    {online ? "You're Online" : "You're Offline"}
                </button>
            </div>

            {/* Incoming ride request */}
            <AnimatePresence>
                {incomingRide && online && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 sm:p-7 text-white shadow-xl shadow-blue-900/20"
                    >
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md">
                                    <Navigation className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                                        New Ride Request
                                    </p>
                                    <p className="mt-1 font-bold text-lg">Ayesha Khan</p>
                                    <p className="text-sm text-blue-100 flex items-center gap-1.5 mt-0.5">
                                        <MapPin className="h-3.5 w-3.5" />
                                        Gulberg III → DHA Phase 5 · 2.3 km
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right mr-1 hidden sm:block">
                                    <p className="text-2xl font-bold">₹340</p>
                                    <p className="text-xs text-blue-100">Est. fare</p>
                                </div>
                                <button
                                    onClick={() => setIncomingRide(false)}
                                    className="rounded-full bg-white/15 hover:bg-white/25 px-5 py-2.5 text-sm font-semibold transition-colors"
                                >
                                    Decline
                                </button>
                                <button
                                    onClick={() => setIncomingRide(false)}
                                    className="rounded-full bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 text-sm font-semibold transition-colors shadow-lg"
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: "Today's Earnings", value: "₹2,450", icon: Wallet, trend: "+12.5%", positive: true },
                    { label: "Total Trips", value: "8", icon: Car, trend: "+2 vs yesterday", positive: true },
                    { label: "Rating", value: "4.92", icon: Star, trend: "Top 5% drivers", positive: true },
                    { label: "Online Hours", value: "6h 20m", icon: Clock, trend: "Goal: 8h", positive: false },
                ].map((stat, i) => {
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
                            className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-lg hover:shadow-blue-600/5 hover:border-blue-200 transition-colors duration-300"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-blue-50">
                                    <Icon className="h-5 w-5 text-blue-600" />
                                </div>
                            </div>
                            <p className="mt-4 text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-xs sm:text-sm text-slate-500">{stat.label}</p>
                            <p className={`mt-2 text-xs font-medium ${stat.positive ? "text-green-600" : "text-slate-400"}`}>
                                {stat.trend}
                            </p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Chart + Performance */}
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
                            <h3 className="text-base sm:text-lg font-bold text-slate-900">Weekly Earnings</h3>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Your earnings for the past 7 days</p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold px-3 py-1.5">
                            <TrendingUp className="h-3.5 w-3.5" />
                            +18.2%
                        </span>
                    </div>

                    <div className="h-64 sm:h-72 -ml-3 sm:ml-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={earningsData}>
                                <defs>
                                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
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
                                <Area type="monotone" dataKey="earnings" stroke="#4F46E5" strokeWidth={2.5} fill="url(#earningsGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    custom={5}
                    className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm flex flex-col"
                >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5">Performance</h3>

                    <div className="space-y-5 flex-1">
                        {[
                            { label: "Acceptance Rate", value: 94, color: "bg-blue-600" },
                            { label: "Completion Rate", value: 98, color: "bg-green-500" },
                            { label: "Cancellation Rate", value: 3, color: "bg-red-400" },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex items-center justify-between text-sm mb-1.5">
                                    <span className="text-slate-600">{item.label}</span>
                                    <span className="font-semibold text-slate-900">{item.value}%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
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

                    <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                        <p className="text-sm font-semibold">Keep it up! 🎉</p>
                        <p className="text-xs text-blue-100 mt-1">You're in the top 5% of drivers this week.</p>
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
                <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-slate-100">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Recent Trips</h3>
                    <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
                        View all
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

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
                                <tr key={trip.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-7 py-4 font-medium text-slate-900">{trip.id}</td>
                                    <td className="px-4 py-4 text-slate-600">{trip.rider}</td>
                                    <td className="px-4 py-4 text-slate-500">{trip.pickup} → {trip.drop}</td>
                                    <td className="px-4 py-4 font-semibold text-slate-900">{trip.fare}</td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[trip.status]}`}>
                                            {trip.status}
                                        </span>
                                    </td>
                                    <td className="px-7 py-4 text-right text-slate-400">{trip.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="sm:hidden divide-y divide-slate-100">
                    {recentTrips.map((trip) => (
                        <div key={trip.id} className="p-4">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-slate-900 text-sm">{trip.rider}</p>
                                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[trip.status]}`}>
                                    {trip.status}
                                </span>
                            </div>
                            <p className="mt-1.5 text-xs text-slate-500">{trip.pickup} → {trip.drop}</p>
                            <div className="mt-2 flex items-center justify-between text-xs">
                                <span className="text-slate-400">{trip.time}</span>
                                <span className="font-bold text-slate-900">{trip.fare}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </>
    );
}