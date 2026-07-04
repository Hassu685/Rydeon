"use client";

import { motion } from "framer-motion";
import { Wallet, TrendingUp, Download, Calendar } from "lucide-react";
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

const payouts = [
    { id: "PO-4521", date: "July 1, 2026", amount: "₹18,250", status: "Paid" },
    { id: "PO-4498", date: "June 24, 2026", amount: "₹16,900", status: "Paid" },
    { id: "PO-4467", date: "June 17, 2026", amount: "₹19,400", status: "Paid" },
    { id: "PO-4433", date: "June 10, 2026", amount: "₹15,600", status: "Paid" },
];

export default function EarningsPage() {
    return (
        <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                    { label: "This Week", value: "₹14,800", icon: Wallet },
                    { label: "This Month", value: "₹58,240", icon: Calendar },
                    { label: "Avg. Per Trip", value: "₹285", icon: TrendingUp },
                    { label: "Pending Payout", value: "₹4,120", icon: Download },
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
                        +18.2%
                    </span>
                </div>

                <div className="h-64 sm:h-72 -ml-3 sm:ml-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={earningsData}>
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
                </div>
            </motion.div>

            {/* Payout history */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={5}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="flex items-center justify-between px-5 sm:px-7 py-5 border-b border-slate-100">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Payout History</h3>
                </div>

                <div className="divide-y divide-slate-100">
                    {payouts.map((p) => (
                        <div key={p.id} className="flex items-center justify-between px-5 sm:px-7 py-4">
                            <div>
                                <p className="font-medium text-slate-900 text-sm">{p.id}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{p.date}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="rounded-full bg-green-50 text-green-600 px-3 py-1 text-xs font-semibold">
                                    {p.status}
                                </span>
                                <p className="font-bold text-slate-900 w-20 text-right">{p.amount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </>
    );
}