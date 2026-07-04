"use client";

import { motion } from "framer-motion";
import {
    Users,
    Car,
    Wallet,
    ClipboardList,
    TrendingUp,
    TrendingDown,
    ChevronRight,
    ShieldAlert,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    BarChart,
    Bar,
} from "recharts";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

const revenueData = [
    { day: "Mon", revenue: 42000 },
    { day: "Tue", revenue: 51000 },
    { day: "Wed", revenue: 47500 },
    { day: "Thu", revenue: 58000 },
    { day: "Fri", revenue: 67000 },
    { day: "Sat", revenue: 82000 },
    { day: "Sun", revenue: 71000 },
];

const rideTypeData = [
    { type: "Bike", rides: 1240 },
    { type: "Economy", rides: 2380 },
    { type: "Premium", rides: 860 },
    { type: "Courier", rides: 540 },
    { type: "Rickshaw", rides: 990 },
];

const recentBookings = [
    { id: "TRP-9021", rider: "Ayesha Khan", driver: "Hamza Khan", fare: "₹340", status: "Completed", time: "10:24 AM" },
    { id: "TRP-9020", rider: "Bilal Ahmed", driver: "Tariq Mehmood", fare: "₹210", status: "Ongoing", time: "10:10 AM" },
    { id: "TRP-9019", rider: "Sara Malik", driver: "Kashif Iqbal", fare: "₹280", status: "Cancelled", time: "09:45 AM" },
    { id: "TRP-9018", rider: "Usman Tariq", driver: "Fahad Ali", fare: "₹520", status: "Completed", time: "09:20 AM" },
];

const topDrivers = [
    { name: "Hamza Khan", rides: 312, rating: 4.92 },
    { name: "Tariq Mehmood", rides: 289, rating: 4.88 },
    { name: "Kashif Iqbal", rides: 267, rating: 4.85 },
];

const statusStyles = {
    Completed: "bg-green-50 text-green-600",
    Cancelled: "bg-red-50 text-red-600",
    Ongoing: "bg-blue-50 text-blue-600",
};

export default function AdminOverviewPage() {
    return (
        <>
            {/* Pending approvals alert */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={0}
                className="flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4"
            >
                <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
                    <p className="text-sm text-amber-800">
                        <span className="font-semibold">7 driver applications</span> are pending approval.
                    </p>
                </div>
                <button className="shrink-0 flex items-center gap-1 text-sm font-semibold text-amber-700 hover:text-amber-900">
                    Review
                    <ChevronRight className="h-4 w-4" />
                </button>
            </motion.div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: "Total Revenue", value: "₹4.2M", icon: Wallet, trend: "+14.2%", positive: true },
                    { label: "Active Drivers", value: "1,284", icon: Car, trend: "+38 this week", positive: true },
                    { label: "Total Riders", value: "28,940", icon: Users, trend: "+2.1K this month", positive: true },
                    { label: "Total Rides", value: "6,012", icon: ClipboardList, trend: "-3.4% vs last week", positive: false },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial="hidden"
                            animate="show"
                            variants={fadeUp}
                            custom={i + 1}
                            whileHover={{ y: -4 }}
                            transition={{ type: "spring", stiffness: 240, damping: 20 }}
                            className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-lg hover:border-blue-200 transition-colors duration-300"
                        >
                            <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-blue-50">
                                <Icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <p className="mt-4 text-xl sm:text-2xl font-bold text-slate-900">{stat.value}</p>
                            <p className="text-xs sm:text-sm text-slate-500">{stat.label}</p>
                            <p className={`mt-2 flex items-center gap-1 text-xs font-medium ${stat.positive ? "text-green-600" : "text-red-500"}`}>
                                {stat.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {stat.trend}
                            </p>
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
                    custom={5}
                    className="lg:col-span-2 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900">Platform Revenue</h3>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Last 7 days</p>
                        </div>
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-600 text-xs font-semibold px-3 py-1.5">
                            <TrendingUp className="h-3.5 w-3.5" />
                            +14.2%
                        </span>
                    </div>

                    <div className="h-64 sm:h-72 -ml-3 sm:ml-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
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
                    </div>
                </motion.div>

                {/* Top drivers */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    custom={6}
                    className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
                >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5">Top Drivers</h3>
                    <div className="space-y-4">
                        {topDrivers.map((d, i) => (
                            <div key={d.name} className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold">
                                    {i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-slate-900 truncate">{d.name}</p>
                                    <p className="text-xs text-slate-500">{d.rides} rides · {d.rating}★</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                        <p className="text-sm font-semibold">Platform is growing 📈</p>
                        <p className="text-xs text-blue-100 mt-1">1,284 active drivers this week.</p>
                    </div>
                </motion.div>
            </div>

            {/* Ride type distribution */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={7}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
            >
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-6">Rides by Type</h3>
                <div className="h-56 sm:h-64 -ml-3 sm:ml-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={rideTypeData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="type" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(15,23,42,.08)" }}
                            />
                            <Bar dataKey="rides" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            {/* Recent bookings */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={8}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-slate-100">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Recent Bookings</h3>
                    <button className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
                        View all
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>

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
                            {recentBookings.map((b) => (
                                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-7 py-4 font-medium text-slate-900">{b.id}</td>
                                    <td className="px-4 py-4 text-slate-600">{b.rider}</td>
                                    <td className="px-4 py-4 text-slate-600">{b.driver}</td>
                                    <td className="px-4 py-4 font-semibold text-slate-900">{b.fare}</td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[b.status]}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-7 py-4 text-right text-slate-400">{b.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </>
    );
}