"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquareOff } from "lucide-react";
import { apiFetch } from "@/lib/api";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

function Stars({ count }) {
    const rounded = Math.round(count);
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < rounded ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
                        }`}
                />
            ))}
        </div>
    );
}

export default function RatingsPage() {
    const [rating, setRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const data = await apiFetch("/api/driver/profile");
                if (!cancelled) setRating(data.driver.rating);
            } catch (err) {
                if (!cancelled) setError(err.message);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <>
            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Overall rating */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    custom={0}
                    className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm text-center flex flex-col items-center justify-center"
                >
                    {loading ? (
                        <div className="h-32 w-full animate-pulse bg-slate-100 rounded-xl" />
                    ) : (
                        <>
                            <p className="text-5xl font-extrabold text-slate-900">
                                {rating?.toFixed(2) ?? "—"}
                            </p>
                            <div className="mt-2">
                                <Stars count={rating || 0} />
                            </div>
                            <p className="mt-2 text-sm text-slate-500">Your overall driver rating</p>
                        </>
                    )}
                </motion.div>

                {/* Breakdown — no per-trip rating data exists yet */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    custom={1}
                    className="lg:col-span-2 rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm"
                >
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5">Rating Breakdown</h3>
                    <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                        <MessageSquareOff className="h-8 w-8 mb-3" />
                        <p className="text-sm max-w-xs">
                            Individual trip ratings aren't tracked in the backend yet — only your
                            overall rating is stored. A star breakdown needs a per-trip rating
                            field to be added.
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Reviews — no review/comment data exists yet */}
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

                <div className="flex flex-col items-center justify-center py-14 text-center text-slate-400">
                    <MessageSquareOff className="h-8 w-8 mb-3" />
                    <p className="text-sm max-w-sm">
                        Rider comments aren't collected yet — the Trip model has no review/comment
                        field. Nothing to show here until that's added on the backend.
                    </p>
                </div>
            </motion.div>
        </>
    );
}