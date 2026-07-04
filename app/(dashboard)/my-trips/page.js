"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Search, Filter } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

const allTrips = [
    { id: "TRP-8823", rider: "Ayesha Khan", pickup: "Gulberg III", drop: "DHA Phase 5", fare: "₹340", status: "Completed", date: "Today, 10:24 AM", distance: "6.2 km" },
    { id: "TRP-8822", rider: "Bilal Ahmed", pickup: "Model Town", drop: "Johar Town", fare: "₹210", status: "Completed", date: "Today, 09:10 AM", distance: "3.8 km" },
    { id: "TRP-8821", rider: "Sara Malik", pickup: "Liberty Market", drop: "Wapda Town", fare: "₹280", status: "Cancelled", date: "Today, 08:45 AM", distance: "4.5 km" },
    { id: "TRP-8820", rider: "Usman Tariq", pickup: "Iqbal Town", drop: "Airport", fare: "₹520", status: "Completed", date: "Yesterday, 07:58 PM", distance: "12.1 km" },
    { id: "TRP-8819", rider: "Fatima Noor", pickup: "Township", drop: "Faisal Town", fare: "₹190", status: "Completed", date: "Yesterday, 04:20 PM", distance: "2.9 km" },
    { id: "TRP-8818", rider: "Ahmed Raza", pickup: "Bahria Town", drop: "Gulberg", fare: "₹410", status: "Ongoing", date: "Yesterday, 02:15 PM", distance: "8.7 km" },
];

const statusStyles = {
    Completed: "bg-green-50 text-green-600",
    Cancelled: "bg-red-50 text-red-600",
    Ongoing: "bg-blue-50 text-blue-600",
};

const filters = ["All", "Completed", "Ongoing", "Cancelled"];

export default function MyTripsPage() {
    const [activeFilter, setActiveFilter] = useState("All");

    const filteredTrips =
        activeFilter === "All"
            ? allTrips
            : allTrips.filter((t) => t.status === activeFilter);

    return (
        <>
            {/* Filters + search */}
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
                        placeholder="Search trip ID or rider"
                        className="w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                    />
                </div>
            </motion.div>

            {/* Trip cards */}
            <div className="grid gap-4">
                {filteredTrips.map((trip, i) => (
                    <motion.div
                        key={trip.id}
                        initial="hidden"
                        animate="show"
                        variants={fadeUp}
                        custom={i + 1}
                        className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                                    <MapPin className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-semibold text-slate-900">{trip.rider}</p>
                                        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[trip.status]}`}>
                                            {trip.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-1">
                                        {trip.pickup} → {trip.drop}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {trip.id} · {trip.distance} · {trip.date}
                                    </p>
                                </div>
                            </div>

                            <div className="text-left sm:text-right">
                                <p className="text-lg font-bold text-slate-900">{trip.fare}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {filteredTrips.length === 0 && (
                    <div className="text-center py-16 text-slate-400">
                        <Filter className="h-8 w-8 mx-auto mb-3" />
                        No trips found for this filter.
                    </div>
                )}
            </div>
        </>
    );
}