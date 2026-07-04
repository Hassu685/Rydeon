"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, MoreVertical, CheckCircle2, XCircle } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

const drivers = [
    { name: "Hamza Khan", email: "hamza.khan@email.com", vehicle: "Suzuki Alto", rides: 312, rating: 4.92, status: "Active" },
    { name: "Tariq Mehmood", email: "tariq.m@email.com", vehicle: "Honda City", rides: 289, rating: 4.88, status: "Active" },
    { name: "Kashif Iqbal", email: "kashif.i@email.com", vehicle: "Yamaha YBR", rides: 267, rating: 4.85, status: "Active" },
    { name: "Fahad Ali", email: "fahad.ali@email.com", vehicle: "Toyota Corolla", rides: 198, rating: 4.7, status: "Suspended" },
    { name: "Zainab Rehman", email: "zainab.r@email.com", vehicle: "Suzuki Mehran", rides: 0, rating: 0, status: "Pending" },
    { name: "Bilal Haider", email: "bilal.h@email.com", vehicle: "Honda CD70", rides: 0, rating: 0, status: "Pending" },
];

const statusStyles = {
    Active: "bg-green-50 text-green-600",
    Suspended: "bg-red-50 text-red-600",
    Pending: "bg-amber-50 text-amber-600",
};

const filters = ["All", "Active", "Pending", "Suspended"];

export default function AdminDriversPage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered =
        activeFilter === "All" ? drivers : drivers.filter((d) => d.status === activeFilter);

    return (
        <>
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
                        placeholder="Search driver name or email"
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
                    <table className="w-full text-sm min-w-[700px]">
                        <thead>
                            <tr className="text-left text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Driver</th>
                                <th className="px-4 py-4 font-medium">Vehicle</th>
                                <th className="px-4 py-4 font-medium">Rides</th>
                                <th className="px-4 py-4 font-medium">Rating</th>
                                <th className="px-4 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((d) => (
                                <tr key={d.email} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold shrink-0">
                                                {d.name.split(" ").map((n) => n[0]).join("")}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-900 truncate">{d.name}</p>
                                                <p className="text-xs text-slate-400 truncate">{d.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-600">{d.vehicle}</td>
                                    <td className="px-4 py-4 text-slate-600">{d.rides}</td>
                                    <td className="px-4 py-4">
                                        {d.rating > 0 ? (
                                            <span className="flex items-center gap-1 text-slate-700">
                                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                                {d.rating}
                                            </span>
                                        ) : (
                                            <span className="text-slate-300">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[d.status]}`}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {d.status === "Pending" ? (
                                                <>
                                                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors">
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    </button>
                                                    <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                                                    <MoreVertical className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </>
    );
}