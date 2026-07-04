"use client";

import { motion } from "framer-motion";
import { Search, MoreVertical } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

const riders = [
    { name: "Ayesha Khan", email: "ayesha.k@email.com", joined: "Jan 2025", totalRides: 84, status: "Active" },
    { name: "Bilal Ahmed", email: "bilal.a@email.com", joined: "Mar 2025", totalRides: 56, status: "Active" },
    { name: "Sara Malik", email: "sara.m@email.com", joined: "Nov 2024", totalRides: 122, status: "Active" },
    { name: "Usman Tariq", email: "usman.t@email.com", joined: "Feb 2025", totalRides: 31, status: "Blocked" },
    { name: "Fatima Noor", email: "fatima.n@email.com", joined: "Apr 2025", totalRides: 19, status: "Active" },
];

const statusStyles = {
    Active: "bg-green-50 text-green-600",
    Blocked: "bg-red-50 text-red-600",
};

export default function AdminRidersPage() {
    return (
        <>
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={0}
                className="relative w-full sm:w-80"
            >
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                    placeholder="Search rider name or email"
                    className="w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                />
            </motion.div>

            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={1}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead>
                            <tr className="text-left text-slate-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-medium">Rider</th>
                                <th className="px-4 py-4 font-medium">Joined</th>
                                <th className="px-4 py-4 font-medium">Total Rides</th>
                                <th className="px-4 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {riders.map((r) => (
                                <tr key={r.email} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold shrink-0">
                                                {r.name.split(" ").map((n) => n[0]).join("")}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-900 truncate">{r.name}</p>
                                                <p className="text-xs text-slate-400 truncate">{r.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-600">{r.joined}</td>
                                    <td className="px-4 py-4 text-slate-600">{r.totalRides}</td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[r.status]}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition-colors ml-auto">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
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