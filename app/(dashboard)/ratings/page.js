"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

const breakdown = [
    { stars: 5, percent: 82 },
    { stars: 4, percent: 12 },
    { stars: 3, percent: 4 },
    { stars: 2, percent: 1 },
    { stars: 1, percent: 1 },
];

const reviews = [
    { name: "Ayesha Khan", rating: 5, comment: "Very polite driver, smooth ride and reached on time.", date: "2 days ago" },
    { name: "Bilal Ahmed", rating: 5, comment: "Clean car and safe driving. Highly recommended!", date: "3 days ago" },
    { name: "Sara Malik", rating: 4, comment: "Good ride overall, slightly late pickup though.", date: "5 days ago" },
    { name: "Usman Tariq", rating: 5, comment: "Excellent service, will book again.", date: "1 week ago" },
];

function Stars({ count }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < count ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                        }`}
                />
            ))}
        </div>
    );
}

export default function RatingsPage() {
    return (
        <>
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Overall rating */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    custom={0}
                    className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm text-center flex flex-col items-center justify-center"
                >
                    <p className="text-5xl font-extrabold text-slate-900">4.92</p>
                    <div className="mt-2">
                        <Stars count={5} />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Based on 342 ratings</p>
                    <span className="mt-4 inline-flex items-center rounded-full bg-blue-50 text-blue-600 px-3 py-1.5 text-xs font-semibold">
                        Top 5% of drivers
                    </span>
                </motion.div>

                {/* Breakdown */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    custom={1}
                    className="lg:col-span-2 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm"
                >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5">Rating Breakdown</h3>
                    <div className="space-y-3">
                        {breakdown.map((b) => (
                            <div key={b.stars} className="flex items-center gap-3">
                                <span className="text-sm text-slate-600 w-10">{b.stars} ★</span>
                                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${b.percent}%` }}
                                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                                    />
                                </div>
                                <span className="text-sm text-slate-500 w-10 text-right">{b.percent}%</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Reviews */}
            <motion.div
                initial="hidden"
                animate="show"
                variants={fadeUp}
                custom={2}
                className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
            >
                <div className="px-5 sm:px-7 py-5 border-b border-slate-100">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Recent Reviews</h3>
                </div>

                <div className="divide-y divide-slate-100">
                    {reviews.map((r, i) => (
                        <div key={i} className="px-5 sm:px-7 py-5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white text-xs font-bold">
                                        {r.name.split(" ").map((n) => n[0]).join("")}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{r.name}</p>
                                        <Stars count={r.rating} />
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400">{r.date}</span>
                            </div>
                            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{r.comment}</p>
                        </div>
                    ))}
                </div>
            </motion.div>
        </>
    );
}