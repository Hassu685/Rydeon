"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin,
    Navigation,
    Calendar,
    Clock,
    User,
    Phone,
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { rideOptions } from "../lib/ride-options";

const fadeUp = {
    hidden: { opacity: 0, y: 22 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay: i * 0.08, ease: "easeOut" },
    }),
};

function BookRideContent() {
    const searchParams = useSearchParams();
    const typeParam = searchParams.get("type");

    const [selected, setSelected] = useState(rideOptions[0].slug);
    const [form, setForm] = useState({
        pickup: "",
        dropoff: "",
        date: "",
        time: "",
        name: "",
        phone: "",
    });
    const [submitted, setSubmitted] = useState(false);

    // Pre-select ride type coming from a card's "Book Ride" link (?type=bike)
    useEffect(() => {
        if (typeParam && rideOptions.some((r) => r.slug === typeParam)) {
            setSelected(typeParam);
        }
    }, [typeParam]);

    const activeRide = rideOptions.find((r) => r.slug === selected) ?? rideOptions[0];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    const resetBooking = () => {
        setSubmitted(false);
        setForm({ pickup: "", dropoff: "", date: "", time: "", name: "", phone: "" });
    };

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 py-16 sm:py-20 px-5 sm:px-6">
            {/* Background glow */}
            <div className="absolute -top-32 -left-32 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-blue-500/10 blur-[100px] sm:blur-[140px]" />
            <div className="absolute bottom-0 right-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-indigo-500/10 blur-[100px] sm:blur-[140px]" />

            <div className="relative max-w-6xl mx-auto">

                {/* Heading */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    className="text-center mt-20 mb-10 sm:mb-14"
                >
                    <motion.span
                        variants={fadeUp}
                        custom={0}
                        className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 sm:px-5 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-[3px] sm:tracking-[4px] text-blue-700"
                    >
                        Book A Ride
                    </motion.span>

                    <motion.h1
                        variants={fadeUp}
                        custom={1}
                        className="mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
                    >
                        Choose Your Ride,{" "}
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            We'll Handle the Rest
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-500 max-w-xl mx-auto"
                    >
                        Pick a ride type, add your trip details, and we'll get a driver to you in minutes.
                    </motion.p>
                </motion.div>

                <AnimatePresence mode="wait">
                    {submitted ? (
                        /* ---------- SUCCESS STATE ---------- */
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="max-w-xl mx-auto rounded-3xl border border-blue-100 bg-white p-8 sm:p-10 text-center shadow-xl shadow-blue-900/5"
                        >
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                                <CheckCircle2 className="h-9 w-9 text-green-600" />
                            </div>
                            <h2 className="mt-5 text-2xl font-bold text-slate-900">
                                Ride Requested!
                            </h2>
                            <p className="mt-2 text-slate-500 text-sm sm:text-base">
                                We're finding you a nearby <span className="font-semibold text-slate-700">{activeRide.title}</span> driver.
                                You'll get a confirmation shortly.
                            </p>

                            <div className="mt-6 rounded-2xl bg-[#f8fbff] border border-blue-50 p-5 text-left text-sm text-slate-600 space-y-2">
                                <p><span className="font-semibold text-slate-800">Pickup:</span> {form.pickup || "—"}</p>
                                <p><span className="font-semibold text-slate-800">Drop-off:</span> {form.dropoff || "—"}</p>
                                <p><span className="font-semibold text-slate-800">Date & Time:</span> {form.date || "—"} {form.time}</p>
                                <p><span className="font-semibold text-slate-800">Estimated Fare:</span> {activeRide.fareRange}</p>
                            </div>

                            <button
                                onClick={resetBooking}
                                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:scale-105 transition"
                            >
                                Book Another Ride
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </motion.div>
                    ) : (
                        /* ---------- BOOKING FORM ---------- */
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid lg:grid-cols-3 gap-8 sm:gap-10"
                        >
                            {/* LEFT — steps */}
                            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 sm:space-y-8">

                                {/* Step 1 — Ride type */}
                                <motion.div
                                    initial="hidden"
                                    animate="show"
                                    variants={fadeUp}
                                    custom={3}
                                    className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm"
                                >
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-5">
                                        1. Select Ride Type
                                    </h3>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                        {rideOptions.map((ride) => {
                                            const Icon = ride.icon;
                                            const isActive = ride.slug === selected;
                                            return (
                                                <button
                                                    type="button"
                                                    key={ride.slug}
                                                    onClick={() => setSelected(ride.slug)}
                                                    className={`group relative rounded-2xl border p-3 sm:p-4 text-left transition-all duration-300 ${
                                                        isActive
                                                            ? "border-blue-600 bg-blue-50/70 shadow-md shadow-blue-600/10"
                                                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30"
                                                    }`}
                                                >
                                                    {isActive && (
                                                        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
                                                            <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                                        </span>
                                                    )}

                                                    <div className="relative h-16 sm:h-20 w-full overflow-hidden rounded-xl bg-slate-100">
                                                        <Image
                                                            src={ride.image}
                                                            alt={ride.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>

                                                    <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5">
                                                        <Icon className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                                                        <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                                                            {ride.title}
                                                        </p>
                                                    </div>
                                                    <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500">
                                                        {ride.rate} · {ride.eta} away
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* Step 2 — Trip details */}
                                <motion.div
                                    initial="hidden"
                                    animate="show"
                                    variants={fadeUp}
                                    custom={4}
                                    className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm"
                                >
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-5">
                                        2. Trip Details
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                            <input
                                                name="pickup"
                                                value={form.pickup}
                                                onChange={handleChange}
                                                required
                                                placeholder="Pickup location"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                                            />
                                        </div>

                                        <div className="relative">
                                            <Navigation className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                            <input
                                                name="dropoff"
                                                value={form.dropoff}
                                                onChange={handleChange}
                                                required
                                                placeholder="Drop-off location"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                                            />
                                        </div>

                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <Calendar className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                                <input
                                                    type="date"
                                                    name="date"
                                                    value={form.date}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                                                />
                                            </div>
                                            <div className="relative">
                                                <Clock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                                <input
                                                    type="time"
                                                    name="time"
                                                    value={form.time}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Step 3 — Contact info */}
                                <motion.div
                                    initial="hidden"
                                    animate="show"
                                    variants={fadeUp}
                                    custom={5}
                                    className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm"
                                >
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-5">
                                        3. Your Details
                                    </h3>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <User className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                            <input
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                required
                                                placeholder="Full name"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                                            />
                                        </div>
                                        <div className="relative">
                                            <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="Mobile number"
                                                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm sm:text-base text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]"
                                            />
                                        </div>
                                    </div>
                                </motion.div>

                                <motion.button
                                    initial="hidden"
                                    animate="show"
                                    variants={fadeUp}
                                    custom={6}
                                    type="submit"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 text-base sm:text-lg font-semibold text-white shadow-lg shadow-blue-900/20 transition-shadow hover:shadow-blue-500/40"
                                >
                                    Confirm & Book {activeRide.title} →
                                </motion.button>
                            </form>

                            {/* RIGHT — sticky summary */}
                            <motion.div
                                initial="hidden"
                                animate="show"
                                variants={fadeUp}
                                custom={4}
                                className="lg:sticky lg:top-24 h-fit"
                            >
                                <div className="rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 sm:mb-5">
                                        Trip Summary
                                    </h3>

                                    <div className="relative h-32 sm:h-36 w-full overflow-hidden rounded-2xl bg-[#f8fbff]">
                                        <Image
                                            src={activeRide.image}
                                            alt={activeRide.title}
                                            fill
                                            className="object-contain p-4"
                                        />
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="font-semibold text-slate-900">{activeRide.title}</p>
                                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                                            {activeRide.eta} away
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                                        {activeRide.tagline}
                                    </p>

                                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
                                        <div className="flex justify-between text-slate-500">
                                            <span>Rate</span>
                                            <span className="font-medium text-slate-800">{activeRide.rate}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span>Estimated Fare</span>
                                            <span className="font-medium text-slate-800">{activeRide.fareRange}</span>
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span>Pickup</span>
                                            <span className="font-medium text-slate-800 truncate max-w-[140px]">
                                                {form.pickup || "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-slate-500">
                                            <span>Drop-off</span>
                                            <span className="font-medium text-slate-800 truncate max-w-[140px]">
                                                {form.dropoff || "—"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
                                    <p className="font-semibold">Need help booking?</p>
                                    <p className="mt-1 text-sm text-blue-100">
                                        Our support team is available 24/7.
                                    </p>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

export default function BookRidePage() {
    return (
        <Suspense fallback={null}>
            <BookRideContent />
        </Suspense>
    );
}