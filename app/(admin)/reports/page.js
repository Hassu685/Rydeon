"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Users, Car, Minus, PieChart as PieIcon } from "lucide-react";
import {
    LineChart,
    Line,
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

function TrendText({ pct }) {
    if (pct === null || pct === undefined) {
        return (
            <span className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-400">
                <Minus className="h-3 w-3" />
                No prior-month data yet
            </span>
        );
    }
    const positive = pct >= 0;
    return (
        <span className={`mt-2 flex items-center gap-1 text-xs font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
            {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {positive ? "+" : ""}{pct}% vs last month
        </span>
    );
}

export default function AdminReportsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        adminApiFetch("/api/admin/reports?months=6")
            .then((res) => {
                if (!cancelled) setData(res);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const statCards = data
        ? [
            {
                label: "Monthly Revenue",
                value: `₹${data.monthlyRevenue.toLocaleString()}`,
                icon: DollarSign,
                trendPct: data.revenueGrowthPct,
            },
            {
                label: "New Riders (approx.)",
                value: data.newRidersThisMonth.toLocaleString(),
                icon: Users,
                customTrend: "Based on first trip seen — not real accounts",
            },
            {
                label: "New Drivers",
                value: data.newDriversThisMonth.toLocaleString(),
                icon: Car,
                customTrend: "This month, real signups",
            },
            {
                label: "Revenue Growth",
                value:
                    data.revenueGrowthPct === null
                        ? "—"
                        : `${data.revenueGrowthPct >= 0 ? "+" : ""}${data.revenueGrowthPct}%`,
                icon: TrendingUp,
                customTrend: "Month over month",
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

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm animate-pulse h-28" />
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
                                className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-5 shadow-sm"
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
                                    <TrendText pct={stat.trendPct} />
                                )}
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
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                        Rider & Driver Growth
                    </h3>
                    <p className="text-xs text-slate-400 mb-6">
                        Cumulative totals by end of each month · riders approximated from trip history
                    </p>

                    <div className="h-64 sm:h-72 -ml-3 sm:ml-0">
                        {loading ? (
                            <div className="h-full w-full animate-pulse bg-slate-100 rounded-xl" />
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.monthlyGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(15,23,42,.08)" }}
                                    />
                                    <Line type="monotone" dataKey="riders" stroke="#4F46E5" strokeWidth={2.5} dot={false} name="Riders (approx.)" />
                                    <Line type="monotone" dataKey="drivers" stroke="#22C55E" strokeWidth={2.5} dot={false} name="Drivers" />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                    <div className="mt-4 flex items-center gap-6 text-xs">
                        <span className="flex items-center gap-1.5 text-slate-500">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#4F46E5]" /> Riders (approx.)
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-500">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#22C55E]" /> Drivers
                        </span>
                    </div>
                </motion.div>

                {/* Ride Type Share — no rideType field exists on Trip yet */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    custom={5}
                    className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm flex flex-col"
                >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-6">Ride Type Share</h3>
                    <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400">
                        <PieIcon className="h-8 w-8 mb-3" />
                        <p className="text-sm max-w-xs">
                            Trips don't record a ride type (Bike/Economy/Premium) yet — that field
                            would need to be added to the Trip model to show this breakdown.
                        </p>
                    </div>
                </motion.div>
            </div>
        </>
    );
}