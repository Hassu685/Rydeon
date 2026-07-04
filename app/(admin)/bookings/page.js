"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

const bookings = [
    { id: "TRP-9021", rider: "Ayesha Khan", driver: "Hamza Khan", type: "Car Economy", fare: "₹340", status: "Completed", time: "10:24 AM" },
    { id: "TRP-9020", rider: "Bilal Ahmed", driver: "Tariq Mehmood", type: "Bike", fare: "₹210", status: "Ongoing", time: "10:10 AM" },
    { id: "TRP-9019", rider: "Sara Malik", driver: "Kashif Iqbal", type: "Rickshaw", fare: "₹280", status: "Cancelled", time: "09:45 AM" },
    { id: "TRP-9018", rider: "Usman Tariq", driver: "Fahad Ali", type: "Car Premium", fare: "₹520", status: "Completed", time: "09:20 AM" },
    { id: "TRP-9017", rider: "Fatima Noor", driver: "Hamza Khan", type: "Courier", fare: "₹150", status: "Completed", time: "08:55 AM" },
];

const statusStyles = {
    Completed: "bg-green-50 text-green-600",
    Cancelled: "bg-red-50 text-red-600",
    Ongoing: "bg-blue-50 text-blue-600",
};

const filters = ["All", "Completed", "Ongoing", "Cancelled"];

export default function AdminBookingsPage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered =
        activeFilter === "All" ? bookings : bookings.filter((b) => b.status === activeFilter);

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
                        placeholder="Search trip ID"
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
                                <th className="px-6 py-4 font-medium">Trip ID</th>
                                <th className="px-4 py-4 font-medium">Rider</th>
                                <th className="px-4 py-4 font-medium">Driver</th>
                                <th className="px-4 py-4 font-medium">Type</th>
                                <th className="px-4 py-4 font-medium">Fare</th>
                                <th className="px-4 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.map((b) => (
                                <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{b.id}</td>
                                    <td className="px-4 py-4 text-slate-600">{b.rider}</td>
                                    <td className="px-4 py-4 text-slate-600">{b.driver}</td>
                                    <td className="px-4 py-4 text-slate-500">{b.type}</td>
                                    <td className="px-4 py-4 font-semibold text-slate-900">{b.fare}</td>
                                    <td className="px-4 py-4">
                                        <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[b.status]}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-400">{b.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </>
    );
}