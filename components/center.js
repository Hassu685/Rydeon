"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { rideOptions } from "../lib/ride-options";

const headingVariant = {
    hidden: { opacity: 0, y: 25 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
    }),
};

const cardVariant = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
    }),
};

const Center = () => {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-20 px-6 md:px-16">
            {/* Background Blobs */}
            <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-blue-500/15 blur-[120px] animate-pulse"></div>

            <div
                className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-indigo-500/15 blur-[150px] animate-pulse"
                style={{ animationDelay: "1s" }}
            ></div>

            {/* Heading */}
            <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.4 }}
                className="relative z-10 text-center mb-14"
            >
                <motion.span
                    variants={headingVariant}
                    custom={0}
                    className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-xs font-bold uppercase tracking-[4px] text-blue-700"
                >
                    Ride Categories
                </motion.span>

                <motion.h2
                    variants={headingVariant}
                    custom={1}
                    className="mt-5 text-3xl font-extrabold text-slate-900 md:text-5xl"
                >
                    Choose Your{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Perfect Ride
                    </span>
                </motion.h2>

                <motion.div
                    variants={headingVariant}
                    custom={2}
                    className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
                />

                <motion.p
                    variants={headingVariant}
                    custom={3}
                    className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-slate-500 md:text-base"
                >
                    From bikes to premium cars, choose the perfect ride for every journey.
                    Experience safe, reliable and affordable transportation anytime,
                    anywhere.
                </motion.p>
            </motion.div>

            {/* Cards */}
            <div className="relative z-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {rideOptions.map((item, index) => (
                    <motion.div
                        key={item.slug}
                        custom={index}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={cardVariant}
                        whileHover={{ y: -14 }}
                        transition={{ type: "spring", stiffness: 220, damping: 20 }}
                        className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition-colors duration-500 hover:border-blue-300 hover:shadow-[0_25px_60px_rgba(37,99,235,.20)]"
                    >
                        {/* Top Border */}
                        <div className="absolute left-0 top-0 h-1 w-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 group-hover:w-full"></div>

                        {/* Hover Glow */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-100/20 via-transparent to-white opacity-0 transition duration-500 group-hover:opacity-100"></div>

                        {/* Image */}
                        <div className="relative h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50">
                            <motion.div
                                whileHover={{ scale: 1.08 }}
                                transition={{ duration: 0.4 }}
                                className="relative h-full w-full"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-contain p-5"
                                />
                            </motion.div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 mt-6 text-center">
                            <h3 className="text-2xl font-bold text-slate-900 transition duration-300 group-hover:text-blue-600">
                                {item.title}
                            </h3>

                            <p className="mt-3 text-sm leading-7 text-slate-500">
                                {item.tagline}
                            </p>
                        </div>

                        {/* Button */}
                        <div className="relative z-10 mt-8 flex justify-center">
                            <Link href={`/book-ride?type=${item.slug}`}>
                                <motion.span
                                    whileHover={{ scale: 1.06 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-7 py-3 text-sm font-semibold text-white shadow-lg transition-colors duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-400/40"
                                >
                                    Book Ride
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                                        →
                                    </span>
                                </motion.span>
                            </Link>
                        </div>

                        {/* Bottom Glow */}
                        <div className="absolute -bottom-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full bg-blue-400/10 blur-3xl transition-all duration-500 group-hover:bg-blue-500/25"></div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Center;