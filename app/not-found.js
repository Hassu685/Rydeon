"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ArrowLeft, MapPinOff, Search } from "lucide-react";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
    }),
};

export default function NotFound() {
    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-5 sm:px-6 py-24">

            {/* Background glow */}
            <div className="absolute -top-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-500/15 blur-[100px] sm:blur-[140px] animate-pulse" />
            <div
                className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-500/15 blur-[110px] sm:blur-[150px] animate-pulse"
                style={{ animationDelay: "1s" }}
            />

            <motion.div
                initial="hidden"
                animate="show"
                className="relative z-10 max-w-xl w-full text-center"
            >
                {/* Icon badge */}
                <motion.div
                    variants={fadeUp}
                    custom={0}
                    className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl bg-white border border-blue-100 shadow-lg shadow-blue-900/5"
                >
                    <MapPinOff className="h-9 w-9 sm:h-10 sm:w-10 text-blue-600" strokeWidth={1.6} />
                </motion.div>

                {/* 404 number */}
                <motion.h1
                    variants={fadeUp}
                    custom={1}
                    className="mt-8 text-7xl sm:text-8xl md:text-9xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                >
                    404
                </motion.h1>

                <motion.h2
                    variants={fadeUp}
                    custom={2}
                    className="mt-4 text-xl sm:text-2xl md:text-3xl font-bold text-slate-900"
                >
                    Looks like you've taken a wrong turn
                </motion.h2>

                <motion.p
                    variants={fadeUp}
                    custom={3}
                    className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-500 max-w-md mx-auto leading-relaxed"
                >
                    The page you're looking for doesn't exist or may have been moved.
                    Let's get you back on route.
                </motion.p>

                {/* Actions */}
                <motion.div
                    variants={fadeUp}
                    custom={4}
                    className="mt-9 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
                >
                    <Link href="/" className="w-full sm:w-auto">
                        <motion.span
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-7 py-3.5 text-sm sm:text-base font-semibold shadow-lg shadow-blue-900/20 hover:shadow-blue-500/40 transition-shadow duration-300"
                        >
                            <Home className="h-4 w-4" />
                            Back to Home
                        </motion.span>
                    </Link>

                    <Link href="/book-ride" className="w-full sm:w-auto">
                        <motion.span
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-full border border-slate-200 bg-white text-slate-700 px-7 py-3.5 text-sm sm:text-base font-semibold shadow-sm hover:border-blue-300 hover:text-blue-600 transition-colors duration-300"
                        >
                            <Search className="h-4 w-4" />
                            Book a Ride
                        </motion.span>
                    </Link>
                </motion.div>

                {/* Go back link */}
                <motion.div variants={fadeUp} custom={5} className="mt-6">
                    <Link
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (typeof window !== "undefined") window.history.back();
                        }}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors duration-300"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Go back to previous page
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}