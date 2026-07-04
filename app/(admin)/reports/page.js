"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Users, Car } from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

const monthlyGrowth = [
    { month: "Jan", riders: 18000, drivers: 780 },
    { month: "Feb", riders: 19500, drivers: 850 },
    { month: "Mar", riders: 21200, drivers: 920 },
    { month: "Apr", riders: 23800, drivers: 1010 },
    { month: "May", riders: 26100, drivers: 1150 },
    { month: "Jun", riders: 28940, drivers: 1284 },
];

const rideTypeShare = [
    { name: "Economy", value: 42, color: "#4F46E5" },
    { name: "Bike", value: 24, color: "#6366F1" },
    { name: "Rickshaw", value: 16, color: "#818CF8" },
    { name: "Premium", value: 12, color: "#A5B4FC" },
    { name: "Courier", value: 6, color: "#C7D2FE" },
];

export default function AdminReportsPage() {
    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: "Monthly Revenue", value: "₹4.2M", icon: DollarSign },
                    { label: "New Riders", value: "2,840", icon: Users },
                    { label: "New Drivers", value: "134", icon: Car },
                    { label: "Growth Rate", value: "+18.2%", icon: TrendingUp },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial="hidden"
                            animate="show"
                            variants={fadeUp}
                            custom={i}
                            className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm"
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

            <div className="grid lg:grid-cols-3 gap-6">
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    custom={4}
                    className="lg:col-span-2 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
                >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-6">
                        Rider & Driver Growth
                    </h3>
                    <div className="h-64 sm:h-72 -ml-3 sm:ml-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(15,23,42,.08)" }}
                                />
                                <Line type="monotone" dataKey="riders" stroke="#4F46E5" strokeWidth={2.5} dot={false} name="Riders" />
                                <Line type="monotone" dataKey="drivers" stroke="#22C55E" strokeWidth={2.5} dot={false} name="Drivers" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-xs">
                        <span className="flex items-center gap-1.5 text-slate-500">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#4F46E5]" /> Riders
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-500">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" /> Drivers
                        </span>
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    custom={5}
                    className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm"
                >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-6">Ride Type Share</h3>
                    <div className="h-52">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={rideTypeShare}
                                    dataKey="value"
                                    nameKey="name"
                                    innerRadius={55}
                                    outerRadius={80}
                                    paddingAngle={2}
                                >
                                    {rideTypeShare.map((entry, i) => (
                                        <Cell key={i} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0" }}
                                    formatter={(value, name) => [`${value}%`, name]}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                        {rideTypeShare.map((r) => (
                            <div key={r.name} className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 text-slate-600">
                                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                                    {r.name}
                                </span>
                                <span className="font-semibold text-slate-900">{r.value}%</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </>
    );
}